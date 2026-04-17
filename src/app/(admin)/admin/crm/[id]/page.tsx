import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectLeadForm, ProjectLeadNoteForm } from "@/components/admin/project-lead-form";
import { getAdminRoute } from "@/lib/admin-path";
import { getProjectLeadActivity, getProjectLeadAttachments, getProjectLeadById } from "@/services/project-lead.service";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatFileSize(value: number | null) {
  if (!value) return null;
  if (value < 1024 * 1024) {
    return `${Math.round(value / 1024)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function AdminCrmDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [lead, activity, attachments] = await Promise.all([getProjectLeadById(id), getProjectLeadActivity(id), getProjectLeadAttachments(id)]);

  if (!lead) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-[1.75rem] border border-[#e7e9f2] bg-white px-6 py-6 shadow-[0_14px_30px_rgba(35,31,32,0.04)] sm:px-7 sm:py-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#9793a0]">CRM</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#17141a] sm:text-[2.6rem]">{lead.projectName}</h1>
            <p className="mt-3 text-sm text-[#6f6a75]">{lead.clientName} - {lead.status.replaceAll("_", " ")}</p>
          </div>
          <Link href={getAdminRoute("/crm")} className="text-sm font-medium text-[var(--brand)] transition hover:text-[var(--brand-dark)]">
            Back to CRM
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-[1.25rem] border border-[#e7e9f2] bg-[#fafbfe] p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Client</p>
            <p className="mt-3 text-lg font-semibold tracking-tight text-[#17141a]">{lead.clientName}</p>
          </div>
          <div className="rounded-[1.25rem] border border-[#e7e9f2] bg-[#fafbfe] p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Status</p>
            <p className="mt-3 text-lg font-semibold tracking-tight text-[#17141a]">{lead.status.replaceAll("_", " ")}</p>
          </div>
          <div className="rounded-[1.25rem] border border-[#e7e9f2] bg-[#fafbfe] p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Location</p>
            <p className="mt-3 text-lg font-semibold tracking-tight text-[#17141a]">{lead.location || "-"}</p>
          </div>
          <div className="rounded-[1.25rem] border border-[#e7e9f2] bg-[#fafbfe] p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Estimated Cost</p>
            <p className="mt-3 text-lg font-semibold tracking-tight text-[#17141a]">
              {lead.estimatedCost !== null
                ? new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 2 }).format(lead.estimatedCost)
                : "-"}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <ProjectLeadForm mode="edit" initialLead={lead} />

        <div className="grid gap-6">
          <ProjectLeadNoteForm projectLeadId={lead.id} />

          <section className="rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-[#9793a0]">Files</h2>
            {attachments.length > 0 ? (
              <div className="mt-4 grid gap-3">
                {attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.signedUrl ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[1.1rem] border border-[#e7e9f2] bg-[#fafbfe] p-4 transition hover:border-[#cfd5e2] hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[#17141a]">{attachment.fileName}</p>
                        <p className="mt-1 text-sm text-[#6f6a75]">
                          {[attachment.fileType, formatFileSize(attachment.fileSize)].filter(Boolean).join(" · ") || "Attachment"}
                        </p>
                      </div>
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--brand)]">Open</span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-[#6f6a75]">No files attached yet.</p>
            )}
          </section>

          <section className="rounded-[1.5rem] border border-[#e7e9f2] bg-white p-5 shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-[#9793a0]">Activity</h2>
            {activity.length > 0 ? (
              <div className="mt-4 grid gap-0">
                {activity.map((item) => (
                  <div key={item.id} className="border-b border-[#eef0f6] py-4 last:border-b-0">
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9793a0]">
                      {item.activityType.replaceAll("_", " ")}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#17141a]">{item.content}</p>
                    <p className="mt-2 text-xs text-[#6f6a75]">{formatDate(item.createdAt)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-[#6f6a75]">No project activity recorded yet.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
