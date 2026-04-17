import Link from "next/link";
import { AdminProductsTable } from "@/components/admin/admin-products-table";
import { getAdminRoute } from "@/lib/admin-path";
import { getProducts } from "@/services/product.service";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="grid gap-6">
      <section className="border-b border-[var(--border)] pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">Products</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Products</h1>
          </div>
          <Link
            href={getAdminRoute("/products/new")}
            className="inline-flex items-center justify-center rounded-sm bg-[var(--brand)] px-5 py-3 text-sm font-medium uppercase tracking-[0.14em] text-white transition hover:bg-[var(--brand-dark)]"
          >
            New Product
          </Link>
        </div>
      </section>

      {products.length > 0 ? (
        <AdminProductsTable products={products} />
      ) : (
        <p className="text-sm text-[var(--muted)]">No products added yet.</p>
      )}
    </div>
  );
}
