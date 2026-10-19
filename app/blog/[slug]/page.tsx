import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllPosts,
  getPost,
  formatDate,
  slugify,
  coverAlt,
  ogImageFor,
  SITE_URL,
} from "@/lib/posts";
import PostCard from "@/components/PostCard";
import CoverImage from "@/components/CoverImage";
import AdSlot from "@/components/AdSlot";

const AUTHOR = {
  name: "Mudassar Ali",
  url: `${SITE_URL}/author/mudassar-ali`,
  jobTitle: "Founder & Editor, 2ok Home",
  knowsAbout: ["Home Decor", "DIY", "Interior Styling", "Budget Decorating"],
  sameAs: ["https://www.instagram.com/2ok.home/"],
};

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
  const ogImage = post.meta.cover ? ogImageFor(post.meta.slug) : "";
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
      authors: [AUTHOR.name],
      ...(ogImage
        ? {
            images: [
              {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: coverAlt(post.meta.slug, post.meta.title),
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description: post.meta.excerpt,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    alternates: { canonical: url },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { meta, contentHtml, headings } = post;
  const articleUrl = `${SITE_URL}/blog/${meta.slug}`;
  const categoryUrl = `${SITE_URL}/category/${slugify(meta.category)}`;

  // Up to 4 related cards: same topical cluster first (interlinking),
  // then same category, then newest others.
  const allOthers = getAllPosts().filter((p) => p.slug !== meta.slug);
  const sameCluster = allOthers.filter(
    (p) => meta.cluster && p.cluster === meta.cluster
  );
  const sameCategory = allOthers.filter(
    (p) => p.cluster !== meta.cluster && p.category === meta.category
  );
  const rest = allOthers.filter(
    (p) => p.cluster !== meta.cluster && p.category !== meta.category
  );
  const related = [...sameCluster, ...sameCategory, ...rest].slice(0, 4);

  const coverImage = ogImageFor(meta.slug);
  // OG image file only exists once the owner supplies the polished cover.
  const hasCoverImage = Boolean(meta.cover);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${articleUrl}#article`,
        headline: meta.title,
        description: meta.excerpt,
        datePublished: meta.date,
        dateModified: meta.date,
        author: {
          "@type": "Person",
          "@id": `${AUTHOR.url}#person`,
          name: AUTHOR.name,
          url: AUTHOR.url,
          jobTitle: AUTHOR.jobTitle,
          knowsAbout: AUTHOR.knowsAbout,
          sameAs: AUTHOR.sameAs,
        },
        publisher: {
          "@type": "Organization",
          "@id": `${SITE_URL}#organization`,
          name: "2ok Home",
          url: SITE_URL,
        },
        mainEntityOfPage: articleUrl,
        ...(coverImage && hasCoverImage
          ? {
              image: {
                "@type": "ImageObject",
                "@id": `${articleUrl}#primaryimage`,
                url: coverImage,
                width: 1200,
                height: 630,
                creator: { "@type": "Organization", name: "2ok Home" },
                creditText: "2ok Home",
                copyrightNotice: "© 2026 2ok Home",
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${articleUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${SITE_URL}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: meta.category,
            item: categoryUrl,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: meta.title,
            item: articleUrl,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${articleUrl}#contents`,
        name: `In this article: ${meta.title}`,
        itemListElement: headings.map((h, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: h.text,
          url: `${articleUrl}#${h.id}`,
        })),
      },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-5 py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-xs font-medium text-stone-warm" aria-label="Breadcrumb">
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
      <p className="mt-5 text-sm font-medium text-ink">
        By{" "}
        <Link
          href="/author/mudassar-ali"
          className="font-semibold text-clay-dark underline underline-offset-2 hover:text-clay"
        >
          Mudassar Ali
        </Link>
      </p>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-stone-warm">
        {formatDate(meta.date)} · {meta.readingTime} min read · {meta.category}
      </p>

      {meta.cover ? (
        <div className="mt-8 overflow-hidden rounded-2xl border border-ink/10">
          <CoverImage
            src={meta.cover}
            slug={meta.slug}
            title={meta.title}
            eager
            imgClassName="w-full object-cover"
          />
        </div>
      ) : null}

      {/* In-article ad placement — invisible until ads are configured. */}
      <AdSlot slot="IN_ARTICLE_SLOT_ID" label="In-article" className="my-8" />

      <div
        className="article-body mt-8"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      {/* Author box */}
      <div className="mt-12 flex items-start gap-5 rounded-2xl border border-ink/10 bg-parchment p-7">
        <span
          aria-hidden="true"
          className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-clay font-display text-2xl font-bold text-cream"
        >
          MA
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-warm">
            Written by
          </p>
          <p className="mt-1 font-display text-xl font-bold">
            <Link
              href="/author/mudassar-ali"
              className="hover:text-clay-dark"
            >
              Mudassar Ali
            </Link>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Founder of 2ok Home. Mudassar writes practical, budget-friendly
            home decor and DIY guides — real ideas for real homes, tested for
            beginners.
          </p>
        </div>
      </div>

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

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Keep reading
          </h2>
          <div className="mt-6 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
