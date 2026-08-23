"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

type FontStyle = React.CSSProperties;
type SplitBy = "characters" | "words";

type ScrollHighlightProps = {
  text?: string;
  children?: React.ReactNode;
  font?: FontStyle;
  className?: string;
  style?: React.CSSProperties;
  containerPadding?: boolean;

  dimColor?: string;
  highlightColor?: string;
  splitBy?: SplitBy;
  scrollStart?: string;
  scrollEnd?: string;
  scrub?: boolean | number;
};

// Deep text extractor to handle string arrays, entities (&quot;), and nested ReactNodes
function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement(node) && (node.props as any)?.children) {
    return extractText((node.props as any).children);
  }
  return "";
}

// Individual animated word component
const Word: React.FC<{
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
  dimColor?: string;
  highlightColor?: string;
}> = ({ children, range, progress, dimColor = "rgba(255, 255, 255, 0.2)", highlightColor = "rgba(255, 255, 255, 1)" }) => {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const color = useTransform(progress, range, [dimColor, highlightColor]);

  return (
    <span className="inline-block">
      <motion.span
        style={{ opacity, color }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
};

// Individual animated character component (when splitBy="characters")
const Char: React.FC<{
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
  dimColor?: string;
  highlightColor?: string;
}> = ({ children, range, progress, dimColor = "rgba(255, 255, 255, 0.2)", highlightColor = "rgba(255, 255, 255, 1)" }) => {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const color = useTransform(progress, range, [dimColor, highlightColor]);

  return (
    <span className="inline-block">
      <motion.span
        style={{ opacity, color }}
        className="inline-block"
      >
        {children === " " ? "\u00A0" : children}
      </motion.span>
    </span>
  );
};

export default function ScrollHighlight({
  text,
  children,
  font,
  className = "",
  style,
  containerPadding = false,
  dimColor = "rgba(255, 255, 255, 0.2)",
  highlightColor = "#FFFFFF",
  splitBy = "words",
}: ScrollHighlightProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  
  const contentText = text || extractText(children);
  const words = contentText.trim().split(/\s+/).filter(Boolean);
  const chars = Array.from(contentText);

  // Scroll offset: starts highlighting when text is in bottom third,
  // finishes highlighting as it reaches the center/upper third of viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.88", "start 0.35"],
  });

  const isCharSplit = splitBy === "characters";
  const items = isCharSplit ? chars : words;

  const paragraphElement = (
    <p
      ref={containerRef}
      className={className}
      style={{
        margin: 0,
        ...font,
        ...style,
      }}
    >
      {items.map((item, i) => {
        const start = i / items.length;
        const end = start + 1 / items.length;
        
        if (isCharSplit) {
          return (
            <Char
              key={`${item}-${i}`}
              range={[start, end]}
              progress={scrollYProgress}
              dimColor={dimColor}
              highlightColor={highlightColor}
            >
              {item}
            </Char>
          );
        }

        return (
          <React.Fragment key={`${item}-${i}`}>
            <Word
              range={[start, end]}
              progress={scrollYProgress}
              dimColor={dimColor}
              highlightColor={highlightColor}
            >
              {item}
            </Word>
            {i < items.length - 1 ? " " : ""}
          </React.Fragment>
        );
      })}
    </p>
  );

  if (containerPadding) {
    return (
      <div style={{ paddingTop: "100dvh", paddingBottom: "100dvh" }}>
        {paragraphElement}
      </div>
    );
  }

  return paragraphElement;
}
