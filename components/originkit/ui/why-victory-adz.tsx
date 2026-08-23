"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button01 } from "@/components/ui/nextjsshop-button";
import MaskTextReveal from "@/components/originkit/ui/mask-text-reveal";
import ScrollHighlight from "@/components/originkit/ui/scroll-text-highlight";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface WhyPillar {
  id: string;
  number: string;
  shortTitle: string;
  title: string;
  badge: string;
  description: string;
  highlights: string[];
  image: string;
  accentColor: string;
  iconType: "inks" | "armor" | "chat" | "joinery" | "ai" | "direct";
}

export const WHY_PILLARS: WhyPillar[] = [
  {
    id: "pillar-1",
    number: "01",
    shortTitle: "Quality Materials",
    title: "Quality Materials",
    badge: "BUILT TO LAST",
    description:
      "We never compromise on frame material — every piece is built to last, not just look good on day one.",
    highlights: ["Premium Core Materials", "Moisture Resistant", "Long-Lasting Craftsmanship"],
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&q=85",
    accentColor: "#0A84FF",
    iconType: "inks",
  },
  {
    id: "pillar-2",
    number: "02",
    shortTitle: "Multiple Finishes",
    title: "Multiple Lamination Finishes",
    badge: "CUSTOM FINISH",
    description:
      "From matte to glossy to textured — choose the finish that protects and elevates your photo the way you want.",
    highlights: ["Matte Lamination", "Glossy Finish", "Textured Protection"],
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=85",
    accentColor: "#FF453A",
    iconType: "armor",
  },
  {
    id: "pillar-3",
    number: "03",
    shortTitle: "8+ Years Craft",
    title: "8+ Years of Experience",
    badge: "TRUSTED EXPERTISE",
    description:
      "We've been perfecting this craft since day one — every frame reflects years of precision and care.",
    highlights: ["8+ Years In Business", "Proven Handcrafting", "Family Trusted"],
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=85",
    accentColor: "#30D158",
    iconType: "chat",
  },
  {
    id: "pillar-4",
    number: "04",
    shortTitle: "Honest Pricing",
    title: "Reasonable, Honest Pricing",
    badge: "FAIR VALUE",
    description:
      "High quality shouldn't mean high prices. We keep it fair, without cutting corners.",
    highlights: ["Transparent Rates", "No Hidden Charges", "Studio Direct Value"],
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=1200&q=85",
    accentColor: "#BF5AF2",
    iconType: "joinery",
  },
  {
    id: "pillar-5",
    number: "05",
    shortTitle: "Personal Guidance",
    title: "Personally Guided Orders",
    badge: "1-ON-1 WHATSAPP",
    description:
      "No confusing checkout — you talk to us directly on WhatsApp, and we help you pick exactly what's right.",
    highlights: ["Direct Consultation", "Frame & Finish Help", "Proportion Guidance"],
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&q=85",
    accentColor: "#FF9F0A",
    iconType: "ai",
  },
  {
    id: "pillar-6",
    number: "06",
    shortTitle: "Safe Delivery",
    title: "Delivered Safely, Anywhere",
    badge: "TRACKED SHIPPING",
    description:
      "Every frame is carefully packed and shipped, with WhatsApp updates so you always know where your order is.",
    highlights: ["Shockproof Packaging", "WhatsApp Updates", "Safe Doorstep Transit"],
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&q=85",
    accentColor: "#64D2FF",
    iconType: "direct",
  },
];

const renderPillarIcon = (type: WhyPillar["iconType"]) => {
  switch (type) {
    case "inks":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      );
    case "armor":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      );
    case "joinery":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      );
    case "ai":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      );
    case "direct":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
  }
};

