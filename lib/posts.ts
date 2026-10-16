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
const CLOUDINARY = "https://res.cloudinary.com/knb4zxgu/image/upload";

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO date, e.g. "2026-10-16"
  excerpt: string;
  category: string;
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
    cover: String(data.cover ?? `${CLOUDINARY}/f_auto,q_auto/2ok-blog/default.jpg`),
    readingTime: Math.max(2, Math.round(words / 200)),
  };
}

/** All posts, newest first. */
export function getAllPosts(): PostMeta[] {
  return readSlugs()
    .map(metaFor)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** 1200x630 OG/social image for a post slug. */
export function ogImageFor(slug: string): string {
  return `${CLOUDINARY}/w_1200,h_630,c_fill/f_auto,q_auto/2ok-blog/${slug}.jpg`;
}

/** Descriptive cover alt text per post (10-15 words). */
const COVER_ALTS: Record<string, string> = {
  "halloween-decor-ideas-2026":
    "Moody Halloween porch with orange, white and green pumpkins, eucalyptus and lit black candles on stone steps at dusk",
  "christmas-decor-budget-2026":
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

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
