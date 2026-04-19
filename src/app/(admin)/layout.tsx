import type { Metadata } from "next";
import { AdminThemeProvider } from "@/components/admin/admin-theme-provider";
import { AdminShell } from "@/components/admin/admin-shell";
import { createPageMetadata } from "@/lib/seo";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = createPageMetadata({
  title: "Admin",
  description: "Private admin area.",
  path: "/admin",
  noIndex: true,
});

metadata.manifest = "/admin.webmanifest";
metadata.appleWebApp = {
  capable: true,
  title: "TILES & MORE Admin",
  statusBarStyle: "default",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let userEmail: string | undefined;

  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    userEmail = user?.email;
  }

  return (
    <AdminThemeProvider>
      <AdminShell userEmail={userEmail}>{children}</AdminShell>
    </AdminThemeProvider>
  );
}
