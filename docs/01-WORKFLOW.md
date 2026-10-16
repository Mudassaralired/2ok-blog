# 2ok Home Blog — Standing Rules & Way of Working

**Last updated:** 2026-10-16
> These are living documents. Update them whenever the project changes. They are backed up to Google Drive.

These rules apply to anyone (human or agent) working on this project. The owner is Mudassar Ali.

## 1. Ask before acting

- **Never take unrequested actions.** Suggestions and findings are always welcome; execution waits for his explicit yes on that exact action.
- Once an exact task is authorized, continue it through without asking again at every step.
- No proactive side work: no builds, file changes, re-exports, patches, schedule changes, or bundles without his approval of that exact action.

## 2. Research the market BEFORE building

- On any substantial new work, research the market/best practices first and report findings before building — so there is never a "mujhe pata nahi tha" (I didn't know) afterward.
- Deep-audit before big changes: inventory every gap, chunk by chunk, before fixing.

## 3. Accounts, secrets, and money

- **Verification codes are entered only by him**, via browser takeover. Never fetch, type, or relay OTPs or codes. Never touch his passwords.
- Guided setups (accounts, forms) go **one screen at a time**; ask about any unclear field value instead of guessing.
- **Never expose secrets** — no passwords, tokens, API keys, or secret values in chat, files, logs, or reports.
- **Money is sensitive.** Ask before any purchase, paid commitment, or anything that could cost money. Free plan wherever possible (Cloudflare free, no card on file).

## 4. The ad-slot lock (non-negotiable)

- No visible empty ad placeholders on the live blog, ever, before ads are actually configured.
- No ad script traces, slot IDs, or ad-related markup in shipped HTML before approval.
- Ad code goes live only after real approval + real client/slot IDs, followed by a rebuild.

## 5. Repo hygiene

- Keep the repo clean and organized so **another developer can take over** at any time: clear file layout, working README, no dead code.
- Don't commit secrets, oversized binaries, or generated junk. Media lives on Cloudinary, not in the repo.

## 6. Content & image standards

- Articles: original, human-sounding, practical. Target 1,200–2,000 words for guides; anti-fluff intros (60–120 words); Key Takeaways box; table of contents; FAQ section; contextual internal links; real costs/measurements.
- Images: **photorealistic, natural, Pinterest-clickable.** Covers landscape (16:9-ish); Pinterest pins vertical (2:3, 1280×1920). No text burned into images, no watermarks, no deformed/AI-looking output — check every generated image before using it.

## 7. Communication

- Conversation language with the owner: short, direct Roman Urdu.
- Docs (like this one): clear, simple English.
- Give honest assessments, not yes-man agreement. If something is thin or weak, say so plainly with evidence.
- Own mistakes in one line, fix in the same turn.
