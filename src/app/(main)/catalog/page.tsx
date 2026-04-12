import { CategoryGrid } from "@/components/catalog/category-grid";
import { CatalogSearch } from "@/components/product/catalog-search";
import { getCategories } from "@/services/category.service";
import { getProducts } from "@/services/product.service";

export default async function CatalogPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <section className="page-section py-20 sm:py-24">
      <CatalogSearch products={products} />

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
