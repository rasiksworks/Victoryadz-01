"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

const CHAR_STAGGER = 0.03;
const WORD_STAGGER = 0.05;

export default function ScrollHighlight({
    text,
    children,
    font,
    className = "",
    style,
    containerPadding = false,

    dimColor = "rgba(255, 255, 255, 0.3)",
    highlightColor = "#FFFFFF",

    splitBy = "words",
    scrollStart = "top 85%",
    scrollEnd = "bottom 50%",
    scrub = true,
}: ScrollHighlightProps) {
    const containerRef = useRef<HTMLParagraphElement>(null);
    const contentText = text || (typeof children === "string" ? children : "");
    const words = contentText.trim().split(/\s+/).filter(Boolean);
    const chars = Array.from(contentText);
    const stagger = splitBy === "characters" ? CHAR_STAGGER : WORD_STAGGER;

    useEffect(() => {
        const paragraph = containerRef.current;
        if (!paragraph || !contentText) return;

        const targets = paragraph.querySelectorAll(
            splitBy === "characters" ? ".char" : ".word"
        );

        const ctx = gsap.context(() => {
            gsap.set(targets, {
                color: dimColor,
            });

            gsap.to(targets, {
                color: highlightColor,
                stagger,
                scrollTrigger: {
                    trigger: paragraph,
                    start: scrollStart,
                    end: scrollEnd,
                    scrub,
                },
            });

            // Ensure ScrollTrigger accurately calculates positions with Lenis / Next.js
            const timer = setTimeout(() => {
                ScrollTrigger.refresh();
            }, 200);

            return () => clearTimeout(timer);
        }, paragraph);

        return () => ctx.revert();
    }, [
        contentText,
        dimColor,
        highlightColor,
        splitBy,
        stagger,
        scrollStart,
        scrollEnd,
        scrub,
    ]);

    const paragraphElement = (
        <p
            ref={containerRef}
            className={className}
            style={{
                margin: 0,
                display: "inline-block",
                whiteSpace: "pre-wrap",
                color: dimColor,
                ...font,
                ...style,
            }}
        >
            {splitBy === "characters"
                ? chars.map((char, index) => (
                      <span
                          key={`${char}-${index}`}
                          className="char"
                          style={{
                              display: "inline-block",
                              color: dimColor,
                              transition: "color 0.1s ease",
                          }}
                      >
                          {char === " " ? "\u00A0" : char}
                      </span>
                  ))
                : words.map((word, index) => (
                      <React.Fragment key={`${word}-${index}`}>
                          <span
                              className="word"
                              style={{
                                  display: "inline-block",
                                  color: dimColor,
                                  transition: "color 0.1s ease",
                              }}
                          >
                              {word}
                          </span>
                          {index < words.length - 1 ? " " : null}
                      </React.Fragment>
                  ))}
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