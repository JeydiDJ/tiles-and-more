import Link from "next/link";
import { notFound } from "next/navigation";
import { CrmOpportunityForm, CrmOpportunityNoteForm } from "@/components/admin/crm-forms";
import { getAdminRoute } from "@/lib/admin-path";
import {
  getCrmContacts,
  getCrmOpportunityActivity,
  getCrmOpportunityAttachments,
  getCrmOpportunityById,
} from "@/services/crm.service";

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

export default async function AdminCrmOpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const opportunity = await getCrmOpportunityById(id);

  if (!opportunity) {
    notFound();
  }

  const [contacts, activity, attachments] = await Promise.all([
    getCrmContacts(opportunity.accountId),
    getCrmOpportunityActivity(opportunity.id),
    getCrmOpportunityAttachments(opportunity.id),
  ]);

  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-[#e7e9f2] bg-white shadow-[0_14px_30px_rgba(35,31,32,0.04)]">
        <div className="border-b border-[#edf0f6] bg-[#fafbfe] px-6 py-6 sm:px-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#9793a0]">Opportunity</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#17141a] sm:text-[2.6rem]">{opportunity.name}</h1>
              <p className="mt-3 text-sm text-[#6f6a75]">{opportunity.accountName} - {opportunity.stage.replaceAll("_", " ")}</p>
            </div>
            <Link href={getAdminRoute(`/crm/${opportunity.accountId}`)} className="text-sm font-medium text-[var(--brand)] transition hover:text-[var(--brand-dark)]">
              Back to Account
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <CrmOpportunityForm mode="edit" initialOpportunity={opportunity} accountId={opportunity.accountId} contacts={contacts} />

        <div className="grid gap-6">
          <CrmOpportunityNoteForm opportunityId={opportunity.id} />

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
                          {[attachment.fileType, formatFileSize(attachment.fileSize)].filter(Boolean).join(" - ") || "Attachment"}
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
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9793a0]">{item.activityType.replaceAll("_", " ")}</p>
                    <p className="mt-2 text-sm leading-6 text-[#17141a]">{item.content}</p>
                    <p className="mt-2 text-xs text-[#6f6a75]">{formatDate(item.createdAt)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-[#6f6a75]">No opportunity activity recorded yet.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
