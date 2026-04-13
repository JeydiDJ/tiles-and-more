import { slugify } from "@/lib/utils";

export const PRODUCT_IMAGES_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_IMAGES_BUCKET || "product-media";
export type ProductImageKind = "application" | "sample";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

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
