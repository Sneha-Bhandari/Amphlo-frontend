/** @type {import('next').NextConfig} */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://frontbackend.amphlo.com";

const nextConfig = {
  reactCompiler: true,

images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "frontbackend.amphlo.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "192.168.1.97",
        port: "3002",
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