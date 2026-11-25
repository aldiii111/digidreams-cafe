import type { PromoLike } from "./money"

export type ActivePromo = { code: string; data: PromoLike }

/**
 * Drops a promo when the cart no longer qualifies for it.
 *
 * Only the checks the client can honestly make: the promo must still be active
 * and the cart must still meet its minimum order. Date windows and stock are
 * re-checked server-side at apply time and again at checkout, so the summary can
 * never overstate a saving the server would reject.
 */
export function revalidatePromo(promo: ActivePromo | null, subtotal: number): ActivePromo | null {
  if (!promo) return null
  if (!promo.data.isActive) return null
  if (subtotal < promo.data.minOrder) return null
  return promo
}
