"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav } from "@/config/nav";
import { siteConfig } from "@/config/site";

const utilityLinks = [
  { href: "/contact", label: "Visit Showroom" },
  { href: "/quote", label: "Request Quote" },
  { href: "/catalog", label: "Browse Catalog" },
];

const socialLinks = [
  { href: siteConfig.socialLinks.instagram, label: "Instagram", icon: InstagramIcon },
  { href: siteConfig.socialLinks.facebook, label: "Facebook", icon: FacebookIcon },
  { href: "https://pinterest.com", label: "Pinterest", icon: PinterestIcon },
  { href: "https://linkedin.com", label: "LinkedIn", icon: LinkedInIcon },
];

function NavIcon({
  children,
  scrolled,
  light,
}: {
  children: React.ReactNode;
  scrolled: boolean;
  light?: boolean;
}) {
  return (
    <span
      className={`inline-flex h-8 w-8 cursor-pointer items-center justify-center text-base transition ${
        scrolled || light
          ? "text-[#231f20] hover:-translate-y-0.5 hover:text-[#ed2325]"
          : "text-white/90 hover:-translate-y-0.5 hover:text-[#ed2325]"
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

function PinterestIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.35rem] w-[1.35rem] fill-none stroke-current">
      <path
        d="M12 4.5c-4 0-6.5 2.8-6.5 6.1 0 2.3 1.2 4 3 4.7.3.1.4 0 .5-.2l.5-1.8c.1-.2 0-.3-.2-.5-.5-.6-.9-1.5-.9-2.5 0-2.4 1.8-4.7 5-4.7 2.7 0 4.2 1.7 4.2 4 0 3-1.3 5.5-3.3 5.5-1.1 0-1.9-.9-1.6-2 .3-1.3.8-2.7.8-3.6 0-.8-.4-1.5-1.4-1.5-1.1 0-2 1.1-2 2.7 0 1 .3 1.7.3 1.7l-1.2 5.1c-.2.9 0 2.4.1 3.2"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.35rem] w-[1.35rem] fill-none stroke-current">
      <path d="M7.2 9.3V19" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12.2 12.7V19" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12.2 14.3c0-2.1 1.3-3.5 3.3-3.5 1.9 0 3.1 1.2 3.1 3.7V19" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7.2" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
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

function ContactIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.55rem] w-[1.55rem] fill-none stroke-current">
      <rect x="4.5" y="7.5" width="15" height="9" rx="1.5" strokeWidth="1.8" />
      <path d="m5.5 8.5 6.5 5 6.5-5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

function BrandWordmark({
  scrolled,
  light,
  compact,
}: {
  scrolled: boolean;
  light?: boolean;
  compact?: boolean;
}) {
  const useDarkText = scrolled || light;

  return (
    <span
      className={`font-semibold uppercase leading-[0.9] tracking-[0.01em] ${
        compact ? "text-[1.28rem] sm:text-[2rem]" : "text-[1.75rem] sm:text-[2rem]"
      }`}
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <span className={useDarkText ? "text-[#ed2325]" : "text-white"}>TILES</span>
      <span className={useDarkText ? "text-[#231f20]" : "text-white"}> &amp; MORE</span>
    </span>
  );
}

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isCatalogPage = pathname === "/catalog";
  const isTransparentHeroPage = pathname === "/" || pathname === "/catalog";
  const useLightChrome = isScrolled || !isTransparentHeroPage;
  const showroomMapHref = siteConfig.showroomMapUrl;

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
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setIsScrolled(false);
    setIsOpen(false);
  }, [pathname]);

  function submitSearch() {
    const normalized = searchQuery.trim();
    router.push(normalized ? `/catalog?q=${encodeURIComponent(normalized)}` : "/catalog");
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 w-full">
        <div className={`transition-all duration-300 ${isScrolled ? "px-3 pt-3 sm:px-4" : ""}`}>
          <div
            className={`transition-all duration-300 ${
              isScrolled
                ? "rounded-[1.6rem] border border-black/8 bg-[#f4f4f4] text-[#231f20] shadow-[0_10px_30px_rgba(0,0,0,0.16)]"
                : isTransparentHeroPage
                  ? "bg-transparent text-white"
                  : "border-b border-black/8 bg-white text-[#231f20] shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
            }`}
          >
            <div className="grid min-h-[4.75rem] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 sm:min-h-[5.5rem] sm:grid-cols-[1fr_auto_1fr] sm:gap-4 sm:px-8 lg:px-12">
              <div className="flex items-center gap-3 justify-self-start sm:gap-5">
                <button
                  type="button"
                  aria-label="Open navigation"
                  aria-expanded={isOpen}
                  onClick={() => setIsOpen(true)}
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition sm:h-10 sm:w-10 ${
                    useLightChrome
                      ? "text-[#231f20] hover:text-[#ed2325]"
                      : "text-white hover:text-[#ed2325]"
                  }`}
                >
                  <span className="block h-px w-5 bg-current shadow-[0_6px_0_0_currentColor,0_-6px_0_0_currentColor]" />
                </button>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    submitSearch();
                  }}
                  className={`hidden md:flex md:min-w-[18rem] md:max-w-[26rem] md:flex-1 md:items-center md:gap-3 md:px-4 md:py-2 ${
                    useLightChrome
                      ? "text-[#231f20]"
                      : "text-white"
                  }`}
                >
                  <span className={useLightChrome ? "text-[#59595b]" : "text-white/76"}>
                    <SearchIcon />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search products"
                    className={`w-full bg-transparent text-sm outline-none ${
                      useLightChrome ? "placeholder:text-[#8f8b85]" : "placeholder:text-white/56"
                    }`}
                  />
                </form>
              </div>

              <Link href="/" className="flex min-w-0 items-center justify-center gap-2 justify-self-center sm:gap-3">
                <span
                  data-intro-logo-target
                  className="flex h-8 w-8 shrink-0 items-center justify-center sm:h-12 sm:w-12"
                >
                  <Image
                    src="/logo/tilesandmore-logo.png"
                    alt="Tiles and More logo"
                    width={46}
                    height={46}
                    className="h-8 w-8 object-contain sm:h-12 sm:w-12"
                    priority
                  />
                </span>
                <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                  <BrandWordmark scrolled={isScrolled} light={!isTransparentHeroPage} compact />
                </span>
              </Link>

              <div className="flex items-center justify-end gap-1 justify-self-end sm:gap-3">
                <Link
                  href={showroomMapHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open showroom location"
                  className="hidden shrink-0 sm:inline-flex"
                >
                  <NavIcon scrolled={isScrolled} light={!isTransparentHeroPage}>
                    <span className="-translate-y-1">
                    <LocationIcon />
                    </span>
                  </NavIcon>
                </Link>
                <Link href="/contact" aria-label="Open contact page" className="inline-flex shrink-0">
                  <NavIcon scrolled={isScrolled} light={!isTransparentHeroPage}>
                    <span className="-translate-y-1">
                    <ContactIcon />
                    </span>
                  </NavIcon>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {!isTransparentHeroPage ? <div aria-hidden="true" className="h-[5.5rem]" /> : null}

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
              <span className="text-[#ed2325]">TILES</span>
              <span className="text-[#231f20]"> &amp; MORE</span>
            </span>
          </Link>
        </div>

        <div className="relative flex flex-1 flex-col overflow-y-auto px-5 pb-6 sm:px-8 sm:pb-8">
         

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
                        ? "text-[#ed2325]"
                        : "group-hover:text-[#ed2325]"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`text-[0.72rem] uppercase tracking-[0.24em] transition ${
                      pathname === item.href
                        ? "text-[#ed2325]"
                        : "text-[#59595b] group-hover:-translate-x-1 group-hover:text-[#ed2325]"
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
                    className="block text-sm text-[#231f20] transition hover:text-[#ed2325] sm:text-[0.95rem]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <Link
                href={showroomMapHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className="mt-5 inline-flex items-center gap-3 text-sm text-[#231f20] transition hover:text-[#ed2325] sm:hidden"
              >
                <LocationIcon />
                <span>Open Showroom Map</span>
              </Link>

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
                    aria-label={item.label}
                    className="inline-flex h-10 w-10 items-center justify-center border border-black/10 text-[#2d2a25] transition hover:border-black hover:text-black"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <item.icon />
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
