// Util interpretasi gas darah (fungsi murni, dites di __tests__/abg.test.ts).
//
// Pendekatan fisiologis ("Boston") bertahap:
//   1) arah pH → 2) gangguan primer = komponen yang searah dengan pH
//   → 3) bandingkan komponen lawan dengan harapan kompensasi untuk primer TERSEBUT.
// Rumus kompensasi (koefisien TIDAK diubah dari versi sebelumnya):
//   · Asidosis respiratorik: akut ΔHCO₃ = 0,1 × ΔPaCO₂ (±2) · kronik 0,35 × ΔPaCO₂ (±3)
//   · Alkalosis respiratorik: akut ΔHCO₃ = 0,2 × ΔPaCO₂ (±2,5) · kronik 0,5 × ΔPaCO₂ (±2,5)
//   · Asidosis metabolik (Winter): PaCO₂ = 1,5 × HCO₃ + 8 (±2)
//   · Alkalosis metabolik: PaCO₂ = 0,7 × HCO₃ + 21 (±2)
// Rujukan: Berend K, de Vries APJ, Gans ROB. NEJM 2014;371:1434 · Albert MS, Dell RB,
// Winters RW. Ann Intern Med 1967;66:312 · Narins RG, Emmett M. Medicine 1980;59:161.

export const KPA_TO_MMHG = 7.5006;

export const PH_LOW = 7.35;
export const PH_HIGH = 7.45;
export const PCO2_LOW = 35;
export const PCO2_HIGH = 45;
export const HCO3_LOW = 22;
export const HCO3_HIGH = 26;
export const BE_LOW = -2;
export const BE_HIGH = 2;

export type PhStatus = 'asidemia' | 'alkalemia' | 'normal';
export type Disorder = 'asidosis-metabolik' | 'alkalosis-metabolik' | 'asidosis-respiratorik' | 'alkalosis-respiratorik';
export type Tone = 'red' | 'amber' | 'emerald' | 'slate';

export const DISORDER_LABEL: Record<Disorder, string> = {
  'asidosis-metabolik': 'Asidosis Metabolik',
  'alkalosis-metabolik': 'Alkalosis Metabolik',
  'asidosis-respiratorik': 'Asidosis Respiratorik',
  'alkalosis-respiratorik': 'Alkalosis Respiratorik',
};

/** Batas kewajaran input (bukan ambang klinis) — di luar ini hampir pasti salah ketik/satuan. */
export function validateCore(ph: number, pco2Mmhg: number, hco3: number): string | null {
  if (!(ph >= 6.5 && ph <= 8.0)) return `pH ${ph} di luar rentang yang mungkin secara fisiologis (6,5–8,0) — periksa input.`;
  if (!(pco2Mmhg > 0 && pco2Mmhg < 250)) return `PaCO₂ ${fmt1(pco2Mmhg)} mmHg tidak wajar — periksa input/satuan (mmHg vs kPa).`;
  if (!(hco3 > 0 && hco3 < 80)) return `HCO₃⁻ ${hco3} tidak wajar — periksa input.`;
  return null;
}

export function phStatus(ph: number): PhStatus {
  return ph < PH_LOW ? 'asidemia' : ph > PH_HIGH ? 'alkalemia' : 'normal';
}

// ── Henderson–Hasselbalch: cek konsistensi internal ─────────────────────────
// pH = 6,1 + log(HCO₃ / (0,0307 × PaCO₂)). Tidak ada ambang baku untuk "tidak konsisten";
// di sini toleransi = efek pembulatan input (pH ±0,005, PaCO₂ ±0,5 mmHg) + 1 mmol/L
// (pembulatan HCO₃ & beda konstanta analyzer). Selisih di luar itu → curigai salah ketik
// atau HCO₃ dari sampel lain (mis. tCO₂ kimia darah).

export const HH_EXTRA_TOLERANCE = 1;

export function hco3FromHH(ph: number, pco2Mmhg: number): number {
  return 0.0307 * pco2Mmhg * Math.pow(10, ph - 6.1);
}

export function phFromHH(pco2Mmhg: number, hco3: number): number {
  return 6.1 + Math.log10(hco3 / (0.0307 * pco2Mmhg));
}

