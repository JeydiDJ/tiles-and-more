import { CategoryGrid } from "@/components/catalog/category-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { getCategories } from "@/services/category.service";
import { getProducts } from "@/services/product.service";

export default async function CatalogPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <section className="page-section py-20 sm:py-24">
      <div className="border-y border-[var(--border)]">
        <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
          <div className="editorial-band px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
            <p className="page-kicker">Catalog</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">Surface Library</h1>
            <p className="mt-6 max-w-sm text-[var(--muted)]">
              Explore product families, formats, and finish options in a cleaner specification-led layout.
            </p>
          </div>
          <div className="bg-white px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
            <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
              <ProductFilters />
              <ProductGrid products={products} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-14 border-t border-[var(--border)] pt-10">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="page-kicker">Collections</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Browse by Category</h2>
          </div>
        </div>
        <CategoryGrid categories={categories} />
      </div>
    </section>
  );
}
