"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addCrmOpportunityNoteAction,
  createCrmAccountAction,
  createCrmContactAction,
  createCrmOpportunityAction,
  type CrmFormState,
  updateCrmAccountAction,
  updateCrmContactAction,
  updateCrmOpportunityAction,
} from "@/app/(admin)/admin/crm/actions";
import { getAdminRoute } from "@/lib/admin-path";
import type { CrmAccount, CrmContact, CrmOpportunity } from "@/types/crm";
import { crmOpportunityStages } from "@/types/crm";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initialState: CrmFormState = {
  error: null,
  entityId: null,
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

function formatStageLabel(value: string) {
  return value.replaceAll("_", " ");
}

export function CrmAccountForm({
  mode = "create",
  initialAccount = null,
}: {
  mode?: "create" | "edit";
  initialAccount?: CrmAccount | null;
}) {
  const router = useRouter();
  const isEditMode = mode === "edit";
  const action = isEditMode ? updateCrmAccountAction : createCrmAccountAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.entityId) {
      router.push(getAdminRoute(`/crm/${state.entityId}`));
      router.refresh();
    }
  }, [router, state.entityId]);

  return (
    <form action={formAction} className="crm-popover-form grid gap-6 rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)] sm:p-6">
      {isEditMode && initialAccount ? <input type="hidden" name="accountId" value={initialAccount.id} /> : null}

      <div className="grid gap-8">
        <section className="grid gap-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#9793a0]">Account</p>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Account Name">
              <Input name="name" placeholder="Enter the company name" defaultValue={initialAccount?.name ?? ""} required />
            </Field>
            <Field label="Industry">
              <Input name="industry" placeholder="Describe the industry or business type" defaultValue={initialAccount?.industry ?? ""} />
            </Field>
            <Field label="Company Website">
              <Input name="website" type="url" placeholder="https://www.company.com" defaultValue={initialAccount?.website ?? ""} />
            </Field>
            <Field label="Phone">
              <Input name="phone" placeholder="Enter the main company phone number" defaultValue={initialAccount?.phone ?? ""} />
            </Field>
            <Field label="Email">
              <Input name="email" type="email" placeholder="Enter the main company email address" defaultValue={initialAccount?.email ?? ""} />
            </Field>
            <Field label="Address" className="md:col-span-2">
              <Input name="address" placeholder="Enter the complete office address" defaultValue={initialAccount?.address ?? ""} />
            </Field>
            <Field label="City">
              <Input name="city" placeholder="Enter the city or locality" defaultValue={initialAccount?.city ?? ""} />
            </Field>
            <Field label="Internal Notes" className="md:col-span-2">
              <Textarea name="notes" className="min-h-28" placeholder="Add internal notes, commercial context, or account history" defaultValue={initialAccount?.notes ?? ""} />
            </Field>
          </div>
        </section>

        {!isEditMode ? (
          <>
            <section className="grid gap-5 border-t border-[#eef0f6] pt-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#9793a0]">Initial Contact</p>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Full Name">
                  <Input name="initialContactName" placeholder="Enter the primary contact name" />
                </Field>
                <Field label="Job Title">
                  <Input name="initialContactJobTitle" placeholder="Enter the contact's job title" />
                </Field>
                <Field label="Phone">
                  <Input name="initialContactPhone" placeholder="Enter the direct contact number" />
                </Field>
                <Field label="Email">
                  <Input name="initialContactEmail" type="email" placeholder="Enter the contact email address" />
                </Field>
              </div>
            </section>

            <section className="grid gap-5 border-t border-[#eef0f6] pt-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#9793a0]">Initial Opportunity</p>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Opportunity Name">
                  <Input name="initialOpportunityName" placeholder="Enter the project or opportunity name" />
                </Field>
                <Field label="Location">
                  <Input name="initialOpportunityLocation" placeholder="Enter the project location" />
                </Field>
              </div>
            </section>
          </>
        ) : null}
      </div>

      {state.error ? <p className="rounded-sm border border-[#ed2325]/20 bg-[#fff5f5] px-4 py-3 text-sm text-[#8f1d1d]">{state.error}</p> : null}

      <div className="flex items-center justify-between gap-4 border-t border-[#eef0f6] pt-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">{isEditMode ? "Ready to update account" : "Ready to create account"}</p>
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
            {isPending ? (isEditMode ? "Updating..." : "Saving...") : isEditMode ? "Update Account" : "Create Account"}
          </button>
        </div>
      </div>
    </form>
  );
}

