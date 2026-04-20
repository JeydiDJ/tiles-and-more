"use client";

import { type ReactNode, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getAdminRoute } from "@/lib/admin-path";
import { cn } from "@/lib/utils";
import type { CrmOpportunityStage } from "@/types/crm";

type SummaryCard = {
  label: string;
  value: string;
  note: string;
};

type RankedItem = {
  label: string;
  value: number;
  helper?: string;
};

type DatedItem = {
  id: string;
  title: string;
  subtitle: string;
  meta?: string;
  href?: string;
};

type StageItem = {
  stage: CrmOpportunityStage;
  count: number;
  value: number;
};

type PeriodItem = {
  id: string;
  label: string;
  closingBalance: number;
  netCashFlow: number;
};

export type ReportsWorkspaceData = {
  overviewCards: SummaryCard[];
  publicSite: {
    summary: SummaryCard[];
    topBrands: RankedItem[];
    categoryCoverage: RankedItem[];
    catalogDetails: DatedItem[];
  };
  crm: {
    summary: SummaryCard[];
    stageSummary: StageItem[];
    pipelineAccounts: RankedItem[];
    stalledItems: DatedItem[];
  };
  accounting: {
    ready: boolean;
    summary: SummaryCard[];
    periodPerformance: PeriodItem[];
    cashBreakdown: RankedItem[];
    detailRows: DatedItem[];
  };
  leads: {
    summary: SummaryCard[];
    latestLeads: DatedItem[];
    latestInquiries: DatedItem[];
    leadSources: RankedItem[];
  };
};

type ReportsWorkspaceProps = {
  data: ReportsWorkspaceData;
};

type ReportTab = "overview" | "public" | "crm" | "accounting" | "leads";
type RankedChartView = "bar" | "line" | "donut";
type StageChartView = "bar" | "column" | "line";
type TrendChartView = "line" | "bar";

const STAGE_COLORS: Record<CrmOpportunityStage, string> = {
  new_lead: "#16a34a",
  opportunity: "#0f766e",
  bidding: "#7c3aed",
  negotiation: "#ea580c",
  awarded: "#2563eb",
  ongoing: "#db2777",
  completed: "#475569",
  lost: "#b91c1c",
};

const CHART_SERIES_COLORS = ["#ed2325", "#2563eb", "#0f8a43", "#7c3aed", "#0f766e", "#ea580c", "#db2777", "#14b8a6"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatStageLabel(stage: string) {
  return stage.replaceAll("_", " ");
}

function getStageTone(stage: CrmOpportunityStage) {
  return `bg-[${STAGE_COLORS[stage]}]`;
}

function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <h2 className="text-[11px] uppercase tracking-[0.22em] text-[#9793a0]">{title}</h2>
      {action}
    </div>
  );
}

function ReportCard({ label, value, note }: SummaryCard) {
  return (
    <div className="rounded-[1.2rem] border border-[#eef0f6] bg-white p-4 shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">{label}</p>
      <p className="mt-2 text-[1.65rem] font-semibold tracking-tight text-[#17141a]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#6f6a75]">{note}</p>
    </div>
  );
}

