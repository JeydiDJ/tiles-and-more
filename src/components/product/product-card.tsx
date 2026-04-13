import Link from "next/link";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="editorial-panel border-t-[3px] border-t-[var(--brand)] p-6 text-[var(--foreground)]">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{product.category}</p>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight">{product.name}</h3>
      <p className="mt-2 text-sm uppercase tracking-[0.14em] text-[var(--brand-dark)]">{product.brandName}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{product.summary ?? "No summary added yet."}</p>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4 text-sm">
        <span>{product.productCode}</span>
        <Link href={`/products/${product.slug}`} className="font-medium uppercase tracking-[0.12em] text-[var(--brand)]">
          View surface
        </Link>
      </div>
    </article>
  );
}
