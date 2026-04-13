import { gallery } from "@/data/gallery";
import { DataTable } from "@/components/admin/data-table";
import { ImageUpload } from "@/components/admin/image-upload";

export default function AdminGalleryPage() {
  return (
    <div className="grid gap-6">
      <section className="border-b border-[var(--border)] pb-5">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">Content</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Gallery</h1>
      </section>
      <ImageUpload />
      <DataTable title="" rows={gallery.map((item) => item.title)} />
    </div>
  );
}
