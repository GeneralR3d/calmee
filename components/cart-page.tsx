"use client";

import Link from 'next/link';
import { byHandle } from '@/lib/products';
import { cartLines, FREE_SHIPPING, money, totals } from '@/lib/cart';
import { AddToBag, CheckoutLink, useStore } from './store-provider';
import { QuantityControl } from './quantity-control';

export function EmptyBag() {
  return <div className="dr-empty"><p>Your bag is empty.</p><div className="cta-row"><Link className="pill solid" href="/products">Browse products</Link><Link className="pill" href="/#c-routine">Find your routine</Link></div></div>;
}
export function CartPage() {
  const { items, ready, update } = useStore();
  const lines = cartLines(items);
  const t = totals(items);
  const next = ['barrier-repair-cream', 'ceramide-recovery-serum', 'gentle-cream-cleanser', 'barrier-cleansing-oil'].find(handle => !lines.some(l => l.product.handle === handle || l.product.handle === 'barrier-reset-routine'));
  const remaining = FREE_SHIPPING - t.subtotal;
  return <section className="band cart-page"><div className="wrap"><div className="sec-intro"><h1 className="h-lg">Your bag{ready && t.count ? ` (${t.count})` : ''}</h1><p>A little calm, ready to come home.</p></div>
    {!ready ? <div className="page-loading" role="status">Loading your bag…</div> : !lines.length ? <EmptyBag /> : <div className="cart-layout">
      <div><div className="ship cart-shipping"><span>{remaining > 0 ? <>Add <b>{money(remaining)}</b> more for free delivery</> : <b>Free delivery unlocked</b>}</span><div className="bar"><i style={{ width: `${Math.min(100, t.subtotal / FREE_SHIPPING * 100)}%` }} /></div></div>
        {lines.map(line => <article className="line cart-item" key={line.id}><Link href={`/products/${line.product.handle}`}><img src={line.variant.image || line.product.image} alt={line.product.title} width="88" height="88" /></Link><div><div className="line-top"><h2><Link href={`/products/${line.product.handle}`}>{line.product.title}</Link></h2><span className="price">{money(line.total)}</span></div><span className="muted product-size">{line.variant.title}</span><div className="line-actions"><QuantityControl value={line.qty} minimum={0} label={line.product.title} onChange={qty => update(line.id, qty)} /><button className="rm" aria-label={`Remove ${line.product.title}`} onClick={() => update(line.id, 0)}>Remove</button></div></div></article>)}
        {next && <div className="upsell"><img src={byHandle[next].image} alt="" width="52" height="52" /><div><small>Complete your routine</small>{byHandle[next].title} · {money(byHandle[next].variants[0].price)}</div><AddToBag className="pill solid sm" handle={next}>Add</AddToBag></div>}
      </div>
      <aside className="summary cart-summary" aria-label="Bag summary"><div className="row"><span>Subtotal</span><strong data-testid="subtotal">{money(t.subtotal)}</strong></div><p className="muted">GST included. Delivery and discount codes at checkout.</p><CheckoutLink /><Link className="continue-shopping" href="/products">Continue shopping</Link></aside>
    </div>}
  </div></section>;
}
