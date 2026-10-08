import type { ReactNode } from "react";
import Link from "next/link";

export function SectionHeading({
  title,
  subtitle,
  subtitleHref,
}: {
  title: string;
  subtitle?: string;
  /** Makes the subtitle a link, e.g. the custom-design promise under New Arrivals. */
  subtitleHref?: string;
}) {
  return (
    <div className={`text-center ${subtitle ? "mb-10 md:mb-14" : "mb-8 md:mb-12"}`}>
      {/* Fluid: 22px on a phone, 30px at 1280px, capped at 32px. */}
      <h2 className="caps text-title font-normal text-black">
        {title}
      </h2>
      {subtitle && (
        <p className="caps mt-2 text-xs text-neutral-500">
          {subtitleHref ? (
            <Link href={subtitleHref} className="link-underline hover:text-black">
              {subtitle}
            </Link>
          ) : (
            subtitle
          )}
        </p>
      )}
    </div>
  );
}

type SectionProps = {
  id: string;
  title: string;
  subtitle?: string;
  subtitleHref?: string;
  /** Vertical padding; the first and last homepage sections breathe a little more. */
  className?: string;
  children: ReactNode;
};

export function Section({
  id,
  title,
  subtitle,
  subtitleHref,
  className = "pt-8 pb-12 md:pt-14 md:pb-16",
  children,
}: SectionProps) {
  return (
    <section id={id} className={`mx-auto max-w-[1920px] px-4 md:px-10 lg:px-14 ${className}`}>
      <SectionHeading title={title} subtitle={subtitle} subtitleHref={subtitleHref} />
      {children}
    </section>
  );
}
