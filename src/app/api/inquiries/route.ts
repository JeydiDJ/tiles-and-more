import { NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/admin-auth";
import { createInquiry, getInquiries } from "@/services/inquiry.service";
import { validateInquiry } from "@/lib/validations";

export async function GET() {
  const { error } = await requireAdminApiUser("You must be signed in to view inquiries.");
  if (error) {
    return error;
  }

  const inquiries = await getInquiries();
  return NextResponse.json({ data: inquiries });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const result = validateInquiry(payload);

  if (!result.success) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  const inquiry = await createInquiry(payload);
  return NextResponse.json({ data: inquiry }, { status: 201 });
}
