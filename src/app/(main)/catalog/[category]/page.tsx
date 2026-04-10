import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/product-grid";
import { getCategoryBySlug } from "@/services/category.service";
import { getProductsByCategory } from "@/services/product.service";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryData = await getCategoryBySlug(category);

  if (!categoryData) {
    notFound();
  }

  const products = await getProductsByCategory(category);

  return (
    <section className="page-section py-20 sm:py-24">
      <div className="grid gap-0 border-y border-[var(--border)] lg:grid-cols-[0.75fr_1.25fr]">
        <div className="editorial-band px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
          <p className="page-kicker text-white/70">Category</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">{categoryData.name}</h1>
          <p className="mt-6 max-w-sm text-white/74">{categoryData.description}</p>
        </div>
        <div className="bg-white px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
          <ProductGrid products={products} />
        </div>
      </div>
    </section>
  );
}
