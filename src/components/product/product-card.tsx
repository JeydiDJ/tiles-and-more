import Link from "next/link";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="editorial-panel border-t-[3px] border-t-[var(--brand)] p-6">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{product.category}</p>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight">{product.name}</h3>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{product.summary}</p>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4 text-sm">
        <span>{formatCurrency(product.price)}/sqft</span>
        <Link href={`/products/${product.slug}`} className="font-medium uppercase tracking-[0.12em] text-[var(--brand)]">
          View surface
        </Link>
      </div>
    </article>
  );
}
