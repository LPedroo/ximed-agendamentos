import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O front importa tipos e schemas de ../shared (monorepo), então a raiz do
  // Turbopack precisa ser a raiz do repositório.
  turbopack: { root: path.join(__dirname, "..") },
  // Redirect na configuração (e não em um Server Component): o redirect() dentro da página
  // quebrava o dev com "cannot have a negative time stamp" no performance.measure do React.
  redirects: async () => [{ source: "/", destination: "/appointments", permanent: false }],
};

export default nextConfig;