export const WhyVictoryAdz: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  const handleWhatsAppOrder = () => {
    window.open(
      "https://wa.me/919361312684?text=" +
        encodeURIComponent("Hi VictoryAdz! I'd like to get frame options and pricing for my photo."),
      "_blank"
    );
  };

  const scrollToPillar = useCallback((index: number) => {
    const el = cardRefs.current[index];
    if (!el) return;

    if (typeof window !== "undefined" && (window as any).lenis) {
      (window as any).lenis.scrollTo(el, { offset: -100, duration: 1.0 });
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setActiveIdx(index);
  }, []);

  // GSAP ScrollTrigger Synchronization: detect which card is centered in viewport
  useEffect(() => {
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, idx) => {
        if (!card) return;

        ScrollTrigger.create({
          trigger: card,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => setActiveIdx(idx),
          onEnterBack: () => setActiveIdx(idx),
        });
      });
    }, sectionRef);

    const timer = setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  const activePillar = WHY_PILLARS[activeIdx];

  return (
    <section
      id="why-victory-adz"
      ref={sectionRef}
      className="relative z-20 w-full bg-[#1A1A1A] text-white font-inter-display select-none py-12 sm:py-16 lg:py-28 overflow-hidden border-t border-white/5"
      style={{ fontFamily: "'Inter Display', system-ui, -apple-system, sans-serif" }}
    >
      {/* Ambient background glow matching active pillar */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] opacity-15 transition-colors duration-1000 -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: activePillar.accentColor }}
      />

      <div className="relative w-full max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* ── TOP SECTION HEADER ── */}
        <div className="w-full flex flex-col items-start gap-4 pb-8 sm:pb-12 border-b border-white/10">
          <div className="w-full flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <h2>
              <span className="block font-cal-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-normal text-white leading-[1.05]">
                Why Choose VictoryAdz
              </span>
              <span className="block font-great-vibes text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-white pt-1 -mt-1 leading-[1.05]">
                8 years of craftsmanship
              </span>
            </h2>

            <p
              className="text-sm sm:text-base text-[#DCDCDC] font-inter-display font-medium max-w-md leading-relaxed"
              style={{ letterSpacing: "0.5px" }}
            >
              Built on quality and trust, not shortcuts.
            </p>
          </div>
        </div>

        {/* ── MOBILE HORIZONTAL PILL TABS (Visible on < lg) ── */}
        <div className="lg:hidden sticky top-14 z-30 -mx-4 px-4 py-3 bg-[#1A1A1A]/95 backdrop-blur-xl border-b border-white/10 overflow-x-auto scrollbar-none flex gap-2 snap-x">
          {WHY_PILLARS.map((p, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={p.id}
                onClick={() => scrollToPillar(idx)}
                className={`shrink-0 px-4 py-2 rounded-none text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer touch-manipulation snap-start ${
                  isActive
                    ? "bg-white text-black shadow-lg shadow-white/10"
                    : "bg-white/10 text-white/70 hover:bg-white/15"
                }`}
              >
                <span className={`font-mono text-[10px] ${isActive ? "text-black/60" : "text-white/40"}`}>
                  {p.number}
                </span>
                <span>{p.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* ── MAIN SPLIT-SCREEN LAYOUT (≥ lg) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 pt-8 sm:pt-12">
          
          {/* ── LEFT COLUMN: STICKY INTERACTIVE FEATURE NAVIGATOR (5 Columns) ── */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between sticky top-28 h-[calc(100vh-8.5rem)] pb-4 select-none">
            <div className="flex flex-col gap-6">
              
              {/* Feature Navigator List */}
              <div className="flex flex-col gap-2 relative">
                {/* Vertical active tracking indicator rail */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/10" />
                <div
                  className="absolute left-0 w-[2px] transition-all duration-500 ease-out"
                  style={{
                    height: `${100 / WHY_PILLARS.length}%`,
                    top: `${(activeIdx * 100) / WHY_PILLARS.length}%`,
                    backgroundColor: activePillar.accentColor,
                    boxShadow: `0 0 12px ${activePillar.accentColor}`,
                  }}
                />

                {WHY_PILLARS.map((pillar, idx) => {
                  const isActive = activeIdx === idx;
                  return (
                    <button
                      key={pillar.id}
                      onClick={() => scrollToPillar(idx)}
                      className={`group relative flex items-start gap-4 text-left pl-6 pr-4 py-3.5 rounded-none transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "bg-white/10 backdrop-blur-md border border-white/15"
                          : "hover:bg-white/5 opacity-60 hover:opacity-90"
                      }`}
                    >
                      <span
                        className="font-mono text-sm font-bold tracking-tight shrink-0 transition-colors duration-300 pt-0.5"
                        style={{ color: isActive ? pillar.accentColor : "rgba(255,255,255,0.4)" }}
                      >
                        {pillar.number}
                      </span>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-base font-bold tracking-tight transition-colors duration-300 ${
                            isActive ? "text-white" : "text-white/80"
                          }`}>
                            {pillar.title}
                          </span>
                        </div>

                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-xs text-white/70 font-light leading-relaxed pr-2 pt-1"
                          >
                            {pillar.description}
                          </motion.p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Left Bottom WhatsApp Trigger */}
            <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
              <p
                className="text-[13px] text-white/70 font-inter-display font-medium leading-relaxed"
                style={{ letterSpacing: "0.5px" }}
              >
                Message us to discuss sizing, frames, and delivery details.
              </p>
              <Button01
                text="ORDER NOW"
                onClick={handleWhatsAppOrder}
                ariaLabel="Order Now"
                className="w-full"
              />
            </div>
          </div>

          {/* ── RIGHT COLUMN: CINEMATIC CRAFTSMANSHIP SHOWCASE CARDS (7 Columns) ── */}
          <div className="lg:col-span-7 flex flex-col gap-8 sm:gap-14 lg:gap-20">
            {WHY_PILLARS.map((pillar, idx) => {
              const isActive = activeIdx === idx;

              return (
                <div
                  key={pillar.id}
                  ref={(el) => { cardRefs.current[idx] = el; }}
                  className={`group relative w-full rounded-none overflow-hidden bg-[#242424] border transition-all duration-500 shadow-2xl ${
                    isActive
                      ? "border-white/30 ring-1 ring-white/20 shadow-black/80"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Card Visual Hero Zone */}
                  <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-black">
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      loading="lazy"
                      className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    />

                    {/* Gradient Depth Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#242424] via-[#242424]/30 to-black/40" />

                    {/* Top Floating Badge & Icon */}
                    <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-10">
                      <span
                        className="text-[11px] sm:text-xs font-mono font-bold tracking-widest px-3.5 py-1.5 rounded-none uppercase backdrop-blur-md border"
                        style={{
                          backgroundColor: "rgba(0,0,0,0.6)",
                          borderColor: pillar.accentColor,
                          color: pillar.accentColor,
                        }}
                      >
                        {pillar.badge}
                      </span>

                      <div
                        className="w-10 h-10 rounded-none flex items-center justify-center backdrop-blur-md border border-white/20 text-white shadow-lg"
                        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                      >
                        {renderPillarIcon(pillar.iconType)}
                      </div>
                    </div>

                    {/* Giant Ghost Number Watermark */}
                    <span className="absolute bottom-2 right-4 sm:right-6 text-7xl sm:text-9xl font-extrabold font-mono text-white/5 pointer-events-none select-none leading-none">
                      {pillar.number}
                    </span>
                  </div>

                  {/* Card Content Zone */}
                  <div className="p-6 sm:p-8 lg:p-10 flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-mono text-white/50 uppercase tracking-widest">
                        PHASE {pillar.number}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                        {pillar.title}
                      </h3>
                    </div>

                    <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed">
                      {pillar.description}
                    </p>

                    {/* Highlights Feature Pills */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                      {pillar.highlights.map((h) => (
                        <span
                          key={h}
                          className="text-[11px] sm:text-xs font-medium text-white/90 bg-white/10 border border-white/15 px-3 py-1.5 rounded-none flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ── MOBILE BOTTOM CALL TO ACTION (Visible on < lg) ── */}
        <div className="lg:hidden mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
          <p
            className="text-xs xs:text-[13px] text-white/70 text-center font-inter-display font-medium leading-relaxed"
            style={{ letterSpacing: "0.5px" }}
          >
            Message us to discuss sizing, frames, and delivery details.
          </p>
          <Button01
            text="ORDER NOW"
            onClick={handleWhatsAppOrder}
            ariaLabel="Order Now"
            className="w-full"
          />
        </div>

      </div>
    </section>
  );
};
