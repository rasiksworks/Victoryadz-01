"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StepData {
  number: string;
  title: string;
  body: string;
  cellPosDesktop: {
    left: string;
    top: string;
  };
  contentPadding: string;
}

const STEPS: StepData[] = [
  {
    number: "01",
    title: "Send Your Photo",
    body: "Share your photo with us on WhatsApp. Any photo. any condition.",
    cellPosDesktop: { left: "0%", top: "0%" },
    contentPadding: "pt-[36px] px-[32px] pb-[40px] lg:pt-[40px] lg:pl-[40px] lg:pr-[32px] lg:pb-[48px]",
  },
  {
    number: "02",
    title: "We Guide You",
    body: "We help you choose the size, frame style, and lamination finish that suits your memory",
    cellPosDesktop: { left: "25%", top: "0%" },
    contentPadding: "pt-[36px] px-[32px] pb-[40px] lg:pt-[40px] lg:pl-[50px] lg:pr-[30px] lg:pb-[48px]",
  },
  {
    number: "03",
    title: "We Craft It",
    body: "Your frame is made by hand with the same care we have put into every order for 8+",
    cellPosDesktop: { left: "50%", top: "50%" },
    contentPadding: "pt-[36px] px-[32px] pb-[40px] lg:pt-[40px] lg:pl-[50px] lg:pr-[30px] lg:pb-[48px]",
  },
  {
    number: "04",
    title: "We Ship It Safely",
    body: "Packed carefully and shipped to your door, with WhatsApp updates the whole way.",
    cellPosDesktop: { left: "75%", top: "50%" },
    contentPadding: "pt-[36px] px-[32px] pb-[40px] lg:pt-[40px] lg:pl-[40px] lg:pr-[32px] lg:pb-[48px]",
  },
];

const TOTAL_FRAMES = 151;

const getFrameUrl = (index: number) => {
  const num = Math.min(TOTAL_FRAMES, Math.max(1, index + 1))
    .toString()
    .padStart(3, "0");
  return "/assets/ezgif-6f4c991aa8358f98-jpg/ezgif-frame-" + num + ".jpg";
};

