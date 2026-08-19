import { useRef, useState } from "react"

const EASE_MAP: Record<string, string> = {
    linear: "linear",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
}

function transitionToCss(t: any): string {
    const duration = (t && t.duration) || 0.35
    let ease = "cubic-bezier(0.22, 1, 0.36, 1)"
    if (t && t.ease) {
        if (Array.isArray(t.ease)) ease = `cubic-bezier(${t.ease.join(", ")})`
        else if (EASE_MAP[t.ease]) ease = EASE_MAP[t.ease]
    } else if (t && t.type === "spring") {
        ease = "cubic-bezier(0.34, 1.56, 0.64, 1)"
    }
    return `transform ${duration}s ${ease}`
}

export default function DirectionHover(props: any) {
    props = { ...COMPONENT_DEFAULTS, ...props }
    const { title, font, gap, textColor, hoverColor, transition, style } = props

    const ref = useRef<HTMLSpanElement>(null)
    const [dir, setDir] = useState<"none" | "top" | "bottom">("none")

    const onEnter = (e: React.MouseEvent) => {
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const y = e.clientY - rect.top
        setDir(y < rect.height / 2 ? "top" : "bottom")
    }
    const onLeave = () => setDir("none")

    const fontObj = font || {}
    const rawSize = fontObj.fontSize
    const size = typeof rawSize === "string" ? parseFloat(rawSize) : rawSize || 14
    
    // Provide generous vertical room (1.35x font size) so capital ascenders & letter descenders (g, j, p, q, y) are NEVER clipped
    const lineBox = Math.ceil(size * 1.35)
    const gapPx = Math.max(4, (gap || 0) * 3)
    const step = lineBox + gapPx

    const yByDir = { none: -step, top: 0, bottom: -2 * step }

    const labelStyle: React.CSSProperties = {
        ...fontObj,
        margin: 0,
        whiteSpace: "nowrap",
        lineHeight: `${lineBox}px`,
        height: lineBox,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
    }

    return (
        <span
            ref={ref}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            style={{
                ...style,
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                height: lineBox,
                cursor: "pointer",
                userSelect: "none",
            }}
        >
            <span
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: gapPx,
                    transform: `translateY(${yByDir[dir]}px)`,
                    transition: transitionToCss(transition),
                }}
            >
                <span style={{ ...labelStyle, color: hoverColor }}>
                    {title}
                </span>
                <span style={{ ...labelStyle, color: textColor }}>{title}</span>
                <span style={{ ...labelStyle, color: hoverColor }}>
                    {title}
                </span>
            </span>
        </span>
    )
}

const COMPONENT_DEFAULTS = {
    title: "DIRECTION HOVER",
    font: {
        fontSize: 14,
        variant: "SemiBold",
        letterSpacing: "-0.28px",
        lineHeight: "1.2em",
    },
    gap: 4,
    textColor: "#ffffff",
    hoverColor: "#000000",
    transition: {
        type: "tween",
        duration: 0.3,
        delay: 0,
        ease: "easeInOut",
    },
}
