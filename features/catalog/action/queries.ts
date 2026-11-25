import { connection } from "next/server"
import { prisma } from "@/lib/db"

export type ProductView = {
  id: number
  name: string
  slug: string
  price: number
  stock: number
  description?: string | null
  imageUrl: string | null
  categorySlug: string
  categoryName: string
}

export type Catalog = {
  categories: { slug: string; name: string }[]
  products: ProductView[]
}

export async function getCatalog(): Promise<Catalog> {
  // Stock changes with every sale, so the catalog is request-time data.
  await connection()
  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { id: "asc" }, select: { slug: true, name: true } }),
    prisma.product.findMany({
      orderBy: [{ categoryId: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        stock: true,
        description: true,
        imageUrl: true,
        category: { select: { slug: true, name: true } },
      },
    }),
  ])

  return {
    categories,
    products: products.map(({ category, ...p }) => ({
      ...p,
      categorySlug: category.slug,
      categoryName: category.name,
    })),
  }
}
