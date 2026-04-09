export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  submittedAt: string;
};

export type InquiryInput = Omit<Inquiry, "id" | "submittedAt">;
