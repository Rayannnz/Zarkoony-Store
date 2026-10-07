import type { Metadata } from "next";
import { Camera, MessageSquareText, Scissors } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CustomOrderForm } from "@/components/CustomOrderForm";
import { headingClass } from "@/components/shop/Listing";
import { facts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Custom Orders",
  description:
    "Send ZARKOONY pictures of a design you love and receive a quote and stitching timeline within one working day.",
};

const icon = { size: 18, strokeWidth: 1.5, "aria-hidden": true } as const;

const steps = [
  {
    icon: <Camera {...icon} />,
    title: "Send your pictures",
    text: "Two or three photos of the design: the front, the back and a close-up of the embroidery or detail you want recreated.",
  },
  {
    icon: <MessageSquareText {...icon} />,
    title: "A quote within a working day",
    text: "The concierge replies with a price, fabric options and a stitching timeline for your time frame.",
  },
  {
    icon: <Scissors {...icon} />,
    title: "Measured, cut and stitched",
    text: `Once you confirm, measurements are taken at the atelier or sent through the measurement guide. ${facts.stitchingNote} Priority stitching in ${facts.express.days} working days is available.`,
  },
];

export default function CustomOrdersPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 md:px-10 md:pb-24">
      <div className="py-4">
        <Breadcrumbs
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Made to Order", href: "/made-to-order" },
            { label: "Custom Orders" },
          ]}
        />
      </div>
      <header className="pb-10 text-center md:pb-14">
        <p className="caps text-[11px] text-neutral-500">Made to order</p>
        <h1 className={`${headingClass} mt-2`}>Custom Orders</h1>
        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.75] text-neutral-600">
          Have a design in mind that is not in the store? Send us its pictures, your size and when
          you need it, and the atelier quotes it and stitches it to your measurements.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
        <ol className="space-y-6">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="mt-0.5 text-neutral-500">{step.icon}</span>
              <div>
                <p className="caps text-[10px] text-neutral-500">Step {index + 1}</p>
                <h2 className="caps mt-1 text-label font-bold text-black">{step.title}</h2>
                <p className="mt-1 text-[13px] leading-[1.7] text-neutral-600">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div>
          <h2 className="caps mb-5 text-label font-bold text-black">Request a quote</h2>
          <CustomOrderForm />
        </div>
      </div>
    </div>
  );
}
