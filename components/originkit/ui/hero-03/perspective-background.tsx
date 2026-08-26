"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "motion/react";
import GalleryTunnel from "@/components/originkit/ui/hero-03/gallery-tunnel";
import { useTunnelConfig } from "@/components/originkit/ui/hero-03/use-tunnel-size";
import { TUNNEL_IMAGES } from "@/components/originkit/ui/hero-03/tunnel-images";

/**
 * Animated Three.js gallery tunnel.
 * Click/hold empty areas to boost; UI stays clickable above.
 */
export const PerspectiveBackground = () => {
  const [mounted, setMounted] = useState(false);
  const [images, setImages] = useState(TUNNEL_IMAGES);
  const reduceMotion = useReducedMotion();
  const { tunnelSize, fade, boost } = useTunnelConfig();

  useEffect(() => {
    // 1. Check localStorage for instant preview
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem("victoryadz_custom_site_data");
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed?.heroTunnel && Array.isArray(parsed.heroTunnel) && parsed.heroTunnel.length > 0) {
            setImages(parsed.heroTunnel);
          }
        }
      } catch {}
    }

    // 2. Fetch fresh data from API
    fetch("/api/site-data")
      .then((res) => res.json())
      .then((data) => {
        if (data?.heroTunnel && Array.isArray(data.heroTunnel) && data.heroTunnel.length > 0) {
          setImages(data.heroTunnel);
        }
      })
      .catch(() => {});

    // 3. Real-time storage listener for instant live admin reflections
    const handleStorage = (e?: StorageEvent) => {
      if (!e || e.key === "victoryadz_custom_site_data" || !e.key) {
        try {
          const local = localStorage.getItem("victoryadz_custom_site_data");
          if (local) {
            const parsed = JSON.parse(local);
            if (parsed?.heroTunnel && Array.isArray(parsed.heroTunnel) && parsed.heroTunnel.length > 0) {
              setImages(parsed.heroTunnel);
            }
          }
        } catch {}
      }
    };

    window.addEventListener("storage", handleStorage);

    // Micro-delay mounting Three.js canvas by 100ms so hero typography & buttons paint instantly
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-[#2C2C2C]"
      style={{ backgroundColor: "#2C2C2C" }}
    >
      {mounted && (
        <GalleryTunnel
          background="#2C2C2C"
          lineColor="#555555"
          lineOpacity={60}
          grid={4}
          tunnelSize={tunnelSize}
          speed={reduceMotion ? 0 : 9}
          boost={reduceMotion ? 0 : boost}
          fade={fade}
          label={false}
          images={images}
          style={{ width: "100%", height: "100%" }}
        />
      )}

      {/* Soft center veil — matching design wash */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(44,44,44,0.75)_0%,rgba(44,44,44,0.35)_40%,transparent_64%)] ipad:bg-[radial-gradient(ellipse_at_center,rgba(44,44,44,0.82)_0%,rgba(44,44,44,0.45)_38%,transparent_62%)] desktop-sm:bg-[radial-gradient(ellipse_at_center,rgba(44,44,44,0.88)_0%,rgba(44,44,44,0.52)_36%,transparent_60%)]" />
    </div>
  );
};

export default PerspectiveBackground;
