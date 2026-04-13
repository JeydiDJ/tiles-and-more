import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";
import { getAdminRoute } from "@/lib/admin-path";
import { getProductFormOptions } from "@/services/product.service";

export default async function NewProductPage() {
  const options = await getProductFormOptions();

  return (
    <div className="grid gap-6">
      <section className="border-b border-[var(--border)] pb-5">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">Products</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Add Product</h1>
          <Link href={getAdminRoute("/products")} className="text-sm font-medium text-[var(--brand)] transition hover:text-[var(--brand-dark)]">
            Back to products
          </Link>
        </div>
      </section>
      <ProductForm options={options} />
    </div>
  );
}
