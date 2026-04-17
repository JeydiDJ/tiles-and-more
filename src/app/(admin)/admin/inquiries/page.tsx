import { redirect } from "next/navigation";
import { getAdminRoute } from "@/lib/admin-path";

export default function AdminInquiriesPage() {
  redirect(getAdminRoute("/crm"));
}
