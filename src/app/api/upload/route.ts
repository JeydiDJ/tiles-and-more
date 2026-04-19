import { NextResponse } from "next/server";
import { requireAdminApiUser } from "@/lib/admin-auth";
import { uploadAsset } from "@/services/upload.service";

export async function POST(request: Request) {
  const { error } = await requireAdminApiUser("You must be signed in to upload admin assets.");
  if (error) {
    return error;
  }

  const { fileName = "placeholder.jpg" } = await request.json();
  const upload = await uploadAsset(fileName);
  return NextResponse.json({ data: upload }, { status: 201 });
}
