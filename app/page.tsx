"use client";

import dynamic from "next/dynamic";
import Hero03 from "@/components/originkit/hero-03";

const HowItWorks = dynamic(
  () => import("@/components/originkit/ui/how-it-works-v2").then((mod) => mod.HowItWorksV2),
  { ssr: true }
);
const BrandVisionSection = dynamic(
  () => import("@/components/originkit/ui/brand-vision-section").then((mod) => mod.BrandVisionSection),
  { ssr: true }
);
const WeMostProudOf = dynamic(
  () => import("@/components/originkit/ui/we-most-proud-of").then((mod) => mod.WeMostProudOf),
  { ssr: true }
);
const Testimonials = dynamic(
  () => import("@/components/originkit/ui/testimonials").then((mod) => mod.Testimonials),
  { ssr: true }
);
const WhyVictoryAdz = dynamic(
  () => import("@/components/originkit/ui/why-victory-adz").then((mod) => mod.WhyVictoryAdz),
  { ssr: true }
);
const FAQ = dynamic(
  () => import("@/components/originkit/ui/faq").then((mod) => mod.FAQ),
  { ssr: true }
);
const Footer = dynamic(
  () => import("@/components/originkit/ui/footer").then((mod) => mod.Footer),
  { ssr: true }
);

export default function Home() {
  return (
    <main id="main-content" className="w-full bg-[#2C2C2C] flex flex-col overflow-x-clip">
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
