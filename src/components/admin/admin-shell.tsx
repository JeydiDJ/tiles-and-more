"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.1rem] w-[1.1rem] fill-none stroke-current">
      <path d="m6 6 12 12" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 6 6 18" strokeWidth="1.8" strokeLinecap="round" />
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

function CrmIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.1rem] w-[1.1rem] fill-none stroke-current">
      <path d="M5 18.5h14" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M7.5 18.5V9.5" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 18.5V5.5" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M16.5 18.5v-6" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="7.5" cy="8" r="1.5" strokeWidth="1.7" />
      <circle cx="12" cy="4" r="1.5" strokeWidth="1.7" />
      <circle cx="16.5" cy="11" r="1.5" strokeWidth="1.7" />
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

function AccountingIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.1rem] w-[1.1rem] fill-none stroke-current">
      <path d="M5 18.5h14" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M7.5 15V8.5" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 15V5.5" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M16.5 15v-4" strokeWidth="1.7" strokeLinecap="round" />
      <path d="m6 10.5 1.5-2 2.5 2.5 3.5-4 4 2" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PreferencesIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.1rem] w-[1.1rem] fill-none stroke-current">
      <circle cx="12" cy="12" r="3.2" strokeWidth="1.7" />
      <path d="M12 3.8v2.1" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 18.1v2.1" strokeWidth="1.7" strokeLinecap="round" />
      <path d="m18.2 5.8-1.5 1.5" strokeWidth="1.7" strokeLinecap="round" />
      <path d="m7.3 16.7-1.5 1.5" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M20.2 12h-2.1" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M5.9 12H3.8" strokeWidth="1.7" strokeLinecap="round" />
      <path d="m18.2 18.2-1.5-1.5" strokeWidth="1.7" strokeLinecap="round" />
      <path d="m7.3 7.3-1.5-1.5" strokeWidth="1.7" strokeLinecap="round" />
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
      return <CrmIcon />;
    case "Inbox":
      return <InquiryIcon />;
    case "Calendar":
      return <CalendarIcon />;
    case "Accounting":
      return <AccountingIcon />;
    case "Preferences":
      return <PreferencesIcon />;
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isDesktopHoveringNav, setIsDesktopHoveringNav] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const isDesktopExpanded = isLargeScreen ? !collapsed || isDesktopHoveringNav : true;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateScreenSize = (event?: MediaQueryListEvent) => {
      const matches = event?.matches ?? mediaQuery.matches;

      setIsLargeScreen(matches);
      setMobileNavOpen(false);
      setIsDesktopHoveringNav(false);
      setCollapsed(matches);
    };

    updateScreenSize();
    mediaQuery.addEventListener("change", updateScreenSize);

    return () => {
      mediaQuery.removeEventListener("change", updateScreenSize);
    };
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const adminScope = `/${window.location.pathname.split("/").filter(Boolean)[0] ?? ""}`.replace(/\/+$/, "");

    navigator.serviceWorker.register("/admin-sw.js", { scope: adminScope }).catch(() => {
      return undefined;
    });
  }, []);

  useEffect(() => {
    window.setTimeout(() => {
      setMobileNavOpen(false);
      if (isLargeScreen) {
        setCollapsed(true);
      }
      setIsDesktopHoveringNav(false);
    }, 0);
  }, [isLargeScreen, pathname]);

  return (
    <div
      className={cn(
        "admin-theme-root min-h-screen bg-[#f6f7fb] lg:grid lg:h-screen lg:overflow-hidden lg:transition-[grid-template-columns] lg:duration-300 lg:ease-out",
        isDesktopExpanded ? "lg:grid-cols-[292px_1fr]" : "lg:grid-cols-[104px_1fr]",
      )}
    >
      <div className="sticky top-0 z-30 border-b border-[#e7e9f2] bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="relative flex min-h-11 items-center justify-center">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
            className="absolute left-0 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-[#eceef5] bg-[#f7f8fc] text-[#5b5763] transition hover:border-[#d8dce8] hover:bg-white"
          >
            <CollapseIcon />
          </button>
          <Link href={getAdminRoute()} className="mx-auto min-w-0 max-w-[calc(100%-4rem)]">
            <div className="flex items-center justify-center gap-3 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#eceef5] bg-[#f7f8fc]">
                <Image src="/logo/tilesandmore-logo.png" alt="Tiles and More logo" width={34} height={34} className="h-8 w-8 object-contain" priority />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[10px] uppercase tracking-[0.22em] text-[#8a8793]">Tiles & More</p>
                <p className="truncate text-sm font-semibold tracking-tight text-[#17141a]">Admin Workspace</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-[#17141a]/35 transition-opacity duration-200 lg:hidden",
          mobileNavOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileNavOpen(false)}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-[320px] flex-col border-r border-[#e7e9f2] bg-[#ffffff] px-5 py-6 text-[#231f20] transition-transform duration-200 sm:px-6 lg:static lg:min-h-full lg:w-auto lg:max-w-none lg:translate-x-0 lg:overflow-y-auto",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full",
          isLargeScreen && collapsed && "cursor-e-resize",
        )}
        onClick={isLargeScreen && collapsed ? () => setCollapsed(false) : undefined}
        onMouseEnter={() => {
          if (isLargeScreen && collapsed) {
            setIsDesktopHoveringNav(true);
          }
        }}
        onMouseLeave={() => {
          if (isLargeScreen && collapsed) {
            setIsDesktopHoveringNav(false);
          }
        }}
      >
        <div className={cn("flex min-h-[5.5rem] items-start", isDesktopExpanded ? "justify-between gap-3" : "justify-center")}>
          <Link href={getAdminRoute()} className="transition hover:opacity-92">
            <div className={cn("flex items-center", isDesktopExpanded ? "gap-3" : "justify-center")}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#eceef5] bg-[#f7f8fc] shadow-[0_8px_24px_rgba(35,31,32,0.06)]">
                <Image src="/logo/tilesandmore-logo.png" alt="Tiles and More logo" width={42} height={42} className="h-10 w-10 object-contain" priority />
              </div>
              {isDesktopExpanded ? (
                <div className="min-w-0 whitespace-nowrap">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#8a8793]">Tiles & More</p>
                  <p className="mt-1 whitespace-nowrap text-xl font-semibold tracking-tight text-[#17141a]">Admin</p>
                </div>
              ) : null}
            </div>
          </Link>

          {isDesktopExpanded ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#eceef5] bg-[#f7f8fc] text-[#5b5763] transition hover:border-[#d8dce8] hover:bg-white lg:hidden"
              >
                <CloseIcon />
              </button>
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                aria-label="Collapse menu"
                className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-[#eceef5] bg-[#f7f8fc] text-[#5b5763] transition hover:border-[#d8dce8] hover:bg-white lg:inline-flex"
              >
                <CollapseIcon />
              </button>
            </div>
          ) : null}
        </div>

        <div className={cn("border-t border-[#edf0f6] pt-3", isDesktopExpanded ? "" : "px-1")}>
          <nav className={cn("grid text-sm", isDesktopExpanded ? "gap-2" : "gap-2")}>
          {adminNav.map((item) => {
            const isRootAdminRoute = item.href === getAdminRoute();
            const isActive = isRootAdminRoute
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isLargeScreen && !isDesktopExpanded ? item.label : undefined}
                onClick={(event) => {
                  if (isLargeScreen && !isDesktopExpanded) {
                    event.stopPropagation();
                  }
                  if (isLargeScreen) {
                    setCollapsed(true);
                  }
                  setIsDesktopHoveringNav(false);
                  setMobileNavOpen(false);
                }}
                className={cn(
                  "group relative font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                  isDesktopExpanded
                    ? "flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-[#68636f] outline-none transition-[background-color,color,box-shadow] duration-200 ease-out hover:border-transparent hover:bg-white hover:text-[#17141a]"
                    : "flex h-12 items-center rounded-2xl border border-transparent px-3 text-[#7c7784] transition-all duration-200 ease-out hover:border-[#f4c8cb] hover:bg-[linear-gradient(135deg,#fff7f7_0%,#ffffff_100%)] hover:text-[var(--brand)] hover:shadow-[0_12px_24px_rgba(237,35,37,0.1)]",
                  isActive &&
                    (isDesktopExpanded
                      ? "border-transparent bg-white text-[#17141a] shadow-[0_10px_24px_rgba(35,31,32,0.08)]"
                      : "border-[var(--brand)] bg-[var(--brand)] text-white shadow-[0_12px_24px_rgba(237,35,37,0.22)]"),
                )}
              >
                {isDesktopExpanded ? (
                  <>
                    <span
                      className={cn(
                        "transition-[transform,opacity,color] duration-200 ease-out",
                        isActive ? "text-[var(--brand)]" : "text-[#8d8896] group-hover:text-[var(--brand)]",
                      )}
                    >
                      {getNavIcon(item.label)}
                    </span>
                    <span className="flex-1 transition-[opacity,transform] duration-200 ease-out">{item.label}</span>
                    <span
                      className={cn(
                        "absolute inset-y-2 left-0 w-1 rounded-r-full transition-opacity duration-200 ease-out",
                        isActive ? "bg-[var(--brand)] opacity-100" : "bg-[#f3b1b6] opacity-0 group-hover:opacity-100",
                      )}
                    />
                  </>
                ) : (
                  getNavIcon(item.label)
                )}
              </Link>
            );
          })}
          </nav>
        </div>

        <div className="mt-auto border-t border-[#edf0f6] pt-5">
          <AdminSessionBar email={userEmail} compact={isLargeScreen && !isDesktopExpanded} />
        </div>
      </aside>

      <main className="min-h-0 overflow-y-auto p-4 sm:p-5 lg:p-8">
        <div className="mx-auto max-w-[1500px]">{children}</div>
      </main>
    </div>
  );
}
