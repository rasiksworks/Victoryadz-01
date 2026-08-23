"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button01 } from "@/components/ui/nextjsshop-button";
import WarpText from "@/components/ui/WarpText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Footer: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<"privacy" | "support" | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSocialClick = (platform: string, url: string) => {
    triggerToast("Opening VictoryAdz " + platform + "...");
    window.open(url, "_blank");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      scrollToTop();
    }
  };

  // Escape key dismiss for modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModal(null);
      }
    };
    if (activeModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModal]);

  // Scroll-based expanding frame animation with footer pull-up reveal
  useEffect(() => {
    const container = containerRef.current;
    const frame = frameRef.current;
    if (!container || !frame) return;

    const ctx = gsap.context(() => {
      // Calculate responsive height of the logo to offset the footer starting position downwards
      let initialY = 170;
      if (window.innerWidth < 640) initialY = 110;
      else if (window.innerWidth < 768) initialY = 140;

      gsap.fromTo(
        frame,
        {
          maxWidth: "1320px",
          width: "calc(100% - 32px)",
          borderRadius: "28px",
          borderColor: "rgba(255, 255, 255, 0.12)",
          scale: 0.96,
          boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.9)",
          y: initialY, // Shifted down off-screen initially
        },
        {
          maxWidth: "100%",
          width: "100%",
          borderRadius: "0px",
          borderColor: "rgba(255, 255, 255, 0)",
          scale: 1,
          boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
          y: 0, // Fully visible at the bottom of the page
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top 90%",
            end: "bottom bottom",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#2C2C2C] flex flex-col items-center justify-end overflow-hidden pt-4 sm:pt-8 md:pt-16 pb-0"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-none border border-white/20 bg-black/90 px-4 py-2.5 font-mono text-xs text-white shadow-2xl backdrop-blur-md"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <footer
        ref={frameRef}
        style={{ willChange: "max-width, width, border-radius, transform" }}
        className="relative w-full max-w-[1320px] bg-[#0a0a0a] text-white font-inter-display select-none overflow-hidden border border-white/10 pt-8 sm:pt-12 md:pt-16 pb-6 sm:pb-8 transform-gpu"
      >
        <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 md:px-[60px] lg:px-[60px]">
          {/* Top 3-Column Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 pb-8 sm:pb-12">
            {/* Column 1: MENU */}
            <div className="flex flex-col">
              <h3 className="text-xs font-mono font-medium tracking-[0.25em] text-white/50 mb-4 sm:mb-6 uppercase flex items-center gap-2">
                <span>MENU</span>
                <span className="text-white/20">/</span>
              </h3>
              <ul className="space-y-3 font-mono text-xs text-white/90">
                {[
                  { label: "[ HOME ]", target: "hero" },
                  { label: "[ HOW IT WORKS ]", target: "how-it-works" },
                  { label: "[ RECENT WORKS ]", target: "recent-works" },
                  { label: "[ WHY US ]", target: "why-victory-adz" },
                  { label: "[ FAQ ]", target: "faq" },
                ].map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => scrollToSection(item.target)}
                      className="group relative flex items-center gap-2 hover:text-white transition-colors duration-200 tracking-wider text-left cursor-pointer focus:outline-none py-1 touch-manipulation"
                    >
                      <span className="transition-transform duration-200 group-hover:translate-x-1">
                        {item.label}
                      </span>
                      <span className="opacity-0 group-hover:opacity-100 text-white/40 text-[10px] transition-opacity">
                        &#8627;
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: ORDER */}
            <div className="flex flex-col">
              <h3 className="text-xs font-mono font-medium tracking-[0.25em] text-white/50 mb-4 sm:mb-6 uppercase flex items-center gap-2">
                <span>ORDER</span>
                <span className="text-white/20">/</span>
              </h3>
              <Button01
                variant="light"
                text="Order on WhatsApp"
                onClick={() => handleSocialClick("WhatsApp", "https://wa.me/919361312684?text=" + encodeURIComponent("Hi VictoryAdz! I'd like to get frame options & pricing for my photo."))}
                ariaLabel="Order on WhatsApp"
                className="w-full max-w-xs"
              />
              <p
                className="mt-4 font-inter-display text-[12px] sm:text-[13px] text-white/70 font-medium leading-relaxed max-w-xs"
                style={{ letterSpacing: "0.5px" }}
              >
                Send your photo on WhatsApp for custom sizing advice, frame options, and an instant price quote.
              </p>
            </div>

            {/* Column 3: SOCIALS */}
            <div className="flex flex-col">
              <h3 className="text-xs font-mono font-medium tracking-[0.25em] text-white/50 mb-4 sm:mb-6 uppercase flex items-center gap-2">
                <span>SOCIALS</span>
                <span className="text-white/20">/</span>
              </h3>
              <div className="flex items-center gap-3">
                {/* WhatsApp */}
                <motion.button
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSocialClick("WhatsApp", "https://wa.me/919361312684")}
                  aria-label="WhatsApp"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] bg-[#2d342d] border border-white/15 flex items-center justify-center text-white/90 hover:bg-[#394239] hover:text-white transition-all cursor-pointer rounded-none focus:outline-none touch-manipulation"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </motion.button>

                {/* Instagram */}
                <motion.button
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSocialClick("Instagram", "https://www.instagram.com/victory__adz/")}
                  aria-label="Instagram"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] bg-[#2d342d] border border-white/15 flex items-center justify-center text-white/90 hover:bg-[#394239] hover:text-white transition-all cursor-pointer rounded-none focus:outline-none touch-manipulation"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>



          {/* Bottom Sub-footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 font-mono text-[11px] text-white/50 tracking-wider gap-4">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveModal("privacy")}
                className="hover:text-white transition-colors duration-200 uppercase focus:outline-none cursor-pointer py-2.5 min-h-[44px] flex items-center touch-manipulation focus-visible:text-white focus-visible:underline"
              >
                PRIVACY POLICY
              </button>
              <button
                onClick={() => setActiveModal("support")}
                className="hover:text-white transition-colors duration-200 uppercase focus:outline-none cursor-pointer py-2.5 min-h-[44px] flex items-center touch-manipulation focus-visible:text-white focus-visible:underline"
              >
                SUPPORT
              </button>
            </div>

            <div className="flex items-center gap-6">
              <p className="uppercase text-center sm:text-right">
                &copy; 2026 VICTORYADZ. ALL RIGHTS RESERVED.
              </p>

              {/* Back-to-Top Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToTop}
                title="Scroll to top"
                className="hidden sm:flex items-center gap-1.5 rounded-none border border-white/20 bg-white/10 px-3 py-1 text-white/80 hover:bg-white hover:text-black transition-all cursor-pointer focus:outline-none"
              >
                <span>TOP</span>
                <span>&uarr;</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Massive VICTORYADZ Logo - Viewport-width and bottom-cropped */}
        <div className="w-full h-[300px] sm:h-[340px] md:h-[380px] relative mt-8 sm:mt-12 pointer-events-auto select-none">
          <div className="absolute top-0 left-0 right-0 h-[220px] sm:h-[280px] md:h-[340px]">
            <WarpText
              text="VICTORYADZ"
              color="#ffffff"
              warpStrength={0.09}
              warpScale={1.2}
              speed={0.45}
              pointerInfluence={0.3}
              pointerStrength={0.4}
              refraction={0.015}
              ripple={true}
              fontSize="clamp(4.5rem, 18vw, 18rem)"
              fontWeight={900}
              fontFamily="var(--font-inter-display), system-ui, sans-serif"
              style={{ height: '100%' }}
            />
          </div>
        </div>

        {/* Privacy Policy & Support Modals */}
        <AnimatePresence>
          {activeModal && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="footer-modal-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg bg-[#181818] border border-white/20 p-6 md:p-8 font-mono text-white shadow-2xl"
              >
                <div className="flex items-center justify-between pb-4 mb-4">
                  <h4 id="footer-modal-title" className="text-sm font-bold tracking-widest uppercase text-emerald-400">
                    VICTORYADZ &middot; {activeModal === "privacy" ? "PRIVACY POLICY" : "SUPPORT & HELP"}
                  </h4>
                  <button
                    onClick={() => setActiveModal(null)}
                    aria-label="Close dialog"
                    className="text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    &#10005;
                  </button>
                </div>

                {activeModal === "privacy" ? (
                  <div className="space-y-3 text-xs text-white/70 leading-relaxed">
                    <p>We respect your privacy. VictoryAdz collects minimal analytical data strictly to optimize your experience.</p>
                    <p>No personal identification or telemetry is sold or distributed to third parties.</p>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs text-white/70 leading-relaxed">
                    <p>Need assistance with your frame order, delivery tracking, or material details?</p>
                    <p>WhatsApp: <a href="https://wa.me/919361312684" className="text-emerald-400 underline">+91 93613 12684</a></p>
                  </div>
                )}

                <button
                  onClick={() => setActiveModal(null)}
                  aria-label="Close dialog"
                  className="mt-6 w-full bg-white text-black py-2.5 text-xs font-semibold tracking-widest uppercase hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  CLOSE
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
    </div>
  );
};
