import { CategoryGrid } from "@/components/catalog/category-grid";
import { CatalogSearch } from "@/components/product/catalog-search";
import { createPageMetadata } from "@/lib/seo";
import { getCategories } from "@/services/category.service";
import { getProducts } from "@/services/product.service";

export const metadata = createPageMetadata({
  title: "Catalog",
  description:
    "Browse the Tiles & More catalog of tiles, slabs, sanitary products, and specialty surfaces for residential and commercial projects.",
  path: "/catalog",
  keywords: ["tile catalog", "surface catalog", "sanitary catalog", "tiles and more products"],
});

type CatalogPageProps = {
  searchParams?: Promise<{ q?: string; brand?: string }>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialQuery = resolvedSearchParams?.q ?? "";
  const initialBrand = resolvedSearchParams?.brand ?? "all";

  return (
    <section className="pb-20 sm:pb-24">
      <CatalogSearch products={products} initialQuery={initialQuery} initialBrand={initialBrand} />

      <div className="page-section mt-14 border-t border-[var(--border)] pt-10">
        <div className="mb-8 flex items-end justify-between gap-6 px-0">
          <div>
            <p className="page-kicker">Categories</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Browse by Category</h2>
          </div>
        </div>
        <CategoryGrid categories={categories} />
      </div>
    </section>
  );
}
