// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

import { useEffect, useId, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import GalleryTunnel from "@/components/originkit/ui/hero-03/gallery-tunnel";
import { useTunnelConfig } from "@/components/originkit/ui/hero-03/use-tunnel-size";
import { TUNNEL_IMAGES } from "@/components/originkit/ui/hero-03/tunnel-images";

/** Public asset URLs */
function asset(file: string) {
  return `/originkit/hero-03/${file}`;
}

const EASE_OUT = [0.215, 0.61, 0.355, 1] as const;

type GalleryOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export const GalleryOverlay = ({ open, onClose }: GalleryOverlayProps) => {
  const titleId = useId();
  const reduceMotion = useReducedMotion();
  const { tunnelSize, fade, boost } = useTunnelConfig();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleBackdropKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClose();
    }
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28, ease: EASE_OUT }}
      className="fixed inset-0 z-[60] flex flex-col bg-[#2C2C2C]"
    >
      <h2 id={titleId} className="sr-only">
        Interactive portrait gallery tunnel
      </h2>

      {/* Transparent Floating Header (dark theme style) */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-6 md:px-12 pointer-events-none bg-transparent">
        {/* Brand Logo */}
        <a
          href="#"
          aria-label="LUXE home"
          className="pointer-events-auto inline-flex items-center gap-[11px] touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [-webkit-tap-highlight-color:transparent]"
        >
          <img
            src={asset("nav-luxe-mark.svg")}
            alt=""
            width={18.517}
            height={24.07}
            className="shrink-0 brightness-0 invert"
            aria-hidden="true"
          />
          <span className="font-sans text-[20px] font-semibold leading-[1.1] tracking-[-0.6px] text-white uppercase ipad:text-[22px] ipad:tracking-[-0.66px]">
            LUXE
          </span>
        </a>

        {/* Navigation / Interaction hint */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 backdrop-blur-md">
          <span className="text-xs font-medium text-white/80 font-tight">
            Move cursor or hold to speed up · Esc to close
          </span>
        </div>

        {/* Close Button */}
        <button
          type="button"
          aria-label="Close gallery"
          onClick={onClose}
          className="pointer-events-auto inline-flex h-9 min-w-11 items-center justify-center rounded-lg border border-white/20 bg-white/15 px-5 font-tight text-[14px] font-medium tracking-[-0.28px] text-white backdrop-blur-md transition-all duration-200 ease hover:bg-white/25 active:scale-[0.97]"
        >
          Close ✕
        </button>
      </header>

      {/* 3D Gallery Tunnel with #2C2C2C background */}
      <div
        className="relative w-full h-full min-h-0 flex-1"
        onKeyDown={handleBackdropKeyDown}
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
        />
      </div>
    </motion.div>
  );
};
