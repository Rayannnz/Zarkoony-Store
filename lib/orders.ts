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

export type Address = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  province: string;
  postcode?: string;
};

export type PaymentMethod = "cod" | "bank";

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
  details: { email: string; address: Address; payment: PaymentMethod; express: boolean },
): Order {
  const subtotal = cartSubtotal(lines);
  const expressFee = details.express ? facts.express.fee : 0;
  return {
    id: `ZK-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    placedAt: new Date().toISOString(),
    ...details,
    lines,
    subtotal,
    delivery: DELIVERY_FEE,
    expressFee,
    total: subtotal + DELIVERY_FEE + expressFee,
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

export const paymentMethods: { value: PaymentMethod; label: string; detail: string }[] = [
  { value: "cod", label: "Cash on delivery", detail: "Pay the courier in cash when your piece arrives." },
  { value: "bank", label: "Bank transfer", detail: "Our concierge sends the account details on WhatsApp; stitching begins once the transfer clears." },
];

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

const sampleAddress: Address = {
  fullName: "Amal Sheikh",
  phone: "+92 300 0000000",
  line1: "14 Gulberg III",
  city: "Lahore",
  province: "Punjab",
  postcode: "54660",
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
        slug: "zariya-embroidered-kalidar",
        name: "Zariya Embroidered Kalidar",
        image: "/images/products/zariya-embroidered-kalidar.jpg",
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
        image: "/images/categories/formals-crimson.jpg",
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
