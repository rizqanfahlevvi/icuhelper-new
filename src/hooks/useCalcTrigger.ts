import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { haptic } from '../utils/haptics';

/** Input wajib untuk validasi tombol Hitung. `id` = id elemen input (untuk gulir & fokus). */
export interface RequiredInput {
  id: string;
  label: string;
  filled: boolean;
}

interface Options {
  /** Fungsi hitung halaman (mengisi state hasil; null bila input belum cukup). */
  compute: () => void;
  /** Semua nilai input yang memengaruhi hasil. Setelah Hitung pertama, perubahan nilai → hitung ulang otomatis. */
  deps: readonly unknown[];
  required?: RequiredInput[];
}

/**
 * Pola "Hitung sekali, lalu hidup": sebelum ditekan hasil tidak tampil; setelah Hitung pertama hasil
 * selalu dihitung ulang saat input berubah, sehingga tidak pernah ada hasil basi di layar.
 */
export function useCalcTrigger({ compute, deps, required = [] }: Options) {
  const [armed, setArmed] = useState(false);
  const computeRef = useRef(compute);
  computeRef.current = compute;

  // Hitung ulang otomatis setelah aktif. (deps sengaja di-spread: daftar nilai input milik halaman.)
  useEffect(() => {
    if (armed) computeRef.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armed, ...deps]);

  const missing = useMemo(() => required.filter(r => !r.filled), [required]);

  const trigger = useCallback(() => {
    setArmed(true);
    computeRef.current();
    const first = required.find(r => !r.filled);
    if (first) { haptic('warning'); focusInput(first.id); }
    else haptic('success');
  }, [required]);

  const reset = useCallback(() => setArmed(false), []);

  /** True bila input `id` wajib, kosong, dan pengguna sudah menekan Hitung (untuk penanda merah). */
  const isMissing = useCallback((id: string) => armed && missing.some(m => m.id === id), [armed, missing]);

  return { armed, trigger, reset, missing: armed ? missing : [], isMissing };
}

export function focusInput(id: string) {
  const el = typeof document !== 'undefined' ? document.getElementById(id) : null;
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
    el.focus({ preventScroll: true });
  }
}

export function scrollToId(id: string) {
  const el = typeof document !== 'undefined' ? document.getElementById(id) : null;
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
