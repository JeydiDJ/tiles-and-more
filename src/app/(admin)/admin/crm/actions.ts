"use server";

import { revalidatePath } from "next/cache";
import { addProjectLeadActivity, createProjectLead, createProjectLeadAttachment, deleteProjectLead, updateProjectLead } from "@/services/project-lead.service";
import { uploadCrmAttachment } from "@/services/storage.service";
import { getAdminRoute } from "@/lib/admin-path";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProjectLeadStatus } from "@/types/project-lead";

export type ProjectLeadFormState = {
  error: string | null;
  projectLeadId?: string | null;
};

export type ProjectLeadDeleteState = {
  error: string | null;
};

function normalizeOptional(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();
  return normalized.length > 0 ? normalized : null;
}

function parseLeadInput(formData: FormData) {
  const quotationFinished = String(formData.get("quotationFinished") ?? "") === "true";
  const estimatedCostRaw = normalizeOptional(formData.get("estimatedCost"));
  const estimatedCost = quotationFinished && estimatedCostRaw ? Number(estimatedCostRaw) : null;

  return {
    clientName: String(formData.get("clientName") ?? "").trim(),
    company: normalizeOptional(formData.get("company")),
    phone: normalizeOptional(formData.get("phone")),
    email: normalizeOptional(formData.get("email")),
    projectName: String(formData.get("projectName") ?? "").trim(),
    location: normalizeOptional(formData.get("location")),
    estimatedCost: Number.isFinite(estimatedCost) ? estimatedCost : null,
    status: String(formData.get("status") ?? "new_lead").trim() as ProjectLeadStatus,
    source: normalizeOptional(formData.get("source")) ?? "manual",
    inquiryType: normalizeOptional(formData.get("inquiryType")),
    notes: normalizeOptional(formData.get("notes")),
    quotationFinished,
  };
}

function parseAttachmentFiles(formData: FormData) {
  return formData
    .getAll("attachments")
    .filter((value): value is File => value instanceof File)
    .filter((file) => file.size > 0);
}

async function requireAdminUser() {
  if (!hasSupabaseEnv()) {
    throw new Error("Supabase env vars are missing. Add them before using CRM.");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to manage CRM records.");
  }
}

export async function createProjectLeadAction(_: ProjectLeadFormState, formData: FormData): Promise<ProjectLeadFormState> {
  try {
    await requireAdminUser();

    const input = parseLeadInput(formData);
    const attachments = parseAttachmentFiles(formData);
    if (!input.clientName || !input.projectName) {
      return { error: "Client name and project name are required.", projectLeadId: null };
    }

    const lead = await createProjectLead(input);
    await addProjectLeadActivity(lead.id, "system", "CRM project record created.");

    if (attachments.length > 0) {
      for (const file of attachments) {
        const uploaded = await uploadCrmAttachment(file, lead.id, lead.projectName);
        await createProjectLeadAttachment({
          projectLeadId: lead.id,
          fileName: uploaded.fileName,
          storagePath: uploaded.path,
          fileType: uploaded.mimeType,
          fileSize: uploaded.fileSize,
        });
      }

      await addProjectLeadActivity(
        lead.id,
        "attachment",
        `${attachments.length} attachment${attachments.length === 1 ? "" : "s"} added to the project record.`,
      );
    }

    revalidatePath(getAdminRoute("/crm"));
    revalidatePath(getAdminRoute(`/crm/${lead.id}`));
    return { error: null, projectLeadId: lead.id };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to create CRM record.", projectLeadId: null };
  }
}

export async function updateProjectLeadAction(_: ProjectLeadFormState, formData: FormData): Promise<ProjectLeadFormState> {
  try {
    await requireAdminUser();

    const projectLeadId = String(formData.get("projectLeadId") ?? "").trim();
    const previousStatus = String(formData.get("previousStatus") ?? "").trim();
    const attachments = parseAttachmentFiles(formData);
    if (!projectLeadId) {
      return { error: "Project record ID is required.", projectLeadId: null };
    }

    const input = parseLeadInput(formData);
    if (!input.clientName || !input.projectName) {
      return { error: "Client name and project name are required.", projectLeadId: null };
    }

    await updateProjectLead(projectLeadId, input);

    if (attachments.length > 0) {
      for (const file of attachments) {
        const uploaded = await uploadCrmAttachment(file, projectLeadId, input.projectName);
        await createProjectLeadAttachment({
          projectLeadId,
          fileName: uploaded.fileName,
          storagePath: uploaded.path,
          fileType: uploaded.mimeType,
          fileSize: uploaded.fileSize,
        });
      }

      await addProjectLeadActivity(
        projectLeadId,
        "attachment",
        `${attachments.length} attachment${attachments.length === 1 ? "" : "s"} added to the project record.`,
      );
    }

    if (previousStatus !== input.status) {
      await addProjectLeadActivity(projectLeadId, "status_change", `Status changed from ${previousStatus || "unknown"} to ${input.status}.`);
    } else {
      await addProjectLeadActivity(projectLeadId, "system", "CRM project record updated.");
    }

    revalidatePath(getAdminRoute("/crm"));
    revalidatePath(getAdminRoute(`/crm/${projectLeadId}`));
    return { error: null, projectLeadId };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to update CRM record.", projectLeadId: null };
  }
}

export async function addProjectLeadNoteAction(_: ProjectLeadFormState, formData: FormData): Promise<ProjectLeadFormState> {
  try {
    await requireAdminUser();

    const projectLeadId = String(formData.get("projectLeadId") ?? "").trim();
    const note = String(formData.get("note") ?? "").trim();

    if (!projectLeadId || !note) {
      return { error: "Project record and note content are required.", projectLeadId: null };
    }

    await addProjectLeadActivity(projectLeadId, "note", note);
    revalidatePath(getAdminRoute(`/crm/${projectLeadId}`));
    return { error: null, projectLeadId };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to add note.", projectLeadId: null };
  }
}

export async function deleteProjectLeadAction(_: ProjectLeadDeleteState, formData: FormData): Promise<ProjectLeadDeleteState> {
  try {
    await requireAdminUser();

    const projectLeadId = String(formData.get("projectLeadId") ?? "").trim();
    if (!projectLeadId) {
      return { error: "Project record ID is required." };
    }

    await deleteProjectLead(projectLeadId);
    revalidatePath(getAdminRoute("/crm"));
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to delete CRM record." };
  }
}
