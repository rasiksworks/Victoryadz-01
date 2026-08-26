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
    // Initialize Lenis with natural, 1:1 touch multiplier
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => (1 === t ? 1 : 1 - Math.pow(2, -10 * t)), // easeOutExpo
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1,
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
    gsap.ticker.lagSmoothing(500, 33);

    // Handle hash scroll helper
    const scrollToHash = (hash: string, delay = 0) => {
      setTimeout(() => {
        const target = document.querySelector(hash);
        if (target) {
          lenis.scrollTo(target as HTMLElement, { offset: -20, duration: 1.2 });
        }
      }, delay);
    };

    // Handle hash on initial mount (if no preloader or after delay)
    if (typeof window !== "undefined" && window.location.hash) {
      scrollToHash(window.location.hash, 300);
    }

    // Refresh ScrollTrigger and navigate hash when preloader completes
    const handlePreloaderComplete = () => {
      ScrollTrigger.refresh();
      if (typeof window !== "undefined" && window.location.hash) {
        scrollToHash(window.location.hash, 100);
      }
    };
    window.addEventListener("preloader-complete", handlePreloaderComplete);

    // Refresh ScrollTrigger on window resize and font load
    let resizeTimer: NodeJS.Timeout | null = null;
    const handleWindowResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    };
    window.addEventListener("resize", handleWindowResize);

    // Auto-refresh ScrollTrigger when DOM body height changes (e.g. dynamic API data, lazy images)
    let roTimer: NodeJS.Timeout | null = null;
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => {
      if (roTimer) clearTimeout(roTimer);
      roTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }) : null;
    if (ro && typeof document !== "undefined" && document.body) {
      ro.observe(document.body);
    }

    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    // Handle tab visibility
    const handleVisibilityChange = () => {
      if (document.hidden) {
        lenis.stop();
        gsap.ticker.sleep();
      } else {
        lenis.start();
        gsap.ticker.wake();
        ScrollTrigger.refresh();
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
      window.removeEventListener("preloader-complete", handlePreloaderComplete);
      window.removeEventListener("resize", handleWindowResize);
      if (resizeTimer) clearTimeout(resizeTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
