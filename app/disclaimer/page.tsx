import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Disclaimer for 2ok Home — affiliate disclosure and content notice.",
  robots: { index: true, follow: true },
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
        Legal
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
        Disclaimer
      </h1>
      <p className="mt-4 text-sm text-stone-warm">Last updated: October 16, 2026</p>
      <div className="article-body mt-8">
        <h2>General information</h2>
        <p>
          The content on 2ok.lol is for general informational and inspirational
          purposes only. Decorating results vary by home, materials, and
          skill level. Always use your own judgment — and proper safety
          precautions — when attempting DIY projects.
        </p>
        <h2>Affiliate disclosure</h2>
        <p>
          Some articles on this Site may contain affiliate links, which means
          we may earn a commission if you purchase through them, at no extra
          cost to you. This helps keep our content free. We only recommend
          products we would genuinely use ourselves.
        </p>
        <h2>Advertising disclosure</h2>
        <p>
          This Site may display advertisements served by third-party ad
          networks. We do not control the specific ads shown and do not
          endorse the products or services advertised.
        </p>
        <h2>External links</h2>
        <p>
          Links to external websites are provided for convenience. We do not
          endorse and are not responsible for their content or practices.
        </p>
      </div>
    </div>
  );
}
