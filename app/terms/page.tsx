import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of Use for 2ok Home.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
        Legal
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
        Terms of Use
      </h1>
      <p className="mt-4 text-sm text-stone-warm">Last updated: October 16, 2026</p>
      <div className="article-body mt-8">
        <p>
          By accessing 2ok.lol (&quot;the Site&quot;), you agree to these
          Terms of Use. If you do not agree, please do not use the Site.
        </p>
        <h2>Content</h2>
        <p>
          All articles, images, and other content on the Site are provided for
          general informational and inspirational purposes. While we strive
          for accuracy, we make no warranties about completeness or
          reliability. DIY projects are undertaken at your own risk — always
          follow tool and product safety instructions.
        </p>
        <h2>Intellectual property</h2>
        <p>
          Unless otherwise noted, the content on this Site is owned by 2ok
          Home. You may share links to our articles freely. Republishing full
          articles or images without written permission is not permitted.
        </p>
        <h2>Acceptable use</h2>
        <ul>
          <li>Do not use the Site for any unlawful purpose.</li>
          <li>
            Do not attempt to disrupt, scrape abusively, or gain unauthorized
            access to the Site.
          </li>
          <li>
            Do not misrepresent our content as your own.
          </li>
        </ul>
        <h2>Third-party links and ads</h2>
        <p>
          The Site may display advertisements or links to third-party
          websites. We are not responsible for their content, products, or
          practices.
        </p>
        <h2>Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, 2ok Home shall not be liable
          for any damages arising from your use of the Site or reliance on
          its content.
        </p>
        <h2>Changes</h2>
        <p>
          We may revise these terms at any time; continued use of the Site
          constitutes acceptance of the updated terms.
        </p>
        <h2>Contact</h2>
        <p>
          Questions? Email <a href="mailto:hello@2ok.lol">hello@2ok.lol</a>.
        </p>
      </div>
    </div>
  );
}
