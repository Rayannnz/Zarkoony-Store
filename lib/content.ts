import { measurementFields, sizeChart, sizeOrder } from "./products";

/**
 * Business facts quoted across product pages, checkout and customer care. Modelled on Baroque's
 * published terms and adapted to a made-to-order house. Every value here is a placeholder until
 * the owner confirms it. TODO confirm all.
 */
export const facts = {
  stitchingNote: "Stitching begins the next working day after your commission is confirmed.",
  dispatch: "Dispatched within 2 working days of passing final inspection.",
  express: { days: 10, fee: 8500 }, // Priority stitching: a fixed window and a per-order fee.
  deliveryPakistan: "Complimentary tracked delivery across Pakistan, 2 to 4 working days after dispatch.",
  international:
    "Orders to the United States are paid in advance through Stripe; customs duties, where charged, are payable by the recipient.",
  internationalDelivery: {
    fee: 12000, // TODO confirm: flat tracked-courier charge to the United States, in PKR.
    note: "Tracked international courier, 5 to 8 working days after dispatch; duties and taxes, where charged, are billed by the courier.",
  },
  /** Shown at checkout for Pakistani bank transfers. TODO confirm: placeholders. */
  bankAccount: { bank: "Meezan Bank", title: "ZARKOONY", iban: "PK00 MEZN 0000 0000 0000 0000" },
  payment: {
    PK: ["cash on delivery", "bank transfer with the receipt attached at checkout"],
    US: ["debit or credit card", "ACH bank transfer"],
  },
  alterations: "Post-stitch adjustments are complimentary within 14 days of delivery.",
  exchanges:
    "Because every piece is cut to your measurements, exchanges and remakes are offered only for a manufacturing fault or a measurement error on our side, reported within 48 hours of delivery.",
  changes:
    "Measurement or styling changes are accepted within 48 hours of ordering, before cutting begins.",
  cancellation:
    "Orders can be cancelled within 48 hours of placement for a full refund. Once cutting has begun, a 30% fabric and cutting charge applies.",
  hours: "Monday to Saturday, 10am to 6pm PKT",
};

/** Care notes shown in the product accordion, by fabric. */
export const careByFabric: Record<string, string> = {
  Velvet:
    "Dry clean only. Store hanging in a breathable cover; never fold embellished velvet. Steam on the reverse to lift the pile.",
  Organza:
    "Dry clean only. Store flat or hanging with the dupatta rolled, not folded, to keep the embroidery from creasing.",
  Chiffon: "Dry clean only. Iron on low heat through a cotton cloth, avoiding embroidered areas.",
  Net: "Dry clean only. Keep away from sharp jewellery; store with tissue between embellished layers.",
  Jamawar:
    "Dry clean only. Iron on the reverse on a low setting; hang to store so the weave keeps its drape.",
  "Raw Silk":
    "Dry clean recommended. Iron on the reverse while slightly damp; store away from direct sunlight.",
  "Cotton Silk":
    "Gentle hand wash in cold water or dry clean. Dry in shade; iron on medium heat on the reverse.",
};

export const defaultCare = "Dry clean only. Store in the cover provided, away from direct sunlight.";

// ---------------------------------------------------------------------------------------------
// Structured copy for the content pages. `components/ContentPage.tsx` renders these blocks.

export type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "table"; head: string[]; rows: (string | number)[][] }
  | { type: "faq"; items: { q: string; a: string }[] };

export type ContentSection = { id?: string; heading: string; blocks: Block[] };

export type ContentPage = {
  title: string;
  eyebrow?: string;
  intro: string;
  sections: ContentSection[];
  updated?: string;
};

const p = (text: string): Block => ({ type: "p", text });
const list = (items: string[]): Block => ({ type: "list", items });

const dispatchTable: Block = {
  type: "table",
  head: ["Category", "Stitching", "Dispatch"],
  rows: [
    ["Luxury Prêt", "10–14 working days", "Within 2 working days of inspection"],
    ["Festive", "12–18 working days", "Within 2 working days of inspection"],
    ["Formals", "14–21 working days", "Within 2 working days of inspection"],
    ["Bridal", "28–42 working days, two fittings", "Within 2 working days of inspection"],
    ["Priority stitching", `${facts.express.days} working days, any category`, "Same day as inspection"],
  ],
};

