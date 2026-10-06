import type { MeasureItem } from "./products";

/** A call to action either links somewhere or opens the measurement drawer for a garment. */
export type Cta = { label: string } & ({ href: string } | { item: MeasureItem });

export type CategoryCard = { image: string; alt: string; cta: Cta };

export type BannerCta = Cta & { variant: "black" | "white" };

export const hero = {
  heading: "ZARKOONY: custom stitched Pakistani couture, made to order",
  image: "/images/hero/velvet-couture.jpg",
  alt: "Zarkoony Grand Velvet Couture Collection",
  ctas: [
    { label: "Shop All", href: "#new-arrivals" },
    { label: "Custom Stitch", item: { title: "Bespoke Bridal Salon Commission", price: 45000 } },
  ] satisfies Cta[],
};

export const ownYourLook = {
  id: "custom-stitched",
  title: "Own Your New Look",
  cards: [
    {
      image: "/images/categories/bespoke-pret.jpg",
      alt: "ZARKOONY Everyday Luxury Raw Silk Kurta",
      cta: { label: "Bespoke Prêt", href: "#new-arrivals" },
    },
    {
      image: "/images/categories/custom-stitched.jpg",
      alt: "ZARKOONY Crimson Scarlet & Turquoise Embroidered Lehenga",
      cta: {
        label: "Custom Stitched",
        item: { title: "Crimson & Turquoise Festive Lehenga", price: 38500 },
      },
    },
  ] satisfies CategoryCard[],
};

export const signature = {
  id: "signature",
  title: "The Signature Collection",
  image: "/images/collections/signature.jpg",
  alt: "Zarkoony Twin Archival Couture Models",
  focus: "center 35%",
  align: "left" as const,
  ctas: [
    {
      variant: "black",
      label: "Custom Stitched",
      item: { title: "Zarkoony Archive Kalidar", price: 52000 },
    },
    { variant: "white", label: "Bespoke Bridal", href: "#chantelle-bridals" },
  ] satisfies BannerCta[],
};

export const formals = {
  id: "formals",
  title: "Formals",
  cards: [
    {
      image: "/images/categories/formals-crimson.jpg",
      alt: "ZARKOONY Formal Crimson Embroidered Ensemble",
      cta: { label: "View Ensemble", item: { title: "Scarlet Festive Lehenga Choli", price: 36500 } },
    },
    {
      image: "/images/categories/formals-raw-silk.jpg",
      alt: "ZARKOONY Powder Mint Embroidered Raw Silk Formal",
      cta: { label: "Custom Stitched", item: { title: "Mint Pearl Organza Kalidar", price: 32900 } },
    },
  ] satisfies CategoryCard[],
};

export const essentials = {
  id: "bespoke-process",
  title: "Bespoke Essentials",
  image: "/images/collections/bespoke-essentials.jpg",
  alt: "Zarkoony Velvet Couture & Velvet Shawl Essentials",
  focus: "center",
  align: "right" as const,
  ctas: [
    {
      variant: "white",
      label: "Measurement Guide",
      item: { title: "Velvet Embroidered Shawl Suite", price: 18500 },
    },
    { variant: "black", label: "How It Works", href: "#how-it-works-info" },
  ] satisfies BannerCta[],
};

export const newArrivals = {
  id: "new-arrivals",
  title: "New Arrivals",
  subtitle: "Custom Stitched • Master Karigar Tailoring",
};

export const madeToOrder = {
  id: "how-it-works-info",
  eyebrow: "100% Bespoke Architecture",
  quote:
    "Every garment is stitched to order with bespoke ease allowances and master handcraftsmanship.",
  assurances: [
    "Individual Atelier Measurements",
    "Certified Gold Zardozi & Tilla",
    "Complimentary Post-Stitch Alterations",
  ],
};
