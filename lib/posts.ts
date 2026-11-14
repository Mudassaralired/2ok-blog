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
  "diy-geometric-accent-wall":
    "Living room with a bold terracotta, navy and cream geometric triangle accent wall above a beige sofa",
  "staircase-wall-decor-ideas":
    "Wooden staircase with a diagonal gallery wall of framed photos following the rise of the stairs",
  "diy-wall-mural-ideas":
    "Bedroom with a large hand-painted botanical leaf mural in sage and terracotta behind a wooden bed",
  "christmas-front-door-decor":
    "Red front door at dusk with a large evergreen Christmas wreath, garland frame and glowing lanterns",
  "diy-string-art-wall-decor":
    "Wooden board with a terracotta and cream string art heart hanging above a wooden console",
  "diy-photo-wall-ideas":
    "Grid of nine black-framed family photographs above a beige sofa in a bright living room",
  "diy-wall-planter-ideas":
    "Terracotta pots with trailing pothos plants mounted on a wooden rail on a cream wall",
  "christmas-stocking-display-ideas":
    "Five red and cream knitted Christmas stockings hanging from a wooden mantel with garland and fairy lights",
  "hallway-wall-decor-ideas":
    "Narrow hallway with sage-green board-and-batten panelling, round mirror, framed prints and patterned runner rug",
  "small-living-room-wall-decor-ideas":
    "Small living room sofa wall with large arched mirror, framed botanical prints and a floating shelf with leaning art",
  "diy-paper-wall-decor":
    "Cream wall decorated with a diagonal cluster of three-dimensional paper flowers and butterflies in blush pink and terracotta above a sofa",
  "christmas-window-decor-ideas":
    "Living-room window at night framed with evergreen garland and fairy lights, a lit wreath and hanging paper snowflakes",
  "kitchen-wall-decor-ideas":
    "Bright farmhouse kitchen wall with open wood shelves, framed herb prints, a chalkboard menu sign and glass jars",
  "boho-wall-decor-ideas":
    "Woven basket gallery wall with a rattan sunburst mirror, cream macrame hanging and a terracotta plant pocket above a sofa",
  "bathroom-wall-decor-ideas":
    "Bright bathroom with above-toilet wood shelves, rolled towels, framed botanical prints, a trailing plant and an arched backlit mirror",
  "christmas-staircase-decor":
    "Wooden staircase with deep evergreen garland, warm fairy lights, red velvet bows, stockings and lanterns at the newel post",
  "diy-pallet-wall-decor":
    "Rustic pallet wood accent wall with mixed-tone reclaimed boards, neutral sofa and shelf with plants in warm light",
  "diy-fabric-wall-art":
    "Bright living room with large terracotta and cream floral fabric panel above a neutral sofa",
  "small-living-room-accent-wall-ideas":
    "Bright small living room with deep green accent wall behind a pale sofa and large framed botanical print",
  "christmas-kitchen-decor-ideas":
    "Festive farmhouse kitchen with low greenery and candle tray centrepiece on the island and garland on cabinet tops",
  "dining-room-wall-decor-ideas":
    "Warm dining room wall with a large framed botanical print above a dark wood sideboard, flanked by brass sconces",
  "home-office-wall-decor-ideas":
    "Bright home office with a white desk, oak slat wall, three framed abstract prints and a floating shelf",
  "minimalist-wall-decor-ideas":
    "Calm minimalist living room with one oversized beige abstract canvas above a pale grey sofa and an arched leaning mirror",
  "christmas-bedroom-decor-ideas":
    "Cosy Christmas bedroom with a tartan throw on a white bed, evergreen garland with fairy lights over the headboard and a lit mini tree",
  "diy-accent-wall-paint-ideas":
    "Deep forest-green painted accent wall behind a cream sofa in a bright living room",
  "modern-farmhouse-wall-decor":
    "White shiplap feature wall with oak shelves, ceramics and black sconces in a farmhouse living room",
  "large-wall-decor-ideas":
    "Oversized abstract canvas in terracotta and cream above a long sofa on a large living room wall",
  "christmas-dining-room-decor":
    "Christmas dining table with low evergreen centerpiece, taper candles and a glowing chandelier",
  "diy-embroidery-hoop-wall-art":
    "A wooden embroidery hoop with pink and terracotta wildflowers stitched on cream linen, leaning on a light oak shelf against a terracotta plaster wall beside a small vase of dried flowers",
  "diy-plate-wall-decor":
    "A grid of nine hand-painted decorative plates in terracotta, cream, sage green and dusty blue with floral and geometric patterns, hung on a cream wall above a linen sofa with terracotta cushions",
  "small-living-room-mirror-ideas":
    "Tall arched mirror with a black frame leaning against a cream wall beside a terracotta sofa, reflecting a bright window",
  "christmas-entryway-decor-ideas":
    "Christmas entryway with a half-moon console table, round mirror with a berry wreath, lit garland, brass lanterns and a layered rug",
  "diy-wall-clock-decor-ideas":
    "Large round pallet-wood wall clock with black Roman numerals above a beige linen sofa with terracotta cushions",
  "diy-wall-sconce-ideas":
    "Warm brass wall sconces with cream shades flanking a round mirror above a wooden sideboard at dusk",
  "nursery-wall-decor-ideas":
    "Boho nursery with a blush and terracotta crochet rainbow above a white crib beside a wooden rocking chair",
  "diy-christmas-advent-calendar":
    "Red and cream fabric advent calendar with 24 numbered pockets beside a lit Christmas tree and armchair",
  "diy-woven-wall-hanging-ideas":
    "Handwoven wall hanging in cream, rust and sage yarn with a geometric pattern and long fringe, hung from a driftwood branch above a linen sofa",
  "diy-pegboard-wall-decor":
    "Sage-green painted pegboard with wooden shelves, framed botanical prints, woven baskets and trailing plants above a cream linen sofa",
  "diy-dried-flower-wall-decor":
    "Dried flower hoop wall hanging with lavender, eucalyptus and pampas beside a tall terracotta vase of pampas grass above a cream sofa",
  "diy-christmas-gallery-wall-ideas":
    "Christmas gallery wall in a 3 by 3 grid of framed snowflakes, tree art, sheet music and a family photo wreath under a lit pine garland above a cream sofa",
  "diy-shadow-box-wall-decor":
    "Deep dark-wood shadow box with dried flowers, ticket stubs and small keepsakes on a warm cream wall",
  "diy-fairy-light-wall-decor":
    "Bedroom wall with warm-white fairy lights draped in soft waves above a bed with cream linen bedding",
  "diy-terracotta-pot-wall-decor":
    "Terracotta pots hanging on a cream wall in rope macramé holders with trailing green plants, above a wooden sideboard",
  "diy-christmas-village-display":
    "Miniature Christmas village with lit ceramic houses, bottle-brush trees and cotton snow on a wooden mantel with warm fairy lights",
  "kids-room-wall-decor-ideas":
    "Bright kids bedroom wall with a colourful DIY art gallery of framed children's drawings in matching light-wood frames above a white picture ledge holding books, in soft daylight",
  "diy-moss-wall-art":
    "Large framed preserved moss wall art panel above a sofa in a bright living room, mixed green sheet and reindeer moss in an organic pattern within a wooden frame",
  "diy-wooden-sign-wall-decor":
    "A large rustic wooden plank sign with no lettering hanging above a beige linen sofa, layered with a small green wreath and two framed botanical prints in warm natural daylight",
  "diy-christmas-wall-hanging-ideas":
    "A cosy living room wall with a handmade red felt Christmas banner with cream felt trees, a macramé wall hanging with wooden beads, and a pine garland with warm fairy lights on a terracotta wall",
  "rustic-wall-decor-ideas":
    "A warm rustic living-room wall with a reclaimed-wood GATHER sign, woven basket wall and a driftwood shelf holding a mason-jar candle above a linen sofa with terracotta cushions",
  "scandinavian-wall-decor-ideas":
    "Three light-wood frames with botanical line-art prints and a woven wall hanging above a cream sofa with a terracotta cushion in a bright Scandinavian living room",
  "industrial-wall-decor-ideas":
    "Black iron pipe shelves with warm Edison cage bulbs on an exposed red-brick loft wall, with books, plants and terracotta pots in soft window light",
  "diy-christmas-tree-skirt-ideas":
    "A decorated Christmas tree with a handmade white faux-fur tree skirt and wrapped presents in terracotta and cream",
  "diy-metal-wall-decor-ideas":
    "Copper pipe diamond sculpture and wire home word art above a terracotta sofa",
  "diy-mason-jar-wall-decor":
    "Six mason jars with fairy lights on a wooden board above a cream sofa",
  "diy-driftwood-wall-decor":
    "Large driftwood branch with cream macramé hanging above a white sofa with terracotta cushions",
  "diy-christmas-centerpiece-ideas":
    "Long Christmas dining table with evergreen tray centrepiece, tall candles, gold ornaments and fairy lights",
  "diy-air-dry-clay-wall-decor":
    "Minimalist cream clay tiles and a moon-phase clay hanging on a warm terracotta plaster wall above a light oak sideboard with a vase of dried pampas grass",
  "diy-yarn-wall-hanging":
    "Cream, terracotta and sage yarn tassel wall hanging on a wooden dowel above a beige linen sofa in a bright boho living room",
  "diy-wood-bead-wall-decor":
    "Layered wooden bead garlands with cream tassels hanging from a driftwood branch on a terracotta bedroom wall above a bed with cream linen bedding",
  "christmas-tree-topper-ideas":
    "A lit Christmas tree crowned with a glowing gold star and a large red velvet bow in a cozy living room with terracotta walls and a cream sofa",
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

