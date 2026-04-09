import Link from "next/link";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="surface-card rounded-md p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{product.category}</p>
      <h3 className="mt-2 text-xl font-semibold">{product.name}</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{product.summary}</p>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span>{formatCurrency(product.price)}/sqft</span>
        <Link href={`/products/${product.slug}`} className="font-medium text-[var(--brand-dark)]">
          View surface
        </Link>
      </div>
    </article>
  );
}
