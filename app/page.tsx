import { getCatalog } from "@/features/catalog/action/queries"
import { CatalogBrowser } from "@/features/catalog/components/catalog-browser"

export default async function PosPage() {
  const catalog = await getCatalog()
  return <CatalogBrowser catalog={catalog} />
}
