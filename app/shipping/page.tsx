import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";
import { shipping } from "@/lib/content";

export const metadata: Metadata = {
  title: "Shipping & Dispatch",
  description: "Dispatch timelines, delivery across Pakistan, tracking and priority stitching.",
};

export default function ShippingPage() {
  return <ContentPage page={shipping} crumbs={[{ label: "Home", href: "/" }, { label: "Shipping & Dispatch" }]} />;
}
