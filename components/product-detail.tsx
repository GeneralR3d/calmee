"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { type Product } from '@/lib/products';
import { money } from '@/lib/cart';
import { emit, productEvent } from '@/lib/analytics';
import { useStore } from './store-provider';
import { QuantityControl } from './quantity-control';
import { ProductPageGuide } from './product-page-guide';

export function ProductDetail({ product: p }: { product: Product }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { add, ready, toast } = useStore();
  const variant = p.variants[variantIndex];
  useEffect(() => { emit('view_item', productEvent(p, p.variants[0])); }, [p]);
  const share = async () => {
    const url = `${window.location.origin}/products/${p.handle}?utm_source=share&utm_medium=referral&utm_campaign=product_share`;
    const nativeShare = typeof navigator.share === 'function';
    try {
      if (nativeShare) await navigator.share({ title: `${p.title} | Le Calme`, text: p.short, url });
      else { await navigator.clipboard.writeText(url); toast('Link copied. Share it with someone who needs a little calm.'); }
      emit('share', { method: nativeShare ? 'native' : 'copy', ...productEvent(p, variant) });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) toast(`Copy this link: ${url}`);
    }
  };
  return <section className="band product-page"><div className="wrap">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/products">Products</Link><span aria-hidden="true">/</span><span>{p.title}</span></nav>
    <div className="qv product-detail"><div className="qv-img"><img src={variant.image || p.image} alt={`${p.title}, ${variant.title}`} width="800" height="800" /></div>
      <div className="qv-info"><span className="chip">{p.step}</span><h1>{p.title}</h1><p className="price">{money(variant.price)}{variant.compare > variant.price && <s>{money(variant.compare)}</s>} <span className="muted tax-note">GST incl.</span></p><p>{p.short}</p>
        {p.variants.length > 1 && <div className="opts" role="group" aria-label="Size">{p.variants.map((v, index) => <button key={v.id} aria-pressed={index === variantIndex} onClick={() => setVariantIndex(index)}>{v.title} · {money(v.price)}</button>)}</div>}
        {p.variants.length === 1 && <p className="muted product-size">{variant.title}</p>}
        <div className="buy-row"><QuantityControl value={quantity} onChange={setQuantity} /><button className="pill solid" disabled={!ready || !variant.available} onClick={() => add([{ id: variant.id, qty: quantity }], `${p.title} added to bag`)}>{variant.available ? `Add to Bag · ${money(variant.price * quantity)}` : 'Sold out'}</button></div>
        <div className="qv-detail"><h2>{p.listTitle}</h2><ul>{p.ingredients.map(ingredient => <li key={ingredient}>{ingredient}</li>)}</ul><h2>How to use</h2><p>{p.how}</p><h2>Patch test</h2><p>Try a small amount behind the ear for 48 hours first. Not for broken or weeping skin.</p></div>
        <div className="qv-links"><Link href="/products">Explore the range</Link><button className="link-btn" type="button" onClick={share}>Share this product</button></div>
      </div>
    </div>
    <ProductPageGuide />
  </div></section>;
}
