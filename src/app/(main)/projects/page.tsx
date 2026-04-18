import { ProjectShowcaseGrid } from "@/components/sections/project-showcase-grid";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Projects",
  description:
    "View finished residential and commercial project showcases from Tiles & More across tile, quartz, decorative surfaces, and sanitary applications.",
  path: "/projects",
  keywords: ["tile projects", "finished projects", "tiles and more showcase"],
});

export default function ProjectsPage() {
  return (
    <>
      <section className="page-section py-20 sm:py-24">
        <div className="grid gap-0 border-y border-[var(--border)] lg:grid-cols-[0.8fr_1.2fr]">
          <div className="editorial-band px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
            <p className="page-kicker">Projects</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">Finished Project Showcase</h1>
          </div>
          <div className="editorial-panel px-6 py-12 text-[var(--muted)] sm:px-8 lg:px-10 lg:py-16">
            A dedicated page for completed company projects, showing how finished residential and commercial
            spaces come together through tile, quartz, decorative surfaces, and sanitary selections.
          </div>
        </div>
      </section>
      <ProjectShowcaseGrid />
    </>
  );
}
