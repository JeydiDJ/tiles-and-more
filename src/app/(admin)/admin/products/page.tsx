import Link from "next/link";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
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
        <div className="grid gap-0 border-t border-[var(--border)]">
          {products.map((product) => (
            <div key={product.id} className="grid gap-4 border-b border-[var(--border)] py-4 md:grid-cols-[1.3fr_0.8fr_0.7fr_auto] md:items-center md:gap-6">
              <div>
                <Link href={getAdminRoute(`/products/${product.id}`)} className="font-medium text-[#231f20] transition hover:text-[var(--brand)]">
                  {product.name}
                </Link>
                <p className="mt-1 text-sm text-[var(--muted)]">{product.productCode}</p>
              </div>
              <div className="text-sm text-[var(--muted)]">
                <p>{product.brandName}</p>
                <p className="mt-1">{product.category}</p>
              </div>
              <div className="text-sm text-[var(--muted)]">{product.productFamily}</div>
              <DeleteProductButton productId={product.id} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--muted)]">No products added yet.</p>
      )}
    </div>
  );
}
