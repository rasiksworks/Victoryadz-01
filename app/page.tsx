"use client";

import dynamic from "next/dynamic";
import { BrandVisionSection } from "@/components/originkit/ui/brand-vision-section";
import { WeMostProudOf } from "@/components/originkit/ui/we-most-proud-of";
import { WhyVictoryAdz } from "@/components/originkit/ui/why-victory-adz";
import { Footer } from "@/components/originkit/ui/footer";

const Hero03 = dynamic(() => import("@/components/originkit/hero-03"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="w-full bg-[#2C2C2C] flex flex-col space-y-[100px]">
      <Hero03 />
      <BrandVisionSection />
      <WeMostProudOf />
      <WhyVictoryAdz />
      <Footer />
    </main>
  );
}

