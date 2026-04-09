import Link from "next/link";
import { adminNav } from "@/config/nav";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
      <aside className="border-r border-[var(--border)] bg-[rgba(255,250,242,0.88)] p-6">
        <p className="text-lg font-semibold">Admin Dashboard</p>
        <nav className="mt-6 grid gap-3 text-sm text-[var(--muted)]">
          {adminNav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-2xl px-3 py-2 transition hover:bg-white hover:text-[var(--foreground)]">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="p-6 sm:p-8">{children}</main>
    </div>
  );
}
