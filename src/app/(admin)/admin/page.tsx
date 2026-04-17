import Link from "next/link";
import { CrmCalendar } from "@/components/admin/crm-calendar";
import { getAdminRoute } from "@/lib/admin-path";
import { getCategories } from "@/services/category.service";
import { getProjectLeads } from "@/services/project-lead.service";
import { getProducts } from "@/services/product.service";

function MetricLink({
  label,
  value,
  note,
  href,
  cta,
}: {
  label: string;
  value: string;
  note: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(35,31,32,0.08)]"
    >
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[#17141a]">{value}</p>
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
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-[11px] uppercase tracking-[0.22em] text-[#9793a0]">{title}</h2>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function formatCurrency(value: number | null) {
  if (value === null) return "-";
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AdminDashboardPage() {
  const [products, categories, projectLeads] = await Promise.all([getProducts(), getCategories(), getProjectLeads()]);
  const recentProducts = products.slice(0, 5);
  const activeProjects = projectLeads.filter((lead) => lead.status === "ongoing").length;
  const quotationProjects = projectLeads.filter((lead) => lead.status === "quotation_in_progress" || lead.status === "quotation_sent").length;
  const recentLeads = projectLeads.slice(0, 5);
  const quotationWatchlist = projectLeads
    .filter((lead) => lead.status === "quotation_in_progress" || lead.status === "quotation_sent")
    .slice(0, 5);
  const imageCoverageCount = products.filter((product) => product.imageUrl).length;
  const imageCoverageRate = products.length > 0 ? Math.round((imageCoverageCount / products.length) * 100) : 0;
  const brandCoverage = new Set(products.map((product) => product.brandName)).size;
  const categoryCoverage = new Set(products.map((product) => product.category)).size;
  const statusSummary = [
    { label: "New leads", value: projectLeads.filter((lead) => lead.status === "new_lead").length, tone: "bg-[#eefaf2] text-[#2d7f54]" },
    { label: "Quotation", value: quotationProjects, tone: "bg-[#fff7ea] text-[#9a5b12]" },
    { label: "Ongoing", value: activeProjects, tone: "bg-[#eef4ff] text-[#2859b8]" },
    { label: "Completed", value: projectLeads.filter((lead) => lead.status === "completed").length, tone: "bg-[#ebf8ee] text-[#1f7a3d]" },
  ];

  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-[#e3e7f0] bg-white shadow-[0_14px_30px_rgba(35,31,32,0.04)]">
        <div className="border-b border-[#edf0f6] bg-[#fafbfe] px-6 py-5 sm:px-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#9793a0]">Dashboard</p>
              <h1 className="mt-3 text-[2.15rem] font-semibold tracking-tight text-[#17141a]">Operations Overview</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f6a75]">
                A software-style workspace overview of catalog activity, CRM workload, and the areas that need attention next.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={getAdminRoute("/products/new")}
                className="inline-flex items-center justify-center rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_24px_rgba(237,35,37,0.18)] transition hover:bg-[#c81a1d]"
              >
                Add Product
              </Link>
              <Link
                href={getAdminRoute("/crm/new")}
                className="inline-flex items-center justify-center rounded-xl border border-[#e7e9f2] bg-white px-5 py-3 text-sm font-medium text-[#17141a] transition hover:border-[#d9dce8] hover:text-[var(--brand)]"
              >
                New CRM Project
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-[#edf0f6] px-6 py-3 sm:px-7">
          <span className="inline-flex items-center rounded-full bg-[#17141a] px-3 py-1.5 text-xs font-medium text-white">Workspace home</span>
          <span className="inline-flex items-center rounded-full border border-[#e4e7ef] bg-white px-3 py-1.5 text-xs font-medium text-[#6f6a75]">
            {activeProjects} ongoing projects
          </span>
          <span className="inline-flex items-center rounded-full border border-[#e4e7ef] bg-white px-3 py-1.5 text-xs font-medium text-[#6f6a75]">
            {quotationProjects} in quotation flow
          </span>
        </div>

        <div className="grid gap-4 px-6 py-5 sm:px-7 lg:grid-cols-3">
          <MetricLink
            label="Products"
            value={String(products.length)}
            note={products.length > 0 ? "Catalog entries available." : "No products added yet."}
            href={getAdminRoute("/products")}
            cta="Open products"
          />
          <MetricLink
            label="Categories"
            value={String(categories.length)}
            note="Configured category structure."
            href={getAdminRoute("/categories")}
            cta="Open categories"
          />
          <MetricLink
            label="CRM Projects"
            value={String(projectLeads.length)}
            note={projectLeads.length > 0 ? "Tracked project leads and active jobs." : "No CRM projects added yet."}
            href={getAdminRoute("/crm")}
            cta="Open CRM"
          />
        </div>
      </section>

      <CrmCalendar leads={projectLeads} compact />

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-6">
          <Panel
            title="Recent Products"
            action={
              <Link href={getAdminRoute("/products")} className="text-sm font-medium text-[var(--brand)]">
                View all
              </Link>
            }
          >
            {recentProducts.length > 0 ? (
              <div className="grid gap-0">
                {recentProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={getAdminRoute(`/products/${product.id}`)}
                    className="grid gap-1 border-b border-[#eef0f6] py-4 transition last:border-b-0 hover:translate-x-1"
                  >
                    <span className="font-medium text-[#17141a]">{product.name}</span>
                    <span className="text-sm text-[#6f6a75]">{product.productCode} - {product.brandName} - {product.category}</span>
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
        </div>

        <div className="grid gap-6">
          <Panel
            title="CRM Pipeline Snapshot"
            action={
              <Link href={getAdminRoute("/crm")} className="text-sm font-medium text-[var(--brand)]">
                Open CRM
              </Link>
            }
          >
            <div className="grid gap-3">
              {statusSummary.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 rounded-[1.1rem] border border-[#eef0f6] bg-white px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] ${item.tone}`}>
                      {item.label}
                    </span>
                  </div>
                  <span className="text-lg font-semibold tracking-tight text-[#17141a]">{item.value}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            title="Quotation Watchlist"
            action={
              <Link href={getAdminRoute("/crm")} className="text-sm font-medium text-[var(--brand)]">
                Review all
              </Link>
            }
          >
            {quotationWatchlist.length > 0 ? (
              <div className="grid gap-0">
                {quotationWatchlist.map((lead) => (
                  <Link
                    key={lead.id}
                    href={getAdminRoute(`/crm/${lead.id}`)}
                    className="grid gap-1 border-b border-[#eef0f6] py-4 transition last:border-b-0 hover:translate-x-1"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-[#17141a]">{lead.projectName}</span>
                      <span className="rounded-full bg-[#fff7ea] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#9a5b12]">
                        {lead.status.replaceAll("_", " ")}
                      </span>
                    </div>
                    <span className="text-sm text-[#6f6a75]">
                      {lead.clientName} · {lead.location || "No location"} · {formatCurrency(lead.estimatedCost)}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#6f6a75]">No records are currently in quotation stage.</p>
            )}
          </Panel>

          <Panel
            title="Recently Updated Projects"
            action={
              <Link href={getAdminRoute("/crm")} className="text-sm font-medium text-[var(--brand)]">
                View pipeline
              </Link>
            }
          >
            {recentLeads.length > 0 ? (
              <div className="grid gap-0">
                {recentLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={getAdminRoute(`/crm/${lead.id}`)}
                    className="grid gap-1 border-b border-[#eef0f6] py-4 transition last:border-b-0 hover:translate-x-1"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-[#17141a]">{lead.projectName}</span>
                      <span className="text-xs text-[#9793a0]">{formatDate(lead.updatedAt)}</span>
                    </div>
                    <span className="text-sm text-[#6f6a75]">
                      {lead.clientName} · {lead.status.replaceAll("_", " ")}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#6f6a75]">No CRM project activity yet.</p>
            )}
          </Panel>
        </div>
      </section>
    </div>
  );
}
