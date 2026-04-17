"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { deleteCrmAccountAction, deleteCrmOpportunityAction, type CrmDeleteState } from "@/app/(admin)/admin/crm/actions";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { getAdminRoute } from "@/lib/admin-path";
import type { CrmAccount, CrmOpportunity } from "@/types/crm";
import { crmOpportunityStages } from "@/types/crm";

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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getStageTone(stage: string) {
  switch (stage) {
    case "completed":
      return "border-[#cfead7] bg-[#eefaf2] text-[#1f7a3d]";
    case "ongoing":
      return "border-[#d9e6ff] bg-[#eef4ff] text-[#2859b8]";
    case "bidding":
      return "border-[#ece1ff] bg-[#f6f1ff] text-[#734ab5]";
    case "negotiation":
      return "border-[#f1dfc2] bg-[#fff7ea] text-[#9a5b12]";
    case "awarded":
      return "border-[#d6ebe5] bg-[#effaf7] text-[#1e7b63]";
    case "lost":
      return "border-[#f0d0d0] bg-[#fff1f1] text-[#aa3737]";
    case "opportunity":
      return "border-[#dce7ff] bg-[#f2f6ff] text-[#3e64b4]";
    default:
      return "border-[#d8eadb] bg-[#eefaf2] text-[#2d7f54]";
  }
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4.5 w-4.5 fill-none stroke-current">
      <circle cx="11" cy="11" r="6.25" strokeWidth="1.8" />
      <path d="m16 16 4 4" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4.5 w-4.5 fill-none stroke-current">
      <path d="M12 5v14" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 12h14" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CrmTable({
  accounts,
  opportunities,
}: {
  accounts: CrmAccount[];
  opportunities: CrmOpportunity[];
}) {
  const [opportunityDeleteState, deleteOpportunityAction, isDeletingOpportunity] = useActionState(deleteCrmOpportunityAction, {
    error: null,
  } satisfies CrmDeleteState);
  const [accountDeleteState, deleteAccountAction, isDeletingAccount] = useActionState(deleteCrmAccountAction, {
    error: null,
  } satisfies CrmDeleteState);
  const [layout, setLayout] = useState<"list" | "board">("list");
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("all");
  const [accountId, setAccountId] = useState("all");
  const [opportunityToDelete, setOpportunityToDelete] = useState<CrmOpportunity | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<CrmAccount | null>(null);
  const wasDeletingOpportunity = useRef(false);
  const wasDeletingAccount = useRef(false);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const router = useRouter();

  useEffect(() => {
    if (wasDeletingOpportunity.current && !isDeletingOpportunity && !opportunityDeleteState.error) {
      setOpportunityToDelete(null);
    }
    wasDeletingOpportunity.current = isDeletingOpportunity;
  }, [isDeletingOpportunity, opportunityDeleteState.error]);

  useEffect(() => {
    if (wasDeletingAccount.current && !isDeletingAccount && !accountDeleteState.error) {
      setAccountToDelete(null);
    }
    wasDeletingAccount.current = isDeletingAccount;
  }, [accountDeleteState.error, isDeletingAccount]);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opportunity) => {
      const matchesQuery = normalizedQuery
        ? [
            opportunity.name,
            opportunity.accountName,
            opportunity.primaryContactName ?? "",
            opportunity.location ?? "",
            opportunity.source,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        : true;

      const matchesStage = stage === "all" || opportunity.stage === stage;
      const matchesAccount = accountId === "all" || opportunity.accountId === accountId;
      return matchesQuery && matchesStage && matchesAccount;
    });
  }, [accountId, normalizedQuery, opportunities, stage]);

  const grouped = useMemo(() => {
    return crmOpportunityStages.map((groupStage) => ({
      stage: groupStage,
      items: filteredOpportunities.filter((opportunity) => opportunity.stage === groupStage),
    }));
  }, [filteredOpportunities]);

  const stageSummary = useMemo(
    () =>
      crmOpportunityStages.map((groupStage) => ({
        stage: groupStage,
        count: opportunities.filter((opportunity) => opportunity.stage === groupStage).length,
      })),
    [opportunities],
  );

  return (
    <div className="grid gap-5">
      <section className="rounded-[1.5rem] border border-[#e3e7f0] bg-white shadow-[0_12px_26px_rgba(35,31,32,0.04)]">
        <div className="grid gap-4 border-b border-[#edf0f6] px-4 py-4 sm:px-5 xl:grid-cols-[1.2fr_0.7fr_0.7fr_auto] xl:items-end">
          <label className="grid gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9793a0]">Search</span>
            <div className="flex items-center gap-3 rounded-xl border border-[#e7e9f2] bg-[#f8f9fc] px-4 py-3 text-[#7d7882]">
              <SearchIcon />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by opportunity, account, contact, location, or source"
                className="w-full bg-transparent text-sm text-[#17141a] outline-none placeholder:text-[#8f8b85]"
              />
            </div>
          </label>

          <label className="grid gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9793a0]">Stage</span>
            <Select value={stage} onChange={(event) => setStage(event.target.value)} className="rounded-xl border-[#e7e9f2] bg-[#f8f9fc]">
              <option value="all">All stages</option>
              {crmOpportunityStages.map((item) => (
                <option key={item} value={item}>
                  {formatStageLabel(item)}
                </option>
              ))}
            </Select>
          </label>

          <label className="grid gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9793a0]">Account</span>
            <Select value={accountId} onChange={(event) => setAccountId(event.target.value)} className="rounded-xl border-[#e7e9f2] bg-[#f8f9fc]">
              <option value="all">All accounts</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </Select>
          </label>

          <div className="flex flex-wrap items-center gap-2 xl:justify-end">
            <div className="inline-flex rounded-full border border-[#e7e9f2] bg-[#fafbfe] p-1">
              <button
                type="button"
                onClick={() => setLayout("list")}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition ${layout === "list" ? "bg-[#17141a] text-white" : "text-[#6f6a75] hover:text-[#17141a]"}`}
              >
                List
              </button>
              <button
                type="button"
                onClick={() => setLayout("board")}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition ${layout === "board" ? "bg-[#17141a] text-white" : "text-[#6f6a75] hover:text-[#17141a]"}`}
              >
                Board
              </button>
            </div>
            <span className="inline-flex rounded-full border border-[#e7e9f2] bg-[#fafbfe] px-3 py-2 text-xs font-medium text-[#6f6a75]">
              {filteredOpportunities.length} visible
            </span>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setStage("all");
                setAccountId("all");
                setLayout("list");
              }}
              className="cursor-pointer rounded-full border border-[#e7e9f2] bg-white px-3 py-2 text-xs font-medium text-[#17141a] transition hover:border-[#cfd5e2] hover:bg-[#fafbfe]"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 px-4 py-3 sm:px-5">
          {stageSummary.map((item) => (
            <span
              key={item.stage}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${getStageTone(item.stage)}`}
            >
              {formatStageLabel(item.stage)}
              <span className="rounded-full bg-white/80 px-1.5 py-0.5 text-[10px] text-current">{item.count}</span>
            </span>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.5rem] border border-[#e3e7f0] bg-white shadow-[0_12px_26px_rgba(35,31,32,0.04)]">
        <div className="flex items-center justify-between gap-4 border-b border-[#edf0f6] px-4 py-4 sm:px-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Accounts</p>
          </div>
          <Link
            href={getAdminRoute("/crm/new")}
            aria-label="New account"
            title="New account"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-[0_10px_22px_rgba(237,35,37,0.2)] transition hover:-translate-y-0.5 hover:bg-[var(--brand-dark)] hover:shadow-[0_14px_28px_rgba(237,35,37,0.24)]"
          >
            <PlusIcon />
          </Link>
        </div>

        {accounts.length > 0 ? (
          <>
            <div className="hidden grid-cols-[1.45fr_0.8fr_0.95fr_0.95fr_0.7fr_auto] gap-4 border-b border-[#edf0f6] bg-[#fafbfe] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9793a0] lg:grid">
              <span>Account</span>
              <span>Industry</span>
              <span>Location</span>
              <span>Contact</span>
              <span>Projects</span>
              <span className="text-right">Actions</span>
            </div>
            <div className="grid gap-0">
              {accounts.map((account) => {
                const count = opportunities.filter((opportunity) => opportunity.accountId === account.id).length;
                const location = [account.city, account.address].filter(Boolean).join(", ");
                const contactLine = account.phone || account.email || "Not set yet";

                return (
                  <div
                    key={account.id}
                    role="link"
                    tabIndex={0}
                    onClick={() => router.push(getAdminRoute(`/crm/${account.id}`))}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(getAdminRoute(`/crm/${account.id}`));
                      }
                    }}
                    className="group grid cursor-pointer gap-4 border-b border-[#edf0f6] px-5 py-4 transition duration-200 hover:bg-[#fcfcfe] hover:shadow-[inset_3px_0_0_var(--brand)] last:border-b-0 lg:grid-cols-[1.45fr_0.8fr_0.95fr_0.95fr_0.7fr_auto] lg:items-start"
                  >
                    <div className="min-w-0 rounded-[1.1rem] border border-[#edf0f6] bg-[linear-gradient(180deg,#ffffff_0%,#fafbfe_100%)] px-4 py-3 transition hover:border-[#d7dce8] hover:shadow-[0_10px_20px_rgba(35,31,32,0.06)] lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:hover:shadow-none">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="block font-medium text-[#17141a] transition group-hover:text-[var(--brand)]">
                            {account.name}
                          </span>
                          <p className="mt-1 text-sm text-[#6f6a75]">{account.email || "No account email added yet."}</p>
                        </div>
                        <span className="shrink-0 rounded-full border border-[#ebeef5] bg-white px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#6f6a75]">
                          Account
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex rounded-full bg-[#f4f6fb] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#6f6a75]">
                          Updated {formatDate(account.updatedAt)}
                        </span>
                        {account.phone ? (
                          <span className="inline-flex rounded-full bg-[#f4f6fb] px-2.5 py-1 text-[10px] font-medium text-[#6f6a75]">
                            {account.phone}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="rounded-[1rem] bg-[#fafbfe] px-3 py-3 text-sm text-[#3e3944] lg:rounded-none lg:bg-transparent lg:px-0 lg:py-0">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-[#9793a0] lg:hidden">Industry</p>
                      <p className="mt-1 lg:mt-0">{account.industry || "Not set yet"}</p>
                    </div>
                    <div className="rounded-[1rem] bg-[#fafbfe] px-3 py-3 text-sm text-[#3e3944] lg:rounded-none lg:bg-transparent lg:px-0 lg:py-0">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-[#9793a0] lg:hidden">Location</p>
                      <p className="mt-1 lg:mt-0">{location || "Not set yet"}</p>
                    </div>
                    <div className="rounded-[1rem] bg-[#fafbfe] px-3 py-3 text-sm text-[#3e3944] lg:rounded-none lg:bg-transparent lg:px-0 lg:py-0">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-[#9793a0] lg:hidden">Contact</p>
                      <p className="mt-1 lg:mt-0">{contactLine}</p>
                    </div>
                    <div>
                      <span className="inline-flex rounded-full border border-[#dbe2ef] bg-white px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#465064] shadow-[0_4px_10px_rgba(35,31,32,0.04)]">
                        {count} opportunit{count === 1 ? "y" : "ies"}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setAccountToDelete(account);
                        }}
                        className="cursor-pointer text-xs font-medium uppercase tracking-[0.16em] text-[#b42318] transition hover:text-[#7a1b14]"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="grid gap-3 lg:hidden">
                      <div className="grid gap-1 rounded-xl border border-[#edf0f6] bg-[#fafbfe] px-4 py-3">
                        <span className="text-[10px] uppercase tracking-[0.14em] text-[#9793a0]">Industry</span>
                        <span className="text-sm text-[#3e3944]">{account.industry || "Not set yet"}</span>
                      </div>
                      <div className="grid gap-1 rounded-xl border border-[#edf0f6] bg-[#fafbfe] px-4 py-3">
                        <span className="text-[10px] uppercase tracking-[0.14em] text-[#9793a0]">Location</span>
                        <span className="text-sm text-[#3e3944]">{location || "Not set yet"}</span>
                      </div>
                      <div className="grid gap-1 rounded-xl border border-[#edf0f6] bg-[#fafbfe] px-4 py-3">
                        <span className="text-[10px] uppercase tracking-[0.14em] text-[#9793a0]">Contact</span>
                        <span className="text-sm text-[#3e3944]">{contactLine}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="px-5 py-10 text-sm text-[#6f6a75]">No accounts yet. Create your first account to start tracking contacts and opportunities.</div>
        )}
      </section>

      {filteredOpportunities.length > 0 ? (
        layout === "board" ? (
          <div className="overflow-x-auto pb-2">
            <div className="grid min-w-[1840px] grid-cols-8 gap-5">
              {grouped.map((group) => {
                const stageClasses = getStageTone(group.stage).split(" ");
                const accentClass = stageClasses[1] ?? "bg-[#eefaf2]";

                return (
                  <section key={group.stage} className="min-w-[220px] overflow-hidden rounded-[1.5rem] border border-[#e3e7f0] bg-white shadow-[0_12px_26px_rgba(35,31,32,0.04)]">
                    <div className={`border-b px-4 py-4 ${getStageTone(group.stage)}`}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold uppercase tracking-[0.14em]">{formatStageLabel(group.stage)}</span>
                        <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-medium text-current">{group.items.length}</span>
                      </div>
                    </div>
                    <div className="grid gap-3 bg-[#fbfbfd] p-3">
                      {group.items.length > 0 ? (
                        group.items.map((opportunity) => (
                          <article key={opportunity.id} className="rounded-[1.15rem] border border-[#e7e9f2] bg-white p-4 shadow-[0_8px_18px_rgba(35,31,32,0.04)] transition hover:-translate-y-0.5 hover:border-[#d0d6e3] hover:shadow-[0_14px_28px_rgba(35,31,32,0.08)]">
                            <div className={`mb-3 h-1.5 rounded-full ${accentClass}`} />
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <Link href={getAdminRoute(`/crm/opportunities/${opportunity.id}`)} className="line-clamp-2 text-[15px] font-medium leading-6 text-[#17141a] transition hover:text-[var(--brand)]">
                                  {opportunity.name}
                                </Link>
                                <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#6f6a75]">{opportunity.accountName}</p>
                              </div>
                              <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${getStageTone(opportunity.stage)}`}>
                                {formatStageLabel(opportunity.stage)}
                              </span>
                            </div>
                            <div className="mt-4 grid gap-2 text-sm text-[#6f6a75]">
                              <div className="rounded-xl bg-[#fafbfe] px-3 py-2">
                                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#9793a0]">Primary Contact</p>
                                <p className="mt-1 line-clamp-2">{opportunity.primaryContactName || "No primary contact set"}</p>
                              </div>
                              <div className="rounded-xl bg-[#fafbfe] px-3 py-2">
                                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#9793a0]">Location</p>
                                <p className="mt-1 line-clamp-2">{opportunity.location || "No location set"}</p>
                              </div>
                              <p className="font-medium text-[#17141a]">{formatCurrency(opportunity.estimatedValue)}</p>
                            </div>
                            <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#edf0f6] pt-3">
                              <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${opportunity.quotationFinished ? "border-[#cfead7] bg-[#eefaf2] text-[#1f7a3d]" : "border-[#e6decd] bg-[#faf5ea] text-[#876536]"}`}>
                                {opportunity.quotationFinished ? "Quote finished" : "Quote pending"}
                              </span>
                              <span className="text-xs text-[#9793a0]">{formatDate(opportunity.updatedAt)}</span>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                              <Link
                                href={getAdminRoute(`/crm/opportunities/${opportunity.id}`)}
                                className="inline-flex flex-1 items-center justify-center rounded-xl border border-[#e7e9f2] bg-[#f8f9fc] px-3 py-2 text-xs font-medium text-[#17141a] transition hover:border-[#d9dce8] hover:bg-white hover:text-[var(--brand)]"
                              >
                                Open
                              </Link>
                              <Link
                                href={getAdminRoute(`/crm/${opportunity.accountId}`)}
                                className="inline-flex items-center justify-center rounded-xl border border-[#e7e9f2] bg-white px-3 py-2 text-xs font-medium text-[#6f6a75] transition hover:border-[#d9dce8] hover:text-[var(--brand)]"
                              >
                                Account
                              </Link>
                            </div>
                          </article>
                        ))
                      ) : (
                        <div className="rounded-[1.1rem] border border-dashed border-[#d8dde8] bg-white px-4 py-8 text-center text-sm text-[#9793a0]">
                          No opportunities here.
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[1.5rem] border border-[#e3e7f0] bg-white shadow-[0_12px_26px_rgba(35,31,32,0.04)]">
            <div className="hidden grid-cols-[1.2fr_1fr_0.9fr_0.9fr_0.9fr_auto] gap-4 border-b border-[#edf0f6] bg-[#fafbfe] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9793a0] lg:grid">
              <span>Opportunity</span>
              <span>Account</span>
              <span>Stage</span>
              <span>Primary Contact</span>
              <span>Value</span>
              <span className="text-right">Actions</span>
            </div>
            <div className="grid gap-0">
              {filteredOpportunities.map((opportunity) => (
                <div
                  key={opportunity.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => router.push(getAdminRoute(`/crm/opportunities/${opportunity.id}`))}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      router.push(getAdminRoute(`/crm/opportunities/${opportunity.id}`));
                    }
                  }}
                  className="group grid cursor-pointer gap-4 border-b border-[#edf0f6] px-5 py-4 transition duration-200 hover:bg-[#fcfcfe] hover:shadow-[inset_3px_0_0_var(--brand)] last:border-b-0 lg:grid-cols-[1.2fr_1fr_0.9fr_0.9fr_0.9fr_auto] lg:items-start"
                >
                  <div className="min-w-0">
                    <span className="font-medium text-[#17141a] transition group-hover:text-[var(--brand)]">
                      {opportunity.name}
                    </span>
                    <p className="mt-1 text-sm text-[#6f6a75]">{opportunity.location || "No location"}</p>
                  </div>
                  <span className="text-sm text-[#6f6a75]">
                    {opportunity.accountName}
                  </span>
                  <div className="lg:flex lg:min-h-[2.5rem] lg:items-center">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${getStageTone(opportunity.stage)}`}>
                      {formatStageLabel(opportunity.stage)}
                    </span>
                  </div>
                  <div className="rounded-[0.95rem] bg-[#fafbfe] px-3 py-2.5 text-sm text-[#3e3944] lg:flex lg:min-h-[2.5rem] lg:items-center lg:bg-transparent lg:px-0 lg:py-0">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#9793a0] lg:hidden">Primary Contact</p>
                    <p className="mt-1 lg:mt-0">{opportunity.primaryContactName || "-"}</p>
                  </div>
                  <div className="rounded-[0.95rem] bg-[#fafbfe] px-3 py-2.5 text-sm font-medium text-[#17141a] lg:flex lg:min-h-[2.5rem] lg:items-center lg:bg-transparent lg:px-0 lg:py-0">
                    <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#9793a0] lg:hidden">Value</p>
                    <p className="mt-1 lg:mt-0">{formatCurrency(opportunity.estimatedValue)}</p>
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpportunityToDelete(opportunity);
                      }}
                      className="cursor-pointer text-xs font-medium uppercase tracking-[0.16em] text-[#b42318] transition hover:text-[#7a1b14]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        <div className="rounded-[1.5rem] border border-[#e7e9f2] bg-white px-5 py-10 text-sm text-[#6f6a75] shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
          No opportunities match the current search or filters.
        </div>
      )}

      <Modal
        open={Boolean(opportunityToDelete)}
        onClose={() => (isDeletingOpportunity ? null : setOpportunityToDelete(null))}
        title="Delete opportunity?"
        description={opportunityToDelete ? `This will permanently remove ${opportunityToDelete.name}. This action cannot be undone.` : ""}
      >
        <form action={deleteOpportunityAction} className="grid gap-4">
          <input type="hidden" name="opportunityId" value={opportunityToDelete?.id ?? ""} />
          {opportunityDeleteState.error ? <p className="text-sm text-[#b42318]">{opportunityDeleteState.error}</p> : null}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpportunityToDelete(null)}
              disabled={isDeletingOpportunity}
              className="inline-flex items-center justify-center rounded-sm border border-[var(--border)] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[#231f20] transition hover:border-[#231f20]/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDeletingOpportunity}
              className="inline-flex items-center justify-center rounded-sm bg-[#b42318] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-white transition hover:bg-[#7a1b14] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeletingOpportunity ? "Deleting..." : "Delete Opportunity"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(accountToDelete)}
        onClose={() => (isDeletingAccount ? null : setAccountToDelete(null))}
        title="Delete account?"
        description={
          accountToDelete
            ? `This will permanently remove ${accountToDelete.name}, including its contacts and opportunities. This action cannot be undone.`
            : ""
        }
      >
        <form action={deleteAccountAction} className="grid gap-4">
          <input type="hidden" name="accountId" value={accountToDelete?.id ?? ""} />
          {accountDeleteState.error ? <p className="text-sm text-[#b42318]">{accountDeleteState.error}</p> : null}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setAccountToDelete(null)}
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
