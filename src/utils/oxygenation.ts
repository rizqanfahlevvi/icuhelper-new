// Util oksigenasi & gagal napas (fungsi murni, dites di __tests__/oxygenation.test.ts).
//
// Rujukan:
//   · Gagal napas: Mirabile VS, Shebl E, Sankari A, Burns B. Respiratory Failure in Adults.
//     StatPearls (NBK526127) — tipe 1: PaO₂ <60 mmHg dengan PaCO₂ normal/rendah;
//     tipe 2: PaCO₂ >45 mmHg dengan pH <7,35. BTS/ICS 2016 (Davidson AC et al. Thorax 2016):
//     pH <7,35 & PaCO₂ >6,5 kPa yang menetap setelah terapi medis optimal = ambang NIV.
//     P/F ≤300 dipakai sebagai ambang hipoksemia ARDS & uji klinis AHRF (mis. FLORALI, NEJM 2015).
//   · ARDS: Berlin Definition (ARDS Definition Task Force, JAMA 2012) · Global Definition
//     (Matthay MA et al. AJRCCM 2024;209:37 — S/F ≤315 bila SpO₂ ≤97%, HFNO ≥30 L/menit,
//     tanpa syarat PEEP/alat di fasilitas terbatas).
//   · A-a: perkiraan normal udara ruang ≈ usia/4 + 4 (rumus praktis yang umum dipakai).
//   · ROX: Roca O et al. AJRCCM 2019;199:1368 — ≥4,88 pada jam 2/6/12 → risiko intubasi
//     rendah; <2,85 (jam 2), <3,47 (jam 6), <3,85 (jam 12) → prediktor gagal HFNC
//     (divalidasi pada pneumonia dengan HFNC).
//   · Tabel PEEP rendah/FiO₂ tinggi ARDSNet (ARDS Network, NEJM 2000).
import { evalRespAcidosis, Tone } from './abg';

export type RespSupport = 'udara' | 'hfno' | 'niv' | 'invasif';

export const SUPPORT_LABEL: Record<RespSupport, string> = {
  udara: 'Udara ruang / O₂ low-flow',
  hfno: 'HFNC (high-flow nasal)',
  niv: 'NIV / CPAP',
  invasif: 'Ventilasi invasif',
};

export const PAO2_HYPOXEMIA = 60;
export const PCO2_HYPERCAPNIA = 45;
export const PF_ARDS_THRESHOLD = 300;
export const SF_ARDS_THRESHOLD = 315;
export const SF_MAX_SPO2 = 97;
export const HFNO_MIN_FLOW = 30;
export const PEEP_MIN = 5;
export const ROOM_AIR_FIO2 = 0.21;

export function isRoomAir(fio2: number | null): boolean {
  return fio2 !== null && Math.abs(fio2 - ROOM_AIR_FIO2) < 0.005;
}

// ── Kategori gagal napas ─────────────────────────────────────────────────────

export type RespFailureType = 'tipe1' | 'tipe2' | 'tidak' | 'tidak-dinilai';

export interface RespFailure {
  type: RespFailureType;
  title: string;
  details: string[];
  tone: Tone;
}

export interface RespFailureInput {
  ph: number;
  pco2: number;
  hco3: number;
  pao2: number | null;
  fio2: number | null;
  fio2Estimated: boolean;
  kondisi?: string;
}

const fmt = (n: number, d = 0) => (Math.round(n * 10 ** d) / 10 ** d).toString();

