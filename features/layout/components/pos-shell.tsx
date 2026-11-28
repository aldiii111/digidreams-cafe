"use client"

import { useMemo, useState } from "react"
import { computeTotals } from "@/lib/money"
import { revalidatePromo } from "@/lib/promo-revalidate"
import { PaymentBar } from "@/features/checkout/components/payment-bar"
import { ReceiptModal } from "@/features/receipt/components/receipt-modal"
import type { ReceiptView } from "@/features/receipt/action/queries"
import { useCartState } from "@/features/cart/lib/use-cart-state"
import { CartProvider } from "@/features/cart/context/cart-context"
import { CartBody, CartMobileBar } from "@/features/cart/components/cart-panel"
import { CartSummary } from "@/features/cart/components/cart-summary"
import { PromoForm } from "@/features/cart/components/promo-form"

export function PosShell({ children }: { children: React.ReactNode }) {
  const cart = useCartState()
  const [paidReceipt, setPaidReceipt] = useState<ReceiptView | null>(null)

  const subtotal = useMemo(
    () => cart.lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0),
    [cart.lines],
  )

  const promo = revalidatePromo(cart.promo, subtotal)
  const totals = computeTotals(
    cart.lines.map((l) => ({ price: l.product.price, quantity: l.quantity })),
    promo?.data ?? null,
  )

  const promoForm =
    cart.lines.length > 0 ? (
      <PromoForm
        subtotal={subtotal}
        activeCode={promo?.code ?? null}
        onApply={cart.setPromo}
        onClear={cart.clearPromo}
      />
    ) : null

  const paymentBar = (
    <PaymentBar subtotal={subtotal} total={totals.total} onPaid={setPaidReceipt} />
  )

  return (
    <CartProvider>
      <div className="grid min-h-0 flex-1 gap-5 pb-[76px] lg:grid-cols-[1fr_360px] lg:pb-0">
        <section aria-label="Katalog menu" className="flex min-h-0 min-w-0 flex-col">
          {children}
        </section>

        <aside
          aria-label="Keranjang"
          className="hidden min-h-0 flex-col lg:flex lg:rounded-xl lg:border lg:bg-card lg:p-4"
        >
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold">Keranjang</h2>
            <span className="text-xs text-muted-foreground tabular-nums">
              {cart.lines.reduce((n, l) => n + l.quantity, 0)} item
            </span>
          </div>
          <CartBody
            cart={cart}
            footer={
              <div className="flex flex-col gap-3">
                {promoForm}
                <CartSummary totals={totals} />
                {cart.lines.length > 0 && paymentBar}
              </div>
            }
          />
        </aside>

        <CartMobileBar
          cart={cart}
          totals={totals.total}
          promoSlot={promoForm}
          footer={
            <div className="flex flex-col gap-3">
              <CartSummary totals={totals} />
              {paymentBar}
            </div>
          }
        />

        <ReceiptModal receipt={paidReceipt} onClose={() => setPaidReceipt(null)} />
      </div>
    </CartProvider>
  )
}
