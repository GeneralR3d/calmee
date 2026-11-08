# Calme storefront

A Next.js and React storefront for Calme skincare, migrated from the original standalone page while keeping its colours, typography, imagery, responsive styling, and scroll-driven introduction.

## Run locally

Use Node.js 22.12 or newer; Node.js 24 is recommended. No Shopify account or API keys are required.

Install the locked dependencies:

```bash
npm ci
```

Start the development preview:

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000). The preview prints “Ready” when it is available.

To run the production version:

```bash
npm run build
npm start
```

## Pages

- `/` — original intro, hero, featured products, science, Routine Finder, brand promises, and FAQs.
- `/products` — all nine products, with step and skin-concern filters and search.
- `/products/[handle]` — product details, ingredients, usage, size selection, and add-to-bag controls. Example: `/products/barrier-repair-cream`.
- `/blog` — journal listing.
- `/blog/welcome-to-calme` — the initial placeholder article.
- `/cart` — persistent bag, quantities, removal, and delivery progress.
- `/checkout` — demo checkout and simulated order confirmation.

Unknown product and article URLs return a styled 404. Legacy `/?p=product-handle` links redirect to the matching product page and retain campaign and discount parameters. Footer category links use `/products?category=cleanse`, `treat`, `moisturise`, or `sets`.

## Shopping behaviour

The demo bag persists in local browser storage under the original `calme-demo-cart` key, using `{ id, qty }` lines. It stays available across pages and refreshes; existing compatible demo bags are restored. The two Barrier Repair Cream sizes remain separate variants.

All prices are in Singapore dollars and include GST. Delivery is S$4.90 below S$60 and free at S$60 or more, calculated before discounts. The original demo discount rules are retained:

- `WELCOME10`, `CALMEIG`, `CALMEFB`, `CALMETT`, `CALMEGOOGLE` — 10% off.
- `KIT19BACK` — S$19 off when eligible non-Discovery-Kit items total at least S$38.

Campaign links may include `?discount=CALMEIG` or `?code=WELCOME10`. Valid codes are carried to checkout during the visit.

Checkout simulates PayNow or bank transfer. No real payment, email, shipment, or Shopify order is created. Customer form fields remain in the page's memory and are not submitted to a service. Newsletter signup likewise displays a demo confirmation.

## Customisation

- `app/globals.css` contains the original stylesheet followed by the additions needed for full-page product, cart, checkout, and blog layouts. It retains the original `.calme` design tokens and all seven palettes.
- `lib/catalogue.json` contains the nine original products and ten variants, with prices in cents and root-relative image paths.
- `lib/routines.ts` retains the original four routine recommendations.
- `lib/blog.ts` contains the placeholder post. Add another entry to create another journal route.
- `lib/config.ts` controls the default palette, colour picker, social links, and optional advertising pixel IDs.
- `public/img/` and `public/intro-frames/` contain unchanged copies of the original assets. All 160 desktop and 80 mobile intro frames are included.

The intro uses the original frame renderer, with cleanup on navigation. If frames fail, it tries the original Three.js r147 scene from jsDelivr; if WebGL or that script is unavailable, it displays the static story. Google Fonts loads Inter while retaining the original system-font fallbacks.

Cookie choices and palette selection retain the original storage keys. Meta, TikTok, GA4, and Pinterest pixels remain unconfigured and only load after consent when IDs are provided. Add `?pixeldebug=1` to inspect storefront events. Simulated purchases are never sent to advertising platforms. Do not put private tokens into client configuration.

Optionally create `.env.local` with `NEXT_PUBLIC_SITE_URL=https://your-domain.example` to set the origin used for social-preview metadata. Local development defaults to `http://localhost:3000`.

## Verification

Run the unit tests, lint checks, type checks, and production build:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Install Chromium once for the browser checks:

```bash
npx playwright install chromium
npm run test:e2e
```

If Google Chrome is already installed, use it instead:

```bash
PLAYWRIGHT_CHANNEL=chrome npm run test:e2e
```

The browser suite starts a local development preview automatically, or uses an existing preview on port 3000. It covers navigation, product variants, all product URLs, cart persistence, discounts, form validation, simulated orders, the Routine Finder, palette persistence, mobile navigation, privacy controls, and intro fallback.

## Original storefront kit

`calme-site.html`, `calme-storefront.liquid`, `calme-custom-pixel.js`, the original product CSV, and the root asset folders are preserved as references. The original Shopify installation notes are in [docs/legacy-storefront.md](docs/legacy-storefront.md). The Next.js app uses local demo data and does not activate the legacy Shopify integrations.
