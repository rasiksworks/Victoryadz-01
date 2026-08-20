"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MaskTextReveal from "@/components/originkit/ui/mask-text-reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface WhyReasonCard {
  id: string;
  number: string;
  label: string;
  title: string;
  description: string;
}

export const WHY_CHOOSE_US_CARDS: WhyReasonCard[] = [
  {
    id: "card-1",
    number: "01",
    label: "Reason number",
    title: "Premium Quality Materials",
    description:
      "We never compromise on frame material. Every piece is built to last, not just look good on day one.",
  },
  {
    id: "card-2",
    number: "02",
    label: "Reason number",
    title: "Multiple Lamination Finishes",
    description:
      "From matte to glossy to textured, choose the finish that protects and elevates your photo the way you want.",
  },
  {
    id: "card-3",
    number: "03",
    label: "Reason number",
    title: "8+ Years of Experience",
    description:
      "We have been perfecting this craft since day one. Every frame reflects years of precision and care.",
  },
  {
    id: "card-4",
    number: "04",
    label: "Reason number",
    title: "Reasonable, Honest Pricing",
    description:
      "High quality should not mean high prices. We keep it fair, without cutting corners.",
  },
  {
    id: "card-5",
    number: "05",
    label: "Reason number",
    title: "Personally Guided Orders",
    description:
      "No confusing checkout. You talk to us directly on WhatsApp, and we help you pick exactly what is right.",
  },
  {
    id: "card-6",
    number: "06",
    label: "Reason number",
    title: "Delivered Safely, Anywhere",
    description:
      "From Kanyakumari to your doorstep, every frame is carefully packed and shipped, with WhatsApp updates the whole way.",
  },
];

