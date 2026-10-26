export type CategorySlug = "formals" | "chikankari" | "festive" | "luxury-pret";
export type CollectionSlug = "signature" | "luxury-edit" | "winter-edit" | "eid-edit";
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
      "Wedding-guest and evening formals: raw silk, jacquard and embroidered kurta sets, each cut to your measurements.",
    image: "/images/products/blush-silver/1.jpg",
  },
  {
    slug: "chikankari",
    name: "Chikankari",
    description:
      "Hand-worked chikankari and cutwork kurta sets in lawn and cotton silk, stitched to your length and shoulder.",
    image: "/images/products/sky-chikankari/1.jpg",
  },
  {
    slug: "festive",
    name: "Festive",
    description:
      "Eid, mehndi and celebration wear with lighter embellishment and a quicker stitching window.",
    image: "/images/products/pink-bow/1.jpg",
  },
  {
    slug: "luxury-pret",
    name: "Luxury Prêt",
    description:
      "Everyday luxury: bespoke kurta sets, long kameez and sleeveless silhouettes in raw silk and cotton silk.",
    image: "/images/products/powder-blue-block/1.jpg",
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
    focus: "center",
  },
  {
    slug: "luxury-edit",
    name: "Luxury Edit",
    tagline: "Our richest fabrics and handwork",
    description:
      "Raw silk and organza carrying the heaviest tilla, zardozi and sequin work in the atelier.",
    image: "/images/collections/luxury-edit.jpg",
    focus: "center",
  },
  {
    slug: "winter-edit",
    name: "Winter Edit",
    tagline: "Jacquard and raw silk for the season",
    description:
      "Jewel-tone jacquard and raw silk kurta sets with gold and kashmiri embroidery, lined and finished for the wedding season.",
    image: "/images/collections/winter-edit.jpg",
    focus: "center",
  },
  {
    slug: "eid-edit",
    name: "Eid Edit",
    tagline: "Festive pieces stitched in time for Eid",
    description:
      "Lighter embellishment on lawn, cotton silk and organza, with a shorter stitching window so the piece arrives before the day.",
    image: "/images/collections/eid-edit.jpg",
    focus: "center",
  },
];

// The shoot: nineteen outfits, one product each.
const shot = (outfit: string, count = 1) =>
  Array.from({ length: count }, (_, i) => `/images/products/${outfit}/${i + 1}.jpg`);

const base = {
  sizes: sizeOrder,
  customSizingAvailable: true,
  madeToOrder: true as const,
  dispatchTime: 2,
  availability: "made-to-order" as const,
};

const formal = { ...base, category: "formals" as const, stitchingTime: [14, 21] as [number, number] };
const festive = { ...base, category: "festive" as const, stitchingTime: [12, 18] as [number, number] };
const pret = { ...base, category: "luxury-pret" as const, stitchingTime: [10, 14] as [number, number] };
const chikan = { ...base, category: "chikankari" as const, stitchingTime: [10, 14] as [number, number] };

