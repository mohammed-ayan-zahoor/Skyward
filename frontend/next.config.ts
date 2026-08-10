import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:7001/api/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "http://127.0.0.1:7001/uploads/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "assets.website-files.com" },
      { protocol: "http", hostname: "127.0.0.1", port: "7001" },
      { protocol: "http", hostname: "localhost", port: "7001" },
    ],
  },
};

export default nextConfig;
