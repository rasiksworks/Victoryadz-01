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
          {/* Top 3-Column Section (Menu & Socials horizontally aligned on mobile) */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 pb-8 sm:pb-12">
            {/* Column 1: MENU */}
            <div className="flex flex-col col-span-1">
              <h3 className="text-xs font-mono font-medium tracking-[0.25em] text-white/50 mb-3 sm:mb-6 uppercase flex items-center gap-2">
                <span>MENU</span>
                <span className="text-white/20">/</span>
              </h3>
              <ul className="space-y-2.5 sm:space-y-3 font-mono text-xs text-white/90">
                {[
                  { label: "Home", target: "hero" },
                  { label: "How It Works", target: "how-it-works" },
                  { label: "Recent Works", target: "recent-works" },
                  { label: "Why Us", target: "why-victory-adz" },
                  { label: "FAQ", target: "faq" },
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

            {/* Column 2: SOCIALS (Horizontally aligned with Menu on mobile) */}
            <div className="flex flex-col col-span-1 lg:order-last">
              <h3 className="text-xs font-mono font-medium tracking-[0.25em] text-white/50 mb-3 sm:mb-6 uppercase flex items-center gap-2">
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
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.13-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43l-.48-.01c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.43 1.03 2.6.13.17 1.77 2.71 4.3 3.8.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z" />
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
                  <svg className="w-5 h-5 text-white fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Column 3: ORDER */}
            <div className="flex flex-col col-span-2 lg:col-span-1 mt-3 lg:mt-0">
              <h3 className="text-xs font-mono font-medium tracking-[0.25em] text-white/50 mb-3 sm:mb-6 uppercase flex items-center gap-2">
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
                className="mt-3.5 font-inter-display text-[12px] sm:text-[13px] text-white/70 font-medium leading-relaxed max-w-xs"
                style={{ letterSpacing: "0.5px" }}
              >
                Message us to discuss sizing, frames, and delivery details.
              </p>
            </div>
          </div>
        </div>

        {/* Massive VICTORYADZ Logo - Viewport-width */}
        <div className="w-full h-[120px] xs:h-[160px] sm:h-[220px] md:h-[280px] lg:h-[320px] relative mt-4 sm:mt-8 pointer-events-auto select-none overflow-hidden flex items-center justify-center">
          {/* Mobile & Tablet Brand Name Display (Guaranteed 100% visible on all phones) */}
          <span className="block md:hidden font-sans font-black text-[clamp(2.4rem,13vw,6.5rem)] tracking-[-0.04em] text-white text-center leading-none select-none uppercase pointer-events-none px-2">
            VICTORYADZ
          </span>

          {/* Desktop WebGL WarpText */}
          <div className="hidden md:block absolute top-0 left-0 right-0 h-full">
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

        {/* Bottom Sub-footer (Positioned below the VICTORYADZ name) */}
        <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 md:px-[60px] lg:px-[60px] border-t border-white/10 pt-4 sm:pt-6 z-10 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between font-mono text-[11px] text-white/50 tracking-wider gap-4">
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
                className="hidden sm:flex items-center gap-1.5 rounded-none border border-white/20 bg-transparent px-3 py-1 text-white/80 hover:bg-white hover:text-black transition-all cursor-pointer focus:outline-none"
              >
                <span>TOP</span>
                <span>&uarr;</span>
              </motion.button>
            </div>
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
