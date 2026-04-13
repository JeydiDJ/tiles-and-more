import { DataTable } from "@/components/admin/data-table";

export default function AdminInquiriesPage() {
  return (
    <div className="grid gap-6">
      <section className="border-b border-[var(--border)] pb-5">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">CRM</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Inquiries</h1>
      </section>
      <DataTable title="" rows={["Contact requests", "Quote submissions"]} />
    </div>
  );
}
