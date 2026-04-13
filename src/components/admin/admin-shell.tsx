"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AdminSessionBar } from "@/components/admin/admin-session-bar";
import { adminNav } from "@/config/nav";
import { getAdminRoute } from "@/lib/admin-path";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  children: React.ReactNode;
  userEmail?: string;
};

function CollapseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.1rem] w-[1.1rem] fill-none stroke-current">
      <path d="M4 7h16" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 12h10" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 17h16" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.1rem] w-[1.1rem] fill-none stroke-current">
      <path d="M4.5 4.5h6.5v6.5H4.5Z" strokeWidth="1.7" />
      <path d="M13 4.5h6.5v4.5H13Z" strokeWidth="1.7" />
      <path d="M13 11h6.5v8.5H13Z" strokeWidth="1.7" />
      <path d="M4.5 13h6.5v6.5H4.5Z" strokeWidth="1.7" />
    </svg>
  );
}

function ProductIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.1rem] w-[1.1rem] fill-none stroke-current">
      <path d="M12 3.8 19 7.5v9L12 20.2 5 16.5v-9L12 3.8Z" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m5.5 7.8 6.5 3.7 6.5-3.7" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 11.5v8" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function CategoryIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.1rem] w-[1.1rem] fill-none stroke-current">
      <path d="M5 6.5h14" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M5 12h14" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M5 17.5h14" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="7" cy="6.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="7" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="7" cy="17.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CollectionIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.1rem] w-[1.1rem] fill-none stroke-current">
      <rect x="4.5" y="5" width="6.5" height="6.5" strokeWidth="1.7" />
      <rect x="13" y="5" width="6.5" height="6.5" strokeWidth="1.7" />
      <rect x="4.5" y="13.5" width="6.5" height="6.5" strokeWidth="1.7" />
      <rect x="13" y="13.5" width="6.5" height="6.5" strokeWidth="1.7" />
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.1rem] w-[1.1rem] fill-none stroke-current">
      <rect x="4.5" y="5" width="15" height="14" strokeWidth="1.7" />
      <circle cx="9" cy="10" r="1.6" strokeWidth="1.7" />
      <path d="m6.5 17 4.2-4.2 2.8 2.8 2.5-2.5 2 1.9" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InquiryIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.1rem] w-[1.1rem] fill-none stroke-current">
      <path d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v6A2.5 2.5 0 0 1 16.5 16H11l-4 3v-3H7.5A2.5 2.5 0 0 1 5 13.5Z" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8.5 9.5h7" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M8.5 12.5h5" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function getNavIcon(label: string) {
  switch (label) {
    case "Dashboard":
      return <DashboardIcon />;
    case "Products":
      return <ProductIcon />;
    case "Categories":
      return <CategoryIcon />;
    case "Collections":
      return <CollectionIcon />;
    case "Gallery":
      return <GalleryIcon />;
    case "Inquiries":
      return <InquiryIcon />;
    default:
      return <DashboardIcon />;
  }
}

export function AdminShell({ children, userEmail }: AdminShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "grid min-h-screen bg-[linear-gradient(180deg,#fff8f5_0%,#f6f6f6_55%,#efefef_100%)] transition-[grid-template-columns] duration-300",
        collapsed ? "lg:grid-cols-[96px_1fr]" : "lg:grid-cols-[310px_1fr]",
      )}
    >
      <aside
        className={cn(
          "flex min-h-full flex-col bg-[linear-gradient(180deg,#ed2325_0%,#cb171f_55%,#7d0f18_100%)] px-5 py-7 text-white shadow-[20px_0_45px_rgba(35,31,32,0.18)] sm:px-6",
          collapsed && "cursor-e-resize",
        )}
        onClick={collapsed ? () => setCollapsed(false) : undefined}
      >
        <div className={cn("flex items-start", collapsed ? "flex-col items-center gap-4" : "justify-between gap-3")}>
          <Link href={getAdminRoute()} className="transition hover:opacity-92">
            <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                <Image src="/logo/tilesandmore-logo.png" alt="Tiles and More logo" width={42} height={42} className="h-10 w-10 object-contain" priority />
              </div>
              {!collapsed ? (
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.26em] text-white/72">Tiles & More</p>
                  <p className="mt-1 text-xl font-semibold tracking-tight">Admin Dashboard</p>
                </div>
              ) : null}
            </div>
          </Link>

          {!collapsed ? (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              aria-label="Collapse menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition hover:bg-white/10"
            >
              <CollapseIcon />
            </button>
          ) : null}
        </div>

        <nav className={cn("mt-8 grid text-sm", collapsed ? "gap-3" : "gap-1")}>
          {adminNav.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                onClick={collapsed ? (event) => event.stopPropagation() : undefined}
                className={cn(
                  "font-medium transition",
                  collapsed
                    ? "flex h-11 items-center justify-center rounded-full border border-white/16 text-white/88 hover:bg-white/12"
                    : "border-b border-white/12 px-0 py-3 text-white/88 hover:pl-2 hover:text-white",
                  isActive && (collapsed ? "border-white bg-black/18 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]" : "pl-2 text-white"),
                )}
              >
                {collapsed ? getNavIcon(item.label) : item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <AdminSessionBar email={userEmail} compact={collapsed} />
        </div>
      </aside>

      <main className="p-6 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}
