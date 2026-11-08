# Calme storefront kit

One front-end, three ways to run it.

| File | What it is |
| --- | --- |
| `calme-storefront.liquid` | The Calme front-end as a Shopify theme section. Uses your store's real products, cart and checkout. **Recommended for the live demo.** |
| `calme-site.html` | The same site as one standalone page. Runs in demo mode as-is, or connects to Shopify through the Storefront API. Keep the `img/` and `intro-frames/` folders next to it. |
| `calme-custom-pixel.js` | A Shopify custom pixel that forwards Calme's own events (quick views, search, Routine Finder answers, sign-ups, shares, intro views) to Meta and TikTok. See "Social media pixels" below. |
| `img/` | Product photos used by `calme-site.html` (full size plus a lighter 400 px version for phones). |
| `calme_products_shopify.csv` | Product import (9 products, 10 variants). Import this before installing the section. |
| `intro-frames/` | The photoreal intro: 160 path-traced frames for desktop (`calme-intro-000…159.webp`, 960 px) and 80 for phones (`calme-intro-m-000…079.webp`, 540 px), all with transparent backgrounds. |
| `product-images/` | Photoreal 3D renders (1600×1600 PNG with transparent background, so the glass shows whichever colour scheme sits behind it) named by product handle, a wide hero image (`hero-routine.png`, 2400×1200) and logos. |

## Option A: inside your Shopify theme (recommended)

1. Products → Import → `calme_products_shopify.csv`. Add each image from `product-images/` to its product (file name = URL handle; the cream has one image per size).
2. Online Store → Themes → … → **Edit code** → Sections → **Add a new section** → name it `calme-storefront` → replace everything in it with the contents of `calme-storefront.liquid` → Save.
3. Online Store → Themes → **Customize** → Home page → **Add section** → **Calme storefront**. Drag it to the top and remove the theme's other home page sections.
4. Photoreal intro: Content → **Files** → **Upload files** → select all 240 files in `intro-frames/` at once. When they finish, copy the link of any one of them (it looks like `https://cdn.shopify.com/s/files/1/…/files/calme-intro-000.webp?v=…`), delete everything after `/files/`, and paste the rest into the section setting **Photoreal intro frames**. Leave the setting empty to use the live 3D intro instead.
5. Social links: paste your Instagram, TikTok and Facebook profile links into the section settings; icons appear in the footer.
6. In the section settings, keep "Show Calme header" **off** (the theme header and its cart stay in charge) and set the free-delivery threshold (default S$60).
7. Theme settings → set the theme's colours to match: background `#FFFFFF` with `#F5F5F7` for alternate sections, text `#1D1D1F`, buttons and links `#2F5C8A` (slate blue), badges `#A0522D`. Font: Inter. Upload `logo-ink.png` as the theme logo. In the Calme section settings you can also pick `hero-routine.png` as the hero image.

How it connects: products are read from your store by Liquid, "Buy" uses Shopify's cart (`/cart/add.js`), and Checkout goes to Shopify's own checkout, where your PayNow / bank transfer / test gateway options appear. The theme's cart count updates when the page reloads.

## Option B: standalone site connected by the Storefront API

1. Shopify admin → Settings → Apps and sales channels → Shopify App Store → install **Headless** → **Create storefront** → copy the **public access token**.
2. Open `calme-site.html` in a text editor and fill in `shopifyDomain` (e.g. `calme-skin.myshopify.com`) and `storefrontToken` near the bottom.
3. Host the file anywhere static (GitHub Pages, Netlify), with the `img/` and `intro-frames/` folders next to it. After hosting, put the full web address of `img/hero-routine.webp` into the `og:image` tag near the top, so links shared on WhatsApp, Instagram and Facebook show the product line-up. Products load from Shopify; Checkout opens Shopify's checkout.

Leave both fields empty to run in demo mode (products, cart and a mock checkout, no Shopify needed). If the connection fails, the page falls back to demo mode and says so in the footer.

## The intro and colour schemes

