export type CategorySlug = "formals" | "bridal" | "festive" | "luxury-pret";
export type CollectionSlug = "signature" | "luxury-edit" | "velvet-winter" | "eid-edit";
export type Size = "XS" | "S" | "M" | "L" | "XL";
export type Availability = "made-to-order" | "limited" | "archived";

export type Category = { slug: CategorySlug; name: string; description: string; image: string };

export type Collection = {
  slug: CollectionSlug;
  name: string;
  tagline: string;
  description: string;
  image: string;
  /** object-position for the banner crop. */
  focus: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: CategorySlug;
  collection?: CollectionSlug;
  /** Garment silhouette, e.g. Kalidar. */
  type: string;
  fabric: string;
  color: string;
  occasion: string;
  description: string;
  embroidery: string[];
  pieces: string[];
  sizes: Size[];
  customSizingAvailable: boolean;
  madeToOrder: true;
  /** Working days in the atelier, min and max. */
  stitchingTime: [number, number];
  /** Working days from final inspection to dispatch. */
  dispatchTime: number;
  availability: Availability;
  isNew?: boolean;
  createdAt: string;
  badge: string;
};

/** What the measurement drawer is opened for: a garment and its estimated cost in PKR. */
/** The "custom design" promise: one label and link reused by the home CTAs and product badges. */
export const customDesign = { label: "Your Custom Design", href: "/custom-orders" } as const;

export type MeasureItem = { slug?: string; title: string; price: number };

export const sizeOrder: Size[] = ["XS", "S", "M", "L", "XL"];

export const categories: Category[] = [
  {
    slug: "formals",
    name: "Formals",
    description:
      "Wedding-guest and evening formals: kalidars, peshwas and shararas in raw silk, organza and jamawar, each cut to your measurements.",
    image: "/images/products/black-velvet-peshwas/1.jpg",
  },
  {
    slug: "bridal",
    name: "Bridal",
    description:
      "Lehengas, ghararas and peshwas commissioned through the bridal salon, with a dedicated fitting consultation.",
    image: "/images/products/silver-gown/1.jpg",
  },
  {
    slug: "festive",
    name: "Festive",
    description:
      "Eid, mehndi and celebration wear with lighter embellishment and a quicker stitching window.",
    image: "/images/products/sapphire-velvet/1.jpg",
  },
  {
    slug: "luxury-pret",
    name: "Luxury Prêt",
    description:
      "Everyday luxury: bespoke kurta sets, kalidars and maxis in raw silk, cotton silk and chiffon.",
    image: "/images/products/rose-raw-silk/1.jpg",
  },
];

export const collections: Collection[] = [
  {
    slug: "signature",
    name: "The Signature Collection",
    tagline: "Archival silhouettes, cut again for you",
    description:
      "The house silhouettes that defined ZARKOONY, re-cut each season in new fabrics and handwork. Every piece is stitched to order.",
    image: "/images/hero/classical-salon.jpg",
    focus: "center 65%",
  },
  {
    slug: "luxury-edit",
    name: "Luxury Edit",
    tagline: "Our richest fabrics and handwork",
    description:
      "Jamawar, organza and raw silk carrying the heaviest zardozi, tilla and pearl work in the atelier.",
    image: "/images/products/silver-gown/2.jpg",
    focus: "center 35%",
  },
  {
    slug: "velvet-winter",
    name: "Velvet Winter",
    tagline: "Velvet couture and shawl suits for the season",
    description:
      "Deep-pile velvet peshwas, kurta sets and embroidered shawls, lined and finished for the wedding season.",
    image: "/images/collections/velvet-winter.jpg",
    focus: "center",
  },
  {
    slug: "eid-edit",
    name: "Eid Edit",
    tagline: "Festive pieces stitched in time for Eid",
    description:
      "Lighter embellishment on chiffon, net and cotton silk, with a shorter stitching window so the piece arrives before the day.",
    image: "/images/products/copper-raw-silk/1.jpg",
    focus: "center 30%",
  },
];

