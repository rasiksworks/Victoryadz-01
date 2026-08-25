"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
];

export const Testimonials: React.FC = () => {
  const [items, setItems] = useState<TestimonialItem[]>(() => {
    const fromSiteData = (siteData as any).testimonials;
    if (Array.isArray(fromSiteData) && fromSiteData.length > 0) {
      return fromSiteData;
    }
    return DEFAULT_TESTIMONIALS;
  });

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

  return (
    <section
      id="testimonials"
      className="relative z-10 w-full bg-[#2C2C2C] text-white font-inter-display select-none py-14 sm:py-20 md:py-24 lg:py-32 border-t border-white/10"
      style={{ backgroundColor: "#2C2C2C" }}
    >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1520px] mx-auto flex flex-col gap-8 sm:gap-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <h2>
            <span className="block font-cal-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-normal text-white leading-[1.05]">
              Trusted from
            </span>
            <span className="block font-great-vibes text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-white pt-1 -mt-1 leading-[1.05]">
              Near and Far
            </span>
          </h2>
          <p className="text-sm sm:text-base text-white/70 font-light max-w-xl mx-auto mt-2">
            Real stories from families across Tamil Nadu and India who trust VictoryAdz for custom handcrafted framing.
          </p>
        </div>

        {/* Responsive Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full">
          {items.map((t) => {
            const initials = t.initials || (t.name ? t.name.slice(0, 2).toUpperCase() : "VA");
            return (
              <div
                key={t.id}
                className={`${
                  t.featured
                    ? "md:col-span-2 lg:col-span-2 bg-[#1b1b1b] border-amber-500/40"
                    : "bg-[#181818] border-white/15"
                } rounded-xl border text-white shadow-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:border-white/30`}
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
    </section>
  );
};

export default Testimonials;
