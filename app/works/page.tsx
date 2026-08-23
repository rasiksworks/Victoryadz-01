"use client";

import React, { useState, useEffect } from "react";
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

  return (
    <main className="relative w-full h-screen min-h-[100dvh] bg-[#2C2C2C] text-white font-inter-display select-none overflow-hidden">
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
          onImageClick={() => {}} // No detailed modal action on canvas click
        />
      </div>

      {/* ── SUBTLE FLOATING INSTRUCTION PILL (Non-intrusive) ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-none bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono tracking-widest uppercase text-white/60 pointer-events-none shadow-2xl flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>DRAG TO EXPLORE INFINITE GALLERY</span>
      </div>
    </main>
  );
}
