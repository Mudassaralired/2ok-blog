import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllCategories,
  postsInCategory,
  POSTS_PER_PAGE,
} from "@/lib/posts";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";

const SITE_URL = "https://2ok.lol";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  return getAllCategories().map((c) => ({ category: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getAllCategories().find((c) => c.slug === category);
  if (!cat) return {};
  const description = `Home decor articles about ${cat.name.toLowerCase()} — ideas, tips, and DIY projects from 2ok Home.`;
  const url = `${SITE_URL}/category/${cat.slug}`;
  return {
    title: `${cat.name} ideas`,
    description,
    openGraph: {
      title: `${cat.name} ideas | 2ok Home`,
      description,
      url,
    },
    alternates: { canonical: url },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getAllCategories().find((c) => c.slug === category);
  if (!cat) notFound();
  const posts = postsInCategory(category);
  const totalPages = Math.max(
    1,
    Math.ceil(posts.length / POSTS_PER_PAGE)
  );
  const pagePosts = posts.slice(0, POSTS_PER_PAGE);
  const url = `${SITE_URL}/category/${cat.slug}`;
  const description = `Home decor articles about ${cat.name.toLowerCase()} — ideas, tips, and DIY projects from 2ok Home.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: `${cat.name} ideas`,
        description,
        isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}#website` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: cat.name, item: url },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${url}#articles`,
        name: cat.name,
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
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay-dark">
        Topic
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
        {cat.name}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-ink-soft">
        {posts.length} {posts.length === 1 ? "article" : "articles"} on{" "}
        {cat.name.toLowerCase()}.
      </p>
      <h2 className="mt-10 font-display text-2xl font-bold tracking-tight">
        {cat.name} ideas
      </h2>
      <div className="mt-6 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {pagePosts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>

      <Pagination
        currentPage={1}
        totalPages={totalPages}
        basePath={`/category/${category}`}
      />
    </div>
  );
}
