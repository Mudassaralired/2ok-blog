import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllPosts,
  getPost,
  getFaqItems,
  formatDate,
  slugify,
  coverAlt,
  ogImageFor,
  schemaImagesFor,
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
  sameAs: [
    "https://www.instagram.com/2ok.home/",
    "https://www.pinterest.com/2okhome/",
  ],
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
  const ogImage = post.meta.cover
    ? ogImageFor(post.meta.slug, post.meta.cover)
    : "";
  // Avoid appending " | 2ok Home" (+11 chars) when the title is already
  // near Google's ~60-character SERP display limit; Site Name shows above.
  const metaTitle =
    post.meta.title.length > 48
      ? { absolute: post.meta.title }
      : post.meta.title;
  return {
    title: metaTitle,
    description: post.meta.excerpt,
    keywords: [post.meta.category, "home decor", "DIY"],
    openGraph: {
      type: "article",
      title: post.meta.title,
      description: post.meta.excerpt,
      url,
      publishedTime: post.meta.date,
      modifiedTime: post.meta.updated ?? post.meta.date,
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
  const faqItems = getFaqItems(meta.slug);
  const articleUrl = `${SITE_URL}/blog/${meta.slug}`;
  const categoryUrl = `${SITE_URL}/category/${slugify(meta.category)}`;
  // Pinterest save link for the hero cover (in-article images get theirs
  // from the rehypePinButtons plugin in lib/posts.ts).
  const coverPinHref =
    "https://www.pinterest.com/pin/create/button/?" +
    `url=${encodeURIComponent(articleUrl)}` +
    `&media=${encodeURIComponent(meta.cover)}` +
    `&description=${encodeURIComponent(meta.title)}`;

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

  const schemaImages = schemaImagesFor(meta.slug, meta.cover);
  // OG image file only exists once the owner supplies the polished cover.
  const hasCoverImage = Boolean(meta.cover);
  const modifiedDate = meta.updated ?? meta.date;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${articleUrl}#article`,
        headline: meta.title,
        description: meta.excerpt,
        datePublished: meta.date,
        dateModified: modifiedDate,
        inLanguage: "en-US",
        articleSection: meta.category,
        wordCount: meta.wordCount,
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
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/icon-192.png`,
            width: 192,
            height: 192,
          },
        },
        mainEntityOfPage: articleUrl,
        ...(hasCoverImage
          ? {
              image: schemaImages.map((img, idx) => ({
                "@type": "ImageObject",
                ...(idx === 0 ? { "@id": `${articleUrl}#primaryimage` } : {}),
                url: img.url,
                width: img.width,
                height: img.height,
                creator: { "@type": "Organization", name: "2ok Home" },
                creditText: "2ok Home",
                copyrightNotice: "© 2026 2ok Home",
              })),
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
      ...(faqItems.length > 0
        ? [
            {
              "@type": "FAQPage",
              "@id": `${articleUrl}#faq`,
              mainEntity: faqItems.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            },
          ]
        : []),
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
    <article className="mx-auto max-w-3xl px-4 py-6 sm:px-5 md:py-14">
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

      <h1 className="mt-3 font-display text-[1.75rem] font-bold leading-[1.16] tracking-tight sm:text-4xl md:mt-5 md:text-5xl">
        {meta.title}
      </h1>
      <p className="mt-3 text-base leading-relaxed text-ink-soft md:mt-4 md:text-lg">
        {meta.excerpt}
      </p>
      <div className="mt-3.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-stone-warm md:mt-5 md:text-sm">
        <span className="text-ink">
          By{" "}
          <Link
            href="/author/mudassar-ali"
            className="font-semibold text-clay-dark underline underline-offset-2 hover:text-clay"
          >
            Mudassar Ali
          </Link>
        </span>
        <span aria-hidden="true">·</span>
        <span className="uppercase tracking-[0.1em]">
          {meta.updated && meta.updated !== meta.date
            ? `Updated ${formatDate(meta.updated)}`
            : formatDate(meta.date)}
        </span>
        <span aria-hidden="true">·</span>
        <span className="uppercase tracking-[0.1em]">
          {meta.readingTime} min read
        </span>
      </div>

      {meta.cover ? (
        <div className="pin-figure mt-5 aspect-[3/2] overflow-hidden rounded-2xl border border-ink/10 bg-sand md:mt-8">
          <CoverImage
            src={meta.cover}
            slug={meta.slug}
            title={meta.title}
            eager
            defaultWidth={1200}
            sizes="(max-width: 768px) 100vw, 768px"
            imgClassName="h-full w-full object-cover"
          />
          <a
            className="pin-btn"
            href={coverPinHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Save this image on Pinterest"
          >
            Pin it
          </a>
        </div>
      ) : null}

      {/* In-article ad placement — invisible until ads are configured. */}
      <AdSlot slot="IN_ARTICLE_SLOT_ID" label="In-article" className="my-8" />

      <div
        className="article-body mt-6 md:mt-8"
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
