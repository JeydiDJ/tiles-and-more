import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.241", "localhost", "127.0.0.1"],
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
          destination: "/admin-login",
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
