import type { Metadata } from "next";
import { HeroSection } from "@/components/product-showcase/hero";
import { PinnedFeaturesSection } from "@/components/product-showcase/pinned-features";
import { TrustSection } from "@/components/product-showcase/trust-section";

export const metadata: Metadata = {
  title: "Product Showcase & Quality Specs",
  description:
    "Discover the craftsmanship, durable materials, and museum-grade finishes engineered into every VictoryAdz frame.",
  alternates: {
    canonical: "/showcase",
  },
};

export default function ProductShowcasePage() {
  return (
    <main className="w-full min-h-screen bg-black">
      <HeroSection />
      <PinnedFeaturesSection />
      <TrustSection />
    </main>
  );
}
