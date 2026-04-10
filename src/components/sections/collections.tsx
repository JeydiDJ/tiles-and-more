import Link from "next/link";
import { gallery } from "@/data/gallery";
import type { Collection } from "@/types/collection";
import { Container } from "@/components/layout/container";

type CollectionsSectionProps = {
  collections: Collection[];
};

const projectThemes = [
  "bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.22),transparent_24%),linear-gradient(90deg,rgba(234,230,224,0.92)_0%,rgba(234,230,224,0.92)_42%,rgba(120,82,40,0.92)_42%,rgba(84,56,31,0.96)_100%)]",
  "bg-[radial-gradient(circle_at_20%_64%,rgba(255,211,141,0.26),transparent_18%),radial-gradient(circle_at_78%_78%,rgba(255,255,255,0.12),transparent_24%),linear-gradient(180deg,rgba(85,55,39,0.92)_0%,rgba(70,44,32,0.92)_38%,rgba(38,34,31,0.92)_100%)]",
  "bg-[radial-gradient(circle_at_50%_16%,rgba(245,160,97,0.3),transparent_20%),linear-gradient(180deg,rgba(110,81,66,0.16)_0%,rgba(20,18,22,0.82)_44%,rgba(11,10,12,0.96)_100%),linear-gradient(90deg,#1e1b1f_0%,#28252b_100%)]",
  "bg-[radial-gradient(circle_at_30%_24%,rgba(255,255,255,0.18),transparent_20%),linear-gradient(180deg,rgba(97,86,74,0.78)_0%,rgba(58,50,44,0.82)_42%,rgba(27,24,23,0.96)_100%)]",
];

export function CollectionsSection({ collections }: CollectionsSectionProps) {
  const projects = gallery.slice(0, 3).map((item, index) => ({
    ...item,
    collection: collections[index % collections.length],
    theme: projectThemes[index % projectThemes.length],
  }));

  return (
    <section className="bg-white py-16 text-[var(--foreground)] sm:py-20">
      <Container className="max-w-none px-6 sm:px-8 lg:px-12">
        <div className="mb-8 sm:mb-10">
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">Collections</p>
          <h2 className="mt-3 font-sans text-4xl font-medium tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            Our projects
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              href={`/collections#${project.collection.slug}`}
              className={`group relative flex min-h-[34rem] overflow-hidden border border-[var(--border)] ${project.theme} lg:min-h-[36rem]`}
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.12)_40%,rgba(0,0,0,0.72)_100%)] transition duration-500 group-hover:bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.1)_38%,rgba(0,0,0,0.78)_100%)]" />
              <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.04)_100%)]" />

              <div className="absolute inset-0">
                {index === 0 ? (
                  <>
                    <div className="absolute bottom-0 left-0 h-[34%] w-full bg-[repeating-linear-gradient(150deg,rgba(68,67,63,0.25)_0_2px,transparent_2px_16px)] opacity-55" />
                    <div className="absolute left-[52%] top-0 h-full w-[2px] bg-white/10" />
                    <div className="absolute right-[11%] top-0 h-full w-[30%] bg-[repeating-linear-gradient(90deg,rgba(46,28,12,0.18)_0_1px,rgba(133,96,55,0.58)_1px_4px)]" />
                    <div className="absolute left-[8%] top-[18%] h-[34%] w-[18%] border border-black/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(228,222,214,0.96))] shadow-[0_16px_35px_rgba(0,0,0,0.22)]" />
                    <div className="absolute left-[11%] top-[24%] h-[21%] w-[12%] bg-[linear-gradient(180deg,#cb2020_0%,#7d1111_100%)] opacity-90" />
                  </>
                ) : null}

                {index === 1 ? (
                  <>
                    <div className="absolute inset-x-0 top-0 h-[40%] bg-[linear-gradient(180deg,rgba(152,111,77,0.18),transparent)]" />
                    <div className="absolute left-[10%] bottom-[30%] h-24 w-24 rounded-full bg-[#f3d2a3]/90 blur-[1px]" />
                    <div className="absolute left-[25%] bottom-[44%] h-8 w-8 rounded-full bg-[#f3d2a3]/90" />
                    <div className="absolute left-[31%] bottom-[40%] h-5 w-5 rounded-full bg-[#f3d2a3]/90" />
                    <div className="absolute right-[12%] top-[22%] h-[16%] w-[44%] skew-y-[-10deg] border border-[#7d4f2e]/50 bg-[repeating-linear-gradient(180deg,rgba(112,67,33,0.15)_0_2px,rgba(134,79,40,0.7)_2px_4px)] shadow-[0_16px_40px_rgba(0,0,0,0.24)]" />
                    <div className="absolute bottom-[16%] left-[12%] right-[10%] h-[22%] bg-[linear-gradient(180deg,rgba(116,81,54,0.28),rgba(39,35,33,0.12))]" />
                  </>
                ) : null}

                {index === 2 ? (
                  <>
                    <div className="absolute inset-x-0 top-0 h-[38%] bg-[linear-gradient(180deg,rgba(247,168,113,0.62),rgba(77,55,63,0.1))]" />
                    <div className="absolute bottom-0 left-0 h-[60%] w-full bg-[linear-gradient(180deg,transparent,rgba(7,7,9,0.92))]" />
                    <div className="absolute right-[19%] top-[7%] h-[76%] w-[27%] rounded-t-[4rem] rounded-b-[2rem] border border-[#d6b06a]/55 bg-[linear-gradient(180deg,rgba(15,15,18,0.95),rgba(32,28,24,0.95))] shadow-[0_20px_45px_rgba(0,0,0,0.3)]" />
                    <div className="absolute right-[6%] top-[9%] h-[72%] w-[24%] rounded-t-[4rem] rounded-b-[2rem] border border-[#d6b06a]/55 bg-[linear-gradient(180deg,rgba(18,18,21,0.95),rgba(35,31,28,0.95))] shadow-[0_20px_45px_rgba(0,0,0,0.3)]" />
                    <div className="absolute inset-y-[12%] right-[19%] w-[27%] bg-[repeating-linear-gradient(180deg,transparent_0_20px,rgba(233,193,101,0.78)_20px_23px,transparent_23px_40px)] opacity-85" />
                    <div className="absolute inset-y-[14%] right-[6%] w-[24%] bg-[repeating-linear-gradient(180deg,transparent_0_20px,rgba(233,193,101,0.78)_20px_23px,transparent_23px_40px)] opacity-85" />
                    <div className="absolute bottom-[10%] left-[8%] h-[2px] w-[34%] bg-white/35" />
                  </>
                ) : null}
              </div>

              <div className="relative mt-auto flex w-full flex-col gap-3 p-6 sm:p-7">
                <p className="text-xs uppercase tracking-[0.22em] text-white/55">
                  {project.collection.name} Collection
                </p>
                <h3 className="max-w-[13ch] font-sans text-3xl font-medium leading-none tracking-tight sm:text-4xl">
                  {project.title}
                </h3>
                <p className="max-w-[34ch] text-sm leading-6 text-white/78 sm:text-base">
                  {project.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
