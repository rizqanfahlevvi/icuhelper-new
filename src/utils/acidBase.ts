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
