"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createAccountingPeriodAction,
  deleteAccountingPeriodAction,
  type AccountingDeleteState,
  type AccountingFormState,
  updateAccountingPeriodAction,
} from "@/app/(admin)/admin/accounting/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatAccountingCurrency, getAccountingJournalLines, getAccountingSummary, getAccountingPeriodTotals } from "@/lib/accounting";
import { getAdminRoute } from "@/lib/admin-path";
import type { AccountingPeriod } from "@/types/accounting";

const initialFormState: AccountingFormState = {
  error: null,
  entityId: null,
};

const initialDeleteState: AccountingDeleteState = {
  error: null,
  deletedId: null,
};

const inflowFields: Array<{ name: keyof AccountingPeriod; label: string }> = [
  { name: "salesCollected", label: "Sales collected" },
  { name: "receivablesCollected", label: "Receivables collected" },
  { name: "otherIncome", label: "Other income" },
];

const outflowFields: Array<{ name: keyof AccountingPeriod; label: string }> = [
  { name: "inventoryPurchases", label: "Inventory / cost of goods" },
  { name: "payroll", label: "Payroll" },
  { name: "rentUtilities", label: "Rent & utilities" },
  { name: "operatingExpenses", label: "Operating expenses" },
  { name: "marketing", label: "Marketing" },
  { name: "taxes", label: "Taxes" },
  { name: "loanPayments", label: "Loan payments" },
  { name: "ownerDraws", label: "Owner draws" },
  { name: "capitalExpenses", label: "Capital expenses" },
];

function formatCompactCurrency(value: number) {
  const absoluteValue = Math.abs(value);

  if (absoluteValue >= 1000000) {
    return `${value < 0 ? "-" : ""}${new Intl.NumberFormat("en-PH", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(absoluteValue / 1000000)}M`;
  }

  if (absoluteValue >= 1000) {
    return `${value < 0 ? "-" : ""}${new Intl.NumberFormat("en-PH", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(absoluteValue / 1000)}K`;
  }

  return formatAccountingCurrency(value);
}

function MetricCard({
  label,
  value,
  note,
  tone = "default",
}: {
  label: string;
  value: string;
  note: string;
  tone?: "default" | "positive" | "negative";
}) {
  const toneClassName =
    tone === "positive"
      ? "admin-accounting-metric admin-accounting-metric-positive border-[#d8efe0] bg-[#f4fbf6]"
      : tone === "negative"
        ? "admin-accounting-metric admin-accounting-metric-negative border-[#f5d8dc] bg-[#fff7f8]"
        : "admin-accounting-metric admin-accounting-metric-neutral border-[#e7e9f2] bg-white";

  return (
    <div className={`rounded-[1.4rem] border p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)] ${toneClassName}`}>
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#9793a0]">{label}</p>
      <p className="mt-3 text-[1.9rem] font-semibold tracking-tight text-[#17141a]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#6f6a75]">{note}</p>
    </div>
  );
}

