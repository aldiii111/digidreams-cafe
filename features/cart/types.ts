/** The product fields a cart needs. Catalog's ProductView satisfies this structurally. */
export type CartProduct = {
  id: number
  name: string
  price: number
  stock: number
  imageUrl: string | null
}

export type CartLineState = { product: CartProduct; quantity: number }