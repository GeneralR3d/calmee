import { redirect } from 'next/navigation';
import { products } from '@/lib/products';
import { Intro } from '@/components/intro';
import { Hero } from '@/components/hero';
import { FeaturedProducts } from '@/components/featured-products';
import { ScienceSection } from '@/components/science-section';
import { RoutineFinder } from '@/components/routine-finder';
import { PromiseSection } from '@/components/promise-section';
import { FaqSection } from '@/components/faq-section';

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  if (typeof params.p === 'string' && products.some(p => p.handle === params.p)) {
    const rest = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) if (key !== 'p') {
      if (Array.isArray(value)) value.forEach(v => rest.append(key, v));
      else if (value) rest.set(key, value);
    }
    redirect(`/products/${params.p}${rest.size ? `?${rest}` : ''}`);
  }
  return <><Intro /><Hero /><FeaturedProducts /><ScienceSection /><RoutineFinder /><PromiseSection /><FaqSection /></>;
}
