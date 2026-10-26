import { customDesign, type MeasureItem } from "./products";

/** A call to action either links somewhere or opens the measurement drawer for a garment. */
export type Cta = { label: string } & ({ href: string } | { item: MeasureItem });

/** `href` is where the photo itself leads; the CTA may go elsewhere (e.g. open the drawer). */
export type CategoryCard = { image: string; alt: string; href: string; cta: Cta };

/** `outline` is the secondary treatment: a white outline that fills on hover. */
export type BannerCta = Cta & { variant: "black" | "white" | "outline" };

export const hero = {
  heading: "ZARKOONY: custom stitched Pakistani couture, made to order",
  image: "/images/hero/marble-courtyard.jpg",
  width: 1920,
  height: 1080,
  alt: "Zarkoony hand-embellished ivory couture gown with a train in a sunlit marble courtyard",
  /** object-position; keeps the model's head clear of the transparent header's logo when the hero is cropped wide. */
  focus: "center 0%",
  /** Custom design is the primary action; the broad "Shop All" sits beside it as an outline. */
  ctas: [
    { variant: "outline", label: "Shop All", href: "/shop" },
    { variant: "white", label: "Your Custom Design", href: "/custom-orders" },
  ] satisfies BannerCta[],
};

export const ownYourLook = {
  id: "custom-stitched",
  title: "Own Your New Look",
  cards: [
    {
      image: "/images/products/powder-blue-block/1.jpg",
      alt: "ZARKOONY powder-blue cotton-silk kurta set with block-print motifs",
      href: "/shop/luxury-pret",
      cta: { label: "Bespoke Prêt", href: "/shop/luxury-pret" },
    },
    {
      image: "/images/products/blush-silver/1.jpg",
      alt: "ZARKOONY blush raw silk kurta set with silver tilla and scarlet dupatta",
      href: "/shop/formals",
      cta: customDesign,
    },
  ] satisfies CategoryCard[],
};

export const signature = {
  id: "signature",
  title: "The Signature Collection",
  image: "/images/collections/signature.jpg",
  alt: "Zarkoony signature kurta sets in sage, mint and beige",
  href: "/collections/signature",
  focus: "center",
  align: "left" as const,
  ctas: [
    { variant: "black", ...customDesign },
    { variant: "white", label: "Bespoke Formals", href: "/shop/formals" },
  ] satisfies BannerCta[],
};

export const formals = {
  id: "formals",
  title: "Formals",
  cards: [
    {
      image: "/images/products/rose-gold-jaal/1.jpg",
      alt: "ZARKOONY rose-gold raw silk kurta set with gold jaal",
      href: "/shop/formals",
      cta: { label: "View Formals", href: "/shop/formals" },
    },
    {
      image: "/images/products/emerald-gold/1.jpg",
      alt: "ZARKOONY emerald raw silk kurta set with gold tilla lattice",
      href: "/shop/formals",
      cta: customDesign,
    },
  ] satisfies CategoryCard[],
};

export const essentials = {
  id: "bespoke-process",
  title: "Bespoke Essentials",
  image: "/images/collections/winter-edit.jpg",
  alt: "Zarkoony winter edit kurta sets in plum, emerald and fuchsia",
  href: "/collections/winter-edit",
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
  subtitle: `${customDesign.label} • Master Karigar Tailoring`,
  subtitleHref: customDesign.href,
};

export const madeToOrder = {
  id: "how-it-works-info",
  /** The one script accent on the site: short and decorative, never essential information. */
  accent: "Made around you",
  quote:
    "Every garment is stitched to order with bespoke ease allowances and master handcraftsmanship.",
  assurances: [
    "Individual Atelier Measurements",
    "Certified Gold Zardozi & Tilla",
    "Complimentary Post-Stitch Alterations",
  ],
};
