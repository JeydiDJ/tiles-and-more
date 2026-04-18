"use server";

import { revalidatePath } from "next/cache";
import {
  addCrmOpportunityActivity,
  createCrmAccount,
  createCrmContact,
  createCrmOpportunity,
  createCrmOpportunityAttachment,
  getCrmOpportunityById,
  deleteCrmContact,
  deleteCrmAccount,
  deleteCrmOpportunity,
  updateCrmAccount,
  updateCrmContact,
  updateCrmOpportunity,
} from "@/services/crm.service";
import { uploadCrmAttachment } from "@/services/storage.service";
import { getAdminRoute } from "@/lib/admin-path";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CrmOpportunityStage } from "@/types/crm";

export type CrmFormState = {
  error: string | null;
  entityId?: string | null;
};

export type CrmDeleteState = {
  error: string | null;
};

function normalizeOptional(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();
  return normalized.length > 0 ? normalized : null;
}

function parseAccountInput(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    industry: normalizeOptional(formData.get("industry")),
    website: normalizeOptional(formData.get("website")),
    phone: normalizeOptional(formData.get("phone")),
    email: normalizeOptional(formData.get("email")),
    address: normalizeOptional(formData.get("address")),
    city: normalizeOptional(formData.get("city")),
    notes: normalizeOptional(formData.get("notes")),
  };
}

function parseContactInput(formData: FormData) {
  return {
    accountId: String(formData.get("accountId") ?? "").trim(),
    fullName: String(formData.get("fullName") ?? "").trim(),
    jobTitle: normalizeOptional(formData.get("jobTitle")),
    phone: normalizeOptional(formData.get("phone")),
    email: normalizeOptional(formData.get("email")),
    notes: normalizeOptional(formData.get("notes")),
  };
}

function parseOpportunityInput(formData: FormData) {
  const estimatedValueRaw = normalizeOptional(formData.get("estimatedValue"));
  const estimatedValue = estimatedValueRaw ? Number(estimatedValueRaw) : null;

  return {
    accountId: String(formData.get("accountId") ?? "").trim(),
    primaryContactId: normalizeOptional(formData.get("primaryContactId")),
    name: String(formData.get("name") ?? "").trim(),
    location: normalizeOptional(formData.get("location")),
    architectDesignerFirm: normalizeOptional(formData.get("architectDesignerFirm")),
    architectDesignerContactPerson: normalizeOptional(formData.get("architectDesignerContactPerson")),
    architectDesignerPosition: normalizeOptional(formData.get("architectDesignerPosition")),
    architectDesignerContactNumber: normalizeOptional(formData.get("architectDesignerContactNumber")),
    architectDesignerEmail: normalizeOptional(formData.get("architectDesignerEmail")),
    ownerName: normalizeOptional(formData.get("ownerName")),
    ownerContactPerson: normalizeOptional(formData.get("ownerContactPerson")),
    ownerPosition: normalizeOptional(formData.get("ownerPosition")),
    ownerContactNumber: normalizeOptional(formData.get("ownerContactNumber")),
    ownerEmail: normalizeOptional(formData.get("ownerEmail")),
    estimatedValue: Number.isFinite(estimatedValue) ? estimatedValue : null,
    stage: String(formData.get("stage") ?? "new_lead").trim() as CrmOpportunityStage,
    source: normalizeOptional(formData.get("source")) ?? "manual",
    notes: normalizeOptional(formData.get("notes")),
    quotationFinished: String(formData.get("quotationFinished") ?? "") === "true",
  };
}

function parseAttachmentFiles(formData: FormData) {
  return formData
    .getAll("attachments")
    .filter((value): value is File => value instanceof File)
    .filter((file) => file.size > 0);
}

