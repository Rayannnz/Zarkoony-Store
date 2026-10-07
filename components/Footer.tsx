import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { footerColumns, site, socials } from "@/lib/site";
import { NewsletterForm } from "./NewsletterForm";

const columnSpan: Record<number, string> = { 2: "lg:col-span-2", 3: "lg:col-span-3" };

const headingClass = "caps text-[13px] font-bold text-white";

export function Footer() {
  return (
    <footer className="border-t border-neutral-900 bg-black pb-12 pt-16 text-[13px] text-[#8E8E8E] md:pt-20">
      <div className="mx-auto max-w-[1920px] px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 gap-10 border-b border-neutral-900 pb-16 md:grid-cols-2 md:gap-12 lg:grid-cols-12">
          {footerColumns.map((column) => (
            <div key={column.title} className={`space-y-4 ${columnSpan[column.span]}`}>
              <h4 className={headingClass}>{column.title}</h4>
              <ul className="space-y-2.5 text-white/65">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition-colors duration-200 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-4 lg:col-span-4">
            <h4 className={headingClass}>Sign up for our atelier newsletter</h4>
            <p className="text-neutral-400">
              Subscribe for early previews of new limited drops, bespoke stitching slots, and
              private salon appointments.
            </p>
            <NewsletterForm />
            <div className="flex items-center gap-5 pt-3 text-white/65">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="transition-colors duration-200 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="caps flex flex-col items-center justify-between gap-4 pt-8 text-[11px] text-neutral-500 md:flex-row">
          <button
            type="button"
            popoverTarget="country-menu"
            className="flex items-center gap-1 transition-colors duration-200 hover:text-white"
          >
            <span>Pakistan</span>
            <ChevronDown size={12} strokeWidth={1.25} aria-hidden />
          </button>
          <div>
            © {new Date().getFullYear()} - {site.name}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-5 w-8 items-center justify-center bg-neutral-800 font-sans text-[8px] font-bold tracking-tighter text-white">
              VISA
            </div>
            <div
              role="img"
              aria-label="Mastercard"
              className="flex h-5 w-8 items-center justify-center bg-neutral-800"
            >
              <span className="inline-block h-2.5 w-2.5 bg-red-500/90" />
              <span className="-ml-1 inline-block h-2.5 w-2.5 bg-amber-500/90" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
