export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  date: string;
  readingTime: string;
  body?: 'skincare-basics';
  paragraphs?: string[];
};

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
}

export const posts: BlogPost[] = [{
  slug: 'cleanser-serum-moisturiser-differences',
  title: 'Cleanser, Serum and Moisturiser: What’s the Difference?',
  excerpt: 'Learn how cleansers, serums and moisturisers differ, which steps sensitive skin needs, and how to build a gentle routine with Le Calme.',
  image: '/img/barrier-reset-routine.webp',
  imageAlt: 'Le Calme cleansing oil, cream cleanser, ceramide serum and moisturiser in the Barrier Reset Routine',
  date: '2026-11-09',
  readingTime: '6 min read',
  body: 'skincare-basics',
}, {
  slug: 'welcome-to-calme',
  title: 'Welcome to Le Calme',
  excerpt: 'A little less noise. A little more calm. Meet the home of our routine notes and everyday skincare stories.',
  image: '/img/hero-routine.webp',
  imageAlt: 'The Le Calme Barrier Reset Routine in frosted glass bottles',
  date: '2026-11-08',
  readingTime: '2 min read',
  paragraphs: [
    'Welcome to the Le Calme journal. This is a space for a slower approach to skincare: thoughtful routines, familiar ingredients, and small moments of care.',
    'Le Calme starts with a simple idea: keep the routine clear and leave room to listen to your skin. Our range brings together cleansers, serums, moisturisers, and a Discovery Kit for those who want to start small.',
    'In the coming weeks, we’ll share more about the people, products, and routines behind Le Calme. Until then, explore the range or try the Routine Finder to get to know us.',
  ],
}];
