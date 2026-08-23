// Delivered by Originkit
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GalleryOverlay } from "@/components/originkit/ui/hero-03/gallery-overlay";
import { HeroContent } from "@/components/originkit/ui/hero-03/hero-content";
import { PerspectiveBackground } from "@/components/originkit/ui/hero-03/perspective-background";

export const Section12Hero = () => {
  const [galleryOpen, setGalleryOpen] = useState(false);

  const router = useRouter();

  const handleExplore = () => {
    router.push("/works");
  };

  const handleCloseGallery = () => {
    setGalleryOpen(false);
  };

  const handleBook = () => {
    window.open(
      "https://wa.me/919361312684?text=" +
        encodeURIComponent("Hi VictoryAdz! I would like to get a free preview & quote for my photo frame."),
      "_blank"
    );
  };

  useEffect(() => {
    const handleOpenGallery = () => router.push("/works");
    window.addEventListener("open-hero-gallery", handleOpenGallery);
    return () => window.removeEventListener("open-hero-gallery", handleOpenGallery);
  }, [router]);

  return (
    <section
      id="hero"
      aria-label="Portrait perspective gallery"
      className="relative isolate w-full overflow-hidden bg-[#2C2C2C]" style={{ backgroundColor: "#2C2C2C" }}
    >
      <div className="relative mx-auto flex h-screen w-full max-w-[1600px] flex-col wide-lg:max-w-none">
        <PerspectiveBackground />

        <div className="pointer-events-none relative z-20 flex flex-1 flex-col items-center justify-center px-4 pb-12 pt-16 ipad:px-12 desktop-sm:px-6 desktop-sm:pb-20 desktop-sm:pt-16">
          <HeroContent onExplore={handleExplore} onBook={handleBook} />
        </div>
      </div>

      <GalleryOverlay open={galleryOpen} onClose={handleCloseGallery} />
    </section>
  );
};

