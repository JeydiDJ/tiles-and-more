import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductSpecs } from "@/components/product/product-specs";
import { getProductBySlug } from "@/services/product.service";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <Container className="py-20">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <ProductGallery title={product.name} />
        <div className="space-y-6">
          <div className="surface-card rounded-3xl p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">{product.category}</p>
            <h1 className="mt-3 text-4xl font-semibold">{product.name}</h1>
            <p className="mt-4 text-[var(--muted)]">{product.summary}</p>
          </div>
          <ProductSpecs product={product} />
        </div>
      </div>
    </Container>
  );
}
