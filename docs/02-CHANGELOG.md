# 2ok Home Blog — Changelog

**Last updated:** 2026-10-17
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
- Covers + pins generated locally (verified photorealistic); Cloudinary upload: console blocked in automated browser sessions (3 attempts) → Mudassar created unsigned preset `2ok-blog` 2026-10-16 ~20:38 PKT → all 8 uploaded via API with exact public_ids, all 12 delivery URLs verified HTTP 200 (4 covers + 4 OG crops + 4 pins). Preset to be deleted after upload. [SUPERSEDED 2026-10-17: Mudassar instructed to leave unsigned preset `2okhome` active and keep using it.]
- [x] Full remediation pushed to GitHub 2026-10-16 ~20:47 PKT in 3 commits: `98d0447` (SEO + E-E-A-T code fixes), `782fa7e5` (4 expanded articles), `a6a748cc` (docs/audits/meta). Skipped: `package-lock.json` (280 KB, connector arg limit — same as v1 push), `public/covers/` + `public/pins/` JPGs (gitignored working assets; production serves from Cloudinary).
- [x] Sprint Day 3 (2026-10-19): 4 DIY wall-decor articles, all live:
  - `diy-plaster-wall-art` — 1554 words, complete tutorial (joint compound vs plaster, 3 techniques, drying times, crack fixes, sealing) (`ef568264`)
  - `gallery-wall-layout-guide` — 1512 words, 4 templates (grid, anchor, linear, staircase) with spacing formulas + paper-template method (`33815547`)
  - `macrame-wall-hanging-beginners` — 1530 words, 4 knots + complete first project with exact cord math (`04d596fc`)
  - `diy-wall-decor-ideas` — 1518 words, hub page: 15+ projects by budget/skill/style linking all tutorials (`0118a26f`)
  - Plagiarism catches: rewrote "smother like butter on bread" (theorangehome.blog) → "like frosting a cake".
- [x] Sprint Day 4 (2026-10-20): 4/4 articles, ALL LIVE — sprint complete at 20/20:
  - `thrifted-frame-makeover` — 1518 words, 3 finishes under $5 (chalk paint, gold-leaf edges, stripped wood) + frame-hunting guide (`21bb2764`) ✅
  - `pressed-flower-wall-art` — 1545 words, 12-minute microwave-press method vs 3-week book method + floating-frame arranging (`c86c9539`) ✅
  - `renter-friendly-wall-decor` — 1524 words, 9 DIY ideas zero holes, adhesive-prep ritual, landlord inspection guide (`5d2597c6`) ✅
  - `small-living-room-storage-ideas` — 1517 words, 10 ideas with real dimensions + 20-min storage audit (`cddb84b2`) ✅
  - Push note: renter + storage pushes blocked ~00:30 PKT (GitHub approval expired, owner asleep); retried 06:47 PKT on his "?" — both approved and live.
  - Extra topics chosen from keyword evidence: renter-friendly (2 PAA long-tails + documented gap in beginners article), storage (PAA long-tail, strengthens winnable small-living-room pillar).
  - Plagiarism catches: rewrote "Storage systems fail when new things arrive faster than old things leave" (content-farm match) → original phrasing.
- [x] Sprint Day 2 (2026-10-18, published 17 Oct night PKT): 4 living-room articles, all live:
  - `small-living-room-tv-layout` — 1533 words, "4 Exact Recipes" (Straight Shot, Corner TV, TV+Fireplace, Narrow Room) (`6ab88162`, ToC anchor fix `408e14cb`)
  - `best-paint-colors-small-living-room` — 1566 words, "7 Shades That Actually Work" (real codes + LRV, north/south rule) (`408e14cb`)
  - `rug-size-small-living-room` — 1518 words, "The 3 Measurements That Matter" (5x7/6x9 recipes, pile guide) (`a12bd867`)
  - `best-sofa-small-living-room` — 1609 words, "5 Types Ranked by Real Dimensions" (apartment sofa, loveseat, chaise, sleeper, modular) (`c51e8a1e`)
  - QA learning: ToC anchors must be verified with the site's actual github-slugger (it does NOT collapse double hyphens) — fixed 2 broken anchors across articles; all 9+ articles now verified clean.
  - Plagiarism catches: rewrote "Switzerland of paint colors" (widely used) → "peacekeeper of paint colors"; rewrote "shoes two sizes too small" (widely used in rug content).
