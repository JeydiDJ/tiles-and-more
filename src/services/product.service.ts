import { products } from "@/data/products";

export async function getProducts() {
  return products;
}

export async function getFeaturedProducts() {
  return products.slice(0, 3);
}

export async function getProductsByCategory(category: string) {
  return products.filter((product) => product.category === category);
}

export async function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug) ?? null;
}
