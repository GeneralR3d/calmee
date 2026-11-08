import type { Metadata, Viewport } from 'next';
import { type ReactNode } from 'react';
import { StoreProvider } from '@/components/store-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Calme Skincare', template: '%s | Calme' },
  description: 'Calme: fragrance-free, barrier-first skincare for eczema-prone skin in Singapore.',
  openGraph: { siteName: 'Calme', type: 'website', title: 'Calme | Fragrance-free skincare for eczema-prone skin', description: "Barrier-first cleansers, serums and moisturisers made for Singapore's heat.", images: [{ url: '/img/hero-routine.webp', alt: 'The Calme Barrier Reset Routine' }] },
  twitter: { card: 'summary_large_image' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" data-scroll-behavior="smooth"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" /></head><body><StoreProvider><a className="skip-content" href="#c-main">Skip to content</a><Header /><main id="c-main">{children}</main><Footer /></StoreProvider></body></html>;
}
