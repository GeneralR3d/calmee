import catalogue from './catalogue.json';

export type Category = 'cleanse' | 'treat' | 'moisturise' | 'sets' | 'other';
export type Concern = 'any' | 'flare' | 'dry' | 'texture';
export type Variant = { id: string; title: string; price: number; compare: number; available: boolean; image?: string };
export type Product = { handle: string; title: string; tags: string[]; category: Category; step: string; image: string; imageSm: string; short: string; ingredients: string[]; listTitle: string; how: string; variants: Variant[] };
export const products = catalogue as Product[];
export const byHandle = Object.fromEntries(products.map(p => [p.handle, p]));
export const byVariant = Object.fromEntries(products.flatMap(product => product.variants.map(variant => [variant.id, { product, variant }])));
const concerns: Record<Concern, string[]> = {
  any: [], flare: ['flare-up-care', 'soothing', 'barrier-repair', 'redness'],
  dry: ['barrier-repair', 'dry-skin', 'moisturise', 'oil-cleanser', 'cream-cleanser'],
  texture: ['advanced', 'texture', 'exfoliant'],
};
export function filterProducts(category: string, concern: Concern, query: string) {
  const q = query.trim().toLowerCase();
  return products.filter(p => (category === 'all' || p.category === category)
    && (concern === 'any' || concerns[concern].some(tag => p.tags.includes(tag)))
    && (!q || `${p.title} ${p.tags.join(' ')} ${p.short}`.toLowerCase().includes(q)));
}
export function badgeOf(p: Product) {
  const v = p.variants[0];
  if (v.compare > v.price) return `Save S$${(v.compare - v.price) / 100}`;
  if (p.tags.includes('bestseller')) return 'Best seller';
  return p.tags.includes('trial') ? 'Try first' : '';
}
