import { collections } from "@/data/collections";
import { DataTable } from "@/components/admin/data-table";

export default function AdminCollectionsPage() {
  return <DataTable title="Collections" rows={collections.map((collection) => collection.name)} />;
}
