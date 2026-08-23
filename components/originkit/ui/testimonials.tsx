"use client";

import React from "react";
import { Button01 } from "@/components/ui/nextjsshop-button";

export const Testimonials: React.FC = () => {
  const handleWhatsApp = () => {
    window.open(
      "https://wa.me/919361312684?text=" +
        encodeURIComponent("Hi VictoryAdz! I'd like to see some past framing examples and customer work."),
      "_blank"
    );
  };

  return (
    <section
      id="testimonials"
      className="relative w-full bg-[#2C2C2C] text-white font-inter-display select-none py-14 sm:py-20 md:py-24 lg:py-32 overflow-hidden border-t border-white/5"
    >
      <div className="w-full px-4 sm:px-6 md:px-[60px] lg:px-[60px] max-w-4xl mx-auto flex flex-col items-center text-center gap-8 sm:gap-10">

        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <h2>
            <span className="block font-cal-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-normal text-white leading-[1.05]">
              Trusted from
            </span>
            <span className="block font-great-vibes text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-white pt-1 -mt-1 leading-[1.05]">
              Near and Far
            </span>
          </h2>
        </div>

        {/* Placeholder Statement (Option A) */}
        <div className="w-full p-8 sm:p-12 md:p-14 border border-white/15 bg-white/5 backdrop-blur-md flex flex-col items-center gap-6 shadow-2xl">
          <p
            className="text-sm sm:text-base md:text-lg text-[#E0E0E0] font-inter-display font-medium leading-relaxed max-w-2xl text-center"
            style={{ letterSpacing: "0.5px" }}
          >
            We&apos;re currently collecting reviews from our customers. Real stories from real homes will appear here soon. In the meantime, message us on WhatsApp and we&apos;re happy to share examples of past work directly.
          </p>

          <div className="pt-2">
            <Button01
              text="Message on WhatsApp"
              ariaLabel="Message on WhatsApp"
              variant="light"
              onClick={handleWhatsApp}
            />
          </div>
        </div>

      </div>
    </section>
  );
};
