/**
 * Laju infus syringe pump (mL/jam) dari dosis, berat badan, dan konsentrasi.
 * Satuan konsentrasi mengikuti pembilang satuan dosis (mcg/mL, mg/mL, unit/mL).
 */
export type InfusionUnit =
  | 'mg/jam' | 'mcg/jam'               // dosis flat per jam
  | 'mg/mnt' | 'mcg/mnt' | 'units/mnt' // dosis flat per menit
  | 'mcg/kg/jam' | 'mg/kg/jam'          // per kgBB per jam
  | 'mcg/kg/mnt';                       // per kgBB per menit

export function isFlatUnit(u: InfusionUnit): boolean {
  return u === 'mg/jam' || u === 'mcg/jam' || u === 'mg/mnt' || u === 'mcg/mnt' || u === 'units/mnt';
}

/** mL/jam. Mengembalikan NaN bila input tidak valid. */
export function infusionRateMlH(unit: InfusionUnit, dose: number, weightKg: number, conc: number): number {
  if (!(dose > 0) || !(conc > 0)) return NaN;
  switch (unit) {
    case 'mg/jam':
    case 'mcg/jam':
      return dose / conc;
    case 'mg/mnt':
    case 'mcg/mnt':
    case 'units/mnt':
      return (dose * 60) / conc;
    case 'mcg/kg/jam':
    case 'mg/kg/jam':
      return weightKg > 0 ? (dose * weightKg) / conc : NaN;
    case 'mcg/kg/mnt':
      return weightKg > 0 ? (dose * weightKg * 60) / conc : NaN;
  }
}

/** Posisi dosis terhadap rentang lazim [min, max] (inklusif). */
export function doseRangeStatus(dose: number, range: readonly [number, number]): 'low' | 'high' | 'ok' {
  if (dose < range[0]) return 'low';
  if (dose > range[1]) return 'high';
  return 'ok';
}

/**
 * Propofol: label FDA — jangan melebihi 4 mg/kg/jam (≈66,7 mcg/kg/mnt) kecuali manfaat > risiko;
 * risiko Propofol Infusion Syndrome (PRIS) meningkat di atas dosis ini, terutama >48 jam.
 */
export const PROPOFOL_PRIS_MCG_KG_MIN = (4 * 1000) / 60;
export function propofolAbovePrisThreshold(mcgKgMin: number): boolean {
  return mcgKgMin > PROPOFOL_PRIS_MCG_KG_MIN;
}
