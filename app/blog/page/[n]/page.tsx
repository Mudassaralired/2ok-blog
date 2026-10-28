import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostsPage, getTotalPages } from "@/lib/posts";
import BlogSearch from "@/components/BlogSearch";

const SITE_URL = "https://2ok.lol";

// Only pages 2..totalPages are generated. /blog/page/1 is never built:
// page 1 lives at /blog, and a duplicate copy would split its ranking.
// Unknown pages (0, 99, abc) return the 404 page.
export const dynamicParams = false;

export function generateStaticParams() {
  const total = getTotalPages();
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({
    n: String(i + 2),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ n: string }>;
}): Promise<Metadata> {
  const { n } = await params;
  const page = Number(n);
  return {
    title: `Blog — Page ${page}`,
    description: `Home decor and DIY articles, page ${page} — seasonal ideas, small-space tricks, and budget-friendly projects.`,
    openGraph: {
      title: `Blog — Page ${page} | 2ok Home`,
      description: `Home decor and DIY articles, page ${page} — seasonal ideas, small-space tricks, and budget-friendly projects.`,
      url: `${SITE_URL}/blog/page/${n}`,
    },
    alternates: { canonical: `${SITE_URL}/blog/page/${n}` },
  };
}

export default async function BlogIndexPageN({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const page = Number(n);
  const total = getTotalPages();
  if (!Number.isInteger(page) || page < 2 || page > total) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay-dark">
        All articles
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
        The idea library
      </h1>
      <p className="mt-4 max-w-xl text-lg text-ink-soft">
        Every decor idea we&apos;ve published — newest first.
      </p>
      <p className="mt-2 text-sm text-stone-warm">
        Page {page} of {total}
      </p>

      <BlogSearch
        pagePosts={getPostsPage(page)}
        currentPage={page}
        totalPages={total}
      />
    </div>
  );
}
