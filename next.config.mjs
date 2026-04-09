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
      {
        protocol: "https",
        hostname: "frontbackend.amphlo.com",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://frontbackend.amphlo.com/api/:path*",
      },
      // Rewrite for your login API (192.168.1.97:3000)
      {
        source: "/auth/:path*",
        destination: "http://192.168.1.97:3000/auth/:path*",
      },
    ];
  }
};

export default nextConfig;