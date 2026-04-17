export const projectLeadStatuses = [
  "new_lead",
  "contacted",
  "quotation_in_progress",
  "quotation_sent",
  "ongoing",
  "completed",
  "on_hold",
  "lost",
] as const;

export type ProjectLeadStatus = (typeof projectLeadStatuses)[number];

export type ProjectLead = {
  id: string;
  clientName: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  projectName: string;
  location: string | null;
  estimatedCost: number | null;
  status: ProjectLeadStatus;
  source: string;
  inquiryType: string | null;
  notes: string | null;
  quotationFinished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProjectLeadActivity = {
  id: string;
  projectLeadId: string;
  activityType: string;
  content: string;
  createdAt: string;
};

export type ProjectLeadAttachment = {
  id: string;
  projectLeadId: string;
  fileName: string;
  storagePath: string;
  fileType: string | null;
  fileSize: number | null;
  createdAt: string;
  signedUrl: string | null;
};

export type ProjectLeadInput = {
  clientName: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  projectName: string;
  location: string | null;
  estimatedCost: number | null;
  status: ProjectLeadStatus;
  source: string;
  inquiryType: string | null;
  notes: string | null;
  quotationFinished: boolean;
};
