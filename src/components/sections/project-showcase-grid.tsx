import { Container } from "@/components/layout/container";
import { gallery } from "@/data/gallery";

const projectLocations = [
  "Residential Interior",
  "Kitchen Renovation",
  "Bathroom Installation",
  "Commercial Fit-Out",
];

const projectTags = [
  ["Porcelain", "Living Area", "Completed"],
  ["Quartz", "Cabinetry", "Completed"],
  ["Sanitary", "Spa Bathroom", "Completed"],
  ["Facade", "Reception", "Completed"],
];

export function ProjectShowcaseGrid() {
  return (
    <section className="border-t border-[var(--border)] bg-white py-14 text-[var(--foreground)] sm:py-18">
      <Container className="max-w-none px-6 sm:px-8 lg:px-12">
        <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="page-kicker">Finished Projects</p>
            <h2 className="mt-4 text-4xl font-semibold leading-none tracking-tight sm:text-5xl lg:text-[4.25rem]">
              A showcase of completed spaces delivered with the company&apos;s materials.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              These featured installs highlight how tile, quartz, decorative surfaces, and sanitary fixtures come
              together in real finished environments.
            </p>
          </div>

          <p className="max-w-md text-sm uppercase tracking-[0.18em] text-[var(--muted)] lg:text-right">
            Real applications across residential and commercial work
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {gallery.map((project, index) => {
            const tags = projectTags[index % projectTags.length];
            const location = projectLocations[index % projectLocations.length];

            return (
              <article
                key={project.id}
                id={project.id}
                className="group flex min-h-[32rem] flex-col overflow-hidden border border-[var(--border)] bg-[#f7f3ec] shadow-[0_18px_40px_rgba(0,0,0,0.08)] transition duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_28px_60px_rgba(61,43,28,0.12)]"
              >
                <div className="border-b border-[var(--border)] p-6 sm:p-8 lg:p-10">
                  <div className="flex items-start justify-between gap-6">
                    <span className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">{location}</span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 lg:p-10">
                  <div className="relative flex h-[20rem] items-center justify-center border border-[var(--border)] bg-[repeating-linear-gradient(45deg,rgba(124,94,59,0.05)_0_18px,rgba(255,255,255,0.82)_18px_36px)] lg:h-[22rem]">
                    <div className="absolute inset-5 border-2 border-dashed border-[rgba(91,67,45,0.24)]" />
                    <div className="relative z-10 text-center text-[var(--muted)]">
                      <p className="text-[11px] uppercase tracking-[0.24em]">Insert Project Image</p>
                      <p className="mt-3 text-sm leading-6">
                        This frame is intentionally empty so you can add the finished project photo later in code.
                      </p>
                      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[rgba(91,67,45,0.72)]">
                        Placeholder for {project.id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto border-t border-[var(--border)] bg-white px-6 py-7 text-[var(--foreground)] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Project Showcase Template</p>
                  <h3 className="mt-4 max-w-[12ch] text-4xl font-semibold leading-none tracking-tight sm:text-5xl">
                    {project.title}
                  </h3>
                  <p className="mt-5 max-w-[30ch] text-sm leading-6 text-[var(--muted)] sm:text-base">
                    {project.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-[var(--border)] bg-[#f7f3ec] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[rgba(91,67,45,0.82)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
