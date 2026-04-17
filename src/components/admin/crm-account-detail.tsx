"use client";

import Link from "next/link";
import { useState } from "react";
import { CrmAccountForm, CrmContactForm, CrmOpportunityForm } from "@/components/admin/crm-forms";
import { getAdminRoute } from "@/lib/admin-path";
import type { CrmAccount, CrmContact, CrmOpportunity } from "@/types/crm";

function formatCurrency(value: number | null) {
  if (value === null) return "-";
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(value);
}

function formatStageLabel(value: string) {
  return value.replaceAll("_", " ");
}

function ActionButton({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
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

export function CrmAccountDetail({
  account,
  contacts,
  opportunities,
}: {
  account: CrmAccount;
  contacts: CrmContact[];
  opportunities: CrmOpportunity[];
}) {
  const [panel, setPanel] = useState<"none" | "edit-account" | "add-contact" | "add-opportunity">("none");

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="grid gap-6">
        <section className="rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
          <div className="flex flex-col gap-4 border-b border-[#eef0f6] pb-5">
            <div className="flex flex-wrap items-center gap-3">
              <ActionButton label="Edit account" active={panel === "edit-account"} onClick={() => setPanel((current) => (current === "edit-account" ? "none" : "edit-account"))} />
              <ActionButton label="Add contact" active={panel === "add-contact"} onClick={() => setPanel((current) => (current === "add-contact" ? "none" : "add-contact"))} />
              <ActionButton label="Add opportunity" active={panel === "add-opportunity"} onClick={() => setPanel((current) => (current === "add-opportunity" ? "none" : "add-opportunity"))} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.2rem] border border-[#eef0f6] bg-[#fafbfe] p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#9793a0]">Primary Info</p>
                <div className="mt-3 grid gap-2 text-sm text-[#6f6a75]">
                  <p><span className="font-medium text-[#17141a]">Industry:</span> {account.industry || "-"}</p>
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

          {panel === "edit-account" ? <div className="mt-5"><CrmAccountForm mode="edit" initialAccount={account} /></div> : null}
          {panel === "add-contact" ? <div className="mt-5"><CrmContactForm accountId={account.id} /></div> : null}
          {panel === "add-opportunity" ? <div className="mt-5"><CrmOpportunityForm accountId={account.id} contacts={contacts} /></div> : null}
        </section>

        <section className="rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[11px] uppercase tracking-[0.22em] text-[#9793a0]">Contacts</h2>
            <span className="text-xs text-[#9793a0]">{contacts.length} total</span>
          </div>
          {contacts.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {contacts.map((contact) => (
                <div key={contact.id} className="rounded-[1.1rem] border border-[#eef0f6] bg-[#fafbfe] p-4 transition hover:border-[#d5dae7] hover:bg-white hover:shadow-[0_10px_20px_rgba(35,31,32,0.06)]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-[#17141a]">{contact.fullName}</span>
                    {contact.jobTitle ? (
                      <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#6f6a75]">
                        {contact.jobTitle}
                      </span>
                    ) : null}
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
            <span className="text-xs text-[#9793a0]">{opportunities.length} total</span>
          </div>
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
                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#56515d]">
                      {formatStageLabel(opportunity.stage)}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#e8ebf3] pt-3">
                    <span className="text-sm font-medium text-[#17141a]">{formatCurrency(opportunity.estimatedValue)}</span>
                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--brand)]">Open opportunity</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-[#6f6a75]">No opportunities added for this account yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
