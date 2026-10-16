# DEEP AUDIT — 2ok.lol blog (2026-10-16)

**Scope:** audit only. No code was changed. Repo: `~/workspace/2ok-blog` (Next.js 16.4.2, static export → `out/`), live at https://2ok.lol and https://2ok-blog.pages.dev. Niche: Home Decor & DIY, women audience. Goal: AdSense approval later (≈15–25 substantial original posts; currently 4). Ad-network context per `~/workspace/research_notes/nextjs-blog-ad-network-research-20261016-0257/report.md`.

**Method:** source-code review of every route/component, built-HTML inspection of all 17 pages in `out/`, live-URL behavior checks via curl (status codes, redirects, favicon), word counts, contrast-ratio computation.

---

## Prioritized gap summary (critical first)

| # | Severity | Chunk | Gap | Recommended fix |
|---|----------|-------|-----|-----------------|
| 1 | CRITICAL | Content | Only 4 posts, 487–651 words each — AdSense's #1 rejection reason is "low value content" (thin posts) | Publish 15–25 original posts, 1,200–2,000+ words each, before applying |
| 2 | CRITICAL | Content/Design | Zero real photography — all 4 covers are SVG gradient placeholders (`public/covers/*.svg`, 1.2–1.7 KB); decor is a visual niche | Add real featured photos (AI-generated or stock) per post; plan Cloudinary hosting |
| 3 | HIGH | Tech SEO | OG/Twitter images broken: homepage has **no** `og:image` at all (`app/layout.tsx`); article `og:image` points to an SVG (`app/blog/[slug]/page.tsx`), which Facebook/Pinterest/X cannot render | Generate 1200×630 JPG/PNG OG images per post + site default; reference in metadata |
| 4 | HIGH | Tech SEO | Favicon 404s on the live site (`curl https://2ok.lol/favicon.ico` → 404) — `app/favicon.ico` exists locally but was never pushed to GitHub, so Cloudflare builds without it | Push a favicon (ICO + `app/icon.svg` fallback) to the repo and redeploy |
| 5 | HIGH | Content | Weak E-E-A-T: no author byline/bio anywhere; JSON-LD `author` is generic `Organization "2ok Home"` (`app/blog/[slug]/page.tsx`); About page names no human | Add a named author with bio page; switch JSON-LD author to `Person` |
| 6 | MEDIUM | Tech SEO | Canonical tags exist **only** on `/blog/[slug]` pages — homepage, `/blog`, all `/category/*`, About/Contact/legal pages have no `<link rel="canonical">` (verified in built `out/*.html` and live) | Add `alternates: { canonical }` to every page's metadata |
| 7 | MEDIUM | Tech SEO | `sitemap.xml` omits `/privacy-policy`, `/terms`, `/disclaimer` (`app/sitemap.ts`) | Add the three legal URLs to the sitemap |
| 8 | MEDIUM | Content | No internal links inside any article body; "Keep reading" renders a **single** card (only same-category fallback); category pages hold 1–2 posts each | Interlink posts in body copy; expand to ≥3 posts per category |
| 9 | MEDIUM | Tech SEO | `/contact` has no page metadata — it's a `"use client"` component (`app/contact/page.tsx:1`) so it can't export `metadata`; inherits the generic homepage title | Extract a server wrapper that exports `metadata` and renders the client form |
| 10 | MEDIUM | Design/UX | Contrast failures on small text: `stone-warm` #8a7f72 on cream = **3.64:1**, `clay` #b4653a on cream = **4.01:1** (WCAG AA needs 4.5:1) — used for dates, counts, eyebrow labels | Darken `stone-warm` to ≈#6f6459 and `clay` to ≈#96522c for small text |
| 11 | LOW | Tech SEO | `404.html` ships **two** `<title>` tags (layout default + Next.js "404: This page could not be found") and is indexable (`robots: index,follow` inherited) | Add `app/not-found.tsx` with `robots: { index: false }` and a single title |
| 12 | LOW | Tech SEO | No RSS feed (research report recommends a build-time feed) | Add `app/rss.xml/route.ts` (static) |
| 13 | LOW | Tech SEO | No pagination on `/blog` (`app/blog/page.tsx` renders all posts) — fine at 4 posts, needed later | Add pagination when post count grows |
| 14 | LOW | Tech SEO | Sub-page OG tags are wrong: `/disclaimer`, `/about` etc. emit `og:url=https://2ok.lol` (site root) with the homepage title — they set `title`/`description` but no `openGraph` block | Add per-page `openGraph` (or at least correct `url`) to legal/about/contact metadata |
| 15 | LOW | Design/UX | Every image `alt` is just the post title (`PostCard.tsx`, article hero) — not descriptive; decorative duplicates | Write descriptive alt text per image |
| 16 | LOW | Performance | ~500 KB JS parsed (224K+168K+112K chunks; `_next/` = 972K) for a static blog — React hydrates every page mainly for the mobile menu + mailto form | Acceptable tradeoff, but consider lighter menu/form or partial hydration later |
| 17 | LOW | Performance | No `_headers` file — `_next/static/*` immutable assets rely on Cloudflare defaults instead of explicit long-cache headers | Add `public/_headers` with `Cache-Control: public, max-age=31536000, immutable` for `/_next/static/*` |
| 18 | INFO | Tech SEO | `hreflang` — not needed (single-language `en` site, `<html lang="en">` correct) | None |

