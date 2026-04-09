"use client";

import useEmblaCarousel from "embla-carousel-react";
import type { Category } from "@/types/category";
import { CategoryCard } from "@/components/catalog/category-card";

type CategoryGridProps = {
  categories: Category[];
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Scroll collections left"
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 pr-4 text-5xl leading-none text-white/72 transition hover:text-white lg:block"
      >
        ‹
      </button>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5">
          {categories.map((category) => (
            <div key={category.id} className="min-w-0 flex-[0_0_23rem]">
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Scroll collections right"
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 pl-4 text-5xl leading-none text-white/72 transition hover:text-white lg:block"
      >
        ›
      </button>
    </div>
  );
}
