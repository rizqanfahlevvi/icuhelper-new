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

// ── Renal ────────────────────────────────────────────────────────────────────
export interface GfrSummaryInput {
  isPediatric: boolean; schwartz?: string; ckdEpi?: string; cgRecommended?: string; stage?: string; stageDesc?: string;
}

/** Nada mengikuti kategori G KDIGO yang sudah ditetapkan halaman (G1–G2 / G3a–G3b / G4–G5). */
export function gfrSummary(r: GfrSummaryInput): BarSummary {
  const st = r.stage ?? '';
  const tone: CalcTone = st === 'G1' || st === 'G2' ? 'good' : st.startsWith('G3') ? 'warn' : st ? 'bad' : 'neutral';
  if (r.isPediatric) {
    return { text: `GFR Schwartz ${r.schwartz} mL/min/1.73m²`, caption: `${st} · ${r.stageDesc ?? ''}`, tone };
  }
  return { text: `eGFR ${r.ckdEpi} mL/min/1.73m²`, caption: `${st} ${r.stageDesc ?? ''} · CrCl (C-G) ${r.cgRecommended} mL/min`, tone };
}

/** Label & pita yang sama dengan rincian halaman: FENa <1 / 1–2 / >2 %; FEUrea <35 / 35–50 / >50 %. */
export function fenaSummary(fena: string, feurea: string | null): BarSummary {
  const f = parseFloat(fena);
  const fLabel = f < 1 ? 'Pre-renal (< 1%)' : f < 2 ? 'Inkonklusif (1–2%)' : 'Renal Intrinsik (> 2%)';
  const tone: CalcTone = f < 1 ? 'good' : f < 2 ? 'warn' : 'bad';
  if (feurea !== null) {
    const u = parseFloat(feurea);
    const uLabel = u < 35 ? 'Pre-renal (< 35%)' : u < 50 ? 'Inkonklusif' : 'Renal Intrinsik (> 50%)';
    return { text: `FENa ${fena}% · FEUrea ${feurea}%`, caption: `FENa: ${fLabel} · FEUrea: ${uLabel}`, tone };
  }
  return { text: `FENa ${fena}%`, caption: fLabel, tone };
}

// ── AKI / Osmol / Indikasi HD ────────────────────────────────────────────────
/** stage null = belum dapat dinilai; nada mengikuti warna tahap di halaman. */
export function akiSummary(stage: number | null, desc: string): BarSummary {
  const tone: CalcTone = stage === null ? 'neutral' : stage === 0 ? 'good' : stage === 1 ? 'warn' : 'bad';
  return { text: desc, caption: stage === null ? 'Data belum cukup — lihat catatan di rincian' : 'Klasifikasi KDIGO 2012', tone };
}

/** Osmolalitas hitung (+ gap bila Osm terukur diisi) dan/atau rasio BUN:Cr — ambang sama dengan rincian (gap >10; rasio >20 / 10–20 / <10). */
export function osmolSummary(calcOsm: number | null, gap: number | null, ratio: number | null): BarSummary | null {
  const parts: string[] = [];
  const caps: string[] = [];
  let tone: CalcTone = 'info';
  if (calcOsm !== null) {
    parts.push(`Osm hitung ${calcOsm.toFixed(1)} mOsm/kg`);
    if (gap !== null) {
      parts.push(`gap ${gap.toFixed(1)}`);
      if (gap > 10) { tone = 'bad'; caps.push('Gap > 10 = curiga intoksikasi alkohol/toksin'); }
    }
  }
  if (ratio !== null) {
    parts.push(`BUN:Cr ${ratio.toFixed(1)}`);
    caps.push(ratio > 20 ? 'Pre-Renal (Dehidrasi, Hipoperfusi)' : ratio >= 10 ? 'Normal / Post-Renal (Inkonklusif)' : 'Renal Intrinsik (ATN)');
  }
  if (!parts.length) return null;
  return { text: parts.join(' · '), caption: caps.join(' · ') || 'Normal: 275 - 295', tone };
}
