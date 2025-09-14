import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    API_URL: process.env.API_URL || 'http://localhost:8080',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: 'nyc3.digitaloceanspaces.com',
      },
    ],
  },
};

export default nextConfig;
