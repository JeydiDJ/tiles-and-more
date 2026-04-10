import { gallery } from "@/data/gallery";
export default function GalleryPage() {
  return (
    <section className="page-section py-20 sm:py-24">
      <div className="mb-10 border-y border-[var(--border)] bg-[#231f20] px-6 py-12 text-white sm:px-8 lg:px-10 lg:py-16">
        <p className="page-kicker text-white/70">Gallery</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">Installed Inspiration</h1>
      </div>
      <div className="grid gap-0 border-t border-[var(--border)] md:grid-cols-2">
        {gallery.map((item) => (
          <article key={item.id} className="editorial-panel border-b border-r-0 px-6 py-8 sm:px-8 lg:px-10 md:[&:nth-child(odd)]:border-r md:[&:nth-child(odd)]:border-[var(--border)]">
            <p className="page-kicker">Application</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">{item.title}</h2>
            <p className="mt-4 max-w-xl text-[var(--muted)]">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
