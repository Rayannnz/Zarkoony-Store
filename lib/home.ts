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
      item: { slug: "rania-pearl-trail-gown", title: "Rania Pearl Trail Gown", price: 98000 },
    },
  ] satisfies Cta[],
};

export const ownYourLook = {
  id: "custom-stitched",
  title: "Own Your New Look",
  cards: [
    {
      image: "/images/products/rose-raw-silk/2.jpg",
      alt: "ZARKOONY dusty-rose raw silk kurta set with cutwork",
      href: "/shop/luxury-pret",
      cta: { label: "Bespoke Prêt", href: "/shop/luxury-pret" },
    },
    {
      image: "/images/products/silver-gown/1.jpg",
      alt: "ZARKOONY silver-grey embellished bridal gown with train",
      href: "/shop/bridal",
      cta: {
        label: "Custom Stitched",
        item: { slug: "mahira-zardozi-bridal-gown", title: "Mahira Zardozi Bridal Gown", price: 145000 },
      },
    },
  ] satisfies CategoryCard[],
};

export const signature = {
  id: "signature",
  title: "The Signature Collection",
  image: "/images/hero/classical-salon.jpg",
  alt: "Zarkoony signature embellished gown in a classical salon",
  href: "/collections/signature",
  focus: "center 65%",
  align: "left" as const,
  ctas: [
    {
      variant: "black",
      label: "Custom Stitched",
      item: { slug: "zariya-embroidered-raw-silk-set", title: "Zariya Embroidered Raw Silk Set", price: 28500 },
    },
    { variant: "white", label: "Bespoke Bridal", href: "/shop/bridal" },
  ] satisfies BannerCta[],
};

export const formals = {
  id: "formals",
  title: "Formals",
  cards: [
    {
      image: "/images/products/silver-gown/4.jpg",
      alt: "ZARKOONY silver organza peshwas with embroidered train",
      href: "/shop/formals",
      cta: { label: "View Formals", href: "/shop/formals" },
    },
    {
      image: "/images/products/black-velvet-peshwas/1.jpg",
      alt: "ZARKOONY black velvet formal peshwas with gold tilla",
      href: "/shop/formals",
      cta: { label: "Custom Stitched", item: { slug: "mehr-velvet-formal-peshwas", title: "Mehr Velvet Formal Peshwas", price: 34900 } },
    },
  ] satisfies CategoryCard[],
};

export const essentials = {
  id: "bespoke-process",
  title: "Bespoke Essentials",
  image: "/images/collections/velvet-winter.jpg",
  alt: "Zarkoony velvet winter kurta sets in sapphire and black",
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
