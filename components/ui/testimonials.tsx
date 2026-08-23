"use client";

import { useState, useEffect } from "react";
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

export default function Testimonials() {
  const [items, setItems] = useState<TestimonialItem[]>(
    ((siteData as any).testimonials as TestimonialItem[]) || []
  );

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

  const featured = items.find((t) => t.featured) || items[0];
  const others = items.filter((t) => t.id !== featured?.id);

  return (
    <section className="py-16 md:py-32 bg-[#2C2C2C] text-white">
      <div className="mx-auto max-w-[1520px] space-y-8 px-4 sm:px-6 md:px-8 lg:px-12 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-4 text-center md:space-y-6">
          <h2 className="flex flex-col items-center">
            <span className="font-cal-sans text-3xl sm:text-4xl md:text-5xl font-semibold tracking-normal text-white">
              Trusted from
            </span>
            <span className="font-great-vibes text-4xl sm:text-5xl md:text-6xl font-normal text-white pt-1 -mt-1">
              Near and Far
            </span>
          </h2>
          <p className="text-sm sm:text-base text-white/70 font-light">
            Real experiences from families across Tamil Nadu and India who trust VictoryAdz for handcrafted framing.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2">
          {featured && (
            <Card className="grid grid-rows-[auto_1fr] gap-6 sm:col-span-2 sm:p-6 lg:row-span-2 bg-[#1c1c1f]/90 border-white/10 text-white shadow-xl backdrop-blur-md">
              <CardHeader className="p-0">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-sm tracking-widest">★★★★★</span>
                  <span className="text-xs font-mono text-white/40 uppercase">Verified Order</span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                  <p className="text-lg md:text-xl font-medium leading-relaxed text-white/90">
                    &ldquo;{featured.quote}&rdquo;
                  </p>

                  <div className="grid grid-cols-[auto_1fr] items-center gap-3 pt-4 border-t border-white/10">
                    <Avatar className="size-12 border border-white/15">
                      <AvatarImage
                        src={featured.avatar}
                        alt={featured.name}
                        height="400"
                        width="400"
                        loading="lazy"
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-white/10 text-white font-bold">
                        {featured.initials || featured.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <cite className="text-sm font-semibold not-italic text-white">{featured.name}</cite>
                      <span className="text-white/50 block text-xs">{featured.role}</span>
                    </div>
                  </div>
                </blockquote>
              </CardContent>
            </Card>
          )}

          {others.map((t, idx) => (
            <Card
              key={t.id}
              className={`${
                idx === 0 ? "md:col-span-2" : ""
              } bg-[#1c1c1f]/90 border-white/10 text-white shadow-xl backdrop-blur-md p-6`}
            >
              <CardContent className="h-full p-0 flex flex-col justify-between">
                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-4">
                  <p className="text-sm sm:text-base text-white/85 leading-relaxed font-normal">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div className="grid grid-cols-[auto_1fr] items-center gap-3 pt-3 border-t border-white/10">
                    <Avatar className="size-10 border border-white/15">
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
                      <cite className="text-sm font-medium not-italic text-white">{t.name}</cite>
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
}
