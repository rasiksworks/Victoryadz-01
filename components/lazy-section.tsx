"use client";

import React, { useRef, useState, useEffect } from "react";
import { useInView, UseInViewOptions } from "framer-motion";

interface LazySectionProps {
  children: React.ReactNode;
  /** Estimated height of the section to prevent layout shifting before it loads */
  height?: string;
  /** How far in advance to start loading (default: 1.5 screen heights) */
  margin?: string;
}

export const LazySection: React.FC<LazySectionProps> = ({ 
  children, 
  height = "100vh",
  margin = "150% 0px"
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  // Trigger when the element comes within 'margin' distance of the viewport
  const isInView = useInView(ref, { once: true, margin: margin as any });

  useEffect(() => {
    if (isInView && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [isInView, hasLoaded]);

  return (
    <div ref={ref} style={{ minHeight: hasLoaded ? "auto" : height }} className="w-full relative">
      {hasLoaded ? children : null}
    </div>
  );
};
