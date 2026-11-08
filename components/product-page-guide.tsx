import Link from 'next/link';
import styles from './product-page-guide.module.css';

export function ProductPageGuide() {
  return (
    <div className={styles.guide}>
      <section aria-labelledby="sensitive-skin-guide">
        <h2 id="sensitive-skin-guide">How to choose skincare for sensitive skin</h2>
        <p>
          Start with a gentle, fragrance-free formula and check the ingredient list for anything your skin reacts to.
          For water-based cleansers, look for a mildly acidic pH close to skin’s natural range of 4.5–5.5.
          Panthenol (pro-vitamin B5) can help hydrate and soothe, while ceramides, cholesterol and fatty acids
          help support the skin’s moisture barrier. Choose products without added perfume or fragrant essential
          oils, and introduce one new product at a time with a patch test first.
        </p>
      </section>
      <section aria-labelledby="skincare-range-guide">
        <h2 id="skincare-range-guide">Explore the Le Calme skincare range</h2>
        <p>
          Build your routine with Le Calme’s{' '}
          <Link href="/products?category=cleanse">oil and cream cleansers</Link>,{' '}
          <Link href="/products?category=treat">hydrating and calming serums</Link>, and{' '}
          <Link href="/products?category=moisturise">barrier-supporting moisturisers</Link>.
          Cleansers lift away daily buildup, serums offer targeted care, and moisturisers help keep skin hydrated.
          For a coordinated routine or a smaller introduction to the range, explore our{' '}
          <Link href="/products?category=sets">skincare sets and discovery kits</Link>.
          If you use a toner, choose a gentle, fragrance-free option as an optional step after cleansing.
        </p>
      </section>
    </div>
  );
}
