"use client";

import { Link, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

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

interface ShareItem {
  icon: React.ElementType;
  label: string;
}

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  items?: ShareItem[];
  onShare?: (index: number, item: ShareItem) => void;
  className?: string;
}

const DEFAULT_SHARE_ITEMS: ShareItem[] = [
  { icon: MessageCircle, label: "Share on WhatsApp" },
  { icon: Instagram, label: "Share on Instagram" },
  { icon: Linkedin, label: "Share on LinkedIn" },
  { icon: Link, label: "Copy link" },
];

export default function SocialButton({
  label = "Share",
  items = DEFAULT_SHARE_ITEMS,
  onShare,
  className = "",
  ...props
}: SocialButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const [copied, setCopied] = useState(false);

  const handleShare = (index: number) => {
    setActiveIndex(index);
    onShare?.(index, items[index]);
    setTimeout(() => {
      setActiveIndex(null);
    }, 300);
    
    const item = items[index];
    const url = window.location.href;
    const text = "Check out this amazing frame by VictoryAdz!";

    if (item.label === "Copy link") {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else if (item.label === "Share on WhatsApp") {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`, "_blank");
    } else if (item.label === "Share on Instagram") {
      // Instagram doesn't support direct URL sharing; open the profile page instead
      window.open("https://www.instagram.com/victory__adz/", "_blank");
    } else if (item.label === "Share on LinkedIn") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    }
  };

  return (
    <div
      className={`relative w-40 ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsVisible(false);
        }
      }}
    >
      {/* Default Button */}
      <motion.div
        animate={{
          opacity: isVisible ? 0 : 1,
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
      >
        <button
          className="relative w-40 h-10 bg-white hover:bg-neutral-50 text-black border border-black/10 transition-colors duration-200 px-4 py-2 text-xs font-mono uppercase tracking-widest shadow-sm rounded-sm cursor-pointer flex items-center justify-center"
          {...props}
        >
          <span className="flex items-center gap-2 justify-center font-medium">
            <Link className="h-4 w-4" />
            {label}
          </span>
        </button>
      </motion.div>

      {/* Kokonut UI Expanding Drawer Menu */}
      <motion.div
        animate={{
          width: isVisible ? "160px" : 0,
        }}
        className="absolute top-0 left-0 flex h-10 overflow-hidden rounded-sm"
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
                duration: 0.3,
                ease: [0.23, 1, 0.32, 1],
                delay: isVisible ? i * 0.05 : 0,
              }}
              aria-label={button.label}
              className={`h-10 w-10 shrink-0 flex items-center justify-center bg-black text-white ${
                i === 0 ? "rounded-l-sm" : ""
              } ${
                i === items.length - 1 ? "rounded-r-sm" : ""
              } border-r border-white/20 last:border-r-0 hover:bg-neutral-900 outline-none relative overflow-hidden transition-colors duration-200 cursor-pointer`}
              onClick={() => handleShare(i)}
              type="button"
            >
              <motion.div
                animate={{
                  scale: activeIndex === i ? 0.85 : 1,
                }}
                className="relative z-10"
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                }}
              >
                <Icon className="h-4 w-4" />
              </motion.div>
              <motion.div
                animate={{
                  opacity: activeIndex === i ? 0.15 : 0,
                }}
                className="absolute inset-0 bg-white pointer-events-none"
                initial={{ opacity: 0 }}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                }}
              />
            </motion.button>
          );
        })}
      </motion.div>

      {/* Copied toast */}
      {copied && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-wider text-green-600 bg-green-50 border border-green-200 px-3 py-0.5 rounded-full whitespace-nowrap shadow-sm"
        >
          Link copied!
        </motion.div>
      )}
    </div>
  );
}
