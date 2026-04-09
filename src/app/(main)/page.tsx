import { collections } from "@/data/collections";
import { getCategories } from "@/services/category.service";
import { getFeaturedProducts } from "@/services/product.service";
import { Hero } from "@/components/sections/hero";
import { FeaturedCategories } from "@/components/sections/featured-categories";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { CollectionsSection } from "@/components/sections/collections";
import { GalleryPreview } from "@/components/sections/gallery-preview";
import { Testimonials } from "@/components/sections/testimonials";
import { Cta } from "@/components/sections/cta";

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <>
      <Hero />
      <FeaturedCategories categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <CollectionsSection collections={collections} />
      <GalleryPreview />
      <Testimonials />
      <Cta />
    </>
  );
}
