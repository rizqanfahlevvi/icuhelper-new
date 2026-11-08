/**
 * Perhitungan komponen darah — logika murni.
 *
 * - PRC: Davies P et al. Transfusion 2007;47:212 (data PICU ANAK):
 *   volume (mL) = BB × ΔHb × 3 / Hct sediaan. Hct PRC ±0,75 → faktor k = 4.
 * - Trombosit: perkiraan kenaikan ±5–10 ×10³/µL per unit donor acak dan ±30–60 ×10³/µL per
 *   unit apheresis pada dewasa 70 kg (dinormalisasi ke BB). Dosis profilaksis AABB 2015
 *   (Kaufman RM et al. Ann Intern Med 2015;162:205): hingga 1 unit apheresis atau setara;
 *   dosis lebih besar tidak lebih efektif (PLADO, Slichter SJ et al. NEJM 2010;362:600).
 * - Kriopresipitat: defisit fibrinogen = (target − aktual) mg/dL × volume plasma (40 mL/kg) ÷ 100;
 *   asumsi ±200 mg fibrinogen per kantong. Aturan praktis 1 kantong/10 kg hanya PEMBANDING.
 */

export const PRC_K_FACTOR = 4;
export const PRC_BAG_ML = 250;
export const WB_K_FACTOR = 6;
export const WB_BAG_ML = 450;
export const FFP_BAG_ML = 250;
export const RD_UNIT_ML = 60;
export const CRYO_MG_PER_BAG = 200;
export const CRYO_BAG_ML = 17;
export const PLASMA_ML_PER_KG = 40;

export function bagsFromVolume(volMl: number, bagMl: number): number {
  return volMl > 0 && bagMl > 0 ? Math.ceil(volMl / bagMl) : 0;
}

/** Volume sel darah merah (mL) = ΔHb × BB × k. */
export function redCellVolumeMl(deltaHb: number, weightKg: number, k: number = PRC_K_FACTOR): number {
  if (!(deltaHb > 0) || !(weightKg > 0) || !(k > 0)) return NaN;
  return deltaHb * weightKg * k;
}

export interface CryoResult {
  plasmaVolMl: number;
  deficitMg: number;
  /** Jumlah kantong berbasis defisit (DIPAKAI). */
  bagsByDeficit: number;
  /** Aturan praktis 1 kantong / 10 kg — pembanding saja. */
  bagsByRule: number;
  volMl: number;
}

export function cryoBags(currentMgDl: number, targetMgDl: number, weightKg: number): CryoResult | null {
  if (!(weightKg > 0) || !Number.isFinite(currentMgDl) || !(targetMgDl > currentMgDl)) return null;
  const plasmaVolMl = weightKg * PLASMA_ML_PER_KG;
  const deficitMg = ((targetMgDl - currentMgDl) * plasmaVolMl) / 100;
  const bagsByDeficit = Math.ceil(deficitMg / CRYO_MG_PER_BAG);
  const bagsByRule = Math.ceil(weightKg / 10);
  return { plasmaVolMl, deficitMg, bagsByDeficit, bagsByRule, volMl: bagsByDeficit * CRYO_BAG_ML };
}

export type PlateletProduct = 'rd' | 'sda';

/** Unit donor acak: aturan praktis 1 unit/10 kg (min 4, maks 10). */
export function randomDonorUnits(weightKg: number): number {
  return Math.max(4, Math.min(Math.ceil(weightKg / 10), 10));
}

/** Perkiraan kenaikan trombosit (×10³/µL), dinormalisasi ke BB 70 kg. */
export function plateletRiseRange(product: PlateletProduct, units: number, weightKg: number): { min: number; max: number } | null {
  if (!(weightKg > 0) || !(units > 0)) return null;
  const scale = 70 / weightKg;
  return product === 'rd'
    ? { min: 5 * units * scale, max: 10 * units * scale }
    : { min: 30 * units * scale, max: 60 * units * scale };
}
