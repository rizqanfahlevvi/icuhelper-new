/**
 * Target nutrisi pasien kritis dewasa — logika murni. Dua pedoman ditampilkan BERDAMPINGAN
 * (hasil berbeda bermakna; tidak dipilih diam-diam):
 *
 * ESPEN (Singer P et al. Clin Nutr 2019;38:48 & 2023;42:1671):
 *  - Kalorimetri indirek dianjurkan; tanpa itu, persamaan sederhana 20–25 kkal/kg/hari.
 *  - Fase akut awal (hari 1–2): hipokalorik, ≤70% kebutuhan; setelah hari ke-3: 80–100%.
 *  - Protein 1,3 g/kg/hari dicapai bertahap. Obes: berbasis BB terkoreksi
 *    ABW = BBI + 0,33 × (BB − BBI).
 *  - AKI (Fiaccadori E et al. Clin Nutr 2021;40:1644): tanpa KRT mulai 1,0 → 1,3 g/kg;
 *    KRT intermiten 1,3–1,5; KRT kontinu 1,5–1,7. Protein TIDAK dibatasi untuk menunda KRT.
 *  - PN: glukosa ≤5 mg/kg/menit, lemak IV ≤1,5 g/kg/hari (ESPEN 2019; via sumber sekunder).
 *
 * ASPEN:
 *  - Compher C et al. JPEN 2022;46:12: energi 12–25 kkal/kg/hari (turun dari 25–30 di 2016);
 *    protein 1,2–2,0 g/kg BB aktual (dipertahankan dari McClave SA et al. JPEN 2016;40:159).
 *  - Obes (ASPEN/SCCM 2016): IMT 30–50 → 11–14 kkal/kg BB aktual; IMT >50 → 22–25 kkal/kg BBI;
 *    protein 2,0 g/kg BBI (IMT 30–<40), hingga 2,5 g/kg BBI (IMT ≥40).
 *  - AKI: standar 1,2–2,0 g/kg; HD/CRRT hingga maks 2,5 g/kg.
 *
 * BBI memakai Devine (utils/anthropometry). Angka ASPEN obesitas/AKI dan ABW 0,33 ESPEN
 * diverifikasi lewat ringkasan sekunder (teks lengkap pedoman tidak dapat diakses).
 */
import { calcBmi, calcIbw } from './anthropometry';

export type NutritionPhase = 'akut-awal' | 'akut-lanjut' | 'recovery';
export type NutritionCondition = 'kritis' | 'sepsis' | 'ards' | 'trauma' | 'aki' | 'aki-hd' | 'crrt';
export type NutritionSex = 'm' | 'f' | '';

export interface Range { min: number; max: number }

export interface TargetBlock {
  guideline: 'ESPEN' | 'ASPEN';
  label: string;          // mis. 'ESPEN 2019/2023'
  perKg: Range;
  basisKg: number;
  basisLabel: string;     // 'BB aktual' | 'BBI' | 'BB terkoreksi (ABW)'
  total: Range;
  /** true bila batas atas saja (ESPEN fase awal ≤70%). */
  upperOnly?: boolean;
  note: string;
}

export interface NutritionInput {
  weightKg: number;
  heightCm?: number;
  sex: NutritionSex;
  ibwOverride?: number;
  phase: NutritionPhase;
  condition: NutritionCondition;
}

export interface NutritionResult {
  bmi: number | null;
  obese: boolean;
  ibw: number | null;
  ibwSource: 'devine' | 'input' | null;
  abwEspen: number | null;
  energy: TargetBlock[];
  protein: TargetBlock[];
  /** Basis BB untuk energi (dipakai juga untuk langkah awal refeeding). */
  energyBasisKg: number;
  warnings: string[];
}

export type NutritionOutcome = { ok: true; result: NutritionResult } | { ok: false; error: string };

export const ESPEN_EE_PER_KG: Range = { min: 20, max: 25 };
export const ESPEN_ABW_FACTOR = 0.33;

const r1 = (v: number) => Math.round(v * 10) / 10;
const total = (perKg: Range, basisKg: number): Range => ({ min: Math.round(perKg.min * basisKg), max: Math.round(perKg.max * basisKg) });

/** ABW ESPEN = BBI + 0,33 × (BB − BBI). */
export function espenAdjustedWeight(ibw: number, actualKg: number): number {
  return ibw + ESPEN_ABW_FACTOR * (actualKg - ibw);
}

/** Faktor fase ESPEN terhadap kebutuhan energi. */
export function espenPhaseFactor(phase: NutritionPhase): Range {
  if (phase === 'akut-awal') return { min: 0.7, max: 0.7 };   // batas atas ≤70%
  if (phase === 'akut-lanjut') return { min: 0.8, max: 1.0 };
  return { min: 1.0, max: 1.0 };
}

