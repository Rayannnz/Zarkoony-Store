import type { Metadata } from "next";
import { Cabin, Figtree } from "next/font/google";
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
  weight: ["400", "700"],
});

const cabin = Cabin({
  variable: "--font-cabin",
  subsets: ["latin"],
  weight: ["400", "700"],
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
    images: [{ url: hero.image, width: hero.width, height: hero.height, alt: hero.alt }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${figtree.variable} ${cabin.variable} scroll-smooth`}
    >
      <body className="bg-white font-sans text-[14px] leading-[1.65] text-charcoal-body antialiased min-[700px]:text-[15px]">
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
