import { DataTable } from "@/components/admin/data-table";

export default function AdminDashboardPage() {
  return (
    <div className="grid gap-6">
      <DataTable
        title="Admin Overview"
        rows={[
          "Products management route scaffolded",
          "Category and collection pages scaffolded",
          "Inquiry and gallery admin areas ready for future logic",
        ]}
      />
    </div>
  );
}
