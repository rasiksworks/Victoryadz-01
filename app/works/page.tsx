"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import DraggableGrid from "@/components/originkit/ui/draggable-grid";
import LiquidHover from "@/components/originkit/ui/liquid-distortion";
import MaskTextReveal from "@/components/originkit/ui/mask-text-reveal";
import { type WorkItem } from "@/components/originkit/ui/we-most-proud-of";
import siteData from "@/data/site-images.json";

const EXPLORE_ITEMS: WorkItem[] = siteData.exploreGallery;

export default function WorksPage() {
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Map EXPLORE_ITEMS to DraggableGrid format
  const gridItems = EXPLORE_ITEMS.map((item) => ({
    image: { src: item.image },
    alt: `${item.firstName} ${item.lastName}`,
    workItem: item,
  }));

  const handleItemClick = (gridItem: any, index: number) => {
    const item = EXPLORE_ITEMS[index % EXPLORE_ITEMS.length];
    setSelectedItem(item);
    setIsClosing(false);
  };

  const handleCloseModal = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setSelectedItem(null);

    setTimeout(() => {
      setIsClosing(false);
    }, 600);
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

  return (
    <main className="relative w-screen h-screen bg-[#2C2C2C] text-white font-inter-display select-none overflow-hidden flex flex-col">
      {/* Top Floating Navigation Bar */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-6 md:px-12 backdrop-blur-md bg-[#2C2C2C]/80 border-b border-white/10">
        <Link
          href="/#recent-works"
          className="group flex items-center gap-2 text-xs font-mono font-semibold tracking-widest text-white/70 hover:text-white transition-colors uppercase"
        >
          <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
          <span>BACK TO HOME</span>
        </Link>

        <MaskTextReveal
          tag="h1"
          direction="center-horizontal"
          className="text-sm md:text-base font-bold tracking-[0.25em] text-white uppercase text-center"
        >
          WORKS GALLERY
        </MaskTextReveal>

        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-white/50 tracking-widest uppercase">
          <span>[ DRAG CANVAS TO EXPLORE ]</span>
        </div>
      </header>

      {/* Full-Screen Interactive Draggable Grid Container */}
      <div className="w-full h-full pt-20">
        <DraggableGrid
          items={gridItems}
          columns={12}
          imageWidth={166}
          imageHeight={221}
          rounded={0}
          gap={20}
          enableWheel={true}
          placeholderColor="#1f1f1f"
          onItemClick={handleItemClick}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Editorial Work Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            key="work-detail-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex flex-row p-0 m-0 w-screen h-screen overflow-hidden bg-transparent pointer-events-auto"
            style={{ perspective: "1500px" }}
          >
            {/* Dark Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={handleCloseModal}
              className="absolute inset-0 z-0 bg-[#141414]/90 backdrop-blur-xl"
            />

            {/* --- DESKTOP LEFT PANEL --- */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex relative flex-col w-14 lg:w-16 bg-[#1c1c1c] p-0 gap-0 overflow-y-auto no-scrollbar shrink-0 h-full z-20 transform-gpu will-change-transform"
            >
              {EXPLORE_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
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

            {/* --- CENTER CONTAINER --- */}
            <div className="relative flex-1 h-full overflow-hidden flex items-center justify-center p-4 md:p-8 z-10 pointer-events-none">
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

            {/* --- DESKTOP RIGHT PANEL --- */}
            <div className="hidden lg:flex relative w-[420px] h-full shrink-0 z-20 overflow-hidden transform-gpu will-change-transform">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex flex-col bg-[#FFFFFF] text-black p-6 lg:p-12 justify-between z-40 shadow-2xl transform-gpu will-change-transform"
              >
                {/* Top Meta Row */}
                <div className="flex items-start justify-between w-full">
                  <div className="flex flex-col gap-2 font-sans">
                    <span className="font-mono text-xs text-black/70 tracking-wider">{selectedItem.number}</span>
                    <span className="font-sans text-xs text-black/70 font-normal tracking-wide">{selectedItem.date}</span>
                    <span className="font-sans text-[11px] text-black/60 font-normal uppercase tracking-wider">{selectedItem.credits}</span>
                  </div>
                  <button onClick={handleCloseModal} aria-label="Close" className="w-7 h-7 bg-black text-white flex items-center justify-center text-xs font-mono hover:bg-neutral-800 transition-colors cursor-pointer shrink-0">✕</button>
                </div>

                {/* Bottom Left Title */}
                <div className="mt-auto pt-10 flex flex-col gap-1 overflow-hidden">
                  <p className="font-serif text-xl md:text-2xl lg:text-3xl text-neutral-800 font-normal">
                    {selectedItem.firstName}
                  </p>
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-black uppercase leading-none break-words">
                    {selectedItem.lastName}
                  </h2>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
