"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductFormOptions } from "@/types/product";
import { createProductAction, type ProductFormState } from "@/app/(admin)/admin/products/actions";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAdminRoute } from "@/lib/admin-path";

type ProductFormProps = {
  options: ProductFormOptions;
  mode?: "create" | "edit";
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

export function ProductForm({ options, mode = "create" }: ProductFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createProductAction, initialState);
  const isEditMode = mode === "edit";
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState("");
  const [applicationImageName, setApplicationImageName] = useState("");
  const [sampleImageNames, setSampleImageNames] = useState<string[]>([]);

  const filteredFamilies = selectedCategoryId
    ? options.families.filter((family) => family.categoryId === selectedCategoryId)
    : [];

  useEffect(() => {
    if (options.categories.length === 1 && !selectedCategoryId) {
      setSelectedCategoryId(options.categories[0].id);
    }
  }, [options.categories, selectedCategoryId]);

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
    <form action={isEditMode ? undefined : formAction} className="border-t border-[var(--border)] pt-6">
      <input type="hidden" name="brandId" value={selectedBrandId} />
      <input type="hidden" name="categoryId" value={selectedCategoryId} />
      <input type="hidden" name="productFamilyId" value={selectedFamilyId} />

      {isEditMode ? <p className="text-sm text-[var(--muted)]">Editing will be enabled next.</p> : null}

      <div className="mt-6 grid gap-8">
        <FormSection title="Basic">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Product Name">
              <Input placeholder="Calacatta Porcelain" name="name" disabled={isEditMode} />
            </Field>
            <Field label="Product Code">
              <Input placeholder="GT-1001" name="productCode" disabled={isEditMode} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Classification">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Brand">
              <Select
                value={selectedBrandId}
                onChange={(event) => setSelectedBrandId(event.target.value)}
                disabled={isEditMode || options.brands.length === 0}
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
                disabled={isEditMode || options.categories.length === 0}
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
                disabled={isEditMode || filteredFamilies.length === 0}
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
              <Input placeholder="Floor, Wall, Bathroom" name="applications" disabled={isEditMode} />
            </Field>
            <Field label="Material">
              <Input placeholder="Porcelain" name="material" disabled={isEditMode} />
            </Field>
            <Field label="Finish">
              <Input placeholder="Matte" name="finish" disabled={isEditMode} />
            </Field>
            <Field label="Application Image" className="md:col-span-2">
              <div className="grid gap-3">
                <input
                  type="file"
                  name="applicationImage"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  disabled={isEditMode}
                  onChange={(event) => setApplicationImageName(event.target.files?.[0]?.name ?? "")}
                  className="w-full rounded-sm border border-dashed border-[var(--border)] bg-white px-4 py-4 text-[15px] text-[var(--foreground)] file:mr-4 file:rounded-sm file:border-0 file:bg-[var(--brand)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:border-[#bdbabd] focus:outline-none focus:ring-4 focus:ring-[rgba(237,35,37,0.08)] disabled:cursor-not-allowed disabled:bg-[#f3f3f3]"
                />
                <p className="text-sm text-[var(--muted)]">
                  {applicationImageName || "Main applied image shown on the product page."}
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
                  disabled={isEditMode}
                  onChange={(event) => setSampleImageNames(Array.from(event.target.files ?? []).map((file) => file.name))}
                  className="w-full rounded-sm border border-dashed border-[var(--border)] bg-white px-4 py-4 text-[15px] text-[var(--foreground)] file:mr-4 file:rounded-sm file:border-0 file:bg-[var(--brand)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:border-[#bdbabd] focus:outline-none focus:ring-4 focus:ring-[rgba(237,35,37,0.08)] disabled:cursor-not-allowed disabled:bg-[#f3f3f3]"
                />
                <p className="text-sm text-[var(--muted)]">
                  {sampleImageNames.length > 0 ? `${sampleImageNames.length} sample image(s) selected` : "Upload isolated tile or product images."}
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
              <Textarea placeholder="Short product description" name="summary" className="min-h-28" disabled={isEditMode} />
            </Field>
          </div>
        </FormSection>
      </div>

      {state.error ? (
        <p className="mt-4 rounded-sm border border-[#ed2325]/20 bg-[#fff5f5] px-4 py-3 text-sm text-[#8f1d1d]">{state.error}</p>
      ) : null}

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-[var(--border)] pt-5">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
          {isEditMode ? "Read-only for now" : "Ready to save"}
        </p>
        <button
          type="submit"
          disabled={isPending || isEditMode}
          className="inline-flex min-w-36 items-center justify-center rounded-sm bg-[var(--brand)] px-5 py-3 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-[0_10px_22px_rgba(237,35,37,0.16)] transition hover:-translate-y-0.5 hover:bg-[#c81a1d] hover:shadow-[0_14px_28px_rgba(237,35,37,0.2)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {isEditMode ? "Update Product Soon" : isPending ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
