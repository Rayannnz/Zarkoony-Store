import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";
import { measurementGuide } from "@/lib/content";

export const metadata: Metadata = {
  title: "Measurement Guide",
  description: "How to take the eight measurements the atelier uses to draft your pattern.",
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
