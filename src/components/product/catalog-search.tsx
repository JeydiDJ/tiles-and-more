"use client";

import { useDeferredValue, useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/product/product-grid";

type CatalogSearchProps = {
  products: Product[];
  initialQuery?: string;
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current">
      <circle cx="11" cy="11" r="6.25" strokeWidth="1.8" />
      <path d="m16 16 4 4" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CatalogSearch({ products, initialQuery = "" }: CatalogSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const filteredProducts = normalizedQuery
    ? products.filter((product) =>
        [
          product.name,
          product.category,
          product.brandName,
          product.productFamily,
          product.material,
          product.finish,
          product.productCode,
          product.summary,
          product.applications.join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : products;

  return (
    <div className="grid gap-0">
      <div className="relative overflow-hidden border-y border-[var(--border)] bg-[#1d1a1b] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-images/catalog-hero.png')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,16,16,0.26)_0%,rgba(18,16,16,0.2)_30%,rgba(18,16,16,0.5)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_24%),radial-gradient(circle_at_80%_22%,rgba(255,255,255,0.1),transparent_30%)]" />
        <div className="absolute right-[-4%] top-[12%] h-56 w-56 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-8 w-8 animate-bounce text-white/80"
          >
            <path
              d="m6 9 6 6 6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="relative flex min-h-screen items-center px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="mx-auto w-full max-w-5xl">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.28em] text-white/72">Catalog</p>
              <h1 className="mx-auto mt-4 max-w-[12ch] text-5xl font-semibold leading-none tracking-tight text-white sm:text-6xl lg:text-[5.2rem]">
                Find surfaces faster.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
                Search by product name, code, brand, family, category, material, or finish.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-3xl">
              <label htmlFor="catalog-search" className="sr-only">
                Search Products
              </label>
              <div className="flex items-center gap-4 border border-white/22 bg-white/92 px-5 py-4 shadow-[0_20px_40px_rgba(0,0,0,0.16)] transition focus-within:border-[var(--brand)] sm:px-6 sm:py-5">
                <span className="text-[var(--muted)]">
                  <SearchIcon />
                </span>
                <input
                  id="catalog-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search products, brands, categories, or materials"
                  className="w-full bg-transparent text-base text-[var(--foreground)] outline-none placeholder:text-[#8f8b85] sm:text-lg"
                />
              </div>
            </div>

            {isSearching ? (
              <div className="fade-up mx-auto mt-4 max-w-5xl">
                {filteredProducts.length > 0 ? (
                  <div className="border-x border-b border-white/14 bg-[#f9f7f4] px-5 py-6 sm:px-6">
                    <ProductGrid products={filteredProducts} />
                  </div>
                ) : (
                  <div className="border-x border-b border-white/14 bg-[#f9f7f4] px-5 py-10 text-center sm:px-6">
                    <p className="text-sm text-[var(--muted)]">No products matched your search.</p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
