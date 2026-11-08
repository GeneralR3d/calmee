import type { Metadata } from 'next';
import Link from 'next/link';
import { products } from '@/lib/products';
import { posts } from '@/lib/blog';
import { CookieButton, PrivacyButton } from '@/components/store-provider';

export const metadata: Metadata = {
  title: 'Sitemap',
  description: 'Explore Calme products, skincare routines, journal articles and support. Gentle skincare for delicate skin.',
};

export default function SitemapPage() {
  return <section className="band sitemap-page"><div className="wrap">
    <header className="sec-intro"><h1 className="h-xl">Sitemap</h1><p>Find your way around Calme. Gentle skincare for delicate skin.</p></header>
    <div className="sitemap-columns">
      <section aria-labelledby="sitemap-shopping"><h2 id="sitemap-shopping">Shopping</h2>
        <ul><li><Link href="/">Home</Link></li><li><Link href="/products">All products</Link></li>
          <li><Link href="/products?category=cleanse">Cleanse</Link></li><li><Link href="/products?category=treat">Care</Link></li>
          <li><Link href="/products?category=moisturise">Moisturise</Link></li><li><Link href="/products?category=sets">Sets and kits</Link></li>
        </ul>
        <h3>The Calme range</h3><ul>{products.map(product => <li key={product.handle}><Link href={`/products/${product.handle}`}>{product.title}</Link></li>)}</ul>
        <h3>Your order</h3><ul><li><Link href="/cart">Your bag</Link></li><li><Link href="/checkout">Checkout</Link></li></ul>
      </section>
      <section aria-labelledby="sitemap-learning"><h2 id="sitemap-learning">Learning</h2>
        <ul><li><Link href="/#c-routine">Routine Finder</Link></li><li><Link href="/#c-science">Science and formulation</Link></li><li><Link href="/blog">The Calme journal</Link></li></ul>
        <h3>Journal articles</h3><ul>{posts.map(post => <li key={post.slug}><Link href={`/blog/${post.slug}`}>{post.title}</Link></li>)}</ul>
      </section>
      <section aria-labelledby="sitemap-support"><h2 id="sitemap-support">Support</h2>
        <ul><li><Link href="/#c-faq">FAQs, delivery and payment</Link></li><li><Link href="/#c-faq">Patch testing and product care</Link></li><li><PrivacyButton>Privacy notice</PrivacyButton></li><li><CookieButton>Cookie choices</CookieButton></li></ul>
        <p className="sitemap-support-note">For enquiries and support, open the green WhatsApp button at the bottom left.</p>
      </section>
    </div>
  </div></section>;
}
