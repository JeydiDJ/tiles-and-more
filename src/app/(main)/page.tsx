import Script from "next/script";
import { getCategories } from "@/services/category.service";
import { Hero } from "@/components/sections/hero";
import { FeaturedCategories } from "@/components/sections/featured-categories";
import { ProjectsSection } from "@/components/sections/collections";
import { siteConfig } from "@/config/site";
import { absoluteUrl, createPageMetadata, defaultOgImagePath } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Tile, Surface, and Sanitary Solutions in Central Luzon",
  description:
    "Explore Tiles & More for tile, quartz slab, decorative surface, flooring, and sanitary product selections backed by project-ready support in Central Luzon.",
  path: "/",
  image: defaultOgImagePath,
  keywords: [
    "tiles pampanga",
    "tiles central luzon",
    "quartz slabs philippines",
    "sanitary ware pampanga",
    "tile showroom mexico pampanga",
  ],
});

export default async function HomePage() {
  const categories = await getCategories();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    image: absoluteUrl(defaultOgImagePath),
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressCountry: "PH",
    },
    areaServed: "Central Luzon",
    sameAs: Object.values(siteConfig.socialLinks),
  };

  return (
    <>
      <Script
        id="home-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Hero />
      <FeaturedCategories categories={categories} />
      <ProjectsSection />
    </>
  );
}
