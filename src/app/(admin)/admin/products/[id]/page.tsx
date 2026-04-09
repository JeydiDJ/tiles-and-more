import { ProductForm } from "@/components/admin/product-form";

type AdminProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductDetailPage({ params }: AdminProductPageProps) {
  const { id } = await params;

  return (
    <div className="grid gap-6">
      <div className="surface-card rounded-3xl p-6">
        <h1 className="text-2xl font-semibold">Edit Product</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Product ID: {id}</p>
      </div>
      <ProductForm />
    </div>
  );
}
