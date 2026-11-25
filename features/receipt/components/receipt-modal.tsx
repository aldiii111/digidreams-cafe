"use client"

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
import type { ReceiptView } from "@/features/receipt/action/queries"
import { Receipt } from "./receipt-view"

export function ReceiptModal({
  receipt,
  onClose,
}: {
  receipt: ReceiptView | null
  onClose: () => void
}) {
  return (
    <Dialog open={receipt !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90dvh] sm:max-w-sm print:static print:max-h-none print:max-w-none">
        <DialogHeader className="shrink-0 print:hidden">
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-success" aria-hidden />
            Pembayaran berhasil
          </DialogTitle>
          <DialogDescription>Struk siap dicetak atau diserahkan ke pelanggan.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="min-h-0 flex-1 print:overflow-visible">
          <div className="rounded-lg border bg-background p-3 print:border-0 print:p-0">
            {receipt && <Receipt receipt={receipt} />}
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
