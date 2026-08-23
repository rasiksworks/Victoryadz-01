// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import DirectionHover from "@/components/originkit/ui/directionhover";

type ButtonVariant = "primary" | "secondary" | "nav";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:
    "relative h-[44px] overflow-clip rounded-none border border-solid border-white/40 bg-white px-5 text-[14px] font-semibold tracking-[-0.28px] text-[#2C2C2C] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.35)] transition-[background-color,transform] duration-200 ease ipad:h-[55px] ipad:rounded-none ipad:px-[27px] ipad:text-[18px] ipad:tracking-[-0.36px] desktop-sm:h-[42px] desktop-sm:rounded-none desktop-sm:px-5 desktop-sm:text-[14px] desktop-sm:tracking-[-0.28px] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-gray-100",
  secondary:
    "h-[44px] rounded-none border border-solid border-[#555555] bg-[#363636]/70 px-4 text-[14px] font-medium tracking-[-0.28px] text-white transition-[border-color,background-color,transform] duration-200 ease ipad:h-[55px] ipad:rounded-none ipad:px-[22px] ipad:text-[18px] ipad:tracking-[-0.36px] desktop-sm:h-[42px] desktop-sm:rounded-none desktop-sm:px-4 desktop-sm:text-[14px] desktop-sm:tracking-[-0.28px] [@media(hover:hover)_and_(pointer:fine)]:hover:border-white [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#444444]",
  nav: "h-9 overflow-clip rounded-none border border-solid border-white/20 bg-white px-5 text-[14px] font-semibold tracking-[-0.28px] text-[#2C2C2C] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.25)] transition-[background-color,opacity,transform] duration-200 ease [@media(hover:hover)_and_(pointer:fine)]:hover:bg-gray-100 [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-100",
};

const VARIANT_HOVER_COLOR: Record<ButtonVariant, string> = {
  primary: "#000000",
  secondary: "#ffffff",
  nav: "#000000",
};

const VARIANT_TEXT_COLOR: Record<ButtonVariant, string> = {
  primary: "#2C2C2C",
  secondary: "#ffffff",
  nav: "#2C2C2C",
};

export const Button = ({
  variant = "primary",
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) => {
  // Only apply DirectionHover to plain text children
  const isTextChild = typeof children === "string";

  return (
    <button
      type={type}
      className={`inline-flex min-h-9 touch-manipulation items-center justify-center font-tight transition-[opacity,transform] duration-200 ease [-webkit-tap-highlight-color:transparent] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.97] motion-reduce:active:scale-100 [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-95 ${VARIANT_CLASS[variant]} ${className}`}
      {...props}
    >
      {isTextChild ? (
        <DirectionHover
          title={children}
          font={{
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.28px",
            lineHeight: "1.2em",
          }}
          gap={4}
          textColor={VARIANT_TEXT_COLOR[variant]}
          hoverColor={VARIANT_HOVER_COLOR[variant]}
          transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
        />
      ) : (
        children
      )}
    </button>
  );
};
