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
        scrolled ? "text-[#2a2825]" : "text-white/90"
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
            <div className="grid min-h-[5.5rem] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:px-8 lg:px-12">
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  aria-label="Open navigation"
                  aria-expanded={isOpen}
                  onClick={() => setIsOpen(true)}
                  className={`inline-flex h-10 w-10 items-center justify-center transition ${
                    isScrolled
                      ? "text-[#2a2825] hover:bg-black/5"
                      : isHome
                        ? "text-white hover:bg-white/5"
                        : "border border-white/10 text-white hover:bg-white/5"
                  }`}
                >
                  <span className="block h-px w-5 bg-current shadow-[0_6px_0_0_currentColor,0_-6px_0_0_currentColor]" />
                </button>
                <div
                  className={`hidden items-center gap-3 transition md:flex ${
                    isScrolled ? "px-4 py-2 text-[#70695f]" : "text-white/70"
                  }`}
                >
                  <NavIcon scrolled={isScrolled}>
                    <SearchIcon />
                  </NavIcon>
                  <span className="text-sm font-medium">Product search</span>
                </div>
              </div>

              <Link href="/" className="flex items-center justify-center gap-3">
                <span
                  data-intro-logo-target
                  className="flex h-10 w-10 items-center justify-center sm:h-12 sm:w-12"
                >
                  <Image
                    src="/logo/tilesandmore-logo.png"
                    alt="Tiles and More logo"
                    width={46}
                    height={46}
                    className="h-10 w-10 object-contain sm:h-12 sm:w-12"
                    priority
                  />
                </span>
                <BrandWordmark scrolled={isScrolled} />
              </Link>

              <div className="flex items-center justify-end gap-1 sm:gap-3">
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
                <div
                  className={`flex items-center gap-2 px-2 text-sm uppercase tracking-[0.16em] transition ${
                    isScrolled ? "rounded-full bg-black/6 px-4 py-3 text-[#2a2825]" : "text-white/90"
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
        className={`fixed left-0 top-0 z-50 flex h-screen w-full max-w-[40rem] flex-col bg-[#f5f3ef] text-[#1d1c1a] transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between px-8 py-7">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setIsOpen(false)}
            className="inline-flex h-12 w-12 items-center justify-center bg-black/5 text-3xl leading-none text-[#2a2825] transition hover:bg-black/10"
          >
            x
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

        <div className="flex flex-1 flex-col overflow-y-auto px-8 pb-8">
          <nav className="border-b border-black/10 pb-8 pt-4">
            <div className="space-y-2">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-4 font-serif text-4xl font-medium tracking-tight text-[#272521] transition hover:text-black sm:text-5xl"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="grid gap-12 py-8 sm:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              {utilityLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg text-[#2c2a26] transition hover:text-black"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="space-y-3 text-sm text-[#5f5a53]">
              <p className="uppercase tracking-[0.18em]">Showroom</p>
              <p>{siteConfig.address}</p>
              <p>{siteConfig.phone}</p>
              <p>{siteConfig.email}</p>
            </div>
          </div>

          <div className="mt-auto border-t border-black/10 pt-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm uppercase tracking-[0.18em] text-[#6f695f]">Follow us</p>
              <div className="flex gap-3">
                {socialLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="inline-flex h-10 w-10 items-center justify-center border border-black/10 text-xs font-semibold uppercase tracking-[0.16em] text-[#2d2a25] transition hover:bg-black hover:text-white"
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
