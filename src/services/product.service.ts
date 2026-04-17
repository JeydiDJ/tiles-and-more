import { categories } from "@/data/categories";
import { products } from "@/data/products";
import type { Product, ProductFormInput, ProductFormOptions, ProductMedia } from "@/types/product";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProductRow = {
  id: string;
  product_code: string;
  name: string;
  slug: string;
  brand_id: string;
  category_id: string;
  product_family_id: string;
  applications: string[] | null;
  material: string | null;
  finish: string | null;
  image_url: string | null;
  summary: string | null;
  brands?: { name: string | null } | null;
  categories?: { name: string | null; slug: string | null } | null;
  product_families?: { name: string | null; slug: string | null } | null;
};

type ProductMediaRow = {
  id: string;
  product_id: string;
  kind: "application" | "sample";
  image_url: string;
  storage_path: string | null;
  alt_text: string | null;
  sort_order: number;
};

function pickRelation<T>(value: T | T[] | null | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function mapProduct(row: ProductRow): Product {
  const brand = pickRelation(row.brands);
  const category = pickRelation(row.categories);
  const productFamily = pickRelation(row.product_families);

  return {
    id: row.id,
    productCode: row.product_code,
    name: row.name,
    slug: row.slug,
    brandId: row.brand_id,
    brandName: brand?.name ?? row.brand_id,
    categoryId: row.category_id,
    category: category?.name ?? row.category_id,
    categorySlug: category?.slug ?? row.category_id,
    productFamilyId: row.product_family_id,
    productFamily: productFamily?.name ?? row.product_family_id,
    productFamilySlug: productFamily?.slug ?? row.product_family_id,
    applications: row.applications ?? [],
    material: row.material,
    finish: row.finish,
    imageUrl: row.image_url,
    summary: row.summary,
  };
}

function mapProductMedia(row: ProductMediaRow): ProductMedia {
  return {
    id: row.id,
    productId: row.product_id,
    kind: row.kind,
    imageUrl: row.image_url,
    storagePath: row.storage_path,
    altText: row.alt_text,
    sortOrder: row.sort_order,
  };
}

async function getSupabaseProducts() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      product_code,
      name,
      slug,
      brand_id,
      category_id,
      product_family_id,
      applications,
      material,
      finish,
      image_url,
      summary,
      brands(name),
      categories(name,slug),
      product_families(name,slug)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapProduct(row as unknown as ProductRow));
}

export async function getProducts() {
  if (hasSupabaseEnv()) {
    try {
      return await getSupabaseProducts();
    } catch {
      return products;
    }
  }

  return products;
}

export async function getFeaturedProducts() {
  const allProducts = await getProducts();
  return allProducts.slice(0, 3);
}

export async function getProductsByCategory(category: string) {
  const allProducts = await getProducts();
  return allProducts.filter((product) => product.categorySlug === category || product.categoryId === category);
}

export async function getProductBySlug(slug: string) {
  if (hasSupabaseEnv()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          product_code,
          name,
          slug,
          brand_id,
          category_id,
          product_family_id,
          applications,
          material,
          finish,
          image_url,
          summary,
          brands(name),
          categories(name,slug),
          product_families(name,slug)
        `)
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return null;
      }

      const product = mapProduct(data as unknown as ProductRow);
      const media = await getProductMediaByProductId(product.id);

      return {
        ...product,
        media,
      };
    } catch {
      return products.find((product) => product.slug === slug) ?? null;
    }
  }

  return products.find((product) => product.slug === slug) ?? null;
}

export async function getProductById(id: string) {
  if (hasSupabaseEnv()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          product_code,
          name,
          slug,
          brand_id,
          category_id,
          product_family_id,
          applications,
          material,
          finish,
          image_url,
          summary,
          brands(name),
          categories(name,slug),
          product_families(name,slug)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return null;
      }

      return mapProduct(data as unknown as ProductRow);
    } catch {
      return products.find((product) => product.id === id) ?? null;
    }
  }

  return products.find((product) => product.id === id) ?? null;
}

export async function getProductFormOptions(): Promise<ProductFormOptions> {
  if (!hasSupabaseEnv()) {
    return {
      brands: [],
      categories: categories.map((category) => ({
        id: category.id,
        label: category.name,
        slug: category.slug,
      })),
      families: [],
    };
  }

  const supabase = await createSupabaseServerClient();
  const [{ data: brandRows }, { data: categoryRows }, { data: familyRows }] = await Promise.all([
    supabase.from("brands").select("id,name").order("name"),
    supabase.from("categories").select("id,name,slug").order("name"),
    supabase.from("product_families").select("id,name,slug,category_id").order("name"),
  ]);

  return {
    brands: (brandRows ?? []).map((brand) => ({
      id: brand.id,
      label: brand.name,
    })),
    categories: (categoryRows ?? []).map((category) => ({
      id: category.id,
      label: category.name,
      slug: category.slug,
    })),
    families: (familyRows ?? []).map((family) => ({
      id: family.id,
      label: family.name,
      slug: family.slug,
      categoryId: family.category_id,
    })),
  };
}

export async function createProduct(input: ProductFormInput) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("products")
    .insert({
      product_code: input.productCode,
      name: input.name,
      slug: input.slug,
      brand_id: input.brandId,
      category_id: input.categoryId,
      product_family_id: input.productFamilyId,
      applications: input.applications,
      material: input.material,
      finish: input.finish,
      image_url: input.imageUrl,
      summary: input.summary,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateProductImageUrl(productId: string, imageUrl: string | null) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("products")
    .update({
      image_url: imageUrl,
    })
    .eq("id", productId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateProduct(productId: string, input: ProductFormInput) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("products")
    .update({
      product_code: input.productCode,
      name: input.name,
      slug: input.slug,
      brand_id: input.brandId,
      category_id: input.categoryId,
      product_family_id: input.productFamilyId,
      applications: input.applications,
      material: input.material,
      finish: input.finish,
      image_url: input.imageUrl,
      summary: input.summary,
    })
    .eq("id", productId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function createProductMedia(
  items: Array<{
    productId: string;
    kind: "application" | "sample";
    imageUrl: string;
    storagePath: string | null;
    altText?: string | null;
    sortOrder: number;
  }>,
) {
  if (items.length === 0) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("product_media")
    .insert(
      items.map((item) => ({
        product_id: item.productId,
        kind: item.kind,
        image_url: item.imageUrl,
        storage_path: item.storagePath,
        alt_text: item.altText ?? null,
        sort_order: item.sortOrder,
      })),
    )
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapProductMedia(row as ProductMediaRow));
}

export async function getProductMediaByProductId(productId: string) {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("product_media")
    .select("*")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapProductMedia(row as ProductMediaRow));
}

export async function deleteProduct(productId: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("products").delete().eq("id", productId);

  if (error) {
    throw new Error(error.message);
  }
}
