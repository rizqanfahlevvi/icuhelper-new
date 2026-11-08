// Interpretasi ABG 7 langkah — fungsi MURNI (tanpa React) agar bisa dites.
// Perhitungan inti ada di src/utils/abg.ts (asam-basa, H-H, FiO₂) dan
// src/utils/acidBase.ts (anion gap & delta ratio). File ini menyusun teks & kelas tampilan.
import { AbgInputs } from './types';
import {
  KPA_TO_MMHG, Tone, Disorder, AcidBaseAnalysis, HhCheck, Fio2Resolution,
  HCO3_LOW, HCO3_HIGH, PCO2_LOW, PCO2_HIGH,
  validateCore, analyzeAcidBase, hhCheck, resolveDirectFio2, estimateLowFlowFio2,
} from '../../utils/abg';
import {
  anionGap, deltaRatio, DELTA_BAND_LABEL, DELTA_RATIO_CAUTION, AG_ALBUMIN_NORMAL_G_DL, AG_UPPER_NORMAL_DEFAULT,
} from '../../utils/acidBase';

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
  step6Oksigenasi: { items: OxResult[]; cls: string } | null;
  saran: string[];
  mgmt: { judul: string; color: string; isi: string[]; ref: string }[];
  analysis: AcidBaseAnalysis | null;
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
    step4Ag: null, step5Laktat: null, step6Oksigenasi: null, saran: [], mgmt: [], analysis: null,
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
  const pH = rawPh;
  const paco2Unit = inputs.paco2Unit;
  const pco2 = paco2Unit === 'kPa' ? rawPco2 * KPA_TO_MMHG : rawPco2;

  const coreError = validateCore(pH, pco2, hco3);
  if (coreError) {
    result.inputError = coreError;
    return result;
  }

  const po2 = parseFloat(inputs.po2);
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

  // ── Cek konsistensi Henderson–Hasselbalch ──────────────────────────────────
  const hh = hhCheck(pH, pco2, hco3);
  if (!hh.consistent) {
    result.warnings.push(`Cek Henderson–Hasselbalch: HCO₃⁻ yang dihitung dari pH ${pH} & PaCO₂ ${pco2.toFixed(0)} = ${fmt1(hh.hco3Calc)} mmol/L, sedangkan input ${hco3} (pH yang sesuai dengan input = ${hh.phCalc.toFixed(2)}). Selisih melebihi toleransi pembulatan — cek salah ketik, atau HCO₃⁻ berasal dari sampel/pemeriksaan lain (mis. tCO₂ kimia darah). Interpretasi di bawah bisa tidak valid.`);
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
    detail: `pH = ${pH} · PaCO₂ = ${paco2Label} · HCO₃⁻ = ${hco3} mmol/L · BE = ${be === null ? '— (tidak diisi)' : `${be} mEq/L`}${!isNaN(alb) ? ` · Albumin = ${inputs.albUnit === 'mg/dL' ? (alb * 1000).toFixed(0) + ' mg/dL' : alb.toFixed(1) + ' g/dL'}` : ''} · HCO₃⁻ hitung (H-H) = ${fmt1(hh.hco3Calc)}`,
  };

  // LANGKAH 2–3: GANGGUAN PRIMER, STATUS KOMPENSASI, EVALUASI KOMPENSASI
  const ab = analyzeAcidBase(pH, pco2, hco3, be);
  result.analysis = ab;
  const has = (d: Disorder) => ab.disorders.includes(d);
  const acidosis = pH < 7.35, alkalosis = pH > 7.45;

  result.step2Primer = {
    interp: ab.primaryText, cls: PRIMARY_CLS, notes: ab.notes,
    detail: `pH ${pH < 7.40 ? '<7.40 (condong asam)' : pH > 7.40 ? '>7.40 (condong basa)' : '= 7.40'} · PaCO₂ = ${pco2.toFixed(0)} mmHg (N:35–45) · HCO₃⁻ = ${hco3} (N:22–26) · BE = ${be === null ? '—' : be}`,
  };
  result.step2KompStatus = { interp: ab.compStatus.text, cls: TONE_CLS[ab.compStatus.tone] };
  result.step3Kompensasi = { detail: ab.compNote.text, cls: TONE_CLS[ab.compNote.tone] };

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

  // LANGKAH 6: OKSIGENASI (ambang belum diubah — dijadwalkan Fase 3)
  if (!isNaN(po2) || fio2 !== null || !isNaN(spo2)) {
    const oxItems: OxResult[] = [];
    if (!isNaN(po2) && fio2 !== null) {
      const pf = po2 / fio2;
      const pfClass = pf >= 400 ? 'Normal' : pf >= 300 ? 'Hipoksemia ringan' : pf >= 200 ? 'ARDS Mild' : pf >= 100 ? 'ARDS Moderate' : 'ARDS Severe';
      const pfColor = pf >= 300 ? TEXT_EMERALD : pf >= 200 ? TEXT_AMBER : TEXT_RED;
      oxItems.push({ label: 'P/F Ratio', value: pf.toFixed(0) + (fio2Res.estimated ? ' (FiO₂ estimasi)' : ''), interp: pfClass, colorClass: pfColor });

      const pao2calc = (fio2 * (760 - 47)) - (pco2 / 0.8);
      const aaGrad = pao2calc - po2;
      oxItems.push({
        label: 'A-a Gradient',
        value: `${aaGrad.toFixed(0)} mmHg (normal <20)`,
        interp: aaGrad > 20 ? 'MENINGKAT (V/Q mismatch/shunt)' : 'Normal (hipoventilasi murni jika hipoksemia ada)',
        colorClass: 'text-foreground',
      });
    }
    if (!isNaN(po2) && fio2 !== null && !isNaN(mapV)) {
      const oi = (mapV * fio2 * 100) / po2;
      oxItems.push({
        label: 'OI',
        value: oi.toFixed(1),
        interp: oi < 5 ? 'Ringan' : oi < 25 ? 'Moderate' : oi < 40 ? 'Berat' : 'Sangat Berat — ECMO?',
        colorClass: 'text-foreground',
      });
    }
    if (!isNaN(spo2) && fio2 !== null && !isNaN(rr)) {
      const rox = (spo2 / fio2) / rr;
      const roxColor = rox >= 4.88 ? TEXT_EMERALD : rox >= 3.85 ? TEXT_AMBER : TEXT_RED;
      const roxInterp = rox >= 4.88 ? 'Risiko HFNC gagal RENDAH' : rox >= 3.85 ? 'Intermediate — evaluasi ketat' : 'Risiko HFNC gagal TINGGI → pertimbangkan intubasi';
      oxItems.push({
        label: 'ROX Index',
        value: `(${spo2}/FiO₂${fio2.toFixed(2)})/RR${rr} = ${rox.toFixed(2)} [sumber: ${spo2Source}]`,
        interp: roxInterp,
        colorClass: roxColor,
      });
    }
    if (oxItems.length > 0) {
      result.step6Oksigenasi = { items: oxItems, cls: PRIMARY_CLS };
    }
  }

  // KONSIDERASI KLINIS
  if (!isNaN(po2) && fio2 !== null) {
    const pf = po2 / fio2;
    if (pf < 100) result.saran.push('P/F <100 (ARDS Severe): ↑ PEEP 13–18, prone position jika P/F <150, pertimbangkan NMB cisatrakurium, ECMO jika OI >40');
    else if (pf < 200) result.saran.push('P/F 100–200 (ARDS Moderate): ↑ PEEP 8–13, FiO₂ 0.4–0.7, pertimbangkan prone jika tidak membaik');
    else if (pf < 300) result.saran.push('P/F 200–300 (ARDS Mild): PEEP 5–8, FiO₂ titrasi, evaluasi ventilasi lung-protective');
  }
  if (pH < 7.25 && pco2 > 50) result.saran.push('Asidosis respiratorik berat: ↑ RR atau ↑ VT (hati-hati Pplat), pertimbangkan NaHCO₃ jika pH <7.10 dengan ventilasi adekuat');
  if (pco2 < 35 && pH > 7.45) result.saran.push('Alkalosis respiratorik: ↓ RR (bertahap), cek dead space, pastikan tidak ada pain/agitasi yang meningkatkan drive');
  if (has('asidosis-metabolik') && be !== null && be < -5) result.saran.push('Asidosis metabolik: koreksi penyebab primer (sepsis, hipovolemia, DKA). NaHCO₃ hanya jika pH <7.10 DAN ventilasi adekuat');
  if (pH > 7.50 && hco3 > 30) result.saran.push('Alkalosis metabolik: koreksi hipokalemia, hipokloremia; hentikan diuretik; KCl replacement');
  if (kondisi === 'copd' && pco2 > 55) result.saran.push('PPOK: TARGET PaCO₂ = baseline pasien, bukan normocapnia! Koreksi bertahap — risiko alkalosis metabolik berat');
  if (kondisi === 'ards') result.saran.push('ARDS: Pertahankan driving pressure ≤15 cmH₂O. Toleransi permissive hypercapnia (PaCO₂ 45–65) jika pH >7.20');

  // ── TATALAKSANA: dipicu GANGGUAN YANG TERIDENTIFIKASI (primer/bersamaan), bukan
  //    sekadar nilai di luar rentang — supaya HCO₃⁻/PaCO₂ hasil kompensasi tidak "dikoreksi".
  //    Kartu koreksi juga mensyaratkan nilai absolut abnormal: gangguan "relatif"
  //    (mis. PaCO₂ 30 tapi > harapan Winter) cukup dijelaskan di Langkah 3.
  const metAcidCard = has('asidosis-metabolik') && hco3 < HCO3_LOW;
  const metAlkCard = has('alkalosis-metabolik') && hco3 > HCO3_HIGH;
  const respAcidCard = has('asidosis-respiratorik') && pco2 > PCO2_HIGH && acidosis;
  const respAlkCard = has('alkalosis-respiratorik') && pco2 < PCO2_LOW && alkalosis;
  // ── KOREKSI ASAM-BASA SPESIFIK ──────────────────────────────────────────
  if (metAcidCard) {
    const isHAGMA = agHigh;
    const isNAGMA = agRes !== null && !agHigh;
    const bicarInd = pH < 7.10 ? '⚠ TERINDIKASI (pH <7.10)' : pH < 7.20 ? 'Pertimbangkan (pH 7.10–7.20, esp. AKI/NAGMA)' : 'Belum terindikasi — koreksi penyebab primer dulu';
    result.mgmt.push({
      judul: 'Koreksi Asidosis Metabolik',
      color: 'text-destructive',
      isi: [
        `NaHCO₃ IV: ${bicarInd}`,
        `Formula dosis: 0.5 × BBideal(kg) × (target HCO₃ − ${hco3.toFixed(0)} mmol/L) = mEq NaHCO₃ — targetkan HCO₃ 12–15, BUKAN normalisasi penuh`,
        'Pemberian: ½ dosis dalam 4 jam pertama → evaluasi AGD → ½ sisanya jika perlu. NaHCO₃ 8.4% = 1 mEq/mL; NaHCO₃ 7.5% = 0.9 mEq/mL',
        'Perhatian: NaHCO₃ → ↑ PaCO₂ transien (CO₂ release dari buffer) — pastikan ventilasi adekuat. Hindari jika alkalosis concurrent (Δ-Δ >2)',
        isHAGMA ? 'HAGMA: Prioritas koreksi kausa (laktat → resusitasi, DKA → insulin, uremia → RRT, toksik → eliminasi)' : '',
        isNAGMA ? 'NAGMA: Identifikasi etiologi — diarrhea → rehidrasi; RTA → NaHCO₃ kronik 1–2 mEq/kg/hari; dilutional → hentikan saline, ganti ke balanced crystalloid' : '',
        'Monitoring post-koreksi: pH, PaCO₂, K⁺ (hipokalemia memburuk saat pH naik), Na⁺ (hati-hati Na overload)'
      ].filter(Boolean),
      ref: 'Kraut JA, Madias NE. NEJM 2014 · Jaber S et al. Lancet 2018 (BICAR-ICU) · Berend K. NEJM 2014'
    });
  }

  if (metAlkCard) {
    const severeAlk = hco3 > 40 || pH > 7.55;
    result.mgmt.push({
      judul: 'Koreksi Alkalosis Metabolik',
      color: TEXT_AMBER,
      isi: [
        'Tentukan tipe: Chloride-responsive (urin Cl⁻ <20 mEq/L) vs Chloride-resistant (urin Cl⁻ >20 mEq/L)',
        'Chloride-responsive (muntah, NGT suction, diuretik): NaCl 0.9% IV + KCl replacement',
        'KCl IV: 10–20 mEq/jam via central line — koreksi hipokalemia WAJIB dulu (target K⁺ ≥3.5 mEq/L)',
        'Chloride-resistant (hiperaldosteronisme, Cushing, Bartter): koreksi underlying + spironolakton/amiloride',
        hco3 > 35 ? 'Acetazolamide 250–500 mg IV/8 jam: pilihan untuk CHF/fluid-overloaded (hindari eGFR <30, sulfa allergy)' : '',
        severeAlk ? 'Alkalosis BERAT (pH >7.55): pertimbangkan HCl 0.1N via CVC — dosis: 0.1 × BB × (HCO₃ aktual − 24) mEq, berikan dalam 12–24 jam, pantau ketat' : '',
        'Stop penyebab iatrogenik: kurangi/stop diuretik, hindari antasid berlebihan, kurangi transfusi sitrat'
      ].filter(Boolean),
      ref: 'Emmett M. CJASN 2020 · Gennari FJ. NEJM 1998 · Laski ME. Am J Kidney Dis 2006'
    });
  }

  if (respAcidCard) {
    const permHyperCap = kondisi === 'ards' || (!isNaN(po2) && fio2 !== null && (po2/fio2) < 200);
    result.mgmt.push({
      judul: 'Koreksi Asidosis Respiratorik',
      color: 'text-destructive',
      isi: [
        kondisi === 'copd' ? 'PPOK: TARGET PaCO₂ = baseline pasien (bukan 40 mmHg!) — koreksi agresif risiko alkalosis rebound berat' : 'Target: perbaiki ventilasi alveolar, bukan buffer HCO₃',
        kondisi === 'copd' || kondisi === 'umum' ? 'NIV BiPAP lini pertama (GCS baik, kooperatif): IPAP 12–18 / EPAP 4–8 cmH₂O, titrasi PaCO₂ turun 5–8 mmHg/jam' : '',
        'Intubasi jika: NIV gagal/kontraindikasi, GCS ↓ berat, sekresi tidak terkontrol, instabilitas hemodinamik',
        'Pada ventilator: ↑ RR 2–3/mnt bertahap (max 35/mnt), awasi auto-PEEP. ↑ VT 6→8 mL/kgBBP hanya jika Pplat <28 cmH₂O',
        permHyperCap ? `Permissive hypercapnia (ARDS/lung-protective): toleransi PaCO₂ hingga 70 mmHg jika pH >7.20 dan driving pressure ≤15 cmH₂O — JANGAN ↑ VT untuk "normalisasi" CO₂` : '',
        'NaHCO₃ TIDAK diindikasikan untuk asidosis resp murni — hanya sebagai bridge jika pH <7.10 dan ventilasi optimal sudah tercapai',
        'Bronkodilator nebulisasi: salbutamol 2.5 mg + ipratropium 0.5 mg q4–6h (esp. PPOK/asma)'
      ].filter(Boolean),
      ref: 'GOLD 2024 · Rochwerg B. Eur Respir J 2017 (NIV) · Matthay MA. NEJM 2019 · Slutsky AS. NEJM 2013 (lung-protective)'
    });
  }

  if (respAlkCard) {
    result.mgmt.push({
      judul: 'Koreksi Alkalosis Respiratorik',
      color: TEXT_AMBER,
      isi: [
        'Koreksi penyebab: nyeri → analgesia (morfin/fentanyl titrasi); agitasi → sedasi (propofol/midazolam titrasi); sepsis → kultur + antibiotik',
        'Pada ventilator: ↓ RR 2/mnt bertahap (min 10/mnt), atau tambah dead space connector (increase anatomical dead space)',
        'Target pH <7.50 secara bertahap — koreksi terlalu cepat dapat presipitasi seizure (alkalosis akut → vasokonstriksi serebral)',
        'Elektrolit yang sering terganggu: hipokalemia, hipofosfatemia, hipokalsemia ionik — koreksi bersamaan',
        'Liver failure: alkalosis resp persisten akibat hiperammonemia — tidak bisa dicegah tanpa koreksi kausa hepatik',
        'Cek VD/VT meningkat jika PaCO₂ rendah persisten meski RR sudah diturunkan (dead space patologis)'
      ],
      ref: 'Berend K. NEJM 2014 · Laffey JG. NEJM 2002 · Seifter JL. NEJM 2023'
    });
  }

  // ── TATALAKSANA KONDISI KLINIS SPESIFIK ─────────────────────────────────
  if (agHigh && !isNaN(laktat) && laktat >= 2) {
    result.mgmt.push({
      judul: 'Asidosis Laktat / HAGMA',
      color: 'text-primary',
      isi: [
        'Target MAP ≥65 mmHg — resusitasi dengan Ringer Laktat atau PlasmaLyte (lebih sedikit dilutional acidosis vs NaCl 0.9%)',
        'Norepinefrin lini pertama jika MAP tidak respons cairan: 0.1–0.5 mcg/kg/mnt via central, titrasi',
        `Laktat clearance: target ≥10% penurunan per 2 jam. Laktat saat ini: ${laktat.toFixed(1)} mmol/L${laktat >= 4 ? ' — BERAT, mortalitas ↑' : ''}`,
        `NaHCO₃: ${pH < 7.10 ? 'TERINDIKASI (pH <7.10) — dosis 0.5 × BBideal × (15 − ' + hco3.toFixed(0) + ') mEq, berikan ½ dalam 4 jam' : pH < 7.20 ? 'Pertimbangkan jika AKI concurrent (BICAR-ICU benefit subgroup)' : 'Belum terindikasi — koreksi kausa primer dulu'}`,
        'Koreksi kausa primer: sepsis (antibiotik <1 jam dari onset), iskemia (revaskularisasi), DKA (insulin), hepatik (koreksi koagulopati)',
        'Tiamin IV 100–200 mg jika suspek defisiensi (alkohol, malnutrisi, refrakter terhadap resusitasi)'
      ],
      ref: 'Evans L et al. Intensive Care Med 2021 (SSC) · Jaber S. Lancet 2018 (BICAR-ICU) · Levy B. Chest 2015'
    });
  }

  if (agHigh && (isNaN(laktat) || laktat < 4) && metAcidCard) {
    result.mgmt.push({
      judul: 'Kemungkinan DKA / Ketoasidosis',
      color: 'text-primary',
      isi: [
        'Cek GDS, keton darah (beta-hydroxybutyrate), K⁺, Mg²⁺, fosfat sebelum mulai terapi',
        'Resusitasi cairan: NaCl 0.9% 1 L/jam pertama (1–2 jam), lanjut 250–500 mL/jam sesuai hidrasi + output',
        '⚠ CEK K⁺ DAHULU — jika K⁺ <3.5: TUNDA insulin, berikan KCl 20–40 mEq/jam IV sampai K⁺ ≥3.5',
        'Insulin regular IV: 0.1 unit/kgBB/jam (setelah K⁺ ≥3.5). Target: ↓ GDS 50–75 mg/dL/jam, AG normalisasi',
        'Ganti ke D5%/D10% + insulin saat GDS <200 (DKA) atau <250 (HHS) mg/dL — jaga agar GDS 150–200',
        'Fosfat: koreksi jika <1 mg/dL atau ada kelemahan otot napas',
        'NaHCO₃ pada DKA: hanya jika pH <7.0 setelah 1 jam resusitasi (ADA 2024 — kontroversi)'
      ],
      ref: 'ADA Standards of Care 2024 · Kitabchi AE. Diabetes Care 2009 · Umpierrez GE. Endocr Rev 2023'
    });
  }

  if (kondisi === 'ards' || (!isNaN(po2) && fio2 !== null && (po2/fio2) < 300)) {
    const pf = !isNaN(po2) && fio2 !== null ? po2/fio2 : null;
    result.mgmt.push({
      judul: 'Manajemen ARDS',
      color: 'text-primary',
      isi: [
        'Lung-Protective Ventilation: VT 6 mL/kgBBP, Pplat ≤28 cmH₂O, Driving Pressure ≤15 cmH₂O, PEEP per ARDSNet table',
        pf !== null && pf < 150 ? '🔄 Prone positioning: ≥16 jam/hari — wajib jika P/F <150 (PROSEVA 2013, NNT=8 untuk mortalitas)' : 'Prone positioning: pertimbangkan jika P/F tidak membaik 12–24 jam (threshold P/F <200–300 per PROSEVA update)',
        pf !== null && pf < 120 ? '💊 Neuromuscular blockade: cisatracurium 37.5 mg bolus → 37.5 mg/jam drip IV (48 jam awal, jika RASS ≤-3)' : '',
        'Konservasi cairan: fluid-restrictive strategy hari 2–7 setelah stabilisasi hemodinamik (FACTT trial)',
        pf !== null && pf < 80 ? '🔴 Pertimbangkan ECMO-VV: jika OI >40 atau P/F <80 refrakter ≥6 jam (EOLIA 2018 — konsultasi ECMO center segera)' : '',
        'Kortikosteroid: deksametason 6 mg/hari IV — dipertimbangkan pada ARDS moderate-severe (RECOVERY 2021, DEXA-ARDS 2020)',
        'Target: SpO₂ 92–96%, pH >7.20 (toleransi permissive hypercapnia), Pplat <28, driving pressure <15'
      ].filter(Boolean),
      ref: 'Matthay MA. NEJM 2019 · Guérin C. NEJM 2013 (PROSEVA) · Combes A. NEJM 2018 (EOLIA) · Villar J. Lancet Respir Med 2020 (DEXA-ARDS) · Slutsky AS. NEJM 2013'
    });
  }

  if (kondisi === 'sepsis' || (!isNaN(laktat) && laktat >= 2 && agHigh)) {
    result.mgmt.push({
      judul: 'Manajemen Sepsis / Syok Septik (SSC 2021)',
      color: 'text-primary',
      isi: [
        '⏱ HOUR-1 BUNDLE: Kultur darah (2 set, aerob+anaerob) → Antibiotik broad-spectrum IV → Laktat → Akses IV → Resusitasi',
        'Cairan: 30 mL/kgBB balanced crystalloid (RL preferred) dalam 3 jam; nilai respons cairan dengan PLR / VTI / PPV — STOP jika tidak responsif (cegah fluid overload)',
        'Vasopressor: Norepinefrin lini pertama 0.01–0.5 mcg/kg/mnt via central/IO, target MAP ≥65 mmHg (atau ≥80 jika riwayat hipertensi)',
        'Vasopressin 0.03 unit/mnt: tambahkan jika dosis NE >0.25 mcg/kg/mnt (sparing effect, turunkan NE dose)',
        'Kortikosteroid: hidrokortison 200 mg/hari IV (50 mg/6 jam atau infus kontinu) jika refrakter vasopressor — bukan semua sepsis',
        `Laktat monitoring: target clearance ≥10%/2 jam (saat ini: ${isNaN(laktat) ? '?' : laktat.toFixed(1)} mmol/L). ScvO₂ ≥70%; transfusi PRC jika Hb <7 dan ScvO₂ rendah`,
        'Antibiotik: de-eskalasi setelah 48–72 jam sesuai kultur. Durasi: 5–7 hari untuk respons klinis baik (IDSA/SSC)'
      ],
      ref: 'Evans L et al. Intensive Care Med 2021 (SSC) · Levy MM. Crit Care Med 2018 · Rhodes A. Intensive Care Med 2017'
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
        'Intubasi: jika gagal NIV, GCS ↓, asidosis berat (pH <7.20), atau distres napas yang tidak terkontrol',
        'Koreksi penyebab precipitating: ACS (kateterisasi emergent), AF rapid (rate control/kardioversi), hipertensif emergensi (NTG IV)'
      ],
      ref: 'McDonagh TA et al. Eur Heart J 2021 (ESC HF) · Mebazaa A. Intensive Care Med 2018 · Masip J. Eur Heart J Acute Cardiovasc Care 2022'
    });
  }
  
  return result;
}
