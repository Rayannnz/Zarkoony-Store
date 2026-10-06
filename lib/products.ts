export type Product = {
  slug: string;
  name: string;
  price: number;
  image: string;
  badge: string;
  dispatch: string;
};

/** What the measurement drawer is opened for: a garment and its estimated cost in PKR. */
export type MeasureItem = { title: string; price: number };

export const products: Product[] = [
  {
    slug: "zariya-embroidered-kalidar",
    name: "Zariya Embroidered Kalidar",
    price: 28500,
    image: "/images/products/zariya-embroidered-kalidar.jpg",
    badge: "Custom Stitched",
    dispatch: "7-10 Days",
  },
  {
    slug: "mehr-velvet-formal-peshwas",
    name: "Mehr Velvet Formal Peshwas",
    price: 34900,
    image: "/images/products/mehr-velvet-formal-peshwas.jpg",
    badge: "Made to Order",
    dispatch: "10-14 Days",
  },
  {
    slug: "noor-embellished-angrakha",
    name: "Noor Embellished Angrakha",
    price: 42500,
    image: "/images/products/noor-embellished-angrakha.jpg",
    badge: "Signature Edit",
    dispatch: "12-14 Days",
  },
  {
    slug: "ayla-luxury-festive-set",
    name: "Ayla Luxury Festive Set",
    price: 24900,
    image: "/images/products/ayla-luxury-festive-set.jpg",
    badge: "Custom Stitched",
    dispatch: "7-10 Days",
  },
];

export const measurementFields = [
  { label: "1. Bust (Inches)", placeholder: "e.g. 36.5" },
  { label: "2. Waist (Inches)", placeholder: "e.g. 30" },
  { label: "3. Hips (Inches)", placeholder: "e.g. 40" },
  { label: "4. Shoulder Width", placeholder: "e.g. 14.5" },
  { label: "5. Shirt / Kurta Length", placeholder: "e.g. 48" },
  { label: "6. Trouser Length", placeholder: "e.g. 38" },
];

export const standardSizes = [
  { size: "XS", note: 'Chest 34"' },
  { size: "S", note: 'Chest 36"' },
  { size: "M", note: 'Chest 39"' },
  { size: "L", note: 'Chest 42"' },
  { size: "XL", note: 'Chest 45"' },
  { size: "Custom", note: "Bespoke" },
];

// Fixed locale so server and client render the same string.
export const formatPrice = (price: number) => `PKR ${price.toLocaleString("en-US")}`;
