import Link from "next/link";
import type { Category } from "@/types/category";
import { CategoryGrid } from "@/components/catalog/category-grid";

type FeaturedCategoriesProps = {
  categories: Category[];
};

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  return (
    <section className="bg-[#242322] py-12 text-white sm:py-16">
      <div className="px-6 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
          <h2 className="font-serif text-4xl font-semibold leading-none tracking-tight sm:text-5xl lg:text-6xl">
            Discover our collections
          </h2>
          <Link
            href="/collections"
            className="inline-flex items-center gap-4 self-start border border-white/40 px-6 py-4 text-sm font-medium uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-black"
          >
            <span>View all collections</span>
            <span className="text-xl leading-none">↗</span>
          </Link>
        </div>

        <CategoryGrid categories={categories} />
      </div>
    </section>
  );
}
