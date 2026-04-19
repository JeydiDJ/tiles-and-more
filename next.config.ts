import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : "gjqnoadramhzxwklsxkh.supabase.co";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.241", "localhost", "127.0.0.1"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHostname,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
  async rewrites() {
    const adminSegment = (process.env.ADMIN_SECRET_PATH ?? "studio-entry").replace(/^\/+|\/+$/g, "") || "studio-entry";

    return {
      beforeFiles: [
        {
          source: `/${adminSegment}/login`,
          destination: "/admin/login",
        },
        {
          source: `/${adminSegment}`,
          destination: "/admin",
        },
        {
          source: `/${adminSegment}/:path*`,
          destination: "/admin/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
