import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist — but plenty of decor ideas do.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 text-center md:py-32">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay-dark">
        404
      </p>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
        This room is empty.
      </h1>
      <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
        The page you&apos;re looking for moved, or never existed. Let&apos;s
        get you back to something beautiful.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-clay-dark"
        >
          Back home
        </Link>
        <Link
          href="/blog"
          className="rounded-full border border-ink/20 px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-clay hover:text-clay-dark"
        >
          Browse all ideas
        </Link>
      </div>
    </div>
  );
}
