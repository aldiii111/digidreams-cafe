"use client"

import { useDeferredValue, useMemo, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Catalog, ProductView } from "@/features/catalog/action/queries"
import { filterProducts, ALL } from "@/features/catalog/lib/filter"
import { CatalogHeader } from "./catalog-header"
import { ProductGrid } from "./product-grid"

export function CatalogScreen({ catalog }: { catalog: Catalog }) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string>(ALL)
  const deferredQuery = useDeferredValue(query)

  const visible = useMemo(
    () => filterProducts(catalog.products, category, deferredQuery),
    [catalog.products, category, deferredQuery],
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <CatalogHeader
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        categories={catalog.categories}
      />

      <ScrollArea className="min-h-0 flex-1">
        <div className="pr-3 pb-1">
          <ProductGrid products={visible} />
        </div>
      </ScrollArea>
    </div>
  )
}

export type { ProductView }