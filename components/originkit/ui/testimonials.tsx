"use client";

import React, { useState, useRef, useCallback, memo } from "react";
import { motion } from "framer-motion";
import MaskTextReveal from "@/components/originkit/ui/mask-text-reveal";
import ScrollHighlight from "@/components/originkit/ui/scroll-text-highlight";

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  location: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote: "I was nervous sending my only copy of my parents' wedding photo, but the WhatsApp updates put me at ease. The final frame is gorgeous.",
    name: "Priya",
    location: "Nagercoil",
  },
  {
    id: "t2",
    quote: "Exceptional quality. They walked me through the lamination choices on WhatsApp before printing. It arrived in perfect condition.",
    name: "Arun",
    location: "Trivandrum",
  },
  {
    id: "t3",
    quote: "The packaging was incredibly secure. Even being so far away, I felt like I was in the shop picking out the frame myself.",
    name: "Lakshmi",
    location: "Chennai",
  },
  {
    id: "t4",
    quote: "The attention to detail is amazing. It's not just a photo frame, it's a piece of art that completely transformed our living room.",
    name: "Karthik",
    location: "Madurai",
  },
];

export const Testimonials: React.FC = () => {
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tiltState, setTiltState] = useState<{ [key: string]: { rotateX: number; rotateY: number } }>({});

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -6;
    const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 6;
    setTiltState((prev) => ({ ...prev, [id]: { rotateX, rotateY } }));
  }, []);

  const handleMouseLeave = useCallback((id: string) => {
    setHoveredId(null);
    setTiltState((prev) => ({ ...prev, [id]: { rotateX: 0, rotateY: 0 } }));
  }, []);

  // Drag-to-scroll for mobile carousel only
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollTrackRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollTrackRef.current.offsetLeft;
    scrollLeft.current = scrollTrackRef.current.scrollLeft;
  };
  const handleMouseUpOrLeave = () => { isDragging.current = false; };
  const handleDragMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollTrackRef.current) return;
    e.preventDefault();
    const walk = (e.pageX - scrollTrackRef.current.offsetLeft - startX.current) * 1.5;
    scrollTrackRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <section
      id="testimonials"
      className="relative w-full bg-[#2C2C2C] text-white font-inter-display select-none py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden"
    >
      <div className="w-full flex flex-col gap-6 sm:gap-8 md:gap-14">

        {/* Header */}
        <div className="w-full px-4 sm:px-6 md:px-[60px] lg:px-[60px] flex flex-col items-start gap-2 sm:gap-3 max-w-2xl">
          <span className="text-xs text-white/50 tracking-[0.2em] font-mono uppercase block">
            [ WHAT CLIENTS SAY ]
          </span>
          <MaskTextReveal
            tag="h2"
            direction="center-horizontal"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1]"
          >
            Trusted from Near and Far
          </MaskTextReveal>
          <ScrollHighlight className="text-xs sm:text-sm md:text-base text-white/70 font-light leading-relaxed mt-1 block">
            Real stories from customers who trusted us with their memories.
          </ScrollHighlight>
        </div>

        {/* Cards — mobile: horizontal scroll carousel, desktop: 4-col grid (no horizontal scroll) */}
        <div className="w-full lg:px-[60px]">
          <div
            ref={scrollTrackRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseUpOrLeave}
            onMouseUp={handleMouseUpOrLeave}
            onMouseMove={handleDragMouseMove}
            style={{ touchAction: "pan-x pan-y", overscrollBehaviorX: "contain" }}
            className="flex lg:grid lg:grid-cols-4 overflow-x-auto lg:overflow-visible gap-4 sm:gap-6 lg:gap-6 snap-x snap-mandatory lg:snap-none no-scrollbar w-full py-4 cursor-grab active:cursor-grabbing select-none"
          >
            {/* Mobile leading spacer */}
            <div className="w-4 md:w-9 lg:hidden shrink-0 pointer-events-none" aria-hidden="true" />

            {TESTIMONIALS.map((item, idx) => (
              <TestimonialCard
                key={item.id}
                item={item}
                idx={idx}
                tilt={tiltState[item.id] || { rotateX: 0, rotateY: 0 }}
                isHovered={hoveredId === item.id}
                dimmed={hoveredId !== null && hoveredId !== item.id}
                setHoveredId={setHoveredId}
                handleMouseMove={handleMouseMove}
                handleMouseLeave={handleMouseLeave}
              />
            ))}

            {/* Mobile trailing spacer */}
            <div className="w-4 md:w-9 lg:hidden shrink-0 pointer-events-none" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
};

interface TestimonialCardProps {
  item: Testimonial;
  idx: number;
  tilt: { rotateX: number; rotateY: number };
  isHovered: boolean;
  dimmed: boolean;
  setHoveredId: (id: string | null) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>, id: string) => void;
  handleMouseLeave: (id: string) => void;
}

const TestimonialCard: React.FC<TestimonialCardProps> = memo(({
  item,
  idx,
  tilt,
  isHovered,
  dimmed,
  setHoveredId,
  handleMouseMove,
  handleMouseLeave,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        delay: idx * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="w-[270px] sm:w-[320px] lg:w-full shrink-0 snap-start"
    >
      <motion.div
        onMouseEnter={() => setHoveredId(item.id)}
        onMouseMove={(e) => handleMouseMove(e, item.id)}
        onMouseLeave={() => handleMouseLeave(item.id)}
        animate={{
          opacity: dimmed ? 0.4 : 1,
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
        }}
        transition={{
          opacity: { duration: 0.3 },
          rotateX: { duration: 0.12, ease: "easeOut" },
          rotateY: { duration: 0.12, ease: "easeOut" },
        }}
        style={{ transformStyle: "preserve-3d", transformPerspective: 900 }}
        className="relative w-full h-full transform-gpu will-change-transform"
      >
        <div className="relative overflow-hidden bg-[#363636] w-full min-h-[220px] sm:min-h-[240px] lg:aspect-[4/5] p-5 sm:p-6 lg:p-8 flex flex-col justify-between items-start text-left border border-white/10 rounded-sm shadow-xl">
          <div className="flex flex-col items-start text-left w-full">
            <span className="text-3xl sm:text-4xl font-serif text-white/20 leading-none mb-3">&ldquo;</span>
            <p className="font-light text-[13px] sm:text-sm lg:text-base leading-relaxed text-white/90">
              {item.quote}
            </p>
          </div>
          <div className="flex flex-col gap-0.5 mt-6 pt-3 border-t border-white/10 w-full">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">{item.name}</span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-white/40">{item.location}</span>
          </div>
          {/* Hover sheen — GPU opacity only, zero layout impact */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-sm"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 55%)" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
});

TestimonialCard.displayName = "TestimonialCard";
