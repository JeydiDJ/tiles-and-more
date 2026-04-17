"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, ProductFormOptions } from "@/types/product";
import { createProductAction, type ProductFormState, updateProductAction } from "@/app/(admin)/admin/products/actions";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAdminRoute } from "@/lib/admin-path";

type ProductFormProps = {
  options: ProductFormOptions;
  mode?: "create" | "edit";
  initialProduct?: Product | null;
};

const initialState: ProductFormState = {
  error: null,
  productId: null,
};

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`grid gap-2 ${className}`}>
      <span className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">{label}</span>
      {children}
    </label>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-5 border-t border-[var(--border)] pt-5 first:border-t-0 first:pt-0">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">{title}</p>
      {children}
    </section>
  );
}

export function ProductForm({ options, mode = "create", initialProduct = null }: ProductFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";
  const action = isEditMode ? updateProductAction : createProductAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [selectedBrandId, setSelectedBrandId] = useState(initialProduct?.brandId ?? "");
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialProduct?.categoryId ?? "");
  const [selectedFamilyId, setSelectedFamilyId] = useState(initialProduct?.productFamilyId ?? "");
  const [applicationImageName, setApplicationImageName] = useState("");
  const [sampleImageNames, setSampleImageNames] = useState<string[]>([]);

  const filteredFamilies = selectedCategoryId
    ? options.families.filter((family) => family.categoryId === selectedCategoryId)
    : [];

  useEffect(() => {
    if (!initialProduct && options.categories.length === 1 && !selectedCategoryId) {
      setSelectedCategoryId(options.categories[0].id);
    }
  }, [initialProduct, options.categories, selectedCategoryId]);

  useEffect(() => {
    if (!filteredFamilies.some((family) => family.id === selectedFamilyId)) {
      setSelectedFamilyId("");
    }
  }, [filteredFamilies, selectedFamilyId]);

  useEffect(() => {
    if (state.productId) {
      router.push(getAdminRoute(`/products/${state.productId}`));
      router.refresh();
    }
  }, [router, state.productId]);

  return (
    <form action={formAction} className="border-t border-[var(--border)] pt-6">
      {isEditMode && initialProduct ? (
        <>
          <input type="hidden" name="productId" value={initialProduct.id} />
          <input type="hidden" name="previousSlug" value={initialProduct.slug} />
          <input type="hidden" name="currentImageUrl" value={initialProduct.imageUrl ?? ""} />
        </>
      ) : null}
      <input type="hidden" name="brandId" value={selectedBrandId} />
      <input type="hidden" name="categoryId" value={selectedCategoryId} />
      <input type="hidden" name="productFamilyId" value={selectedFamilyId} />

      <div className="mt-6 grid gap-8">
        <FormSection title="Basic">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Product Name">
              <Input placeholder="Calacatta Porcelain" name="name" defaultValue={initialProduct?.name ?? ""} />
            </Field>
            <Field label="Product Code">
              <Input placeholder="GT-1001" name="productCode" defaultValue={initialProduct?.productCode ?? ""} />
            </Field>
            <Field label="Slug" className="md:col-span-2">
              <Input placeholder="calacatta-porcelain" name="slug" defaultValue={initialProduct?.slug ?? ""} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Classification">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Brand">
              <Select
                value={selectedBrandId}
                onChange={(event) => setSelectedBrandId(event.target.value)}
                disabled={options.brands.length === 0}
                required
              >
                <option value="" disabled>
                  {options.brands.length > 0 ? "Select brand" : "No brands loaded"}
                </option>
                {options.brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Category">
              <Select
                value={selectedCategoryId}
                onChange={(event) => {
                  setSelectedCategoryId(event.target.value);
                  setSelectedFamilyId("");
                }}
                disabled={options.categories.length === 0}
                required
              >
                <option value="" disabled>
                  {options.categories.length > 0 ? "Select category" : "No categories loaded"}
                </option>
                {options.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Product Family" className="md:col-span-2">
              <Select
                value={selectedFamilyId}
                onChange={(event) => setSelectedFamilyId(event.target.value)}
                key={selectedCategoryId}
                disabled={filteredFamilies.length === 0}
                required
              >
                <option value="" disabled>
                  {selectedCategoryId
                    ? filteredFamilies.length > 0
                      ? "Select family"
                      : "No families available"
                    : "Select a category first"}
                </option>
                {filteredFamilies.map((family) => (
                  <option key={family.id} value={family.id}>
                    {family.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </FormSection>

        <FormSection title="Details">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Applications" className="md:col-span-2">
              <Input
                placeholder="Floor, Wall, Bathroom"
                name="applications"
                defaultValue={initialProduct?.applications.join(", ") ?? ""}
              />
            </Field>
            <Field label="Material">
              <Input placeholder="Porcelain" name="material" defaultValue={initialProduct?.material ?? ""} />
            </Field>
            <Field label="Finish">
              <Input placeholder="Matte" name="finish" defaultValue={initialProduct?.finish ?? ""} />
            </Field>
            <Field label="Application Image" className="md:col-span-2">
              <div className="grid gap-3">
                <input
                  type="file"
                  name="applicationImage"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  disabled
                  onChange={(event) => setApplicationImageName(event.target.files?.[0]?.name ?? "")}
                  className="w-full rounded-sm border border-dashed border-[var(--border)] bg-white px-4 py-4 text-[15px] text-[var(--foreground)] file:mr-4 file:rounded-sm file:border-0 file:bg-[var(--brand)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:border-[#bdbabd] focus:outline-none focus:ring-4 focus:ring-[rgba(237,35,37,0.08)] disabled:cursor-not-allowed disabled:bg-[#f3f3f3]"
                />
                <p className="text-sm text-[var(--muted)]">
                  {isEditMode
                    ? initialProduct?.imageUrl
                      ? "Application image replacement is not enabled yet. Current main image is preserved."
                      : "No main image on record yet. Image replacement will be added next."
                    : applicationImageName || "Main applied image shown on the product page."}
                </p>
              </div>
            </Field>
            <Field label="Sample Images" className="md:col-span-2">
              <div className="grid gap-3">
                <input
                  type="file"
                  name="sampleImages"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  multiple
                  disabled
                  onChange={(event) => setSampleImageNames(Array.from(event.target.files ?? []).map((file) => file.name))}
                  className="w-full rounded-sm border border-dashed border-[var(--border)] bg-white px-4 py-4 text-[15px] text-[var(--foreground)] file:mr-4 file:rounded-sm file:border-0 file:bg-[var(--brand)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:border-[#bdbabd] focus:outline-none focus:ring-4 focus:ring-[rgba(237,35,37,0.08)] disabled:cursor-not-allowed disabled:bg-[#f3f3f3]"
                />
                <p className="text-sm text-[var(--muted)]">
                  {isEditMode
                    ? "Sample image editing is not enabled yet."
                    : sampleImageNames.length > 0
                      ? `${sampleImageNames.length} sample image(s) selected`
                      : "Upload isolated tile or product images."}
                </p>
                {sampleImageNames.length > 0 ? (
                  <div className="grid gap-1 text-sm text-[var(--muted)]">
                    {sampleImageNames.map((name) => (
                      <span key={name}>{name}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            </Field>
            <Field label="Summary" className="md:col-span-2">
              <Textarea
                placeholder="Short product description"
                name="summary"
                className="min-h-28"
                defaultValue={initialProduct?.summary ?? ""}
              />
            </Field>
          </div>
        </FormSection>
      </div>

      {state.error ? (
        <p className="mt-4 rounded-sm border border-[#ed2325]/20 bg-[#fff5f5] px-4 py-3 text-sm text-[#8f1d1d]">{state.error}</p>
      ) : null}

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-[var(--border)] pt-5">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
          {isEditMode ? "Ready to update" : "Ready to save"}
        </p>
        <div className="flex items-center gap-3">
          {isEditMode ? (
            <button
              type="button"
              onClick={() => router.push(getAdminRoute("/products"))}
              className="inline-flex min-w-28 items-center justify-center rounded-sm border border-[var(--border)] px-5 py-3 text-sm font-medium uppercase tracking-[0.14em] text-[#231f20] transition hover:border-[#231f20]/20 hover:text-[var(--brand)]"
            >
              Cancel
            </button>
          ) : null}
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-w-36 items-center justify-center rounded-sm bg-[var(--brand)] px-5 py-3 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-[0_10px_22px_rgba(237,35,37,0.16)] transition hover:-translate-y-0.5 hover:bg-[#c81a1d] hover:shadow-[0_14px_28px_rgba(237,35,37,0.2)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isPending ? (isEditMode ? "Updating..." : "Saving...") : isEditMode ? "Update Product" : "Save Product"}
          </button>
        </div>
      </div>
    </form>
  );
}
