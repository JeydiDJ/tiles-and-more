import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group editorial-panel overflow-hidden border-t-[3px] border-t-[var(--brand)] text-[var(--foreground)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(35,31,32,0.12)]">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#f3efe9]">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 44vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
              Image coming soon
            </div>
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_35%,rgba(0,0,0,0.12)_100%)] opacity-0 transition duration-300 group-hover:opacity-100" />
        </div>
        <div className="p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{product.category}</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-[var(--brand)]">
            {product.name}
          </h3>
          <p className="mt-2 text-sm uppercase tracking-[0.14em] text-[var(--brand-dark)]">{product.brandName}</p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{product.summary ?? "No summary added yet."}</p>
          <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4 text-sm">
            <span>{product.productCode}</span>
            <span className="font-medium uppercase tracking-[0.12em] text-[var(--brand)] transition-transform duration-300 group-hover:translate-x-1">
              View surface
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
