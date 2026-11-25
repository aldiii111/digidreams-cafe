import type { Totals } from "@/lib/money"
import { formatRupiah } from "@/lib/format"

export function CartSummary({ totals }: { totals: Totals }) {
  return (
    <dl className="space-y-1.5 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Subtotal</dt>
        <dd className="tabular-nums">{formatRupiah(totals.subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Diskon</dt>
        <dd className={totals.discount > 0 ? "tabular-nums text-emerald-600" : "tabular-nums"}>
          {totals.discount > 0 ? `−${formatRupiah(totals.discount)}` : formatRupiah(0)}
        </dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted-foreground">PPN 10%</dt>
        <dd className="tabular-nums">{formatRupiah(totals.tax)}</dd>
      </div>
      <div className="flex justify-between border-t pt-2 text-base font-semibold">
        <dt>Total</dt>
        <dd className="tabular-nums tabular-nums">{formatRupiah(totals.total)}</dd>
      </div>
    </dl>
  )
}