export function CrmContactForm({ accountId }: { accountId: string }) {
  return <CrmContactFormInner accountId={accountId} />;
}

export function CrmContactFormInner({
  accountId,
  mode = "create",
  initialContact = null,
  onSuccess,
  onCancel,
}: {
  accountId: string;
  mode?: "create" | "edit";
  initialContact?: CrmContact | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const isEditMode = mode === "edit";
  const [state, formAction, isPending] = useActionState(isEditMode ? updateCrmContactAction : createCrmContactAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.entityId) {
      router.refresh();
      onSuccess?.();
    }
  }, [onSuccess, router, state.entityId]);

  return (
    <form action={formAction} className="crm-popover-form grid gap-4 rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
      <input type="hidden" name="accountId" value={accountId} />
      {isEditMode && initialContact ? <input type="hidden" name="contactId" value={initialContact.id} /> : null}
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9793a0]">{isEditMode ? "Edit Contact" : "Add Contact"}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Full Name">
          <Input name="fullName" placeholder="Enter the contact's full name" defaultValue={initialContact?.fullName ?? ""} required />
        </Field>
        <Field label="Job Title">
          <Input name="jobTitle" placeholder="Enter the contact's role or title" defaultValue={initialContact?.jobTitle ?? ""} />
        </Field>
        <Field label="Phone">
          <Input name="phone" placeholder="Enter the contact phone number" defaultValue={initialContact?.phone ?? ""} />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" placeholder="Enter the contact email address" defaultValue={initialContact?.email ?? ""} />
        </Field>
        <Field label="Notes" className="md:col-span-2">
          <Textarea name="notes" className="min-h-24" placeholder="Add relationship notes or communication preferences" defaultValue={initialContact?.notes ?? ""} />
        </Field>
      </div>
      {state.error ? <p className="text-sm text-[#8f1d1d]">{state.error}</p> : null}
      <div className="flex items-center justify-end gap-3">
        {isEditMode ? (
          <button
            type="button"
            onClick={() => onCancel?.()}
            className="inline-flex min-w-28 cursor-pointer items-center justify-center rounded-sm border border-[var(--border)] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-[#231f20] transition hover:border-[#231f20]/20 hover:text-[var(--brand)]"
          >
            Cancel
          </button>
        ) : null}
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-w-32 cursor-pointer items-center justify-center rounded-sm bg-[var(--brand)] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-white transition hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : isEditMode ? "Update Contact" : "Add Contact"}
        </button>
      </div>
    </form>
  );
}

