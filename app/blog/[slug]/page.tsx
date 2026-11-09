import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatPostDate, posts } from '@/lib/blog';
import { SkincareBasicsArticle } from '@/components/skincare-basics-article';
import { SkincareIngredientsArticle } from '@/components/skincare-ingredients-article';
import { siteUrl } from '@/lib/site';
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return posts.map(post => ({ slug: post.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find(p => p.slug === slug);
  if (!post) return { title: 'Article not found' };
  const url = new URL(`/blog/${post.slug}`, siteUrl).href;
  const image = new URL(post.image, siteUrl).href;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: { title: `${post.title} | Le Calme`, description: post.excerpt, url, type: 'article', publishedTime: `${post.date}T00:00:00+08:00`, images: [{ url: image, alt: post.imageAlt }] },
    twitter: { card: 'summary_large_image', title: `${post.title} | Le Calme`, description: post.excerpt, images: [{ url: image, alt: post.imageAlt }] },
  };
}
export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = posts.find(p => p.slug === slug);
  if (!post) notFound();
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: new URL(post.image, siteUrl).href,
    datePublished: `${post.date}T00:00:00+08:00`,
    author: { '@type': 'Organization', name: 'Le Calme', url: siteUrl },
    publisher: { '@type': 'Organization', name: 'Le Calme', url: siteUrl },
    mainEntityOfPage: new URL(`/blog/${post.slug}`, siteUrl).href,
  };
  return <article className="band article-page"><div className="wrap">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/blog">Blog</Link><span aria-hidden="true">/</span><span>{post.title}</span></nav>
    <header className="sec-intro"><p className="eyebrow">The Le Calme journal</p><h1 className="h-xl">{post.title}</h1><p className="article-date"><time dateTime={post.date}>{formatPostDate(post.date)}</time> · {post.readingTime}</p></header>
    <img className="article-image" src={post.image} alt={post.imageAlt} width="1100" height="550" />
    <div className="article-body"><p className="article-lead">{post.excerpt}</p>
      {post.body === 'ingredient-guide' ? <SkincareIngredientsArticle /> : post.body === 'skincare-basics' ? <SkincareBasicsArticle /> : <>
        {post.paragraphs?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        <div className="cta-row"><Link className="pill solid" href="/products">Explore the range</Link><Link className="pill" href="/#c-routine">Find your routine</Link></div>
      </>}
    </div>
  </div></article>;
}
