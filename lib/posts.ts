import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { slug as githubSlug } from "github-slugger";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export const SITE_URL = "https://2ok.lol";
const CLOUDINARY = "https://res.cloudinary.com/zhzxqahv/image/upload";

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO date, e.g. "2026-10-16"
  excerpt: string;
  category: string;
  /** Topical-authority cluster, e.g. "wall-decor", "small-living-room". Drives interlinking. */
  cluster: string;
  cover: string; // absolute Cloudinary URL (f_auto,q_auto)
  readingTime: number; // minutes
};

export type Post = {
  meta: PostMeta;
  contentHtml: string;
  /** H2 headings (text + anchor id) for ItemList schema / ToC anchors. */
  headings: { text: string; id: string }[];
};

function readSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

function metaFor(slug: string): PostMeta {
  const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), "utf8");
  const { data } = matter(raw);
  const words = raw.split(/\s+/).length;
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? "2026-01-01"),
    excerpt: String(data.excerpt ?? ""),
    category: String(data.category ?? "Decor"),
    cluster: String(data.cluster ?? ""),
    cover: String(data.cover ?? ""),
    readingTime: Math.max(2, Math.round(words / 200)),
  };
}

/** All posts, newest first. */
export function getAllPosts(): PostMeta[] {
  return readSlugs()
    .map(metaFor)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Blog index pagination: 12 cards per page. */
export const POSTS_PER_PAGE = 12;

/** Number of blog index pages. Page 1 is /blog; page n > 1 is /blog/page/n. */
export function getTotalPages(): number {
  return Math.max(1, Math.ceil(getAllPosts().length / POSTS_PER_PAGE));
}

/** One page of posts, newest first. Out-of-range pages return []. */
export function getPostsPage(page: number): PostMeta[] {
  const all = getAllPosts();
  return all.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
}

/** 1200x630 OG/social image for a post slug.
 *  Slugs shortened on 2026-10-19 keep pointing at their original upload path. */
export function ogImageFor(slug: string): string {
  return `${CLOUDINARY}/w_1200,h_630,c_fill/f_auto,q_auto/2ok-blog/${slug}/cover`;
}

/** Descriptive cover alt text per post (10-15 words). */
const COVER_ALTS: Record<string, string> = {
  "halloween-decor-ideas":
    "Moody Halloween porch with orange, white and green pumpkins, eucalyptus and lit black candles on stone steps at dusk",
  "budget-christmas-decor":
    "Cozy Christmas living room with dried-orange-slice tree, stocking-hung fireplace mantel and warm fairy lights",
  "small-living-room-ideas":
    "Bright small living room with cream boucle sofa, round wall mirror and sheer curtains making the space feel larger",
  "diy-wall-decor-beginners":
    "DIY gallery wall with framed pressed botanicals, textured spackle canvas art and macrame hanging above a workbench",
};

export function coverAlt(slug: string, fallback: string): string {
  return COVER_ALTS[slug] ?? fallback;
}

/** Full post including rendered HTML (H2s carry id anchors via rehype-slug). */
export async function getPost(slug: string): Promise<Post | null> {
  const file = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { content } = matter(raw);
  const processed = await remark()
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(content);
  // Headings for schema/ToC — ids generated with the same github-slugger
  // algorithm rehype-slug uses, so anchors match the rendered HTML.
  const headings = [...content.matchAll(/^##\s+(.+)$/gm)].map((m) => ({
    text: m[1].trim(),
    id: githubSlug(m[1].trim()),
  }));
  return { meta: metaFor(slug), contentHtml: processed.toString(), headings };
}

/** All categories with post counts, most posts first. */
export function getAllCategories(): { name: string; count: number; slug: string }[] {
  const counts = new Map<string, number>();
  for (const p of getAllPosts()) {
    counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count, slug: slugify(name) }))
    .sort((a, b) => b.count - a.count);
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function postsInCategory(categorySlug: string): PostMeta[] {
  return getAllPosts().filter((p) => slugify(p.category) === categorySlug);
}

/** Topical-authority clusters: curated topic hubs, finer than categories. */
export type ClusterInfo = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
};

const CLUSTERS: ClusterInfo[] = [
  {
    slug: "wall-decor",
    name: "DIY Wall Decor",
    tagline: "Our biggest topic",
    description:
      "Step-by-step tutorials and budget ideas for plaster art, gallery walls, macramé, thrifted frames, and renter-friendly projects — the heart of 2ok Home.",
  },
  {
    slug: "small-living-room",
    name: "Small Living Room",
    tagline: "Small spaces, big ideas",
    description:
      "Layouts, furniture picks, paint colors, lighting, and storage ideas that make compact living rooms feel twice as big.",
  },
  {
    slug: "christmas-decor",
    name: "Christmas Decor",
    tagline: "Seasonal on a budget",
    description:
      "Budget-friendly Christmas ideas — mantels, porches, tree alternatives, and dollar-store DIYs that look anything but cheap.",
  },
  {
    slug: "halloween",
    name: "Halloween Decor",
    tagline: "Cozy, not tacky",
    description: "Elegant Halloween decor ideas for a cozy autumn home.",
  },
];

/** All clusters that have at least one article, most articles first. */
export function getAllClusters(): (ClusterInfo & { count: number })[] {
  const posts = getAllPosts();
  return CLUSTERS.map((c) => ({
    ...c,
    count: posts.filter((p) => p.cluster === c.slug).length,
  }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);
}

export function getCluster(clusterSlug: string) {
  return getAllClusters().find((c) => c.slug === clusterSlug);
}

export function postsInCluster(clusterSlug: string): PostMeta[] {
  return getAllPosts().filter((p) => p.cluster === clusterSlug);
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
