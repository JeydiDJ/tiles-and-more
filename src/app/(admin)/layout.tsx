import { AdminThemeProvider } from "@/components/admin/admin-theme-provider";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminThemeProvider>{children}</AdminThemeProvider>;
}