export const HowItWorksV2: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleBlockRef = useRef<HTMLDivElement>(null);
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

  // Preload frame image sequence
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

    // Preload next 25 frames
    for (let i = 1; i < Math.min(25, TOTAL_FRAMES); i++) {
      const img = new window.Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        imagesRef.current[i] = img;
      };
    }

    // Preload remaining frames
    const timer = setTimeout(() => {
      for (let i = 25; i < TOTAL_FRAMES; i++) {
        const img = new window.Image();
        img.src = getFrameUrl(i);
        img.onload = () => {
          imagesRef.current[i] = img;
        };
      }
    }, 300);

    return () => {
      window.removeEventListener("resize", checkMobile);
      clearTimeout(timer);
    };
  }, [drawFrame]);

  // Master GSAP Timeline for Desktop: Pinned 5-Step Staircase Sequence Scroll
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
      const totalScroll = 3600;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          pinSpacing: true,
          start: "top top",
          end: "+=" + totalScroll,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });

      // Scrub frames across sequence duration (0.0 to 5.0)
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

      // STEP 1 (0.0 -> 1.0): Hero Title Block reveals in Top-Right
      if (titleBlockRef.current) {
        tl.fromTo(
          titleBlockRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          0.1
        );
      }

      // STEP 2 (1.0 -> 2.0): Card 01 (Top-Left) reveals
      if (cardRefs.current[0]) {
        tl.fromTo(
          cardRefs.current[0],
          { opacity: 0, y: 60, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" },
          1.0
        );
      }

      // STEP 3 (2.0 -> 3.0): Card 02 (Top-Center-Left) reveals
      if (cardRefs.current[1]) {
        tl.fromTo(
          cardRefs.current[1],
          { opacity: 0, y: 60, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" },
          2.0
        );
      }

      // STEP 4 (3.0 -> 4.0): Card 03 (Bottom-Center-Right) reveals
      if (cardRefs.current[2]) {
        tl.fromTo(
          cardRefs.current[2],
          { opacity: 0, y: 60, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" },
          3.0
        );
      }

      // STEP 5 (4.0 -> 5.0): Card 04 (Bottom-Right) reveals
      if (cardRefs.current[3]) {
        tl.fromTo(
          cardRefs.current[3],
          { opacity: 0, y: 60, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" },
          4.0
        );
      }

      // HOLD (5.0 -> 5.8): Full 4-card staircase layout remains locked on screen
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

  // --- MOBILE VIEW (< 1024px) ---
  if (isMobile) {
    return (
      <section
        id="how-it-works-v2-test"
        aria-label="How It Works Process (Test V2)"
        className="relative w-full bg-[#FFFFFF] text-white select-none overflow-hidden font-inter-display"
        style={{ fontFamily: "'Inter Display', sans-serif" }}
      >
        <div className="w-full bg-[#1C1C1C] py-3 px-6 text-center border-t border-b border-white/10">
          <span className="text-[11px] font-mono tracking-[0.25em] text-white/70 uppercase">
            ✦ Design Artifact Test Section — How It Works (v2) ✦
          </span>
        </div>

        <div className="relative w-full overflow-hidden bg-black py-12 px-6 sm:px-8">
          {/* Static First Frame Background on Mobile */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center opacity-60 pointer-events-none"
            style={{ backgroundImage: `url(${getFrameUrl(0)})` }}
          />

          <div className="relative z-10 max-w-xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-tight">
                Four Simple Steps,
                <br />
                Zero Confusion
              </h2>
              <p className="text-base sm:text-lg font-medium text-[#E8E8E8] leading-relaxed">
                From your photo to your wall, wherever you are. No shop visit needed.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STEPS.map((step) => (
                <div
                  key={step.number}
                  className="relative border border-white/50 bg-black/30 backdrop-blur-[4px] p-6 sm:p-8 flex flex-col justify-between min-h-[300px]"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.30)",
                    backdropFilter: "blur(4px)",
                    WebkitBackdropFilter: "blur(4px)",
                  }}
                >
                  <span className="absolute -top-[3.5px] -left-[3.5px] w-[7px] h-[7px] bg-white rounded-none" />
                  <span className="absolute -top-[3.5px] -right-[3.5px] w-[7px] h-[7px] bg-white rounded-none" />
                  <span className="absolute -bottom-[3.5px] -left-[3.5px] w-[7px] h-[7px] bg-white rounded-none" />
                  <span className="absolute -bottom-[3.5px] -right-[3.5px] w-[7px] h-[7px] bg-white rounded-none" />

                  <div className="text-3xl font-semibold text-white mb-6">
                    {step.number}
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <h3 className="text-2xl font-semibold text-white leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm font-medium text-white/90 leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --- DESKTOP VIEW (≥ 1024px): Pinned Full-Screen Canvas 5-Step Staircase ---
  return (
    <section
      ref={sectionRef}
      id="how-it-works-v2-test"
      aria-label="How It Works Process (Test V2)"
      className="relative z-20 w-full h-screen min-h-[100dvh] bg-[#FFFFFF] text-white select-none overflow-hidden font-inter-display"
      style={{ fontFamily: "'Inter Display', sans-serif" }}
    >
      {/* Test Section Header Badge (Absolute floating badge at top) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#1C1C1C]/90 backdrop-blur-sm py-1.5 px-4 rounded-none border border-white/20">
        <span className="text-[10px] font-mono tracking-[0.25em] text-white/80 uppercase">
          ✦ How It Works (v2) · 5-Step Sequence Scroll ✦
        </span>
      </div>

      {/* Full Viewport Canvas for 151-frame sequence */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none block"
      />

      {/* 1440x1024 Base Coordinate Grid Canvas Overlay */}
      <div className="relative w-full max-w-[1440px] h-full mx-auto z-10 pointer-events-none">
        {/* Floating Hero Title Block (Top-Right Area: left 54.16%, top 7.8%) */}
        <div
          ref={titleBlockRef}
          style={{ opacity: 0 }}
          className="absolute left-[54.16%] top-[7.8%] max-w-[556px] flex flex-col gap-[18px] z-20"
        >
          <h2
            className="text-[52px] xl:text-[60px] font-semibold text-white tracking-[-0.02em] leading-[1.08] max-w-[551px]"
            style={{ fontFamily: "'Inter Display', sans-serif" }}
          >
            Four Simple Steps,
            <br />
            Zero Confusion
          </h2>

          <p
            className="text-[20px] xl:text-[24px] font-medium text-[#E8E8E8] leading-snug max-w-[556px]"
            style={{ fontFamily: "'Inter Display', sans-serif" }}
          >
            From your photo to your wall, wherever you are. No shop visit needed.
          </p>
        </div>

        {/* 4 Staircase Grid Cells (2 Top-Left, 2 Bottom-Right) */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {STEPS.map((step, idx) => (
            <div
              key={step.number}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              style={{
                position: "absolute",
                left: step.cellPosDesktop.left,
                top: step.cellPosDesktop.top,
                width: "25%",
                height: "50%",
                backgroundColor: "rgba(0, 0, 0, 0.24)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                opacity: 0,
              }}
              className="pointer-events-auto border border-white/50 backdrop-blur-[4px] flex flex-col justify-between"
            >
              {/* 4 Corner 7x7px White Dots */}
              <span className="absolute -top-[3.5px] -left-[3.5px] w-[7px] h-[7px] bg-white rounded-none pointer-events-none z-30" />
              <span className="absolute -top-[3.5px] -right-[3.5px] w-[7px] h-[7px] bg-white rounded-none pointer-events-none z-30" />
              <span className="absolute -bottom-[3.5px] -left-[3.5px] w-[7px] h-[7px] bg-white rounded-none pointer-events-none z-30" />
              <span className="absolute -bottom-[3.5px] -right-[3.5px] w-[7px] h-[7px] bg-white rounded-none pointer-events-none z-30" />

              <div className={`w-full h-full flex flex-col justify-between ${step.contentPadding}`}>
                {/* Step Number: SemiBold 40px #FFFFFF */}
                <div className="text-[36px] xl:text-[40px] font-semibold text-white tracking-tight leading-none">
                  {step.number}
                </div>

                {/* Text Container: Max width 280px, Spacing 18px */}
                <div className="w-full max-w-[280px] flex flex-col gap-[18px]">
                  <h3 className="text-[32px] xl:text-[40px] font-semibold text-white tracking-tight leading-[1.08]">
                    {step.title}
                  </h3>
                  <p className="text-[18px] xl:text-[20px] font-medium text-white leading-[1.3] text-pretty">
                    {step.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
