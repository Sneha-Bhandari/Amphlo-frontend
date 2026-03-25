/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.1.77",
        port: "3001",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/uploads/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*/",
        destination: "https://frontbackend.amphlo.com/:path*/",
      },
      {
        source: "/api/:path*",
        destination: "https://frontbackend.amphlo.com/:path*",
      },
    ];
  }
};

export default nextConfig;