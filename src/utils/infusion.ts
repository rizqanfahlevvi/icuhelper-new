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
