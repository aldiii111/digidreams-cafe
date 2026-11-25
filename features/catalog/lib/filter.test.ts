import { test } from "node:test"
import assert from "node:assert/strict"
import { filterProducts, ALL } from "./filter.ts"
import type { ProductView } from "@/features/catalog/action/queries.ts"

const p = (name: string, categorySlug: string): ProductView => ({
  id: 0,
  name,
  slug: name.toLowerCase().replaceAll(" ", "-"),
  price: 1000,
  stock: 1,
  description: null,
  imageUrl: null,
  categorySlug,
  categoryName: categorySlug,
})

const items = [p("Butterscotch Legit", "coffee"), p("Nasi Ayam Katsu", "food"), p("Red Velvet", "non-coffee")]

test("all + empty query returns everything", () => {
  assert.equal(filterProducts(items, ALL, "").length, 3)
})

test("search is case-insensitive and partial", () => {
  assert.deepEqual(
    filterProducts(items, ALL, "KATSU").map((x) => x.name),
    ["Nasi Ayam Katsu"],
  )
})

test("search ignores surrounding whitespace", () => {
  assert.equal(filterProducts(items, ALL, "  red  ").length, 1)
})

test("category tab filters by slug", () => {
  assert.deepEqual(
    filterProducts(items, "coffee", "").map((x) => x.name),
    ["Butterscotch Legit"],
  )
})

test("search and category combine", () => {
  assert.equal(filterProducts(items, "food", "butter").length, 0)
})

test("no match returns empty list", () => {
  assert.deepEqual(filterProducts(items, ALL, "zzz"), [])
})
