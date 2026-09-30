import type { NextConfig } from "next";

// A API roda em outro host. Reescrevemos /api/* para ela, assim o navegador
// só fala com o domínio do front: o cookie de sessão (httpOnly, SameSite=Strict)
// funciona normalmente e não é preciso configurar CORS.
const API_URL = process.env.API_URL ?? "http://localhost:3333";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/api/:path*` }];
  },
};

export default nextConfig;
