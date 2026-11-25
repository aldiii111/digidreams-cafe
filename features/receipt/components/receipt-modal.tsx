"use client"

import { Suspense, use } from "react"
import { CheckCircle2, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { fetchReceipt } from "@/features/receipt/action/actions"
import { Receipt } from "./receipt-view"

function ReceiptBody({ promise }: { promise: ReturnType<typeof fetchReceipt> }) {
  const receipt = use(promise)

  if (!receipt) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Struk tidak ditemukan.</p>
  }
  return <Receipt receipt={receipt} />
}

export function ReceiptModal({
  invoiceNumber,
  onClose,
}: {
  invoiceNumber: string | null
  onClose: () => void
}) {
  const promise = invoiceNumber ? fetchReceipt(invoiceNumber) : null

  return (
    <Dialog open={invoiceNumber !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90dvh] sm:max-w-sm">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-success" aria-hidden />
            Pembayaran berhasil
          </DialogTitle>
          <DialogDescription>Struk siap dicetak atau diserahkan ke pelanggan.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="rounded-lg border bg-background p-3 print:border-0 print:p-0">
            {promise && (
              <Suspense
                fallback={<p className="py-8 text-center text-sm text-muted-foreground">Memuat struk…</p>}
              >
                <ReceiptBody promise={promise} />
              </Suspense>
            )}
          </div>
        </ScrollArea>

        <div className="flex shrink-0 gap-2 print:hidden">
          <Button variant="outline" className="flex-1" onClick={() => window.print()}>
            <Printer />
            Cetak
          </Button>
          <Button className="flex-1" onClick={onClose}>
            Selesai
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
