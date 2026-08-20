"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface StepData {
  number: string;
  title: string;
  body: string;
  cellPosDesktop: {
    left: string;
    top: string;
  };
  contentPadding: string;
}

const STEPS: StepData[] = [
  {
    number: "01",
    title: "Send Your Photo",
    body: "Share your photo with us on WhatsApp. Any photo. any condition.",
    cellPosDesktop: { left: "0%", top: "0%" },
    contentPadding: "pt-[36px] px-[32px] pb-[40px] lg:pt-[40px] lg:pl-[40px] lg:pr-[32px] lg:pb-[48px]",
  },
  {
    number: "02",
    title: "We Guide You",
    body: "We help you choose the size, frame style, and lamination finish that suits your memory",
    cellPosDesktop: { left: "25%", top: "0%" },
    contentPadding: "pt-[36px] px-[32px] pb-[40px] lg:pt-[40px] lg:pl-[50px] lg:pr-[30px] lg:pb-[48px]",
  },
  {
    number: "03",
    title: "We Craft It",
    body: "Your frame is made by hand with the same care we have put into every order for 8+",
    cellPosDesktop: { left: "50%", top: "50%" },
    contentPadding: "pt-[36px] px-[32px] pb-[40px] lg:pt-[40px] lg:pl-[50px] lg:pr-[30px] lg:pb-[48px]",
  },
  {
    number: "04",
    title: "We Ship It Safely",
    body: "Packed carefully and shipped to your door, with WhatsApp updates the whole way.",
    cellPosDesktop: { left: "75%", top: "50%" },
    contentPadding: "pt-[36px] px-[32px] pb-[40px] lg:pt-[40px] lg:pl-[40px] lg:pr-[32px] lg:pb-[48px]",
  },
];

export const HowItWorksV2: React.FC = () => {
  return (
    <section
      id="how-it-works-v2-test"
      aria-label="How It Works Process (Test V2)"
      className="relative w-full bg-[#FFFFFF] text-white select-none overflow-hidden font-inter-display"
      style={{ fontFamily: "'Inter Display', sans-serif" }}
    >
      {/* Test Section Header Badge */}
      <div className="w-full bg-[#1C1C1C] py-3 px-6 text-center border-t border-b border-white/10">
        <span className="text-[11px] font-mono tracking-[0.25em] text-white/70 uppercase">
          ✦ Design Artifact Test Section — How It Works (v2) ✦
        </span>
      </div>

      {/* 1440x1024 Base Canvas Container */}
      <div className="relative w-full max-w-[1440px] mx-auto min-h-[960px] lg:min-h-[1024px] lg:h-[1024px] overflow-hidden bg-white">
        {/* 2. Full-bleed Background Image with -28px vertical bleed */}
        <div
          className="absolute inset-x-0 w-full h-[105.4%] -top-[28px] pointer-events-none z-0 overflow-hidden"
          style={{ height: "calc(100% + 56px)", top: "-28px" }}
        >
          <Image
            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1920&q=85"
            alt="Henna decorated hands with wedding ring"
            fill
            priority={false}
            sizes="100vw"
            className="object-cover object-center w-full h-full"
          />
        </div>

        {/* 3. Floating Hero Title Block (Top-Right Area: left 780px, top 80px on 1440 base) */}
        <div className="relative z-20 pt-12 px-6 sm:px-10 lg:pt-0 lg:px-0 lg:absolute lg:left-[54.16%] lg:top-[7.8%] lg:max-w-[556px] flex flex-col gap-4 lg:gap-[18px]">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-semibold text-white tracking-[-0.02em] leading-[1.08] lg:max-w-[551px]"
            style={{ fontFamily: "'Inter Display', sans-serif" }}
          >
            Four Simple Steps,
            <br />
            Zero Confusion
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg lg:text-[24px] font-medium text-[#E8E8E8] leading-snug lg:max-w-[556px]"
            style={{ fontFamily: "'Inter Display', sans-serif" }}
          >
            From your photo to your wall, wherever you are. No shop visit needed.
          </motion.p>
        </div>

        {/* 4. Desktop Staircase Layout (4 Cells: 2 Top-Left, 2 Bottom-Right) */}
        <div className="hidden lg:block absolute inset-0 z-10 pointer-events-none">
          {STEPS.map((step) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "absolute",
                left: step.cellPosDesktop.left,
                top: step.cellPosDesktop.top,
                width: "25%",
                height: "50%",
                backgroundColor: "rgba(0, 0, 0, 0.24)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
              }}
              className="pointer-events-auto border border-white/50 backdrop-blur-md flex flex-col justify-between"
            >
              {/* 4 Corner 7x7px White Dots */}
              <span className="absolute -top-[3.5px] -left-[3.5px] w-[7px] h-[7px] bg-white rounded-none pointer-events-none z-30" />
              <span className="absolute -top-[3.5px] -right-[3.5px] w-[7px] h-[7px] bg-white rounded-none pointer-events-none z-30" />
              <span className="absolute -bottom-[3.5px] -left-[3.5px] w-[7px] h-[7px] bg-white rounded-none pointer-events-none z-30" />
              <span className="absolute -bottom-[3.5px] -right-[3.5px] w-[7px] h-[7px] bg-white rounded-none pointer-events-none z-30" />

              <div className={`w-full h-full flex flex-col justify-between ${step.contentPadding}`}>
                {/* Step Number: SemiBold 40px #FFFFFF */}
                <div className="text-[36px] xl:text-[40px] font-semibold text-white tracking-tight leading-none">
                  {step.number}
                </div>

                {/* Text Container: Max width 280px, Spacing 18px */}
                <div className="w-full max-w-[280px] flex flex-col gap-[18px]">
                  <h3 className="text-[32px] xl:text-[40px] font-semibold text-white tracking-tight leading-[1.08]">
                    {step.title}
                  </h3>
                  <p className="text-[18px] xl:text-[20px] font-medium text-white leading-[1.3] text-pretty">
                    {step.body}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile & Tablet Responsive Grid Layout */}
        <div className="lg:hidden relative z-20 grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 sm:p-8 mt-8 pb-14">
          {STEPS.map((step) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="relative border border-white/50 bg-black/24 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between min-h-[340px]"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.24)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
              }}
            >
              {/* Corner 7x7px Dots */}
              <span className="absolute -top-[3.5px] -left-[3.5px] w-[7px] h-[7px] bg-white rounded-none" />
              <span className="absolute -top-[3.5px] -right-[3.5px] w-[7px] h-[7px] bg-white rounded-none" />
              <span className="absolute -bottom-[3.5px] -left-[3.5px] w-[7px] h-[7px] bg-white rounded-none" />
              <span className="absolute -bottom-[3.5px] -right-[3.5px] w-[7px] h-[7px] bg-white rounded-none" />

              <div className="text-3xl sm:text-4xl font-semibold text-white mb-8">
                {step.number}
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-2xl sm:text-3xl font-semibold text-white leading-tight">
                  {step.title}
                </h3>
                <p className="text-base sm:text-lg font-medium text-white leading-relaxed">
                  {step.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
