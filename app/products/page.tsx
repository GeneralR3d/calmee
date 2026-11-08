import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductCatalogue } from '@/components/product-catalogue';
export const metadata: Metadata = { title: 'Products', description: 'Explore all nine Calme products. Browse fragrance-free cleansers, serums, moisturisers, and kits by step or skin concern.' };
export default function ProductsPage() { return <Suspense fallback={<div className="wrap page-loading" role="status">Loading products…</div>}><ProductCatalogue /></Suspense>; }
