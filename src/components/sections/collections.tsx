import type { Collection } from "@/types/collection";
import { Container } from "@/components/layout/container";

type CollectionsSectionProps = {
  collections: Collection[];
};

export function CollectionsSection({ collections }: CollectionsSectionProps) {
  return (
    <section className="py-16">
      <Container>
        <div className="mb-8 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--brand-dark)]">Collections</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold">Curated moods, not just item listings</h2>
          <p className="mt-4 text-[var(--muted)]">
            This section gives the homepage its editorial rhythm by grouping products into recognisable design directions visitors can imagine in real spaces.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {collections.map((collection) => (
            <article key={collection.id} className="surface-card rounded-md p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--brand-dark)]">Collection</p>
              <h3 className="mt-3 font-serif text-2xl font-semibold">{collection.name}</h3>
              <p className="mt-3 text-[var(--muted)]">{collection.summary}</p>
              <p className="mt-4 text-sm font-medium">{collection.highlight}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
