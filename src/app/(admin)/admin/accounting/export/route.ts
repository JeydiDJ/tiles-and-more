import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { getAccountingSummary } from "@/lib/accounting";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAccountingPeriods } from "@/services/accounting.service";

export const runtime = "nodejs";

function styleCurrencyColumn(column: ExcelJS.Column) {
  column.numFmt = '"PHP" #,##0.00;[Red]-"PHP" #,##0.00';
}

export async function GET() {
  if (!hasSupabaseEnv()) {
    return NextResponse.json({ error: "Supabase env vars are missing." }, { status: 500 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let periods;

  try {
    periods = await getAccountingPeriods();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load accounting periods." },
      { status: 500 },
    );
  }

  const { rows, totals } = getAccountingSummary(periods);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Tiles & More Admin";
  workbook.created = new Date();

  const summarySheet = workbook.addWorksheet("Statement Summary", {
    views: [{ state: "frozen", ySplit: 4 }],
  });

  summarySheet.columns = [
    { header: "Metric", key: "metric", width: 30 },
    { header: "Value", key: "value", width: 22 },
    { header: "Notes", key: "notes", width: 48 },
  ];

  summarySheet.mergeCells("A1:C1");
  summarySheet.getCell("A1").value = "Tiles & More Statement of Accounts";
  summarySheet.getCell("A2").value = `Generated ${new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date())}`;
  summarySheet.getRow(4).values = ["Metric", "Value", "Notes"];

  const summaryRows = [
    ["Recorded periods", periods.length, "Total accounting periods included in this statement export."],
    ["Latest closing balance", totals.latestClosingBalance, "Closing balance from the most recent saved period."],
    ["Total cash in", totals.totalCashIn, "Sales collected, receivables collected, and other income."],
    ["Total cash out", totals.totalCashOut, "All direct and indirect outgoing cash recorded in the ledger."],
    ["Net cash flow", totals.totalNetCashFlow, "Total cash in minus total cash out."],
    ["Sales margin", totals.totalSales - totals.totalInventory, "Sales collected less inventory / cost of goods spending."],
    ["Average monthly burn", totals.averageMonthlyBurn, "Average outgoing cash across the saved periods."],
    ["Best period", totals.strongestPeriod?.label ?? "N/A", totals.strongestPeriod ? `Net cash flow ${totals.strongestPeriod.netCashFlow.toFixed(2)}` : "No periods recorded."],
    ["Worst period", totals.weakestPeriod?.label ?? "N/A", totals.weakestPeriod ? `Net cash flow ${totals.weakestPeriod.netCashFlow.toFixed(2)}` : "No periods recorded."],
  ];

  for (const row of summaryRows) {
    summarySheet.addRow(row);
  }

  summarySheet.getCell("A1").font = { size: 16, bold: true, color: { argb: "FF17141A" } };
  summarySheet.getCell("A2").font = { size: 10, color: { argb: "FF6F6A75" } };

  const headerRow = summarySheet.getRow(4);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFED2325" },
  };

  styleCurrencyColumn(summarySheet.getColumn("B"));

  const detailSheet = workbook.addWorksheet("Accounting Ledger", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  detailSheet.columns = [
    { header: "Period", key: "label", width: 22 },
    { header: "Start Date", key: "periodStart", width: 14 },
    { header: "End Date", key: "periodEnd", width: 14 },
    { header: "Opening Balance", key: "openingBalance", width: 16 },
    { header: "Sales Collected", key: "salesCollected", width: 18 },
    { header: "Receivables Collected", key: "receivablesCollected", width: 20 },
    { header: "Other Income", key: "otherIncome", width: 14 },
    { header: "Inventory Purchases", key: "inventoryPurchases", width: 18 },
    { header: "Payroll", key: "payroll", width: 14 },
    { header: "Rent & Utilities", key: "rentUtilities", width: 16 },
    { header: "Operating Expenses", key: "operatingExpenses", width: 18 },
    { header: "Marketing", key: "marketing", width: 14 },
    { header: "Taxes", key: "taxes", width: 14 },
    { header: "Loan Payments", key: "loanPayments", width: 16 },
    { header: "Owner Draws", key: "ownerDraws", width: 14 },
    { header: "Capital Expenses", key: "capitalExpenses", width: 16 },
    { header: "Cash In", key: "cashIn", width: 14 },
    { header: "Cash Out", key: "cashOut", width: 14 },
    { header: "Net Cash Flow", key: "netCashFlow", width: 16 },
    { header: "Closing Balance", key: "closingBalance", width: 16 },
    { header: "Notes", key: "notes", width: 42 },
  ];

  rows.forEach((row) => {
    detailSheet.addRow({
      label: row.label,
      periodStart: row.periodStart,
      periodEnd: row.periodEnd,
      openingBalance: row.openingBalance,
      salesCollected: row.salesCollected,
      receivablesCollected: row.receivablesCollected,
      otherIncome: row.otherIncome,
      inventoryPurchases: row.inventoryPurchases,
      payroll: row.payroll,
      rentUtilities: row.rentUtilities,
      operatingExpenses: row.operatingExpenses,
      marketing: row.marketing,
      taxes: row.taxes,
      loanPayments: row.loanPayments,
      ownerDraws: row.ownerDraws,
      capitalExpenses: row.capitalExpenses,
      cashIn: row.cashIn,
      cashOut: row.cashOut,
      netCashFlow: row.netCashFlow,
      closingBalance: row.closingBalance,
      notes: row.notes ?? "",
    });
  });

  detailSheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  detailSheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF17141A" },
  };

  ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"].forEach((columnKey) => {
    styleCurrencyColumn(detailSheet.getColumn(columnKey));
  });

  detailSheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      return;
    }

    row.getCell(2).numFmt = "yyyy-mm-dd";
    row.getCell(3).numFmt = "yyyy-mm-dd";
  });

  const totalsRow = detailSheet.addRow({
    label: "TOTAL",
    openingBalance: rows.reduce((sum, row) => sum + row.openingBalance, 0),
    salesCollected: totals.totalSales,
    receivablesCollected: rows.reduce((sum, row) => sum + row.receivablesCollected, 0),
    otherIncome: rows.reduce((sum, row) => sum + row.otherIncome, 0),
    inventoryPurchases: totals.totalInventory,
    payroll: rows.reduce((sum, row) => sum + row.payroll, 0),
    rentUtilities: rows.reduce((sum, row) => sum + row.rentUtilities, 0),
    operatingExpenses: rows.reduce((sum, row) => sum + row.operatingExpenses, 0),
    marketing: rows.reduce((sum, row) => sum + row.marketing, 0),
    taxes: rows.reduce((sum, row) => sum + row.taxes, 0),
    loanPayments: rows.reduce((sum, row) => sum + row.loanPayments, 0),
    ownerDraws: rows.reduce((sum, row) => sum + row.ownerDraws, 0),
    capitalExpenses: rows.reduce((sum, row) => sum + row.capitalExpenses, 0),
    cashIn: totals.totalCashIn,
    cashOut: totals.totalCashOut,
    netCashFlow: totals.totalNetCashFlow,
    closingBalance: totals.latestClosingBalance,
  });

  totalsRow.font = { bold: true };
  totalsRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF8E4E5" },
  };

  const buffer = await workbook.xlsx.writeBuffer();
  const fileName = `tiles-and-more-statement-of-accounts-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(Buffer.from(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
