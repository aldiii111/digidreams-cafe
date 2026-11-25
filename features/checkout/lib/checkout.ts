import type { PrismaClient } from "@/lib/generated/prisma/client"
import { computeTotals, type PromoLike, type Totals } from "@/lib/money"
import { checkPromo, PROMO_MESSAGE } from "@/lib/promo"

export type PaymentMethod = "CASH" | "QRIS"

export const PAYMENT_METHODS: PaymentMethod[] = ["CASH", "QRIS"]

export type CheckoutInput = {
  items: { productId: number; quantity: number }[]
  promoCode: string | null
  paymentMethod: PaymentMethod
}

export type CheckoutResult =
  | { ok: true; order: { id: number; invoiceNumber: string; totals: Totals; paymentMethod: PaymentMethod } }
  | { ok: false; error: "EMPTY_CART" | "UNKNOWN_PRODUCT" | "INSUFFICIENT_STOCK" | "PROMO_REJECTED"; message: string; productId?: number }

export function formatInvoice(year: number, sequence: number): string {
  return `INV-${year}-${String(sequence).padStart(3, "0")}`
}

/**
 * The single trusted write path. Prices, stock and the promo are re-read from
 * the database inside one transaction, so a client can only choose *what* to
 * buy — never the price it pays or the stock it consumes.
 */
export async function checkout(
  db: PrismaClient,
  input: CheckoutInput,
  now: Date,
): Promise<CheckoutResult> {
  if (input.items.length === 0) {
    return { ok: false, error: "EMPTY_CART", message: "Keranjang masih kosong." }
  }
  if (!PAYMENT_METHODS.includes(input.paymentMethod)) {
    return { ok: false, error: "EMPTY_CART", message: "Metode pembayaran tidak valid." }
  }
  const merged = new Map<number, number>()
  for (const item of input.items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      return { ok: false, error: "INSUFFICIENT_STOCK", message: "Jumlah item tidak valid.", productId: item.productId }
    }
    merged.set(item.productId, (merged.get(item.productId) ?? 0) + item.quantity)
  }

  const products = await db.product.findMany({
    where: { id: { in: [...merged.keys()] } },
    select: { id: true, name: true, price: true, stock: true },
  })
  if (products.length !== merged.size) {
    return { ok: false, error: "UNKNOWN_PRODUCT", message: "Ada menu yang tidak ditemukan." }
  }
  const byId = new Map(products.map((p) => [p.id, p]))

  for (const [productId, quantity] of merged) {
    const product = byId.get(productId)!
    if (product.stock < quantity) {
      return {
        ok: false,
        error: "INSUFFICIENT_STOCK",
        message: `Stok ${product.name} tinggal ${product.stock}.`,
        productId,
      }
    }
  }

  const lines = [...merged].map(([productId, quantity]) => ({
    productId,
    quantity,
    price: byId.get(productId)!.price,
  }))
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0)

  let promo: PromoLike | null = null
  if (input.promoCode) {
    const row = await db.promo.findUnique({
      where: { code: input.promoCode.trim().toUpperCase() },
      select: { type: true, value: true, minOrder: true, isActive: true, startsAt: true, endsAt: true },
    })
    const check = checkPromo(row, subtotal, now)
    if (!check.ok) {
      return { ok: false, error: "PROMO_REJECTED", message: PROMO_MESSAGE[check.reason] }
    }
    promo = check.promo
  }

  const totals = computeTotals(
    lines.map((l) => ({ price: l.price, quantity: l.quantity })),
    promo,
    now,
  )
  const year = now.getFullYear()

  return db.$transaction(async (tx) => {
    // Re-check stock inside the transaction so a concurrent sale cannot slip in
    // between the read above and the decrement below.
    for (const line of lines) {
      const { stock, name } = byId.get(line.productId)!
      const updated = await tx.product.updateMany({
        where: { id: line.productId, stock: { gte: line.quantity } },
        data: { stock: { decrement: line.quantity } },
      })
      if (updated.count === 0) {
        throw new InsufficientStockError(line.productId, name, stock)
      }
    }

    const order = await tx.order.create({
      data: {
        invoiceNumber: "",
        subtotal: totals.subtotal,
        discount: totals.discount,
        tax: totals.tax,
        total: totals.total,
        paymentMethod: input.paymentMethod,
        status: "PAID",
        createdAt: now,
        items: {
          create: lines.map((l) => ({
            productId: l.productId,
            quantity: l.quantity,
            unitPrice: l.price,
            subtotal: l.price * l.quantity,
          })),
        },
      },
      select: { id: true },
    })

    const invoiceNumber = formatInvoice(year, order.id)
    await tx.order.update({ where: { id: order.id }, data: { invoiceNumber } })

    return {
      ok: true as const,
      order: { id: order.id, invoiceNumber, totals, paymentMethod: input.paymentMethod },
    }
  }).catch((err) => {
    if (err instanceof InsufficientStockError) {
      return {
        ok: false as const,
        error: "INSUFFICIENT_STOCK" as const,
        message: `Stok ${err.productName} tidak mencukupi.`,
        productId: err.productId,
      }
    }
    throw err
  })
}

class InsufficientStockError extends Error {
  constructor(
    readonly productId: number,
    readonly productName: string,
    readonly stock: number,
  ) {
    super(`insufficient stock for product ${productId}`)
  }
}
