import type { Metadata } from "next";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import PixelatedCursor from "@/components/originkit/ui/inkbleed-cursor";

export const metadata: Metadata = {
  title: "VictoryAdz - Originkit Hero 03",
  description: "Hero 03 Component Showcase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="relative">
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
