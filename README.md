# DigiDreams Mini-POS

Point-of-sale untuk DigiDreams Cafe & Coworking Space. Kasir memilih menu, menerapkan kode promo, memproses pembayaran (Tunai/QRIS), dan mencetak struk thermal.

Dibangun dengan Next.js 16 (App Router), TypeScript strict, Tailwind CSS v4, shadcn/ui, dan Prisma 7 di atas SQLite.

## Prasyarat

| Tool | Versi | Catatan |
| --- | --- | --- |
| Node.js | **≥ 22.18** | Prisma 7 dan `better-sqlite3@13` menolak versi lebih lama |
| pnpm | **≥ 10** | Proyek memakai `pnpm-workspace.yaml`; `packageManager` di `package.json` = `pnpm@12.18.0` |

Tidak perlu Docker dan tidak perlu server database — SQLite berupa satu file di `prisma/dev.db`.

## Setup dari Nol

```bash
# 1. Install dependency
pnpm install

# 2. Siapkan environment
cp .env.example .env

# 3. Buat database + terapkan migrasi
pnpm db:migrate

# 4. Isi data awal (4 kategori, 12 produk, 1 promo)
pnpm db:seed

# 5. Jalankan
pnpm dev
```

Buka <http://localhost:3000>.

### Perintah lain

| Perintah | Fungsi |
| --- | --- |
| `pnpm build` | Build produksi (Turbopack) |
| `pnpm start` | Jalankan hasil build |
| `pnpm lint` | ESLint |
| `pnpm test` | 48 test (`node:test` via `tsx`) |
| `pnpm db:reset` | Hapus database, migrasi ulang, lalu seed |

## Environment

Hanya satu variabel, sudah ada di `.env.example`:

```dotenv
DATABASE_URL="file:./prisma/dev.db"
```

Prisma 7 membaca URL dari `prisma.config.ts`, **bukan** dari blok `datasource` di `schema.prisma`. Jika Anda memindahkan database, ubah di `.env`.

> `.env`, `node_modules/`, `prisma/dev.db`, dan `lib/generated/prisma/` sudah di-`.gitignore`. Jangan pernah meng-commit `.env`.

## Struktur

```
app/                     route (page, layout, receipt/[invoice])
features/
  cart/       action/ components/ lib/
  catalog/    action/ components/ lib/
  checkout/   action/ components/ lib/
  receipt/    action/ components/
  layout/     components/
lib/                     db, money, promo, cart, format (lintas-feature)
components/ui/           primitif shadcn
prisma/                  schema, migrasi, seed
```

Aturan batas: `features/*` boleh mengimpor `lib/*`; `lib/*` tidak boleh mengimpor `features/*`.

## Alur Kasir

1. Cari menu atau pilih tab kategori.
2. Tekan **+** pada kartu produk untuk menambah ke keranjang.
3. Atur jumlah, lalu masukkan kode promo **`DIGIZEN10`** (diskon 10%, minimum Rp50.000).
4. Pilih **Tunai** atau **QRIS**, lalu **Bayar Sekarang**.
5. Struk terbuka otomatis dan siap **Cetak** (thermal 80mm).

Pintasan: `/` fokus ke pencarian, `Esc` menutup dialog.

## Perhitungan Uang

Semua nominal bilangan bulat rupiah, dihitung di satu fungsi murni (`lib/money.ts`):

```
Subtotal  = Σ harga × jumlah
Diskon    = PERCENT atau FIXED, dibatasi 0 ≤ diskon ≤ subtotal
PPN       = round(10% × (Subtotal − Diskon))
Total     = Subtotal − Diskon + PPN
```

Contoh: 2× Butterscotch (Rp20.000) + 1× Nasi Ayam Katsu (Rp25.000) = Rp65.000 → diskon Rp6.500 → PPN Rp5.850 → **Total Rp64.350**.

Harga, stok, dan promo **selalu dibaca ulang di server** saat checkout; client hanya mengirim ID produk dan jumlah.

## Troubleshooting

**`ERR_PNPM_IGNORED_BUILDS`** — dependency native butuh izin build. Sudah dikonfigurasi di `pnpm-workspace.yaml`; jalankan `pnpm approve-builds` jika tetap muncul.

**`Cannot find module ./generated/prisma/...`** — client Prisma belum dibuat. Jalankan `pnpm db:migrate` (menjalankan `prisma generate`), atau langsung `pnpm exec prisma generate`.

**`Route "/" encountered uncached or runtime data during prerendering`** — proyek memakai `cacheComponents: true`. Query database memanggil `await connection()` dan dibungkus `<Suspense>`; pertahankan pola ini saat menambah halaman baru yang membaca database.

**Database terkunci / data aneh** — hentikan dev server, lalu `pnpm db:reset`.

**Prisma menolak `migrate reset` saat dijalankan agen** — pengaman Prisma. Hapus `prisma/dev.db`, lalu `pnpm exec prisma migrate deploy && pnpm db:seed`.
