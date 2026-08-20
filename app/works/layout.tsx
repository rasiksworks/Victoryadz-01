import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Works & Framing Portfolio",
  description:
    "Explore our interactive gallery of custom handcrafted photo frames, sparkle & matte precision lamination, and preserved portraits by VictoryAdz.",
  alternates: {
    canonical: "/works",
  },
  openGraph: {
    title: "Our Works & Framing Gallery | VictoryAdz",
    description:
      "Explore our interactive gallery of custom handcrafted photo frames, sparkle & matte precision lamination, and preserved portraits by VictoryAdz.",
    url: "/works",
  },
};

export default function WorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
