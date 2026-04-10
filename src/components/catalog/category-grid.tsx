"use client";

import useEmblaCarousel from "embla-carousel-react";
import type { Category } from "@/types/category";
import { CategoryCard } from "@/components/catalog/category-card";

type CategoryGridProps = {
  categories: Category[];
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-0 border-y border-[var(--border)]">
          {categories.map((category) => (
            <div key={category.id} className="min-w-0 flex-[0_0_23rem] border-r border-[var(--border)] last:border-r-0">
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
