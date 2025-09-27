import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["github.com", "res.cloudinary.com","example.com","maps.googleapis.com"],
  },
  remotePatterns: [
    {
      protocol: "https",
      hostname: "*",
    },
    {
      protocol: "http",
      hostname: "*",
    }
  ],
};

export default nextConfig;
