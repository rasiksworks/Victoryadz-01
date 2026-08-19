import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "VictoryAdz Admin", description: "Image management for VictoryAdz website" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ height: "100vh", overflow: "hidden" }}>{children}</body>
    </html>
  );
}
