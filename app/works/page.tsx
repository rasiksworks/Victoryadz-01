"use client";

import React, { useState, useEffect } from "react";
import InfiniteGallery from "@/components/originkit/ui/infinitegallery-base";
import siteData from "@/data/site-images.json";

export default function WorksPage() {
  const [galleryImages, setGalleryImages] = useState<{ src: string; alt?: string }[]>([]);

  // Fetch dynamic items from /api/site-data with fallback to all 50 items
  useEffect(() => {
    fetch("/api/site-data")
      .then((res) => res.json())
      .then((data) => {
        if (data?.exploreGallery && Array.isArray(data.exploreGallery) && data.exploreGallery.length > 0) {
          const mapped = data.exploreGallery.map((item: any) => ({
            src: item.image || item.src,
            alt: `${item.label || item.firstName || ""} ${item.title || item.lastName || ""}`.trim() || "Handcrafted Frame",
          }));
          setGalleryImages(mapped);
        } else {
          setGalleryImages(
            (siteData.exploreGallery || []).map((item: any) => ({
              src: item.image,
              alt: `${item.label || item.firstName || ""} ${item.title || item.lastName || ""}`.trim() || "Handcrafted Frame",
            }))
          );
        }
      })
      .catch(() => {
        setGalleryImages(
          (siteData.exploreGallery || []).map((item: any) => ({
            src: item.image,
            alt: `${item.label || item.firstName || ""} ${item.title || item.lastName || ""}`.trim() || "Handcrafted Frame",
          }))
        );
      });
  }, []);

  const fallbackImages = (siteData.exploreGallery || []).map((item: any) => ({
    src: item.image,
    alt: `${item.label || item.firstName || ""} ${item.title || item.lastName || ""}`.trim() || "Handcrafted Frame",
  }));

  const activeImages = galleryImages.length > 0 ? galleryImages : fallbackImages;

  return (
    <main className="relative w-screen h-screen bg-[#2C2C2C] text-white font-inter-display select-none overflow-hidden">
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
        />
      </div>
    </main>
  );
}
