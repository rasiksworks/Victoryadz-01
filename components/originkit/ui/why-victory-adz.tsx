"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Layers,
  Award,
  Tag,
  MessageSquare,
} from "lucide-react";
import MaskTextReveal from "@/components/originkit/ui/mask-text-reveal";
import ScrollHighlight from "@/components/originkit/ui/scroll-text-highlight";

interface ReasonCard {
  id: string;
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const REASONS: ReasonCard[] = [
  {
    id: "materials",
    number: "[ 01 ]",
    icon: ShieldCheck,
    title: "Premium Quality Materials",
    description:
      "We never compromise on frame material — every piece is built to last, not just look good on day one.",
  },
  {
    id: "finishes",
    number: "[ 02 ]",
    icon: Layers,
    title: "Multiple Lamination Finishes",
    description:
      "From matte to glossy to textured — choose the finish that protects and elevates your photo the way you want.",
  },
  {
    id: "experience",
    number: "[ 03 ]",
    icon: Award,
    title: "8+ Years of Experience",
    description:
      "We've been perfecting this craft since day one — every frame reflects years of precision and care.",
  },
  {
    id: "pricing",
    number: "[ 04 ]",
    icon: Tag,
    title: "Reasonable, Honest Pricing",
    description:
      "High quality shouldn't mean high prices. We keep it fair, without cutting corners.",
  },
  {
    id: "guided",
    number: "[ 05 ]",
    icon: MessageSquare,
    title: "Personally Guided Orders",
    description:
      "No confusing checkout — you talk to us directly on WhatsApp, and we help you pick exactly what's right.",
  },
];

export const WhyVictoryAdz: React.FC = () => {
  return (
    <section
      id="why-victory-adz"
      className="relative w-full bg-[#2C2C2C] text-white font-inter-display select-none py-16 md:py-24"
    >
      <div className="w-full px-6 md:px-[60px] lg:px-[60px] flex flex-col gap-12 md:gap-16">
        
        {/* Header Section */}
        <div className="flex flex-col items-start gap-3 max-w-2xl">
          <span className="text-xs text-white/50 tracking-[0.2em] font-mono uppercase block mb-1">
            [ WHY US ]
          </span>
          
          <MaskTextReveal
            tag="h2"
            direction="center-horizontal"
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]"
          >
            Why Choose VictoryAdz
          </MaskTextReveal>

          <ScrollHighlight className="text-sm md:text-base text-white/70 font-light leading-relaxed mt-2 block">
            8 years of craftsmanship, built on quality and trust — not shortcuts.
          </ScrollHighlight>
        </div>

        {/* 5 Reason Cards Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {REASONS.map((reason, index) => {
            const Icon = reason.icon;
            const isLast = index === REASONS.length - 1;

            return (
              <motion.div
                key={reason.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group relative flex flex-col justify-between p-6 md:p-8 bg-[#363636]/60 border border-white/10 rounded-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-white/25 hover:bg-[#363636]/90 hover:shadow-2xl hover:shadow-black/40 ${
                  isLast ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                {/* Top Row: Icon + Number Badge */}
                <div className="flex items-center justify-between mb-8">
                  <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center text-white/90 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300 shadow-inner">
                    <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <span className="font-mono text-[11px] text-white/40 tracking-wider group-hover:text-white/70 transition-colors">
                    {reason.number}
                  </span>
                </div>

                {/* Content: Title + Description */}
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-lg md:text-xl font-bold tracking-tight text-white group-hover:text-white transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-xs md:text-sm text-white/70 font-light leading-relaxed">
                    {reason.description}
                  </p>
                </div>

                {/* Bottom Decorative Line Accent on Hover */}
                <div className="w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full mt-6 opacity-60" />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