- **Photoreal intro (default).** The intro is a path-traced film of our own scene (rendered offline with Blender Cycles), played back frame by frame as visitors scroll, the way Apple's product pages work. Frames stream in coarse-to-fine, so the story can be scrubbed within a second or two; phones load a lighter 540 px set (about 2 MB; desktop about 7 MB). The frames have transparent backgrounds, so they sit on whichever colour scheme is active. In `calme-site.html`, remove the `introFrames` line to switch to the live 3D intro.
- **Live 3D intro (fallback).** If the frames are missing or can't load, the page switches to a real-time 3D version of the same story (Three.js r147, loaded from jsDelivr only when needed): a cross-section of skin, with a plate of satin-textured skin cells over a reservoir of refractive glass beads (water and lipids). As visitors scroll, the plate rises into view, its surface splits along organic cracks, the beads drain away and the layer underneath reddens, a Calme drop lands, a ripple runs through the surface and seals the cracks, and the beads refill with a golden glow before the plate sinks away into the hero. Visitors can press "Skip intro". If WebGL or the script is unavailable, the same story shows as plain text. On slower devices the intro automatically renders at a lower resolution so scrolling stays smooth.
- Seven colour schemes are built in: `slate` (default), `sage`, `oat`, `dusk`, plus `luxe` (Quiet Luxury), `minimal` (Modern Minimal) and `editorial` (Soft Editorial). In the Shopify section, pick one under **Colour scheme**. In `calme-site.html`, set `palette` and set `paletteSwitcher: false` once you have decided.

## Discount codes the demo checkout recognises

`WELCOME10`, `CALMEIG` (Instagram), `CALMEFB` (Facebook), `CALMETT` (TikTok), `CALMEGOOGLE` (10% off) and `KIT19BACK` (S$19 off S$38+ of full-size products). Create the same codes in Shopify → Discounts so the live checkout matches.

## Social media pixels and campaign links

The site fires one set of events for every platform:

| What the visitor does | Meta | TikTok | GA4 |
| --- | --- | --- | --- |
| Opens a product (quick view or `?p=` link) | ViewContent | ViewContent | view_item |
| Adds to bag | AddToCart | AddToCart | add_to_cart |
| Starts checkout | InitiateCheckout | InitiateCheckout | begin_checkout |
| Searches the range | Search | Search | search |
| Subscribes to the newsletter | Lead | SubmitForm | generate_lead |
| Answers the Routine Finder | RoutineResult (custom, with `concern`) | RoutineResult | routine_result |
| Shares a product | Share (custom) | Share | share |
| Watches the whole intro | IntroComplete (custom) | IntroComplete | intro_complete |

Purchases happen on Shopify's checkout, so Shopify's apps report them.

**Inside the Shopify theme (Option A)**
1. Install Shopify's **Facebook & Instagram** app, connect your Meta pixel and set Data sharing to **Maximum** (pixel plus Conversions API). It sends PageView, ViewContent, Search, AddToCart, InitiateCheckout, AddPaymentInfo and Purchase on its own.
2. Install the **TikTok** app and set data sharing to **Enhanced** or **Maximum** (pixel plus Events API). Add Google & YouTube or Pinterest the same way if you advertise there.
3. Settings → Customer events → **Add custom pixel** → paste `calme-custom-pixel.js`, fill in your Meta and TikTok pixel IDs → Save → Connect. It adds the Calme-only events (Routine Finder, intro, quick views, search, sign-ups, shares) without double-counting the apps.
4. Settings → Customer privacy → turn on the cookie banner. Pixels then run only for visitors who agree.
5. Test with Meta Events Manager → Test events and TikTok Events Manager → Test events. To see what the page publishes, add `?pixeldebug=1` to your store address (or tick "Show the pixel event inspector" in the section, then untick it).

**Standalone page (Option B or demo)**
Fill in `pixels: { meta, tiktok, ga4, pinterest }` near the bottom of `calme-site.html`. The page asks visitors for cookie consent first (PDPA), then loads only the pixels you filled in. Pixels are invisible to shoppers. To show your class what fires, add `?pixeldebug=1` to the page address: a "Pixel events" panel lists every event and whether it was sent. Without it, the panel never appears.

**Campaign links for ads and bios**
- Tag every link: `?utm_source=instagram&utm_medium=paid_social&utm_campaign=launch`. The first landing of each visit is remembered and saved on the Shopify cart (and so on the order), next to Shopify's own campaign reports.
- Add a platform code so it applies itself: `&discount=CALMEIG` (Instagram), `CALMEFB` (Facebook), `CALMETT` (TikTok). The ribbon confirms the code and checkout applies it.
- Link straight to a product: `?p=centella-calming-serum` opens it on the page (in the Shopify theme, product ads can also link to the product page).
- Example: `https://your-store/?utm_source=tiktok&utm_medium=paid_social&utm_campaign=flare_care&discount=CALMETT&p=centella-calming-serum`

**Audiences this makes possible**
Visitors who watched the whole intro; people whose Routine Finder answer was "Flaring now" (show them Centella Calming Serum); product viewers who didn't add to bag; bags without a purchase (retargeting); newsletter subscribers; purchasers to exclude or to seed lookalike audiences.
