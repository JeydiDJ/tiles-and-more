import { ReportsWorkspace, type ReportsWorkspaceData } from "@/components/admin/reports-workspace";
import { getAccountingSummary } from "@/lib/accounting";
import { getAdminRoute } from "@/lib/admin-path";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { getAccountingPeriods } from "@/services/accounting.service";
import { getCategories } from "@/services/category.service";
import { getCrmAccounts, getCrmOpportunities } from "@/services/crm.service";
import { getInquiries } from "@/services/inquiry.service";
import { getProducts } from "@/services/product.service";
import { getProjectLeads } from "@/services/project-lead.service";
import { crmOpportunityStages, type CrmOpportunityStage } from "@/types/crm";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-PH").format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatStageLabel(stage: CrmOpportunityStage) {
  return stage.replaceAll("_", " ");
}

export default async function AdminReportsPage() {
  const [products, categories, accounts, opportunities, projectLeads, inquiries] = await Promise.all([
    getProducts(),
    getCategories(),
    getCrmAccounts(),
    getCrmOpportunities(),
    getProjectLeads().catch(() => []),
    getInquiries().catch(() => []),
  ]);

  let accountingReady = hasSupabaseEnv();
  let accountingPeriods = [] as Awaited<ReturnType<typeof getAccountingPeriods>>;

  if (accountingReady) {
    try {
      accountingPeriods = await getAccountingPeriods();
    } catch {
      accountingReady = false;
    }
  }

  const accounting = getAccountingSummary(accountingPeriods);
  const openStages: CrmOpportunityStage[] = ["new_lead", "opportunity", "bidding", "negotiation", "awarded", "ongoing"];
  const openOpportunities = opportunities.filter((item) => openStages.includes(item.stage));
  const pipelineValue = openOpportunities.reduce((sum, item) => sum + (item.estimatedValue ?? 0), 0);
  const quotationPending = opportunities.filter((item) => !item.quotationFinished && openStages.includes(item.stage)).length;
  const completedDeals = opportunities.filter((item) => item.stage === "completed").length;
  const stalledOpportunities = opportunities
    .filter((item) => openStages.includes(item.stage))
    .filter((item) => (Date.now() - new Date(item.updatedAt).getTime()) / (1000 * 60 * 60 * 24) >= 14)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8);

  const productsWithImages = products.filter((item) => item.imageUrl).length;
  const productsWithoutImages = products.length - productsWithImages;
  const imageCoverage = products.length > 0 ? Math.round((productsWithImages / products.length) * 100) : 0;
  const uniqueBrands = new Set(products.map((item) => item.brandName)).size;
  const uniqueFamilies = new Set(products.map((item) => item.productFamilyId)).size;
  const topBrands = Array.from(
    products.reduce((map, product) => {
      map.set(product.brandName, (map.get(product.brandName) ?? 0) + 1);
      return map;
    }, new Map<string, number>()),
  )
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([label, value]) => ({ label, value, helper: `${value} products` }));

  const categoryCoverage = categories.map((category) => {
    const count = products.filter((item) => item.categorySlug === category.slug || item.categoryId === category.id).length;
    return {
      label: category.name,
      value: count,
      helper: count > 0 ? `${count} products mapped` : "No products yet",
    };
  });

  const stageSummary = crmOpportunityStages
    .map((stage) => {
      const items = opportunities.filter((item) => item.stage === stage);
      return {
        stage,
        count: items.length,
        value: items.reduce((sum, item) => sum + (item.estimatedValue ?? 0), 0),
      };
    })
    .filter((item) => item.count > 0);

  const topPipelineAccounts = accounts
    .map((account) => {
      const linked = openOpportunities.filter((item) => item.accountId === account.id);
      return {
        label: account.name,
        value: linked.reduce((sum, item) => sum + (item.estimatedValue ?? 0), 0),
        helper: `${linked.length} open opportunities`,
      };
    })
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const quoteReadyLeads = projectLeads.filter((item) => item.quotationFinished).length;
  const freshLeads = [...projectLeads]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8);
  const freshInquiries = [...inquiries]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 8);
  const leadSourceMap = new Map<string, number>();
  projectLeads.forEach((lead) => {
    const key = lead.source || "manual";
    leadSourceMap.set(key, (leadSourceMap.get(key) ?? 0) + 1);
  });
  inquiries.forEach(() => {
    leadSourceMap.set("website inquiry", (leadSourceMap.get("website inquiry") ?? 0) + 1);
  });
  const leadSources = Array.from(leadSourceMap.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([label, value]) => ({ label, value, helper: `${value} records` }));

  const data: ReportsWorkspaceData = {
    overviewCards: [
      {
        label: "Catalog Entries",
        value: formatCompactNumber(products.length),
        note: `${productsWithImages} with images across ${uniqueBrands} brands.`,
      },
      {
        label: "Open Pipeline",
        value: formatCurrency(pipelineValue),
        note: `${openOpportunities.length} active opportunities in CRM.`,
      },
      {
        label: "Accounting Periods",
        value: formatCompactNumber(accounting.rows.length),
        note: accountingReady ? `${formatCurrency(accounting.totals.latestClosingBalance)} latest closing balance.` : "Accounting tables are not ready yet.",
      },
      {
        label: "Public Leads",
        value: formatCompactNumber(projectLeads.length + inquiries.length),
        note: `${projectLeads.length} tracked project leads and ${inquiries.length} quick inquiries.`,
      },
    ],
    publicSite: {
      summary: [
        {
          label: "Image Coverage",
          value: `${imageCoverage}%`,
          note: `${productsWithoutImages} products still need a main image.`,
        },
        {
          label: "Categories",
          value: formatCompactNumber(categories.length),
          note: "Public-facing category groups currently available.",
        },
        {
          label: "Families",
          value: formatCompactNumber(uniqueFamilies),
          note: "Distinct product families represented in the catalog.",
        },
      ],
      topBrands,
      categoryCoverage,
      catalogDetails: products.slice(0, 10).map((product) => ({
        id: product.id,
        title: product.name,
        subtitle: `${product.brandName} / ${product.category}`,
        meta: product.imageUrl ? "Image ready" : "Missing image",
        href: getAdminRoute(`/products/${product.id}`),
      })),
    },
    crm: {
      summary: [
        {
          label: "Accounts",
          value: formatCompactNumber(accounts.length),
          note: "Tracked client and partner accounts.",
        },
        {
          label: "Opportunities",
          value: formatCompactNumber(opportunities.length),
          note: "All opportunities across the pipeline.",
        },
        {
          label: "Pending Quotes",
          value: formatCompactNumber(quotationPending),
          note: "Open items still missing a finished quotation.",
        },
        {
          label: "Completed",
          value: formatCompactNumber(completedDeals),
          note: "Deals already marked completed.",
        },
      ],
      stageSummary,
      pipelineAccounts: topPipelineAccounts,
      stalledItems: stalledOpportunities.map((item) => ({
        id: item.id,
        title: item.name,
        subtitle: `${item.accountName} / ${formatStageLabel(item.stage)}`,
        meta: `Updated ${formatDate(item.updatedAt)}`,
        href: getAdminRoute(`/crm/opportunities/${item.id}`),
      })),
    },
    accounting: {
      ready: accountingReady,
      summary: [
        {
          label: "Total Cash In",
          value: formatCurrency(accounting.totals.totalCashIn),
          note: "All recorded inflows across saved periods.",
        },
        {
          label: "Total Cash Out",
          value: formatCurrency(accounting.totals.totalCashOut),
          note: "All recorded outflows across saved periods.",
        },
        {
          label: "Net Cash Flow",
          value: formatCurrency(accounting.totals.totalNetCashFlow),
          note: "Overall cash movement across the ledger.",
        },
        {
          label: "Latest Closing",
          value: formatCurrency(accounting.totals.latestClosingBalance),
          note: "Most recent closing balance in the ledger.",
        },
      ],
      periodPerformance: accounting.rows.slice(-8).map((period) => ({
        id: period.id,
        label: period.label,
        closingBalance: period.closingBalance,
        netCashFlow: period.netCashFlow,
      })),
      cashBreakdown: [
        { label: "Cash In", value: accounting.totals.totalCashIn, helper: "All collected and earned inflows" },
        { label: "Cash Out", value: accounting.totals.totalCashOut, helper: "Operations, tax, debt, and capital spend" },
        { label: "Sales", value: accounting.totals.totalSales, helper: "Sales collections only" },
        { label: "Inventory", value: accounting.totals.totalInventory, helper: "Inventory or cost-of-goods outflow" },
      ],
      detailRows: accounting.rows
        .slice()
        .reverse()
        .slice(0, 10)
        .map((period) => ({
          id: period.id,
          title: period.label,
          subtitle: `Net ${formatCurrency(period.netCashFlow)} / Closing ${formatCurrency(period.closingBalance)}`,
          meta: period.periodStart && period.periodEnd ? `${period.periodStart} to ${period.periodEnd}` : "No range set",
          href: getAdminRoute("/accounting"),
        })),
    },
    leads: {
      summary: [
        {
          label: "Project Leads",
          value: formatCompactNumber(projectLeads.length),
          note: `${quoteReadyLeads} leads already marked quotation finished.`,
        },
        {
          label: "Quick Inquiries",
          value: formatCompactNumber(inquiries.length),
          note: "Public contact inquiries captured by the current inquiry service.",
        },
        {
          label: "Lead Sources",
          value: formatCompactNumber(leadSources.length),
          note: "Distinct sources visible across project leads and inquiries.",
        },
        {
          label: "Quote Ready",
          value: formatCompactNumber(quoteReadyLeads),
          note: "Project leads already advanced to quotation complete.",
        },
      ],
      latestLeads: freshLeads.map((lead) => ({
        id: lead.id,
        title: lead.projectName,
        subtitle: `${lead.clientName} / ${lead.company || "No company"}`,
        meta: `Updated ${formatDate(lead.updatedAt)}`,
      })),
      latestInquiries: freshInquiries.map((inquiry) => ({
        id: inquiry.id,
        title: inquiry.name,
        subtitle: `${inquiry.email}${inquiry.phone ? ` / ${inquiry.phone}` : ""}`,
        meta: `Submitted ${formatDate(inquiry.submittedAt)}`,
      })),
      leadSources,
    },
  };

  return <ReportsWorkspace data={data} />;
}
