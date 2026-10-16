import AdSlotClient from "./AdSlotClient";

/**
 * AdSlot — a single ad placement.
 *
 * CONFIG-GATED (the important part): this is a Server Component that checks
 * the ad configuration at build time. Until an AdSense client ID is set via
 * the NEXT_PUBLIC_ADSENSE_CLIENT environment variable, it returns null —
 * the client half is never even mounted, so the shipped HTML contains zero
 * ad markup, zero ad props, zero empty boxes, and zero layout shift.
 *
 * After approval:
 *   1. Set NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXX (Cloudflare Pages env vars).
 *   2. Replace the placeholder slot IDs with real ones from AdSense.
 *   3. Redeploy — slots appear, auto-size (responsive), auto-collapse empty.
 *
 * Usage:
 *   <AdSlot slot="1234567890" label="In-article" />
 *
 * See README.md ("Ads") for the full setup.
 */
const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

type AdSlotProps = {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  label?: string;
};

export default function AdSlot(props: AdSlotProps) {
  // The lock: not configured → render nothing, mount nothing.
  if (!AD_CLIENT) return null;
  return <AdSlotClient {...props} />;
}
