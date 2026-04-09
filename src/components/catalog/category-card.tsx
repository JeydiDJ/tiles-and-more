import Link from "next/link";
import type { Category } from "@/types/category";

type CategoryCardProps = {
  category: Category;
};

const categoryThemes: Record<string, string> = {
  porcelain:
    "bg-[radial-gradient(circle_at_72%_30%,rgba(255,255,255,0.18),transparent_24%),linear-gradient(145deg,#8c7a66_0%,#b2a18d_36%,#6a5948_100%)]",
  quartz:
    "bg-[radial-gradient(circle_at_50%_24%,rgba(255,255,255,0.14),transparent_22%),linear-gradient(145deg,#d1bd98_0%,#b79b6e_52%,#7d6544_100%)]",
  "natural-stone":
    "bg-[radial-gradient(circle_at_62%_34%,rgba(255,255,255,0.16),transparent_22%),linear-gradient(145deg,#d2c5a2_0%,#c0b18a_46%,#8c795b_100%)]",
  decorative:
    "bg-[radial-gradient(circle_at_58%_28%,rgba(255,255,255,0.16),transparent_24%),linear-gradient(145deg,#d8ccb0_0%,#c6b89a_48%,#84745d_100%)]",
  "spc-lvt-flooring":
    "bg-[radial-gradient(circle_at_74%_30%,rgba(255,255,255,0.12),transparent_22%),linear-gradient(145deg,#b8b8b2_0%,#99948b_52%,#61605a_100%)]",
  "sanitary-furniture":
    "bg-[radial-gradient(circle_at_80%_22%,rgba(255,255,255,0.15),transparent_20%),linear-gradient(145deg,#cfc8bb_0%,#ada597_50%,#72706a_100%)]",
};

export function CategoryCard({ category }: CategoryCardProps) {
  const background = categoryThemes[category.slug] ?? categoryThemes.porcelain;

  return (
    <Link
      href={`/catalog/${category.slug}`}
      className={`group relative flex h-[28rem] w-full overflow-hidden ${background}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_52%,rgba(0,0,0,0.72)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_100%)] bg-[length:9rem_100%] opacity-20" />
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 text-white">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/60">Collection</p>
          <h3 className="mt-2 font-serif text-3xl font-semibold leading-none tracking-tight">
            {category.name.replace(" Tiles", "")}
          </h3>
        </div>
        <span className="text-4xl leading-none transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
          ↗
        </span>
      </div>
    </Link>
  );
}
