import Link from "next/link";
import { gallery } from "@/data/gallery";
import { Container } from "@/components/layout/container";

export function ProjectsSection() {
  const projects = gallery.slice(0, 3);

  return (
    <section className="bg-white py-16 text-[var(--foreground)] sm:py-20">
      <Container className="max-w-none px-6 sm:px-8 lg:px-12">
        <div className="mb-8 max-w-3xl sm:mb-10">
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">Project Showcase</p>
          <h2 className="mt-3 font-sans text-4xl font-medium tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            Finished projects that show how our materials come to life.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            A preview of completed residential and commercial spaces shaped with the company&apos;s tile,
            surface, and sanitary selections.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              href={`/projects#${project.id}`}
              className="group flex min-h-[34rem] flex-col overflow-hidden border border-[var(--border)] bg-[linear-gradient(180deg,#f5f1ea_0%,#ece4d8_100%)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(61,43,28,0.12)] lg:min-h-[36rem]"
            >
              <div className="p-5 sm:p-6">
                <div className="relative flex h-[20rem] items-center justify-center border border-[var(--border)] bg-[repeating-linear-gradient(45deg,rgba(124,94,59,0.06)_0_16px,rgba(255,255,255,0.75)_16px_32px)] lg:h-[22rem]">
                  <div className="absolute inset-4 border-2 border-dashed border-[rgba(91,67,45,0.28)]" />
                  <div className="relative z-10 text-center text-[var(--muted)]">
                    <p className="text-[11px] uppercase tracking-[0.24em]">Project Image Placeholder</p>
                    <p className="mt-3 text-sm">Add your finished project image in the source code later.</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[rgba(91,67,45,0.72)]">
                      Frame {String(index + 1).padStart(2, "0")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-3 border-t border-[var(--border)] bg-white p-6 text-[var(--foreground)] sm:p-7">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Completed Project Template</p>
                <h3 className="max-w-[13ch] font-sans text-3xl font-medium leading-none tracking-tight sm:text-4xl">
                  {project.title}
                </h3>
                <p className="max-w-[34ch] text-sm leading-6 text-[var(--muted)] sm:text-base">
                  {project.description}
                </p>
                <span className="pt-2 text-xs uppercase tracking-[0.22em] text-[rgba(91,67,45,0.72)]">
                  Open showcase template
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
