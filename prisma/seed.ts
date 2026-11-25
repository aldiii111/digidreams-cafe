import { PrismaClient } from "../lib/generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { CATEGORIES, PRODUCTS } from "./seed-data"

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db"
const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) })

async function main() {
  const categoryIds = new Map<string, number>()
  for (const c of CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: { slug: c.slug, name: c.name },
    })
    categoryIds.set(c.slug, row.id)
  }

  for (const p of PRODUCTS) {
    const categoryId = categoryIds.get(p.category)
    if (!categoryId) throw new Error(`Unknown category "${p.category}" for product "${p.slug}"`)
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        categoryId,
        price: p.price,
        description: p.description,
        imageUrl: p.imageUrl,
      },
      create: {
        slug: p.slug,
        name: p.name,
        categoryId,
        price: p.price,
        stock: p.stock,
        description: p.description,
        imageUrl: p.imageUrl,
      },
    })
  }

  await prisma.promo.upsert({
    where: { code: "DIGIZEN10" },
    update: { type: "PERCENT", value: 10, minOrder: 50_000, isActive: true },
    create: { code: "DIGIZEN10", type: "PERCENT", value: 10, minOrder: 50_000, isActive: true },
  })

  const [categories, products, promos] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.promo.count(),
  ])
  console.log(`Seeded ${categories} categories, ${products} products, ${promos} promo(s).`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
