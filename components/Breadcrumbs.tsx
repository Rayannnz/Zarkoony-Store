import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="caps text-[11px] text-neutral-500">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {crumbs.map((crumb, index) => (
          <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden>/</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="transition-colors duration-(--duration-fast) hover:text-black">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-black">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
