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
export type MeasureItem = { slug?: string; title: string; price: number };

export const sizeOrder: Size[] = ["XS", "S", "M", "L", "XL"];

export const categories: Category[] = [
  {
    slug: "formals",
    name: "Formals",
    description:
      "Wedding-guest and evening formals: kalidars, peshwas and shararas in raw silk, organza and jamawar, each cut to your measurements.",
    image: "/images/categories/formals-crimson.jpg",
  },
  {
    slug: "bridal",
    name: "Bridal",
    description:
      "Lehengas, ghararas and peshwas commissioned through the bridal salon, with a dedicated fitting consultation.",
    image: "/images/categories/custom-stitched.jpg",
  },
  {
    slug: "festive",
    name: "Festive",
    description:
      "Eid, mehndi and celebration wear with lighter embellishment and a quicker stitching window.",
    image: "/images/products/ayla-luxury-festive-set.jpg",
  },
  {
    slug: "luxury-pret",
    name: "Luxury Prêt",
    description:
      "Everyday luxury: bespoke kurta sets, kalidars and maxis in raw silk, cotton silk and chiffon.",
    image: "/images/categories/bespoke-pret.jpg",
  },
];

export const collections: Collection[] = [
  {
    slug: "signature",
    name: "The Signature Collection",
    tagline: "Archival silhouettes, cut again for you",
    description:
      "The house silhouettes that defined ZARKOONY, re-cut each season in new fabrics and handwork. Every piece is stitched to order.",
    image: "/images/collections/signature.jpg",
    focus: "center 35%",
  },
  {
    slug: "luxury-edit",
    name: "Luxury Edit",
    tagline: "Our richest fabrics and handwork",
    description:
      "Jamawar, organza and raw silk carrying the heaviest zardozi, tilla and pearl work in the atelier.",
    image: "/images/categories/formals-crimson.jpg",
    focus: "center 20%",
  },
  {
    slug: "velvet-winter",
    name: "Velvet Winter",
    tagline: "Velvet couture and shawl suits for the season",
    description:
      "Deep-pile velvet peshwas, kurta sets and embroidered shawls, lined and finished for the wedding season.",
    image: "/images/collections/bespoke-essentials.jpg",
    focus: "center",
  },
  {
    slug: "eid-edit",
    name: "Eid Edit",
    tagline: "Festive pieces stitched in time for Eid",
    description:
      "Lighter embellishment on chiffon, net and cotton silk, with a shorter stitching window so the piece arrives before the day.",
    image: "/images/products/ayla-luxury-festive-set.jpg",
    focus: "center 30%",
  },
];

