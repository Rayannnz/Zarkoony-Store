import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";
import { headingClass } from "@/components/shop/Listing";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach the ZARKOONY concierge on WhatsApp, phone or e-mail, or book an atelier appointment in Lahore.",
};

const icon = { size: 18, strokeWidth: 1.5, "aria-hidden": true } as const;

const details = [
  { icon: <MessageCircle {...icon} />, label: "WhatsApp concierge", value: site.concierge.label, href: site.whatsapp.href },
  { icon: <Phone {...icon} />, label: "Call", value: site.uan.label, href: `tel:${site.uan.tel}` },
  { icon: <Mail {...icon} />, label: "E-mail", value: site.email, href: `mailto:${site.email}` },
  { icon: <Clock {...icon} />, label: "Hours", value: site.hours },
  {
    icon: <MapPin {...icon} />,
    label: "Atelier (by appointment)",
    value: `${site.atelier.name}, ${site.atelier.lines.join(", ")}`,
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 md:px-10 md:pb-24">
      <div className="py-4">
        <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      </div>
      <header className="pb-10 text-center md:pb-14">
        <p className="caps text-[11px] text-neutral-500">Customer care</p>
        <h1 className={`${headingClass} mt-2`}>Contact</h1>
        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.75] text-neutral-600">
          For a commission in progress, a bridal consultation or anything else, the concierge replies
          within one working day.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
        <ul className="space-y-6">
          {details.map((item) => (
            <li key={item.label} className="flex gap-4">
              <span className="mt-0.5 text-neutral-500">{item.icon}</span>
              <div>
                <p className="caps text-[10px] text-neutral-500">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="link-underline mt-1 inline-block text-[15px] text-black">
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-1 text-[15px] text-black">{item.value}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div>
          <h2 className="caps mb-5 text-[13px] font-bold text-black">Send a message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
