import { test, expect } from '@playwright/test';

test('navigation, catalogue, product routes and blog', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', {name:'Main',exact:true});
  await expect(nav.getByRole('link')).toHaveText(['Products','Blog','Routine Finder','Science','Support']);
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
  await page.getByText('Flaring now', {exact:true}).click();
  await expect(page.getByRole('radio', {name:/Flaring now/})).toBeChecked();
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

test('intro plays, survives route changes and falls back when media is unavailable', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('#c-intro')).toHaveClass(/ready/);
  await page.getByRole('link', {name:'Skip intro',exact:true}).click();
  await expect(page).toHaveURL('/#c-hero');
  await expect(page.locator('#c-hero')).toBeInViewport();
  await page.getByRole('navigation', {name:'Main',exact:true}).getByRole('link', {name:'Blog',exact:true}).click();
  await expect(page.locator('#c-intro')).toHaveCount(0);
  await page.getByRole('link', {name:'Calme home',exact:true}).click();
  await expect(page.locator('#c-intro')).toHaveClass(/ready/);
  await page.route('**/intro-frames/**', route => route.abort());
  await page.route('**/three@*/**', route => route.abort());
  await page.reload();
  await expect(page.locator('#c-intro')).toHaveClass(/static/);
  await expect(page.getByRole('heading', {name:'Skincare for skin that reacts.',exact:true})).toBeVisible();
  for (const heading of ['Healthy skin holds on to water.', 'When the barrier cracks, moisture escapes.', 'Calme helps seal it back.', 'This is Calme.']) await expect(page.getByRole('heading', {name:heading,exact:true})).toBeVisible();
  expect(errors).toEqual([]);
});
