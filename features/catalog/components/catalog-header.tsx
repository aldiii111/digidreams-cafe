"use client"

import { Input } from "@/components/ui/input"

const ALL = "all"

export function CatalogHeader({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  categories,
}: {
  query: string
  onQueryChange: (value: string) => void
  category: string
  onCategoryChange: (slug: string) => void
  categories: { slug: string; name: string }[]
}) {
  const tabs = [{ slug: ALL, name: "All" }, ...categories]

  return (
    <div className="flex shrink-0 flex-col gap-3">
      <Input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Cari menu…"
        aria-label="Cari menu"
        className="h-10"
      />

      <div role="tablist" aria-label="Kategori" className="flex flex-wrap gap-1.5">
        {tabs.map((tab) => {
          const active = tab.slug === category
          return (
            <button
              key={tab.slug}
              role="tab"
              aria-selected={active}
              onClick={() => onCategoryChange(tab.slug)}
              className={`h-10 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${
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
    </div>
  )
}