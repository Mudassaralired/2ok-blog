import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllCategories,
  postsInCategory,
  POSTS_PER_PAGE,
} from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";

const SITE_URL = "https://2ok.lol";

type Props = { params: Promise<{ category: string; n: string }> };

// Only pages 2..N are generated. Page 1 lives at /category/[category];
// unknown pages return the 404 page.
export const dynamicParams = false;

export function generateStaticParams() {
  const out: { category: string; n: string }[] = [];
  for (const c of getAllCategories()) {
    const total = Math.max(
      1,
      Math.ceil(postsInCategory(c.slug).length / POSTS_PER_PAGE)
    );
    for (let n = 2; n <= total; n++) {
      out.push({ category: c.slug, n: String(n) });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { category, n } = await params;
  const cat = getAllCategories().find((c) => c.slug === category);
  if (!cat) return {};
  const page = Number(n);
  const url = `${SITE_URL}/category/${cat.slug}/page/${n}`;
  return {
    title: `${cat.name} ideas — Page ${page}`,
    description: `Home decor articles about ${cat.name.toLowerCase()} — ideas, tips, and DIY projects from 2ok Home (page ${page}).`,
    openGraph: {
      title: `${cat.name} ideas — Page ${page} | 2ok Home`,
      description: `Home decor articles about ${cat.name.toLowerCase()} from 2ok Home.`,
      url,
    },
    alternates: { canonical: url },
  };
}

export default async function CategoryPageN({ params }: Props) {
  const { category, n } = await params;
  const cat = getAllCategories().find((c) => c.slug === category);
  if (!cat) notFound();
  const posts = postsInCategory(category);
  const totalPages = Math.max(
    1,
    Math.ceil(posts.length / POSTS_PER_PAGE)
  );
  const page = Number(n);
  if (!Number.isInteger(page) || page < 2 || page > totalPages) {
    notFound();
  }
  const pagePosts = posts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay-dark">
        Topic
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
        {cat.name}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-ink-soft">
        {posts.length} {posts.length === 1 ? "article" : "articles"} on{" "}
        {cat.name.toLowerCase()} · Page {page} of {totalPages}
      </p>
      <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {pagePosts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath={`/category/${category}`}
      />
    </div>
  );
}
