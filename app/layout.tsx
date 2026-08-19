import type { Metadata } from "next";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import PixelatedCursor from "@/components/originkit/ui/inkbleed-cursor";
import { Preloader } from "@/components/preloader";
import { Navbar } from "@/components/originkit/ui/hero-03/navbar";

export const metadata: Metadata = {
  title: "VictoryAdz - Premium Framing Studio",
  description: "Preserving memories with handcrafted frames and precision lamination.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="relative bg-[#2C2C2C] text-white" style={{ backgroundColor: "#2C2C2C" }}>
        <Preloader />
        <Navbar />
        <PixelatedCursor
          label={false}
          pixelCount={24}
          pixelSize={12}
          pixelShape="circle"
          trailColor="#FFFFFF"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            pointerEvents: "none",
            mixBlendMode: "difference",
          }}
        />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
