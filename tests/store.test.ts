import { describe, expect, it } from 'vitest';
import { products, filterProducts, byHandle } from '../lib/products';
import { cartLines, changeQuantity, addItems, sanitiseCart, totals, discountFor, money } from '../lib/cart';

describe('original catalogue', () => {
  it('preserves nine products and ten variants', () => {
    expect(products).toHaveLength(9);
    expect(products.flatMap(p => p.variants)).toHaveLength(10);
    expect(byHandle['barrier-repair-cream'].variants.map(v => [v.title, v.price])).toEqual([['50 ml', 3800], ['100 ml', 6400]]);
    expect(products.every(p => p.image.startsWith('/img/'))).toBe(true);
  });
  it('combines step, concern and case-insensitive search', () => {
    expect(filterProducts('cleanse', 'any', '')).toHaveLength(2);
    expect(filterProducts('sets', 'any', '')).toHaveLength(2);
    expect(filterProducts('treat', 'delicate', 'CENTELLA').map(p => p.handle)).toEqual(['centella-calming-serum']);
    expect(filterProducts('all', 'any', 'no matching product')).toEqual([]);
  });
});

describe('persistent demo bag', () => {
  it('restores the legacy format and discards invalid lines', () => {
    expect(sanitiseCart([{id:'CLM-BRC-100',qty:2}, {id:'missing',qty:1}, {id:'CLM-CER-30',qty:-1}])).toEqual([{id:'CLM-BRC-100',qty:2}]);
    expect(sanitiseCart(null)).toEqual([]);
    expect(sanitiseCart({bad:true})).toEqual([]);
  });
  it('merges identical variants and removes a zero quantity', () => {
    const cart = addItems([{id:'CLM-BRC-50',qty:1}], [{id:'CLM-BRC-50',qty:2}, {id:'CLM-BRC-100',qty:1}]);
    expect(cartLines(cart).map(l => [l.variant.title, l.qty, l.total])).toEqual([['50 ml',3,11400], ['100 ml',1,6400]]);
    expect(changeQuantity(cart,'CLM-BRC-50',0)).toEqual([{id:'CLM-BRC-100',qty:1}]);
  });
});

describe('demo checkout rules', () => {
  it('charges S$4.90 below S$60 and ships free at S$60 before discounts', () => {
    expect(totals([{id:'CLM-CRM-200',qty:1}], '')).toEqual({subtotal:2800,discount:0,shipping:490,total:3290,count:1});
    expect(totals([{id:'CLM-CRM-200',qty:1},{id:'CLM-OIL-150',qty:1}], 'WELCOME10')).toEqual({subtotal:6000,discount:600,shipping:0,total:5400,count:2});
  });
  it('recognises all original percent codes and rejects unknown codes', () => {
    for (const code of ['WELCOME10','CALMEIG','CALMEFB','CALMETT','CALMEGOOGLE']) expect(discountFor([{id:'CLM-CER-30',qty:1}],code)).toBe(460);
    expect(discountFor([{id:'CLM-CER-30',qty:1}],'UNKNOWN')).toBe(-2);
  });
  it('applies KIT19BACK only with S$38 of eligible non-kit products', () => {
    expect(discountFor([{id:'CLM-KIT-DISC',qty:2}],'KIT19BACK')).toBe(-1);
    expect(discountFor([{id:'CLM-CRM-200',qty:1}],'KIT19BACK')).toBe(-1);
    expect(discountFor([{id:'CLM-BRC-50',qty:1},{id:'CLM-KIT-DISC',qty:1}],'KIT19BACK')).toBe(1900);
  });
  it('formats Singapore dollars without losing cents', () => {
    expect(money(1900)).toBe('S$19');
    expect(money(490)).toBe('S$4.90');
  });
});

describe('stored cart recovery', () => {
  it('does not accept inherited object keys as real variant IDs', () => {
    expect(sanitiseCart([{id:'constructor',qty:1},{id:'__proto__',qty:1},{id:'toString',qty:1}])).toEqual([]);
  });
});
