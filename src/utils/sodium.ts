// Util perhitungan natrium (fungsi murni, mudah dites).
// Rujukan: Adrogué HJ, Madias NE. Hypernatremia. NEJM 2000;342:1493 ·
// Sterns RH. NEJM 2015;372:55 · Miller NE, et al. Am Fam Physician 2023;108:476.

/**
 * Fraksi Total Body Water (TBW) berbasis jenis kelamin & usia (Adrogué–Madías).
 * Pria dewasa 0.60 · wanita dewasa / pria lansia 0.50 · wanita lansia 0.45.
 * Ambang lansia = 65 tahun. Bila usia tidak diisi (NaN) → diperlakukan dewasa.
 */
export function tbwFactor(sex: 'm' | 'f', ageYears: number): number {
  const elderly = ageYears >= 65;
  if (sex === 'm') return elderly ? 0.5 : 0.6;
  return elderly ? 0.45 : 0.5;
}

/** Total Body Water (liter) = BB(kg) × faktor TBW. */
export function totalBodyWater(weightKg: number, sex: 'm' | 'f', ageYears: number): number {
  return weightKg * tbwFactor(sex, ageYears);
}

/**
 * Defisit air bebas (liter) pada hipernatremia.
 * Defisit = TBW × (Na aktual ÷ Na target − 1). Na target default 140.
 */
export function freeWaterDeficit(tbwL: number, currentNa: number, targetNa = 140): number {
  return tbwL * (currentNa / targetNa - 1);
}

/**
 * Adrogué–Madías: perubahan Na serum (mEq/L) akibat pemberian 1 L infusat.
 * ΔNa/L = (Na infusat − Na serum) ÷ (TBW + 1). Nilai NEGATIF = menurunkan Na serum.
 * Estimasi awal (sistem tertutup, tidak menghitung ongoing/insensible losses).
 */
export function adrogueDeltaNaPerLiter(infusateNa: number, serumNa: number, tbwL: number): number {
  return (infusateNa - serumNa) / (tbwL + 1);
}

/**
 * Target & batas kenaikan Na pada hiponatremia kronik (mEq/L).
 * Target minimal 4–8/24 jam (4–6 bila risiko ODS tinggi) — Verbalis 2013.
 * Batas 24 jam pertama 10 (8 bila risiko ODS tinggi); tiap 24 jam berikutnya 8 — Spasovski 2014.
 */
export function hypoNaRiseLimits(highOdsRisk: boolean): { goalLo: number; goalHi: number; limit24: number; limitNext24: number } {
  return highOdsRisk
    ? { goalLo: 4, goalHi: 6, limit24: 8, limitNext24: 8 }
    : { goalLo: 4, goalHi: 8, limit24: 10, limitNext24: 8 };
}

/** Pilihan cairan untuk koreksi hipernatremia beserta kandungan Na (mEq/L). */
export const NA_FLUIDS: { id: string; label: string; na: number; note: string }[] = [
  { id: 'oral', label: 'Air oral / via NGT', na: 0, note: 'Paling fisiologis bila saluran cerna berfungsi.' },
  { id: 'd5w', label: 'D5W (Dekstrosa 5%) IV', na: 0, note: 'Untuk defisit air murni; pantau glukosa.' },
  { id: 'half', label: 'NaCl 0.45% IV', na: 77, note: 'Bila butuh volume juga; menurunkan Na lebih lambat.' },
  { id: 'ns', label: 'NaCl 0.9% IV', na: 154, note: 'Untuk hipovolemia berat dulu sampai stabil; TIDAK untuk menurunkan Na bila Na <154.' },
];

/** Koreksi Na terhadap hiperglikemia (Katz/Hillier): Na + 1.6 × (glukosa − 100)/100 bila glukosa >100 mg/dL. */
export function glucoseCorrectedNa(na: number, glucoseMgDl: number): { value: number; corrected: boolean } {
  if (!isNaN(glucoseMgDl) && glucoseMgDl > 100) return { value: na + 1.6 * ((glucoseMgDl - 100) / 100), corrected: true };
  return { value: na, corrected: false };
}

