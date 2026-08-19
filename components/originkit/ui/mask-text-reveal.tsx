"use client";

import * as React from "react";
import { useRef } from "react";
import { motion, useInView, type Transition } from "framer-motion";

type TagType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div" | "span";

type MaskTextRevealProps = {
    text?: string;
    children?: React.ReactNode;
    font?: React.CSSProperties;
    color?: string;
    tag?: TagType;
    className?: string;
    style?: React.CSSProperties;

    direction?:
        | "center-horizontal"
        | "center-vertical"
        | "left-to-right"
        | "right-to-left"
        | "top-to-bottom"
        | "bottom-to-top";

    transition?: Transition;
    margin?: string;
    delay?: number;
};

const INSET_MAP: Record<string, { hidden: string; visible: string }> = {
    "center-horizontal": { hidden: "inset(0% 50% 0% 50%)", visible: "inset(0% 0% 0% 0%)" },
    "center-vertical": { hidden: "inset(50% 0% 50% 0%)", visible: "inset(0% 0% 0% 0%)" },
    "left-to-right": { hidden: "inset(0% 100% 0% 0%)", visible: "inset(0% 0% 0% 0%)" },
    "right-to-left": { hidden: "inset(0% 0% 100% 0%)", visible: "inset(0% 0% 0% 0%)" },
    "top-to-bottom": { hidden: "inset(0% 0% 100% 0%)", visible: "inset(0% 0% 0% 0%)" },
    "bottom-to-top": { hidden: "inset(100% 0% 0% 0%)", visible: "inset(0% 0% 0% 0%)" },
};

export default function MaskTextReveal({
    text,
    children,
    font,
    color,
    tag = "h2",
    className = "",
    style,
    direction = "center-horizontal",
    transition,
    margin = "0px 0px -60px 0px",
    delay = 0,
}: MaskTextRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: margin as any });

    const content = text || children;
    const clips = INSET_MAP[direction] || INSET_MAP["center-horizontal"];
    const fontStyles = (font ?? {}) as React.CSSProperties;

    const TagComponent = (motion as any)[tag] || motion.h2;

    const defaultTransition: Transition = {
        duration: 0.85,
        delay,
        ease: [0.16, 1, 0.3, 1],
    };

    return (
        <div
            ref={ref}
            className="overflow-hidden inline-block max-w-full"
        >
            <TagComponent
                className={`curtain-text ${className}`}
                initial={{ clipPath: clips.hidden, y: 16, opacity: 0 }}
                animate={{
                    clipPath: isInView ? clips.visible : clips.hidden,
                    y: isInView ? 0 : 16,
                    opacity: isInView ? 1 : 0,
                }}
                transition={transition || defaultTransition}
                style={{
                    margin: 0,
                    display: "inline-block",
                    whiteSpace: "pre-wrap",
                    color,
                    willChange: "clip-path, transform, opacity",
                    ...fontStyles,
                    ...style,
                }}
            >
                {content}
            </TagComponent>
        </div>
    );
}
