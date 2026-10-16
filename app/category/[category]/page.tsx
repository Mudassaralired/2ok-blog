import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCategories, postsInCategory } from "@/lib/posts";
import PostCard from "@/components/PostCard";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  return getAllCategories().map((c) => ({ category: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getAllCategories().find((c) => c.slug === category);
  if (!cat) return {};
  return {
    title: `${cat.name} ideas`,
    description: `Home decor articles about ${cat.name.toLowerCase()} — ideas, tips, and DIY projects from 2ok Home.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getAllCategories().find((c) => c.slug === category);
  if (!cat) notFound();
  const posts = postsInCategory(category);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
        Topic
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
        {cat.name}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-ink-soft">
        {posts.length} {posts.length === 1 ? "article" : "articles"} on{" "}
        {cat.name.toLowerCase()}.
      </p>
      <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </div>
  );
}
