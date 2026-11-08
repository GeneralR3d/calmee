import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { posts } from '@/lib/blog';
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return posts.map(post => ({ slug: post.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find(p => p.slug === slug);
  return post ? { title: post.title, description: post.excerpt, openGraph: { title: `${post.title} | Calme`, description: post.excerpt, type: 'article', publishedTime: post.date, images: [{ url: post.image, alt: 'The Calme range' }] } } : { title: 'Article not found' };
}
export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = posts.find(p => p.slug === slug);
  if (!post) notFound();
  return <article className="band article-page"><div className="wrap"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/blog">Blog</Link><span aria-hidden="true">/</span><span>{post.title}</span></nav><header className="sec-intro"><p className="eyebrow">The Calme journal</p><h1 className="h-xl">{post.title}</h1><p className="article-date"><time dateTime={post.date}>8 November 2026</time> · {post.readingTime}</p></header><img className="article-image" src={post.image} alt="The Calme Barrier Reset Routine" width="1100" height="550" /><div className="article-body"><p className="article-lead">{post.excerpt}</p>{post.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<p className="article-placeholder muted">This is a placeholder article. More stories are coming soon.</p><div className="cta-row"><Link className="pill solid" href="/products">Explore the range</Link><Link className="pill" href="/#c-routine">Find your routine</Link></div></div></div></article>;
}
