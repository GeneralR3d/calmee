import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products } from '@/lib/products';
import { ProductDetail } from '@/components/product-detail';
type Props = { params: Promise<{ handle: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return products.map(p => ({ handle: p.handle })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const p = products.find(product => product.handle === handle);
  if (!p) return { title: 'Product not found' };
  return { title: p.title, description: `${p.title}: ${p.short}. Gentle skincare for delicate skin. Fragrance-free care from Le Calme.`, openGraph: { title: `${p.title} | Le Calme`, description: p.short, images: [{ url: p.image, alt: p.title }] } };
}
export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = products.find(p => p.handle === handle);
  if (!product) notFound();
  return <ProductDetail key={product.handle} product={product} />;
}
