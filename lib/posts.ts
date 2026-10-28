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

/** Descriptive cover alt text per post (10-15 words). Written from the
 *  actual cover images (visually inspected 2026-10-28). CoverImage and
 *  the OG image both use this map, so a descriptive alt here fixes the
 *  hero alt and the card alt site-wide. */
const COVER_ALTS: Record<string, string> = {
  "halloween-decor-ideas":
    "Moody Halloween porch with orange, white and green pumpkins, eucalyptus and lit black candles on stone steps at dusk",
  "budget-christmas-decor":
    "Cozy Christmas living room with dried-orange-slice tree, stocking-hung fireplace mantel and warm fairy lights",
  "small-living-room-ideas":
    "Bright small living room with cream boucle sofa, round wall mirror and sheer curtains making the space feel larger",
  "diy-wall-decor-beginners":
    "DIY gallery wall with framed pressed botanicals, textured spackle canvas art and macrame hanging above a workbench",
  "christmas-table-decor":
    "A festive Christmas dining table with a long tray centerpiece of candles, greenery and gold ornaments",
  "small-living-room-curtains":
    "A small living room with floor-to-ceiling sheer linen curtains on a rod mounted near the ceiling",
  "bedroom-wall-decor-ideas":
    "A bedroom with a gallery wall of framed botanical prints and an abstract piece above the bed",
  "above-sofa-wall-decor":
    "A living room with a large abstract painting above a beige sofa, a floor lamp, and a wooden coffee table",
  "basket-wall-decor":
    "Woven seagrass baskets arranged as wall art above a beige sofa",
  "beadboard-accent-wall":
    "A living room with a white beadboard accent wall behind a slipcovered sofa",
  "best-shelving-small-living-room":
    "A small living room with white floating shelves and a wooden ladder shelf beside a grey sofa",
  "board-and-batten-wall":
    "A living room with a vertical board-and-batten accent wall behind a beige sofa",
  "budget-small-living-room-decor":
    "A cozy budget small living room with a floor lamp, a round wall mirror, and a beige loveseat",
  "chalkboard-wall-ideas":
    "A kitchen with a large chalkboard menu wall beside a wooden dining table",
  "christmas-garland-ideas":
    "A fireplace mantel dressed with a lit Christmas garland and hanging stockings",
  "christmas-living-room-decor":
    "A Christmas living room with a lit tree, a garland-dressed fireplace, and a beige sofa",
  "christmas-mantel-decor":
    "Three Christmas mantel styling ideas shown side by side with garlands and stockings",
  "christmas-porch-decor":
    "A Christmas front porch with a wreath on a green door, a plaid throw, and potted evergreens",
  "christmas-tree-alternatives":
    "Christmas tree alternatives including a wall-mounted lit tree and small potted trees",
  "christmas-tree-decorating-ideas":
    "A fully decorated Christmas tree with red ornaments beside a lit fireplace",
  "christmas-wall-decor-ideas":
    "A living room wall decorated with a lit Christmas garland and a wreath above a sofa",
  "damage-free-wall-decor":
    "A damage-free gallery wall of framed prints above a wooden console table",
  "diy-christmas-wreath-ideas":
    "A Christmas wreath with a red bow hanging on a dark blue front door",
  "diy-floating-shelves":
    "Two wooden floating shelves styled with books and plants above a beige sofa",
  "diy-picture-frame-moulding":
    "A dining room wall with white picture-frame moulding panels",
  "diy-plaster-wall-art":
    "An artist studio with a textured plaster canvas on an easel",
  "diy-wall-decor-guide":
    "A living room gallery wall with a plaster arch artwork, framed prints, and a macrame hanging",
  "diy-wall-decor-ideas":
    "A gallery wall with framed art, a macrame hanging, and a terracotta painted arch",
  "diy-wall-stencil-ideas":
    "A living room with a grey geometric stenciled accent wall behind a sofa",
  "dollar-tree-christmas-diy":
    "Dollar Tree Christmas DIY supplies and bottle-brush trees arranged on a wooden table",
  "entryway-wall-decor-ideas":
    "An entryway with a wooden console table, a large round mirror, and a vase of branches",
  "floating-shelf-weight-capacity":
    "A long wooden floating shelf loaded with books above a sofa",
  "frame-matting-guide":
    "Five matted framed art prints arranged on a wall above an armchair",
  "gallery-wall-layouts":
    "A 3x3 grid gallery wall of botanical prints above a beige sofa",
  "gallery-wall-templates":
    "A salon-style gallery wall of mixed frames above a wooden console",
  "limewash-walls":
    "A living room with a textured limewash accent wall behind a linen sofa",
  "macrame-cord-guide":
    "A macrame wall hanging above a worktable with cord spools and knotting supplies",
  "macrame-patterns":
    "A large layered macrame wall hanging in a bedroom corner above a rattan chair",
  "macrame-wall-hanging":
    "A single macrame wall hanging beside a rattan chair and a basket of cord",
  "mini-macrame-decor":
    "Small mini macrame wall hangings above a wooden console table",
  "mirror-wall-decor-ideas":
    "A large arched mirror above a wooden console in a bright living room",
  "painted-arch-accent-wall":
    "A terracotta painted arch accent wall with a console table and lamp",
  "peel-stick-wallpaper-accent-wall":
    "A bedroom with a botanical peel-and-stick wallpaper accent wall",
  "plaster-art-colors":
    "Three textured plaster art panels in cream, terracotta, and green above a sideboard",
  "plaster-art-materials":
    "Three textured plaster art canvases in white and beige leaning against a wall",
  "plaster-art-tools":
    "Plaster art tools laid out flat including trowels, a canvas, tape, and a dust mask",
  "pressed-flower-wall-art":
    "Framed pressed flower art arranged as a gallery wall",
  "removable-wallpaper-ideas":
    "A bedroom with a leafy green removable wallpaper accent wall",
  "renter-friendly-wall-decor":
    "A renter-friendly wall with taped-up prints, leaning frames, and a macrame hanging",
  "shiplap-accent-wall":
    "A living room with a white shiplap accent wall behind a grey sofa",
  "small-gallery-wall-ideas":
    "A small vertical gallery wall of three framed prints beside a bed",
  "small-living-room-color-schemes":
    "A neutral small living room with a beige sofa, a floor lamp, and soft curtains",
  "small-living-room-furniture-arrangement":
    "A small living room arranged with a sofa and two rattan chairs around a coffee table",
  "small-living-room-layout-mistakes":
    "A small living room with a sofa, rattan chairs, and a round coffee table",
  "small-living-room-layouts":
    "A small living room layout with a wall-mounted TV and a grey sofa",
  "small-living-room-lighting":
    "A small living room at night lit by warm lamps and a backlit TV",
  "small-living-room-paint-colors":
    "A small living room with paint swatch cards fanned out on the coffee table",
  "small-living-room-rug-size":
    "A living room rug sized under a sofa and coffee table with a measuring tape on the floor",
  "small-living-room-sofa":
    "A beige small-space sofa with green cushions beside a black floor lamp",
  "small-living-room-storage-ideas":
    "A small living room with wall shelves, woven baskets, and a storage ottoman",
  "small-living-room-tv-layout":
    "A small living room TV layout with a console under a wall-mounted TV opposite a sofa",
  "tapestry-wall-hanging":
    "A geometric woven tapestry hanging above a sofa in a warm living room",
  "textured-plaster-art":
    "A large arched textured plaster artwork above a wooden sideboard",
  "thrifted-frame-flips":
    "Empty thrifted picture frames in black, gold, and green with paint supplies on the floor",
  "thrifted-frame-makeover":
    "A gallery wall of empty made-over frames in black, gold, and natural wood",
  "washi-tape-wall-art":
    "A geometric washi tape triangle pattern on a bedroom wall above a bed",
  "wood-slat-accent-wall":
    "A living room with a vertical wood slat accent wall and a wall-mounted TV",
};

