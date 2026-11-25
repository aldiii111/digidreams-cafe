import { connection } from "next/server"
import { prisma } from "@/lib/db"

export type ReceiptView = {
  invoiceNumber: string
  createdAt: Date
  paymentMethod: string
  subtotal: number
  discount: number
  tax: number
  total: number
  items: { name: string; quantity: number; unitPrice: number; subtotal: number }[]
}

export async function getReceipt(invoiceNumber: string): Promise<ReceiptView | null> {
  // better-sqlite3 is synchronous, so queries would run during prerendering
  // unless we stop prerendering here. Receipts are per-sale data.
  await connection()
  const order = await prisma.order.findUnique({
    where: { invoiceNumber },
    select: {
      invoiceNumber: true,
      createdAt: true,
      paymentMethod: true,
      subtotal: true,
      discount: true,
      tax: true,
      total: true,
      items: {
        select: {
          quantity: true,
          unitPrice: true,
          subtotal: true,
          product: { select: { name: true } },
        },
      },
    },
  })
  if (!order) return null

  return {
    ...order,
    items: order.items.map((i) => ({
      name: i.product.name,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      subtotal: i.subtotal,
    })),
  }
}
