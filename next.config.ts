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
};

export default nextConfig;
