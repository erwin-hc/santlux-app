import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removido o 'experimental', a chave fica no primeiro nível
  allowedDevOrigins: ["10.0.0.40", "localhost:3000"],

  // Se você tiver outras configs, coloque-as aqui, ex:
  // reactStrictMode: true,
};

export default nextConfig;
