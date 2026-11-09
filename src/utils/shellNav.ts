/**
 * Logika murni untuk "shell" aplikasi (banner langganan, tab nav bawah, tombol Kembali).
 * Dipisah dari MainLayout agar bisa dites.
 */

// ── Banner langganan ────────────────────────────────────────────────────────

export const SUB_BANNER_STORAGE_KEY = 'icuhelper:sub-banner-seen';
/** Banner muncul lagi bila sisa masa aktif ≤ batas ini (hari). */
export const SUB_BANNER_EXPIRY_WARN_DAYS = 7;

/** Kunci unik per kombinasi status + tanggal kedaluwarsa (YYYY-MM-DD). */
export function subscriptionBannerKey(status: string, expiredAt: Date | null): string {
  const exp = expiredAt && !isNaN(expiredAt.getTime()) ? expiredAt.toISOString().slice(0, 10) : 'none';
  return `${status}|${exp}`;
}

/** True bila masa aktif tersisa ≤ batas peringatan (termasuk yang sudah lewat). */
export function isNearExpiry(expiredAt: Date | null, now: Date, warnDays = SUB_BANNER_EXPIRY_WARN_DAYS): boolean {
  if (!expiredAt || isNaN(expiredAt.getTime())) return false;
  return expiredAt.getTime() - now.getTime() <= warnDays * 86_400_000;
}

/**
 * Tampilkan banner langganan?
 * - Hanya untuk status 'trial' / 'active'.
 * - Masa aktif ≤ 7 hari → selalu tampil (peringatan penting), walau pernah dilihat.
 * - Selain itu tampil SEKALI per kunci status (status + tgl kedaluwarsa); kunci berubah → tampil lagi.
 */
export function shouldShowSubscriptionBanner(
  status: string,
  expiredAt: Date | null,
  seenKey: string | null,
  now: Date,
): boolean {
  if (status !== 'trial' && status !== 'active') return false;
  if (isNearExpiry(expiredAt, now)) return true;
  return seenKey !== subscriptionBannerKey(status, expiredAt);
}

export function readSeenBannerKey(): string | null {
  try {
    return localStorage.getItem(SUB_BANNER_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function writeSeenBannerKey(key: string): void {
  try {
    localStorage.setItem(SUB_BANNER_STORAGE_KEY, key);
  } catch {
    /* storage diblok (mode privat) — banner cukup disembunyikan untuk sesi ini */
  }
}

// ── Tab nav bawah ponsel ───────────────────────────────────────────────────

export type MobileTabId = 'home' | 'patients' | 'calculator' | 'scoring' | 'more';

const TAB_PREFIX: { id: Exclude<MobileTabId, 'home' | 'more'>; path: string }[] = [
  { id: 'patients', path: '/patients' },
  { id: 'calculator', path: '/calculator' },
  { id: 'scoring', path: '/scoring' },
];

/** Tab yang menyala untuk rute tertentu. Rute tanpa tab sendiri → 'more' (Lainnya). */
export function activeMobileTab(pathname: string): MobileTabId {
  if (pathname === '/' || pathname === '') return 'home';
  for (const t of TAB_PREFIX) {
    if (pathname === t.path || pathname.startsWith(t.path + '/')) return t.id;
  }
  return 'more';
}

// ── Tombol Kembali ─────────────────────────────────────────────────────────

/** Induk sebuah rute: buang segmen terakhir ('/calculator/pf' → '/calculator', '/about' → '/'). */
export function parentPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length <= 1) return '/';
  return '/' + parts.slice(0, -1).join('/');
}

/**
 * Apakah ada riwayat navigasi DI DALAM app untuk `navigate(-1)`?
 * React Router menyimpan indeks entri di `history.state.idx` (0 = entri pertama sesi app).
 */
export function hasInAppHistory(historyState: unknown): boolean {
  if (!historyState || typeof historyState !== 'object') return false;
  const idx = (historyState as { idx?: unknown }).idx;
  return typeof idx === 'number' && idx > 0;
}
