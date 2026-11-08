"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { addItems, cartLines, changeQuantity, sanitiseCart, totals, type CartItem } from '@/lib/cart';
import { config } from '@/lib/config';
import { byVariant } from '@/lib/products';
import { emit, getAnalytics, productEvent } from '@/lib/analytics';
import { readStorage, writeStorage } from '@/lib/storage';
import { WhatsAppSupport } from './whatsapp-support';

type Consent = 'all' | 'necessary' | null;
type AnalyticsState = { consent: Consent; askConsent: boolean; showInspector: boolean; linkCode: string; campaign: Record<string, string>; log: { name: string; status: string }[] };
type Store = {
  items: CartItem[]; ready: boolean; count: number;
  add: (items: CartItem[], message?: string) => void;
  update: (id: string, qty: number) => void;
  clear: () => void; toast: (message: string, viewBag?: boolean) => void;
  palette: string; setPalette: (value: string) => void;
  analytics: AnalyticsState; openCookies: () => void; openPrivacy: () => void;
};
const StoreContext = createContext<Store | null>(null);
export const palettes = [
  { key: 'slate', name: 'Slate', title: 'Slate blue', colors: ['#7FA3C9', '#2F5C8A'] },
  { key: 'sage', name: 'Sage', title: 'Sage calm', colors: ['#82AD96', '#3E6B5A'] },
  { key: 'oat', name: 'Oat', title: 'Oat and clay', colors: ['#C99A72', '#8E5338'] },
  { key: 'dusk', name: 'Dusk', title: 'Dusk lilac', colors: ['#8F94CF', '#4F5596'] },
  { key: 'luxe', name: 'Luxury', title: 'Quiet Luxury', colors: ['#B7C9DD', '#5B6E86'] },
  { key: 'minimal', name: 'Minimal', title: 'Modern Minimal', colors: ['#C1D8E8', '#3A2F28'] },
  { key: 'editorial', name: 'Editorial', title: 'Soft Editorial', colors: ['#D9C9B6', '#6B4F3F'] },
];
const emptyAnalytics: AnalyticsState = { consent: null, askConsent: false, showInspector: false, linkCode: '', campaign: {}, log: [] };

