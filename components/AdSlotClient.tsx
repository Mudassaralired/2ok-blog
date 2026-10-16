"use client";

import { useEffect } from "react";

/**
 * Client half of the ad slot. Only ever mounted when an ad client ID is
 * configured (see AdSlot.tsx) — so before ad approval this code never
 * reaches the page at all: no markup, no props in flight data, nothing.
 */
const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

type AdSlotClientProps = {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  label?: string;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSlotClient({
  slot,
  format = "auto",
  className = "",
  label,
}: AdSlotClientProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* AdSense not ready yet — the slot stays collapsed. */
    }
  }, []);

  return (
    <div className={`ad-slot ${className}`} data-ad-label={label ?? "ad"}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
