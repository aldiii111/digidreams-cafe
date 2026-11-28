"use client";

import { createContext, useContext, useState } from "react";
import type { ProductView } from "@/features/catalog/action/queries";
import { addToCart, setQuantity } from "@/features/cart/lib/cart";
import type { CartLineState } from "@/features/cart/types";
import type { PromoLike } from "@/lib/money";

type CartState = {
  lines: CartLineState[];
  promo: { code: string; data: PromoLike } | null;
};

export function useCartState() {
  const [state, setState] = useState<CartState>({ lines: [], promo: null });
  const { lines } = state;

  const quantityOf = (productId: number) =>
    lines.find((l) => l.product.id === productId)?.quantity ?? 0;

  const setLines = (updater: (cur: CartLineState[]) => CartLineState[]) =>
    setState((s) => ({ ...s, lines: updater(s.lines) }));

  return {
    lines,
    promo: state.promo,
    quantityOf,
    clear: () => setState({ lines: [], promo: null }),
    add: (product: ProductView) => setLines((cur) => addToCart(cur, product)),
    setQuantity: (productId: number, quantity: number) =>
      setLines((cur) => setQuantity(cur, productId, quantity)),
    increment: (productId: number) =>
      setLines((cur) => {
        const line = cur.find((l) => l.product.id === productId);
        return line ? setQuantity(cur, productId, line.quantity + 1) : cur;
      }),
    decrement: (productId: number) =>
      setLines((cur) => {
        const line = cur.find((l) => l.product.id === productId);
        return line ? setQuantity(cur, productId, line.quantity - 1) : cur;
      }),
    remove: (productId: number) =>
      setLines((cur) => setQuantity(cur, productId, 0)),
    setPromo: (code: string, data: PromoLike) =>
      setState((s) => ({ ...s, promo: { code, data } })),
    clearPromo: () => setState((s) => ({ ...s, promo: null })),
  };
}

export type Cart = ReturnType<typeof useCartState>;

export const CartContext = createContext<Cart | null>(null);

export function useCart(): Cart {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside <PosShell>");
  return cart;
}