export interface HhCheck {
  hco3Calc: number;
  phCalc: number;
  low: number;
  high: number;
  consistent: boolean;
}

export function hhCheck(ph: number, pco2Mmhg: number, hco3: number): HhCheck {
  const hco3Calc = hco3FromHH(ph, pco2Mmhg);
  const low = hco3FromHH(ph - 0.005, Math.max(pco2Mmhg - 0.5, 0.1)) - HH_EXTRA_TOLERANCE;
  const high = hco3FromHH(ph + 0.005, pco2Mmhg + 0.5) + HH_EXTRA_TOLERANCE;
  return { hco3Calc, phCalc: phFromHH(pco2Mmhg, hco3), low, high, consistent: hco3 >= low && hco3 <= high };
}

// ── FiO₂ ─────────────────────────────────────────────────────────────────────

export interface Fio2Resolution {
  value: number | null;
  estimated: boolean;
  note?: string;
  invalid?: string;
}

export type Fio2Device = 'nasal' | 'simple' | 'nrm' | string;

/** Estimasi FiO₂ alat low-flow (aturan praktis yang sudah dipakai sebelumnya — tidak diubah). */
export function estimateLowFlowFio2(device: Fio2Device, flow: number): number | null {
  if (device.startsWith('venturi')) {
    const pct = parseInt(device.replace('venturi', ''), 10);
    return Number.isFinite(pct) ? pct / 100 : null;
  }
  if (!Number.isFinite(flow)) return null;
  if (device === 'nasal') return Math.min(0.21 + 0.04 * flow, 0.44);
  if (device === 'simple') {
    if (flow <= 6) return 0.35;
    if (flow >= 10) return 0.60;
    return 0.35 + (flow - 6) * 0.0625;
  }
  if (device === 'nrm') {
    if (flow <= 10) return 0.80;
    if (flow >= 15) return 0.95;
    return 0.80 + (flow - 10) * 0.03;
  }
  return null;
}

/**
 * FiO₂ langsung: 0,21–1,0 dibaca sebagai fraksi; 21–100 dibaca sebagai persen (dengan catatan
 * eksplisit, tidak diam-diam). Nilai lain ditolak — P/F, A-a, OI, ROX tidak dihitung.
 */
export function resolveDirectFio2(raw: string): Fio2Resolution {
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return { value: null, estimated: false };
  if (n >= 0.21 && n <= 1) return { value: n, estimated: false };
  if (n >= 21 && n <= 100) {
    const v = n / 100;
    return { value: v, estimated: false, note: `FiO₂ ${raw} dibaca sebagai ${n}% = ${fmt2(v)}.` };
  }
  return { value: null, estimated: false, invalid: `FiO₂ ${raw} tidak valid — isi fraksi 0,21–1,0 (atau persen 21–100). P/F, A-a, OI & ROX tidak dihitung.` };
}

/** Konversi nilai FiO₂ (fraksi atau persen) ke string persen untuk clinical store. */
export function fio2ToPercentString(raw: string): string {
  const n = parseFloat(raw);
  if (!Number.isFinite(n) || n <= 0) return '';
  const pct = n <= 1 ? n * 100 : n;
  return String(Math.round(pct * 10) / 10);
}

/** Konversi nilai FiO₂ dari clinical store (persen; data lama mungkin fraksi) ke string fraksi. */
export function fio2FromStoreString(raw: string): string {
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return raw;
  return n > 1 ? String(Math.round(n * 10) / 1000) : raw;
}

// ── Analisis asam-basa ───────────────────────────────────────────────────────

export type CompFit = 'adekuat' | 'akut' | 'kronik' | 'transisi' | 'campuran';

export interface CompEval {
  primary: Disorder;
  fit: CompFit;
  concurrent: Disorder | null;
  /** Rentang harapan untuk komponen lawan (untuk tampilan/CalcSteps). */
  expected: { component: 'HCO₃⁻' | 'PaCO₂'; label: string; value: number; tol: number }[];
  text: string;
}

function fmt1(n: number): string {
  return (Math.round(n * 10) / 10).toString();
}
function fmt2(n: number): string {
  return (Math.round(n * 100) / 100).toString();
}

