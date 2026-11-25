import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getReceipt } from "@/features/receipt/action/queries"
import { Receipt } from "@/features/receipt/components/receipt-view"

export function generateStaticParams() {
  return [{ invoice: "INV-0000-000" }]
}

async function ReceiptContent({ invoice }: { invoice: string }) {
  const receipt = await getReceipt(decodeURIComponent(invoice))
  if (!receipt) notFound()

  return (
    <main className="mx-auto w-full max-w-sm px-4 py-8 print:p-0">
      <Receipt receipt={receipt} />
    </main>
  )
}

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ invoice: string }>
}) {
  const { invoice } = await params

  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-sm px-4 py-8 text-sm text-muted-foreground">
          Memuat struk…
        </main>
      }
    >
      <ReceiptContent invoice={invoice} />
    </Suspense>
  )
}
