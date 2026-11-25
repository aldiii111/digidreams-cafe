"use client"

import { ShoppingCart } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { formatRupiah } from "@/lib/format"
import type { Cart } from "./use-cart"
import { CartLineRow } from "./cart-line-row"

/**
 * The cart's contents, shared by the desktop rail and the phone sheet.
 * Keeping one component means the two placements can never drift.
 */
export function CartBody({ cart, totals, footer }: { cart: Cart; totals: number; footer: React.ReactNode }) {
  if (cart.lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 py-10 text-center">
        <ShoppingCart className="size-6 text-muted-foreground" aria-hidden />
        <p className="text-sm font-medium">Keranjang kosong</p>
        <p className="text-xs text-muted-foreground">Pilih menu di sebelah kiri untuk mulai.</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <ul className="divide-y">
        {cart.lines.map((line) => (
          <CartLineRow
            key={line.product.id}
            line={line}
            onIncrement={() => cart.increment(line.product.id)}
            onDecrement={() => cart.decrement(line.product.id)}
            onRemove={() => cart.remove(line.product.id)}
          />
        ))}
      </ul>
      <div className="mt-auto pt-4">{footer}</div>
    </div>
  )
}

/** Phone: persistent bar showing the running total, opening the cart as a bottom sheet. */
export function CartMobileBar({ cart, totals }: { cart: Cart; totals: number }) {
  const count = cart.lines.reduce((n, l) => n + l.quantity, 0)
  if (count === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background p-3 lg:hidden">
      <Dialog>
        <DialogTrigger
          render={
            <button className="flex w-full items-center justify-between rounded-lg bg-primary px-4 py-2.5 text-primary-foreground" />
          }
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <ShoppingCart className="size-4" aria-hidden />
            {count} item
          </span>
          <span className="font-mono text-sm font-semibold tabular-nums">{formatRupiah(totals)}</span>
        </DialogTrigger>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Keranjang</DialogTitle>
            <DialogDescription>Ubah jumlah lalu lanjut ke pembayaran.</DialogDescription>
          </DialogHeader>
          <CartBody cart={cart} totals={totals} footer={null} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
