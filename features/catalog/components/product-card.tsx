"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  const [openDetail, setOpenDetail] = useState(false)
  const available = product.stock - inCart
  const soldOut = available <= 0

  return (
    <>
      <article className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground">
        <button
          type="button"
          onClick={() => setOpenDetail(true)}
          className="relative aspect-[4/3] w-full shrink-0 bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Lihat detail ${product.name}`}
        >
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-transform duration-200 group-hover:scale-105"
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
          <span className="sr-only">Klik gambar untuk melihat detail produk</span>
        </button>

        <div className="flex flex-1 flex-col justify-between p-3">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground truncate">{product.categoryName}</p>
            <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug">
              {product.name}
            </h3>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-border/40">
            <span className="text-sm font-semibold tabular-nums">
              {formatRupiah(product.price)}
            </span>
            <Button
              size="icon-sm"
              className="size-10"
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

      <Dialog open={openDetail} onOpenChange={setOpenDetail}>
        <DialogContent className="max-w-md p-0 overflow-hidden sm:rounded-2xl">
          <div className="relative aspect-video w-full bg-muted">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, 448px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl font-semibold text-muted-foreground/40">
                {product.name.slice(0, 1)}
              </div>
            )}
            <Badge
              variant={soldOut ? "destructive" : "secondary"}
              className="absolute top-3 left-3 shadow-sm backdrop-blur-md bg-background/80"
            >
              {soldOut ? "Stok Habis" : `Tersedia: ${available} porsi`}
            </Badge>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <DialogHeader className="gap-1 text-left">
              <span className="text-xs font-medium text-primary tracking-wide uppercase">
                {product.categoryName}
              </span>
              <DialogTitle className="text-lg font-bold">{product.name}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground leading-relaxed pt-1">
                {product.description || "Menu istimewa racikan DigiDreams Cafe & Coworking Space dengan bahan pilihan."}
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Harga</p>
                <p className="text-lg font-bold tabular-nums text-foreground">
                  {formatRupiah(product.price)}
                </p>
              </div>
              <Button
                onClick={() => {
                  onAdd()
                  setOpenDetail(false)
                }}
                disabled={soldOut}
                className="gap-2"
              >
                <Plus className="size-4" />
                Tambah ke Keranjang
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
