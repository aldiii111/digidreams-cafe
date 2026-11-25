import { test } from "node:test"
import assert from "node:assert/strict"
import { checkPromo } from "./promo.ts"
import type { PromoLike } from "./money.ts"

const base: PromoLike = {
  type: "PERCENT",
  value: 10,
  minOrder: 50_000,
  isActive: true,
  startsAt: null,
  endsAt: null,
}
const now = new Date("2026-06-01")

test("unknown code is rejected", () => {
  assert.deepEqual(checkPromo(null, 100_000, now), { ok: false, reason: "UNKNOWN" })
})

test("eligible promo passes", () => {
  assert.equal(checkPromo(base, 60_000, now).ok, true)
})

test("inactive promo is rejected before anything else", () => {
  assert.deepEqual(checkPromo({ ...base, isActive: false }, 60_000, now), {
    ok: false,
    reason: "INACTIVE",
  })
})

test("not-yet-started promo is distinguished from expired", () => {
  assert.deepEqual(checkPromo({ ...base, startsAt: new Date("2026-07-01") }, 60_000, now), {
    ok: false,
    reason: "NOT_STARTED",
  })
  assert.deepEqual(checkPromo({ ...base, endsAt: new Date("2026-05-01") }, 60_000, now), {
    ok: false,
    reason: "EXPIRED",
  })
})

test("below minimum order is its own reason", () => {
  assert.deepEqual(checkPromo(base, 49_999, now), { ok: false, reason: "MIN_ORDER" })
})

test("exactly at minimum order passes", () => {
  assert.equal(checkPromo(base, 50_000, now).ok, true)
})

test("in-window promo passes", () => {
  const p = { ...base, startsAt: new Date("2026-01-01"), endsAt: new Date("2026-12-31") }
  assert.equal(checkPromo(p, 60_000, now).ok, true)
})
