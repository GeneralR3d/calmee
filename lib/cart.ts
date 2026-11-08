import { byVariant, type Product, type Variant } from './products';

export type CartItem = { id: string; qty: number };
export type CartLine = CartItem & { product: Product; variant: Variant; total: number };
export const FREE_SHIPPING = 6000;
export const SHIPPING = 490;
export function money(cents: number) {
  const c = Math.round(cents);
  return `S$${c % 100 ? (c / 100).toFixed(2) : c / 100}`;
}
export function sanitiseCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const items: CartItem[] = [];
  for (const line of value) {
    if (!line || typeof line.id !== 'string' || !Object.hasOwn(byVariant, line.id) || !Number.isSafeInteger(line.qty) || line.qty <= 0) continue;
    const existing = items.find(l => l.id === line.id);
    if (existing) existing.qty += line.qty;
    else items.push({ id: line.id, qty: line.qty });
  }
  return items;
}
export function cartLines(items: CartItem[]): CartLine[] {
  return sanitiseCart(items).map(item => ({ ...item, ...byVariant[item.id], total: byVariant[item.id].variant.price * item.qty }));
}
export function addItems(items: CartItem[], additions: CartItem[]) {
  return sanitiseCart([...items, ...additions.filter(item => byVariant[item.id]?.variant.available)]);
}
export function changeQuantity(items: CartItem[], id: string, qty: number) {
  return sanitiseCart(items.map(item => item.id === id ? { id, qty } : item));
}
export function discountFor(items: CartItem[], code: string) {
  if (!code) return 0;
  const lines = cartLines(items);
  if (['WELCOME10', 'CALMEIG', 'CALMEFB', 'CALMETT', 'CALMEGOOGLE'].includes(code)) return Math.round(lines.reduce((sum, l) => sum + l.total, 0) * .1);
  if (code === 'KIT19BACK') return lines.filter(l => l.product.handle !== 'discovery-kit').reduce((sum, l) => sum + l.total, 0) >= 3800 ? 1900 : -1;
  return -2;
}
export function totals(items: CartItem[], code = '') {
  const lines = cartLines(items);
  const subtotal = lines.reduce((sum, l) => sum + l.total, 0);
  const discount = Math.max(0, discountFor(items, code));
  const shipping = !lines.length || subtotal >= FREE_SHIPPING ? 0 : SHIPPING;
  return { subtotal, discount, shipping, total: subtotal - discount + shipping, count: lines.reduce((sum, l) => sum + l.qty, 0) };
}
