import { Suspense } from "react"
import Image from "next/image"
import { getCatalog } from "@/features/catalog/action/queries"
import { CatalogBrowser } from "@/features/catalog/components/catalog-browser"
import { PosShell } from "@/features/layout/components/pos-shell"

async function Catalog() {
  const catalog = await getCatalog()
  return <CatalogBrowser catalog={catalog} />
}

export default function PosPage() {
  return (
    <div className="flex h-full flex-col">
      <header data-print="hide" className="shrink-0 border-b bg-card/50 px-4 py-2.5">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="relative h-8 w-28 shrink-0">
            <Image
              src="/logo-digidreams.png"
              alt="DigiDreams"
              fill
              sizes="112px"
              className="object-contain object-left"
              priority
            />
          </div>
          <div className="h-6 w-px bg-border" aria-hidden />
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold tracking-tight leading-tight">POS System</h1>
            <p className="text-[11px] text-muted-foreground leading-none">Cafe &amp; Coworking Space · Sukoharjo</p>
          </div>
        </div>
      </header>
      <main data-print="hide" className="mx-auto flex w-full min-h-0 max-w-7xl flex-1 flex-col overflow-hidden px-4 py-4">
        <PosShell>
          <Suspense
            fallback={<div className="py-10 text-center text-sm text-muted-foreground">Memuat menu…</div>}
          >
            <Catalog />
          </Suspense>
        </PosShell>
      </main>
    </div>
  )
}
