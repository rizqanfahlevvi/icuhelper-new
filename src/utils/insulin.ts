/**
 * Insulin basal-bolus-koreksi (pasien rawat inap NON-kritis) — logika murni.
 *
 * TDD awal berbasis BB:
 *  - RABBIT-2 (Umpierrez GE et al. Diabetes Care 2007;30:2181; DM tipe 2 non-ICU, naif insulin):
 *    0,4 U/kg/hari bila GDS 140–200 mg/dL; 0,5 U/kg/hari bila GDS 201–400 mg/dL;
 *    50% glargine 1×/hari + 50% rapid dibagi sebelum makan.
 *  - RABBIT-2 Surgery (Umpierrez GE et al. Diabetes Care 2011;34:256): TDD diturunkan ke
 *    0,3 U/kg pada usia ≥70 tahun dan/atau kreatinin serum ≥2,0 mg/dL.
 *  - Pasien kritis: ADA Standards of Care (Diabetes Care in the Hospital) → insulin infus IV;
 *    estimasi SC berbasis BB TIDAK dihitung (hanya bila TDD dari kebutuhan IV diisi).
 *  - Steroid 0,6 U/kg = estimasi praktis (tidak tersumber RCT).
 *  - Faktor koreksi "aturan 1800" (1800 ÷ TDD) = heuristik praktis.
 */

export type InsulinCondition = 'normal' | 'steroid' | 'ginjal' | 'lansia' | 'kritis';
export type MealStatus = 'makan' | 'sebagian' | 'puasa';

export interface TddFactor {
  factor: number | null;
  source: string;
  sourced: boolean;
}

export function weightBasedTddFactor(gds: number, cond: InsulinCondition): TddFactor {
  if (cond === 'kritis') {
    return { factor: null, sourced: true, source: 'Pasien kritis: ADA menganjurkan insulin infus IV — estimasi SC berbasis BB tidak dihitung.' };
  }
  if (cond === 'lansia' || cond === 'ginjal') {
    return { factor: 0.3, sourced: true, source: 'RABBIT-2 Surgery: usia ≥70 th dan/atau kreatinin ≥2,0 mg/dL → 0,3 U/kg/hari.' };
  }
  if (cond === 'steroid') {
    return { factor: 0.6, sourced: false, source: 'Steroid 0,6 U/kg/hari = estimasi praktis (tidak tersumber RCT) — titrasi ketat menurut pola GDS.' };
  }
  return gds <= 200
    ? { factor: 0.4, sourced: true, source: 'RABBIT-2: GDS 140–200 mg/dL → 0,4 U/kg/hari.' }
    : { factor: 0.5, sourced: true, source: 'RABBIT-2: GDS 201–400 mg/dL → 0,5 U/kg/hari.' };
}

export interface BasalBolusInput {
  weightKg: number;
  gds: number;
  target: number;
  prevTdd?: number;
  meals: MealStatus;
  cond: InsulinCondition;
}

export type BasalBolusResult =
  | { kind: 'hypo'; gds: number }
  | { kind: 'needsIv'; factor: TddFactor }
  | {
      kind: 'ok';
      tdd: number;
      fromPrev: boolean;
      factor: TddFactor | null;
      basal: number;
      bolusTotal: number;
      mealCount: number;
      bolusPerMeal: number;
      cf: number;
      correction: number;
      totalNow: number;
      warnings: string[];
    };

const r1 = (v: number) => Math.round(v * 10) / 10;

export function basalBolusPlan(i: BasalBolusInput): BasalBolusResult | null {
  if (!(i.weightKg > 0) || !(i.gds > 0)) return null;
  if (i.gds < 70) return { kind: 'hypo', gds: i.gds };
  const target = i.target > 0 ? i.target : 150;
  const fromPrev = typeof i.prevTdd === 'number' && Number.isFinite(i.prevTdd) && i.prevTdd > 0;
  const factor = fromPrev ? null : weightBasedTddFactor(i.gds, i.cond);
  if (!fromPrev && factor && factor.factor === null) return { kind: 'needsIv', factor };

  const tdd = fromPrev ? (i.prevTdd as number) : Math.round(i.weightKg * (factor!.factor as number));
  const basal = Math.round(tdd * 0.5);
  const bolusTotal = tdd - basal;
  const mealCount = i.meals === 'makan' ? 3 : i.meals === 'sebagian' ? 2 : 0;
  const bolusPerMeal = mealCount > 0 ? r1(bolusTotal / mealCount) : 0;
  const cf = Math.round(1800 / tdd);
  const correction = Math.max(0, r1((i.gds - target) / cf));
  const totalNow = mealCount > 0 ? r1(bolusPerMeal + correction) : correction;

  const warnings: string[] = [];
  if (i.cond === 'kritis') warnings.push('Pasien kritis: regimen yang dianjurkan adalah insulin infus IV; perhitungan SC ini hanya untuk transisi IV→SC memakai TDD dari kebutuhan insulin IV.');
  if (i.cond === 'steroid') warnings.push('Steroid: pertimbangkan NPH pagi bila steroid diberikan 1× pagi.');
  if (i.cond === 'ginjal') warnings.push('Gangguan ginjal berat/HD: eliminasi insulin lambat — mulai dosis rendah.');
  if (i.cond === 'lansia') warnings.push('Lansia: risiko hipoglikemia lebih tinggi — pertimbangkan target lebih longgar.');
  if (mealCount === 0) warnings.push('Pasien puasa/NPO: bolus makan distop, hanya basal + koreksi.');
  if (!fromPrev && i.gds < 140) warnings.push('GDS <140 mg/dL berada di bawah populasi RABBIT-2 (140–400) — inisiasi insulin umumnya tidak diperlukan (ADA: mulai bila hiperglikemia ≥180 mg/dL menetap).');
  if (i.gds > 400) warnings.push('GDS >400 mg/dL: di luar populasi RABBIT-2 — pertimbangkan insulin infus IV dan evaluasi KAD/SHH.');
  else if (i.gds > 350) warnings.push('GDS >350: pertimbangkan insulin infus IV.');

  return { kind: 'ok', tdd, fromPrev, factor, basal, bolusTotal, mealCount, bolusPerMeal, cf, correction, totalNow, warnings };
}

/**
 * Perkiraan gram glukosa untuk menaikkan GDS sebesar Δ (mg/dL): Δ × 0,2 × BB ÷ 100.
 * ESTIMASI PRAKTIS (asumsi volume distribusi glukosa ±0,2 L/kg) — tidak tersumber guideline.
 */
export function glucoseGramsEstimate(deltaMgDl: number, weightKg: number): number {
  if (!(deltaMgDl > 0) || !(weightKg > 0)) return 0;
  return r1((deltaMgDl * 0.2 * weightKg) / 100);
}
