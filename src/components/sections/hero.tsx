"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const SLIDE_DURATION_MS = 20000;

type VideoSlide = {
  id: string;
  title: string;
  video: string;
  logo: string;
};

type ImageBrandSlide = {
  id: string;
  title: string;
  image: string;
  logo: string;
  caption: string;
};

type ContentSlide = {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  background: string;
};

const slides: (VideoSlide | ImageBrandSlide | ContentSlide)[] = [
  {
    id: "rak",
    title: "RAK Ceramics",
    video: "/hero-videos/rak-hero.mp4",
    logo: "/logo/brand-logos/rak-logo.png",
  },
  {
    id: "roca",
    title: "Roca",
    image: "/hero-images/roca-hero.jpg",
    logo: "/logo/brand-logos/roca-logo.png",
    caption: "Design-led bathroom collections and architectural solutions.",
  },
  {
    id: "quartz",
    category: "Furniture",
    title: "Quartz Surfaces",
    subtitle: "Refined countertop selections designed for kitchens and statement spaces.",
    primaryLabel: "Browse Quartz",
    primaryHref: "/catalog/quartz",
    secondaryLabel: "Visit Showroom",
    secondaryHref: "/contact",
    background:
      "bg-[radial-gradient(circle_at_48%_24%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(120deg,#191614_0%,#4a3d33_33%,#b09777_65%,#2a211c_100%)]",
  },
  {
    id: "decorative",
    category: "Outdoor",
    title: "Decorative Looks",
    subtitle: "Feature-ready accents that shape a stronger first impression.",
    primaryLabel: "View Decorative",
    primaryHref: "/catalog/decorative",
    secondaryLabel: "See Applications",
    secondaryHref: "/gallery",
    background:
      "bg-[radial-gradient(circle_at_52%_22%,rgba(255,255,255,0.07),transparent_24%),linear-gradient(120deg,#111111_0%,#2c3133_30%,#6a756c_62%,#1e201f_100%)]",
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
          <div
            key={slide.id}
            className={`relative min-h-screen w-full shrink-0 overflow-hidden ${"background" in slide ? slide.background : ""}`}
          >
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
                      Premium surfaces and architectural finishes
                    </p>
                  </div>
                </div>
              </>
            ) : "image" in slide ? (
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
                  <div className="flex flex-col items-center gap-8">
                    <Image
                      src={slide.logo}
                      alt={`${slide.title} logo`}
                      width={560}
                      height={240}
                      draggable={false}
                      className="h-auto w-[min(82vw,34rem)] object-contain drop-shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
                      priority
                    />
                    <p className="max-w-xl text-center text-sm uppercase tracking-[0.34em] text-white/78 sm:text-base">
                      {slide.caption}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.32)_0%,rgba(0,0,0,0.18)_25%,rgba(0,0,0,0.26)_100%)]" />

                <div className="relative flex min-h-screen items-center justify-center px-6 text-center">
                  <div className="max-w-5xl">
                    <p className="text-sm uppercase tracking-[0.32em] text-white/55">{slide.category}</p>
                    <h1 className="mt-5 font-serif text-6xl font-semibold leading-none tracking-tight sm:text-7xl lg:text-[8rem]">
                      {slide.title}
                    </h1>
                    <p className="mx-auto mt-6 max-w-3xl text-2xl leading-relaxed text-white/92 sm:text-3xl">
                      {slide.subtitle}
                    </p>
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                      <Link href={slide.primaryHref}>
                        <Button className="border border-white/40 bg-black/18 text-white hover:bg-white/10">
                          {slide.primaryLabel}
                        </Button>
                      </Link>
                      <Link href={slide.secondaryHref}>
                        <Button variant="secondary" className="border-white bg-white text-black hover:bg-white/85">
                          {slide.secondaryLabel}
                        </Button>
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
