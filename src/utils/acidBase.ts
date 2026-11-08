// Util perhitungan asam-basa (fungsi murni, mudah dites).
// Rujukan: Kraut JA, Madias NE. Nat Rev Nephrol 2012 · Adrogué HJ, Madias NE. NEJM 1998
// · Fernandez PC, Cohen RM, Feldman GM. Kidney Int 1989;36:747 (ruang distribusi bikarbonat)
// · Seifter JL. NEJM 2014 · Berend K. NEJM 2018.

/**
 * Defisit bikarbonat (mEq).
 * Defisit = faktor ruang distribusi (L/kg) × BB (kg) × (HCO₃ target − HCO₃ aktual).
 */
export function bicarbDeficit(factorLPerKg: number, weightKg: number, targetHco3: number, actualHco3: number): number {
  return factorLPerKg * weightKg * (targetHco3 - actualHco3);
}

/**
 * Perkiraan KONTINU ruang distribusi bikarbonat (L/kg) — MEMBESAR saat asidosis makin berat.
 * Fernandez PC, Cohen RM, Feldman GM. Kidney Int 1989;36:747 → space ≈ 0.4 + 2.6 / [HCO₃].
 * Contoh: HCO₃ 24 → 0.51 · HCO₃ 10 → 0.66 · HCO₃ 5 → 0.92.
 */
export function bicarbSpaceFernandez(actualHco3: number): number {
  if (!(actualHco3 > 0)) return 0.5;
  return 0.4 + 2.6 / actualHco3;
}

/**
 * Faktor DISKRET yang disarankan berdasarkan beratnya asidosis (dari HCO₃ aktual).
 * Konsisten dengan konsep Fernandez: ruang distribusi naik saat HCO₃ turun.
 */
export function recommendBicarbFactor(actualHco3: number): { factor: number; label: string } {
  if (!(actualHco3 > 0)) return { factor: 0.5, label: 'Default' };
  if (actualHco3 < 6) return { factor: 0.8, label: 'Asidosis berat (HCO₃ <6)' };
  if (actualHco3 < 10) return { factor: 0.6, label: 'Asidosis sedang–berat (HCO₃ 6–<10)' };
  return { factor: 0.5, label: 'Asidosis ringan–sedang (HCO₃ ≥10)' };
}

// ─────────────────────────────────────────────────────────────────────────────
// ANION GAP & DELTA RATIO — dipakai bersama oleh ABG Interpreter, tab AG + Δ/Δ,
// dan Kalkulator Anion Gap (satu sumber kebenaran, keputusan pemilik 2026-11):
//   · Albumin normal acuan koreksi = 4,0 g/dL (faktor 2,5 mEq/L per g/dL).
//     Rujukan: Figge J et al. Crit Care Med 1998;26:1807 · Kraut JA, Madias NE.
//     CJASN 2007;2:162 (penurunan albumin 1 g/dL ≈ AG turun 2,3–2,5 mEq/L).
//   · Batas atas AG normal BISA DIATUR sesuai lab RS (default 12; analyzer ISE
//     modern sering punya rentang lebih rendah — Kraut & Madias 2007).
//   · Delta ratio: 4 pita Wrenn K. Ann Emerg Med 1990;19:1310, dengan catatan
//     kehati-hatian Rastegar A. JASN 2007;18:2429 (rentang rasio lebar).
// ─────────────────────────────────────────────────────────────────────────────

export const AG_ALBUMIN_NORMAL_G_DL = 4.0;
export const AG_ALBUMIN_FACTOR = 2.5;
export const AG_UPPER_NORMAL_DEFAULT = 12;
export const HCO3_NORMAL = 24;
/** Albumin > nilai ini (g/dL) hampir pasti salah satuan (g/L) — koreksi tidak dihitung. */
export const ALBUMIN_MAX_PLAUSIBLE_G_DL = 7;

/** Batas atas AG normal yang dipakai: nilai pengguna bila wajar, selain itu default 12. */
export function normalizeAgUpper(value: number | null | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 && value < 40 ? value : AG_UPPER_NORMAL_DEFAULT;
}

export interface AnionGapResult {
  ag: number;
  /** AG terkoreksi albumin; null bila albumin tidak diisi / tidak wajar. */
  agCorr: number | null;
  /** AG yang dipakai untuk interpretasi (terkoreksi bila ada). */
  effective: number;
  high: boolean;
  upper: number;
  /** Albumin diisi tetapi > 7 g/dL → kemungkinan satuan g/L. */
  albuminSuspectUnit: boolean;
}

export function anionGap(
  na: number,
  cl: number,
  hco3: number,
  albuminGdl?: number | null,
  upperNormal: number = AG_UPPER_NORMAL_DEFAULT,
): AnionGapResult | null {
  if (![na, cl, hco3].every(Number.isFinite)) return null;
  const upper = normalizeAgUpper(upperNormal);
  const ag = na - (cl + hco3);
  const albGiven = typeof albuminGdl === 'number' && Number.isFinite(albuminGdl) && albuminGdl > 0;
  const albuminSuspectUnit = albGiven && (albuminGdl as number) > ALBUMIN_MAX_PLAUSIBLE_G_DL;
  const agCorr = albGiven && !albuminSuspectUnit
    ? ag + AG_ALBUMIN_FACTOR * (AG_ALBUMIN_NORMAL_G_DL - (albuminGdl as number))
    : null;
  const effective = agCorr ?? ag;
  return { ag, agCorr, effective, high: effective > upper, upper, albuminSuspectUnit };
}

