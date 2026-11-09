/**
 * Skor HACOR — prediksi gagal NIV pada pasien hipoksemik.
 * Duan J et al. Intensive Care Med 2017;43:192–199 (doi:10.1007/s00134-016-4601-3).
 * Rentang 0–25. Ambang: skor >5 pada jam ke-1 NIV (sensitivitas 72,6%, spesifisitas 90,2%,
 * AUC 0,88 pada kohort uji).
 */

export interface HacorBand { range: string; points: number }
export interface HacorParam { key: 'hr' | 'ph' | 'gcs' | 'pf' | 'rr'; label: string; bands: HacorBand[] }

export const HACOR_TABLE: HacorParam[] = [
  { key: 'hr', label: 'Heart rate (/menit)', bands: [{ range: '≤120', points: 0 }, { range: '≥121', points: 1 }] },
  {
    key: 'ph', label: 'Acidosis (pH)',
    bands: [{ range: '≥7,35', points: 0 }, { range: '7,30–7,34', points: 2 }, { range: '7,25–7,29', points: 3 }, { range: '<7,25', points: 4 }],
  },
  {
    key: 'gcs', label: 'Consciousness (GCS)',
    bands: [{ range: '15', points: 0 }, { range: '13–14', points: 2 }, { range: '11–12', points: 5 }, { range: '≤10', points: 10 }],
  },
  {
    key: 'pf', label: 'Oxygenation (PaO₂/FiO₂, mmHg)',
    bands: [
      { range: '≥201', points: 0 }, { range: '176–200', points: 2 }, { range: '151–175', points: 3 },
      { range: '126–150', points: 4 }, { range: '101–125', points: 5 }, { range: '≤100', points: 6 },
    ],
  },
  {
    key: 'rr', label: 'Respiratory rate (/menit)',
    bands: [{ range: '≤30', points: 0 }, { range: '31–35', points: 1 }, { range: '36–40', points: 2 }, { range: '41–45', points: 3 }, { range: '≥46', points: 4 }],
  },
];

export const HACOR_MAX = 25;
/** Gagal NIV diprediksi bila skor > ambang ini pada jam ke-1. */
export const HACOR_CUTOFF = 5;

export function hacorPoints(p: { hr: number; ph: number; gcs: number; pf: number; rr: number }) {
  const hr = p.hr <= 120 ? 0 : 1;
  const ph = p.ph >= 7.35 ? 0 : p.ph >= 7.3 ? 2 : p.ph >= 7.25 ? 3 : 4;
  const gcs = p.gcs >= 15 ? 0 : p.gcs >= 13 ? 2 : p.gcs >= 11 ? 5 : 10;
  const pf = p.pf > 200 ? 0 : p.pf > 175 ? 2 : p.pf > 150 ? 3 : p.pf > 125 ? 4 : p.pf > 100 ? 5 : 6;
  const rr = p.rr <= 30 ? 0 : p.rr <= 35 ? 1 : p.rr <= 40 ? 2 : p.rr <= 45 ? 3 : 4;
  return { hr, ph, gcs, pf, rr, total: hr + ph + gcs + pf + rr };
}
