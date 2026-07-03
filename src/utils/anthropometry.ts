/** Devine IBW (kg). Min-clamped to 30 kg. */
export function calcIbw(heightCm: number, isFemale: boolean): number {
  const base = isFemale ? 45.5 : 50;
  return Math.max(base + 0.91 * (heightCm - 152.4), 30);
}

/** BMI (kg/m²) */
export function calcBmi(weightKg: number, heightCm: number): number {
  const hM = heightCm / 100;
  return weightKg / (hM * hM);
}

/** Du Bois BSA (m²) */
export function calcBsa(weightKg: number, heightCm: number): number {
  return Math.sqrt((heightCm * weightKg) / 3600);
}

/** Lean Body Weight — Janmahasatian formula (kg) */
export function calcLbw(weightKg: number, bmi: number, isFemale: boolean): number {
  return isFemale
    ? (9270 * weightKg) / (8780 + 244 * bmi)
    : (9270 * weightKg) / (6680 + 216 * bmi);
}

/** Adjusted Body Weight for obesity: IBW + 0.4 × (actual − IBW) */
export function calcAdjBw(ibw: number, actualKg: number): number {
  return ibw + 0.4 * (actualKg - ibw);
}
