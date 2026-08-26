"use client";

import React, { useEffect, useRef } from "react";

export function SmoothCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on desktop devices with fine pointer (mouse)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isHoveringInteractive = false;
    let isVisible = false;
    let isMoving = false;
    let rafId: number | null = null;
    let moveTimeout: ReturnType<typeof setTimeout> | null = null;

    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const updateLoop = () => {
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;

      ringX = lerp(ringX, mouseX, 0.18);
      ringY = lerp(ringY, mouseY, 0.18);

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${
        isHoveringInteractive ? 1.45 : 1
      })`;

      // Continue loop while ring is still moving towards cursor or mouse is actively moving
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1 || isMoving) {
        rafId = requestAnimationFrame(updateLoop);
      } else {
        rafId = null;
      }
    };

    const wakeLoop = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updateLoop);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        ringX = mouseX;
        ringY = mouseY;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }

      // Update dot directly at instant speed
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

      isMoving = true;
      if (moveTimeout) clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isMoving = false;
      }, 100);

      wakeLoop();
    };

    const onPointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]'
      );

      if (interactive) {
        isHoveringInteractive = true;
        ring.style.borderColor = "rgba(255, 255, 255, 0.85)";
        ring.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
        dot.style.opacity = "0.4";
        wakeLoop();
      } else {
        isHoveringInteractive = false;
        ring.style.borderColor = "rgba(255, 255, 255, 0.45)";
        ring.style.backgroundColor = "transparent";
        dot.style.opacity = "1";
        wakeLoop();
      }
    };

    const onPointerLeaveWindow = () => {
      isVisible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("mouseover", onPointerOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeaveWindow);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (moveTimeout) clearTimeout(moveTimeout);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("mouseover", onPointerOver);
      document.documentElement.removeEventListener("pointerleave", onPointerLeaveWindow);
    };
  }, []);

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      {/* Smooth Trailing Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 w-8 h-8 rounded-full border border-white/45 opacity-0 transition-colors duration-200 will-change-transform"
        style={{
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
        }}
      />
      {/* Instant Precision Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white opacity-0 will-change-transform"
        style={{
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
        }}
      />
    </div>
  );
}
export default SmoothCursor;