export const about: ContentPage = {
  eyebrow: "About ZARKOONY",
  title: "Our Story",
  intro:
    "ZARKOONY is a Lahore atelier that makes one thing: womenswear cut and stitched to the person who will wear it. Nothing is kept in stock, nothing is sized to a mannequin.",
  sections: [
    {
      heading: "Why made to order",
      blocks: [
        p(
          "Ready-made formals are drafted for an average body, then altered, and the alteration is where the drape goes wrong. We start from your measurements instead. The pattern is drafted to you, the embroidery is placed on your panels, and the piece is finished before it is ever tried on.",
        ),
        p(
          "It takes longer than taking something off a rail, and we think that is the point. A commission is a conversation about fabric, fit and the occasion, and the result is a piece that is yours in every sense.",
        ),
      ],
    },
    {
      id: "craftsmanship",
      heading: "Craftsmanship",
      blocks: [
        p(
          "Our master karigars work in zardozi, tilla, dabka, kora and resham, on raw silk, velvet, organza, chiffon, net and jamawar. Every motif is set by hand, so no two pieces are identical, and every seam is finished on the inside as carefully as the outside.",
        ),
        list([
          "Pattern drafting from your own measurements, with ease allowances set for the fabric.",
          "Hand embroidery placed on the cut panels, not applied to a finished garment.",
          "Full silk linings, weighted hems and hand-finished closures as standard.",
          "A final inspection against your measurement sheet before anything is packed.",
        ]),
      ],
    },
    {
      id: "atelier",
      heading: "The Atelier",
      blocks: [
        p(
          "The atelier is in Gulberg, Lahore, and is open by appointment for bridal consultations and fittings, Monday to Saturday. Commissions from anywhere in Pakistan are measured at home with our guide and confirmed over WhatsApp.",
        ),
        p("To book an appointment, write to the concierge from the contact page."),
      ],
    },
    {
      heading: "Our responsibility",
      blocks: [
        p(
          "Making to order means we cut only what has been commissioned: no unsold stock, no end-of-season markdowns, no waste. Our karigars are employed year-round rather than per piece, and offcuts from the cutting table go to a Lahore training workshop for young embroiderers.",
        ),
      ],
    },
  ],
};

export const madeToOrder: ContentPage = {
  eyebrow: "Made to order",
  title: "How It Works",
  intro:
    "Every ZARKOONY piece is stitched after you order it, to a standard size or to your own measurements at no extra cost. Here is the journey from the first click to the final fitting.",
  sections: [
    {
      heading: "The journey",
      blocks: [
        {
          type: "steps",
          items: [
            { title: "Choose your piece", text: "Browse by occasion or collection. Every page shows the fabric, the handwork and the stitching time." },
            { title: "Size or measurements", text: "Pick a standard atelier size, or choose Custom and enter eight measurements with our guide beside you." },
            { title: "Confirm your commission", text: "Review the piece, size and total, then check out. Our concierge confirms the details on WhatsApp within one working day." },
            { title: "Cutting and stitching", text: `Your pattern is drafted, the panels are cut and embroidered, and the piece is stitched and lined. ${facts.stitchingNote}` },
            { title: "Quality inspection", text: "Every seam and motif is checked against your measurement sheet before the piece is pressed and packed." },
            { title: "Dispatch and delivery", text: `${facts.dispatch} ${facts.deliveryPakistan}` },
            { title: "Fitting and adjustments", text: facts.alterations },
          ],
        },
      ],
    },
    {
      heading: "Standard size or custom?",
      blocks: [
        p(
          "Standard sizes follow the atelier block in the size guide and suit most people within a size. Custom measurements cost nothing extra and are the better choice when you are between sizes, taller or shorter than average, or want a specific length or sleeve.",
        ),
        p("Either way, post-stitch adjustments are complimentary, so the choice is about where you would like the fit to start."),
      ],
    },
    {
      id: "dispatch",
      heading: "Dispatch timeline",
      blocks: [dispatchTable, p("Working days exclude Sundays and public holidays. Bridal commissions include two fittings in the window shown.")],
    },
    {
      heading: "Changes and cancellations",
      blocks: [p(facts.changes), p(facts.cancellation)],
    },
  ],
};

