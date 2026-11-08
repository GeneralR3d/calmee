"use client";

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { badgeOf, filterProducts, type Concern, type Product } from '@/lib/products';
import { money } from '@/lib/cart';
import { emit } from '@/lib/analytics';
import { AddToBag } from './store-provider';

const categories = [['all', 'All'], ['cleanse', 'Cleanse'], ['treat', 'Care'], ['moisturise', 'Moisturise'], ['sets', 'Sets']];
const concerns: [Concern, string][] = [['any', 'Any'], ['delicate', 'Delicate skin'], ['dry', 'Dryness & tightness'], ['texture', 'Rough texture']];
export function ProductCard({ product: p }: { product: Product }) {
  const prices = p.variants.map(v => v.price);
  const low = Math.min(...prices);
  const multi = p.variants.length > 1;
  return <article className="card">
    <Link className="card-img" href={`/products/${p.handle}`} aria-label={`View ${p.title}`}><img src={p.image} srcSet={`${p.imageSm} 450w, ${p.image} 900w`} sizes="(max-width: 640px) 46vw, 360px" alt={p.title} loading="lazy" decoding="async" width="800" height="800" /></Link>
    <div className="card-body"><span className="badge">{badgeOf(p)}</span><h2><Link href={`/products/${p.handle}`}>{p.title}</Link></h2><p className="benefit">{p.short}</p><p className="meta">{p.step} · {p.variants.map(v => v.title).join(' · ')}</p>
      <div className="card-foot"><span className="price">{Math.max(...prices) !== low ? 'From ' : ''}{money(low)}{p.variants[0].compare > low && <s>{money(p.variants[0].compare)}</s>}</span>{multi ? <Link className="pill solid sm" href={`/products/${p.handle}`}>Choose size</Link> : <AddToBag handle={p.handle} className="pill solid sm">{p.variants[0].available ? 'Add to Bag' : 'Sold out'}</AddToBag>}</div>
    </div>
  </article>;
}
export function ProductCatalogue() {
  const params = useSearchParams();
  const requested = params.get('category') || 'all';
  const [category, setCategory] = useState(categories.some(([key]) => key === requested) ? requested : 'all');
  const [concern, setConcern] = useState<Concern>('any');
  const [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { setCategory(categories.some(([key]) => key === requested) ? requested : 'all'); }, [requested]);
  useEffect(() => { if (window.location.hash === '#c-q') input.current?.focus(); }, []);
  const products = filterProducts(category, concern, query);
  useEffect(() => {
    if (query.trim().length < 3) return;
    const timer = setTimeout(() => emit('search', { search_term: query.trim().slice(0, 60), results: products.length }), 900);
    return () => clearTimeout(timer);
  }, [query, products.length]);
  return <section className="band grey" id="c-shop" aria-labelledby="c-shop-h"><div className="wrap">
    <div className="sec-intro"><h1 className="h-lg" id="c-shop-h">Shop the range.</h1><p>Nine products, three steps. Browse by step or by what your skin needs today.</p></div>
    <div className="controls"><div className="seg" role="group" aria-label="Filter by step">{categories.map(([key, title]) => <button key={key} aria-pressed={category === key} onClick={() => setCategory(key)}>{title}</button>)}</div>
      <div className="concerns" role="group" aria-label="Filter by skin concern"><span>Skin concern</span>{concerns.map(([key, title]) => <button key={key} aria-pressed={concern === key} onClick={() => setConcern(key)}>{title}</button>)}</div>
      <label className="search" htmlFor="c-q"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg><span className="sr">Search products</span><input ref={input} id="c-q" type="search" placeholder="Search ceramide, retinol, cleanser" value={query} onChange={event => setQuery(event.target.value)} /></label>
    </div>
    <div className="grid" aria-live="polite">{products.length ? products.map(p => <ProductCard key={p.handle} product={p} />) : <p className="empty">No products match these filters. Try “All” or another skin concern.</p>}</div>
  </div></section>;
}
