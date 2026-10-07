import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";
import { madeToOrder } from "@/lib/content";

export const metadata: Metadata = {
  title: "Made to Order",
  description: "How a ZARKOONY commission works, from measurements to the final fitting.",
};

export default function MadeToOrderPage() {
  return <ContentPage page={madeToOrder} crumbs={[{ label: "Home", href: "/" }, { label: "Made to Order" }]} />;
}
