import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";
import { about } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Story",
  description: "ZARKOONY is a Lahore atelier making womenswear cut and stitched to the person who will wear it.",
};

export default function AboutPage() {
  return <ContentPage page={about} crumbs={[{ label: "Home", href: "/" }, { label: "About" }]} />;
}
