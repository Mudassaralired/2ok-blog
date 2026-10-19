import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://2ok.lol";
const SITE_NAME = "2ok Home";
const TAGLINE = "Home Decor & DIY Ideas";
const DEFAULT_OG =
  "https://res.cloudinary.com/zhzxqahv/image/upload/w_1200,h_630,c_fill/f_auto,q_auto/2ok-blog/small-living-room-ideas/cover";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Simple, warm home decor and DIY ideas you can actually do — seasonal inspiration, small-space tricks, and budget-friendly projects.",
  keywords: [
    "home decor",
    "DIY home decor",
    "home decor ideas",
    "seasonal decor",
    "budget decorating",
    "small space decor",
  ],
  authors: [
    { name: "Mudassar Ali", url: `${SITE_URL}/author/mudassar-ali` },
  ],
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${TAGLINE}`,
    description:
      "Simple, warm home decor and DIY ideas you can actually do.",
    url: SITE_URL,
    images: [
      { url: DEFAULT_OG, width: 1200, height: 630, alt: "2ok Home — Home Decor & DIY Ideas" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${TAGLINE}`,
    description:
      "Simple, warm home decor and DIY ideas you can actually do.",
    images: [DEFAULT_OG],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
  alternates: { canonical: SITE_URL },
};

// Google Analytics 4 — Measurement ID is a public identifier (visible in
// page source by design), so it is hardcoded. Property: "2ok.lol".
const GA_MEASUREMENT_ID = "G-LS57Y0MYH7";

// AdSense loader: only included once an ad client ID is configured.
// Until then the site ships zero ad code (see components/AdSlot.tsx).
const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
        </Script>
        {AD_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
