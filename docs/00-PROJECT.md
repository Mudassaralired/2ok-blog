# 2ok Home Blog — Project Overview

**Last updated:** 2026-10-16
> These are living documents. Update them whenever the project changes. They are backed up to Google Drive.

## What this is

**2ok Home** is a Home Decor & DIY blog at **https://2ok.lol**, aimed primarily at women readers. It publishes practical, budget-friendly home decorating guides and DIY project tutorials. Content is written in English.

The blog is a monetization play: the plan is Google AdSense first, then Mediavine Journey (at ~1,000 monthly sessions), then Raptive (at ~25,000 monthly pageviews). A parallel Pinterest + Instagram strategy (@2ok.home) drives traffic.

## Live URLs

| URL | Purpose |
|---|---|
| https://2ok.lol | Primary site (apex domain) |
| https://www.2ok.lol | WWW alias, same site |
| https://2ok-blog.pages.dev | Cloudflare Pages default URL (deployment fallback) |

## Tech stack

- **Framework:** Next.js 16.4.2 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4, custom warm palette (cream/sand/terracotta), Fraunces serif headlines + Inter body
- **Rendering:** Static export (`output: "export"`) — every page pre-rendered to plain HTML in `out/`. No server, no database, no CMS.
- **Content:** Markdown files in `content/posts/*.md` with frontmatter (`title`, `date`, `excerpt`, `category`, `cover`). New post = new file, no code changes needed.
- **Markdown pipeline:** gray-matter + remark → remark-rehype → rehype-slug → rehype-stringify (headings get anchor IDs for tables of contents)
- **Images:** hosted on Cloudinary CDN (see Accounts), served as AVIF/WebP via `f_auto,q_auto` transformations
- **SEO plumbing:** per-article meta + canonical + Open Graph, `BlogPosting` JSON-LD `@graph` (Person author, BreadcrumbList, ItemList, ImageObject), auto `sitemap.xml`, `robots.txt`, RSS feed (`/rss.xml`), custom 404

## Repository & hosting

- **GitHub:** `Mudassaralired/2ok-blog` (public), branch `main`
- **Hosting:** Cloudflare Pages, project `2ok-blog`, free plan
- **Build config:** framework preset "Next.js (Static HTML Export)", build command `npm run build`, output directory `out`
- **Deploy flow:** push to `main` → Cloudflare auto-builds and deploys (~1 min). Sitemap, listings, and category pages regenerate automatically.
- **Note:** `package-lock.json` is not in the repo (exceeds the GitHub connector's file-size limit); Cloudflare installs from `package.json`.

## Accounts & services

| Service | Account / detail |
|---|---|
| Cloudflare | banmance4@gmail.com — free plan, no card on file. Owns Pages project + 2ok.lol DNS zone. |
| GitHub | `Mudassaralired` — repo `Mudassaralired/2ok-blog` (public, main branch) |
| Domain registrar | Dynadot — 2ok.lol registered here; nameservers point to Cloudflare (`bella.ns.cloudflare.com`, `uriah.ns.cloudflare.com`) |
| Cloudinary | `knb4zxgu` — blog media lives in folder `2ok-blog/` (covers) and `2ok-blog/pins/` (Pinterest pins) |
| Contact email | `hello@2ok.lol` → forwarded to `banmance4@gmail.com` via free Cloudflare Email Routing |

## Key decisions log

1. **Next.js + Cloudflare Pages over WordPress** (2026-10-16) — free hosting, unlimited bandwidth, faster and more SEO-friendly for a static content site.
2. **Stay on `2ok.lol`** (2026-10-16) — an extensive hunt for a short premium `.com` found nothing worth buying (51 invented names all taken; aftermarket prices $3k–$11k). Decision: keep 2ok.lol, spend $0.
3. **Niche: Home Decor & DIY** (2026-10-04) — one primary niche for topical authority; Pinterest's #1 evergreen category; fits AI-assisted production strengths.
4. **Ad-slot lock** — ad placements render absolutely nothing until a real AdSense client ID is configured. No empty boxes, no ad script traces in shipped HTML, ever.
5. **Cloudinary for media** (2026-10-16) — covers and pins served from CDN with automatic format/quality optimization instead of bloating the repo.
6. **Markdown content files** — articles as `.md` files so publishing never requires code changes and any developer can take over.
7. **Research before building** — market/ad-network research was completed before the build so there are no surprises later.
