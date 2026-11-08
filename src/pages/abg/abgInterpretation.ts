// Interpretasi ABG 7 langkah — fungsi MURNI (tanpa React) agar bisa dites.
// Perhitungan inti ada di src/utils/abg.ts (asam-basa, H-H, FiO₂) dan
// src/utils/acidBase.ts (anion gap & delta ratio). File ini menyusun teks & kelas tampilan.
import { AbgInputs } from './types';
import {
  KPA_TO_MMHG, Tone, Disorder, AcidBaseAnalysis, HhCheck, Fio2Resolution,
  HCO3_LOW, HCO3_HIGH, PCO2_LOW, PCO2_HIGH,
  validateCore, analyzeAcidBase, hhCheck, resolveDirectFio2, estimateLowFlowFio2,
  arterialPhFromVenous, VBG_PH_OFFSET, DISORDER_LABEL,
} from '../../utils/abg';
import {
  anionGap, deltaRatio, DELTA_BAND_LABEL, DELTA_RATIO_CAUTION, AG_ALBUMIN_NORMAL_G_DL, AG_UPPER_NORMAL_DEFAULT,
} from '../../utils/acidBase';
import {
  RespSupport, SUPPORT_LABEL, ARDS_OTHER_CRITERIA, classifyRespFailure, pfLabel, ardsOxygenation,
  aaGradient, interpretAa, isRoomAir, expectedAaRoomAir, roxIndex, interpretRox, ardsnetLowPeep, RespFailureType,
} from '../../utils/oxygenation';

export interface OxResult {
  label: string;
  value: string;
  interp: string;
  colorClass: string;
}

export interface AbgResultData {
  /** Bila terisi, input inti tidak wajar dan interpretasi tidak dijalankan. */
  inputError: string | null;
  /** Peringatan input/konsistensi (FiO₂, H-H, satuan albumin, dll). */
  warnings: string[];
  step1: { status: string; detail: string; cls: string; hh: HhCheck } | null;
  step2Primer: { interp: string; detail: string; cls: string; notes: string[] } | null;
  step2KompStatus: { interp: string; cls: string } | null;
  step3Kompensasi: { detail: string; cls: string } | null;
  step4Ag: { high: boolean; interp: string; detail: string; ddNote?: string; cls: string; corr: boolean } | null;
  step5Laktat: { interp: string; detail: string; cls: string } | null;
  /** Kategori gagal napas (tipe 1/2, akut/kronik). */
  respFailure: { type: RespFailureType; title: string; details: string[]; cls: string } | null;
  step6Oksigenasi: { items: OxResult[]; cls: string; notes: string[] } | null;
  saran: string[];
  mgmt: { judul: string; color: string; isi: string[]; ref: string }[];
  analysis: AcidBaseAnalysis | null;
  /** Rincian rumus + substitusi angka pasien (pola CalcSteps). */
  calcSteps: { label: string; formula: string; note?: string }[];
  /** true bila sampel vena (VBG). */
  isVbg: boolean;
}

export interface AbgOptions {
  /** Batas atas AG normal lab (pengaturan pengguna, default 12). */
  agUpper?: number;
}

// Kelas warna — HANYA token yang ada (text-destructive, amber/emerald/slate Tailwind).
export const TONE_CLS: Record<Tone, string> = {
  red: 'bg-destructive/10 border-destructive/30 text-destructive',
  amber: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
  emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
  slate: 'bg-slate-500/10 border-slate-500/20 text-slate-700 dark:text-slate-300',
};
const TEXT_RED = 'text-destructive';
const TEXT_AMBER = 'text-amber-600 dark:text-amber-400';
const TEXT_EMERALD = 'text-emerald-600 dark:text-emerald-400';
const PRIMARY_CLS = 'bg-primary/10 border-primary/20 text-foreground';
const TEXT_TONE: Record<Tone, string> = { red: TEXT_RED, amber: TEXT_AMBER, emerald: TEXT_EMERALD, slate: 'text-foreground' };

function numOrNull(raw: string): number | null {
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : null;
}

const DEVICE_LABEL: Record<string, string> = {
  nasal: 'Nasal Cannula', simple: 'Simple Mask', nrm: 'NRM', venturi24: 'Venturi 24%',
};

function fmt1(n: number): string {
  return (Math.round(n * 10) / 10).toFixed(1);
}

function emptyResult(): AbgResultData {
  return {
    inputError: null, warnings: [],
    step1: null, step2Primer: null, step2KompStatus: null, step3Kompensasi: null,
    step4Ag: null, step5Laktat: null, respFailure: null, step6Oksigenasi: null, saran: [], mgmt: [], analysis: null,
    calcSteps: [], isVbg: false,
  };
}

export function resolveFio2(inputs: AbgInputs): Fio2Resolution {
  if (inputs.fio2Mode === 'direct') return resolveDirectFio2(inputs.fio2Direct);
  const flow = parseFloat(inputs.fio2Flow);
  const v = estimateLowFlowFio2(inputs.fio2Device, flow);
  if (v === null) return { value: null, estimated: false };
  const isVenturi = inputs.fio2Device.startsWith('venturi');
  return {
    value: v,
    estimated: !isVenturi,
    note: isVenturi ? undefined : `FiO₂ ≈ ${v.toFixed(2)} diestimasi dari ${DEVICE_LABEL[inputs.fio2Device] ?? inputs.fio2Device} ${inputs.fio2Flow} L/m — FiO₂ nyata bervariasi dengan pola napas; P/F & ROX hanya perkiraan dan belum memenuhi syarat klasifikasi ARDS Berlin (butuh PEEP/CPAP ≥5).`,
  };
}

