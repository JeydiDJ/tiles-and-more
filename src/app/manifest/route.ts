import { NextResponse } from "next/server";
import { getAdminBasePath, getAdminRoute } from "@/lib/admin-path";

export function GET() {
  return NextResponse.json(
    {
      name: "TILES & MORE Admin",
      short_name: "Admin",
      description: "Admin workspace for catalog, CRM, calendar, and accounting operations.",
      start_url: getAdminRoute(),
      scope: getAdminBasePath(),
      display: "standalone",
      background_color: "#f6f7fb",
      theme_color: "#231f20",
      icons: [
        {
          src: "/favicon/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/favicon/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/manifest+json",
        "Cache-Control": "no-store",
      },
    },
  );
}
