import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Learn how Tiles & More supports residential and commercial projects in Central Luzon with product expertise, estimation, logistics, and service support.",
  path: "/about",
  keywords: ["about tiles and more", "tile supplier pampanga", "project support central luzon"],
});

const capabilities = [
  {
    label: "Projects Department",
    description:
      "Operating in Pampanga with a dedicated projects arm equipped to support residential and commercial requirements across the region.",
  },
  {
    label: "Sales and Marketing",
    description:
      "A professional team focused on helping clients compare product lines clearly and build the right specification path for each project.",
  },
  {
    label: "Design and Estimation",
    description:
      "In-house design and estimation support that strengthens planning accuracy before execution begins.",
  },
  {
    label: "Logistics and Service",
    description:
      "Delivery coordination and service support that give the company an advantage in managing projects of different scales and values.",
  },
];

export default function AboutPage() {
  return (
    <section className="page-section bg-white py-20 sm:py-24">
      <div className="overflow-hidden border-y border-[var(--border)]">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden border-b border-[var(--border)] bg-[linear-gradient(145deg,#ed2325_0%,#d61f21_42%,#9f1214_100%)] px-6 py-14 text-white sm:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-18">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_24%),radial-gradient(circle_at_78%_24%,rgba(35,31,32,0.18),transparent_34%)]" />
            <div className="absolute right-[-8%] top-[12%] h-56 w-56 rounded-full border border-white/14 bg-white/14 blur-3xl" />
            <div className="absolute bottom-[-8%] left-[12%] h-48 w-48 rounded-full bg-[rgba(255,255,255,0.1)] blur-3xl" />

            <div className="relative">
              <p className="text-xs uppercase tracking-[0.28em] text-white/72">About Us</p>
              <h1 className="mt-4 max-w-[10ch] text-5xl font-semibold leading-none tracking-tight sm:text-6xl lg:text-[5.25rem]">
                Building trusted surface and project partnerships.
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-white/84 sm:text-xl">
                Tiles &amp; More is one of the premier commercial establishments in the Central Luzon region, shaped by
                recognized management quality and innovative strategies.
              </p>
            </div>
          </div>

          <div className="bg-[#f8f8f8] px-6 py-14 sm:px-8 lg:px-10 lg:py-18">
            <div className="grid gap-8">
              <div className="border-b border-[var(--border)] pb-8">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Who We Serve</p>
                <p className="mt-4 text-lg leading-8 text-[var(--foreground)]">
                  The company is focused on developing successful business relationships with local partners and valued
                  customers while delivering products and services of the highest quality.
                </p>
              </div>

              <div className="border-b border-[var(--border)] pb-8">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Global Brand Network</p>
                <p className="mt-4 text-lg leading-8 text-[var(--foreground)]">
                  We are associated with top-of-the-line brands from around the world across all the business segments
                  we represent, always with the goal of serving a diverse customer base with confidence and consistency.
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Regional Presence</p>
                <p className="mt-4 text-lg leading-8 text-[var(--foreground)]">
                  From Pampanga, our team supports projects with the structure, responsiveness, and execution mindset
                  needed for work of any scale or value in the region.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="border border-[var(--border)] bg-[linear-gradient(180deg,#231f20_0%,#353132_100%)] px-6 py-10 text-white shadow-[0_18px_40px_rgba(35,31,32,0.14)] sm:px-8 lg:px-10">
          <p className="text-xs uppercase tracking-[0.24em] text-white/58">Execution Edge</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            A project-ready team built for clarity, coordination, and delivery.
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/74 sm:text-base">
            Our professional sales and marketing team is supported by in-house design and estimation, logistics, and
            service operations. That structure gives Tiles &amp; More a real advantage in project management expertise
            across Central Luzon.
          </p>
        </div>

        <div className="grid gap-0 border border-[var(--border)] bg-white md:grid-cols-2">
          {capabilities.map((item, index) => (
            <article
              key={item.label}
              className={`px-6 py-8 sm:px-8 lg:px-10 ${
                index % 2 === 0 ? "md:border-r md:border-[var(--border)]" : ""
              } ${index < 2 ? "border-b border-[var(--border)]" : ""}`}
            >
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--brand)]">{item.label}</p>
              <p className="mt-4 text-base leading-7 text-[var(--muted)]">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
