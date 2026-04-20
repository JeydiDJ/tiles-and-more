"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import {
  addCrmOpportunityNoteAction,
  deleteCrmOpportunityAction,
  updateCrmOpportunityArchitectAction,
  updateCrmOpportunityOverviewAction,
  updateCrmOpportunityOwnerAction,
  type CrmDeleteState,
  type CrmFormState,
} from "@/app/(admin)/admin/crm/actions";
import { CrmOpportunityForm } from "@/components/admin/crm-forms";
import { AnimatedPresence } from "@/components/ui/animated-presence";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAdminRoute } from "@/lib/admin-path";
import type { CrmContact, CrmOpportunity, CrmOpportunityActivity, CrmOpportunityAttachment } from "@/types/crm";
import { crmOpportunityStages } from "@/types/crm";

const initialState: CrmFormState = {
  error: null,
  entityId: null,
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatFileSize(value: number | null) {
  if (!value) return null;
  if (value < 1024 * 1024) {
    return `${Math.round(value / 1024)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function formatCurrency(value: number | null) {
  if (value === null) return "-";
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatStageLabel(value: string) {
  return value.replaceAll("_", " ");
}

function BackLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 self-start rounded-full border border-[#f0d4d7] bg-white px-4 py-2.5 text-sm font-medium text-[var(--brand)] shadow-[0_10px_22px_rgba(35,31,32,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand)] hover:bg-[#fff7f7] hover:shadow-[0_14px_28px_rgba(237,35,37,0.12)]"
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#fff1f1] text-[var(--brand)] transition duration-200 group-hover:-translate-x-0.5 group-hover:bg-[var(--brand)] group-hover:text-white">
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3.5 w-3.5 fill-none stroke-current">
          <path d="M11.5 4.5 6 10l5.5 5.5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span>{label}</span>
    </Link>
  );
}

function ActionButton({
  label,
  active = false,
  tone = "default",
  onClick,
}: {
  label: string;
  active?: boolean;
  tone?: "default" | "danger";
  onClick: () => void;
}) {
  if (tone === "danger") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[#f1d0d0] bg-[#fff5f5] px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[#b42318] transition hover:border-[#d8aaaa] hover:bg-white"
      >
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center justify-center rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] transition ${
        active
          ? "border-[#17141a] bg-[#17141a] text-white shadow-[0_10px_20px_rgba(23,20,26,0.14)]"
          : "border-[#e7e9f2] bg-white text-[#17141a] hover:-translate-y-0.5 hover:border-[#cfd5e2] hover:bg-[#fafbfe] hover:shadow-[0_10px_20px_rgba(35,31,32,0.08)]"
      }`}
    >
      {label}
    </button>
  );
}

function Field({
  label,
  children,
  className = "",
  hint,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  hint?: string;
}) {
  return (
    <label className={`grid gap-2 ${className}`}>
      <span className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">{label}</span>
      {children}
      {hint ? <span className="text-xs leading-5 text-[#8b8791]">{hint}</span> : null}
    </label>
  );
}

function DetailFormShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="crm-popover-form overflow-hidden rounded-[1.55rem] border border-[#e3e7f0] bg-white shadow-[0_14px_30px_rgba(35,31,32,0.06)]">
      <div className="border-b border-[#edf0f6] bg-[linear-gradient(180deg,#fcfcfd_0%,#f7f8fb_100%)] px-4 py-3.5 sm:px-5 sm:py-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#9793a0]">{eyebrow}</p>
        <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-[#17141a]">{title}</h3>
      </div>
      <div className="grid gap-5 px-4 py-4 sm:px-5 sm:py-5">{children}</div>
    </div>
  );
}

function OpportunityPartyCard({
  title,
  organisationLabel,
  organisation,
  contactPerson,
  position,
  contactNumber,
  email,
  action,
  children,
}: {
  title: string;
  organisationLabel: string;
  organisation: string | null;
  contactPerson: string | null;
  position: string | null;
  contactNumber: string | null;
  email: string | null;
  action: React.ReactNode;
  children?: React.ReactNode;
}) {
  const items = [
    { label: "Contact Person", value: contactPerson },
    { label: "Position", value: position },
    { label: "Contact Number", value: contactNumber },
    { label: "Email Address", value: email },
  ];

  return (
    <section className="min-w-0 rounded-[1.5rem] border border-[#e7e9f2] bg-white p-4 shadow-[0_10px_24px_rgba(35,31,32,0.04)] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-[#9793a0]">{title}</h2>
        {action}
      </div>
      <div className="mt-4 grid gap-4">
        <div className="rounded-[1.1rem] border border-[#eef0f6] bg-[#fafbfe] p-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[#9793a0]">{organisationLabel}</p>
          <p className="mt-2 break-words text-sm font-medium text-[#17141a]">{organisation || "-"}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.label} className="rounded-[1.1rem] border border-[#eef0f6] bg-[#fafbfe] p-4">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#9793a0]">{item.label}</p>
              <p className="mt-2 break-words text-sm text-[#17141a]">{item.value || "-"}</p>
            </div>
          ))}
        </div>
      </div>
      {children ? <div className="mt-5">{children}</div> : null}
    </section>
  );
}

