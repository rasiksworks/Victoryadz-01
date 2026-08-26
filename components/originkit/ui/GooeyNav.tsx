"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import "./GooeyNav.css";

export interface GooeyNavItem {
  label: string;
  href: string;
}

export interface GooeyNavProps {
  items: GooeyNavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: number[];
  initialActiveIndex?: number;
}

export const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  // Sync activeIndex with current pathname, hash, and live scroll position
  useEffect(() => {
    if (pathname !== "/") {
      if (pathname === "/works") {
        const idx = items.findIndex((item) => item.href === "/works");
        if (idx !== -1) setActiveIndex(idx);
      }
      return;
    }

    let ticking = false;
    let isClickScrolling = false;
    let clickTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (isClickScrolling) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset;
          const viewportHeight = window.innerHeight;
          const checkLine = viewportHeight * 0.38; // 38% down from top

          // If at the top of the page, activate Home
          if (scrollY < 200) {
            setActiveIndex(0);
            ticking = false;
            return;
          }

          // If near the bottom of the page, activate the last nav section
          if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 100) {
            setActiveIndex(items.length - 1);
            ticking = false;
            return;
          }

          // Map section IDs
          const sectionMappings: { id: string; index: number }[] = [];
          items.forEach((item, idx) => {
            if (item.href.startsWith("/#") || item.href.startsWith("#")) {
              const targetId = item.href.replace("/#", "").replace("#", "");
              sectionMappings.push({ id: targetId, index: idx });
            }
          });

          let currentIdx = 0; // Default to Home
          for (let i = 0; i < sectionMappings.length; i++) {
            const { id, index } = sectionMappings[i];
            const el = document.getElementById(id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= checkLine && rect.bottom > 80) {
                currentIdx = index;
              }
            }
          }

          setActiveIndex((prev) => (prev !== currentIdx ? currentIdx : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("hashchange", handleScroll);

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleScroll);
      clearTimeout(clickTimeout);
    };
  }, [pathname, items]);

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance: number, pointIndex: number, totalPoints: number): [number, number] => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i: number, t: number, d: [number, number], r: number) => {
    const rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    };
  };

  const makeParticles = (element: HTMLSpanElement) => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty("--time", `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove("active");

      setTimeout(() => {
        const particle = document.createElement("span");
        const point = document.createElement("span");
        particle.classList.add("particle");
        particle.style.setProperty("--start-x", `${p.start[0]}px`);
        particle.style.setProperty("--start-y", `${p.start[1]}px`);
        particle.style.setProperty("--end-x", `${p.end[0]}px`);
        particle.style.setProperty("--end-y", `${p.end[1]}px`);
        particle.style.setProperty("--time", `${p.time}ms`);
        particle.style.setProperty("--scale", `${p.scale}`);
        particle.style.setProperty("--color", `var(--color-${p.color}, white)`);
        particle.style.setProperty("--rotate", `${p.rotate}deg`);

        point.classList.add("point");
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => {
          element.classList.add("active");
        });
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            // Do nothing
          }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement> | { currentTarget: HTMLElement },
    index: number
  ) => {
    const target = e.currentTarget as HTMLElement;
    const liEl = target.tagName === "LI" ? target : target.parentElement;
    if (!liEl) return;

    setActiveIndex(index);
    updateEffectPosition(liEl);

    const item = items[index];
    if (item && item.href) {
      if (item.href.startsWith("/#")) {
        const targetId = item.href.replace("/#", "");
        if (pathname === "/") {
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            if (typeof window !== "undefined" && (window as any).lenis) {
              (window as any).lenis.scrollTo(targetEl, { duration: 1.2 });
            } else {
              targetEl.scrollIntoView({ behavior: "smooth" });
            }
          }
        } else {
          window.location.href = item.href;
        }
      } else if (item.href === "/") {
        if (pathname === "/") {
          if (typeof window !== "undefined" && (window as any).lenis) {
            (window as any).lenis.scrollTo(0, { duration: 1.2 });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        } else {
          router.push("/");
        }
      } else {
        router.push(item.href);
      }
    }

    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll(".particle");
      particles.forEach((p) => {
        try {
          filterRef.current?.removeChild(p);
        } catch {
          // Do nothing
        }
      });
    }

    if (textRef.current) {
      textRef.current.classList.remove("active");
      void textRef.current.offsetWidth;
      textRef.current.classList.add("active");
    }

    if (filterRef.current) {
      makeParticles(filterRef.current);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const liEl = e.currentTarget.parentElement;
      if (liEl) {
        handleClick({ currentTarget: liEl }, index);
      }
    }
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = navRef.current.querySelectorAll("li")[activeIndex];
    if (activeLi) {
      updateEffectPosition(activeLi as HTMLElement);
      textRef.current?.classList.add("active");
    }

    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll("li")[activeIndex];
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi as HTMLElement);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      <nav aria-label="Main Navigation">
        <ul ref={navRef}>
          {items.map((item, index) => (
            <li key={index} className={activeIndex === index ? "active" : ""}>
              <a
                href={item.href}
                aria-current={activeIndex === index ? "page" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(e, index);
                }}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <span aria-hidden="true" className="effect filter" ref={filterRef} />
      <span aria-hidden="true" className="effect text" ref={textRef} />
    </div>
  );
};

export default GooeyNav;