export interface NaInput {
  weightKg: number; na: number; glucose: number; sex: 'm' | 'f'; age: number; onset: string;
  fluidId: string; odsRiskFactors: number; riseTarget: number; hyperTargetNa: number; hyperDropPer24: number;
}

/**
 * Perhitungan lengkap koreksi Na (hipo/hiper) dari input — fungsi murni.
 * Hipo: defisit Na 24 jam = TBW × ΔNa target; volume NaCl 3% via metode defisit & Adrogué–Madías;
 *       konteks defisit total ke 140 = TBW × (140 − Na) (TIDAK diberikan sekaligus).
 * Hiper: defisit air bebas = TBW × (Na/Na target − 1); volume cairan hari ini via Adrogué–Madías.
 */
export function computeNa(i: NaInput) {
  if (!(i.weightKg > 0) || !(i.na > 0)) return null;
  const g = glucoseCorrectedNa(i.na, i.glucose);
  const calcN = g.value;
  const tbwF = tbwFactor(i.sex, i.age);
  const tbw = i.weightKg * tbwF;
  const naT = 140;
  const base = { naMeasured: i.na, calcN, hasHyper: g.corrected, tbwF, tbw, w: i.weightKg };

  if (calcN < 135) {
    const odsAuto = calcN <= 105;
    const highOdsRisk = odsAuto || i.odsRiskFactors > 0;
    const lim = hypoNaRiseLimits(highOdsRisk);
    const rise = i.riseTarget > 0 ? i.riseTarget : 6;
    const d = Math.min(rise, naT - calcN);
    const deficit = d * tbw;                        // mEq Na untuk ΔNa 24 jam
    const v = (deficit * 1000) / 513;               // mL NaCl 3% (metode defisit)
    const amPerLiter = (513 - calcN) / (tbw + 1);   // Adrogué–Madías: ΔNa per 1 L NaCl 3%
    const vAM = (d / amPerLiter) * 1000;
    const totalDeficit = (naT - calcN) * tbw;       // konteks: defisit total ke 140
    return {
      type: 'hipo' as const, ...base,
      lim, rise, d, tgt: calcN + d, riseOverGoal: rise > lim.goalHi, riseOverLimit: rise > lim.limit24,
      highOdsRisk, odsAuto, isProfound: calcN < 125,
      bioClass: calcN < 125 ? 'berat (<125)' : calcN < 130 ? 'sedang (125–129)' : 'ringan (130–134)',
      deficit, v, rate: v / 24, vAM, rateAM: vAM / 24, amPerLiter,
      rateMax: (0.5 * tbw * 1000) / 513,            // mL/jam NaCl 3% setara +0.5 mEq/L/jam (metode defisit)
      totalDeficit, daysTo140: Math.ceil((naT - calcN) / Math.min(rise, lim.limit24)),
    };
  }
  if (calcN > 145) {
    const targetNa = i.hyperTargetNa >= 135 && i.hyperTargetNa <= 150 ? i.hyperTargetNa : naT;
    const deficit = Math.max(0, freeWaterDeficit(tbw, calcN, targetNa)); // L
    const maxDropPer24 = i.hyperDropPer24 > 0 ? i.hyperDropPer24 : (i.onset === 'akut' ? 24 : 10);
    const totalDrop = Math.max(0, calcN - targetNa);
    const targetDrop = Math.min(totalDrop, maxDropPer24);
    const fluid = NA_FLUIDS.find(f => f.id === i.fluidId) ?? NA_FLUIDS[1];
    const dNaPerL = adrogueDeltaNaPerLiter(fluid.na, calcN, tbw);
    const lowersNa = dNaPerL < 0;
    const volForTarget = lowersNa ? targetDrop / -dNaPerL : null; // L
    return {
      type: 'hiper' as const, ...base,
      targetNa, deficit, maxDropPer24, dropOverGuideline: i.onset !== 'akut' && maxDropPer24 > 10,
      totalDrop, targetDrop, days: Math.max(1, Math.ceil(totalDrop / maxDropPer24)),
      fluid, dNaPerL, lowersNa, volForTarget,
      rateMlHr: volForTarget !== null ? (volForTarget * 1000) / 24 : null,
    };
  }
  return { type: 'normal' as const, ...base };
}
export type NaResult = NonNullable<ReturnType<typeof computeNa>>;