export function classifyRespFailure(i: RespFailureInput): RespFailure {
  const hyperCap = i.pco2 > PCO2_HYPERCAPNIA;
  const acidemic = i.ph < 7.35;
  const hasPao2 = i.pao2 !== null && Number.isFinite(i.pao2);
  const hypox = hasPao2 && (i.pao2 as number) < PAO2_HYPOXEMIA;
  const onO2 = i.fio2 !== null && i.fio2 > ROOM_AIR_FIO2 + 0.005;
  const pf = hasPao2 && i.fio2 !== null ? (i.pao2 as number) / i.fio2 : null;
  const hypoxOnO2 = !hypox && onO2 && pf !== null && pf <= PF_ARDS_THRESHOLD;
  const hypoxText = hypox
    ? `PaO₂ ${fmt(i.pao2 as number)} <60 mmHg`
    : hypoxOnO2 ? `dengan O₂ PaO₂ ${fmt(i.pao2 as number)} masih ≥60 tetapi P/F ${fmt(pf as number)} ≤300${i.fio2Estimated ? ' (FiO₂ estimasi)' : ''}` : '';

  let result: RespFailure;

  if (hyperCap && acidemic) {
    const e = evalRespAcidosis(i.pco2, i.hco3);
    const sub = e.fit === 'akut' ? 'AKUT'
      : e.fit === 'transisi' ? 'AKUT-PADA-KRONIK (HCO₃⁻ di antara harapan akut & kronik)'
      : e.fit === 'kronik' ? 'KRONIK (HCO₃⁻ sudah naik sesuai kompensasi kronik)'
      : e.concurrent === 'asidosis-metabolik' ? 'AKUT, disertai asidosis metabolik'
      : 'disertai alkalosis metabolik (HCO₃⁻ melebihi harapan kronik)';
    result = {
      type: 'tipe2',
      title: `Gagal napas TIPE 2 (hiperkapnik) — ${sub}${hypox || hypoxOnO2 ? ' + hipoksemia' : ''}`,
      details: [`PaCO₂ ${fmt(i.pco2)} >45 mmHg dengan pH ${i.ph} <7,35.`],
      tone: e.fit === 'kronik' ? 'amber' : 'red',
    };
    if (hypoxText) result.details.push(`Hipoksemia: ${hypoxText}.`);
    result.details.push('BTS/ICS 2016: pH <7,35 & PaCO₂ >6,5 kPa (≈49 mmHg) yang menetap setelah terapi medis optimal → ambang memulai NIV (eksaserbasi PPOK).');
  } else if (hyperCap) {
    const chronic = i.hco3 > 26;
    result = chronic
      ? { type: 'tipe2', title: 'Gagal napas TIPE 2 KRONIK — hiperkapnia terkompensasi (pH tidak asidemia)', details: [`PaCO₂ ${fmt(i.pco2)} >45 mmHg, pH ${i.ph}, HCO₃⁻ ${i.hco3} naik → kompensasi ginjal. Target PaCO₂ = baseline pasien.`], tone: 'amber' }
      : { type: 'tidak', title: 'Hiperkapnia ringan tanpa asidemia — belum memenuhi kriteria gagal napas tipe 2 akut', details: [`PaCO₂ ${fmt(i.pco2)} >45 mmHg tetapi pH ${i.ph} ≥7,35.`], tone: 'amber' };
    if (hypoxText) result.details.push(`Hipoksemia: ${hypoxText}.`);
  } else if (hypox || hypoxOnO2) {
    result = {
      type: 'tipe1',
      title: 'Gagal napas TIPE 1 (hipoksemik)',
      details: [`${hypoxText}, PaCO₂ ${fmt(i.pco2)} normal/rendah.`],
      tone: 'red',
    };
    if (hypox && onO2) result.details.push('Hipoksemia terjadi walau sudah mendapat O₂ — perhatikan P/F.');
  } else if (!hasPao2) {
    result = { type: 'tidak-dinilai', title: 'Tipe 1 belum dapat dinilai — PaO₂ belum diisi', details: [`PaCO₂ ${fmt(i.pco2)} ≤45 mmHg → tidak hiperkapnik.`], tone: 'slate' };
  } else {
    result = { type: 'tidak', title: 'Tidak memenuhi kriteria gagal napas', details: [`PaO₂ ${fmt(i.pao2 as number)} ≥60 mmHg${pf !== null && onO2 ? ` dan P/F ${fmt(pf)} >300` : ''}, PaCO₂ ${fmt(i.pco2)} ≤45 mmHg.`], tone: 'emerald' };
  }

  if (i.kondisi === 'postop' && (hypox || hypoxOnO2)) {
    result.details.push('Pasca-operasi: hipoksemia sering akibat atelektasis — sebagian literatur menyebutnya tipe III (perioperatif).');
  }
  if ((i.kondisi === 'sepsis' || i.kondisi === 'cardiac') && result.type !== 'tidak' && result.type !== 'tidak-dinilai') {
    result.details.push('Bila disertai syok, kegagalan napas dapat diperberat hipoperfusi otot napas — sebagian literatur menyebutnya tipe IV.');
  }
  return result;
}

// ── P/F, S/F & klasifikasi oksigenasi ARDS ───────────────────────────────────

export function pfLabel(pf: number): { text: string; tone: Tone } {
  if (pf >= 400) return { text: 'Normal (≥400)', tone: 'emerald' };
  if (pf > PF_ARDS_THRESHOLD) return { text: 'Di bawah normal, di atas ambang ARDS (300–400)', tone: 'amber' };
  return { text: 'Di bawah ambang hipoksemia ARDS (≤300)', tone: 'red' };
}

export type ArdsSeverity = 'ringan' | 'sedang' | 'berat';

export function severityFromPf(pf: number): ArdsSeverity | null {
  if (pf > 300) return null;
  return pf <= 100 ? 'berat' : pf <= 200 ? 'sedang' : 'ringan';
}

/** Global Definition 2023 (terintubasi): S/F >235–≤315 ringan · >148–≤235 sedang · ≤148 berat; valid bila SpO₂ ≤97%. */
export function severityFromSf(sf: number): ArdsSeverity | null {
  if (sf > SF_ARDS_THRESHOLD) return null;
  return sf <= 148 ? 'berat' : sf <= 235 ? 'sedang' : 'ringan';
}

