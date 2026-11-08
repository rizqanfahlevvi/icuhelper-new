/**
 * SOFA (Sequential Organ Failure Assessment) — logika murni.
 *
 * Referensi:
 * - Vincent JL et al. Intensive Care Med 1996;22:707 (tabel asli; vasopresor ≥1 jam, µg/kg/menit).
 * - Pandharipande PP et al. Crit Care Med 2009;37:1317 (S/F pengganti P/F untuk SOFA:
 *   log(PF) = 0,48 + 0,78·log(SF) → S/F 512/357/214/89 ≙ P/F 400/300/200/100; data SpO₂ ≤98%).
 * - Ferreira FL et al. JAMA 2001;286:1754 (mortalitas menurut SOFA awal; kohort 352 pasien, 1 pusat).
 * - Lambden S et al. Crit Care 2019;23:374 (pasien tersedasi: GCS terakhir sebelum intubasi/sedasi,
 *   bila tidak ada → 15; nilai terburuk per 24 jam).
 */

export type SofaPoints = 0 | 1 | 2 | 3 | 4;

/** P/F (mmHg). Poin 3–4 hanya bila mendapat dukungan napas (ventilasi invasif/NIV). */
export function sofaRespFromPf(pf: number, respSupport: boolean): SofaPoints {
  if (pf >= 400) return 0;
  if (pf >= 300) return 1;
  if (pf >= 200) return 2;
  if (!respSupport) return 2;
  return pf >= 100 ? 3 : 4;
}

/** Ambang S/F Pandharipande 2009 (≙ P/F 400/300/200/100). */
export const SF_THRESHOLDS = { p1: 512, p2: 357, p3: 214, p4: 89 } as const;
/** Di atas nilai ini SpO₂ berada di bagian datar kurva disosiasi → S/F tidak andal. */
export const SF_SPO2_RELIABLE_MAX = 97;

export function sofaRespFromSf(sf: number, respSupport: boolean): SofaPoints {
  if (sf >= SF_THRESHOLDS.p1) return 0;
  if (sf >= SF_THRESHOLDS.p2) return 1;
  if (sf >= SF_THRESHOLDS.p3) return 2;
  if (!respSupport) return 2;
  return sf >= SF_THRESHOLDS.p4 ? 3 : 4;
}

/** Trombosit ×10³/µL. */
export function sofaCoag(plt: number): SofaPoints {
  if (plt >= 150) return 0;
  if (plt >= 100) return 1;
  if (plt >= 50) return 2;
  if (plt >= 20) return 3;
  return 4;
}

/** Bilirubin total mg/dL. */
export function sofaLiver(bil: number): SofaPoints {
  if (bil < 1.2) return 0;
  if (bil < 2.0) return 1;
  if (bil < 6.0) return 2;
  if (bil < 12.0) return 3;
  return 4;
}

/** GCS 3–15 (bulat). Di luar rentang → null. */
export function sofaCns(gcs: number): SofaPoints | null {
  if (!Number.isFinite(gcs) || gcs < 3 || gcs > 15 || !Number.isInteger(gcs)) return null;
  if (gcs === 15) return 0;
  if (gcs >= 13) return 1;
  if (gcs >= 10) return 2;
  if (gcs >= 6) return 3;
  return 4;
}

/** Kreatinin mg/dL. */
export function sofaRenalCreatinine(cr: number): SofaPoints {
  if (cr < 1.2) return 0;
  if (cr < 2.0) return 1;
  if (cr < 3.5) return 2;
  if (cr < 5.0) return 3;
  return 4;
}

/** Urine output mL/24 jam: <500 → 3, <200 → 4 (UO ≥500 tidak menambah poin). */
export function sofaRenalUrine(uoMlPerDay: number): SofaPoints {
  if (uoMlPerDay < 200) return 4;
  if (uoMlPerDay < 500) return 3;
  return 0;
}

/** FiO₂ dari input persen/desimal → fraksi 0,21–1,0 (di luar rentang → null). */
export function normalizeFio2(raw: number, mode: 'persen' | 'desimal'): number | null {
  if (!Number.isFinite(raw)) return null;
  const f = mode === 'persen' ? raw / 100 : raw;
  return f >= 0.21 && f <= 1.0 ? f : null;
}

export interface FerreiraBand {
  range: string;
  mortality: string;
  /** Batas bawah skor untuk band ini (inklusif). */
  min: number;
}

/** Mortalitas menurut SOFA AWAL (initial) — Ferreira 2001. >11: abstrak ">90%" (tabel 95,2%). */
export const FERREIRA_INITIAL_SOFA: FerreiraBand[] = [
  { min: 0, range: '0–1', mortality: '0%' },
  { min: 2, range: '2–3', mortality: '6,4%' },
  { min: 4, range: '4–5', mortality: '20,2%' },
  { min: 6, range: '6–7', mortality: '21,5%' },
  { min: 8, range: '8–9', mortality: '33,3%' },
  { min: 10, range: '10–11', mortality: '50,0%' },
  { min: 12, range: '>11', mortality: '>90%' },
];

export function ferreiraMortality(total: number): FerreiraBand {
  let band = FERREIRA_INITIAL_SOFA[0];
  for (const b of FERREIRA_INITIAL_SOFA) if (total >= b.min) band = b;
  return band;
}

export type SofaRiskTier = 'rendah' | 'sedang' | 'tinggi' | 'sangatTinggi';

/** Pengelompokan warna saja (bukan angka baru): <10% · 20–34% · 50% · >90%. */
export function ferreiraTier(total: number): SofaRiskTier {
  if (total <= 3) return 'rendah';
  if (total <= 9) return 'sedang';
  if (total <= 11) return 'tinggi';
  return 'sangatTinggi';
}
