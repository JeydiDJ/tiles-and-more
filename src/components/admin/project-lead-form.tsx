"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addProjectLeadNoteAction, createProjectLeadAction, type ProjectLeadFormState, updateProjectLeadAction } from "@/app/(admin)/admin/crm/actions";
import { getAdminRoute } from "@/lib/admin-path";
import type { ProjectLead } from "@/types/project-lead";
import { projectLeadStatuses } from "@/types/project-lead";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ProjectLeadFormProps = {
  mode?: "create" | "edit";
  initialLead?: ProjectLead | null;
};

const initialState: ProjectLeadFormState = {
  error: null,
  projectLeadId: null,
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

function formatStatusLabel(value: string) {
  return value.replaceAll("_", " ");
}

export function ProjectLeadForm({ mode = "create", initialLead = null }: ProjectLeadFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";
  const [quotationFinished, setQuotationFinished] = useState(initialLead?.quotationFinished ?? false);
  const action = isEditMode ? updateProjectLeadAction : createProjectLeadAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [attachmentNames, setAttachmentNames] = useState<string[]>([]);

  useEffect(() => {
    if (state.projectLeadId) {
      router.push(getAdminRoute(`/crm/${state.projectLeadId}`));
      router.refresh();
    }
  }, [router, state.projectLeadId]);

  return (
    <form action={formAction} className="grid gap-6 rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)] sm:p-6">
      {isEditMode && initialLead ? (
        <>
          <input type="hidden" name="projectLeadId" value={initialLead.id} />
          <input type="hidden" name="previousStatus" value={initialLead.status} />
        </>
      ) : null}

      <div className="grid gap-8">
        <section className="grid gap-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#9793a0]">Client</p>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Client Name">
              <Input name="clientName" placeholder="Juan Dela Cruz" defaultValue={initialLead?.clientName ?? ""} required />
            </Field>
            <Field label="Company">
              <Input name="company" placeholder="Optional company name" defaultValue={initialLead?.company ?? ""} />
            </Field>
            <Field label="Phone">
              <Input name="phone" placeholder="0917..." defaultValue={initialLead?.phone ?? ""} />
            </Field>
            <Field label="Email">
              <Input name="email" type="email" placeholder="client@email.com" defaultValue={initialLead?.email ?? ""} />
            </Field>
          </div>
        </section>

        <section className="grid gap-5 border-t border-[#eef0f6] pt-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#9793a0]">Project</p>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Project Name">
              <Input name="projectName" placeholder="Modern Residence Renovation" defaultValue={initialLead?.projectName ?? ""} required />
            </Field>
            <Field label="Location">
              <Input name="location" placeholder="Pampanga" defaultValue={initialLead?.location ?? ""} />
            </Field>
            <Field label="Status">
              <Select name="status" defaultValue={initialLead?.status ?? "new_lead"} className="rounded-xl border-[#e7e9f2] bg-[#f8f9fc]">
                {projectLeadStatuses.map((status) => (
                  <option key={status} value={status}>
                    {formatStatusLabel(status)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Source">
              <Input name="source" placeholder="manual" defaultValue={initialLead?.source ?? "manual"} />
            </Field>
            <Field label="Inquiry Type">
              <Input name="inquiryType" placeholder="quote, contact, walk-in" defaultValue={initialLead?.inquiryType ?? ""} />
            </Field>
            <Field label="Quotation Status">
              <Select
                name="quotationFinished"
                value={quotationFinished ? "true" : "false"}
                onChange={(event) => setQuotationFinished(event.target.value === "true")}
                className="rounded-xl border-[#e7e9f2] bg-[#f8f9fc]"
              >
                <option value="false">Quotation not finished</option>
                <option value="true">Quotation finished</option>
              </Select>
            </Field>
            <Field label="Estimated Cost" className="md:col-span-2">
              <Input
                name="estimatedCost"
                type="number"
                step="0.01"
                min="0"
                placeholder={quotationFinished ? "Enter final estimated amount" : "Available after quotation is finished"}
                defaultValue={initialLead?.estimatedCost ?? ""}
                disabled={!quotationFinished}
              />
            </Field>
            <Field label="Internal Notes" className="md:col-span-2">
              <Textarea
                name="notes"
                className="min-h-32"
                placeholder="Project context, preferences, material interest, or important reminders"
                defaultValue={initialLead?.notes ?? ""}
              />
            </Field>
            <Field label="Attachments" className="md:col-span-2">
              <div className="grid gap-3">
                <input
                  type="file"
                  name="attachments"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp,.txt"
                  onChange={(event) => setAttachmentNames(Array.from(event.target.files ?? []).map((file) => file.name))}
                  className="w-full cursor-pointer rounded-sm border border-dashed border-[var(--border)] bg-white px-4 py-4 text-[15px] text-[var(--foreground)] file:mr-4 file:cursor-pointer file:rounded-sm file:border-0 file:bg-[var(--brand)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:border-[#bdbabd] focus:outline-none focus:ring-4 focus:ring-[rgba(237,35,37,0.08)]"
                />
                <p className="text-sm text-[var(--muted)]">
                  Upload quotations, drawings, references, spreadsheets, or supporting project documents.
                </p>
                {attachmentNames.length > 0 ? (
                  <div className="grid gap-1 text-sm text-[var(--muted)]">
                    {attachmentNames.map((name) => (
                      <span key={name}>{name}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            </Field>
          </div>
        </section>
      </div>

      {state.error ? <p className="rounded-sm border border-[#ed2325]/20 bg-[#fff5f5] px-4 py-3 text-sm text-[#8f1d1d]">{state.error}</p> : null}

      <div className="flex items-center justify-between gap-4 border-t border-[#eef0f6] pt-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">
          {isEditMode ? "Ready to update" : "Ready to save"}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(getAdminRoute("/crm"))}
            className="inline-flex min-w-28 cursor-pointer items-center justify-center rounded-sm border border-[var(--border)] px-5 py-3 text-sm font-medium uppercase tracking-[0.14em] text-[#231f20] transition hover:border-[#231f20]/20 hover:text-[var(--brand)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-w-36 cursor-pointer items-center justify-center rounded-sm bg-[var(--brand)] px-5 py-3 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-[0_10px_22px_rgba(237,35,37,0.16)] transition hover:-translate-y-0.5 hover:bg-[#c81a1d] hover:shadow-[0_14px_28px_rgba(237,35,37,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (isEditMode ? "Updating..." : "Saving...") : isEditMode ? "Update Project" : "Save Project"}
          </button>
        </div>
      </div>
    </form>
  );
}

export function ProjectLeadNoteForm({ projectLeadId }: { projectLeadId: string }) {
  const [state, formAction, isPending] = useActionState(addProjectLeadNoteAction, initialState);

  return (
    <form action={formAction} className="grid gap-4 rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
      <input type="hidden" name="projectLeadId" value={projectLeadId} />
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9793a0]">Add Note</p>
        <Textarea name="note" className="mt-3 min-h-28" placeholder="Add follow-up updates, quotation notes, or project progress..." />
      </div>
      {state.error ? <p className="text-sm text-[#8f1d1d]">{state.error}</p> : null}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-w-32 cursor-pointer items-center justify-center rounded-sm bg-[var(--brand)] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-white transition hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Add Note"}
        </button>
      </div>
    </form>
  );
}
