"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<"privacy" | "support" | null>(null);

  // Live Clocks for Headquarters
  const [barcelonaTime, setBarcelonaTime] = useState<string>("");
  const [wyomingTime, setWyomingTime] = useState<string>("");

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();

      const bcn = now.toLocaleTimeString("en-US", {
        timeZone: "Europe/Madrid",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      const wyo = now.toLocaleTimeString("en-US", {
        timeZone: "America/Denver",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      setBarcelonaTime(bcn);
      setWyomingTime(wyo);
    };

    updateClocks();
    const timer = setInterval(updateClocks, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      triggerToast("✓ Subscribed to VictoryAdz insights!");
      setTimeout(() => setStatus("idle"), 4000);
    }, 800);
  };

  const handleSocialClick = (platform: string, url: string) => {
    triggerToast(`Opening VictoryAdz ${platform}...`);
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

  return (
    <footer className="relative w-full bg-[#0a0a0a] text-white font-inter-display select-none overflow-hidden pt-16 pb-8">
      {/* Interactive Toast Notification */}
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

      <div className="w-full px-6 md:px-[60px] lg:px-[60px]">
        {/* Top 4-Column Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12">
          {/* Column 1: MENU/ */}
          <div className="flex flex-col">
            <h3 className="text-xs font-mono font-medium tracking-[0.25em] text-white/50 mb-6 uppercase flex items-center gap-2">
              <span>MENU</span>
              <span className="text-white/20">/</span>
            </h3>
            <ul className="space-y-3 font-mono text-xs text-white/90">
              {[
                { label: "[ WORK ]", target: "explore-all" },
                { label: "[ STUDIO ]", target: "studio" },
                { label: "[ JOURNAL ]", target: "journal" },
                { label: "[ CONTACT ]", target: "contact" },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => scrollToSection(item.target)}
                    className="group relative flex items-center gap-2 hover:text-white transition-colors duration-200 tracking-wider text-left cursor-pointer focus:outline-none"
                  >
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      {item.label}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 text-white/40 text-[10px] transition-opacity">
                      ↳
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: HEADQUARTERS/ */}
          <div className="flex flex-col">
            <h3 className="text-xs font-mono font-medium tracking-[0.25em] text-white/50 mb-6 uppercase flex items-center gap-2">
              <span>HEADQUARTERS</span>
              <span className="text-white/20">/</span>
            </h3>
            <div className="font-mono text-xs text-white/80 space-y-4 leading-relaxed tracking-wider">
              {/* Barcelona */}
              <div className="group cursor-pointer p-2 -ml-2 rounded hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between text-white/90">
                  <span className="font-semibold">Barcelona, Spain</span>
                  <span className="text-[10px] font-mono text-emerald-400/90 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5">
                    {barcelonaTime || "15:15:00"} CET
                  </span>
                </div>
                <p className="text-[11px] text-white/40 group-hover:text-white/60 transition-colors">
                  Carrer de Pere IV, 29 · 08018
                </p>
              </div>

              {/* Wyoming */}
              <div className="group cursor-pointer p-2 -ml-2 rounded hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between text-white/90">
                  <span className="font-semibold">Wyoming USA.</span>
                  <span className="text-[10px] font-mono text-amber-400/90 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.5">
                    {wyomingTime || "07:15:00"} MST
                  </span>
                </div>
                <p className="text-[11px] text-white/40 group-hover:text-white/60 transition-colors">
                  30 N Gould St · Sheridan, WY
                </p>
              </div>
            </div>
          </div>

          {/* Column 3: NEWSLETTER/ */}
          <div className="flex flex-col">
            <h3 className="text-xs font-mono font-medium tracking-[0.25em] text-white/50 mb-6 uppercase flex items-center gap-2">
              <span>NEWSLETTER</span>
              <span className="text-white/20">/</span>
            </h3>
            <form onSubmit={handleSubscribe} className="flex items-center w-full max-w-xs mb-4">
              <input
                type="email"
                placeholder="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#141614] border border-white/15 px-3.5 py-2 text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-white/50 flex-1 rounded-none tracking-wider transition-colors"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                aria-label="Submit Newsletter"
                className="bg-[#2d342d] border border-l-0 border-white/15 px-3.5 py-2 text-white/90 hover:bg-[#394239] transition-all rounded-none flex items-center justify-center shrink-0 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {status === "loading" ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <svg
                    className="w-3.5 h-3.5 fill-current transform rotate-45"
                    viewBox="0 0 24 24"
                  >
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                )}
              </button>
            </form>

            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-mono text-[11px] text-emerald-400 font-medium tracking-wider"
                >
                  ✓ Subscribed! Check your inbox for updates.
                </motion.p>
              ) : (
                <p className="font-mono text-[11px] text-white/50 leading-relaxed max-w-xs tracking-wider">
                  Receive occasional insights on brand identity and taste.
                </p>
              )}
            </AnimatePresence>
          </div>

          {/* Column 4: SOCIALS/ */}
          <div className="flex flex-col">
            <h3 className="text-xs font-mono font-medium tracking-[0.25em] text-white/50 mb-6 uppercase flex items-center gap-2">
              <span>SOCIALS</span>
              <span className="text-white/20">/</span>
            </h3>
            <div className="flex items-center gap-3">
              {/* X / Twitter */}
              <motion.button
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialClick("Twitter (X)", "https://x.com")}
                aria-label="X Twitter"
                className="w-10 h-10 bg-[#2d342d] border border-white/15 flex items-center justify-center text-white/90 hover:bg-[#394239] hover:text-white transition-all cursor-pointer rounded-none focus:outline-none"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </motion.button>

              {/* LinkedIn */}
              <motion.button
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialClick("LinkedIn", "https://linkedin.com")}
                aria-label="LinkedIn"
                className="w-10 h-10 bg-[#2d342d] border border-white/15 flex items-center justify-center text-white/90 hover:bg-[#394239] hover:text-white transition-all cursor-pointer rounded-none focus:outline-none"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.72a1.47 1.47 0 1 0 0 2.94 1.47 1.47 0 0 0 0-2.94z" />
                </svg>
              </motion.button>

              {/* Instagram */}
              <motion.button
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialClick("Instagram", "https://instagram.com")}
                aria-label="Instagram"
                className="w-10 h-10 bg-[#2d342d] border border-white/15 flex items-center justify-center text-white/90 hover:bg-[#394239] hover:text-white transition-all cursor-pointer rounded-none focus:outline-none"
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

        {/* Massive Interactive VICTORYADZ Graphic Logo Section */}
        <div className="group relative w-full my-8 md:my-14 select-none cursor-pointer overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <svg
              className="w-full h-auto text-white fill-current transition-all duration-500 group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]"
              viewBox="0 0 1320 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                x="50%"
                y="155"
                textAnchor="middle"
                className="fill-white font-extrabold tracking-tighter"
                style={{ fontSize: "165px", fontFamily: "var(--font-inter-display), system-ui, sans-serif" }}
              >
                VICTORYADZ
              </text>
            </svg>
          </motion.div>
        </div>

        {/* Bottom Sub-footer & Interactive Tools */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 font-mono text-[11px] text-white/50 tracking-wider gap-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveModal("privacy")}
              className="hover:text-white transition-colors duration-200 uppercase focus:outline-none cursor-pointer"
            >
              PRIVACY POLICY
            </button>
            <button
              onClick={() => setActiveModal("support")}
              className="hover:text-white transition-colors duration-200 uppercase focus:outline-none cursor-pointer"
            >
              SUPPORT
            </button>
          </div>

          <div className="flex items-center gap-6">
            <p className="uppercase text-center sm:text-right">
              © 2026 VICTORYADZ LLC. ALL RIGHTS RESERVED.
            </p>

            {/* Interactive Back-to-Top Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              title="Scroll to top"
              className="hidden sm:flex items-center gap-1.5 rounded-none border border-white/20 bg-white/10 px-3 py-1 text-white/80 hover:bg-white hover:text-black transition-all cursor-pointer focus:outline-none"
            >
              <span>TOP</span>
              <span>↑</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Privacy Policy & Support Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
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
                <h4 className="text-sm font-bold tracking-widest uppercase text-emerald-400">
                  VICTORYADZ · {activeModal === "privacy" ? "PRIVACY POLICY" : "SUPPORT & HELP"}
                </h4>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {activeModal === "privacy" ? (
                <div className="space-y-3 text-xs text-white/70 leading-relaxed">
                  <p>We respect your privacy. VictoryAdz collects minimal analytical data strictly to optimize interactive experiences.</p>
                  <p>No personal identification or telemetry is sold or distributed to third parties.</p>
                </div>
              ) : (
                <div className="space-y-3 text-xs text-white/70 leading-relaxed">
                  <p>Need assistance or have inquiries regarding custom brand design pipelines?</p>
                  <p>Direct Email: <a href="mailto:support@victoryadz.com" className="text-emerald-400 underline">support@victoryadz.com</a></p>
                  <p>Response SLA: Within 24 business hours.</p>
                </div>
              )}

              <button
                onClick={() => setActiveModal(null)}
                className="mt-6 w-full bg-white text-black py-2.5 text-xs font-semibold tracking-widest uppercase hover:bg-neutral-200 transition-colors"
              >
                CLOSE
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};
