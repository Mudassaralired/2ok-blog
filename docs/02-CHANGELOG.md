# 2ok Home Blog — Changelog

**Last updated:** 2026-10-16
> These are living documents. Update them whenever the project changes. They are backed up to Google Drive.

## 2026-10-16 — Build day

**Blog built (morning)**
- Next.js 16.4.2 static-export blog created: warm home-magazine theme (Fraunces + Inter, cream/sand/terracotta), 19 static pages, ~2.1 MB output.
- 4 original starter articles: Halloween decor ideas, Christmas decor on a budget, small living-room ideas, beginner DIY wall decor (~500–650 words each).
- Trust pages: About, Contact, Privacy Policy, Terms of Use, Disclaimer. Auto `sitemap.xml` + `robots.txt`. Per-article SEO + `BlogPosting` JSON-LD. Ad slots config-gated (zero ad traces in shipped HTML — verified).

**Pushed to GitHub**
- Repo `Mudassaralired/2ok-blog` (public) created by owner; 39 source files pushed in 4 commits. `package-lock.json` skipped (298 KB, exceeds connector limit); `app/favicon.ico` skipped (binary).

**Cloudflare account + deployment**
- Cloudflare account created on `banmance4@gmail.com` (free plan, no card; owner typed the password himself and clicked the email verification link).
- Pages project `2ok-blog` created, GitHub repo connected (owner authorized the GitHub App), build `npm run build` → `out/`. First deploy succeeded: 18/18 pages, live at `https://2ok-blog.pages.dev`.

**Custom domain `2ok.lol`**
- DNS management transferred from Dynadot to Cloudflare (owner changed nameservers to `bella.ns.cloudflare.com` / `uriah.ns.cloudflare.com` in Dynadot; DNSSEC was off).
- `https://2ok.lol` and `https://www.2ok.lol` both Active with automatic SSL, verified loading the blog.

**Contact email**
- `hello@2ok.lol` set up via free Cloudflare Email Routing → forwards to `banmance4@gmail.com` (auto-verified, rule Active; catch-all disabled). Dynadot's own email forwarding was abandoned (incompatible once DNS moved to Cloudflare).

**Deep audit (evening)**
- Full audit → `audits/DEEP_AUDIT_2026-10-16.md`: **18 gaps in 6 chunks** (technical SEO, content, design/UX, performance, trust pages, ad-readiness). Critical: thin content (4 posts), zero real photography, broken/missing OG images, favicon 404, weak E-E-A-T.

**Gemini SEO research (evening)**
- Deep research via Gemini Pro (Argon model) on `banmance4@gmail.com` → `audits/GEMINI_SEO_RESEARCH_2026-10-16.md`. Key findings: `*.pages.dev` duplicate-content danger (fix: noindex + redirect), content priority matrix (DIY wall-decor cluster first; Christmas post before 25 Oct; Halloween too late for 2026 organic), Key Takeaways box for AI Overviews, AVIF image pipeline, flat `.entry-content` DOM for Mediavine.

**All fixes applied (evening)**
- Favicon (SVG), site + per-article OG images (1200×630), canonicals on every route, sitemap completed, Contact page metadata (server wrapper), custom 404 (noindex), `public/_headers` cache rules, contrast fixes (WCAG AA), descriptive alt text, RSS feed, per-page OG URLs, `dynamicParams = false`, heading anchor IDs, author page `/author/mudassar-ali` + bylines, single JSON-LD `@graph` (BlogPosting + Person + BreadcrumbList + ItemList + ImageObject), up-to-3 related cards, Instagram social links, footer category links, Mediavine-safe flat article DOM.
- Local build verified: 21 routes, zero ad markup in output.

**Content expansion (evening)**
- All 4 posts expanded to **1,200–2,000 words** (1,589 / 1,593 / 1,969 / 1,920): Key Takeaways boxes, tables of contents with verified anchors, 2–3 internal links each, FAQ sections, real costs/measurements, refreshed excerpts.

**Media (evening)**
- 4 photorealistic covers generated (quality-checked, natural, no text/watermarks) + 4 vertical Pinterest pins (1280×1920, 2:3).
- Covers + pins generated locally (verified photorealistic); Cloudinary upload: console blocked in automated browser sessions (3 attempts) → Mudassar created unsigned preset `2ok-blog` 2026-10-16 ~20:38 PKT → all 8 uploaded via API with exact public_ids, all 12 delivery URLs verified HTTP 200 (4 covers + 4 OG crops + 4 pins). Preset to be deleted after upload.

## Pending / next up

- [ ] Push all fixes + expanded content to GitHub → verify Cloudflare auto-deploy
- [x] Cloudflare Bulk Redirect DONE 2026-10-16 ~20:34 PKT: list `pages_dev_to_2ok_lol` (Active), source `2ok-blog.pages.dev/` → target `https://2ok.lol`, 301, preserve query string + path suffix + subpath matching; rule `pages-dev-to-2ok-lol` enabled/deployed. Verified live: `/` → 301 → `https://2ok.lol/`, `/robots.txt` → 301 → `https://2ok.lol/robots.txt`, `/blog/?q=seo` → 301 with path+query preserved. `2ok.lol` itself unaffected (200). Duplicate-content risk eliminated; no X-Robots-Tag touched.
- [ ] Mobile screenshot QA of the live site (visual check, not just code)
- [ ] New article pipeline: DIY wall-decor hub + 5 tutorials first; Christmas budget post **before 25 Oct**
- [ ] `ads.txt` — only after AdSense approval (not before)
- [ ] Grow to 15–25 substantial posts before applying to AdSense
