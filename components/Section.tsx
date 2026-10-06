import type { ReactNode } from "react";

export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className={`text-center ${subtitle ? "mb-10 md:mb-14" : "mb-8 md:mb-12"}`}>
      {/* Fluid: 22px on a phone, 30px at 1280px, capped at 32px. */}
      <h2 className="caps text-[clamp(1.375rem,1.18rem+0.86vw,2rem)] font-normal leading-[1.4] text-black">
        {title}
      </h2>
      {subtitle && <p className="caps mt-2 text-xs text-neutral-500">{subtitle}</p>}
    </div>
  );
}

type SectionProps = {
  id: string;
  title: string;
  subtitle?: string;
  /** Vertical padding; the first and last homepage sections breathe a little more. */
  className?: string;
  children: ReactNode;
};

export function Section({
  id,
  title,
  subtitle,
  className = "pt-8 pb-12 md:pt-14 md:pb-16",
  children,
}: SectionProps) {
  return (
    <section id={id} className={`mx-auto max-w-[1920px] px-4 md:px-10 lg:px-14 ${className}`}>
      <SectionHeading title={title} subtitle={subtitle} />
      {children}
    </section>
  );
}
