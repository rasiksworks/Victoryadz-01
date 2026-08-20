"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ImagePlus, MessageSquare, Hammer, Truck } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProcessCard {
  id: string;
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const PROCESS: ProcessCard[] = [
  {
    id: "send",
    number: "01",
    icon: ImagePlus,
    title: "Send Your Photo",
    description: "Share your photo with us on WhatsApp. Any photo, any condition.",
  },
  {
    id: "guide",
    number: "02",
    icon: MessageSquare,
    title: "We Guide You",
    description: "We help you choose the size, frame style, and lamination finish that suits your memory best.",
  },
  {
    id: "craft",
    number: "03",
    icon: Hammer,
    title: "We Craft It",
    description: "Your frame is made by hand with the same care we have put into every order for 8+ years.",
  },
  {
    id: "ship",
    number: "04",
    icon: Truck,
    title: "We Ship It Safely",
    description: "Packed carefully and shipped to your door, with WhatsApp updates the whole way.",
  },
];

const TOTAL_FRAMES = 151;

const getFrameUrl = (index: number) => {
  const num = Math.min(TOTAL_FRAMES, Math.max(1, index + 1)).toString().padStart(3, "0");
  return "/assets/ezgif-6f4c991aa8358f98-jpg/ezgif-frame-" + num + ".jpg";
};

