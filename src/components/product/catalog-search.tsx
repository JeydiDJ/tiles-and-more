"use client";

import { useDeferredValue, useEffect, useRef } from "react";
import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useFilters } from "@/store/use-filters";

type CatalogSearchProps = {
  products: Product[];
  initialQuery?: string;
  initialBrand?: string;
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current">
      <circle cx="11" cy="11" r="6.25" strokeWidth="1.8" />
      <path d="m16 16 4 4" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function isPresent(value: string | null | undefined): value is string {
  return Boolean(value);
}

export function CatalogSearch({ products, initialQuery = "", initialBrand = "all" }: CatalogSearchProps) {
  const resultsRef = useRef<HTMLElement | null>(null);
  const {
    query,
    setQuery,
    category,
    setCategory,
    brand,
    setBrand,
    material,
    setMaterial,
    finish,
    setFinish,
    application,
    setApplication,
    resetFilters,
  } = useFilters(initialQuery, initialBrand);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const hasSearch = normalizedQuery.length > 0;
  const hasActiveFilters =
    hasSearch ||
    category !== "all" ||
    brand !== "all" ||
    material !== "all" ||
    finish !== "all" ||
    application !== "all";

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery, setQuery]);

  useEffect(() => {
    setBrand(initialBrand);
  }, [initialBrand, setBrand]);

  useEffect(() => {
    if (window.location.hash !== "#catalog-results") {
      return;
    }

    const scrollToResults = () => {
      resultsRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
    };

    scrollToResults();
    const timeout = window.setTimeout(scrollToResults, 250);

    return () => window.clearTimeout(timeout);
  }, []);

  const categoryOptions = Array.from(new Set(products.map((product) => product.category).filter(isPresent))).sort((a, b) =>
    a.localeCompare(b),
  );
  const brandOptions = Array.from(new Set(products.map((product) => product.brandName).filter(isPresent))).sort((a, b) =>
    a.localeCompare(b),
  );
  const materialOptions = Array.from(new Set(products.map((product) => product.material).filter(isPresent))).sort((a, b) =>
    a.localeCompare(b),
  );
  const finishOptions = Array.from(new Set(products.map((product) => product.finish).filter(isPresent))).sort((a, b) =>
    a.localeCompare(b),
  );
  const applicationOptions = Array.from(
    new Set(products.flatMap((product) => product.applications).filter(isPresent)),
  ).sort((a, b) => a.localeCompare(b));

  const filteredProducts = products.filter((product) => {
    const matchesQuery = normalizedQuery
      ? [
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
          .includes(normalizedQuery)
      : true;

    const matchesCategory = category === "all" || product.category === category;
    const matchesBrand = brand === "all" || product.brandName === brand;
    const matchesMaterial = material === "all" || product.material === material;
    const matchesFinish = finish === "all" || product.finish === finish;
    const matchesApplication = application === "all" || product.applications.includes(application);

    return (
      matchesQuery &&
      matchesCategory &&
      matchesBrand &&
      matchesMaterial &&
      matchesFinish &&
      matchesApplication
    );
  });

  const activePills = [
    hasSearch ? { key: "query", label: `Search: ${query.trim()}` } : null,
    category !== "all" ? { key: "category", label: category } : null,
    brand !== "all" ? { key: "brand", label: brand } : null,
    material !== "all" ? { key: "material", label: material } : null,
    finish !== "all" ? { key: "finish", label: finish } : null,
    application !== "all" ? { key: "application", label: application } : null,
  ].filter(Boolean) as Array<{ key: string; label: string }>;

  function clearFilter(key: string) {
    if (key === "query") setQuery("");
    if (key === "category") setCategory("all");
    if (key === "brand") setBrand("all");
    if (key === "material") setMaterial("all");
    if (key === "finish") setFinish("all");
    if (key === "application") setApplication("all");
  }

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
          </div>
        </div>
      </div>

      <section
        id="catalog-results"
        ref={resultsRef}
        className="page-section mt-10 scroll-mt-24 sm:mt-14 sm:scroll-mt-28"
      >
        <div className="grid gap-0 border-y border-[var(--border)] lg:grid-cols-[0.72fr_1.28fr]">
          <div className="editorial-band border-b border-[var(--border)] px-6 py-10 sm:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
            <p className="page-kicker">Advanced Filters</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Refine the catalog by surface details.</h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--muted)] sm:text-base">
              Narrow the selection by category, brand, finish, material, and application to find the right product faster.
            </p>

            <div className="mt-8 grid gap-4">
              <Select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">
                <option value="all">All categories</option>
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>

              <Select value={brand} onChange={(event) => setBrand(event.target.value)} aria-label="Filter by brand">
                <option value="all">All brands</option>
                {brandOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>

              <Select value={material} onChange={(event) => setMaterial(event.target.value)} aria-label="Filter by material">
                <option value="all">All materials</option>
                {materialOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>

              <Select value={finish} onChange={(event) => setFinish(event.target.value)} aria-label="Filter by finish">
                <option value="all">All finishes</option>
                {finishOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>

              <Select
                value={application}
                onChange={(event) => setApplication(event.target.value)}
                aria-label="Filter by application"
              >
                <option value="all">All applications</option>
                {applicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--border)] pt-5">
              <p className="text-sm uppercase tracking-[0.16em] text-[var(--muted)]">
                {filteredProducts.length} {filteredProducts.length === 1 ? "result" : "results"}
              </p>
              <Button variant="secondary" onClick={resetFilters} disabled={!hasActiveFilters} className="px-4 py-2.5">
                Clear all
              </Button>
            </div>
          </div>

          <div className="bg-white px-6 py-10 sm:px-8 lg:px-10 lg:py-12">
            {activePills.length > 0 ? (
              <div className="mb-6 flex flex-wrap gap-2">
                {activePills.map((pill) => (
                  <button
                    key={pill.key}
                    type="button"
                    onClick={() => clearFilter(pill.key)}
                    className="inline-flex items-center gap-2 border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                  >
                    <span>{pill.label}</span>
                    <span aria-hidden="true">&times;</span>
                  </button>
                ))}
              </div>
            ) : null}

            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <div className="border border-[var(--border)] bg-[#f9f7f4] px-6 py-12 text-center">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">No matching products</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                  Try broadening one or two filters.
                </h3>
                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[var(--muted)]">
                  Adjust the selected finish, material, or application filters to explore more surfaces from the catalog.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
