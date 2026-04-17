import {
  CRM_ATTACHMENTS_BUCKET,
  PRODUCT_IMAGES_BUCKET,
  buildCrmAttachmentPath,
  buildProductImagePath,
  type ProductImageKind,
  validateAttachmentFile,
  validateImageFile,
} from "@/lib/storage";
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

export async function uploadCrmAttachment(file: File, projectLeadId: string, projectName: string) {
  validateAttachmentFile(file);

  const supabase = await createSupabaseServerClient();
  const filePath = buildCrmAttachmentPath(projectLeadId, projectName, file);

  const { error } = await supabase.storage.from(CRM_ATTACHMENTS_BUCKET).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    path: filePath,
    fileName: file.name,
    mimeType: file.type || null,
    fileSize: file.size,
  };
}

export async function createCrmAttachmentSignedUrl(storagePath: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.storage.from(CRM_ATTACHMENTS_BUCKET).createSignedUrl(storagePath, 60 * 60);

  if (error) {
    throw new Error(error.message);
  }

  return data.signedUrl;
}