export interface ArdsOxyInput {
  pf: number | null;
  spo2: number | null;
  fio2: number | null;
  support: RespSupport;
  peep: number | null;
  hfnoFlow: number | null;
  fio2Estimated: boolean;
}

export interface ArdsOxyClass {
  sf: number | null;
  sfValid: boolean;
  berlin: string;
  global: string;
  meetsOxygenation: boolean;
}

export const ARDS_OTHER_CRITERIA =
  'Kriteria ARDS lain WAJIB: onset ≤1 minggu dari pencetus/gejala baru, opasitas bilateral (foto toraks/CT, atau USG pada definisi Global), dan tidak sepenuhnya dijelaskan gagal jantung/kelebihan cairan.';

export function ardsOxygenation(i: ArdsOxyInput): ArdsOxyClass {
  const sfRaw = i.spo2 !== null && i.fio2 !== null ? i.spo2 / i.fio2 : null;
  const sfValid = sfRaw !== null && (i.spo2 as number) <= SF_MAX_SPO2;
  const sf = sfRaw;
  const pfSev = i.pf !== null ? severityFromPf(i.pf) : null;
  const sfSev = sfValid && sf !== null ? severityFromSf(sf) : null;
  const meetsOxygenation = pfSev !== null || sfSev !== null;
  const peepOk = i.peep !== null && i.peep >= PEEP_MIN;

  // Berlin 2012 — butuh PEEP/CPAP ≥5; NIV/CPAP hanya untuk kategori ringan.
  let berlin: string;
  if (i.pf === null) berlin = 'Berlin: butuh PaO₂ (P/F) — S/F tidak dipakai di Berlin.';
  else if (pfSev === null) berlin = `Berlin: tidak memenuhi (P/F ${fmt(i.pf)} >300).`;
  else if (i.fio2Estimated) berlin = 'Berlin: tidak dapat diklasifikasi — FiO₂ estimasi alat low-flow; Berlin mensyaratkan PEEP/CPAP ≥5 cmH₂O.';
  else if (i.support === 'invasif') {
    berlin = i.peep === null ? `Berlin: P/F setara ARDS ${pfSev} — isi PEEP (syarat ≥5 cmH₂O).`
      : peepOk ? `Berlin: ARDS ${pfSev.toUpperCase()} (P/F ${fmt(i.pf)}, PEEP ${i.peep}) — bila kriteria lain terpenuhi.`
      : `Berlin: PEEP ${i.peep} <5 cmH₂O — belum memenuhi syarat.`;
  } else if (i.support === 'niv') {
    berlin = !peepOk ? 'Berlin: CPAP/EPAP harus ≥5 cmH₂O — isi PEEP/EPAP.'
      : pfSev === 'ringan' ? `Berlin: ARDS RINGAN (P/F ${fmt(i.pf)}; CPAP/NIV ≥5 diperbolehkan untuk kategori ringan) — bila kriteria lain terpenuhi.`
      : `Berlin: P/F setara ${pfSev}, tetapi kategori sedang/berat mensyaratkan ventilasi invasif (NIV/CPAP hanya untuk kategori ringan).`;
  } else {
    berlin = 'Berlin: tidak memenuhi syarat — butuh PEEP/CPAP ≥5 cmH₂O.';
  }

  // Global 2023
  let global: string;
  const metric = i.pf !== null && pfSev !== null ? `P/F ${fmt(i.pf)}` : sfSev !== null && sf !== null ? `S/F ${fmt(sf)}` : null;
  const sfNote = sfRaw !== null && !sfValid ? ' (S/F tidak valid karena SpO₂ >97%)' : '';
  if (!meetsOxygenation) {
    global = `Global 2023: tidak memenuhi ambang (P/F ≤300 atau S/F ≤315 dengan SpO₂ ≤97%)${sfNote}.`;
  } else if (i.support === 'invasif') {
    const sev = pfSev ?? sfSev;
    global = `Global 2023 (terintubasi): ARDS ${(sev as string).toUpperCase()} berdasarkan ${metric}${sfNote} — bila kriteria lain terpenuhi.`;
  } else if (i.support === 'hfno') {
    global = i.hfnoFlow !== null && i.hfnoFlow >= HFNO_MIN_FLOW
      ? `Global 2023 (non-intubasi): memenuhi ambang hipoksemia (${metric}) dengan HFNC ${i.hfnoFlow} L/menit — tanpa grading keparahan.`
      : 'Global 2023 (non-intubasi): HFNC harus ≥30 L/menit — isi flow HFNC.';
  } else if (i.support === 'niv') {
    global = peepOk
      ? `Global 2023 (non-intubasi): memenuhi ambang hipoksemia (${metric}) dengan NIV/CPAP PEEP ${i.peep} — tanpa grading keparahan.`
      : 'Global 2023 (non-intubasi): NIV/CPAP harus dengan PEEP/EPAP ≥5 cmH₂O — isi PEEP.';
  } else {
    global = `Global 2023: dengan udara ruang/O₂ low-flow hanya memenuhi pada modifikasi FASILITAS TERBATAS (tanpa syarat PEEP/flow/alat) — ${metric}.`;
  }

  return { sf, sfValid, berlin, global, meetsOxygenation };
}

