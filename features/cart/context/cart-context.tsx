"use client"

import { createContext, useContext } from "react"
import { useCartState, type Cart } from "@/features/cart/lib/use-cart-state"

const CartContext = createContext<Cart | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useCartState()
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>
}

export function useCart(): Cart {
  const cart = useContext(CartContext)
  if (!cart) throw new Error("useCart must be used inside <CartProvider>")
  return cart
}