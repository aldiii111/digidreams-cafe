import { CartProvider } from "@/features/cart/context/cart-context"
import { CartSidebar } from "@/features/cart/components/cart-sidebar"
import { PosHeader } from "@/features/layout/components/pos-header"

export default function PosLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex h-full flex-col">
        <PosHeader />
        <main
          data-print="hide"
          className="mx-auto flex w-full min-h-0 max-w-7xl flex-1 flex-col overflow-hidden px-4 py-4"
        >
          <div className="grid min-h-0 flex-1 gap-5 pb-[76px] lg:grid-cols-[1fr_360px] lg:pb-0">
            <section aria-label="Katalog menu" className="flex min-h-0 min-w-0 flex-col">
              {children}
            </section>
            <CartSidebar />
          </div>
        </main>
      </div>
    </CartProvider>
  )
}