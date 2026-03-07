import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    return [
      { source: "/", destination: "/landing.html", permanent: false },
    ];
  },
};

export default nextConfig;
