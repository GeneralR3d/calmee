"use client";

import Link from 'next/link';
import { money } from '@/lib/cart';
import { useStore } from './store-provider';

export function OrderConfirmation() {
  const { order, ready } = useStore();

  if (!ready) return <div className="wrap page-loading" role="status">Loading order confirmation…</div>;

  return (
    <section className="band">
      <div className="wrap">
        <div className="done confirmation">
          {order && <>
            <span className="tick" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12l5 5 9-10" />
              </svg>
            </span>
            <p className="eyebrow">Demo order {order.number}</p>
          </>}
          <h1 className="h-lg" tabIndex={-1} ref={node => node?.focus()}>
            {order ? 'Thank you. A little calm is on its way.' : 'No demo order to show'}
          </h1>
          {order && <>
            <p>Total {money(order.total)} · {order.method}</p>
            <p className="muted">This was a simulated order. No payment has been taken and no products will be shipped.</p>
          </>}
          <Link className="pill solid" href="/products">Continue shopping</Link>
        </div>
      </div>
    </section>
  );
}
