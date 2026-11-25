import { test } from "node:test"
import assert from "node:assert/strict"
import { revalidatePromo, type ActivePromo } from "./promo-revalidate.ts"

const promo: ActivePromo = {
  code: "DIGIZEN10",
  data: {
    type: "PERCENT",
    value: 10,
    minOrder: 50_000,
    isActive: true,
    startsAt: new Date("2020-01-01"),
    endsAt: new Date("2099-01-01"),
  },
}

test("no promo stays none", () => {
  assert.equal(revalidatePromo(null, 100_000), null)
})

test("promo is kept while the cart still meets its minimum", () => {
  assert.deepEqual(revalidatePromo(promo, 60_000), promo)
})

test("promo drops when the cart falls below the minimum", () => {
  assert.equal(revalidatePromo(promo, 40_000), null)
})

test("promo drops when it has been deactivated", () => {
  const off = { ...promo, data: { ...promo.data, isActive: false } }
  assert.equal(revalidatePromo(off, 100_000), null)
})
