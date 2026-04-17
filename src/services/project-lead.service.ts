import type { ProjectLead, ProjectLeadActivity, ProjectLeadAttachment, ProjectLeadInput, ProjectLeadStatus } from "@/types/project-lead";
import { createCrmAttachmentSignedUrl } from "@/services/storage.service";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProjectLeadRow = {
  id: string;
  client_name: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  project_name: string;
  location: string | null;
  estimated_cost: number | null;
  status: ProjectLeadStatus;
  source: string | null;
  inquiry_type: string | null;
  notes: string | null;
  quotation_finished: boolean | null;
  created_at: string;
  updated_at: string;
};

type ProjectLeadActivityRow = {
  id: string;
  project_lead_id: string;
  activity_type: string;
  content: string;
  created_at: string;
};

type ProjectLeadAttachmentRow = {
  id: string;
  project_lead_id: string;
  file_name: string;
  storage_path: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
};

const fallbackProjectLeads: ProjectLead[] = [];
const fallbackActivity: ProjectLeadActivity[] = [];
const fallbackAttachments: ProjectLeadAttachment[] = [];

function mapProjectLead(row: ProjectLeadRow): ProjectLead {
  return {
    id: row.id,
    clientName: row.client_name,
    company: row.company,
    phone: row.phone,
    email: row.email,
    projectName: row.project_name,
    location: row.location,
    estimatedCost: row.estimated_cost,
    status: row.status,
    source: row.source ?? "manual",
    inquiryType: row.inquiry_type,
    notes: row.notes,
    quotationFinished: row.quotation_finished ?? false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapActivity(row: ProjectLeadActivityRow): ProjectLeadActivity {
  return {
    id: row.id,
    projectLeadId: row.project_lead_id,
    activityType: row.activity_type,
    content: row.content,
    createdAt: row.created_at,
  };
}

function mapAttachment(row: ProjectLeadAttachmentRow, signedUrl: string | null): ProjectLeadAttachment {
  return {
    id: row.id,
    projectLeadId: row.project_lead_id,
    fileName: row.file_name,
    storagePath: row.storage_path,
    fileType: row.file_type,
    fileSize: row.file_size,
    createdAt: row.created_at,
    signedUrl,
  };
}

export async function getProjectLeads() {
  if (!hasSupabaseEnv()) {
    return fallbackProjectLeads;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("project_leads").select("*").order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapProjectLead(row as ProjectLeadRow));
}

export async function getProjectLeadById(id: string) {
  if (!hasSupabaseEnv()) {
    return fallbackProjectLeads.find((item) => item.id === id) ?? null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("project_leads").select("*").eq("id", id).maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapProjectLead(data as ProjectLeadRow) : null;
}

export async function createProjectLead(input: ProjectLeadInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("project_leads")
    .insert({
      client_name: input.clientName,
      company: input.company,
      phone: input.phone,
      email: input.email,
      project_name: input.projectName,
      location: input.location,
      estimated_cost: input.quotationFinished ? input.estimatedCost : null,
      status: input.status,
      source: input.source,
      inquiry_type: input.inquiryType,
      notes: input.notes,
      quotation_finished: input.quotationFinished,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapProjectLead(data as ProjectLeadRow);
}

export async function updateProjectLead(id: string, input: ProjectLeadInput) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("project_leads")
    .update({
      client_name: input.clientName,
      company: input.company,
      phone: input.phone,
      email: input.email,
      project_name: input.projectName,
      location: input.location,
      estimated_cost: input.quotationFinished ? input.estimatedCost : null,
      status: input.status,
      source: input.source,
      inquiry_type: input.inquiryType,
      notes: input.notes,
      quotation_finished: input.quotationFinished,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteProjectLead(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("project_leads").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getProjectLeadActivity(projectLeadId: string) {
  if (!hasSupabaseEnv()) {
    return fallbackActivity.filter((item) => item.projectLeadId === projectLeadId);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("project_activity_logs")
    .select("*")
    .eq("project_lead_id", projectLeadId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapActivity(row as ProjectLeadActivityRow));
}

export async function addProjectLeadActivity(projectLeadId: string, activityType: string, content: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("project_activity_logs")
    .insert({
      project_lead_id: projectLeadId,
      activity_type: activityType,
      content,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapActivity(data as ProjectLeadActivityRow);
}

export async function getProjectLeadAttachments(projectLeadId: string) {
  if (!hasSupabaseEnv()) {
    return fallbackAttachments.filter((item) => item.projectLeadId === projectLeadId);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("project_lead_attachments")
    .select("*")
    .eq("project_lead_id", projectLeadId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as ProjectLeadAttachmentRow[];
  return Promise.all(
    rows.map(async (row) => {
      const signedUrl = row.storage_path ? await createCrmAttachmentSignedUrl(row.storage_path) : null;
      return mapAttachment(row, signedUrl);
    }),
  );
}

export async function createProjectLeadAttachment(input: {
  projectLeadId: string;
  fileName: string;
  storagePath: string;
  fileType: string | null;
  fileSize: number | null;
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("project_lead_attachments")
    .insert({
      project_lead_id: input.projectLeadId,
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

  const row = data as ProjectLeadAttachmentRow;
  const signedUrl = row.storage_path ? await createCrmAttachmentSignedUrl(row.storage_path) : null;
  return mapAttachment(row, signedUrl);
}
