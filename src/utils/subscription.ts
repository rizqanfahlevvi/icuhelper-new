export interface SubscriptionState {
  label: string;
  badgeClass: string;
  isExpired: boolean;
  expiredAt: Date | null;
}

/**
 * Safely converts any representation of a subscription expiry date to a Date.
 * Handles: Firestore Timestamp, serialized Timestamp {seconds}, Date, ISO string, Unix ms number.
 */
export function parseExpiryDate(raw: unknown): Date | null {
  if (!raw) return null;

  // Firestore Timestamp (live or from onSnapshot)
  if (typeof (raw as any).toDate === 'function') {
    return (raw as any).toDate();
  }
  // Native Date
  if (raw instanceof Date) return raw;
  // String or number (ISO string / Unix ms)
  if (typeof raw === 'string' || typeof raw === 'number') {
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
  }
  // Serialized Firestore Timestamp plain object { seconds, nanoseconds }
  if (typeof (raw as any).seconds === 'number') {
    return new Date((raw as any).seconds * 1000);
  }

  return null;
}

/**
 * Derives display label, badge CSS classes, expiry state, and parsed expiry date
 * from a user profile's subscription fields.
 */
export function getSubscriptionState(profile: {
  subscriptionStatus?: string | null;
  subscriptionExpiredAt?: unknown;
}): SubscriptionState {
  const expiredAt = parseExpiryDate(profile?.subscriptionExpiredAt);
  const status = (profile?.subscriptionStatus ?? 'inactive').trim().toLowerCase();

  // A past expiry date overrides the stored status string
  if (expiredAt && expiredAt < new Date()) {
    return {
      label: 'Kedaluwarsa',
      badgeClass: 'bg-red-500/10 text-red-500 border border-red-500/20',
      isExpired: true,
      expiredAt,
    };
  }

  switch (status) {
    case 'active':
      return {
        label: 'Aktif',
        badgeClass: 'bg-[var(--sys-green)]/10 text-[var(--sys-green)] border border-[var(--sys-green)]/20',
        isExpired: false,
        expiredAt,
      };
    case 'trial':
      return {
        label: 'Masa Trial',
        badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
        isExpired: false,
        expiredAt,
      };
    case 'expired':
      return {
        label: 'Kedaluwarsa',
        badgeClass: 'bg-red-500/10 text-red-500 border border-red-500/20',
        isExpired: true,
        expiredAt,
      };
    default:
      return {
        label: 'Tidak Aktif',
        badgeClass: 'bg-gray-500/10 text-gray-500 dark:text-gray-400 border border-gray-500/20',
        isExpired: false,
        expiredAt,
      };
  }
}
