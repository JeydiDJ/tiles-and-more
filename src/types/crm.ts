export const crmOpportunityStages = [
  "new_lead",
  "opportunity",
  "bidding",
  "negotiation",
  "awarded",
  "ongoing",
  "completed",
  "lost",
] as const;

export type CrmOpportunityStage = (typeof crmOpportunityStages)[number];

export type CrmContactPhoneNumber = {
  id: string;
  contactId: string;
  label: string | null;
  phoneNumber: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CrmContactEmailType = "personal" | "work";

export type CrmContactEmail = {
  id: string;
  contactId: string;
  email: string;
  emailType: CrmContactEmailType;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CrmAccount = {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CrmContact = {
  id: string;
  accountId: string;
  fullName: string;
  jobTitle: string | null;
  phone: string | null;
  email: string | null;
  phoneNumbers: CrmContactPhoneNumber[];
  emails: CrmContactEmail[];
  primaryPhone: string | null;
  primaryEmail: string | null;
  workEmail: string | null;
  personalEmail: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CrmOpportunity = {
  id: string;
  accountId: string;
  accountName: string;
  primaryContactId: string | null;
  primaryContactName: string | null;
  name: string;
  location: string | null;
  architectDesignerFirm: string | null;
  architectDesignerContactPerson: string | null;
  architectDesignerPosition: string | null;
  architectDesignerContactNumber: string | null;
  architectDesignerEmail: string | null;
  ownerName: string | null;
  ownerContactPerson: string | null;
  ownerPosition: string | null;
  ownerContactNumber: string | null;
  ownerEmail: string | null;
  estimatedValue: number | null;
  stage: CrmOpportunityStage;
  source: string;
  notes: string | null;
  quotationFinished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CrmOpportunityActivity = {
  id: string;
  opportunityId: string;
  activityType: string;
  content: string;
  createdAt: string;
};

export type CrmOpportunityAttachment = {
  id: string;
  opportunityId: string;
  fileName: string;
  storagePath: string;
  fileType: string | null;
  fileSize: number | null;
  createdAt: string;
  signedUrl: string | null;
};

export type CrmAccountInput = {
  name: string;
  industry: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
};

export type CrmContactInput = {
  accountId: string;
  fullName: string;
  jobTitle: string | null;
  phoneNumbers: Array<{
    label: string | null;
    phoneNumber: string;
    isPrimary: boolean;
  }>;
  emails: Array<{
    email: string;
    emailType: CrmContactEmailType;
    isPrimary: boolean;
  }>;
  notes: string | null;
};

export type CrmOpportunityInput = {
  accountId: string;
  primaryContactId: string | null;
  name: string;
  location: string | null;
  architectDesignerFirm: string | null;
  architectDesignerContactPerson: string | null;
  architectDesignerPosition: string | null;
  architectDesignerContactNumber: string | null;
  architectDesignerEmail: string | null;
  ownerName: string | null;
  ownerContactPerson: string | null;
  ownerPosition: string | null;
  ownerContactNumber: string | null;
  ownerEmail: string | null;
  estimatedValue: number | null;
  stage: CrmOpportunityStage;
  source: string;
  notes: string | null;
  quotationFinished: boolean;
};
