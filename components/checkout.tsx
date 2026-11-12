"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { cartLines, discountFor, money, totals } from '@/lib/cart';
import { emit, productEvent } from '@/lib/analytics';
import { useStore } from './store-provider';
import { EmptyBag } from './cart-page';

export function Checkout() {
  const router = useRouter();
  const { items, ready, completeOrder, analytics } = useStore();
  const [codeInput, setCodeInput] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [pay, setPay] = useState('paynow');
  const initialised = useRef(false);
  const submitted = useRef(false);
  const lines = cartLines(items);
  const t = totals(items, code);
  useEffect(() => {
    if (!ready || initialised.current) return;
    initialised.current = true;
    const linked = analytics.linkCode;
    if (linked && discountFor(items, linked) > 0) { setCode(linked); setCodeInput(linked); setMessage(`${linked} applied from your link`); }
  }, [ready, analytics.linkCode, items]);
  const applyCode = () => {
    const next = codeInput.trim().toUpperCase();
    const discount = discountFor(items, next);
    if (discount < 0) {
      setCodeError(true);
      setMessage(discount === -1 ? 'KIT19BACK needs S$38 or more of eligible products, excluding the Discovery Kit.' : 'Code not recognised. Please try another code.');
    } else { setCode(next); setCodeError(false); setMessage(next ? `${next} applied` : 'Discount code removed.'); }
  };
  const placeOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity() || submitted.current || !t.count) return;
    submitted.current = true;
    completeOrder({
      number: `CALME-${Math.floor(event.timeStamp).toString().padStart(6, '0').slice(-6)}`,
      total: t.total,
      method: pay === 'paynow' ? 'PayNow' : 'Bank transfer',
    });
    emit('purchase_demo', { order: 'demo', currency: 'SGD', value: t.total / 100, items: lines.flatMap(line => productEvent(line.product, line.variant, line.qty).items) });
    router.replace('/thank-you');
  };
  if (!ready) return <div className="wrap page-loading" role="status">Loading checkout…</div>;
  if (!lines.length) return <section className="band"><div className="wrap"><h1 className="h-lg center">Checkout</h1><EmptyBag /></div></section>;
  return <section className="band checkout-page"><div className="wrap"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/cart">Your bag</Link><span aria-hidden="true">/</span><span>Checkout</span></nav>
    <form className="co" aria-label="Checkout" onSubmit={placeOrder}>
      <h1 className="h-lg">Checkout</h1><p className="demo-flag">Demo checkout. Try the shopping experience with PayNow or bank transfer. No payment will be taken and no order will be sent.</p>
      <div className="co-grid"><div className="checkout-fields">
        <div className="fields">
          <div className="field full"><label htmlFor="co-email">Email</label><input id="co-email" name="email" type="email" required autoComplete="email" /></div>
          <div className="field"><label htmlFor="co-first">First name</label><input id="co-first" name="firstName" required autoComplete="given-name" /></div>
          <div className="field"><label htmlFor="co-last">Last name</label><input id="co-last" name="lastName" required autoComplete="family-name" /></div>
          <div className="field full"><label htmlFor="co-address">Address</label><input id="co-address" name="address" required autoComplete="street-address" /></div>
          <div className="field"><label htmlFor="co-postal">Postal code</label><input id="co-postal" name="postalCode" required inputMode="numeric" pattern="[0-9]{6}" title="Enter a 6-digit Singapore postal code" autoComplete="postal-code" /></div>
          <div className="field"><label htmlFor="co-phone">Mobile</label><input id="co-phone" name="phone" type="tel" required autoComplete="tel" /></div>
        </div>
        <fieldset><legend>Delivery</legend><label className="radio"><input type="radio" name="delivery" defaultChecked /><span><b>Standard · {t.shipping ? money(t.shipping) : 'Free'}</b><small>1 to 2 working days in Singapore · free on orders of S$60 or more</small></span></label></fieldset>
        <fieldset><legend>Payment</legend><label className="radio"><input type="radio" name="payment" value="paynow" checked={pay === 'paynow'} onChange={() => setPay('paynow')} /><span><b>PayNow</b><small>Simulated payment option</small></span></label><label className="radio"><input type="radio" name="payment" value="bank" checked={pay === 'bank'} onChange={() => setPay('bank')} /><span><b>Bank transfer</b><small>Simulated payment option</small></span></label></fieldset>
      </div><div className="summary" aria-label="Order summary">
        {lines.map(line => <div className="row" key={line.id}><span>{line.qty} × {line.product.title} ({line.variant.title})</span><span>{money(line.total)}</span></div>)}
        <div className="code-row"><label className="sr" htmlFor="co-code">Discount code</label><input id="co-code" placeholder="Discount code" value={codeInput} onChange={event => setCodeInput(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); applyCode(); } }} /><button className="pill sm" type="button" onClick={applyCode}>Apply</button></div>
        <p className={`msg ${codeError ? 'err' : 'ok'}`} role="status">{message}</p>
        <div className="row"><span>Subtotal</span><span>{money(t.subtotal)}</span></div>{t.discount > 0 && <div className="row"><span>Discount {code}</span><span>−{money(t.discount)}</span></div>}
        <div className="row"><span>Delivery</span><span data-testid="delivery">{t.shipping ? money(t.shipping) : 'Free'}</span></div><div className="row tot"><span>Total (GST incl.)</span><span data-testid="total">{money(t.total)}</span></div>
        <button className="pill solid place-order" type="submit">Place demo order</button>
        {analytics.campaign.utm_source && <p className="camp">Attributed to: {[analytics.campaign.utm_source, analytics.campaign.utm_medium, analytics.campaign.utm_campaign].filter(Boolean).join(' / ')}</p>}
      </div></div>
    </form>
  </div></section>;
}
