"use client";

import { useState } from "react";

const CONTACT_EMAIL = "hello@2ok.lol";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${name || "a reader"} — 2ok Home`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 rounded-3xl border border-ink/10 bg-parchment p-7 md:p-10"
    >
      <label className="block">
        <span className="text-sm font-semibold">Your name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          className="mt-2 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm outline-none placeholder:text-stone-warm focus:border-clay"
        />
      </label>
      <label className="mt-5 block">
        <span className="text-sm font-semibold">Your message</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what's on your mind…"
          rows={6}
          required
          className="mt-2 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm outline-none placeholder:text-stone-warm focus:border-clay"
        />
      </label>
      <button
        type="submit"
        className="mt-6 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-clay-dark"
      >
        Send message
      </button>
      <p className="mt-4 text-xs leading-relaxed text-stone-warm">
        This opens your email app addressed to {CONTACT_EMAIL}. Prefer to
        write directly? Email us anytime at{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-semibold text-clay-dark underline underline-offset-2"
        >
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </form>
  );
}
