import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
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
    <Container className="py-20">
      <h1 className="text-4xl font-semibold">{categoryData.name}</h1>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">{categoryData.description}</p>
      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </Container>
  );
}
