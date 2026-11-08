import { afterEach, describe, expect, it, vi } from 'vitest';

async function analyticsWith({ consent = null, campaign = null, search = '' }: { consent?: unknown; campaign?: unknown; search?: string } = {}) {
  vi.resetModules();
  vi.doMock('../lib/config', () => ({ config: { pixels: { meta: 'meta-test', tiktok: 'tiktok-test', demo: true } } }));
  const local = new Map([['calme-consent', JSON.stringify(consent)]]);
  const session = new Map([['calme-camp', JSON.stringify(campaign)]]);
  const storage = (values: Map<string, string>) => ({ getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) });
  const fbq = vi.fn();
  const browser = { location: { search, pathname: '/products', href: `https://calme.test/products${search}` }, fbq, ttq: [] as unknown[][] };
  vi.stubGlobal('window', browser);
  vi.stubGlobal('localStorage', storage(local));
  vi.stubGlobal('sessionStorage', storage(session));
  vi.stubGlobal('document', { createElement: () => ({}), head: { appendChild: vi.fn() } });
  const { getAnalytics } = await import('../lib/analytics');
  return { runtime: getAnalytics()!, fbq, browser };
}

afterEach(() => { vi.unstubAllGlobals(); vi.doUnmock('../lib/config'); });

describe('saved marketing preferences', () => {
  it.each([true, 'invalid', {}, []])('treats malformed saved consent %j as unanswered', async consent => {
    const { runtime } = await analyticsWith({ consent });
    expect(runtime.getSnapshot().consent).toBeNull();
    expect(runtime.getSnapshot().askConsent).toBe(true);
  });
  it.each([true, 'bad', [], { utm_source: { invalid: true }, unknown: 'ignore' }])('recovers from malformed campaign %j', async campaign => {
    const { runtime } = await analyticsWith({ campaign, search: '?utm_source=test' });
    expect(() => runtime.captureLocation()).not.toThrow();
    expect(runtime.getSnapshot().campaign).toEqual({ utm_source: 'test', landing_page: '/products' });
  });
  it('restores Meta and TikTok consent after a visitor accepts again', async () => {
    const { runtime, fbq, browser } = await analyticsWith();
    runtime.setConsent('all');
    runtime.setConsent('necessary');
    runtime.setConsent('all');
    expect(fbq.mock.calls).toContainEqual(['consent', 'revoke']);
    expect(fbq.mock.calls).toContainEqual(['consent', 'grant']);
    expect(browser.ttq).toContainEqual(['revokeConsent']);
    expect(browser.ttq).toContainEqual(['grantConsent']);
  });
  it('does not load platforms before consent and never sends simulated purchases', async () => {
    const { runtime, fbq } = await analyticsWith();
    runtime.emit('view_item', {});
    expect(fbq).not.toHaveBeenCalled();
    runtime.setConsent('all');
    const count = fbq.mock.calls.length;
    runtime.emit('purchase_demo', {});
    expect(fbq.mock.calls).toHaveLength(count);
    expect(runtime.getSnapshot().log[0].status).toBe('Demo order, not sent to ad platforms');
  });
});
