import type { ProductView } from "./queries"

export const ALL = "all"

/** Category tab + case-insensitive name search. "All" means every category. */
export function filterProducts(
  products: ProductView[],
  categorySlug: string,
  query: string,
): ProductView[] {
  const q = query.trim().toLowerCase()
  return products.filter(
    (p) =>
      (categorySlug === ALL || p.categorySlug === categorySlug) &&
      (q === "" || p.name.toLowerCase().includes(q)),
  )
}
