import type { MetadataRoute } from 'next';
import { posts } from '@/lib/blog';
import { products } from '@/lib/products';
import { siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...['/', '/products', '/blog', '/sitemap'].map(path => ({ url: new URL(path, siteUrl).href })),
    ...products.map(product => ({ url: new URL(`/products/${product.handle}`, siteUrl).href })),
    ...posts.map(post => ({ url: new URL(`/blog/${post.slug}`, siteUrl).href, lastModified: `${post.date}T00:00:00+08:00` })),
  ];
}
