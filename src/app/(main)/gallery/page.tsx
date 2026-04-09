import { gallery } from "@/data/gallery";
import { Container } from "@/components/layout/container";

export default function GalleryPage() {
  return (
    <Container className="py-20">
      <h1 className="text-4xl font-semibold">Gallery</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {gallery.map((item) => (
          <article key={item.id} className="surface-card rounded-3xl p-6">
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p className="mt-3 text-[var(--muted)]">{item.description}</p>
          </article>
        ))}
      </div>
    </Container>
  );
}
