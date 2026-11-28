import { Suspense } from "react"
import { getCatalog } from "@/features/catalog/action/queries"
import { CatalogScreen } from "@/features/catalog/components/catalog-screen"

async function Catalog() {
  const catalog = await getCatalog()
  return <CatalogScreen catalog={catalog} />
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