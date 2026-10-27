import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";
import { measurementGuide } from "@/lib/content";

export const metadata: Metadata = {
  title: "Measurement Guide",
  description: "How to take the finished garment measurements the atelier uses for a custom size.",
};

export default function MeasurementGuidePage() {
  return (
    <ContentPage
      page={measurementGuide}
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Made to Order", href: "/made-to-order" },
        { label: "Measurement Guide" },
      ]}
    />
  );
}
