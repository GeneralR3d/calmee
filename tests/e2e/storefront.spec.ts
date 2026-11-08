import { test, expect } from '@playwright/test';

test('navigation, catalogue, product routes and blog', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', {name:'Main',exact:true});
  await expect(nav.getByRole('link')).toHaveText(['Products','Blog','Routine Finder','Science','Support','Sitemap']);
  await expect(page.locator('#c-shop')).toHaveCount(0);
  await expect(page.getByRole('heading', {name:'Barrier Reset Routine',exact:true})).toBeVisible();
  await nav.getByRole('link', {name:'Products',exact:true}).click();
  await expect(page).toHaveURL('/products');
  await expect(page.locator('.card')).toHaveCount(9);
  await page.getByRole('button', {name:'Cleanse',exact:true}).click();
  await expect(page.locator('.card')).toHaveCount(2);
  await page.getByRole('button', {name:'All',exact:true}).click();
  await page.getByRole('searchbox', {name:'Search products'}).fill('centella');
  await expect(page.locator('.card')).toHaveCount(1);
  await page.getByRole('link', {name:'View Centella Calming Serum',exact:true}).click();
  await expect(page).toHaveURL('/products/centella-calming-serum');
  await expect(page.getByRole('heading', {level:1})).toHaveText('Centella Calming Serum');
  await page.reload();
  await expect(page.getByRole('heading', {name:'How to use'})).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/products(?:\?|$)/);
  await page.goForward();
  await expect(page).toHaveURL('/products/centella-calming-serum');
  await nav.getByRole('link', {name:'Blog',exact:true}).click();
  await page.getByRole('link', {name:'Read Welcome to Calme'}).click();
  await expect(page).toHaveURL('/blog/welcome-to-calme');
  await expect(page.getByRole('heading', {level:1})).toHaveText('Welcome to Calme');
});

test('cream sizes, persistent cart, quantity controls and removal', async ({ page }) => {
  await page.goto('/products/barrier-repair-cream');
  await page.getByRole('button', {name:'100 ml · S$64',exact:true}).click();
  await expect(page.locator('.product-detail .qv-img img')).toHaveAttribute('src','/img/barrier-repair-cream-100ml.webp');
  await page.getByRole('button', {name:'Increase quantity',exact:true}).click();
  await page.getByRole('button', {name:'Add to Bag · S$128',exact:true}).click();
  await page.getByRole('link', {name:'View bag',exact:true}).click();
  await expect(page).toHaveURL('/cart');
  await expect(page.locator('.cart-item')).toContainText('100 ml');
  await expect(page.getByTestId('subtotal')).toHaveText('S$128');
  await page.reload();
  await expect(page.getByTestId('subtotal')).toHaveText('S$128');
  await page.getByRole('button', {name:'Decrease Barrier Repair Cream'}).click();
  await expect(page.getByTestId('subtotal')).toHaveText('S$64');
  await page.getByRole('button', {name:'Remove Barrier Repair Cream'}).click();
  await expect(page.getByText('Your bag is empty.')).toBeVisible();
});

test('checkout discounts, validation and simulated order', async ({ page }) => {
  await page.goto('/products/gentle-cream-cleanser?discount=CALMEIG');
  await page.getByRole('button', {name:'Add to Bag · S$28',exact:true}).click();
  await page.goto('/checkout');
  await expect(page.getByTestId('delivery')).toHaveText('S$4.90');
  await expect(page.getByTestId('total')).toHaveText('S$30.10');
  await page.getByLabel('Discount code', {exact:true}).fill('UNKNOWN');
  await page.getByRole('button', {name:'Apply',exact:true}).click();
  await expect(page.getByRole('status').filter({hasText:'Code not recognised'})).toBeVisible();
  await page.getByLabel('Discount code', {exact:true}).fill('WELCOME10');
  await page.getByRole('button', {name:'Apply',exact:true}).click();
  await page.getByRole('button', {name:'Place demo order',exact:true}).click();
  await expect(page.getByRole('heading', {name:/Thank you/})).toHaveCount(0);
  await page.getByLabel('Email', {exact:true}).fill('shopper@example.com');
  await page.getByLabel('First name').fill('Test');
  await page.getByLabel('Last name').fill('Shopper');
  await page.getByLabel('Address', {exact:true}).fill('10 Bedok North Avenue 4');
  await page.getByLabel('Postal code').fill('460010');
  await page.getByLabel('Mobile', {exact:true}).fill('+65 9123 4567');
  await page.getByLabel('Bank transfer').check();
  await page.getByRole('button', {name:'Place demo order',exact:true}).click();
  await expect(page.getByRole('heading', {name:/Thank you/})).toBeVisible();
  await expect(page.getByText(/No payment has been taken/)).toBeVisible();
  await page.goto('/cart');
  await expect(page.getByText('Your bag is empty.')).toBeVisible();
});

