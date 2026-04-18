import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { getCategories } from "@/services/category.service";
import { getProducts } from "@/services/product.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = [
    "/",
    "/about",
    "/catalog",
    "/projects",
    "/gallery",
    "/contact",
    "/quote",
    "/privacy",
    "/terms",
  ];

  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route),
      lastModified: now,
      changeFrequency: (route === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: route === "/" ? 1 : route === "/catalog" ? 0.9 : 0.7,
    })),
    ...categories.map((category) => ({
      url: absoluteUrl(`/catalog/${category.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
