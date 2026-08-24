"use client";

import { useState, useEffect } from "react";
import MorphSlider from "@/components/ui/MorphSlider";
import { TUNNEL_IMAGES } from "@/components/originkit/ui/hero-03/tunnel-images";

/**
 * React Bits MorphSlider WebGL background.
 * GPU displacement morph between curated frame artwork with subtle drift & dark veil.
 */
export const PerspectiveBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sliderItems = TUNNEL_IMAGES.map((img: any) => ({
    image: typeof img === "string" ? img : img.src || img.url,
  })).filter((item: any) => Boolean(item.image));

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-[#2C2C2C]"
      style={{ backgroundColor: "#2C2C2C" }}
    >
      {mounted && sliderItems.length > 0 && (
        <div className="absolute inset-0 w-full h-full">
          <MorphSlider
            items={sliderItems}
            transition="melt"
            intensity={0.45}
            aberration={0.25}
            drift={0.35}
            autoplay={true}
            autoplayDelay={4.5}
            loop={true}
            radius={0}
            overlayColor="#2C2C2C"
            showCaptions={false}
            showControls={false}
            showIndicators={false}
            className="w-full h-full"
          />
        </div>
      )}

      {/* Center veil for crisp hero typography & CTA button contrast */}
      <div className="pointer-events-none absolute inset-0 bg-black/35 bg-[radial-gradient(ellipse_at_center,rgba(44,44,44,0.75)_0%,rgba(44,44,44,0.35)_40%,transparent_64%)] ipad:bg-[radial-gradient(ellipse_at_center,rgba(44,44,44,0.82)_0%,rgba(44,44,44,0.45)_38%,transparent_62%)] desktop-sm:bg-[radial-gradient(ellipse_at_center,rgba(44,44,44,0.88)_0%,rgba(44,44,44,0.52)_36%,transparent_60%)]" />
    </div>
  );
};

export default PerspectiveBackground;
