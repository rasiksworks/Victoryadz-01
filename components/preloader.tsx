"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export const Preloader: React.FC = () => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // If we are not on the homepage, invert the colors (black bg, white text)
  const isInverted = pathname !== "/";

    useEffect(() => {
    // Disable scrolling while preloader is active
    document.body.style.overflow = "hidden";
    if (typeof window !== "undefined" && (window as any).lenis) {
      (window as any).lenis.stop();
    }

    let isAssetReady = false;
    if (typeof document !== "undefined" && document.readyState === "complete") {
      isAssetReady = true;
    } else if (typeof window !== "undefined") {
      const handleLoad = () => { isAssetReady = true; };
      window.addEventListener("load", handleLoad, { once: true });
    }

    // Smooth progress counter
    const minDuration = 1000;
    const startTime = performance.now();

    const animateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      let t = Math.min(elapsed / minDuration, 1);

      // If document is still not ready, hold briefly at 95%
      if (!isAssetReady && t > 0.95 && elapsed < 2500) {
        t = 0.95;
      }

      // Easing function (easeOutExpo)
      const ease = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const currentProgress = Math.min(100, Math.floor(ease * 100));
      
      setProgress(currentProgress);

      if (t < 1) {
        requestAnimationFrame(animateProgress);
      } else {
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = "";
          if (typeof window !== "undefined" && (window as any).lenis) {
            (window as any).lenis.start();
          }
        }, 250);
      }
    };

    requestAnimationFrame(animateProgress);

    return () => {
      document.body.style.overflow = "";
      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.start();
      }
    };
  }, []);

  const formattedProgress = String(progress).padStart(3, '0') + "%";

  return (
    <AnimatePresence>
      {isLoading && (
        <>
          {/* Pre-layer 1 (Deep Obsidian) */}
          <motion.div
            key="preloader-layer-1"
            initial={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.18 } }}
            className="fixed inset-0 z-[100000] bg-[#09090b] transform-gpu will-change-transform"
          />
          
          {/* Pre-layer 2 (Charcoal Grey) */}
          <motion.div
            key="preloader-layer-2"
            initial={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.12 } }}
            className="fixed inset-0 z-[100001] bg-[#3f3f46] transform-gpu will-change-transform"
          />

          {/* Pre-layer 3 (Silver Grey) */}
          <motion.div
            key="preloader-layer-3"
            initial={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.06 } }}
            className="fixed inset-0 z-[100002] bg-[#a1a1aa] transform-gpu will-change-transform"
          />

          {/* Main Preloader Panel (Dynamic colors based on route) */}
          <motion.div
            key="preloader-main"
            initial={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0 } }}
            className={`fixed inset-0 z-[100003] ${isInverted ? 'bg-[#111111] text-white' : 'bg-white text-black'} overflow-hidden transform-gpu will-change-transform`}
          >
            {/* Left Side Content */}
            <div className={`absolute left-6 md:left-12 top-1/2 -translate-y-1/2 flex flex-col text-[10px] md:text-xs font-mono ${isInverted ? 'text-white' : 'text-black'} leading-tight tracking-tight uppercase`}>
              <div className="flex gap-2">
                <span>&lt;</span>
                <span>VICTORYADZ AGENCY</span>
              </div>
              <div className="pl-4">
                <span>VICTORYADZ STUDIO</span>
              </div>
              <div className="pl-4">
                <span>8+ YEARS EXPERIENCE</span>
              </div>
            </div>

            {/* Right Side Huge Percentage */}
            <div className="absolute right-4 md:right-8 bottom-0 md:bottom-[-2%] flex items-end">
              <span 
                className={`font-sans font-bold tracking-tighter ${isInverted ? 'text-white' : 'text-[#1c1c1c]'} select-none scale-y-[1.4] origin-bottom inline-block`}
                style={{ fontSize: "clamp(8rem, 25vw, 22rem)", lineHeight: "0.8" }}
              >
                {formattedProgress}
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
