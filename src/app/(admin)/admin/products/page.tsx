import { products } from "@/data/products";
import { DataTable } from "@/components/admin/data-table";

export default function AdminProductsPage() {
  return <DataTable title="Products" rows={products.map((product) => product.name)} />;
}
