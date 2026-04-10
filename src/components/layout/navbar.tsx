"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav } from "@/config/nav";
import { siteConfig } from "@/config/site";

const utilityLinks = [
  { href: "/contact", label: "Visit Showroom" },
  { href: "/quote", label: "Request Quote" },
  { href: "/catalog", label: "Browse Catalog" },
];

const socialLinks = [
  { href: siteConfig.socialLinks.instagram, label: "Instagram", short: "IG" },
  { href: siteConfig.socialLinks.facebook, label: "Facebook", short: "FB" },
  { href: "https://pinterest.com", label: "Pinterest", short: "PI" },
  { href: "https://linkedin.com", label: "LinkedIn", short: "IN" },
];

function NavIcon({
  children,
  scrolled,
}: {
  children: React.ReactNode;
  scrolled: boolean;
}) {
  return (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center text-base transition ${
        scrolled
          ? "text-[#2a2825] hover:-translate-y-0.5 hover:text-[#c1272d]"
          : "text-white/90 hover:-translate-y-0.5 hover:text-[#c1272d]"
      }`}
    >
      {children}
    </span>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.05rem] w-[1.05rem] fill-none stroke-current">
      <circle cx="11" cy="11" r="6.25" strokeWidth="1.8" />
      <path d="m16 16 4 4" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.5rem] w-[1.5rem] fill-none stroke-current">
      <path d="M14 8h2V5h-2.4C11.6 5 10 6.6 10 8.6V11H8v3h2v5h3v-5h2.3l.7-3H13v-2.1c0-.6.4-.9 1-.9Z" strokeWidth="1.8" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.3rem] w-[1.3rem] fill-none stroke-current">
      <rect x="4" y="4" width="16" height="16" rx="4" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.5" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.5rem] w-[1.5rem] fill-none stroke-current">
      <path d="M20 8.7c-.1-1-.9-1.8-1.9-1.9C16.5 6.5 14.5 6.5 12 6.5s-4.5 0-6.1.3c-1 .1-1.8.9-1.9 1.9-.2 1-.2 1.9-.2 3.3s0 2.3.2 3.3c.1 1 .9 1.8 1.9 1.9 1.6.3 3.6.3 6.1.3s4.5 0 6.1-.3c1-.1 1.8-.9 1.9-1.9.2-1 .2-1.9.2-3.3s0-2.3-.2-3.3Z" strokeWidth="1.8" />
      <path d="m10 9.5 5 2.5-5 2.5v-5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.55rem] w-[1.55rem] fill-none stroke-current">
      <path d="M12 20s5-4.8 5-9a5 5 0 1 0-10 0c0 4.2 5 9 5 9Z" strokeWidth="1.8" />
      <circle cx="12" cy="11" r="1.8" strokeWidth="1.8" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.05rem] w-[1.05rem] fill-none stroke-current">
      <circle cx="12" cy="12" r="8" strokeWidth="1.8" />
      <path d="M4.5 12h15" strokeWidth="1.8" />
      <path d="M12 4c2.5 2.3 3.8 5 3.8 8S14.5 17.7 12 20c-2.5-2.3-3.8-5-3.8-8S9.5 6.3 12 4Z" strokeWidth="1.8" />
    </svg>
  );
}

function BrandWordmark({ scrolled }: { scrolled: boolean }) {
  return (
    <span
      className="text-[1.75rem] font-semibold uppercase leading-[0.9] tracking-[0.01em] sm:text-[2rem]"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <span className={scrolled ? "text-[#c1272d]" : "text-white"}>TILES</span>
      <span className={scrolled ? "text-[#333333]" : "text-white"}> &amp; MORE</span>
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 72);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 w-full">
        <div className={`transition-all duration-300 ${isScrolled ? "px-3 pt-3 sm:px-4" : ""}`}>
          <div
            className={`transition-all duration-300 ${
              isScrolled
                ? "rounded-[1.6rem] border border-black/8 bg-[#f5f3ef] text-[#1d1c1a] shadow-[0_10px_30px_rgba(0,0,0,0.16)]"
                : isHome
                  ? "bg-transparent text-white"
                  : "border-b border-white/10 bg-[#171615] text-white"
            }`}
          >
            <div className="grid min-h-[4.75rem] grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:min-h-[5.5rem] sm:gap-4 sm:px-8 lg:px-12">
              <div className="flex items-center gap-3 sm:gap-5">
                <button
                  type="button"
                  aria-label="Open navigation"
                  aria-expanded={isOpen}
                  onClick={() => setIsOpen(true)}
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition sm:h-10 sm:w-10 ${
                    isScrolled
                      ? "text-[#2a2825] hover:text-[#c1272d]"
                      : isHome
                        ? "text-white hover:text-[#c1272d]"
                        : "text-white hover:text-[#c1272d]"
                  }`}
                >
                  <span className="block h-px w-5 bg-current shadow-[0_6px_0_0_currentColor,0_-6px_0_0_currentColor]" />
                </button>
                <div
                  className={`hidden items-center gap-3 transition md:flex ${
                    isScrolled ? "px-4 py-2 text-[#70695f] hover:text-[#c1272d]" : "text-white/70 hover:text-white"
                  }`}
                >
                  <NavIcon scrolled={isScrolled}>
                    <SearchIcon />
                  </NavIcon>
                  <span className="text-sm font-medium">Product search</span>
                </div>
              </div>

              <Link href="/" className="flex min-w-0 items-center justify-center gap-2 sm:gap-3">
                <span
                  data-intro-logo-target
                  className="flex h-9 w-9 shrink-0 items-center justify-center sm:h-12 sm:w-12"
                >
                  <Image
                    src="/logo/tilesandmore-logo.png"
                    alt="Tiles and More logo"
                    width={46}
                    height={46}
                    className="h-9 w-9 object-contain sm:h-12 sm:w-12"
                    priority
                  />
                </span>
                <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                  <BrandWordmark scrolled={isScrolled} />
                </span>
              </Link>

              <div className="flex items-center justify-end gap-1 sm:gap-3">
                <div className="hidden items-center gap-1 sm:flex">
                  <NavIcon scrolled={isScrolled}>
                    <LocationIcon />
                  </NavIcon>
                  <NavIcon scrolled={isScrolled}>
                    <FacebookIcon />
                  </NavIcon>
                  <NavIcon scrolled={isScrolled}>
                    <InstagramIcon />
                  </NavIcon>
                  <NavIcon scrolled={isScrolled}>
                    <YoutubeIcon />
                  </NavIcon>
                </div>
                <div className="sm:hidden">
                  <NavIcon scrolled={isScrolled}>
                    <LocationIcon />
                  </NavIcon>
                </div>
                <div
                  className={`hidden items-center gap-2 px-2 text-sm uppercase tracking-[0.16em] transition sm:flex ${
                    isScrolled ? "px-4 py-3 text-[#2a2825] hover:text-[#c1272d]" : "text-white/90 hover:text-[#c1272d]"
                  }`}
                >
                  <GlobeIcon />
                  <span>EN</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {!isHome ? <div aria-hidden="true" className="h-[5.5rem]" /> : null}

      <div
        className={`fixed inset-0 z-40 bg-black/70 transition ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-full max-w-[36rem] flex-col overflow-hidden border-r border-black/8 bg-white text-[#1d1c1a] shadow-[0_24px_60px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!isOpen}
      >
        <div className="relative flex items-center justify-between border-b border-black/8 px-5 py-5 sm:px-8 sm:py-7">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setIsOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center text-3xl leading-none text-[#1d1c1a] transition hover:text-black"
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={() => setIsOpen(false)}
          >
            <Image
              src="/logo/tilesandmore-logo.png"
              alt="Tiles and More logo"
              width={42}
              height={42}
              className="h-9 w-9 object-contain"
            />
            <span
              className="text-2xl font-semibold uppercase leading-[0.9] tracking-[0.01em] text-[#1d1c1a]"
              style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
            >
              <span className="text-[#c1272d]">TILES</span>
              <span className="text-[#333333]"> &amp; MORE</span>
            </span>
          </Link>
        </div>

        <div className="relative flex flex-1 flex-col overflow-y-auto px-5 pb-6 sm:px-8 sm:pb-8">
          <div className="border-b border-black/8 pb-5 pt-5 sm:pb-6 sm:pt-6">
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#8a837a]">Navigation</p>
          </div>

          <nav className="border-b border-black/8 pb-6 pt-4 sm:pb-8 sm:pt-6">
            <div className="space-y-1">
              {mainNav.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group relative flex items-baseline justify-between gap-4 border-b px-0 py-4 transition duration-300 sm:py-5 ${
                    pathname === item.href
                      ? "border-black/12 text-black"
                      : "border-transparent text-[#2d2a26] hover:border-black/10"
                  }`}
                >
                  <span
                    className={`font-serif text-[2rem] font-medium leading-none tracking-tight transition duration-300 sm:text-[2.7rem] ${
                      pathname === item.href
                        ? "text-[#c1272d]"
                        : "group-hover:text-[#c1272d]"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`text-[0.72rem] uppercase tracking-[0.24em] transition ${
                      pathname === item.href
                        ? "text-[#c1272d]"
                        : "text-[#8a837a] group-hover:-translate-x-1 group-hover:text-[#c1272d]"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="grid gap-8 py-6 sm:grid-cols-[1fr_0.95fr] sm:gap-10 sm:py-8">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#8a837a]">Quick Access</p>
              <div className="mt-4 space-y-3">
                {utilityLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-sm text-[#3a3733] transition hover:text-[#9f6a3d] sm:text-[0.95rem]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-black/8 pt-5 sm:hidden">
                <Link
                  href={siteConfig.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center border border-black/10 text-[#2d2a25] transition hover:border-black hover:text-black"
                >
                  <FacebookIcon />
                </Link>
                <Link
                  href={siteConfig.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center border border-black/10 text-[#2d2a25] transition hover:border-black hover:text-black"
                >
                  <InstagramIcon />
                </Link>
                <Link
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center border border-black/10 text-[#2d2a25] transition hover:border-black hover:text-black"
                >
                  <YoutubeIcon />
                </Link>
                <div className="ml-auto flex items-center gap-2 border border-black/10 px-4 py-2 text-sm uppercase tracking-[0.16em] text-[#5f5a53]">
                  <GlobeIcon />
                  <span>EN</span>
                </div>
              </div>
            </div>

            <div className="text-sm">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#8a837a]">Showroom</p>
              <div className="mt-4 space-y-3 text-[0.95rem] leading-7 text-[#5f5a53]">
                <p>{siteConfig.address}</p>
                <p>{siteConfig.phone}</p>
                <p>{siteConfig.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-auto hidden border-t border-black/8 pt-6 sm:block">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm uppercase tracking-[0.18em] text-[#8a837a]">Follow us</p>
              <div className="flex gap-3">
                {socialLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="inline-flex h-10 w-10 items-center justify-center border border-black/10 text-xs font-semibold uppercase tracking-[0.16em] text-[#2d2a25] transition hover:border-black hover:text-black"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.short}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