// ── A-a gradient ─────────────────────────────────────────────────────────────

export const PATM_SEA_LEVEL = 760;

export function alveolarPo2(fio2: number, pco2: number, patm = PATM_SEA_LEVEL): number {
  return fio2 * (patm - 47) - pco2 / 0.8;
}

export function aaGradient(fio2: number, pco2: number, pao2: number, patm = PATM_SEA_LEVEL): number {
  return alveolarPo2(fio2, pco2, patm) - pao2;
}

export function expectedAaRoomAir(ageYears: number): number {
  return ageYears / 4 + 4;
}

export function interpretAa(aa: number, fio2: number, ageYears: number | null): { text: string; tone: Tone } {
  if (aa < -5) return { text: 'Negatif — tidak fisiologis: cek FiO₂ (mungkin lebih tinggi dari yang diisi), PaO₂, PaCO₂, atau sampel vena', tone: 'amber' };
  if (!isRoomAir(fio2)) return { text: 'Interpretasi terbatas pada FiO₂ >0,21 (A-a normal ikut melebar saat FiO₂ naik) — gunakan P/F', tone: 'slate' };
  if (ageYears !== null && ageYears >= 0) {
    const n = expectedAaRoomAir(ageYears);
    return aa > n
      ? { text: `MENINGKAT (> perkiraan normal usia ${fmt(n, 1)}) → V/Q mismatch, shunt, atau gangguan difusi`, tone: 'red' }
      : { text: `Normal untuk usia (≤${fmt(n, 1)}) → bila hipoksemia/hiperkapnia: hipoventilasi murni`, tone: 'emerald' };
  }
  if (aa > expectedAaRoomAir(100)) return { text: 'MENINGKAT (melebihi perkiraan normal usia berapa pun)', tone: 'red' };
  if (aa <= 10) return { text: 'Normal → bila hipoksemia/hiperkapnia: hipoventilasi murni', tone: 'emerald' };
  return { text: 'Isi usia untuk menilai (normal ≈ usia/4 + 4)', tone: 'slate' };
}

// ── ROX ──────────────────────────────────────────────────────────────────────

export type RoxHour = '' | '2' | '6' | '12';
export const ROX_LOW_RISK = 4.88;
export const ROX_HIGH_RISK: Record<Exclude<RoxHour, ''>, number> = { '2': 2.85, '6': 3.47, '12': 3.85 };

export function roxIndex(spo2: number, fio2: number, rr: number): number {
  return spo2 / fio2 / rr;
}

export function interpretRox(rox: number, hour: RoxHour): { text: string; tone: Tone } {
  if (rox >= ROX_LOW_RISK) return { text: 'Risiko intubasi RENDAH (≥4,88)', tone: 'emerald' };
  if (hour) {
    const thr = ROX_HIGH_RISK[hour];
    return rox < thr
      ? { text: `Risiko gagal HFNC TINGGI (<${thr} pada jam ke-${hour}) → pertimbangkan intubasi`, tone: 'red' }
      : { text: `Zona menengah (${thr}–4,88 pada jam ke-${hour}) — nilai ulang; ROX yang terus naik = prognosis lebih baik`, tone: 'amber' };
  }
  return { text: 'Pilih jam ke-2/6/12 sejak mulai HFNC untuk ambang risiko tinggi (≥4,88 = risiko rendah)', tone: 'slate' };
}

// ── Tabel PEEP rendah/FiO₂ tinggi ARDSNet ─────────────────────────────────────

export const ARDSNET_LOW_PEEP: [number, string][] = [
  [0.3, '5'], [0.4, '5–8'], [0.5, '8–10'], [0.6, '10'],
  [0.7, '10–14'], [0.8, '14'], [0.9, '14–18'], [1.0, '18–24'],
];

/** PEEP pada tabel PEEP rendah ARDSNet untuk FiO₂ (baris pertama dengan FiO₂ ≥ nilai pasien). */
export function ardsnetLowPeep(fio2: number): string | null {
  if (!Number.isFinite(fio2) || fio2 <= 0 || fio2 > 1) return null;
  const row = ARDSNET_LOW_PEEP.find(([f]) => f >= fio2 - 1e-9);
  return row ? row[1] : null;
}
