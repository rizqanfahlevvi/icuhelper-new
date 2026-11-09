// Ringkasan satu baris untuk bilah hasil Kalkulator Elektrolit.
// Hanya memakai ambang/klasifikasi yang SUDAH ada di util & komponen hasil (tidak menambah ambang baru).
import type { NaResult } from './sodium';
import { hypoKSeverity, hyperKSeverity, correctedCalcium, mgMgdlToMeq } from './electrolytes';

export type SummaryTone = 'neutral' | 'good' | 'warn' | 'bad';
export interface ElektroSummary { text: string; tone: SummaryTone }

// Titik desimal, sama dengan tampilan rincian hasil (fmt di ElektroUI).
const f = (n: number, d: number) => n.toFixed(d);

/** Natrium: tipe dari computeNa (hipo <135 · hiper >145 · normal), memakai Na terkoreksi glukosa bila ada. */
export function naSummary(r: NaResult | null): ElektroSummary | null {
  if (!r) return null;
  const na = `Na${r.hasHyper ? ' terkoreksi' : ''} ${f(r.calcN, 1)}`;
  if (r.type === 'hipo') return { text: `Hiponatremia · ${na}`, tone: 'bad' };
  if (r.type === 'hiper') return { text: `Hipernatremia · ${na}`, tone: 'bad' };
  return { text: `${na} · rentang normal`, tone: 'good' };
}

/** Kalium: normal 3,5–5,0 (KaliumResult); derajat dari hypoKSeverity / hyperKSeverity. */
export function kSummary(kRaw: string): ElektroSummary | null {
  const k = parseFloat(kRaw);
  if (!(k > 0)) return null;
  const v = `K ${f(k, 1)}`;
  if (k < 3.5) return { text: `Hipokalemia ${hypoKSeverity(k)} · ${v}`, tone: k < 3.0 ? 'bad' : 'warn' };
  if (k > 5.0) {
    const sev = hyperKSeverity(k);
    return sev === 'batas'
      ? { text: `${v} · di atas normal`, tone: 'warn' }
      : { text: `Hiperkalemia ${sev} · ${v}`, tone: sev === 'ringan' ? 'warn' : 'bad' };
  }
  return { text: `${v} · rentang normal`, tone: 'good' };
}

/**
 * Kalsium: hanya menampilkan angka (Ca terkoreksi albumin bila albumin diisi). Interpretasi tidak diringkas
 * karena bergantung pada Ca ion (KalsiumResult) — lihat rincian.
 */
export function caSummary(caRaw: string, albRaw: string): ElektroSummary | null {
  const ca = parseFloat(caRaw);
  if (!(ca > 0)) return null;
  const alb = parseFloat(albRaw);
  if (alb > 0 && alb <= 7) return { text: `Ca terkoreksi ${f(correctedCalcium(ca, alb), 2)} mg/dL`, tone: 'neutral' };
  return { text: `Ca total ${f(ca, 1)} mg/dL`, tone: 'neutral' };
}

/** Magnesium: angka + konversi mEq/L; interpretasi di rincian. */
export function mgSummary(mgRaw: string): ElektroSummary | null {
  const mg = parseFloat(mgRaw);
  if (!(mg > 0)) return null;
  return { text: `Mg ${f(mg, 1)} mg/dL (${f(mgMgdlToMeq(mg), 2)} mEq/L)`, tone: 'neutral' };
}