export const WhyVictoryAdz: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleWhatsAppOrder = () => {
    window.open(
      "https://wa.me/919361312684?text=" +
        encodeURIComponent("Hi VictoryAdz! I would like to order a custom frame."),
      "_blank"
    );
  };

  // Desktop Pinned Scroll: Strictly locks viewport for horizontal cards scrub
  useEffect(() => {
    if (isMobile || !sectionRef.current || !trackRef.current || !cardsContainerRef.current) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    const cardsContainer = cardsContainerRef.current;

    const ctx = gsap.context(() => {
      const getScrollDistance = () => Math.max(0, track.scrollWidth - cardsContainer.clientWidth + 120);

      // Initial card states
      cardRefs.current.forEach((card) => {
        if (!card) return;
        gsap.set(card, { opacity: 0, y: 60, scale: 0.94 });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          pinSpacing: true, // Forces layout spacer so FAQ waits strictly below
          start: "top top",
          end: () => "+=" + Math.max(2600, getScrollDistance() * 1.8),
          scrub: 0.8,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      // 1. Initial stagger spring entrance for visible cards (0.0 to 1.0)
      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        const startPos = idx * 0.12;
        tl.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" },
          startPos
        );
      });

      // 2. Horizontal scrub across all 6 cards
      tl.to(
        track,
        {
          x: () => -getScrollDistance(),
          ease: "none",
          duration: 3.5,
        },
        0.8
      );

      // 3. Resting hold so user can read card 06 before unpinning
      tl.to({}, { duration: 0.8 });
    }, section);

    let lastWidth = window.innerWidth;
    let resizeTimer: NodeJS.Timeout | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth !== lastWidth) {
          lastWidth = window.innerWidth;
          ScrollTrigger.refresh();
        }
      }, 250);
    };
    window.addEventListener("resize", onResize);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
      clearTimeout(timer);
      ctx.revert();
    };
  }, [isMobile]);

  // ── MOBILE LAYOUT (< 1024px) ───────────────────────────────────────────────
  if (isMobile) {
    return (
      <section
        id="why-victory-adz"
        className="relative z-20 w-full bg-[#3D3D3D] text-white select-none py-10 sm:py-14 md:py-20 px-4 sm:px-6"
        style={{ fontFamily: "'Inter Display', 'Inter', system-ui, sans-serif" }}
      >
        <div className="w-full max-w-xl mx-auto flex flex-col gap-10">
          {/* Header */}
          <div className="flex flex-col items-start gap-2">
            <span className="text-sm text-white/70 font-normal tracking-tight">
              Why Choose VictoryAdz
            </span>
            <MaskTextReveal
              tag="h2"
              direction="center-horizontal"
              className="text-2xl sm:text-4xl font-bold tracking-[-0.03em] text-white"
              style={{ lineHeight: "110%" }}
            >
              8 years of craftsmanship, built on quality and trust, not shortcuts.
            </MaskTextReveal>
          </div>

          {/* Cards Frame */}
          <div className="flex flex-col gap-6">
            {WHY_CHOOSE_US_CARDS.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 50, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 14,
                  delay: index * 0.08,
                }}
                className="w-full flex flex-col shadow-2xl"
              >
                <div className="flex items-center h-10 w-full">
                  <div className="flex-1 bg-[#292929] text-white/90 text-xs font-semibold px-4 h-full flex items-center tracking-tight">
                    {card.label}
                  </div>
                  <div className="bg-[#1C1C1C] text-white text-xs font-bold px-3.5 h-full flex items-center justify-center border-l border-white/10 shrink-0">
                    {card.number}
                  </div>
                </div>
                <div className="bg-white text-black p-5 sm:p-6 flex flex-col justify-end min-h-[200px] sm:min-h-[220px]">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 leading-snug mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Order Card */}
          <div className="bg-white text-black p-5 rounded-none shadow-2xl">
            <p className="text-xs font-medium text-neutral-800 leading-snug">
              Message us to discuss sizing, frames, and delivery details.
            </p>
            <button
              onClick={handleWhatsAppOrder}
              className="mt-4 w-full bg-[#1C1C1C] hover:bg-black active:scale-[0.98] text-white text-xs font-bold tracking-widest py-3 min-h-[44px] px-3 uppercase transition-all duration-200 cursor-pointer text-center touch-manipulation"
            >
              ORDER NOW
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ── DESKTOP PINNED SCROLL (>= 1024px): SINGLE VIEWPORT LOCK ──────────────
  return (
    <section
      id="why-victory-adz"
      ref={sectionRef}
      className="relative z-20 w-full h-screen min-h-[640px] bg-[#3D3D3D] text-white select-none overflow-hidden"
      style={{ fontFamily: "'Inter Display', 'Inter', system-ui, sans-serif" }}
    >
      <div className="w-full h-full flex flex-row">
        
        {/* LEFT SIDEBAR: Fixed in place during horizontal scrub */}
        <div className="w-[260px] xl:w-[300px] h-full bg-[#2A2A2A] p-8 lg:p-10 flex flex-col justify-between shrink-0 border-r border-white/5 z-20">
          <div className="flex flex-col gap-1">
            <span className="text-[12px] uppercase tracking-[0.25em] text-white/40 font-medium">
              [ VICTORYADZ ]
            </span>
          </div>

          <div className="bg-white text-black p-6 rounded-none shadow-2xl max-w-[240px]">
            <p className="text-[13px] font-medium text-neutral-800 leading-snug">
              Message us to discuss sizing, frames, and delivery details.
            </p>

            <button
              onClick={handleWhatsAppOrder}
              className="mt-4 w-full bg-[#1C1C1C] hover:bg-black text-white text-[11px] font-bold tracking-widest py-2.5 px-3 uppercase transition-colors duration-200 cursor-pointer text-center"
            >
              ORDER NOW
            </button>
          </div>
        </div>

        {/* RIGHT MAIN CANVAS: Top Header + Horizontal Scrub Track */}
        <div className="flex-1 h-full p-8 lg:p-12 xl:p-14 flex flex-col justify-between overflow-hidden relative bg-[#3D3D3D]">
          
          {/* Main Top Header */}
          <div className="flex flex-col items-start gap-2 max-w-4xl mb-6 z-10">
            <span className="text-base sm:text-lg md:text-xl lg:text-[22px] text-white/70 font-normal tracking-[-0.01em] block">
              Why Choose VictoryAdz
            </span>

            <MaskTextReveal
              tag="h2"
              direction="center-horizontal"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[58px] font-bold tracking-[-0.03em] text-white"
              style={{ lineHeight: "105%" }}
            >
              8 years of craftsmanship, built on quality and trust, not shortcuts.
            </MaskTextReveal>
          </div>

          {/* Cards Track Container */}
          <div
            ref={cardsContainerRef}
            className="w-full overflow-hidden pb-2 pt-2 select-none"
          >
            <div
              ref={trackRef}
              className="flex gap-6 w-max will-change-transform"
            >
              {WHY_CHOOSE_US_CARDS.map((card, index) => {
                return (
                  <div
                    key={card.id}
                    ref={(el) => { cardRefs.current[index] = el; }}
                    className="w-[280px] sm:w-[310px] md:w-[340px] shrink-0 flex flex-col shadow-2xl transform-gpu will-change-transform transition-colors duration-300 hover:shadow-black/60"
                  >
                    {/* Card Dark Header Bar */}
                    <div className="flex items-center h-10 w-full">
                      <div className="flex-1 bg-[#292929] text-white/90 text-xs sm:text-[13px] font-semibold px-4 h-full flex items-center tracking-tight">
                        {card.label}
                      </div>
                      <div className="bg-[#1C1C1C] text-white text-xs sm:text-[13px] font-bold px-3.5 h-full flex items-center justify-center border-l border-white/10 shrink-0">
                        {card.number}
                      </div>
                    </div>

                    {/* Card White Body */}
                    <div className="bg-white text-black p-6 sm:p-7 md:p-8 flex flex-col justify-end min-h-[290px] sm:min-h-[320px] md:min-h-[340px]">
                      <h3 className="text-xl sm:text-2xl md:text-[25px] font-bold tracking-[-0.02em] text-neutral-900 leading-tight mb-3">
                        {card.title}
                      </h3>
                      <p className="text-xs sm:text-sm md:text-[14px] text-neutral-600 font-normal leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
