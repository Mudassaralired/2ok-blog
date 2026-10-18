import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "@/lib/sitemap-entries";

// Next 16 + static export: this route handler must be forced static,
// otherwise `next build` fails.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries().map((e) => ({
    url: e.url,
    lastModified: e.lastModified,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));
}
