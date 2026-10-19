"use client";

import Link from "next/link";
import { useState } from "react";

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
