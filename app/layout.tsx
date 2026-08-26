import type { Metadata, Viewport } from "next";
import { Inter, Great_Vibes } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import UserCursor from "@/components/originkit/ui/usercursor";
import { Preloader } from "@/components/preloader";
import { Navbar } from "@/components/originkit/ui/hero-03/navbar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-display",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-great-vibes",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://victoryadz.com";

export const viewport: Viewport = {
  themeColor: "#2C2C2C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "VictoryAdz - Custom Photo Framing Studio | 8+ Years Experience",
    template: "%s | VictoryAdz",
  },
  description:
    "Handcrafted custom photo frames and premium lamination finishes, trusted across Tamil Nadu for 8+ years. Order directly on WhatsApp, with no shop visit needed.",
  applicationName: "VictoryAdz",
  authors: [{ name: "VictoryAdz", url: siteUrl }],
  generator: "Next.js",
  keywords: [
    "VictoryAdz",
    "Victory Adz",
    "Photo Framing Studio",
    "Custom Photo Frames Tamil Nadu",
    "Photo Lamination Online",
    "Sparkle Lamination Frames",
    "Matte Finish Photo Frames",
    "Synthetic Wooden Photo Frames",
    "Wedding Photo Framing",
    "Family Portrait Frames",
    "Canvas Printing India",
    "Photo Restoration Service",
    "Order Photo Frames on WhatsApp",
    "Custom Wall Framing",
  ],
  referrer: "origin-when-cross-origin",
  creator: "VictoryAdz",
  publisher: "VictoryAdz",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "VictoryAdz - Premium Framing Studio | Custom Photo Frames & Lamination",
    description:
      "Preserve your cherished moments with handcrafted frames and precision lamination. Easy ordering via WhatsApp with nationwide safe delivery.",
    url: siteUrl,
    siteName: "VictoryAdz",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VictoryAdz Premium Custom Photo Framing Studio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VictoryAdz - Premium Framing Studio",
    description:
      "Handcrafted photo frames, precision lamination, and photo restoration across Tamil Nadu & India.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#business`,
      name: "VictoryAdz",
      alternateName: "Victory Adz Premium Framing Studio",
      url: siteUrl,
      logo: `${siteUrl}/og-image.png`,
      image: `${siteUrl}/og-image.png`,
      description:
        "Premium custom photo framing and precision lamination studio trusted for 8+ years across Tamil Nadu & India.",
      telephone: "+919361312684",
      priceRange: "₹₹",
      currenciesAccepted: "INR",
      paymentAccepted: "Cash, UPI, Credit Card, Debit Card, Net Banking",
      address: {
        "@type": "PostalAddress",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        addressCountry: "IN",
      },
      areaServed: [
        {
          "@type": "State",
          name: "Tamil Nadu",
        },
        {
          "@type": "Country",
          name: "India",
        },
      ],
      sameAs: [
        "https://www.instagram.com/victory__adz/",
        "https://wa.me/919361312684",
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "09:00",
          closes: "21:00",
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "VictoryAdz",
      description: "Handcrafted Custom Photo Frames & Precision Lamination Studio",
      publisher: {
        "@id": `${siteUrl}/#business`,
      },
      inLanguage: "en-US",
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#custom-framing`,
      name: "Custom Photo Framing",
      serviceType: "Photo Framing & Mounting",
      provider: {
        "@id": `${siteUrl}/#business`,
      },
      description:
        "Handcrafted synthetic and wooden photo frames tailored to any custom size, wedding portraits, and family memories.",
      areaServed: {
        "@type": "Country",
        name: "India",
      },
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#precision-lamination`,
      name: "Precision Photo Lamination",
      serviceType: "Photo Lamination & Protection",
      provider: {
        "@id": `${siteUrl}/#business`,
      },
      description:
        "High-definition matte, glossy, and sparkle lamination to protect photos from fading, moisture, and dust for decades.",
      areaServed: {
        "@type": "Country",
        name: "India",
      },
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#photo-restoration`,
      name: "Old Photo Restoration & Printing",
      serviceType: "Digital Restoration",
      provider: {
        "@id": `${siteUrl}/#business`,
      },
      description:
        "Digital repair and restoration of old, faded, or damaged family photographs before precision printing and framing.",
      areaServed: {
        "@type": "Country",
        name: "India",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "I am not near your shop, can I still order?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, absolutely! Most of our customers order from across the state. You just send your photo on WhatsApp, we discuss sizes and frames, and then we ship the final piece directly to your door.",
          },
        },
        {
          "@type": "Question",
          name: "How do I know the frame will look good before it is made?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We guide you through the process on WhatsApp. We will show you frame choices, recommend lamination styles, and ensure you are 100% happy with the selection before anything gets printed and framed.",
          },
        },
        {
          "@type": "Question",
          name: "What if my photo is old or damaged?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We offer photo restoration services. Before printing, we can digitally repair old, torn, or faded photos so they look beautiful again before being framed.",
          },
        },
        {
          "@type": "Question",
          name: "How long does an order take, start to delivery?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Typically, it takes 3-5 days to craft the frame once the design is approved, and standard shipping takes another 2-4 days depending on your location.",
          },
        },
        {
          "@type": "Question",
          name: "What if something arrives damaged?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We pack our frames with extreme care, using multiple layers of protection. In the rare event that your frame arrives damaged, simply send us a photo on WhatsApp immediately, and we will arrange a replacement.",
          },
        },
        {
          "@type": "Question",
          name: "What areas do you deliver to?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We offer safe, tracked shipping across Tamil Nadu and all of India.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Recent Works",
          item: `${siteUrl}/works`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Product Showcase",
          item: `${siteUrl}/showcase`,
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${greatVibes.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning className="relative bg-[#2C2C2C] text-white" style={{ backgroundColor: "#2C2C2C" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999999] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-bold focus:shadow-2xl focus:outline-none"
        >
          Skip to main content
        </a>
        <Preloader />
        <Navbar />
        <UserCursor name="VictoryAdz" color="#FFFFFF" textColor="#000000" />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