export function StoreProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [palette, setPaletteState] = useState(config.palette);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [cookieOpen, setCookieOpen] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsState>(emptyAnalytics);
  const [notification, setNotification] = useState<{ message: string; viewBag: boolean } | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const privacy = useRef<HTMLDialogElement>(null);
  const consentBanner = useRef<HTMLDivElement>(null);
  const toastElement = useRef<HTMLDivElement>(null);
  const [supportClearance, setSupportClearance] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setItems(sanitiseCart(readStorage('calme-demo-cart')));
    const storedPalette = readStorage('calme-palette');
    if (config.paletteSwitcher && palettes.some(p => p.key === storedPalette)) setPaletteState(storedPalette as string);
    setReady(true);
    const syncCart = (event: StorageEvent) => {
      if (event.key === 'calme-demo-cart') setItems(sanitiseCart(readStorage('calme-demo-cart')));
    };
    window.addEventListener('storage', syncCart);
    const runtime = getAnalytics();
    const unsubscribe = runtime?.subscribe((state: AnalyticsState) => setAnalytics(state));
    return () => { window.removeEventListener('storage', syncCart); unsubscribe?.(); if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, []);

  useEffect(() => { if (ready) writeStorage('calme-demo-cart', items); }, [items, ready]);
  useEffect(() => {
    document.getElementById('calme')?.dispatchEvent(new CustomEvent('calme:palette', { detail: palette }));
    if (ready) writeStorage('calme-palette', palette);
  }, [palette, ready]);
  useEffect(() => {
    const runtime = getAnalytics();
    runtime?.captureLocation();
    emit('page_view', { page_location: window.location.href, page_path: pathname });
    const root = document.getElementById('calme');
    const onIntro = () => emit('intro_complete');
    root?.addEventListener('calme:intro', onIntro);
    return () => root?.removeEventListener('calme:intro', onIntro);
  }, [pathname]);

  const toast = useCallback((message: string, viewBag = false) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setNotification({ message, viewBag });
    toastTimer.current = setTimeout(() => setNotification(null), 4000);
  }, []);
  const add = useCallback((additions: CartItem[], message = 'Added to bag') => {
    const available = sanitiseCart(additions).filter(item => byVariant[item.id].variant.available);
    if (!available.length) return;
    setItems(current => addItems(current, available));
    toast(message, true);
    const eventItems = available.flatMap(item => productEvent(byVariant[item.id].product, byVariant[item.id].variant, item.qty).items);
    emit('add_to_cart', { currency: 'SGD', value: eventItems.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0), items: eventItems });
  }, [toast]);
  const update = useCallback((id: string, qty: number) => setItems(current => changeQuantity(current, id, qty)), []);
  const clear = useCallback(() => setItems([]), []);
  const count = totals(items).count;
  const selectedPalette = palettes.find(p => p.key === palette) || palettes[0];
  const gradient = (colors: string[]) => `linear-gradient(90deg,${colors[0]} 50%,${colors[1]} 50%)`;
  const chooseConsent = (value: 'all' | 'necessary') => { getAnalytics()?.setConsent(value); setCookieOpen(false); };
  const consentVisible = cookieOpen || (analytics.askConsent && !analytics.consent);

  useEffect(() => {
    const overlays = [consentVisible ? consentBanner.current : null, notification ? toastElement.current : null].filter((element): element is HTMLDivElement => !!element);
    const measure = () => setSupportClearance(Math.max(0, ...overlays.map(element => element.offsetHeight + parseFloat(getComputedStyle(element).bottom) + 12)));
    measure();
    const observer = new ResizeObserver(measure);
    overlays.forEach(element => observer.observe(element));
    window.addEventListener('resize', measure);
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); };
  }, [consentVisible, notification]);

  return <StoreContext.Provider value={{ items, ready, count, add, update, clear, toast, palette, setPalette: setPaletteState, analytics, openCookies: () => setCookieOpen(true), openPrivacy: () => privacy.current?.showModal() }}>
    <div className="calme" id="calme" data-palette={palette}>
      {children}
      <div className="support-dock" style={{ '--support-clearance': `${supportClearance}px` } as CSSProperties}>
      {config.paletteSwitcher && <aside className={`palette${paletteOpen ? ' open' : ''}`} aria-label="Colour scheme demo">
        <button className="pal-toggle" aria-label="Try a colour scheme" aria-expanded={paletteOpen} aria-controls="c-pal-opts" onClick={() => setPaletteOpen(!paletteOpen)}><i style={{ background: gradient(selectedPalette.colors) }} /><span>Colours</span></button>
        <div className="pal-opts" id="c-pal-opts" role="group" aria-label="Colour schemes" inert={!paletteOpen}>
          {palettes.map(p => <button key={p.key} title={p.title} aria-label={p.title} aria-pressed={palette === p.key} onClick={() => { setPaletteState(p.key); setPaletteOpen(false); }}><i style={{ background: gradient(p.colors) }} /><span>{p.name}</span></button>)}
        </div>
      </aside>}
      </div>
      <div className="support-dock whatsapp-dock" style={{ '--support-clearance': `${supportClearance}px` } as CSSProperties}>
      <WhatsAppSupport />
      </div>
      {consentVisible && <div ref={consentBanner} className="consent" role="region" aria-label="Cookie choices">
        <p>We use cookies to keep your bag and, with your permission, to measure our ads on Instagram, Facebook and TikTok. <PrivacyButton>Privacy notice</PrivacyButton></p>
        <div className="consent-btns"><button className="pill sm" onClick={() => chooseConsent('necessary')}>Necessary only</button><button className="pill solid sm" onClick={() => chooseConsent('all')}>Accept all</button></div>
      </div>}
      <dialog ref={privacy} aria-labelledby="privacy-heading" onClick={e => { if (e.target === e.currentTarget) privacy.current?.close(); }}>
        <div className="privacy"><button className="x" aria-label="Close privacy notice" onClick={() => privacy.current?.close()}>×</button>
          <h2 id="privacy-heading">Privacy notice</h2>
          <p>Le Calme follows Singapore&apos;s Personal Data Protection Act (PDPA). This notice explains what we collect and why.</p>
          <h3>What we collect</h3>
          <ul><li><b>Orders:</b> on a live store, your name, email, phone and address are used to deliver and support your order. This demo does not send order details or process payments.</li><li><b>Newsletter:</b> your email, only if you subscribe. This demo shows a confirmation without sending a subscription.</li><li><b>Cookies:</b> necessary browser storage keeps your bag. With your permission, advertising pixels from Meta, TikTok, Google and Pinterest can measure ads when configured.</li></ul>
          <h3>Your choices</h3><p>You can accept or refuse advertising cookies, and change your mind at any time with &quot;Cookie choices&quot; in the footer. To access, correct or delete your data, or to withdraw consent, email our Data Protection Officer at privacy@calme.example.</p>
          <p className="muted">Demo notice: replace the contact address and review this text before going live.</p>
        </div>
      </dialog>
      {analytics.showInspector && <aside className="px" aria-label="Pixel event inspector"><button className="px-toggle" aria-expanded={inspectorOpen} onClick={() => setInspectorOpen(!inspectorOpen)}><b>Pixel events</b> <span>{analytics.log.length}</span></button>{inspectorOpen && <div className="px-log"><p className="px-head">What this page sends to ad platforms.</p><ol>{analytics.log.map((event, index) => <li key={index}><b>{event.name}</b><span className="px-st">{event.status}</span></li>)}</ol></div>}</aside>}
      <div ref={toastElement} className={`toast${notification ? ' on' : ''}`} role="status" aria-live="polite"><span>{notification?.message}</span>{notification?.viewBag && <Link href="/cart" onClick={() => setNotification(null)}>View bag</Link>}</div>
    </div>
  </StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error('StoreProvider is required');
  return store;
}
export function PrivacyButton({ children }: { children: ReactNode }) { const { openPrivacy } = useStore(); return <button className="link-btn" type="button" onClick={openPrivacy}>{children}</button>; }
export function CookieButton({ children }: { children: ReactNode }) { const { openCookies } = useStore(); return <button className="link-btn" type="button" onClick={openCookies}>{children}</button>; }

export function AddToBag({ handle, children = 'Buy', className = 'pill solid' }: { handle: string; children?: ReactNode; className?: string }) {
  const { add, ready } = useStore();
  const product = Object.values(byVariant).find(hit => hit.product.handle === handle)?.product;
  if (!product) return null;
  const variant = product.variants[0];
  return <button className={className} disabled={!ready || !variant.available} onClick={() => add([{ id: variant.id, qty: 1 }], `${product.title} added to bag`)}>{children}</button>;
}

export function CheckoutLink() {
  const { items } = useStore();
  return <Link className="pill solid" href="/checkout" onClick={() => {
    const lines = cartLines(items);
    emit('begin_checkout', { currency: 'SGD', value: totals(items).subtotal / 100, items: lines.flatMap(l => productEvent(l.product, l.variant, l.qty).items) });
  }}>Check Out</Link>;
}
