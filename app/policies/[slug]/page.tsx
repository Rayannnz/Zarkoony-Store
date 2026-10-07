import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/ContentPage";
import { policies } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(policies).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/policies/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const page = policies[slug];
  return page ? { title: page.title, description: page.intro } : {};
}

export default async function PolicyPage(props: PageProps<"/policies/[slug]">) {
  const { slug } = await props.params;
  const page = policies[slug];
  if (!page) notFound();
  return (
    <ContentPage
      page={page}
      crumbs={[{ label: "Home", href: "/" }, { label: "Policies" }, { label: page.title }]}
    />
  );
}
