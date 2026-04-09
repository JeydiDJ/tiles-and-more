import type { InquiryInput } from "@/types/inquiry";

export function validateInquiry(input: InquiryInput) {
  const errors: string[] = [];

  if (!input.name.trim()) errors.push("Name is required.");
  if (!input.email.trim()) errors.push("Email is required.");
  if (!input.message.trim()) errors.push("Message is required.");

  return {
    success: errors.length === 0,
    errors,
  };
}
