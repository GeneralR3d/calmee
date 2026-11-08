/* Calme custom pixel for Shopify
   Where: Shopify admin > Settings > Customer events > Add custom pixel > paste this file > Save > Connect.
   Permissions: keep "Marketing" and "Analytics" required, so it only runs for visitors who allow them.

   What it does: the Calme section is a one-page store, so some of the most useful moments for ad
   targeting never reach Shopify's own event list. The section publishes them as custom events
   (calme:view_item, calme:search, calme:routine_result, calme:lead, calme:share, calme:intro_complete)
   and this pixel forwards them to Meta and TikTok.

   What it does NOT do: PageView, product-page ViewContent, AddToCart, InitiateCheckout and Purchase are
   already sent by Shopify's "Facebook & Instagram" and "TikTok" apps (with the Conversions API / Events
   API). Sending them again here would double-count, so they are left to the apps. */

const META_PIXEL_ID = '';     // from Meta Events Manager, e.g. '123456789012345'
const TIKTOK_PIXEL_ID = '';   // from TikTok Events Manager, e.g. 'C0ABCDEF123456789'
// Which id your Meta catalogue uses for products. Shopify's app usually reports the parent product id.
// If Events Manager shows a low catalogue match rate, try 'variant'.
const ID_FORMAT = 'product';  // 'product' | 'variant'

if (META_PIXEL_ID) {
  !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0;
    t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', META_PIXEL_ID);
}
if (TIKTOK_PIXEL_ID) {
  !function (w, d, t) { w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || [];
    ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie', 'holdConsent', 'revokeConsent', 'grantConsent'];
    ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; };
    for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
    ttq.load = function (e, n) { var r = 'https://analytics.tiktok.com/i18n/pixel/events.js'; ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = r;
      ttq._t = ttq._t || {}; ttq._t[e] = +new Date(); ttq._o = ttq._o || {}; ttq._o[e] = n || {};
      var s = d.createElement('script'); s.type = 'text/javascript'; s.async = !0; s.src = r + '?sdkid=' + e + '&lib=' + t;
      var f = d.getElementsByTagName('script')[0]; f.parentNode.insertBefore(s, f); };
    ttq.load(TIKTOK_PIXEL_ID); }(window, document, 'ttq');
}

const idOf = (i) => String(ID_FORMAT === 'variant' ? i.id : (i.product_id || i.id));
function toMeta(d) {
  const items = (d && d.items) || [];
  if (!items.length) return {};
  return { content_ids: items.map(idOf), content_type: 'product', contents: items.map((i) => ({ id: idOf(i), quantity: i.quantity })), value: d.value, currency: d.currency };
}
function toTikTok(d) {
  const items = (d && d.items) || [];
  if (!items.length) return {};
  return { contents: items.map((i) => ({ content_id: idOf(i), content_type: 'product', content_name: i.name, quantity: i.quantity, price: i.price })), value: d.value, currency: d.currency };
}
function send(meta, metaCustom, tiktok, payloadMeta, payloadTikTok) {
  if (META_PIXEL_ID && window.fbq) metaCustom ? fbq('trackCustom', meta, payloadMeta) : fbq('track', meta, payloadMeta);
  if (TIKTOK_PIXEL_ID && window.ttq && tiktok) ttq.track(tiktok, payloadTikTok);
}

// quick view on the home page = a product view (product pages are already covered by the apps)
analytics.subscribe('calme:view_item', (e) => send('ViewContent', false, 'ViewContent', toMeta(e.customData), toTikTok(e.customData)));
// in-page search box
analytics.subscribe('calme:search', (e) => send('Search', false, 'Search', { search_string: e.customData.search_term }, { query: e.customData.search_term }));
// newsletter sign-up
analytics.subscribe('calme:lead', () => send('Lead', false, 'SubmitForm', {}, {}));
// Routine Finder answer: build audiences by skin concern (flare, dry, texture, new)
analytics.subscribe('calme:routine_result', (e) => send('RoutineResult', true, 'RoutineResult',
  Object.assign(toMeta(e.customData), { concern: e.customData.concern }), Object.assign(toTikTok(e.customData), { description: e.customData.concern })));
// shared a product link
analytics.subscribe('calme:share', (e) => send('Share', true, 'Share', toMeta(e.customData), toTikTok(e.customData)));
// watched the whole scroll story: an "engaged visitor" audience
analytics.subscribe('calme:intro_complete', () => send('IntroComplete', true, 'IntroComplete', {}, {}));

// Only if Meta's Test Events shows no AddToCart from the Facebook & Instagram app when you add from this
// section, remove the two slashes below (otherwise you would count every add twice).
// analytics.subscribe('calme:add_to_cart', (e) => send('AddToCart', false, 'AddToCart', toMeta(e.customData), toTikTok(e.customData)));
