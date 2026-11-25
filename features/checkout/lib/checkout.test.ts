import { test, before, beforeEach, after } from "node:test"
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { PrismaClient } from "@/lib/generated/prisma/client.ts"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { checkout, formatInvoice, type CheckoutInput } from "./checkout.ts"

let dir: string
let db: PrismaClient
const now = new Date("2026-06-01T10:00:00Z")

before(() => {
  dir = mkdtempSync(join(tmpdir(), "pos-checkout-"))
  const url = `file:${join(dir, "test.db")}`
  execFileSync("node_modules/.bin/prisma", ["migrate", "deploy"], {
    env: { ...process.env, DATABASE_URL: url },
    stdio: "pipe",
  })
  db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) })
})

after(async () => {
  await db.$disconnect()
  rmSync(dir, { recursive: true, force: true })
})

beforeEach(async () => {
  await db.orderItem.deleteMany()
  await db.order.deleteMany()
  await db.product.deleteMany()
  await db.category.deleteMany()
  await db.promo.deleteMany()

  const cat = await db.category.create({ data: { name: "Coffee", slug: "coffee" } })
  await db.product.createMany({
    data: [
      { name: "Latte", slug: "latte", categoryId: cat.id, price: 20_000, stock: 5 },
      { name: "Katsu", slug: "katsu", categoryId: cat.id, price: 25_000, stock: 2 },
      { name: "Habis", slug: "habis", categoryId: cat.id, price: 10_000, stock: 0 },
    ],
  })
  await db.promo.create({
    data: { code: "DIGIZEN10", type: "PERCENT", value: 10, minOrder: 50_000, isActive: true },
  })
})

const productId = async (slug: string) =>
  (await db.product.findUniqueOrThrow({ where: { slug } })).id

const input = (items: { productId: number; quantity: number }[], promoCode: string | null = null): CheckoutInput => ({
  items,
  promoCode,
  paymentMethod: "CASH",
})

test("empty cart is rejected", async () => {
  const r = await checkout(db, input([]), now)
  assert.equal(r.ok, false)
  assert.equal(!r.ok && r.error, "EMPTY_CART")
})

test("unknown product is rejected", async () => {
  const r = await checkout(db, input([{ productId: 999_999, quantity: 1 }]), now)
  assert.equal(!r.ok && r.error, "UNKNOWN_PRODUCT")
})

test("insufficient stock is rejected and nothing is written", async () => {
  const id = await productId("katsu")
  const r = await checkout(db, input([{ productId: id, quantity: 3 }]), now)
  assert.equal(!r.ok && r.error, "INSUFFICIENT_STOCK")
  assert.equal(await db.order.count(), 0)
  assert.equal((await db.product.findUniqueOrThrow({ where: { id } })).stock, 2)
})

test("out-of-stock product is rejected", async () => {
  const id = await productId("habis")
  const r = await checkout(db, input([{ productId: id, quantity: 1 }]), now)
  assert.equal(!r.ok && r.error, "INSUFFICIENT_STOCK")
})

test("successful checkout persists order, items and totals", async () => {
  const latte = await productId("latte")
  const katsu = await productId("katsu")
  const r = await checkout(db, input([
    { productId: latte, quantity: 2 },
    { productId: katsu, quantity: 1 },
  ]), now)

  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.deepEqual(r.order.totals, { subtotal: 65_000, discount: 0, tax: 6_500, total: 71_500 })

  const saved = await db.order.findUniqueOrThrow({
    where: { id: r.order.id },
    include: { items: true },
  })
  assert.equal(saved.items.length, 2)
  assert.equal(saved.status, "PAID")
  assert.equal(saved.paymentMethod, "CASH")
  assert.equal(saved.invoiceNumber, r.order.invoiceNumber)
})

test("stock is decremented by the purchased quantity", async () => {
  const latte = await productId("latte")
  await checkout(db, input([{ productId: latte, quantity: 3 }]), now)
  assert.equal((await db.product.findUniqueOrThrow({ where: { id: latte } })).stock, 2)
})

test("unit price is snapshotted on the order item", async () => {
  const latte = await productId("latte")
  const r = await checkout(db, input([{ productId: latte, quantity: 1 }]), now)
  if (!r.ok) return assert.fail("expected ok")

  await db.product.update({ where: { id: latte }, data: { price: 99_000 } })

  const item = await db.orderItem.findFirstOrThrow({ where: { orderId: r.order.id } })
  assert.equal(item.unitPrice, 20_000)
  assert.equal(item.subtotal, 20_000)
})

test("applies a valid promo against its minimum order", async () => {
  const latte = await productId("latte")
  const katsu = await productId("katsu")
  const r = await checkout(db, input([
    { productId: latte, quantity: 2 },
    { productId: katsu, quantity: 1 },
  ], "DIGIZEN10"), now)

  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.deepEqual(r.order.totals, { subtotal: 65_000, discount: 6_500, tax: 5_850, total: 64_350 })
})

test("promo below its minimum order is rejected", async () => {
  const latte = await productId("latte")
  const r = await checkout(db, input([{ productId: latte, quantity: 1 }], "DIGIZEN10"), now)
  assert.equal(!r.ok && r.error, "PROMO_REJECTED")
})

test("unknown promo code is rejected", async () => {
  const latte = await productId("latte")
  const r = await checkout(db, input([{ productId: latte, quantity: 1 }], "NOPE"), now)
  assert.equal(!r.ok && r.error, "PROMO_REJECTED")
})

test("duplicate product lines are merged, not doubled", async () => {
  const latte = await productId("latte")
  await checkout(db, input([
    { productId: latte, quantity: 2 },
    { productId: latte, quantity: 1 },
  ]), now)
  assert.equal((await db.product.findUniqueOrThrow({ where: { id: latte } })).stock, 2)
})

test("invoice numbers are unique and formatted INV-<year>-<seq>", async () => {
  const latte = await productId("latte")
  const first = await checkout(db, input([{ productId: latte, quantity: 1 }]), now)
  const second = await checkout(db, input([{ productId: latte, quantity: 1 }]), now)
  if (!first.ok || !second.ok) return assert.fail("expected ok")

  assert.match(first.order.invoiceNumber, /^INV-2026-\d{3,}$/)
  assert.match(second.order.invoiceNumber, /^INV-2026-\d{3,}$/)
  assert.notEqual(first.order.invoiceNumber, second.order.invoiceNumber)
  assert.equal(formatInvoice(2026, 7), "INV-2026-007")
})

test("payment method is persisted", async () => {
  const latte = await productId("latte")
  const r = await checkout(
    db,
    { items: [{ productId: latte, quantity: 1 }], promoCode: null, paymentMethod: "QRIS" },
    now,
  )
  if (!r.ok) return assert.fail("expected ok")
  assert.equal((await db.order.findUniqueOrThrow({ where: { id: r.order.id } })).paymentMethod, "QRIS")
})
