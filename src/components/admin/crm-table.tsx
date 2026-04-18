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

function getQuotationTone(quotationFinished: boolean) {
  return quotationFinished
    ? "border-[#22c55e] bg-[#22c55e] text-white shadow-[0_8px_18px_rgba(34,197,94,0.24)]"
    : "border-[#f59e0b] bg-[#f59e0b] text-white shadow-[0_8px_18px_rgba(245,158,11,0.24)]";
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

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-4.5 w-4.5 fill-none stroke-current transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
  const [activeTab, setActiveTab] = useState<"overview" | "accounts" | "opportunities" | "reports">("overview");
  const [accountsExpanded, setAccountsExpanded] = useState(true);
  const [query, setQuery] = useState("");
  const [accountQuery, setAccountQuery] = useState("");
  const [accountIndustry, setAccountIndustry] = useState("all");
  const [accountActivity, setAccountActivity] = useState("all");
  const [stage, setStage] = useState("all");
  const [accountId, setAccountId] = useState("all");
  const [opportunityToDelete, setOpportunityToDelete] = useState<CrmOpportunity | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<CrmAccount | null>(null);
  const wasDeletingOpportunity = useRef(false);
  const wasDeletingAccount = useRef(false);
  const boardScrollRef = useRef<HTMLDivElement | null>(null);
  const boardMomentumFrameRef = useRef<number | null>(null);
  const boardDragRef = useRef<{
    pointerId: number | null;
    startX: number;
    startScrollLeft: number;
    moved: boolean;
    lastX: number;
    lastTime: number;
    velocity: number;
  }>({
    pointerId: null,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
  });
  const deferredQuery = useDeferredValue(query);
  const deferredAccountQuery = useDeferredValue(accountQuery);
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const normalizedAccountQuery = deferredAccountQuery.trim().toLowerCase();
  const areAccountsVisible = activeTab === "accounts" ? true : accountsExpanded;
  const router = useRouter();

  useEffect(() => {
    if (wasDeletingOpportunity.current && !isDeletingOpportunity && !opportunityDeleteState.error) {
      window.setTimeout(() => setOpportunityToDelete(null), 0);
    }
    wasDeletingOpportunity.current = isDeletingOpportunity;
  }, [isDeletingOpportunity, opportunityDeleteState.error]);

  useEffect(() => {
    if (wasDeletingAccount.current && !isDeletingAccount && !accountDeleteState.error) {
      window.setTimeout(() => setAccountToDelete(null), 0);
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

  const industryOptions = useMemo(
    () =>
      Array.from(new Set(accounts.map((account) => account.industry).filter((value): value is string => Boolean(value))))
        .sort((a, b) => a.localeCompare(b)),
    [accounts],
  );

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const opportunityCount = opportunities.filter((opportunity) => opportunity.accountId === account.id).length;
      const matchesQuery = normalizedAccountQuery
        ? [
            account.name,
            account.industry ?? "",
            account.city ?? "",
            account.address ?? "",
            account.email ?? "",
            account.phone ?? "",
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedAccountQuery)
        : true;
      const matchesIndustry = accountIndustry === "all" || account.industry === accountIndustry;
      const matchesActivity =
        accountActivity === "all" ||
        (accountActivity === "with-opportunities" && opportunityCount > 0) ||
        (accountActivity === "without-opportunities" && opportunityCount === 0);

      return matchesQuery && matchesIndustry && matchesActivity;
    });
  }, [accountActivity, accountIndustry, accounts, normalizedAccountQuery, opportunities]);

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

  const accountListScrollable = accounts.length > 10;
  const opportunityListScrollable = filteredOpportunities.length > 10;
  const totalPipelineValue = useMemo(
    () =>
      opportunities
        .filter((opportunity) => ["new_lead", "opportunity", "bidding", "negotiation", "awarded", "ongoing"].includes(opportunity.stage))
        .reduce((sum, opportunity) => sum + (opportunity.estimatedValue ?? 0), 0),
    [opportunities],
  );
  const wonValue = useMemo(
    () =>
      opportunities
        .filter((opportunity) => opportunity.stage === "completed" || opportunity.stage === "ongoing" || opportunity.stage === "awarded")
        .reduce((sum, opportunity) => sum + (opportunity.estimatedValue ?? 0), 0),
    [opportunities],
  );
  const topAccounts = useMemo(
    () =>
      accounts
        .map((account) => {
          const linked = opportunities.filter((opportunity) => opportunity.accountId === account.id);
          return {
            id: account.id,
            name: account.name,
            opportunityCount: linked.length,
            totalValue: linked.reduce((sum, opportunity) => sum + (opportunity.estimatedValue ?? 0), 0),
            activeCount: linked.filter((opportunity) =>
              ["new_lead", "opportunity", "bidding", "negotiation", "awarded", "ongoing"].includes(opportunity.stage),
            ).length,
          };
        })
        .filter((account) => account.opportunityCount > 0)
        .sort((a, b) => b.totalValue - a.totalValue || b.opportunityCount - a.opportunityCount)
        .slice(0, 6),
    [accounts, opportunities],
  );

  function handleBoardPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;
    if (target?.closest("a, button, input, select, textarea, label")) {
      return;
    }

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    const container = boardScrollRef.current;
    if (!container) {
      return;
    }

    if (boardMomentumFrameRef.current !== null) {
      window.cancelAnimationFrame(boardMomentumFrameRef.current);
      boardMomentumFrameRef.current = null;
    }

    boardDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: container.scrollLeft,
      moved: false,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
    };

    container.setPointerCapture(event.pointerId);
  }

  function handleBoardPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const container = boardScrollRef.current;
    const drag = boardDragRef.current;

    if (!container || drag.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - drag.startX;
    const now = performance.now();
    const deltaSinceLast = event.clientX - drag.lastX;
    const timeSinceLast = Math.max(now - drag.lastTime, 1);
    if (Math.abs(deltaX) > 4) {
      drag.moved = true;
    }

    container.scrollLeft = drag.startScrollLeft - deltaX;
    drag.velocity = deltaSinceLast / timeSinceLast;
    drag.lastX = event.clientX;
    drag.lastTime = now;
  }

  function handleBoardPointerEnd(event: React.PointerEvent<HTMLDivElement>) {
    const container = boardScrollRef.current;
    const drag = boardDragRef.current;

    if (!container || drag.pointerId !== event.pointerId) {
      return;
    }

    if (container.hasPointerCapture(event.pointerId)) {
      container.releasePointerCapture(event.pointerId);
    }

    const initialVelocity = drag.velocity;
    if (Math.abs(initialVelocity) > 0.01) {
      let velocity = initialVelocity * 18;

      const step = () => {
        const currentContainer = boardScrollRef.current;
        if (!currentContainer) {
          boardMomentumFrameRef.current = null;
          return;
        }

        currentContainer.scrollLeft -= velocity;
        velocity *= 0.92;

        if (Math.abs(velocity) < 0.35) {
          boardMomentumFrameRef.current = null;
          return;
        }

        boardMomentumFrameRef.current = window.requestAnimationFrame(step);
      };

      boardMomentumFrameRef.current = window.requestAnimationFrame(step);
    }

    window.setTimeout(() => {
      boardDragRef.current.moved = false;
    }, 0);

    boardDragRef.current.pointerId = null;
  }

  function handleBoardClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (boardDragRef.current.moved) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-[1.5rem] border border-[#e3e7f0] bg-white shadow-[0_12px_26px_rgba(35,31,32,0.04)]">
        <div className="flex flex-wrap gap-3 px-4 py-4 sm:px-5">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`admin-internal-tab inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === "overview"
                ? "admin-internal-tab-active bg-[#17141a] text-white shadow-[0_10px_20px_rgba(23,20,26,0.14)]"
                : "admin-internal-tab-idle border border-[#e4e7ef] bg-white text-[#6f6a75] hover:border-[#d7dce8] hover:text-[#17141a]"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("accounts")}
            className={`admin-internal-tab inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === "accounts"
                ? "admin-internal-tab-active bg-[#17141a] text-white shadow-[0_10px_20px_rgba(23,20,26,0.14)]"
                : "admin-internal-tab-idle border border-[#e4e7ef] bg-white text-[#6f6a75] hover:border-[#d7dce8] hover:text-[#17141a]"
            }`}
          >
            Accounts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("opportunities")}
            className={`admin-internal-tab inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === "opportunities"
                ? "admin-internal-tab-active bg-[#17141a] text-white shadow-[0_10px_20px_rgba(23,20,26,0.14)]"
                : "admin-internal-tab-idle border border-[#e4e7ef] bg-white text-[#6f6a75] hover:border-[#d7dce8] hover:text-[#17141a]"
            }`}
          >
            Opportunities
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reports")}
            className={`admin-internal-tab inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === "reports"
                ? "admin-internal-tab-active bg-[#17141a] text-white shadow-[0_10px_20px_rgba(23,20,26,0.14)]"
                : "admin-internal-tab-idle border border-[#e4e7ef] bg-white text-[#6f6a75] hover:border-[#d7dce8] hover:text-[#17141a]"
            }`}
          >
            Reports
          </button>
        </div>
      </section>

      {activeTab === "reports" ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_14px_30px_rgba(35,31,32,0.04)]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#9793a0]">Total Accounts</p>
              <p className="mt-3 text-[2rem] font-semibold tracking-tight text-[#17141a]">{accounts.length}</p>
              <p className="mt-2 text-sm leading-6 text-[#6f6a75]">All active CRM accounts currently stored.</p>
            </div>
            <div className="rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_14px_30px_rgba(35,31,32,0.04)]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#9793a0]">Opportunities</p>
              <p className="mt-3 text-[2rem] font-semibold tracking-tight text-[#17141a]">{opportunities.length}</p>
              <p className="mt-2 text-sm leading-6 text-[#6f6a75]">All opportunities across the CRM workspace.</p>
            </div>
            <div className="rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_14px_30px_rgba(35,31,32,0.04)]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#9793a0]">Open Pipeline</p>
              <p className="mt-3 text-[2rem] font-semibold tracking-tight text-[#17141a]">{formatCurrency(totalPipelineValue)}</p>
              <p className="mt-2 text-sm leading-6 text-[#6f6a75]">Estimated value across open and active stages.</p>
            </div>
            <div className="rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_14px_30px_rgba(35,31,32,0.04)]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#9793a0]">Awarded / Closed Value</p>
              <p className="mt-3 text-[2rem] font-semibold tracking-tight text-[#17141a]">{formatCurrency(wonValue)}</p>
              <p className="mt-2 text-sm leading-6 text-[#6f6a75]">Estimated value of awarded, ongoing, and completed work.</p>
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="overflow-hidden rounded-[1.5rem] border border-[#e3e7f0] bg-white shadow-[0_12px_26px_rgba(35,31,32,0.04)]">
              <div className="border-b border-[#edf0f6] bg-[#fafbfe] px-5 py-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#9793a0]">Stage Report</p>
              </div>
              <div className="grid gap-3 p-5">
                {stageSummary.map((item) => (
                  <div key={item.stage} className="rounded-[1rem] border border-[#eef0f6] bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${getStageTone(item.stage)}`}>
                        {formatStageLabel(item.stage)}
                      </span>
                      <span className="text-sm font-semibold text-[#17141a]">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] border border-[#e3e7f0] bg-white shadow-[0_12px_26px_rgba(35,31,32,0.04)]">
              <div className="border-b border-[#edf0f6] bg-[#fafbfe] px-5 py-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#9793a0]">Top Accounts</p>
              </div>
              <div className="overflow-x-auto px-5 py-5">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr>
                      {["Account", "Active Deals", "Total Deals", "Estimated Value"].map((label) => (
                        <th key={label} className="border-b border-[#edf0f6] px-3 py-3 text-left text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {topAccounts.map((account) => (
                      <tr key={account.id}>
                        <td className="border-b border-[#f0f2f7] px-3 py-4 text-sm font-medium text-[#17141a]">{account.name}</td>
                        <td className="border-b border-[#f0f2f7] px-3 py-4 text-sm text-[#6f6a75]">{account.activeCount}</td>
                        <td className="border-b border-[#f0f2f7] px-3 py-4 text-sm text-[#6f6a75]">{account.opportunityCount}</td>
                        <td className="border-b border-[#f0f2f7] px-3 py-4 text-sm font-medium text-[#17141a]">{formatCurrency(account.totalValue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {activeTab === "overview" || activeTab === "opportunities" ? (
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
              <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#17141a]">{item.count}</span>
            </span>
          ))}
        </div>
      </section>
      ) : null}

      {activeTab === "overview" || activeTab === "accounts" ? (
      <section className="overflow-hidden rounded-[1.5rem] border border-[#e3e7f0] bg-white shadow-[0_12px_26px_rgba(35,31,32,0.04)]">
        {activeTab === "accounts" ? (
          <div className="grid gap-4 border-b border-[#edf0f6] px-4 py-4 sm:px-5 xl:grid-cols-[1.2fr_0.7fr_0.7fr_auto] xl:items-end">
            <label className="grid gap-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9793a0]">Search</span>
              <div className="flex items-center gap-3 rounded-xl border border-[#e7e9f2] bg-[#f8f9fc] px-4 py-3 text-[#7d7882]">
                <SearchIcon />
                <input
                  value={accountQuery}
                  onChange={(event) => setAccountQuery(event.target.value)}
                  placeholder="Search by account, industry, city, email, or phone"
                  className="w-full bg-transparent text-sm text-[#17141a] outline-none placeholder:text-[#8f8b85]"
                />
              </div>
            </label>

            <label className="grid gap-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9793a0]">Industry</span>
              <Select value={accountIndustry} onChange={(event) => setAccountIndustry(event.target.value)} className="rounded-xl border-[#e7e9f2] bg-[#f8f9fc]">
                <option value="all">All industries</option>
                {industryOptions.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </Select>
            </label>

            <label className="grid gap-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9793a0]">Activity</span>
              <Select value={accountActivity} onChange={(event) => setAccountActivity(event.target.value)} className="rounded-xl border-[#e7e9f2] bg-[#f8f9fc]">
                <option value="all">All accounts</option>
                <option value="with-opportunities">With opportunities</option>
                <option value="without-opportunities">Without opportunities</option>
              </Select>
            </label>

            <div className="flex flex-wrap items-center gap-2 xl:justify-end">
              <span className="inline-flex rounded-full border border-[#e7e9f2] bg-[#fafbfe] px-3 py-2 text-xs font-medium text-[#6f6a75]">
                {filteredAccounts.length} visible
              </span>
              <button
                type="button"
                onClick={() => {
                  setAccountQuery("");
                  setAccountIndustry("all");
                  setAccountActivity("all");
                }}
                className="cursor-pointer rounded-full border border-[#e7e9f2] bg-white px-3 py-2 text-xs font-medium text-[#17141a] transition hover:border-[#cfd5e2] hover:bg-[#fafbfe]"
              >
                Reset
              </button>
            </div>
          </div>
        ) : null}

          {activeTab === "overview" ? (
            <button
              type="button"
              onClick={() => setAccountsExpanded((current) => !current)}
              aria-expanded={accountsExpanded}
              className="flex w-full cursor-pointer items-center justify-between gap-4 border-b border-[#edf0f6] px-4 py-4 text-left transition hover:bg-[#fafbfe] sm:px-5"
            >
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Accounts</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center text-[#7c7784]">
                  <ChevronIcon open={accountsExpanded} />
                </span>
                <Link
                  href={getAdminRoute("/crm/new")}
                  aria-label="New account"
                  title="New account"
                  onClick={(event) => event.stopPropagation()}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e7e9f2] bg-white text-[#17141a] shadow-[0_10px_22px_rgba(35,31,32,0.06)] transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:bg-[var(--brand)] hover:text-white hover:shadow-[0_14px_28px_rgba(237,35,37,0.24)]"
                >
                  <PlusIcon />
                </Link>
              </div>
            </button>
          ) : (
            <div className="flex items-center justify-between gap-4 border-b border-[#edf0f6] px-4 py-4 sm:px-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Accounts</p>
              </div>
              <Link
                href={getAdminRoute("/crm/new")}
                aria-label="New account"
                title="New account"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e7e9f2] bg-white text-[#17141a] shadow-[0_10px_22px_rgba(35,31,32,0.06)] transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:bg-[var(--brand)] hover:text-white hover:shadow-[0_14px_28px_rgba(237,35,37,0.24)]"
              >
                <PlusIcon />
              </Link>
            </div>
          )}

        <div className="crm-collapsible-content" data-open={areAccountsVisible}>
            <div className="crm-collapsible-inner">
            {filteredAccounts.length > 0 ? (
              <>
                <div className="hidden grid-cols-[1.45fr_0.8fr_0.95fr_0.95fr_0.7fr_auto] gap-4 border-b border-[#edf0f6] bg-[#fafbfe] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9793a0] lg:grid">
                  <span>Account</span>
                  <span>Industry</span>
                  <span>Location</span>
                  <span>Contact</span>
                  <span>Projects</span>
                  <span className="text-right">Actions</span>
                </div>
                <div className={accountListScrollable ? "grid max-h-[55rem] gap-0 overflow-y-auto" : "grid gap-0"}>
                  {filteredAccounts.map((account) => {
                    const count = opportunities.filter((opportunity) => opportunity.accountId === account.id).length;
                    const location = [account.city, account.address].filter(Boolean).join(", ");
                    const contactLine = account.phone || account.email || "Not set yet";

                    return (
                      <div
                        key={account.id}
                        role="link"
                        tabIndex={areAccountsVisible ? 0 : -1}
                        onClick={() => router.push(getAdminRoute(`/crm/${account.id}`))}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            router.push(getAdminRoute(`/crm/${account.id}`));
                          }
                        }}
                        className="group grid cursor-pointer gap-4 border-b border-[#edf0f6] px-5 py-4 transition duration-200 hover:bg-[#fcfcfe] hover:shadow-[inset_3px_0_0_var(--brand)] last:border-b-0 lg:grid-cols-[1.45fr_0.8fr_0.95fr_0.95fr_0.7fr_auto] lg:items-start"
                      >
                        <div className="admin-account-summary-card min-w-0 rounded-[1.1rem] border border-[#edf0f6] bg-[linear-gradient(180deg,#ffffff_0%,#fafbfe_100%)] px-4 py-3 transition hover:border-[#d7dce8] hover:shadow-[0_10px_20px_rgba(35,31,32,0.06)] lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:hover:shadow-none">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <span className="admin-account-summary-title block font-medium text-[#17141a] transition group-hover:text-[var(--brand)]">
                                {account.name}
                              </span>
                              <p className="mt-1 text-sm text-[#6f6a75]">{account.email || "No account email added yet."}</p>
                            </div>
                            <span className="admin-account-summary-badge shrink-0 rounded-full border border-[#ebeef5] bg-white px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#6f6a75]">
                              Account
                            </span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="admin-account-summary-meta inline-flex rounded-full bg-[#f4f6fb] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#6f6a75]">
                              Updated {formatDate(account.updatedAt)}
                            </span>
                            {account.phone ? (
                              <span className="admin-account-summary-meta inline-flex rounded-full bg-[#f4f6fb] px-2.5 py-1 text-[10px] font-medium text-[#6f6a75]">
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
              <div className="px-5 py-10 text-sm text-[#6f6a75]">
                {activeTab === "accounts"
                  ? "No accounts match the current search or filters."
                  : "No accounts yet. Create your first account to start tracking contacts and opportunities."}
              </div>
            )}
          </div>
        </div>
      </section>
      ) : null}

      {activeTab === "overview" || activeTab === "opportunities" ? (filteredOpportunities.length > 0 ? (
        layout === "board" ? (
          <div
            ref={boardScrollRef}
            className="crm-board-drag cursor-grab overflow-x-auto pb-2 select-none active:cursor-grabbing"
            onPointerDown={handleBoardPointerDown}
            onPointerMove={handleBoardPointerMove}
            onPointerUp={handleBoardPointerEnd}
            onPointerCancel={handleBoardPointerEnd}
            onLostPointerCapture={handleBoardPointerEnd}
            onClickCapture={handleBoardClickCapture}
          >
            <div className="grid min-w-[3320px] grid-cols-8 gap-5">
              {grouped.map((group) => {
                const stageClasses = getStageTone(group.stage).split(" ");
                const accentClass = stageClasses[1] ?? "bg-[#eefaf2]";

                return (
                  <section key={group.stage} className="admin-board-lane min-w-[390px] overflow-hidden rounded-[1.5rem] border border-[#e3e7f0] bg-white shadow-[0_12px_26px_rgba(35,31,32,0.04)]">
                    <div className={`border-b px-4 py-4 ${getStageTone(group.stage)}`}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold uppercase tracking-[0.14em]">{formatStageLabel(group.stage)}</span>
                        <span className="admin-board-lane-count rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-medium text-current">{group.items.length}</span>
                      </div>
                    </div>
                    <div className="admin-board-lane-body grid gap-3 bg-[#fbfbfd] p-3">
                      {group.items.length > 0 ? (
                        group.items.map((opportunity) => (
                          <article key={opportunity.id} className="admin-board-card rounded-[1.15rem] border border-[#e7e9f2] bg-white p-4 shadow-[0_8px_18px_rgba(35,31,32,0.04)] transition hover:-translate-y-0.5 hover:border-[#d0d6e3] hover:shadow-[0_14px_28px_rgba(35,31,32,0.08)]">
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
                              <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${getQuotationTone(opportunity.quotationFinished)}`}>
                                {opportunity.quotationFinished ? "SENT" : "PENDING"}
                              </span>
                              <span className="text-xs text-[#9793a0]">{formatDate(opportunity.updatedAt)}</span>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                              <Link
                                href={getAdminRoute(`/crm/opportunities/${opportunity.id}`)}
                                className="admin-board-card-action-primary inline-flex flex-1 items-center justify-center rounded-xl border border-[#e7e9f2] bg-[#f8f9fc] px-3 py-2 text-xs font-medium text-[#17141a] transition hover:border-[#d9dce8] hover:bg-white hover:text-[var(--brand)]"
                              >
                                Open
                              </Link>
                              <Link
                                href={getAdminRoute(`/crm/${opportunity.accountId}`)}
                                className="admin-board-card-action-secondary inline-flex items-center justify-center rounded-xl border border-[#e7e9f2] bg-white px-3 py-2 text-xs font-medium text-[#6f6a75] transition hover:border-[#d9dce8] hover:text-[var(--brand)]"
                              >
                                Account
                              </Link>
                            </div>
                          </article>
                        ))
                      ) : (
                        <div className="admin-board-empty rounded-[1.1rem] border border-dashed border-[#d8dde8] bg-white px-4 py-8 text-center text-sm text-[#9793a0]">
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
            <div className="hidden grid-cols-[1.2fr_1fr_0.9fr_0.95fr_0.9fr_0.9fr_auto] gap-4 border-b border-[#edf0f6] bg-[#fafbfe] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9793a0] lg:grid">
              <span>Opportunity</span>
              <span>Account</span>
              <span>Stage</span>
              <span>Quotation</span>
              <span>Primary Contact</span>
              <span>Value</span>
              <span className="text-right">Actions</span>
            </div>
            <div className={opportunityListScrollable ? "grid max-h-[55rem] gap-0 overflow-y-auto" : "grid gap-0"}>
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
                  className="group grid cursor-pointer gap-4 border-b border-[#edf0f6] px-5 py-4 transition duration-200 hover:bg-[#fcfcfe] hover:shadow-[inset_3px_0_0_var(--brand)] last:border-b-0 lg:grid-cols-[1.2fr_1fr_0.9fr_0.95fr_0.9fr_0.9fr_auto] lg:items-start"
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
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#9793a0] lg:hidden">Quotation</p>
                    <div className="mt-1 lg:mt-0">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${getQuotationTone(opportunity.quotationFinished)}`}>
                        {opportunity.quotationFinished ? "SENT" : "PENDING"}
                      </span>
                    </div>
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
      )) : null}

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
