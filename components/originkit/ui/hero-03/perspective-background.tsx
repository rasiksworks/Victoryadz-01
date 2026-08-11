// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

"use client";

import { useReducedMotion } from "motion/react";
import GalleryTunnel from "@/components/originkit/ui/hero-03/gallery-tunnel";
import { useTunnelConfig } from "@/components/originkit/ui/hero-03/use-tunnel-size";

import { TUNNEL_IMAGES } from "@/components/originkit/ui/hero-03/tunnel-images";

/**
 * Animated Three.js gallery tunnel.
 * Click/hold empty areas to boost; UI stays clickable above.
 */
export const PerspectiveBackground = () => {
  const reduceMotion = useReducedMotion();
  const { tunnelSize, fade, boost } = useTunnelConfig();

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
    >
      <GalleryTunnel
        background="#2C2C2C"
        lineColor="#555555"
        lineOpacity={60}
        grid={4}
        tunnelSize={tunnelSize}
        speed={reduceMotion ? 0 : 9}
        boost={reduceMotion ? 0 : boost}
        fade={fade}
        label={false}
        images={TUNNEL_IMAGES}
        style={{ width: "100%", height: "100%" }}
      />

      {/* Soft center veil — stronger on desktop to match design wash */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(44,44,44,0.75)_0%,rgba(44,44,44,0.35)_40%,transparent_64%)] ipad:bg-[radial-gradient(ellipse_at_center,rgba(44,44,44,0.82)_0%,rgba(44,44,44,0.45)_38%,transparent_62%)] desktop-sm:bg-[radial-gradient(ellipse_at_center,rgba(44,44,44,0.88)_0%,rgba(44,44,44,0.52)_36%,transparent_60%)]" />
    </div>
  );
};
