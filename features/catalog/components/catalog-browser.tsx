"use client"

import { useDeferredValue, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Catalog, ProductView } from "@/features/catalog/action/queries"
import { filterProducts, ALL } from "@/features/catalog/lib/filter"
import { ProductGrid } from "./product-grid"

export function CatalogBrowser({ catalog }: { catalog: Catalog }) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string>(ALL)
  const deferredQuery = useDeferredValue(query)

  const visible = useMemo(
    () => filterProducts(catalog.products, category, deferredQuery),
    [catalog.products, category, deferredQuery],
  )

  const tabs = [{ slug: ALL, name: "All" }, ...catalog.categories]

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari menu…"
        aria-label="Cari menu"
        className="h-10 shrink-0"
      />

      <div role="tablist" aria-label="Kategori" className="flex shrink-0 flex-wrap gap-1.5">
        {tabs.map((tab) => {
          const active = tab.slug === category
          return (
            <button
              key={tab.slug}
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(tab.slug)}
              className={`h-8 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.name}
            </button>
          )
        })}
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="pr-3 pb-1">
          <ProductGrid products={visible} />
        </div>
      </ScrollArea>
    </div>
  )
}

export type { ProductView }
