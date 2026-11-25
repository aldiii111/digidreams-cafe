"use server"

import { prisma } from "@/lib/db"
import { checkout, type CheckoutInput, type CheckoutResult, type PaymentMethod } from "@/features/checkout/lib/checkout"

export type CheckoutActionState =
  | { ok: true; invoiceNumber: string; orderId: number }
  | { ok: false; message: string }

export async function submitOrder(input: {
  items: { productId: number; quantity: number }[]
  promoCode: string | null
  paymentMethod: PaymentMethod
}): Promise<CheckoutActionState> {
  const safe: CheckoutInput = {
    items: Array.isArray(input.items) ? input.items : [],
    promoCode: typeof input.promoCode === "string" ? input.promoCode : null,
    paymentMethod: input.paymentMethod,
  }

  const result: CheckoutResult = await checkout(prisma, safe, new Date())
  if (!result.ok) return { ok: false, message: result.message }

  return {
    ok: true,
    invoiceNumber: result.order.invoiceNumber,
    orderId: result.order.id,
  }
}
