import type { Metadata } from "next";
import { getPostsPage, getTotalPages } from "@/lib/posts";
import BlogSearch from "@/components/BlogSearch";

const SITE_URL = "https://2ok.lol";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "All home decor and DIY articles — seasonal ideas, small-space tricks, and budget-friendly projects.",
  openGraph: {
    title: "Blog | 2ok Home",
    description:
      "All home decor and DIY articles — seasonal ideas, small-space tricks, and budget-friendly projects.",
    url: `${SITE_URL}/blog`,
  },
  alternates: { canonical: `${SITE_URL}/blog` },
};

export default function BlogIndexPage() {
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

      <BlogSearch
        pagePosts={getPostsPage(1)}
        currentPage={1}
        totalPages={getTotalPages()}
      />
    </div>
  );
}
