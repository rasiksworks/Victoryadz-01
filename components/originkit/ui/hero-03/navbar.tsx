"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/originkit/ui/hero-03/button";
import { Button01 } from "@/components/ui/nextjsshop-button";
import { MorphicNavbar } from "@/components/originkit/ui/hero-03/morphic-navbar";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ArrowUpRight, MessageSquare } from "lucide-react";

/** Public asset URLs */
function asset(file: string) {
  return `/originkit/hero-03/${file}`;
}

const MOBILE_NAV_LINKS = [
  { number: "01", label: "Home", href: "/" },
  { number: "02", label: "Works", href: "/#recent-works" },
  { number: "03", label: "About", href: "/#about" },
  { number: "04", label: "Why Us", href: "/#why-victory-adz" },
  { number: "05", label: "How It Works", href: "/#how-it-works" },
  { number: "06", label: "FAQ", href: "/#faq" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Auto-hide navbar smoothly when detailed work modal is open
  useEffect(() => {
    const handleDetailModal = (e: any) => {
      setModalOpen(Boolean(e?.detail?.open));
    };
    window.addEventListener("detail-modal", handleDetailModal as EventListener);
    return () => window.removeEventListener("detail-modal", handleDetailModal as EventListener);
  }, []);

  // Auto-close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Hide on scroll down, show on scroll up (only when mobile menu is closed)
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (mobileMenuOpen) return;
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      "Hi VictoryAdz! I'd like to get frame options & pricing for my photo."
    );
    window.open(`https://wa.me/919361312684?text=${message}`, "_blank");
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleNavLinkClick = (href: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false);
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const targetId = href.replace("/#", "");
      const el = document.getElementById(targetId);
      if (el) {
        if (typeof window !== "undefined" && (window as any).lenis) {
          (window as any).lenis.scrollTo(el, { duration: 1.2 });
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else if (href === "/" && pathname === "/") {
      e.preventDefault();
      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // Don't show public navbar on dedicated admin page
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -100, opacity: 0 },
        }}
        animate={modalOpen || (hidden && !mobileMenuOpen) ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 ${
          mobileMenuOpen ? "z-[100]" : "z-50"
        } flex items-center justify-between px-4 sm:px-6 md:px-[60px] lg:px-[60px] py-3.5 sm:py-4 bg-transparent`}
      >
        <div className="w-full flex items-center justify-between max-w-[1520px] mx-auto">
          {/* Left Brand Logo */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 group cursor-pointer focus-visible:outline-2 focus-visible:outline-white shrink-0"
            aria-label="VictoryAdz Home"
          >
            {/* Hexagon Shield Icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 20 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white group-hover:scale-105 transition-transform duration-300 shrink-0"
              aria-hidden="true"
            >
              <path
                d="M10 2L18 7V17L10 22L2 17V7L10 2Z"
                fill="currentColor"
                fillOpacity="0.1"
              />
              <path
                d="M10 2L18 7V17L10 22L2 17V7L10 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M6 8L10 16L14 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-sans text-[18px] sm:text-[20px] md:text-[22px] font-semibold leading-[1.1] tracking-[-0.6px] text-white uppercase">
              VICTORYADZ
            </span>
          </a>

          {/* Desktop Center Morphic Navbar (hidden on mobile/tablet) */}
          <div className="hidden md:flex flex-1 justify-center px-4">
            <MorphicNavbar />
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop Order Now Button (hidden on mobile/tablet < md) */}
            <div className="hidden md:block shrink-0">
              <Button01
                text="Order on WhatsApp"
                ariaLabel="Order on WhatsApp"
                variant="light"
                size="sm"
                onClick={handleWhatsAppOrder}
              />
            </div>

            {/* Mobile Hamburger / Close Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="flex md:hidden w-11 h-11 min-w-[44px] min-h-[44px] items-center justify-center rounded-none bg-[#1c1c1c]/90 border border-white/15 text-white backdrop-blur-md hover:bg-[#2c2c2c] active:scale-95 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
            >
              {mobileMenuOpen ? <X size={22} className="text-white" /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Fullscreen Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site Navigation"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[85] flex flex-col justify-between bg-[#111111]/98 backdrop-blur-2xl text-white pt-20 pb-8 px-6 overflow-y-auto md:hidden"
          >
            {/* Top Close Bar inside drawer */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 max-w-sm w-full mx-auto">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/50">
                [ NAVIGATION MENU ]
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 text-white font-mono text-xs uppercase tracking-wider transition-all"
                aria-label="Close navigation menu"
              >
                <X size={15} />
                <span>Close</span>
              </button>
            </div>

            {/* Navigation List */}
            <div className="flex flex-col gap-1 my-auto max-w-sm w-full mx-auto py-4">
              {MOBILE_NAV_LINKS.map((link, idx) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavLinkClick(link.href, e)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 + 0.08, duration: 0.3 }}
                  className="flex items-center justify-between py-3.5 border-b border-white/10 text-lg sm:text-xl font-bold tracking-tight text-white/90 hover:text-white active:text-emerald-400 transition-colors focus-visible:outline-2 focus-visible:outline-white"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-white/40">{link.number}</span>
                    <span>{link.label}</span>
                  </div>
                  <ArrowUpRight size={18} className="text-white/40" />
                </motion.a>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 flex flex-col gap-3 max-w-sm w-full mx-auto">
              <Button01
                text="Order on WhatsApp"
                onClick={handleWhatsAppOrder}
                ariaLabel="Order on WhatsApp"
                className="w-full"
              />

              <p className="text-[11px] text-white/40 text-center font-mono uppercase tracking-wider mt-1">
                Handcrafted in Kanyakumari · Delivered Pan-India
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
