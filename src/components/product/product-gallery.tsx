type ProductGalleryProps = {
  title: string;
};

export function ProductGallery({ title }: ProductGalleryProps) {
  return (
    <div className="surface-card rounded-md p-6">
      <h3 className="text-lg font-semibold">{title} Gallery</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Reserve this component for detail-page images, swatches, and zoom views.
      </p>
    </div>
  );
}
