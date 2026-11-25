import { test } from "node:test"
import assert from "node:assert/strict"
import { addToCart, setQuantity } from "./cart.ts"
import type { ProductView } from "@/features/catalog/action/queries.ts"

const product = (id: number, stock: number): ProductView => ({
  id,
  name: `P${id}`,
  slug: `p-${id}`,
  price: 10_000,
  stock,
  imageUrl: null,
  categorySlug: "coffee",
  categoryName: "Coffee",
})

test("add inserts one unit of a new product", () => {
  const r = addToCart([], product(1, 10))
  assert.equal(r.length, 1)
  assert.equal(r[0].quantity, 1)
})

test("same product increments instead of duplicating", () => {
  let r = addToCart([], product(1, 10))
  r = addToCart(r, product(1, 10))
  assert.equal(r.length, 1)
  assert.equal(r[0].quantity, 2)
})

test("add never exceeds stock", () => {
  let r = addToCart([], product(1, 2))
  r = addToCart(addToCart(r, product(1, 2)), product(1, 2))
  assert.equal(r[0].quantity, 2)
})

test("out-of-stock product cannot be added", () => {
  assert.deepEqual(addToCart([], product(1, 0)), [])
})

test("setQuantity clamps to stock", () => {
  const r = setQuantity(addToCart([], product(1, 3)), 1, 9)
  assert.equal(r[0].quantity, 3)
})

test("setQuantity to zero removes the line", () => {
  assert.deepEqual(setQuantity(addToCart([], product(1, 3)), 1, 0), [])
})

test("setQuantity ignores other lines", () => {
  let r = addToCart(addToCart([], product(1, 5)), product(2, 5))
  r = setQuantity(r, 1, 3)
  assert.equal(r[0].quantity, 3)
  assert.equal(r[1].quantity, 1)
})
