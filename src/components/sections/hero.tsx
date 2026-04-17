"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SLIDE_DURATION_MS = 20000;

type BrandSlideBase = {
  id: string;
  title: string;
  filterBrand: string;
  logo: string;
  caption: string;
};

type VideoSlide = BrandSlideBase & {
  video: string;
};

type ImageBrandSlide = BrandSlideBase & {
  image: string;
};

const slides: (VideoSlide | ImageBrandSlide)[] = [
  {
    id: "rak",
    title: "RAK Ceramics",
    filterBrand: "RAK Ceramics",
    video: "/hero-videos/rak-hero.mp4",
    logo: "/logo/brand-logos/rak-logo.png",
    caption: "Precision-crafted surfaces designed for modern living.",
  },
  {
    id: "roca",
    title: "Roca",
    filterBrand: "Roca",
    image: "/hero-images/roca-hero-1.jpg",
    logo: "/logo/brand-logos/roca-logo.png",
    caption: "Globally recognized for innovative, high-quality ceramic surfaces.",
  },
  {
    id: "geotiles",
    title: "Geo Tiles",
    filterBrand: "Geo Tiles",
    image: "/hero-images/geotiles-hero.jpg",
    logo: "/logo/brand-logos/geotiles-logo.png",
    caption: "Modern ceramic designs inspired by contemporary global trends.",
  },
  {
    id: "sonite",
    title: "Sonite",
    filterBrand: "Sonite",
    image: "/hero-images/sonite-hero.jpg",
    logo: "/logo/brand-logos/sonite-logo.png",
    caption: "Innovative surfaces combining design, technology, and modern aesthetics.",
  },
];

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const dragStartX = useRef(0);
  const dragDistance = useRef(0);
  const pointerDownActive = useRef(false);
  const isPaused = isHovering || isDragging;

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
      setProgressKey((current) => current + 1);
    }, SLIDE_DURATION_MS);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, isPaused]);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
    setProgressKey((current) => current + 1);
  };

  const goToNextSlide = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
    setProgressKey((current) => current + 1);
  };

  const goToPreviousSlide = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
    setProgressKey((current) => current + 1);
  };

  const handlePointerDown: React.PointerEventHandler<HTMLElement> = (event) => {
    const target = event.target as HTMLElement;

    if (target.closest("a, button")) {
      return;
    }

    pointerDownActive.current = true;
    dragStartX.current = event.clientX;
    dragDistance.current = 0;
    setDragOffset(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove: React.PointerEventHandler<HTMLElement> = (event) => {
    if (!pointerDownActive.current) {
      return;
    }

    const nextOffset = event.clientX - dragStartX.current;
    dragDistance.current = Math.max(dragDistance.current, Math.abs(nextOffset));

    if (!isDragging && dragDistance.current > 8) {
      setIsDragging(true);
    }

    if (!isDragging && dragDistance.current <= 8) {
      return;
    }

    setDragOffset(nextOffset);
  };

  const handlePointerEnd: React.PointerEventHandler<HTMLElement> = (event) => {
    if (!pointerDownActive.current) {
      return;
    }

    pointerDownActive.current = false;
    const sectionWidth = sectionRef.current?.offsetWidth ?? 0;
    const threshold = Math.min(140, Math.max(70, sectionWidth * 0.12));
    const finalOffset = event.clientX - dragStartX.current;
    const hasMeaningfulDrag = dragDistance.current > 18;

    setIsDragging(false);
    setDragOffset(0);
    dragDistance.current = 0;

    if (!hasMeaningfulDrag) {
      return;
    }

    if (finalOffset <= -threshold) {
      goToNextSlide();
      return;
    }

    if (finalOffset >= threshold) {
      goToPreviousSlide();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen cursor-pointer overflow-hidden bg-black text-white select-none touch-pan-y"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      <div
        className={`absolute inset-0 flex will-change-transform ${
          isDragging ? "transition-none" : "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        }`}
        style={{ transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="relative min-h-screen w-full shrink-0 overflow-hidden">
            {"video" in slide ? (
              <>
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                >
                  <source src={slide.video} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.16)_38%,rgba(0,0,0,0.36)_100%)]" />

                <div className="relative flex min-h-screen items-center justify-center px-6">
                  <div className="flex flex-col items-center gap-8">
                    <Image
                      src={slide.logo}
                      alt="RAK Ceramics logo"
                      width={520}
                      height={220}
                      draggable={false}
                      className="h-auto w-[min(78vw,32rem)] object-contain drop-shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
                      priority
                    />
                    <p className="max-w-xl text-center text-sm uppercase tracking-[0.34em] text-white/72 sm:text-base">
                      {slide.caption}
                    </p>
                    <Link
                      href={`/catalog?brand=${encodeURIComponent(slide.filterBrand)}#catalog-results`}
                      className="inline-flex items-center justify-center border border-white/34 bg-white/10 px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-white backdrop-blur-sm transition hover:border-white hover:bg-white hover:text-[#231f20]"
                    >
                      Browse
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority
                  draggable={false}
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.24)_0%,rgba(0,0,0,0.18)_38%,rgba(0,0,0,0.4)_100%)]" />

                <div className="relative flex min-h-screen items-center justify-center px-6">
                  <div
                    className={`flex flex-col items-center gap-8 ${
                      slide.id === "sonite" ? "sm:-translate-y-10" : ""
                    }`}
                  >
                    <Image
                      src={slide.logo}
                      alt={`${slide.title} logo`}
                      width={560}
                      height={240}
                      draggable={false}
                      className={`h-auto object-contain drop-shadow-[0_18px_50px_rgba(0,0,0,0.45)] ${
                        slide.id === "sonite"
                          ? "w-[min(90vw,46rem)]"
                          : slide.id === "geotiles"
                            ? "w-[min(88vw,38rem)]"
                            : slide.id === "roca"
                            ? "w-[min(88vw,40rem)]"
                            : "w-[min(82vw,34rem)]"
                      }`}
                      priority
                    />
                    <div
                      className={`flex flex-col items-center ${
                        slide.id === "roca"
                          ? "-mt-24 gap-4 sm:-mt-28"
                          : slide.id === "sonite"
                            ? "-mt-12 gap-5 sm:-mt-36"
                            : "gap-8"
                      }`}
                    >
                      <p className="max-w-xl text-center text-sm uppercase tracking-[0.34em] text-white/78 sm:text-base">
                        {slide.caption}
                      </p>
                      <Link
                        href={`/catalog?brand=${encodeURIComponent(slide.filterBrand)}#catalog-results`}
                        className="inline-flex items-center justify-center border border-white/34 bg-white/10 px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-white backdrop-blur-sm transition hover:border-white hover:bg-white hover:text-[#231f20]"
                      >
                        Browse
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="pointer-events-none relative flex min-h-screen w-full flex-col justify-end">
        <div className="flex justify-center px-6 pb-10">
          <div className="pointer-events-auto flex items-center gap-3">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to ${slide.title}`}
                onClick={() => goToSlide(index)}
                className="group relative h-1 w-10 cursor-pointer overflow-hidden rounded-full bg-white/20 transition hover:bg-white/30"
              >
                <span className="sr-only">{slide.title}</span>
                <span
                  className={`absolute inset-y-0 left-0 rounded-full bg-white ${
                    index === activeIndex ? "hero-progress-fill" : "w-0"
                  }`}
                  key={`${slide.id}-${progressKey}-${index === activeIndex ? "active" : "idle"}`}
                  style={
                    index === activeIndex
                      ? {
                          animationDuration: `${SLIDE_DURATION_MS}ms`,
                          animationPlayState: isPaused ? "paused" : "running",
                        }
                      : undefined
                  }
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
