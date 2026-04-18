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

function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 self-start rounded-full border border-[#f0d4d7] bg-white px-4 py-2.5 text-sm font-medium text-[var(--brand)] shadow-[0_10px_22px_rgba(35,31,32,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand)] hover:bg-[#fff7f7] hover:shadow-[0_14px_28px_rgba(237,35,37,0.12)]"
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#fff1f1] text-[var(--brand)] transition duration-200 group-hover:-translate-x-0.5 group-hover:bg-[var(--brand)] group-hover:text-white">
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3.5 w-3.5 fill-none stroke-current">
          <path d="M11.5 4.5 6 10l5.5 5.5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span>{label}</span>
    </Link>
  );
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
            <BackLink href={getAdminRoute("/crm")} label="Back to CRM" />
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