export const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isMobile, setIsMobile] = useState(false);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentFrameRef = useRef(0);

  // Draw frame on canvas with aspect ratio cover centering
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)));
    
    // Find requested frame or fallback to nearest loaded frame
    let img = imagesRef.current[clampedIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const lower = clampedIndex - offset;
        const higher = clampedIndex + offset;
        if (lower >= 0 && imagesRef.current[lower]?.complete && imagesRef.current[lower]?.naturalWidth !== 0) {
          img = imagesRef.current[lower];
          break;
        }
        if (higher < TOTAL_FRAMES && imagesRef.current[higher]?.complete && imagesRef.current[higher]?.naturalWidth !== 0) {
          img = imagesRef.current[higher];
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    currentFrameRef.current = clampedIndex;

    const dpr = window.devicePixelRatio || 1;
    const canvasW = canvas.width / dpr;
    const canvasH = canvas.height / dpr;

    const hRatio = canvasW / img.naturalWidth;
    const vRatio = canvasH / img.naturalHeight;
    const ratio = Math.max(hRatio, vRatio);

    const drawW = img.naturalWidth * ratio;
    const drawH = img.naturalHeight * ratio;
    const drawX = (canvasW - drawW) / 2;
    const drawY = (canvasH - drawH) / 2;

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

    // Preload frames silently into ref (Zero state re-renders to prevent killing GSAP timeline)
  useEffect(() => {
    const isMobileDevice = window.innerWidth < 1024;
    setIsMobile(isMobileDevice);

    let resizeTimer: NodeJS.Timeout;
    const checkMobile = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setIsMobile(window.innerWidth < 1024);
      }, 200);
    };
    window.addEventListener("resize", checkMobile);

    // CRITICAL MOBILE BANDWIDTH & CPU OPTIMIZATION:
    // On mobile (< 1024px), skip loading all 151 canvas frames! Saves ~18MB network payload & CPU decoding.
    if (isMobileDevice) {
      return () => window.removeEventListener("resize", checkMobile);
    }

    // Load frame 0 immediately
    const firstImg = new window.Image();
    firstImg.src = getFrameUrl(0);
    firstImg.onload = () => {
      imagesRef.current[0] = firstImg;
      drawFrame(0);
    };

    // Preload next 25 frames immediately for instant responsiveness on scroll
    for (let i = 1; i < Math.min(25, TOTAL_FRAMES); i++) {
      const img = new window.Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        imagesRef.current[i] = img;
      };
    }

    // Preload remaining frames progressively
    const timer = setTimeout(() => {
      for (let i = 25; i < TOTAL_FRAMES; i++) {
        const img = new window.Image();
        img.src = getFrameUrl(i);
        img.onload = () => {
          imagesRef.current[i] = img;
        };
      }
    }, 400);

    return () => {
      window.removeEventListener("resize", checkMobile);
      clearTimeout(timer);
    };
  }, [drawFrame]);

  // Master GSAP Timeline: Strict Viewport Lock & 5-Step Sequential Scroll
  useEffect(() => {
    if (isMobile || !sectionRef.current || !canvasRef.current) return;

    const section = sectionRef.current;
    const canvas = canvasRef.current;

    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      const c = canvas.getContext("2d");
      if (c) {
        c.setTransform(1, 0, 0, 1, 0, 0);
        c.scale(dpr, dpr);
      }
      drawFrame(currentFrameRef.current);
    };

    setupCanvas();

    const ctx = gsap.context(() => {
      // 5 distinct scroll steps + hold = 3600px scroll travel distance
      const totalScroll = 3600;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          pinSpacing: true, // Forces layout spacer so About Us waits strictly below
          start: "top top",
          end: "+=" + totalScroll,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });

      // Scrub frames across duration (0.0 to 5.0)
      const frameTracker = { frame: 0 };
      tl.to(
        frameTracker,
        {
          frame: TOTAL_FRAMES - 1,
          ease: "none",
          duration: 5.0,
          onUpdate: () => {
            drawFrame(frameTracker.frame);
          },
        },
        0
      );

      // STEP 1 (0.0 -> 1.0): Section is LOCKED. Header title reveals in dead CENTER
      if (headerRef.current) {
        tl.fromTo(
          headerRef.current,
          { opacity: 0, scale: 0.88, y: 0 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power2.out" },
          0.1
        );

        // STEP 2 (1.0 -> 2.0): Header title glides UP to make room for step cards
        const targetY = -(window.innerHeight * 0.28);
        tl.to(
          headerRef.current,
          { y: targetY, duration: 0.9, ease: "power2.inOut" },
          1.0
        );
      }

      // STEP 2 (1.0 -> 2.0): Card 01 (Send Your Photo) reveals
      if (cardRefs.current[0]) {
        tl.fromTo(
          cardRefs.current[0],
          { opacity: 0, y: 80, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" },
          1.1
        );
      }

      // STEP 3 (2.0 -> 3.0): Card 02 (We Guide You) reveals
      if (cardRefs.current[1]) {
        tl.fromTo(
          cardRefs.current[1],
          { opacity: 0, y: 80, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" },
          2.0
        );
      }

      // STEP 4 (3.0 -> 4.0): Card 03 (We Craft It) reveals
      if (cardRefs.current[2]) {
        tl.fromTo(
          cardRefs.current[2],
          { opacity: 0, y: 80, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" },
          3.0
        );
      }

      // STEP 5 (4.0 -> 5.0): Card 04 (We Ship It Safely) reveals
      if (cardRefs.current[3]) {
        tl.fromTo(
          cardRefs.current[3],
          { opacity: 0, y: 80, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" },
          4.0
        );
      }

      // HOLD (5.0 -> 5.8): Complete 4-step row remains locked on screen before smooth release into About Us
      tl.to({}, { duration: 0.8 });
    }, section);

    let lastWidth = window.innerWidth;
    let resizeTimer: NodeJS.Timeout | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth !== lastWidth) {
          lastWidth = window.innerWidth;
          setupCanvas();
          ScrollTrigger.refresh();
        }
      }, 250);
    };
    window.addEventListener("resize", onResize);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
      clearTimeout(timer);
      ctx.revert();
    };
  }, [isMobile, drawFrame]);

  // --- MOBILE VIEW (< 1024px): Clean Native Vertical Flow ---
  if (isMobile) {
    return (
      <section
        id="how-it-works"
        className="relative z-20 w-full bg-[#181818] text-white font-inter-display select-none py-14 sm:py-20 px-6"
      >
        <div className="w-full max-w-xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col items-center text-center gap-3">
            <span className="text-xs text-white/50 tracking-[0.25em] font-mono uppercase bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-[1.15]">
              Four Simple Steps, Zero Confusion
            </h2>
            <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed mt-1">
              From your photo to your wall, wherever you are. No shop visit needed.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {PROCESS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex flex-col p-6 bg-[#202020] border border-white/10 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs text-white/40 tracking-wider">{step.number}</span>
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-white mb-1.5">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // --- DESKTOP VIEW: SINGLE PINNED VIEWPORT LOCK ---
  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative z-30 w-full h-screen bg-[#181818] text-white font-inter-display select-none overflow-hidden"
    >
      {/* Workshop Craft Video Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        style={{ opacity: 0.8, transition: "opacity 0.5s ease" }}
      />

      {/* Solid Dark Gradient Overlays to guarantee zero background bleed */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-[#181818]/70 pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-[#181818]/40 pointer-events-none" />

      {/* Centered Interaction Layer */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center pointer-events-none">
        
        {/* Title Group: Appears in Center (Step 1), Glides UP (Step 2) */}
        <div
          ref={headerRef}
          style={{ opacity: 0 }}
          className="flex flex-col items-center justify-center text-center gap-4 max-w-4xl w-full px-6 pointer-events-none transform-gpu will-change-transform mx-auto"
        >
          <span className="text-xs text-white/80 tracking-[0.25em] font-mono uppercase bg-white/10 border border-white/20 px-4 py-1.5 rounded-full backdrop-blur-md">
            HOW IT WORKS
          </span>
          <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.15] drop-shadow-2xl text-center">
            Four Simple Steps, Zero Confusion
          </h2>
          <p className="text-base xl:text-lg text-white/80 font-light leading-relaxed drop-shadow-lg max-w-2xl text-center mx-auto">
            From your photo to your wall, wherever you are. No shop visit needed.
          </p>
        </div>

        {/* 4 Process Cards Row: Sequentially revealed across Steps 2 to 5 */}
        <div className="absolute bottom-10 xl:bottom-16 left-8 xl:left-16 right-8 xl:right-16 grid grid-cols-4 gap-4 xl:gap-6 pointer-events-auto">
          {PROCESS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                style={{ opacity: 0 }}
                className="group relative flex flex-col justify-between p-5 xl:p-6 bg-[#1C1C1C]/90 backdrop-blur-2xl border border-white/15 hover:border-white/40 rounded-xl transition-colors duration-300 hover:shadow-2xl hover:shadow-black/80 shadow-xl transform-gpu will-change-transform"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 bg-white/10 border border-white/15 rounded-lg flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300 shadow-inner">
                    <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <span className="font-mono text-xs text-white/40 tracking-wider group-hover:text-white/80 transition-colors">
                    {step.number}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-base xl:text-lg font-bold tracking-tight text-white">{step.title}</h3>
                  <p className="text-xs xl:text-sm text-white/70 font-light leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
