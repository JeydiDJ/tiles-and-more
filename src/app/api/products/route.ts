import { NextResponse } from "next/server";
import { getProducts } from "@/services/product.service";

export async function GET() {
  const data = await getProducts();
  return NextResponse.json({ data });
}
