"use server";

import { revalidatePath } from "next/cache";
import { createAccountingPeriod, deleteAccountingPeriod, updateAccountingPeriod } from "@/services/accounting.service";
import { accountingAmountFields, type AccountingAmountField } from "@/lib/accounting";
import { getAdminRoute } from "@/lib/admin-path";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AccountingPeriodInput } from "@/types/accounting";

export type AccountingFormState = {
  error: string | null;
  entityId?: string | null;
};

export type AccountingDeleteState = {
  error: string | null;
  deletedId?: string | null;
};

function normalizeOptional(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();
  return normalized.length > 0 ? normalized : null;
}

function parseAmount(formData: FormData, key: AccountingAmountField) {
  const rawValue = normalizeOptional(formData.get(key));
  if (!rawValue) {
    return 0;
  }

  const parsed = Number(rawValue.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseAccountingInput(formData: FormData): AccountingPeriodInput {
  return {
    label: String(formData.get("label") ?? "").trim(),
    periodStart: normalizeOptional(formData.get("periodStart")),
    periodEnd: normalizeOptional(formData.get("periodEnd")),
    openingBalance: parseAmount(formData, accountingAmountFields[0]),
    salesCollected: parseAmount(formData, accountingAmountFields[1]),
    receivablesCollected: parseAmount(formData, accountingAmountFields[2]),
    otherIncome: parseAmount(formData, accountingAmountFields[3]),
    inventoryPurchases: parseAmount(formData, accountingAmountFields[4]),
    payroll: parseAmount(formData, accountingAmountFields[5]),
    rentUtilities: parseAmount(formData, accountingAmountFields[6]),
    operatingExpenses: parseAmount(formData, accountingAmountFields[7]),
    marketing: parseAmount(formData, accountingAmountFields[8]),
    taxes: parseAmount(formData, accountingAmountFields[9]),
    loanPayments: parseAmount(formData, accountingAmountFields[10]),
    ownerDraws: parseAmount(formData, accountingAmountFields[11]),
    capitalExpenses: parseAmount(formData, accountingAmountFields[12]),
    notes: normalizeOptional(formData.get("notes")),
  };
}

async function requireAdminUser() {
  if (!hasSupabaseEnv()) {
    throw new Error("Supabase env vars are missing. Add them before using accounting.");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to manage accounting records.");
  }
}

function revalidateAccountingPaths() {
  revalidatePath(getAdminRoute("/accounting"));
  revalidatePath(getAdminRoute());
}

export async function createAccountingPeriodAction(_: AccountingFormState, formData: FormData): Promise<AccountingFormState> {
  try {
    await requireAdminUser();

    const input = parseAccountingInput(formData);
    if (!input.label) {
      return { error: "Period label is required.", entityId: null };
    }

    const period = await createAccountingPeriod(input);
    revalidateAccountingPaths();

    return { error: null, entityId: period.id };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to create accounting period.", entityId: null };
  }
}

export async function updateAccountingPeriodAction(_: AccountingFormState, formData: FormData): Promise<AccountingFormState> {
  try {
    await requireAdminUser();

    const periodId = String(formData.get("periodId") ?? "").trim();
    if (!periodId) {
      return { error: "Period ID is required.", entityId: null };
    }

    const input = parseAccountingInput(formData);
    if (!input.label) {
      return { error: "Period label is required.", entityId: periodId };
    }

    await updateAccountingPeriod(periodId, input);
    revalidateAccountingPaths();

    return { error: null, entityId: periodId };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to update accounting period.", entityId: null };
  }
}

export async function deleteAccountingPeriodAction(_: AccountingDeleteState, formData: FormData): Promise<AccountingDeleteState> {
  try {
    await requireAdminUser();

    const periodId = String(formData.get("periodId") ?? "").trim();
    if (!periodId) {
      return { error: "Period ID is required.", deletedId: null };
    }

    await deleteAccountingPeriod(periodId);
    revalidateAccountingPaths();

    return { error: null, deletedId: periodId };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to delete accounting period.", deletedId: null };
  }
}
