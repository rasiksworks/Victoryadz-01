import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VictoryAdz - Premium Framing Studio",
    short_name: "VictoryAdz",
    description: "Preserving memories with handcrafted photo frames and precision lamination across Tamil Nadu.",
    start_url: "/",
    display: "standalone",
    background_color: "#2C2C2C",
    theme_color: "#2C2C2C",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/og-image.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
