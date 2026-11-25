"use client"

import { useDeferredValue, useMemo, useState } from "react"
import type { Catalog, ProductView } from "./queries"
import { filterProducts, ALL } from "./filter"
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
    <div className="flex flex-col gap-4">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari menu…"
        aria-label="Cari menu"
        className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      />

      <div role="tablist" aria-label="Kategori" className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = tab.slug === category
          return (
            <button
              key={tab.slug}
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(tab.slug)}
              className={`h-8 rounded-full px-3 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {tab.name}
            </button>
          )
        })}
      </div>

      <ProductGrid products={visible} />
    </div>
  )
}

export type { ProductView }