export function coverAlt(slug: string, fallback: string): string {
  return COVER_ALTS[slug] ?? fallback;
}

/** FAQ items parsed from an article's FAQ section, for FAQPage JSON-LD.
 *  Two formats exist on the site and both are handled: newer articles use
 *  `### Question` headings, older ones use a bold `**Question?**` line.
 *  A bold line only counts as a question when it is the whole line and
 *  ends with `?` — bold lead-ins inside answers (e.g. `**Note:** ...`)
 *  have text after the closing `**` and are left alone. */
export type FaqItem = { question: string; answer: string };

function stripMarkdown(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getFaqItems(slug: string): FaqItem[] {
  const file = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, "utf8");
  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, "");
  const lines = body.split("\n");
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^## (FAQ|Frequently asked questions)\s*$/.test(lines[i])) {
      start = i + 1;
      break;
    }
  }
  if (start < 0) return [];
  const items: FaqItem[] = [];
  let question = "";
  let answerLines: string[] = [];
  const flush = () => {
    const answer = stripMarkdown(answerLines.join(" "));
    if (question && answer) items.push({ question, answer });
    answerLines = [];
  };
  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    if (/^## /.test(line)) break;
    const h3 = line.match(/^###\s+(.+?)\s*$/);
    const bold = line.match(/^\*\*(.+?\?)\*\*\s*$/);
    if (h3 || bold) {
      flush();
      question = stripMarkdown((h3 ?? bold)![1]);
      continue;
    }
    if (question) answerLines.push(line);
  }
  flush();
  return items;
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
