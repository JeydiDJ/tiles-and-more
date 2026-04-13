import { collections } from "@/data/collections";
import { DataTable } from "@/components/admin/data-table";

export default function AdminCollectionsPage() {
  return (
    <div className="grid gap-6">
      <section className="border-b border-[var(--border)] pb-5">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">Content</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Collections</h1>
      </section>
      <DataTable title="" rows={collections.map((collection) => collection.name)} />
    </div>
  );
}
