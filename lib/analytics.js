// Platform event mappings and consent behaviour retained from the original storefront.
import { config as CFG } from './config';
import { readStorage, writeStorage } from './storage';
function createAnalytics() {
  const inTheme = false;
  const subscribers = new Set();
  let snapshot;
  const store = { get: (key) => readStorage(key), set: (key, value) => writeStorage(key, value) };
  var params = (function () { try { return new URLSearchParams(window.location.search); } catch (e) { return { get: function () { return null; } }; } })();
  var sess = {
    get: function (k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var PX = Object.assign({ meta: '', tiktok: '', ga4: '', pinterest: '', demo: false, inspector: false }, CFG.pixels || {});
  var hasIds = !!(PX.meta || PX.tiktok || PX.ga4 || PX.pinterest);
  // pixels are invisible to shoppers; the event panel only opens when asked for (?pixeldebug=1), e.g. in a class demo
  var showInspector = !!PX.inspector || params.get('pixeldebug') === '1';
  // demo: behave as a store with pixels installed (cookie consent, events logged) without sending anything
  var askConsent = !inTheme && (hasIds || !!PX.demo);
  var savedConsent = store.get('calme-consent');
  var consent = savedConsent === 'all' || savedConsent === 'necessary' ? savedConsent : null;
  var pixelsLoaded = false, pending = [], pxLog = [];

  // campaign attribution: the first landing of this visit (UTM tags and ad-click ids)
  var savedCampaign = sess.get('calme-camp');
  var camp = {};
  if (savedCampaign && typeof savedCampaign === 'object' && !Array.isArray(savedCampaign)) {
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'ttclid', 'gclid', 'landing_page'].forEach(function (key) {
      if (typeof savedCampaign[key] === 'string') camp[key] = savedCampaign[key].slice(0, 120);
    });
  }
  if (!Object.keys(camp).length) {
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'ttclid', 'gclid'].forEach(function (k) {
      var v = params.get(k); if (v) camp[k] = String(v).slice(0, 120);
    });
    if (Object.keys(camp).length) { camp.landing_page = window.location.pathname; sess.set('calme-camp', camp); }
  }
  var hasCamp = Object.keys(camp).length > 0;
  // discount links, e.g. ?discount=CALMEIG on Instagram ads (the same parameter Shopify uses)
  var linkCode = String(params.get('discount') || params.get('code') || sess.get('calme-code') || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 40);
  if (linkCode) sess.set('calme-code', linkCode);

  var PXMAP = {
    page_view: { meta: 'PageView', tiktok: 'page view', ga4: 'page_view', pin: 'page' },
    view_item: { meta: 'ViewContent', tiktok: 'ViewContent', ga4: 'view_item', pin: 'pagevisit' },
    add_to_cart: { meta: 'AddToCart', tiktok: 'AddToCart', ga4: 'add_to_cart', pin: 'addtocart' },
    begin_checkout: { meta: 'InitiateCheckout', tiktok: 'InitiateCheckout', ga4: 'begin_checkout' },
    search: { meta: 'Search', tiktok: 'Search', ga4: 'search', pin: 'search' },
    lead: { meta: 'Lead', tiktok: 'SubmitForm', ga4: 'generate_lead', pin: 'lead' },
    share: { metaCustom: 'Share', tiktok: 'Share', ga4: 'share' },
    routine_result: { metaCustom: 'RoutineResult', tiktok: 'RoutineResult', ga4: 'routine_result' },
    intro_complete: { metaCustom: 'IntroComplete', tiktok: 'IntroComplete', ga4: 'intro_complete' }
  };
  var PXLABEL = { page_view: 'Page view', view_item: 'Viewed a product', add_to_cart: 'Added to bag', begin_checkout: 'Started checkout',
    search: 'Searched', lead: 'Newsletter sign-up', share: 'Shared a product', routine_result: 'Routine Finder result',
    intro_complete: 'Watched the whole intro', intro_skip: 'Skipped the intro', purchase_demo: 'Placed an order (demo)' };

  function inject(src) { var t = document.createElement('script'); t.async = true; t.src = src; document.head.appendChild(t); }
  function loadPixels() {
    if (pixelsLoaded || !hasIds) return;
    pixelsLoaded = true;
    try {
      if (PX.meta) {
        var f = window, n = f.fbq = f.fbq || function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = true; n.version = '2.0'; n.queue = n.queue || [];
        inject('https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', PX.meta);
      }
      if (PX.tiktok) {
        var ttq = window.ttq = window.ttq || [];
        ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie', 'holdConsent', 'revokeConsent', 'grantConsent'];
        ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; };
        for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
        ttq._i = ttq._i || {}; ttq._i[PX.tiktok] = []; ttq._t = ttq._t || {}; ttq._t[PX.tiktok] = +new Date(); ttq._o = ttq._o || {}; ttq._o[PX.tiktok] = {};
        inject('https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=' + encodeURIComponent(PX.tiktok) + '&lib=ttq');

      }
      if (PX.ga4) {
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
        inject('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(PX.ga4));
        window.gtag('js', new Date()); window.gtag('config', PX.ga4, { send_page_view: false });
      }
      if (PX.pinterest) {
        if (!window.pintrk) { window.pintrk = function () { window.pintrk.queue.push(Array.prototype.slice.call(arguments)); }; window.pintrk.queue = []; window.pintrk.version = '3.0'; }
        inject('https://s.pinimg.com/ct/core.js');
        window.pintrk('load', PX.pinterest);
      }
    } catch (e) { /* measurement must never break shopping */ }
  }
  function sendPixels(name, d) {
    var m = PXMAP[name];
    if (!m) return;
    if (name === 'page_view') {
      if (PX.meta && window.fbq) window.fbq('track', 'PageView');
      if (PX.tiktok && window.ttq) window.ttq.page();
      if (PX.ga4 && window.gtag) window.gtag('event', 'page_view', d);
      if (PX.pinterest && window.pintrk) window.pintrk('page');
      return;
    }
    var ids = (d.items || []).map(function (i) { return i.id; });
    try {
      if (PX.meta && window.fbq) {
        var md = d.items ? { content_ids: ids, content_type: 'product', contents: d.items.map(function (i) { return { id: i.id, quantity: i.quantity }; }), value: d.value, currency: d.currency } : {};
        if (name === 'search') md = { search_string: d.search_term };
        if (name === 'routine_result') md.concern = d.concern;
        if (m.meta) window.fbq('track', m.meta, md); else window.fbq('trackCustom', m.metaCustom, md);
      }
      if (PX.tiktok && window.ttq) {
        var td = d.items ? { contents: d.items.map(function (i) { return { content_id: i.id, content_type: 'product', content_name: i.name, quantity: i.quantity, price: i.price }; }), value: d.value, currency: d.currency } : {};
        if (name === 'search') td = { query: d.search_term };
        window.ttq.track(m.tiktok, td);
      }
      if (PX.ga4 && window.gtag) {
        var gd = d.items ? { currency: d.currency, value: d.value, items: d.items.map(function (i) { return { item_id: i.id, item_name: i.name, item_variant: i.variant, price: i.price, quantity: i.quantity }; }) } : {};
        if (name === 'search') gd = { search_term: d.search_term };
        if (name === 'lead') gd = { method: d.method };
        if (name === 'routine_result') gd.concern = d.concern;
        window.gtag('event', m.ga4, gd);
      }
      if (PX.pinterest && window.pintrk && m.pin) {
        window.pintrk('track', m.pin, d.items ? { value: d.value, currency: d.currency, line_items: d.items.map(function (i) { return { product_id: i.id, product_name: i.name, product_price: i.price, product_quantity: i.quantity }; }) } : (name === 'search' ? { search_query: d.search_term } : {}));
      }
    } catch (e) { /* ignore */ }
  }
  function emit(name, d) {
    d = d || {};
    var payload = Object.assign({}, d, hasCamp ? { campaign: camp } : {});
    try { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: 'calme_' + name }, payload)); } catch (e) {}
    var status;
    if (inTheme) {
      try {
        if (window.Shopify && window.Shopify.analytics && window.Shopify.analytics.publish) { window.Shopify.analytics.publish('calme:' + name, payload); status = 'Published to Shopify customer events'; }
        else status = 'Shopify analytics not available on this page';
      } catch (e) { status = 'Could not publish'; }
    } else if (name === 'purchase_demo') {
      status = 'Demo order, not sent to ad platforms';
    } else if (!askConsent) {
      status = 'No pixels set up';
    } else if (consent === 'all') {
      if (hasIds) { loadPixels(); sendPixels(name, d); status = 'Sent'; } else status = 'Consent given (demo: no pixel IDs yet)';
    } else if (consent === 'necessary') {
      status = 'Not sent: visitor chose necessary cookies only';
    } else { pending.push([name, d]); status = 'Waiting for cookie consent'; }
    pxLog.unshift({ name: name, d: d, status: status });
    if (pxLog.length > 40) pxLog.pop();
    renderPx();
  }
  function renderPx() {
    snapshot = { log: pxLog.slice(), consent, askConsent, showInspector, linkCode, campaign: camp };
    subscribers.forEach(fn => fn(snapshot));
  }
  function setConsent(v) {
    consent = v; store.set('calme-consent', v);

    if (v === 'all') {
      if (hasIds) loadPixels();
      try {
        if (window.fbq) window.fbq('consent', 'grant');
        if (window.ttq && window.ttq.grantConsent) window.ttq.grantConsent();
      } catch (e) { /* measurement must never break shopping */ }
      var q = pending; pending = [];
      q.forEach(function (x) { if (hasIds) sendPixels(x[0], x[1]); });
      pxLog.forEach(function (e) { if (e.status === 'Waiting for cookie consent') e.status = hasIds ? 'Sent after consent' : 'Consent given (demo: no pixel IDs yet)'; });
    } else {
      pending = [];
      try { if (window.fbq) window.fbq('consent', 'revoke'); if (window.ttq && window.ttq.revokeConsent) window.ttq.revokeConsent(); } catch (e) {}
      pxLog.forEach(function (e) { if (e.status === 'Waiting for cookie consent') e.status = 'Not sent: visitor chose necessary cookies only'; });
    }
    renderPx();
  }


  function captureLocation() {
    const current = new URLSearchParams(window.location.search);
    const discount = current.get('discount') || current.get('code');
    if (discount) { linkCode = discount.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 40); sess.set('calme-code', linkCode); }
    if (!hasCamp) {
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'ttclid', 'gclid'].forEach(k => { if (current.get(k)) camp[k] = current.get(k).slice(0, 120); });
      hasCamp = Object.keys(camp).length > 0;
      if (hasCamp) { camp.landing_page = window.location.pathname; sess.set('calme-camp', camp); }
    }
    showInspector = !!PX.inspector || current.get('pixeldebug') === '1';
    renderPx();
  }
  renderPx();
  return {
    emit, setConsent, captureLocation,
    getSnapshot: () => snapshot,
    subscribe: (fn) => { subscribers.add(fn); fn(snapshot); return () => subscribers.delete(fn); },
  };
}
let instance;
export function getAnalytics() {
  if (typeof window === 'undefined') return null;
  return instance || (instance = createAnalytics());
}
export function emit(name, data = {}) { getAnalytics()?.emit(name, data); }
export function productEvent(product, variant, quantity = 1) {
  const items = [{id:variant.id, handle:product.handle, name:product.title, variant:variant.title, price:variant.price / 100, quantity}];
  return {currency:'SGD', value:Math.round(variant.price * quantity) / 100, items};
}