export function CrmOpportunityForm({
  mode = "create",
  initialOpportunity = null,
  accountId,
  contacts = [],
}: {
  mode?: "create" | "edit";
  initialOpportunity?: CrmOpportunity | null;
  accountId: string;
  contacts?: CrmContact[];
}) {
  const router = useRouter();
  const isEditMode = mode === "edit";
  const action = isEditMode ? updateCrmOpportunityAction : createCrmOpportunityAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [quotationFinished, setQuotationFinished] = useState(initialOpportunity?.quotationFinished ?? false);
  const [attachmentNames, setAttachmentNames] = useState<string[]>([]);

  useEffect(() => {
    if (state.entityId && !isEditMode) {
      router.push(getAdminRoute(`/crm/opportunities/${state.entityId}`));
      router.refresh();
    }
  }, [isEditMode, router, state.entityId]);

  return (
    <form action={formAction} className="crm-popover-form grid gap-6 rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)] sm:p-6">
      <input type="hidden" name="accountId" value={accountId} />
      {isEditMode && initialOpportunity ? (
        <>
          <input type="hidden" name="opportunityId" value={initialOpportunity.id} />
          <input type="hidden" name="previousStage" value={initialOpportunity.stage} />
        </>
      ) : null}

      <div className="grid gap-8">
        <section className="grid gap-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#9793a0]">{isEditMode ? "Opportunity" : "New Opportunity"}</p>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Opportunity Name">
              <Input name="name" placeholder="Enter the opportunity or project name" defaultValue={initialOpportunity?.name ?? ""} required />
            </Field>
            <Field label="Location">
              <Input name="location" placeholder="Enter the project or site location" defaultValue={initialOpportunity?.location ?? ""} />
            </Field>
            <Field label="Stage">
              <Select name="stage" defaultValue={initialOpportunity?.stage ?? "new_lead"} className="rounded-xl border-[#e7e9f2] bg-[#f8f9fc]">
                {crmOpportunityStages.map((stage) => (
                  <option key={stage} value={stage}>
                    {formatStageLabel(stage)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Primary Contact">
              <Select
                name="primaryContactId"
                defaultValue={initialOpportunity?.primaryContactId ?? ""}
                className="rounded-xl border-[#e7e9f2] bg-[#f8f9fc]"
              >
                <option value="">No primary contact</option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.fullName}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Source">
              <Input name="source" placeholder="Enter the lead source or commercial channel" defaultValue={initialOpportunity?.source ?? "manual"} />
            </Field>
            <Field label="Quotation Status">
              <Select
                name="quotationFinished"
                value={quotationFinished ? "true" : "false"}
                onChange={(event) => setQuotationFinished(event.target.value === "true")}
                className="rounded-xl border-[#e7e9f2] bg-[#f8f9fc]"
              >
                <option value="false">Pending</option>
                <option value="true">Sent</option>
              </Select>
            </Field>
            <Field label="Estimated Value" className="md:col-span-2">
              <div className="grid gap-2">
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#6f6a75]">PHP</span>
                  <Input
                    name="estimatedValue"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                placeholder={quotationFinished ? "0.00" : "Can still be added before quotation is complete"}
                    defaultValue={initialOpportunity?.estimatedValue?.toFixed(2) ?? ""}
                    className="pl-14"
                  />
                </div>
                <p className="text-sm text-[var(--muted)]">Enter the opportunity value in Philippine Peso with centavos when needed.</p>
              </div>
            </Field>
            <Field label="Opportunity Notes" className="md:col-span-2">
              <Textarea
                name="notes"
                className="min-h-28"
                placeholder="Scope, material requirements, commercial context, next steps..."
                
                defaultValue={initialOpportunity?.notes ?? ""}
              />
            </Field>
            {isEditMode ? (
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
                  <p className="text-sm text-[var(--muted)]">Upload quotation files, drawings, bid documents, or project references.</p>
                  {attachmentNames.length > 0 ? (
                    <div className="grid gap-1 text-sm text-[var(--muted)]">
                      {attachmentNames.map((name) => (
                        <span key={name}>{name}</span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Field>
            ) : null}
          </div>
        </section>
      </div>

      {state.error ? <p className="rounded-sm border border-[#ed2325]/20 bg-[#fff5f5] px-4 py-3 text-sm text-[#8f1d1d]">{state.error}</p> : null}

      <div className="flex items-center justify-between gap-4 border-t border-[#eef0f6] pt-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">{isEditMode ? "Ready to update opportunity" : "Ready to add opportunity"}</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(isEditMode && initialOpportunity ? getAdminRoute(`/crm/${initialOpportunity.accountId}`) : getAdminRoute(`/crm/${accountId}`))}
            className="inline-flex min-w-28 cursor-pointer items-center justify-center rounded-sm border border-[var(--border)] px-5 py-3 text-sm font-medium uppercase tracking-[0.14em] text-[#231f20] transition hover:border-[#231f20]/20 hover:text-[var(--brand)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-w-36 cursor-pointer items-center justify-center rounded-sm bg-[var(--brand)] px-5 py-3 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-[0_10px_22px_rgba(237,35,37,0.16)] transition hover:-translate-y-0.5 hover:bg-[#c81a1d] hover:shadow-[0_14px_28px_rgba(237,35,37,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (isEditMode ? "Updating..." : "Saving...") : isEditMode ? "Update Opportunity" : "Add Opportunity"}
          </button>
        </div>
      </div>
    </form>
  );
}

export function CrmOpportunityNoteForm({ opportunityId }: { opportunityId: string }) {
  const [state, formAction, isPending] = useActionState(addCrmOpportunityNoteAction, initialState);

  return (
    <form action={formAction} className="crm-popover-form grid gap-4 rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
      <input type="hidden" name="opportunityId" value={opportunityId} />
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9793a0]">Add Note</p>
        <Textarea name="note" className="mt-3 min-h-28" placeholder="Add negotiation updates, bid notes, client feedback, or next actions..." />
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
