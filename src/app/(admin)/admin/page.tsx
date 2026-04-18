import Link from "next/link";
import { getAdminRoute } from "@/lib/admin-path";
import { getCrmAccounts, getCrmOpportunities } from "@/services/crm.service";
import { getProducts } from "@/services/product.service";
import { crmOpportunityStages, type CrmOpportunityStage } from "@/types/crm";

function MetricLink({
  label,
  value,
  note,
  href,
  cta,
  className,
  valueClassName,
}: {
  label: string;
  value: string;
  note: string;
  href: string;
  cta: string;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <Link href={href} className={`block rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(35,31,32,0.08)] ${className ?? ""}`}>
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">{label}</p>
      <p className={`mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#17141a] ${valueClassName ?? ""}`}>{value}</p>
      <p className="mt-2 text-sm text-[#6f6a75]">{note}</p>
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand)]">{cta}</p>
    </Link>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-[11px] uppercase tracking-[0.22em] text-[#9793a0]">{title}</h2>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function formatCurrency(value: number | null) {
  if (value === null) return "-";
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function formatStageLabel(stage: CrmOpportunityStage) {
  return stage.replaceAll("_", " ");
}

function getStageTone(stage: CrmOpportunityStage) {
  const tones: Record<CrmOpportunityStage, string> = {
    new_lead: "bg-[#16a34a] text-white shadow-[0_10px_18px_rgba(22,163,74,0.18)]",
    opportunity: "bg-[#0f766e] text-white shadow-[0_10px_18px_rgba(15,118,110,0.18)]",
    bidding: "bg-[#7c3aed] text-white shadow-[0_10px_18px_rgba(124,58,237,0.18)]",
    negotiation: "bg-[#ea580c] text-white shadow-[0_10px_18px_rgba(234,88,12,0.18)]",
    awarded: "bg-[#2563eb] text-white shadow-[0_10px_18px_rgba(37,99,235,0.18)]",
    ongoing: "bg-[#db2777] text-white shadow-[0_10px_18px_rgba(219,39,119,0.18)]",
    completed: "bg-[#17141a] text-white shadow-[0_10px_18px_rgba(23,20,26,0.16)]",
    lost: "bg-[#b91c1c] text-white shadow-[0_10px_18px_rgba(185,28,28,0.18)]",
  };
  return tones[stage];
}

export default async function AdminDashboardPage() {
  const [products, accounts, opportunities] = await Promise.all([
    getProducts(),
    getCrmAccounts(),
    getCrmOpportunities(),
  ]);

  const recentProducts = products.slice(0, 5);
  const imageCoverageCount = products.filter((product) => product.imageUrl).length;
  const imageCoverageRate = products.length > 0 ? Math.round((imageCoverageCount / products.length) * 100) : 0;
  const brandCoverage = new Set(products.map((product) => product.brandName)).size;
  const categoryCoverage = new Set(products.map((product) => product.category)).size;
  const openStages: CrmOpportunityStage[] = ["new_lead", "opportunity", "bidding", "negotiation", "awarded", "ongoing"];
  const attentionStages: CrmOpportunityStage[] = ["new_lead", "opportunity", "bidding", "negotiation", "awarded", "ongoing"];
  // Server-rendered snapshot used only to flag items that have gone quiet.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const opportunitiesByUpdatedDate = [...opportunities].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const openOpportunities = opportunities.filter((item) => openStages.includes(item.stage));
  const quotationProjects = opportunities.filter((item) => item.stage === "bidding" || item.stage === "negotiation").length;
  const pipelineValue = openOpportunities.reduce((total, item) => total + (item.estimatedValue ?? 0), 0);
  const quotationWatchlist = opportunities
    .filter((item) => attentionStages.includes(item.stage) && !item.quotationFinished)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);
  const awaitingQuotationCount = quotationWatchlist.length;
  const stalledOpportunities = opportunitiesByUpdatedDate
    .filter((item) => attentionStages.includes(item.stage) && (now - new Date(item.updatedAt).getTime()) / (1000 * 60 * 60 * 24) >= 14)
    .slice(0, 5);
  const stalledOpportunityCount = stalledOpportunities.length;
  const stageValueSummary = crmOpportunityStages
    .map((stage) => {
      const stageItems = opportunities.filter((item) => item.stage === stage);
      return {
        stage,
        count: stageItems.length,
        value: stageItems.reduce((total, item) => total + (item.estimatedValue ?? 0), 0),
      };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.value - a.value || b.count - a.count);
  const highestStageValue = stageValueSummary[0]?.value ?? 0;
  const topAccountsByPipeline = accounts
    .map((account) => {
      const linkedOpportunities = openOpportunities.filter((item) => item.accountId === account.id);
      return {
        id: account.id,
        name: account.name,
        opportunityCount: linkedOpportunities.length,
        value: linkedOpportunities.reduce((total, item) => total + (item.estimatedValue ?? 0), 0),
        updatedAt: account.updatedAt,
      };
    })
    .filter((account) => account.opportunityCount > 0)
    .sort((a, b) => b.value - a.value || b.opportunityCount - a.opportunityCount)
    .slice(0, 5);
  const recentCrmActivity = opportunitiesByUpdatedDate.slice(0, 6);

  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-[#e3e7f0] bg-white shadow-[0_14px_30px_rgba(35,31,32,0.04)]">
        <div className="border-b border-[#edf0f6] bg-[#fafbfe] px-4 py-5 sm:px-6 lg:px-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#9793a0]">Dashboard</p>
              <h1 className="mt-3 text-[1.8rem] font-semibold tracking-tight text-[#17141a] sm:text-[2.15rem]">Operations Overview</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6f6a75] sm:leading-7">
                A cleaner operations view for catalog activity, pipeline value, and the CRM items that need attention.
              </p>
            </div>

            <div className="grid gap-3 sm:flex sm:flex-wrap">
              <Link href={getAdminRoute("/products/new")} className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_24px_rgba(237,35,37,0.18)] transition hover:bg-[#c81a1d] sm:w-auto">
                Add Product
              </Link>
              <Link href={getAdminRoute("/crm/new")} className="inline-flex w-full items-center justify-center rounded-xl border border-[#e7e9f2] bg-white px-5 py-3 text-sm font-medium text-[#17141a] transition hover:border-[#d9dce8] hover:text-[var(--brand)] sm:w-auto">
                New Account
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-[#edf0f6] px-4 py-3 sm:px-6 lg:px-7">
          <span className="inline-flex items-center rounded-full bg-[#17141a] px-3 py-1.5 text-xs font-medium text-white">Workspace home</span>
          <span className="inline-flex items-center rounded-full border border-[#e4e7ef] bg-white px-3 py-1.5 text-xs font-medium text-[#6f6a75]">
            {accounts.length} active accounts
          </span>
          <span className="inline-flex items-center rounded-full border border-[#e4e7ef] bg-white px-3 py-1.5 text-xs font-medium text-[#6f6a75]">
            {quotationProjects} in bid / negotiation
          </span>
        </div>

        <div className="grid gap-4 px-4 py-5 sm:px-6 lg:px-7 lg:grid-cols-3 xl:grid-cols-6">
          <MetricLink label="Products" value={String(products.length)} note={products.length > 0 ? "Catalog entries available." : "No products added yet."} href={getAdminRoute("/products")} cta="Open products" />
          <MetricLink label="CRM Accounts" value={String(accounts.length)} note={accounts.length > 0 ? `${opportunities.length} linked opportunities across the account base.` : "No CRM accounts added yet."} href={getAdminRoute("/crm")} cta="Open CRM" />
          <MetricLink label="Pipeline Value" value={formatCurrency(pipelineValue)} note="Estimated value across open opportunities." href={getAdminRoute("/crm")} cta="Review pipeline" className="xl:col-span-2" valueClassName="whitespace-nowrap text-[1.65rem] sm:text-[1.9rem]" />
          <MetricLink label="Awaiting Quotation" value={String(awaitingQuotationCount)} note={awaitingQuotationCount > 0 ? "Open items still missing a finished quotation." : "No quotation bottlenecks right now."} href={getAdminRoute("/crm")} cta="Check watchlist" />
          <MetricLink label="Stalled Deals" value={String(stalledOpportunityCount)} note={stalledOpportunityCount > 0 ? "No CRM updates in the last 14 days." : "Recent activity looks healthy."} href={getAdminRoute("/crm")} cta="Inspect stalled" />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-6">
          <Panel title="Recent Products" action={<Link href={getAdminRoute("/products")} className="text-sm font-medium text-[var(--brand)]">View all</Link>}>
            {recentProducts.length > 0 ? (
              <div className="grid gap-0">
                {recentProducts.map((product) => (
                  <Link key={product.id} href={getAdminRoute(`/products/${product.id}`)} className="grid gap-1 border-b border-[#eef0f6] py-4 transition last:border-b-0 hover:translate-x-1">
                    <span className="font-medium text-[#17141a]">{product.name}</span>
                    <span className="text-sm text-[#6f6a75]">{product.productCode} / {product.brandName} / {product.category}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="border-b border-[#eef0f6] py-4 text-sm text-[#6f6a75]">No products added yet.</div>
            )}
          </Panel>

          <Panel title="Catalog Health">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.2rem] border border-[#eef0f6] bg-[#fafbfe] p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Image Coverage</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-[#17141a]">{imageCoverageRate}%</p>
                <p className="mt-2 text-sm text-[#6f6a75]">{imageCoverageCount} of {products.length} products have main images.</p>
              </div>
              <div className="rounded-[1.2rem] border border-[#eef0f6] bg-[#fafbfe] p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Brand Coverage</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-[#17141a]">{brandCoverage}</p>
                <p className="mt-2 text-sm text-[#6f6a75]">Brands currently represented in the catalog.</p>
              </div>
              <div className="rounded-[1.2rem] border border-[#eef0f6] bg-[#fafbfe] p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Category Coverage</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-[#17141a]">{categoryCoverage}</p>
                <p className="mt-2 text-sm text-[#6f6a75]">Product groups available for filtering and browsing.</p>
              </div>
            </div>
          </Panel>

          <Panel title="Top Accounts by Pipeline" action={<Link href={getAdminRoute("/crm")} className="text-sm font-medium text-[var(--brand)]">Open accounts</Link>}>
            {topAccountsByPipeline.length > 0 ? (
              <div className="grid gap-3">
                {topAccountsByPipeline.map((account) => (
                  <Link key={account.id} href={getAdminRoute(`/crm/${account.id}`)} className="rounded-[1.15rem] border border-[#eef0f6] bg-[#fafbfe] px-4 py-4 transition hover:-translate-y-0.5 hover:border-[#dfe4f1] hover:shadow-[0_16px_30px_rgba(35,31,32,0.06)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-[#17141a]">{account.name}</p>
                        <p className="mt-1 text-sm text-[#6f6a75]">{account.opportunityCount} open {account.opportunityCount === 1 ? "opportunity" : "opportunities"}</p>
                      </div>
                      <span className="text-sm font-semibold text-[#17141a]">{formatCurrency(account.value)}</span>
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[#9793a0]">Updated {formatDate(account.updatedAt)}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#6f6a75]">No account pipeline activity yet.</p>
            )}
          </Panel>

          <Panel title="Recent CRM Activity" action={<Link href={getAdminRoute("/crm")} className="text-sm font-medium text-[var(--brand)]">View pipeline</Link>}>
            {recentCrmActivity.length > 0 ? (
              <div className="grid gap-0">
                {recentCrmActivity.map((item) => (
                  <Link key={item.id} href={getAdminRoute(`/crm/opportunities/${item.id}`)} className="grid gap-2 border-b border-[#eef0f6] py-4 transition last:border-b-0 hover:translate-x-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-[#17141a]">{item.name}</span>
                      <span className="text-xs text-[#9793a0]">{formatDate(item.updatedAt)}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${getStageTone(item.stage)}`}>{formatStageLabel(item.stage)}</span>
                      <span className="text-sm text-[#6f6a75]">{item.accountName} · {item.location || "No location"}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#6f6a75]">No CRM opportunity activity yet.</p>
            )}
          </Panel>
        </div>

        <div className="grid gap-6">
          <Panel title="CRM Pipeline Snapshot" action={<Link href={getAdminRoute("/crm")} className="text-sm font-medium text-[var(--brand)]">Open CRM</Link>}>
            {stageValueSummary.length > 0 ? (
              <div className="grid gap-3">
                {stageValueSummary.map((item) => (
                  <div key={item.stage} className="rounded-[1.1rem] border border-[#eef0f6] bg-white px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] ${getStageTone(item.stage)}`}>{formatStageLabel(item.stage)}</span>
                      <span className="text-sm font-semibold tracking-tight text-[#17141a]">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-4">
                      <span className="text-sm text-[#6f6a75]">{item.count} {item.count === 1 ? "opportunity" : "opportunities"}</span>
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-[#edf0f6]">
                        <div
                          className="h-full rounded-full bg-[var(--brand)] transition-[width] duration-300"
                          style={{ width: `${highestStageValue > 0 ? Math.max((item.value / highestStageValue) * 100, 12) : 12}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#6f6a75]">No CRM opportunities have been added yet.</p>
            )}
          </Panel>

          <Panel title="Quotation Watchlist" action={<Link href={getAdminRoute("/crm")} className="text-sm font-medium text-[var(--brand)]">Review all</Link>}>
            {quotationWatchlist.length > 0 ? (
              <div className="grid gap-0">
                {quotationWatchlist.map((item) => (
                  <Link key={item.id} href={getAdminRoute(`/crm/opportunities/${item.id}`)} className="grid gap-1 border-b border-[#eef0f6] py-4 transition last:border-b-0 hover:translate-x-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-[#17141a]">{item.name}</span>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${getStageTone(item.stage)}`}>{formatStageLabel(item.stage)}</span>
                    </div>
                    <span className="text-sm text-[#6f6a75]">{item.accountName} · {item.location || "No location"} · {formatCurrency(item.estimatedValue)}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#6f6a75]">No opportunities are currently waiting on quotation work.</p>
            )}
          </Panel>

          <Panel title="Stalled Opportunities" action={<Link href={getAdminRoute("/crm")} className="text-sm font-medium text-[var(--brand)]">Open CRM</Link>}>
            {stalledOpportunities.length > 0 ? (
              <div className="grid gap-0">
                {stalledOpportunities.map((item) => (
                  <Link key={item.id} href={getAdminRoute(`/crm/opportunities/${item.id}`)} className="grid gap-1 border-b border-[#eef0f6] py-4 transition last:border-b-0 hover:translate-x-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-[#17141a]">{item.name}</span>
                      <span className="text-xs text-[#9793a0]">{formatDate(item.updatedAt)}</span>
                    </div>
                    <span className="text-sm text-[#6f6a75]">{item.accountName} · {formatStageLabel(item.stage)}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#6f6a75]">No open opportunities have gone quiet for 14 days or more.</p>
            )}
          </Panel>
        </div>
      </section>
    </div>
  );
}
