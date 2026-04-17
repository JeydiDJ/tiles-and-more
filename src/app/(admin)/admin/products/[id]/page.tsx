import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";
import { getAdminRoute } from "@/lib/admin-path";
import { getProductById, getProductFormOptions } from "@/services/product.service";
import { notFound } from "next/navigation";

type AdminProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductDetailPage({ params }: AdminProductPageProps) {
  const { id } = await params;
  const [options, product] = await Promise.all([getProductFormOptions(), getProductById(id)]);

  if (!product) {
    notFound();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="grid gap-6">
        <section className="rounded-[1.75rem] border border-[#e7e9f2] bg-white px-6 py-6 shadow-[0_14px_30px_rgba(35,31,32,0.04)] sm:px-7 sm:py-7">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#9793a0]">Products</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-[#17141a] sm:text-[2.6rem]">Edit Product</h1>
              <p className="mt-3 text-sm leading-7 text-[#6f6a75]">
                Update the catalog metadata for <span className="font-medium text-[#17141a]">{product.name}</span>.
              </p>
            </div>
            <Link href={getAdminRoute("/products")} className="text-sm font-medium text-[var(--brand)] transition hover:text-[var(--brand-dark)]">
              Back to products
            </Link>
          </div>
        </section>
        <ProductForm options={options} mode="edit" initialProduct={product} />
      </div>

      <aside className="grid gap-4 self-start">
        <section className="rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#9793a0]">Current Snapshot</p>
          <div className="mt-4 grid gap-3 text-sm text-[#6f6a75]">
            <p><span className="font-medium text-[#17141a]">Code:</span> {product.productCode}</p>
            <p><span className="font-medium text-[#17141a]">Brand:</span> {product.brandName}</p>
            <p><span className="font-medium text-[#17141a]">Category:</span> {product.category}</p>
            <p><span className="font-medium text-[#17141a]">Family:</span> {product.productFamily}</p>
          </div>
        </section>
        <section className="rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#9793a0]">Record ID</p>
          <p className="mt-4 break-all text-sm leading-7 text-[#6f6a75]">{id}</p>
        </section>
      </aside>
    </div>
  );
}
