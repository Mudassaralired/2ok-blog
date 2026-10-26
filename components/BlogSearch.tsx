"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PostMeta } from "@/lib/posts";

/** Same output as lib/posts formatDate — kept local so this client
 *  component never imports the server-only posts module (fs). */
function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Live article search for the blog index. The site is a static export,
 * so filtering happens in the browser: the full post list arrives as
 * props from the server component, and ?q= in the URL (from the header
 * search or a shared link) is picked up on mount.
 */
export default function BlogSearch({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState("");

  // Pick up ?q= on mount, stay in sync with back/forward, and accept
  // live queries from the header while already on /blog (no remount
  // on a query-only navigation).
  useEffect(() => {
    const readFromUrl = () => {
      setQuery(new URLSearchParams(window.location.search).get("q") ?? "");
    };
    readFromUrl();
    const onSiteSearch = (e: Event) => {
      update((e as CustomEvent<string>).detail ?? "");
    };
    window.addEventListener("site-search", onSiteSearch);
    window.addEventListener("popstate", readFromUrl);
    return () => {
      window.removeEventListener("site-search", onSiteSearch);
      window.removeEventListener("popstate", readFromUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const needle = query.trim().toLowerCase();
  const filtered = needle
    ? posts.filter((p) =>
        [p.title, p.excerpt, p.category, p.cluster, p.slug]
          .join(" ")
          .toLowerCase()
          .includes(needle)
      )
    : posts;

  const update = (value: string) => {
    setQuery(value);
    const url = value.trim()
      ? `/blog?q=${encodeURIComponent(value.trim())}`
      : "/blog";
    window.history.replaceState(null, "", url);
  };

  return (
    <div>
      <form
        role="search"
        className="mt-8 flex max-w-xl gap-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="search"
          value={query}
          onChange={(e) => update(e.target.value)}
          placeholder="Search articles… e.g. gallery wall, Christmas, small living room"
          aria-label="Search articles"
          className="w-full rounded-full border border-ink/15 bg-white px-5 py-3 text-sm text-ink outline-none placeholder:text-stone-warm focus:border-clay-dark"
        />
        {query && (
          <button
            type="button"
            onClick={() => update("")}
            className="shrink-0 rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold text-ink-soft transition-colors hover:text-clay-dark"
          >
            Clear
          </button>
        )}
      </form>

      {needle ? (
        <p className="mt-6 text-sm text-ink-soft">
          {filtered.length} result{filtered.length === 1 ? "" : "s"} for
          &ldquo;{query.trim()}&rdquo;
        </p>
      ) : null}

      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-2xl border border-ink/10 bg-parchment transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10"
            >
              <div className="aspect-[16/10] overflow-hidden bg-sand">
                {post.cover ? (
                  <img
                    src={post.cover}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center bg-gradient-to-br from-clay to-clay-dark"
                    role="img"
                    aria-label={post.title}
                  >
                    <img
                      src="/logo-mark.svg"
                      alt=""
                      aria-hidden="true"
                      className="h-16 w-16 opacity-90"
                    />
                  </div>
                )}
              </div>
              <div className="p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-clay-dark">
                  {post.category}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold leading-snug tracking-tight group-hover:text-clay-dark">
                  {post.title}
                </h3>
                <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                  {post.excerpt}
                </p>
                <p className="mt-4 text-xs font-medium text-stone-warm">
                  {formatDate(post.date)} · {post.readingTime} min read
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-10 text-ink-soft">
          No articles match &ldquo;{query.trim()}&rdquo; yet. Try another
          word — e.g. &ldquo;wall&rdquo;, &ldquo;Christmas&rdquo; or
          &ldquo;rug&rdquo;.
        </p>
      )}
    </div>
  );
}
