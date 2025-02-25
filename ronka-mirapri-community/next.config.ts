import { NextConfig } from "next";
import { WebpackConfigContext } from "next/dist/server/config-shared";

const nextConfig: NextConfig = {
  webpack(config, { isServer }: WebpackConfigContext) {
    if (!isServer) {
      // 클라이언트 측에서 코드 분할 최적화
      config.optimization.splitChunks = {
        chunks: "all",
      };
      config.optimization.minimize = true;
    }
    return config;
  },
  env: {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
