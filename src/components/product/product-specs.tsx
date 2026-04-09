import type { Product } from "@/types/product";

type ProductSpecsProps = {
  product: Product;
};

export function ProductSpecs({ product }: ProductSpecsProps) {
  return (
    <dl className="grid gap-4 rounded-md border border-[var(--border)] bg-white p-6 sm:grid-cols-2">
      <div>
        <dt className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Finish</dt>
        <dd className="mt-1 font-medium">{product.finish}</dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Size</dt>
        <dd className="mt-1 font-medium">{product.size}</dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Material</dt>
        <dd className="mt-1 font-medium">{product.material}</dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Collection</dt>
        <dd className="mt-1 font-medium">{product.collection}</dd>
      </div>
    </dl>
  );
}
