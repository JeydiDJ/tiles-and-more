import { Container } from "@/components/layout/container";
import { CategoryGrid } from "@/components/catalog/category-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { getCategories } from "@/services/category.service";
import { getProducts } from "@/services/product.service";

export default async function CatalogPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <Container className="py-20">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold">Catalog</h1>
        <p className="mt-3 text-[var(--muted)]">All products, categories, and filters live here.</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <ProductFilters />
        <ProductGrid products={products} />
      </div>
      <div className="mt-16">
        <CategoryGrid categories={categories} />
      </div>
    </Container>
  );
}
