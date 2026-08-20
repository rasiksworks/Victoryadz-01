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
    question: "I am not near your shop, can I still order?",
    answer: "Yes, absolutely! Most of our customers order from across the state. You just send your photo on WhatsApp, we discuss sizes and frames, and then we ship the final piece directly to your door.",
    shade: "bg-[#181818]",
  },
  {
    id: "q2",
    number: "02",
    question: "How do I know the frame will look good before it is made?",
    answer: "We guide you through the process on WhatsApp. We will show you frame choices, recommend lamination styles, and ensure you are 100% happy with the selection before anything gets printed and framed.",
    shade: "bg-[#212121]",
  },
  {
    id: "q3",
    number: "03",
    question: "What if my photo is old or damaged?",
    answer: "We offer photo restoration services. Before printing, we can digitally repair old, torn, or faded photos so they look beautiful again before being framed.",
    shade: "bg-[#2b2b2b]",
  },
  {
    id: "q4",
    number: "04",
    question: "How long does an order take, start to delivery?",
    answer: "Typically, it takes 3-5 days to craft the frame once the design is approved, and standard shipping takes another 2-4 days depending on your location.",
    shade: "bg-[#353535]",
  },
  {
    id: "q5",
    number: "05",
    question: "What if something arrives damaged?",
    answer: "We pack our frames with extreme care, using multiple layers of protection. In the rare event that your frame arrives damaged, simply send us a photo on WhatsApp immediately, and we will arrange a replacement.",
    shade: "bg-[#3f3f3f]",
  },
  {
    id: "q6",
    number: "06",
    question: "What areas do you deliver to?",
    answer: "We offer safe, tracked shipping across Tamil Nadu and all of India.",
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
          
          <MaskTextReveal
            tag="h2"
            direction="center-horizontal"
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]"
          >
            Common Questions
          </MaskTextReveal>

          <ScrollHighlight className="text-sm md:text-base text-white/70 font-light leading-relaxed mt-2 block">
            Everything you need to know about our remote framing and delivery process.
          </ScrollHighlight>
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
                className={`${faq.shade} w-full transition-all duration-500 ease-out cursor-pointer relative select-none hover:brightness-[1.12] touch-manipulation`}
              >
                <div className="w-full py-4 sm:py-6 md:py-9 lg:py-10 px-4 sm:px-6 md:px-[60px] lg:px-[80px] flex items-start justify-between gap-3 sm:gap-6 md:gap-8">
                  {/* Left Side: Number + Title & Content */}
                  <div className="flex items-start gap-3 sm:gap-6 md:gap-8 flex-1">
                    {/* Stepped Bold Number */}
                    <span
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
                  <div className="flex md:hidden shrink-0 items-center justify-center w-7 h-7 rounded-full bg-white/10 text-white/90 self-start mt-0.5 transition-colors duration-500">
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.4, ease: LUXURY_EASE }}
                    >
                      <Plus className="w-3.5 h-3.5" />
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
