export interface GalleryItem {
  id: string;
  number: string;
  label?: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  date: string;
  credits: string;
  image: string;
  isFavorite?: boolean;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  initials?: string;
  featured?: boolean;
}

export interface SiteImages {
  brandVision: Record<string, string>;
  heroTunnel: Array<{ id: string; src: string; alt: string }>;
  exploreGallery: GalleryItem[];
  testimonials?: TestimonialItem[];
}

export type SectionKey = "heroTunnel" | "brandVision" | "exploreGallery" | "testimonials";

export interface SectionConfig {
  key: SectionKey;
  label: string;
  description: string;
  icon: string;
  count: number | string;
  ratio: string;
  resolution: string;
  minResolution: string;
}

export const SECTIONS: SectionConfig[] = [
  {
    key: "heroTunnel",
    label: "Hero Tunnel",
    description: "20 rotating portrait images inside the 3D Hero Gallery",
    icon: "⊟",
    count: 20,
    ratio: "3:4 Portrait",
    resolution: "1200 × 1600 px",
    minResolution: "800 × 1067 px",
  },
  {
    key: "brandVision",
    label: "Brand Vision",
    description: "6 layout craft images in the About / Brand Vision section",
    icon: "⬡",
    count: 6,
    ratio: "3:4 Portrait",
    resolution: "1200 × 1600 px",
    minResolution: "900 × 1200 px",
  },
  {
    key: "exploreGallery",
    label: "Explore Gallery",
    description: "Portfolio works & select 15 ⭐ favorites for Recent Works",
    icon: "⊠",
    count: 50,
    ratio: "3:4 Portrait",
    resolution: "1200 × 1600 px",
    minResolution: "900 × 1200 px",
  },
  {
    key: "testimonials",
    label: "Testimonials",
    description: "Customer reviews, avatar photos, locations, and featured status",
    icon: "💬",
    count: "4+",
    ratio: "1:1 Avatar",
    resolution: "400 × 400 px",
    minResolution: "200 × 200 px",
  },
];
