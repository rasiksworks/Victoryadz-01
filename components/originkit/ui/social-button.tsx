"use client";

import React, { useState } from "react";
import { Link as LinkIcon, MessageCircle, Share2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.72a1.47 1.47 0 1 0 0 2.94 1.47 1.47 0 0 0 0-2.94z" />
  </svg>
);

export interface ShareItem {
  icon: React.ElementType;
  label: string;
}

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  shareTitle?: string;
  shareText?: string;
  shareUrl?: string;
  items?: ShareItem[];
  onShare?: (index: number, item: ShareItem) => void;
  className?: string;
}

const DEFAULT_SHARE_ITEMS: ShareItem[] = [
  { icon: MessageCircle, label: "Share on WhatsApp" },
  { icon: Instagram, label: "Share on Instagram" },
  { icon: Linkedin, label: "Share on LinkedIn" },
  { icon: LinkIcon, label: "Copy link" },
];

export default function SocialButton({
  label = "Share",
  shareTitle = "VictoryAdz Handcrafted Frame",
  shareText = "Check out this handcrafted frame by VictoryAdz!",
  shareUrl,
  items = DEFAULT_SHARE_ITEMS,
  onShare,
  className = "",
  ...props
}: SocialButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const getTargetUrl = () => {
    if (shareUrl) return shareUrl;
    if (typeof window !== "undefined") return window.location.href;
    return "https://victoryadz.com";
  };

  const handleShare = async (index: number) => {
    setActiveIndex(index);
    onShare?.(index, items[index]);
    setTimeout(() => {
      setActiveIndex(null);
    }, 300);

    const item = items[index];
    const url = getTargetUrl();
    const formattedText = `${shareTitle}: ${shareText}`;

    if (item.label === "Copy link") {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(url);
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = url;
          textArea.style.position = "fixed";
          textArea.style.opacity = "0";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
      } catch {
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
      }
    } else if (item.label === "Share on WhatsApp") {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${formattedText} ${url}`)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    } else if (item.label === "Share on Instagram") {
      window.open("https://www.instagram.com/victory__adz/", "_blank", "noopener,noreferrer");
    } else if (item.label === "Share on LinkedIn") {
      const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      window.open(liUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className={`relative inline-block select-none ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* Default Collapsed Share Trigger Button */}
      <motion.div
        animate={{
          opacity: isVisible ? 0 : 1,
          pointerEvents: isVisible ? "none" : "auto",
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
      >
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="relative w-36 sm:w-40 h-10 bg-white hover:bg-neutral-100 text-black border border-black/15 transition-all duration-200 px-4 py-2 text-xs font-mono uppercase tracking-widest shadow-sm rounded-none cursor-pointer flex items-center justify-center active:scale-98 touch-manipulation"
          {...props}
        >
          <span className="flex items-center gap-2 justify-center font-bold">
            <Share2 className="h-3.5 w-3.5" />
            {label}
          </span>
        </button>
      </motion.div>

      {/* Kokonut UI Expanding Drawer Menu */}
      <motion.div
        animate={{
          width: isVisible ? (items.length === 4 ? "160px" : `${items.length * 40}px`) : 0,
        }}
        className="absolute top-0 left-0 flex h-10 overflow-hidden rounded-none shadow-md z-30"
        transition={{
          duration: 0.3,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        {items.map((button, i) => {
          const Icon = button.icon;
          return (
            <motion.button
              key={`share-${button.label}`}
              animate={{
                opacity: isVisible ? 1 : 0,
                x: isVisible ? 0 : -20,
              }}
              transition={{
                duration: 0.25,
                ease: [0.23, 1, 0.32, 1],
                delay: isVisible ? i * 0.04 : 0,
              }}
              aria-label={button.label}
              title={button.label}
              className={`h-10 w-10 shrink-0 flex items-center justify-center bg-black text-white border-r border-white/20 last:border-r-0 hover:bg-neutral-800 outline-none relative overflow-hidden transition-colors duration-200 cursor-pointer active:scale-95 touch-manipulation`}
              onClick={() => handleShare(i)}
              type="button"
            >
              <motion.div
                animate={{
                  scale: activeIndex === i ? 0.85 : 1,
                }}
                className="relative z-10"
                transition={{
                  duration: 0.15,
                  ease: "easeInOut",
                }}
              >
                <Icon className="h-4 w-4" />
              </motion.div>
              <motion.div
                animate={{
                  opacity: activeIndex === i ? 0.2 : 0,
                }}
                className="absolute inset-0 bg-white pointer-events-none"
                initial={{ opacity: 0 }}
                transition={{
                  duration: 0.15,
                  ease: "easeInOut",
                }}
              />
            </motion.button>
          );
        })}
      </motion.div>

      {/* Copied Link Toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider text-emerald-400 bg-black/90 border border-emerald-500/40 px-3 py-1 rounded-full whitespace-nowrap shadow-lg z-40 backdrop-blur-md"
          >
            <Check size={12} className="text-emerald-400" />
            <span>LINK COPIED!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