// The shoot: six outfits, each shared by two or three products that lead with a different view.
const shot = (outfit: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/images/products/${outfit}/${i + 1}.jpg`);
const silver = shot("silver-gown", 6);
const rose = shot("rose-raw-silk", 4);
const velvetPeshwas = shot("black-velvet-peshwas", 2);
const velvetKurta = shot("black-velvet-kurta", 4);
const sapphire = shot("sapphire-velvet", 4);
const copper = shot("copper-raw-silk", 4);
/** Shots by 1-based number, in the order the gallery shows them. */
const pick = (set: string[], ...order: number[]) => order.map((n) => set[n - 1]);

const base = {
  sizes: sizeOrder,
  customSizingAvailable: true,
  madeToOrder: true as const,
  dispatchTime: 2,
  availability: "made-to-order" as const,
};

export const products: Product[] = [
  {
    ...base,
    id: "zk-001",
    slug: "zariya-embroidered-raw-silk-set",
    name: "Zariya Embroidered Raw Silk Set",
    price: 28500,
    images: pick(rose, 4, 1, 2, 3),
    category: "formals",
    collection: "signature",
    type: "Kurta Set",
    fabric: "Raw Silk",
    color: "Dusty rose",
    occasion: "Wedding guest",
    description:
      "A dusty-rose raw silk kurta with hand-cut embroidery along the placket and hem, a straight trouser and a chiffon dupatta edged in the same work. Cut to your shoulder and length so the cutwork sits exactly where it should.",
    embroidery: ["Cutwork and sequin placket", "Scalloped embroidered hem", "Embroidered chiffon dupatta border"],
    pieces: ["Kurta", "Straight raw-silk trouser", "Chiffon dupatta"],
    stitchingTime: [14, 21],
    createdAt: "2026-06-12",
    badge: customDesign.label,
  },
  {
    ...base,
    id: "zk-002",
    slug: "mehr-velvet-formal-peshwas",
    name: "Mehr Velvet Formal Peshwas",
    price: 34900,
    images: pick(velvetPeshwas, 1, 2),
    category: "formals",
    collection: "velvet-winter",
    type: "Peshwas",
    fabric: "Velvet",
    color: "Black",
    occasion: "Evening formal",
    description:
      "A floor-length black velvet peshwas with a gold tilla yoke and sequins scattered through the flare, worn with a net dupatta edged in maroon velvet. Fully lined, with the sleeve length and flare set to you.",
    embroidery: ["Gold tilla and dabka yoke", "Sequin-scattered flare", "Maroon velvet dupatta border"],
    pieces: ["Peshwas", "Silk churidar", "Net dupatta"],
    stitchingTime: [14, 21],
    createdAt: "2026-05-20",
    badge: "Made to Order",
  },
  {
    ...base,
    id: "zk-003",
    slug: "sahar-organza-peshwas",
    name: "Sahar Organza Peshwas",
    price: 36500,
    images: pick(silver, 2, 3, 4, 1, 5, 6),
    category: "formals",
    collection: "luxury-edit",
    type: "Peshwas",
    fabric: "Organza",
    color: "Silver grey",
    occasion: "Mehndi and wedding",
    description:
      "Silver-grey organza over a silk slip, embroidered edge to edge in silver zardozi and sequins, with a sweeping train. The bodice is drafted from your own measurements so the layers sit flat.",
    embroidery: ["Silver zardozi bodice", "Sequin-embroidered skirt panels", "Scalloped embroidered train"],
    pieces: ["Peshwas", "Silk slip", "Net dupatta"],
    stitchingTime: [14, 21],
    createdAt: "2026-07-02",
    badge: "Luxury Edit",
  },
  {
    ...base,
    id: "zk-004",
    slug: "laila-sapphire-velvet-set",
    name: "Laila Sapphire Velvet Set",
    price: 39500,
    compareAtPrice: 44500,
    images: pick(sapphire, 2, 1, 3, 4),
    category: "formals",
    collection: "luxury-edit",
    type: "Kurta Set",
    fabric: "Velvet",
    color: "Sapphire",
    occasion: "Wedding guest",
    description:
      "A sapphire velvet kurta embroidered in silver tilla from the neckline to the hem border, with a velvet trouser and a silver-edged net dupatta. The kurta length and sleeve are cut to you.",
    embroidery: ["Silver tilla neckline and front panel", "Embroidered hem border", "Silver-edged net dupatta"],
    pieces: ["Velvet kurta", "Velvet trouser", "Net dupatta"],
    stitchingTime: [14, 21],
    createdAt: "2026-04-15",
    badge: "Luxury Edit",
  },
  {
    ...base,
    id: "zk-005",
    slug: "noor-embellished-net-gown",
    name: "Noor Embellished Net Gown",
    price: 42500,
    images: pick(silver, 1, 3, 4, 5, 2, 6),
    category: "bridal",
    collection: "signature",
    type: "Gown",
    fabric: "Net",
    color: "Silver grey",
    occasion: "Nikkah and valima",
    description:
      "A silver-grey net gown over silk, hand-embroidered in sequins and silver thread from the round neckline to the train. The bodice and waist are drafted to your measurements so the train falls from the right point.",
    embroidery: ["Sequin and silver-thread bodice", "Embroidered skirt panels", "Scalloped train border"],
    pieces: ["Gown", "Silk slip", "Net dupatta"],
    stitchingTime: [21, 28],
    createdAt: "2026-06-30",
    badge: "Signature Edit",
  },
  {
    ...base,
    id: "zk-006",
    slug: "mahira-zardozi-bridal-gown",
    name: "Mahira Zardozi Bridal Gown",
    price: 145000,
    images: pick(silver, 4, 1, 2, 3, 5, 6),
    category: "bridal",
    collection: "signature",
    type: "Gown",
    fabric: "Net",
    color: "Ice grey",
    occasion: "Bridal",
    description:
      "A full-coverage zardozi bridal gown in ice-grey net with a double-panel train and a matching veil dupatta. Commissioned through the bridal salon with two fittings.",
    embroidery: ["Full zardozi and sequin coverage", "Double-panel embroidered train", "Hand-embroidered veil borders"],
    pieces: ["Gown", "Silk slip", "Net dupatta", "Organza veil dupatta"],
    stitchingTime: [28, 42],
    availability: "limited",
    createdAt: "2026-03-10",
    badge: "Bridal Salon",
  },
  {
    ...base,
    id: "zk-007",
    slug: "rania-pearl-trail-gown",
    name: "Rania Pearl Trail Gown",
    price: 98000,
    images: pick(silver, 3, 2, 5, 1, 4, 6),
    category: "bridal",
    collection: "luxury-edit",
    type: "Gown",
    fabric: "Organza",
    color: "Silver grey",
    occasion: "Nikkah and valima",
    description:
      "An organza gown with a pearl-and-sequin bodice and a trailing embroidered skirt. The waist seam is set to your height so the trail starts where it should.",
    embroidery: ["Pearl and sequin bodice", "Embroidered waist band", "Trailing embroidered skirt"],
    pieces: ["Gown", "Silk slip", "Mukesh dupatta"],
    stitchingTime: [28, 42],
    createdAt: "2026-05-05",
    badge: "Bridal Salon",
  },
  {
    ...base,
    id: "zk-008",
    slug: "hoor-velvet-bridal-peshwas",
    name: "Hoor Velvet Bridal Peshwas",
    price: 112000,
    images: pick(velvetPeshwas, 2, 1),
    category: "bridal",
    collection: "velvet-winter",
    type: "Peshwas",
    fabric: "Velvet",
    color: "Black",
    occasion: "Winter bridal",
    description:
      "A black velvet bridal peshwas with a gold tilla and dabka yoke, a sequinned trailing flare and a net dupatta bordered in maroon velvet. Lined in silk and weighted at the hem to hold its sweep.",
    embroidery: ["Gold tilla and dabka yoke", "Sequinned trailing flare", "Maroon velvet dupatta border"],
    pieces: ["Peshwas", "Silk churidar", "Net dupatta"],
    stitchingTime: [28, 42],
    availability: "limited",
    createdAt: "2026-08-18",
    badge: "Bridal Salon",
  },
  {
    ...base,
    id: "zk-009",
    slug: "ayla-luxury-festive-set",
    name: "Ayla Luxury Festive Set",
    price: 24900,
    images: pick(rose, 2, 1, 3, 4),
    category: "festive",
    collection: "eid-edit",
    type: "Kurta Set",
    fabric: "Raw Silk",
    color: "Dusty rose",
    occasion: "Eid",
    description:
      "A dusty-rose raw silk kurta with a cutwork placket and sleeve cuffs, a straight trouser and an embroidered chiffon dupatta. Light enough for an Eid afternoon, stitched to your length.",
    embroidery: ["Cutwork placket", "Embroidered sleeve cuffs", "Embroidered chiffon dupatta"],
    pieces: ["Kurta", "Straight trouser", "Chiffon dupatta"],
    stitchingTime: [12, 18],
    createdAt: "2026-07-20",
    badge: customDesign.label,
  },
  {
    ...base,
    id: "zk-010",
    slug: "zoya-eid-velvet-set",
    name: "Zoya Eid Velvet Set",
    price: 26500,
    images: pick(sapphire, 1, 4, 2, 3),
    category: "festive",
    collection: "eid-edit",
    type: "Kurta Set",
    fabric: "Velvet",
    color: "Sapphire",
    occasion: "Eid",
    description:
      "A sapphire velvet kurta with a silver tilla tree-of-life panel and a bordered hem, a velvet trouser and a silver-embroidered dupatta. Cut to your height so the hem border sits level.",
    embroidery: ["Silver tilla front panel", "Embroidered hem border", "Silver-embroidered dupatta"],
    pieces: ["Velvet kurta", "Velvet trouser", "Net dupatta"],
    stitchingTime: [12, 18],
    isNew: true,
    createdAt: "2026-09-14",
    badge: "New",
  },
  {
    ...base,
    id: "zk-011",
    slug: "dua-applique-raw-silk-set",
    name: "Dua Appliqué Raw Silk Set",
    price: 31000,
    images: pick(copper, 1, 3, 2, 4),
    category: "festive",
    collection: "eid-edit",
    type: "Kurta Set",
    fabric: "Raw Silk",
    color: "Copper",
    occasion: "Mehndi",
    description:
      "A copper raw silk kurta with turquoise sequin appliqué on the shoulder, sleeves and hem, worn with a straight trouser and an appliqué-bordered raw silk dupatta. The kurta length is set to you.",
    embroidery: ["Turquoise sequin appliqué", "Appliqué sleeve panels", "Appliqué-bordered dupatta"],
    pieces: ["Kurta", "Straight trouser", "Raw silk dupatta"],
    stitchingTime: [12, 18],
    isNew: true,
    createdAt: "2026-09-22",
    badge: "New",
  },
  {
    ...base,
    id: "zk-012",
    slug: "eshal-velvet-suit",
    name: "Eshal Velvet Suit",
    price: 29500,
    images: pick(velvetKurta, 1, 2, 3, 4),
    category: "festive",
    collection: "velvet-winter",
    type: "Kurta Set",
    fabric: "Velvet",
    color: "Black",
    occasion: "Winter festive",
    description:
      "A black velvet kurta with a gold tilla neckline and cuffs, a straight velvet trouser and a net dupatta bordered in maroon velvet. Lined for warmth, with the sleeve and kurta length set at your fitting.",
    embroidery: ["Gold tilla neckline", "Embroidered cuffs", "Maroon velvet dupatta border"],
    pieces: ["Velvet kurta", "Straight trouser", "Net dupatta"],
    stitchingTime: [12, 18],
    isNew: true,
    createdAt: "2026-09-28",
    badge: "New",
  },
  {
    ...base,
    id: "zk-013",
    slug: "sana-raw-silk-kurta-set",
    name: "Sana Raw Silk Kurta Set",
    price: 18500,
    images: pick(rose, 1, 2, 4, 3),
    category: "luxury-pret",
    type: "Kurta Set",
    fabric: "Raw Silk",
    color: "Dusty rose",
    occasion: "Everyday luxury",
    description:
      "A dusty-rose raw silk kurta with a cutwork placket and a matching straight trouser. The everyday piece, cut to your shoulder and length so it needs no alteration.",
    embroidery: ["Cutwork placket", "Embroidered sleeve cuffs"],
    pieces: ["Kurta", "Straight trouser"],
    stitchingTime: [10, 14],
    isNew: true,
    createdAt: "2026-10-01",
    badge: "New",
  },
  {
    ...base,
    id: "zk-014",
    slug: "nayab-raw-silk-kurta",
    name: "Nayab Raw Silk Kurta",
    price: 14900,
    images: pick(copper, 2, 1, 3, 4),
    category: "luxury-pret",
    type: "Kurta Set",
    fabric: "Raw Silk",
    color: "Copper",
    occasion: "Everyday luxury",
    description:
      "A copper raw silk kurta with turquoise appliqué at the shoulder and a straight trouser. Simple and structured, with your measurements doing the tailoring.",
    embroidery: ["Turquoise shoulder appliqué", "Appliqué sleeve border"],
    pieces: ["Kurta", "Straight trouser"],
    stitchingTime: [10, 14],
    isNew: true,
    createdAt: "2026-10-03",
    badge: "New",
  },
  {
    ...base,
    id: "zk-015",
    slug: "parisa-velvet-kurta-set",
    name: "Parisa Velvet Kurta Set",
    price: 21500,
    images: pick(velvetKurta, 2, 1, 4, 3),
    category: "luxury-pret",
    collection: "luxury-edit",
    type: "Kurta Set",
    fabric: "Velvet",
    color: "Black",
    occasion: "Evening and dinners",
    description:
      "A black velvet kurta with a gold tilla neckline over a straight trouser, with a maroon-edged net dupatta. Lightly embroidered, cut to your length.",
    embroidery: ["Tilla neckline", "Sequin-dotted body"],
    pieces: ["Velvet kurta", "Straight trouser", "Net dupatta"],
    stitchingTime: [10, 14],
    createdAt: "2026-08-05",
    badge: "Luxury Edit",
  },
  {
    ...base,
    id: "zk-016",
    slug: "inaya-tilla-velvet-set",
    name: "Inaya Tilla Velvet Set",
    price: 27500,
    images: pick(sapphire, 3, 2, 1, 4),
    category: "luxury-pret",
    collection: "signature",
    type: "Kurta Set",
    fabric: "Velvet",
    color: "Sapphire",
    occasion: "Winter evenings",
    description:
      "A sapphire velvet kurta with silver tilla embroidery on the back and front panels, a velvet trouser and an embroidered dupatta. The bodice is drafted to your bust and waist.",
    embroidery: ["Silver tilla back and front panels", "Embroidered sleeve bands", "Embroidered dupatta"],
    pieces: ["Velvet kurta", "Velvet trouser", "Net dupatta"],
    stitchingTime: [10, 14],
    isNew: true,
    createdAt: "2026-09-30",
    badge: "New",
  },
];

/** "14–21 working days" */
export const stitchingLabel = (product: Pick<Product, "stitchingTime">) =>
  `${product.stitchingTime[0]}–${product.stitchingTime[1]} working days`;

/** All in inches. `min`/`max` are sanity bounds for validation, not size limits. */
export const measurementFields = [
  { key: "bust", label: "Bust", hint: "Around the fullest part of the bust, tape level and relaxed.", min: 26, max: 60, placeholder: "e.g. 36" },
  { key: "waist", label: "Waist", hint: "Around the natural waistline, where the body bends.", min: 20, max: 56, placeholder: "e.g. 30" },
  { key: "hips", label: "Hips", hint: "Around the fullest part of the hips, feet together.", min: 28, max: 64, placeholder: "e.g. 40" },
  { key: "shoulder", label: "Shoulder width", hint: "Across the back, from one shoulder bone to the other.", min: 11, max: 22, placeholder: "e.g. 14.5" },
  { key: "sleeveLength", label: "Sleeve length", hint: "From the shoulder bone to where the sleeve should end.", min: 10, max: 30, placeholder: "e.g. 22" },
  { key: "armhole", label: "Arm hole", hint: "Around the top of the arm, over the shoulder point.", min: 12, max: 26, placeholder: "e.g. 17" },
  { key: "shirtLength", label: "Shirt / kurta length", hint: "From the shoulder down to the hem you want.", min: 30, max: 60, placeholder: "e.g. 44" },
  { key: "trouserLength", label: "Trouser length", hint: "From the natural waist to the ankle bone.", min: 30, max: 50, placeholder: "e.g. 38" },
] as const;

export type MeasurementKey = (typeof measurementFields)[number]["key"];

export const standardSizes = [
  { size: "XS", note: 'Bust 32"' },
  { size: "S", note: 'Bust 34"' },
  { size: "M", note: 'Bust 36"' },
  { size: "L", note: 'Bust 38"' },
  { size: "XL", note: 'Bust 40"' },
  { size: "Custom", note: "Bespoke" },
] as const;

/** Standard atelier block, in inches, in `sizeOrder`. TODO confirm against the house block. */
export const sizeChart = [
  { label: "Bust", values: [32, 34, 36, 38, 40] },
  { label: "Waist", values: [26, 28, 30, 32, 34] },
  { label: "Hips", values: [35, 37, 39, 41, 43] },
  { label: "Shoulder", values: [13.5, 14, 14.5, 15, 15.5] },
  { label: "Shirt length", values: [42, 43, 44, 45, 46] },
  { label: "Trouser length", values: [38, 38, 39, 39, 40] },
];

/**
 * Finished-garment measurements per piece, in inches, in `sizeOrder` (the Baroque-style size chart).
 * TODO confirm against the atelier's graded patterns.
 */
export const garmentCharts = {
  top: [
    { label: "Front length", values: [42, 43, 44, 45, 46] },
    { label: "Shoulder", values: [13.5, 14, 14.5, 15, 15.5] },
    { label: "Bust", values: [16, 17, 18, 19, 20] },
    { label: "Bottom", values: [22, 23, 24, 25, 26] },
    { label: "Sleeve length", values: [21, 21.5, 22, 22.5, 23] },
    { label: "Cuff opening", values: [8.5, 9, 9, 9.5, 10] },
    { label: "Arm hole", values: [8, 8.5, 9, 9.5, 10] },
    { label: "Neck width", values: [6, 6, 6.5, 6.5, 7] },
    { label: "Front drop", values: [2.5, 2.5, 3, 3, 3.5] },
    { label: "Front slit", values: [3, 3, 3, 3.5, 3.5] },
    { label: "Side vent", values: [20, 21, 22, 23, 24] },
  ],
  bottom: [
    { label: "Side length", values: [38, 38, 39, 39, 40] },
    { label: "Front rise", values: [11.5, 12, 12.5, 13, 13.5] },
    { label: "Back rise", values: [14, 14.5, 15, 15.5, 16] },
    { label: "Waist", values: [13, 14, 15, 16, 17] },
    { label: "Hip", values: [18, 19, 20, 21, 22] },
    { label: "Thigh", values: [11, 11.5, 12, 12.5, 13] },
    { label: "Bottom", values: [7, 7, 7.5, 7.5, 8] },
  ],
};

/** Which chart a piece gets: trousers and skirts the bottom block, dupattas and slips none. */
export const chartForPiece = (piece: string) => {
  const name = piece.toLowerCase();
  if (/dupatta|shawl|slip|veil/.test(name)) return undefined;
  return /trouser|churidar|sharara|gharara|lehenga|culotte/.test(name) ? garmentCharts.bottom : garmentCharts.top;
};

// Fixed locale so server and client render the same string.
export const formatPrice = (price: number) => `PKR ${price.toLocaleString("en-US")}`;

/** Display rate for the United States; Stripe charges at its own rate on the day. TODO confirm. */
export const USD_RATE = 278;

export const formatUsd = (pkr: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Math.round(pkr / USD_RATE),
  );
