import { describe, it, expect } from 'vitest';
import {
  activeMobileTab, parentPath, hasInAppHistory, shouldShowSubscriptionBanner,
  subscriptionBannerKey, isNearExpiry,
} from '../utils/shellNav';

const NOW = new Date('2026-11-09T08:00:00Z');
const day = 86_400_000;

describe('activeMobileTab', () => {
  it('memetakan rute ke tab', () => {
    expect(activeMobileTab('/')).toBe('home');
    expect(activeMobileTab('/patients')).toBe('patients');
    expect(activeMobileTab('/calculator')).toBe('calculator');
    expect(activeMobileTab('/calculator/pf')).toBe('calculator');
    expect(activeMobileTab('/scoring/sofa')).toBe('scoring');
  });
  it('rute tanpa tab sendiri → Lainnya', () => {
    for (const r of ['/pharmacy', '/abg', '/theory/sepsis', '/riwayat', '/settings', '/reference', '/calculatorx']) {
      expect(activeMobileTab(r)).toBe('more');
    }
  });
});

describe('parentPath & hasInAppHistory', () => {
  it('membuang segmen terakhir', () => {
    expect(parentPath('/calculator/pf')).toBe('/calculator');
    expect(parentPath('/theory/sepsis')).toBe('/theory');
    expect(parentPath('/about')).toBe('/');
    expect(parentPath('/')).toBe('/');
  });
  it('idx 0 / tanpa state = tidak ada riwayat dalam app', () => {
    expect(hasInAppHistory(null)).toBe(false);
    expect(hasInAppHistory({ idx: 0 })).toBe(false);
    expect(hasInAppHistory({ usr: null })).toBe(false);
    expect(hasInAppHistory({ idx: 3 })).toBe(true);
  });
});

describe('banner langganan', () => {
  const far = new Date(NOW.getTime() + 60 * day);
  it('tampil sekali per status+kedaluwarsa', () => {
    expect(shouldShowSubscriptionBanner('active', far, null, NOW)).toBe(true);
    const k = subscriptionBannerKey('active', far);
    expect(shouldShowSubscriptionBanner('active', far, k, NOW)).toBe(false);
  });
  it('tampil lagi bila status atau tanggal berubah', () => {
    const k = subscriptionBannerKey('trial', far);
    expect(shouldShowSubscriptionBanner('active', far, k, NOW)).toBe(true);
    const later = new Date(far.getTime() + 30 * day);
    expect(shouldShowSubscriptionBanner('trial', later, k, NOW)).toBe(true);
  });
  it('selalu tampil bila sisa ≤7 hari', () => {
    const soon = new Date(NOW.getTime() + 5 * day);
    expect(isNearExpiry(soon, NOW)).toBe(true);
    expect(shouldShowSubscriptionBanner('trial', soon, subscriptionBannerKey('trial', soon), NOW)).toBe(true);
    expect(isNearExpiry(new Date(NOW.getTime() + 8 * day), NOW)).toBe(false);
  });
  it('status lain / tanpa tanggal', () => {
    expect(shouldShowSubscriptionBanner('expired', far, null, NOW)).toBe(false);
    expect(shouldShowSubscriptionBanner('active', null, subscriptionBannerKey('active', null), NOW)).toBe(false);
  });
});
