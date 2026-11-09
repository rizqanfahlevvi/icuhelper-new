// Ringkasan satu baris untuk bilah hasil (CalcActionBar) di kalkulator Transfusi, Kebutuhan Cairan,
// dan Renal. Hanya merangkum angka/label yang SUDAH dihitung halaman — tidak ada ambang klinis baru.
// Satuan laju selalu eksplisit: "mL/jam" vs "mL/hari" (jangan tertukar).
import type { CalcTone } from '../components/ui/CalcActionBar';

export interface BarSummary { text: string; caption?: string; tone: CalcTone }

const fmtSigned = (n: number, digits = 0) => `${n >= 0 ? '+' : '−'}${Math.abs(n).toFixed(digits)}`;
const fmtInt = (n: number) => String(Math.round(n));

// ── Transfusi ────────────────────────────────────────────────────────────────
export interface TransfusiSummaryInput {
  type: 'prc' | 'wb' | 'ffp' | 'tc' | 'cryo';
  kolf?: number; vol?: number; dhb?: number; units?: number; subtype?: 'rd' | 'sda';
  minExpectedPltRise?: number; maxExpectedPltRise?: number; dose?: number; deficit?: number;
}

export function transfusiSummary(r: TransfusiSummaryInput): BarSummary {
  const vol = `±${fmtInt(r.vol ?? 0)} mL`;
  switch (r.type) {
    case 'prc':
      return { text: `${r.kolf} kolf PRC (${vol})`, caption: `Target kenaikan Hb +${(r.dhb ?? 0).toFixed(1)} g/dL`, tone: 'info' };
    case 'wb':
      return { text: `${r.kolf} kolf WB (${vol})`, caption: `Target kenaikan Hb +${(r.dhb ?? 0).toFixed(1)} g/dL`, tone: 'info' };
    case 'ffp':
      return { text: `${r.kolf} kolf FFP (${vol})`, caption: `Dosis ${r.dose} mL/kgBB`, tone: 'info' };
    case 'tc':
      return {
        text: r.subtype === 'rd' ? `${r.units} unit TC RD (${vol})` : `${r.units} kantong TC SDA (${vol})`,
        caption: `Perkiraan kenaikan +${r.minExpectedPltRise} s/d +${r.maxExpectedPltRise} ×10³/µL`,
        tone: 'info',
      };
    case 'cryo':
      return { text: `${r.kolf} kolf cryo (${vol})`, caption: `Defisit fibrinogen ${fmtInt(r.deficit ?? 0)} mg`, tone: 'info' };
  }
}

// ── Kebutuhan cairan ─────────────────────────────────────────────────────────
export function basalSummary(icuDay: number, icuHr: number, perKg: string): BarSummary {
  return { text: `${fmtInt(icuDay)} mL/hari (${icuHr.toFixed(1)} mL/jam)`, caption: `Maintenance ${perKg} mL/kg/hari (NICE)`, tone: 'info' };
}

export function totalCairanSummary(total: number, rateMlH: number, roseLabel: string | null): BarSummary {
  return {
    text: `Total ${fmtInt(total)} mL/hari (${rateMlH.toFixed(1)} mL/jam)`,
    caption: roseLabel ? `Fase ROSE: ${roseLabel}` : 'Maintenance + kehilangan abnormal terukur',
    tone: 'info',
  };
}

/** Nada mengikuti pita label yang sudah ada di halaman (balans kumulatif: ≤0 / <2 L / <5 L / <10 L / ≥10 L). */
export function kumulatifSummary(cumulativeMl: number, days: number, label: string): BarSummary {
  const L = cumulativeMl / 1000;
  const tone: CalcTone = cumulativeMl <= 0 ? 'info' : L < 2 ? 'good' : L < 5 ? 'warn' : 'bad';
  return { text: `Balans kumulatif ${fmtSigned(cumulativeMl)} mL · ${days} hari`, caption: label, tone };
}

/** Pita FO% yang sudah ada di halaman (<0 / <5 / <10 / <15 / ≥15). */
export function overloadSummary(foPercent: number, diffKg: number, label: string): BarSummary {
  const tone: CalcTone = foPercent < 0 ? 'info' : foPercent < 5 ? 'good' : foPercent < 10 ? 'warn' : 'bad';
  return { text: `FO ${fmtSigned(foPercent, 1)}% (${fmtSigned(diffKg, 1)} kg)`, caption: label, tone };
}

/** Pita balance 24 jam yang sudah ada di halaman (>2 L / >1 L / ≥−0,5 L / ≥−1,5 L / lebih negatif). */
export function balance24Summary(balanceMl: number, totalIn: number, totalOut: number, label: string): BarSummary {
  const tone: CalcTone = balanceMl > 2000 ? 'bad' : balanceMl > 1000 ? 'warn' : balanceMl >= -500 ? 'good' : balanceMl >= -1500 ? 'info' : 'bad';
  return { text: `Balance 24 jam ${fmtSigned(balanceMl)} mL`, caption: `${label} · masuk ${fmtInt(totalIn)} / keluar ${fmtInt(totalOut)} mL`, tone };
}
