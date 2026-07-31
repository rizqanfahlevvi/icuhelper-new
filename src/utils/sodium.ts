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

/** Pilihan cairan untuk koreksi hipernatremia beserta kandungan Na (mEq/L). */
export const NA_FLUIDS: { id: string; label: string; na: number; note: string }[] = [
  { id: 'oral', label: 'Air oral / via NGT', na: 0, note: 'Paling fisiologis bila saluran cerna berfungsi.' },
  { id: 'd5w', label: 'D5W (Dekstrosa 5%) IV', na: 0, note: 'Untuk defisit air murni; pantau glukosa.' },
  { id: 'half', label: 'NaCl 0.45% IV', na: 77, note: 'Bila butuh volume juga; menurunkan Na lebih lambat.' },
  { id: 'ns', label: 'NaCl 0.9% IV', na: 154, note: 'Untuk hipovolemia berat dulu sampai stabil; TIDAK untuk menurunkan Na bila Na <154.' },
];
