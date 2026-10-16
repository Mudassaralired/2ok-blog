import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://2ok.lol";

export const metadata: Metadata = {
  title: "About",
  description:
    "About 2ok Home — simple, warm home decor and DIY ideas for real homes and real budgets.",
  openGraph: {
    title: "About | 2ok Home",
    description:
      "About 2ok Home — simple, warm home decor and DIY ideas for real homes and real budgets.",
    url: `${SITE_URL}/about`,
  },
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay-dark">
        About
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
        Hi, we&apos;re 2ok Home.
      </h1>
      <div className="article-body mt-8">
        <p>
          2ok Home is a home decor and DIY blog for people who love beautiful
          spaces but live in the real world — rentals, small rooms, tight
          budgets, and all.
        </p>
        <p>
          We believe a beautiful home isn&apos;t about how much you spend.
          It&apos;s about light, texture, and small intentional choices: a
          well-placed mirror, a thrifted vase, candles in the right corner.
          Most of our ideas cost little or nothing, and every project is
          written so a complete beginner can follow along.
        </p>
        <h2>What you&apos;ll find here</h2>
        <ul>
          <li>
            <strong>Seasonal decor</strong> — Halloween, Christmas, spring
            refreshes, and everything in between.
          </li>
          <li>
            <strong>Small-space ideas</strong> — tricks that make compact rooms
            feel open and calm.
          </li>
          <li>
            <strong>DIY projects</strong> — weekend-friendly crafts and wall
            decor anyone can make.
          </li>
          <li>
            <strong>Budget decorating</strong> — the thrifted, the repurposed,
            and the free.
          </li>
        </ul>
        <h2>How we work</h2>
        <p>
          Every article is written by our small editorial team and reviewed
          before publishing. When we recommend a product or technique,
          it&apos;s because we&apos;d use it in our own homes. If an article
          ever contains affiliate links, we&apos;ll tell you — see our{" "}
          <a href="/disclaimer">Disclaimer</a> for details.
        </p>
        <h2>About the author</h2>
        <p>
          2ok Home is written by{" "}
          <a href="/author/mudassar-ali">Mudassar Ali</a>, a home decor and
          DIY enthusiast who believes beautiful rooms don&apos;t need big
          budgets — just light, texture, and small intentional choices.
          Mudassar tests every idea for real homes and real beginners, and
          shares the ones that actually work.
        </p>
        <p>
          Have an idea, a question, or a room you&apos;d like help with?{" "}
          <a href="/contact">Get in touch</a> — we read everything.
        </p>
      </div>
    </div>
  );
}
