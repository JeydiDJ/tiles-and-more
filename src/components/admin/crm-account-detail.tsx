"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { deleteCrmAccountAction, deleteCrmContactAction, type CrmDeleteState } from "@/app/(admin)/admin/crm/actions";
import { CrmAccountForm, CrmContactFormInner, CrmOpportunityForm } from "@/components/admin/crm-forms";
import { AnimatedPresence } from "@/components/ui/animated-presence";
import { Modal } from "@/components/ui/modal";
import { getAdminRoute } from "@/lib/admin-path";
import type { CrmAccount, CrmContact, CrmOpportunity } from "@/types/crm";

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

function getOpportunityStageBadge(stage: string) {
  switch (stage) {
    case "new_lead":
      return "border-[#5aa7ff] bg-[#5aa7ff] text-white shadow-[0_8px_18px_rgba(90,167,255,0.28)]";
    case "opportunity":
      return "border-[#2f7dff] bg-[#2f7dff] text-white shadow-[0_8px_18px_rgba(47,125,255,0.28)]";
    case "bidding":
      return "border-[#8a5bff] bg-[#8a5bff] text-white shadow-[0_8px_18px_rgba(138,91,255,0.28)]";
    case "negotiation":
      return "border-[#ff9f1f] bg-[#ff9f1f] text-white shadow-[0_8px_18px_rgba(255,159,31,0.28)]";
    case "awarded":
      return "border-[#16b88a] bg-[#16b88a] text-white shadow-[0_8px_18px_rgba(22,184,138,0.28)]";
    case "completed":
      return "border-[#1f9d55] bg-[#1f9d55] text-white shadow-[0_8px_18px_rgba(31,157,85,0.28)]";
    case "ongoing":
      return "border-[#0f6cdd] bg-[#0f6cdd] text-white shadow-[0_8px_18px_rgba(15,108,221,0.28)]";
    case "lost":
      return "border-[#e5484d] bg-[#e5484d] text-white shadow-[0_8px_18px_rgba(229,72,77,0.28)]";
    default:
      return "border-[#6b7280] bg-[#6b7280] text-white shadow-[0_8px_18px_rgba(107,114,128,0.22)]";
  }
}

