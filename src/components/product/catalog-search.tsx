"use client";

import { useDeferredValue, useState } from "react";
import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/product/product-grid";

type CatalogSearchProps = {
  products: Product[];
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current">
      <circle cx="11" cy="11" r="6.25" strokeWidth="1.8" />
      <path d="m16 16 4 4" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CatalogSearch({ products }: CatalogSearchProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const filteredProducts = normalizedQuery
    ? products.filter((product) =>
        [
          product.name,
          product.category,
          product.collection,
          product.material,
          product.finish,
          product.size,
          product.summary,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : products;

  return (
    <div className="grid gap-8">
      <div className="overflow-hidden border border-[var(--border)] bg-[linear-gradient(145deg,#f7f4ef_0%,#ffffff_52%,#efebe5_100%)] shadow-[0_20px_50px_rgba(35,31,32,0.08)]">
        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b border-[var(--border)] px-6 py-10 sm:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
            <p className="page-kicker">Catalog Search</p>
            <h1 className="mt-4 text-4xl font-semibold leading-none tracking-tight sm:text-5xl">
              Find surfaces faster.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Search by product name, category, material, finish, collection, or size.
            </p>
          </div>

          <div className="px-6 py-10 sm:px-8 lg:px-10 lg:py-12">
            <label htmlFor="catalog-search" className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
              Search Products
            </label>
            <div className="mt-4 flex items-center gap-4 border border-[var(--border)] bg-white px-5 py-4 shadow-[0_16px_34px_rgba(35,31,32,0.06)] transition focus-within:border-[var(--brand)]">
              <span className="text-[var(--muted)]">
                <SearchIcon />
              </span>
              <input
                id="catalog-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search surfaces, finishes, categories, or materials"
                className="w-full bg-transparent text-base text-[var(--foreground)] outline-none placeholder:text-[#8f8b85]"
              />
            </div>
            <p className="mt-4 text-sm text-[var(--muted)]">
              {filteredProducts.length} {filteredProducts.length === 1 ? "result" : "results"} shown
            </p>
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="border border-[var(--border)] bg-white px-6 py-12 text-center shadow-[0_18px_40px_rgba(35,31,32,0.06)] sm:px-8">
          <p className="page-kicker">No Matches</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">No products found for that search.</h2>
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">
            Try a product name, finish, category, collection, or material keyword.
          </p>
        </div>
      )}
    </div>
  );
}
