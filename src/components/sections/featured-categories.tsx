"use client";

import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import type { Category } from "@/types/category";

type FeaturedCategoriesProps = {
  categories: Category[];
};

const featuredThemes: Record<string, string> = {
  tiles:
    "bg-[linear-gradient(135deg,#1f1b1c_0%,#3d393a_46%,#8f8e90_100%)]",
  "quartz-slabs":
    "bg-[linear-gradient(135deg,#2a2627_0%,#59595b_42%,#d9d9da_100%)]",
  "decorative-surfaces":
    "bg-[linear-gradient(135deg,#231f20_0%,#4d4a4b_40%,#aaa8a9_100%)]",
  "specialty-flooring":
    "bg-[radial-gradient(circle_at_18%_22%,rgba(237,35,37,0.28),transparent_20%),linear-gradient(135deg,#231f20_0%,#474344_45%,#8e8b8c_100%)]",
  sanitary:
    "bg-[linear-gradient(135deg,#1d1a1b_0%,#3d3b3c_38%,#7d7a7b_100%)]",
  "lifestyle-accessories":
    "bg-[linear-gradient(135deg,#252122_0%,#5a5758_44%,#b4b1b2_100%)]",
};

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  return (
    <section className="border-t border-[var(--border)] bg-white py-14 text-[var(--foreground)] sm:py-18">
      <div className="px-0">
        <div className="mb-8 px-6 sm:mb-10 sm:px-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-end lg:gap-14">
          <div className="max-w-4xl">
            <p className="page-kicker">Featured Collections</p>
            <h2 className="mt-4 text-4xl font-semibold leading-none tracking-tight sm:text-5xl lg:text-[4.25rem]">
              Signature surfaces for refined residential and commercial spaces.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Explore tiles, quartz slabs, decorative surfaces, specialty flooring, sanitary lines, and lifestyle
              accessories curated for residential and commercial interiors.
            </p>
          </div>

          <div className="flex flex-col gap-4 border-t border-[var(--border)] pt-5 lg:ml-auto lg:w-full lg:max-w-xs lg:self-end lg:items-end lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0 lg:text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              Drag or swipe to browse
            </p>
            <Link
              href="/catalog"
              className="group inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.16em] text-[var(--foreground)] transition-colors duration-300 hover:text-[var(--brand)]"
            >
              <span className="transition-colors duration-300 group-hover:text-[var(--brand)]">View Catalogs</span>
              <span className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
          </div>
        </div>

        <div className="-mt-4 overflow-x-hidden overflow-y-visible pt-4" ref={emblaRef}>
          <div className="flex gap-0 border-y border-[var(--border)] cursor-grab active:cursor-grabbing">
            <div className="flex w-[22rem] shrink-0 flex-col justify-between border-r border-[var(--border)] bg-[#231f20] px-6 py-8 text-white sm:w-[24rem] sm:px-8 lg:w-[28rem] lg:px-10">
              <div>
                <p className="page-kicker text-white/60">Curated Selection</p>
                <h3 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                  Designed to help clients compare ranges with clarity and confidence.
                </h3>
              </div>
              <p className="mt-8 max-w-sm text-sm leading-7 text-white/70">
                Each collection highlights a different mood, material expression, and application suited for premium
                interiors.
              </p>
            </div>

            {categories.map((category, index) => {
              const theme = featuredThemes[category.slug] ?? featuredThemes.tiles;

              return (
                <Link
                  key={category.id}
                  href={`/catalog/${category.slug}`}
                  className={`group relative flex h-[32rem] w-[24rem] shrink-0 overflow-hidden border-r border-[rgba(255,255,255,0.12)] text-white shadow-[0_18px_40px_rgba(0,0,0,0.12)] transition duration-300 ease-out hover:-translate-y-3 hover:shadow-[0_28px_60px_rgba(0,0,0,0.24)] sm:w-[28rem] lg:w-[34rem] ${theme}`}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.08)_22%,rgba(0,0,0,0.8)_100%)]" />
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
                      <p className="text-xs uppercase tracking-[0.2em] text-white/78">Surface Collection</p>
                      <h3 className="mt-4 max-w-[11ch] text-4xl font-semibold leading-none tracking-tight text-white sm:text-5xl">
                        {category.name.replace(" Tiles", "")}
                      </h3>
                      <p className="mt-5 max-w-[24ch] text-sm leading-6 text-white/88">
                        Discover finishes and formats suited for polished residential and commercial environments.
                      </p>
                      <div className="mt-8 flex items-center justify-between border-t border-white/18 pt-5">
                        <span className="text-sm uppercase tracking-[0.18em] text-white/88">Explore collection</span>
                        <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-white">
                          <span className="transition-transform duration-300 group-hover:translate-x-1">View</span>
                          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
