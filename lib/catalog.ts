import {
  categories,
  collections,
  products,
  type CategorySlug,
  type CollectionSlug,
  type Product,
} from "./products";

export const PAGE_SIZE = 12;

export const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
] as const;

export type SortKey = (typeof sortOptions)[number]["value"];

export const priceRanges = [
  { value: "under-25000", label: "Under PKR 25,000", min: 0, max: 24999 },
  { value: "25000-50000", label: "PKR 25,000 – 50,000", min: 25000, max: 50000 },
  { value: "over-50000", label: "Over PKR 50,000", min: 50001, max: Infinity },
] as const;

export const facetKeys = ["type", "fabric", "color"] as const;
export type FacetKey = (typeof facetKeys)[number];

/** The shape Next hands a page: repeated keys arrive as arrays. */
export type SearchParams = Record<string, string | string[] | undefined>;

export type ListingParams = {
  type: string[];
  fabric: string[];
  color: string[];
  price: string[];
  new: boolean;
  sort: SortKey;
  page: number;
  q: string;
};

const list = (v: string | string[] | undefined) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);
const first = (v: string | string[] | undefined) => list(v)[0];

export function parseListingParams(sp: SearchParams): ListingParams {
  const sort = first(sp.sort);
  return {
    type: list(sp.type),
    fabric: list(sp.fabric),
    color: list(sp.color),
    price: list(sp.price).filter((v) => priceRanges.some((r) => r.value === v)),
    new: first(sp.new) === "1",
    sort: sortOptions.some((o) => o.value === sort) ? (sort as SortKey) : "featured",
    page: Math.max(1, Math.floor(Number(first(sp.page))) || 1),
    q: (first(sp.q) ?? "").trim(),
  };
}

/** Query string for a listing state; omits defaults so clean URLs stay clean. */
export function listingQuery(params: ListingParams, overrides: Partial<ListingParams> = {}) {
  const p = { ...params, ...overrides };
  const qs = new URLSearchParams();
  if (p.q) qs.set("q", p.q);
  for (const key of facetKeys) for (const v of p[key]) qs.append(key, v);
  for (const v of p.price) qs.append("price", v);
  if (p.new) qs.set("new", "1");
  if (p.sort !== "featured") qs.set("sort", p.sort);
  if (p.page > 1) qs.set("page", String(p.page));
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export const hasActiveFilters = (p: ListingParams) =>
  facetKeys.some((k) => p[k].length > 0) || p.price.length > 0 || p.new;

export function filterProducts(items: Product[], p: ListingParams) {
  const ranges = priceRanges.filter((r) => p.price.includes(r.value));
  return items.filter(
    (x) =>
      facetKeys.every((k) => !p[k].length || p[k].includes(x[k])) &&
      (!ranges.length || ranges.some((r) => x.price >= r.min && x.price <= r.max)) &&
      (!p.new || x.isNew),
  );
}

export function sortProducts(items: Product[], sort: SortKey) {
  const sorted = [...items];
  if (sort === "newest") sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
  return sorted; // "featured" keeps the catalogue order
}

export function paginate<T>(items: T[], page: number) {
  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  return {
    items: items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE),
    page: current,
    pages,
    total: items.length,
  };
}

/** Distinct values of a facet within `items`, with counts, in alphabetical order. */
export function facetValues(items: Product[], key: FacetKey) {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item[key], (counts.get(item[key]) ?? 0) + 1);
  return [...counts]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value));
}

/** Filter, sort and page `items` from a page's searchParams in one go. */
export function runListing(items: Product[], sp: SearchParams) {
  const params = parseListingParams(sp);
  const filtered = sortProducts(filterProducts(items, params), params.sort);
  return { params, ...paginate(filtered, params.page) };
}

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
export const collectionBySlug = (slug: string) => collections.find((c) => c.slug === slug);

export const productsInCategory = (slug: CategorySlug | "new-arrivals") =>
  slug === "new-arrivals" ? products.filter((p) => p.isNew) : products.filter((p) => p.category === slug);

export const productsInCollection = (slug: CollectionSlug) =>
  products.filter((p) => p.collection === slug);

/** Same category first, then same collection, never the product itself. */
export function relatedProducts(product: Product, count = 4) {
  const others = products.filter((p) => p.slug !== product.slug);
  const ranked = [
    ...others.filter((p) => p.category === product.category),
    ...others.filter((p) => p.category !== product.category && p.collection === product.collection),
    ...others.filter((p) => p.category !== product.category && p.collection !== product.collection),
  ];
  return ranked.slice(0, count);
}

const haystack = (p: Product) =>
  [
    p.name,
    p.type,
    p.fabric,
    p.color,
    p.occasion,
    categoryBySlug(p.category)?.name,
    p.collection && collectionBySlug(p.collection)?.name,
    ...p.pieces,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

/** Every word of the query must appear in the product's name, type, fabric, colour, occasion, category, collection or pieces. */
export function searchProducts(q: string) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return products.filter((p) => {
    const hay = haystack(p);
    return terms.every((t) => hay.includes(t));
  });
}
