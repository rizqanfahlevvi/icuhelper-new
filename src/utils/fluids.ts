/**
 * Kebutuhan cairan harian dewasa — logika murni.
 *
 * Pendekatan (disetujui): TOTAL = maintenance + kehilangan ABNORMAL saja.
 *  - Maintenance 25–30 mL/kg/hari (NICE CG174; Malbrain 2018) SUDAH mencakup kehilangan
 *    normal: urine obligat + insensible water loss (IWL). Malbrain 2018: pada fase stabilisasi
 *    cairan hanya untuk "ongoing maintenance in the setting of normal fluid losses (renal,
 *    gastrointestinal, insensible)" + replacement untuk kehilangan patologis yang berlanjut.
 *  - Karena itu IWL dasar dan target urine output TIDAK ditambahkan lagi (dulu dihitung ganda:
 *    70 kg → 1.750 + 840 IWL + 840 UO = 3.430 mL/hari).
 *  - Tambahan demam & diaforesis = ESTIMASI PRAKTIS (konstanta tidak tersumber guideline).
 *
 * Referensi:
 *  - NICE CG174 Intravenous fluid therapy in adults in hospital (2013, diperbarui 2017).
 *  - Malbrain MLNG et al. Ann Intensive Care 2018;8:66 (doi:10.1186/s13613-018-0402-x).
 */

export type VentMode = 'spontan' | 'ventilator' | 'hfnc';
export type SweatLevel = 'none' | 'mild' | 'moderate' | 'severe';

/** IWL dasar (mL/kg/hari) — ESTIMASI PRAKTIS, informasi saja (sudah termasuk maintenance). */
export const IWL_ML_PER_KG_DAY: Record<VentMode, number> = { spontan: 12, ventilator: 6.5, hfnc: 9 };
/** Tambahan diaforesis (mL/hari) — ESTIMASI PRAKTIS. */
export const SWEAT_EXTRA_ML: Record<SweatLevel, number> = { none: 0, mild: 200, moderate: 500, severe: 900 };
/** Tambahan demam: 10% maintenance per °C di atas 37,5 °C — ESTIMASI PRAKTIS. */
export const FEVER_EXTRA_FRACTION_PER_C = 0.1;
export const FEVER_THRESHOLD_C = 37.5;

export interface FluidRequirementInput {
  weightKg: number;
  maintPerKg: number;        // mL/kg/hari
  tempC?: number;            // kosong = normotermi
  vent: VentMode;
  sweat: SweatLevel;
  uoTargetMlKgH?: number;    // target pemantauan, TIDAK ditambahkan ke total
  ngtMl?: number;            // kehilangan abnormal terukur (mL/hari)
  drainMl?: number;
  otherMl?: number;
}

export interface FluidRequirementResult {
  maint: number;
  /** Informasi: bagian maintenance yang menggantikan IWL normal. */
  iwlBaseInfo: number;
  feverExtra: number;
  sweatExtra: number;
  ngt: number;
  drain: number;
  other: number;
  measuredLosses: number;
  total: number;
  rateMlH: number;
  perKgDay: number;
  /** Target UO (mL/jam & mL/hari) untuk pemantauan; null bila tidak diisi. */
  uoTargetMlH: number | null;
  uoTargetMlDay: number | null;
}

const nonNeg = (v: number | undefined): number => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : 0);

export function feverExtraMl(maint: number, tempC: number | undefined): number {
  if (typeof tempC !== 'number' || !Number.isFinite(tempC)) return 0;
  const delta = tempC - FEVER_THRESHOLD_C;
  return delta > 0 ? maint * FEVER_EXTRA_FRACTION_PER_C * delta : 0;
}

export function fluidRequirement(i: FluidRequirementInput): FluidRequirementResult | null {
  if (!(i.weightKg > 0) || !(i.maintPerKg > 0)) return null;
  const maint = i.weightKg * i.maintPerKg;
  const iwlBaseInfo = i.weightKg * IWL_ML_PER_KG_DAY[i.vent];
  const feverExtra = feverExtraMl(maint, i.tempC);
  const sweatExtra = SWEAT_EXTRA_ML[i.sweat];
  const ngt = nonNeg(i.ngtMl);
  const drain = nonNeg(i.drainMl);
  const other = nonNeg(i.otherMl);
  const measuredLosses = ngt + drain + other;
  const total = maint + feverExtra + sweatExtra + measuredLosses;
  const uo = nonNeg(i.uoTargetMlKgH);
  return {
    maint,
    iwlBaseInfo,
    feverExtra,
    sweatExtra,
    ngt,
    drain,
    other,
    measuredLosses,
    total,
    rateMlH: total / 24,
    perKgDay: total / i.weightKg,
    uoTargetMlH: uo > 0 ? uo * i.weightKg : null,
    uoTargetMlDay: uo > 0 ? uo * i.weightKg * 24 : null,
  };
}

/**
 * Fluid overload (%) = balans kumulatif (L) ÷ BB basal (kg) × 100.
 * Ambang 10% berhubungan dengan luaran buruk (Bouchard J et al. Kidney Int 2009;76:422;
 * Malbrain 2018).
 */
export function fluidOverloadFromBalance(cumulativeMl: number, baselineKg: number): number | null {
  if (!Number.isFinite(cumulativeMl) || !(baselineKg > 0)) return null;
  return (cumulativeMl / 1000 / baselineKg) * 100;
}

/** Alternatif berbasis berat badan: (BB kini − BB basal) ÷ BB basal × 100. */
export function fluidOverloadFromWeight(currentKg: number, baselineKg: number): number | null {
  if (!(currentKg > 0) || !(baselineKg > 0)) return null;
  return ((currentKg - baselineKg) / baselineKg) * 100;
}
