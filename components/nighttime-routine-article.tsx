import Link from 'next/link';
import { byHandle } from '@/lib/products';

const eveningProducts = [
  { handle: 'barrier-cleansing-oil', role: 'Remove the day', description: 'Oat kernel oil, squalane and sunflower seed oil in a rinse-off first cleanse.' },
  { handle: 'gentle-cream-cleanser', role: 'Cleanse gently', description: 'A creamy daily wash with glycerin, panthenol and ceramides NP, AP and EOP.' },
  { handle: 'ceramide-recovery-serum', role: 'Add hydration', description: 'Ceramides, cholesterol, free fatty acids and 2% niacinamide for a softer skin feel.' },
  { handle: 'barrier-repair-cream', role: 'Finish with moisture', description: 'Colloidal oatmeal, ceramides, shea butter and squalane for dry-feeling, delicate skin.' },
];

export function NighttimeRoutineArticle() {
  return <>
    <p>A proper evening routine removes the day’s sunscreen and makeup, leaves skin clean, and finishes with moisture. It does not have to mean seven products every night. For sensitive skin, a gentle cleanser and a comfortable moisturiser are a useful starting point; everything else should earn its place.</p>
    <p>This guide walks through the full nighttime skincare order, including where optional products fit. Follow your own product labels and any prescribed treatment instructions before a general layering rule.</p>

    <nav className="article-contents" aria-label="In this guide">
      <h2>Your evening routine, in order</h2>
      <ol>
        <li><a href="#night-oil-cleanse">Remove makeup and sunscreen, if needed</a></li>
        <li><a href="#night-gentle-cleanse">Wash with a gentle cleanser</a></li>
        <li><a href="#night-exfoliation">Exfoliate only on selected nights</a></li>
        <li><a href="#night-toner">Use toner or essence, if you want one</a></li>
        <li><a href="#night-serum">Apply a hydrating serum</a></li>
        <li><a href="#night-retinol">Add retinol only on its own treatment nights</a></li>
        <li><a href="#night-moisturiser">Finish with moisturiser</a></li>
      </ol>
      <ul>
        <li><a href="#night-extras">Where eye cream, masks and facial oils fit</a></li>
        <li><a href="#night-sensitive-skin">A simple plan for sensitive skin</a></li>
        <li><a href="#night-routine-questions">Common nighttime skincare questions</a></li>
        <li><a href="#night-calme-range">Build your evening routine with Le Calme</a></li>
      </ul>
    </nav>

    <section id="night-oil-cleanse">
      <h2>1. Remove makeup and sunscreen when needed</h2>
      <p>If you have worn makeup or water-resistant sunscreen, begin by loosening that layer with a suitable remover or cleansing oil. Use gentle movements rather than scrubbing. For eye makeup, choose a remover labelled for the eye area and follow its directions.</p>
      <h3>How to use a cleansing oil</h3>
      <p>With clean hands, massage the oil onto dry skin. Add lukewarm water to turn it milky, then rinse thoroughly. A cleansing oil is a wash-off product, so it belongs at the beginning of the routine, rather than over your night cream.</p>
      <p>Le Calme’s <Link href="/products/barrier-cleansing-oil">Barrier Cleansing Oil</Link> uses oat kernel oil, squalane and sunflower seed oil. Its evening directions are two pumps on dry skin for 60 seconds, then water to emulsify and a rinse, followed by the cream cleanser.</p>
      <p>This two-cleanser method is called double cleansing. Use it when you need the extra removal step; on a lighter day, one thorough, gentle cleanse may be enough.</p>
    </section>

    <section id="night-gentle-cleanse">
      <h2>2. Wash with a gentle cleanser</h2>
      <p>A water-based cleanser washes away daily grime and any remaining residue. Apply it with your fingertips, rinse with lukewarm water, and pat gently with a soft towel. Skin should feel comfortable afterwards; a tight, squeaky feeling is not a goal.</p>
      <h3>Keep the wash gentle</h3>
      <p>Avoid hot water, rough washcloths and cleansing brushes if they leave your skin irritated. The American Academy of Dermatology’s <a href="https://www.aad.org/public/everyday-care/skin-care-basics/care/face-washing-101">face-washing advice</a> favours a gentle cleanser, fingertips and a soft pat dry.</p>
      <p>The <Link href="/products/gentle-cream-cleanser">Gentle Cream Cleanser</Link> is Calme’s everyday option, with glycerin, panthenol and ceramides. Massage it onto damp skin for 30–60 seconds, then rinse. It can be your only cleanser or the second step after cleansing oil.</p>
    </section>

    <section id="night-exfoliation">
      <h2>3. Exfoliate on selected nights, if appropriate</h2>
      <p>Exfoliation is an occasional treatment for surface texture, not a nightly requirement. Sensitive skin may be more comfortable without it. Skip this step when skin is sore, irritated or already reacting to another product.</p>
      <h3>Where a leave-on exfoliant goes</h3>
      <p>For Calme’s <Link href="/products/pha-gentle-exfoliant">PHA Gentle Exfoliant</Link>, the place is after cleansing, on clean, dry skin. It contains 5% gluconolactone and 2% lactobionic acid, both polyhydroxy acids, alongside allantoin. Its label specifies evening use two to three times a week only when skin is calm; that is not a frequency everyone needs to reach.</p>
      <p>Follow with hydration and moisturiser. Never use this exfoliant on the same night as Calme’s Night Renew Retinol, and do not add a scrub or another acid just to make the treatment stronger. The AAD’s <a href="https://www.aad.org/public/everyday-care/skin-care-secrets/routine/safely-exfoliate-at-home">guide to safer exfoliation</a> explains why skin type and existing treatments matter.</p>
    </section>

    <section id="night-toner">
      <h2>4. Add toner or essence only if it helps</h2>
      <p>A hydrating toner or essence usually goes after cleansing and before serum. It is optional: you do not need one to make your routine complete. If your toner contains exfoliating acids, count it as an exfoliating treatment rather than an extra hydration step.</p>
      <h3>You can go straight to serum</h3>
      <p>Calme does not currently make a dedicated toner or essence. Its <Link href="/products/centella-calming-serum">Centella Calming Serum</Link> offers a lightweight hydration option at the next step, so there is no need to buy a separate toner simply to fill a gap in the order.</p>
    </section>

    <section id="night-serum">
      <h2>5. Apply a hydrating serum, if needed</h2>
      <p>A serum can add focused hydration before your cream. Choose one based on how your skin feels rather than layering several by default. In a simple routine without exfoliant or retinol, a hydrating serum can be applied to slightly damp skin, followed promptly by moisturiser.</p>
      <h3>Choose one comfortable layer</h3>
      <p>The <Link href="/products/ceramide-recovery-serum">Ceramide Recovery Serum</Link> combines ceramides, cholesterol, free fatty acids and 2% niacinamide. Its directions are three to four drops pressed into damp skin after cleansing, then moisturiser straight away.</p>
      <p>For another hydration option, <Link href="/products/centella-calming-serum">Centella Calming Serum</Link> contains centella, 5% panthenol and beta-glucan. Pat three to four drops onto clean skin. You can choose either serum; using both is not a requirement. On treatment nights, respect the exfoliant’s dry-skin directions first and let skin dry before retinol.</p>
    </section>

    <section id="night-retinol">
      <h2>6. Use retinol only on separate treatment nights</h2>
      <p>Retinol is an optional vitamin A treatment used for concerns such as texture and fine lines. It can cause dryness and irritation, so it is a step to consider only after your basic routine feels settled. Sensitive skin does not need retinol to have a good evening routine.</p>
      <h3>Follow the formula’s specific order</h3>
      <p>Calme’s <Link href="/products/night-renew-retinol">Night Renew Retinol 0.1%</Link> contains encapsulated retinol, bakuchiol, ceramide NP and squalane. Its directions place a pea-sized amount after serum and before moisturiser, twice a week to start, only when skin is calm. Let skin dry before applying, and avoid the eyelids and lips.</p>
      <p>Never pair it with PHA Gentle Exfoliant on the same night. Leave other evenings for a simple hydrating routine, stop if irritation develops, and use sunscreen daily. This product is not for use during pregnancy. If you use prescription skin treatments, ask your prescriber how to fit cosmetic treatments around them.</p>
    </section>

    <section id="night-moisturiser">
      <h2>7. Finish with a comfortable moisturiser</h2>
      <p>Moisturiser is the final core step. It helps limit moisture loss and leaves skin feeling softer. A richer cream may suit dry-feeling skin, while the best amount is the one that feels comfortable rather than heavy.</p>
      <h3>Keep moisture at the centre of the routine</h3>
      <p>Calme’s <Link href="/products/barrier-repair-cream">Barrier Repair Cream</Link> combines 1% colloidal oatmeal, ceramides, shea butter and squalane. Smooth it over the face and dry patches. On a simple cleansing-and-hydration night, apply it while skin is still slightly damp; if you are using a treatment that needs dry skin, follow those directions first and moisturise afterwards.</p>
      <p>You do not need a separate product labelled “night cream” if your everyday moisturiser already suits you. In the Calme routine, Barrier Repair Cream serves both morning and evening.</p>
    </section>

    <section id="night-extras">
      <h2>Where do eye cream, masks and facial oils fit?</h2>
      <h3>Eye cream and lip care</h3>
      <p>A dedicated eye cream is optional. If you use one, follow its label; many fit before face moisturiser. Keep exfoliants and retinol away from the eyelids unless specifically labelled for that area. Lip balm can go on at the end. Calme currently has neither a dedicated eye cream nor a lip balm, so there is no matching product to add for these steps.</p>
      <h3>Face masks, leave-on oils and heavier layers</h3>
      <p>A rinse-off mask generally belongs after cleansing, while a hydrating sheet mask usually goes before moisturiser; the mask’s instructions decide. Skip extra exfoliating masks on treatment nights. A leave-on facial oil or targeted occlusive layer may go after cream when its directions allow, but neither is essential.</p>
      <p>Calme’s <Link href="/products/barrier-repair-cream">Barrier Repair Cream</Link> is already the finishing moisture step in its range. Do not substitute <Link href="/products/barrier-cleansing-oil">Barrier Cleansing Oil</Link> for a leave-on facial oil: it is designed to be rinsed away.</p>
    </section>

    <section id="night-sensitive-skin">
      <h2>A simple nighttime routine for sensitive skin</h2>
      <p>Start with the shortest routine that feels comfortable, then introduce only one new product at a time. Test a new formula on a small area before full use. Fragrance-free products can be a useful choice, but no formula suits every person.</p>
      <h3>Your everyday evening</h3>
      <p><Link href="/products/gentle-cream-cleanser">Gentle Cream Cleanser</Link> → optional <Link href="/products/ceramide-recovery-serum">Ceramide Recovery Serum</Link> or <Link href="/products/centella-calming-serum">Centella Calming Serum</Link> → <Link href="/products/barrier-repair-cream">Barrier Repair Cream</Link>. Add Barrier Cleansing Oil before the cleanser when you need help removing sunscreen or makeup.</p>
      <h3>Your occasional treatment evening</h3>
      <p>For an exfoliation night: cleanse → PHA on dry skin → optional hydration → cream. For a retinol night: cleanse → optional serum → let skin dry → retinol → cream. Choose one treatment, and keep evenings between treatments simple. These are alternatives, not a schedule you must work up to.</p>
      <p>If a product causes irritation, stop using it. Persistent discomfort is a reason to seek advice from a dermatologist rather than add more layers.</p>
    </section>

    <section id="night-routine-questions">
      <h2>Common nighttime skincare questions</h2>
      <h3>Do I need to wait between every skincare step?</h3>
      <p>There is no universal timer for the whole routine. Follow each product’s instructions, allow dry-skin treatments the conditions they need, and avoid letting your face dry out while waiting between ordinary hydration layers. Calme’s Ceramide Recovery Serum is intended to be followed promptly with moisturiser.</p>
      <h3>Should I apply sunscreen before bed?</h3>
      <p>Sunscreen belongs in your daytime routine rather than your bedtime steps. The next morning, use broad-spectrum, water-resistant SPF 30 or higher as directed, alongside shade and protective clothing. Calme does not currently offer sunscreen, so choose a separate one that suits your skin. See the AAD’s <a href="https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-budget">simple skincare guidance</a> for the daily essentials.</p>
      <h3>Is a longer evening routine better?</h3>
      <p>More steps are not automatically more helpful. If cleansing and Barrier Repair Cream leave your skin comfortable, that is a complete starting point. Add a serum or treatment for a clear reason, and read our <Link href="/blog/cleanser-serum-moisturiser-differences">guide to cleansers, serums and moisturisers</Link> if you want to compare their roles.</p>
    </section>

    <section id="night-calme-range" className="article-range">
      <h2>Build a calmer evening with the Le Calme range</h2>
      <p>If you are looking for a considered place to begin, we recommend exploring Le Calme’s full line, especially if your skin is sensitive or easily feels dry. Our fragrance-free cleansers, hydrating serums and moisturiser bring the core evening steps together, with optional treatments to consider only when your skin is comfortable.</p>
      <div className="article-products">
        {eveningProducts.map(({ handle, role, description }) => {
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
      <h3>Start with a set, or choose your own steps</h3>
      <p>The <Link href="/products/barrier-reset-routine">Barrier Reset Routine</Link> brings together the cleansing oil, cream cleanser, ceramide serum and cream in a four-piece set. For smaller sizes, the <Link href="/products/discovery-kit">Discovery Kit</Link> includes those four products plus Centella Calming Serum, so you can get to know the textures and introduce them gradually.</p>
      <p>Across the rest of the range, <Link href="/products/centella-calming-serum">Centella Calming Serum</Link> offers another hydration choice, while <Link href="/products/pha-gentle-exfoliant">PHA Gentle Exfoliant</Link> and <Link href="/products/night-renew-retinol">Night Renew Retinol 0.1%</Link> are optional additions for separate evenings. Exploring the full line does not mean using every product in one routine.</p>
      <p><Link href="/products">Explore the entire Le Calme range</Link> to find your everyday essentials, or try the <Link href="/#c-routine">Routine Finder</Link> for a starting point. Begin with gentle cleansing and moisture, then let your skin’s comfort guide the rest.</p>
    </section>
  </>;
}