function ActionButton({
  label,
  active = false,
  tone = "default",
  size = "default",
  onClick,
}: {
  label: string;
  active?: boolean;
  tone?: "default" | "danger";
  size?: "default" | "compact";
  onClick: () => void;
}) {
  if (tone === "danger") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex cursor-pointer items-center justify-center rounded-full border border-[#f1d0d0] bg-[#fff5f5] font-medium uppercase tracking-[0.12em] text-[#b42318] transition hover:border-[#d8aaaa] hover:bg-white ${
          size === "compact" ? "px-3 py-1.5 text-[10px]" : "px-4 py-2 text-xs"
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center justify-center rounded-full border font-medium uppercase tracking-[0.12em] transition ${
        active
          ? "border-[#17141a] bg-[#17141a] text-white shadow-[0_10px_20px_rgba(23,20,26,0.14)]"
          : "border-[#e7e9f2] bg-white text-[#17141a] hover:-translate-y-0.5 hover:border-[#cfd5e2] hover:bg-[#fafbfe] hover:shadow-[0_10px_20px_rgba(35,31,32,0.08)]"
      } ${size === "compact" ? "px-3 py-1.5 text-[10px]" : "px-4 py-2 text-xs"}`}
    >
      {label}
    </button>
  );
}

export function CrmAccountDetail({
  account,
  contacts,
  opportunities,
}: {
  account: CrmAccount;
  contacts: CrmContact[];
  opportunities: CrmOpportunity[];
}) {
  const router = useRouter();
  const [accountPanel, setAccountPanel] = useState<"none" | "edit-account">("none");
  const [contactPanel, setContactPanel] = useState<"none" | "add-contact" | "edit-contact">("none");
  const [opportunityPanel, setOpportunityPanel] = useState<"none" | "add-opportunity">("none");
  const [selectedContact, setSelectedContact] = useState<CrmContact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<CrmContact | null>(null);
  const [accountDeleteOpen, setAccountDeleteOpen] = useState(false);
  const [contactDeleteState, deleteContactFormAction, isDeletingContact] = useActionState(deleteCrmContactAction, { error: null } satisfies CrmDeleteState);
  const [accountDeleteState, deleteAccountFormAction, isDeletingAccount] = useActionState(deleteCrmAccountAction, { error: null } satisfies CrmDeleteState);
  const wasDeletingContact = useRef(false);
  const wasDeletingAccount = useRef(false);

  useEffect(() => {
    if (wasDeletingContact.current && !isDeletingContact && !contactDeleteState.error) {
      setContactToDelete(null);
      setSelectedContact(null);
      setContactPanel("none");
    }
    wasDeletingContact.current = isDeletingContact;
  }, [contactDeleteState.error, isDeletingContact]);

  useEffect(() => {
    if (wasDeletingAccount.current && !isDeletingAccount && !accountDeleteState.error) {
      setAccountDeleteOpen(false);
      router.push(getAdminRoute("/crm"));
      router.refresh();
    }
    wasDeletingAccount.current = isDeletingAccount;
  }, [accountDeleteState.error, isDeletingAccount, router]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="grid gap-6">
        <section className="rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
          <div className="flex flex-col gap-4 border-b border-[#eef0f6] pb-5">
            <div className="flex flex-wrap items-center gap-3">
              <ActionButton
                label={accountPanel === "edit-account" ? "Close" : "Edit overview"}
                active={accountPanel === "edit-account"}
                onClick={() => setAccountPanel((current) => (current === "edit-account" ? "none" : "edit-account"))}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.2rem] border border-[#eef0f6] bg-[#fafbfe] p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#9793a0]">Primary Info</p>
                <div className="mt-3 grid gap-2 text-sm text-[#6f6a75]">
                  <p><span className="font-medium text-[#17141a]">Industry:</span> {account.industry || "-"}</p>
                  <p><span className="font-medium text-[#17141a]">Website:</span> {account.website || "-"}</p>
                  <p><span className="font-medium text-[#17141a]">Phone:</span> {account.phone || "-"}</p>
                  <p><span className="font-medium text-[#17141a]">Email:</span> {account.email || "-"}</p>
                </div>
              </div>
              <div className="rounded-[1.2rem] border border-[#eef0f6] bg-[#fafbfe] p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#9793a0]">Address</p>
                <div className="mt-3 grid gap-2 text-sm text-[#6f6a75]">
                  <p><span className="font-medium text-[#17141a]">City:</span> {account.city || "-"}</p>
                  <p><span className="font-medium text-[#17141a]">Address:</span> {account.address || "-"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.2rem] border border-[#eef0f6] bg-[#fafbfe] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#9793a0]">Account Notes</p>
              <p className="mt-3 text-sm leading-7 text-[#6f6a75]">{account.notes || "No account notes yet."}</p>
            </div>
          </div>

          <AnimatedPresence open={accountPanel === "edit-account"} spaced>
            <CrmAccountForm mode="edit" initialAccount={account} onCancel={() => setAccountPanel("none")} />
          </AnimatedPresence>
        </section>

        <section className="rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[11px] uppercase tracking-[0.22em] text-[#9793a0]">Contacts</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#9793a0]">{contacts.length} total</span>
              <ActionButton
                label={contactPanel === "add-contact" ? "Close" : "Add contact"}
                active={contactPanel === "add-contact"}
                onClick={() => {
                  setSelectedContact(null);
                  setContactPanel((current) => (current === "add-contact" ? "none" : "add-contact"));
                }}
              />
            </div>
          </div>
          <AnimatedPresence open={contactPanel === "add-contact"} spaced>
            <CrmContactFormInner
              accountId={account.id}
              onSuccess={() => {
                setSelectedContact(null);
                setContactPanel("none");
              }}
            />
          </AnimatedPresence>
          <AnimatedPresence open={contactPanel === "edit-contact" && Boolean(selectedContact)} spaced>
            {selectedContact ? (
              <CrmContactFormInner
                accountId={account.id}
                mode="edit"
                initialContact={selectedContact}
                onSuccess={() => {
                  setSelectedContact(null);
                  setContactPanel("none");
                }}
                onCancel={() => {
                  setSelectedContact(null);
                  setContactPanel("none");
                }}
              />
            ) : null}
          </AnimatedPresence>
          {contacts.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {contacts.map((contact) => (
                <div key={contact.id} className="rounded-[1.1rem] border border-[#eef0f6] bg-[#fafbfe] p-4 transition hover:border-[#d5dae7] hover:bg-white hover:shadow-[0_10px_20px_rgba(35,31,32,0.06)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="font-medium text-[#17141a]">{contact.fullName}</span>
                      {contact.jobTitle ? (
                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-[#8d8896]">{contact.jobTitle}</p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <ActionButton
                        label="Edit"
                        size="compact"
                        onClick={() => {
                          setSelectedContact(contact);
                          setContactPanel("edit-contact");
                        }}
                      />
                      <ActionButton label="Delete" tone="danger" size="compact" onClick={() => setContactToDelete(contact)} />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-[#6f6a75]">{[contact.phone, contact.email].filter(Boolean).join(" - ") || "No contact details yet"}</p>
                  {contact.notes ? <p className="mt-2 text-sm leading-6 text-[#6f6a75]">{contact.notes}</p> : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-[#6f6a75]">No contacts added yet.</p>
          )}
        </section>
      </div>

      <div className="grid gap-6">
        <section className="rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[11px] uppercase tracking-[0.22em] text-[#9793a0]">Opportunities</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#9793a0]">{opportunities.length} total</span>
              <ActionButton
                label={opportunityPanel === "add-opportunity" ? "Close" : "Add opportunity"}
                active={opportunityPanel === "add-opportunity"}
                onClick={() => setOpportunityPanel((current) => (current === "add-opportunity" ? "none" : "add-opportunity"))}
              />
            </div>
          </div>
          <AnimatedPresence open={opportunityPanel === "add-opportunity"} spaced>
            <CrmOpportunityForm accountId={account.id} contacts={contacts} onCancel={() => setOpportunityPanel("none")} />
          </AnimatedPresence>
          {opportunities.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {opportunities.map((opportunity) => (
                <Link
                  key={opportunity.id}
                  href={getAdminRoute(`/crm/opportunities/${opportunity.id}`)}
                  className="rounded-[1.15rem] border border-[#eef0f6] bg-[#fafbfe] p-4 transition hover:-translate-y-0.5 hover:border-[#d0d6e3] hover:bg-white hover:shadow-[0_12px_24px_rgba(35,31,32,0.06)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-[#17141a]">{opportunity.name}</p>
                      <p className="mt-1 text-sm text-[#6f6a75]">{[opportunity.primaryContactName, opportunity.location].filter(Boolean).join(" - ") || "No extra opportunity details yet"}</p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${getOpportunityStageBadge(opportunity.stage)}`}>
                      {formatStageLabel(opportunity.stage)}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#e8ebf3] pt-3">
                    <span className="text-sm font-medium text-[#17141a]">{formatCurrency(opportunity.estimatedValue)}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-[#6f6a75]">No opportunities added for this account yet.</p>
          )}
        </section>

        <section className="self-start rounded-[1.3rem] border border-[#f1d0d0] bg-[#fffafa] p-4 shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#b42318]">Danger Zone</p>
          <p className="mt-2 text-sm leading-5 text-[#6f6a75]">
            Delete this account only if it was created by mistake. This will also remove all related contacts and opportunities.
          </p>
          <div className="mt-3">
            <ActionButton label="Delete account" tone="danger" onClick={() => setAccountDeleteOpen(true)} />
          </div>
        </section>
      </div>

      <Modal
        open={Boolean(contactToDelete)}
        onClose={() => (isDeletingContact ? null : setContactToDelete(null))}
        title="Delete contact?"
        description={contactToDelete ? `This will permanently remove ${contactToDelete.fullName} from this account.` : ""}
      >
        <form action={deleteContactFormAction} className="grid gap-4">
          <input type="hidden" name="contactId" value={contactToDelete?.id ?? ""} />
          <input type="hidden" name="accountId" value={account.id} />
          {contactDeleteState.error ? <p className="text-sm text-[#b42318]">{contactDeleteState.error}</p> : null}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setContactToDelete(null)}
              disabled={isDeletingContact}
              className="inline-flex items-center justify-center rounded-sm border border-[var(--border)] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[#231f20] transition hover:border-[#231f20]/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDeletingContact}
              className="inline-flex items-center justify-center rounded-sm bg-[#b42318] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-white transition hover:bg-[#7a1b14] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeletingContact ? "Deleting..." : "Delete Contact"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={accountDeleteOpen}
        onClose={() => (isDeletingAccount ? null : setAccountDeleteOpen(false))}
        title="Delete account?"
        description={`This will permanently remove ${account.name}, including its contacts and opportunities. This action cannot be undone.`}
      >
        <form action={deleteAccountFormAction} className="grid gap-4">
          <input type="hidden" name="accountId" value={account.id} />
          {accountDeleteState.error ? <p className="text-sm text-[#b42318]">{accountDeleteState.error}</p> : null}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setAccountDeleteOpen(false)}
              disabled={isDeletingAccount}
              className="inline-flex items-center justify-center rounded-sm border border-[var(--border)] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[#231f20] transition hover:border-[#231f20]/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDeletingAccount}
              className="inline-flex items-center justify-center rounded-sm bg-[#b42318] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-white transition hover:bg-[#7a1b14] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeletingAccount ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
