"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  type SpringOptions,
} from "framer-motion";

export interface UserCursorProps {
  name?: string;
  arrow?: React.ReactNode | ((color: string) => React.ReactNode);
  label?: React.ReactNode;
  color?: string;
  textColor?: string;
  size?: number;
  labelTiltStrength?: number;
  showLabel?: boolean;
  fullScreen?: boolean;
  pressScale?: number;
  style?: React.CSSProperties;
}

const SECTION_LABELS: Record<string, string> = {
  hero: "VictoryAdz",
  "hero-03": "VictoryAdz",
  "how-it-works": "How It Works",
  about: "About Us",
  "brand-vision": "Our Craft",
  "recent-works": "Recent Works",
  works: "Recent Works",
  testimonials: "Client Reviews",
  "why-us": "Why VictoryAdz",
  "why-victory-adz": "Why VictoryAdz",
  faq: "FAQ",
  contact: "Get In Touch",
  footer: "Contact Us",
};

export default function UserCursor(props: UserCursorProps) {
  const {
    name: defaultName = "VictoryAdz",
    color = "#FFFFFF",
    textColor = "#000000",
    size = 28,
    labelTiltStrength = 22,
    showLabel = true,
    fullScreen = true,
    pressScale = 0.9,
    style,
  } = props;

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(defaultName);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(pointer: coarse)");
    const sync = () => setIsTouchDevice(!!mql.matches);
    sync();
    if (mql.addEventListener) {
      mql.addEventListener("change", sync);
      return () => mql.removeEventListener("change", sync);
    }
  }, []);

  // Spring configurations: snappy arrow, smooth trailing label
  const arrowSpring = useMemo<SpringOptions>(
    () => ({ stiffness: 450, damping: 36, mass: 0.5 }),
    []
  );
  const labelSpringCfg = useMemo<SpringOptions>(
    () => ({ stiffness: 240, damping: 28, mass: 0.6 }),
    []
  );

  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  const arrowX = useSpring(mouseX, arrowSpring);
  const arrowY = useSpring(mouseY, arrowSpring);
  const labelX = useSpring(mouseX, labelSpringCfg);
  const labelY = useSpring(mouseY, labelSpringCfg);

  const scaleMV = useMotionValue(1);
  useEffect(() => {
    const controls = animate(scaleMV, pressed ? pressScale : 1, {
      type: "spring",
      stiffness: 500,
      damping: 28,
      mass: 0.5,
    });
    return () => controls.stop();
  }, [pressed, pressScale, scaleMV]);

  const labelTiltTarget = useMotionValue(0);
  const labelRotation = useSpring(labelTiltTarget, {
    stiffness: 220,
    damping: 24,
    mass: 0.6,
  });

  const lastSampleRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const labelThrottleRef = useRef<number>(0);

  useEffect(() => {
    if (isTouchDevice || typeof window === "undefined") return;

    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      const now = performance.now();
      const last = lastSampleRef.current;
      let vx = 0;
      let vy = 0;
      if (last) {
        const dt = Math.max(1, now - last.t);
        vx = ((x - last.x) / dt) * 1000;
        vy = ((y - last.y) / dt) * 1000;
      }
      lastSampleRef.current = { x, y, t: now };

      mouseX.set(x);
      mouseY.set(y);

      const speed = Math.hypot(vx, vy);
      const norm = Math.min(1, speed / 1400);
      const sign = vx === 0 ? 0 : vx > 0 ? 1 : -1;
      labelTiltTarget.set(sign * norm * labelTiltStrength);

      if (!hovering) setHovering(true);

      // Throttled Dynamic Section / Action Label Detection (every ~80ms)
      if (now - labelThrottleRef.current > 80) {
        labelThrottleRef.current = now;
        const target = e.target as HTMLElement | null;
        if (target) {
          // 1. Direct explicit cursor label attribute
          const explicit = target.closest<HTMLElement>("[data-cursor-label]");
          if (explicit?.dataset.cursorLabel) {
            setCurrentLabel(explicit.dataset.cursorLabel);
            return;
          }

          // 2. Interactive buttons & links
          const interactive = target.closest<HTMLElement>("a, button, [role='button']");
          if (interactive) {
            const aria = interactive.getAttribute("aria-label");
            if (aria && aria.length < 24) {
              setCurrentLabel(aria);
              return;
            }
            const text = interactive.innerText?.trim();
            if (text && text.length < 24 && !text.includes("\n")) {
              setCurrentLabel(text);
              return;
            }
          }

          // 3. Closest Section by ID or data-section
          const sectionEl = target.closest<HTMLElement>("section[id], footer[id], footer");
          if (sectionEl) {
            const id = sectionEl.id || sectionEl.tagName.toLowerCase();
            if (SECTION_LABELS[id]) {
              setCurrentLabel(SECTION_LABELS[id]);
              return;
            }
          }

          // Fallback to default
          setCurrentLabel(defaultName);
        }
      }
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => {
      setHovering(false);
      lastSampleRef.current = null;
      labelTiltTarget.set(0);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      setPressed(false);
    };
  }, [isTouchDevice, defaultName, labelTiltStrength, mouseX, mouseY, labelTiltTarget, hovering]);

  const labelTranslateX = useTransform(labelX, (v) => v + size * 0.75);
  const labelTranslateY = useTransform(labelY, (v) => v + size * 0.25 + 4);

  const CURSOR_HIDE_CSS = "@media (min-width: 1024px) and (pointer: fine) { html, body, *, *::before, *::after, a, button, [role='button'], input, textarea, select { cursor: none !important; } }";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CURSOR_HIDE_CSS }} />
      <div
        className="hidden lg:block pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none"
        style={style}
        aria-hidden="true"
      >
      {/* Label trails behind arrow with spring & velocity rocking */}
      {showLabel && (
        <motion.div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            x: labelTranslateX,
            y: labelTranslateY,
            rotate: labelRotation,
            scale: scaleMV,
            background: color,
            borderRadius: 9999,
            padding: "5px 12px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.25)",
            opacity: hovering ? 1 : 0,
            transformOrigin: "0% 50%",
            transition: "opacity 180ms ease, background 200ms ease",
            willChange: "transform, opacity",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              color: textColor,
              fontSize: "12px",
              lineHeight: 1.1,
              fontWeight: 600,
              fontFamily: "'Inter Display', system-ui, -apple-system, sans-serif",
              whiteSpace: "nowrap",
              letterSpacing: "0.2px",
            }}
          >
            {currentLabel}
          </div>
        </motion.div>
      )}

      {/* Primary Pointer Cursor Arrow */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: arrowX,
          y: arrowY,
          scale: scaleMV,
          width: size,
          height: size,
          opacity: hovering ? 1 : 0,
          transformOrigin: "0% 0%",
          transition: "opacity 180ms ease",
          willChange: "transform, opacity",
          pointerEvents: "none",
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", overflow: "visible" }}
        >
          <path
            d="M5 3 L23 14 L14 16 L11 24 Z"
            fill={color}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth={1}
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
    </>
  );
}
