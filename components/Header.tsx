"use client";

import Link from "next/link";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-clay font-display text-xl font-bold text-cream">
            2
          </span>
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
        </nav>
      )}
    </header>
  );
}
