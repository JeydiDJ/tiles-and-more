import { getCategories } from "@/services/category.service";
import { Hero } from "@/components/sections/hero";
import { FeaturedCategories } from "@/components/sections/featured-categories";
import { ProjectsSection } from "@/components/sections/collections";

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <>
      <Hero />
      <FeaturedCategories categories={categories} />
      <ProjectsSection />
    </>
  );
}
