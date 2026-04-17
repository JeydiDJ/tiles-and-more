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
    <div className="grid gap-6">
      <section className="border-b border-[var(--border)] pb-5">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">Products</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Edit Product</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Product ID: {id}</p>
        <div className="mt-5">
          <Link href={getAdminRoute("/products")} className="text-sm font-medium text-[var(--brand)] transition hover:text-[var(--brand-dark)]">
            Back to products
          </Link>
        </div>
      </section>
      <ProductForm options={options} mode="edit" initialProduct={product} />
    </div>
  );
}
