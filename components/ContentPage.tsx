import { Plus } from "lucide-react";
import type { Block, ContentPage as Page } from "@/lib/content";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { Reveal } from "./Reveal";
import { headingClass } from "./shop/Listing";

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="text-[15px] leading-[1.75] text-neutral-700">{block.text}</p>;
    case "list":
      return (
        <ul className="list-disc space-y-2 pl-5 text-[15px] leading-[1.75] text-neutral-700">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="space-y-6 border-l border-neutral-200 pl-6">
          {block.items.map((step, index) => (
            <li key={step.title} className="relative">
              <span aria-hidden className="caps absolute -left-[37px] top-0 flex size-6 items-center justify-center bg-black text-[10px] text-white">
                {index + 1}
              </span>
              <h3 className="caps text-[11px] text-black">{step.title}</h3>
              <p className="mt-1 text-[15px] leading-[1.75] text-neutral-700">{step.text}</p>
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-[13px]">
            <thead>
              <tr className="caps border-b border-neutral-300 text-left text-[10px] text-neutral-500">
                {block.head.map((cell, index) => (
                  <th key={cell} scope="col" className={`py-2 font-normal ${index > 0 ? "text-center" : ""}`}>
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={String(row[0])} className="border-b border-neutral-200">
                  {row.map((cell, index) => (
                    <td key={`${row[0]}-${index}`} className={`py-2.5 ${index === 0 ? "text-black" : "text-center text-neutral-700"}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "faq":
      return (
        <div className="divide-y divide-neutral-200 border-y border-neutral-200">
          {block.items.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 text-[15px] text-black [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus size={16} strokeWidth={1.5} aria-hidden className="mt-1 shrink-0 transition-transform duration-(--duration-medium) group-open:rotate-45" />
              </summary>
              <p className="pb-5 text-[15px] leading-[1.75] text-neutral-700">{item.a}</p>
            </details>
          ))}
        </div>
      );
  }
}

/** Title, intro and sections of structured copy from lib/content.ts. */
export function ContentPage({ page, crumbs, children }: { page: Page; crumbs: Crumb[]; children?: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-4 pb-16 md:px-10 md:pb-24">
      <div className="py-4">
        <Breadcrumbs crumbs={crumbs} />
      </div>
      <header className="pb-10 text-center md:pb-14">
        {page.eyebrow && <p className="caps text-[11px] text-neutral-500">{page.eyebrow}</p>}
        <h1 className={`${headingClass} mt-2`}>{page.title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.75] text-neutral-600">{page.intro}</p>
        {page.updated && (
          <p className="caps mt-4 text-[10px] text-neutral-400">
            Last updated {new Date(page.updated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
          </p>
        )}
      </header>
      <div className="space-y-12">
        {page.sections.map((section, index) => (
          <Reveal key={section.heading} index={Math.min(index, 2)}>
            <section id={section.id} className="scroll-mt-24 space-y-5">
              <h2 className="caps text-label font-bold text-black">{section.heading}</h2>
              {section.blocks.map((block, blockIndex) => (
                <BlockView key={`${section.heading}-${blockIndex}`} block={block} />
              ))}
            </section>
          </Reveal>
        ))}
        {children}
      </div>
    </article>
  );
}
