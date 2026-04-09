import type { InquiryInput } from "@/types/inquiry";

const inquiries: InquiryInput[] = [];

export async function getInquiries() {
  return inquiries;
}

export async function createInquiry(payload: InquiryInput) {
  inquiries.push(payload);
  return payload;
}