export function evalRespAcidosis(pco2: number, hco3: number): CompEval {
  const acute = 24 + 0.1 * (pco2 - 40);
  const chronic = 24 + 0.35 * (pco2 - 40);
  const expected: CompEval['expected'] = [
    { component: 'HCO₃⁻', label: `akut: 24 + 0,1 × (${fmt1(pco2)} − 40)`, value: acute, tol: 2 },
    { component: 'HCO₃⁻', label: `kronik: 24 + 0,35 × (${fmt1(pco2)} − 40)`, value: chronic, tol: 3 },
  ];
  const base = { primary: 'asidosis-respiratorik' as Disorder, expected };
  if (Math.abs(hco3 - acute) <= 2) {
    return { ...base, fit: 'akut', concurrent: null, text: `Asidosis Respiratorik AKUT — HCO₃⁻ sesuai respons akut (buffer sel; kompensasi ginjal belum terjadi). Harapan akut ${fmt1(acute)} ± 2, aktual ${hco3}.` };
  }
  if (Math.abs(hco3 - chronic) <= 3) {
    return { ...base, fit: 'kronik', concurrent: null, text: `Asidosis Respiratorik KRONIK — kompensasi ginjal adekuat. Harapan kronik ${fmt1(chronic)} ± 3, aktual ${hco3}.` };
  }
  if (hco3 > chronic + 3) {
    return { ...base, fit: 'campuran', concurrent: 'alkalosis-metabolik', text: `HCO₃⁻ ${hco3} > harapan kronik ${fmt1(chronic)} + 3 → Asidosis Respiratorik + ALKALOSIS METABOLIK bersamaan.` };
  }
  if (hco3 < acute - 2) {
    return { ...base, fit: 'campuran', concurrent: 'asidosis-metabolik', text: `HCO₃⁻ ${hco3} < harapan akut ${fmt1(acute)} − 2 → Asidosis Respiratorik + ASIDOSIS METABOLIK bersamaan.` };
  }
  return { ...base, fit: 'transisi', concurrent: null, text: `HCO₃⁻ ${hco3} di antara harapan akut (${fmt1(acute)}) dan kronik (${fmt1(chronic)}) → akut-pada-kronik atau fase subakut (kompensasi ginjal sedang berlangsung).` };
}

export function evalRespAlkalosis(pco2: number, hco3: number): CompEval {
  const acute = 24 - 0.2 * (40 - pco2);
  const chronic = 24 - 0.5 * (40 - pco2);
  const expected: CompEval['expected'] = [
    { component: 'HCO₃⁻', label: `akut: 24 − 0,2 × (40 − ${fmt1(pco2)})`, value: acute, tol: 2.5 },
    { component: 'HCO₃⁻', label: `kronik: 24 − 0,5 × (40 − ${fmt1(pco2)})`, value: chronic, tol: 2.5 },
  ];
  const base = { primary: 'alkalosis-respiratorik' as Disorder, expected };
  if (Math.abs(hco3 - acute) <= 2.5) {
    return { ...base, fit: 'akut', concurrent: null, text: `Alkalosis Respiratorik AKUT — HCO₃⁻ sesuai respons akut (buffer sel). Harapan akut ${fmt1(acute)} ± 2,5, aktual ${hco3}.` };
  }
  if (Math.abs(hco3 - chronic) <= 2.5) {
    return { ...base, fit: 'kronik', concurrent: null, text: `Alkalosis Respiratorik KRONIK — kompensasi ginjal adekuat. Harapan kronik ${fmt1(chronic)} ± 2,5, aktual ${hco3}.` };
  }
  if (hco3 < chronic - 2.5) {
    return { ...base, fit: 'campuran', concurrent: 'asidosis-metabolik', text: `HCO₃⁻ ${hco3} < harapan kronik ${fmt1(chronic)} − 2,5 → Alkalosis Respiratorik + ASIDOSIS METABOLIK bersamaan.` };
  }
  if (hco3 > acute + 2.5) {
    return { ...base, fit: 'campuran', concurrent: 'alkalosis-metabolik', text: `HCO₃⁻ ${hco3} > harapan akut ${fmt1(acute)} + 2,5 → Alkalosis Respiratorik + ALKALOSIS METABOLIK bersamaan.` };
  }
  return { ...base, fit: 'transisi', concurrent: null, text: `HCO₃⁻ ${hco3} di antara harapan akut (${fmt1(acute)}) dan kronik (${fmt1(chronic)}) → fase transisi akut → kronik.` };
}

