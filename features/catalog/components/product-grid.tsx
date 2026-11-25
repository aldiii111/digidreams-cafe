"use client"

import type { ProductView } from "@/features/catalog/action/queries"
import { ProductCard } from "./product-card"
import { useCart } from "@/features/cart/lib/use-cart"

export function ProductGrid({ products }: { products: ProductView[] }) {
  const cart = useCart()

  if (products.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
        Tidak ada menu yang cocok.
      </div>
    )
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
      {products.map((product, i) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            inCart={cart.quantityOf(product.id)}
            onAdd={() => cart.add(product)}
            priority={i < 4}
          />
        </li>
      ))}
    </ul>
  )
}