// Photos are placeholders from the Stitch mock, reused across products until the catalogue is shot.
const img = {
  zariya: "/images/products/zariya-embroidered-kalidar.jpg",
  mehr: "/images/products/mehr-velvet-formal-peshwas.jpg",
  noor: "/images/products/noor-embellished-angrakha.jpg",
  ayla: "/images/products/ayla-luxury-festive-set.jpg",
  pret: "/images/categories/bespoke-pret.jpg",
  lehenga: "/images/categories/custom-stitched.jpg",
  crimson: "/images/categories/formals-crimson.jpg",
  rawSilk: "/images/categories/formals-raw-silk.jpg",
  signature: "/images/collections/signature.jpg",
  velvet: "/images/collections/bespoke-essentials.jpg",
  navy: "/images/hero/velvet-couture.jpg",
  sage: "/images/hero/atelier-salon.jpg",
};

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
    slug: "zariya-embroidered-kalidar",
    name: "Zariya Embroidered Kalidar",
    price: 28500,
    images: [img.zariya, img.rawSilk, img.signature],
    category: "formals",
    collection: "signature",
    type: "Kalidar",
    fabric: "Raw Silk",
    color: "Ivory",
    occasion: "Wedding guest",
    description:
      "A twelve-panel kalidar in ivory raw silk, hand-embroidered with tilla vines along the neckline and hem. Cut to your measurements with a gently flared skirt that moves with every step.",
    embroidery: ["Tilla neckline and hem vines", "Pearl-dotted sleeve borders", "Hand-finished resham motifs"],
    pieces: ["Kalidar", "Straight raw-silk trouser", "Organza dupatta"],
    stitchingTime: [14, 21],
    createdAt: "2026-06-12",
    badge: "Custom Stitched",
  },
  {
    ...base,
    id: "zk-002",
    slug: "mehr-velvet-formal-peshwas",
    name: "Mehr Velvet Formal Peshwas",
    price: 34900,
    images: [img.mehr, img.navy, img.velvet],
    category: "formals",
    collection: "velvet-winter",
    type: "Peshwas",
    fabric: "Velvet",
    color: "Navy",
    occasion: "Evening formal",
    description:
      "A floor-length peshwas in midnight velvet with a zardozi bodice and a skirt that gathers from a fitted empire line. Fully lined, with the sleeve length and flare set to you.",
    embroidery: ["Zardozi bodice", "Gold-thread sleeve cuffs", "Sequin-scattered skirt"],
    pieces: ["Peshwas", "Silk churidar", "Velvet shawl"],
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
    images: [img.crimson, img.mehr, img.signature],
    category: "formals",
    collection: "luxury-edit",
    type: "Peshwas",
    fabric: "Organza",
    color: "Blush",
    occasion: "Mehndi and wedding",
    description:
      "Layered blush organza over a silk slip, with a hand-embroidered yoke and a scalloped hem. The bodice is drafted from your own measurements so the layers sit flat.",
    embroidery: ["Resham and sequin yoke", "Scalloped mukesh hem", "Embroidered organza dupatta"],
    pieces: ["Peshwas", "Silk slip", "Organza dupatta", "Straight trouser"],
    stitchingTime: [14, 21],
    createdAt: "2026-07-02",
    badge: "Luxury Edit",
  },
  {
    ...base,
    id: "zk-004",
    slug: "laila-jamawar-sharara-set",
    name: "Laila Jamawar Sharara Set",
    price: 39500,
    compareAtPrice: 44500,
    images: [img.signature, img.crimson, img.noor],
    category: "formals",
    collection: "luxury-edit",
    type: "Sharara",
    fabric: "Jamawar",
    color: "Emerald",
    occasion: "Wedding guest",
    description:
      "A short embroidered shirt over a wide emerald jamawar sharara. The sharara is cut on your waist and hip so the panels fall straight; the shirt length is yours to set.",
    embroidery: ["Gold zari paisley shirt", "Embroidered sharara hem", "Beaded neckline"],
    pieces: ["Short shirt", "Jamawar sharara", "Net dupatta"],
    stitchingTime: [14, 21],
    createdAt: "2026-04-15",
    badge: "Luxury Edit",
  },
  {
    ...base,
    id: "zk-005",
    slug: "noor-embellished-angrakha",
    name: "Noor Embellished Angrakha",
    price: 42500,
    images: [img.noor, img.lehenga, img.signature],
    category: "bridal",
    collection: "signature",
    type: "Angrakha",
    fabric: "Net",
    color: "Gold",
    occasion: "Nikkah and valima",
    description:
      "An asymmetric angrakha in gold net over silk, closed with hand-wrapped tassel ties. The overlap is drafted to your bust and waist so the wrap stays put.",
    embroidery: ["Kora and dabka bodice", "Gold sequin trail", "Tassel-tied closure"],
    pieces: ["Angrakha", "Silk churidar", "Embroidered net dupatta"],
    stitchingTime: [21, 28],
    createdAt: "2026-06-30",
    badge: "Signature Edit",
  },
  {
    ...base,
    id: "zk-006",
    slug: "mahira-zardozi-bridal-lehenga",
    name: "Mahira Zardozi Bridal Lehenga",
    price: 145000,
    images: [img.lehenga, img.crimson, img.noor],
    category: "bridal",
    collection: "signature",
    type: "Lehenga",
    fabric: "Raw Silk",
    color: "Crimson",
    occasion: "Bridal",
    description:
      "A sixteen-panel crimson raw-silk lehenga with full zardozi coverage, a fitted choli and a double dupatta. Commissioned through the bridal salon with two fittings.",
    embroidery: ["Full zardozi and dabka skirt", "Pearl-encrusted choli", "Hand-embroidered dupatta borders"],
    pieces: ["Lehenga", "Choli", "Net dupatta", "Organza veil dupatta"],
    stitchingTime: [28, 42],
    availability: "limited",
    createdAt: "2026-03-10",
    badge: "Bridal Salon",
  },
  {
    ...base,
    id: "zk-007",
    slug: "rania-pearl-gharara-ensemble",
    name: "Rania Pearl Gharara Ensemble",
    price: 98000,
    images: [img.sage, img.rawSilk, img.signature],
    category: "bridal",
    collection: "luxury-edit",
    type: "Gharara",
    fabric: "Organza",
    color: "Ivory",
    occasion: "Nikkah and valima",
    description:
      "An ivory organza gharara with pearl-weighted knees and a long embroidered shirt. The gharara's knee seam is set to your height so the flare starts where it should.",
    embroidery: ["Pearl and sequin shirt", "Embroidered gharara knee bands", "Mukesh dupatta"],
    pieces: ["Long shirt", "Organza gharara", "Mukesh dupatta"],
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
    images: [img.navy, img.velvet, img.mehr],
    category: "bridal",
    collection: "velvet-winter",
    type: "Peshwas",
    fabric: "Velvet",
    color: "Navy",
    occasion: "Winter bridal",
    description:
      "A navy velvet bridal peshwas with a zardozi bodice, trailing skirt and a matching embroidered shawl. Lined in silk and weighted at the hem to hold its sweep.",
    embroidery: ["Zardozi and kora bodice", "Embroidered trailing hem", "Hand-worked velvet shawl"],
    pieces: ["Peshwas", "Silk churidar", "Embroidered velvet shawl"],
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
    images: [img.ayla, img.pret, img.rawSilk],
    category: "festive",
    collection: "eid-edit",
    type: "Kurta Set",
    fabric: "Cotton Silk",
    color: "Blush",
    occasion: "Eid",
    description:
      "A blush cotton-silk kurta with a hand-embroidered neckline, paired with a straight trouser and a printed dupatta. Light enough for an Eid afternoon, stitched to your length.",
    embroidery: ["Resham neckline", "Embroidered sleeve cuffs", "Lace-edged dupatta"],
    pieces: ["Kurta", "Straight trouser", "Printed dupatta"],
    stitchingTime: [12, 18],
    createdAt: "2026-07-20",
    badge: "Custom Stitched",
  },
  {
    ...base,
    id: "zk-010",
    slug: "zoya-eid-kalidar",
    name: "Zoya Eid Kalidar",
    price: 26500,
    images: [img.lehenga, img.ayla, img.pret],
    category: "festive",
    collection: "eid-edit",
    type: "Kalidar",
    fabric: "Chiffon",
    color: "Turquoise",
    occasion: "Eid",
    description:
      "A turquoise chiffon kalidar with a mirror-work yoke over a silk slip. The panels are cut to your height so the hem clears the floor without trimming the flare.",
    embroidery: ["Mirror-work yoke", "Gota sleeve borders", "Embroidered hemline"],
    pieces: ["Kalidar", "Silk slip", "Straight trouser", "Chiffon dupatta"],
    stitchingTime: [12, 18],
    isNew: true,
    createdAt: "2026-09-14",
    badge: "New",
  },
  {
    ...base,
    id: "zk-011",
    slug: "dua-mirrorwork-sharara",
    name: "Dua Mirrorwork Sharara",
    price: 31000,
    images: [img.signature, img.ayla, img.crimson],
    category: "festive",
    collection: "eid-edit",
    type: "Sharara",
    fabric: "Net",
    color: "Emerald",
    occasion: "Mehndi",
    description:
      "An emerald net shirt scattered with mirror work over a silk sharara. Made for dancing: the sharara is cut wide and the shirt length is set to you.",
    embroidery: ["Mirror and gota shirt", "Embroidered sharara hem", "Gota-edged dupatta"],
    pieces: ["Short shirt", "Silk sharara", "Net dupatta"],
    stitchingTime: [12, 18],
    isNew: true,
    createdAt: "2026-09-22",
    badge: "New",
  },
  {
    ...base,
    id: "zk-012",
    slug: "eshal-velvet-shawl-suit",
    name: "Eshal Velvet Shawl Suit",
    price: 29500,
    images: [img.velvet, img.navy, img.mehr],
    category: "festive",
    collection: "velvet-winter",
    type: "Kurta Set",
    fabric: "Velvet",
    color: "Black",
    occasion: "Winter festive",
    description:
      "A black velvet kurta with an embroidered neckline and a full embroidered velvet shawl. Lined for warmth, with the sleeve and shawl length set at your fitting.",
    embroidery: ["Tilla neckline", "Embroidered shawl borders", "Velvet-appliqué cuffs"],
    pieces: ["Velvet kurta", "Straight trouser", "Embroidered velvet shawl"],
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
    images: [img.pret, img.sage, img.zariya],
    category: "luxury-pret",
    type: "Kurta Set",
    fabric: "Raw Silk",
    color: "Sage",
    occasion: "Everyday luxury",
    description:
      "A sage raw-silk kurta with a self-embroidered placket and a matching straight trouser. The everyday piece, cut to your shoulder and length so it needs no alteration.",
    embroidery: ["Self-colour placket embroidery", "Pin-tucked yoke"],
    pieces: ["Kurta", "Straight trouser"],
    stitchingTime: [10, 14],
    isNew: true,
    createdAt: "2026-10-01",
    badge: "New",
  },
  {
    ...base,
    id: "zk-014",
    slug: "nayab-cotton-silk-kurta",
    name: "Nayab Cotton Silk Kurta",
    price: 14900,
    images: [img.rawSilk, img.pret, img.ayla],
    category: "luxury-pret",
    type: "Kurta Set",
    fabric: "Cotton Silk",
    color: "Ivory",
    occasion: "Everyday luxury",
    description:
      "An ivory cotton-silk kurta with a lace-inset neckline and a culotte trouser. Breathable and simple, with your measurements doing the tailoring.",
    embroidery: ["Lace-inset neckline", "Embroidered hem band"],
    pieces: ["Kurta", "Culotte trouser"],
    stitchingTime: [10, 14],
    isNew: true,
    createdAt: "2026-10-03",
    badge: "New",
  },
  {
    ...base,
    id: "zk-015",
    slug: "parisa-chiffon-kalidar",
    name: "Parisa Chiffon Kalidar",
    price: 21500,
    images: [img.zariya, img.pret, img.rawSilk],
    category: "luxury-pret",
    collection: "luxury-edit",
    type: "Kalidar",
    fabric: "Chiffon",
    color: "Blush",
    occasion: "Lunch and daywear",
    description:
      "A blush chiffon kalidar with a lightly embroidered neckline over a cotton-silk slip. Eight panels, cut to your height, with a straight trouser.",
    embroidery: ["Resham neckline", "Sequin-dotted panels"],
    pieces: ["Kalidar", "Cotton-silk slip", "Straight trouser"],
    stitchingTime: [10, 14],
    createdAt: "2026-08-05",
    badge: "Luxury Edit",
  },
  {
    ...base,
    id: "zk-016",
    slug: "inaya-tilla-chiffon-maxi",
    name: "Inaya Tilla Chiffon Maxi",
    price: 27500,
    images: [img.sage, img.signature, img.zariya],
    category: "luxury-pret",
    collection: "signature",
    type: "Maxi",
    fabric: "Chiffon",
    color: "Mint",
    occasion: "Evening and dinners",
    description:
      "A mint chiffon maxi with tilla embroidery at the neckline and a bias-cut skirt that falls straight from a fitted bodice. The bodice is drafted to your bust and waist.",
    embroidery: ["Tilla neckline", "Embroidered waist seam", "Beaded hem"],
    pieces: ["Maxi", "Silk slip"],
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

// Fixed locale so server and client render the same string.
export const formatPrice = (price: number) => `PKR ${price.toLocaleString("en-US")}`;
