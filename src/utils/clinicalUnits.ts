/**
 * Konversi satuan untuk sinkronisasi kalkulator ↔ data pasien.
 * Store selalu memakai satuan kanonik (utils/clinicalVariables.ts); kalkulator yang
 * menawarkan satuan lain WAJIB mengonversi sebelum publish dan setelah import.
 *
 * Faktor:
 * - Kreatinin: 1 mg/dL = 88,4 µmol/L (BM kreatinin 113,12 g/mol).
 * - Urea: ureum (mg/dL) = BUN (mg/dL) × 60/28 (≈ × 2,14) — BM urea 60, 2 atom N = 28.
 * - Tekanan gas: 1 kPa = 7,5006 mmHg.
 * - Albumin: 1 g/dL = 1000 mg/dL.
 *
 * String kosong / bukan angka → '' (tidak dipublikasikan, tidak ditebak).
 */
import { KPA_TO_MMHG } from './abg';

export const CREATININE_UMOL_PER_MG = 88.4;
export const UREUM_PER_BUN = 60 / 28;

function convert(raw: string, factor: number, decimals: number): string {
  if (typeof raw !== 'string' || raw.trim() === '') return '';
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return '';
  return String(Number((n * factor).toFixed(decimals)));
}

export const creatinineMgFromUmol = (umol: string) => convert(umol, 1 / CREATININE_UMOL_PER_MG, 2);
export const creatinineUmolFromMg = (mg: string) => convert(mg, CREATININE_UMOL_PER_MG, 0);

export const ureumFromBun = (bun: string) => convert(bun, UREUM_PER_BUN, 1);
export const bunFromUreum = (ureum: string) => convert(ureum, 1 / UREUM_PER_BUN, 1);

export const mmHgFromKpa = (kpa: string) => convert(kpa, KPA_TO_MMHG, 1);
export const kpaFromMmHg = (mmHg: string) => convert(mmHg, 1 / KPA_TO_MMHG, 2);

export const albuminGdlFromMgdl = (mgdl: string) => convert(mgdl, 1 / 1000, 2);
export const albuminMgdlFromGdl = (gdl: string) => convert(gdl, 1000, 0);
