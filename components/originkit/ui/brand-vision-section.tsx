"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageReveal } from "@/components/image-reveal";
import ScrollHighlight from "@/components/originkit/ui/scroll-text-highlight";
import MaskTextReveal from "@/components/originkit/ui/mask-text-reveal";
import siteData from "@/data/site-images.json";

export const BrandVisionSection: React.FC = () => {
  return (
    <section id="about" className="relative z-10 w-full bg-[#2C2C2C] text-white font-inter-display select-none" style={{ backgroundColor: "#2C2C2C" }}>
      <div className="w-full px-4 sm:px-6 md:px-[60px] lg:px-[60px]">
        
        {/* Top Header Row (Scrolls Up Past the Frame First, No Divider Line) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-14 pt-6 sm:pt-10 md:pt-16 pb-6 sm:pb-8 md:pb-12">
          {/* Left Description */}
          <div className="flex flex-col justify-start">
            <span className="text-xs text-white/50 tracking-[0.2em] font-mono uppercase block mb-3">
              ABOUT US
            </span>
            <ScrollHighlight className="text-xs md:text-sm leading-relaxed max-w-lg font-light block">
              Specializing in premium photo frames, we focus on craftsmanship that preserves your memories with the quality they deserve. Every frame is made with precision, using high-quality materials and lamination finishes that stand the test of time. Whether you&apos;re across the street or across the state, every frame is packed and shipped the same way we&apos;d hand it to you in person.
            </ScrollHighlight>
          </div>

          {/* Right Big Headline */}
          <div className="flex items-center">
            <MaskTextReveal
              tag="h2"
              direction="center-horizontal"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]"
            >
              Crafting frames that turn your memories into art
            </MaskTextReveal>
          </div>
        </div>

        {/* Sticky Viewport Container (Left 3:4 Image Sticky + Right Content Scrolls) */}
        <div className="flex flex-col lg:flex-row items-start gap-6 relative">
          
          {/* Left Column: 50% Width, Sticky 3:4 Image (Top Aligned Flush, 24px Top Padding) */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-0 lg:h-screen flex items-start justify-start pt-6 pb-6 shrink-0">
            <ImageReveal className="relative w-full aspect-[3/4] max-h-[85vh] overflow-hidden bg-[#222] rounded-sm border border-white/5 shadow-2xl" duration={1.4}>
              <Image
                src={siteData.brandVision.image1}
                alt="Sculptural artwork"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </ImageReveal>
          </div>

          {/* Right Column: 50% Width, Free Scrolling Content (Top Aligned Flush, 24px Top Padding) */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8 sm:gap-12 lg:gap-20 pt-2 sm:pt-4 md:pt-6 pb-6 sm:pb-10 md:pb-16">
            
            {/* Two Side-by-Side Images (24px Gap Between Them) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 w-full">
              <ImageReveal className="relative aspect-[3/4] w-full overflow-hidden bg-[#222] border border-white/5" delay={0.1} duration={1.2}>
                <Image
                  src={siteData.brandVision.image2}
                  alt="Studio frame craft 1"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center"
                />
              </ImageReveal>
              <ImageReveal className="relative aspect-[3/4] w-full overflow-hidden bg-[#222] border border-white/5" delay={0.25} duration={1.2}>
                <Image
                  src={siteData.brandVision.image3}
                  alt="Studio frame craft 2"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center"
                />
              </ImageReveal>
            </div>

            {/* Captured Once Copy Section */}
            <div className="flex flex-col items-center text-center max-w-xl mx-auto space-y-4 pt-4">
              <MaskTextReveal
                tag="h2"
                direction="center-horizontal"
                className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-snug text-center"
              >
                Captured once.{"\n"}Meant to last forever.
              </MaskTextReveal>
              <ScrollHighlight className="text-xs md:text-sm leading-relaxed font-light block">
                A photo is a single moment, but it deserves to be seen every day, not stored away in a phone. For 8 years, VictoryAdz has been turning photographs into lasting pieces, using premium materials and a range of lamination finishes to protect every detail. Every order starts with understanding what you need, and we personally guide you through choosing the right size, finish, and frame for your memory. Send us your photo on WhatsApp, and we&apos;ll walk you through every choice before anything gets printed. You approve it, then we frame and ship it to you, wherever you are.
              </ScrollHighlight>
            </div>

            {/* Small Center Teaser Image & Button */}
            <div className="flex flex-col items-center gap-6 pt-2">
              <ImageReveal className="relative w-28 md:w-36 aspect-[3/4] overflow-hidden bg-[#222] border border-white/10 shadow-lg" duration={1.0}>
                <Image
                  src={siteData.brandVision.image4}
                  alt="Frame finish detail"
                  fill
                  sizes="144px"
                  className="object-cover object-center"
                />
              </ImageReveal>
              <Link
                href="/works"
                className="bg-white text-black px-7 py-3 min-h-[44px] text-xs tracking-[0.2em] uppercase font-semibold hover:bg-neutral-200 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation"
              >
                DISCOVER <span className="italic lowercase font-normal text-sm">our</span> CRAFT
              </Link>
            </div>

            {/* Second Set of Two Side-by-Side Images (24px Gap Between Them) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 w-full pt-4">
              <ImageReveal className="relative aspect-[3/4] w-full overflow-hidden bg-[#222] border border-white/5" delay={0.1} duration={1.2}>
                <Image
                  src={siteData.brandVision.image5}
                  alt="Studio frame craft 3"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center"
                />
              </ImageReveal>
              <ImageReveal className="relative aspect-[3/4] w-full overflow-hidden bg-[#222] border border-white/5" delay={0.25} duration={1.2}>
                <Image
                  src={siteData.brandVision.image6}
                  alt="Studio frame craft 4"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center"
                />
              </ImageReveal>
            </div>

            {/* Bottom Pull Quote */}
            <div className="text-center max-w-md mx-auto pt-4 pb-6 sm:pb-10">
              <ScrollHighlight className="text-xl md:text-2xl font-bold tracking-tight text-center leading-snug block">
                &quot;A photo fades on a screen. On your wall, in a VictoryAdz frame, it becomes something you never stop noticing.&quot;
              </ScrollHighlight>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
