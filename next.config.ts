import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.50.91.50'],
  images: { qualities: [90] },
};

export default nextConfig;
