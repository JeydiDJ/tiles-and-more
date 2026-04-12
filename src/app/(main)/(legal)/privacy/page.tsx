export default function PrivacyPage() {
  return (
    <section className="page-section py-20 sm:py-24">
      <div className="grid gap-0 border-y border-[var(--border)] lg:grid-cols-[0.8fr_1.2fr]">
        <div className="editorial-band px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
          <p className="page-kicker">Legal</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">Privacy Policy</h1>
        </div>
        <div className="editorial-panel px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
          <p className="text-[var(--muted)]">
          Add your data handling, cookies, and inquiry retention policy here.
          </p>
        </div>
      </div>
    </section>
  );
}
