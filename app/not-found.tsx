import Link from 'next/link';
export default function NotFound() {
  return <section className="band"><div className="wrap center empty-page"><p className="eyebrow">404</p><h1 className="h-lg">Page not found</h1><p className="muted">We couldn&apos;t find that page. Explore the Le Calme range or head back home.</p><div className="cta-row"><Link className="pill solid" href="/products">Browse products</Link><Link className="pill" href="/">Back to home</Link></div></div></section>;
}
