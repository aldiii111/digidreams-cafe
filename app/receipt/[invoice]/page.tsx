import { connection } from "next/server"
import { notFound } from "next/navigation"
import { getReceipt } from "@/features/receipt/action/queries"
import { Receipt } from "@/features/receipt/components/receipt-view"

export function generateStaticParams() {
  return [{ invoice: "INV-0000-000" }]
}

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ invoice: string }>
}) {
  const { invoice } = await params
  // A receipt is per-sale data: read it at request time, never prerender it.
  await connection()

  const receipt = await getReceipt(decodeURIComponent(invoice))
  if (!receipt) notFound()

  return (
    <main className="mx-auto w-full max-w-sm px-4 py-8 print:p-0">
      <Receipt receipt={receipt} />
    </main>
  )
}
