import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { PosShell } from "@/features/layout/components/pos-shell";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DigiDreams POS",
  description: "Kasir DigiDreams Cafe & Coworking Space",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={cn("h-full", "antialiased", "", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="flex h-dvh flex-col overflow-hidden">
        <header className="shrink-0 border-b px-4 py-3">
          <h1 className="text-base font-bold tracking-tight">DigiDreams POS</h1>
          <p className="text-xs text-muted-foreground">Cafe &amp; Coworking Space · Sukoharjo</p>
        </header>
        <main className="mx-auto flex w-full min-h-0 max-w-7xl flex-1 flex-col overflow-hidden px-4 py-4">
          <PosShell>{children}</PosShell>
        </main>
      </body>
    </html>
  );
}