export type DeltaBand = 'nagma' | 'campuran' | 'murni' | 'alkalosis';

export const DELTA_BAND_LABEL: Record<DeltaBand, string> = {
  nagma: '<0,4 → NAGMA hiperkloremik dominan',
  campuran: '0,4–0,8 → Campuran HAGMA + NAGMA',
  murni: '0,8–2,0 → HAGMA murni (tanpa gangguan metabolik lain)',
  alkalosis: '>2,0 → HAGMA + alkalosis metabolik bersamaan (atau HCO₃⁻ awal sudah tinggi, mis. asidosis respiratorik kronik)',
};

export const DELTA_RATIO_CAUTION =
  'Rasio rata-rata mendekati 1 tetapi rentangnya lebar antar pasien — pakai sebagai petunjuk, bukan diagnosis pasti gangguan campuran (Rastegar 2007).';

export interface DeltaRatioResult {
  deltaAg: number;
  deltaHco3: number;
  /** null bila ΔHCO₃ ≤ 0 (HCO₃⁻ tidak turun) — rasio tidak terdefinisi. */
  ratio: number | null;
  band: DeltaBand | null;
}

/**
 * Delta ratio = (AG − AG normal) ÷ (24 − HCO₃⁻). AG normal = batas atas yang diatur (default 12).
 * Bila HCO₃⁻ ≥ 24 padahal AG naik → rasio tidak terdefinisi, namun polanya (AG naik tanpa
 * penurunan HCO₃⁻) mengarah ke HAGMA + alkalosis metabolik bersamaan → band 'alkalosis'.
 */
export function deltaRatio(effectiveAg: number, hco3: number, agNormal: number = AG_UPPER_NORMAL_DEFAULT): DeltaRatioResult {
  const deltaAg = effectiveAg - normalizeAgUpper(agNormal);
  const deltaHco3 = HCO3_NORMAL - hco3;
  if (!(deltaHco3 > 0)) {
    return { deltaAg, deltaHco3, ratio: null, band: deltaAg > 0 ? 'alkalosis' : null };
  }
  const ratio = deltaAg / deltaHco3;
  const band: DeltaBand = ratio < 0.4 ? 'nagma' : ratio < 0.8 ? 'campuran' : ratio <= 2 ? 'murni' : 'alkalosis';
  return { deltaAg, deltaHco3, ratio, band };
}

// ─────────────────────────────────────────────────────────────────────────────
// HCl untuk alkalosis metabolik berat — keputusan pemilik 2026-11: faktor 0,5 × BB
// (ruang distribusi bikarbonat ≈ 50% BB). Defisit H⁺ (mEq) = 0,5 × BB × (HCO₃ aktual − HCO₃ target).
// Laju maksimal 0,2 mEq/kg/jam via vena sentral; larutan 0,1 N (0,1 mEq/mL) — konsentrasi
// >0,1 N dilaporkan korosif walau lewat CVC. Target HCO₃ TIDAK ada angka baku → diisi klinisi.
// Rumus tidak memperhitungkan kehilangan asam berlanjut (mis. NGT) → pantau AGD/elektrolit serial.
// Rujukan: medicalalgorithms.com (H⁺ deficit, faktor 0,5–0,6, laju ≤0,2 mEq/kg/jam) ·
// GlobalRPh HCl (0,1–0,2 mEq/kg/jam, 0,1 N) · Galla JH. JASN 2000;11:369.
// ─────────────────────────────────────────────────────────────────────────────

export const HCL_SPACE_FACTOR = 0.5;
export const HCL_MAX_RATE_MEQ_KG_H = 0.2;
export const HCL_01N_MEQ_PER_ML = 0.1;

export interface HclPlan {
  doseMeq: number;
  volume01NmL: number;
  maxRateMeqH: number;
  maxRateMlH: number;
  /** Durasi minimal agar laju ≤ 0,2 mEq/kg/jam. */
  minHours: number;
}

export function hclPlan(weightKg: number, hco3Actual: number, hco3Target: number): HclPlan | null {
  if (!(weightKg > 0) || !Number.isFinite(hco3Actual) || !Number.isFinite(hco3Target)) return null;
  if (!(hco3Target < hco3Actual)) return null;
  const doseMeq = HCL_SPACE_FACTOR * weightKg * (hco3Actual - hco3Target);
  const maxRateMeqH = HCL_MAX_RATE_MEQ_KG_H * weightKg;
  return {
    doseMeq,
    volume01NmL: doseMeq / HCL_01N_MEQ_PER_ML,
    maxRateMeqH,
    maxRateMlH: maxRateMeqH / HCL_01N_MEQ_PER_ML,
    minHours: doseMeq / maxRateMeqH,
  };
}
