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
    question: "How do I choose the right frame and size before ordering?",
    answer: "Simply send your photo on WhatsApp! Our framing experts review your image quality, recommend proportional dimensions for your wall, and share real photos of available frame styles, wood mouldings, and lamination finishes before you confirm.",
    shade: "bg-[#181818]",
  },
  {
    id: "q2",
    number: "02",
    question: "My photo was taken on a phone, will it look blurry when enlarged?",
    answer: "No. Before printing, our photo technicians run your image through professional AI enhancement and noise reduction to sharpen details, balance colors, and ensure crisp, vibrant large-format prints.",
    shade: "bg-[#212121]",
  },
  {
    id: "q3",
    number: "03",
    question: "What if my frame or glass gets damaged during shipping?",
    answer: "We pack every order in custom 5-layer bubble wrap, foam corner guards, and heavy-duty corrugated boxes. In the rare event of transit damage, simply send us a photo on WhatsApp and we dispatch a brand-new replacement immediately, 100% free with zero hassle.",
    shade: "bg-[#2b2b2b]",
  },
  {
    id: "q4",
    number: "04",
    question: "Can you repair and frame old or damaged vintage photos?",
    answer: "Yes! We specialize in digital photo restoration. We can remove tears, water stains, spots, and restore faded colors so your heritage family moments look brand new before framing.",
    shade: "bg-[#353535]",
  },
  {
    id: "q5",
    number: "05",
    question: "How long does crafting and delivery take?",
    answer: "Standard handcrafting takes 2-3 business days once your frame style and size are confirmed. Tracked courier delivery takes 2-4 days across Tamil Nadu and all major Indian cities, with live WhatsApp dispatch updates.",
    shade: "bg-[#3f3f3f]",
  },
  {
    id: "q6",
    number: "06",
    question: "How do I make payment and what areas do you ship to?",
    answer: "We accept all UPI apps (GPay, PhonePe, Paytm) and net banking. We deliver to all pin codes across Tamil Nadu and all Indian states with doorstep tracking.",
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
          <span className="text-xs text-white/50 tracking-[0.2em] font-mono uppercase block mb-1">
            [ FAQ ]
          </span>
          
          <h2>
            <span className="block font-cal-sans text-3xl sm:text-4xl md:text-5xl font-semibold tracking-normal text-white leading-[1.05]">
              Frequently Asked
            </span>
            <span className="block font-great-vibes text-4xl sm:text-5xl md:text-6xl font-normal text-white pt-1 -mt-1 leading-[1.05]">
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
