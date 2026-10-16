import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost, formatDate, slugify } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import AdSlot from "@/components/AdSlot";

const SITE_URL = "https://2ok.lol";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

// Static export: every post is pre-rendered at build time.
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const url = `${SITE_URL}/blog/${post.meta.slug}`;
  return {
    title: post.meta.title,
    description: post.meta.excerpt,
    keywords: [post.meta.category, "home decor", "DIY"],
    openGraph: {
      type: "article",
      title: post.meta.title,
      description: post.meta.excerpt,
      url,
      publishedTime: post.meta.date,
      images: [{ url: post.meta.cover, width: 800, height: 500 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description: post.meta.excerpt,
    },
    alternates: { canonical: url },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { meta, contentHtml } = post;
  const related = getAllPosts()
    .filter((p) => p.slug !== meta.slug && p.category === meta.category)
    .slice(0, 3);
  const fallbackRelated = getAllPosts()
    .filter((p) => p.slug !== meta.slug)
    .slice(0, 3);
  const showRelated = related.length > 0 ? related : fallbackRelated;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.excerpt,
    datePublished: meta.date,
    author: { "@type": "Organization", name: "2ok Home" },
    publisher: { "@type": "Organization", name: "2ok Home" },
    mainEntityOfPage: `${SITE_URL}/blog/${meta.slug}`,
    image: `${SITE_URL}${meta.cover}`,
  };

  return (
    <article className="mx-auto max-w-3xl px-5 py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-xs font-medium text-stone-warm">
        <Link href="/" className="hover:text-clay-dark">Home</Link>
        {" / "}
        <Link href="/blog" className="hover:text-clay-dark">Blog</Link>
        {" / "}
        <Link
          href={`/category/${slugify(meta.category)}`}
          className="hover:text-clay-dark"
        >
          {meta.category}
        </Link>
      </nav>

      <h1 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">
        {meta.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">{meta.excerpt}</p>
      <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-stone-warm">
        {formatDate(meta.date)} · {meta.readingTime} min read · {meta.category}
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-ink/10">
        <img src={meta.cover} alt={meta.title} className="w-full object-cover" />
      </div>

      {/* In-article ad placement — invisible until ads are configured. */}
      <AdSlot slot="IN_ARTICLE_SLOT_ID" label="In-article" className="my-8" />

      <div
        className="article-body mt-8"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      {/* Bottom ad placement — invisible until ads are configured. */}
      <AdSlot slot="BOTTOM_SLOT_ID" label="Bottom" className="my-10" />

      <div className="mt-12 rounded-2xl border border-ink/10 bg-sand/60 p-7">
        <p className="font-display text-xl font-semibold">
          Enjoyed this idea?
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Browse the full library for more seasonal inspiration, small-space
          tricks, and weekend DIY projects.
        </p>
        <Link
          href="/blog"
          className="mt-5 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-clay-dark"
        >
          More ideas
        </Link>
      </div>

      {showRelated.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Keep reading
          </h2>
          <div className="mt-6 grid gap-7 md:grid-cols-3">
            {showRelated.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
