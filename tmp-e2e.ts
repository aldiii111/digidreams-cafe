import "dotenv/config"
import { prisma } from "./lib/db"
import { checkout } from "./features/checkout/checkout"

async function main() {
  const latte = await prisma.product.findFirstOrThrow({ where: { slug: "butterschoth" } })
  const katsu = await prisma.product.findFirstOrThrow({ where: { slug: "nasi-ayam-katsu" } })
  const stockBefore = { latte: latte.stock, katsu: katsu.stock }

  const r = await checkout(prisma, {
    items: [
      { productId: latte.id, quantity: 2 },
      { productId: katsu.id, quantity: 1 },
    ],
    promoCode: "DIGIZEN10",
    paymentMethod: "QRIS",
  }, new Date())
  console.log("checkout:", JSON.stringify(r, null, 1))

  if (r.ok) {
    const after = await prisma.product.findMany({ where: { id: { in: [latte.id, katsu.id] } }, select: { slug: true, stock: true } })
    console.log("stock before:", stockBefore)
    console.log("stock after :", Object.fromEntries(after.map((p) => [p.slug, p.stock])))
    const order = await prisma.order.findUniqueOrThrow({ where: { id: r.order.id }, include: { items: true } })
    console.log("order rows:", { invoice: order.invoiceNumber, subtotal: order.subtotal, discount: order.discount, tax: order.tax, total: order.total, method: order.paymentMethod, items: order.items.length })
    console.log("INVOICE=", order.invoiceNumber)
  }
}
main().finally(() => prisma.$disconnect())
