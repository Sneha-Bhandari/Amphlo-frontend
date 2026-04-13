/** @type {import('next').NextConfig} */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://frontbackend.amphlo.com";
const IMAGE_HOST = process.env.NEXT_PUBLIC_IMAGE_HOST || "frontbackend.amphlo.com";

const nextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: IMAGE_HOST,
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: IMAGE_HOST,
        pathname: "/uploads/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
      {
        source: "/auth/:path*",
        destination: `${API_URL}/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;