import Link from "next/link";
import { ProjectLeadForm } from "@/components/admin/project-lead-form";
import { getAdminRoute } from "@/lib/admin-path";

export default function AdminCrmNewPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-[1.75rem] border border-[#e7e9f2] bg-white px-6 py-6 shadow-[0_14px_30px_rgba(35,31,32,0.04)] sm:px-7 sm:py-7">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#9793a0]">CRM</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-[#17141a] sm:text-[2.6rem]">Create Project Record</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f6a75]">
              Log a new client project, quotation lead, or ongoing job into the CRM pipeline.
            </p>
          </div>
          <Link href={getAdminRoute("/crm")} className="text-sm font-medium text-[var(--brand)] transition hover:text-[var(--brand-dark)]">
            Back to CRM
          </Link>
        </div>
      </section>
      <ProjectLeadForm mode="create" />
    </div>
  );
}
