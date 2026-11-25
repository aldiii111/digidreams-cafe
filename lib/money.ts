export type CartLine = { price: number; quantity: number }

export type PromoLike = {
  type: string // "PERCENT" | "FIXED"
  value: number
  minOrder: number
  isActive: boolean
  startsAt: Date | null
  endsAt: Date | null
}

export type Totals = { subtotal: number; discount: number; tax: number; total: number }

const TAX_RATE = 0.1

function isPromoEligible(promo: PromoLike, subtotal: number, now: Date | undefined): boolean {
  if (!promo.isActive) return false
  if (subtotal < promo.minOrder) return false
  if (promo.startsAt && (!now || now < promo.startsAt)) return false
  if (promo.endsAt && (!now || now > promo.endsAt)) return false
  return true
}

/** Pure money computation: Subtotal → Discount (clamped) → PPN 10% → Total. All amounts are whole rupiah. */
export function computeTotals(lines: CartLine[], promo: PromoLike | null, now?: Date): Totals {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0)

  let discount = 0
  if (promo && isPromoEligible(promo, subtotal, now)) {
    discount = promo.type === "PERCENT" ? Math.round((subtotal * promo.value) / 100) : promo.value
  }
  discount = Math.min(Math.max(discount, 0), subtotal)

  const tax = Math.round((subtotal - discount) * TAX_RATE)
  return { subtotal, discount, tax, total: subtotal - discount + tax }
}
