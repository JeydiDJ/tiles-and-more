import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { createPageMetadata, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  ...createPageMetadata(),
  referrer: "origin-when-cross-origin",
  category: "Construction and home improvement",
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png" }],
    shortcut: ["/favicon/favicon.ico"],
  },
  manifest: "/favicon/site.webmanifest",
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
  },
  other: {
    "theme-color": "#231f20",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
