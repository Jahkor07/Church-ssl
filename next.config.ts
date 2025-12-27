import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://church-ssl-backend.onrender.com/:path*',
      },
      {
        source: '/api/authenticate',
        destination: 'https://church-ssl-backend.onrender.com/authenticate',
      }
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
