export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  date: string;
  readingTime: string;
  body?: 'skincare-basics' | 'ingredient-guide' | 'nighttime-routine';
  paragraphs?: string[];
};

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
}

export const posts: BlogPost[] = [{
  slug: 'nighttime-skincare-routine-order',
  title: 'Nighttime Skincare Routine: The Right Order for Each Step',
  excerpt: 'Learn the right nighttime skincare routine order, from cleansing to moisturising, with optional treatments and gentle choices for sensitive skin.',
  image: '/img/barrier-reset-routine.webp',
  imageAlt: 'Le Calme Barrier Cleansing Oil, Gentle Cream Cleanser, Ceramide Recovery Serum and Barrier Repair Cream',
  date: '2026-11-09',
  readingTime: '8 min read',
  body: 'nighttime-routine',
}, {
  slug: 'skincare-ingredients-ph-and-marketing-claims',
  title: 'Skincare Ingredients, pH and Claims: A Buyer’s Guide',
  excerpt: 'Understand skincare pH, panthenol, ceramides, cholesterol and fatty acids, plus how to spot misleading claims when shopping for sensitive skin.',
  image: '/img/ceramide-recovery-serum.webp',
  imageAlt: 'Le Calme Ceramide Recovery Serum, a skincare product with ceramides, cholesterol and fatty acids',
  date: '2026-11-09',
  readingTime: '8 min read',
  body: 'ingredient-guide',
}, {
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
