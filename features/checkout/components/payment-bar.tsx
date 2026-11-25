"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatRupiah } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useCart } from "@/features/cart/lib/use-cart"
import { submitOrder } from "@/features/checkout/action/actions"
import type { PaymentMethod } from "@/features/checkout/lib/checkout"

const METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "CASH", label: "Tunai" },
  { value: "QRIS", label: "QRIS" },
]

export function PaymentBar({
  subtotal,
  total,
  onPaid,
}: {
  subtotal: number
  total: number
  onPaid: (invoiceNumber: string) => void
}) {
  const cart = useCart()
  const [method, setMethod] = useState<PaymentMethod>("CASH")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const disabled = cart.lines.length === 0 || pending

  async function pay() {
    setPending(true)
    setError(null)
    try {
      const result = await submitOrder({
        items: cart.lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })),
        promoCode: cart.promo?.code ?? null,
        paymentMethod: method,
      })
      if (!result.ok) {
        setError(result.message)
        return
      }
      cart.clear()
      onPaid(result.invoiceNumber)
    } catch {
      setError("Pembayaran gagal. Coba lagi.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div role="radiogroup" aria-label="Metode pembayaran" className="grid grid-cols-2 gap-2">
        {METHODS.map((m) => {
          const active = m.value === method
          return (
            <button
              key={m.value}
              role="radio"
              aria-checked={active}
              onClick={() => setMethod(m.value)}
              className={cn(
                "h-9 rounded-lg border text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                active
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {m.label}
            </button>
          )
        })}
      </div>

      <Button onClick={pay} disabled={disabled} className="h-10 w-full justify-between px-4">
        <span className="flex items-center gap-2">
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {pending ? "Memproses…" : "Bayar Sekarang"}
        </span>
        <span className="font-mono tabular-nums">{formatRupiah(total)}</span>
      </Button>

      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
      {cart.promo && subtotal < cart.promo.data.minOrder && (
        <p className="text-xs text-muted-foreground">Promo tidak berlaku untuk total ini.</p>
      )}
    </div>
  )
}
