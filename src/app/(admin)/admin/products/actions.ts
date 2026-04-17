"use server";

import { revalidatePath } from "next/cache";
import { createProduct, createProductMedia, deleteProduct, updateProduct, updateProductImageUrl } from "@/services/product.service";
import { uploadProductImage } from "@/services/storage.service";
import { getAdminRoute } from "@/lib/admin-path";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import type { ProductImageKind } from "@/lib/storage";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export type ProductFormState = {
  error: string | null;
  productId?: string | null;
};

export type ProductDeleteState = {
  error: string | null;
};

function normalizeOptional(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();
  return normalized.length > 0 ? normalized : null;
}

export async function createProductAction(_: ProductFormState, formData: FormData): Promise<ProductFormState> {
  if (!hasSupabaseEnv()) {
    return { error: "Supabase env vars are missing. Add them before creating products.", productId: null };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to create products.", productId: null };
  }

  const name = String(formData.get("name") ?? "").trim();
  const productCode = String(formData.get("productCode") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const brandId = String(formData.get("brandId") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const productFamilyId = String(formData.get("productFamilyId") ?? "").trim();
  const applicationImage = formData.get("applicationImage");
  const sampleImages = formData.getAll("sampleImages");

  if (!name || !productCode || !brandId || !categoryId || !productFamilyId) {
    return { error: "Name, product code, brand, category, and product family are required.", productId: null };
  }

  let createdProduct;

  try {
    createdProduct = await createProduct({
      productCode,
      name,
      slug: slugInput || slugify(name),
      brandId,
      categoryId,
      productFamilyId,
      applications: String(formData.get("applications") ?? "")
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
      material: normalizeOptional(formData.get("material")),
      finish: normalizeOptional(formData.get("finish")),
      imageUrl: null,
      summary: normalizeOptional(formData.get("summary")),
    });

    const mediaRows: Array<{
      productId: string;
      kind: ProductImageKind;
      imageUrl: string;
      storagePath: string | null;
      altText?: string | null;
      sortOrder: number;
    }> = [];

    if (applicationImage instanceof File && applicationImage.size > 0) {
      const upload = await uploadProductImage(applicationImage, productCode, name, "application");
      mediaRows.push({
        productId: createdProduct.id,
        kind: "application",
        imageUrl: upload.url,
        storagePath: upload.path,
        altText: `${name} application image`,
        sortOrder: 0,
      });
      await updateProductImageUrl(createdProduct.id, upload.url);
    }

    const sampleFiles = sampleImages.filter((file): file is File => file instanceof File && file.size > 0);

    for (const [index, file] of sampleFiles.entries()) {
      const upload = await uploadProductImage(file, productCode, name, "sample");
      mediaRows.push({
        productId: createdProduct.id,
        kind: "sample",
        imageUrl: upload.url,
        storagePath: upload.path,
        altText: `${name} sample ${index + 1}`,
        sortOrder: index,
      });
    }

    await createProductMedia(mediaRows);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create product.";
    return { error: message, productId: null };
  }

  revalidatePath("/catalog");
  revalidatePath(getAdminRoute("/products"));
  revalidatePath(`/products/${slugInput || slugify(name)}`);

  return {
    error: null,
    productId: createdProduct.id,
  };
}

export async function deleteProductAction(_: ProductDeleteState, formData: FormData): Promise<ProductDeleteState> {
  if (!hasSupabaseEnv()) {
    return { error: "Supabase env vars are missing. Add them before deleting products." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to delete products." };
  }

  const productId = String(formData.get("productId") ?? "").trim();

  if (!productId) {
    return { error: "Product ID is required." };
  }

  try {
    await deleteProduct(productId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete product.";
    return { error: message };
  }

  revalidatePath("/catalog");
  revalidatePath(getAdminRoute("/products"));

  return { error: null };
}

export async function deleteProductsAction(_: ProductDeleteState, formData: FormData): Promise<ProductDeleteState> {
  if (!hasSupabaseEnv()) {
    return { error: "Supabase env vars are missing. Add them before deleting products." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to delete products." };
  }

  const productIds = formData
    .getAll("productIds")
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);

  if (productIds.length === 0) {
    return { error: "Select at least one product to delete." };
  }

  try {
    await Promise.all(productIds.map((productId) => deleteProduct(productId)));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete selected products.";
    return { error: message };
  }

  revalidatePath("/catalog");
  revalidatePath(getAdminRoute("/products"));

  return { error: null };
}

export async function updateProductAction(_: ProductFormState, formData: FormData): Promise<ProductFormState> {
  if (!hasSupabaseEnv()) {
    return { error: "Supabase env vars are missing. Add them before editing products.", productId: null };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to edit products.", productId: null };
  }

  const productId = String(formData.get("productId") ?? "").trim();
  const previousSlug = String(formData.get("previousSlug") ?? "").trim();
  const currentImageUrl = normalizeOptional(formData.get("currentImageUrl"));
  const name = String(formData.get("name") ?? "").trim();
  const productCode = String(formData.get("productCode") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const brandId = String(formData.get("brandId") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const productFamilyId = String(formData.get("productFamilyId") ?? "").trim();

  if (!productId) {
    return { error: "Product ID is required.", productId: null };
  }

  if (!name || !productCode || !brandId || !categoryId || !productFamilyId) {
    return { error: "Name, product code, brand, category, and product family are required.", productId: null };
  }

  const nextSlug = slugInput || slugify(name);

  try {
    await updateProduct(productId, {
      productCode,
      name,
      slug: nextSlug,
      brandId,
      categoryId,
      productFamilyId,
      applications: String(formData.get("applications") ?? "")
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
      material: normalizeOptional(formData.get("material")),
      finish: normalizeOptional(formData.get("finish")),
      imageUrl: currentImageUrl,
      summary: normalizeOptional(formData.get("summary")),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update product.";
    return { error: message, productId: null };
  }

  revalidatePath("/catalog");
  revalidatePath(getAdminRoute("/products"));
  if (previousSlug) {
    revalidatePath(`/products/${previousSlug}`);
  }
  revalidatePath(`/products/${nextSlug}`);

  return { error: null, productId };
}
