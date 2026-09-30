import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O front importa tipos e schemas de ../shared (monorepo), então a raiz do
  // Turbopack precisa ser a raiz do repositório.
  turbopack: { root: path.join(__dirname, "..") },
};

export default nextConfig;
