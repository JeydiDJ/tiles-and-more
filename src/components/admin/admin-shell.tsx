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

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.1rem] w-[1.1rem] fill-none stroke-current">
      <rect x="4.5" y="6" width="15" height="13.5" rx="2.5" strokeWidth="1.7" />
      <path d="M8 4.5v3" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M16 4.5v3" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M4.5 9.5h15" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M8.5 13h3" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M8.5 16h6.5" strokeWidth="1.7" strokeLinecap="round" />
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
    case "CRM":
      return <InquiryIcon />;
    case "Calendar":
      return <CalendarIcon />;
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
        "grid min-h-screen bg-[#f6f7fb] transition-[grid-template-columns] duration-300",
        collapsed ? "lg:grid-cols-[104px_1fr]" : "lg:grid-cols-[292px_1fr]",
      )}
    >
      <aside
        className={cn(
          "flex min-h-full flex-col border-r border-[#e7e9f2] bg-[#ffffff] px-5 py-6 text-[#231f20] sm:px-6",
          collapsed && "cursor-e-resize",
        )}
        onClick={collapsed ? () => setCollapsed(false) : undefined}
      >
        <div className={cn("flex items-start", collapsed ? "flex-col items-center gap-4" : "justify-between gap-3")}>
          <Link href={getAdminRoute()} className="transition hover:opacity-92">
            <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#eceef5] bg-[#f7f8fc] shadow-[0_8px_24px_rgba(35,31,32,0.06)]">
                <Image src="/logo/tilesandmore-logo.png" alt="Tiles and More logo" width={42} height={42} className="h-10 w-10 object-contain" priority />
              </div>
              {!collapsed ? (
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#8a8793]">Tiles & More</p>
                  <p className="mt-1 text-xl font-semibold tracking-tight text-[#17141a]">Admin Workspace</p>
                </div>
              ) : null}
            </div>
          </Link>

          {!collapsed ? (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              aria-label="Collapse menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#eceef5] bg-[#f7f8fc] text-[#5b5763] transition hover:border-[#d8dce8] hover:bg-white"
            >
              <CollapseIcon />
            </button>
          ) : null}
        </div>

        <div className={cn("mt-8 border-t border-[#edf0f6] pt-6", collapsed ? "px-1" : "")}>
          {!collapsed ? (
            <p className="pb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#9a96a3]">Navigation</p>
          ) : null}

          <nav className={cn("grid text-sm", collapsed ? "gap-2" : "gap-1")}>
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
                    ? "flex h-11 items-center justify-center rounded-2xl text-[#7c7784] hover:bg-white hover:text-[#17141a]"
                    : "flex items-center gap-3 rounded-xl px-3 py-3 text-[#68636f] hover:bg-white hover:text-[#17141a]",
                  isActive &&
                    (collapsed
                      ? "bg-[var(--brand)] text-white shadow-[0_12px_24px_rgba(237,35,37,0.22)]"
                      : "bg-white text-[#17141a] shadow-[0_10px_24px_rgba(35,31,32,0.08)]"),
                )}
              >
                {collapsed ? getNavIcon(item.label) : <><span className={cn(isActive ? "text-[var(--brand)]" : "text-[#8d8896]")}>{getNavIcon(item.label)}</span><span>{item.label}</span></>}
              </Link>
            );
          })}
          </nav>
        </div>

        <div className="mt-auto border-t border-[#edf0f6] pt-5">
          <AdminSessionBar email={userEmail} compact={collapsed} />
        </div>
      </aside>

      <main className="p-5 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1500px]">{children}</div>
      </main>
    </div>
  );
}
