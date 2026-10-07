import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Checkout } from "@/components/checkout/Checkout";
import { headingClass } from "@/components/shop/Listing";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 md:px-10 md:pb-24">
      <div className="py-4">
        <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      </div>
      <h1 className={`${headingClass} pb-8 text-center md:pb-10`}>Checkout</h1>
      <Checkout />
    </div>
  );
}