export function nutritionTargets(i: NutritionInput): NutritionOutcome {
  const w = i.weightKg;
  if (!(w > 0)) return { ok: false, error: 'Berat badan wajib diisi.' };
  const h = i.heightCm && i.heightCm > 0 ? i.heightCm : null;
  const bmi = h ? calcBmi(w, h) : null;
  const obese = bmi !== null && bmi >= 30;

  let ibw: number | null = null;
  let ibwSource: NutritionResult['ibwSource'] = null;
  if (i.ibwOverride && i.ibwOverride > 0) { ibw = i.ibwOverride; ibwSource = 'input'; }
  else if (h && (i.sex === 'm' || i.sex === 'f')) { ibw = calcIbw(h, i.sex === 'f'); ibwSource = 'devine'; }

  if (obese && ibw === null) {
    return { ok: false, error: `IMT ${bmi!.toFixed(1)} (obes): target berbasis BB ideal — isi jenis kelamin pasien atau BBI manual.` };
  }

  const warnings: string[] = [];
  if (!h) warnings.push('Tinggi badan kosong — status obesitas (IMT) tidak dinilai; target memakai BB aktual.');

  const abwEspen = obese && ibw !== null ? espenAdjustedWeight(ibw, w) : null;

  // ---------- ENERGI ----------
  const energy: TargetBlock[] = [];
  const espenBasis = abwEspen ?? w;
  const pf = espenPhaseFactor(i.phase);
  const espenPerKg: Range = { min: ESPEN_EE_PER_KG.min * pf.min, max: ESPEN_EE_PER_KG.max * pf.max };
  energy.push({
    guideline: 'ESPEN', label: 'ESPEN 2019/2023',
    perKg: espenPerKg, basisKg: espenBasis, basisLabel: abwEspen !== null ? 'BB terkoreksi (ABW)' : 'BB aktual',
    total: total(espenPerKg, espenBasis),
    upperOnly: i.phase === 'akut-awal',
    note: i.phase === 'akut-awal'
      ? 'Hari 1–2: hipokalorik, maks 70% dari kebutuhan (20–25 kkal/kg) — naikkan bertahap.'
      : i.phase === 'akut-lanjut'
        ? 'Setelah hari ke-3: 80–100% kebutuhan (20–25 kkal/kg). Kalorimetri indirek lebih disukai.'
        : 'Kebutuhan penuh (20–25 kkal/kg). Kalorimetri indirek lebih disukai.',
  });

  if (obese && ibw !== null && bmi !== null) {
    const over50 = bmi > 50;
    const perKg: Range = over50 ? { min: 22, max: 25 } : { min: 11, max: 14 };
    const basis = over50 ? ibw : w;
    energy.push({
      guideline: 'ASPEN', label: 'ASPEN/SCCM 2016 (obesitas)',
      perKg, basisKg: basis, basisLabel: over50 ? 'BBI' : 'BB aktual',
      total: total(perKg, basis),
      note: over50 ? 'IMT >50: 22–25 kkal/kg BBI (hipokalorik, protein tinggi).' : 'IMT 30–50: 11–14 kkal/kg BB aktual (hipokalorik, protein tinggi).',
    });
  } else if (i.phase === 'recovery') {
    const perKg: Range = { min: 25, max: 30 };
    energy.push({
      guideline: 'ASPEN', label: 'ASPEN/SCCM 2016',
      perKg, basisKg: w, basisLabel: 'BB aktual', total: total(perKg, w),
      note: '25–30 kkal/kg (2016). Rekomendasi 2022 (12–25) ditujukan untuk fase kritis.',
    });
  } else {
    const perKg: Range = { min: 12, max: 25 };
    energy.push({
      guideline: 'ASPEN', label: 'ASPEN 2022',
      perKg, basisKg: w, basisLabel: 'BB aktual', total: total(perKg, w),
      note: '12–25 kkal/kg/hari (diturunkan dari 25–30 di 2016 karena ketidakpastian bahaya).',
    });
  }

  // ---------- PROTEIN ----------
  const protein: TargetBlock[] = [];
  const pBasisE = abwEspen ?? w;
  let espenP: Range; let espenNote: string;
  if (i.condition === 'aki') { espenP = { min: 1.0, max: 1.3 }; espenNote = 'AKI tanpa KRT: mulai 1,0, naikkan ke 1,3 g/kg bila ditoleransi (ESPEN 2021). Jangan dibatasi untuk menunda KRT.'; }
  else if (i.condition === 'aki-hd') { espenP = { min: 1.3, max: 1.5 }; espenNote = 'KRT intermiten: 1,3–1,5 g/kg (ESPEN 2021).'; }
  else if (i.condition === 'crrt') { espenP = { min: 1.5, max: 1.7 }; espenNote = 'KRT kontinu (CRRT): 1,5–1,7 g/kg (ESPEN 2021).'; }
  else { espenP = { min: 1.3, max: 1.3 }; espenNote = '1,3 g/kg/hari, dicapai bertahap.'; }
  protein.push({
    guideline: 'ESPEN', label: i.condition === 'aki' || i.condition === 'aki-hd' || i.condition === 'crrt' ? 'ESPEN 2021 (AKI)' : 'ESPEN 2019/2023',
    perKg: espenP, basisKg: pBasisE, basisLabel: abwEspen !== null ? 'BB terkoreksi (ABW)' : 'BB aktual',
    total: { min: r1(espenP.min * pBasisE), max: r1(espenP.max * pBasisE) },
    note: espenNote,
  });

  if (obese && ibw !== null && bmi !== null) {
    const p: Range = bmi >= 40 ? { min: 2.5, max: 2.5 } : { min: 2.0, max: 2.0 };
    protein.push({
      guideline: 'ASPEN', label: 'ASPEN/SCCM 2016 (obesitas)',
      perKg: p, basisKg: ibw, basisLabel: 'BBI',
      total: { min: r1(p.min * ibw), max: r1(p.max * ibw) },
      note: bmi >= 40 ? 'IMT ≥40: hingga 2,5 g/kg BBI.' : 'IMT 30–<40: 2,0 g/kg BBI.',
    });
  } else {
    let p: Range = { min: 1.2, max: 2.0 };
    let note = '1,2–2,0 g/kg BB aktual (2016, dipertahankan 2022).';
    if (i.condition === 'aki-hd' || i.condition === 'crrt') { p = { min: 1.2, max: 2.5 }; note = 'AKI dengan HD/CRRT: hingga maks 2,5 g/kg.'; }
    else if (i.condition === 'aki') note = 'AKI tanpa dialisis: rekomendasi ICU standar 1,2–2,0 g/kg — jangan dibatasi.';
    else if (i.condition === 'trauma') note = '1,2–2,0 g/kg; kebutuhan kemungkinan lebih tinggi pada multitrauma/luka bakar.';
    protein.push({
      guideline: 'ASPEN', label: 'ASPEN 2016/2022',
      perKg: p, basisKg: w, basisLabel: 'BB aktual',
      total: { min: r1(p.min * w), max: r1(p.max * w) },
      note,
    });
  }

  if (i.condition === 'aki' || i.condition === 'aki-hd' || i.condition === 'crrt') {
    warnings.push('EFFORT Protein (2023): protein ≥2,2 g/kg vs ≤1,2 g/kg tidak mempercepat pulang hidup dan mungkin merugikan pada pasien AKI — hindari batas atas tinggi.');
  }
  if (i.condition === 'ards') {
    warnings.push('ARDS: tidak ada target energi khusus. EDEN (2012): EN trofik (±400 kkal/hari) 6 hari pertama tidak berbeda dengan EN penuh (±1.300 kkal/hari) untuk hari bebas ventilator & mortalitas 60 hari, dengan intoleransi GI lebih sedikit.');
  }

  return {
    ok: true,
    result: {
      bmi: bmi !== null ? r1(bmi) : null, obese, ibw: ibw !== null ? r1(ibw) : null, ibwSource,
      abwEspen: abwEspen !== null ? r1(abwEspen) : null,
      energy, protein, energyBasisKg: abwEspen ?? w, warnings,
    },
  };
}

