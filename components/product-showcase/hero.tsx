"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import siteData from "@/data/site-images.json";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Fade + slide up for text blocks on load (or scroll if further down)
      gsap.fromTo(
        textRef.current?.children ? Array.from(textRef.current.children) : [],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 2. Slower parallax effect for the product image
      // MatchMedia for responsive animations (reduce on mobile)
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Desktop parallax
        gsap.to(imageRef.current, {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      mm.add("(max-width: 767px)", () => {
        // Mobile - reduced or no parallax to ensure smooth performance
        gsap.to(imageRef.current, {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-black text-white"
    >
      {/* Background/Product Image with Parallax */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%] will-change-transform"
      >
        <Image
          src={siteData.hero.background}
          alt="Premium Product Showcase"
          fill
          priority
          className="object-cover opacity-60"
        />
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 flex flex-col items-center text-center mt-32">
        <div ref={textRef} className="max-w-4xl flex flex-col items-center">
          <span className="text-sm md:text-base font-semibold tracking-[0.2em] text-white/70 uppercase mb-6 will-change-transform">
            Introducing
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 will-change-transform">
            The Future of Sound.
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/80 max-w-2xl font-light leading-relaxed will-change-transform">
            Experience audio like never before with our premium over-ear headphones. Designed for audiophiles, perfected for everyone.
          </p>
        </div>
      </div>
    </section>
  );
}