function StatusPill({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  const toneClassName =
    tone === "positive"
      ? "border-[#d8efe0] bg-[#f4fbf6] text-[#0f8a43]"
      : tone === "negative"
        ? "border-[#f4d5d8] bg-[#fff7f8] text-[#d1394d]"
        : "border-[#e4e7ef] bg-white text-[#5f5a66]";

  return (
    <div className={`rounded-full border px-3 py-2 text-xs font-medium ${toneClassName}`}>
      <span className="mr-1 text-[#8d8896]">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[#6f6a75]">{subtitle}</p>
    </div>
  );
}

function MobileLedgerCard({
  items,
}: {
  items: Array<{ label: string; value: string; valueClassName?: string }>;
}) {
  return (
    <div className="grid gap-2 rounded-[1.2rem] border border-[#eef0f6] bg-white p-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-start justify-between gap-4 text-sm">
          <span className="text-[#6f6a75]">{item.label}</span>
          <span className={`text-right font-medium text-[#17141a] ${item.valueClassName ?? ""}`}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function AmountField({
  name,
  label,
  defaultValue,
  accent = "neutral",
}: {
  name: string;
  label: string;
  defaultValue: number;
  accent?: "neutral" | "positive" | "negative";
}) {
  const accentClassName =
    accent === "positive"
      ? "admin-accounting-amount admin-accounting-amount-positive border-[#d8efe0] bg-[#fbfefb]"
      : accent === "negative"
        ? "admin-accounting-amount admin-accounting-amount-negative border-[#f2e1e3] bg-[#fffdfd]"
        : "admin-accounting-amount admin-accounting-amount-neutral border-[#e1e5ee]";

  return (
    <label className="grid gap-2">
      <span className="text-sm text-[#6f6a75]">{label}</span>
      <div className="relative">
        <span className="admin-accounting-prefix pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#8d8896]">PHP</span>
        <Input
          type="number"
          name={name}
          inputMode="decimal"
          step="0.01"
          min="0"
          defaultValue={defaultValue.toFixed(2)}
          className={`rounded-xl pl-14 ${accentClassName}`}
        />
      </div>
    </label>
  );
}

function AccountingPeriodEditor({ period }: { period: AccountingPeriod }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updateAccountingPeriodAction, initialFormState);
  const [deleteState, deleteFormAction, isDeleting] = useActionState(deleteAccountingPeriodAction, initialDeleteState);
  const [isExpanded, setIsExpanded] = useState(false);
  const totals = getAccountingPeriodTotals(period);
  const periodDateRange =
    period.periodStart && period.periodEnd
      ? `${period.periodStart} to ${period.periodEnd}`
      : period.periodStart
        ? `Starts ${period.periodStart}`
        : period.periodEnd
          ? `Ends ${period.periodEnd}`
          : "No date range set";

  useEffect(() => {
    if (state.entityId || deleteState.deletedId) {
      router.refresh();
    }
  }, [deleteState.deletedId, router, state.entityId]);

  return (
    <article className="overflow-hidden rounded-[1.6rem] border border-[#e3e7f0] bg-white shadow-[0_14px_30px_rgba(35,31,32,0.04)]">
      <form action={formAction}>
        <div className="border-b border-[#edf0f6] bg-[#fafbfe] px-5 py-4 sm:px-6">
          <input type="hidden" name="periodId" value={period.id} />
          <input type="hidden" name="label" value={period.label} />
          <input type="hidden" name="periodStart" value={period.periodStart ?? ""} />
          <input type="hidden" name="periodEnd" value={period.periodEnd ?? ""} />
          <input type="hidden" name="openingBalance" value={period.openingBalance.toFixed(2)} />
          <input type="hidden" name="notes" value={period.notes ?? ""} />
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#9793a0]">Saved Period</p>
                <StatusPill
                  label="Net flow"
                  value={formatAccountingCurrency(totals.netCashFlow)}
                  tone={totals.netCashFlow >= 0 ? "positive" : "negative"}
                />
                <StatusPill label="Closing" value={formatAccountingCurrency(period.openingBalance + totals.netCashFlow)} tone="neutral" />
              </div>
              <h3 className="mt-3 text-[1.2rem] font-semibold tracking-tight text-[#17141a]">{period.label}</h3>
              <p className="mt-2 text-sm text-[#6f6a75]">{periodDateRange}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <StatusPill label="Cash in" value={formatCompactCurrency(totals.cashIn)} tone="positive" />
                <StatusPill label="Cash out" value={formatCompactCurrency(totals.cashOut)} tone="negative" />
                <StatusPill label="Opening" value={formatCompactCurrency(period.openingBalance)} tone="neutral" />
                <StatusPill label="Margin" value={formatCompactCurrency(totals.grossMargin)} tone={totals.grossMargin >= 0 ? "positive" : "negative"} />
              </div>
              {period.notes ? <p className="mt-4 max-w-3xl text-sm leading-6 text-[#6f6a75]">{period.notes}</p> : null}
            </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        <Button
          type="button"
          variant="secondary"
          className="w-full rounded-xl px-4 py-2.5 normal-case tracking-normal sm:w-auto"
          onClick={() => setIsExpanded((current) => !current)}
        >
          {isExpanded ? "Hide details" : "Edit details"}
              </Button>
            </div>
          </div>
        </div>

        {isExpanded ? (
          <div className="grid gap-6 px-4 py-4 sm:px-6 sm:py-5 xl:grid-cols-[1.2fr_0.8fr_320px]">
            <div className="grid gap-6">
              <div className="grid gap-4 rounded-[1.3rem] border border-[#eef0f6] bg-[#fcfcfe] p-4">
                <SectionHeader title="Period Setup" subtitle="Label, date range, and opening balance." />
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <label className="grid gap-2">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Period label</span>
                    <Input name="label" defaultValue={period.label} className="rounded-xl border-[#e1e5ee] bg-white" required />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Start date</span>
                    <Input type="date" name="periodStart" defaultValue={period.periodStart ?? ""} className="rounded-xl border-[#e1e5ee] bg-white" />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">End date</span>
                    <Input type="date" name="periodEnd" defaultValue={period.periodEnd ?? ""} className="rounded-xl border-[#e1e5ee] bg-white" />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Opening balance</span>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#8d8896]">PHP</span>
                      <Input type="number" name="openingBalance" inputMode="decimal" step="0.01" min="0" defaultValue={period.openingBalance.toFixed(2)} className="rounded-xl border-[#e1e5ee] bg-white pl-14" />
                    </div>
                  </label>
                </div>
              </div>

              <div className="admin-accounting-section admin-accounting-section-positive grid gap-4 rounded-[1.3rem] border border-[#d8efe0] bg-[#f9fdf9] p-4">
                <SectionHeader title="Cash In" subtitle="Money received during this period." />
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {inflowFields.map((field) => (
                    <AmountField key={field.name} name={field.name} label={field.label} defaultValue={Number(period[field.name] ?? 0)} accent="positive" />
                  ))}
                </div>
              </div>

              <div className="admin-accounting-section admin-accounting-section-negative grid gap-4 rounded-[1.3rem] border border-[#f3e1e3] bg-[#fffdfd] p-4">
                <SectionHeader title="Cash Out" subtitle="Direct costs, operating spend, and other outgoing cash." />
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {outflowFields.map((field) => (
                    <AmountField key={field.name} name={field.name} label={field.label} defaultValue={Number(period[field.name] ?? 0)} accent="negative" />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.25rem] border border-[#eef0f6] bg-[#fafbfe] p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Cash movement</p>
                <div className="mt-3 grid gap-3">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-[#6f6a75]">Total cash in</span>
                    <span className="font-semibold text-[#17141a]">{formatAccountingCurrency(totals.cashIn)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-[#6f6a75]">Total cash out</span>
                    <span className="font-semibold text-[#17141a]">{formatAccountingCurrency(totals.cashOut)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-[#6f6a75]">Opening balance</span>
                    <span className="font-semibold text-[#17141a]">{formatAccountingCurrency(period.openingBalance)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-[#e5e8f0] pt-3 text-sm">
                    <span className="text-[#6f6a75]">Closing balance</span>
                    <span className="font-semibold text-[#17141a]">{formatAccountingCurrency(period.openingBalance + totals.netCashFlow)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-[#e5e8f0] pt-3 text-sm">
                    <span className="text-[#6f6a75]">Net cash flow</span>
                    <span className={`font-semibold ${totals.netCashFlow >= 0 ? "text-[#0f8a43]" : "text-[#d1394d]"}`}>
                      {formatAccountingCurrency(totals.netCashFlow)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.25rem] border border-[#eef0f6] bg-white p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Performance snapshot</p>
                <div className="mt-3 grid gap-3">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-[#6f6a75]">Gross margin</span>
                    <span className="font-semibold text-[#17141a]">{formatAccountingCurrency(totals.grossMargin)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-[#6f6a75]">Operating result</span>
                    <span className="font-semibold text-[#17141a]">{formatAccountingCurrency(totals.operatingResult)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-[#6f6a75]">Tax + debt + draws</span>
                    <span className="font-semibold text-[#17141a]">
                      {formatAccountingCurrency(period.taxes + period.loanPayments + period.ownerDraws)}
                    </span>
                  </div>
                </div>
              </div>

              {state.error ? <p className="rounded-xl border border-[#ed2325]/20 bg-[#fff5f5] px-4 py-3 text-sm text-[#8f1d1d]">{state.error}</p> : null}
            </div>

            <div className="grid gap-3">
              <div className="rounded-[1.25rem] border border-[#eef0f6] bg-white p-4">
                <label className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]" htmlFor={`notes-${period.id}`}>
                  Notes
                </label>
                <Textarea
                  id={`notes-${period.id}`}
                  name="notes"
                  defaultValue={period.notes ?? ""}
                  placeholder="Major collections, one-time expenses, tax adjustments, seasonal sales changes, or payment delays."
                  className="mt-3 min-h-44 rounded-xl border-[#e1e5ee]"
                />
              </div>

              <div className="rounded-[1.25rem] border border-[#f3d7dc] bg-[#fff9fa] p-4">
                <p className="text-sm font-medium text-[#17141a]">Delete this period</p>
                <p className="mt-2 text-sm leading-6 text-[#6f6a75]">Remove this period if it was created by mistake or should no longer appear in reporting.</p>
                {deleteState.error ? <p className="mt-3 text-sm text-[#8f1d1d]">{deleteState.error}</p> : null}
                <Button type="submit" formAction={deleteFormAction} variant="secondary" className="mt-4 rounded-xl px-4 py-2.5 normal-case tracking-normal" disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete period"}
                </Button>
              </div>

              <div className="rounded-[1.25rem] border border-[#eef0f6] bg-[#fafbfe] p-4">
                <p className="text-sm font-medium text-[#17141a]">Ready to save?</p>
                <p className="mt-2 text-sm leading-6 text-[#6f6a75]">Save updates for this period or collapse the editor.</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button type="submit" className="w-full rounded-xl px-4 py-2.5 normal-case tracking-normal sm:w-auto" disabled={isPending}>
                    {isPending ? "Saving..." : "Save period changes"}
                  </Button>
                  <Button type="button" variant="secondary" className="w-full rounded-xl px-4 py-2.5 normal-case tracking-normal sm:w-auto" onClick={() => setIsExpanded(false)}>
                    Collapse editor
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </form>
    </article>
  );
}

function CreateAccountingPeriodForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createAccountingPeriodAction, initialFormState);

  useEffect(() => {
    if (state.entityId) {
      router.refresh();
    }
  }, [router, state.entityId]);

  return (
    <form action={formAction} className="rounded-[1.6rem] border border-[#e3e7f0] bg-white p-5 shadow-[0_14px_30px_rgba(35,31,32,0.04)] sm:p-6">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#9793a0]">Add Period</p>
          <h2 className="mt-2 text-[1.45rem] font-semibold tracking-tight text-[#17141a]">New Accounting Period</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f6a75]">Add a period to the ledger and include it in statement exports.</p>
        </div>

        <div className="rounded-[1.3rem] border border-[#eef0f6] bg-[#fcfcfe] p-4">
          <SectionHeader title="Period Setup" subtitle="Label, date range, and opening balance." />
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <label className="grid gap-2">
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Period label</span>
              <Input name="label" placeholder="April 2026" className="rounded-xl border-[#e1e5ee]" required />
            </label>
            <label className="grid gap-2">
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Start date</span>
              <Input type="date" name="periodStart" className="rounded-xl border-[#e1e5ee]" />
            </label>
            <label className="grid gap-2">
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">End date</span>
              <Input type="date" name="periodEnd" className="rounded-xl border-[#e1e5ee]" />
            </label>
            <label className="grid gap-2">
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Opening balance</span>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#8d8896]">PHP</span>
                <Input type="number" name="openingBalance" inputMode="decimal" step="0.01" min="0" defaultValue="0.00" className="rounded-xl border-[#e1e5ee] pl-14" />
              </div>
            </label>
          </div>
        </div>

        <div className="admin-accounting-section admin-accounting-section-positive rounded-[1.3rem] border border-[#d8efe0] bg-[#f9fdf9] p-4">
          <SectionHeader title="Cash In" subtitle="Received money for the selected period." />
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {inflowFields.map((field) => (
              <AmountField key={field.name} name={field.name} label={field.label} defaultValue={0} accent="positive" />
            ))}
          </div>
        </div>

        <div className="admin-accounting-section admin-accounting-section-negative rounded-[1.3rem] border border-[#f3e1e3] bg-[#fffdfd] p-4">
          <SectionHeader title="Cash Out" subtitle="Outgoing cash for operations, debt, taxes, and capital spend." />
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {outflowFields.map((field) => (
              <AmountField key={field.name} name={field.name} label={field.label} defaultValue={0} accent="negative" />
            ))}
          </div>
        </div>

        <label className="grid gap-2 rounded-[1.3rem] border border-[#eef0f6] bg-white p-4">
          <span className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Notes</span>
          <Textarea name="notes" placeholder="Context for this period, unusual expenses, delayed collections, or management notes." className="min-h-32 rounded-xl border-[#e1e5ee]" />
        </label>

        {state.error ? <p className="rounded-xl border border-[#ed2325]/20 bg-[#fff5f5] px-4 py-3 text-sm text-[#8f1d1d]">{state.error}</p> : null}

        <div className="flex flex-col gap-3 border-t border-[#edf0f6] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#6f6a75]">Save the period to add it to the ledger.</p>
          <Button type="submit" className="rounded-xl px-5 py-3 normal-case tracking-normal" disabled={isPending}>
            {isPending ? "Saving..." : "Create period"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export function AccountingWorkspace({
  periods,
  isDatabaseReady,
}: {
  periods: AccountingPeriod[];
  isDatabaseReady: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"periods" | "journal">("periods");
  const { rows, totals } = getAccountingSummary(periods);
  const journalLines = getAccountingJournalLines(periods);
  const runwayMonths = totals.averageMonthlyBurn > 0 ? totals.latestClosingBalance / totals.averageMonthlyBurn : 0;

  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-[#e3e7f0] bg-white shadow-[0_14px_30px_rgba(35,31,32,0.04)]">
        <div className="border-b border-[#edf0f6] bg-[#fafbfe] px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#9793a0]">Accounting Workspace</p>
              <h1 className="mt-2 text-[1.75rem] font-semibold tracking-tight text-[#17141a] sm:text-[2rem]">Accounting</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6f6a75]">Manage accounting periods, review cash movement, and export the statement of accounts.</p>
            </div>

            {isDatabaseReady ? (
              <a
                href={getAdminRoute("/accounting/export")}
                className="inline-flex items-center justify-center rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_24px_rgba(237,35,37,0.18)] transition hover:bg-[#c81a1d]"
              >
                Download Excel statement
              </a>
            ) : (
              <span className="inline-flex items-center justify-center rounded-xl border border-[#e4e7ef] bg-white px-5 py-3 text-sm font-medium text-[#6f6a75]">
                Run schema setup first
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-4 border-b border-[#edf0f6] px-4 py-4 sm:px-6 sm:py-5 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Net cash flow"
            value={formatAccountingCurrency(totals.totalNetCashFlow)}
            note="All recorded inflows minus all recorded outflows."
            tone={totals.totalNetCashFlow >= 0 ? "positive" : "negative"}
          />
          <MetricCard
            label="Latest closing balance"
            value={formatAccountingCurrency(totals.latestClosingBalance)}
            note="Closing cash balance from the most recent saved period."
            tone={totals.latestClosingBalance >= 0 ? "positive" : "negative"}
          />
          <MetricCard label="Cash in" value={formatAccountingCurrency(totals.totalCashIn)} note="Sales collected, receivables, and other income." />
          <MetricCard label="Cash out" value={formatAccountingCurrency(totals.totalCashOut)} note="Operations, tax, debt, owner withdrawals, and capex." />
        </div>

        <div className="grid gap-4 border-b border-[#edf0f6] px-4 py-4 sm:px-6 sm:py-5 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-[1.25rem] border border-[#eef0f6] bg-white p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Periods saved</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-[#17141a]">{periods.length}</p>
            <p className="mt-2 text-sm text-[#6f6a75]">Accounting periods currently stored in the database.</p>
          </div>
          <div className="rounded-[1.25rem] border border-[#eef0f6] bg-white p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Average monthly burn</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-[#17141a]">{formatAccountingCurrency(totals.averageMonthlyBurn)}</p>
            <p className="mt-2 text-sm text-[#6f6a75]">Average cash outflow across all saved periods.</p>
          </div>
          <div className="rounded-[1.25rem] border border-[#eef0f6] bg-white p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Runway estimate</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-[#17141a]">
              {Number.isFinite(runwayMonths) && runwayMonths > 0 ? `${runwayMonths.toFixed(1)} months` : "Not enough data"}
            </p>
            <p className="mt-2 text-sm text-[#6f6a75]">Net cash generation divided by the average monthly burn rate.</p>
          </div>
          <div className="rounded-[1.25rem] border border-[#eef0f6] bg-white p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Sales margin</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-[#17141a]">{formatAccountingCurrency(totals.totalSales - totals.totalInventory)}</p>
            <p className="mt-2 text-sm text-[#6f6a75]">Sales collected less inventory or cost-of-goods spending.</p>
          </div>
          <div className="rounded-[1.25rem] border border-[#eef0f6] bg-white p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Best / worst period</p>
            <p className="mt-2 text-base font-semibold tracking-tight text-[#17141a]">
              {totals.strongestPeriod ? `${totals.strongestPeriod.label}: ${formatCompactCurrency(totals.strongestPeriod.netCashFlow)}` : "No saved periods yet"}
            </p>
            <p className="mt-2 text-sm text-[#6f6a75]">
              {totals.weakestPeriod ? `Lowest: ${totals.weakestPeriod.label} at ${formatCompactCurrency(totals.weakestPeriod.netCashFlow)}.` : "Add a period to compare performance."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 px-4 py-4 sm:px-6 sm:gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("periods")}
            className={`admin-internal-tab inline-flex flex-1 items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition sm:flex-none ${
              activeTab === "periods"
                ? "admin-internal-tab-active bg-[#17141a] text-white shadow-[0_10px_20px_rgba(23,20,26,0.14)]"
                : "admin-internal-tab-idle border border-[#e4e7ef] bg-white text-[#6f6a75] hover:border-[#d7dce8] hover:text-[#17141a]"
            }`}
          >
            Periods
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("journal")}
            className={`admin-internal-tab inline-flex flex-1 items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition sm:flex-none ${
              activeTab === "journal"
                ? "admin-internal-tab-active bg-[#17141a] text-white shadow-[0_10px_20px_rgba(23,20,26,0.14)]"
                : "admin-internal-tab-idle border border-[#e4e7ef] bg-white text-[#6f6a75] hover:border-[#d7dce8] hover:text-[#17141a]"
            }`}
          >
            Journal
          </button>
        </div>

      </section>

      {!isDatabaseReady ? (
        <section className="rounded-[1.6rem] border border-[#f4d5d8] bg-[#fff9fa] p-5 shadow-[0_14px_30px_rgba(35,31,32,0.04)]">
          <p className="text-sm font-semibold text-[#17141a]">Database setup is still required</p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6f6a75]">
            The UI and server logic are ready, but the `accounting_periods` table must exist in Supabase first. Run the SQL in `ACCOUNTING_SCHEMA.sql` to activate persistence and Excel export.
          </p>
        </section>
      ) : null}

      {activeTab === "periods" ? (
        <>
          {isDatabaseReady ? <CreateAccountingPeriodForm /> : null}

          {rows.length > 0 ? (
            <>
              <section className="grid gap-4">
                {rows.map((period) => (
                  <AccountingPeriodEditor key={period.id} period={period} />
                ))}
              </section>

              <section className="overflow-hidden rounded-[1.6rem] border border-[#e3e7f0] bg-white shadow-[0_14px_30px_rgba(35,31,32,0.04)]">
                <div className="border-b border-[#edf0f6] bg-[#fafbfe] px-5 py-4 sm:px-6">
                  <h2 className="text-[11px] uppercase tracking-[0.22em] text-[#9793a0]">Ledger View</h2>
                </div>
                <div className="hidden overflow-x-auto px-5 py-5 sm:px-6 md:block">
                  <table className="min-w-full border-separate border-spacing-0">
                    <thead>
                      <tr>
                        {["Period", "Cash in", "Cash out", "Net flow", "Opening", "Closing"].map((label) => (
                          <th key={label} className="border-b border-[#edf0f6] px-3 py-3 text-left text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((period) => (
                        <tr key={`${period.id}-row`}>
                          <td className="border-b border-[#f0f2f7] px-3 py-4 text-sm font-medium text-[#17141a]">{period.label}</td>
                          <td className="border-b border-[#f0f2f7] px-3 py-4 text-sm text-[#17141a]">{formatAccountingCurrency(period.cashIn)}</td>
                          <td className="border-b border-[#f0f2f7] px-3 py-4 text-sm text-[#17141a]">{formatAccountingCurrency(period.cashOut)}</td>
                          <td className={`border-b border-[#f0f2f7] px-3 py-4 text-sm font-semibold ${period.netCashFlow >= 0 ? "text-[#0f8a43]" : "text-[#d1394d]"}`}>
                            {formatAccountingCurrency(period.netCashFlow)}
                          </td>
                          <td className="border-b border-[#f0f2f7] px-3 py-4 text-sm text-[#6f6a75]">{formatAccountingCurrency(period.openingBalance)}</td>
                          <td className="border-b border-[#f0f2f7] px-3 py-4 text-sm font-semibold text-[#17141a]">{formatAccountingCurrency(period.closingBalance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="grid gap-3 px-4 py-4 sm:px-6 md:hidden">
                  {rows.map((period) => (
                    <MobileLedgerCard
                      key={`${period.id}-mobile`}
                      items={[
                        { label: "Period", value: period.label },
                        { label: "Cash in", value: formatAccountingCurrency(period.cashIn) },
                        { label: "Cash out", value: formatAccountingCurrency(period.cashOut) },
                        {
                          label: "Net flow",
                          value: formatAccountingCurrency(period.netCashFlow),
                          valueClassName: period.netCashFlow >= 0 ? "text-[#0f8a43]" : "text-[#d1394d]",
                        },
                        { label: "Opening", value: formatAccountingCurrency(period.openingBalance) },
                        { label: "Closing", value: formatAccountingCurrency(period.closingBalance) },
                      ]}
                    />
                  ))}
                </div>
              </section>
            </>
          ) : (
            <section className="rounded-[1.6rem] border border-[#e3e7f0] bg-white p-6 shadow-[0_14px_30px_rgba(35,31,32,0.04)]">
              <p className="text-sm font-semibold text-[#17141a]">No accounting periods saved yet</p>
              <p className="mt-2 text-sm leading-6 text-[#6f6a75]">Create the first period above to start building the database-backed statement of accounts and cash flow history.</p>
            </section>
          )}
        </>
      ) : (
        <section className="overflow-hidden rounded-[1.6rem] border border-[#e3e7f0] bg-white shadow-[0_14px_30px_rgba(35,31,32,0.04)]">
          <div className="border-b border-[#edf0f6] bg-[#fafbfe] px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#9793a0]">Journal View</p>
                <h2 className="mt-2 text-[1.35rem] font-semibold tracking-tight text-[#17141a]">Accounting Journal</h2>
              </div>
              <p className="text-sm text-[#6f6a75]">Derived from saved accounting periods.</p>
            </div>
          </div>

          {journalLines.length > 0 ? (
            <>
              <div className="hidden overflow-x-auto px-5 py-5 sm:px-6 md:block">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr>
                      {["Date", "Period", "Account", "Entry", "Debit", "Credit", "Notes"].map((label) => (
                        <th key={label} className="border-b border-[#edf0f6] px-3 py-3 text-left text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {journalLines.map((line) => (
                      <tr key={line.id}>
                        <td className="border-b border-[#f0f2f7] px-3 py-4 text-sm text-[#6f6a75]">{line.entryDate ?? "-"}</td>
                        <td className="border-b border-[#f0f2f7] px-3 py-4 text-sm font-medium text-[#17141a]">{line.periodLabel}</td>
                        <td className="border-b border-[#f0f2f7] px-3 py-4 text-sm text-[#17141a]">{line.account}</td>
                        <td className="border-b border-[#f0f2f7] px-3 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${
                              line.side === "debit" ? "bg-[#f4fbf6] text-[#0f8a43]" : "bg-[#fff7f8] text-[#d1394d]"
                            }`}
                          >
                            {line.side}
                          </span>
                        </td>
                        <td className="border-b border-[#f0f2f7] px-3 py-4 text-sm font-medium text-[#17141a]">
                          {line.side === "debit" ? formatAccountingCurrency(line.amount) : "-"}
                        </td>
                        <td className="border-b border-[#f0f2f7] px-3 py-4 text-sm font-medium text-[#17141a]">
                          {line.side === "credit" ? formatAccountingCurrency(line.amount) : "-"}
                        </td>
                        <td className="border-b border-[#f0f2f7] px-3 py-4 text-sm text-[#6f6a75]">{line.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid gap-3 px-4 py-4 sm:px-6 md:hidden">
                {journalLines.map((line) => (
                  <MobileLedgerCard
                    key={line.id}
                    items={[
                      { label: "Date", value: line.entryDate ?? "-" },
                      { label: "Period", value: line.periodLabel },
                      { label: "Account", value: line.account },
                      { label: "Entry", value: line.side.toUpperCase(), valueClassName: line.side === "debit" ? "text-[#0f8a43]" : "text-[#d1394d]" },
                      { label: "Debit", value: line.side === "debit" ? formatAccountingCurrency(line.amount) : "-" },
                      { label: "Credit", value: line.side === "credit" ? formatAccountingCurrency(line.amount) : "-" },
                      { label: "Notes", value: line.note },
                    ]}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="px-5 py-6 sm:px-6">
              <p className="text-sm font-semibold text-[#17141a]">No journal lines yet</p>
              <p className="mt-2 text-sm leading-6 text-[#6f6a75]">Save at least one accounting period to populate the journal tab.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
