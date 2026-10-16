import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export → deployable on Cloudflare Pages (or any static host).
  // Build output lands in `out/`.
  output: "export",

  // next/image optimization needs a server; on static export we serve
  // pre-optimized images as-is.
  images: { unoptimized: true },

  // NOTE: `cacheComponents` (Next 16's new caching model) is intentionally
  // OFF. It forbids the classic `dynamic` / `dynamicParams` segment configs
  // that static export relies on (see app/sitemap.ts, app/blog/[slug]).
  // For a fully static blog the classic model is the correct, stable choice.
  // (`partialPrefetching` also removed — it requires cacheComponents.)
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
