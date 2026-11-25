// Seed data sourced from digidreams.id/products (name, description, price, image).
export type SeedProduct = {
  slug: string
  name: string
  category: string
  price: number
  stock: number
  description: string
  imageUrl: string | null
}

export const CATEGORIES = [
  { slug: "coffee", name: "Coffee" },
  { slug: "non-coffee", name: "Non-Coffee" },
  { slug: "food", name: "Food" },
  { slug: "coworking", name: "Coworking" },
]

export const PRODUCTS: SeedProduct[] = [
  {
    slug: "butterschoth",
    name: "Butterscotch Legit",
    category: "coffee",
    price: 20000,
    stock: 120,
    description: "Minuman kopi blend Arabika & Robusta manis legit dengan lelehan butterscotch butter caramel khas.",
    imageUrl: "https://yynwzhiazwhtnrdbobyd.supabase.co/storage/v1/object/public/product-images/8264192b-cf99-490a-977a-88a442a77bdd.webp",
  },
  {
    slug: "americano-reserve-arabika",
    name: "Americano Reserve Arabika",
    category: "coffee",
    price: 15000,
    stock: 120,
    description: "Double shot espresso blend Arabika & Robusta dengan rasa tebal seimbang, segar tanpa gula bikin melek seketika saat nugas di Sukoharjo & Solo.",
    imageUrl: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "cappucino-creamy",
    name: "Cappuccino Creamy",
    category: "coffee",
    price: 20000,
    stock: 120,
    description: "Pilihan kopi favorit dan menu andalan di Digidreams Cafe and Space Sukoharjo & Solo.",
    imageUrl: "https://yynwzhiazwhtnrdbobyd.supabase.co/storage/v1/object/public/product-images/7490de99-75ae-429e-9b80-3241c8f2df26.webp",
  },
  {
    slug: "salted-caramel",
    name: "Salted Caramel",
    category: "coffee",
    price: 20000,
    stock: 120,
    description: "Espresso blend Arabika & Robusta dengan saus karamel gurih manis dan sentuhan sea salt yang nagih.",
    imageUrl: "https://yynwzhiazwhtnrdbobyd.supabase.co/storage/v1/object/public/product-images/fc4af764-697a-4b75-9029-1c817bb490e9.webp",
  },
  {
    slug: "creamy-kyoto-matcha-latte",
    name: "Creamy Kyoto Matcha Latte",
    category: "non-coffee",
    price: 20000,
    stock: 120,
    description: "Matcha Uji murni impor Jepang berpadu dengan susu segar pilihan, rasa gurih legit seimbang tanpa pahit berlebih di Digidreams.",
    imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "red-velvet",
    name: "Red Velvet",
    category: "non-coffee",
    price: 18000,
    stock: 120,
    description: "Minuman red velvet manis lembut seperti rasa kue bolu cokelat mewah berpadu susu segar.",
    imageUrl: "https://yynwzhiazwhtnrdbobyd.supabase.co/storage/v1/object/public/product-images/6dbb9d68-04fe-4263-be4f-cc2c3a1d0ba0.webp",
  },
  {
    slug: "chocolate",
    name: "Chocolate",
    category: "non-coffee",
    price: 20000,
    stock: 120,
    description: "Cokelat pekat premium dengan susu hangat/dingin gurih kaya antioksidan.",
    imageUrl: "https://yynwzhiazwhtnrdbobyd.supabase.co/storage/v1/object/public/product-images/63b0dee1-e482-4ddb-af92-d6e8375625e1.webp",
  },
  {
    slug: "nasi-ayam-katsu",
    name: "Nasi Ayam Katsu",
    category: "food",
    price: 25000,
    stock: 60,
    description: "Nasi hangat pulen dengan potongan dada ayam fillet krispi renyah dan saus racikan spesial.",
    imageUrl: "https://yynwzhiazwhtnrdbobyd.supabase.co/storage/v1/object/public/product-images/648409d5-eebe-4c26-b289-de3abd75f8e3.webp",
  },
  {
    slug: "mix-platter",
    name: "Mix Platter",
    category: "food",
    price: 22000,
    stock: 60,
    description: "Kombo komplit kentang goreng crinkle, sosis bakar mini, dan nugget ayam renyah buat ramean di Digidreams Sukoharjo.",
    imageUrl: "https://yynwzhiazwhtnrdbobyd.supabase.co/storage/v1/object/public/product-images/6000daa6-a241-4f44-840a-51d46c722a91.webp",
  },
  {
    slug: "nasi-goreng-ayam",
    name: "Nasi Goreng Ayam",
    category: "food",
    price: 22000,
    stock: 60,
    description: "Nasi goreng bumbu rempah dapur spesial dengan suwiran ayam gurih dan aroma smoky wajan panas.",
    imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "paket-coworking-pelajar",
    name: "Paket Coworking Pelajar",
    category: "coworking",
    price: 8000,
    stock: 999,
    description: "Akses 8 jam khusus pelajar & mahasiswa aktif di Digidreams Sukoharjo. WiFi 100 Mbps, stopkontak mandiri di setiap meja, dan free refill air mineral.",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "paket-coworking-fullday",
    name: "Paket Coworking Full Day",
    category: "coworking",
    price: 45000,
    stock: 999,
    description: "Akses seharian penuh s/d 02.00 subuh di Digidreams Sukoharjo. Keluar-masuk bebas, free refill air mineral, WiFi 100 Mbps, dan diskon menu 10%.",
    imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80",
  },
]
