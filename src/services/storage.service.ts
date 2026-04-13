import { PRODUCT_IMAGES_BUCKET, buildProductImagePath, type ProductImageKind, validateImageFile } from "@/lib/storage";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function uploadProductImage(file: File, productCode: string, productName: string, kind: ProductImageKind) {
  validateImageFile(file);

  const supabase = await createSupabaseServerClient();
  const filePath = buildProductImagePath(productCode, productName, kind, file);

  const { error } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(filePath);

  return {
    path: filePath,
    url: data.publicUrl,
    kind,
  };
}
