"use client";

import { useId } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import GalleryTunnel from "@/components/originkit/ui/hero-03/gallery-tunnel";
import { useTunnelConfig } from "@/components/originkit/ui/hero-03/use-tunnel-size";
import { TUNNEL_IMAGES } from "@/components/originkit/ui/hero-03/tunnel-images";

/** Public asset URLs */
function asset(file: string) {
  return `/originkit/hero-03/${file}`;
}

export default function WorksPage() {
  const titleId = useId();
  const reduceMotion = useReducedMotion();
  const { tunnelSize, fade, boost } = useTunnelConfig();

  return (
    <main className="relative w-screen h-screen bg-[#2C2C2C] flex flex-col overflow-hidden">
      <h2 id={titleId} className="sr-only">
        Interactive portrait gallery tunnel
      </h2>

      
      {/* Floating Interaction Hint (bottom) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center justify-center">
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 backdrop-blur-md">
          <span className="text-xs font-medium text-white/80 font-tight">
            Move cursor or hold to speed up
          </span>
        </div>
      </div>


      {/* 3D Gallery Tunnel with #2C2C2C background */}
      <div className="relative w-full h-full min-h-0 flex-1">
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
        />
      </div>
    </main>
  );
}
