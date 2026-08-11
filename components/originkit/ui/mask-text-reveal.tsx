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
    margin?: `${number}px ${number}px ${number}px ${number}px`;
};

const INSET_MAP: Record<string, { hidden: string; visible: string }> = {
    "center-horizontal": { hidden: "inset(0% 50% 0% 50%)", visible: "inset(0% 0% 0% 0%)" },
    "center-vertical": { hidden: "inset(50% 0% 50% 0%)", visible: "inset(0% 0% 0% 0%)" },
    "left-to-right": { hidden: "inset(0% 100% 0% 0%)", visible: "inset(0% 0% 0% 0%)" },
    "right-to-left": { hidden: "inset(0% 0% 0% 100%)", visible: "inset(0% 0% 0% 0%)" },
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
    transition = {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
    },
    margin = "0px 0px -50px 0px",
}: MaskTextRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin });

    const content = text || children;
    const clips = INSET_MAP[direction] || INSET_MAP["center-horizontal"];
    const fontStyles = (font ?? {}) as React.CSSProperties;

    const TagComponent = (motion as any)[tag] || motion.h2;

    return (
        <div
            ref={ref}
            className="overflow-hidden"
            style={{
                display: "inline-block",
                maxWidth: "100%",
            }}
        >
            <TagComponent
                className={`curtain-text ${className}`}
                initial={{ clipPath: clips.hidden }}
                animate={{ clipPath: isInView ? clips.visible : clips.hidden }}
                transition={transition}
                style={{
                    margin: 0,
                    display: "inline-block",
                    whiteSpace: "pre-wrap",
                    color,
                    willChange: "clip-path",
                    ...fontStyles,
                    ...style,
                }}
            >
                {content}
            </TagComponent>
        </div>
    );
}