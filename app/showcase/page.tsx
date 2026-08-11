import { HeroSection } from "@/components/product-showcase/hero";
import { PinnedFeaturesSection } from "@/components/product-showcase/pinned-features";
import { TrustSection } from "@/components/product-showcase/trust-section";

export default function ProductShowcasePage() {
  return (
    <main className="w-full min-h-screen bg-black">
      <HeroSection />
      <PinnedFeaturesSection />
      <TrustSection />
    </main>
  );
}
