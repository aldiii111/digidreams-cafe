import { formatRupiah } from "@/lib/format"
import type { ReceiptView } from "@/features/receipt/action/queries"

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(d)
}

/** Thermal-style receipt. Monospace body so columns align like a till printout. */
export function Receipt({ receipt }: { receipt: ReceiptView }) {
  return (
    <div className="mx-auto w-full max-w-[80mm] font-mono text-xs leading-relaxed">
      <header className="border-b border-dashed pb-2 text-center">
        <p className="text-sm font-bold tracking-tight">DIGIDREAMS SPACE</p>
        <p className="text-[11px] text-muted-foreground">Cafe &amp; Coworking · Sukoharjo</p>
      </header>

      <dl className="grid grid-cols-[auto_1fr] gap-x-2 py-2 text-[11px]">
        <dt className="text-muted-foreground">Tanggal</dt>
        <dd className="text-right tabular-nums">{formatDate(receipt.createdAt)}</dd>
        <dt className="text-muted-foreground">Invoice</dt>
        <dd className="text-right tabular-nums">{receipt.invoiceNumber}</dd>
        <dt className="text-muted-foreground">Bayar</dt>
        <dd className="text-right">{receipt.paymentMethod}</dd>
      </dl>

      <ul className="border-y border-dashed py-2">
        {receipt.items.map((item, i) => (
          <li key={i} className="flex justify-between gap-2 py-0.5">
            <span className="min-w-0">
              {item.name}
              <span className="text-muted-foreground"> ×{item.quantity}</span>
            </span>
            <span className="shrink-0 tabular-nums">{formatRupiah(item.subtotal)}</span>
          </li>
        ))}
      </ul>

      <dl className="space-y-0.5 py-2 text-[11px]">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="tabular-nums">{formatRupiah(receipt.subtotal)}</dd>
        </div>
        {receipt.discount > 0 && (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Diskon</dt>
            <dd className="tabular-nums">−{formatRupiah(receipt.discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted-foreground">PPN 10%</dt>
          <dd className="tabular-nums">{formatRupiah(receipt.tax)}</dd>
        </div>
        <div className="mt-1 flex justify-between border-t border-dashed pt-1 text-sm font-bold">
          <dt>TOTAL</dt>
          <dd className="tabular-nums">{formatRupiah(receipt.total)}</dd>
        </div>
      </dl>

      <p className="pt-1 text-center text-[10px] text-muted-foreground">
        Terima kasih telah berkunjung
      </p>
    </div>
  )
}
