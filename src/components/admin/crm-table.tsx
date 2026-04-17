"use client";

import Link from "next/link";
import { useActionState, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { deleteProjectLeadAction, type ProjectLeadDeleteState } from "@/app/(admin)/admin/crm/actions";
import { getAdminRoute } from "@/lib/admin-path";
import type { ProjectLead } from "@/types/project-lead";
import { projectLeadStatuses } from "@/types/project-lead";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";

function formatCurrency(value: number | null) {
  if (value === null) return "-";
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 2 }).format(value);
}

function formatStatusLabel(value: string) {
  return value.replaceAll("_", " ");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getStatusTone(status: string) {
  switch (status) {
    case "completed":
      return "border-[#cfead7] bg-[#eefaf2] text-[#1f7a3d]";
    case "ongoing":
      return "border-[#d9e6ff] bg-[#eef4ff] text-[#2859b8]";
    case "quotation_in_progress":
    case "quotation_sent":
      return "border-[#f1dfc2] bg-[#fff7ea] text-[#9a5b12]";
    case "on_hold":
      return "border-[#e5d8f8] bg-[#f7f1ff] text-[#7b43be]";
    case "lost":
      return "border-[#f0d0d0] bg-[#fff1f1] text-[#aa3737]";
    default:
      return "border-[#d8eadb] bg-[#eefaf2] text-[#2d7f54]";
  }
}

export function CrmTable({ leads }: { leads: ProjectLead[] }) {
  const [deleteState, deleteAction, isDeleting] = useActionState(deleteProjectLeadAction, { error: null } satisfies ProjectLeadDeleteState);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [layout, setLayout] = useState<"list" | "board">("list");
  const [leadToDelete, setLeadToDelete] = useState<ProjectLead | null>(null);
  const wasDeleting = useRef(false);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  useEffect(() => {
    if (wasDeleting.current && !isDeleting && !deleteState.error) {
      setLeadToDelete(null);
    }
    wasDeleting.current = isDeleting;
  }, [deleteState.error, isDeleting]);

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const matchesQuery = normalizedQuery
        ? [lead.clientName, lead.company ?? "", lead.projectName, lead.location ?? "", lead.phone ?? "", lead.email ?? ""]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        : true;

      const matchesStatus = status === "all" || lead.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [leads, normalizedQuery, status]);

  const grouped = useMemo(() => {
    const order = projectLeadStatuses.filter((item) => item === status || status === "all");
    return order
      .map((groupStatus) => ({
        status: groupStatus,
        items: filtered.filter((lead) => lead.status === groupStatus),
      }))
      .filter((group) => group.items.length > 0);
  }, [filtered, status]);

  return (
    <div className="grid gap-5">
      <section className="rounded-[1.5rem] border border-[#e3e7f0] bg-white shadow-[0_12px_26px_rgba(35,31,32,0.04)]">
        <div className="grid gap-4 border-b border-[#edf0f6] px-4 py-4 sm:px-5 lg:grid-cols-[1.3fr_0.7fr_auto] lg:items-end">
          <label className="grid gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9793a0]">Search</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by client, company, project, location, phone, or email"
              className="w-full rounded-xl border border-[#e7e9f2] bg-[#f8f9fc] px-4 py-3 text-sm text-[#17141a] outline-none placeholder:text-[#8f8b85]"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9793a0]">View</span>
            <Select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border-[#e7e9f2] bg-[#f8f9fc]">
              <option value="all">All statuses</option>
              {projectLeadStatuses.map((item) => (
                <option key={item} value={item}>
                  {formatStatusLabel(item)}
                </option>
              ))}
            </Select>
          </label>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <div className="inline-flex rounded-full border border-[#e7e9f2] bg-[#fafbfe] p-1">
              <button
                type="button"
                onClick={() => setLayout("list")}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  layout === "list" ? "bg-[#17141a] text-white" : "text-[#6f6a75] hover:text-[#17141a]"
                }`}
              >
                List
              </button>
              <button
                type="button"
                onClick={() => setLayout("board")}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  layout === "board" ? "bg-[#17141a] text-white" : "text-[#6f6a75] hover:text-[#17141a]"
                }`}
              >
                Board
              </button>
            </div>
            <span className="inline-flex rounded-full border border-[#e7e9f2] bg-[#fafbfe] px-3 py-2 text-xs font-medium text-[#6f6a75]">
              {filtered.length} visible
            </span>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setStatus("all");
              }}
              className="cursor-pointer rounded-full border border-[#e7e9f2] bg-white px-3 py-2 text-xs font-medium text-[#17141a] transition hover:border-[#cfd5e2] hover:bg-[#fafbfe]"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 px-4 py-3 text-xs text-[#6f6a75] sm:px-5">
          {projectLeadStatuses.map((item) => {
            const count = leads.filter((lead) => lead.status === item).length;
            return (
              <span
                key={item}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-medium ${
                  status === item ? "border-[#17141a] bg-[#17141a] text-white" : "border-[#e7e9f2] bg-[#fafbfe] text-[#6f6a75]"
                }`}
              >
                {formatStatusLabel(item)}
                <span className={status === item ? "text-white/80" : "text-[#9793a0]"}>{count}</span>
              </span>
            );
          })}
        </div>
      </section>

      {filtered.length > 0 ? (
        layout === "list" ? (
          <div className="grid gap-4">
            {grouped.map((group) => (
              <section key={group.status} className="overflow-hidden rounded-[1.5rem] border border-[#e3e7f0] bg-white shadow-[0_12px_26px_rgba(35,31,32,0.04)]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0f6] bg-[#fafbfe] px-4 py-3.5 sm:px-5">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] ${getStatusTone(group.status)}`}>
                      {formatStatusLabel(group.status)}
                    </span>
                    <span className="text-sm font-medium text-[#17141a]">{group.items.length} {group.items.length === 1 ? "record" : "records"}</span>
                  </div>
                  <span className="text-xs uppercase tracking-[0.16em] text-[#9793a0]">List view</span>
                </div>

                <div className="hidden grid-cols-[1.1fr_1.2fr_0.8fr_0.85fr_0.85fr_auto] gap-4 border-b border-[#edf0f6] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9793a0] lg:grid">
                  <span>Client</span>
                  <span>Project</span>
                  <span>Location</span>
                  <span>Quotation</span>
                  <span>Last Update</span>
                  <span className="text-right">Actions</span>
                </div>

                <div className="grid gap-0">
                  {group.items.map((lead) => (
                    <div
                      key={lead.id}
                      className="grid gap-4 border-b border-[#edf0f6] px-4 py-4 transition hover:bg-[#fcfcfe] last:border-b-0 lg:grid-cols-[1.1fr_1.2fr_0.8fr_0.85fr_0.85fr_auto] lg:items-center lg:px-5"
                    >
                      <div className="min-w-0">
                        <Link href={getAdminRoute(`/crm/${lead.id}`)} className="font-medium text-[#17141a] transition hover:text-[var(--brand)]">
                          {lead.clientName}
                        </Link>
                        <p className="mt-1 truncate text-sm text-[#6f6a75]">{lead.company || lead.email || lead.phone || "-"}</p>
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-[#17141a]">{lead.projectName}</p>
                        <p className="mt-1 truncate text-sm text-[#6f6a75]">{lead.phone || lead.email || "No direct contact logged"}</p>
                      </div>

                      <div className="text-sm text-[#6f6a75]">{lead.location || "-"}</div>

                      <div className="grid gap-1 text-sm">
                        <span className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-[11px] font-medium ${lead.quotationFinished ? "border-[#cfead7] bg-[#eefaf2] text-[#1f7a3d]" : "border-[#e6decd] bg-[#faf5ea] text-[#876536]"}`}>
                          {lead.quotationFinished ? "Finished" : "Pending"}
                        </span>
                        <span className="font-medium text-[#17141a]">{formatCurrency(lead.estimatedCost)}</span>
                      </div>

                      <div className="text-sm text-[#6f6a75]">{formatDate(lead.updatedAt)}</div>

                      <div className="flex items-center justify-between gap-3 lg:justify-end">
                        <Link
                          href={getAdminRoute(`/crm/${lead.id}`)}
                          className="inline-flex items-center justify-center rounded-xl border border-[#e7e9f2] bg-[#f8f9fc] px-4 py-2 text-xs font-medium text-[#17141a] transition hover:border-[#d9dce8] hover:bg-white hover:text-[var(--brand)]"
                        >
                          Open
                        </Link>
                        <button
                          type="button"
                          onClick={() => setLeadToDelete(lead)}
                          className="cursor-pointer text-xs font-medium uppercase tracking-[0.16em] text-[#b42318] transition hover:text-[#7a1b14]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto pb-2">
            <div className="grid min-w-[1120px] grid-cols-4 gap-4 xl:grid-cols-4">
              {grouped.map((group) => (
                <section key={group.status} className="overflow-hidden rounded-[1.5rem] border border-[#e3e7f0] bg-white shadow-[0_12px_26px_rgba(35,31,32,0.04)]">
                  <div className={`border-b px-4 py-4 ${getStatusTone(group.status)}`}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold uppercase tracking-[0.14em]">{formatStatusLabel(group.status)}</span>
                      <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-medium text-current">
                        {group.items.length}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3 bg-[#fbfbfd] p-3">
                    {group.items.map((lead) => (
                      <article key={lead.id} className="rounded-[1.2rem] border border-[#e7e9f2] bg-white p-4 shadow-[0_8px_18px_rgba(35,31,32,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(35,31,32,0.08)]">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link href={getAdminRoute(`/crm/${lead.id}`)} className="font-medium text-[#17141a] transition hover:text-[var(--brand)]">
                              {lead.projectName}
                            </Link>
                            <p className="mt-1 truncate text-sm text-[#6f6a75]">{lead.clientName}</p>
                          </div>
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${getStatusTone(lead.status)}`}>
                            {formatStatusLabel(lead.status)}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-[#6f6a75]">
                          <p>{lead.location || "No location set"}</p>
                          <p>{lead.company || lead.phone || lead.email || "No contact detail set"}</p>
                          <p className="font-medium text-[#17141a]">{formatCurrency(lead.estimatedCost)}</p>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#edf0f6] pt-3">
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${lead.quotationFinished ? "border-[#cfead7] bg-[#eefaf2] text-[#1f7a3d]" : "border-[#e6decd] bg-[#faf5ea] text-[#876536]"}`}>
                            {lead.quotationFinished ? "Quote finished" : "Quote pending"}
                          </span>
                          <span className="text-xs text-[#9793a0]">{formatDate(lead.updatedAt)}</span>
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                          <Link
                            href={getAdminRoute(`/crm/${lead.id}`)}
                            className="inline-flex flex-1 items-center justify-center rounded-xl border border-[#e7e9f2] bg-[#f8f9fc] px-3 py-2 text-xs font-medium text-[#17141a] transition hover:border-[#d9dce8] hover:bg-white hover:text-[var(--brand)]"
                          >
                            Open / Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => setLeadToDelete(lead)}
                            className="cursor-pointer rounded-xl px-3 py-2 text-xs font-medium text-[#b42318] transition hover:bg-[#fff3f2] hover:text-[#7a1b14]"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}

                    {group.items.length === 0 ? (
                      <div className="rounded-[1.1rem] border border-dashed border-[#d8dde8] bg-white px-4 py-8 text-center text-sm text-[#9793a0]">
                        No records in this status.
                      </div>
                    ) : null}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )
      ) : (
        <div className="rounded-[1.5rem] border border-[#e7e9f2] bg-white px-5 py-10 text-sm text-[#6f6a75] shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
          No CRM projects match the current search or status.
        </div>
      )}

      <Modal
        open={Boolean(leadToDelete)}
        onClose={() => (isDeleting ? null : setLeadToDelete(null))}
        title="Delete CRM project?"
        description={leadToDelete ? `This will permanently remove ${leadToDelete.projectName}. This action cannot be undone.` : ""}
      >
        <form action={deleteAction} className="grid gap-4">
          <input type="hidden" name="projectLeadId" value={leadToDelete?.id ?? ""} />
          {deleteState.error ? <p className="text-sm text-[#b42318]">{deleteState.error}</p> : null}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setLeadToDelete(null)}
              disabled={isDeleting}
              className="inline-flex items-center justify-center rounded-sm border border-[var(--border)] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[#231f20] transition hover:border-[#231f20]/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDeleting}
              className="inline-flex items-center justify-center rounded-sm bg-[#b42318] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-white transition hover:bg-[#7a1b14] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? "Deleting..." : "Delete Project"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
