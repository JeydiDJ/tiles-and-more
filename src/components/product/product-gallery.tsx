type ProductGalleryProps = {
  title: string;
};

export function ProductGallery({ title }: ProductGalleryProps) {
  return (
    <div className="editorial-band px-6 py-10 sm:px-8 lg:px-10">
      <p className="page-kicker">Gallery</p>
      <h3 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-4 max-w-lg text-sm leading-6 text-[var(--muted)]">
        Reserve this component for detail-page images, swatches, and zoom views.
      </p>
    </div>
  );
}
