import type { Metadata } from "next";
import { Allura, Cabin, Manrope } from "next/font/google";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Overlays } from "@/components/Overlays";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { hero } from "@/lib/home";
import { site } from "@/lib/site";
import "./globals.css";

// Manrope (body and UI) and Allura (the one script accent) come from the typography guide; the
// variable font ships as one file (the site uses 400-600). The big headings keep Cabin in uppercase,
// as committed: two serifs (Bodoni Moda, then Cormorant Garamond) were tried on them and the owner
// asked for the committed look back both times.
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], weight: "variable" });

const cabin = Cabin({ variable: "--font-cabin", subsets: ["latin"], weight: "400" });

const allura = Allura({ variable: "--font-allura", subsets: ["latin"], weight: "400" });

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

// Runs before first paint: the region cookie (set by proxy.ts from the IP country, or by the
// header chooser) wins; otherwise Pakistan for the Karachi time zone and the United States for
// everyone else. See components/Price.tsx.
const regionScript =
  '(function(){try{var m=document.cookie.match(/(?:^|; )zarkoony-region=(PK|US)/);' +
  'var r=m?m[1]:(Intl.DateTimeFormat().resolvedOptions().timeZone==="Asia/Karachi"?"PK":"US");' +
  'document.documentElement.dataset.region=r;' +
  'if(!m)document.cookie="zarkoony-region="+r+"; path=/; max-age=31536000; samesite=lax"}catch(e){}})()';

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${cabin.variable} ${allura.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: regionScript }} />
      </head>
      <body className="bg-white font-sans text-[15px] leading-[1.6] text-charcoal-body antialiased min-[700px]:text-base">
        <Overlays>
          <AnnouncementBar />
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </Overlays>
      </body>
    </html>
  );
}
