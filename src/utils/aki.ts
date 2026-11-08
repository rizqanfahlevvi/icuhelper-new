/**
 * Staging AKI — KDIGO 2012 (Kidney Int Suppl 2012;2:1–138).
 *
 * Kreatinin (SCr):
 *   Definisi AKI: naik ≥0,3 mg/dL dalam 48 jam ATAU ≥1,5× basal dalam 7 hari.
 *   Stage 1: 1,5–1,9× basal atau naik ≥0,3 mg/dL
 *   Stage 2: 2,0–2,9× basal
 *   Stage 3: ≥3,0× basal ATAU SCr ≥4,0 mg/dL (HANYA bila definisi AKI terpenuhi —
 *            pasien PGK dengan SCr stabil ≥4,0 bukan AKI stage 3) ATAU inisiasi RRT.
 * Urine output (UO):
 *   Stage 1: <0,5 mL/kg/jam selama 6–12 jam
 *   Stage 2: <0,5 mL/kg/jam ≥12 jam
 *   Stage 3: <0,3 mL/kg/jam ≥24 jam ATAU anuria ≥12 jam
 * Stage akhir = kriteria terberat.
 */

export type AkiStage = 0 | 1 | 2 | 3;

export interface AkiInputs {
  baselineScr?: number; // mg/dL
  currentScr?: number;  // mg/dL
  rrt?: boolean;        // sudah dimulai terapi pengganti ginjal
  uoMl?: number;        // total urine (mL) selama periode
  uoHours?: number;     // lama periode (jam)
  weightKg?: number;
}

export interface AkiResult {
  stage: AkiStage | null;       // null = tidak dapat dinilai
  byScr: AkiStage | null;
  byUo: AkiStage | null;
  ratio: number | null;
  rise: number | null;
  uoRate: number | null;        // mL/kg/jam (rata-rata periode)
  reasons: string[];
  notes: string[];
}

const pos = (v: number | undefined): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0;

export function akiByCreatinine(baseline: number, current: number): { stage: AkiStage; ratio: number; rise: number; meetsAki: boolean } {
  // Dibulatkan dulu agar galat floating-point (4,1 − 3,8 = 0,2999…) tidak meloloskan ambang tepat.
  const ratio = Math.round((current / baseline) * 1000) / 1000;
  const rise = Math.round((current - baseline) * 100) / 100;
  const meetsAki = ratio >= 1.5 || rise >= 0.3;
  if (!meetsAki) return { stage: 0, ratio, rise, meetsAki };
  if (ratio >= 3 || current >= 4.0) return { stage: 3, ratio, rise, meetsAki };
  if (ratio >= 2) return { stage: 2, ratio, rise, meetsAki };
  return { stage: 1, ratio, rise, meetsAki };
}

/** UO rata-rata selama periode (pendekatan; KDIGO mensyaratkan UO rendah yang menetap). */
export function akiByUrine(uoMl: number, hours: number, weightKg: number): { stage: AkiStage | null; rate: number } {
  const rate = Math.round((uoMl / weightKg / hours) * 1000) / 1000;
  if (hours < 6) return { stage: null, rate };
  if (uoMl === 0 && hours >= 12) return { stage: 3, rate };
  if (rate < 0.3 && hours >= 24) return { stage: 3, rate };
  if (rate < 0.5 && hours >= 12) return { stage: 2, rate };
  if (rate < 0.5) return { stage: 1, rate };
  return { stage: 0, rate };
}

export function stageAki(i: AkiInputs): AkiResult {
  const reasons: string[] = [];
  const notes: string[] = [];
  let byScr: AkiStage | null = null;
  let byUo: AkiStage | null = null;
  let ratio: number | null = null;
  let rise: number | null = null;
  let uoRate: number | null = null;

  if (pos(i.baselineScr) && pos(i.currentScr)) {
    const r = akiByCreatinine(i.baselineScr, i.currentScr);
    byScr = r.stage;
    ratio = r.ratio;
    rise = r.rise;
    if (!r.meetsAki) {
      reasons.push(`SCr ${i.currentScr} vs basal ${i.baselineScr} (×${r.ratio.toFixed(2)}, Δ${r.rise >= 0 ? '+' : ''}${r.rise.toFixed(2)}) — belum memenuhi definisi AKI.`);
      if (i.currentScr >= 4.0) notes.push('SCr ≥4,0 mg/dL tanpa kenaikan akut (≥0,3 atau ≥1,5× basal) tidak dihitung stage 3 — kemungkinan PGK lanjut.');
    } else if (r.stage === 3) {
      reasons.push(r.ratio >= 3 ? `SCr ${r.ratio.toFixed(2)}× basal (≥3×) → stage 3.` : `SCr ${i.currentScr} mg/dL (≥4,0) dengan kenaikan akut → stage 3.`);
    } else if (r.stage === 2) {
      reasons.push(`SCr ${r.ratio.toFixed(2)}× basal (2,0–2,9×) → stage 2.`);
    } else {
      reasons.push(r.ratio >= 1.5 ? `SCr ${r.ratio.toFixed(2)}× basal (1,5–1,9×) → stage 1.` : `SCr naik ${r.rise.toFixed(2)} mg/dL (≥0,3) → stage 1.`);
    }
    notes.push('Jendela waktu KDIGO: kenaikan ≥0,3 mg/dL dalam 48 jam, atau ≥1,5× basal dalam 7 hari.');
  } else if (pos(i.currentScr)) {
    notes.push('Kriteria kreatinin tidak dapat dinilai tanpa SCr basal (nilai stabil sebelum sakit akut). Ulangi SCr dalam 48 jam untuk menilai kenaikan ≥0,3 mg/dL, atau gunakan kriteria urine output.');
  }

  if (i.rrt) {
    byScr = 3;
    reasons.push('Inisiasi terapi pengganti ginjal → stage 3.');
  }

  if (typeof i.uoMl === 'number' && Number.isFinite(i.uoMl) && i.uoMl >= 0 && pos(i.uoHours) && pos(i.weightKg)) {
    const u = akiByUrine(i.uoMl, i.uoHours, i.weightKg);
    uoRate = u.rate;
    byUo = u.stage;
    if (u.stage === null) notes.push('Kriteria urine output butuh periode pengamatan minimal 6 jam.');
    else if (u.stage > 0) reasons.push(`UO ${u.rate.toFixed(2)} mL/kg/jam selama ${i.uoHours} jam → stage ${u.stage}.`);
    else reasons.push(`UO ${u.rate.toFixed(2)} mL/kg/jam selama ${i.uoHours} jam — tidak memenuhi kriteria UO.`);
    if (u.stage !== null) notes.push('UO dihitung sebagai rata-rata periode; KDIGO mensyaratkan UO di bawah ambang secara menetap (pantau per jam).');
  }

  const candidates = [byScr, byUo].filter((v): v is AkiStage => v !== null);
  const stage = candidates.length ? (Math.max(...candidates) as AkiStage) : null;
  return { stage, byScr, byUo, ratio, rise, uoRate, reasons, notes };
}
