import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";
import { returns } from "@/lib/content";

export const metadata: Metadata = {
  title: "Alterations & Exchanges",
  description: "Complimentary alterations, exchanges for faults, and how to request them.",
};

export default function ReturnsPage() {
  return <ContentPage page={returns} crumbs={[{ label: "Home", href: "/" }, { label: "Alterations & Exchanges" }]} />;
}
