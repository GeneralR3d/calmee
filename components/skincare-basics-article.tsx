import Link from 'next/link';
import { byHandle } from '@/lib/products';

const featuredProducts = [
  { handle: 'barrier-cleansing-oil', role: 'An evening first cleanse', description: 'An oil cleanser with oat kernel oil, squalane and sunflower seed oil for removing sunscreen.' },
  { handle: 'gentle-cream-cleanser', role: 'Everyday cleansing', description: 'A cream cleanser with ceramides, glycerin and panthenol for daily cleansing without tightness.' },
  { handle: 'ceramide-recovery-serum', role: 'A little extra care', description: 'A serum with ceramides and 2% niacinamide for hydration and a softer skin feel.' },
  { handle: 'barrier-repair-cream', role: 'Daily moisture', description: 'A moisturiser with colloidal oatmeal, ceramides and squalane for dry-feeling, delicate skin.' },
];

export function SkincareBasicsArticle() {
  return <>
    <p>A cleanser washes away the day. A serum adds focused care. A moisturiser helps skin hold on to moisture. These products can share ingredients, but they have different jobs in a skincare routine. Understanding those jobs makes it easier to choose what you need, especially when your skin is sensitive.</p>

    <nav className="article-contents" aria-label="In this guide">
      <h2>In this guide</h2>
      <ul>
        <li><a href="#what-is-a-cleanser">What does a cleanser do?</a></li>
        <li><a href="#what-is-a-serum">How is a serum different?</a></li>
        <li><a href="#what-is-a-moisturiser">Why use a moisturiser?</a></li>
        <li><a href="#other-skincare-products">Toners, exfoliants, retinol and sunscreen</a></li>
        <li><a href="#skincare-routine-order">What order should you use them in?</a></li>
        <li><a href="#le-calme-sensitive-skin">Meet the Le Calme range</a></li>
      </ul>
    </nav>

    <section id="what-is-a-cleanser">
      <h2>What is a cleanser, and what does it do?</h2>
      <p>A cleanser removes surface oil, sweat, dirt and product residue. It is a rinse-off step: unlike a serum or cream, it is not meant to stay on your skin. Choose a texture that cleans comfortably rather than leaving your face feeling tight.</p>
      <h3>Cream cleanser vs cleansing oil</h3>
      <p>A cream cleanser is usually a water-based formula with a soft, creamy texture. It suits a straightforward daily wash. A cleansing oil helps loosen oil-based residue, including makeup and sunscreen, before you rinse it away.</p>
      <p>Using an oil cleanser followed by a water-based cleanser is called double cleansing. It can be useful in the evening when there is more to remove, but it is an option, not a requirement for everyone. Sensitive skin does not need extra washing just to complete a routine.</p>
      <p>Use lukewarm water, gentle fingertips and a soft towel to pat dry. The American Academy of Dermatology’s <a href="https://www.aad.org/public/everyday-care/skin-care-basics/care/face-washing-101">face-washing guide</a> explains this gentle approach.</p>
    </section>

    <section id="what-is-a-serum">
      <h2>What is a serum?</h2>
      <p>A serum is a leave-on product that adds focused care, often in a lightweight liquid or gel. Some serums focus on hydration; others are designed for concerns such as uneven texture. The word “serum” describes a product format, so the ingredients and directions matter more than the name alone.</p>
      <h3>Serum vs moisturiser: do you need both?</h3>
      <p>A hydrating serum can add a light layer of moisture, while a moisturiser provides a cream or lotion layer that helps limit moisture loss. They can work together, but a serum is optional. If a cleanser, moisturiser and daytime sunscreen already suit your skin, there is no need to add another step without a reason.</p>
      <p>If you choose one, start with a single serum and follow its directions. Hydrating ingredients such as glycerin and panthenol are different from exfoliating acids or retinol; two bottles labelled “serum” may need very different routines.</p>
    </section>

    <section id="what-is-a-moisturiser">
      <h2>What is a moisturiser?</h2>
      <p>A moisturiser helps keep skin hydrated and comfortable. Formulas commonly combine ingredients that attract water, soften the skin and reduce water loss. A lotion often feels lighter, while a cream usually has a richer texture. “Moisturizer” and “moisturiser” mean the same thing.</p>
      <h3>Choosing a moisturiser for sensitive skin</h3>
      <p>Look for a fragrance-free formula and a texture you enjoy using consistently. Ingredients such as glycerin, ceramides and squalane are common in moisturising products. No single ingredient guarantees that a formula will suit everyone, so pay attention to how the finished product feels on your skin.</p>
      <p>A serum does not automatically replace this step. If your skin feels dry after applying a serum, follow it with a moisturiser rather than layering more serums.</p>
    </section>

    <section id="other-skincare-products">
      <h2>What about toner, exfoliant, retinol and sunscreen?</h2>
      <h3>Toner and essence: optional light layers</h3>
      <p>Toners and essences are fluid, leave-on products usually applied after cleansing. Some hydrate; others contain exfoliating ingredients. They are optional, and a comfortable routine does not need one of every product type.</p>
      <h3>Exfoliant and retinol: targeted extras</h3>
      <p>An exfoliant helps remove dead surface skin cells. Retinol is a vitamin A ingredient used in products for texture and fine lines. Neither is a basic cleansing or moisturising step, and both can irritate sensitive skin. Only consider these extras once your everyday routine feels comfortable, introduce one at a time, and follow the product’s frequency and compatibility instructions.</p>
      <h3>Sunscreen: a separate daytime essential</h3>
      <p>Cleanser, serum and ordinary moisturiser do not provide sun protection. For daytime, choose a broad-spectrum, water-resistant sunscreen with SPF 30 or higher, apply it as directed, and use shade and protective clothing too. The <a href="https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-budget">AAD’s guide to a simple routine</a> covers cleansing, moisturising and sun protection.</p>
    </section>

    <section id="skincare-routine-order">
      <h2>What order should you use skincare products in?</h2>
      <p>The everyday pattern is cleanse, add any optional care, then moisturise. Finish your morning skincare with sunscreen. Always follow individual product directions if they specify a different application order.</p>
      <h3>A simple morning routine</h3>
      <ol>
        <li>Gently cleanse.</li>
        <li>Apply a hydrating serum if you use one.</li>
        <li>Apply moisturiser.</li>
        <li>Finish with sunscreen before makeup.</li>
      </ol>
      <h3>A simple evening routine</h3>
      <ol>
        <li>Remove makeup and sunscreen; use a cleansing oil first if needed.</li>
        <li>Use your gentle cleanser and rinse.</li>
        <li>Apply your chosen serum, if part of your routine.</li>
        <li>Finish with moisturiser.</li>
      </ol>
      <p>For sensitive skin, keep the number of new products small and test each on a small area before introducing it fully. If a product causes irritation, stop using it. Cleveland Clinic’s <a href="https://health.clevelandclinic.org/proper-skin-care-product-order">skincare layering guide</a> offers more detail on product order and optional steps.</p>
    </section>

    <section id="le-calme-sensitive-skin" className="article-range">
      <h2>Le Calme: the cleanse, care and moisturise range for sensitive skin</h2>
      <p>Le Calme brings these steps together in one considered range: cleansing oils and cream cleansers, hydrating serums, moisturisers and optional targeted treatments. Our focus is fragrance-free care for delicate, sensitive skin, with clear directions that help you choose a routine at your own pace.</p>
      <p>Start with the products that meet your everyday needs. Here are four ways to get to know the range.</p>
      <div className="article-products">
        {featuredProducts.map(({ handle, role, description }) => {
          const product = byHandle[handle];
          return <div className="article-product" key={handle}>
            <Link href={`/products/${handle}`} aria-label={`Explore ${product.title}`}>
              <img src={product.image} alt={`Le Calme ${product.title}`} width="800" height="800" loading="lazy" />
            </Link>
            <h3><Link href={`/products/${handle}`}>{product.title}</Link></h3>
            <p className="article-product-role">{role}</p>
            <p>{description}</p>
          </div>;
        })}
      </div>
      <h3>Choose a little more care, or start small</h3>
      <p>For hydration and everyday comfort, explore the <Link href="/products/centella-calming-serum">Centella Calming Serum</Link>. If you are considering an optional texture-focused step, read the directions for <Link href="/products/pha-gentle-exfoliant">PHA Gentle Exfoliant</Link> or <Link href="/products/night-renew-retinol">Night Renew Retinol 0.1%</Link> first. These are occasional additions, and they should not be used on the same night.</p>
      <p>The <Link href="/products/barrier-reset-routine">Barrier Reset Routine</Link> brings together the cleansing oil, cream cleanser, ceramide serum and moisturiser. Prefer to try smaller sizes? The <Link href="/products/discovery-kit">Discovery Kit</Link> introduces five minis from the range. Add your own daytime sunscreen; Le Calme does not currently offer one.</p>
      <p><Link href="/products">Explore the whole Le Calme range</Link> or use our <Link href="/#c-routine">Routine Finder</Link> to choose your starting point. A thoughtful routine can be simple: cleanse gently, add care when needed, and keep skin comfortably moisturised.</p>
    </section>
  </>;
}
