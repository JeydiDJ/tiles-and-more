"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const BOTTOM_THRESHOLD_PX = 180;

export function ScrollToTopButton() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const isEnabledPage = pathname === "/" || pathname === "/catalog";

  useEffect(() => {
    if (!isEnabledPage) {
      setIsVisible(false);
      return;
    }

    const updateVisibility = () => {
      const documentHeight = document.documentElement.scrollHeight;
      const viewportBottom = window.scrollY + window.innerHeight;
      const isNearBottom = documentHeight - viewportBottom <= BOTTOM_THRESHOLD_PX;

      setIsVisible(isNearBottom);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [isEnabledPage, pathname]);

  if (!isEnabledPage) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="Return to top"
      onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
      className={`fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#231f20]/12 bg-white text-[#231f20] shadow-[0_18px_40px_rgba(35,31,32,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#231f20] hover:text-white sm:bottom-8 sm:right-8 ${
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
      }`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
        <path d="M12 18V6" strokeLinecap="round" />
        <path d="m6.75 11.25 5.25-5.25 5.25 5.25" strokeLinecap="round" strokeLinejoin="miter" />
      </svg>
    </button>
  );
}
