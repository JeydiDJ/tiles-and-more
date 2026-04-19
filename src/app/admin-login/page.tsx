import { redirect } from "next/navigation";
import { getAdminRoute } from "@/lib/admin-path";

export default function LegacyAdminLoginPage() {
  redirect(getAdminRoute("/login"));
}
