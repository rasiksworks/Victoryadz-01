"use client";

import { useEffect, useRef, ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => (1 === t ? 1 : 1 - Math.pow(2, -10 * t)), // easeOutExpo
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });
    lenisRef.current = lenis;
    if (typeof window !== "undefined") {
      (window as any).lenis = lenis;
    }

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Named ticker callback to prevent event listener leaks on route navigation
    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // Handle hash scroll (e.g. #recent-works) on mount/navigation
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;
      setTimeout(() => {
        const target = document.querySelector(hash);
        if (target) {
          lenis.scrollTo(target as HTMLElement, { immediate: true });
        }
      }, 150);
    }

    // Handle tab visibility
    const handleVisibilityChange = () => {
      if (document.hidden) {
        lenis.stop();
        gsap.ticker.sleep();
      } else {
        lenis.start();
        gsap.ticker.wake();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Global shortcut for Admin Panel (Ctrl + Shift + A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.open('/admin', '_blank');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
