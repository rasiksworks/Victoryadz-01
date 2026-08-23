"use client";

import clsx from "clsx";
import GooeyNav from "@/components/originkit/ui/GooeyNav";

interface NavItem {
  name: string;
}

interface MorphicNavbarProps {
  items?: Record<string, NavItem>;
  defaultPath?: string;
  className?: string;
}

const DEFAULT_NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Works", href: "/#recent-works" },
  { label: "About", href: "/#about" },
  { label: "Why Us", href: "/#why-victory-adz" },
];

export function MorphicNavbar({ className }: MorphicNavbarProps) {
  return (
    <div className={clsx("flex items-center justify-center", className)}>
      <GooeyNav
        items={DEFAULT_NAV_ITEMS}
        particleCount={15}
        particleDistances={[90, 10]}
        particleR={100}
        initialActiveIndex={0}
        animationTime={600}
        timeVariance={300}
        colors={[1, 2, 3, 1, 2, 3, 1, 4]}
      />
    </div>
  );
}

export default MorphicNavbar;