export const measurementGuide: ContentPage = {
  eyebrow: "Made to order",
  title: "Measurement Guide",
  intro:
    "Eight measurements, in inches, are all the atelier needs to draft your pattern. Take them over light clothing with a soft tape, and ask someone to help with the back measurements.",
  sections: [
    {
      heading: "Before you start",
      blocks: [
        list([
          "Wear the undergarments you will wear with the piece, and light clothing over them.",
          "Keep the tape level and snug but not tight; you should fit a finger underneath.",
          "Stand naturally, feet together, arms relaxed at your sides.",
          "Round to the nearest quarter inch. If in doubt, round up: it is easier to take in than let out.",
        ]),
      ],
    },
    {
      heading: "Each measurement",
      blocks: [{ type: "steps", items: measurementFields.map((f) => ({ title: f.label, text: f.hint })) }],
    },
    {
      heading: "Unsure about something?",
      blocks: [
        p(
          "Leave a note in the styling box when you order, or send a photo of the tape in place to the concierge on WhatsApp. For bridal commissions we measure you at the atelier.",
        ),
      ],
    },
  ],
};

export const sizeGuide: ContentPage = {
  eyebrow: "Made to order",
  title: "Size Guide",
  intro:
    "The atelier's standard block, in inches. These are body measurements, not garment measurements: ease for the fabric and silhouette is added when the pattern is drafted.",
  sections: [
    {
      heading: "Standard sizes",
      blocks: [
        { type: "table", head: ["Measurement", ...sizeOrder], rows: sizeChart.map((row) => [row.label, ...row.values]) },
        p("Measure yourself with the measurement guide and choose the size whose bust and hip are closest to yours."),
      ],
    },
    {
      heading: "Between sizes?",
      blocks: [
        p(
          "Choose Custom. It costs nothing extra, the pattern is drafted to your own eight measurements, and post-stitch adjustments stay complimentary.",
        ),
      ],
    },
  ],
};

export const faq: ContentPage = {
  eyebrow: "Customer care",
  title: "Frequently Asked Questions",
  intro: "Answers to the questions the concierge hears most. Anything else, we are a message away.",
  sections: [
    {
      heading: "Ordering and made to order",
      blocks: [
        {
          type: "faq",
          items: [
            { q: "Is everything really made to order?", a: "Yes. We hold no finished stock. Cutting begins the next working day after your commission is confirmed, and the piece is stitched, embroidered and lined for you." },
            { q: "Do I need an account to order?", a: "No. You can check out as a guest. An account keeps your measurements, addresses and order history together for next time." },
            { q: "Can I change the design, neckline or sleeve?", a: "Styling notes such as a modest neckline, sleeve lining or extra flare are welcome and usually free. Changes to the embroidery or silhouette are quoted by the concierge before cutting." },
            { q: "Can I order more than one of the same piece?", a: "Yes, up to five of a standard size per line. Custom-measured pieces are added one at a time because each is drafted individually." },
            { q: "How do I pay?", a: `In Pakistan: ${facts.payment.PK.join(" or ")}. In the United States: ${facts.payment.US.join(" or ")}, paid in advance through Stripe's secure checkout. We never ask for card details over WhatsApp.` },
          ],
        },
      ],
    },
    {
      heading: "Measurements and fit",
      blocks: [
        {
          type: "faq",
          items: [
            { q: "Does custom sizing cost extra?", a: "No. Standard and custom sizes are the same price." },
            { q: "What if I measure myself wrong?", a: `${facts.alterations} If the error is ours, the piece is remade.` },
            { q: "Which size should I choose if I am between two?", a: "Choose Custom and enter your measurements, or pick the larger size and let the complimentary adjustment bring it in." },
            { q: "Can I send my measurements later?", a: "Yes. Order in a standard size and send the measurements to the concierge within 48 hours, before cutting begins." },
          ],
        },
      ],
    },
    {
      heading: "Stitching and dispatch",
      blocks: [
        {
          type: "faq",
          items: [
            { q: "How long does stitching take?", a: "Luxury prêt 10–14 working days, festive 12–18, formals 14–21 and bridal 28–42. The exact window is shown on every product page and in your cart." },
            { q: "Can I get it sooner?", a: `Priority stitching moves your commission to the front of the atelier and ships within ${facts.express.days} working days for a fixed fee, chosen at checkout.` },
            { q: "Will I be told when it ships?", a: "Yes. You receive the courier's tracking number by e-mail and WhatsApp on the day of dispatch, and you can follow each stage in your account." },
            { q: "Do you ship internationally?", a: facts.international },
          ],
        },
      ],
    },
    {
      heading: "Alterations, exchanges and cancellations",
      blocks: [
        {
          type: "faq",
          items: [
            { q: "What if the fit is not right?", a: facts.alterations },
            { q: "Can I exchange or return a piece?", a: facts.exchanges },
            { q: "The piece arrived damaged.", a: "Send photos to the concierge within 48 hours of delivery and we arrange collection and a repair or remake at no cost." },
            { q: "Can I cancel?", a: facts.cancellation },
          ],
        },
      ],
    },
    {
      heading: "Account",
      blocks: [
        {
          type: "faq",
          items: [
            { q: "I forgot my password.", a: "Use the reset link on the sign-in page. A link arrives by e-mail; check your junk folder too." },
            { q: "How do I update my address?", a: "Sign in, open Addresses and add or remove entries. The first address is used to pre-fill checkout." },
            { q: "Where are my measurements kept?", a: "On each order, under the piece. Open an order in your account and choose View measurements." },
          ],
        },
      ],
    },
  ],
};

