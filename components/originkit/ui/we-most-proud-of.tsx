"use client";

import React, { useState, useRef, useEffect, memo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ImageReveal } from "@/components/image-reveal";
import { Button } from "@/components/originkit/ui/hero-03/button";
import ScrollHighlight from "@/components/originkit/ui/scroll-text-highlight";
import SocialButton from "@/components/originkit/ui/social-button";
import TiltedCard from "@/components/TiltedCard";
import siteData from "@/data/site-images.json";

export interface WorkItem {
  id: string;
  image: string;
  number: string;
  firstName: string;
  lastName: string;
  label?: string;
  title?: string;
  date: string;
  credits: string;
}

export const WeMostProudOf: React.FC = () => {
  const [items, setItems] = useState<WorkItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tiltState, setTiltState] = useState<{ [key: string]: { rotateX: number; rotateY: number } }>({});
  const [smoothScrollProgress, setSmoothScrollProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const targetScrollProgressRef = useRef(0);
  const currentScrollProgressRef = useRef(0);

  // Fetch dynamic items from /api/site-data
  useEffect(() => {
    fetch("/api/site-data")
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        if (data?.exploreGallery && Array.isArray(data.exploreGallery)) {
          const mapped: WorkItem[] = data.exploreGallery.map((item: any) => ({
            id: item.id || String(Math.random()),
            image: item.image || item.src,
            number: item.number || "[ 00 ]",
            firstName: item.label || item.firstName || "",
            lastName: item.title || item.lastName || "",
            label: item.label || item.firstName || "",
            title: item.title || item.lastName || "",
            date: item.date || "November 2019",
            credits: item.credits || "PHOTOGRAPH BY VICTORYADZ",
          }));
          setItems(mapped);
        }
      })
      .catch(() => {
        setIsLoading(false);
        const fallback: WorkItem[] = (siteData.exploreGallery || []).map((item: any) => ({
          id: item.id,
          image: item.image,
          number: item.number,
          firstName: item.label || item.firstName || "",
          lastName: item.title || item.lastName || "",
          label: item.label || item.firstName || "",
          title: item.title || item.lastName || "",
          date: item.date,
          credits: item.credits,
        }));
        setItems(fallback);
      });
  }, []);

  const WORK_ITEMS = items.length > 0 ? items : (siteData.exploreGallery || []).map((item: any) => ({
    id: item.id,
    image: item.image,
    number: item.number,
    firstName: item.label || item.firstName || "",
    lastName: item.title || item.lastName || "",
    label: item.label || item.firstName || "",
    title: item.title || item.lastName || "",
    date: item.date,
    credits: item.credits,
  }));

  const displayedItems = WORK_ITEMS.slice(0, 15);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedItem(null);
      }
    };

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("detail-modal", { detail: { open: !!selectedItem } }));
      if (selectedItem) {
        window.addEventListener("keydown", handleKeyDown);
        if ((window as any).lenis) {
          (window as any).lenis.stop();
        }
        document.body.style.overflow = "hidden";
      } else {
        if ((window as any).lenis) {
          (window as any).lenis.start();
        }
        document.body.style.overflow = "";
      }
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("keydown", handleKeyDown);
        if ((window as any).lenis) {
          (window as any).lenis.start();
        }
        document.body.style.overflow = "";
      }
    };
  }, [selectedItem]);

  const handleItemClick = (item: WorkItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  // FlyingPosters momentum lerp scroll progress loop (throttled to avoid idle re-renders)
  useEffect(() => {
    let animId: number;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const total = rect.height + windowHeight;
      const current = windowHeight - rect.top;
      const rawProgress = Math.max(0, Math.min(1, current / total));
      targetScrollProgressRef.current = rawProgress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const loop = () => {
      const diff = targetScrollProgressRef.current - currentScrollProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        currentScrollProgressRef.current += diff * 0.08;
        setSmoothScrollProgress(currentScrollProgressRef.current);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Global mouse position tracking for floating VIEW cursor badge
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  // Card 3D tilt calculation on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setTiltState((prev) => ({
      ...prev,
      [id]: { rotateX, rotateY },
    }));
  };

  const handleMouseLeave = (id: string) => {
    setTiltState((prev) => ({
      ...prev,
      [id]: { rotateX: 0, rotateY: 0 },
    }));
    setHoveredId(null);
  };

  return (
    <section
      id="recent-works"
      className="relative w-full bg-[#2C2C2C] text-white font-inter-display select-none py-6 sm:py-10 md:py-16 overflow-hidden"
    >
      <span id="works" className="sr-only" aria-hidden="true" />
      {/* Floating Cursor Badge: [ ↗ ] [ VIEW ] */}
      <AnimatePresence>
        {hoveredId !== null && !selectedItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              left: mousePos.x,
              top: mousePos.y,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              zIndex: 9999,
            }}
            className="hidden lg:flex items-center shadow-2xl drop-shadow-2xl"
          >
            {/* Arrow Square Box */}
            <div className="w-7 h-7 bg-black text-white flex items-center justify-center text-xs font-mono font-bold">
              ↗
            </div>
            {/* VIEW Text Box */}
            <div className="h-7 px-3 bg-white text-black flex items-center justify-center text-xs font-mono font-bold tracking-widest uppercase">
              VIEW
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full px-4 sm:px-6 md:px-[60px] lg:px-[60px]">
        {/* Top Header Row */}
        <div className="flex items-center justify-between pt-4 pb-4 sm:pt-8 sm:pb-8 md:pt-14 md:pb-14">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2.5 w-2.5 bg-white rounded-none" />
            <ScrollHighlight
              className="text-xs md:text-sm font-semibold tracking-[0.25em] text-white uppercase"
              font={{ fontSize: "14px", letterSpacing: "0.25em" }}
              splitBy="characters"
              scrollStart="top 90%"
              scrollEnd="top 75%"
              dimColor="rgba(255, 255, 255, 0.2)"
              highlightColor="#FFFFFF"
            >
              FEATURED FRAMES &amp; GALLERY
            </ScrollHighlight>
          </div>

          <a href="/works" className="block" aria-label="View full gallery">
            <Button variant="secondary" className="px-5 sm:px-6 uppercase tracking-widest text-xs touch-manipulation">
              VIEW FULL GALLERY
            </Button>
          </a>
        </div>

        <div
          ref={containerRef}
          className="pb-6 sm:pb-10 md:pb-20"
          style={{ perspective: "1200px" }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 w-full gap-3 sm:gap-6 md:gap-8 lg:gap-6 lg:gap-y-12">
            {displayedItems.map((item, idx) => {
              const tilt = tiltState[item.id] || { rotateX: 0, rotateY: 0 };
              const isHovered = hoveredId === item.id;
              const someoneHovered = hoveredId !== null;
              const dimmed = someoneHovered && !isHovered;
              const colIdx = idx % 5;
              // Smooth scroll parallax offset per column (in px)
              const colOffsets = [-25, 20, -30, 25, -15];
              const offset = colOffsets[colIdx];

              return (
                <GridItemWithParallax
                  key={item.id}
                  item={item}
                  idx={idx}
                  tilt={tilt}
                  isHovered={isHovered}
                  dimmed={dimmed}
                  offset={offset}
                  smoothScrollProgress={smoothScrollProgress}
                  setHoveredId={setHoveredId}
                  handleMouseMove={handleMouseMove}
                  handleMouseLeave={handleMouseLeave}
                  handleItemClick={handleItemClick}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Editorial Work Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            key="work-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-label={selectedItem ? `${selectedItem.label || selectedItem.firstName} ${selectedItem.title || selectedItem.lastName}` : "Work details"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex flex-row p-0 m-0 w-full h-full overflow-hidden bg-[#2C2C2C] pointer-events-auto"
            style={{ backgroundColor: "#2C2C2C", perspective: "1500px" }}
          >
            {/* Dark Backdrop overlay for click outside */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={handleCloseModal}
              className="absolute inset-0 z-0 bg-[#2C2C2C]" style={{ backgroundColor: "#2C2C2C" }}
            />

            {/* --- DESKTOP LEFT PANEL (Clean 3:4 Options, No Background, No Border) --- */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              data-lenis-prevent="true"
              style={{
                overscrollBehavior: "contain",
                touchAction: "pan-y",
              }}
              className="hidden lg:flex relative flex-col w-20 lg:w-24 p-0 gap-0 overflow-y-auto no-scrollbar shrink-0 h-full z-20 transform-gpu will-change-transform pointer-events-auto bg-transparent border-0"
            >
              {WORK_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  aria-label={`Select ${item.label || item.firstName} ${item.title || item.lastName}`}
                  className={`relative aspect-[3/4] w-full shrink-0 overflow-hidden transition-all duration-200 cursor-pointer rounded-none border-0 bg-transparent ${
                    selectedItem.id === item.id
                      ? "brightness-100 opacity-100 shadow-md"
                      : "brightness-[0.4] opacity-40 hover:brightness-95 hover:opacity-90"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.lastName || "Work item"}
                    fill
                    sizes="96px"
                    className="object-cover object-center"
                  />
                </button>
              ))}
            </motion.div>

            {/* --- DESKTOP / MOBILE CENTER CONTAINER (TiltedCard) --- */}
            <div className="relative flex-1 h-full overflow-hidden flex items-center justify-center p-0 lg:p-2 z-10 pointer-events-auto bg-transparent">
              <TiltedCard
                imageSrc={selectedItem.image}
                altText={selectedItem.title || selectedItem.lastName || "Work detail image"}
                captionText={selectedItem.credits || (selectedItem.label ? `${selectedItem.label} · ${selectedItem.title}` : selectedItem.lastName)}
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="92vh"
                imageWidth="min(calc(92vh * 0.75), 680px)"
                rotateAmplitude={10}
                scaleOnHover={1.03}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={false}
              />
            </div>

            {/* --- DESKTOP RIGHT PANEL (420px width flex child) --- */}
            <div className="hidden lg:flex relative w-[420px] h-full shrink-0 z-20 overflow-hidden transform-gpu will-change-transform">
              {/* Pre-layer 1 (Deep Obsidian) */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.18 } }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0 }}
                className="absolute inset-0 bg-[#09090b] shadow-2xl z-10 border-l border-white/10 transform-gpu will-change-transform"
              />
              
              {/* Pre-layer 2 (Charcoal Grey) */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.12 } }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                className="absolute inset-0 bg-[#3f3f46] shadow-2xl z-20 border-l border-white/20 transform-gpu will-change-transform"
              />

              {/* Pre-layer 3 (Silver Grey) */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.06 } }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
                className="absolute inset-0 bg-[#a1a1aa] shadow-2xl z-30 border-l border-black/10 transform-gpu will-change-transform"
              />

              {/* Main Panel Content */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0 } }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
                className="absolute inset-0 flex flex-col bg-[#FFFFFF] text-black p-6 lg:p-12 justify-between z-40 shadow-2xl transform-gpu will-change-transform"
              >
                {/* Top Meta Row */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.34 }}
                  className="flex items-start justify-between w-full"
                >
                  <div className="flex flex-col gap-2 font-sans">
                    <span className="font-mono text-xs text-black/70 tracking-wider">{selectedItem.number}</span>
                    <span className="font-sans text-xs text-black/70 font-normal tracking-wide">{selectedItem.date}</span>
                    <span className="font-sans text-[11px] text-black/60 font-normal uppercase tracking-wider">{selectedItem.credits}</span>
                  </div>
                  <button onClick={handleCloseModal} aria-label="Close" className="w-7 h-7 bg-black text-white flex items-center justify-center text-xs font-mono hover:bg-neutral-800 transition-colors cursor-pointer shrink-0">✕</button>
                </motion.div>

                {/* Bottom Left Title */}
                <div className="mt-auto pt-10 flex flex-col gap-1 overflow-hidden">
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.40 }}
                    className="font-serif text-xl md:text-2xl lg:text-3xl text-neutral-800 font-normal"
                  >
                    {selectedItem.label || selectedItem.firstName}
                  </motion.p>
                  <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.46 }}
                    className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-black uppercase leading-none break-words"
                  >
                    {selectedItem.title || selectedItem.lastName}
                  </motion.h2>
                  <div className="pt-6">
                    <SocialButton />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* --- MOBILE TOP HEADER --- */}
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex lg:hidden absolute top-0 left-0 right-0 flex-col gap-1.5 p-4 sm:p-5 bg-black/90 backdrop-blur-md shrink-0 z-20"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-0.5 font-sans">
                  <span className="text-xs text-white/80 tracking-wide font-normal">{selectedItem.date}</span>
                  <span className="text-[11px] text-white/60 font-normal uppercase tracking-wider">{selectedItem.credits}</span>
                </div>
                <button
                  onClick={handleCloseModal}
                  aria-label="Close"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] bg-white/15 active:bg-white/30 text-white flex items-center justify-center text-sm font-mono transition-colors cursor-pointer rounded-none touch-manipulation"
                >
                  ✕
                </button>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white uppercase mt-2 leading-none">{selectedItem.title || selectedItem.lastName}</h2>
            </motion.div>

            {/* --- MOBILE BOTTOM THUMBNAILS (No Background, No Border) --- */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              data-lenis-prevent="true"
              style={{ overscrollBehaviorX: "contain", touchAction: "pan-x" }}
              className="flex lg:hidden absolute bottom-0 left-0 right-0 items-center gap-0 overflow-x-auto no-scrollbar p-0 bg-transparent border-0 shrink-0 z-20 pointer-events-auto"
            >
              {WORK_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`relative aspect-[3/4] w-12 sm:w-14 overflow-hidden flex-none transition-all duration-200 cursor-pointer rounded-none border-0 ${
                    selectedItem.id === item.id ? "brightness-100 opacity-100" : "brightness-[0.4] opacity-40 hover:opacity-80"
                  }`}
                >
                  <Image src={item.image} alt={item.lastName} fill sizes="56px" className="object-cover object-center" />
                </button>
              ))}
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

interface GridItemWithParallaxProps {
  item: WorkItem;
  idx: number;
  tilt: { rotateX: number; rotateY: number };
  isHovered: boolean;
  dimmed: boolean;
  offset: number;
  smoothScrollProgress: number;
  setHoveredId: (id: string | null) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>, id: string) => void;
  handleMouseLeave: (id: string) => void;
  handleItemClick: (item: WorkItem) => void;
}

const GridItemWithParallax: React.FC<GridItemWithParallaxProps> = memo(({
  item,
  idx,
  tilt,
  isHovered,
  dimmed,
  offset,
  smoothScrollProgress,
  setHoveredId,
  handleMouseMove,
  handleMouseLeave,
  handleItemClick,
}) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // FlyingPosters smooth lerp gliding parallax offset calculation
  const parallaxY = (smoothScrollProgress - 0.5) * offset * 3.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.7,
        delay: (idx % 5) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={idx >= 8 ? "hidden lg:block w-full" : "w-full"}
    >
      <motion.div
        onMouseEnter={() => setHoveredId(item.id)}
        onMouseMove={(e) => handleMouseMove(e, item.id)}
        onMouseLeave={() => handleMouseLeave(item.id)}
        onClick={() => handleItemClick(item)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleItemClick(item);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${item.label || item.firstName} ${item.title || item.lastName}`}
        animate={{
          opacity: dimmed ? 0.4 : 1,
          scale: 1,
          rotateX: isDesktop ? tilt.rotateX : 0,
          rotateY: isDesktop ? tilt.rotateY : 0,
        }}
        transition={{
          opacity: { duration: 0.45, ease: [0.76, 0, 0.24, 1] },
          rotateX: { duration: 0.12, ease: "easeOut" },
          rotateY: { duration: 0.12, ease: "easeOut" },
        }}
        style={{
          transformStyle: "preserve-3d",
          y: isDesktop ? parallaxY : 0,
        }}
        className="relative lg:cursor-none w-full flex justify-center focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
      >
        <div className="flex flex-col items-start gap-2.5 w-full lg:w-[166px]">
          <ImageReveal
            className="relative overflow-hidden bg-[#363636] w-full aspect-[3/4] lg:h-[221px] rounded-none transform-gpu will-change-transform"
            delay={(idx % 5) * 0.05}
            duration={1.0}
          >
            <div
              style={{ transformStyle: "preserve-3d" }}
              className="relative w-full h-full"
            >
              <Image
                src={item.image}
                alt={item.lastName}
                fill
                priority={idx < 5}
                className="object-cover object-center pointer-events-none"
                sizes="(max-width: 640px) 140px, (max-width: 1024px) 25vw, 166px"
              />

              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  background: isHovered
                    ? "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, transparent 100%)"
                    : "linear-gradient(135deg, transparent 0%, transparent 100%)",
                }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </ImageReveal>

          <div className="flex flex-col text-left w-full">
            <span className="text-[10px] sm:text-xs font-semibold text-white/90 tracking-wider uppercase truncate">
              {item.label || item.firstName} {item.title || item.lastName}
            </span>
            <span className="text-[9px] sm:text-[10px] text-white/50 tracking-widest font-mono">
              {item.number}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

GridItemWithParallax.displayName = "GridItemWithParallax";
