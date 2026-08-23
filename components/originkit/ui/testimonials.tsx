"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export const Testimonials: React.FC = () => {
  const [items, setItems] = useState<TestimonialItem[]>(
    ((siteData as any).testimonials as TestimonialItem[]) || []
  );

  useEffect(() => {
    fetch("/api/site-data")
      .then((res) => res.json())
      .then((data) => {
        if (data?.testimonials && Array.isArray(data.testimonials) && data.testimonials.length > 0) {
          setItems(data.testimonials);
          setTimeout(() => {
            if (typeof window !== "undefined" && (window as any).ScrollTrigger) {
              (window as any).ScrollTrigger.refresh();
            }
          }, 80);
        }
      })
      .catch(() => {});
  }, []);

  const featured = items.find((t) => t.featured) || items[0];
  const others = items.filter((t) => t.id !== featured?.id);

  return (
    <section
      id="testimonials"
      className="relative w-full bg-[#2C2C2C] text-white font-inter-display select-none py-14 sm:py-20 md:py-24 lg:py-32 overflow-hidden border-t border-white/5"
    >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1520px] mx-auto flex flex-col gap-10 sm:gap-14">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {items.map((t) => (
            <Card
              key={t.id}
              className={`${
                t.featured ? "md:col-span-2 lg:col-span-2 bg-[#1a1a1c] border-amber-500/30" : "bg-[#1a1a1c]/90 border-white/10"
              } text-white shadow-2xl backdrop-blur-md p-6 sm:p-7 flex flex-col justify-between`}
            >
              <CardContent className="h-full p-0 flex flex-col justify-between gap-5">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-sm tracking-widest">★★★★★</span>
                  <span className="text-xs font-mono text-white/40 uppercase">Verified Order</span>
                </div>
                <blockquote className="flex flex-col justify-between flex-1 gap-5">
                  <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed font-normal">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                    <Avatar className="size-10 sm:size-11 border border-white/15">
                      <AvatarImage
                        src={t.avatar}
                        alt={t.name}
                        height="400"
                        width="400"
                        loading="lazy"
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-white/10 text-white text-xs font-bold">
                        {t.initials || t.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <cite className="text-sm font-semibold not-italic text-white">{t.name}</cite>
                      <span className="text-white/50 block text-xs">{t.role}</span>
                    </div>
                  </div>
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
