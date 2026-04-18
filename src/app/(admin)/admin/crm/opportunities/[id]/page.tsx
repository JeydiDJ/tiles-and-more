import { notFound } from "next/navigation";
import { CrmOpportunityDetail } from "@/components/admin/crm-opportunity-detail";
import {
  getCrmContacts,
  getCrmOpportunityActivity,
  getCrmOpportunityAttachments,
  getCrmOpportunityById,
} from "@/services/crm.service";

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

  return <CrmOpportunityDetail opportunity={opportunity} contacts={contacts} activity={activity} attachments={attachments} />;
}
