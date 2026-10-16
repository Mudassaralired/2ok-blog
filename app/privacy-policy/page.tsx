import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for 2ok Home — what data we collect and how we use it.",
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
        Legal
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
        Privacy Policy
      </h1>
      <p className="mt-4 text-sm text-stone-warm">Last updated: October 16, 2026</p>
      <div className="article-body mt-8">
        <p>
          2ok Home (&quot;we&quot;, &quot;our&quot;) respects your privacy.
          This policy explains what information we collect when you visit
          2ok.lol and how we use it.
        </p>
        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Information you provide:</strong> if you contact us by
            email, we receive your name, email address, and message content.
          </li>
          <li>
            <strong>Automatically collected data:</strong> like most websites,
            our hosting provider may log basic technical data (pages visited,
            browser type, approximate location) for security and performance.
          </li>
        </ul>
        <h2>Cookies and advertising</h2>
        <p>
          We may use cookies for basic site functionality and, in the future,
          for advertising. Third-party vendors, including Google, may use
          cookies (such as the DoubleClick cookie) to serve ads based on your
          visits to this and other sites. You can opt out of personalized
          advertising by visiting Google&apos;s{" "}
          <a href="https://www.google.com/settings/ads" rel="nofollow">
            Ads Settings
          </a>
          . You can also disable cookies in your browser settings, though some
          site features may not work as intended.
        </p>
        <h2>How we use information</h2>
        <ul>
          <li>To respond to your messages and questions.</li>
          <li>To operate, maintain, and improve the website.</li>
          <li>To comply with legal obligations.</li>
        </ul>
        <p>
          We do not sell your personal information to third parties.
        </p>
        <h2>Third-party links</h2>
        <p>
          Our articles may link to external websites. We are not responsible
          for the privacy practices of those sites; please review their
          policies separately.
        </p>
        <h2>Children&apos;s privacy</h2>
        <p>
          This site is not directed at children under 13, and we do not
          knowingly collect their personal information.
        </p>
        <h2>Changes to this policy</h2>
        <p>
          We may update this policy from time to time. The &quot;last
          updated&quot; date above will reflect the latest revision.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about this policy? Email us at{" "}
          <a href="mailto:hello@2ok.lol">hello@2ok.lol</a>.
        </p>
      </div>
    </div>
  );
}