- [x] Sprint Day 1 (2026-10-17, published 16 Oct night PKT): 4 Christmas articles, all live:
  - `dollar-tree-christmas-decor-diy` — 1849 words, "10 Dollar Tree Christmas DIYs That Don't Look Cheap", cover + 2 process images (`378e9f86`)
  - `christmas-mantel-decor-budget` — 1545 words, "3 Stunning Looks Under $20", cover + 2 images (`d24957d0`)
  - `christmas-porch-decor-budget` — 1528 words, "9 Ideas Under $30 Total", cover + 2 images (`fe446d82`)
  - `christmas-tree-alternatives-small-apartments` — 1647 words, "7 Alternatives", cover + 2 images (`134a4a5a`)
  - Each: SERP tone research, human voice, cluster keywords, 1500+ words, FAQ, internal links, plagiarism-checked (exact-phrase), ToC verified, Cloudinary images via `2okhome` preset (stays active per Mudassar's 2026-10-17 instruction).
  - Also: 8 process images inserted into the 4 original live articles (`c76e4545`).
- [x] Logo 2026-10-16 ~22:20 PKT: Mudassar chose **A (clean house)**; got a professional version from **Gemini** (SVG code, terracotta rounded square + cream line-art house). Gemini's image-generation quota was exhausted — SVG only, no PNG. Wired into `components/Header.tsx` replacing the old "2" box (`public/logo-mark.svg`). Pushed as commit `176eb496`; favicon stays as-is per his call.
- [x] Keyword clusters 2026-10-16 ~21:20 PKT: `docs/KEYWORD_CLUSTERS.md` — 8 topics (4 live + DIY hub + 5 tutorial spokes + Christmas cluster + living-room spokes), each with primary keyword, 6-10 long-tails, competition verdict, winning angle, section mapping + gaps for live articles. Key: small-living-room = LOW-MEDIUM competition (beatable AI-content SERPs), DIY cluster = LOW, Christmas = MEDIUM-LOW (publish before 25 Oct). No paid tools — no volume numbers, snapshot of 2026-10-16. Pushed as commit `80c9f2ee` + Drive backup.
- [x] Plagiarism check 2026-10-16 ~21:16 PKT (exact-phrase method, 20 searches): 3/4 articles fully clean; 1 partial overlap in small-living-room-ideas ("dance floor" metaphor, ~10 words, maisonlyinteriordesign.com) → reworded, pushed as commit `1ad005b9`.
- [x] Grammar proofread 2026-10-16 ~21:12 PKT: all 4 articles reviewed — 2 fixes in halloween-decor-ideas-2026 (parallelism, phrasing), other 3 clean. ToC anchors re-verified (0 broken). Pushed as commit `492208a3`. Plagiarism check (exact-phrase method) and keyword cluster research still running.
- [x] Google Search Console 2026-10-16 ~21:00 PKT: Domain property `2ok.lol` added + DNS TXT verified (first attempt). Sitemap `https://2ok.lol/sitemap.xml` submitted (Google showed transient "Couldn't fetch" — sitemap itself valid, Google retries automatically). Indexing requested for `/` + all 4 articles.
- [x] Sitemap "Couldn't fetch" recheck 2026-10-18: resubmission still showed "Couldn't fetch", BUT Search Console URL Inspection live test on the sitemap returned "URL is available to Google" — crawl allowed, page fetch successful, no errors. Sitemap serves HTTP 200 (valid XML, 31 URLs) to normal + Googlebot user-agents. Conclusion: the sitemaps-list status is stale/stuck; the sitemap itself is fine and Google can fetch it. No action needed — status should clear on Google's next retry.
- [x] Sitemap deep-fix 2026-10-18 ~19:20 PKT: removed the stuck sitemap entry in Search Console and resubmitted fresh (`https://2ok.lol/sitemap.xml` — submission accepted) — status STILL shows "Couldn't fetch" afterward; sitemap URL verified loading fine in browser. Root-cause hunt: repo has no middleware, no bot-blocking, robots allow-all; all URLs return HTTP 200 with zero redirects. URL Inspection on 8 key URLs: 6/8 ALREADY indexed (/, plaster, halloween, frame-makeover, renter, storage); 2 showed Oct-16 "Redirect error" (small-living-room-ideas, christmas-decor-budget-2026 — transient, deploy-time; live tests now pass). "Request indexing" succeeded for all 8 — all in priority crawl queue. site:2ok.lol search showed 0 results but that lags; Search Console is ground truth. Practical impact of stuck sitemap status is now low since pages are indexing directly.
- [x] Google escalation 2026-10-18 ~19:38 PKT (per Mudassar's demand): no direct Google support exists for Search Console — posted full case to Google Search Central Help Community ("Crawling, Indexing and Ranking"): https://support.google.com/webmasters/thread/473490141 — sitemap "Couldn't fetch" persists after remove+resubmit while URL Inspection live test succeeds; all technical verifications listed; asked why sitemap fetcher fails when inspection fetcher succeeds + how to see the real error. Awaiting community/Google-team reply (typically 1–2 days).
- [x] Gemini AI discussion 2026-10-18 ~19:54 PKT (per Mudassar: "discuss with Gemini and solve together"): consulted Gemini on banmance4 account with full case. Diagnosis: GSC sitemap fetcher runs on a separate background pipeline from the live inspection tool and can get stuck replaying a cached failure state; suggested the alias trick (new sitemap URL forces a fresh fetch), checking Cloudflare Security Events for challenged Googlebot requests, and raw log inspection. Implemented the alias trick: refactored sitemap generation into `lib/sitemap-entries.ts` (shared), added `app/sitemap-v2.xml/route.ts` serving identical 31 URLs (commit `77ef056b`), deployed, verified live (HTTP 200, valid XML). Submitted `https://2ok.lol/sitemap-v2.xml` to Search Console ~20:00 PKT — accepted, but shows "Couldn't fetch" minutes after submission (too early to be meaningful; background fetcher runs on its own schedule). Clean experiment: if v2 flips to Success within 24–48h, cache theory confirmed; if not, next step is Cloudflare Security Events check (needs Mudassar's Cloudflare login). Monitoring cron `sitemap-thread-reply-watch` (every 6h) now watches BOTH the community thread replies AND both sitemap entries' statuses, auto-reports and retires on resolution or 48h timeout.
- [x] Google Analytics 4 2026-10-16 ~21:00 PKT: account "2ok Home", property "2ok.lol" (ID 559250043, timezone Asia/Karachi, currency USD), web stream "2ok.lol web", Measurement ID `G-LS57Y0MYH7`. Tag added to `app/layout.tsx` via `next/script` (afterInteractive), pushed as commit `8d372561`; verified LIVE on https://2ok.lol 2026-10-16 ~21:08 PKT. Stats will appear in GA4 Realtime within minutes of first visit.

- [x] Topical-authority push 2026-10-19 ~07:40 PKT: 12 new wall-decor articles published (1500-2000 words each, SEO, interlinked) — pillar `diy-wall-decor-guide` + plaster (textured-plaster-art, plaster-art-colors, plaster-art-tools) + gallery (gallery-wall-templates, small-gallery-wall-ideas) + macrame (macrame-patterns, mini-macrame-decor) + renter (damage-free-wall-decor, removable-wallpaper-ideas) + frames (thrifted-frame-flips, frame-matting-guide). Site now 32 articles. Interlinking function: new `cluster` frontmatter field + "Keep reading" upgraded to cluster-first (4 cards). Permalinks shortened: 12 long slugs → short (e.g. `christmas-tree-alternatives-small-apartments` → `christmas-tree-alternatives`) with 301 redirects in `public/_redirects`; OG-image alias map keeps old Cloudinary paths working. CoverImage component: articles without covers render a branded terracotta placeholder instead of broken image (owner generates polished covers from the prompt list himself). All internal links verified (0 broken), `tsc` clean, `next build` SSG 32 pages OK.

- [x] 5 more articles + topic hubs 2026-10-19 ~08:20 PKT: small-living-room-lighting, small-living-room-layouts, small-living-room-color-schemes, budget-small-living-room-decor, christmas-living-room-decor (1500-2000 words, SEO, interlinked). Site now 37 articles: wall-decor 20, small-living-room 10, christmas-decor 6, halloween 1. New `/topics/[cluster]/` hub pages (wall-decor, small-living-room, christmas-decor, halloween) with SEO metadata; homepage "Browse by Topic" section now shows the 3 main clusters (replacing the old categories block); topic URLs added to sitemap (priority 0.8). 0 broken internal links, tsc clean.

## Pending / next up

- [ ] Push all fixes + expanded content to GitHub → verify Cloudflare auto-deploy
- [x] Cloudflare Bulk Redirect DONE 2026-10-16 ~20:34 PKT: list `pages_dev_to_2ok_lol` (Active), source `2ok-blog.pages.dev/` → target `https://2ok.lol`, 301, preserve query string + path suffix + subpath matching; rule `pages-dev-to-2ok-lol` enabled/deployed. Verified live: `/` → 301 → `https://2ok.lol/`, `/robots.txt` → 301 → `https://2ok.lol/robots.txt`, `/blog/?q=seo` → 301 with path+query preserved. `2ok.lol` itself unaffected (200). Duplicate-content risk eliminated; no X-Robots-Tag touched.
- [ ] Mobile screenshot QA of the live site (visual check, not just code)
- [ ] New article pipeline: DIY wall-decor hub + 5 tutorials first; Christmas budget post **before 25 Oct**
- [ ] `ads.txt` — only after AdSense approval (not before)
- [ ] Grow to 15–25 substantial posts before applying to AdSense
