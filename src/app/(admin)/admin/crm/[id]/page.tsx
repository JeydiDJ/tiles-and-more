import Link from "next/link";
import { notFound } from "next/navigation";
import { CrmAccountDetail } from "@/components/admin/crm-account-detail";
import { getAdminRoute } from "@/lib/admin-path";
import { getCrmAccountById, getCrmContacts, getCrmOpportunities } from "@/services/crm.service";

function formatCurrency(value: number | null) {
  if (value === null) return "-";
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default async function AdminCrmAccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [account, contacts, opportunities] = await Promise.all([getCrmAccountById(id), getCrmContacts(id), getCrmOpportunities(id)]);

  if (!account) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-[#e7e9f2] bg-white shadow-[0_14px_30px_rgba(35,31,32,0.04)]">
        <div className="border-b border-[#edf0f6] bg-[#fafbfe] px-6 py-6 sm:px-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#9793a0]">Account</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#17141a] sm:text-[2.6rem]">{account.name}</h1>
              <p className="mt-3 text-sm text-[#6f6a75]">{[account.city, account.industry, account.phone || account.email].filter(Boolean).join(" - ") || "No account details yet."}</p>
            </div>
            <Link href={getAdminRoute("/crm")} className="text-sm font-medium text-[var(--brand)] transition hover:text-[var(--brand-dark)]">
              Back to CRM
            </Link>
          </div>
        </div>

        <div className="grid gap-4 px-6 py-6 sm:px-7 md:grid-cols-4">
          <div className="rounded-[1.25rem] border border-[#e7e9f2] bg-[#fafbfe] p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Contacts</p>
            <p className="mt-3 text-lg font-semibold tracking-tight text-[#17141a]">{contacts.length}</p>
          </div>
          <div className="rounded-[1.25rem] border border-[#e7e9f2] bg-[#fafbfe] p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Open Opportunities</p>
            <p className="mt-3 text-lg font-semibold tracking-tight text-[#17141a]">{opportunities.filter((item) => item.stage !== "completed" && item.stage !== "lost").length}</p>
          </div>
          <div className="rounded-[1.25rem] border border-[#e7e9f2] bg-[#fafbfe] p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Negotiation / Bidding</p>
            <p className="mt-3 text-lg font-semibold tracking-tight text-[#17141a]">{opportunities.filter((item) => item.stage === "bidding" || item.stage === "negotiation").length}</p>
          </div>
          <div className="rounded-[1.25rem] border border-[#e7e9f2] bg-[#fafbfe] p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Pipeline Value</p>
            <p className="mt-3 text-lg font-semibold tracking-tight text-[#17141a]">{formatCurrency(opportunities.reduce((sum, item) => sum + (item.estimatedValue ?? 0), 0))}</p>
          </div>
        </div>
      </section>

      <CrmAccountDetail account={account} contacts={contacts} opportunities={opportunities} />
    </div>
  );
}
