# 2ok Home — Blog

Home Decor & DIY blog for **2ok.lol**, built with Next.js (static export)
and hosted on Cloudflare Pages. Free hosting, unlimited bandwidth.

## How it works

- **Content** lives in `content/posts/*.md` — one Markdown file per article,
  with frontmatter (`title`, `date`, `excerpt`, `category`, `cover`).
- `next build` renders every page to static HTML in `out/`.
- Pushing to the connected GitHub repo auto-deploys via Cloudflare Pages.

No database. No server. No CMS to maintain.

## Project structure

```
2ok-blog/
├── app/                        # Routes (Next.js App Router)
│   ├── page.tsx                # Homepage
│   ├── blog/
│   │   ├── page.tsx            # Article listing
│   │   └── [slug]/page.tsx     # Article template (pre-rendered per post)
│   ├── category/[category]/    # Topic pages (pre-rendered per category)
│   ├── about|contact|          # Trust pages (ad networks require these)
│   │   privacy-policy|terms|
│   │   disclaimer/
│   ├── layout.tsx              # Fonts, metadata, header/footer, ad loader
│   ├── sitemap.ts              # Auto sitemap.xml (all posts + pages)
│   └── robots.ts               # robots.txt (points to sitemap)
├── components/
│   ├── Header.tsx / Footer.tsx # Site chrome
│   ├── PostCard.tsx            # Article card used in listings
│   └── AdSlot.tsx              # ★ Ad placement (see "Ads" below)
├── content/posts/*.md          # ★ Articles — this is where writing happens
├── lib/posts.ts                # Markdown parsing, sorting, categories
├── public/covers/*.svg         # Article cover art (replace with photos anytime)
├── next.config.ts              # output: 'export', images unoptimized
└── README.md                   # This file
```

## Publishing a new article

1. Create `content/posts/my-new-idea.md`:

```md
---
title: "My Article Title"
date: "2026-11-01"
excerpt: "One or two sentences for listings and Google."
category: "Seasonal Decor"
cover: "/covers/my-cover.svg"
---

Your article in Markdown. ## Headings, **bold**, lists, etc.
```

2. (Optional) Add a cover image to `public/covers/` and reference it.
3. Commit + push. Cloudflare Pages rebuilds and the article is live in ~1 min.
   The sitemap, homepage, blog listing, and category pages update automatically.

No code changes needed. Ever.

## Ads

Ad placements are **config-gated**: `<AdSlot>` renders absolutely nothing
until an AdSense client ID is configured. No empty boxes, no layout shift,
no ad code shipped before approval.

To enable ads after AdSense approval:

1. In AdSense, create ad units and note their **slot IDs**.
2. Set the environment variable in Cloudflare Pages
   (Settings → Environment variables):
   `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX`
3. Replace the placeholder slot IDs in `app/blog/[slug]/page.tsx`
   (`IN_ARTICLE_SLOT_ID`, `BOTTOM_SLOT_ID`) with your real slot IDs.
4. Redeploy.

Slots auto-size (responsive) and auto-collapse when unfilled.

## SEO

- Per-article `<title>`, meta description, canonical URL, Open Graph tags.
- `BlogPosting` JSON-LD structured data on every article.
- `sitemap.xml` regenerates on every build; `robots.txt` references it.
- Semantic HTML, fast static pages, mobile-first design.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → out/
```

## Deployment (Cloudflare Pages)

1. Push this repo to GitHub.
2. Cloudflare Dashboard → Pages → Create → Connect to Git.
3. Framework preset: **Next.js (Static HTML Export)**.
4. Build command: `npm run build` · Output directory: `out`.
5. Custom Domains → add `2ok.lol` → free SSL is automatic.

## Design

Warm minimal "home magazine" look: cream/sand backgrounds, terracotta
accents, Fraunces serif headlines + Inter body. Ad-network friendly:
clean, fast, readable, no clutter.
