"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import siteData from "@/data/site-images.json";

export interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  initials?: string;
  featured?: boolean;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "t1",
    quote:
      "VictoryAdz transformed our 30-year-old wedding portrait into a masterpiece. The sparkle lamination finish brings out vivid details without any glare. The WhatsApp consultation made choosing the frame size completely effortless.",
    name: "Karthik Raja",
    role: "Chennai, Tamil Nadu",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    initials: "KR",
    featured: true,
  },
  {
    id: "t2",
    quote:
      "Ordered 4 large teak-finished synthetic frames for our new home. Packed with extreme care, arrived without a single scratch. Truly 8+ years of craftsmanship at work!",
    name: "Priya Sundaram",
    role: "Coimbatore, Tamil Nadu",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    initials: "PS",
    featured: false,
  },
  {
    id: "t3",
    quote:
      "The team guided me on WhatsApp to choose the perfect frame moulding for my family portrait. Fast delivery and museum-grade quality!",
    name: "Anand Kumar",
    role: "Madurai, Tamil Nadu",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    initials: "AK",
    featured: false,
  },
  {
    id: "t4",
    quote:
      "Exceptional frame finish with flawless lamination. The packing was bulletproof and reached Bangalore safely within 48 hours.",
    name: "Deepa Menon",
    role: "Bangalore, Karnataka",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
    initials: "DM",
    featured: false,
  },
];

export const Testimonials: React.FC = () => {
  const [items, setItems] = useState<TestimonialItem[]>(() => {
    const fromSiteData = (siteData as any).testimonials;
    if (Array.isArray(fromSiteData) && fromSiteData.length > 0) {
      return fromSiteData;
    }
    return DEFAULT_TESTIMONIALS;
  });

  const [activeIdx, setActiveIdx] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/site-data")
      .then((res) => res.json())
      .then((data) => {
        if (data?.testimonials && Array.isArray(data.testimonials) && data.testimonials.length > 0) {
          setItems(data.testimonials);
        }
      })
      .catch(() => {});
  }, []);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const firstCard = el.querySelector(".testimonial-card") as HTMLElement;
    if (!firstCard) return;
    const cardWidth = firstCard.offsetWidth;
    const gap = 16;
    const idx = Math.round(el.scrollLeft / (cardWidth + gap));
    setActiveIdx(Math.max(0, Math.min(items.length - 1, idx)));
  };

  const scrollPrev = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const firstCard = el.querySelector(".testimonial-card") as HTMLElement;
    const cardWidth = firstCard ? firstCard.offsetWidth : 320;
    el.scrollBy({ left: -(cardWidth + 16), behavior: "smooth" });
  };

  const scrollNext = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const firstCard = el.querySelector(".testimonial-card") as HTMLElement;
    const cardWidth = firstCard ? firstCard.offsetWidth : 320;
    el.scrollBy({ left: cardWidth + 16, behavior: "smooth" });
  };

  const scrollToIdx = (idx: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const firstCard = el.querySelector(".testimonial-card") as HTMLElement;
    const cardWidth = firstCard ? firstCard.offsetWidth : 320;
    el.scrollTo({ left: idx * (cardWidth + 16), behavior: "smooth" });
  };

  return (
    <section
      id="testimonials"
      className="relative z-10 w-full bg-[#2C2C2C] text-white font-inter-display select-none py-14 sm:py-20 md:py-24 lg:py-32 border-t border-white/10 overflow-hidden"
      style={{ backgroundColor: "#2C2C2C" }}
    >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1520px] mx-auto flex flex-col gap-6 sm:gap-10">
        {/* Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
          <div className="flex flex-col items-start gap-2">
            <h2>
              <span className="block font-cal-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-normal text-white leading-[1.05]">
                Trusted from
              </span>
              <span className="block font-great-vibes text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-white pt-1 -mt-1 leading-[1.05]">
                Near and Far
              </span>
            </h2>
            <p className="text-sm sm:text-base text-white/70 font-light max-w-xl mt-1">
              Real stories from families across Tamil Nadu and India who trust VictoryAdz for custom handcrafted framing.
            </p>
          </div>

          {/* Desktop Arrow Controls */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={scrollPrev}
              aria-label="Previous testimonial"
              className="w-11 h-11 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next testimonial"
              className="w-11 h-11 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Horizontal Stack Track with Clear Visible Peek of Next Card */}
        <div className="w-full -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12 px-4 sm:px-6 md:px-8 lg:px-12 overflow-visible">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-6 pt-2 pr-8 sm:pr-12 scrollbar-none"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {items.map((t) => {
              const initials = t.initials || (t.name ? t.name.slice(0, 2).toUpperCase() : "VA");
              return (
                <div
                  key={t.id}
                  className={`testimonial-card snap-start shrink-0 w-[78vw] xs:w-[320px] sm:w-[380px] md:w-[420px] lg:w-[460px] min-h-[290px] xs:min-h-[310px] sm:min-h-[330px] ${
                    t.featured
                      ? "bg-[#1b1b1b] border-amber-500/40"
                      : "bg-[#181818] border-white/15"
                  } rounded-2xl border text-white shadow-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-white/30`}
                  style={{ backgroundColor: t.featured ? "#1b1b1b" : "#181818" }}
                >
                  <div className="flex flex-col justify-between h-full gap-5">
                    {/* Top Bar: Stars + Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-amber-400 text-sm tracking-wider">
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                      </div>
                      <span className="text-[10px] sm:text-xs font-mono text-white/50 uppercase tracking-widest px-2.5 py-0.5 rounded bg-white/10 border border-white/15">
                        Verified Order
                      </span>
                    </div>

                    {/* Review Quote */}
                    <p className="text-sm sm:text-base md:text-lg text-white/95 leading-relaxed font-normal flex-1">
                      &ldquo;{t.quote}&rdquo;
                    </p>

                    {/* Customer Footer */}
                    <div className="flex items-center gap-3.5 pt-4 border-t border-white/10">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white/20 bg-white/10 shrink-0 flex items-center justify-center">
                        {t.avatar ? (
                          <Image
                            src={t.avatar}
                            alt={t.name || "Customer"}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="font-mono text-xs font-bold text-white/80">{initials}</span>
                        )}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm sm:text-base font-semibold text-white tracking-tight leading-tight">
                          {t.name}
                        </span>
                        <span className="text-xs text-white/50 tracking-wider font-mono mt-0.5">
                          {t.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Pagination Dots & Mobile Navigation Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToIdx(idx)}
                aria-label={`Go to review ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIdx === idx ? "w-7 bg-amber-400" : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* Mobile Arrows */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={scrollPrev}
              aria-label="Previous testimonial"
              className="w-9 h-9 rounded-full border border-white/20 bg-white/5 active:scale-95 flex items-center justify-center text-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next testimonial"
              className="w-9 h-9 rounded-full border border-white/20 bg-white/5 active:scale-95 flex items-center justify-center text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
