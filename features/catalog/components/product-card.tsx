"use client"

import Image from "next/image"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ProductView } from "@/features/catalog/action/queries"
import { formatRupiah } from "@/lib/format"

export function ProductCard({
  product,
  inCart,
  onAdd,
  priority,
}: {
  product: ProductView
  inCart: number
  onAdd: () => void
  priority: boolean
}) {
  const available = product.stock - inCart
  const soldOut = available <= 0

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground">
      <div className="relative aspect-[4/3] bg-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover"
            preload={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl font-semibold text-muted-foreground/40">
            {product.name.slice(0, 1)}
          </div>
        )}
        {soldOut && (
          <Badge variant="destructive" className="absolute top-2 left-2">
            Habis
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-xs text-muted-foreground">{product.categoryName}</p>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-sm font-semibold tabular-nums">
            {formatRupiah(product.price)}
          </span>
          <Button
            size="icon-sm"
            variant={soldOut ? "outline" : "default"}
            onClick={onAdd}
            disabled={soldOut}
            aria-label={`Tambah ${product.name} ke keranjang`}
          >
            <Plus />
          </Button>
        </div>
      </div>
    </article>
  )
}
