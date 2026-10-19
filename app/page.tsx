import Link from "next/link";
import { getAllPosts, getAllClusters, formatDate } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import CoverImage from "@/components/CoverImage";

export default function HomePage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;
  const latest = rest.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-16 md:pt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay-dark">
          Home decor &amp; DIY ideas
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
          Make your home feel like <em className="text-clay-dark">you</em>.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
          Simple, warm decorating ideas you can actually do — seasonal
          inspiration, small-space tricks, and budget-friendly DIY projects.
          No interior-design degree required.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/blog"
            className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-clay-dark"
          >
            Browse all ideas
          </Link>
          <Link
            href="#topics"
            className="rounded-full border border-ink/20 px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-clay hover:text-clay-dark"
          >
            Explore topics
          </Link>
        </div>
      </section>

      {/* Featured article */}
      {featured && (
        <section className="mx-auto max-w-6xl px-5 pb-16">
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid overflow-hidden rounded-3xl border border-ink/10 bg-parchment md:grid-cols-2"
          >
            <div className="aspect-[16/10] overflow-hidden bg-sand md:aspect-auto md:min-h-[320px]">
              <CoverImage
                src={featured.cover}
                slug={featured.slug}
                title={featured.title}
                imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-clay-dark">
                Featured · {featured.category}
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight group-hover:text-clay-dark md:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-4 leading-relaxed text-ink-soft">
                {featured.excerpt}
              </p>
              <p className="mt-5 text-xs font-medium text-stone-warm">
                {formatDate(featured.date)} · {featured.readingTime} min read
              </p>
            </div>
          </Link>
        </section>
      )}

      {/* Topics — topical authority hubs */}
      <section id="topics" className="border-y border-ink/10 bg-sand/60">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay-dark">
            Our topics
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
            Browse by topic
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Deep guides on the topics we cover best — start with our biggest,
            DIY wall decor.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {getAllClusters()
              .slice(0, 3)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/topics/${c.slug}`}
                  className="group rounded-2xl border border-ink/10 bg-parchment p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/10"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-clay-dark">
                    {c.tagline}
                  </p>
                  <p className="mt-2 font-display text-xl font-semibold group-hover:text-clay-dark">
                    {c.name}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                    {c.description}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-stone-warm">
                    {c.count} {c.count === 1 ? "article" : "articles"} →
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Latest */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Latest ideas
          </h2>
          <Link
            href="/blog"
            className="text-sm font-semibold text-clay-dark underline underline-offset-4 hover:text-clay"
          >
            View all
          </Link>
        </div>
        <div className="mt-8 grid gap-7 md:grid-cols-3">
          {latest.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </section>

      {/* About strip */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="rounded-3xl bg-ink px-8 py-12 text-cream md:px-14 md:py-16">
          <h2 className="max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            Beautiful homes aren&apos;t bought. They&apos;re made — one small
            project at a time.
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-cream/70">
            2ok Home is about real-life decorating: rental-friendly ideas,
            thrifted finds, and seasonal touches that don&apos;t require a big
            budget or a big house.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-block rounded-full bg-cream px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-sand"
          >
            Our story
          </Link>
        </div>
      </section>
    </div>
  );
}
