export default function AboutPage() {
  return (
    <section className="page-section py-20 sm:py-24">
      <div className="grid gap-0 border-y border-[var(--border)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="editorial-band px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
          <p className="page-kicker text-white/70">About</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">Tiles &amp; More</h1>
        </div>
        <div className="editorial-panel px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
          <p className="text-lg leading-8 text-[var(--muted)]">
            This page is ready for your showroom story, sourcing philosophy, and installation expertise.
          </p>
        </div>
      </div>
    </section>
  );
}
