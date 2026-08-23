import React from "react";
import "./nextjsshop-button.css";

export interface Button01Props {
  text?: string;
  children?: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  variant?: "light" | "dark";
  size?: "default" | "sm";
  ariaLabel?: string;
  target?: string;
  rel?: string;
  style?: React.CSSProperties;
}

export const Button01: React.FC<Button01Props> = ({
  text = "Nextjsshop",
  children,
  href,
  onClick,
  className = "",
  variant = "light",
  size = "default",
  ariaLabel,
  target,
  rel,
  style,
}) => {
  const content = children || text;
  const rawText = typeof content === "string" ? content : text;
  const charCount = Math.max(rawText.length, 10);

  const buttonStyle: React.CSSProperties = {
    "--characters": charCount,
    ...style,
  } as React.CSSProperties;

  const variantClass = variant === "dark" ? "button01-dark" : "button01-light";
  const sizeClass = size === "sm" ? "button01-sm" : "";
  const combinedClass = `button01 ${variantClass} ${sizeClass} ${className}`.trim();

  const innerMarkup = (
    <>
      <span className="button01_bg" aria-hidden="true">
        <span className="button01_bg-mid"></span>
        <span className="button01_bg-right">
          {[...Array(25)].map((_, index) => (
            <span
              key={`pixel-${index}`}
              style={{ "--index": Math.floor(Math.random() * 4) } as React.CSSProperties}
              className="button01_bg-pixel"
            ></span>
          ))}
        </span>
        <span className="button01_bg-right-overlay">
          {[...Array(11)].map((_, index) => (
            <span
              key={`overlay-${index}`}
              style={{ "--index": 4 + Math.floor(Math.random() * 4) } as React.CSSProperties}
              className="button01_bg-pixel"
            ></span>
          ))}
        </span>
      </span>
      <span data-text={rawText} className="button01_inner">
        <span className="button01_text">{content}</span>
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={combinedClass}
        style={buttonStyle}
        aria-label={ariaLabel || rawText}
        target={target}
        rel={rel}
      >
        {innerMarkup}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={combinedClass}
      style={buttonStyle}
      aria-label={ariaLabel || rawText}
    >
      {innerMarkup}
    </button>
  );
};

export default Button01;
