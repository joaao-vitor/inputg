import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://images.igdb.com/igdb/image/upload/**")],
  }
  /* config options here */
};

export default nextConfig;
