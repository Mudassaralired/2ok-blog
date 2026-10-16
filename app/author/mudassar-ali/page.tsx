import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/posts";
import PostCard from "@/components/PostCard";

const SITE_URL = "https://2ok.lol";
const AUTHOR_URL = `${SITE_URL}/author/mudassar-ali`;

export const metadata: Metadata = {
  title: "Mudassar Ali",
  description:
    "Mudassar Ali is the founder of 2ok Home, writing practical, budget-friendly home decor and DIY guides.",
  openGraph: {
    title: "Mudassar Ali | 2ok Home",
    description:
      "Mudassar Ali is the founder of 2ok Home, writing practical, budget-friendly home decor and DIY guides.",
    url: AUTHOR_URL,
    type: "profile",
  },
  alternates: { canonical: AUTHOR_URL },
};

export default function AuthorPage() {
  const posts = getAllPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${AUTHOR_URL}#person`,
    name: "Mudassar Ali",
    url: AUTHOR_URL,
    jobTitle: "Founder & Editor, 2ok Home",
    description:
      "Home decor and DIY enthusiast writing practical, budget-friendly guides for real homes.",
    knowsAbout: ["Home Decor", "DIY", "Interior Styling", "Budget Decorating"],
    sameAs: ["https://www.instagram.com/2ok.home/"],
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-6">
          <span
            aria-hidden="true"
            className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-clay font-display text-4xl font-bold text-cream"
          >
            MA
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay-dark">
              Author
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Mudassar Ali
            </h1>
          </div>
        </div>

        <div className="article-body mt-8">
          <p>
            Mudassar Ali is the founder of 2ok Home — a home decor and DIY
            enthusiast writing practical, budget-friendly guides for real
            homes. His philosophy is simple: beautiful rooms don&apos;t need
            big budgets, just light, texture, and small intentional choices.
          </p>
          <p>
            Every guide is written for complete beginners and tested against
            real-life constraints: rentals, small rooms, and tight budgets.
            When a project needs tools or materials, Mudassar lists exactly
            what to get and what it costs — no surprises.
          </p>
          <p>
            Follow along on{" "}
            <a href="https://www.instagram.com/2ok.home/">
              Instagram @2ok.home
            </a>{" "}
            for daily decor inspiration.
          </p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          Articles by Mudassar
        </h2>
        <div className="mt-8 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
        <p className="mt-6 text-sm text-stone-warm">
          {posts.length} {posts.length === 1 ? "article" : "articles"} ·{" "}
          {formatDate(posts[0]?.date ?? "2026-10-16")} latest
        </p>
      </section>

      <p className="mt-10 text-sm text-ink-soft">
        <Link
          href="/about"
          className="font-semibold text-clay-dark underline underline-offset-2 hover:text-clay"
        >
          More about 2ok Home →
        </Link>
      </p>
    </div>
  );
}
