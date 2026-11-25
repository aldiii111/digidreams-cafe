import { getCatalog } from "@/features/catalog/queries"
import { CatalogBrowser } from "@/features/catalog/catalog-browser"

export default async function PosPage() {
  const catalog = await getCatalog()

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight">DigiDreams POS</h1>
        <p className="text-sm text-muted-foreground">Cafe &amp; Coworking Space</p>
      </header>
      <CatalogBrowser catalog={catalog} />
    </main>
  )
}