export function evalMetAcidosis(pco2: number, hco3: number): CompEval {
  const exp = 1.5 * hco3 + 8;
  const expected: CompEval['expected'] = [{ component: 'PaCO₂', label: `Winter: 1,5 × ${hco3} + 8`, value: exp, tol: 2 }];
  const base = { primary: 'asidosis-metabolik' as Disorder, expected };
  const range = `${fmt1(exp - 2)}–${fmt1(exp + 2)}`;
  if (Math.abs(pco2 - exp) <= 2) {
    return { ...base, fit: 'adekuat', concurrent: null, text: `Asidosis Metabolik — kompensasi respiratorik ADEKUAT (Winter: PaCO₂ harapan ${fmt1(exp)} ± 2 = ${range}, aktual ${fmt1(pco2)}).` };
  }
  if (pco2 > exp + 2) {
    return { ...base, fit: 'campuran', concurrent: 'asidosis-respiratorik', text: `PaCO₂ ${fmt1(pco2)} > harapan Winter ${range} → Asidosis Metabolik + ASIDOSIS RESPIRATORIK bersamaan (kompensasi napas tidak cukup — nilai kebutuhan bantuan ventilasi).` };
  }
  return { ...base, fit: 'campuran', concurrent: 'alkalosis-respiratorik', text: `PaCO₂ ${fmt1(pco2)} < harapan Winter ${range} → Asidosis Metabolik + ALKALOSIS RESPIRATORIK bersamaan.` };
}

export function evalMetAlkalosis(pco2: number, hco3: number): CompEval {
  const exp = 0.7 * hco3 + 21;
  const expected: CompEval['expected'] = [{ component: 'PaCO₂', label: `0,7 × ${hco3} + 21`, value: exp, tol: 2 }];
  const base = { primary: 'alkalosis-metabolik' as Disorder, expected };
  const range = `${fmt1(exp - 2)}–${fmt1(exp + 2)}`;
  if (Math.abs(pco2 - exp) <= 2) {
    return { ...base, fit: 'adekuat', concurrent: null, text: `Alkalosis Metabolik — kompensasi respiratorik ADEKUAT (PaCO₂ harapan ${fmt1(exp)} ± 2 = ${range}, aktual ${fmt1(pco2)}).` };
  }
  if (pco2 > exp + 2) {
    return { ...base, fit: 'campuran', concurrent: 'asidosis-respiratorik', text: `PaCO₂ ${fmt1(pco2)} > harapan ${range} → Alkalosis Metabolik + ASIDOSIS RESPIRATORIK bersamaan.` };
  }
  return { ...base, fit: 'campuran', concurrent: 'alkalosis-respiratorik', text: `PaCO₂ ${fmt1(pco2)} < harapan ${range} → Alkalosis Metabolik + ALKALOSIS RESPIRATORIK bersamaan.` };
}

const EVALUATOR: Record<Disorder, typeof evalRespAcidosis> = {
  'asidosis-respiratorik': evalRespAcidosis,
  'alkalosis-respiratorik': evalRespAlkalosis,
  'asidosis-metabolik': evalMetAcidosis,
  'alkalosis-metabolik': evalMetAlkalosis,
};

export interface AcidBaseAnalysis {
  phStatus: PhStatus;
  /** 0 = normal/tidak jelas · 1 = primer tunggal · 2 = campuran searah atau ambigu (pH 7,40). */
  primaries: Disorder[];
  concurrent: Disorder[];
  /** Gabungan primer + bersamaan — dasar pemicu kartu tatalaksana. */
  disorders: Disorder[];
  evals: CompEval[];
  primaryText: string;
  compStatus: { text: string; tone: Tone };
  compNote: { text: string; tone: Tone };
  notes: string[];
}

const NORMAL_PH_NOTE =
  'pH sudah kembali normal padahal dua komponen abnormal berlawanan arah — kompensasi jarang menormalkan pH sepenuhnya (kecuali alkalosis respiratorik kronik). Bila klinis tidak cocok, curigai gangguan campuran.';

function fitTone(e: CompEval): Tone {
  return e.fit === 'campuran' || e.fit === 'transisi' ? 'amber' : 'emerald';
}