export const products: Product[] = [
  {
    ...formal,
    id: "zk-001",
    slug: "zariya-blush-raw-silk-set",
    name: "Zariya Blush Raw Silk Set",
    price: 34500,
    images: shot("blush-silver"),
    collection: "luxury-edit",
    type: "Kurta Set",
    fabric: "Raw Silk",
    color: "Blush pink",
    occasion: "Wedding guest",
    description:
      "A blush raw silk kurta with silver tilla on the neckline, placket and scalloped hem, a straight trouser and a scarlet organza dupatta bordered in the same work. Cut to your shoulder and length so the placket sits exactly where it should.",
    embroidery: ["Silver tilla neckline and placket", "Scalloped embroidered hem", "Embroidered scarlet organza dupatta"],
    pieces: ["Kurta", "Straight raw-silk trouser", "Organza dupatta"],
    createdAt: "2026-06-12",
    badge: "Luxury Edit",
  },
  {
    ...formal,
    id: "zk-002",
    slug: "mehr-rose-gold-jaal-set",
    name: "Mehr Rose Gold Jaal Set",
    price: 32500,
    images: shot("rose-gold-jaal"),
    collection: "luxury-edit",
    type: "Kurta Set",
    fabric: "Raw Silk",
    color: "Rose gold",
    occasion: "Evening formal",
    description:
      "A rose-gold raw silk kurta covered in a tone-on-tone gold jaal, with an embroidered neckline and sleeve borders over a matching straight trouser. The jaal is matched at the side seams at your fitting.",
    embroidery: ["All-over gold jaal", "Embroidered round neckline", "Gold sleeve borders"],
    pieces: ["Kurta", "Straight raw-silk trouser"],
    createdAt: "2026-05-20",
    badge: "Luxury Edit",
  },
  {
    ...formal,
    id: "zk-003",
    slug: "sahar-emerald-tilla-set",
    name: "Sahar Emerald Tilla Set",
    price: 36500,
    images: shot("emerald-gold"),
    collection: "winter-edit",
    type: "Kurta Set",
    fabric: "Raw Silk",
    color: "Emerald",
    occasion: "Mehndi and wedding",
    description:
      "An emerald raw silk kurta with gold tilla lattice work from the neckline to the hem border and a matching straight trouser. The bodice is drafted from your own measurements so the lattice sits flat.",
    embroidery: ["Gold tilla lattice body", "Embroidered neckline", "Gold hem and sleeve borders"],
    pieces: ["Kurta", "Straight raw-silk trouser"],
    createdAt: "2026-07-02",
    badge: customDesign.label,
  },
  {
    ...formal,
    id: "zk-004",
    slug: "laila-plum-jacquard-set",
    name: "Laila Plum Jacquard Set",
    price: 39500,
    compareAtPrice: 44500,
    images: shot("plum-jacquard"),
    collection: "winter-edit",
    type: "Kurta Set",
    fabric: "Jacquard",
    color: "Plum",
    occasion: "Wedding guest",
    description:
      "A plum self-jacquard kurta with a gold-embroidered V neckline and a straight trouser, worn with an organza dupatta edged in gold paisleys. The kurta length and sleeve are cut to you.",
    embroidery: ["Gold V neckline", "Paisley-bordered organza dupatta", "Scalloped gold dupatta edge"],
    pieces: ["Jacquard kurta", "Straight trouser", "Organza dupatta"],
    createdAt: "2026-04-15",
    badge: customDesign.label,
  },
  {
    ...formal,
    id: "zk-005",
    slug: "noor-champagne-raw-silk-set",
    name: "Noor Champagne Raw Silk Set",
    price: 29500,
    images: shot("champagne-raw-silk"),
    collection: "luxury-edit",
    type: "Kurta Set",
    fabric: "Raw Silk",
    color: "Champagne",
    occasion: "Nikkah and dinners",
    description:
      "A champagne raw silk kurta with a single gold motif at the chest, scattered gold buttis and embroidered sleeves, over a matching straight trouser. Understated and structured, with your measurements doing the tailoring.",
    embroidery: ["Gold chest motif", "Scattered gold buttis", "Embroidered sleeve panels"],
    pieces: ["Kurta", "Straight raw-silk trouser"],
    createdAt: "2026-06-30",
    badge: "Signature Edit",
  },
  {
    ...formal,
    id: "zk-006",
    slug: "mahira-mint-sequin-kurta",
    name: "Mahira Mint Sequin Kurta",
    price: 31000,
    images: shot("mint-sequin"),
    collection: "signature",
    type: "Sleeveless Kurta Set",
    fabric: "Organza",
    color: "Mint",
    occasion: "Evening formal",
    description:
      "A sleeveless mint organza kurta over a silk slip, embroidered in vertical lines of sequins with a beaded round neckline and hem, worn with a straight cotton-silk trouser. The armhole and length are set at your fitting.",
    embroidery: ["Vertical sequin lines", "Beaded round neckline", "Beaded hem border"],
    pieces: ["Sleeveless kurta", "Silk slip", "Straight trouser"],
    createdAt: "2026-03-10",
    badge: "Signature Edit",
  },
  {
    ...formal,
    id: "zk-007",
    slug: "rania-peach-gold-kurta",
    name: "Rania Peach Gold Kurta",
    price: 33500,
    images: shot("peach-gold"),
    collection: "luxury-edit",
    type: "Sleeveless Kurta Set",
    fabric: "Raw Silk",
    color: "Peach",
    occasion: "Mehndi and wedding",
    description:
      "A sleeveless peach raw silk kurta with a gold-embroidered V bodice and large gold paisley motifs through the skirt, over a matching straight trouser. The bodice is drafted to your bust and waist so the V sits where it should.",
    embroidery: ["Gold V bodice", "Gold paisley skirt motifs", "Gold hem border"],
    pieces: ["Sleeveless kurta", "Straight raw-silk trouser"],
    createdAt: "2026-05-05",
    badge: "Luxury Edit",
  },
  {
    ...festive,
    id: "zk-008",
    slug: "hoor-rust-floral-set",
    name: "Hoor Rust Floral Set",
    price: 24900,
    images: shot("rust-raw-silk"),
    collection: "eid-edit",
    type: "Kurta Set",
    fabric: "Raw Silk",
    color: "Rust",
    occasion: "Eid",
    description:
      "A rust raw silk kurta with pink and green resham florals on the placket, sleeves and scalloped hem, with a matching straight trouser. Light enough for an Eid afternoon, stitched to your length.",
    embroidery: ["Resham floral placket", "Embroidered sleeve cuffs", "Scalloped floral hem"],
    pieces: ["Kurta", "Straight trouser"],
    isNew: true,
    createdAt: "2026-09-14",
    badge: "New",
  },
  {
    ...festive,
    id: "zk-009",
    slug: "ayla-black-floral-set",
    name: "Ayla Black Floral Set",
    price: 27500,
    images: shot("black-floral"),
    collection: "winter-edit",
    type: "Kurta Set",
    fabric: "Cotton Silk",
    color: "Black",
    occasion: "Winter festive",
    description:
      "A black cotton-silk kurta with multicolour resham florals across the yoke, sleeves and hem, a straight trouser and a black chiffon dupatta with a scalloped embroidered edge. Cut to your height so the hem border sits level.",
    embroidery: ["Multicolour resham yoke", "Embroidered scalloped hem", "Scalloped chiffon dupatta edge"],
    pieces: ["Kurta", "Straight trouser", "Chiffon dupatta"],
    createdAt: "2026-07-20",
    badge: customDesign.label,
  },
  {
    ...festive,
    id: "zk-010",
    slug: "zoya-pink-bow-set",
    name: "Zoya Pink Bow Set",
    price: 26500,
    images: shot("pink-bow"),
    collection: "eid-edit",
    type: "Kurta Set",
    fabric: "Cotton Silk",
    color: "Hot pink",
    occasion: "Eid",
    description:
      "A hot-pink cotton-silk kurta with silver bow motifs down the front and a keyhole neckline, worn with a straight trouser and a gold-edged organza dupatta. The kurta length is set to you.",
    embroidery: ["Silver bow motifs", "Embroidered keyhole neckline", "Gold-edged organza dupatta"],
    pieces: ["Kurta", "Straight trouser", "Organza dupatta"],
    isNew: true,
    createdAt: "2026-09-22",
    badge: "New",
  },
  {
    ...festive,
    id: "zk-011",
    slug: "dua-fuchsia-kashmiri-kurta",
    name: "Dua Fuchsia Kashmiri Kurta",
    price: 28500,
    images: shot("fuchsia-kashmiri"),
    collection: "winter-edit",
    type: "Kurta Set",
    fabric: "Raw Silk",
    color: "Fuchsia",
    occasion: "Winter festive",
    description:
      "A fuchsia raw silk kurta with cream kashmiri embroidery on the yoke, sleeves and a deep hem panel, worn with an ivory straight trouser. The yoke is scaled to your shoulder at the fitting.",
    embroidery: ["Cream kashmiri yoke", "Embroidered sleeve bands", "Deep embroidered hem panel"],
    pieces: ["Kurta", "Straight trouser"],
    isNew: true,
    createdAt: "2026-09-28",
    badge: "New",
  },
  {
    ...chikan,
    id: "zk-012",
    slug: "sana-sage-chikankari-set",
    name: "Sana Sage Chikankari Set",
    price: 18500,
    images: shot("sage-chikankari"),
    collection: "signature",
    type: "Kurta Set",
    fabric: "Chikankari Lawn",
    color: "Sage green",
    occasion: "Everyday luxury",
    description:
      "A sage green chikankari kurta with a white cutwork hem and sleeve borders, a V neckline and a matching straight trouser. The everyday piece, cut to your shoulder and length so it needs no alteration.",
    embroidery: ["All-over chikankari", "White cutwork hem", "Cutwork sleeve borders"],
    pieces: ["Kurta", "Straight trouser"],
    isNew: true,
    createdAt: "2026-10-01",
    badge: "New",
  },
  {
    ...chikan,
    id: "zk-013",
    slug: "nayab-lemon-chikankari-set",
    name: "Nayab Lemon Chikankari Set",
    price: 16900,
    images: shot("lemon-chikankari"),
    collection: "eid-edit",
    type: "Kurta Set",
    fabric: "Chikankari Lawn",
    color: "Lemon",
    occasion: "Everyday luxury",
    description:
      "A pale lemon chikankari kurta with a tasselled tie neckline and lace-edged sleeves, over a matching straight trouser. Simple and light, with your measurements doing the tailoring.",
    embroidery: ["All-over chikankari", "Tasselled tie neckline", "Lace sleeve edging"],
    pieces: ["Kurta", "Straight trouser"],
    isNew: true,
    createdAt: "2026-10-03",
    badge: "New",
  },
  {
    ...chikan,
    id: "zk-014",
    slug: "parisa-sky-chikankari-set",
    name: "Parisa Sky Chikankari Set",
    price: 21500,
    images: shot("sky-chikankari"),
    collection: "eid-edit",
    type: "Kurta Set",
    fabric: "Chikankari Lawn",
    color: "Sky blue",
    occasion: "Eid",
    description:
      "A sky-blue chikankari kurta with a scalloped hem and square neckline, a straight trouser and a tone-on-tone organza dupatta. Lightly worked, cut to your length.",
    embroidery: ["All-over chikankari", "Scalloped embroidered hem", "Embroidered organza dupatta"],
    pieces: ["Kurta", "Straight trouser", "Organza dupatta"],
    createdAt: "2026-08-05",
    badge: customDesign.label,
  },
  {
    ...chikan,
    id: "zk-015",
    slug: "inaya-cream-cutwork-set",
    name: "Inaya Cream Cutwork Set",
    price: 23500,
    images: shot("cream-cutwork"),
    collection: "eid-edit",
    type: "Kurta Set",
    fabric: "Chikankari Lawn",
    color: "Cream",
    occasion: "Eid",
    description:
      "A cream cutwork kurta with pastel pink, blue and green florals, a straight trouser and a pink-to-blue ombré dupatta edged in lace. The cutwork panels are matched at the side seams at your fitting.",
    embroidery: ["All-over cutwork", "Pastel resham florals", "Lace-edged ombré dupatta"],
    pieces: ["Kurta", "Straight trouser", "Ombré dupatta"],
    isNew: true,
    createdAt: "2026-09-30",
    badge: "New",
  },
  {
    ...pret,
    id: "zk-016",
    slug: "eshal-powder-blue-set",
    name: "Eshal Powder Blue Set",
    price: 19500,
    images: shot("powder-blue-block"),
    collection: "signature",
    type: "Kurta Set",
    fabric: "Cotton Silk",
    color: "Powder blue",
    occasion: "Everyday luxury",
    description:
      "A powder-blue cotton-silk kurta with ivory block-printed motifs and a tasselled tie neckline, over a matching straight trouser. Cut to your length.",
    embroidery: ["Ivory block-print motifs", "Tasselled tie neckline"],
    pieces: ["Kurta", "Straight trouser"],
    createdAt: "2026-08-18",
    badge: "Signature Edit",
  },
  {
    ...pret,
    id: "zk-017",
    slug: "amal-beige-long-kameez",
    name: "Amal Beige Long Kameez",
    price: 27500,
    images: shot("beige-long-kameez"),
    collection: "signature",
    type: "Long Kameez",
    fabric: "Cotton Silk",
    color: "Beige",
    occasion: "Evening and dinners",
    description:
      "A sleeveless floor-length beige kameez with pastel resham florals, an embroidered round neckline and a gold-worked hem, over a matching straight trouser. The waist and length are drafted to you so the hem clears the floor.",
    embroidery: ["Pastel resham florals", "Embroidered round neckline", "Gold-worked hem"],
    pieces: ["Long kameez", "Straight trouser"],
    createdAt: "2026-06-05",
    badge: customDesign.label,
  },
  {
    ...pret,
    id: "zk-018",
    slug: "hania-cream-sleeveless-set",
    name: "Hania Cream Sleeveless Set",
    price: 22500,
    images: shot("cream-sleeveless"),
    collection: "luxury-edit",
    type: "Sleeveless Kurta Set",
    fabric: "Raw Silk",
    color: "Cream",
    occasion: "Everyday luxury",
    description:
      "A sleeveless cream raw silk kurta with white thread embroidery down the front and around the hem, over a matching straight trouser. The armhole and length are set at your fitting.",
    embroidery: ["White thread front panel", "Embroidered hem border"],
    pieces: ["Sleeveless kurta", "Straight raw-silk trouser"],
    createdAt: "2026-08-25",
    badge: "Made to Order",
  },
  {
    ...pret,
    id: "zk-019",
    slug: "mina-black-lattice-dress",
    name: "Mina Black Lattice Dress",
    price: 24500,
    images: shot("black-lattice"),
    collection: "winter-edit",
    type: "Long Kameez",
    fabric: "Cotton Silk",
    color: "Black",
    occasion: "Evening and dinners",
    description:
      "A sleeveless ankle-length black kameez embroidered in a gold lattice from neckline to hem, with a side slit. Worn alone or over a trouser; the length is set to you.",
    embroidery: ["All-over gold lattice", "Embroidered round neckline"],
    pieces: ["Long kameez"],
    isNew: true,
    createdAt: "2026-10-05",
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
