"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];


const TOPICS = [
  { href: "/topics/wall-decor", label: "DIY Wall Decor" },
  { href: "/topics/small-living-room", label: "Small Living Room" },
  { href: "/topics/christmas-decor", label: "Christmas Decor" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    const url = q ? `/blog?q=${encodeURIComponent(q)}` : "/blog";
    setOpen(false);
    // Already on /blog: the page does not remount on a query-only
    // navigation, so hand the query to BlogSearch directly; otherwise
    // navigate and BlogSearch picks ?q= up on mount.
    if (window.location.pathname === "/blog") {
      window.dispatchEvent(new CustomEvent<string>("site-search", { detail: q }));
    } else {
      router.push(url);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src="/logo-mark.svg"
            alt="2ok Home logo"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <span className="leading-tight">
            <span className="block font-display text-xl font-bold tracking-tight">
              2ok Home
            </span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-stone-warm">
              Decor &amp; DIY
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-clay-dark"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://www.instagram.com/2ok.home/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="2ok Home on Instagram"
            className="text-ink-soft transition-colors hover:text-clay-dark"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <form
            role="search"
            onSubmit={submitSearch}
            className="hidden items-center gap-1.5 lg:flex"
          >
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles…"
              aria-label="Search articles"
              className="w-36 rounded-full border border-ink/15 bg-white px-3.5 py-2 text-sm text-ink outline-none placeholder:text-stone-warm focus:border-clay-dark"
            />
            <button
              type="submit"
              aria-label="Search"
              className="grid h-9 w-9 place-items-center rounded-full text-ink-soft transition-colors hover:text-clay-dark"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>
          <Link
            href="/blog"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-clay-dark"
          >
            Latest ideas
          </Link>
        </nav>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-ink/15 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="text-xl leading-none">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Topics strip — one-click filter to topic hubs */}
      <nav aria-label="Topics" className="border-t border-ink/10 bg-sand/60">
        <div className="mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto px-5 py-2.5">
          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-warm">
            Topics
          </span>
          {TOPICS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="shrink-0 text-sm font-medium text-ink-soft transition-colors hover:text-clay-dark"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </nav>

      {open && (
        <nav className="border-t border-ink/10 bg-cream px-5 py-4 md:hidden">
          <form role="search" onSubmit={submitSearch} className="mb-2 flex gap-2">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles…"
              aria-label="Search articles"
              className="w-full rounded-full border border-ink/15 bg-white px-4 py-2.5 text-base text-ink outline-none placeholder:text-stone-warm focus:border-clay-dark"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream"
            >
              Search
            </button>
          </form>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-base font-medium text-ink-soft"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://www.instagram.com/2ok.home/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="block py-2.5 text-base font-medium text-ink-soft"
          >
            Instagram
          </a>
        </nav>
      )}
    </header>
  );
}
