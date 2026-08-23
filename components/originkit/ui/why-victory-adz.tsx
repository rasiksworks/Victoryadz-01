"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button01 } from "@/components/ui/nextjsshop-button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface WhyReasonCard {
  id: string;
  number: string;
  badge: string;
  tagline: string;
  bgColor: string;
  image: string;
  iconType: "materials" | "finishes" | "craft" | "pricing" | "support" | "shipping";
}

export const WHY_VICTORY_CARDS: WhyReasonCard[] = [
  {
    id: "card-1",
    number: "01",
    badge: "25-YR ARCHIVAL",
    tagline: "12-Color Archival Pigment Inks That Never Fade or Discolor",
    bgColor: "#0a7cc1",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&q=80",
    iconType: "materials",
  },
  {
    id: "card-2",
    number: "02",
    badge: "100% SAFE TRANSIT",
    tagline: "5-Layer Shockproof Boxing. Zero-Risk Free Replacement Guarantee.",
    bgColor: "#ff431e",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=80",
    iconType: "shipping",
  },
  {
    id: "card-3",
    number: "03",
    badge: "FREE MOCKUP",
    tagline: "1-on-1 WhatsApp Guidance with Live Frame & Wall Visualizers",
    bgColor: "#307c5f",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&q=80",
    iconType: "support",
  },
  {
    id: "card-4",
    number: "04",
    badge: "MASTER CRAFT",
    tagline: "Seamless Precision Corner Joinery & Moisture-Resistant Mouldings",
    bgColor: "#ff431e",
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=900&q=80",
    iconType: "craft",
  },
  {
    id: "card-5",
    number: "05",
    badge: "FREE AI RETOUCHING",
    tagline: "We Upscale Low-Res Snaps & Restore Vintage Photos at No Extra Cost",
    bgColor: "#0a7cc1",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=900&q=80",
    iconType: "finishes",
  },
  {
    id: "card-6",
    number: "06",
    badge: "STUDIO DIRECT",
    tagline: "Direct Workshop Pricing with No Middleman or Hidden Shipping Costs",
    bgColor: "#307c5f",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&q=80",
    iconType: "pricing",
  },
];

