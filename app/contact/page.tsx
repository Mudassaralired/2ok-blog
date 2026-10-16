import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

const SITE_URL = "https://2ok.lol";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact 2ok Home — questions, ideas, or a room you'd like featured? Send us a message.",
  openGraph: {
    title: "Contact | 2ok Home",
    description:
      "Contact 2ok Home — questions, ideas, or a room you'd like featured?",
    url: `${SITE_URL}/contact`,
  },
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay-dark">
        Contact
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
        Say hello.
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
        Questions, ideas, or a room you&apos;d like featured? Send us a
        message — we read everything and reply as soon as we can.
      </p>

      <ContactForm />
    </div>
  );
}
