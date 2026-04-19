"use client";

import Link from "next/link";
import { useActionState, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/types/product";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { deleteProductsAction, type ProductDeleteState } from "@/app/(admin)/admin/products/actions";
import { getAdminRoute } from "@/lib/admin-path";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";

type AdminProductsTableProps = {
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

export function AdminProductsTable({ products }: AdminProductsTableProps) {
  const [bulkState, bulkAction, isBulkPending] = useActionState(deleteProductsAction, { error: null } satisfies ProductDeleteState);
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("all");
  const [category, setCategory] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const wasBulkPending = useRef(false);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const brandOptions = useMemo(
    () => Array.from(new Set(products.map((product) => product.brandName))).sort((a, b) => a.localeCompare(b)),
    [products],
  );

  const categoryOptions = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).sort((a, b) => a.localeCompare(b)),
    [products],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery = normalizedQuery
        ? [
            product.name,
            product.productCode,
            product.brandName,
            product.category,
            product.productFamily,
            product.material ?? "",
            product.finish ?? "",
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        : true;

      const matchesBrand = brand === "all" || product.brandName === brand;
      const matchesCategory = category === "all" || product.category === category;

      return matchesQuery && matchesBrand && matchesCategory;
    });
  }, [brand, category, normalizedQuery, products]);

  const categoryBreakdown = useMemo(() => {
    return categoryOptions
      .map((item) => ({
        name: item,
        count: products.filter((product) => product.category === item).length,
      }))
      .filter((item) => item.count > 0)
      .slice(0, 6);
  }, [categoryOptions, products]);

  const allFilteredSelected = filteredProducts.length > 0 && filteredProducts.every((product) => selectedIds.includes(product.id));

  useEffect(() => {
    setSelectedIds((current) => current.filter((id) => products.some((product) => product.id === id)));
  }, [products]);

  useEffect(() => {
    if (wasBulkPending.current && !isBulkPending && !bulkState.error) {
      setIsBulkModalOpen(false);
      setSelectedIds([]);
    }
    wasBulkPending.current = isBulkPending;
  }, [bulkState.error, isBulkPending]);

  function toggleSelected(productId: string) {
    setSelectedIds((current) => (current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]));
  }

  function toggleSelectAllFiltered() {
    setSelectedIds((current) => {
      if (allFilteredSelected) {
        return current.filter((id) => !filteredProducts.some((product) => product.id === id));
      }

      const next = new Set(current);
      filteredProducts.forEach((product) => next.add(product.id));
      return Array.from(next);
    });
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-[1.5rem] border border-[#e3e7f0] bg-white shadow-[0_12px_26px_rgba(35,31,32,0.04)]">
        <div className="grid gap-4 border-b border-[#edf0f6] px-4 py-4 sm:px-5 lg:grid-cols-[1.25fr_0.7fr_0.7fr_auto] lg:items-end">
          <label className="grid gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">Search</span>
            <div className="admin-search-surface flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
              <span className="text-[var(--muted)]">
                <SearchIcon />
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, code, brand, family, material, or finish"
                className="admin-search-input w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[#8f8b85]"
              />
            </div>
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">Brand</span>
            <Select value={brand} onChange={(event) => setBrand(event.target.value)}>
              <option value="all">All brands</option>
              {brandOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">Category</span>
            <Select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">All categories</option>
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </label>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <span className="inline-flex rounded-full border border-[#e7e9f2] bg-[#fafbfe] px-3 py-2 text-xs font-medium text-[#6f6a75]">
              {filteredProducts.length} visible
            </span>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setBrand("all");
                setCategory("all");
              }}
              className="cursor-pointer rounded-full border border-[#e7e9f2] bg-white px-3 py-2 text-xs font-medium text-[#17141a] transition hover:border-[#cfd5e2] hover:bg-[#fafbfe]"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 px-4 py-3 text-xs text-[#6f6a75] sm:px-5">
          {categoryBreakdown.map((item) => (
            <span key={item.name} className="inline-flex items-center gap-2 rounded-full border border-[#e7e9f2] bg-[#fafbfe] px-3 py-1.5 font-medium">
              {item.name}
              <span className="text-[#9793a0]">{item.count}</span>
            </span>
          ))}
        </div>
      </section>

      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
          {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
        </p>
        <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
          {selectedIds.length > 0 ? (
            <button
              type="button"
              onClick={() => setIsBulkModalOpen(true)}
              className="cursor-pointer text-sm font-medium text-[#b42318] transition hover:text-[#7a1b14]"
            >
              Delete selected ({selectedIds.length})
            </button>
          ) : null}
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="overflow-hidden rounded-[1.5rem] border border-[#e3e7f0] bg-white shadow-[0_12px_26px_rgba(35,31,32,0.04)]">
          <div className="hidden grid-cols-[auto_1.45fr_0.75fr_0.8fr_0.8fr_0.7fr_auto] gap-4 border-b border-[var(--border)] bg-[#fafbfe] px-5 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted)] lg:grid">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={allFilteredSelected}
                onChange={toggleSelectAllFiltered}
                className="h-4 w-4 cursor-pointer accent-[var(--brand)]"
              />
            </label>
            <span>Product</span>
            <span>Code</span>
            <span>Brand</span>
            <span>Category</span>
            <span>Finish</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="grid gap-0">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="grid gap-3 border-b border-[var(--border)] px-4 py-4 transition hover:bg-[#fcfcfe] last:border-b-0 sm:px-5 lg:grid-cols-[auto_1.45fr_0.75fr_0.8fr_0.8fr_0.7fr_auto] lg:items-start lg:gap-4 lg:py-5"
              >
                <label className="flex items-center lg:self-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(product.id)}
                    onChange={() => toggleSelected(product.id)}
                    className="h-4 w-4 cursor-pointer accent-[var(--brand)]"
                    aria-label={`Select ${product.name}`}
                  />
                </label>

                <div className="min-w-0">
                  <Link href={getAdminRoute(`/products/${product.id}`)} className="font-medium text-[#231f20] transition hover:text-[var(--brand)]">
                    {product.name}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-[var(--muted)]">
                    <span className="min-w-0 truncate">{product.productFamily}</span>
                    <span className="inline-flex rounded-full border border-[#e7e9f2] bg-[#fafbfe] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#6f6a75]">
                      {product.imageUrl ? "Image ready" : "No image"}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-[var(--muted)]">
                  <span className="lg:hidden text-[11px] font-medium uppercase tracking-[0.16em] text-[#8f8b85]">Code: </span>
                  {product.productCode}
                </div>

                <div className="text-sm text-[var(--muted)]">
                  <span className="lg:hidden text-[11px] font-medium uppercase tracking-[0.16em] text-[#8f8b85]">Brand: </span>
                  {product.brandName}
                </div>

                <div className="text-sm text-[var(--muted)]">
                  <span className="lg:hidden text-[11px] font-medium uppercase tracking-[0.16em] text-[#8f8b85]">Category: </span>
                  {product.category}
                </div>

                <div className="text-sm text-[var(--muted)]">
                  <span className="lg:hidden text-[11px] font-medium uppercase tracking-[0.16em] text-[#8f8b85]">Finish: </span>
                  {product.finish ?? "-"}
                </div>

                <div className="grid gap-2 sm:grid-cols-2 lg:hidden">
                  <div className="rounded-lg border border-[#edf0f6] bg-[#fafbfe] px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#9793a0]">Code</p>
                    <p className="mt-1 text-sm text-[#3e3944]">{product.productCode}</p>
                  </div>
                  <div className="rounded-lg border border-[#edf0f6] bg-[#fafbfe] px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#9793a0]">Brand</p>
                    <p className="mt-1 text-sm text-[#3e3944]">{product.brandName}</p>
                  </div>
                  <div className="rounded-lg border border-[#edf0f6] bg-[#fafbfe] px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#9793a0]">Category</p>
                    <p className="mt-1 text-sm text-[#3e3944]">{product.category}</p>
                  </div>
                  <div className="rounded-lg border border-[#edf0f6] bg-[#fafbfe] px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#9793a0]">Finish</p>
                    <p className="mt-1 text-sm text-[#3e3944]">{product.finish ?? "-"}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 lg:justify-end">
                  <Link
                    href={getAdminRoute(`/products/${product.id}`)}
                    className="inline-flex items-center justify-center rounded-sm border border-[var(--border)] px-3 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#231f20] transition hover:border-[#ed2325]/30 hover:text-[var(--brand)] sm:px-4 sm:text-xs"
                  >
                    Edit
                  </Link>
                  <DeleteProductButton productId={product.id} productName={product.name} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-[var(--border)] bg-white px-5 py-10 text-sm text-[var(--muted)]">
          No products match the current search or filters.
        </div>
      )}

      <Modal
        open={isBulkModalOpen}
        onClose={() => (isBulkPending ? null : setIsBulkModalOpen(false))}
        title="Delete selected products?"
        description={`This will permanently remove ${selectedIds.length} selected product${selectedIds.length === 1 ? "" : "s"} from the catalog. This action cannot be undone.`}
      >
        <form action={bulkAction} className="grid gap-4">
          {selectedIds.map((id) => (
            <input key={id} type="hidden" name="productIds" value={id} />
          ))}
          {bulkState.error ? <p className="text-sm text-[#b42318]">{bulkState.error}</p> : null}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsBulkModalOpen(false)}
              disabled={isBulkPending}
              className="inline-flex cursor-pointer items-center justify-center rounded-sm border border-[var(--border)] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[#231f20] transition hover:border-[#231f20]/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isBulkPending}
              className="inline-flex cursor-pointer items-center justify-center rounded-sm bg-[#b42318] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-white transition hover:bg-[#7a1b14] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isBulkPending ? "Deleting..." : "Delete Selected"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