const renderIcon = (type: WhyReasonCard["iconType"]) => {
  switch (type) {
    case "materials":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8 text-white">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      );
    case "finishes":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8 text-white">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
    case "craft":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8 text-white">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case "pricing":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8 text-white">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case "support":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8 text-white">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      );
    case "shipping":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8 text-white">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      );
  }
};

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
        encodeURIComponent("Hi VictoryAdz! I'd like to get a free mockup and price quote for my photo frame."),
      "_blank"
    );
  };

  useEffect(() => {
    if (isMobile || !sectionRef.current || !trackRef.current || !cardsContainerRef.current) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    const cardsContainer = cardsContainerRef.current;

    const ctx = gsap.context(() => {
      const getScrollDistance = () => Math.max(0, track.scrollWidth - cardsContainer.clientWidth + 160);

      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        const isStaggered = idx % 2 === 1;
        gsap.set(card, {
          opacity: 0,
          y: isStaggered ? 120 : 60,
          scale: 0.94,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          pinSpacing: true,
          start: "top top",
          end: () => "+=" + Math.max(2800, getScrollDistance() * 1.6),
          scrub: 0.8,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        const startPos = idx * 0.1;
        const isStaggered = idx % 2 === 1;
        tl.fromTo(
          card,
          { opacity: 0, y: isStaggered ? 120 : 60, scale: 0.94 },
          { opacity: 1, y: isStaggered ? 55 : 0, scale: 1, duration: 0.6, ease: "power2.out" },
          startPos
        );
      });

      tl.to(
        track,
        {
          x: () => -getScrollDistance(),
          ease: "none",
          duration: 4.0,
        },
        0.6
      );

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
    const timer = setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
      clearTimeout(timer);
      ctx.revert();
    };
  }, [isMobile]);

  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isMobile) return;
    const target = e.currentTarget;
    const scrollLeft = target.scrollLeft;
    const cardWidth = 320; // approximate mobile card snap width
    const index = Math.min(
      WHY_VICTORY_CARDS.length - 1,
      Math.max(0, Math.round(scrollLeft / cardWidth))
    );
    setActiveCardIndex(index);
  };

  return (
    <section
      id="why-victory-adz"
      ref={sectionRef}
      className="relative z-20 w-full min-h-screen bg-[#1E1E1E] text-white select-none overflow-hidden py-10 lg:py-16 flex flex-col justify-between"
      style={{ fontFamily: "'Inter Display', system-ui, -apple-system, sans-serif" }}
    >
      {/* ── TOP HERO TYPOGRAPHY ZONE (FIGMA CONTAINER TRIBE INSPIRATION) ── */}
      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16 pt-2 pb-4 sm:pb-6 flex flex-col items-center justify-center">
        
        {/* Giant Ghost Watermark Typography in Background */}
        <div className="w-full flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden">
          <p className="font-extrabold text-[44px] xs:text-[56px] sm:text-[100px] md:text-[130px] xl:text-[160px] leading-[0.92] tracking-[-0.04em] text-[#E8E8E8]/10 sm:text-[#E8E8E8]/[0.12] text-center uppercase whitespace-nowrap">
            WHY CHOOSE
          </p>
          <p className="font-extrabold text-[44px] xs:text-[56px] sm:text-[100px] md:text-[130px] xl:text-[160px] leading-[0.92] tracking-[-0.04em] text-[#E8E8E8]/10 sm:text-[#E8E8E8]/[0.12] text-center uppercase whitespace-nowrap">
            VICTORY ADZ
          </p>
        </div>

        {/* Staggered Floating Editorial Sub-Headlines */}
        <div className="absolute inset-0 w-full h-full max-w-[1440px] mx-auto pointer-events-none flex flex-col justify-between py-2 px-4 sm:px-8">
          {/* Top Left Title Block */}
          <div className="self-start max-w-[280px] xs:max-w-[320px] sm:max-w-[420px] pt-1 sm:pt-3">
            <h2 className="text-[16px] xs:text-[18px] sm:text-[26px] xl:text-[34px] font-bold text-[#FFFFFF] tracking-[-0.025em] uppercase leading-[1.12]">
              A place where memories <br />
              <span className="font-extrabold italic text-[#FFA07A]">find their</span> true form.
            </h2>
          </div>

          {/* Bottom Right Title Block */}
          <div className="self-end max-w-[290px] xs:max-w-[340px] sm:max-w-[460px] text-right pb-1 sm:pb-3">
            <p className="text-[16px] xs:text-[18px] sm:text-[26px] xl:text-[34px] font-bold text-[#FFFFFF] tracking-[-0.025em] uppercase leading-[1.12]">
              Crafted with passion &amp; <br />
              <span className="font-extrabold italic text-[#FFA07A]">built to</span> last forever.
            </p>
          </div>
        </div>
      </div>

      {/* ── STAGGERED HORIZONTAL CARDS SHOWCASE ── */}
      <div
        ref={cardsContainerRef}
        onScroll={handleMobileScroll}
        className="w-full overflow-x-auto lg:overflow-hidden scrollbar-none py-4 sm:py-8 select-none snap-x snap-mandatory touch-pan-x"
      >
        <div
          ref={trackRef}
          className="flex gap-4 sm:gap-8 px-4 sm:px-12 xl:px-16 w-max will-change-transform items-start"
        >
          {WHY_VICTORY_CARDS.map((card, index) => {
            const isStaggered = index % 2 === 1;

            return (
              <div
                key={card.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                style={{
                  backgroundColor: card.bgColor,
                  marginTop: !isMobile && isStaggered ? "55px" : "0px",
                }}
                className="relative w-[280px] xs:w-[320px] sm:w-[380px] md:w-[440px] xl:w-[480px] h-[320px] xs:h-[350px] sm:h-[380px] rounded-[20px] overflow-hidden shrink-0 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-black/70 group snap-center"
              >
                {/* Background Photography with Soft Color Tone */}
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={card.image}
                    alt={card.tagline}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-50 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                  />
                  {/* Deep Dark Gradient Overlay for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                {/* Card Top Pill Badge */}
                <div className="absolute top-4 sm:top-5 left-4 sm:left-5 right-4 sm:right-5 flex justify-between items-center z-10">
                  <span className="text-[10px] sm:text-[12px] font-bold tracking-wider text-white/90 bg-white/15 backdrop-blur-md px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-full uppercase border border-white/20">
                    {card.badge}
                  </span>
                  <span className="text-white/80 font-mono text-xs sm:text-sm font-bold tracking-tighter">
                    {card.number}
                  </span>
                </div>

                {/* Card Bottom Content & Minimalist Icon */}
                <div className="absolute bottom-0 left-0 w-full p-5 sm:p-7 flex flex-col gap-2.5 sm:gap-3 z-10">
                  {/* Clean Icon Container */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                    {renderIcon(card.iconType)}
                  </div>

                  {/* Punchy Editorial Tagline */}
                  <p className="text-[16px] xs:text-[18px] sm:text-[21px] xl:text-[23px] font-bold text-[#EDEDED] leading-[1.24] tracking-tight">
                    {card.tagline}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Card Dots Indicator */}
      <div className="lg:hidden flex items-center justify-center gap-1.5 py-2">
        {WHY_VICTORY_CARDS.map((_, idx) => (
          <span
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeCardIndex === idx ? "w-6 bg-white" : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* ── BOTTOM CALL TO ACTION ── */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 sm:pt-4 border-t border-white/10 z-10">
        <p className="text-xs sm:text-base text-white/80 font-medium text-center sm:text-left">
          Have a photo in mind? Send it over for an instant free digital mockup &amp; quote.
        </p>

        <Button01
          text="Get Free WhatsApp Mockup"
          onClick={handleWhatsAppOrder}
          ariaLabel="Get Free WhatsApp Mockup"
        />
      </div>
    </section>
  );
};
