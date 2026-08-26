"use client";

import React, { useRef, useEffect, useState, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ShieldCheck,
  Layers,
  Award,
  BadgePercent,
  MessageSquare,
  Truck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface WhyReason {
  id: string;
  number: string;
  title: string;
  content: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const WHY_REASONS: WhyReason[] = [
  {
    id: "reason-1",
    number: "01",
    title: "Archival Durability",
    content:
      "We never compromise on frame material. Every piece is built to last with moisture-resistant core boards and museum-grade archival durability.",
    icon: ShieldCheck,
  },
  {
    id: "r2",
    number: "02",
    title: "Surface Finish Choices",
    content:
      "From glare-free matte to crystal glossy and tactile textured finishes, select the exact style that protects and elevates your artwork.",
    icon: Layers,
  },
  {
    id: "r3",
    number: "03",
    title: "8+ Years of Craftsmanship",
    content:
      "We've been perfecting this craft since day one. Every frame reflects years of precision, handcrafting, and family-trusted care.",
    icon: Award,
  },
  {
    id: "reason-4",
    number: "04",
    title: "Honest Pricing",
    content:
      "Studio-direct craftsmanship without retail markups. Fair, transparent pricing with no hidden fees or quality compromises.",
    icon: BadgePercent,
  },
  {
    id: "reason-5",
    number: "05",
    title: "Personal Guidance",
    content:
      "1-on-1 direct consultation on WhatsApp to help you pick perfect frame sizes, mouldings, and custom photo layouts.",
    icon: MessageSquare,
  },
  {
    id: "reason-6",
    number: "06",
    title: "Safe Delivery",
    content:
      "Every frame is shockproof packed and delivered safely anywhere across India with real-time WhatsApp dispatch updates.",
    icon: Truck,
  },
];

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div
    aria-hidden
    className="relative mx-auto size-32 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
  >
    <div className="absolute inset-0 [--border:rgba(255,255,255,0.2)] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />
    <div className="bg-[#1e1e1e] text-amber-400 absolute inset-0 m-auto flex size-12 items-center justify-center border border-white/20 rounded-xl shadow-lg">
      {children}
    </div>
  </div>
);

export const WhyVictoryAdz: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackWrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const cardTextRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardLineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardPlusRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeMobileIdx, setActiveMobileIdx] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const trackWrapper = trackWrapperRef.current;
    const track = trackRef.current;
    if (!section || !trackWrapper || !track) return;

    const mm = gsap.matchMedia();

    // ── DESKTOP (>= lg / >= 1024px): Full Cinematic GSAP Pin & Scrub ──
    mm.add("(min-width: 1024px)", () => {
      gsap.set(track, { x: 0 });
      cardTextRefs.current.forEach((el, i) => {
        if (el) gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 14 });
      });
      cardLineRefs.current.forEach((el) => {
        if (el) gsap.set(el, { width: "0%" });
      });
      cardPlusRefs.current.forEach((el, i) => {
        if (el) gsap.set(el, { opacity: i === 0 ? 1 : 0, left: "0%", rotation: 0 });
      });

      const numCards = WHY_REASONS.length;
      const stepDuration = 1.0;
      const snapIncrement = 1 / (numCards - 1);

      const getTrackOffset = (idx: number) => {
        const cards = track.querySelectorAll(".why-card");
        if (!cards || cards.length === 0) return 0;
        const firstCard = cards[0] as HTMLElement;
        const cardWidth = firstCard.offsetWidth;
        const wrapperWidth = trackWrapper.clientWidth;
        const visibleCount = Math.max(1, Math.floor(wrapperWidth / cardWidth));
        const shiftCards = Math.max(0, idx - visibleCount + 1);
        const maxScroll = Math.max(0, track.scrollWidth - wrapperWidth);
        return Math.min(maxScroll, shiftCards * cardWidth);
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          pinSpacing: true,
          start: "top top",
          end: "+=2800",
          scrub: 0.45,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: (progress) => Math.round(progress / snapIncrement) * snapIncrement,
            duration: { min: 0.2, max: 0.4 },
            delay: 0.08,
            ease: "power2.out",
          },
        },
      });

      WHY_REASONS.forEach((_, idx) => {
        const textEl = cardTextRefs.current[idx];
        const lineEl = cardLineRefs.current[idx];
        const plusEl = cardPlusRefs.current[idx];
        const stepStart = idx * stepDuration;

        if (idx > 0) {
          tl.to(
            track,
            {
              x: () => -getTrackOffset(idx),
              ease: "power2.inOut",
              duration: stepDuration * 0.45,
            },
            stepStart
          );

          if (textEl) {
            tl.fromTo(
              textEl,
              { opacity: 0, y: 14 },
              { opacity: 1, y: 0, duration: stepDuration * 0.35, ease: "power1.out" },
              stepStart + 0.12
            );
          }
        }

        if (lineEl && plusEl) {
          const animStart = idx === 0 ? 0.02 : stepStart + 0.18;

          tl.fromTo(
            plusEl,
            { opacity: 0, left: "0%", rotation: 0 },
            { opacity: 1, duration: 0.08, ease: "power1.out" },
            animStart
          );

          tl.to(
            plusEl,
            {
              left: "100%",
              rotation: 360,
              ease: "none",
              duration: stepDuration * 0.7,
            },
            animStart + 0.05
          );

          tl.fromTo(
            lineEl,
            { width: "0%" },
            {
              width: "100%",
              ease: "none",
              duration: stepDuration * 0.7,
            },
            animStart + 0.05
          );

          tl.to(
            plusEl,
            {
              rotation: 360,
              scale: 1,
              duration: 0.08,
              ease: "power1.out",
            },
            animStart + stepDuration * 0.75
          );

          if (idx < numCards - 1) {
            tl.to(
              plusEl,
              {
                opacity: 0,
                duration: 0.1,
                ease: "power1.out",
              },
              stepStart + stepDuration * 0.95
            );
          }
        }
      });
    });

    // ── MOBILE & TABLET (< 1024px): Natural Horizontal Stack ──
    mm.add("(max-width: 1023px)", () => {
      gsap.set(track, { clearProps: "all" });
      cardTextRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 1, y: 0 });
      });
      cardLineRefs.current.forEach((el) => {
        if (el) gsap.set(el, { width: "100%" });
      });
      cardPlusRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 1, left: "100%", rotation: 0 });
      });
    });

    const refreshTrigger = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", refreshTrigger);
    const timer = setTimeout(refreshTrigger, 400);

    return () => {
      window.removeEventListener("resize", refreshTrigger);
      clearTimeout(timer);
      mm.revert();
    };
  }, []);

  const handleMobileScroll = () => {
    const el = mobileScrollRef.current;
    if (!el) return;
    const card = el.querySelector(".mobile-feature-card") as HTMLElement;
    if (!card) return;
    const cardWidth = card.offsetWidth;
    const gap = 16;
    const idx = Math.round(el.scrollLeft / (cardWidth + gap));
    setActiveMobileIdx(Math.max(0, Math.min(WHY_REASONS.length - 1, idx)));
  };

  const scrollMobilePrev = () => {
    const el = mobileScrollRef.current;
    if (!el) return;
    const card = el.querySelector(".mobile-feature-card") as HTMLElement;
    const cardWidth = card ? card.offsetWidth : 300;
    el.scrollBy({ left: -(cardWidth + 16), behavior: "smooth" });
  };

  const scrollMobileNext = () => {
    const el = mobileScrollRef.current;
    if (!el) return;
    const card = el.querySelector(".mobile-feature-card") as HTMLElement;
    const cardWidth = card ? card.offsetWidth : 300;
    el.scrollBy({ left: cardWidth + 16, behavior: "smooth" });
  };

  const scrollToMobileIdx = (idx: number) => {
    const el = mobileScrollRef.current;
    if (!el) return;
    const card = el.querySelector(".mobile-feature-card") as HTMLElement;
    const cardWidth = card ? card.offsetWidth : 300;
    el.scrollTo({ left: idx * (cardWidth + 16), behavior: "smooth" });
    setActiveMobileIdx(idx);
  };

  return (
    <section
      id="why-victory-adz"
      ref={sectionRef}
      className="relative z-10 w-full lg:h-screen lg:min-h-screen bg-[#141414] text-white font-inter-display select-none flex flex-col justify-between py-12 sm:py-14 md:py-16 lg:py-20 overflow-hidden border-t border-white/5"
      style={{ backgroundColor: "#141414" }}
    >
      <div className="relative w-full max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col justify-between h-full flex-1">
        {/* ── SECTION HEADER ── */}
        <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 sm:pt-4">
          <h2 className="flex flex-col items-start">
            <span
              className="font-cal-sans text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold text-white/90 leading-[1.08]"
              style={{ letterSpacing: "0.5px" }}
            >
              Why Choose VictoryAdz
            </span>
            <span className="font-great-vibes text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-normal text-white pt-1 -mt-1 leading-[1.08]">
              8 years of craftsmanship
            </span>
          </h2>

          {/* Mobile & Tablet Arrow Controls */}
          <div className="flex lg:hidden items-center gap-2 self-end sm:self-auto">
            <button
              onClick={scrollMobilePrev}
              disabled={activeMobileIdx === 0}
              aria-label="Previous card"
              className="w-9 h-9 rounded-full border border-white/20 bg-white/5 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={scrollMobileNext}
              disabled={activeMobileIdx === WHY_REASONS.length - 1}
              aria-label="Next card"
              className="w-9 h-9 rounded-full border border-white/20 bg-white/5 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* ── 1. DESKTOP STEPPING TRACK (>= lg) ── */}
        <div
          ref={trackWrapperRef}
          className="hidden lg:block w-full overflow-x-hidden overflow-y-visible pb-6 sm:pb-10 pt-4 -mx-4 sm:-mx-8 lg:-mx-12 px-4 sm:px-8 lg:px-12"
        >
          <div
            ref={trackRef}
            className="flex flex-col w-max will-change-transform overflow-visible"
          >
            <div className="flex flex-row flex-nowrap items-stretch overflow-visible pr-8 sm:pr-12">
              {WHY_REASONS.map((reason, index) => (
                <div
                  key={reason.id}
                  className="why-card flex flex-col justify-between md:w-[460px] lg:w-[400px] xl:w-[420px] md:h-[280px] lg:h-[300px] shrink-0 select-none overflow-visible pr-6 sm:pr-10 lg:pr-12"
                >
                  <div
                    ref={(el) => {
                      cardTextRefs.current[index] = el;
                    }}
                    className="flex flex-col opacity-0 will-change-[opacity,transform]"
                  >
                    <span className="font-mono text-xs text-white/50 tracking-[0.2em] uppercase font-medium mb-2.5 sm:mb-4">
                      REASON - {reason.number}
                    </span>

                    <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-white tracking-tight leading-snug mb-2.5 sm:mb-4">
                      {reason.title}
                    </h3>

                    <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed max-w-xl">
                      {reason.content}
                    </p>
                  </div>

                  <div className="relative w-full py-6 mt-auto select-none overflow-visible">
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[1.5px] bg-white/20" />

                    <div
                      ref={(el) => {
                        cardLineRefs.current[index] = el;
                      }}
                      className="absolute top-1/2 -translate-y-1/2 left-0 h-[1.5px] bg-white/50 will-change-[width] z-10"
                      style={{ width: "0%" }}
                    />

                    <div
                      ref={(el) => {
                        cardPlusRefs.current[index] = el;
                      }}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center pointer-events-none opacity-0 will-change-[left,transform,opacity] z-20"
                      style={{ left: "0%" }}
                    >
                      <span className="text-white font-mono text-base font-bold select-none leading-none flex items-center justify-center">
                        +
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 2. MOBILE & TABLET HORIZONTAL FEATURES-3 CARD STACK (< lg) ── */}
        <div className="block lg:hidden w-full pt-6 pb-2">
          <div className="w-full -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 overflow-visible">
            <div
              ref={mobileScrollRef}
              onScroll={handleMobileScroll}
              className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-3.5 xs:gap-4 sm:gap-6 pb-4 pt-1 pr-12 xs:pr-16 sm:pr-20 scrollbar-none"
              style={{
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {WHY_REASONS.map((reason) => {
                const IconComponent = reason.icon;
                return (
                  <Card
                    key={reason.id}
                    className="mobile-feature-card snap-start shrink-0 w-[78vw] xs:w-[300px] sm:w-[340px] md:w-[360px] bg-[#181818]/95 border-white/15 text-white shadow-2xl rounded-2xl flex flex-col justify-between text-center overflow-hidden p-0 transition-transform duration-300"
                  >
                    <CardHeader className="pb-3 text-center px-5 xs:px-6 pt-5 xs:pt-6">
                      <CardDecorator>
                        <IconComponent className="size-5 xs:size-6 text-amber-400" />
                      </CardDecorator>

                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mt-3 block">
                        REASON - {reason.number}
                      </span>

                      <h3 className="mt-1.5 text-lg xs:text-xl font-bold text-white tracking-tight leading-snug">
                        {reason.title}
                      </h3>
                    </CardHeader>

                    <CardContent className="text-center px-5 xs:px-6 pb-5 xs:pb-6 pt-0">
                      <p className="text-xs xs:text-[13px] sm:text-sm text-white/75 font-light leading-relaxed">
                        {reason.content}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Mobile & Tablet Pagination Indicators */}
          <div className="flex items-center justify-between pt-3 px-1">
            <div className="flex items-center gap-1.5">
              {WHY_REASONS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToMobileIdx(idx)}
                  aria-label={`Go to reason ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeMobileIdx === idx ? "w-7 bg-amber-400" : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>

            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
              {activeMobileIdx + 1} / {WHY_REASONS.length}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyVictoryAdz;
