import type { ProductView } from "@/features/catalog/queries"

export type CartLineState = { product: ProductView; quantity: number }

/** Adds one unit; caps at stock; same product never duplicates. Pure — returns a new array. */
export function addToCart(lines: CartLineState[], product: ProductView): CartLineState[] {
  const existing = lines.find((l) => l.product.id === product.id)
  if (existing) {
    if (existing.quantity >= product.stock) return lines
    return lines.map((l) =>
      l.product.id === product.id ? { ...l, quantity: l.quantity + 1 } : l,
    )
  }
  if (product.stock <= 0) return lines
  return [...lines, { product, quantity: 1 }]
}

/** Changes quantity, clamped to [0, stock]. Zero removes the line. */
export function setQuantity(lines: CartLineState[], productId: number, quantity: number): CartLineState[] {
  return lines.flatMap((l) => {
    if (l.product.id !== productId) return [l]
    const qty = Math.min(Math.max(quantity, 0), l.product.stock)
    return qty === 0 ? [] : [{ ...l, quantity: qty }]
  })
}
