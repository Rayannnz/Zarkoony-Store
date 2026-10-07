import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";
import { sizeGuide } from "@/lib/content";

export const metadata: Metadata = {
  title: "Size Guide",
  description: "ZARKOONY's standard atelier sizes in inches, and when to choose custom measurements.",
};

export default function SizeGuidePage() {
  return (
    <ContentPage
      page={sizeGuide}
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Made to Order", href: "/made-to-order" },
        { label: "Size Guide" },
      ]}
    />
  );
}
