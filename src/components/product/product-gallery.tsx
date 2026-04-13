import type { ProductMedia } from "@/types/product";

type ProductGalleryProps = {
  title: string;
  imageUrl?: string | null;
  media?: ProductMedia[];
};

export function ProductGallery({ title, imageUrl, media = [] }: ProductGalleryProps) {
  const applicationImage = media.find((item) => item.kind === "application")?.imageUrl ?? imageUrl;
  const sampleImages = media.filter((item) => item.kind === "sample");

  return (
    <div className="editorial-band px-6 py-10 sm:px-8 lg:px-10">
      <p className="page-kicker">Gallery</p>
      <h3 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h3>
      {applicationImage ? (
        <div className="mt-6 grid gap-4">
          <div className="overflow-hidden border border-[var(--border)] bg-white">
            <img src={applicationImage} alt={title} className="h-[22rem] w-full object-cover" />
          </div>
          {sampleImages.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {sampleImages.map((item) => (
                <div key={item.id} className="overflow-hidden border border-[var(--border)] bg-white">
                  <img src={item.imageUrl} alt={item.altText ?? `${title} sample`} className="aspect-square w-full object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 max-w-lg text-sm leading-6 text-[var(--muted)]">
          Reserve this component for detail-page images, swatches, and zoom views.
        </p>
      )}
    </div>
  );
}
