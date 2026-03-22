import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "apod.nasa.gov" },
      { protocol: "https", hostname: "images-assets.nasa.gov" },
      { protocol: "https", hostname: "www.nasa.gov" },
      { protocol: "https", hostname: "photojournal.jpl.nasa.gov" },
      { protocol: "https", hostname: "assets.science.nasa.gov" },
    ],
  },
};

export default nextConfig;
