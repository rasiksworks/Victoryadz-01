"use client";

import { Button } from "@/components/originkit/ui/hero-03/button";
import { MorphicNavbar } from "@/components/originkit/ui/hero-03/morphic-navbar";

/** Public asset URLs */
function asset(file: string) {
  return `/originkit/hero-03/${file}`;
}

type NavbarProps = {
  onExplore: () => void;
};

export const Navbar = ({ onExplore }: NavbarProps) => {
  return (
    <header className="relative z-30 w-full pt-4 px-6 md:px-[60px] lg:px-[60px]">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
        {/* Brand Logo */}
        <a
          href="#"
          aria-label="LUXE home"
          className="inline-flex items-center gap-[11px] touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [-webkit-tap-highlight-color:transparent]"
        >
          <img
            src={asset("nav-luxe-mark.svg")}
            alt=""
            width={18.517}
            height={24.07}
            className="shrink-0 brightness-0 invert"
            aria-hidden="true"
          />
          <span className="font-sans text-[20px] font-semibold leading-[1.1] tracking-[-0.6px] text-white uppercase ipad:text-[22px] ipad:tracking-[-0.66px]">
            LUXE
          </span>
        </a>

        {/* Center Morphic Navbar */}
        <div className="hidden ipad:flex flex-1 justify-center">
          <MorphicNavbar />
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Button
            variant="nav"
            aria-label="Explore Gallery"
            onClick={onExplore}
            className="shrink-0"
          >
            Explore Gallery
          </Button>
        </div>
      </div>

      {/* Mobile Morphic Navbar */}
      <div className="flex ipad:hidden justify-center mt-3">
        <MorphicNavbar />
      </div>
    </header>
  );
};
