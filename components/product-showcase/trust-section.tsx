"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stats = [
  { id: 1, value: 500, label: "Clients Worldwide", suffix: "+" },
  { id: 2, value: 99, label: "Satisfaction Rate", suffix: "%" },
  { id: 3, value: 50, label: "Awards Won", suffix: "+" },
];

const testimonials = [
  {
    id: 1,
    quote: "The acoustic performance is unmatched. It feels like stepping into a private studio.",
    author: "Alex Rivers",
    role: "Audio Engineer",
  },
  {
    id: 2,
    quote: "Finally, a pair of headphones that look as premium as they sound. Incredibly comfortable.",
    author: "Jordan Lee",
    role: "Creative Director",
  },
  {
    id: 3,
    quote: "The spatial audio feature completely changed how I experience my favorite albums.",
    author: "Taylor Smith",
    role: "Music Producer",
  },
];

export function TrustSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Animate stat numbers counting up
      countersRef.current.forEach((counter, i) => {
        if (!counter) return;
        const targetValue = stats[i].value;

        ScrollTrigger.create({
          trigger: counter,
          start: "top 90%",
          once: true, // Only animate once
          onEnter: () => {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: targetValue,
              duration: 2,
              ease: "power2.out",
              onUpdate: () => {
                counter.innerText = Math.round(obj.val).toString();
              },
            });
          },
        });
      });

      // 2. Stagger in testimonial cards
      gsap.fromTo(
        cardsRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse", // Replays on scroll up/down
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#2C2C2C] text-white py-24 md:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mb-24">
          {stats.map((stat, i) => (
            <div key={stat.id} className="flex flex-col items-center">
              <div className="text-5xl md:text-6xl font-bold tracking-tight mb-2 flex items-baseline">
                <span
                  ref={(el) => {
                    countersRef.current[i] = el;
                  }}
                  className="font-mono"
                >
                  0
                </span>
                <span className="text-3xl md:text-4xl text-[#FF6B6B] ml-1">{stat.suffix}</span>
              </div>
              <span className="text-sm md:text-base font-semibold tracking-[0.15em] text-white/60 uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-sm md:text-base font-semibold tracking-[0.2em] text-white/70 uppercase mb-4">
            Trusted By The Best
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Don&apos;t just take our word for it.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div
              key={testimonial.id}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="bg-[#1c1c1c] p-8 md:p-10 rounded-2xl flex flex-col justify-between will-change-transform"
            >
              <div className="mb-8">
                {/* 5 Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, idx) => (
                    <svg key={idx} className="w-4 h-4 text-[#FF6B6B]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed italic">
                  &quot;{testimonial.quote}&quot;
                </p>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white tracking-wide">{testimonial.author}</span>
                <span className="text-sm text-white/50">{testimonial.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
