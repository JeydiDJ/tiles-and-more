import { slugify } from "@/lib/utils";

export const PRODUCT_IMAGES_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_IMAGES_BUCKET || "product-media";
export const CRM_ATTACHMENTS_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_CRM_ATTACHMENTS_BUCKET || "crm-files";
export type ProductImageKind = "application" | "sample";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const ALLOWED_ATTACHMENT_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
]);

function getFileExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();

  if (fromName) {
    return fromName;
  }

  switch (file.type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/avif":
      return "avif";
    default:
      return "bin";
  }
}

export function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Upload a JPG, PNG, WebP, or AVIF image.");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image must be 10MB or smaller.");
  }
}

export function validateAttachmentFile(file: File) {
  if (!ALLOWED_ATTACHMENT_TYPES.has(file.type)) {
    throw new Error("Upload a PDF, Word file, Excel file, JPG, PNG, WebP, or TXT file.");
  }

  if (file.size > 15 * 1024 * 1024) {
    throw new Error("Attachment must be 15MB or smaller.");
  }
}

export function buildProductImagePath(productCode: string, productName: string, kind: ProductImageKind, file: File) {
  const extension = getFileExtension(file);
  const safeCode = slugify(productCode);
  const safeName = slugify(productName);
  const folder = kind === "application" ? "applications" : "samples";
  const originalBaseName = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
  const uniqueSuffix = crypto.randomUUID().slice(0, 8);

  if (kind === "application") {
    return `${folder}/${safeCode}/${safeName}.${extension}`;
  }

  return `${folder}/${safeCode}/${originalBaseName}-${uniqueSuffix}.${extension}`;
}

export function buildCrmAttachmentPath(projectLeadId: string, projectName: string, file: File) {
  const extension = getFileExtension(file);
  const safeProjectName = slugify(projectName) || "project";
  const originalBaseName = slugify(file.name.replace(/\.[^.]+$/, "")) || "attachment";
  const uniqueSuffix = crypto.randomUUID().slice(0, 8);

  return `projects/${projectLeadId}/${safeProjectName}/${originalBaseName}-${uniqueSuffix}.${extension}`;
}
