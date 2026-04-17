import Link from "next/link";
import { AdminProductsTable } from "@/components/admin/admin-products-table";
import { getAdminRoute } from "@/lib/admin-path";
import { getProducts } from "@/services/product.service";

function ProductMetric({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_14px_30px_rgba(35,31,32,0.04)]">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#9793a0]">{label}</p>
      <p className="mt-3 text-[2rem] font-semibold tracking-tight text-[#17141a]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#6f6a75]">{note}</p>
    </div>
  );
}

export default async function AdminProductsPage() {
  const products = await getProducts();
  const brandCount = new Set(products.map((product) => product.brandName)).size;
  const categoryCount = new Set(products.map((product) => product.category)).size;
  const withImagesCount = products.filter((product) => Boolean(product.imageUrl)).length;
  const imageCoverage = products.length > 0 ? Math.round((withImagesCount / products.length) * 100) : 0;
  const materialCount = new Set(products.map((product) => product.material).filter(Boolean)).size;

  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-[#e3e7f0] bg-white shadow-[0_14px_30px_rgba(35,31,32,0.04)]">
        <div className="border-b border-[#edf0f6] bg-[#fafbfe] px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#9793a0]">Catalog Workspace</p>
              <h1 className="mt-2 text-[1.7rem] font-semibold tracking-tight text-[#17141a] sm:text-[2rem]">Products</h1>
              <p className="mt-2 text-sm leading-6 text-[#6f6a75]">Maintain product structure, showroom content quality, and browsing readiness in one place.</p>
            </div>

            <Link
              href={getAdminRoute("/products/new")}
              className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_24px_rgba(237,35,37,0.18)] transition hover:bg-[var(--brand-dark)] sm:w-auto"
            >
              New Product
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-[#edf0f6] px-5 py-3 sm:px-6">
          <span className="inline-flex items-center rounded-full bg-[#17141a] px-3 py-1.5 text-xs font-medium text-white">Table workspace</span>
          <span className="inline-flex items-center rounded-full border border-[#e4e7ef] bg-white px-3 py-1.5 text-xs font-medium text-[#6f6a75]">
            Search, filter, and bulk actions enabled
          </span>
          <span className="inline-flex items-center rounded-full border border-[#e4e7ef] bg-white px-3 py-1.5 text-xs font-medium text-[#6f6a75]">
            {withImagesCount} with main image
          </span>
        </div>

        <div className="grid gap-4 px-5 py-5 sm:px-6 sm:grid-cols-2 xl:grid-cols-3">
          <ProductMetric label="Catalog Size" value={String(products.length)} note="Total entries currently active in the product library." />
          <ProductMetric label="Coverage" value={String(brandCount)} note={`${categoryCount} categories and ${materialCount} material groupings tracked.`} />
          <ProductMetric label="Image Readiness" value={`${imageCoverage}%`} note="Main image coverage across the current catalog." />
        </div>
      </section>

      {products.length > 0 ? (
        <AdminProductsTable products={products} />
      ) : (
        <div className="rounded-[1.5rem] border border-[#e7e9f2] bg-white px-6 py-10 text-sm text-[#6f6a75] shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
          No products added yet.
        </div>
      )}
    </div>
  );
}
