import type { AccountingPeriod } from "@/types/accounting";

export const accountingAmountFields = [
  "openingBalance",
  "salesCollected",
  "receivablesCollected",
  "otherIncome",
  "inventoryPurchases",
  "payroll",
  "rentUtilities",
  "operatingExpenses",
  "marketing",
  "taxes",
  "loanPayments",
  "ownerDraws",
  "capitalExpenses",
] as const;

export type AccountingAmountField = (typeof accountingAmountFields)[number];

export type AccountingJournalLine = {
  id: string;
  periodId: string;
  periodLabel: string;
  entryDate: string | null;
  account: string;
  side: "debit" | "credit";
  amount: number;
  note: string;
  group: "cash_in" | "cash_out";
};

export function formatAccountingCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function getAccountingPeriodTotals(period: Pick<
  AccountingPeriod,
  | "openingBalance"
  | "salesCollected"
  | "receivablesCollected"
  | "otherIncome"
  | "inventoryPurchases"
  | "payroll"
  | "rentUtilities"
  | "operatingExpenses"
  | "marketing"
  | "taxes"
  | "loanPayments"
  | "ownerDraws"
  | "capitalExpenses"
>) {
  const cashIn = period.salesCollected + period.receivablesCollected + period.otherIncome;
  const cashOut =
    period.inventoryPurchases +
    period.payroll +
    period.rentUtilities +
    period.operatingExpenses +
    period.marketing +
    period.taxes +
    period.loanPayments +
    period.ownerDraws +
    period.capitalExpenses;
  const grossMargin = period.salesCollected - period.inventoryPurchases;
  const operatingResult =
    grossMargin - period.payroll - period.rentUtilities - period.operatingExpenses - period.marketing;
  const netCashFlow = cashIn - cashOut;

  return {
    cashIn,
    cashOut,
    grossMargin,
    operatingResult,
    netCashFlow,
  };
}

export function getAccountingSummary(periods: AccountingPeriod[]) {
  const rows = periods.map((period) => {
    const totals = getAccountingPeriodTotals(period);
    const openingBalance = period.openingBalance;
    const closingBalance = openingBalance + totals.netCashFlow;

    return {
      ...period,
      ...totals,
      openingBalance,
      closingBalance,
    };
  });

  const totalCashIn = rows.reduce((sum, row) => sum + row.cashIn, 0);
  const totalCashOut = rows.reduce((sum, row) => sum + row.cashOut, 0);
  const totalNetCashFlow = rows.reduce((sum, row) => sum + row.netCashFlow, 0);
  const totalSales = rows.reduce((sum, row) => sum + row.salesCollected, 0);
  const totalInventory = rows.reduce((sum, row) => sum + row.inventoryPurchases, 0);
  const averageMonthlyBurn = rows.length > 0 ? totalCashOut / rows.length : 0;
  const latestClosingBalance = rows.at(-1)?.closingBalance ?? 0;
  const strongestPeriod = [...rows].sort((a, b) => b.netCashFlow - a.netCashFlow)[0] ?? null;
  const weakestPeriod = [...rows].sort((a, b) => a.netCashFlow - b.netCashFlow)[0] ?? null;

  return {
    rows,
    totals: {
      totalCashIn,
      totalCashOut,
      totalNetCashFlow,
      totalSales,
      totalInventory,
      averageMonthlyBurn,
      latestClosingBalance,
      strongestPeriod,
      weakestPeriod,
    },
  };
}

export function getAccountingJournalLines(periods: AccountingPeriod[]): AccountingJournalLine[] {
  const lines: AccountingJournalLine[] = [];

  const accountMappings: Array<{
    key:
      | "salesCollected"
      | "receivablesCollected"
      | "otherIncome"
      | "inventoryPurchases"
      | "payroll"
      | "rentUtilities"
      | "operatingExpenses"
      | "marketing"
      | "taxes"
      | "loanPayments"
      | "ownerDraws"
      | "capitalExpenses";
    account: string;
    note: string;
    group: "cash_in" | "cash_out";
    creditAccount?: string;
  }> = [
    { key: "salesCollected", account: "Sales Revenue", note: "Cash received from sales.", group: "cash_in", creditAccount: "Sales Revenue" },
    { key: "receivablesCollected", account: "Accounts Receivable", note: "Collection of outstanding receivables.", group: "cash_in", creditAccount: "Accounts Receivable" },
    { key: "otherIncome", account: "Other Income", note: "Other cash income recorded for the period.", group: "cash_in", creditAccount: "Other Income" },
    { key: "inventoryPurchases", account: "Inventory / Cost of Goods", note: "Inventory or cost-of-goods cash outflow.", group: "cash_out" },
    { key: "payroll", account: "Payroll Expense", note: "Payroll disbursement.", group: "cash_out" },
    { key: "rentUtilities", account: "Rent and Utilities Expense", note: "Rent and utilities payment.", group: "cash_out" },
    { key: "operatingExpenses", account: "Operating Expense", note: "Operating expense payment.", group: "cash_out" },
    { key: "marketing", account: "Marketing Expense", note: "Marketing spend.", group: "cash_out" },
    { key: "taxes", account: "Tax Expense", note: "Tax payment.", group: "cash_out" },
    { key: "loanPayments", account: "Loan Payable", note: "Loan repayment.", group: "cash_out" },
    { key: "ownerDraws", account: "Owner's Draw", note: "Owner withdrawal.", group: "cash_out" },
    { key: "capitalExpenses", account: "Capital Asset", note: "Capital expenditure payment.", group: "cash_out" },
  ];

  periods.forEach((period) => {
    const entryDate = period.periodEnd ?? period.periodStart ?? null;

    accountMappings.forEach((mapping) => {
      const amount = period[mapping.key];
      if (!amount || amount <= 0) {
        return;
      }

      if (mapping.group === "cash_in") {
        lines.push({
          id: `${period.id}-${mapping.key}-debit`,
          periodId: period.id,
          periodLabel: period.label,
          entryDate,
          account: "Cash",
          side: "debit",
          amount,
          note: mapping.note,
          group: mapping.group,
        });
        lines.push({
          id: `${period.id}-${mapping.key}-credit`,
          periodId: period.id,
          periodLabel: period.label,
          entryDate,
          account: mapping.creditAccount ?? mapping.account,
          side: "credit",
          amount,
          note: mapping.note,
          group: mapping.group,
        });
        return;
      }

      lines.push({
        id: `${period.id}-${mapping.key}-debit`,
        periodId: period.id,
        periodLabel: period.label,
        entryDate,
        account: mapping.account,
        side: "debit",
        amount,
        note: mapping.note,
        group: mapping.group,
      });
      lines.push({
        id: `${period.id}-${mapping.key}-credit`,
        periodId: period.id,
        periodLabel: period.label,
        entryDate,
        account: "Cash",
        side: "credit",
        amount,
        note: mapping.note,
        group: mapping.group,
      });
    });
  });

  return lines.sort((a, b) => {
    const dateA = a.entryDate ? new Date(a.entryDate).getTime() : 0;
    const dateB = b.entryDate ? new Date(b.entryDate).getTime() : 0;
    return dateB - dateA || a.periodLabel.localeCompare(b.periodLabel) || a.account.localeCompare(b.account);
  });
}
