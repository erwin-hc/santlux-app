import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["0.0.0.0"],
  reactStrictMode: false,
  output: "standalone",
};

export default nextConfig;
