import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AccountingPeriod, AccountingPeriodInput } from "@/types/accounting";

type AccountingPeriodRow = {
  id: string;
  label: string;
  period_start: string | null;
  period_end: string | null;
  opening_balance: number | null;
  sales_collected: number | null;
  receivables_collected: number | null;
  other_income: number | null;
  inventory_purchases: number | null;
  payroll: number | null;
  rent_utilities: number | null;
  operating_expenses: number | null;
  marketing: number | null;
  taxes: number | null;
  loan_payments: number | null;
  owner_draws: number | null;
  capital_expenses: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

function mapAccountingPeriod(row: AccountingPeriodRow): AccountingPeriod {
  return {
    id: row.id,
    label: row.label,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    openingBalance: row.opening_balance ?? 0,
    salesCollected: row.sales_collected ?? 0,
    receivablesCollected: row.receivables_collected ?? 0,
    otherIncome: row.other_income ?? 0,
    inventoryPurchases: row.inventory_purchases ?? 0,
    payroll: row.payroll ?? 0,
    rentUtilities: row.rent_utilities ?? 0,
    operatingExpenses: row.operating_expenses ?? 0,
    marketing: row.marketing ?? 0,
    taxes: row.taxes ?? 0,
    loanPayments: row.loan_payments ?? 0,
    ownerDraws: row.owner_draws ?? 0,
    capitalExpenses: row.capital_expenses ?? 0,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toRowInput(input: AccountingPeriodInput) {
  return {
    label: input.label,
    period_start: input.periodStart,
    period_end: input.periodEnd,
    opening_balance: input.openingBalance,
    sales_collected: input.salesCollected,
    receivables_collected: input.receivablesCollected,
    other_income: input.otherIncome,
    inventory_purchases: input.inventoryPurchases,
    payroll: input.payroll,
    rent_utilities: input.rentUtilities,
    operating_expenses: input.operatingExpenses,
    marketing: input.marketing,
    taxes: input.taxes,
    loan_payments: input.loanPayments,
    owner_draws: input.ownerDraws,
    capital_expenses: input.capitalExpenses,
    notes: input.notes,
  };
}

export async function getAccountingPeriods() {
  if (!hasSupabaseEnv()) {
    return [] as AccountingPeriod[];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("accounting_periods")
    .select("*")
    .order("period_start", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapAccountingPeriod(row as AccountingPeriodRow));
}

export async function createAccountingPeriod(input: AccountingPeriodInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("accounting_periods")
    .insert(toRowInput(input))
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapAccountingPeriod(data as AccountingPeriodRow);
}

export async function updateAccountingPeriod(id: string, input: AccountingPeriodInput) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("accounting_periods")
    .update({
      ...toRowInput(input),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteAccountingPeriod(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("accounting_periods").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
