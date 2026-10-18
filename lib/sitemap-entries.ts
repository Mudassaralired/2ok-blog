import { getAllPosts, getAllCategories } from "@/lib/posts";

const SITE_URL = "https://2ok.lol";

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
}

// Shared sitemap entries — used by both /sitemap.xml (app/sitemap.ts)
// and the alias /sitemap-v2.xml (app/sitemap-v2.xml/route.ts).
// The alias exists to break Google Search Console's stuck "Couldn't fetch"
// cache: submitting a brand-new sitemap URL forces GSC's background fetcher
// to perform a real network request instead of replaying its cached failure.
export function buildSitemapEntries(): SitemapEntry[] {
  const posts: SitemapEntry[] = getAllPosts().map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Listing pages: use the newest post date as a stable lastModified.
  // (new Date() per build would make Google ignore the signal.)
  const newestPost = posts.length > 0 ? posts[0].lastModified : new Date("2026-10-16");

  const categories: SitemapEntry[] = getAllCategories().map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    lastModified: newestPost,
    changeFrequency: "weekly",
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

export function sitemapEntriesToXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (e) =>
        `<url><loc>${e.url}</loc><lastmod>${e.lastModified.toISOString()}</lastmod><changefreq>${e.changeFrequency}</changefreq><priority>${e.priority}</priority></url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}