test('routine additions, palettes and homepage anchors work across pages', async ({ page }) => {
  await page.goto('/products');
  await page.getByRole('navigation', {name:'Main',exact:true}).getByRole('link', {name:'Routine Finder',exact:true}).click();
  await expect(page).toHaveURL('/#c-routine');
  await page.getByText('Delicate skin', {exact:true}).click();
  await expect(page.getByRole('radio', {name:/Delicate skin/})).toBeChecked();
  await page.getByRole('button', {name:'Add Routine to Bag',exact:true}).click();
  await page.goto('/cart');
  await expect(page.locator('.cart-item')).toHaveCount(3);
  await page.getByRole('button', {name:'Try a colour scheme'}).click();
  await page.getByRole('button', {name:'Sage calm',exact:true}).click();
  await expect(page.locator('#calme')).toHaveAttribute('data-palette','sage');
  await page.reload();
  await expect(page.locator('#calme')).toHaveAttribute('data-palette','sage');
});

test('legacy links, missing pages, empty checkout and mobile navigation', async ({ page }) => {
  await page.goto('/?p=ceramide-recovery-serum&utm_source=test&discount=WELCOME10');
  await expect(page).toHaveURL(/\/products\/ceramide-recovery-serum\?/);
  expect(new URL(page.url()).searchParams.get('discount')).toBe('WELCOME10');
  expect((await page.goto('/products/not-a-product'))?.status()).toBe(404);
  await expect(page.getByRole('heading', {name:'Page not found'})).toBeVisible();
  expect((await page.goto('/blog/not-a-post'))?.status()).toBe(404);
  await page.goto('/checkout');
  await expect(page.getByText('Your bag is empty.')).toBeVisible();
  await page.setViewportSize({width:390,height:844});
  await page.goto('/products');
  await page.getByRole('button', {name:'Open menu',exact:true}).click();
  await expect(page.getByRole('navigation', {name:'Main',exact:true})).toBeVisible();
  await page.getByRole('navigation', {name:'Main',exact:true}).getByRole('link', {name:'Blog',exact:true}).click();
  await expect(page).toHaveURL('/blog');
  await expect(page.getByRole('button', {name:'Open menu',exact:true})).toHaveAttribute('aria-expanded','false');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('all product URLs load without broken images or browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const handles = ['barrier-cleansing-oil','gentle-cream-cleanser','ceramide-recovery-serum','centella-calming-serum','pha-gentle-exfoliant','night-renew-retinol','barrier-repair-cream','barrier-reset-routine','discovery-kit'];
  for (const handle of handles) {
    expect((await page.goto(`/products/${handle}`))?.status()).toBe(200);
    await expect(page.locator('.product-detail h1')).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/eczema|flare-ups|damaged skin barrier/i);
    await expect(page.locator('meta[name="description"]')).not.toHaveAttribute('content', /eczema|flare/i);
    await expect(page.locator('.product-detail img')).toHaveJSProperty('complete', true);
    expect(await page.locator('.product-detail img').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  }
  await page.goto('/products');
  await page.getByRole('searchbox', {name:'Search products'}).fill('unfindable item');
  await expect(page.getByText(/No products match these filters/)).toBeVisible();
  await expect(page.locator('.card')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('privacy, cookie choices and newsletter confirmation remain functional', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/blog?pixeldebug=1');
  await page.getByRole('button', {name:'Privacy notice',exact:true}).click();
  await expect(page.getByRole('dialog', {name:'Privacy notice'})).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('button', {name:'Cookie choices',exact:true}).click();
  await page.getByRole('button', {name:'Necessary only',exact:true}).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('calme-consent') || 'null'))).toBe('necessary');
  await page.getByLabel('Email for newsletter').fill('reader@example.com');
  await page.getByRole('button', {name:'Subscribe',exact:true}).click();
  await expect(page.getByRole('status')).toContainText("You're on the list");
  await page.getByRole('button', {name:/Pixel events/}).click();
  await expect(page.getByRole('complementary', {name:'Pixel event inspector'})).toContainText('lead');
  await page.reload();
  await expect(page.getByRole('region', {name:'Cookie choices'})).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('delicate-skin opening works without the old animation', async ({ page }) => {
  const media: string[] = [];
  page.on('request', request => {
    if (/intro-frames|three@|three\.min\.js/.test(request.url())) media.push(request.url());
  });
  await page.goto('/');
  await expect(page.getByRole('heading', {level:1})).toHaveText('Gentle skincare for delicate skin.');
  await expect(page.locator('#c-intro')).toHaveCount(0);
  await expect(page.locator('.hero-img')).toHaveJSProperty('complete', true);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Gentle skincare for delicate skin\./);
  await expect(page.locator('body')).not.toContainText(/eczema|flare-ups|seal it back|seal it in|rebuild|damaged skin barrier/i);
  await page.getByRole('link', {name:'Calme home',exact:true}).click();
  await expect(page.getByRole('heading', {level:1})).toBeVisible();
  expect(media).toEqual([]);
});

test('WhatsApp support opens, dismisses and keeps its demo action local', async ({ page, context }) => {
  await page.goto('/products');
  const launcher = page.getByRole('button', {name:'Open WhatsApp support',exact:true});
  await expect(launcher).toHaveAttribute('aria-expanded', 'false');
  await launcher.click();
  const panel = page.getByRole('region', {name:'Contact Calme',exact:true});
  await expect(panel).toContainText('For enquiries and support, contact Calme on WhatsApp Business.');
  await expect(page.getByRole('button', {name:'Close support panel'})).toBeFocused();
  await page.getByRole('button', {name:'Chat on WhatsApp (demo)',exact:true}).click();
  await expect(panel.getByRole('status')).toContainText('placeholder');
  expect(context.pages()).toHaveLength(1);
  await expect(page).toHaveURL('/products');
  await page.keyboard.press('Escape');
  await expect(panel).toHaveCount(0);
  await expect(launcher).toBeFocused();
  await launcher.click();
  await page.getByRole('button', {name:'Close WhatsApp support',exact:true}).click();
  await expect(panel).toHaveCount(0);
  await launcher.click();
  await page.getByRole('heading', {level:1}).click();
  await expect(panel).toHaveCount(0);
  await launcher.click();
  await page.getByRole('button', {name:'Close support panel',exact:true}).click();
  await expect(launcher).toBeFocused();
  for (const path of ['/cart','/checkout','/blog','/sitemap']) {
    await page.goto(path);
    await expect(launcher).toBeVisible();
  }
});

test('sitemap lists working destinations and retains support actions', async ({ page, request }) => {
  await page.goto('/sitemap');
  await expect(page.getByRole('heading', {level:1})).toHaveText('Sitemap');
  await expect(page.getByRole('navigation', {name:'Main',exact:true}).getByRole('link', {name:'Sitemap',exact:true})).toHaveAttribute('aria-current','page');
  const main = page.locator('main');
  await expect(main.locator('a[href^="/products/"]')).toHaveCount(9);
  await expect(main.getByRole('link', {name:'Welcome to Calme',exact:true})).toHaveAttribute('href','/blog/welcome-to-calme');
  const destinations = await main.locator('a').evaluateAll(links => [...new Set(links.map(link => link.getAttribute('href')!))]);
  for (const href of destinations) {
    expect((await request.get(href)).status(), href).toBe(200);
    if (href.includes('#')) {
      const html = await (await request.get(href.split('#')[0])).text();
      expect(html).toContain(`id="${href.split('#')[1]}"`);
    }
  }
  await main.getByRole('button', {name:'Privacy notice',exact:true}).click();
  await expect(page.getByRole('dialog', {name:'Privacy notice'})).toBeVisible();
  await page.keyboard.press('Escape');
  await main.getByRole('button', {name:'Cookie choices',exact:true}).click();
  await expect(page.getByRole('region', {name:'Cookie choices'})).toBeVisible();
});

test('support dock avoids mobile cookie controls, colours and cart feedback', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/products');
  await page.getByRole('button', {name:'Cookie choices',exact:true}).click();
  await page.getByRole('button', {name:'Open WhatsApp support',exact:true}).click();
  const dock = page.locator('.support-dock');
  const consent = page.getByRole('region', {name:'Cookie choices'});
  await expect.poll(async () => {
    const a = await dock.boundingBox();
    const b = await consent.boundingBox();
    return !!a && !!b && a.y + a.height <= b.y - 8;
  }).toBe(true);
  await page.getByRole('button', {name:'Necessary only',exact:true}).click();
  await page.getByRole('button', {name:'Try a colour scheme'}).click();
  await expect(page.getByRole('button', {name:'Sage calm',exact:true})).toBeVisible();
  await page.getByRole('button', {name:'Sage calm',exact:true}).click();
  await page.getByRole('button', {name:'Add to Bag',exact:true}).first().click();
  await expect.poll(async () => {
    const a = await dock.boundingBox();
    const b = await page.locator('.toast.on').boundingBox();
    return !!a && !!b && a.y + a.height <= b.y - 8;
  }).toBe(true);
  await page.getByRole('button', {name:'Open menu',exact:true}).click();
  await page.getByRole('navigation', {name:'Main',exact:true}).getByRole('link', {name:'Sitemap',exact:true}).click();
  await expect(page).toHaveURL('/sitemap');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('support launcher stays reachable in landscape with cookie choices open', async ({ page }) => {
  await page.setViewportSize({width:844,height:390});
  await page.goto('/sitemap');
  await page.locator('main').getByRole('button', {name:'Cookie choices',exact:true}).click();
  await page.getByRole('button', {name:'Open WhatsApp support',exact:true}).click();
  await expect(page.getByRole('button', {name:'Close WhatsApp support',exact:true})).toBeInViewport();
  await expect(page.getByRole('button', {name:'Close support panel',exact:true})).toBeInViewport();
  const consent = await page.getByRole('region', {name:'Cookie choices'}).boundingBox();
  const launcher = await page.getByRole('button', {name:'Close WhatsApp support',exact:true}).boundingBox();
  expect(launcher!.y + launcher!.height).toBeLessThanOrEqual(consent!.y - 8);
});
