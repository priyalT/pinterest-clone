import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      }
    ],
  },
  async redirects() {
    return [
      { source: '/login',
        destination: '/',
        permanent: true
      },
      { source: '/register',
        destination: '/',
        permanent: true
      }
    ]
  },
};

export default nextConfig;
