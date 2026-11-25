"use server"

import { getReceipt, type ReceiptView } from "./queries"

export async function fetchReceipt(invoiceNumber: string): Promise<ReceiptView | null> {
  return getReceipt(invoiceNumber)
}
