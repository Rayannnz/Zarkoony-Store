import { productBySlug } from "./catalog";
import { facts } from "./content";
import type { Size } from "./products";

export type CartLine = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: Size | "Custom";
  /** Inches, keyed by `MeasurementKey`; only on custom lines. */
  measurements?: Record<string, number>;
  notes?: string;
  qty: number;
};

export type Country = "PK" | "US";

export const countries: { code: Country; label: string; currency: "PKR" | "USD"; note: string }[] = [
  { code: "PK", label: "Pakistan", currency: "PKR", note: "Cash on delivery or bank transfer. Complimentary tracked delivery." },
  { code: "US", label: "United States", currency: "USD", note: "Paid in advance by card or ACH bank transfer through Stripe. Tracked international courier." },
];

export const countryName = (code: Country) => countries.find((c) => c.code === code)?.label ?? code;

export type Address = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  province: string;
  postcode?: string;
  /** Decides the address fields, the delivery charge and which payment methods are offered. */
  country: Country;
};

/** cod and bank are Pakistan; card and ach are advance payments through Stripe for the United States. */
export type PaymentMethod = "cod" | "bank" | "card" | "ach";

/** What a Pakistani customer tells us about their transfer; the receipt itself stays on their device. */
export type TransferDetails = { accountName: string; bank: string; reference: string; proofName: string };

export type OrderStatus = "confirmed" | "stitching" | "inspection" | "dispatched" | "delivered";

export const orderStages: { key: OrderStatus; label: string; detail: string }[] = [
  { key: "confirmed", label: "Commission confirmed", detail: "Your measurements and fabric are logged with the atelier." },
  { key: "stitching", label: "Cutting & stitching", detail: "Your master karigar cuts, embroiders and stitches the piece." },
  { key: "inspection", label: "Quality inspection", detail: "Every seam and motif is checked against your measurements." },
  { key: "dispatched", label: "Dispatched", detail: "Packed and handed to the courier with a tracking number." },
  { key: "delivered", label: "Delivered", detail: "Complimentary adjustments are available for 14 days." },
];

export const stageIndex = (status: OrderStatus) => orderStages.findIndex((s) => s.key === status);

export type Order = {
  id: string;
  placedAt: string;
  email: string;
  address: Address;
  payment: PaymentMethod;
  transfer?: TransferDetails;
  /** Priority stitching: a fixed window for a per-order fee. */
  express: boolean;
  lines: CartLine[];
  subtotal: number;
  delivery: number;
  expressFee: number;
  total: number;
  status: OrderStatus;
  /** Working days until dispatch, from the slowest line. */
  stitchingTime: [number, number];
};

export const DELIVERY_FEE = 0; // TODO confirm: free delivery within Pakistan, as Baroque

export const deliveryFee = (country: Country) => (country === "US" ? facts.internationalDelivery.fee : DELIVERY_FEE);

export const lineTotal = (line: CartLine) => line.price * line.qty;
export const cartSubtotal = (lines: CartLine[]) => lines.reduce((sum, l) => sum + lineTotal(l), 0);
export const cartCount = (lines: CartLine[]) => lines.reduce((sum, l) => sum + l.qty, 0);

/** The slowest garment in the bag sets the window. */
export function stitchingWindow(lines: CartLine[]): [number, number] {
  let window: [number, number] = [0, 0];
  for (const line of lines) {
    const time = productBySlug(line.slug)?.stitchingTime ?? [14, 21];
    window = [Math.max(window[0], time[0]), Math.max(window[1], time[1])];
  }
  return window[1] ? window : [14, 21];
}

export function createOrder(
  lines: CartLine[],
  details: { email: string; address: Address; payment: PaymentMethod; express: boolean; transfer?: TransferDetails },
): Order {
  const subtotal = cartSubtotal(lines);
  const delivery = deliveryFee(details.address.country);
  const expressFee = details.express ? facts.express.fee : 0;
  return {
    id: `ZK-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    placedAt: new Date().toISOString(),
    ...details,
    lines,
    subtotal,
    delivery,
    expressFee,
    total: subtotal + delivery + expressFee,
    status: "confirmed",
    stitchingTime: details.express ? [facts.express.days, facts.express.days] : stitchingWindow(lines),
  };
}

export const provinces = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Gilgit-Baltistan",
  "Azad Jammu & Kashmir",
];

export const paymentMethods: {
  value: PaymentMethod;
  label: string;
  detail: string;
  countries: Country[];
  /** Collected on Stripe after the order is placed, never on our pages. */
  via?: "stripe";
}[] = [
  { value: "cod", countries: ["PK"], label: "Cash on delivery", detail: "Pay the courier in cash when your piece arrives. Nothing to pay today." },
  { value: "bank", countries: ["PK"], label: "Bank transfer", detail: "Transfer the total to our account and attach the receipt below. Stitching begins once it clears." },
  { value: "card", countries: ["US"], via: "stripe", label: "Debit or credit card", detail: "Pay in full on Stripe's secure checkout. Visa, Mastercard, American Express and Discover." },
  { value: "ach", countries: ["US"], via: "stripe", label: "Bank transfer (ACH)", detail: "Pay in full from a US bank account on Stripe's secure checkout. Settles in 1 to 3 business days." },
];

export const paymentMethodsFor = (country: Country) => paymentMethods.filter((m) => m.countries.includes(country));

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

const sampleAddress: Address = {
  fullName: "Amal Sheikh",
  phone: "+92 300 0000000",
  line1: "14 Gulberg III",
  city: "Lahore",
  province: "Punjab",
  postcode: "54660",
  country: "PK",
};

/** Shown in every mock account so the order pages have something to render. */
export const sampleOrders: Order[] = [
  {
    id: "ZK-24A7F1",
    placedAt: "2026-08-02T10:15:00.000Z",
    email: "amal@example.com",
    address: sampleAddress,
    payment: "bank",
    express: false,
    lines: [
      {
        id: "sample-1",
        slug: "zariya-embroidered-raw-silk-set",
        name: "Zariya Embroidered Raw Silk Set",
        image: "/images/products/rose-raw-silk/4.jpg",
        price: 28500,
        size: "M",
        qty: 1,
      },
    ],
    subtotal: 28500,
    delivery: 0,
    expressFee: 0,
    total: 28500,
    status: "delivered",
    stitchingTime: [14, 21],
  },
  {
    id: "ZK-25C3D9",
    placedAt: "2026-09-21T14:40:00.000Z",
    email: "amal@example.com",
    address: sampleAddress,
    payment: "cod",
    express: false,
    lines: [
      {
        id: "sample-2",
        slug: "sahar-organza-peshwas",
        name: "Sahar Organza Peshwas",
        image: "/images/products/silver-gown/2.jpg",
        price: 36500,
        size: "Custom",
        measurements: { bust: 36, waist: 30, hips: 40, shoulder: 14.5, sleeveLength: 22, armhole: 17, shirtLength: 48, trouserLength: 38 },
        notes: "Full sleeve lining, modest neckline.",
        qty: 1,
      },
    ],
    subtotal: 36500,
    delivery: 0,
    expressFee: 0,
    total: 36500,
    status: "stitching",
    stitchingTime: [14, 21],
  },
];
