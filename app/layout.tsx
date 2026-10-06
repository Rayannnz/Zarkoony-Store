import type { Metadata } from "next";
import { Cabin, Figtree, Playfair_Display } from "next/font/google";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Overlays } from "@/components/Overlays";
import { hero } from "@/lib/home";
import { site } from "@/lib/site";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const cabin = Cabin({
  variable: "--font-cabin",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [{ url: hero.image, width: 1376, height: 768, alt: hero.alt }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${figtree.variable} ${cabin.variable} ${playfair.variable} scroll-smooth`}
    >
      <body className="bg-white font-sans text-[15px] leading-[1.65] text-charcoal-body antialiased">
        <Overlays>
          <AnnouncementBar />
          <Header />
          <main>{children}</main>
          <Footer />
        </Overlays>
      </body>
    </html>
  );
}