**What's already good (keep):** zero ad markup in all built HTML (verified by grep); sitemap.xml + robots.txt correct and live; one H1 per page; valid BlogPosting JSON-LD on articles; Privacy/Disclaimer contain AdSense-required cookie + affiliate disclosures with last-updated dates; clean URL behavior (trailing-slash 308 → canonical, http→https 301, real 404s); `images.unoptimized` correctly set for static export; fonts self-hosted via `next/font` with `display:swap`; aspect-ratio boxes prevent image CLS; AdSlot server-gating + `:empty { display:none }` is the correct pro pattern.

---

## Chunk 1 — Technical SEO & plumbing

### Meta titles/descriptions
- **Present and unique** on: homepage (`app/layout.tsx:24-42`), `/blog` (`app/blog/page.tsx:5-9`), each article (`app/blog/[slug]/page.tsx:26-48`, from frontmatter), each category (`app/category/[category]/page.tsx:16-24`), About/Privacy/Terms/Disclaimer. Titles use the `%s | 2ok Home` template. Descriptions are sensible (excerpts on articles).
- **Gap #9:** `/contact` has no metadata (client component). Evidence: `app/contact/page.tsx:1` (`"use client"`), no `export const metadata`. Built `out/contact.html` `<title>` falls back to the layout default. **Fix:** wrap the form in a server component page that exports `metadata` and renders the client form.
- **Gap #14:** legal/about pages set `title`/`description` but no `openGraph` block, so shared links show the homepage's `og:title` and `og:url=https://2ok.lol`. Evidence: `out/disclaimer.html` head. **Fix:** add `openGraph: { title, description, url }` per page.

### Heading hierarchy
- Verified single `<h1>` on homepage, `/blog`, all 4 articles, category pages, legal pages (built HTML heading counts). Article bodies use `##` → `<h2>` correctly. No skipped levels. ✓

### Canonical tags
- **Gap #6:** only `app/blog/[slug]/page.tsx:46` sets `alternates: { canonical }`. Verified absent in `out/index.html`, `out/blog.html`, `out/category/*.html`, `out/about.html`, `out/contact.html`, `out/privacy-policy.html`, and live via curl. With `www` + apex both serving, canonicals matter. **Fix:** add `alternates: { canonical: <page-url> }` to every route's metadata.

### sitemap.xml / robots.txt
- Both correct and live. `robots.txt` allows all + points at sitemap. ✓
- **Gap #7:** sitemap lists home, `/blog`, 3 categories, 4 posts, `/about`, `/contact` — but not `/privacy-policy`, `/terms`, `/disclaimer` (`app/sitemap.ts:55-78`). **Fix:** add the three URLs (priority 0.3, monthly).
- Minor: `lastModified: new Date()` for listing pages = build time; acceptable.

