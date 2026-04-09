import type { Product } from "@/types/product";
import { Container } from "@/components/layout/container";
import { ProductGrid } from "@/components/product/product-grid";

type FeaturedProductsProps = {
  products: Product[];
};

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-16">
      <Container>
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--brand-dark)]">Featured Looks</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold">Signature surfaces to anchor the visual identity</h2>
          <p className="mt-4 max-w-3xl text-[var(--muted)]">
            Instead of reading like raw inventory, the homepage should spotlight a few highly photogenic selections that communicate taste, finish, and scale.
          </p>
        </div>
        <ProductGrid products={products} />
      </Container>
    </section>
  );
}
