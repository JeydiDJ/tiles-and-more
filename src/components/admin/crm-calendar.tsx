"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getAdminRoute } from "@/lib/admin-path";
import { cn } from "@/lib/utils";
import type { CrmOpportunity } from "@/types/crm";

type CrmCalendarProps = {
  opportunities: CrmOpportunity[];
  compact?: boolean;
};

type CalendarEvent = {
  id: string;
  opportunityId: string;
  title: string;
  detail: string;
  dateKey: string;
  timestamp: number;
  tone: "lead" | "bid" | "progress" | "completed";
};

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDayLabel(value: string) {
  return new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-PH", { month: "long", year: "numeric" }).format(date);
}

function getToneClasses(tone: CalendarEvent["tone"]) {
  switch (tone) {
    case "completed":
      return "bg-[#ebf8ee] text-[#1d7a43]";
    case "bid":
      return "bg-[#fff6e7] text-[#9a5b12]";
    case "progress":
      return "bg-[#eef4ff] text-[#2859b8]";
    default:
      return "bg-[#eefaf2] text-[#25704e]";
  }
}

function buildEvents(opportunities: CrmOpportunity[]) {
  const events: CalendarEvent[] = [];

  for (const opportunity of opportunities) {
    const createdDate = new Date(opportunity.createdAt);
    const updatedDate = new Date(opportunity.updatedAt);
    const createdKey = toDateKey(createdDate);
    const updatedKey = toDateKey(updatedDate);

    events.push({
      id: `${opportunity.id}-created`,
      opportunityId: opportunity.id,
      title: opportunity.name,
      detail: `${opportunity.accountName} account opened a new opportunity`,
      dateKey: createdKey,
      timestamp: createdDate.getTime(),
      tone: "lead",
    });

    if (opportunity.stage === "bidding" || opportunity.stage === "negotiation") {
      events.push({
        id: `${opportunity.id}-bid`,
        opportunityId: opportunity.id,
        title: opportunity.name,
        detail: `${opportunity.stage.replaceAll("_", " ")} stage active`,
        dateKey: updatedKey,
        timestamp: updatedDate.getTime(),
        tone: "bid",
      });
    } else if (opportunity.stage === "completed") {
      events.push({
        id: `${opportunity.id}-completed`,
        opportunityId: opportunity.id,
        title: opportunity.name,
        detail: "Opportunity marked completed",
        dateKey: updatedKey,
        timestamp: updatedDate.getTime(),
        tone: "completed",
      });
    } else if (createdKey !== updatedKey) {
      events.push({
        id: `${opportunity.id}-updated`,
        opportunityId: opportunity.id,
        title: opportunity.name,
        detail: `Moved to ${opportunity.stage.replaceAll("_", " ")}`,
        dateKey: updatedKey,
        timestamp: updatedDate.getTime(),
        tone: "progress",
      });
    }
  }

  return events.sort((a, b) => a.timestamp - b.timestamp);
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current">
      {direction === "left" ? (
        <path d="m14.5 5-7 7 7 7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="m9.5 5 7 7-7 7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

export function CrmCalendar({ opportunities, compact = false }: CrmCalendarProps) {
  const events = useMemo(() => buildEvents(opportunities), [opportunities]);
  const today = new Date();
  const todayKey = toDateKey(today);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState(todayKey);

  const monthStart = startOfMonth(currentMonth);
  const gridStart = new Date(monthStart);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });

  const eventsByDate = events.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
    acc[event.dateKey] ??= [];
    acc[event.dateKey].push(event);
    return acc;
  }, {});

  const selectedEvents = (eventsByDate[selectedDate] ?? []).slice().sort((a, b) => a.timestamp - b.timestamp);
  const visibleAgenda = compact ? selectedEvents.slice(0, 4) : selectedEvents;

  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-[#e3e7f0] bg-white shadow-[0_12px_26px_rgba(35,31,32,0.04)]">
      <div className="flex flex-col gap-4 border-b border-[#edf0f6] bg-[#fafbfe] px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#9793a0]">{compact ? "CRM Calendar" : "Calendar Workspace"}</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#17141a]">{compact ? "Opportunity Snapshot" : "Opportunity Activity Calendar"}</h2>
          <p className="mt-1 text-sm text-[#6f6a75]">
            {compact ? "A quick month view of account and opportunity movement." : "Track account opportunity openings, bid stages, and opportunity progress in calendar form."}
          </p>
        </div>

        {!compact ? (
          <Link
            href={getAdminRoute("/crm")}
            className="inline-flex items-center justify-center rounded-full border border-[#e7e9f2] bg-white px-4 py-2 text-xs font-medium text-[#17141a] transition hover:border-[#cfd5e2] hover:text-[var(--brand)]"
          >
            Open CRM
          </Link>
        ) : null}
      </div>

      <div className={cn("grid gap-0", compact ? "xl:grid-cols-[minmax(0,1fr)_320px]" : "xl:grid-cols-[minmax(0,1fr)_420px]")}>
        <div className="px-4 py-4 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold tracking-tight text-[#17141a]">{formatMonthLabel(currentMonth)}</p>
              <p className="text-sm text-[#6f6a75]">{events.filter((event) => event.dateKey.startsWith(toDateKey(monthStart).slice(0, 7))).length} activity items this month</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, -1))} className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#e7e9f2] bg-white text-[#17141a] transition hover:border-[#cfd5e2] hover:bg-[#fafbfe]">
                <ChevronIcon direction="left" />
              </button>
              <button type="button" onClick={() => setCurrentMonth(startOfMonth(today))} className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[#e7e9f2] bg-white px-3 py-2 text-xs font-medium text-[#17141a] transition hover:border-[#cfd5e2] hover:bg-[#fafbfe]">
                Today
              </button>
              <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#e7e9f2] bg-white text-[#17141a] transition hover:border-[#cfd5e2] hover:bg-[#fafbfe]">
                <ChevronIcon direction="right" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-[#9793a0]">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-7 gap-2">
            {days.map((date) => {
              const dateKey = toDateKey(date);
              const dayEvents = eventsByDate[dateKey] ?? [];
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
              const isToday = dateKey === todayKey;
              const isSelected = dateKey === selectedDate;

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => setSelectedDate(dateKey)}
                  className={cn(
                    "min-h-[84px] cursor-pointer rounded-[1rem] border px-2 py-2 text-left transition",
                    isSelected ? "border-[#17141a] bg-[#17141a] text-white" : "border-[#edf0f6] bg-white hover:border-[#cfd5e2] hover:bg-[#fafbfe]",
                    !isCurrentMonth && !isSelected && "text-[#b8b3bc]",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn("text-sm font-medium", isToday && !isSelected && "text-[var(--brand)]")}>{date.getDate()}</span>
                    {dayEvents.length > 0 ? <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-medium", isSelected ? "bg-white/15 text-white" : "bg-[#f1f3f8] text-[#6f6a75]")}>{dayEvents.length}</span> : null}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {dayEvents.slice(0, compact ? 2 : 3).map((event) => (
                      <span
                        key={event.id}
                        className={cn(
                          "inline-flex h-2.5 w-2.5 rounded-full",
                          isSelected ? "bg-white" : event.tone === "completed" ? "bg-[#49a56c]" : event.tone === "bid" ? "bg-[#d89a40]" : event.tone === "progress" ? "bg-[#5a86df]" : "bg-[#5cba81]",
                        )}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="border-t border-[#edf0f6] bg-[#fbfbfd] px-4 py-4 sm:px-5 xl:border-l xl:border-t-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#9793a0]">Agenda</p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-[#17141a]">{formatDayLabel(selectedDate)}</h3>
          {visibleAgenda.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {visibleAgenda.map((event) => (
                <Link key={event.id} href={getAdminRoute(`/crm/opportunities/${event.opportunityId}`)} className="rounded-[1.1rem] border border-[#e7e9f2] bg-white p-3 transition hover:border-[#cfd5e2] hover:bg-[#fcfcfe]">
                  <div className="grid gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[#17141a]">{event.title}</p>
                      <p className="mt-1 break-words text-sm leading-6 text-[#6f6a75]">{event.detail}</p>
                    </div>
                    <div className="flex justify-start">
                      <span className={cn("inline-flex shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em]", getToneClasses(event.tone))}>{event.tone}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-[1.1rem] border border-dashed border-[#d9dde7] bg-white px-4 py-6 text-sm text-[#6f6a75]">No CRM activity recorded for this date.</div>
          )}
          {compact ? (
            <Link href={getAdminRoute("/calendar")} className="mt-4 inline-flex items-center justify-center rounded-full border border-[#e7e9f2] bg-white px-4 py-2 text-xs font-medium text-[#17141a] transition hover:border-[#cfd5e2] hover:text-[var(--brand)]">
              Open full calendar
            </Link>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
