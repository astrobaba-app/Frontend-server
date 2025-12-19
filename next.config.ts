import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["pobvuzwlwmklffefuzxv.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pobvuzwlwmklffefuzxv.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
          { key: "Access-Control-Allow-Credentials", value: "true" },
          // Allows WebView to load iframes if needed
          { key: "X-Frame-Options", value: "ALLOWALL" },
        ],
      },
    ];
  },

};

export default nextConfig;
