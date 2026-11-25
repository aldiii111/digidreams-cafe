import type { PromoLike } from "./money"

export type PromoCheck =
  | { ok: true; promo: PromoLike }
  | { ok: false; reason: "UNKNOWN" | "INACTIVE" | "NOT_STARTED" | "EXPIRED" | "MIN_ORDER" }

export const PROMO_MESSAGE: Record<Exclude<PromoCheck, { ok: true }>["reason"], string> = {
  UNKNOWN: "Kode promo tidak ditemukan.",
  INACTIVE: "Kode promo sudah tidak aktif.",
  NOT_STARTED: "Kode promo belum berlaku.",
  EXPIRED: "Kode promo sudah kedaluwarsa.",
  MIN_ORDER: "Belum mencapai minimum belanja untuk promo ini.",
}

/**
 * Judges a promo against the current cart. Deliberately narrow reasons so the
 * cashier can tell the customer exactly why it failed. `now` is required here
 * because this runs in a Server Action, where a real clock is available.
 */
export function checkPromo(
  promo: PromoLike | null,
  subtotal: number,
  now: Date,
): PromoCheck {
  if (!promo) return { ok: false, reason: "UNKNOWN" }
  if (!promo.isActive) return { ok: false, reason: "INACTIVE" }
  if (promo.startsAt && now < promo.startsAt) return { ok: false, reason: "NOT_STARTED" }
  if (promo.endsAt && now > promo.endsAt) return { ok: false, reason: "EXPIRED" }
  if (subtotal < promo.minOrder) return { ok: false, reason: "MIN_ORDER" }
  return { ok: true, promo }
}
