"use client";

import React, { useState, useEffect } from "react";
import { Plus, Minus, RotateCcw } from "lucide-react";
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

  const handleZoomIn = () => {
    window.dispatchEvent(new CustomEvent("gallery-zoom", { detail: { amount: 0.65 } }));
  };

  const handleZoomOut = () => {
    window.dispatchEvent(new CustomEvent("gallery-zoom", { detail: { amount: -0.65 } }));
  };

  const handleReset = () => {
    window.dispatchEvent(new CustomEvent("gallery-reset"));
  };

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

      {/* ── MOBILE & DESKTOP FLOATING 3D ZOOM CONTROLS ── */}
      <div className="fixed bottom-6 right-4 sm:right-8 z-40 flex items-center gap-1.5 p-1 bg-black/80 backdrop-blur-xl border border-white/20 rounded-none shadow-2xl">
        <button
          onClick={handleZoomIn}
          aria-label="Zoom In 3D Perspective"
          className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-white/90 hover:text-white hover:bg-white/15 active:scale-95 transition-all cursor-pointer rounded-none touch-manipulation"
        >
          <Plus size={18} />
        </button>

        <div className="w-px h-5 bg-white/20" />

        <button
          onClick={handleZoomOut}
          aria-label="Zoom Out 3D Perspective"
          className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-white/90 hover:text-white hover:bg-white/15 active:scale-95 transition-all cursor-pointer rounded-none touch-manipulation"
        >
          <Minus size={18} />
        </button>

        <div className="w-px h-5 bg-white/20" />

        <button
          onClick={handleReset}
          aria-label="Reset View"
          className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-white/90 hover:text-white hover:bg-white/15 active:scale-95 transition-all cursor-pointer rounded-none touch-manipulation"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* ── SUBTLE FLOATING INSTRUCTION PILL (Left/Center aligned) ── */}
      <div className="fixed bottom-6 left-4 sm:left-8 z-40 px-3.5 py-2 rounded-none bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-mono tracking-widest uppercase text-white/70 pointer-events-none shadow-2xl flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="hidden xs:inline">DRAG OR PINCH TO EXPLORE 3D GALLERY</span>
        <span className="xs:hidden">DRAG &amp; PINCH TO EXPLORE</span>
      </div>
    </main>
  );
}
