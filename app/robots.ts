import type { MetadataRoute } from "next";

const SITE_URL = "https://2ok.lol";

// Next 16 + static export: this route handler must be forced static,
// otherwise `next build` fails.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
