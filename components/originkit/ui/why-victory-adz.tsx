"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface WhyReason {
  id: string;
  number: string;
  title: string;
  content: string;
}

export const WHY_REASONS: WhyReason[] = [
  {
    id: "reason-1",
    number: "01",
    title: "Archival Durability",
    content:
      "We never compromise on frame material. Every piece is built to last with moisture-resistant core boards and museum-grade archival durability.",
  },
  {
    id: "r2",
    number: "02",
    title: "Surface Finish Choices",
    content:
      "From glare-free matte to crystal glossy and tactile textured finishes, select the exact style that protects and elevates your artwork.",
  },
  {
    id: "r3",
    number: "03",
    title: "8+ Years of Craftsmanship",
    content:
      "We've been perfecting this craft since day one. Every frame reflects years of precision, handcrafting, and family-trusted care.",
  },
  {
    id: "reason-4",
    number: "04",
    title: "Honest Pricing",
    content:
      "Studio-direct craftsmanship without retail markups. Fair, transparent pricing with no hidden fees or quality compromises.",
  },
  {
    id: "reason-5",
    number: "05",
    title: "Personal Guidance",
    content:
      "1-on-1 direct consultation on WhatsApp to help you pick perfect frame sizes, mouldings, and custom photo layouts.",
  },
  {
    id: "reason-6",
    number: "06",
    title: "Safe Delivery",
    content:
      "Every frame is shockproof packed and delivered safely anywhere across India with real-time WhatsApp dispatch updates.",
  },
];

