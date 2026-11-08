# Calme Next.js migration

Approved plan: conversation, 2026-11-08.

- Build a React App Router storefront; retain original source files.
- Keep homepage featured sections and demo checkout.
- Routes: /, /products, /products/[handle], /blog, /blog/welcome-to-calme, /cart, /checkout.
- Preserve existing styles, nine products, ten variants, imagery, frame intro, palettes, privacy and analytics.

## Execution notes

- No Git repository exists; implementation proceeds in the authorized folder without commits/worktree scripts.
- Use native React state and components, with the legacy rendering code adapted only for the self-contained intro and analytics.
- Validation: unit tests for catalogue/cart/pricing, browser flow tests, production build, lint, typecheck, visual comparison.

## Completed

- Next.js 16.4.5 + React 19.3.1 + TypeScript project and locked dependencies.
- All requested routes, shared navigation/footer, original homepage sections, catalogue and product detail pages, journal placeholder, persistent cart and demo checkout.
- Source CSS retained, with full-page layout additions. All 262 copied image/frame assets verified byte-for-byte identical.
- Original instructions preserved in legacy-storefront.md; README now documents local Next.js setup and checks.
- Unit tests for nine products/ten variants, filters, cart recovery/updates, shipping and all discount codes.
- Browser checks cover all product pages, navigation/history/deep links, variants, cart persistence, checkout validation/order, routine additions, palettes, privacy/newsletter, mobile menu and intro fallback.
- Desktop computed-style comparison found the selected original and migrated hero/tile/science/routine/footer styles identical. Mobile route checks found no horizontal overflow, with no browser errors.

## Final independent review

- Fixed hidden static-intro beats by clearing animation inline styles in fallback mode; regression reproduced before the fix.
- Fixed malformed saved campaign data by allowing only recognised string fields; regression reproduced before the fix.
- Fixed malformed saved consent by normalising to unanswered; regression reproduced before the fix.
- Fixed reaccepting platform consent by explicitly granting Meta/TikTok consent before event flushing; regression reproduced before the fix.
- Review considered manually entered code reset: retained the original per-checkout-visit behaviour; campaign-link discounts continue to persist for the visit.
- Replaced inherited Shopify checkout attribution with demo-checkout copy because this project intentionally uses no live Shopify integration.
- Verification after fixes: 19 unit tests and 8 browser tests pass; lint and TypeScript checks pass. Final production build and production smoke check recorded below.
- Final production build: passed, generating all product and article pages.
- Production smoke check: main URLs return 200; unknown product/article URLs return 404; populated mobile cart and checkout have no overflow; cream variant, campaign discount, free delivery, mobile navigation and palette controls pass without browser errors.
- Clean-install dry run (`npm ci --dry-run --ignore-scripts`): passed with the committed dependency lockfile.
- Local production preview available on port 3001.
