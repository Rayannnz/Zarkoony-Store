import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";
import { faq } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Ordering, measurements, stitching, delivery, alterations and account questions answered.",
};

export default function FaqPage() {
  return <ContentPage page={faq} crumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />;
}
