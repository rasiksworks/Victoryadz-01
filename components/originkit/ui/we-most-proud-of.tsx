"use client";

import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { gsap } from "gsap";
import { ImageReveal } from "@/components/image-reveal";
import LiquidHover from "@/components/originkit/ui/liquid-distortion";
import MaskTextReveal from "@/components/originkit/ui/mask-text-reveal";
import ScrollHighlight from "@/components/originkit/ui/scroll-text-highlight";
import { Button } from "@/components/originkit/ui/hero-03/button";
import siteData from "@/data/site-images.json";

export interface WorkItem {
  id: string;
  number: string;
  firstName: string;
  lastName: string;
  date: string;
  credits: string;
  image: string;
  aspect?: string;
}

export const WORK_ITEMS: WorkItem[] = siteData.recentWorks;

// Native Framer Motion spring physics for ultra-smooth 60fps GPU-accelerated shared layout scaling
const SHARED_TRANSITION = {
  type: "spring" as const,
  stiffness: 350,
  damping: 35,
  mass: 0.8,
};

// Lerp helper function for smooth gliding momentum
function lerp(start: number, end: number, ease: number) {
  return start + (end - start) * ease;
}

export const WeMostProudOf: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // FlyingPosters Lerp Scroll Engine State
  const scrollRef = useRef({
    ease: 0.08, // Smooth gliding ease momentum
    current: 0,
    target: 0,
  });

  const [smoothScrollProgress, setSmoothScrollProgress] = useState(0);

  // 1. Continuous requestAnimationFrame loop interpolating scroll.current toward scroll.target
  useEffect(() => {
    let animFrameId: number;

    const updateScroll = () => {
      // PERFORMANCE FIX: Pause React state re-renders when modal is open
      if (!selectedItem) {
        const next = lerp(
          scrollRef.current.current,
          scrollRef.current.target,
          scrollRef.current.ease
        );

        if (Math.abs(next - scrollRef.current.current) > 0.0001) {
          scrollRef.current.current = next;
          setSmoothScrollProgress(next);
        }
      }
      animFrameId = requestAnimationFrame(updateScroll);
    };

    animFrameId = requestAnimationFrame(updateScroll);
    return () => cancelAnimationFrame(animFrameId);
  }, [selectedItem]);

  // 2. Scroll event listener ONLY updates scroll.target (destination), NEVER scroll.current directly!
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const total = window.innerHeight + rect.height;
        const rawProgress = (window.innerHeight - rect.top) / total;
        
        scrollRef.current.target = Math.max(0, Math.min(1, rawProgress));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleItemClick = useCallback((item: WorkItem) => {
    setSelectedItem(item);
    setIsClosing(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setSelectedItem(null);

    setTimeout(() => {
      setIsClosing(false);
    }, 600); // Debounce clicking
  }, [isClosing]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Esc") {
        handleCloseModal();
      }
    };

    if (selectedItem) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItem, handleCloseModal]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tiltState, setTiltState] = useState<{ [key: string]: { rotateX: number; rotateY: number } }>({});

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTiltState((prev) => ({ ...prev, [id]: { rotateX, rotateY } }));
  }, []);

  const handleMouseLeave = useCallback((id: string) => {
    setHoveredId(null);
    setTiltState((prev) => ({ ...prev, [id]: { rotateX: 0, rotateY: 0 } }));
  }, []);

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleGlobalMouseMove = useCallback((e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <section
      id="recent-works"
      onMouseMove={handleGlobalMouseMove}
      className="relative w-full bg-[#2C2C2C] text-white font-inter-display select-none overflow-hidden"
    >
      {/* Floating VIEW Cursor Badge */}
      <AnimatePresence>
        {hoveredId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              left: cursorPos.x,
              top: cursorPos.y,
              transform: "translate(-50%, -50%)",
            }}
            className="fixed pointer-events-none z-50 flex items-center gap-1 shadow-2xl mix-blend-difference"
          >
            {/* Square Arrow Box */}
            <div className="w-7 h-7 bg-white text-black flex items-center justify-center text-xs font-mono font-bold">
              ↗
            </div>
            {/* VIEW Text Box */}
            <div className="h-7 px-3 bg-white text-black flex items-center justify-center text-xs font-mono font-bold tracking-widest uppercase">
              VIEW
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full px-6 md:px-[60px] lg:px-[60px]">
        {/* Top Header Row */}
        <div className="flex items-center justify-between pt-10 pb-10 md:pt-14 md:pb-14">
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
              RECENT WORK'S
            </ScrollHighlight>
          </div>

          <a href="/works" className="block">
            <Button variant="secondary" className="px-6 uppercase tracking-widest text-xs">
              EXPLORE ALL
            </Button>
          </a>
        </div>

        <div
          ref={containerRef}
          className="pb-14 md:pb-20"
          style={{ perspective: "1200px" }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 w-full gap-6 md:gap-8 lg:gap-6 lg:gap-y-12">
            {WORK_ITEMS.map((item, idx) => {
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex flex-row p-0 m-0 w-screen h-screen overflow-hidden bg-transparent pointer-events-auto"
            style={{ perspective: "1500px" }}
          >
            {/* Dark Backdrop overlay for click outside */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={handleCloseModal}
              className="absolute inset-0 z-0 bg-[#141414]/90 backdrop-blur-xl"
            />

            {/* --- DESKTOP LEFT PANEL (64px width flex child) --- */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex relative flex-col w-14 lg:w-16 bg-[#1c1c1c] p-0 gap-0 overflow-y-auto no-scrollbar shrink-0 h-full z-20 transform-gpu will-change-transform"
            >
              {WORK_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`relative aspect-[3/4] w-full overflow-hidden transition-all duration-300 cursor-pointer rounded-none border-0 ${
                    selectedItem.id === item.id
                      ? "brightness-100 opacity-100"
                      : "brightness-[0.45] opacity-50 hover:brightness-90 hover:opacity-90"
                  }`}
                >
                  <Image src={item.image} alt={item.lastName} fill unoptimized className="object-cover object-center" />
                </button>
              ))}
            </motion.div>

            {/* --- DESKTOP / MOBILE CENTER CONTAINER --- */}
            <div className="relative flex-1 h-full overflow-hidden flex items-center justify-center p-4 md:p-8 z-10 pointer-events-none">
              {/* Scale + fade enter/exit — no layoutId to avoid size flash on close */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-auto h-[60vh] md:h-[80vh] lg:h-[92vh] aspect-[3/4] overflow-hidden pointer-events-auto shadow-2xl bg-[#363636] transform-gpu will-change-transform"
              >
                <LiquidHover
                  imageSrc={selectedItem.image}
                  resolution={10}
                  cursorSize={50}
                  intensity={50}
                />
              </motion.div>
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
                    {selectedItem.firstName}
                  </motion.p>
                  <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.46 }}
                    className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-black uppercase leading-none break-words"
                  >
                    {selectedItem.lastName}
                  </motion.h2>
                </div>
              </motion.div>
            </div>

            {/* --- MOBILE TOP HEADER --- */}
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex lg:hidden absolute top-0 left-0 right-0 flex-col gap-1.5 p-5 bg-black shrink-0 z-20"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-0.5 font-sans">
                  <span className="text-xs text-white/80 tracking-wide font-normal">{selectedItem.date}</span>
                  <span className="text-[11px] text-white/60 font-normal uppercase tracking-wider">{selectedItem.credits}</span>
                </div>
                <button onClick={handleCloseModal} aria-label="Close" className="w-8 h-8 bg-white/15 text-white flex items-center justify-center text-xs font-mono hover:bg-white/30 transition-colors cursor-pointer rounded-none">✕</button>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase mt-2 leading-none">{selectedItem.lastName}</h2>
            </motion.div>

            {/* --- MOBILE BOTTOM THUMBNAILS --- */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex lg:hidden absolute bottom-0 left-0 right-0 items-center gap-1.5 overflow-x-auto no-scrollbar p-2 bg-black border-t border-white/10 shrink-0 z-20"
            >
              {WORK_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`relative aspect-[3/4] w-12 sm:w-14 overflow-hidden flex-none transition-all duration-200 cursor-pointer rounded-none border-0 ${
                    selectedItem.id === item.id ? "brightness-100 opacity-100" : "brightness-[0.4] opacity-40 hover:opacity-80"
                  }`}
                >
                  <Image src={item.image} alt={item.lastName} fill unoptimized className="object-cover object-center" />
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
      className="w-full"
    >
      <motion.div
        onMouseEnter={() => setHoveredId(item.id)}
        onMouseMove={(e) => handleMouseMove(e, item.id)}
        onMouseLeave={() => handleMouseLeave(item.id)}
        onClick={() => handleItemClick(item)}
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
        className="relative cursor-none w-full flex justify-center"
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
              {item.firstName} {item.lastName}
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