function ReportPanel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
      <SectionTitle title={title} action={action} />
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ChartFrame({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="admin-report-chart-frame rounded-[1.1rem] border border-[#eef0f6] bg-[#fafbfe] p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#17141a]">{title}</p>
          {subtitle ? <p className="mt-1 text-sm text-[#6f6a75]">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function ChartViewToggle<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<{ label: string; value: T }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-[#e4e7ef] bg-white p-1 shadow-[0_8px_18px_rgba(35,31,32,0.05)]">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition",
            value === option.value
              ? "bg-[#17141a] text-white"
              : "text-[#6f6a75] hover:bg-[#f3f5f9] hover:text-[#17141a]",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: {
  active?: boolean;
  payload?: Array<{ value?: number | string; name?: string; color?: string }>;
  label?: string;
  valueFormatter?: (value: number) => string;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="admin-report-tooltip rounded-xl border border-[#e7e9f2] bg-white px-3 py-2 shadow-[0_10px_24px_rgba(35,31,32,0.08)]">
      {label ? <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#9793a0]">{label}</p> : null}
      <div className="mt-1 grid gap-1">
        {payload.map((entry) => (
          <div key={`${entry.name}-${entry.value}`} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color ?? "#ed2325" }} />
            <span className="text-[#6f6a75]">{entry.name}</span>
            <span className="font-medium text-[#17141a]">
              {typeof entry.value === "number" && valueFormatter ? valueFormatter(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RechartsBarChart({
  items,
  title,
  subtitle,
  color = "var(--admin-chart-brand)",
  formatValue,
}: {
  items: RankedItem[];
  title: string;
  subtitle?: string;
  color?: string;
  formatValue?: (value: number) => string;
}) {
  const [view, setView] = useState<RankedChartView>("bar");

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      action={
        <ChartViewToggle
          value={view}
          onChange={setView}
          options={[
            { label: "Bar", value: "bar" },
            { label: "Line", value: "line" },
            { label: "Donut", value: "donut" },
          ]}
        />
      }
    >
      {items.length > 0 ? (
        <>
          {view === "bar" ? (
            <div className="admin-report-chart h-[20rem]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={items}
                  layout="vertical"
                  margin={{ top: 8, right: 20, left: 20, bottom: 8 }}
                  barCategoryGap={18}
                >
                  <CartesianGrid stroke="#edf0f6" strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: "#8b8791", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={110}
                    tick={{ fill: "#6f6a75", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--admin-chart-cursor)" }}
                    content={<ChartTooltip valueFormatter={formatValue} />}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} fill={color} name={title}>
                    {items.map((item) => (
                      <Cell key={item.label} fill={color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : view === "line" ? (
            <div className="admin-report-chart h-[20rem]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={items} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                  <CartesianGrid stroke="#edf0f6" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#6f6a75", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#8b8791", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip valueFormatter={formatValue} />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name={title}
                    stroke={color}
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: "var(--admin-chart-dot-fill)" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
              <div className="admin-report-chart h-[18rem]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<ChartTooltip valueFormatter={formatValue} />} />
                    <Pie
                      data={items}
                      dataKey="value"
                      nameKey="label"
                      innerRadius={58}
                      outerRadius={88}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {items.map((item, index) => (
                        <Cell key={item.label} fill={CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid gap-2">
                {items.map((item, index) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 rounded-[0.95rem] border border-[#eef0f6] bg-white px-3 py-3 text-sm">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length] }}
                      />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[#17141a]">{item.label}</p>
                        {item.helper ? <p className="truncate text-xs text-[#6f6a75]">{item.helper}</p> : null}
                      </div>
                    </div>
                    <span className="shrink-0 font-medium text-[#17141a]">
                      {formatValue ? formatValue(item.value) : item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4 grid gap-2">
            {items.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4 text-sm">
                <div className="min-w-0">
                  <span className="font-medium text-[#17141a]">{item.label}</span>
                  {item.helper ? <span className="ml-2 text-[#6f6a75]">{item.helper}</span> : null}
                </div>
                <span className="shrink-0 font-medium text-[#17141a]">{formatValue ? formatValue(item.value) : item.value}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-[#6f6a75]">No chart data available.</p>
      )}
    </ChartFrame>
  );
}

function RechartsStageChart({
  items,
  title,
  subtitle,
}: {
  items: StageItem[];
  title: string;
  subtitle?: string;
}) {
  return (
    <ChartFrame title={title} subtitle={subtitle}>
      {items.length > 0 ? (
        <>
          <div className="admin-report-chart h-[20rem]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={items} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid stroke="#edf0f6" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="stage"
                  tickFormatter={formatStageLabel}
                  tick={{ fill: "#6f6a75", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "#8b8791", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "#8b8791", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<ChartTooltip valueFormatter={formatCurrency} />}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="count" name="Opportunities" radius={[8, 8, 0, 0]}>
                  {items.map((item) => (
                    <Cell
                      key={`${item.stage}-count`}
                      fill={STAGE_COLORS[item.stage]}
                    />
                  ))}
                </Bar>
                <Bar yAxisId="right" dataKey="value" name="Value" radius={[8, 8, 0, 0]} fill="#17141a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid gap-2">
            {items.map((item) => (
              <div key={item.stage} className="flex items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className={cn("h-3 w-3 rounded-full", getStageTone(item.stage))} />
                  <span className="font-medium text-[#17141a]">{formatStageLabel(item.stage)}</span>
                </div>
                <span className="text-[#6f6a75]">
                  {item.count} / {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-[#6f6a75]">No chart data available.</p>
      )}
    </ChartFrame>
  );
}

function RechartsStageMetricChart({
  items,
  title,
  subtitle,
  metric,
}: {
  items: StageItem[];
  title: string;
  subtitle?: string;
  metric: "count" | "value";
}) {
  const [view, setView] = useState<StageChartView>("bar");
  const formattedItems = items.map((item) => ({
    label: formatStageLabel(item.stage),
    value: metric === "count" ? item.count : item.value,
    helper:
      metric === "count"
        ? `${formatCurrency(item.value)} in pipeline`
        : `${item.count} opportunities`,
    color: STAGE_COLORS[item.stage],
  }));

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      action={
        <ChartViewToggle
          value={view}
          onChange={setView}
          options={[
            { label: "Bar", value: "bar" },
            { label: "Column", value: "column" },
            { label: "Line", value: "line" },
          ]}
        />
      }
    >
      {formattedItems.length > 0 ? (
        <>
          {view === "bar" ? (
            <div className="admin-report-chart h-[20rem]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={formattedItems}
                  layout="vertical"
                  margin={{ top: 8, right: 20, left: 18, bottom: 8 }}
                  barCategoryGap={18}
                >
                  <CartesianGrid stroke="#edf0f6" strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: "#8b8791", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={metric === "value" ? (value: number) => formatCurrency(value) : undefined}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={120}
                    tick={{ fill: "#6f6a75", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--admin-chart-cursor)" }}
                    content={<ChartTooltip valueFormatter={metric === "value" ? formatCurrency : undefined} />}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} name={metric === "count" ? "Opportunities" : "Pipeline Value"}>
                    {formattedItems.map((item) => (
                      <Cell key={item.label} fill={item.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : view === "column" ? (
            <div className="admin-report-chart h-[20rem]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedItems} margin={{ top: 8, right: 12, left: 4, bottom: 8 }}>
                  <CartesianGrid stroke="#edf0f6" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#6f6a75", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#8b8791", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={metric === "value" ? (value: number) => formatCurrency(value) : undefined}
                  />
                  <Tooltip content={<ChartTooltip valueFormatter={metric === "value" ? formatCurrency : undefined} />} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} name={metric === "count" ? "Opportunities" : "Pipeline Value"}>
                    {formattedItems.map((item) => (
                      <Cell key={item.label} fill={item.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="admin-report-chart h-[20rem]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedItems} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                  <CartesianGrid stroke="#edf0f6" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#6f6a75", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#8b8791", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={metric === "value" ? (value: number) => formatCurrency(value) : undefined}
                  />
                  <Tooltip content={<ChartTooltip valueFormatter={metric === "value" ? formatCurrency : undefined} />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name={metric === "count" ? "Opportunities" : "Pipeline Value"}
                    stroke="var(--admin-chart-neutral)"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: "var(--admin-chart-dot-fill)" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="mt-4 grid gap-2">
            {formattedItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-[#17141a]">{item.label}</span>
                  {item.helper ? <span className="text-[#6f6a75]">{item.helper}</span> : null}
                </div>
                <span className="shrink-0 font-medium text-[#17141a]">
                  {metric === "value" ? formatCurrency(item.value) : item.value}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-[#6f6a75]">No chart data available.</p>
      )}
    </ChartFrame>
  );
}

function RechartsLineChart({
  items,
  title,
  subtitle,
}: {
  items: PeriodItem[];
  title: string;
  subtitle?: string;
}) {
  const [view, setView] = useState<TrendChartView>("line");
  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      action={
        <ChartViewToggle
          value={view}
          onChange={setView}
          options={[
            { label: "Line", value: "line" },
            { label: "Bar", value: "bar" },
          ]}
        />
      }
    >
      {items.length > 0 ? (
        <>
          {view === "line" ? (
            <div className="admin-report-chart h-[20rem]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={items} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                  <CartesianGrid stroke="#edf0f6" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#6f6a75", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#8b8791", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value: number) => formatCurrency(value)}
                  />
                  <Tooltip content={<ChartTooltip valueFormatter={formatCurrency} />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="closingBalance"
                    name="Closing Balance"
                    stroke="var(--admin-chart-positive)"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: "var(--admin-chart-dot-fill)" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="netCashFlow"
                    name="Net Cash Flow"
                    stroke="var(--admin-chart-neutral)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="admin-report-chart h-[20rem]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={items} margin={{ top: 10, right: 16, left: 10, bottom: 10 }}>
                  <CartesianGrid stroke="#edf0f6" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#6f6a75", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#8b8791", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value: number) => formatCurrency(value)}
                  />
                  <Tooltip content={<ChartTooltip valueFormatter={formatCurrency} />} />
                  <Legend />
                  <Bar dataKey="closingBalance" name="Closing Balance" fill="var(--admin-chart-positive)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="netCashFlow" name="Net Cash Flow" fill="var(--admin-chart-neutral)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="mt-4 grid gap-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-[#17141a]">{item.label}</span>
                <span className="text-[#6f6a75]">
                  Net {formatCurrency(item.netCashFlow)} / Closing {formatCurrency(item.closingBalance)}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-[#6f6a75]">No chart data available.</p>
      )}
    </ChartFrame>
  );
}

function DetailedList({
  items,
  empty,
}: {
  items: DatedItem[];
  empty: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-[#6f6a75]">{empty}</p>;
  }

  return (
    <div className="grid gap-3">
      {items.map((item) =>
        item.href ? (
          <Link
            key={item.id}
            href={item.href}
            className="rounded-[1rem] border border-[#eef0f6] bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(35,31,32,0.06)]"
          >
            <p className="font-medium text-[#17141a]">{item.title}</p>
            <p className="mt-1 text-sm text-[#6f6a75]">{item.subtitle}</p>
            {item.meta ? <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#9793a0]">{item.meta}</p> : null}
          </Link>
        ) : (
          <div key={item.id} className="rounded-[1rem] border border-[#eef0f6] bg-white px-4 py-3">
            <p className="font-medium text-[#17141a]">{item.title}</p>
            <p className="mt-1 text-sm text-[#6f6a75]">{item.subtitle}</p>
            {item.meta ? <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#9793a0]">{item.meta}</p> : null}
          </div>
        ),
      )}
    </div>
  );
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "admin-internal-tab inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition",
        active
          ? "admin-internal-tab-active bg-[#17141a] text-white shadow-[0_10px_20px_rgba(23,20,26,0.14)]"
          : "admin-internal-tab-idle border border-[#e4e7ef] bg-white text-[#6f6a75] hover:border-[#d7dce8] hover:text-[#17141a]",
      )}
    >
      {label}
    </button>
  );
}

export function ReportsWorkspace({ data }: ReportsWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<ReportTab>("overview");

  const tabs = useMemo(
    () => [
      { id: "overview" as const, label: "Overview" },
      { id: "public" as const, label: "Public Site" },
      { id: "crm" as const, label: "CRM" },
      { id: "accounting" as const, label: "Accounting" },
      { id: "leads" as const, label: "Leads" },
    ],
    [],
  );

  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-[#e3e7f0] bg-white shadow-[0_14px_30px_rgba(35,31,32,0.04)]">
        <div className="border-b border-[#edf0f6] bg-[#fafbfe] px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#9793a0]">Reports</p>
              <h1 className="mt-2 text-[1.75rem] font-semibold tracking-tight text-[#17141a] sm:text-[2rem]">Business Reporting</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6f6a75]">
                Clear reporting tabs for the public site, CRM, accounting, and incoming leads.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={getAdminRoute("/crm")} className="inline-flex items-center justify-center rounded-xl border border-[#e7e9f2] bg-white px-5 py-3 text-sm font-medium text-[#17141a] transition hover:border-[#d9dce8] hover:text-[var(--brand)]">
                Open CRM
              </Link>
              <Link href={getAdminRoute("/accounting")} className="inline-flex items-center justify-center rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_24px_rgba(237,35,37,0.18)] transition hover:bg-[#c81a1d]">
                Open Accounting
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-5 py-5 sm:px-6 md:grid-cols-2 xl:grid-cols-4">
          {data.overviewCards.map((card) => (
            <ReportCard key={card.label} {...card} />
          ))}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-[#edf0f6] px-5 py-4 sm:px-6 sm:gap-3">
          {tabs.map((tab) => (
            <TabButton key={tab.id} active={activeTab === tab.id} label={tab.label} onClick={() => setActiveTab(tab.id)} />
          ))}
        </div>
      </section>

      {activeTab === "overview" ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <ReportPanel title="Public Snapshot" action={<Link href={getAdminRoute("/products")} className="text-sm font-medium text-[var(--brand)]">Open products</Link>}>
            <div className="grid gap-4 md:grid-cols-3">
              {data.publicSite.summary.map((card) => (
                <ReportCard key={card.label} {...card} />
              ))}
            </div>
          </ReportPanel>

          <ReportPanel title="CRM Snapshot" action={<Link href={getAdminRoute("/crm")} className="text-sm font-medium text-[var(--brand)]">Open CRM</Link>}>
            <RechartsStageMetricChart items={data.crm.stageSummary} title="Opportunities by Stage" subtitle="How many opportunities are currently in each CRM stage." metric="count" />
          </ReportPanel>

          <ReportPanel title="Accounting Snapshot" action={<Link href={getAdminRoute("/accounting")} className="text-sm font-medium text-[var(--brand)]">Open accounting</Link>}>
            {data.accounting.ready ? (
              <RechartsLineChart items={data.accounting.periodPerformance} title="Closing Balance Trend" subtitle="Recent accounting periods plotted by closing balance." />
            ) : (
              <p className="text-sm text-[#6f6a75]">Accounting reports will appear once accounting periods are available.</p>
            )}
          </ReportPanel>

          <ReportPanel title="Lead Snapshot">
            <DetailedList items={[...data.leads.latestLeads.slice(0, 3), ...data.leads.latestInquiries.slice(0, 3)]} empty="No recent lead or inquiry activity." />
          </ReportPanel>
        </div>
      ) : null}

      {activeTab === "public" ? (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <ReportPanel title="Public Site Summary">
            <div className="grid gap-4 md:grid-cols-3">
              {data.publicSite.summary.map((card) => (
                <ReportCard key={card.label} {...card} />
              ))}
            </div>
          </ReportPanel>

          <ReportPanel title="Top Brands Chart">
            <RechartsBarChart items={data.publicSite.topBrands} title="Top Brands" subtitle="Products grouped by brand." />
          </ReportPanel>

          <ReportPanel title="Category Coverage Chart">
            <RechartsBarChart items={data.publicSite.categoryCoverage} title="Category Coverage" subtitle="Products mapped to each public category." color="var(--admin-chart-neutral)" />
          </ReportPanel>

          <ReportPanel title="Detailed Catalog Report">
            <DetailedList items={data.publicSite.catalogDetails} empty="No catalog detail rows available." />
          </ReportPanel>
        </div>
      ) : null}

      {activeTab === "crm" ? (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <ReportPanel title="CRM Summary">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {data.crm.summary.map((card) => (
                <ReportCard key={card.label} {...card} />
              ))}
            </div>
          </ReportPanel>

          <ReportPanel title="Opportunity Count by Stage">
            <RechartsStageMetricChart items={data.crm.stageSummary} title="Opportunity Count" subtitle="Use this to see where most deals currently sit in the pipeline." metric="count" />
          </ReportPanel>

          <ReportPanel title="Pipeline Value by Stage">
            <RechartsStageMetricChart items={data.crm.stageSummary} title="Pipeline Value" subtitle="Use this to see which stages currently hold the most peso value." metric="value" />
          </ReportPanel>

          <ReportPanel title="Top Pipeline Accounts">
            <RechartsBarChart items={data.crm.pipelineAccounts} title="Top Accounts by Pipeline" subtitle="Accounts ranked by open opportunity value." formatValue={formatCurrency} />
          </ReportPanel>

          <ReportPanel title="Detailed CRM Report">
            <DetailedList items={data.crm.stalledItems} empty="No stalled items at the moment." />
          </ReportPanel>
        </div>
      ) : null}

      {activeTab === "accounting" ? (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <ReportPanel title="Accounting Summary">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {data.accounting.summary.map((card) => (
                <ReportCard key={card.label} {...card} />
              ))}
            </div>
          </ReportPanel>

          <ReportPanel title="Cash Flow Trend Chart">
            {data.accounting.ready ? (
              <RechartsLineChart items={data.accounting.periodPerformance} title="Cash Flow Trend" subtitle="Closing balance across recent accounting periods." />
            ) : (
              <p className="text-sm text-[#6f6a75]">Accounting reports will appear once accounting periods are available.</p>
            )}
          </ReportPanel>

          <ReportPanel title="Cash Breakdown Chart">
            {data.accounting.ready ? (
              <RechartsBarChart items={data.accounting.cashBreakdown} title="Cash Breakdown" subtitle="Switch between bar and donut views for the accounting totals." formatValue={formatCurrency} color="var(--admin-chart-positive)" />
            ) : (
              <p className="text-sm text-[#6f6a75]">Accounting reports will appear once accounting periods are available.</p>
            )}
          </ReportPanel>

          <ReportPanel title="Detailed Accounting Report">
            <DetailedList items={data.accounting.detailRows} empty="No accounting periods available yet." />
          </ReportPanel>
        </div>
      ) : null}

      {activeTab === "leads" ? (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <ReportPanel title="Lead Summary">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {data.leads.summary.map((card) => (
                <ReportCard key={card.label} {...card} />
              ))}
            </div>
          </ReportPanel>

          <ReportPanel title="Lead Source Chart">
            <RechartsBarChart items={data.leads.leadSources} title="Lead Sources" subtitle="Switch between bar and donut views for source distribution." color="var(--admin-chart-secondary)" />
          </ReportPanel>

          <ReportPanel title="Latest Project Leads">
            <DetailedList items={data.leads.latestLeads} empty="No project leads available yet." />
          </ReportPanel>

          <ReportPanel title="Detailed Inquiry Report">
            <DetailedList items={data.leads.latestInquiries} empty="No public inquiries available yet." />
          </ReportPanel>
        </div>
      ) : null}
    </div>
  );
}
