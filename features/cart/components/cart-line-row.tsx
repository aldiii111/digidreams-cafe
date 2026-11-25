"use client"

import Image from "next/image"
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
    <li className="flex items-center gap-2.5 py-2.5">
      <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-muted">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt="" fill sizes="44px" className="object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center text-xs text-muted-foreground">
            {product.name.slice(0, 1)}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-[13px] font-medium leading-tight">{product.name}</p>
        <p className="text-xs text-muted-foreground tabular-nums">{formatRupiah(product.price)}</p>
        {atMax && <p className="text-[11px] text-warning">Stok maksimal</p>}
      </div>

      <div className="flex items-center gap-0.5">
        <Button variant="outline" size="icon-sm" onClick={onDecrement} aria-label={`Kurangi ${product.name}`}>
          <Minus />
        </Button>
        <span className="w-5 text-center text-xs tabular-nums">{quantity}</span>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={onIncrement}
          disabled={atMax}
          aria-label={`Tambah ${product.name}`}
        >
          <Plus />
        </Button>
      </div>

      <div className="flex shrink-0 min-w-[5rem] flex-col items-end gap-0.5">
        <span className="text-[13px] font-semibold tabular-nums text-right">
          {formatRupiah(product.price * quantity)}
        </span>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onRemove}
          aria-label={`Hapus ${product.name}`}
          className="size-6 text-muted-foreground hover:text-destructive"
        >
          <Trash2 />
        </Button>
      </div>
    </li>
  )
}
