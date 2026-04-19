import type { Metadata } from "next";
import { AdminLoginScreen } from "@/components/admin/admin-login-screen";
import { getAdminRoute } from "@/lib/admin-path";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Admin Login",
  description: "Private admin login for Tiles & More.",
  path: getAdminRoute("/login"),
  noIndex: true,
});

metadata.manifest = getAdminRoute("/manifest");
metadata.appleWebApp = {
  capable: true,
  title: "TILES & MORE Admin",
  statusBarStyle: "default",
};

export default function SecretAdminLoginPage() {
  return <AdminLoginScreen />;
}