export const shipping: ContentPage = {
  eyebrow: "Customer care",
  title: "Shipping & Dispatch",
  intro: "When your piece will be ready, how it travels, and how to follow it.",
  sections: [
    { heading: "Dispatch timeline", blocks: [dispatchTable, p(facts.stitchingNote), p("Working days exclude Sundays and public holidays.")] },
    {
      heading: "Delivery within Pakistan",
      blocks: [
        p(facts.deliveryPakistan),
        p("Pieces travel folded in tissue inside a rigid box, with the dupatta rolled. Velvet and bridal pieces travel in a garment bag."),
        p("Cash on delivery is collected by the courier at the door; please have the exact amount ready."),
      ],
    },
    { heading: "International", blocks: [p(facts.international)] },
    {
      heading: "Tracking",
      blocks: [p("The tracking number is sent by e-mail and WhatsApp on the day of dispatch. Each stage, from cutting to delivery, is also shown on the order in your account.")],
    },
    {
      heading: "Priority stitching",
      blocks: [p(`For a fixed fee chosen at checkout, your commission moves to the front of the atelier and ships within ${facts.express.days} working days. Availability depends on the season; the concierge confirms within one working day.`)],
    },
  ],
};

export const returns: ContentPage = {
  eyebrow: "Customer care",
  title: "Alterations & Exchanges",
  intro: "A made-to-order piece cannot go back on a rail, so our promise is about fit, not returns.",
  sections: [
    {
      heading: "Complimentary alterations",
      blocks: [
        p(facts.alterations),
        p("Message the concierge with what needs adjusting; we arrange collection, make the change and return the piece. Hems, sleeve lengths, side seams and waist adjustments are all covered."),
      ],
    },
    { heading: "Exchanges and remakes", blocks: [p(facts.exchanges), p("Where a fault is ours, the piece is repaired or remade and collection and redelivery are free.")] },
    {
      heading: "Damaged or incorrect pieces",
      blocks: [p("Check your piece on arrival. Send photos of any damage, missing piece or wrong size to the concierge within 48 hours and we will put it right.")],
    },
    { heading: "Changes and cancellations", blocks: [p(facts.changes), p(facts.cancellation)] },
    {
      heading: "How to request",
      blocks: [list(["Open the order in your account and note the order number.", "Message the concierge on WhatsApp or e-mail with the number and photos.", "We confirm the next step within one working day."])],
    },
  ],
};

