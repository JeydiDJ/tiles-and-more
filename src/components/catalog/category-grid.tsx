"use client";

import type { Category } from "@/types/category";
import { CategoryCard } from "@/components/catalog/category-card";

type CategoryGridProps = {
  categories: Category[];
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="relative">
      <div className="grid gap-6 md:grid-cols-2">
        {categories.map((category) => (
          <div key={category.id} className="min-w-0">
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
    </div>
  );
}
