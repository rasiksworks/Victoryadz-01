"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import MaskTextReveal from "@/components/originkit/ui/mask-text-reveal";
import ScrollHighlight from "@/components/originkit/ui/scroll-text-highlight";

interface FAQItem {
  id: string;
  number: string;
  question: string;
  answer: string;
  shade: string;
}

const FAQS: FAQItem[] = [
  {
    id: "q1",
    number: "01",
    question: "I'm not near your shop, can I still order?",
    answer: "Yes, absolutely! Many of our customers order from across the state. You send your photo on WhatsApp, we discuss sizes and frames together, and then we ship the final piece directly to your door.",
    shade: "bg-[#181818]",
  },
  {
    id: "q2",
    number: "02",
    question: "How do I know the frame will look good before it's made?",
    answer: "We guide you through the process on WhatsApp. We'll show you frame choices, recommend lamination styles, and make sure you're happy with the selection before anything gets printed and framed.",
    shade: "bg-[#212121]",
  },
  {
    id: "q3",
    number: "03",
    question: "What if my photo is old or damaged?",
    answer: "We offer photo restoration. Before printing, we can digitally repair old, torn, or faded photos so they look their best once framed.",
    shade: "bg-[#2b2b2b]",
  },
  {
    id: "q4",
    number: "04",
    question: "How long does an order take, start to delivery?",
    answer: "Usually 5–7 days from approval to delivery, depending on your location.",
    shade: "bg-[#353535]",
  },
  {
    id: "q5",
    number: "05",
    question: "What if something arrives damaged?",
    answer: "We pack every frame carefully to prevent damage in transit. In the rare case something arrives damaged, message us a photo on WhatsApp right away and we'll sort out a replacement.",
    shade: "bg-[#3f3f3f]",
  },
  {
    id: "q6",
    number: "06",
    question: "What areas do you deliver to?",
    answer: "Tamil Nadu and pan-India shipping.",
    shade: "bg-[#4a4a4a]",
  },
];

// Luxury Apple-style smooth easing curve
const LUXURY_EASE = [0.22, 1, 0.36, 1] as const;

export const FAQ: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>("q1");

  return (
    <section
      id="faq"
      className="relative w-full bg-[#2C2C2C] text-white font-inter-display select-none py-8 sm:py-12 md:py-20 lg:py-24"
    >
      <div className="w-full flex flex-col gap-10 md:gap-14">
        
        {/* Header Section */}
        <div className="w-full px-4 sm:px-6 md:px-[60px] lg:px-[60px] flex flex-col items-start gap-3 max-w-2xl">
          <h2>
            <span className="block font-cal-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-normal text-white leading-[1.05]">
              Frequently Asked
            </span>
            <span className="block font-great-vibes text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-white pt-1 -mt-1 leading-[1.08]">
              Questions
            </span>
          </h2>

          <p
            className="text-sm md:text-base text-[#DCDCDC] font-inter-display font-medium leading-relaxed mt-2 block"
            style={{ letterSpacing: "0.5px" }}
          >
            Everything you need to know about our remote framing and delivery process.
          </p>
        </div>

        {/* Full-Width Stepped Gradient Shaded Rows */}
        <div className="w-full flex flex-col shadow-2xl overflow-hidden">
          {FAQS.map((faq, index) => {
            const isOpen = activeId === faq.id;

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -30px 0px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  ease: LUXURY_EASE,
                }}
                onMouseEnter={() => {
                  if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
                    setActiveId(faq.id);
                  }
                }}
                onClick={() => setActiveId(isOpen ? null : faq.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveId(isOpen ? null : faq.id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${faq.id}`}
                id={`faq-header-${faq.id}`}
                className={`${faq.shade} w-full min-h-[56px] transition-all duration-500 ease-out cursor-pointer relative select-none hover:brightness-[1.12] touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white`}
              >
                <div className="w-full py-4 sm:py-6 md:py-9 lg:py-10 px-4 sm:px-6 md:px-[60px] lg:px-[80px] flex items-start justify-between gap-3 sm:gap-6 md:gap-8">
                  {/* Left Side: Number + Title & Content */}
                  <div className="flex items-start gap-3 sm:gap-6 md:gap-8 flex-1">
                    {/* Stepped Bold Number */}
                    <span
                      aria-hidden="true"
                      className="text-xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold text-white tracking-tight shrink-0 w-6 sm:w-12 leading-none pt-0.5 md:pt-1 transition-colors duration-500 ease-out"
                    >
                      {faq.number}
                    </span>

                    {/* High-Contrast Editorial Title & Revealable Subtext */}
                    <div className="flex flex-col flex-1">
                      <h3
                        className="text-xl sm:text-2xl md:text-3xl lg:text-[42px] leading-[1.2] sm:leading-[1.15] text-white font-semibold tracking-tight transition-colors duration-500 ease-out"
                      >
                        {faq.question}
                      </h3>

                      {/* Luxurious Smooth & Slow Revealing Answer */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={`faq-answer-${faq.id}`}
                            role="region"
                            aria-labelledby={`faq-header-${faq.id}`}
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                              marginTop: 14,
                              transition: {
                                height: { duration: 0.55, ease: LUXURY_EASE },
                                marginTop: { duration: 0.55, ease: LUXURY_EASE },
                                opacity: { duration: 0.45, delay: 0.1, ease: "easeOut" },
                              },
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                              marginTop: 0,
                              transition: {
                                height: { duration: 0.42, ease: LUXURY_EASE },
                                marginTop: { duration: 0.42, ease: LUXURY_EASE },
                                opacity: { duration: 0.25, ease: "easeIn" },
                              },
                            }}
                            className="overflow-hidden"
                          >
                            <p className="text-xs sm:text-sm md:text-[15px] text-white/80 font-sans font-light max-w-2xl leading-relaxed pr-2 sm:pr-6">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Right Side: Mobile Plus Indicator (rotates smoothly on open) */}
                  <div aria-hidden="true" className="flex md:hidden shrink-0 items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white/90 self-start mt-0.5 transition-colors duration-500">
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.4, ease: LUXURY_EASE }}
                    >
                      <Plus className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
