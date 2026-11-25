"use client"

import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatRupiah } from "@/lib/format"
import type { CartLineState } from "@/lib/cart"

export function CartLineRow({
  line,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  line: CartLineState
  onIncrement: () => void
  onDecrement: () => void
  onRemove: () => void
}) {
  const { product, quantity } = line
  const atMax = quantity >= product.stock

  return (
    <li className="flex items-start gap-2 py-2">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium leading-snug">{product.name}</p>
        <p className="text-xs text-muted-foreground tabular-nums">
          {formatRupiah(product.price)} × {quantity}
        </p>
        {atMax && <p className="text-xs text-amber-600">Stok maksimal</p>}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-xs"
          onClick={onDecrement}
          aria-label={`Kurangi ${product.name}`}
        >
          <Minus />
        </Button>
        <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
          {quantity}
        </span>
        <Button
          variant="outline"
          size="icon-xs"
          onClick={onIncrement}
          disabled={atMax}
          aria-label={`Tambah ${product.name}`}
        >
          <Plus />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onRemove}
          aria-label={`Hapus ${product.name}`}
          className="text-destructive hover:bg-destructive/10"
        >
          <Trash2 />
        </Button>
      </div>

      <span className="w-20 shrink-0 text-right text-sm font-medium tabular-nums">
        {formatRupiah(product.price * quantity)}
      </span>
    </li>
  )
}