export const policies: Record<string, ContentPage> = {
  privacy: {
    eyebrow: "Policies",
    title: "Privacy Policy",
    updated: "2026-10-07",
    intro: "What we collect when you use zarkoony.com, why, and how to ask us to change or delete it.",
    sections: [
      { heading: "What we collect", blocks: [list(["Contact details and delivery addresses you enter at checkout or in your account.", "Body measurements you provide for a commission, kept with that order.", "Order history and messages with the concierge.", "Basic technical information such as browser type and pages visited, used to keep the site working."])] },
      { heading: "How we use it", blocks: [p("To make and deliver your commission, to contact you about it, to keep your account working and, if you subscribe, to send the atelier newsletter. We do not sell personal information.")] },
      { heading: "Who sees it", blocks: [p("The atelier team working on your order, the courier delivering it, and the service providers that run our website and e-mail. Each receives only what it needs.")] },
      { heading: "Your choices", blocks: [p("You can update your details in your account, unsubscribe from any e-mail with one click, and ask us to delete your data by writing to the concierge. Measurements on past orders are kept for alterations unless you ask otherwise.")] },
      { heading: "Contact", blocks: [p("Questions about this policy go to the concierge at the address on the contact page.")] },
    ],
  },
  refund: {
    eyebrow: "Policies",
    title: "Refund Policy",
    updated: "2026-10-07",
    intro: "Every piece is cut to order, so refunds follow the stage your commission has reached.",
    sections: [
      { heading: "Cancellation", blocks: [p(facts.cancellation), p("Refunds are returned to the original payment method within 14 working days; cash-on-delivery orders that have not been dispatched have nothing to refund.")] },
      { heading: "Changes", blocks: [p(facts.changes)] },
      { heading: "Faults and errors", blocks: [p(facts.exchanges), p("Where a remake is not possible, a full refund is issued.")] },
      { heading: "Fit", blocks: [p(facts.alterations), p("Fit adjustments are made rather than refunded.")] },
      { heading: "Priority stitching fee", blocks: [p("The fee is refunded if we miss the promised window.")] },
    ],
  },
  shipping: {
    eyebrow: "Policies",
    title: "Shipping Policy",
    updated: "2026-10-07",
    intro: "The terms under which your piece is dispatched and delivered.",
    sections: [
      { heading: "Dispatch", blocks: [p(facts.dispatch), p("Dispatch windows are estimates in working days. We tell you as soon as we know a piece will run late.")] },
      { heading: "Delivery", blocks: [p(facts.deliveryPakistan), p("We use tracked couriers and may switch between them to keep service reliable. A signature is required on delivery.")] },
      { heading: "Undeliverable parcels", blocks: [p("If a parcel is returned to us because the address was incomplete or nobody was available after two attempts, we contact you to arrange redelivery; a second delivery may be charged at cost.")] },
      { heading: "International", blocks: [p(facts.international)] },
    ],
  },
  terms: {
    eyebrow: "Policies",
    title: "Terms of Service",
    updated: "2026-10-07",
    intro: "The agreement between you and ZARKOONY when you commission a piece through this site.",
    sections: [
      { heading: "Commissions", blocks: [p("A commission is confirmed when the concierge acknowledges your order. Prices are in Pakistani rupees and include tax. We may decline or refund a commission if a fabric is unavailable; you are told before cutting begins.")] },
      { heading: "Measurements", blocks: [p("Measurements you provide are used as given. Complimentary adjustments cover reasonable differences; a piece cut to incorrect measurements that cannot be adjusted may be remade at cost.")] },
      { heading: "Colour and handwork", blocks: [p("Fabric colour may differ slightly from photographs. Embroidery is placed by hand and varies piece to piece; this is part of the work, not a fault.")] },
      { heading: "Intellectual property", blocks: [p("Designs, photographs and text on this site belong to ZARKOONY and may not be reproduced without permission.")] },
      { heading: "Liability", blocks: [p("Our liability for any commission is limited to the price paid for it. Nothing in these terms limits rights you have under Pakistani consumer law.")] },
      { heading: "Changes to these terms", blocks: [p("We may update these terms; the date above shows the current version. Orders are governed by the terms in force when they were placed.")] },
    ],
  },
};
