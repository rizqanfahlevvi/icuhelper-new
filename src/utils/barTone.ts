/**
 * Pemetaan warna hasil yang SUDAH dipakai halaman (kelas Tailwind) → nada bilah hasil (CalcActionBar).
 * Tidak menambah ambang klinis baru: nada hanya mengikuti warna interpretasi yang ada di halaman.
 */
export type BarTone = 'neutral' | 'good' | 'warn' | 'bad' | 'info';

export function toneFromColorClass(cls: string | null | undefined): BarTone {
  if (!cls) return 'neutral';
  if (/(?:text|bg|border)-(?:red|rose)-|destructive|sys-red/.test(cls)) return 'bad';
  if (/(?:text|bg|border)-(?:orange|amber|yellow)-|sys-orange/.test(cls)) return 'warn';
  if (/(?:text|bg|border)-(?:green|emerald|teal)-|sys-green/.test(cls)) return 'good';
  if (/(?:text|bg|border)-(?:blue|indigo|purple|violet|sky|cyan)-|sys-blue/.test(cls)) return 'info';
  return 'neutral';
}

/** Tanda +/− untuk skor bertanda (mis. RASS). */
export function signed(n: number): string {
  return n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : '0';
}
