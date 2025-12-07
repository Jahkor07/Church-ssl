import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable Turbopack optimizations
  turbopack: {
    resolveAlias: {
      "@/components": "./src/components",
      "@/lib": "./src/lib",
      "@/app": "./src/app",
    },
  },
  // Optimize webpack for faster builds
  webpack: (config, { dev, isServer }) => {
    // Reduce bundle size by excluding unnecessary modules
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups.shared = {
        name: 'app-shared',
        chunks: 'all',
        test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
        priority: 20,
        enforce: true,
      };
    }
    
    return config;
  },
  // Optimize React compiler
  reactStrictMode: false, // Can cause double rendering in development
  // Configure image optimization
  images: {
    minimumCacheTTL: 60,
  },
};

export default nextConfig;