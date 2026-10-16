import type { MetadataRoute } from "next";
import { getAllPosts, getAllCategories } from "@/lib/posts";

const SITE_URL = "https://2ok.lol";

// Next 16 + static export: this route handler must be forced static,
// otherwise `next build` fails.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Listing pages: use the newest post date as a stable lastModified.
  // (new Date() per build would make Google ignore the signal.)
  const newestPost = posts.length > 0 ? posts[0].lastModified : new Date("2026-10-16");

  const categories = getAllCategories().map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    lastModified: newestPost,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: newestPost,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: newestPost,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...categories,
    ...posts,
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date("2026-10-16"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date("2026-10-16"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: new Date("2026-10-16"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date("2026-10-16"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/disclaimer`,
      lastModified: new Date("2026-10-16"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
