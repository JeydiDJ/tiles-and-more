export type Product = {
  id: string;
  productCode: string;
  name: string;
  slug: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  category: string;
  categorySlug: string;
  productFamilyId: string;
  productFamily: string;
  productFamilySlug: string;
  applications: string[];
  material: string | null;
  finish: string | null;
  imageUrl: string | null;
  summary: string | null;
  media?: ProductMedia[];
};

export type ProductMedia = {
  id: string;
  productId: string;
  kind: "application" | "sample";
  imageUrl: string;
  storagePath: string | null;
  altText: string | null;
  sortOrder: number;
};

export type ProductFormInput = {
  productCode: string;
  name: string;
  slug: string;
  brandId: string;
  categoryId: string;
  productFamilyId: string;
  applications: string[];
  material: string | null;
  finish: string | null;
  imageUrl: string | null;
  summary: string | null;
};

export type ProductOption = {
  id: string;
  label: string;
  slug?: string;
  categoryId?: string;
};

export type ProductFormOptions = {
  brands: ProductOption[];
  categories: ProductOption[];
  families: ProductOption[];
};