/**
 * Langkah awal pada risiko refeeding: 10–20 kkal/kg/hari × basis BB, tidak pernah melebihi
 * batas atas target terendah. Angka 10–20 (ASPEN 2020) BELUM terverifikasi dari teks resmi.
 */
export function refeedingStart(energyBasisKg: number, energy: TargetBlock[]): Range {
  const cap = Math.min(...energy.map((e) => e.total.max));
  const min = Math.min(Math.round(10 * energyBasisKg), cap);
  const max = Math.min(Math.round(20 * energyBasisKg), cap);
  return { min, max };
}

/** Volume EN (mL/hari) untuk rentang energi, setelah dikurangi kalori non-nutrisi. */
export function enteralVolume(kcal: Range, densityKcalPerMl: number, nonNutritionalKcal = 0): Range {
  if (!(densityKcalPerMl > 0)) return { min: 0, max: 0 };
  const nn = nonNutritionalKcal > 0 ? nonNutritionalKcal : 0;
  return {
    min: Math.max(0, Math.round((kcal.min - nn) / densityKcalPerMl)),
    max: Math.max(0, Math.round((kcal.max - nn) / densityKcalPerMl)),
  };
}

/** Batas PN ESPEN: glukosa ≤5 mg/kg/menit (= 7,2 g/kg/hari), lemak IV ≤1,5 g/kg/hari. */
export function pnLimits(weightKg: number): { glucoseG: number; lipidG: number } {
  return { glucoseG: r1(5 * 1440 / 1000 * weightKg), lipidG: r1(1.5 * weightKg) };
}

