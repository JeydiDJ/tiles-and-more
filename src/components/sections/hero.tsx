"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: "porcelain",
    category: "Floor & Wall",
    title: "Premium Tiles",
    subtitle: "Curated surfaces for calm, elevated interiors.",
    primaryLabel: "View Products",
    primaryHref: "/catalog/porcelain",
    secondaryLabel: "Find Out More",
    secondaryHref: "/collections",
    background:
      "bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.08),transparent_26%),linear-gradient(120deg,#171411_0%,#312820_36%,#6c5942_64%,#2a221b_100%)]",
  },
  {
    id: "stone",
    category: "Large Sizes",
    title: "Natural Stone",
    subtitle: "Architectural finishes with texture, warmth, and material depth.",
    primaryLabel: "Explore Stone",
    primaryHref: "/catalog/natural-stone",
    secondaryLabel: "Project Inspiration",
    secondaryHref: "/gallery",
    background:
      "bg-[radial-gradient(circle_at_55%_28%,rgba(255,255,255,0.06),transparent_22%),linear-gradient(120deg,#151515_0%,#4b4a46_28%,#9a907d_58%,#2a2723_100%)]",
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

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5500);

    return () => window.clearInterval(interval);
  }, []);

  const activeSlide = slides[activeIndex];

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${slide.background} ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.32)_0%,rgba(0,0,0,0.18)_25%,rgba(0,0,0,0.26)_100%)]" />

      <div className="relative flex min-h-screen w-full flex-col">
        <div className="flex flex-1 items-center justify-center px-6 text-center">
          <div className="max-w-5xl">
            <p className="text-sm uppercase tracking-[0.32em] text-white/55">{activeSlide.category}</p>
            <h1 className="mt-5 font-serif text-6xl font-semibold leading-none tracking-tight sm:text-7xl lg:text-[8rem]">
              {activeSlide.title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-2xl leading-relaxed text-white/92 sm:text-3xl">
              {activeSlide.subtitle}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href={activeSlide.primaryHref}>
                <Button className="border border-white/40 bg-black/18 text-white hover:bg-white/10">
                  {activeSlide.primaryLabel}
                </Button>
              </Link>
              <Link href={activeSlide.secondaryHref}>
                <Button variant="secondary" className="border-white bg-white text-black hover:bg-white/85">
                  {activeSlide.secondaryLabel}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex justify-center px-6 pb-10">
          <div className="flex items-center gap-3">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to ${slide.title}`}
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 transition-all ${
                  index === activeIndex ? "w-12 bg-white" : "w-8 bg-white/28 hover:bg-white/55"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
