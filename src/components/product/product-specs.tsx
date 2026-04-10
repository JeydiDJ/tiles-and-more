import type { Product } from "@/types/product";

type ProductSpecsProps = {
  product: Product;
};

export function ProductSpecs({ product }: ProductSpecsProps) {
  return (
    <dl className="grid gap-0 bg-white sm:grid-cols-2">
      <div className="border-b border-[var(--border)] px-6 py-6 sm:border-r">
        <dt className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Finish</dt>
        <dd className="mt-1 font-medium">{product.finish}</dd>
      </div>
      <div className="border-b border-[var(--border)] px-6 py-6">
        <dt className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Size</dt>
        <dd className="mt-1 font-medium">{product.size}</dd>
      </div>
      <div className="border-b border-[var(--border)] px-6 py-6 sm:border-b-0 sm:border-r">
        <dt className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Material</dt>
        <dd className="mt-1 font-medium">{product.material}</dd>
      </div>
      <div className="px-6 py-6">
        <dt className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Collection</dt>
        <dd className="mt-1 font-medium">{product.collection}</dd>
      </div>
    </dl>
  );
}
