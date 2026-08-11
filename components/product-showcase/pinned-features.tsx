"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const features = [
  {
    id: 1,
    title: "Active Noise Cancellation",
    description:
      "Immerse yourself in pure sound. Our advanced ANC adapts to your environment in real-time, blocking out distractions so you can focus on what matters.",
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Spatial Audio",
    description:
      "Experience theater-like sound that surrounds you. Dynamic head tracking places sounds in a 3D space, making you feel like you're inside the music.",
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "All-Day Comfort",
    description:
      "Engineered for extended wear. Memory foam ear cushions and a lightweight headband provide a custom fit that feels virtually weightless.",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop",
  },
];

export function PinnedFeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        // Pin the left column while the right column scrolls naturally
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: leftColumnRef.current,
          pinSpacing: false,
        });

        // Optional: Animate opacity/y of right column cards as they scroll in
        const cards = gsap.utils.toArray<HTMLElement>(".feature-card");
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                end: "top 50%",
                scrub: true,
              },
            }
          );
        });
      });
      
      mm.add("(max-width: 1023px)", () => {
          // Mobile animations (no pinning)
          const cards = gsap.utils.toArray<HTMLElement>(".feature-card");
          cards.forEach((card) => {
            gsap.fromTo(
              card,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 85%",
                },
              }
            );
          });
      })
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#1A1A1A] text-white pt-24 pb-32"
    >
      <div className="container mx-auto px-6 lg:px-12 relative">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
          
          {/* Left Column (Pinned on Desktop) */}
          <div
            ref={leftColumnRef}
            className="w-full lg:w-1/2 flex flex-col justify-center h-[auto] lg:h-screen lg:sticky top-0 pt-0 lg:pt-24 pb-12 lg:pb-0 z-10"
          >
            <span className="text-sm md:text-base font-semibold tracking-[0.2em] text-white/70 uppercase mb-4">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Engineering Brilliance.
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-md font-light leading-relaxed">
              Every detail has been meticulously crafted to deliver an uncompromising acoustic experience. Discover the technology that powers the future of sound.
            </p>
          </div>

          {/* Right Column (Scrolls past) */}
          <div ref={rightColumnRef} className="w-full lg:w-1/2 flex flex-col gap-24 lg:gap-[30vh] lg:pt-[20vh] lg:pb-[20vh]">
            {features.map((feature) => (
              <div key={feature.id} className="feature-card flex flex-col gap-6 will-change-transform">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#2C2C2C]">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-base md:text-lg text-white/70 font-light leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