export function interpretAbg(inputs: AbgInputs, opts: AbgOptions = {}): AbgResultData | null {
  const rawPh = parseFloat(inputs.ph);
  const rawPco2 = parseFloat(inputs.pco2);
  const hco3 = parseFloat(inputs.hco3);
  if (isNaN(rawPh) || isNaN(rawPco2) || isNaN(hco3)) return null;

  const result = emptyResult();
  const isVbg = inputs.sampleType === 'vena';
  result.isVbg = isVbg;
  const phMeasured = rawPh;
  // VBG: pH arteri ≈ pH vena + 0,03 (Byrne 2014) — dipakai untuk interpretasi, ditampilkan eksplisit.
  const pH = isVbg ? Math.round(arterialPhFromVenous(rawPh) * 1000) / 1000 : rawPh;
  const paco2Unit = inputs.paco2Unit;
  const pco2 = paco2Unit === 'kPa' ? rawPco2 * KPA_TO_MMHG : rawPco2;
  const steps: AbgResultData['calcSteps'] = [];

  const coreError = validateCore(phMeasured, pco2, hco3);
  if (coreError) {
    result.inputError = coreError;
    return result;
  }

  // PaO₂ ikut satuan gas (mmHg/kPa). Pada VBG, PO₂ vena tidak dipakai untuk oksigenasi.
  const po2Raw = parseFloat(inputs.po2);
  const po2Conv = paco2Unit === 'kPa' ? po2Raw * KPA_TO_MMHG : po2Raw;
  const po2 = isVbg ? NaN : po2Conv;
  if (isVbg) {
    result.warnings.push(`Mode VBG (vena perifer): pH vena ${phMeasured} → perkiraan pH arteri ${pH.toFixed(2)} (+${VBG_PH_OFFSET}; Byrne 2014). PCO₂ vena TIDAK dapat menggantikan PaCO₂ (interval prediksi bias −10,7 s/d +2,4 mmHg) → kesimpulan respiratorik/kompensasi hanya perkiraan. PO₂ vena tidak dipakai untuk oksigenasi — gunakan SpO₂ (S/F). Konfirmasi dengan AGD arteri bila keputusan bergantung pada komponen respiratorik.`);
  }
  const beRaw = parseFloat(inputs.be);
  const be: number | null = Number.isFinite(beRaw) ? beRaw : null;
  const spo2 = parseFloat(inputs.spo2);
  const fio2Res = resolveFio2(inputs);
  const fio2 = fio2Res.value;
  if (fio2Res.invalid) result.warnings.push(fio2Res.invalid);
  if (fio2Res.note) result.warnings.push(fio2Res.note);
  const mapV = parseFloat(inputs.mapV);
  const na = parseFloat(inputs.na);
  const cl = parseFloat(inputs.cl);
  let alb = parseFloat(inputs.alb);
  if (!isNaN(alb) && inputs.albUnit === 'mg/dL') alb = alb / 1000;
  const laktat = parseFloat(inputs.laktat);
  const rr = parseFloat(inputs.rr);
  const kondisi = inputs.kondisi;
  const agUpper = opts.agUpper ?? AG_UPPER_NORMAL_DEFAULT;

  const spo2Source = inputs.spo2Source === 'pulse' ? 'SpO₂ (Pulse Ox)' : 'SaO₂ (ABG)';
  const paco2Label = paco2Unit === 'kPa' ? `${(pco2 / KPA_TO_MMHG).toFixed(1)} kPa (= ${pco2.toFixed(0)} mmHg)` : `${pco2.toFixed(0)} mmHg`;
  const pco2Name = isVbg ? 'PvCO₂' : 'PaCO₂';

  // ── Cek konsistensi Henderson–Hasselbalch ──────────────────────────────────
  const hh = hhCheck(phMeasured, pco2, hco3);
  steps.push({
    label: 'Langkah 1 — Konsistensi Henderson–Hasselbalch',
    formula: `HCO₃⁻ hitung = 0,0307 × ${pco2Name} × 10^(pH − 6,1)\n= 0,0307 × ${fmt1(pco2)} × 10^(${phMeasured} − 6,1) = ${fmt1(hh.hco3Calc)} mmol/L (input ${hco3})`,
    note: hh.consistent ? 'Konsisten (dalam toleransi pembulatan input + 1 mmol/L).' : 'TIDAK konsisten — cek salah ketik atau sumber HCO₃⁻.',
  });
  if (isVbg) {
    steps.push({ label: 'Konversi VBG', formula: `pH arteri ≈ pH vena + ${VBG_PH_OFFSET} = ${phMeasured} + ${VBG_PH_OFFSET} = ${pH.toFixed(2)}`, note: 'Byrne 2014 (meta-analisis). PCO₂ & PO₂ vena tidak dikonversi karena tidak sebanding.' });
  }
  if (!hh.consistent) {
    result.warnings.push(`Cek Henderson–Hasselbalch: HCO₃⁻ yang dihitung dari pH ${phMeasured} & ${pco2Name} ${pco2.toFixed(0)} = ${fmt1(hh.hco3Calc)} mmol/L, sedangkan input ${hco3} (pH yang sesuai dengan input = ${hh.phCalc.toFixed(2)}). Selisih melebihi toleransi pembulatan — cek salah ketik, atau HCO₃⁻ berasal dari sampel/pemeriksaan lain (mis. tCO₂ kimia darah). Interpretasi di bawah bisa tidak valid.`);
  }

  // LANGKAH 1: STATUS pH
  let phStatusText: string;
  let phCls: string;
  if (pH < 7.35) {
    phStatusText = pH < 7.20 ? 'Asidemia BERAT (pH <7.20)' : 'Asidemia';
    phCls = TONE_CLS.red;
  } else if (pH > 7.45) {
    phStatusText = pH > 7.55 ? 'Alkalemia BERAT (pH >7.55)' : 'Alkalemia';
    phCls = TONE_CLS.amber;
  } else {
    phStatusText = 'pH Normal (7.35–7.45)';
    phCls = TONE_CLS.emerald;
  }
  result.step1 = {
    status: phStatusText, cls: phCls, hh,
    detail: `${isVbg ? `pH vena = ${phMeasured} → pH arteri ≈ ${pH.toFixed(2)}` : `pH = ${pH}`} · ${pco2Name} = ${paco2Label} · HCO₃⁻ = ${hco3} mmol/L · BE = ${be === null ? '— (tidak diisi)' : `${be} mEq/L`}${!isNaN(alb) ? ` · Albumin = ${inputs.albUnit === 'mg/dL' ? (alb * 1000).toFixed(0) + ' mg/dL' : alb.toFixed(1) + ' g/dL'}` : ''} · HCO₃⁻ hitung (H-H) = ${fmt1(hh.hco3Calc)}`,
  };

  // LANGKAH 2–3: GANGGUAN PRIMER, STATUS KOMPENSASI, EVALUASI KOMPENSASI
  const ab = analyzeAcidBase(pH, pco2, hco3, be);
  result.analysis = ab;
  const has = (d: Disorder) => ab.disorders.includes(d);
  const acidosis = pH < 7.35, alkalosis = pH > 7.45;

  const step2Notes = isVbg ? [...ab.notes, 'VBG: komponen respiratorik dinilai dari PCO₂ vena — hanya perkiraan; konfirmasi AGD arteri.'] : ab.notes;
  result.step2Primer = {
    interp: ab.primaryText, cls: PRIMARY_CLS, notes: step2Notes,
    detail: `pH ${pH < 7.40 ? '<7.40 (condong asam)' : pH > 7.40 ? '>7.40 (condong basa)' : '= 7.40'} · PaCO₂ = ${pco2.toFixed(0)} mmHg (N:35–45) · HCO₃⁻ = ${hco3} (N:22–26) · BE = ${be === null ? '—' : be}`,
  };
  result.step2KompStatus = { interp: ab.compStatus.text, cls: TONE_CLS[ab.compStatus.tone] };
  const vbgCompCaveat = ' Selisih PCO₂ vena–arteri bervariasi lebar (Byrne 2014), sehingga kesimpulan kompensasi/gangguan respiratorik bersamaan dari PvCO₂ bisa keliru — konfirmasi AGD arteri.';
  result.step3Kompensasi = { detail: isVbg ? `[Perkiraan — PCO₂ vena] ${ab.compNote.text}${vbgCompCaveat}` : ab.compNote.text, cls: isVbg ? TONE_CLS.amber : TONE_CLS[ab.compNote.tone] };
  ab.evals.forEach(e => {
    steps.push({
      label: `Langkah 3 — Harapan kompensasi untuk ${DISORDER_LABEL[e.primary]}`,
      formula: e.expected.map(x => `${x.component === 'PaCO₂' && isVbg ? 'PCO₂' : x.component} harapan (${x.label}) = ${fmt1(x.value)} ± ${String(x.tol).replace('.', ',')} → aktual ${x.component === 'PaCO₂' ? `${fmt1(pco2)}${isVbg ? ' (PvCO₂)' : ''}` : hco3}`).join('\n'),
      note: isVbg ? `[Perkiraan — PvCO₂] ${e.text}` : e.text,
    });
  });

  // LANGKAH 4: ANION GAP
  const albForAg = !isNaN(alb) ? alb : null;
  const agRes = anionGap(na, cl, hco3, albForAg, agUpper);
  const agHigh = agRes?.high ?? false;
  if (agRes) {
    if (agRes.albuminSuspectUnit) {
      result.warnings.push(`Albumin ${alb} g/dL tidak wajar (>7) — kemungkinan satuan g/L (mis. 35 g/L = 3,5 g/dL). Koreksi albumin untuk AG tidak dihitung.`);
    }
    let agNote = `AG = ${na} − (${cl} + ${hco3}) = ${fmt1(agRes.ag)} mEq/L`;
    if (agRes.agCorr !== null) agNote += ` · AG terkoreksi = AG + 2,5 × (${AG_ALBUMIN_NORMAL_G_DL.toFixed(1)} − ${alb}) = ${fmt1(agRes.agCorr)} mEq/L`;
    agNote += ` → ${agRes.high ? 'TINGGI' : 'normal'} (batas atas normal ${agRes.upper}${agRes.agCorr !== null ? ', dinilai dari AG terkoreksi' : ''})`;

    let ddNote = '';
    if (agRes.high) {
      const dd = deltaRatio(agRes.effective, hco3, agRes.upper);
      if (dd.ratio !== null && dd.band) {
        ddNote = `Delta ratio = (${fmt1(agRes.effective)} − ${agRes.upper}) ÷ (24 − ${hco3}) = ${dd.ratio.toFixed(2)} → ${DELTA_BAND_LABEL[dd.band]}`;
      } else {
        ddNote = `HCO₃⁻ ${hco3} ≥ 24 meski AG naik ${fmt1(dd.deltaAg)} → rasio tidak terdefinisi; pola AG tinggi tanpa penurunan HCO₃⁻ mengarah ke HAGMA + alkalosis metabolik bersamaan.`;
      }
    }

    {
      const lines = [`AG = Na − (Cl + HCO₃⁻) = ${na} − (${cl} + ${hco3}) = ${fmt1(agRes.ag)} mEq/L`];
      if (agRes.agCorr !== null) lines.push(`AG terkoreksi = AG + 2,5 × (${AG_ALBUMIN_NORMAL_G_DL.toFixed(1)} − albumin) = ${fmt1(agRes.ag)} + 2,5 × (${AG_ALBUMIN_NORMAL_G_DL.toFixed(1)} − ${alb}) = ${fmt1(agRes.agCorr)} mEq/L`);
      if (agRes.high) {
        const dd = deltaRatio(agRes.effective, hco3, agRes.upper);
        lines.push(dd.ratio !== null
          ? `Δ ratio = (AG${agRes.agCorr !== null ? ' terkoreksi' : ''} − ${agRes.upper}) ÷ (24 − HCO₃⁻) = (${fmt1(agRes.effective)} − ${agRes.upper}) ÷ (24 − ${hco3}) = ${dd.ratio.toFixed(2)}`
          : `Δ ratio: 24 − ${hco3} ≤ 0 → tidak terdefinisi`);
      }
      steps.push({ label: 'Langkah 4 — Anion gap & delta ratio', formula: lines.join('\n'), note: `Batas atas AG normal ${agRes.upper} (dapat diatur). ${agRes.high ? DELTA_RATIO_CAUTION : ''}`.trim() });
    }
    result.step4Ag = {
      high: agHigh, corr: agRes.agCorr !== null,
      interp: agNote,
      detail: agHigh ? `Penyebab HAGMA: Laktat, Ketoasidosis (DKA/alkohol), Uremia, Racun (metanol/etilen glikol), Salisilat — Mnemonic LKURS. ${DELTA_RATIO_CAUTION}` : '',
      ddNote: ddNote || undefined,
      cls: agHigh ? TONE_CLS.red : TONE_CLS.emerald,
    };
  }

  // LANGKAH 5: LAKTAT
  if (!isNaN(laktat)) {
    const lakCls = laktat < 2 ? TONE_CLS.emerald : laktat < 4 ? TONE_CLS.amber : TONE_CLS.red;
    const lakNote = laktat < 2 ? 'Normal (<2 mmol/L)' : laktat < 4 ? `Hiperlaktatemia (${laktat.toFixed(1)} mmol/L) — waspada hipoperfusi/HAGMA` : `Laktat BERAT (${laktat.toFixed(1)} mmol/L) — asidosis laktat, mortalitas ↑ signifikan`;
    result.step5Laktat = {
      interp: lakNote, cls: lakCls,
      detail: laktat >= 2 ? 'Evaluasi: syok (Tipe A), DKA, gagal hati, metformin, thiamine def (Tipe B)' : '',
    };
  }

  // LANGKAH 6: GAGAL NAPAS & OKSIGENASI (Fase 3 — utils/oxygenation.ts)
  const support: RespSupport = inputs.fio2Mode === 'lowflow' ? 'udara' : inputs.support;
  const peep = numOrNull(inputs.peep);
  const hfnoFlow = numOrNull(inputs.hfnoFlow);
  const age = numOrNull(inputs.age);
  const pao2 = isNaN(po2) ? null : po2;
  const spo2v = isNaN(spo2) ? null : spo2;

  if (isVbg) {
    const d = ['Tipe 1 butuh PaO₂ arteri; tipe 2 butuh PaCO₂ arteri — keduanya tidak dapat diganti nilai vena (Byrne 2014).'];
    if (pco2 > 45) d.push(`PvCO₂ ${fmt1(pco2)} >45 mmHg — curigai hiperkapnia; konfirmasi dengan AGD arteri.`);
    if (spo2v !== null) d.push(`SpO₂ ${spo2v}% dapat dipakai untuk S/F & ROX (bila HFNC).`);
    result.respFailure = { type: 'tidak-dinilai', title: 'Kategori gagal napas tidak dapat dipastikan dari VBG', details: d, cls: TONE_CLS.slate };
  } else {
    const rf = classifyRespFailure({ ph: pH, pco2, hco3, pao2, fio2, fio2Estimated: fio2Res.estimated, kondisi });
    result.respFailure = { type: rf.type, title: rf.title, details: rf.details, cls: TONE_CLS[rf.tone] };
  }

  if (pao2 !== null || fio2 !== null || spo2v !== null) {
    const oxItems: OxResult[] = [];
    const notes: string[] = [];
    const pf = pao2 !== null && fio2 !== null ? pao2 / fio2 : null;
    if (pf !== null) {
      const l = pfLabel(pf);
      oxItems.push({ label: 'P/F Ratio', value: pf.toFixed(0) + (fio2Res.estimated ? ' (FiO₂ estimasi)' : ''), interp: l.text, colorClass: TEXT_TONE[l.tone] });
      steps.push({ label: 'Langkah 6 — Rasio P/F', formula: `P/F = PaO₂ ÷ FiO₂ = ${fmt1(pao2 as number)} ÷ ${(fio2 as number).toFixed(2)} = ${pf.toFixed(0)}`, note: `${l.text}${fio2Res.estimated ? ' · FiO₂ hasil estimasi alat low-flow' : ''}` });
    }
    const ox = pf !== null || (spo2v !== null && fio2 !== null)
      ? ardsOxygenation({ pf, spo2: spo2v, fio2, support, peep, hfnoFlow, fio2Estimated: fio2Res.estimated })
      : null;
    if (ox && ox.sf !== null) {
      oxItems.push({
        label: 'S/F Ratio', value: ox.sf.toFixed(0),
        interp: !ox.sfValid ? 'Tidak dipakai untuk klasifikasi (SpO₂ >97%)' : ox.sf <= 315 ? '≤315 — ambang hipoksemia ARDS (Global 2023)' : '>315 — di atas ambang ARDS',
        colorClass: ox.sfValid && ox.sf <= 315 ? TEXT_RED : 'text-foreground',
      });
      steps.push({ label: 'Langkah 6 — Rasio S/F', formula: `S/F = SpO₂ ÷ FiO₂ = ${spo2v} ÷ ${(fio2 as number).toFixed(2)} = ${ox.sf.toFixed(0)}`, note: 'Valid untuk definisi Global 2023 hanya bila SpO₂ ≤97%.' });
    }
    if (ox && ox.meetsOxygenation) {
      notes.push(`Dukungan napas: ${SUPPORT_LABEL[support]}${peep !== null && (support === 'niv' || support === 'invasif') ? `, PEEP ${peep}` : ''}${hfnoFlow !== null && support === 'hfno' ? `, flow ${hfnoFlow} L/m` : ''}.`);
      notes.push(ox.berlin, ox.global, ARDS_OTHER_CRITERIA);
      if (kondisi === 'cardiac') notes.push('Kondisi edema paru kardiogenik: ARDS hanya bila hipoksemia TIDAK sepenuhnya dijelaskan gagal jantung/kelebihan cairan.');
    }

    if (pao2 !== null && fio2 !== null) {
      const aa = aaGradient(fio2, pco2, pao2);
      const ai = interpretAa(aa, fio2, age);
      const normalTxt = isRoomAir(fio2) && age !== null ? ` (perkiraan normal ≤${expectedAaRoomAir(age).toFixed(1)})` : '';
      oxItems.push({ label: 'A-a Gradient', value: `${aa.toFixed(0)} mmHg${normalTxt}`, interp: ai.text, colorClass: TEXT_TONE[ai.tone] });
      steps.push({
        label: 'Langkah 6 — A-a gradient',
        formula: `PAO₂ = FiO₂ × (760 − 47) − PaCO₂ ÷ 0,8 = ${fio2.toFixed(2)} × 713 − ${fmt1(pco2)} ÷ 0,8 = ${fmt1(fio2 * 713 - pco2 / 0.8)}\nA-a = PAO₂ − PaO₂ = ${fmt1(fio2 * 713 - pco2 / 0.8)} − ${fmt1(pao2)} = ${fmt1(aa)} mmHg${age !== null ? `\nNormal (udara ruang) ≈ usia/4 + 4 = ${age}/4 + 4 = ${expectedAaRoomAir(age).toFixed(1)}` : ''}`,
        note: ai.text,
      });
      notes.push('A-a: PAO₂ = FiO₂ × (760 − 47) − PaCO₂/0,8 — asumsi tekanan barometrik permukaan laut; perkiraan normal udara ruang ≈ usia/4 + 4.');
    }
    if (pao2 !== null && fio2 !== null && !isNaN(mapV)) {
      const oi = (mapV * fio2 * 100) / pao2;
      oxItems.push({
        label: 'OI (Paw)', value: `${mapV} × ${fio2.toFixed(2)} × 100 ÷ ${pao2} = ${oi.toFixed(1)}`,
        interp: 'Tidak ada ambang dewasa baku — pakai untuk tren (makin tinggi makin berat); ambang OI yang beredar berasal dari populasi pediatri/neonatus',
        colorClass: 'text-foreground',
      });
      steps.push({ label: 'Langkah 6 — Oxygenation Index', formula: `OI = Paw × FiO₂ × 100 ÷ PaO₂ = ${mapV} × ${fio2.toFixed(2)} × 100 ÷ ${fmt1(pao2)} = ${oi.toFixed(1)}` });
    }
    if (spo2v !== null && fio2 !== null && !isNaN(rr)) {
      if (support === 'hfno') {
        const rox = roxIndex(spo2v, fio2, rr);
        const ri = interpretRox(rox, inputs.roxHour);
        oxItems.push({
          label: 'ROX Index',
          value: `(${spo2v}/${fio2.toFixed(2)})/${rr} = ${rox.toFixed(2)}${inputs.roxHour ? ` · jam ke-${inputs.roxHour}` : ''} [${spo2Source}]`,
          interp: ri.text, colorClass: TEXT_TONE[ri.tone],
        });
        steps.push({ label: 'Langkah 6 — ROX index', formula: `ROX = (SpO₂ ÷ FiO₂) ÷ RR = (${spo2v} ÷ ${fio2.toFixed(2)}) ÷ ${rr} = ${rox.toFixed(2)}`, note: ri.text });
        notes.push('ROX divalidasi pada pneumonia dengan HFNC (Roca 2019).');
        if (pco2 > 45) notes.push('ROX hanya memakai SpO₂, FiO₂, dan RR — TIDAK menilai hiperkapnia/asidosis. Jangan pakai ROX "risiko rendah" untuk menunda NIV/intubasi pada gagal napas tipe 2.');
      } else {
        notes.push('ROX tidak dihitung — hanya divalidasi pada pasien dengan HFNC (pilih dukungan napas "HFNC").');
      }
    }
    if (isVbg && !isNaN(po2Raw)) notes.unshift('PO₂ vena diabaikan — tidak sebanding dengan PaO₂ (Byrne 2014); P/F, A-a, dan OI tidak dihitung.');
    if (oxItems.length > 0 || notes.length > 0) {
      result.step6Oksigenasi = { items: oxItems, cls: PRIMARY_CLS, notes };
    }
  }

  // KONSIDERASI KLINIS
  // PEEP: heuristik lama (5–8 / 8–13 / 13–18) diganti tabel PEEP rendah ARDSNet + catatan ATS 2024.
  if (pao2 !== null && fio2 !== null && kondisi !== 'cardiac') {
    const pf = pao2 / fio2;
    if (pf <= 300) {
      if (support === 'invasif') {
        const tbl = ardsnetLowPeep(fio2);
        result.saran.push(`Ventilasi invasif, P/F ${pf.toFixed(0)}: kombinasi PEEP/FiO₂ tabel PEEP rendah ARDSNet untuk FiO₂ ${fio2.toFixed(2)} → PEEP ${tbl ?? '—'} cmH₂O${pf <= 200 ? '. ARDS sedang–berat: ATS 2024 menyarankan strategi PEEP lebih tinggi TANPA recruitment maneuver berkepanjangan (tabel PEEP tinggi ARDSNet / protokol RS)' : ''}`);
      } else {
        result.saran.push(`P/F ${pf.toFixed(0)} ≤300 tanpa ventilasi invasif: pantau ketat tanda kelelahan napas & kebutuhan intubasi${support === 'hfno' ? '; nilai ROX pada jam ke-2, 6, dan 12' : ''}`);
      }
      if (pf < 150) result.saran.push('P/F <150: prone ≥16 jam/hari (FiO₂ ≥0,6, PEEP ≥5 — PROSEVA); NMB opsional pada ARDS berat dini; ECMO-VV sesuai kriteria EOLIA (lihat kartu ARDS)');
    }
  }
  if (!isVbg && pH < 7.25 && pco2 > 50) result.saran.push('Asidosis respiratorik berat: ↑ RR (maks 35) lalu VT bertahap dengan memantau Pplat; NaHCO₃ hanya opsi bila pH <7,15 meski ventilasi sudah optimal (algoritma ARDSNet)');
  if (!isVbg && pco2 < 35 && pH > 7.45) result.saran.push('Alkalosis respiratorik: ↓ RR (bertahap), cek dead space, pastikan tidak ada pain/agitasi yang meningkatkan drive');
  if (has('asidosis-metabolik') && be !== null && be < -5) result.saran.push('Asidosis metabolik: koreksi penyebab primer (sepsis, hipovolemia, DKA). NaHCO₃ bukan terapi rutin — lihat kartu Koreksi Asidosis Metabolik (BICAR-ICU, BICARICU-2)');
  if (pH > 7.50 && hco3 > 30) result.saran.push('Alkalosis metabolik: koreksi hipokalemia, hipokloremia; hentikan diuretik; KCl replacement');
  if (kondisi === 'copd' && pco2 > 55) result.saran.push('PPOK: TARGET PaCO₂ = baseline pasien, bukan normocapnia! Koreksi bertahap — risiko alkalosis metabolik berat');
  if (kondisi === 'ards') result.saran.push('ARDS: Pplat ≤30 & driving pressure ≤15 cmH₂O; hiperkapnia ditoleransi — ikuti algoritma pH ARDSNet (target 7,30–7,45; pH <7,15 → RR 35, lalu VT +1 mL/kg bertahap)');

  // ── TATALAKSANA: dipicu GANGGUAN YANG TERIDENTIFIKASI (primer/bersamaan), bukan
  //    sekadar nilai di luar rentang — supaya HCO₃⁻/PaCO₂ hasil kompensasi tidak "dikoreksi".
  //    Kartu koreksi juga mensyaratkan nilai absolut abnormal: gangguan "relatif"
  //    (mis. PaCO₂ 30 tapi > harapan Winter) cukup dijelaskan di Langkah 3.
  // ── Isi kartu diperbarui Fase 2 (2026-11) — setiap angka bersumber; lihat `ref` tiap kartu.
  const metAcidCard = has('asidosis-metabolik') && hco3 < HCO3_LOW;
  const metAlkCard = has('alkalosis-metabolik') && hco3 > HCO3_HIGH;
  // VBG: kartu koreksi respiratorik tidak ditampilkan (PCO₂ vena tidak sebanding PaCO₂).
  const respAcidCard = !isVbg && has('asidosis-respiratorik') && pco2 > PCO2_HIGH && acidosis;
  const respAlkCard = !isVbg && has('alkalosis-respiratorik') && pco2 < PCO2_LOW && alkalosis;
  if (isVbg && (pco2 > PCO2_HIGH || pco2 < PCO2_LOW)) result.saran.push('VBG: PCO₂ vena di luar rentang — kartu koreksi respiratorik tidak ditampilkan; konfirmasi dengan AGD arteri sebelum mengubah ventilasi.');
  const pfNow = !isNaN(po2) && fio2 !== null ? po2 / fio2 : null;
  const laktatTxt = isNaN(laktat) ? '?' : laktat.toFixed(1);

  // NaHCO₃: BICAR-ICU (Lancet 2018) — pH ≤7,20: luaran primer tidak berbeda, manfaat hanya di strata AKIN 2–3;
  // BICARICU-2 (JAMA 2025) — pH ≤7,20 + AKI sedang–berat: mortalitas 90 hari 62,1% vs 61,7%, KRT 35% vs 50%.
  const bicarText = pH <= 7.20
    ? 'pH ≤7,20: BUKAN terapi rutin. Bila disertai AKI sedang–berat dapat dipertimbangkan untuk mengurangi kebutuhan KRT (BICARICU-2: KRT 35% vs 50%) — mortalitas 90 hari TIDAK berbeda (62,1% vs 61,7%). Tanpa AKI, BICAR-ICU tidak menunjukkan perbaikan luaran primer.'
    : 'pH >7,20: tidak diindikasikan — koreksi penyebab primer.';

  if (metAcidCard) {
    const isHAGMA = agHigh;
    const isNAGMA = agRes !== null && !agHigh;
    result.mgmt.push({
      judul: 'Koreksi Asidosis Metabolik',
      color: 'text-destructive',
      isi: [
        `NaHCO₃ IV — ${bicarText}`,
        'Dosis & target: hitung di tab 🧪 NaHCO₃ (faktor ruang distribusi menyesuaikan beratnya asidosis). Kedua uji klinis memakai target pH ≥7,30 — bukan normalisasi HCO₃.',
        'Sediaan: NaHCO₃ 8,4% = 1 mEq/mL; 7,5% = 0,9 mEq/mL. Protokol BICAR-ICU: NaHCO₃ 4,2% 125–250 mL dalam 30 menit, maks 1000 mL/24 jam.',
        'Perhatian: NaHCO₃ → ↑ PaCO₂ transien — pastikan ventilasi adekuat. Efek samping yang tercatat di BICAR-ICU: alkalosis metabolik, hipernatremia, hipokalsemia. Hindari bila ada alkalosis metabolik bersamaan (Δ-ratio >2).',
        isHAGMA ? 'HAGMA: Prioritas koreksi kausa (laktat → resusitasi, DKA → insulin, uremia → RRT, toksik → eliminasi)' : '',
        isNAGMA ? 'NAGMA: Identifikasi etiologi — diarrhea → rehidrasi; RTA → NaHCO₃ kronik 1–2 mEq/kg/hari; dilutional → hentikan saline, ganti ke balanced crystalloid' : '',
        'Monitoring post-koreksi: pH, PaCO₂, K⁺ (hipokalemia memburuk saat pH naik), Na⁺, Ca²⁺ ion'
      ].filter(Boolean),
      ref: 'Jaber S et al. Lancet 2018 (BICAR-ICU) · Jung B et al. JAMA 2025 (BICARICU-2) · Kraut JA, Madias NE. NEJM 2014 · Berend K. NEJM 2014'
    });
  }

  if (metAlkCard) {
    const severeAlk = hco3 > 40 || pH > 7.55;
    result.mgmt.push({
      judul: 'Koreksi Alkalosis Metabolik',
      color: TEXT_AMBER,
      isi: [
        'Tentukan tipe dengan Cl⁻ URIN spot: <20 mEq/L → chloride-responsive (muntah, NGT, pasca-diuretik); ≥20 → chloride-resistant (hiperaldosteronisme, Cushing, Bartter/Gitelman) — atau masih dalam efek diuretik',
        'Chloride-responsive: NaCl 0,9% IV + koreksi K⁺',
        'KCl IV: ≤10 mEq/jam via perifer, ≤20 mEq/jam via sentral (selaras Kalkulator Elektrolit) — koreksi hipokalemia dulu (target K⁺ ≥3,5 mEq/L)',
        'Chloride-resistant (hiperaldosteronisme, Cushing, Bartter): koreksi underlying + spironolakton/amiloride',
        hco3 > 35 ? 'Acetazolamide 250–500 mg IV/8 jam: pilihan untuk CHF/fluid-overloaded (hindari eGFR <30, sulfa allergy)' : '',
        severeAlk ? 'Alkalosis BERAT/refrakter (pH >7,55 atau HCO₃ >40): pertimbangkan HCl 0,1 N via vena sentral — defisit H⁺ = 0,5 × BB × (HCO₃ aktual − HCO₃ target) mEq, laju ≤0,2 mEq/kg/jam; hitung di tab ⚗️ KCl / HCl. Rumus tidak memperhitungkan kehilangan asam berlanjut (mis. NGT) — pantau AGD & elektrolit serial.' : '',
        'Stop penyebab iatrogenik: kurangi/stop diuretik, hindari antasid berlebihan, kurangi transfusi sitrat'
      ].filter(Boolean),
      ref: 'Emmett M. CJASN 2020 · Galla JH. JASN 2000 · Laski ME, Sabatini S. Semin Nephrol 2006'
    });
  }

  if (respAcidCard) {
    const permHyperCap = kondisi === 'ards' || (pfNow !== null && pfNow < 200);
    result.mgmt.push({
      judul: 'Koreksi Asidosis Respiratorik',
      color: 'text-destructive',
      isi: [
        kondisi === 'copd' ? 'PPOK: TARGET PaCO₂ = baseline pasien (bukan 40 mmHg!) — koreksi agresif risiko alkalosis rebound berat' : 'Target: perbaiki ventilasi alveolar, bukan buffer HCO₃',
        kondisi === 'copd' || kondisi === 'umum' ? 'NIV bilevel lini pertama pada PPOK eksaserbasi dengan asidosis respiratorik (pH ≤7,35) bila sadar & kooperatif (ERS/ATS 2017). Contoh setelan awal IPAP 12–18 / EPAP 4–8 cmH₂O, titrasi dengan AGD ulang' : '',
        'Intubasi jika: NIV gagal/kontraindikasi, GCS ↓ berat, sekresi tidak terkontrol, instabilitas hemodinamik',
        'Pada ventilator: ↑ RR bertahap (maks 35/mnt), awasi auto-PEEP. VT di atas 6 mL/kgBBP hanya sesuai algoritma ARDSNet (pH <7,15 meski RR 35) sambil memantau Pplat',
        permHyperCap ? 'Hiperkapnia permisif (ARDS/lung-protective) — algoritma pH ARDSNet: target pH 7,30–7,45; pH 7,15–7,30 → naikkan RR (maks 35); pH <7,15 → RR 35, lalu VT +1 mL/kg bertahap (Pplat 30 boleh terlampaui), NaHCO₃ boleh diberikan. JANGAN ↑ VT hanya untuk "normalisasi" CO₂' : '',
        'NaHCO₃ TIDAK diindikasikan untuk asidosis resp murni — hanya opsi bila pH <7,15 dan ventilasi sudah dioptimalkan (ARDSNet)',
        'Bronkodilator nebulisasi: salbutamol 2.5 mg + ipratropium 0.5 mg q4–6h (esp. PPOK/asma)'
      ].filter(Boolean),
      ref: 'GOLD 2024 · Rochwerg B. Eur Respir J 2017 (NIV) · ARDS Network. NEJM 2000 + protokol ARDSNet · Slutsky AS, Ranieri VM. NEJM 2013'
    });
  }

  if (respAlkCard) {
    result.mgmt.push({
      judul: 'Koreksi Alkalosis Respiratorik',
      color: TEXT_AMBER,
      isi: [
        'Koreksi penyebab: nyeri → analgesia (morfin/fentanyl titrasi); agitasi → sedasi (propofol/midazolam titrasi); sepsis → kultur + antibiotik',
        'Pada ventilator: ↓ RR 2/mnt bertahap (min 10/mnt) atau ↓ VT; pastikan analgesia/sedasi adekuat',
        'Hipokapnia/alkalemia → vasokonstriksi serebral, aritmia, dan ambang kejang turun (Laffey & Kavanagh 2002); bila hipokapnia sudah berlangsung lama, normalisasi PaCO₂ dilakukan bertahap',
        'Elektrolit yang sering terganggu: hipokalemia, hipofosfatemia, hipokalsemia ionik — koreksi bersamaan',
        'Liver failure: alkalosis resp persisten akibat hiperammonemia — tidak bisa dicegah tanpa koreksi kausa hepatik',
        'Cek VD/VT meningkat jika PaCO₂ rendah persisten meski RR sudah diturunkan (dead space patologis)'
      ],
      ref: 'Berend K. NEJM 2014 · Laffey JG, Kavanagh BP. NEJM 2002'
    });
  }

  // ── TATALAKSANA KONDISI KLINIS SPESIFIK ─────────────────────────────────
  if (agHigh && !isNaN(laktat) && laktat >= 2) {
    result.mgmt.push({
      judul: 'Asidosis Laktat / HAGMA',
      color: 'text-primary',
      isi: [
        kondisi === 'cardiac'
          ? 'Edema paru kardiogenik + laktat tinggi: curigai hipoperfusi/syok kardiogenik — HINDARI bolus cairan rutin; dukungan inotropik/vasopresor & atasi kausa jantung (lihat kartu Edema Paru Kardiogenik)'
          : 'Target MAP awal 65 mmHg — resusitasi dengan kristaloid seimbang (RL/PlasmaLyte) lebih disarankan daripada NaCl 0,9% (SSC 2021)',
        'Norepinefrin lini pertama bila MAP tidak respons cairan — boleh dimulai via vena perifer daripada menunda menunggu akses sentral (SSC 2021)',
        `Laktat saat ini: ${laktat.toFixed(1)} mmol/L${laktat >= 4 ? ' — BERAT, mortalitas ↑' : ''}. Ukur ulang bila >2 mmol/L dan arahkan resusitasi untuk menurunkannya (SSC 2021)`,
        `NaHCO₃: ${pH <= 7.20 ? 'bukan untuk memperbaiki hemodinamik/kebutuhan vasopresor pada asidosis laktat hipoperfusi (SSC 2021). Bila disertai AKI sedang–berat dapat dipertimbangkan — BICARICU-2: KRT ↓ (35% vs 50%), mortalitas sama. Dosis di tab 🧪 NaHCO₃' : 'tidak diindikasikan (pH >7,20) — koreksi kausa primer'}`,
        'Koreksi kausa primer: sepsis (antibiotik <1 jam dari onset), iskemia (revaskularisasi), DKA (insulin), hepatik (koreksi koagulopati)',
        'Tiamin IV 100–200 mg jika suspek defisiensi (alkohol, malnutrisi, refrakter terhadap resusitasi)'
      ],
      ref: 'Evans L et al. Intensive Care Med 2021 (SSC) · Jaber S. Lancet 2018 (BICAR-ICU) · Jung B. JAMA 2025 (BICARICU-2) · Kraut JA, Madias NE. NEJM 2014'
    });
  }

  if (agHigh && (isNaN(laktat) || laktat < 4) && metAcidCard) {
    result.mgmt.push({
      judul: 'Kemungkinan DKA / Ketoasidosis — konfirmasi GDS & keton',
      color: 'text-primary',
      isi: [
        'Konfirmasi dulu: GDS, keton darah (β-hidroksibutirat), K⁺, Mg²⁺, fosfat sebelum mulai terapi',
        'Cairan: kristaloid isotonik — larutan seimbang (RL/PlasmaLyte) bila tersedia atau NaCl 0,9% (konsensus 2024); laju disesuaikan status volume — konsensus 2024 lebih konservatif dibanding protokol ADA 2009 (1 L/jam pertama lalu 250–500 mL/jam); hati-hati gagal jantung/ginjal',
        '⚠ CEK K⁺ DAHULU — K⁺ <3,5 mmol/L: TUNDA insulin, berikan KCl IV ±10–20 mmol/jam (≤10 perifer, ≤20 sentral; monitor EKG) sampai K⁺ ≥3,5 (konsensus 2024)',
        'Insulin regular IV: 0,1 unit/kgBB/jam setelah K⁺ ≥3,5',
        'Tambahkan dekstrosa 5–10% saat GDS <250 mg/dL agar insulin tetap berjalan sampai ketoasidosis teratasi (konsensus 2024)',
        'Fosfat: koreksi jika <1 mg/dL atau ada kelemahan otot napas/gangguan jantung',
        'NaHCO₃ pada DKA: hanya jika pH <7,0',
        'Resolusi DKA (konsensus 2024): keton <0,6 mmol/L DAN pH vena ≥7,3 atau HCO₃ ≥18 mmol/L'
      ],
      ref: 'Umpierrez GE et al. Diabetes Care 2024;47:1257 (konsensus ADA/EASD/JBDS/AACE/DTS) · Kitabchi AE et al. Diabetes Care 2009'
    });
  }

  if (kondisi === 'ards' || (pfNow !== null && pfNow < 300 && kondisi !== 'cardiac')) {
    const pf = pfNow;
    const ecmoHint = (pf !== null && pf < 80) || (pH < 7.25 && pco2 >= 60);
    result.mgmt.push({
      judul: 'Manajemen ARDS',
      color: 'text-primary',
      isi: [
        'Lung-protective: VT 6 mL/kgBBP (rentang 4–8), Pplat ≤30 cmH₂O (ARDSNet/SSC 2021), driving pressure ≤15 cmH₂O, PEEP sesuai tabel ARDSNet; ARDS sedang–berat: PEEP lebih tinggi TANPA recruitment maneuver berkepanjangan (ATS 2024)',
        pf !== null && pf < 150
          ? '🔄 Prone ≥16 jam/hari bila P/F <150 dengan FiO₂ ≥0,6 & PEEP ≥5 — PROSEVA: mortalitas 28 hari 16,0% vs 32,8% (NNT ≈6); direkomendasikan ESICM 2023'
          : 'Prone: indikasi bila P/F <150 dengan FiO₂ ≥0,6 & PEEP ≥5 (kriteria PROSEVA); di atas ambang itu belum ada bukti manfaat mortalitas',
        pf !== null && pf < 150 ? '💊 NMB (opsional, ARDS berat dini): cisatrakurium 15 mg bolus IV lalu 37,5 mg/jam selama 48 jam, setelah sedasi dalam (ACURASYS, P/F <150). ROSE 2019: tanpa manfaat mortalitas; ATS 2024: rekomendasi kondisional' : '',
        'Cairan: strategi konservatif setelah syok teratasi (FACTT trial)',
        ecmoHint ? '🔴 ECMO-VV — kriteria EOLIA setelah ventilasi dioptimalkan: P/F <50 >3 jam, P/F <80 >6 jam, atau pH <7,25 dengan PaCO₂ ≥60 >6 jam. EOLIA: mortalitas 60 hari 35% vs 46% (p=0,09); ATS 2024 menyarankan pada ARDS berat terpilih — konsultasi pusat ECMO' : '',
        'Kortikosteroid (ATS 2024: disarankan, kondisional): ARDS non-COVID sedang–berat → deksametason 20 mg/hari IV hari 1–5 lalu 10 mg/hari hari 6–10 (DEXA-ARDS); COVID-19 → deksametason 6 mg/hari hingga 10 hari (RECOVERY)',
        'Target ARDSNet: PaO₂ 55–80 mmHg atau SpO₂ 88–95%; pH 7,30–7,45 (hiperkapnia ditoleransi sesuai algoritma ARDSNet)'
      ].filter(Boolean),
      ref: 'Qadir N et al. AJRCCM 2024 (ATS) · Grasselli G et al. Intensive Care Med 2023 (ESICM) · ARDS Network. NEJM 2000 · Guérin C. NEJM 2013 (PROSEVA) · Papazian L. NEJM 2010 (ACURASYS) · Combes A. NEJM 2018 (EOLIA) · Villar J. Lancet Respir Med 2020 (DEXA-ARDS) · RECOVERY. NEJM 2021'
    });
  }

  if (kondisi === 'sepsis' || (!isNaN(laktat) && laktat >= 2 && agHigh && kondisi !== 'cardiac')) {
    result.mgmt.push({
      judul: 'Manajemen Sepsis / Syok Septik (SSC 2021)',
      color: 'text-primary',
      isi: [
        '⏱ Hour-1 bundle: ukur laktat (ulang bila >2) → kultur darah sebelum antibiotik → antibiotik spektrum luas → kristaloid 30 mL/kg bila hipotensi atau laktat ≥4 → vasopresor bila MAP <65 selama/sesudah cairan',
        'Antibiotik: ≤1 jam bila syok atau kemungkinan sepsis tinggi; bila sepsis baru "mungkin" tanpa syok, evaluasi cepat lalu beri ≤3 jam bila kecurigaan menetap',
        'Cairan: kristaloid seimbang lebih disarankan; nilai respons cairan (PLR/VTI/PPV) dan hentikan bila tidak responsif; capillary refill time dapat dipakai sebagai pelengkap',
        'Vasopresor: norepinefrin lini pertama, target awal MAP 65 mmHg — boleh dimulai via vena perifer. Target 80–85 tidak menurunkan mortalitas (SEPSISPAM; AF lebih sering); pada hipertensi kronik kebutuhan RRT lebih rendah tanpa beda mortalitas',
        'Vasopressin 0,03 unit/mnt: ditambahkan alih-alih menaikkan dosis NE; dalam praktik dimulai saat NE 0,25–0,5 mcg/kg/mnt',
        'Kortikosteroid: hidrokortison 200 mg/hari IV (50 mg/6 jam) bila kebutuhan vasopresor menetap — mis. NE ≥0,25 mcg/kg/mnt ≥4 jam setelah mulai',
        `Laktat saat ini: ${laktatTxt} mmol/L — ukur ulang dan arahkan resusitasi untuk menurunkannya. Transfusi PRC bila Hb <7 g/dL (strategi restriktif)`,
        'Antibiotik: evaluasi de-eskalasi harian; durasi lebih pendek bila respons klinis baik'
      ],
      ref: 'Evans L et al. Intensive Care Med 2021 (SSC) · Levy MM et al. Crit Care Med 2018 (hour-1 bundle) · Asfar P et al. NEJM 2014 (SEPSISPAM)'
    });
  }

  if (kondisi === 'cardiac') {
    result.mgmt.push({
      judul: 'Edema Paru Kardiogenik Akut',
      color: 'text-primary',
      isi: [
        'Posisi duduk 90°, oksigen → NIV (CPAP 5–10 cmH₂O atau BiPAP 8–12/5 cmH₂O) — turunkan preload, afterload, WOB',
        'Furosemide IV: 40–80 mg bolus (2× dosis oral harian) atau infus 5–10 mg/jam; target UO ≥100 mL/jam 2 jam pertama',
        'Nitrogliserin IV: mulai 10–20 mcg/mnt, titrasi 10–20 mcg/mnt tiap 5 mnt jika sistolik >100 mmHg (turunkan afterload)',
        'HINDARI cairan berlebihan — resusitasi hanya jika ada bukti hipovolemia konkuren (RV failure, tamponade)',
        'Low output / kardiogenik syok: dobutamin 2–10 mcg/kgBB/mnt (ionotropik) + NE jika MAP tidak tercapai',
        !isNaN(laktat) && laktat >= 2 ? `Laktat ${laktat.toFixed(1)} mmol/L pada edema paru: curigai hipoperfusi/syok kardiogenik — bundle cairan sepsis tidak ditampilkan otomatis; bila sepsis memang dicurigai, pilih kondisi "Sepsis" dan nilai respons cairan dengan hati-hati` : '',
        'Intubasi: jika gagal NIV, GCS ↓, asidosis berat (pH <7.20), atau distres napas yang tidak terkontrol',
        'Koreksi penyebab precipitating: ACS (kateterisasi emergent), AF rapid (rate control/kardioversi), hipertensif emergensi (NTG IV)'
      ].filter(Boolean),
      ref: 'McDonagh TA et al. Eur Heart J 2021 (ESC HF) · Mebazaa A et al. Intensive Care Med 2016 · Masip J. Eur Heart J Acute Cardiovasc Care 2022'
    });
  }

  result.calcSteps = steps;
  return result;
}
