import { NextResponse } from "next/server";
import { uploadAsset } from "@/services/upload.service";

export async function POST(request: Request) {
  const { fileName = "placeholder.jpg" } = await request.json();
  const upload = await uploadAsset(fileName);
  return NextResponse.json({ data: upload }, { status: 201 });
}
