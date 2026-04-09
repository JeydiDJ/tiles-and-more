import { gallery } from "@/data/gallery";
import { Container } from "@/components/layout/container";

export function GalleryPreview() {
  return (
    <section className="py-16">
      <Container>
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--brand-dark)]">Inspiration</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold">Show how the materials live inside real spaces</h2>
          <p className="mt-4 max-w-3xl text-[var(--muted)]">
            Atlas Concorde feels premium because it connects surfaces to architecture. This section should do the same for kitchens, bathrooms, facades, retail interiors, and hospitality settings.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {gallery.map((item) => (
            <article key={item.id} className="surface-card rounded-md p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--brand-dark)]">Application</p>
              <h3 className="mt-2 font-serif text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{item.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
