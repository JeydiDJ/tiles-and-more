import { CrmCalendar } from "@/components/admin/crm-calendar";
import { getCrmOpportunities } from "@/services/crm.service";

export default async function AdminCalendarPage() {
  const opportunities = await getCrmOpportunities();

  return (
    <div className="grid gap-6">
      <CrmCalendar opportunities={opportunities} />
    </div>
  );
}
