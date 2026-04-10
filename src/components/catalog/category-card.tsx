import Link from "next/link";
import type { Category } from "@/types/category";

type CategoryCardProps = {
  category: Category;
};

const categoryThemes: Record<string, string> = {
  porcelain:
    "bg-[radial-gradient(circle_at_72%_30%,rgba(255,255,255,0.18),transparent_24%),linear-gradient(145deg,#6e6a6b_0%,#9c9a9b_36%,#2e2a2b_100%)]",
  quartz:
    "bg-[radial-gradient(circle_at_50%_24%,rgba(255,255,255,0.14),transparent_22%),linear-gradient(145deg,#8b8889_0%,#b5b3b3_52%,#403c3d_100%)]",
  "natural-stone":
    "bg-[radial-gradient(circle_at_62%_34%,rgba(255,255,255,0.16),transparent_22%),linear-gradient(145deg,#9f9ea0_0%,#c4c3c4_46%,#575355_100%)]",
  decorative:
    "bg-[radial-gradient(circle_at_58%_28%,rgba(237,35,37,0.18),transparent_24%),linear-gradient(145deg,#666365_0%,#8f8b8c_48%,#262324_100%)]",
  "spc-lvt-flooring":
    "bg-[radial-gradient(circle_at_74%_30%,rgba(255,255,255,0.12),transparent_22%),linear-gradient(145deg,#7a7879_0%,#aaa7a8_52%,#363334_100%)]",
  "sanitary-furniture":
    "bg-[radial-gradient(circle_at_80%_22%,rgba(255,255,255,0.15),transparent_20%),linear-gradient(145deg,#9f9c9d_0%,#c1bfc0_50%,#4b4849_100%)]",
};

export function CategoryCard({ category }: CategoryCardProps) {
  const background = categoryThemes[category.slug] ?? categoryThemes.porcelain;

  return (
    <Link href={`/catalog/${category.slug}`} className={`group relative flex h-[30rem] w-full overflow-hidden ${background}`}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_46%,rgba(0,0,0,0.82)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_100%)] bg-[length:9rem_100%] opacity-20" />
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-6 text-white sm:p-7">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/60">Collection</p>
          <h3 className="mt-2 font-serif text-3xl font-semibold leading-none tracking-tight">
            {category.name.replace(" Tiles", "")}
          </h3>
        </div>
        <span className="text-sm font-medium uppercase tracking-[0.18em] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
          View
        </span>
      </div>
    </Link>
  );
}
