import { CrmCalendar } from "@/components/admin/crm-calendar";
import { getProjectLeads } from "@/services/project-lead.service";

export default async function AdminCalendarPage() {
  const leads = await getProjectLeads();

  return (
    <div className="grid gap-6">
      <CrmCalendar leads={leads} />
    </div>
  );
}
