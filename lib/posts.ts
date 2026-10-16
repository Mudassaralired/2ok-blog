import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO date, e.g. "2026-10-16"
  excerpt: string;
  category: string;
  cover: string; // path under /public, e.g. "/covers/halloween.svg"
  readingTime: number; // minutes
};

export type Post = {
  meta: PostMeta;
  contentHtml: string;
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
    cover: String(data.cover ?? "/covers/default.svg"),
    readingTime: Math.max(2, Math.round(words / 200)),
  };
}

/** All posts, newest first. */
export function getAllPosts(): PostMeta[] {
  return readSlugs()
    .map(metaFor)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Full post including rendered HTML. */
export async function getPost(slug: string): Promise<Post | null> {
  const file = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { content } = matter(raw);
  const processed = await remark().use(html).process(content);
  return { meta: metaFor(slug), contentHtml: processed.toString() };
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
