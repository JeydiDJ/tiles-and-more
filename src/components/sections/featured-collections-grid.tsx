import type { Collection } from "@/types/collection";
import { Container } from "@/components/layout/container";

type FeaturedCollectionsGridProps = {
  collections: Collection[];
};

const collectionThemes: Record<string, string> = {
  "soft-modern":
    "bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.12),transparent_18%),linear-gradient(135deg,#1e1a17_0%,#6a5848_42%,#d8c7b5_100%)]",
  "architectural-contrast":
    "bg-[radial-gradient(circle_at_22%_18%,rgba(217,71,45,0.18),transparent_16%),linear-gradient(135deg,#151516_0%,#3f4348_44%,#9a9ea4_100%)]",
};

export function FeaturedCollectionsGrid({ collections }: FeaturedCollectionsGridProps) {
  return (
    <section className="border-t border-[var(--border)] bg-white py-14 text-[var(--foreground)] sm:py-18">
      <Container className="max-w-none px-6 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-col gap-8 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="page-kicker">Featured Collections</p>
            <h2 className="mt-4 text-4xl font-semibold leading-none tracking-tight sm:text-5xl lg:text-[4.25rem]">
              Curated ranges presented with the same catalog rhythm as the homepage showcase.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Explore each signature direction in a clean editorial grid built for browsing instead of sliding.
            </p>
          </div>

          <p className="max-w-md text-sm uppercase tracking-[0.18em] text-[var(--muted)] lg:text-right">
            Static grid layout for easier comparison
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {collections.map((collection, index) => {
            const theme = collectionThemes[collection.slug] ?? collectionThemes["soft-modern"];

            return (
              <article
                key={collection.id}
                id={collection.slug}
                className={`group relative flex min-h-[32rem] overflow-hidden border border-[rgba(255,255,255,0.12)] text-white shadow-[0_18px_40px_rgba(0,0,0,0.12)] transition duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_28px_60px_rgba(0,0,0,0.2)] ${theme}`}
              >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.08)_22%,rgba(0,0,0,0.82)_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.2)_0%,transparent_24%,transparent_100%)]" />
                <div className="absolute inset-y-0 left-[4.25rem] w-px bg-white/22" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_100%)] bg-[length:8.5rem_100%] opacity-20" />
                <div className="absolute right-[9%] top-[11%] h-[42%] w-[26%] border border-white/22 bg-white/10 backdrop-blur-[1px]" />
                <div className="absolute bottom-[24%] right-[16%] h-[14%] w-[34%] border border-black/20 bg-[rgba(255,255,255,0.12)]" />

                <div className="relative flex h-full w-full flex-col justify-between px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
                  <div className="flex items-start justify-between gap-6">
                    <span className="text-xs uppercase tracking-[0.22em] text-white/72">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs uppercase tracking-[0.22em] text-white/72">Featured Range</span>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/78">Signature Collection</p>
                    <h3 className="mt-4 max-w-[12ch] text-4xl font-semibold leading-none tracking-tight text-white sm:text-5xl">
                      {collection.name}
                    </h3>
                    <p className="mt-5 max-w-[28ch] text-sm leading-6 text-white/88 sm:text-base">
                      {collection.summary}
                    </p>
                    <p className="mt-5 max-w-[30ch] text-sm leading-6 text-white/72">{collection.highlight}</p>
                    <div className="mt-8 flex items-center justify-between border-t border-white/18 pt-5">
                      <span className="text-sm uppercase tracking-[0.18em] text-white/88">View collection</span>
                      <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-white">
                        <span className="transition-transform duration-300 group-hover:translate-x-1">Open</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
