import { buildSitemapEntries, sitemapEntriesToXml } from "@/lib/sitemap-entries";

// Alias sitemap endpoint. Serves byte-identical content to /sitemap.xml.
// Exists solely to break Google Search Console's stuck "Couldn't fetch"
// failure cache: submitting this brand-new URL forces GSC's background
// fetcher to perform a real network request instead of replaying the
// cached failure state for /sitemap.xml.
//
// Next 16 + static export: forced static so `next build` prerenders it.
export const dynamic = "force-static";

export async function GET() {
  const xml = sitemapEntriesToXml(buildSitemapEntries());
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
