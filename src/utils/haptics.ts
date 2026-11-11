import { useSettingsStore } from '../store/settingsStore';

/** Pola getar (ms). Pendek & ringan agar tidak mengganggu di samping pasien. */
export const HAPTIC_PATTERNS = {
  tap: 10,
  success: 25,
  warning: [40, 60, 40],
} as const;

export type HapticKind = keyof typeof HAPTIC_PATTERNS;

/** True bila perangkat/browser mendukung getar (Android Chrome ya; iPhone/Safari tidak). */
export function hapticsSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

/** Getar sesuai pengaturan "Feedback Getaran". Aman dipanggil di mana saja (no-op bila tak didukung). */
export function haptic(kind: HapticKind = 'tap'): void {
  if (!hapticsSupported()) return;
  if (!useSettingsStore.getState().vibrationEnabled) return;
  try {
    const p = HAPTIC_PATTERNS[kind];
    navigator.vibrate(typeof p === 'number' ? p : [...p]);
  } catch { /* beberapa browser melempar bila tanpa interaksi pengguna */ }
}
