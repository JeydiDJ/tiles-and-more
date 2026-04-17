import { CrmTable } from "@/components/admin/crm-table";
import Link from "next/link";
import { getAdminRoute } from "@/lib/admin-path";
import { getProjectLeads } from "@/services/project-lead.service";

function CrmMetric({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_14px_30px_rgba(35,31,32,0.04)]">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#9793a0]">{label}</p>
      <p className="mt-3 text-[2rem] font-semibold tracking-tight text-[#17141a]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#6f6a75]">{note}</p>
    </div>
  );
}

export default async function AdminCrmPage() {
  const leads = await getProjectLeads();
  const newLeadCount = leads.filter((lead) => lead.status === "new_lead").length;
  const quotationCount = leads.filter((lead) => lead.status === "quotation_in_progress" || lead.status === "quotation_sent").length;
  const ongoingCount = leads.filter((lead) => lead.status === "ongoing").length;
  const completedCount = leads.filter((lead) => lead.status === "completed").length;
  const withQuotationCount = leads.filter((lead) => lead.quotationFinished).length;

  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-[#e3e7f0] bg-white shadow-[0_14px_30px_rgba(35,31,32,0.04)]">
        <div className="border-b border-[#edf0f6] bg-[#fafbfe] px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#9793a0]">CRM Workspace</p>
              <h1 className="mt-2 text-[2rem] font-semibold tracking-tight text-[#17141a]">Project Pipeline</h1>
              <p className="mt-2 text-sm text-[#6f6a75]">Manage live project records, quotations, and follow-through in one operational view.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={getAdminRoute("/crm/new")}
                className="inline-flex items-center justify-center rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_24px_rgba(237,35,37,0.18)] transition hover:bg-[var(--brand-dark)]"
              >
                New Project
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-[#edf0f6] px-5 py-3 sm:px-6">
          <span className="inline-flex items-center rounded-full bg-[#17141a] px-3 py-1.5 text-xs font-medium text-white">List workspace</span>
          <span className="inline-flex items-center rounded-full border border-[#e4e7ef] bg-white px-3 py-1.5 text-xs font-medium text-[#6f6a75]">
            Grouped by status
          </span>
          <span className="inline-flex items-center rounded-full border border-[#e4e7ef] bg-white px-3 py-1.5 text-xs font-medium text-[#6f6a75]">
            {withQuotationCount} with completed quotation
          </span>
        </div>

        <div className="grid gap-4 px-5 py-5 sm:px-6 md:grid-cols-4">
          <CrmMetric label="New Leads" value={String(newLeadCount)} note="Fresh project inquiries requiring initial action." />
          <CrmMetric label="Quotation" value={String(quotationCount)} note="Records moving through costing and proposal work." />
          <CrmMetric label="Ongoing" value={String(ongoingCount)} note="Active projects that still need follow-through." />
          <CrmMetric label="Completed" value={String(completedCount)} note="Closed-out records with finished work or delivery." />
        </div>
      </section>

      <CrmTable leads={leads} />
    </div>
  );
}
