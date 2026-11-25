"use server"

import { prisma } from "@/lib/db"
import { checkPromo, PROMO_MESSAGE } from "@/lib/promo"
import type { PromoLike } from "@/lib/money"

export type PromoResult =
  | { ok: true; code: string; promo: PromoLike; message: string }
  | { ok: false; message: string }

export async function applyPromo(code: string, subtotal: number): Promise<PromoResult> {
  const trimmed = code.trim().toUpperCase()
  if (!trimmed) return { ok: false, message: "Masukkan kode promo." }

  const promo = await prisma.promo.findUnique({
    where: { code: trimmed },
    select: { type: true, value: true, minOrder: true, isActive: true, startsAt: true, endsAt: true },
  })

  const check = checkPromo(promo, subtotal, new Date())
  if (!check.ok) return { ok: false, message: PROMO_MESSAGE[check.reason] }

  const label =
    check.promo.type === "PERCENT"
      ? `Diskon ${check.promo.value}% diterapkan.`
      : `Potongan Rp${check.promo.value.toLocaleString("id-ID")} diterapkan.`
  return { ok: true, code: trimmed, promo: check.promo, message: label }
}
