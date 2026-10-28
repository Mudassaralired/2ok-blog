// Builds public/search-index.json from content/posts frontmatter so the
// blog search can filter ALL articles in the browser even though the
// index pages are paginated (12 cards per page). Runs as `prebuild`
// (see package.json) so every deploy regenerates it from the current
// posts — never commit a stale copy by hand.
//
// The JSON is intentionally light: slug, title, excerpt, category,
// cluster, date, readingTime. No cover URLs, no body text.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDir = path.join(root, "content", "posts");
const outFile = path.join(root, "public", "search-index.json");

function field(frontmatter, name) {
  const m = frontmatter.match(new RegExp(`^${name}:\\s*"(.*)"\\s*$`, "m"));
  return m ? m[1] : "";
}

const posts = fs
  .readdirSync(postsDir)
  .filter((f) => f.endsWith(".md"))
  .map((file) => {
    const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
    const fm = raw.match(/^---\n([\s\S]*?)\n---/);
    const frontmatter = fm ? fm[1] : "";
    const words = raw.split(/\s+/).length;
    return {
      slug: file.replace(/\.md$/, ""),
      title: field(frontmatter, "title"),
      excerpt: field(frontmatter, "excerpt"),
      category: field(frontmatter, "category") || "Decor",
      cluster: field(frontmatter, "cluster"),
      date: field(frontmatter, "date") || "2026-01-01",
      readingTime: Math.max(2, Math.round(words / 200)),
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(posts));
console.log(`search-index: ${posts.length} posts -> public/search-index.json`);
