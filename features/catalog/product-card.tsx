import Image from "next/image"
import type { ProductView } from "./queries"
import { formatRupiah } from "@/lib/format"

export function ProductCard({ product }: { product: ProductView }) {
  const soldOut = product.stock <= 0

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm ${
        soldOut ? "opacity-60" : ""
      }`}
    >
      <div className="relative aspect-[4/3] bg-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl font-semibold text-muted-foreground/40">
            {product.name.slice(0, 1)}
          </div>
        )}
        {soldOut && (
          <span className="absolute inset-0 flex items-center justify-center bg-background/80 text-sm font-semibold uppercase tracking-wide">
            Habis
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-xs text-muted-foreground">{product.categoryName}</p>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-mono text-sm font-semibold">{formatRupiah(product.price)}</span>
          <span className="text-xs text-muted-foreground">stok {product.stock}</span>
        </div>
      </div>
    </article>
  )
}
