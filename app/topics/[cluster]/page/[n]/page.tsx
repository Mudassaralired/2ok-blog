import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllClusters,
  getCluster,
  postsInCluster,
  POSTS_PER_PAGE,
  SITE_URL,
} from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";

type Props = { params: Promise<{ cluster: string; n: string }> };

// Only pages 2..N are generated. Page 1 lives at /topics/[cluster];
// unknown pages return the 404 page.
export const dynamicParams = false;

export function generateStaticParams() {
  const out: { cluster: string; n: string }[] = [];
  for (const c of getAllClusters()) {
    const total = Math.max(
      1,
      Math.ceil(postsInCluster(c.slug).length / POSTS_PER_PAGE)
    );
    for (let n = 2; n <= total; n++) {
      out.push({ cluster: c.slug, n: String(n) });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { cluster, n } = await params;
  const info = getCluster(cluster);
  if (!info) return {};
  const page = Number(n);
  const url = `${SITE_URL}/topics/${info.slug}/page/${n}`;
  return {
    title: `${info.name} — ideas, tutorials & guides — Page ${page}`,
    description: `${info.metaDescription} (page ${page})`,
    openGraph: {
      title: `${info.name} — Page ${page} | 2ok Home`,
      description: info.metaDescription,
      url,
    },
    alternates: { canonical: url },
  };
}

export default async function TopicPageN({ params }: Props) {
  const { cluster, n } = await params;
  const info = getCluster(cluster);
  if (!info) notFound();
  const posts = postsInCluster(cluster);
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
  const hubUrl = `${SITE_URL}/topics/${info.slug}`;
  const url = `${hubUrl}/page/${n}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: `${info.name} — Page ${page}`,
        description: `${info.metaDescription} (page ${page})`,
        isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}#website` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: info.name, item: hubUrl },
          {
            "@type": "ListItem",
            position: 3,
            name: `Page ${page}`,
            item: url,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${url}#articles`,
        name: `${info.name} — Page ${page}`,
        itemListElement: pagePosts.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.title,
          url: `${SITE_URL}/blog/${p.slug}`,
        })),
      },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
        topic · Page {page} of {totalPages}
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold tracking-tight">
        {info.name} ideas — page {page}
      </h2>
      <div className="mt-6 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {pagePosts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath={`/topics/${cluster}`}
      />
    </div>
  );
}
