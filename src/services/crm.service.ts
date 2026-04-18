import type {
  CrmAccount,
  CrmAccountInput,
  CrmContact,
  CrmContactInput,
  CrmOpportunity,
  CrmOpportunityActivity,
  CrmOpportunityAttachment,
  CrmOpportunityInput,
  CrmOpportunityStage,
} from "@/types/crm";
import { createCrmAttachmentSignedUrl } from "@/services/storage.service";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CrmAccountRow = {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type CrmContactRow = {
  id: string;
  account_id: string;
  full_name: string;
  job_title: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type CrmOpportunityRow = {
  id: string;
  account_id: string;
  primary_contact_id: string | null;
  name: string;
  location: string | null;
  architect_designer_firm: string | null;
  architect_designer_contact_person: string | null;
  architect_designer_position: string | null;
  architect_designer_contact_number: string | null;
  architect_designer_email: string | null;
  owner_name: string | null;
  owner_contact_person: string | null;
  owner_position: string | null;
  owner_contact_number: string | null;
  owner_email: string | null;
  estimated_value: number | null;
  stage: CrmOpportunityStage;
  source: string | null;
  notes: string | null;
  quotation_finished: boolean | null;
  created_at: string;
  updated_at: string;
  account?: { name?: string | null } | Array<{ name?: string | null }> | null;
  primary_contact?: { full_name?: string | null } | Array<{ full_name?: string | null }> | null;
};

type CrmOpportunityActivityRow = {
  id: string;
  opportunity_id: string;
  activity_type: string;
  content: string;
  created_at: string;
};

type CrmOpportunityAttachmentRow = {
  id: string;
  opportunity_id: string;
  file_name: string;
  storage_path: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
};

const fallbackAccounts: CrmAccount[] = [];
const fallbackContacts: CrmContact[] = [];
const fallbackOpportunities: CrmOpportunity[] = [];
const fallbackActivity: CrmOpportunityActivity[] = [];
const fallbackAttachments: CrmOpportunityAttachment[] = [];

function pickRelation<T>(value: T | T[] | null | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function mapAccount(row: CrmAccountRow): CrmAccount {
  return {
    id: row.id,
    name: row.name,
    industry: row.industry,
    website: row.website,
    phone: row.phone,
    email: row.email,
    address: row.address,
    city: row.city,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapContact(row: CrmContactRow): CrmContact {
  return {
    id: row.id,
    accountId: row.account_id,
    fullName: row.full_name,
    jobTitle: row.job_title,
    phone: row.phone,
    email: row.email,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapOpportunity(row: CrmOpportunityRow): CrmOpportunity {
  const account = pickRelation(row.account);
  const primaryContact = pickRelation(row.primary_contact);

  return {
    id: row.id,
    accountId: row.account_id,
    accountName: account?.name ?? "Unknown account",
    primaryContactId: row.primary_contact_id,
    primaryContactName: primaryContact?.full_name ?? null,
    name: row.name,
    location: row.location,
    architectDesignerFirm: row.architect_designer_firm,
    architectDesignerContactPerson: row.architect_designer_contact_person,
    architectDesignerPosition: row.architect_designer_position,
    architectDesignerContactNumber: row.architect_designer_contact_number,
    architectDesignerEmail: row.architect_designer_email,
    ownerName: row.owner_name,
    ownerContactPerson: row.owner_contact_person,
    ownerPosition: row.owner_position,
    ownerContactNumber: row.owner_contact_number,
    ownerEmail: row.owner_email,
    estimatedValue: row.estimated_value,
    stage: row.stage,
    source: row.source ?? "manual",
    notes: row.notes,
    quotationFinished: row.quotation_finished ?? false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapActivity(row: CrmOpportunityActivityRow): CrmOpportunityActivity {
  return {
    id: row.id,
    opportunityId: row.opportunity_id,
    activityType: row.activity_type,
    content: row.content,
    createdAt: row.created_at,
  };
}

function mapAttachment(row: CrmOpportunityAttachmentRow, signedUrl: string | null): CrmOpportunityAttachment {
  return {
    id: row.id,
    opportunityId: row.opportunity_id,
    fileName: row.file_name,
    storagePath: row.storage_path,
    fileType: row.file_type,
    fileSize: row.file_size,
    createdAt: row.created_at,
    signedUrl,
  };
}

export async function getCrmAccounts() {
  if (!hasSupabaseEnv()) {
    return fallbackAccounts;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("crm_accounts").select("*").order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapAccount(row as CrmAccountRow));
}

export async function getCrmAccountById(id: string) {
  if (!hasSupabaseEnv()) {
    return fallbackAccounts.find((item) => item.id === id) ?? null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("crm_accounts").select("*").eq("id", id).maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapAccount(data as CrmAccountRow) : null;
}

export async function createCrmAccount(input: CrmAccountInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("crm_accounts")
    .insert({
      name: input.name,
      industry: input.industry,
      website: input.website,
      phone: input.phone,
      email: input.email,
      address: input.address,
      city: input.city,
      notes: input.notes,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapAccount(data as CrmAccountRow);
}

export async function updateCrmAccount(id: string, input: CrmAccountInput) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("crm_accounts")
    .update({
      name: input.name,
      industry: input.industry,
      website: input.website,
      phone: input.phone,
      email: input.email,
      address: input.address,
      city: input.city,
      notes: input.notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteCrmAccount(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("crm_accounts").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getCrmContacts(accountId: string) {
  if (!hasSupabaseEnv()) {
    return fallbackContacts.filter((item) => item.accountId === accountId);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("crm_contacts")
    .select("*")
    .eq("account_id", accountId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapContact(row as CrmContactRow));
}

export async function createCrmContact(input: CrmContactInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("crm_contacts")
    .insert({
      account_id: input.accountId,
      full_name: input.fullName,
      job_title: input.jobTitle,
      phone: input.phone,
      email: input.email,
      notes: input.notes,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapContact(data as CrmContactRow);
}

export async function updateCrmContact(id: string, input: Omit<CrmContactInput, "accountId">) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("crm_contacts")
    .update({
      full_name: input.fullName,
      job_title: input.jobTitle,
      phone: input.phone,
      email: input.email,
      notes: input.notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteCrmContact(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("crm_contacts").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getCrmOpportunities(accountId?: string) {
  if (!hasSupabaseEnv()) {
    return accountId ? fallbackOpportunities.filter((item) => item.accountId === accountId) : fallbackOpportunities;
  }

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("crm_opportunities")
    .select("*, account:crm_accounts(name), primary_contact:crm_contacts(full_name)")
    .order("updated_at", { ascending: false });

  if (accountId) {
    query = query.eq("account_id", accountId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapOpportunity(row as CrmOpportunityRow));
}

export async function getCrmOpportunityById(id: string) {
  if (!hasSupabaseEnv()) {
    return fallbackOpportunities.find((item) => item.id === id) ?? null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("crm_opportunities")
    .select("*, account:crm_accounts(name), primary_contact:crm_contacts(full_name)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapOpportunity(data as CrmOpportunityRow) : null;
}

export async function createCrmOpportunity(input: CrmOpportunityInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("crm_opportunities")
    .insert({
      account_id: input.accountId,
      primary_contact_id: input.primaryContactId,
      name: input.name,
      location: input.location,
      architect_designer_firm: input.architectDesignerFirm,
      architect_designer_contact_person: input.architectDesignerContactPerson,
      architect_designer_position: input.architectDesignerPosition,
      architect_designer_contact_number: input.architectDesignerContactNumber,
      architect_designer_email: input.architectDesignerEmail,
      owner_name: input.ownerName,
      owner_contact_person: input.ownerContactPerson,
      owner_position: input.ownerPosition,
      owner_contact_number: input.ownerContactNumber,
      owner_email: input.ownerEmail,
      estimated_value: input.estimatedValue,
      stage: input.stage,
      source: input.source,
      notes: input.notes,
      quotation_finished: input.quotationFinished,
    })
    .select("*, account:crm_accounts(name), primary_contact:crm_contacts(full_name)")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapOpportunity(data as CrmOpportunityRow);
}

export async function updateCrmOpportunity(id: string, input: CrmOpportunityInput) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("crm_opportunities")
    .update({
      account_id: input.accountId,
      primary_contact_id: input.primaryContactId,
      name: input.name,
      location: input.location,
      architect_designer_firm: input.architectDesignerFirm,
      architect_designer_contact_person: input.architectDesignerContactPerson,
      architect_designer_position: input.architectDesignerPosition,
      architect_designer_contact_number: input.architectDesignerContactNumber,
      architect_designer_email: input.architectDesignerEmail,
      owner_name: input.ownerName,
      owner_contact_person: input.ownerContactPerson,
      owner_position: input.ownerPosition,
      owner_contact_number: input.ownerContactNumber,
      owner_email: input.ownerEmail,
      estimated_value: input.estimatedValue,
      stage: input.stage,
      source: input.source,
      notes: input.notes,
      quotation_finished: input.quotationFinished,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteCrmOpportunity(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("crm_opportunities").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getCrmOpportunityActivity(opportunityId: string) {
  if (!hasSupabaseEnv()) {
    return fallbackActivity.filter((item) => item.opportunityId === opportunityId);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("crm_opportunity_activity_logs")
    .select("*")
    .eq("opportunity_id", opportunityId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapActivity(row as CrmOpportunityActivityRow));
}

export async function addCrmOpportunityActivity(opportunityId: string, activityType: string, content: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("crm_opportunity_activity_logs")
    .insert({
      opportunity_id: opportunityId,
      activity_type: activityType,
      content,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapActivity(data as CrmOpportunityActivityRow);
}

export async function getCrmOpportunityAttachments(opportunityId: string) {
  if (!hasSupabaseEnv()) {
    return fallbackAttachments.filter((item) => item.opportunityId === opportunityId);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("crm_opportunity_attachments")
    .select("*")
    .eq("opportunity_id", opportunityId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as CrmOpportunityAttachmentRow[];
  return Promise.all(
    rows.map(async (row) => {
      const signedUrl = row.storage_path ? await createCrmAttachmentSignedUrl(row.storage_path) : null;
      return mapAttachment(row, signedUrl);
    }),
  );
}

export async function createCrmOpportunityAttachment(input: {
  opportunityId: string;
  fileName: string;
  storagePath: string;
  fileType: string | null;
  fileSize: number | null;
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("crm_opportunity_attachments")
    .insert({
      opportunity_id: input.opportunityId,
      file_name: input.fileName,
      storage_path: input.storagePath,
      file_type: input.fileType,
      file_size: input.fileSize,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const row = data as CrmOpportunityAttachmentRow;
  const signedUrl = row.storage_path ? await createCrmAttachmentSignedUrl(row.storage_path) : null;
  return mapAttachment(row, signedUrl);
}
