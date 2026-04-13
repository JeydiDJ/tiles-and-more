import { notFound } from "next/navigation";
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
    <section className="page-section py-20 sm:py-24">
      <div className="grid gap-0 border-y border-[var(--border)] lg:grid-cols-[1.15fr_0.85fr]">
        <ProductGallery title={product.name} imageUrl={product.imageUrl} media={product.media} />
        <div className="space-y-0 border-l border-[var(--border)] bg-white">
          <div className="border-b border-[var(--border)] px-6 py-10 sm:px-8 lg:px-10">
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">{product.category}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{product.name}</h1>
            <p className="mt-4 max-w-xl text-[var(--muted)]">{product.summary ?? "Product summary coming soon."}</p>
          </div>
          <ProductSpecs product={product} />
        </div>
      </div>
    </section>
  );
}
