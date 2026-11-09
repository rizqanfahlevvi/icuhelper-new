/**
 * Mekanik ventilator & weaning — logika murni.
 *
 * Rujukan:
 *  - ΔP = Pplat − PEEP (Amato MBP et al. NEJM 2015;372:747).
 *  - Mechanical power, rumus sederhana volume-control (Gattinoni L et al. ICM 2016;42:1567):
 *    MP = 0,098 × RR × VT(L) × (Ppeak − ΔP/2). Ambang risiko >17 J/menit: Serpa Neto A et al.
 *    ICM 2018;44:1914 ("consistent increase in the risk of death with MP higher than 17.0 J/min").
 *  - VT ARDS 4–8 mL/kg PBW + Pplat <30 (Fan E et al. AJRCCM 2017;195:1253); protokol ARDSNet
 *    mulai 6 mL/kg. Non-ARDS: VT rendah menurunkan cedera paru & mortalitas (Serpa Neto A et al.
 *    JAMA 2012;308:1651) → 6–8 mL/kg PBW; VT 10–12 tidak lagi dianjurkan.
 *  - Tabel PEEP tinggi/FiO₂ rendah ALVEOLI (Brower RG et al. NEJM 2004;351:327; tabel dari
 *    protokol ARDSNet via sumber sekunder) — luaran setara dengan PEEP rendah. Setelah 171 pasien,
 *    kombinasi PEEP <12 dihapus dari tabel.
 *  - RSBI f/VT: ambang 105 (Yang KL & Tobin MJ. NEJM 1991;324:1445 — sensitivitas 0,97,
 *    spesifisitas 0,64).
 *  - Klasifikasi weaning (Boles JM et al. Eur Respir J 2007;29:1033).
 */

export function drivingPressure(pplat: number, peep: number): number {
  return pplat - peep;
}

export function staticCompliance(vtMl: number, dp: number): number | null {
  return dp > 0 ? vtMl / dp : null;
}

/** J/menit — rumus sederhana Gattinoni untuk volume-control. */
export function mechanicalPower(rr: number, vtMl: number, ppeak: number, dp: number): number {
  return 0.098 * rr * (vtMl / 1000) * (ppeak - dp / 2);
}
export const MP_RISK_THRESHOLD = 17;

/** Waktu inspirasi (detik) bila I:E diasumsikan 1:ieExp. */
export function assumedInspTime(rr: number, ieExp = 2): number {
  return 60 / (rr * (1 + ieExp));
}

/** Raw = (Ppeak − Pplat) ÷ flow (L/detik) — valid untuk aliran konstan (square wave). */
export function airwayResistance(ppeak: number, pplat: number, flowLps: number): number | null {
  return flowLps > 0 ? (ppeak - pplat) / flowLps : null;
}

/** Estimasi mPaw = PEEP + (Ppeak − PEEP) × fraksi Ti (gelombang tekanan persegi). */
export function meanAirwayPressureEstimate(ppeak: number, peep: number, tiFraction = 1 / 3): number {
  return peep + (ppeak - peep) * tiFraction;
}

/** Tabel PEEP tinggi ALVEOLI untuk FiO₂ fraksi. */
export function alveoliHighPeep(fio2: number): string | null {
  if (!Number.isFinite(fio2) || fio2 <= 0 || fio2 > 1) return null;
  if (fio2 <= 0.3 + 1e-9) return '5–14';
  if (fio2 <= 0.4 + 1e-9) return '14–16';
  if (fio2 <= 0.5 + 1e-9) return '16–18';
  if (fio2 < 0.8 - 1e-9) return '20';
  if (fio2 <= 0.9 + 1e-9) return '22';
  return '22–24';
}

export type VentCondition = 'normal' | 'ards' | 'copd' | 'asma' | 'neuro';

export interface VtTarget { min: number; max: number; start: number | null; note: string }

export function vtTarget(cond: VentCondition): VtTarget {
  switch (cond) {
    case 'ards':
      return { min: 4, max: 8, start: 6, note: 'ARDS: 4–8 mL/kg PBW dengan Pplat <30 (ATS/ESICM/SCCM 2017); protokol ARDSNet mulai 6, turunkan ke 4 bila Pplat >30.' };
    case 'copd':
      return { min: 6, max: 8, start: null, note: 'PPOK: VT protektif; turunkan RR & perpanjang ekspirasi, pantau auto-PEEP.' };
    case 'asma':
      return { min: 6, max: 8, start: null, note: 'Asma berat: VT protektif, RR rendah, ekspirasi panjang (hipoventilasi terkontrol), Pplat <30.' };
    case 'neuro':
      return { min: 6, max: 8, start: null, note: 'Neuromuskular: paru normal tetap memakai VT protektif — VT 10–12 mL/kg tidak lagi dianjurkan (Serpa Neto 2012).' };
    default:
      return { min: 6, max: 8, start: null, note: 'Tanpa ARDS: VT rendah menurunkan cedera paru & mortalitas (Serpa Neto 2012).' };
  }
}

export const RSBI_THRESHOLD = 105;

export function rsbi(rr: number, vtMl: number): number | null {
  return rr > 0 && vtMl > 0 ? rr / (vtMl / 1000) : null;
}

export function interpretRsbi(v: number): { ok: boolean; text: string } {
  return v <= RSBI_THRESHOLD
    ? { ok: true, text: `≤${RSBI_THRESHOLD}: prediktor keberhasilan weaning — lanjutkan SBT (spesifisitas hanya 0,64; bukan kriteria tunggal)` }
    : { ok: false, text: `>${RSBI_THRESHOLD}: prediktor gagal weaning — cari & atasi penyebab sebelum SBT ulang` };
}
