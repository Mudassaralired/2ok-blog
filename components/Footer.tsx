import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink/10 bg-ink text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold">2ok Home</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/70">
            Simple, warm home decor and DIY ideas you can actually do — seasonal
            inspiration, small-space tricks, and budget-friendly projects.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/50">
            Explore
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/" className="text-cream/80 hover:text-cream">Home</Link></li>
            <li><Link href="/blog" className="text-cream/80 hover:text-cream">All articles</Link></li>
            <li><Link href="/about" className="text-cream/80 hover:text-cream">About</Link></li>
            <li><Link href="/contact" className="text-cream/80 hover:text-cream">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/50">
            Legal
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/privacy-policy" className="text-cream/80 hover:text-cream">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-cream/80 hover:text-cream">Terms of Use</Link></li>
            <li><Link href="/disclaimer" className="text-cream/80 hover:text-cream">Disclaimer</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/15">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-cream/50 md:flex-row">
          <p>© {new Date().getFullYear()} 2ok Home. All rights reserved.</p>
          <p>Made with care for beautiful homes.</p>
        </div>
      </div>
    </footer>
  );
}
