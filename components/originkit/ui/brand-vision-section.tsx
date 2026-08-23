"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button01 } from "@/components/ui/nextjsshop-button";
import { ImageReveal } from "@/components/image-reveal";
import ScrollHighlight from "@/components/originkit/ui/scroll-text-highlight";
import MaskTextReveal from "@/components/originkit/ui/mask-text-reveal";
import siteData from "@/data/site-images.json";

export const BrandVisionSection: React.FC = () => {
  return (
    <section id="about" className="relative z-10 w-full bg-[#2C2C2C] text-white font-inter-display select-none" style={{ backgroundColor: "#2C2C2C" }}>
      <div className="w-full px-4 sm:px-6 md:px-[60px] lg:px-[60px]">
        
        {/* Top Header Row (Scrolls Up Past the Frame First, No Divider Line) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-14 pt-6 sm:pt-10 md:pt-16 pb-6 sm:pb-8 md:pb-12 items-start">
          {/* Left Description */}
          <div className="flex flex-col justify-start">
            <span className="text-xs text-white/50 tracking-[0.2em] font-mono uppercase block mb-3">
              [ THE VICTORY ADZ PROMISE ]
            </span>
            <p
              className="text-[13px] sm:text-[14px] md:text-[15px] font-inter-display font-medium leading-relaxed text-[#DCDCDC] max-w-lg block"
              style={{ letterSpacing: "0.5px" }}
            >
              For 8+ years, we&apos;ve transformed cherished moments including wedding vows, newborn smiles, and family milestones into heirloom-grade wall art. Using 12-color archival pigment printing, scratch-resistant lamination, and moisture-proof mouldings, we craft frames built to outlast generations.
            </p>
          </div>

          {/* Right Big Headline (40% font size reduction) */}
          <div className="flex items-start">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-white leading-[1.18]">
              Photos trapped on screens get forgotten. Framed on your wall, they live forever.
            </h2>
          </div>
        </div>

        {/* Sticky Viewport Container (Left 3:4 Image Sticky + Right Content Scrolls) */}
        <div className="flex flex-col lg:flex-row items-start gap-6 relative">
          
          {/* Left Column: 50% Width, Sticky Image (Top Aligned Flush, 24px Top Padding) */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-0 lg:h-screen flex items-start justify-start pt-3 sm:pt-6 pb-4 sm:pb-6 shrink-0">
            <ImageReveal className="relative w-full aspect-[4/3] sm:aspect-[3/4] max-h-[50vh] sm:max-h-[85vh] overflow-hidden bg-[#222] rounded-sm border border-white/5 shadow-2xl" duration={1.4}>
              <Image
                src={siteData.brandVision.image1}
                alt="Sculptural artwork"
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
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
              <h2 className="text-center text-white select-none">
                <span className="block font-cal-sans text-2xl sm:text-3xl md:text-4xl font-semibold tracking-normal text-white">
                  Captured once.
                </span>
                <span className="block font-great-vibes text-3xl sm:text-4xl md:text-5xl font-normal text-white pt-1 -mt-1">
                  Built to last generations.
                </span>
              </h2>
              <p
                className="font-inter-display font-medium text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed text-[#DCDCDC] block text-center"
                style={{ letterSpacing: "0.5px" }}
              >
                A digital photo is easily buried in camera rolls. On your wall, it becomes a daily reminder of the people and moments that matter most. We consult with you 1-on-1 on WhatsApp, providing personal guidance on custom frame styles, matte or gloss lamination finishes, and proportional wall sizing before anything is crafted. Once confirmed, our master craftsmen handcraft your piece and ship it in 5-layer shockproof boxing anywhere in India.
              </p>
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
              <Button01
                text="Explore Real Frames"
                href="/works"
                ariaLabel="Explore real frames"
              />
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
                &quot;A photo fades inside a camera roll. On your wall, in a handcrafted VictoryAdz frame, it becomes an heirloom your family treasures forever.&quot;
              </ScrollHighlight>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
