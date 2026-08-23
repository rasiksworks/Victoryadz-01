// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

"use client";

import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/originkit/ui/hero-03/button";
import { Button01 } from "@/components/ui/nextjsshop-button";
import ScrollHighlight from "@/components/originkit/ui/scroll-text-highlight";
import MaskTextReveal from "@/components/originkit/ui/mask-text-reveal";

/** ease-out-cubic */
const EASE_OUT = [0.215, 0.61, 0.355, 1] as const;

type HeroContentProps = {
  onExplore: () => void;
  onBook: () => void;
};

export const HeroContent = ({ onExplore, onBook }: HeroContentProps) => {
  const reduceMotion = useReducedMotion();

  const reveal = (delay: number) =>
    reduceMotion
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 14, filter: "blur(4px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: {
            type: "tween" as const,
            duration: 0.45,
            ease: EASE_OUT,
            delay,
          },
        };

  return (
    <div className="pointer-events-none relative z-20 flex w-full max-w-[378px] flex-col items-center gap-[34px] ipad:max-w-[490px] ipad:gap-[44px] desktop-sm:max-w-[502px] desktop-sm:gap-8">
      {/* Soft dark veil so tunnel lines don’t fight the type */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[360px] -translate-x-1/2 -translate-y-1/2 bg-[#2C2C2C] blur-[36px] ipad:h-[497px] ipad:w-[591px] ipad:blur-[56px] desktop-sm:h-[364px] desktop-sm:w-[433px] desktop-sm:blur-[41px]"
      />

      <div className="relative flex w-full flex-col items-center gap-[34px] ipad:gap-[44px] desktop-sm:gap-8">
        <div className="flex w-full flex-col items-center gap-[17px] ipad:gap-[22px] desktop-sm:gap-4">
          <motion.div {...reveal(0.12)} className="text-center">
            <MaskTextReveal
              tag="h1"
              direction="center-horizontal"
              className="w-full max-w-[378px] text-center font-instrument-serif text-[38px] sm:text-[46px] leading-[44px] sm:leading-[54px] tracking-[-1.1px] sm:tracking-[-1.38px] text-white text-balance ipad:max-w-[490px] ipad:text-[62px] ipad:leading-[75px] ipad:tracking-[-1.86px] desktop-sm:max-w-[502px] desktop-sm:text-[68px] desktop-sm:leading-[70px] desktop-sm:tracking-[-2.04px]"
            >
              Your Best Moments, Framed to Last Forever
            </MaskTextReveal>
          </motion.div>

          <motion.div {...reveal(0.22)}>
            <ScrollHighlight className="w-full max-w-[348px] text-center font-tight text-[13px] sm:text-[14px] leading-relaxed tracking-[-0.28px] text-pretty ipad:max-w-[448px] ipad:text-[17px] ipad:tracking-[-0.36px] desktop-sm:max-w-[340px] desktop-sm:text-[16px] desktop-sm:leading-[24px] desktop-sm:tracking-[-0.34px] block px-2">
              Studio-grade framing &amp; archival lamination, trusted by 15,000+ homes across India. Send your photo on WhatsApp for custom sizes, frame choices &amp; instant pricing.
            </ScrollHighlight>
          </motion.div>
        </div>

        <motion.div
          {...reveal(0.32)}
          className="pointer-events-auto flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 sm:gap-[17px] ipad:gap-[22px] desktop-sm:gap-4 w-full px-2"
        >
          <Button variant="primary" aria-label="Explore Gallery" onClick={onExplore} className="w-full sm:w-auto">
            Explore Gallery
          </Button>
          <Button01
            text="Order on WhatsApp"
            ariaLabel="Order on WhatsApp"
            onClick={onBook}
            className="w-full sm:w-auto"
          />
        </motion.div>
      </div>
    </div>
  );
};
