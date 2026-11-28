import { Suspense } from "react"
import { getCatalog } from "@/features/catalog/action/queries"
import { CatalogBrowser } from "@/features/catalog/components/catalog-browser"

async function Catalog() {
  const catalog = await getCatalog()
  return <CatalogBrowser catalog={catalog} />
}

export default function PosPage() {
  return (
    <Suspense
      fallback={<div className="py-10 text-center text-sm text-muted-foreground">Memuat menu…</div>}
    >
      <Catalog />
    </Suspense>
  )
}