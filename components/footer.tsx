"use client";

import Link from 'next/link';
import { config } from '@/lib/config';
import { emit } from '@/lib/analytics';
import { CookieButton, PrivacyButton, useStore } from './store-provider';

export function Footer() {
  const { toast } = useStore();
  return <footer className="foot"><div className="wrap">
    <div className="foot-notes"><p>1. Calme products are cosmetics. They are not intended to diagnose, treat, cure or prevent eczema or any other disease. Patch test before use and stop if irritation occurs.</p><p>2. Free delivery applies to orders of S$60 or more delivered within Singapore. Discovery Kit voucher limited to one per customer.</p></div>
    <div className="foot-cols">
      <div><h3>Shop</h3><Link href="/products?category=cleanse">Cleanse</Link><Link href="/products?category=treat">Treat</Link><Link href="/products?category=moisturise">Moisturise</Link><Link href="/products?category=sets">Sets and kits</Link></div>
      <div><h3>Learn</h3><Link href="/blog">Blog</Link><Link href="/#c-routine">Routine Finder</Link><Link href="/#c-science">Formulation</Link><Link href="/#c-faq">How to patch test</Link></div>
      <div><h3>Support</h3><Link href="/#c-faq">Delivery</Link><Link href="/#c-faq">Payment</Link><Link href="/#c-faq">Returns</Link><PrivacyButton>Privacy notice</PrivacyButton><CookieButton>Cookie choices</CookieButton></div>
      <div className="foot-news"><h3>Stay in touch</h3><p>Routine tips and 10% off your first order.</p>
        <form className="news" onSubmit={event => { event.preventDefault(); emit('lead', { method: 'footer_newsletter' }); toast("You're on the list. Use WELCOME10 for 10% off your first order."); event.currentTarget.reset(); }}>
          <label className="sr" htmlFor="c-news-email">Email for newsletter</label><input id="c-news-email" name="email" type="email" autoComplete="email" required placeholder="Email address" /><button className="pill solid" type="submit">Subscribe</button>
        </form><p className="news-note">By subscribing you agree to receive emails from Calme. Unsubscribe any time.</p>
        {Object.entries(config.socials).some(([, url]) => /^https?:\/\//.test(url)) && <div className="socials"><span>Follow Calme</span>{Object.entries(config.socials).filter(([, url]) => /^https?:\/\//.test(url)).map(([platform, url]) => <a key={platform} href={url} target="_blank" rel="noopener noreferrer">{platform}</a>)}</div>}
      </div>
    </div>
    <div className="foot-base"><span>Copyright © 2026 Calme. All rights reserved.</span><span>Singapore</span></div>
    <p className="mode-note">Demo mode: products and checkout are simulated.</p>
  </div></footer>;
}
