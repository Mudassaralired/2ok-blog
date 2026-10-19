import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllClusters, getCluster, postsInCluster, SITE_URL } from "@/lib/posts";
import PostCard from "@/components/PostCard";

type Props = { params: Promise<{ cluster: string }> };

export async function generateStaticParams() {
  return getAllClusters().map((c) => ({ cluster: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cluster } = await params;
  const info = getCluster(cluster);
  if (!info) return {};
  const description = `${info.name}: ${info.description}`;
  const url = `${SITE_URL}/topics/${info.slug}`;
  return {
    title: `${info.name} — ideas, tutorials & guides`,
    description,
    openGraph: {
      title: `${info.name} | 2ok Home`,
      description,
      url,
    },
    alternates: { canonical: url },
  };
}

export default async function TopicPage({ params }: Props) {
  const { cluster } = await params;
  const info = getCluster(cluster);
  if (!info) notFound();
  const posts = postsInCluster(cluster);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <nav className="text-xs font-medium text-stone-warm" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-clay-dark">
          Home
        </Link>
        {" / "}
        <span>Topics</span>
        {" / "}
        <span>{info.name}</span>
      </nav>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-clay-dark">
        {info.tagline}
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
        {info.name}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
        {info.description}
      </p>
      <p className="mt-3 text-sm font-medium text-stone-warm">
        {posts.length} {posts.length === 1 ? "article" : "articles"} in this
        topic
      </p>

      <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>

      <div className="mt-14 rounded-2xl border border-ink/10 bg-sand/60 p-7">
        <p className="font-display text-xl font-semibold">Explore more topics</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {getAllClusters()
            .filter((c) => c.slug !== info.slug)
            .map((c) => (
              <Link
                key={c.slug}
                href={`/topics/${c.slug}`}
                className="rounded-full border border-ink/15 bg-parchment px-5 py-2.5 text-sm font-semibold transition-colors hover:border-clay hover:text-clay-dark"
              >
                {c.name} · {c.count}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
