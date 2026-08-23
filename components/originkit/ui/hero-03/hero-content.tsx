"use client";

import { motion, useReducedMotion } from "motion/react";
import { Button01 } from "@/components/ui/nextjsshop-button";

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

      <div className="relative flex w-full flex-col items-center gap-[28px] ipad:gap-[36px] desktop-sm:gap-7">
        <div className="flex w-full flex-col items-center gap-[14px] ipad:gap-[18px] desktop-sm:gap-3.5">
          <motion.div {...reveal(0.12)} className="text-center w-full">
            <h1 className="w-full text-center text-white select-none">
              <span className="block font-cal-sans text-[36px] xs:text-[44px] sm:text-[54px] ipad:text-[62px] desktop-sm:text-[66px] leading-[1.03] tracking-normal font-semibold text-white">
                Your Photos, Framed
              </span>
              <span className="block font-great-vibes text-[44px] xs:text-[54px] sm:text-[68px] ipad:text-[76px] desktop-sm:text-[84px] leading-[1.05] font-normal text-white mt-0.5 sm:mt-1">
                to Last a Lifetime
              </span>
            </h1>
          </motion.div>

          <motion.div {...reveal(0.22)} className="w-full flex justify-center">
            <p
              className="w-full max-w-[348px] ipad:max-w-[450px] desktop-sm:max-w-[460px] text-center font-inter-display font-medium text-[13px] sm:text-[14px] ipad:text-[14.5px] desktop-sm:text-[15px] leading-relaxed text-[#E0E0E0] px-2 block"
              style={{ letterSpacing: "0.5px" }}
            >
              Custom photo framing and premium lamination, trusted by families across Tamil Nadu for 8+ years, even if you&apos;re ordering from another state.
            </p>
          </motion.div>
        </div>

        <motion.div
          {...reveal(0.32)}
          className="pointer-events-auto flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 sm:gap-4 ipad:gap-5 w-full px-2"
        >
          <Button01
            text="See Our Work"
            ariaLabel="See Our Work"
            variant="dark"
            onClick={onExplore}
            className="w-full sm:w-auto"
          />
          <Button01
            text="Order on WhatsApp"
            ariaLabel="Order on WhatsApp"
            variant="light"
            onClick={onBook}
            className="w-full sm:w-auto"
          />
        </motion.div>
      </div>
    </div>
  );
};
