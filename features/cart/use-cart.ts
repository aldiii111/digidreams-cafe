"use client"

import { useState } from "react"
import type { ProductView } from "@/features/catalog/queries"
import { addToCart, setQuantity, type CartLineState } from "@/lib/cart"

export function useCart() {
  const [lines, setLines] = useState<CartLineState[]>([])
  const quantityOf = (productId: number) =>
    lines.find((l) => l.product.id === productId)?.quantity ?? 0
  const clear = () => setLines([])

  return {
    lines,
    quantityOf,
    clear,
    add: (product: ProductView) => setLines((cur) => addToCart(cur, product)),
    setQuantity: (productId: number, quantity: number) =>
      setLines((cur) => setQuantity(cur, productId, quantity)),
    increment: (productId: number) =>
      setLines((cur) => {
        const line = cur.find((l) => l.product.id === productId)
        return line ? setQuantity(cur, productId, line.quantity + 1) : cur
      }),
    decrement: (productId: number) =>
      setLines((cur) => {
        const line = cur.find((l) => l.product.id === productId)
        return line ? setQuantity(cur, productId, line.quantity - 1) : cur
      }),
    remove: (productId: number) => setLines((cur) => setQuantity(cur, productId, 0)),
  }
}

export type Cart = ReturnType<typeof useCart>