/** Minimal hast node shape — enough for the pin-button transform below
 *  without adding hast/unist type packages. */
type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
};

/** Rehype plugin: wrap every article-body image in a figure with a hover
 *  "Pin it" button linking to Pinterest's create-pin endpoint. Runs at
 *  build time only — the static HTML ships the buttons, no client JS.
 *  Images already inside a link are left alone (no nested anchors). */
function rehypePinButtons(options: { pageUrl: string; pageTitle: string }) {
  const { pageUrl, pageTitle } = options;
  return (tree: HastNode) => {
    const visit = (node: HastNode, inLink: boolean) => {
      if (!node.children) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const childInLink =
          inLink ||
          (child.type === "element" && child.tagName === "a");
        if (
          !inLink &&
          child.type === "element" &&
          child.tagName === "img" &&
          typeof child.properties?.src === "string"
        ) {
          const src = child.properties.src;
          const media = src.startsWith("http")
            ? src
            : `${SITE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
          const alt =
            typeof child.properties.alt === "string"
              ? child.properties.alt
              : "";
          const pinHref =
            "https://www.pinterest.com/pin/create/button/?" +
            `url=${encodeURIComponent(pageUrl)}` +
            `&media=${encodeURIComponent(media)}` +
            `&description=${encodeURIComponent(alt || pageTitle)}`;
          node.children[i] = {
            type: "element",
            tagName: "span",
            properties: { className: ["pin-figure"] },
            children: [
              child,
              {
                type: "element",
                tagName: "a",
                properties: {
                  className: ["pin-btn"],
                  href: pinHref,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  ariaLabel: "Save this image on Pinterest",
                },
                children: [{ type: "text", value: "Pin it" }],
              },
            ],
          };
        } else {
          visit(child, childInLink);
        }
      }
    };
    visit(tree, false);
  };
}

/** Full post including rendered HTML (H2s carry id anchors via rehype-slug). */
export async function getPost(slug: string): Promise<Post | null> {
  const file = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { content } = matter(raw);
  const meta = metaFor(slug);
  const processed = await remark()
    .use(remarkRehype)
    // Custom hast plugin: cast keeps unified's processor generics (typed
    // for the mdast input tree) from rejecting a hast-tree transformer.
    .use(rehypePinButtons as never, {
      pageUrl: `${SITE_URL}/blog/${slug}`,
      pageTitle: meta.title,
    })
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(content);
  // Headings for schema/ToC — ids generated with the same github-slugger
  // algorithm rehype-slug uses, so anchors match the rendered HTML.
  const headings = [...content.matchAll(/^##\s+(.+)$/gm)].map((m) => ({
    text: m[1].trim(),
    id: githubSlug(m[1].trim()),
  }));
  return { meta, contentHtml: processed.toString(), headings };
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
  /** Short meta description (≤145 chars) so hub + paginated pages stay
   *  under 155 chars in search results. On-page copy keeps `description`. */
  metaDescription: string;
};

const CLUSTERS: ClusterInfo[] = [
  {
    slug: "wall-decor",
    name: "DIY Wall Decor",
    tagline: "Our biggest topic",
    description:
      "Step-by-step tutorials and budget ideas for plaster art, gallery walls, macramé, thrifted frames, and renter-friendly projects — the heart of 2ok Home.",
    metaDescription:
      "DIY wall decor ideas on a budget: plaster art, gallery walls, macramé and renter-friendly projects, with step-by-step tutorials.",
  },
  {
    slug: "small-living-room",
    name: "Small Living Room",
    tagline: "Small spaces, big ideas",
    description:
      "Layouts, furniture picks, paint colors, lighting, and storage ideas that make compact living rooms feel twice as big.",
    metaDescription:
      "Small living room ideas: layouts, furniture, paint colors and storage that make compact rooms feel twice as big.",
  },
  {
    slug: "christmas-decor",
    name: "Christmas Decor",
    tagline: "Seasonal on a budget",
    description:
      "Budget-friendly Christmas ideas — mantels, porches, tree alternatives, and dollar-store DIYs that look anything but cheap.",
    metaDescription:
      "Budget Christmas decor ideas: mantels, porches, tree alternatives and dollar-store DIYs that look anything but cheap.",
  },
  {
    slug: "halloween",
    name: "Halloween Decor",
    tagline: "Cozy, not tacky",
    description: "Elegant Halloween decor ideas for a cozy autumn home.",
    metaDescription: "Elegant Halloween decor ideas for a cozy autumn home.",
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
