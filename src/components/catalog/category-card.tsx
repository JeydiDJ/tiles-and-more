import Link from "next/link";
import type { Category } from "@/types/category";

type CategoryCardProps = {
  category: Category;
};

const categoryThemes: Record<string, string> = {
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

export function CategoryCard({ category }: CategoryCardProps) {
  const background = categoryThemes[category.slug] ?? categoryThemes.tiles;

  return (
    <Link
      href={`/catalog/${category.slug}`}
      className="group block"
    >
      <article className="grid min-h-[20rem] overflow-hidden border border-[var(--border)] bg-white shadow-[0_18px_40px_rgba(0,0,0,0.08)] transition duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_28px_60px_rgba(0,0,0,0.14)] sm:grid-cols-[0.78fr_1.22fr]">
        <div className={`relative overflow-hidden text-white ${background}`}>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.12)_36%,rgba(0,0,0,0.68)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_100%)] bg-[length:6.5rem_100%] opacity-20" />
          <div className="absolute right-[10%] top-[14%] h-[38%] w-[34%] border border-white/18 bg-white/10 backdrop-blur-[1px]" />
          <div className="absolute bottom-[16%] left-[14%] h-px w-[48%] bg-white/30" />

          <div className="relative flex h-full flex-col justify-between px-6 py-7 sm:px-7 sm:py-8">
            <p className="text-xs uppercase tracking-[0.22em] text-white/72">Category</p>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/72">Catalog Range</p>
              <h3 className="mt-4 max-w-[8ch] text-3xl font-semibold leading-none tracking-tight sm:text-4xl">
                {category.name.replace(" Tiles", "")}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between bg-white px-6 py-7 sm:px-8 sm:py-8">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Surface Collection</p>
            <h3 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[var(--foreground)] sm:text-4xl">
              {category.name}
            </h3>
            <p className="mt-5 max-w-[34ch] text-base leading-7 text-[var(--muted)]">
              {category.description}
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-5">
            <span className="text-sm uppercase tracking-[0.18em] text-[var(--foreground)]">View catalog</span>
            <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-[var(--brand)]">
              <span className="transition-transform duration-300 group-hover:translate-x-1">Open</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
