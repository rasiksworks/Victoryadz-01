"use client";

import Hero03 from "@/components/originkit/hero-03";
import { HowItWorks } from "@/components/originkit/ui/how-it-works";
import { BrandVisionSection } from "@/components/originkit/ui/brand-vision-section";
import { WeMostProudOf } from "@/components/originkit/ui/we-most-proud-of";
import { Testimonials } from "@/components/originkit/ui/testimonials";
import { WhyVictoryAdz } from "@/components/originkit/ui/why-victory-adz";
import { FAQ } from "@/components/originkit/ui/faq";
import { Footer } from "@/components/originkit/ui/footer";

export default function Home() {
  return (
    <main className="w-full bg-[#2C2C2C] flex flex-col overflow-x-clip">
      <Hero03 />
      <HowItWorks />
      <BrandVisionSection />
      <WeMostProudOf />
      <Testimonials />
      <WhyVictoryAdz />
      <FAQ />
      <Footer />
    </main>
  );
}
