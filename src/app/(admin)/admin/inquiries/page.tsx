import { DataTable } from "@/components/admin/data-table";

export default function AdminInquiriesPage() {
  return (
    <DataTable
      title="Inquiries"
      rows={[
        "Incoming contact requests will appear here",
        "Quote submissions can be managed here later",
      ]}
    />
  );
}
