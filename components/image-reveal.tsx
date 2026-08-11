"use client";

import React, { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

interface ImageRevealProps {
  children: ReactNode;
  /** Extra CSS classes for the outer wrapper */
  className?: string;
  /** Delay before the reveal starts (seconds) */
  delay?: number;
  /** Duration of the reveal animation (seconds) */
  duration?: number;
  /** IntersectionObserver margin — same format as rootMargin */
  margin?: `${number}px ${number}px ${number}px ${number}px`;
}

const HIDDEN = "polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)";
const VISIBLE = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

/**
 * Wraps any content (typically an <Image />) and reveals it from
 * the **bottom-left corner expanding to the full rectangle** the
 * first time it enters the viewport.
 *
 * Uses Framer Motion's `useInView` (compatible with Lenis smooth
 * scroll) and `motion.div` animate for buttery clip-path transitions.
 */
export const ImageReveal: React.FC<ImageRevealProps> = ({
  children,
  className = "",
  delay = 0,
  duration = 1.2,
  margin = "0px 0px -50px 0px",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ clipPath: HIDDEN }}
      animate={{ clipPath: isInView ? VISIBLE : HIDDEN }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        willChange: "clip-path",
        WebkitClipPath: isInView ? VISIBLE : HIDDEN,
      }}
    >
      {children}
    </motion.div>
  );
};
