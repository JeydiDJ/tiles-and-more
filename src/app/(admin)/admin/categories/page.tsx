import { categories } from "@/data/categories";
import { DataTable } from "@/components/admin/data-table";

export default function AdminCategoriesPage() {
  return <DataTable title="Categories" rows={categories.map((category) => category.name)} />;
}
