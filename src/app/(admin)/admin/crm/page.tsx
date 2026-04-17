import { CrmTable } from "@/components/admin/crm-table";
import { getCrmAccounts, getCrmOpportunities } from "@/services/crm.service";

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
  const [accounts, opportunities] = await Promise.all([getCrmAccounts(), getCrmOpportunities()]);
  const newLeadCount = opportunities.filter((item) => item.stage === "new_lead").length;
  const bidCount = opportunities.filter((item) => item.stage === "bidding" || item.stage === "negotiation").length;
  const awardedCount = opportunities.filter((item) => item.stage === "awarded" || item.stage === "ongoing").length;
  const completedCount = opportunities.filter((item) => item.stage === "completed").length;

  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-[#e3e7f0] bg-white shadow-[0_14px_30px_rgba(35,31,32,0.04)]">
        <div className="border-b border-[#edf0f6] bg-[#fafbfe] px-5 py-4 sm:px-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#9793a0]">CRM Workspace</p>
            <h1 className="mt-2 text-[1.7rem] font-semibold tracking-tight text-[#17141a] sm:text-[2rem]">Accounts and Opportunities</h1>
            <p className="mt-2 text-sm leading-6 text-[#6f6a75]">Track contractor and developer accounts, their contacts, and every project opportunity underneath them.</p>
          </div>
        </div>

        <div className="grid gap-4 px-5 py-5 sm:px-6 sm:grid-cols-2 xl:grid-cols-4">
          <CrmMetric label="Accounts" value={String(accounts.length)} note="Contractors, developers, and partner companies under management." />
          <CrmMetric label="New Leads" value={String(newLeadCount)} note="Fresh opportunities that have just entered the pipeline." />
          <CrmMetric label="Bids / Negotiation" value={String(bidCount)} note="Opportunities in pricing, bidding, or commercial discussion." />
          <CrmMetric label="Awarded / Closed" value={String(awardedCount + completedCount)} note="Work that has advanced beyond the bidding stage." />
        </div>
      </section>

      <CrmTable accounts={accounts} opportunities={opportunities} />
    </div>
  );
}
