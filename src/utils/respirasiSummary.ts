// Ringkasan satu baris untuk bilah hasil halaman respirasi (ABG, Weaning, Ventilator Lanjutan).
// Hanya memakai teks/ambang/kelas yang SUDAH dihasilkan util & logika halaman — tidak menambah ambang baru.
import type { AbgResultData } from '../pages/abg/abgInterpretation';
import { TONE_CLS } from '../pages/abg/abgInterpretation';

export type SummaryTone = 'neutral' | 'good' | 'warn' | 'bad';
export interface BarSummary { text: string; caption?: string; tone: SummaryTone }

/** Nada dari kelas warna kartu (TONE_CLS) yang sudah dipakai rincian hasil ABG. */
export function toneFromAbgCls(cls: string | undefined): SummaryTone {
  if (!cls) return 'neutral';
  if (cls === TONE_CLS.red) return 'bad';
  if (cls === TONE_CLS.amber) return 'warn';
  if (cls === TONE_CLS.emerald) return 'good';
  return 'neutral';
}

/** ABG/VBG: gangguan primer (Langkah 2) + status pH (Langkah 1) + kompensasi + AG tinggi + P/F. */
export function abgSummary(r: AbgResultData | null): BarSummary | null {
  if (!r) return null;
  if (r.inputError) return { text: 'Input tidak wajar', caption: r.inputError, tone: 'bad' };
  const text = r.analysis?.primaryText ?? r.step1?.status ?? '';
  if (!text) return null;
  const pf = r.step6Oksigenasi?.items.find(i => i.label === 'P/F Ratio');
  const caption = [
    r.isVbg ? 'VBG (perkiraan)' : '',
    r.step1?.status ?? '',
    r.step2KompStatus?.interp ?? '',
    r.step4Ag?.high ? r.step4Ag.interp : '',
    pf ? `P/F ${pf.value}` : '',
  ].filter(Boolean).join(' · ');
  return { text, caption, tone: toneFromAbgCls(r.step1?.cls) };
}

/** Weaning: RSBI dengan teks & status dari interpretRsbi (ambang Yang & Tobin yang sudah ada di util). */
export function rsbiSummary(rsbi: string, interpText: string, ok: boolean): BarSummary {
  return { text: `RSBI ${rsbi} bpm/L`, caption: interpText, tone: ok ? 'good' : 'bad' };
}
