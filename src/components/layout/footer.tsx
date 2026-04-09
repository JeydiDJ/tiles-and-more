import Link from "next/link";
import { mainNav, legalNav } from "@/config/nav";
import { siteConfig } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-white py-16 text-[var(--foreground)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(215,180,140,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.8),rgba(255,255,255,0.94))]" />
      <div className="relative w-full px-6 sm:px-8 lg:px-12">
        <div className="grid gap-12 border-t border-[var(--border)] pt-12 lg:grid-cols-[1.35fr_0.75fr_0.7fr]">
          <div className="max-w-xl">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Tiles and showroom surfaces</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
              {siteConfig.name}
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">{siteConfig.description}</p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Navigate</p>
              <nav className="mt-5 flex flex-col gap-3 text-sm text-[var(--muted)]">
                {mainNav.slice(0, 6).map((item) => (
                  <Link key={item.href} href={item.href} className="transition hover:text-[var(--foreground)]">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Follow</p>
              <div className="mt-5 flex flex-col gap-3 text-sm text-[var(--muted)]">
                <Link href={siteConfig.socialLinks.instagram} className="transition hover:text-[var(--foreground)]">
                  Instagram
                </Link>
                <Link href={siteConfig.socialLinks.facebook} className="transition hover:text-[var(--foreground)]">
                  Facebook
                </Link>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Contact</p>
            <div className="mt-5 space-y-4 text-sm leading-6 text-[var(--muted)]">
              <p>{siteConfig.address}</p>
              <p>{siteConfig.phone}</p>
              <p>{siteConfig.email}</p>
            </div>
            <div className="mt-8 border-t border-[var(--border)] pt-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Legal</p>
              <div className="mt-4 flex flex-col gap-3 text-sm text-[var(--muted)]">
                {legalNav.map((item) => (
                  <Link key={item.href} href={item.href} className="transition hover:text-[var(--foreground)]">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[var(--border)] pt-6 text-xs uppercase tracking-[0.18em] text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>{year} {siteConfig.name}</p>
          <p>Curated materials for residential and commercial spaces</p>
        </div>
      </div>
    </footer>
  );
}
