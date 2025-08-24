import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/ronka_closet_community/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
