"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button01 } from "@/components/ui/nextjsshop-button";
import InfiniteGallery from "@/components/originkit/ui/infinitegallery-base";
import siteData from "@/data/site-images.json";

export default function WorksPage() {
  const [galleryImages, setGalleryImages] = useState<{ id?: string; src: string; alt?: string }[]>([]);

  // Fetch dynamic items from /api/site-data
  useEffect(() => {
    fetch("/api/site-data")
      .then((res) => res.json())
      .then((data) => {
        if (data?.exploreGallery && Array.isArray(data.exploreGallery) && data.exploreGallery.length > 0) {
          const mapped = data.exploreGallery.map((item: any) => ({
            id: item.id,
            src: item.image || item.src,
            alt: `${item.label || item.firstName || ""} ${item.title || item.lastName || ""}`.trim() || "Handcrafted Frame",
          }));
          setGalleryImages(mapped);
        } else {
          setGalleryImages(
            (siteData.exploreGallery || []).map((item: any) => ({
              id: item.id,
              src: item.image,
              alt: `${item.label || item.firstName || ""} ${item.title || item.lastName || ""}`.trim() || "Handcrafted Frame",
            }))
          );
        }
      })
      .catch(() => {
        setGalleryImages(
          (siteData.exploreGallery || []).map((item: any) => ({
            id: item.id,
            src: item.image,
            alt: `${item.label || item.firstName || ""} ${item.title || item.lastName || ""}`.trim() || "Handcrafted Frame",
          }))
        );
      });
  }, []);

  const fallbackImages = (siteData.exploreGallery || []).map((item: any) => ({
    id: item.id,
    src: item.image,
    alt: `${item.label || item.firstName || ""} ${item.title || item.lastName || ""}`.trim() || "Handcrafted Frame",
  }));

  const activeImages = galleryImages.length > 0 ? galleryImages : fallbackImages;

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      "Hi VictoryAdz! I'm browsing the Full Frame Gallery and would like to order a custom frame."
    );
    window.open(`https://wa.me/919361312684?text=${message}`, "_blank");
  };

  return (
    <main className="relative w-full h-screen min-h-[100dvh] bg-[#2C2C2C] text-white font-inter-display select-none overflow-hidden">
      {/* ── TOP FLOATING NAVIGATION BAR ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 md:px-12 py-4 sm:py-5 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
        {/* Left: Back to Home + Brand */}
        <div className="flex items-center gap-3 sm:gap-5 pointer-events-auto">
          <Link
            href="/"
            aria-label="Back to Home"
            className="flex items-center gap-2 px-3.5 py-2 rounded-none bg-black/60 backdrop-blur-md border border-white/20 hover:border-white/40 hover:bg-black/80 active:scale-95 transition-all text-xs sm:text-sm font-medium tracking-wide cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            <ArrowLeft size={16} className="text-white/80" />
            <span className="hidden xs:inline">Back to Home</span>
            <span className="xs:hidden">Back</span>
          </Link>

          <Link
            href="/"
            className="font-sans text-base sm:text-lg font-semibold tracking-tight text-white uppercase hover:text-white/80 transition-colors"
          >
            VICTORYADZ
          </Link>
        </div>

        {/* Center: Instruction Pill */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-none bg-white/5 backdrop-blur-md border border-white/10 text-[11px] font-mono tracking-widest uppercase text-white/60 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>DRAG TO EXPLORE GALLERY</span>
        </div>

        {/* Right: Order on WhatsApp Button */}
        <div className="pointer-events-auto shrink-0">
          <Button01
            text="Order on WhatsApp"
            variant="light"
            ariaLabel="Order on WhatsApp"
            onClick={handleWhatsAppOrder}
            className="text-xs"
          />
        </div>
      </header>

      {/* ── FULLSCREEN ORIGINKIT INFINITY CANVAS ── */}
      <div className="w-full h-full">
        <InfiniteGallery
          images={activeImages}
          width="100%"
          height="100%"
          imageWidth={260}
          imageHeight={346}
          rounded={0}
          density={3.5}
          dragSpeed={22}
          driftAmount={18}
          friction={8}
          backgroundColor="#2C2C2C"
          onImageClick={() => {}} // No detailed page action on click
        />
      </div>

      {/* ── MOBILE BOTTOM FLOATING INSTRUCTION PILL ── */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-none bg-black/70 backdrop-blur-lg border border-white/15 text-[11px] font-mono tracking-wider uppercase text-white/70 pointer-events-none shadow-2xl">
        Touch &amp; drag anywhere to explore
      </div>
    </main>
  );
}