function revalidateCrmOpportunityPaths(accountId: string, opportunityId: string) {
  revalidatePath(getAdminRoute("/crm"));
  revalidatePath(getAdminRoute(`/crm/${accountId}`));
  revalidatePath(getAdminRoute(`/crm/opportunities/${opportunityId}`));
  revalidatePath(getAdminRoute());
  revalidatePath(getAdminRoute("/calendar"));
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

export async function createCrmAccountAction(_: CrmFormState, formData: FormData): Promise<CrmFormState> {
  try {
    await requireAdminUser();

    const accountInput = parseAccountInput(formData);
    if (!accountInput.name) {
      return { error: "Account name is required.", entityId: null };
    }

    const account = await createCrmAccount(accountInput);

    const initialContactName = String(formData.get("initialContactName") ?? "").trim();
    if (initialContactName) {
      await createCrmContact({
        accountId: account.id,
        fullName: initialContactName,
        jobTitle: normalizeOptional(formData.get("initialContactJobTitle")),
        phone: normalizeOptional(formData.get("initialContactPhone")),
        email: normalizeOptional(formData.get("initialContactEmail")),
        notes: null,
      });
    }

    const initialOpportunityName = String(formData.get("initialOpportunityName") ?? "").trim();
    if (initialOpportunityName) {
      await createCrmOpportunity({
        accountId: account.id,
        primaryContactId: null,
        name: initialOpportunityName,
        location: normalizeOptional(formData.get("initialOpportunityLocation")),
        estimatedValue: null,
        stage: "new_lead",
        source: "manual",
        notes: null,
        quotationFinished: false,
      });
    }

    revalidatePath(getAdminRoute("/crm"));
    revalidatePath(getAdminRoute());
    revalidatePath(getAdminRoute("/calendar"));
    return { error: null, entityId: account.id };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to create account.", entityId: null };
  }
}

export async function updateCrmAccountAction(_: CrmFormState, formData: FormData): Promise<CrmFormState> {
  try {
    await requireAdminUser();

    const accountId = String(formData.get("accountId") ?? "").trim();
    if (!accountId) {
      return { error: "Account ID is required.", entityId: null };
    }

    const input = parseAccountInput(formData);
    if (!input.name) {
      return { error: "Account name is required.", entityId: accountId };
    }

    await updateCrmAccount(accountId, input);
    revalidatePath(getAdminRoute("/crm"));
    revalidatePath(getAdminRoute(`/crm/${accountId}`));
    return { error: null, entityId: accountId };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to update account.", entityId: null };
  }
}

export async function createCrmContactAction(_: CrmFormState, formData: FormData): Promise<CrmFormState> {
  try {
    await requireAdminUser();

    const input = parseContactInput(formData);
    if (!input.accountId || !input.fullName) {
      return { error: "Account and contact name are required.", entityId: null };
    }

    await createCrmContact(input);
    revalidatePath(getAdminRoute(`/crm/${input.accountId}`));
    return { error: null, entityId: input.accountId };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to create contact.", entityId: null };
  }
}

export async function updateCrmContactAction(_: CrmFormState, formData: FormData): Promise<CrmFormState> {
  try {
    await requireAdminUser();

    const contactId = String(formData.get("contactId") ?? "").trim();
    const accountId = String(formData.get("accountId") ?? "").trim();
    const input = parseContactInput(formData);

    if (!contactId || !accountId || !input.fullName) {
      return { error: "Account, contact, and full name are required.", entityId: null };
    }

    await updateCrmContact(contactId, {
      fullName: input.fullName,
      jobTitle: input.jobTitle,
      phone: input.phone,
      email: input.email,
      notes: input.notes,
    });
    revalidatePath(getAdminRoute(`/crm/${accountId}`));
    return { error: null, entityId: accountId };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to update contact.", entityId: null };
  }
}

export async function createCrmOpportunityAction(_: CrmFormState, formData: FormData): Promise<CrmFormState> {
  try {
    await requireAdminUser();

    const input = parseOpportunityInput(formData);
    if (!input.accountId || !input.name) {
      return { error: "Account and opportunity name are required.", entityId: null };
    }

    const opportunity = await createCrmOpportunity(input);
    await addCrmOpportunityActivity(opportunity.id, "system", "Opportunity record created.");

    revalidatePath(getAdminRoute("/crm"));
    revalidatePath(getAdminRoute(`/crm/${input.accountId}`));
    revalidatePath(getAdminRoute());
    revalidatePath(getAdminRoute("/calendar"));
    return { error: null, entityId: opportunity.id };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to create opportunity.", entityId: null };
  }
}

export async function updateCrmOpportunityAction(_: CrmFormState, formData: FormData): Promise<CrmFormState> {
  try {
    await requireAdminUser();

    const opportunityId = String(formData.get("opportunityId") ?? "").trim();
    const previousStage = String(formData.get("previousStage") ?? "").trim();
    if (!opportunityId) {
      return { error: "Opportunity ID is required.", entityId: null };
    }

    const input = parseOpportunityInput(formData);
    const attachments = parseAttachmentFiles(formData);
    if (!input.accountId || !input.name) {
      return { error: "Account and opportunity name are required.", entityId: opportunityId };
    }

    await updateCrmOpportunity(opportunityId, input);

    if (attachments.length > 0) {
      for (const file of attachments) {
        const uploaded = await uploadCrmAttachment(file, opportunityId, input.name);
        await createCrmOpportunityAttachment({
          opportunityId,
          fileName: uploaded.fileName,
          storagePath: uploaded.path,
          fileType: uploaded.mimeType,
          fileSize: uploaded.fileSize,
        });
      }

      await addCrmOpportunityActivity(
        opportunityId,
        "attachment",
        `${attachments.length} attachment${attachments.length === 1 ? "" : "s"} added to the opportunity.`,
      );
    }

    if (previousStage !== input.stage) {
      await addCrmOpportunityActivity(opportunityId, "stage_change", `Stage changed from ${previousStage || "unknown"} to ${input.stage}.`);
    } else {
      await addCrmOpportunityActivity(opportunityId, "system", "Opportunity record updated.");
    }

    revalidateCrmOpportunityPaths(input.accountId, opportunityId);
    return { error: null, entityId: opportunityId };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to update opportunity.", entityId: null };
  }
}

export async function updateCrmOpportunityOverviewAction(_: CrmFormState, formData: FormData): Promise<CrmFormState> {
  try {
    await requireAdminUser();

    const opportunityId = String(formData.get("opportunityId") ?? "").trim();
    if (!opportunityId) {
      return { error: "Opportunity ID is required.", entityId: null };
    }

    const existing = await getCrmOpportunityById(opportunityId);
    if (!existing) {
      return { error: "Opportunity not found.", entityId: null };
    }

    const estimatedValueRaw = normalizeOptional(formData.get("estimatedValue"));
    const estimatedValue = estimatedValueRaw ? Number(estimatedValueRaw) : null;
    const stage = String(formData.get("stage") ?? existing.stage).trim() as CrmOpportunityStage;

    await updateCrmOpportunity(opportunityId, {
      accountId: existing.accountId,
      primaryContactId: normalizeOptional(formData.get("primaryContactId")) ?? existing.primaryContactId,
      name: String(formData.get("name") ?? existing.name).trim() || existing.name,
      location: normalizeOptional(formData.get("location")) ?? existing.location,
      architectDesignerFirm: existing.architectDesignerFirm,
      architectDesignerContactPerson: existing.architectDesignerContactPerson,
      architectDesignerPosition: existing.architectDesignerPosition,
      architectDesignerContactNumber: existing.architectDesignerContactNumber,
      architectDesignerEmail: existing.architectDesignerEmail,
      ownerName: existing.ownerName,
      ownerContactPerson: existing.ownerContactPerson,
      ownerPosition: existing.ownerPosition,
      ownerContactNumber: existing.ownerContactNumber,
      ownerEmail: existing.ownerEmail,
      estimatedValue: Number.isFinite(estimatedValue) ? estimatedValue : existing.estimatedValue,
      stage,
      source: normalizeOptional(formData.get("source")) ?? existing.source,
      notes: normalizeOptional(formData.get("notes")) ?? existing.notes,
      quotationFinished: String(formData.get("quotationFinished") ?? String(existing.quotationFinished)) === "true",
    });

    if (existing.stage !== stage) {
      await addCrmOpportunityActivity(opportunityId, "stage_change", `Stage changed from ${existing.stage} to ${stage}.`);
    } else {
      await addCrmOpportunityActivity(opportunityId, "system", "Opportunity overview updated.");
    }

    revalidateCrmOpportunityPaths(existing.accountId, opportunityId);
    return { error: null, entityId: opportunityId };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to update opportunity overview.", entityId: null };
  }
}

export async function updateCrmOpportunityArchitectAction(_: CrmFormState, formData: FormData): Promise<CrmFormState> {
  try {
    await requireAdminUser();

    const opportunityId = String(formData.get("opportunityId") ?? "").trim();
    if (!opportunityId) {
      return { error: "Opportunity ID is required.", entityId: null };
    }

    const existing = await getCrmOpportunityById(opportunityId);
    if (!existing) {
      return { error: "Opportunity not found.", entityId: null };
    }

    await updateCrmOpportunity(opportunityId, {
      accountId: existing.accountId,
      primaryContactId: existing.primaryContactId,
      name: existing.name,
      location: existing.location,
      architectDesignerFirm: normalizeOptional(formData.get("architectDesignerFirm")),
      architectDesignerContactPerson: normalizeOptional(formData.get("architectDesignerContactPerson")),
      architectDesignerPosition: normalizeOptional(formData.get("architectDesignerPosition")),
      architectDesignerContactNumber: normalizeOptional(formData.get("architectDesignerContactNumber")),
      architectDesignerEmail: normalizeOptional(formData.get("architectDesignerEmail")),
      ownerName: existing.ownerName,
      ownerContactPerson: existing.ownerContactPerson,
      ownerPosition: existing.ownerPosition,
      ownerContactNumber: existing.ownerContactNumber,
      ownerEmail: existing.ownerEmail,
      estimatedValue: existing.estimatedValue,
      stage: existing.stage,
      source: existing.source,
      notes: existing.notes,
      quotationFinished: existing.quotationFinished,
    });

    await addCrmOpportunityActivity(opportunityId, "system", "Architect / designer details updated.");
    revalidateCrmOpportunityPaths(existing.accountId, opportunityId);
    return { error: null, entityId: opportunityId };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to update architect / designer details.", entityId: null };
  }
}

export async function updateCrmOpportunityOwnerAction(_: CrmFormState, formData: FormData): Promise<CrmFormState> {
  try {
    await requireAdminUser();

    const opportunityId = String(formData.get("opportunityId") ?? "").trim();
    if (!opportunityId) {
      return { error: "Opportunity ID is required.", entityId: null };
    }

    const existing = await getCrmOpportunityById(opportunityId);
    if (!existing) {
      return { error: "Opportunity not found.", entityId: null };
    }

    await updateCrmOpportunity(opportunityId, {
      accountId: existing.accountId,
      primaryContactId: existing.primaryContactId,
      name: existing.name,
      location: existing.location,
      architectDesignerFirm: existing.architectDesignerFirm,
      architectDesignerContactPerson: existing.architectDesignerContactPerson,
      architectDesignerPosition: existing.architectDesignerPosition,
      architectDesignerContactNumber: existing.architectDesignerContactNumber,
      architectDesignerEmail: existing.architectDesignerEmail,
      ownerName: normalizeOptional(formData.get("ownerName")),
      ownerContactPerson: normalizeOptional(formData.get("ownerContactPerson")),
      ownerPosition: normalizeOptional(formData.get("ownerPosition")),
      ownerContactNumber: normalizeOptional(formData.get("ownerContactNumber")),
      ownerEmail: normalizeOptional(formData.get("ownerEmail")),
      estimatedValue: existing.estimatedValue,
      stage: existing.stage,
      source: existing.source,
      notes: existing.notes,
      quotationFinished: existing.quotationFinished,
    });

    await addCrmOpportunityActivity(opportunityId, "system", "Owner details updated.");
    revalidateCrmOpportunityPaths(existing.accountId, opportunityId);
    return { error: null, entityId: opportunityId };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to update owner details.", entityId: null };
  }
}

export async function addCrmOpportunityNoteAction(_: CrmFormState, formData: FormData): Promise<CrmFormState> {
  try {
    await requireAdminUser();

    const opportunityId = String(formData.get("opportunityId") ?? "").trim();
    const note = String(formData.get("note") ?? "").trim();

    if (!opportunityId || !note) {
      return { error: "Opportunity and note content are required.", entityId: null };
    }

    await addCrmOpportunityActivity(opportunityId, "note", note);
    revalidatePath(getAdminRoute(`/crm/opportunities/${opportunityId}`));
    return { error: null, entityId: opportunityId };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to add note.", entityId: null };
  }
}

export async function deleteCrmOpportunityAction(_: CrmDeleteState, formData: FormData): Promise<CrmDeleteState> {
  try {
    await requireAdminUser();

    const opportunityId = String(formData.get("opportunityId") ?? "").trim();
    if (!opportunityId) {
      return { error: "Opportunity ID is required." };
    }

    await deleteCrmOpportunity(opportunityId);
    revalidatePath(getAdminRoute("/crm"));
    revalidatePath(getAdminRoute());
    revalidatePath(getAdminRoute("/calendar"));
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to delete opportunity." };
  }
}

export async function deleteCrmAccountAction(_: CrmDeleteState, formData: FormData): Promise<CrmDeleteState> {
  try {
    await requireAdminUser();

    const accountId = String(formData.get("accountId") ?? "").trim();
    if (!accountId) {
      return { error: "Account ID is required." };
    }

    await deleteCrmAccount(accountId);
    revalidatePath(getAdminRoute("/crm"));
    revalidatePath(getAdminRoute());
    revalidatePath(getAdminRoute("/calendar"));
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to delete account." };
  }
}

export async function deleteCrmContactAction(_: CrmDeleteState, formData: FormData): Promise<CrmDeleteState> {
  try {
    await requireAdminUser();

    const contactId = String(formData.get("contactId") ?? "").trim();
    const accountId = String(formData.get("accountId") ?? "").trim();
    if (!contactId || !accountId) {
      return { error: "Contact and account IDs are required." };
    }

    await deleteCrmContact(contactId);
    revalidatePath(getAdminRoute(`/crm/${accountId}`));
    revalidatePath(getAdminRoute("/crm"));
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to delete contact." };
  }
}
