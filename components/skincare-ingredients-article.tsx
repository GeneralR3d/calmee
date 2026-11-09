import Link from 'next/link';
import { byHandle } from '@/lib/products';

const ingredientProducts = [
  { handle: 'gentle-cream-cleanser', description: 'Ceramides, glycerin and panthenol in a daily rinse-off cleanser.' },
  { handle: 'centella-calming-serum', description: '5% panthenol alongside centella and beta-glucan for hydration and everyday comfort.' },
  { handle: 'ceramide-recovery-serum', description: 'Ceramides NP, AP and EOP, cholesterol, free fatty acids and 2% niacinamide.' },
  { handle: 'barrier-repair-cream', description: 'Ceramides, colloidal oatmeal, shea butter and squalane for dry-feeling, delicate skin.' },
];

export function SkincareIngredientsArticle() {
  return <>
    <p>A good skincare purchase starts with two questions: what does this formula do, and what evidence supports the claim? Ingredient names can help you choose, but a hero ingredient, an impressive percentage or a scientific-sounding label cannot tell the whole story. Here is a practical guide to the ingredients and claims you are likely to meet, especially when shopping for sensitive skin.</p>

    <nav className="article-contents" aria-label="In this guide">
      <h2>In this guide</h2>
      <ul>
        <li><a href="#reading-ingredient-labels">How to read an ingredient list</a></li>
        <li><a href="#skincare-ph">What pH range should you look for?</a></li>
        <li><a href="#panthenol-b5">Panthenol and hydration ingredients</a></li>
        <li><a href="#ceramides-cholesterol-fatty-acids">Ceramides, cholesterol and fatty acids</a></li>
        <li><a href="#misleading-skincare-claims">Marketing claims worth questioning</a></li>
        <li><a href="#skincare-buying-checklist">A simple buying checklist</a></li>
        <li><a href="#le-calme-ingredients">Explore ingredients in the Le Calme range</a></li>
      </ul>
    </nav>

    <section id="reading-ingredient-labels">
      <h2>How to read a skincare ingredient list</h2>
      <p>Start with the full ingredient list on the current packaging, rather than a short list of “key ingredients” in an advert. The full list uses standard ingredient names, often called INCI names, to identify what is in the formula.</p>
      <h3>Ingredient order is a clue, not a concentration chart</h3>
      <p>In Singapore, ingredients are generally listed in descending order by weight; those below 1% may appear in any order after the higher-concentration ingredients. HSA explains this in its <a href="https://www.hsa.gov.sg/cosmetic-products/overview/">cosmetic labelling requirements</a>. You cannot work out exact percentages from position alone.</p>
      <p>An ingredient near the end is not automatically ineffective: some ingredients are used at low levels. Equally, putting an ingredient near the top does not prove a product works better. Check whether a stated percentage describes the ingredient itself or a supplier blend containing it; “10% complex” need not mean 10% of the named active ingredient.</p>
    </section>

    <section id="skincare-ph">
      <h2>What is the optimal pH range for skincare?</h2>
      <p>pH measures how acidic or alkaline a water-based system is. A pH of 7 is neutral; lower values are acidic and higher values are alkaline. The skin surface is naturally mildly acidic, often around pH 4–6, with variation between people, body sites and measurement conditions.</p>
      <h3>For everyday cleansers, look for mild acidity and a gentle formula</h3>
      <p>For a routine facial cleanser, a mildly acidic pH around 4.5–6.5 is a useful reference range, not a universal pass-or-fail rule. A <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7167948/">review of skin pH</a> discusses this range. A <a href="https://pubmed.ncbi.nlm.nih.gov/1980979/">controlled cleanser study</a> also found that otherwise similar formulas at pH 5.5 and 7 affected skin-surface pH differently.</p>
      <p>“pH balanced” alone leaves an important question unanswered: balanced to what value? Ask for the finished product’s measured pH range. Its cleansing agents, concentration, contact time and your skin’s response also matter; pH alone cannot establish gentleness.</p>
      <h3>Lower pH is not always better</h3>
      <p>Leave-on acids may need a different pH for their intended function, and a very acidic product can irritate. Do not use a cleanser’s reference range as a rule for every serum or exfoliant. Conventional pH measurements also do not apply in the same way to completely water-free oils and balms. Never add household acids or alkalis to adjust a product yourself.</p>
    </section>

    <section id="panthenol-b5">
      <h2>Panthenol: what does pro-vitamin B5 do?</h2>
      <p>Panthenol is commonly described as pro-vitamin B5; dexpanthenol is its D-form. It is used in skincare for moisture and skin conditioning. A <a href="https://pubmed.ncbi.nlm.nih.gov/10965426/">randomised, placebo-controlled human study</a> found improved outer-skin hydration and reduced water loss after seven days with the dexpanthenol formulations tested.</p>
      <h3>What a panthenol percentage can and cannot tell you</h3>
      <p>Look for “Panthenol” on the ingredient list. A disclosed percentage helps describe a product, but a 5% formula is not automatically five times better than a 1% formula. The base, other ingredients and testing of the finished product still matter. Results from a study on one formulation cannot simply be promised for every product containing B5.</p>
      <h3>Glycerin and other moisturising ingredients</h3>
      <p>Glycerin, also called glycerol, is a humectant: it helps attract and retain water in the outer skin. A <a href="https://pubmed.ncbi.nlm.nih.gov/18510666/">review of glycerol in skin care</a> describes its hydration benefits. A familiar, inexpensive ingredient can be useful without a fashionable name.</p>
      <p>Moisturisers often combine humectants with emollients that soften skin and occlusive ingredients that help reduce water loss. These are complementary jobs. A formula’s balance and comfort matter more than collecting as many “hydrating” ingredients as possible.</p>
    </section>

    <section id="ceramides-cholesterol-fatty-acids">
      <h2>Ceramides, cholesterol and fatty acids: why they work together</h2>
      <p>These three lipid groups occur naturally between cells in the outermost skin layer. Together, their organised structure helps limit water loss, as described in this <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11348431/">review of skin-barrier lipids</a>. A <a href="https://pubmed.ncbi.nlm.nih.gov/39113291/">review of ceramide formulation</a> explains why the way these lipids are incorporated into a product matters as much as their presence.</p>
      <h3>Ceramides: part of the skin’s moisture barrier</h3>
      <p>Ceramides are a family of lipids, rather than one single ingredient. Names such as Ceramide NP, AP and EOP identify different types. Seeing several names tells you which types are included; it does not reveal the total amount or prove that more types will outperform a well-formulated product with fewer.</p>
      <h3>Cholesterol: a useful skincare lipid</h3>
      <p>Cholesterol helps the outer skin’s lipids form their organised structure. In a cosmetic ingredient list, it has a different role from the blood-cholesterol measurements discussed in diet and heart-health advice. Its presence in a cream is not, by itself, a reason to reject the product.</p>
      <h3>Fatty acids: partners in the lipid mixture</h3>
      <p>Free fatty acids, including linoleic, palmitic and stearic acids, contribute to the skin’s lipid structure. The word “acid” does not make them exfoliating acids like glycolic acid. Plant oils can supply fatty-acid-containing lipids, but an oil is not interchangeable with a deliberately formulated mixture of free fatty acids.</p>
      <h3>Does a 3:1:1 ratio prove a product is better?</h3>
      <p>No. <a href="https://pubmed.ncbi.nlm.nih.gov/8618046/">Research on physiological lipid mixtures</a> investigated specific ratios and barrier-recovery outcomes, largely in animal models with preliminary human findings. That supports studying formulations; it does not validate every retail product displaying the same numbers.</p>
      <p>Ask which lipid each number refers to, whether the ratio is by weight or by moles, what the total lipid concentration is, and whether the finished product was tested. A ratio describes relative amounts; it does not tell you how much lipid is in the bottle. Treat these questions as relevant to every brand, including Le Calme.</p>
    </section>

    <section id="misleading-skincare-claims">
      <h2>Common skincare marketing claims worth questioning</h2>
      <h3>“Clinically proven” or “dermatologist tested”</h3>
      <p>Ask what was tested, on how many people, for how long, and against what comparison. Was it the finished product or just an ingredient? Did participants report softer-feeling skin, or did instruments measure hydration or water loss? “Tested” does not tell you the result, and evidence in one group does not guarantee results for everyone with sensitive skin.</p>
      <h3>“Hypoallergenic” or “safe for all sensitive skin”</h3>
      <p>No label can guarantee that you will not react. The <a href="https://www.fda.gov/cosmetics/cosmetics-labeling-claims/hypoallergenic-cosmetics">US FDA notes that “hypoallergenic” has no federal standard or definition in the US</a>. That is a US regulatory point, not a statement about every market. Wherever you shop, check your known allergens and the actual formula rather than treating the word as a personal safety guarantee.</p>
      <h3>“Natural”, “chemical-free” or “preservative-free”</h3>
      <p>Natural origin does not guarantee a gentler product, and plant extracts can cause reactions too. “Chemical-free” is not a meaningful way to describe a cosmetic formula: water and plant oils are chemicals. A suitable preservation system helps protect susceptible formulas from contamination; omitting preservatives is not automatically an advantage. HSA addresses natural and preservative-free claims in its <a href="https://www.hsa.gov.sg/announcements/staying-safe-cosmetic-products/">consumer guide to cosmetic misconceptions</a>.</p>
      <h3>“HSA approved” or promises to cure a skin condition</h3>
      <p>In Singapore, cosmetic notification is not HSA approval or endorsement. HSA also distinguishes cosmetics from treatments for medical conditions. A claim that an ordinary cosmetic cures a disease deserves scrutiny; a moisturising benefit is different from evidence for treating a condition.</p>
      <h3>“More active ingredients means better results”</h3>
      <p>Higher concentrations, extra layers and more frequent application do not automatically mean better results. Avoid treating burning or persistent irritation as proof that a product is working. Choose a manageable routine and follow the directions, especially for exfoliants and retinol.</p>
    </section>

    <section id="skincare-buying-checklist">
      <h2>A simple checklist before you buy skincare</h2>
      <ul>
        <li><strong>Choose the job:</strong> cleansing, hydration, moisturising or a specific optional treatment.</li>
        <li><strong>Read the full label:</strong> check known allergens, instructions and the current ingredient list.</li>
        <li><strong>Put the numbers in context:</strong> ask what a percentage, pH or lipid ratio actually describes.</li>
        <li><strong>Check the evidence:</strong> look for testing of the finished formula and a clearly described result.</li>
        <li><strong>Start gradually:</strong> introduce one product at a time and test on a small area first.</li>
      </ul>
      <p>If you are still deciding which product types belong in your routine, read our <Link href="/blog/cleanser-serum-moisturiser-differences">guide to cleansers, serums and moisturisers</Link>. Stop a new product if it causes irritation; persistent skin concerns are a reason to seek professional advice rather than keep adding products.</p>
    </section>

    <section id="le-calme-ingredients" className="article-range">
      <h2>Explore these ingredients in the Le Calme range</h2>
      <p>Le Calme offers fragrance-free cleansers, serums and moisturisers with a focus on delicate, sensitive skin. Use the same ingredient-reading habits here: review the current packaging and directions, consider the whole formula, and choose the steps that suit your skin.</p>
      <div className="article-products">
        {ingredientProducts.map(({ handle, description }) => {
          const product = byHandle[handle];
          return <div className="article-product" key={handle}>
            <Link href={`/products/${handle}`} aria-label={`Explore ${product.title}`}><img src={product.image} alt={`Le Calme ${product.title}`} width="800" height="800" loading="lazy" /></Link>
            <h3><Link href={`/products/${handle}`}>{product.title}</Link></h3>
            <p>{description}</p>
          </div>;
        })}
      </div>
      <p>Prefer to begin with smaller sizes? Explore the <Link href="/products/discovery-kit">Discovery Kit</Link>, or browse the <Link href="/products">whole Le Calme range</Link>. Choose for your skin’s needs and comfort, with ingredient names as useful clues rather than promises on their own.</p>
    </section>
  </>;
}
