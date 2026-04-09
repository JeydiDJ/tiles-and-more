import { gallery } from "@/data/gallery";
import { DataTable } from "@/components/admin/data-table";
import { ImageUpload } from "@/components/admin/image-upload";

export default function AdminGalleryPage() {
  return (
    <div className="grid gap-6">
      <ImageUpload />
      <DataTable title="Gallery Items" rows={gallery.map((item) => item.title)} />
    </div>
  );
}
