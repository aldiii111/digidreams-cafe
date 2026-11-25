"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { PromoLike } from "@/lib/money"
import { applyPromo } from "@/features/cart/action/actions"

export function PromoForm({
  subtotal,
  activeCode,
  onApply,
  onClear,
}: {
  subtotal: number
  activeCode: string | null
  onApply: (code: string, promo: PromoLike) => void
  onClear: () => void
}) {
  const [code, setCode] = useState("")
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [pending, setPending] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    try {
      const result = await applyPromo(code, subtotal)
      setMessage({ ok: result.ok, text: result.message })
      if (result.ok) onApply(result.code, result.promo)
    } finally {
      setPending(false)
    }
  }

  if (activeCode) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
        <span className="text-sm font-medium tabular-nums">{activeCode}</span>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => {
            setCode("")
            setMessage(null)
            onClear()
          }}
          aria-label="Hapus kode promo"
        >
          <X />
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setMessage(null)
          }}
          placeholder="Kode promo"
          aria-label="Kode promo"
          aria-invalid={message ? !message.ok : undefined}
          className="h-9 uppercase"
        />
        <Button type="submit" variant="secondary" size="sm" disabled={pending || !code.trim()}>
          {pending ? "Cek…" : "Apply"}
        </Button>
      </div>
      {/* A success switches to the active view, so only rejections belong here.
          Rendering a stale success would contradict the summary showing no discount. */}
      {message && !message.ok && (
        <p className="text-xs text-destructive" role="status">
          {message.text}
        </p>
      )}
    </form>
  )
}
