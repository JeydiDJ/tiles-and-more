import { categories } from "@/data/categories";
import { DataTable } from "@/components/admin/data-table";

export default function AdminCategoriesPage() {
  return (
    <div className="grid gap-6">
      <section className="border-b border-[var(--border)] pb-5">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">Catalog</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Categories</h1>
      </section>
      <DataTable title="" rows={categories.map((category) => category.name)} />
    </div>
  );
}
