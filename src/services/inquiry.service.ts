import type { Inquiry, InquiryInput } from "@/types/inquiry";

const inquiries: Inquiry[] = [];

export async function getInquiries() {
  return inquiries;
}

export async function createInquiry(payload: InquiryInput) {
  const inquiry: Inquiry = {
    id: crypto.randomUUID(),
    ...payload,
    submittedAt: new Date().toISOString(),
  };

  inquiries.push(inquiry);
  return inquiry;
}
