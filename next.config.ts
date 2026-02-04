import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactStrictMode: true,
  allowedDevOrigins: ["http://localhost:5000"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/nagarjun-avala.png",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/proxy/api/:path*",
        destination: "http://18.61.161.64:5000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
