import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = { title: { default: "Account", template: "%s | ZARKOONY" }, robots: { index: false } };

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 md:px-10 md:pb-24">
      <div className="py-4">
        <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "Account", href: "/account" }]} />
      </div>
      {children}
    </div>
  );
}
