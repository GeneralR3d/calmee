import type { Metadata } from 'next';
import Link from 'next/link';
import { formatPostDate, posts } from '@/lib/blog';
export const metadata: Metadata = { title: 'Blog', description: 'Routine notes, product stories, and a little everyday calm from Le Calme.' };
export default function BlogPage() {
  return <section className="band grey blog-page"><div className="wrap"><div className="sec-intro"><p className="eyebrow">The Le Calme journal</p><h1 className="h-lg">A little more calm.</h1><p>Routine notes, product stories, and everyday care.</p></div><div className="blog-list">{posts.map(post => <article className="blog-preview" key={post.slug}><Link className="blog-image" href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}><img src={post.image} alt={post.imageAlt} width="1100" height="550" loading="lazy" /></Link><div className="blog-copy"><p className="meta"><time dateTime={post.date}>{formatPostDate(post.date)}</time> · {post.readingTime}</p><h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p className="muted">{post.excerpt}</p><Link className="link" href={`/blog/${post.slug}`}>Read the story</Link></div></article>)}</div></div></section>;
}
