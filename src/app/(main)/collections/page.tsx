import { collections } from "@/data/collections";
import { FeaturedCollectionsGrid } from "@/components/sections/featured-collections-grid";

export default function CollectionsPage() {
  return (
    <>
      <section className="page-section py-20 sm:py-24">
        <div className="grid gap-0 border-y border-[var(--border)] lg:grid-cols-[0.8fr_1.2fr]">
          <div className="editorial-band px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
            <p className="page-kicker">Collections</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">Curated Ranges</h1>
          </div>
          <div className="editorial-panel px-6 py-12 text-[var(--muted)] sm:px-8 lg:px-10 lg:py-16">
            A dedicated space for signature ranges and curated stories shaped for residential and commercial projects.
          </div>
        </div>
      </section>
      <FeaturedCollectionsGrid collections={collections} />
    </>
  );
}