function OpportunityOverviewForm({
  opportunity,
  contacts,
  onClose,
}: {
  opportunity: CrmOpportunity;
  contacts: CrmContact[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updateCrmOpportunityOverviewAction, initialState);

  useEffect(() => {
    if (state.entityId) {
      router.refresh();
      onClose();
    }
  }, [onClose, router, state.entityId]);

  return (
    <form action={formAction}>
      <input type="hidden" name="opportunityId" value={opportunity.id} />
      <DetailFormShell
        eyebrow="Edit Overview"
        title="Update the core opportunity details"
      >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Opportunity Name">
          <Input name="name" defaultValue={opportunity.name} required />
        </Field>
        <Field label="Location">
          <Input name="location" defaultValue={opportunity.location ?? ""} />
        </Field>
        <Field label="Stage">
          <Select name="stage" defaultValue={opportunity.stage} className="rounded-xl border-[#e7e9f2] bg-[#f8f9fc]">
            {crmOpportunityStages.map((stage) => (
              <option key={stage} value={stage}>
                {formatStageLabel(stage)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Primary Contact">
          <Select name="primaryContactId" defaultValue={opportunity.primaryContactId ?? ""} className="rounded-xl border-[#e7e9f2] bg-[#f8f9fc]">
            <option value="">No primary contact</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.fullName}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Source">
          <Input name="source" defaultValue={opportunity.source} />
        </Field>
        <Field label="Quotation Status">
          <Select
            name="quotationFinished"
            defaultValue={opportunity.quotationFinished ? "true" : "false"}
            className="rounded-xl border-[#e7e9f2] bg-[#f8f9fc]"
          >
            <option value="false">Pending</option>
            <option value="true">Sent</option>
          </Select>
        </Field>
        <Field label="Estimated Value" className="md:col-span-2">
          <Input name="estimatedValue" type="number" inputMode="decimal" step="0.01" min="0" defaultValue={opportunity.estimatedValue?.toFixed(2) ?? ""} />
        </Field>
        <Field label="Opportunity Notes" className="md:col-span-2">
          <Textarea name="notes" className="min-h-28" defaultValue={opportunity.notes ?? ""} />
        </Field>
      </div>
      {state.error ? <p className="rounded-[1rem] border border-[#ed2325]/20 bg-[#fff5f5] px-4 py-3 text-sm text-[#8f1d1d]">{state.error}</p> : null}
      <div className="flex flex-col-reverse gap-3 border-t border-[#edf0f6] pt-4 sm:flex-row sm:items-center sm:justify-end">
        <ActionButton label="Cancel" onClick={onClose} />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-[0_10px_22px_rgba(237,35,37,0.16)] transition hover:bg-[#c81a1d] disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-36 sm:w-auto"
        >
          {isPending ? "Updating..." : "Save Overview"}
        </button>
      </div>
      </DetailFormShell>
    </form>
  );
}

function OpportunityPartyForm({
  action,
  opportunityId,
  values,
  fields,
  submitLabel,
  onClose,
}: {
  action: (state: CrmFormState, formData: FormData) => Promise<CrmFormState>;
  opportunityId: string;
  values: Record<string, string>;
  fields: Array<{ name: string; label: string; type?: "text" | "email" }>;
  submitLabel: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.entityId) {
      router.refresh();
      onClose();
    }
  }, [onClose, router, state.entityId]);

  return (
    <form action={formAction}>
      <input type="hidden" name="opportunityId" value={opportunityId} />
      <DetailFormShell
        eyebrow="Edit Party"
        title={submitLabel}
      >
      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((field, index) => (
          <Field key={field.name} label={field.label} className={index === 0 ? "md:col-span-2" : ""}>
            <Input name={field.name} type={field.type ?? "text"} defaultValue={values[field.name] ?? ""} />
          </Field>
        ))}
      </div>
      {state.error ? <p className="rounded-[1rem] border border-[#ed2325]/20 bg-[#fff5f5] px-4 py-3 text-sm text-[#8f1d1d]">{state.error}</p> : null}
      <div className="flex flex-col-reverse gap-3 border-t border-[#edf0f6] pt-4 sm:flex-row sm:items-center sm:justify-end">
        <ActionButton label="Cancel" onClick={onClose} />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-[0_10px_22px_rgba(237,35,37,0.16)] transition hover:bg-[#c81a1d] disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-32 sm:w-auto"
        >
          {isPending ? "Updating..." : submitLabel}
        </button>
      </div>
      </DetailFormShell>
    </form>
  );
}

export function CrmOpportunityDetail({
  opportunity,
  contacts,
  activity,
  attachments,
}: {
  opportunity: CrmOpportunity;
  contacts: CrmContact[];
  activity: CrmOpportunityActivity[];
  attachments: CrmOpportunityAttachment[];
}) {
  const router = useRouter();
  const [overviewPanel, setOverviewPanel] = useState<"none" | "edit-overview" | "edit-all">("none");
  const [architectPanel, setArchitectPanel] = useState(false);
  const [ownerPanel, setOwnerPanel] = useState(false);
  const [notePanel, setNotePanel] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteState, deleteFormAction, isDeleting] = useActionState(deleteCrmOpportunityAction, { error: null } satisfies CrmDeleteState);
  const [noteState, noteFormAction, isSavingNote] = useActionState(addCrmOpportunityNoteAction, initialState);
  const wasDeleting = useRef(false);

  useEffect(() => {
    if (wasDeleting.current && !isDeleting && !deleteState.error) {
      router.push(getAdminRoute(`/crm/${opportunity.accountId}`));
      router.refresh();
    }
    wasDeleting.current = isDeleting;
  }, [deleteState.error, isDeleting, opportunity.accountId, router]);

  useEffect(() => {
    if (noteState.entityId) {
      router.refresh();
      window.setTimeout(() => setNotePanel(false), 0);
    }
  }, [noteState.entityId, router]);

  return (
    <div className="grid gap-6">
      <section className="min-w-0 overflow-hidden rounded-[1.75rem] border border-[#e7e9f2] bg-white shadow-[0_14px_30px_rgba(35,31,32,0.04)]">
        <div className="border-b border-[#edf0f6] bg-[#fafbfe] px-4 py-5 sm:px-7 sm:py-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#9793a0]">Opportunity</p>
              <h1 className="mt-3 break-words text-[2rem] font-semibold tracking-tight text-[#17141a] sm:text-[2.6rem]">{opportunity.name}</h1>
              <p className="mt-3 break-words text-sm text-[#6f6a75]">{opportunity.accountName} - {formatStageLabel(opportunity.stage)}</p>
            </div>
            <BackLink href={getAdminRoute(`/crm/${opportunity.accountId}`)} label="Back to Account" />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="grid min-w-0 gap-6">
          <section className="min-w-0 rounded-[1.5rem] border border-[#e7e9f2] bg-white p-4 shadow-[0_10px_24px_rgba(35,31,32,0.04)] sm:p-5">
            <div className="flex flex-wrap items-center gap-3 border-b border-[#eef0f6] pb-5">
              <ActionButton
                label={overviewPanel === "edit-overview" ? "Close" : "Edit overview"}
                active={overviewPanel === "edit-overview"}
                onClick={() => setOverviewPanel((current) => (current === "edit-overview" ? "none" : "edit-overview"))}
              />
              <ActionButton
                label={overviewPanel === "edit-all" ? "Close full form" : "Open full form"}
                active={overviewPanel === "edit-all"}
                onClick={() => setOverviewPanel((current) => (current === "edit-all" ? "none" : "edit-all"))}
              />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.2rem] border border-[#eef0f6] bg-[#fafbfe] p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#9793a0]">Overview</p>
                <div className="mt-3 grid gap-2 text-sm break-words text-[#6f6a75]">
                  <p><span className="font-medium text-[#17141a]">Location:</span> {opportunity.location || "-"}</p>
                  <p><span className="font-medium text-[#17141a]">Stage:</span> {formatStageLabel(opportunity.stage)}</p>
                  <p><span className="font-medium text-[#17141a]">Source:</span> {opportunity.source || "-"}</p>
                  <p><span className="font-medium text-[#17141a]">Quotation:</span> {opportunity.quotationFinished ? "Sent" : "Pending"}</p>
                </div>
              </div>
              <div className="rounded-[1.2rem] border border-[#eef0f6] bg-[#fafbfe] p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#9793a0]">Commercial</p>
                <div className="mt-3 grid gap-2 text-sm break-words text-[#6f6a75]">
                  <p><span className="font-medium text-[#17141a]">Account:</span> {opportunity.accountName}</p>
                  <p><span className="font-medium text-[#17141a]">Primary Contact:</span> {opportunity.primaryContactName || "-"}</p>
                  <p><span className="font-medium text-[#17141a]">Estimated Value:</span> {formatCurrency(opportunity.estimatedValue)}</p>
                  <p><span className="font-medium text-[#17141a]">Updated:</span> {formatDate(opportunity.updatedAt)}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-[1.2rem] border border-[#eef0f6] bg-[#fafbfe] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#9793a0]">Opportunity Notes</p>
              <p className="mt-3 break-words text-sm leading-7 text-[#6f6a75]">{opportunity.notes || "No opportunity notes yet."}</p>
            </div>

            <AnimatedPresence open={overviewPanel === "edit-overview"} spaced>
              <OpportunityOverviewForm opportunity={opportunity} contacts={contacts} onClose={() => setOverviewPanel("none")} />
            </AnimatedPresence>
            <AnimatedPresence open={overviewPanel === "edit-all"} spaced>
              <CrmOpportunityForm
                mode="edit"
                initialOpportunity={opportunity}
                accountId={opportunity.accountId}
                contacts={contacts}
                onCancel={() => setOverviewPanel("none")}
              />
            </AnimatedPresence>
          </section>

          <OpportunityPartyCard
            title="Architect / Designer"
            organisationLabel="Firm"
            organisation={opportunity.architectDesignerFirm}
            contactPerson={opportunity.architectDesignerContactPerson}
            position={opportunity.architectDesignerPosition}
            contactNumber={opportunity.architectDesignerContactNumber}
            email={opportunity.architectDesignerEmail}
            action={
              <ActionButton
                label={architectPanel ? "Close" : opportunity.architectDesignerFirm || opportunity.architectDesignerContactPerson ? "Edit architect" : "Add architect"}
                active={architectPanel}
                onClick={() => setArchitectPanel((current) => !current)}
              />
            }
          >
            <AnimatedPresence open={architectPanel}>
              <OpportunityPartyForm
                action={updateCrmOpportunityArchitectAction}
                opportunityId={opportunity.id}
                submitLabel="Save Architect"
                onClose={() => setArchitectPanel(false)}
                values={{
                  architectDesignerFirm: opportunity.architectDesignerFirm ?? "",
                  architectDesignerContactPerson: opportunity.architectDesignerContactPerson ?? "",
                  architectDesignerPosition: opportunity.architectDesignerPosition ?? "",
                  architectDesignerContactNumber: opportunity.architectDesignerContactNumber ?? "",
                  architectDesignerEmail: opportunity.architectDesignerEmail ?? "",
                }}
                fields={[
                  { name: "architectDesignerFirm", label: "Architect / Designer Firm" },
                  { name: "architectDesignerContactPerson", label: "Contact Person" },
                  { name: "architectDesignerPosition", label: "Position" },
                  { name: "architectDesignerContactNumber", label: "Contact Number" },
                  { name: "architectDesignerEmail", label: "Email Address", type: "email" },
                ]}
              />
            </AnimatedPresence>
          </OpportunityPartyCard>

          <OpportunityPartyCard
            title="Owner"
            organisationLabel="Owner"
            organisation={opportunity.ownerName}
            contactPerson={opportunity.ownerContactPerson}
            position={opportunity.ownerPosition}
            contactNumber={opportunity.ownerContactNumber}
            email={opportunity.ownerEmail}
            action={
              <ActionButton
                label={ownerPanel ? "Close" : opportunity.ownerName || opportunity.ownerContactPerson ? "Edit owner" : "Add owner"}
                active={ownerPanel}
                onClick={() => setOwnerPanel((current) => !current)}
              />
            }
          >
            <AnimatedPresence open={ownerPanel}>
              <OpportunityPartyForm
                action={updateCrmOpportunityOwnerAction}
                opportunityId={opportunity.id}
                submitLabel="Save Owner"
                onClose={() => setOwnerPanel(false)}
                values={{
                  ownerName: opportunity.ownerName ?? "",
                  ownerContactPerson: opportunity.ownerContactPerson ?? "",
                  ownerPosition: opportunity.ownerPosition ?? "",
                  ownerContactNumber: opportunity.ownerContactNumber ?? "",
                  ownerEmail: opportunity.ownerEmail ?? "",
                }}
                fields={[
                  { name: "ownerName", label: "Owner" },
                  { name: "ownerContactPerson", label: "Contact Person" },
                  { name: "ownerPosition", label: "Position" },
                  { name: "ownerContactNumber", label: "Contact Number" },
                  { name: "ownerEmail", label: "Email Address", type: "email" },
                ]}
              />
            </AnimatedPresence>
          </OpportunityPartyCard>
        </div>

        <div className="grid min-w-0 gap-6">
          <section className="min-w-0 rounded-[1.5rem] border border-[#e7e9f2] bg-white p-4 shadow-[0_10px_24px_rgba(35,31,32,0.04)] sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-[11px] uppercase tracking-[0.2em] text-[#9793a0]">Notes</h2>
              <ActionButton label={notePanel ? "Close" : "Add note"} active={notePanel} onClick={() => setNotePanel((current) => !current)} />
            </div>
            <AnimatedPresence open={notePanel} spaced>
              <form action={noteFormAction}>
                <input type="hidden" name="opportunityId" value={opportunity.id} />
                <DetailFormShell
                  eyebrow="Add Note"
                  title="Capture the latest update"
                >
                  <Textarea name="note" className="min-h-28" placeholder="Add negotiation updates, bid notes, client feedback, or next actions..." />
                  {noteState.error ? <p className="rounded-[1rem] border border-[#ed2325]/20 bg-[#fff5f5] px-4 py-3 text-sm text-[#8f1d1d]">{noteState.error}</p> : null}
                  <div className="flex border-t border-[#edf0f6] pt-4">
                    <button
                      type="submit"
                      disabled={isSavingNote}
                      className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[var(--brand)] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-white transition hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-32 sm:w-auto"
                    >
                      {isSavingNote ? "Saving..." : "Save Note"}
                    </button>
                  </div>
                </DetailFormShell>
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
              </form>
            </AnimatedPresence>
            <div className="mt-4 grid gap-0">
              {activity.length > 0 ? (
                activity.map((item) => (
                  <div key={item.id} className="border-b border-[#eef0f6] py-4 last:border-b-0">
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9793a0]">{item.activityType.replaceAll("_", " ")}</p>
                    <p className="mt-2 break-words text-sm leading-6 text-[#17141a]">{item.content}</p>
                    <p className="mt-2 text-xs text-[#6f6a75]">{formatDate(item.createdAt)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#6f6a75]">No opportunity activity recorded yet.</p>
              )}
            </div>
          </section>

          <section className="min-w-0 rounded-[1.5rem] border border-[#e7e9f2] bg-white p-4 shadow-[0_10px_24px_rgba(35,31,32,0.04)] sm:p-5">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-[#9793a0]">Files</h2>
            {attachments.length > 0 ? (
              <div className="mt-4 grid gap-3">
                {attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.signedUrl ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[1.1rem] border border-[#e7e9f2] bg-[#fafbfe] p-4 transition hover:border-[#cfd5e2] hover:bg-white"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="break-all font-medium text-[#17141a]">{attachment.fileName}</p>
                        <p className="mt-1 break-words text-sm text-[#6f6a75]">
                          {[attachment.fileType, formatFileSize(attachment.fileSize)].filter(Boolean).join(" - ") || "Attachment"}
                        </p>
                      </div>
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--brand)]">Open</span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-[#6f6a75]">No files attached yet.</p>
            )}
          </section>

          <section className="min-w-0 self-start rounded-[1.3rem] border border-[#f1d0d0] bg-[#fffafa] p-4 shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#b42318]">Danger Zone</p>
            <p className="mt-2 text-sm leading-5 text-[#6f6a75]">
              Delete this opportunity only if it was created by mistake or should be removed permanently from the CRM history.
            </p>
            <div className="mt-3">
              <ActionButton label="Delete opportunity" tone="danger" onClick={() => setDeleteOpen(true)} />
            </div>
          </section>
        </div>
      </div>

      <Modal
        open={deleteOpen}
        onClose={() => (isDeleting ? null : setDeleteOpen(false))}
        title="Delete opportunity?"
        description={`This will permanently remove ${opportunity.name}. This action cannot be undone.`}
      >
        <form action={deleteFormAction} className="grid gap-4">
          <input type="hidden" name="opportunityId" value={opportunity.id} />
          {deleteState.error ? <p className="text-sm text-[#b42318]">{deleteState.error}</p> : null}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={() => setDeleteOpen(false)}
              disabled={isDeleting}
              className="inline-flex w-full items-center justify-center rounded-sm border border-[var(--border)] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[#231f20] transition hover:border-[#231f20]/25 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDeleting}
              className="inline-flex w-full items-center justify-center rounded-sm bg-[#b42318] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-white transition hover:bg-[#7a1b14] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isDeleting ? "Deleting..." : "Delete Opportunity"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
