"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useStore } from './store-provider';

const links = [ ['Products', '/products'], ['Blog', '/blog'], ['Routine Finder', '/#c-routine'], ['Science', '/#c-science'], ['Support', '/#c-faq'] ];
export function Header() {
  const pathname = usePathname();
  const { count, analytics } = useStore();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  return <>
    <aside className="ribbon" aria-label="Offers"><p className="wrap">{analytics.linkCode ? <>Code <b>{analytics.linkCode}</b> is saved and will be applied at checkout. Free delivery over S$60.</> : <>Free delivery on orders over S$60. Try the Discovery Kit for S$19 and get S$19 back. <Link href="/products/discovery-kit">Shop the kit</Link></>}</p></aside>
    <header className="hdr"><div className="wrap hdr-in">
      <Link className="logo" href="/" aria-label="Calme home" onClick={() => setOpen(false)}>CALME</Link>
      <nav className={`nav${open ? ' open' : ''}`} id="c-nav" aria-label="Main">{links.map(([label, href]) => <Link key={href} href={href} aria-current={href === pathname ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</Link>)}</nav>
      <div className="hdr-right">
        <Link className="icon-btn" href="/products#c-q" aria-label="Search products" onClick={() => setOpen(false)}><svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg></Link>
        <Link className="icon-btn" href="/cart" aria-label={`Open bag, ${count} items`} onClick={() => setOpen(false)}><svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M5 8h14l-1 12H6z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg><span className="count">{count}</span></Link>
        <button className="icon-btn menu-btn" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="c-nav" onClick={() => setOpen(!open)}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 9h16M4 15h16" /></svg></button>
      </div>
    </div></header>
  </>;
}
