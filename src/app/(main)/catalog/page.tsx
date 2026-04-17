import { CategoryGrid } from "@/components/catalog/category-grid";
import { CatalogSearch } from "@/components/product/catalog-search";
import { getCategories } from "@/services/category.service";
import { getProducts } from "@/services/product.service";

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