export const WhyVictoryAdz: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackWrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardTextRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardLineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardPlusRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const section = sectionRef.current;
    const trackWrapper = trackWrapperRef.current;
    const track = trackRef.current;
    if (!container || !section || !trackWrapper || !track) return;

    const ctx = gsap.context(() => {
      const numCards = WHY_REASONS.length; // 6
      const stepDuration = 1.0;
      const snapIncrement = 1 / (numCards - 1); // 0.2

      // Dynamic calculation: on desktop (fits ~3 cards), track shifts only when 4th card arrives;
      // on mobile (fits 1 card), track shifts for every card
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

      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

      // Clean timeline driven by the container scroll (No GSAP pin manipulation)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: isMobile ? 0.7 : 0.5,
          ...(isMobile
            ? {}
            : {
                snap: {
                  snapTo: (progress) => Math.round(progress / snapIncrement) * snapIncrement,
                  duration: { min: 0.2, max: 0.45 },
                  delay: 0.1,
                  ease: "power2.out",
                  inertia: false,
                },
              }),
          invalidateOnRefresh: true,
          onLeave: () => {
            if (typeof window !== "undefined" && (window as any).lenis?.velocity) {
              (window as any).lenis.velocity *= 0.2;
            }
          },
          onLeaveBack: () => {
            if (typeof window !== "undefined" && (window as any).lenis?.velocity) {
              (window as any).lenis.velocity *= 0.2;
            }
          },
        },
      });

      // Sequential Step-by-Step Card Animations
      WHY_REASONS.forEach((_, idx) => {
        const textEl = cardTextRefs.current[idx];
        const lineEl = cardLineRefs.current[idx];
        const plusEl = cardPlusRefs.current[idx];
        const stepStart = idx * stepDuration;

        // Track shift animation: smoothly glides when card idx needs to enter the visible frame
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
        }

        // 1. Text reveals with smooth fade-in
        if (textEl) {
          tl.fromTo(
            textEl,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: stepDuration * 0.35, ease: "power1.out" },
            idx === 0 ? 0 : stepStart + 0.15
          );
        }

        // 2. Plus button spins and moves from left to right, drawing the line behind it
        if (lineEl && plusEl) {
          const animStart = idx === 0 ? 0.05 : stepStart + 0.2;

          tl.fromTo(
            plusEl,
            { opacity: 0, left: "12px", rotation: 0 },
            { opacity: 1, duration: 0.08, ease: "power1.out" },
            animStart
          );

          tl.to(
            plusEl,
            {
              left: "calc(100% - 12px)",
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

          // Settle straight
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
        }
      });
    }, container);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    const timer = setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <div
      id="why-victory-adz"
      ref={containerRef}
      className="relative w-full h-[300vh] lg:h-[350vh] bg-[#141414]"
      style={{ backgroundColor: "#141414" }}
    >
      {/* Native CSS Sticky Viewport: 100% Immune to Pin Clashes & Testimonial Overlaps */}
      <div
        ref={sectionRef}
        className="sticky top-0 w-full h-screen min-h-screen bg-[#141414] text-white font-inter-display select-none flex flex-col justify-between py-10 sm:py-14 md:py-16 lg:py-20 overflow-hidden border-t border-white/5"
        style={{ backgroundColor: "#141414" }}
      >
        <div className="relative w-full max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col justify-between h-full flex-1">
          {/* ── SECTION HEADER ── */}
          <div className="w-full flex flex-col items-start gap-1 pt-2 sm:pt-4">
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
          </div>

          {/* ── SEQUENTIAL CARD-BY-CARD REVEAL TRACK ── */}
          <div ref={trackWrapperRef} className="w-full overflow-x-hidden overflow-y-visible pb-6 sm:pb-10 pt-4 -mx-4 sm:-mx-8 lg:-mx-12 px-4 sm:px-8 lg:px-12">
            <div
              ref={trackRef}
              className="flex flex-col w-max will-change-transform overflow-visible"
            >
              {/* The Cards Row */}
              <div className="flex flex-row flex-nowrap items-stretch overflow-visible pr-8 sm:pr-12">
                {WHY_REASONS.map((reason, index) => (
                  <div
                    key={reason.id}
                    className="why-card flex flex-col justify-between w-[calc(100vw-32px)] sm:w-[calc(100vw-64px)] md:w-[460px] lg:w-[400px] xl:w-[420px] h-[260px] xs:h-[280px] sm:h-[300px] shrink-0 select-none overflow-visible"
                  >
                    {/* Card Text Content */}
                    <div
                      ref={(el) => {
                        cardTextRefs.current[index] = el;
                      }}
                      className="flex flex-col opacity-0 will-change-[opacity,transform] pr-6 sm:pr-10 lg:pr-12"
                    >
                      {/* Eyebrow Label */}
                      <span className="font-mono text-xs text-white/50 tracking-[0.2em] uppercase font-medium mb-2.5 sm:mb-4">
                        REASON - {reason.number}
                      </span>

                      {/* Title */}
                      <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-white tracking-tight leading-snug mb-2.5 sm:mb-4">
                        {reason.title}
                      </h3>

                      {/* Content Description */}
                      <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed max-w-xl">
                        {reason.content}
                      </p>
                    </div>

                    {/* Continuous Track Line Segment with Base Guide + Active Drawing Line */}
                    <div className="relative w-full pr-6 sm:pr-10 lg:pr-12 py-6 mt-auto select-none overflow-visible">
                      {/* 1. Base Continuous Track Line (Always visible across all cards) */}
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[1.5px] bg-white/30" />

                      {/* 2. Active Illuminated Line (Drawn as scroll progresses) */}
                      <div
                        ref={(el) => {
                          cardLineRefs.current[index] = el;
                        }}
                        className="absolute top-1/2 -translate-y-1/2 left-0 h-[2px] bg-white will-change-[width] drop-shadow-[0_0_6px_rgba(255,255,255,0.9)] z-10"
                        style={{ width: "0%" }}
                      />

                      {/* 3. Spinning Plus Marker (Bounded, Zero Clipping) */}
                      <div
                        ref={(el) => {
                          cardPlusRefs.current[index] = el;
                        }}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center pointer-events-none opacity-0 will-change-[left,transform,opacity] z-20"
                        style={{ left: "12px" }}
                      >
                        <span className="text-white font-mono text-base font-bold select-none leading-none drop-shadow-[0_0_8px_rgba(255,255,255,1)] flex items-center justify-center">
                          +
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WhyVictoryAdz;