### JSON-LD
- Article `BlogPosting` present and valid (`app/blog/[slug]/page.tsx:53-66`; verified parsed in built HTML). Has headline, description, datePublished, author, publisher, mainEntityOfPage, image.
- **Gaps:** no `dateModified`; `author` is `Organization` (see gap #5); `publisher` has no `logo` (Google recommends for rich results); no `BreadcrumbList` despite the visual breadcrumb nav; no `FAQPage` (content has no FAQs — opportunity, not a bug).

### Open Graph / Twitter cards
- **Gap #3 (HIGH):** `app/layout.tsx` OpenGraph/Twitter blocks have **no `images`** — homepage and all non-article pages share with no image. Articles set `og:image`/`twitter:image` to `post.meta.cover`, which is an **SVG** (`https://2ok.lol/covers/halloween.svg`, declared 800×500 but actually vector). Facebook, Pinterest, and X do not render SVG og:images — shares will show no image or fall back. For a Pinterest-driven decor blog this is high severity. **Fix:** generate 1200×630 JPG/PNG per post (reuse the future real cover photos), add a site-default OG image in `app/layout.tsx`.

### Favicon
- **Gap #4 (HIGH):** `curl https://2ok.lol/favicon.ico` → **404** (serves the 404 page, 15,968 bytes). Local `app/favicon.ico` (15 KB) exists and local `out/` references it, but it was never pushed to GitHub (binary skip), so the Cloudflare build has none. **Fix:** commit a favicon (keep `app/favicon.ico`, add `app/icon.svg` as vector fallback) and redeploy.

### 404 page
- **Gap #11 (LOW):** no `app/not-found.tsx`; Next.js emits a default 404 whose built HTML contains **two** `<title>` tags and inherits `robots: index, follow`. **Fix:** add `app/not-found.tsx` with a single title, helpful links, and `robots: { index: false, follow: false }`.

### URL behavior (live, verified via curl)
- `https://2ok.lol/blog/` → 308 → `https://2ok.lol/blog` ✓ (trailing slashes normalized)
- `http://2ok.lol/` → 301 → `https://2ok.lol/` ✓
- Unknown path → real 404 ✓
- `hreflang`: not applicable (single `en` locale). ✓

### Pagination / RSS
- **Gap #12:** no RSS feed. Research recommends a build-time feed (also useful for Pinterest/ syndication later). **Fix:** `app/rss.xml/route.ts` with `dynamic = "force-static"`.
- **Gap #13:** `/blog` renders all posts, no pagination component. Fine at 4 posts; add pagination before ~20 posts.

---

## Chunk 2 — Content audit (the 4 articles)

| Post | Words* | Title SEO | Hook | Structure | Primary keyword (inferred) |
|------|--------|-----------|------|-----------|---------------------------|
| `halloween-decor-ideas-2026.md` | ~651 | Strong: number + adjective + keyword + year | Good ("reputation problem" opener) | 12 × H2 + takeaway | "halloween decor ideas" |
| `christmas-decor-budget-2026.md` | ~635 | Strong: keyword + budget angle + price anchor | Good (myth-busting) | 10 × H2 + budget breakdown | "christmas decor on a budget" |
| `small-living-room-ideas.md` | ~510 | Good ("twice as big" curiosity) but thinnest | Good (designer framing) | 9 × H2 + mindset close | "small living room ideas" |
| `diy-wall-decor-beginners.md` | ~487 | Good (beginner qualifier) but thinnest | Adequate | 7 × H2 + tips box | "diy wall decor" |

\*via `wc -w`, includes ~30 words of frontmatter.

**Writing quality:** original, human-sounding, well-structured listicles with specific, actionable advice (e.g. "hang curtains 10–15cm above the frame", budget breakdown totaling under $50). Intro hooks are good. Grammar reads clean (no systematic tool-check was run — unverified, not flagged as bad).

**Gaps:**
- **Gap #1 (CRITICAL):** depth. 487–651 words vs. 1,500–2,500+ words typical of ranking decor content. `small-living-room-ideas` ("small living room ideas" is a high-competition keyword) at ~510 words has the highest thin-content risk. AdSense's #1 rejection reason is thin/low-value content; the research bar is 15–25 posts at ~800+ words each.
- **Gap #5 (HIGH):** E-E-A-T. No author name, bio, or photo anywhere; JSON-LD author = faceless Organization; About page says "our small editorial team" with no humans named. For YMYL-adjacent DIY (safety) content, a named author with credentials/experience matters.
- **Gap #8 (MEDIUM):** internal linking. Article bodies contain **zero** internal links (verified: only 1 `href="/blog/…"` in the Halloween HTML — the single related card). "Keep reading" shows just 1 card on the Halloween post (same-category fallback exhausted). No contextual links like "see our Christmas budget guide".
- All 4 posts are dated within 8 days (Oct 8–16, 2026) — a reviewer sees a burst, not a publishing history. Minor; resolves itself with a steady schedule.
- No FAQ sections (missed FAQ-schema opportunity), no in-body images, no product/affiliate links yet (fine pre-monetization), CTA is a generic "More ideas → /blog" box on every post (no email capture — the research's seasonal playbook recommends capturing the Halloween spike into a list).
- Titles contain "(2026)" — good for seasonal CTR now, will need yearly refreshes (noted in research as standard practice).
- **Originality:** prose is original in style; no plagiarism-checker verification was run — flag as unverified rather than a fail.

---

## Chunk 3 — Design/UX & theme

**Visual polish:** warm, coherent magazine theme (Fraunces display + Inter body, cream/sand/terracotta). Consistent cards, generous whitespace, sticky blurred header, proper footer. Good first impression. ✓

**Mobile (reasoned from code):** hamburger menu with `aria-label` (`Header.tsx:38`), grids collapse (`md:grid-cols-3` → 1 col), `max-w-3xl` article column, `px-5` gutters, `text-4xl → md:text-5xl` scaling. No obvious mobile breakage. ✓

**Navigation:** header has Home/Blog/About/Contact + "Latest ideas" CTA; mobile menu mirrors it. **Missing:** category links in nav (only reachable via homepage/blog), **no social links** (Pinterest/Instagram) in header or footer — notable miss for a blog whose traffic strategy is Pinterest + Instagram. Search: none (fine at this scale).

**Readability:** article body 1.075rem/1.85 line-height, `max-w-3xl` (~48rem) line length — comfortable. ✓

**Cover images — Gap #2 (CRITICAL):** all four covers are SVG gradient placeholders (`public/covers/*.svg`, 1.2–1.7 KB — e.g. dark gradient + moon circle for Halloween). In a decor niche the photography IS the product; placeholders undermine trust, Pinterest performance, and AdSense "original value" assessment.

**Alt text — Gap #15 (LOW):** every `<img>` uses `alt={post.title}` (`PostCard.tsx:14`, article hero, homepage featured). Not descriptive; screen readers hear the title twice (link + image). **Fix:** descriptive alts, e.g. "Cluster of white and orange pumpkins with eucalyptus on porch steps".

**Accessibility:** semantic landmarks (`header`/`main`/`footer`/`article`/`nav`) ✓; breadcrumb `<nav>` lacks `aria-label` (low); no skip-to-content link (low); **contrast — Gap #10 (MEDIUM):** computed ratios on cream #faf6f0: body ink 14.09 ✓, ink-soft 6.91 ✓, links clay-dark 5.51 ✓, but `stone-warm` **3.64:1** and `clay` **4.01:1** fail WCAG AA 4.5:1 for the small (11–12px) labels/dates they're used for. **Fix:** darken `stone-warm` → ~#6f6459, `clay` → ~#96522c for text usage.

**Dark mode:** none — acceptable, not expected for this audience.

---

## Chunk 4 — Performance & media

**JS weight — Gap #16 (LOW):** `_next/` totals 972K; parsed JS ≈ 500K (224K + 168K + 112K largest chunks). A static blog hydrates React on every page mainly for the mobile menu (`Header.tsx` is `"use client"`), the mailto contact form, and the (currently inert) ad slot. This is the standard Next.js tradeoff and Cloudflare serves it fast — flag as optimization backlog, not a blocker. Biggest win if pursued: make the header menu CSS-only or island-hydrate.

**Fonts:** `next/font/google` self-hosts woff2 with `display:swap` (`app/layout.tsx:7-16`); two families, several weights ≈ 300K total. Correct setup. Could subset later; fine now.

**Images:** `images.unoptimized: true` is correctly set (required for static export — the Next optimizer has no server). Current SVGs are tiny. **When real photos arrive they must be pre-optimized** (the build does nothing to them): export WebP/AVIF at 2–3 widths with explicit dimensions. The planned **Cloudinary** move fits well here — automatic format/width selection via URL params would remove the manual pre-optimization burden and keep the repo light. Until then: no `<Image>` benefit (unoptimized), plain `<img loading="lazy" decoding="async">` with width/height is equivalent.

**Render-blocking:** CSS inlined by Tailwind; font preloads present in HTML head; scripts load `async`. Nothing blocking spotted.

**Caching — Gap #17 (LOW):** no `public/_headers` file, so `/_next/static/*` hashed assets rely on Cloudflare's default cache behavior instead of explicit immutable caching. **Fix:** add `public/_headers` with `Cache-Control: public, max-age=31536000, immutable` for `/_next/static/*`.

**Total payload:** `out/` = 2.1 MB (dominated by JS + fonts). HTML pages are 16–32 KB each — excellent.

---

## Chunk 5 — Trust & policy pages

| Page | Exists | Metadata | Assessment |
|------|--------|----------|------------|
| `/about` | ✓ (`app/about/page.tsx`) | title+description | Good: explains the blog, lists coverage areas, links Disclaimer + Contact, mentions affiliate disclosure. **Thin on E-E-A-T:** "our small editorial team" — no names, photos, or credentials (see gap #5). |
| `/contact` | ✓ (`app/contact/page.tsx`) | **none** (gap #9) | Functional mailto form + direct email link. `hello@2ok.lol` is live via Cloudflare Email Routing → forwards to owner's Gmail (verified 2026-10-16). No phone/address — fine for a blog. |
| `/privacy-policy` | ✓ | title+description+robots | **AdSense-ready:** covers contact-data collection, hosting logs, cookies + DoubleClick disclosure with Google Ads Settings opt-out link, no-sale clause, children's privacy, last-updated date (2026-10-16). |
| `/terms` | ✓ | title+description+robots | Adequate: content/IP, acceptable use, third-party links/ads, limitation of liability, last-updated date. |
| `/disclaimer` | ✓ | title+description+robots | **Good:** general-info notice, affiliate disclosure, advertising disclosure, external-links notice, last-updated date. Matches the About page's affiliate promise. |

**Sitemap gap (#7)** applies here: the three legal pages exist but aren't listed in `sitemap.xml`.

---

## Chunk 6 — Ad-readiness

- **Zero ad markup verified:** `grep` across all 17 built HTML files in `out/` for `adsbygoogle`, `ca-pub-`, `data-ad-slot`, `pagead2` → **zero matches**. (The one "advertisement" hit is the legitimate word in the Disclaimer page's advertising-disclosure copy.)
- **Gating logic correct:** `components/AdSlot.tsx` is a Server Component that returns `null` at build time unless `NEXT_PUBLIC_ADSENSE_CLIENT` is set — `AdSlotClient.tsx` never mounts, the AdSense `<Script>` in `app/layout.tsx:64-71` never renders. The user's lock (no visible empty placeholders, no ad traces pre-approval) is fully honored.
- **Collapse behavior:** `globals.css` has `.ad-slot:empty { display: none; }` — slots collapse when empty. ✓
- **Future note (not a gap yet):** when ads are enabled, slots have no reserved space (`AdSlotClient` renders a plain `<div class="ad-slot">`), so the first ad load may cause layout shift. Per the research's pro pattern, add `min-height`/`aspect-ratio` per placement when real slot IDs go in.
- **Missing (pre-approval, expected):** no `ads.txt` yet — required *after* AdSense approval (publisher ID), not before. Note for the launch checklist.
- Assumption: `NEXT_PUBLIC_ADSENSE_CLIENT` is not set in the Cloudflare Pages environment (build output confirms it wasn't baked in).

---

## Suggested fix order

1. **Content depth** — 15–25 posts at 1,200–2,000+ words (critical path to AdSense).
2. **Real photography** for all posts + OG images (1200×630) — unblocks Pinterest/social, the site's traffic strategy.
3. **Favicon** — commit + redeploy (5-minute fix, high visibility).
4. **E-E-A-T** — named author + bio page + `Person` JSON-LD.
5. **Canonicals + sitemap** additions (quick metadata edits).
6. **Contact metadata** wrapper; per-page OG `url` corrections.
7. Contrast tweaks, descriptive alts, RSS, 404 page, `_headers`, pagination — polish batch.