export function analyzeAcidBase(ph: number, pco2: number, hco3: number, be: number | null): AcidBaseAnalysis {
  const st = phStatus(ph);
  const pHi = pco2 > PCO2_HIGH, pLo = pco2 < PCO2_LOW, hLo = hco3 < HCO3_LOW, hHi = hco3 > HCO3_HIGH;
  const notes: string[] = [];
  let primaries: Disorder[] = [];
  let evals: CompEval[] = [];
  let primaryText: string;
  let compStatus: AcidBaseAnalysis['compStatus'];
  let compNote: AcidBaseAnalysis['compNote'] | null = null;

  const single = (d: Disorder) => { primaries = [d]; evals = [EVALUATOR[d](pco2, hco3)]; };

  if (st === 'asidemia' || st === 'alkalemia') {
    const acid = st === 'asidemia';
    const resp = acid ? pHi : pLo;
    const met = acid ? hLo : hHi;
    const respD: Disorder = acid ? 'asidosis-respiratorik' : 'alkalosis-respiratorik';
    const metD: Disorder = acid ? 'asidosis-metabolik' : 'alkalosis-metabolik';
    if (resp && met) {
      primaries = [respD, metD];
      primaryText = `Campuran: ${DISORDER_LABEL[respD]} + ${DISORDER_LABEL[metD]}`;
      compStatus = { text: 'Gangguan campuran searah — kompensasi tidak berlaku (kedua sistem ke arah yang sama).', tone: 'red' };
      const winter = acid ? evalMetAcidosis(pco2, hco3) : evalMetAlkalosis(pco2, hco3);
      compNote = {
        text: `${acid ? 'Asidosis' : 'Alkalosis'} campuran — PaCO₂ aktual ${fmt1(pco2)} ${acid ? 'di atas' : 'di bawah'} harapan kompensasi untuk HCO₃⁻ ${hco3} (${winter.expected[0].label} = ${fmt1(winter.expected[0].value)} ± 2), jadi respiratorik dan metabolik sama-sama ${acid ? 'menurunkan' : 'menaikkan'} pH.`,
        tone: 'red',
      };
    } else if (resp || met) {
      single(resp ? respD : metD);
      const d = primaries[0];
      const compPresent = d === 'asidosis-respiratorik' ? hHi : d === 'alkalosis-respiratorik' ? hLo : d === 'asidosis-metabolik' ? pLo : pHi;
      const counter = d.endsWith('respiratorik') ? 'HCO₃⁻' : 'PaCO₂';
      primaryText = `${DISORDER_LABEL[d]} Primer — ${compPresent ? `${counter} sudah bergeser (respons/kompensasi)` : `${counter} belum bergeser bermakna`}`;
      compStatus = compPresent
        ? { text: 'TERKOMPENSASI SEBAGIAN — sistem lawan sudah bergeser, namun pH belum kembali normal.', tone: 'amber' }
        : { text: 'TIDAK TERKOMPENSASI — sistem lawan belum bergeser (lihat Langkah 3 untuk respons akut).', tone: 'red' };
    } else {
      primaryText = `${acid ? 'Asidemia' : 'Alkalemia'} — penyebab tidak jelas (PaCO₂ & HCO₃⁻ masih dalam rentang normal; cek nilai / gangguan campuran ringan).`;
      compStatus = { text: 'Tidak dapat ditentukan.', tone: 'slate' };
      compNote = { text: 'Tidak ada komponen yang jelas abnormal — evaluasi ulang nilai atau pertimbangkan gangguan campuran ringan.', tone: 'slate' };
    }
  } else {
    // pH normal
    const opposite = (pHi && hHi) || (pLo && hLo);
    const sameDir = (pHi && hLo) || (pLo && hHi);
    if (opposite) {
      const acidD: Disorder = pHi ? 'asidosis-respiratorik' : 'asidosis-metabolik';
      const alkD: Disorder = pHi ? 'alkalosis-metabolik' : 'alkalosis-respiratorik';
      if (ph < 7.40) single(acidD);
      else if (ph > 7.40) single(alkD);
      else {
        const a = EVALUATOR[acidD](pco2, hco3);
        const b = EVALUATOR[alkD](pco2, hco3);
        const aFit = a.concurrent === null && a.fit !== 'transisi';
        const bFit = b.concurrent === null && b.fit !== 'transisi';
        if (aFit !== bFit) { primaries = [aFit ? acidD : alkD]; evals = [aFit ? a : b]; }
        else {
          primaries = [acidD, alkD];
          evals = [a, b];
          compNote = { text: `Arah pH tidak bisa menentukan primer; kedua rumus kompensasi ${aFit ? 'sama-sama cocok' : 'sama-sama tidak cocok'} → anggap kemungkinan gangguan campuran. ${a.text} · ${b.text}`, tone: 'amber' };
        }
      }
      if (primaries.length === 1) {
        const d = primaries[0];
        primaryText = `pH normal (condong ${ph < 7.40 ? 'asam' : ph > 7.40 ? 'basa' : 'netral, dipilih dari kecocokan rumus'}) — primer: ${DISORDER_LABEL[d]} · cek Langkah 3`;
        notes.push(NORMAL_PH_NOTE);
      } else {
        primaryText = `pH tepat 7,40 dengan PaCO₂ dan HCO₃⁻ sama-sama ${pHi ? 'tinggi' : 'rendah'} — kemungkinan gangguan campuran (${DISORDER_LABEL[acidD]} + ${DISORDER_LABEL[alkD]}).`;
      }
      compStatus = { text: 'pH kembali normal dengan dua komponen berlawanan — kompensasi penuh jarang terjadi (kecuali alkalosis respiratorik kronik); bedakan dari gangguan campuran di Langkah 3.', tone: 'amber' };
    } else if (sameDir) {
      primaries = pHi ? ['asidosis-respiratorik', 'asidosis-metabolik'] : ['alkalosis-respiratorik', 'alkalosis-metabolik'];
      primaryText = `Nilai tidak konsisten: PaCO₂ dan HCO₃⁻ sama-sama mengarah ke ${pHi ? 'asidosis' : 'alkalosis'} tetapi pH normal — periksa input (lihat cek Henderson–Hasselbalch).`;
      compStatus = { text: 'Tidak dapat dinilai — nilai tidak konsisten.', tone: 'red' };
      compNote = { text: 'Kompensasi tidak dinilai karena kombinasi pH, PaCO₂, dan HCO₃⁻ tidak konsisten secara fisiologis.', tone: 'red' };
    } else if (pHi || pLo || hLo || hHi) {
      single(pHi ? 'asidosis-respiratorik' : pLo ? 'alkalosis-respiratorik' : hLo ? 'asidosis-metabolik' : 'alkalosis-metabolik');
      primaryText = `${DISORDER_LABEL[primaries[0]]} — pH masih normal (onset dini/ringan), cek Langkah 3`;
      compStatus = { text: 'Kompensasi dini / belum penuh — pH masih normal, baru satu sistem yang bergeser.', tone: 'amber' };
    } else {
      primaryText = 'ABG Normal — tidak ada gangguan primer';
      compStatus = { text: 'Tidak ada gangguan — kompensasi tidak berlaku.', tone: 'emerald' };
      compNote = { text: 'Tidak ada gangguan primer signifikan — kompensasi tidak berlaku.', tone: 'slate' };
    }
  }

  if (!compNote) {
    const e = evals[0];
    compNote = { text: e.text, tone: fitTone(e) };
  }

  const concurrent = primaries.length === 1 ? evals.flatMap(e => (e.concurrent ? [e.concurrent] : [])) : [];
  const disorders = Array.from(new Set<Disorder>([...primaries, ...concurrent]));

  if (be !== null && Number.isFinite(be) && hco3 >= HCO3_LOW && hco3 <= HCO3_HIGH) {
    if (be < BE_LOW) notes.push(`BE ${be} < −2 walau HCO₃⁻ normal — kemungkinan komponen asidosis metabolik ringan/campuran; cek konsistensi nilai.`);
    else if (be > BE_HIGH) notes.push(`BE +${be} > +2 walau HCO₃⁻ normal — kemungkinan komponen alkalosis metabolik ringan/campuran; cek konsistensi nilai.`);
  }

  return { phStatus: st, primaries, concurrent, disorders, evals, primaryText, compStatus, compNote, notes };
}
