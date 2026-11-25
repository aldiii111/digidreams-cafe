"use client"

import { ShoppingCart } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { formatRupiah } from "@/lib/format"
import type { Cart } from "@/features/cart/lib/use-cart"
import { CartLineRow } from "./cart-line-row"

/**
 * Cart contents shared by the desktop rail and the phone sheet, so the two
 * placements can never drift. The summary footer stays pinned; only the
 * item list scrolls.
 */
export function CartBody({ cart, footer }: { cart: Cart; footer?: React.ReactNode }) {
  if (cart.lines.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-1 py-10 text-center">
        <ShoppingCart className="size-6 text-muted-foreground" aria-hidden />
        <p className="text-sm font-medium">Keranjang kosong</p>
        <p className="text-xs text-muted-foreground">Pilih menu untuk mulai.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScrollArea className="min-h-0 flex-1 overflow-hidden">
        <ul className="divide-y divide-border py-1 pr-4">
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
      </ScrollArea>
      <Separator className="my-2 shrink-0" />
      <div className="shrink-0 pb-1">{footer}</div>
    </div>
  )
}

/** Phone: fixed bar with the running total, opening the cart as a sheet. */
export function CartMobileBar({
  cart,
  totals,
  promoSlot,
  footer,
}: {
  cart: Cart
  totals: number
  promoSlot?: React.ReactNode
  footer?: React.ReactNode
}) {
  const count = cart.lines.reduce((n, l) => n + l.quantity, 0)
  if (count === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background p-3 lg:hidden">
      <Dialog>
        <DialogTrigger
          render={<button className="flex w-full items-center justify-between rounded-lg bg-primary px-4 py-2.5 text-primary-foreground" />}
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <ShoppingCart className="size-4" aria-hidden />
            {count} item
          </span>
          <span className="text-sm font-semibold tabular-nums">{formatRupiah(totals)}</span>
        </DialogTrigger>
        <DialogContent className="flex h-[85dvh] max-h-[85dvh] flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>Keranjang</DialogTitle>
            <DialogDescription>Ubah jumlah lalu lanjut ke pembayaran.</DialogDescription>
          </DialogHeader>
          <CartBody
            cart={cart}
            footer={
              <div className="flex flex-col gap-3">
                {promoSlot}
                {footer}
              </div>
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
