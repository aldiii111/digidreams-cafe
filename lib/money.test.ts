import { test } from "node:test"
import assert from "node:assert/strict"
import { computeTotals, type CartLine, type PromoLike } from "./money.ts"

const perc = (value: number, minOrder = 0): PromoLike => ({
  type: "PERCENT",
  value,
  minOrder,
  isActive: true,
  startsAt: null,
  endsAt: null,
})

test("empty cart yields zero everywhere", () => {
  assert.deepEqual(computeTotals([], null), { subtotal: 0, discount: 0, tax: 0, total: 0 })
})

test("plain cart with no promo: tax is 10% of subtotal", () => {
  const lines: CartLine[] = [{ price: 20_000, quantity: 2 }]
  assert.deepEqual(computeTotals(lines, null), {
    subtotal: 40_000,
    discount: 0,
    tax: 4_000,
    total: 44_000,
  })
})

test("percent promo applies to the subtotal", () => {
  const lines: CartLine[] = [
    { price: 20_000, quantity: 2 },
    { price: 25_000, quantity: 1 },
  ]
  const t = computeTotals(lines, perc(10, 50_000))
  assert.equal(t.subtotal, 65_000)
  assert.equal(t.discount, 6_500)
  assert.equal(t.tax, 5_850) // 10% of 58_500
  assert.equal(t.total, 64_350)
})

test("fixed promo applies as a flat amount", () => {
  const lines: CartLine[] = [{ price: 30_000, quantity: 1 }]
  const promo: PromoLike = { ...perc(0), type: "FIXED", value: 10_000 }
  const t = computeTotals(lines, promo)
  assert.equal(t.discount, 10_000)
  assert.equal(t.tax, 2_000) // 10% of 20_000
  assert.equal(t.total, 22_000)
})

test("fixed promo larger than subtotal is clamped so total never goes negative", () => {
  const lines: CartLine[] = [{ price: 15_000, quantity: 1 }]
  const promo: PromoLike = { ...perc(0), type: "FIXED", value: 50_000 }
  assert.deepEqual(computeTotals(lines, promo), {
    subtotal: 15_000,
    discount: 15_000,
    tax: 0,
    total: 0,
  })
})

test("promo is ignored when subtotal is below minOrder", () => {
  const lines: CartLine[] = [{ price: 20_000, quantity: 1 }]
  const t = computeTotals(lines, perc(10, 50_000))
  assert.equal(t.discount, 0)
  assert.equal(t.total, 22_000)
})

test("promo is ignored when inactive", () => {
  const lines: CartLine[] = [{ price: 60_000, quantity: 1 }]
  const t = computeTotals(lines, { ...perc(10, 50_000), isActive: false })
  assert.equal(t.discount, 0)
})

test("promo is ignored outside its date window", () => {
  const lines: CartLine[] = [{ price: 60_000, quantity: 1 }]
  const future = new Date("2999-01-01")
  const past = new Date("2000-01-01")
  assert.equal(computeTotals(lines, { ...perc(10), startsAt: future }).discount, 0)
  assert.equal(computeTotals(lines, { ...perc(10), endsAt: past }).discount, 0)
})

test("promo inside its date window applies", () => {
  const lines: CartLine[] = [{ price: 60_000, quantity: 1 }]
  const t = computeTotals(lines, {
    ...perc(10),
    startsAt: new Date("2000-01-01"),
    endsAt: new Date("2999-01-01"),
  })
  assert.equal(t.discount, 6_000)
})

test("tax rounds half up on the discounted amount", () => {
  // 10% of 35_005 = 3_500.5 -> rounds to 3_501
  const lines: CartLine[] = [{ price: 35_005, quantity: 1 }]
  assert.equal(computeTotals(lines, null).tax, 3_501)
})
