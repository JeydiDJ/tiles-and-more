import Link from "next/link";
import { legalNav } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/layout/container";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-10">
      <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold">{siteConfig.name}</p>
          <p className="text-sm text-[var(--muted)]">
            {siteConfig.address} • {siteConfig.phone}
          </p>
        </div>
        <div className="flex gap-4 text-sm text-[var(--muted)]">
          {legalNav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}
