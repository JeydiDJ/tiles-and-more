"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

const INTRO_KEY = "tiles-and-more-intro-seen";
const INTRO_DURATION_MS = 1800;
const INTRO_START_SIZE = 160;
const INTRO_MORPH_DELAY_MS = 650;
const INTRO_TRACKING_STOP_MS = 1450;

export function SiteIntro({ children }: { children: React.ReactNode }) {
  const [introState, setIntroState] = useState<"pending" | "visible" | "hidden">("pending");
  const [logoBox, setLogoBox] = useState<CSSProperties | undefined>();
  const [isMorphing, setIsMorphing] = useState(false);
  const isMorphingRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hasSeenIntro = window.sessionStorage.getItem(INTRO_KEY) === "true";

    if (mediaQuery.matches || hasSeenIntro) {
      setIntroState("hidden");
      return;
    }

    window.sessionStorage.setItem(INTRO_KEY, "true");
    setIntroState("visible");

    const setCenteredBox = () => {
      setLogoBox({
        left: `calc(50vw - ${INTRO_START_SIZE / 2}px)`,
        top: `calc(50vh - ${INTRO_START_SIZE / 2}px)`,
        width: `${INTRO_START_SIZE}px`,
        height: `${INTRO_START_SIZE}px`,
      });
    };

    const moveToTarget = () => {
      const target = document.querySelector<HTMLElement>("[data-intro-logo-target]");

      if (!target) {
        return;
      }

      const rect = target.getBoundingClientRect();
      setLogoBox({
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      });
      isMorphingRef.current = true;
      setIsMorphing(true);
    };

    const followTarget = () => {
      if (!isMorphingRef.current) {
        return;
      }

      moveToTarget();
      rafRef.current = window.requestAnimationFrame(followTarget);
    };

    setCenteredBox();

    const morphTimeout = window.setTimeout(() => {
      moveToTarget();
      rafRef.current = window.requestAnimationFrame(followTarget);
    }, INTRO_MORPH_DELAY_MS);

    const finishTimeout = window.setTimeout(() => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      setIntroState("hidden");
    }, INTRO_DURATION_MS);

    const stopTrackingTimeout = window.setTimeout(() => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }, INTRO_TRACKING_STOP_MS);

    const handleResize = () => {
      if (isMorphingRef.current) {
        moveToTarget();
      } else {
        setCenteredBox();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.clearTimeout(morphTimeout);
      window.clearTimeout(finishTimeout);
      window.clearTimeout(stopTrackingTimeout);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div
        className={`site-intro-shell ${
          introState === "pending" ? "is-intro-pending" : introState === "visible" ? "is-intro-active" : ""
        }`}
      >
        {children}
      </div>

      {introState === "visible" ? (
        <>
          <div className="site-intro-overlay" aria-hidden="true" />
          <div className={`site-intro-mark ${isMorphing ? "is-morphing" : ""}`} style={logoBox}>
            <Image
              src="/logo/tilesandmore-logo.png"
              alt=""
              width={INTRO_START_SIZE}
              height={INTRO_START_SIZE}
              className="site-intro-logo"
              priority
            />
          </div>
        </>
      ) : null}
    </>
  );
}
