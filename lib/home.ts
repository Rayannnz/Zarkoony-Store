import type { MeasureItem } from "./products";

/** A call to action either links somewhere or opens the measurement drawer for a garment. */
export type Cta = { label: string } & ({ href: string } | { item: MeasureItem });

/** `href` is where the photo itself leads; the CTA may go elsewhere (e.g. open the drawer). */
export type CategoryCard = { image: string; alt: string; href: string; cta: Cta };

export type BannerCta = Cta & { variant: "black" | "white" };

export const hero = {
  heading: "ZARKOONY: custom stitched Pakistani couture, made to order",
  image: "/images/hero/atelier-salon.jpg",
  width: 1672,
  height: 941,
  alt: "Zarkoony hand-embellished sage couture gown in the atelier salon",
  /** object-position; keeps the chandelier out from behind the transparent header's logo. */
  focus: "center 25%",
  ctas: [
    { label: "Shop All", href: "/shop" },
    {
      label: "Custom Stitch",
      item: { slug: "rania-pearl-gharara-ensemble", title: "Rania Pearl Gharara Ensemble", price: 98000 },
    },
  ] satisfies Cta[],
};

export const ownYourLook = {
  id: "custom-stitched",
  title: "Own Your New Look",
  cards: [
    {
      image: "/images/categories/bespoke-pret.jpg",
      alt: "ZARKOONY Everyday Luxury Raw Silk Kurta",
      href: "/shop/luxury-pret",
      cta: { label: "Bespoke Prêt", href: "/shop/luxury-pret" },
    },
    {
      image: "/images/categories/custom-stitched.jpg",
      alt: "ZARKOONY Crimson Scarlet & Turquoise Embroidered Lehenga",
      href: "/shop/bridal",
      cta: {
        label: "Custom Stitched",
        item: { slug: "mahira-zardozi-bridal-lehenga", title: "Mahira Zardozi Bridal Lehenga", price: 145000 },
      },
    },
  ] satisfies CategoryCard[],
};

export const signature = {
  id: "signature",
  title: "The Signature Collection",
  image: "/images/collections/signature.jpg",
  alt: "Zarkoony Twin Archival Couture Models",
  href: "/collections/signature",
  focus: "center 35%",
  align: "left" as const,
  ctas: [
    {
      variant: "black",
      label: "Custom Stitched",
      item: { slug: "zariya-embroidered-kalidar", title: "Zariya Embroidered Kalidar", price: 28500 },
    },
    { variant: "white", label: "Bespoke Bridal", href: "/shop/bridal" },
  ] satisfies BannerCta[],
};

export const formals = {
  id: "formals",
  title: "Formals",
  cards: [
    {
      image: "/images/categories/formals-crimson.jpg",
      alt: "ZARKOONY Formal Crimson Embroidered Ensemble",
      href: "/shop/formals",
      cta: { label: "View Formals", href: "/shop/formals" },
    },
    {
      image: "/images/categories/formals-raw-silk.jpg",
      alt: "ZARKOONY Powder Mint Embroidered Raw Silk Formal",
      href: "/shop/formals",
      cta: { label: "Custom Stitched", item: { slug: "sahar-organza-peshwas", title: "Sahar Organza Peshwas", price: 36500 } },
    },
  ] satisfies CategoryCard[],
};

export const essentials = {
  id: "bespoke-process",
  title: "Bespoke Essentials",
  image: "/images/collections/bespoke-essentials.jpg",
  alt: "Zarkoony Velvet Couture & Velvet Shawl Essentials",
  href: "/collections/velvet-winter",
  focus: "center",
  align: "right" as const,
  ctas: [
    {
      variant: "white",
      label: "Measurement Guide",
      href: "/made-to-order/measurement-guide",
    },
    { variant: "black", label: "How It Works", href: "/made-to-order" },
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
