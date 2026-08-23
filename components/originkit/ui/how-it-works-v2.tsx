"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button01 } from "@/components/ui/nextjsshop-button";

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
}

const STEPS: StepData[] = [
  {
    number: "01",
    title: "Send on WhatsApp",
    body: "Drop your photo on WhatsApp. Any resolution — our team checks quality and enhances it for crystal-clear printing.",
    cellPosDesktop: { left: "0%", top: "0%" },
  },
  {
    number: "02",
    title: "1-on-1 Frame Advice",
    body: "We guide you directly on WhatsApp through custom sizes, frame styles, and matte or gloss lamination options.",
    cellPosDesktop: { left: "25%", top: "0%" },
  },
  {
    number: "03",
    title: "Archival Crafting",
    body: "Printed with 12-color archival inks and finished with scratch-proof, anti-glare lamination that won't fade for 25+ years.",
    cellPosDesktop: { left: "50%", top: "50%" },
  },
  {
    number: "04",
    title: "Safe Doorstep Delivery",
    body: "Protected in 5-layer shockproof boxing and shipped tracked to your door. If it arrives damaged, we replace it free.",
    cellPosDesktop: { left: "75%", top: "50%" },
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
  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileHeaderRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentFrameRef = useRef(0);

  // Draw frame on canvas with aspect ratio cover & mobile smart centering
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

    const canvasW = window.innerWidth;
    const canvasH = window.innerHeight;

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

  // Preload all 151 frames
  useEffect(() => {
    const handleCheckMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleCheckMobile();

    let isMounted = true;
    let loadedCount = 0;

    const firstImg = new window.Image();
    firstImg.crossOrigin = "anonymous";
    firstImg.src = getFrameUrl(0);
    firstImg.onload = () => {
      if (!isMounted) return;
      imagesRef.current[0] = firstImg;
      drawFrame(0);
    };

    const BATCH_SIZE = 12;
    const loadBatch = (startIndex: number) => {
      if (!isMounted || startIndex >= TOTAL_FRAMES) return;
      const endIndex = Math.min(startIndex + BATCH_SIZE, TOTAL_FRAMES);

      for (let i = startIndex; i < endIndex; i++) {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = getFrameUrl(i);
        img.onload = () => {
          if (!isMounted) return;
          imagesRef.current[i] = img;
          loadedCount++;
          if (loadedCount === TOTAL_FRAMES || i === currentFrameRef.current) {
            drawFrame(currentFrameRef.current);
          }
        };
      }

      if (endIndex < TOTAL_FRAMES) {
        setTimeout(() => loadBatch(endIndex), 40);
      }
    };

    loadBatch(1);

    return () => {
      isMounted = false;
    };
  }, [drawFrame]);

  // Master GSAP ScrollTrigger Timeline
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const setupCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const c = canvas.getContext("2d");
      if (c) {
        c.setTransform(1, 0, 0, 1, 0, 0);
        c.scale(dpr, dpr);
      }
      drawFrame(currentFrameRef.current);
    };

    setupCanvas();

    const ctx = gsap.context(() => {
      const totalScroll = isMobile ? 2600 : 3600;

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

      // Scrub canvas video frames smoothly from 0 to 150 across scroll duration
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

      if (!isMobile) {
        // Title block is static and immediately visible in its designated top-right position
        if (titleBlockRef.current) {
          gsap.set(titleBlockRef.current, { opacity: 1 });
        }

        // Ensure all 4 cards start completely off-screen below viewport
        cardRefs.current.forEach((cardEl) => {
          if (cardEl) {
            gsap.set(cardEl, { y: () => window.innerHeight + 150, autoAlpha: 0 });
          }
        });

        // Step 1 (0.3 -> 1.4): Card 01 rises from below screen into top-left cell
        if (cardRefs.current[0]) {
          tl.fromTo(
            cardRefs.current[0],
            { y: () => window.innerHeight + 150, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1.1, ease: "power2.out" },
            0.3
          );
        }

        // Step 2 (1.4 -> 2.5): Card 02 rises from below screen into top-center-left cell
        if (cardRefs.current[1]) {
          tl.fromTo(
            cardRefs.current[1],
            { y: () => window.innerHeight + 150, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1.1, ease: "power2.out" },
            1.4
          );
        }

        // Step 3 (2.5 -> 3.6): Card 03 rises from below screen into bottom-center-right cell
        if (cardRefs.current[2]) {
          tl.fromTo(
            cardRefs.current[2],
            { y: () => window.innerHeight + 150, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1.1, ease: "power2.out" },
            2.5
          );
        }

        // Step 4 (3.6 -> 4.7): Card 04 rises from below screen into bottom-right cell
        if (cardRefs.current[3]) {
          tl.fromTo(
            cardRefs.current[3],
            { y: () => window.innerHeight + 150, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1.0, ease: "power2.out" },
            3.6
          );
        }
      } else {
        // --- MOBILE: STATIC HEADER & VERTICAL BOTTOM-UP CARDS ENTRANCE ---
        mobileCardRefs.current.forEach((cardEl) => {
          if (cardEl) {
            gsap.set(cardEl, { y: "150%", autoAlpha: 0 });
          }
        });

        mobileCardRefs.current.forEach((cardEl, idx) => {
          if (!cardEl) return;
          const stepStart = 0.3 + idx * 1.1;

          // Slide UP from completely outside bottom into view
          tl.fromTo(
            cardEl,
            { y: "150%", autoAlpha: 0 },
            { y: "0%", autoAlpha: 1, duration: 0.9, ease: "power2.out" },
            stepStart
          );

          // Glide up to make room for next card
          if (idx < mobileCardRefs.current.length - 1) {
            tl.to(
              cardEl,
              { y: "-20%", autoAlpha: 0, duration: 0.5, ease: "power2.in" },
              stepStart + 0.95
            );
          }
        });
      }

      // HOLD (4.7 -> 5.5): Full staircase locked in view before release
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

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      "Hi VictoryAdz! I'd like to get frame options and pricing for my photo."
    );
    window.open(`https://wa.me/919361312684?text=${message}`, "_blank");
  };

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      aria-label="How It Works Process"
      className="relative z-20 w-full h-screen min-h-[100dvh] bg-[#181818] text-white select-none overflow-hidden font-inter-display"
      style={{ fontFamily: "'Inter Display', sans-serif" }}
    >
      {/* Full Viewport Canvas for 151-frame sequence (Desktop & Mobile) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none block"
      />

      {/* Smooth gradient transition from Hero section background to soften the sharp edge */}
      <div className="absolute top-0 left-0 w-full h-32 sm:h-48 bg-gradient-to-b from-[#2C2C2C] to-transparent z-10 pointer-events-none" />
      
      {/* Smooth gradient transition at the bottom to soften edge into the next section (Brand Vision #2C2C2C) */}
      <div className="absolute bottom-0 left-0 w-full h-32 sm:h-48 bg-gradient-to-t from-[#2C2C2C] to-transparent z-10 pointer-events-none" />

      {/* Subtle overlay vignette for mobile contrast */}
      <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 z-0 pointer-events-none" />

      {/* ==================================================================== */}
      {/* DESKTOP VIEW (≥ 1024px): 100% Full Width 4-Quadrant Staircase Grid */}
      {/* ==================================================================== */}
      <div className="hidden lg:block relative w-full h-full z-10 pointer-events-none overflow-hidden">
        {/* Floating Hero Title Block (Right-aligned in top-right quadrant, static on arrival) */}
        <div
          ref={titleBlockRef}
          style={{
            position: "absolute",
            left: "54.16%",
            top: "7.8%",
            textAlign: "right",
          }}
          className="max-w-[580px] xl:max-w-[640px] pr-8 xl:pr-12 flex flex-col items-end text-right gap-4 xl:gap-[18px] z-20 opacity-100"
        >
          <h2 className="text-right select-none">
            <span className="block font-cal-sans text-[36px] xl:text-[48px] font-semibold text-white tracking-normal leading-[1.04]">
              Four Simple Steps,
            </span>
            <span className="block font-great-vibes text-[42px] xl:text-[56px] font-normal text-white pt-1 -mt-1 leading-[1.05]">
              Zero Confusion
            </span>
          </h2>

          <p
            className="text-[15px] xl:text-[17px] font-inter-display font-medium text-[#E8E8E8] leading-snug text-right"
            style={{ letterSpacing: "0.5px" }}
          >
            From your phone to your wall in 4 simple steps. No shop visit, no guesswork.
          </p>

          {/* CTA Button */}
          <div className="pt-2 flex items-center justify-end">
            <Button01
              text="Order on WhatsApp"
              onClick={handleWhatsAppOrder}
              ariaLabel="Order on WhatsApp"
              className="pointer-events-auto"
            />
          </div>
        </div>

        {/* 4 Staircase Grid Cells (Full Bleed: 2 Top-Left, 2 Bottom-Right) */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
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
                visibility: "hidden",
                opacity: 0,
                willChange: "transform, opacity",
              }}
              className="pointer-events-auto border border-white/50 backdrop-blur-[4px] p-6 lg:p-8 xl:p-10 flex flex-col justify-between"
            >
              {/* 4 Corner 7x7px White Dots */}
              <span className="absolute -top-[3.5px] -left-[3.5px] w-[7px] h-[7px] bg-white rounded-none pointer-events-none z-30" />
              <span className="absolute -top-[3.5px] -right-[3.5px] w-[7px] h-[7px] bg-white rounded-none pointer-events-none z-30" />
              <span className="absolute -bottom-[3.5px] -left-[3.5px] w-[7px] h-[7px] bg-white rounded-none pointer-events-none z-30" />
              <span className="absolute -bottom-[3.5px] -right-[3.5px] w-[7px] h-[7px] bg-white rounded-none pointer-events-none z-30" />

              <div className="w-full h-full flex flex-col justify-between">
                <div className="text-[32px] xl:text-[40px] font-semibold text-white tracking-tight leading-none">
                  {step.number}
                </div>

                <div className="w-full flex flex-col gap-3 xl:gap-[18px]">
                  <h3 className="text-[26px] lg:text-[30px] xl:text-[38px] font-semibold text-white tracking-tight leading-[1.08]">
                    {step.title}
                  </h3>
                  <p
                    className="text-[15px] lg:text-[16px] xl:text-[19px] font-inter-display font-medium text-white/95 leading-[1.3] text-pretty"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    {step.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MOBILE VIEW (< 1024px): Card Sequence Stack */}
      {/* ==================================================================== */}
      <div className="lg:hidden relative w-full h-full z-10 flex flex-col justify-between pt-16 xs:pt-20 sm:pt-24 pb-4 px-4 xs:px-5 select-none pointer-events-none">
        {/* Mobile Header Title */}
        <div
          ref={mobileHeaderRef}
          style={{
            transform: "translateY(0px)",
            opacity: 1,
            willChange: "transform, opacity",
          }}
          className="mobile-header-block flex flex-col items-center text-center gap-1.5 z-20"
        >
          <h2 className="text-center select-none">
            <span className="block font-cal-sans text-2xl xs:text-3xl font-semibold text-white tracking-normal leading-tight">
              Four Simple Steps,
            </span>
            <span className="block font-great-vibes text-3xl xs:text-4xl font-normal text-white pt-0.5 -mt-0.5 leading-tight">
              Zero Confusion
            </span>
          </h2>
          <p
            className="text-xs xs:text-[13px] font-inter-display font-medium text-[#E8E8E8]/90 leading-snug max-w-xs text-center"
            style={{ letterSpacing: "0.5px" }}
          >
            From your phone to your wall in 4 simple steps. No shop visit needed.
          </p>
          <div className="pt-1 flex items-center justify-center w-full">
            <Button01
              text="Order on WhatsApp"
              onClick={handleWhatsAppOrder}
              ariaLabel="Order on WhatsApp"
              className="pointer-events-auto"
            />
          </div>
        </div>

        {/* Mobile Card Container (Positioned in bottom half of viewport) */}
        <div className="relative w-full h-[210px] xs:h-[235px] sm:h-[260px] mb-2 xs:mb-3 mt-auto pointer-events-none overflow-hidden">
          {STEPS.map((step, idx) => (
            <div
              key={step.number}
              ref={(el) => {
                mobileCardRefs.current[idx] = el;
              }}
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.45)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                visibility: "hidden",
                opacity: 0,
                willChange: "transform, opacity",
              }}
              className="absolute inset-0 w-full h-full pointer-events-auto border border-white/40 backdrop-blur-[6px] p-5 xs:p-6 sm:p-7 flex flex-col justify-between shadow-2xl"
            >
              {/* 4 Corner 7x7px White Dots */}
              <span className="absolute -top-[3.5px] -left-[3.5px] w-[7px] h-[7px] bg-white rounded-none pointer-events-none" />
              <span className="absolute -top-[3.5px] -right-[3.5px] w-[7px] h-[7px] bg-white rounded-none pointer-events-none" />
              <span className="absolute -bottom-[3.5px] -left-[3.5px] w-[7px] h-[7px] bg-white rounded-none pointer-events-none" />
              <span className="absolute -bottom-[3.5px] -right-[3.5px] w-[7px] h-[7px] bg-white rounded-none pointer-events-none" />

              <div className="text-2xl xs:text-3xl font-semibold text-white leading-none">
                {step.number}
              </div>

              <div className="flex flex-col gap-1.5 xs:gap-2">
                <h3 className="text-lg xs:text-xl sm:text-2xl font-semibold text-white tracking-tight leading-tight">
                  {step.title}
                </h3>
                <p className="text-[11px] xs:text-xs sm:text-sm font-medium text-white/90 leading-relaxed text-pretty">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
