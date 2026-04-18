import { AccountingWorkspace } from "@/components/admin/accounting-workspace";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { getAccountingPeriods } from "@/services/accounting.service";
import type { AccountingPeriod } from "@/types/accounting";

export default async function AdminAccountingPage() {
  let periods: AccountingPeriod[] = [];
  let isDatabaseReady = hasSupabaseEnv();

  if (hasSupabaseEnv()) {
    try {
      periods = await getAccountingPeriods();
    } catch {
      isDatabaseReady = false;
    }
  }

  return <AccountingWorkspace periods={periods} isDatabaseReady={isDatabaseReady} />;
}
