import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";
import { getAdminRoute } from "@/lib/admin-path";
import { getProductFormOptions } from "@/services/product.service";

export default async function NewProductPage() {
  const options = await getProductFormOptions();

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="grid gap-6">
        <section className="rounded-[1.75rem] border border-[#e7e9f2] bg-white px-6 py-6 shadow-[0_14px_30px_rgba(35,31,32,0.04)] sm:px-7 sm:py-7">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#9793a0]">Products</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-[#17141a] sm:text-[2.6rem]">Create Product</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f6a75]">
                Add a new catalog item with the classification and showroom details needed for structured browsing.
              </p>
            </div>
            <Link href={getAdminRoute("/products")} className="text-sm font-medium text-[var(--brand)] transition hover:text-[var(--brand-dark)]">
              Back to products
            </Link>
          </div>
        </section>
        <ProductForm options={options} />
      </div>

      <aside className="grid gap-4 self-start">
        <section className="rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#9793a0]">Checklist</p>
          <div className="mt-4 grid gap-3 text-sm text-[#6f6a75]">
            <p>Name, product code, brand, category, and family are required.</p>
            <p>Applications should be comma-separated for easier filtering later.</p>
            <p>Use concise summaries that help sales and showroom browsing.</p>
          </div>
        </section>
        <section className="rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#9793a0]">Media Note</p>
          <p className="mt-4 text-sm leading-7 text-[#6f6a75]">
            A strong application image improves the catalog card and product detail presentation immediately.
          </p>
        </section>
      </aside>
    </div>
  );
}
