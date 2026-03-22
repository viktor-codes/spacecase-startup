import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

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

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG ?? "spacecase",
  project: process.env.SENTRY_PROJECT ?? "frontend",
  silent: !process.env.CI,
  telemetry: false,
});
