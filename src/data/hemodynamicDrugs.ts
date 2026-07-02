export type ReceptorActivity = 'none' | 'minimal' | 'mild' | 'moderate' | 'strong' | 'very_strong';

export interface DoseDependentReceptorProfile {
  doseRangeLabel: string;
  doseBandMin: number;
  doseBandMax: number;
  alpha1: ReceptorActivity;
  beta1: ReceptorActivity;
  beta2: ReceptorActivity;
  v1: ReceptorActivity;
  dominantEffect: string;
}

export interface StandardConcentration {
  value: number;
  unit: 'mcg/mL' | 'U/mL';
  syringeLabel: string;
}

export interface HemodynamicDrug {
  id: string;
  nameId: string;
  category: 'vasopressor' | 'inotrope' | 'vaso_inotrope' | 'non_adrenergic_vasopressor';
  unit: 'mcg/kgBB/menit' | 'U/menit' | 'mcg/menit';
  isWeightBased: boolean;
  doseMin: number;
  doseMax: number;
  doseStep: number;
  highDoseThreshold: number;
  neeConversionFactor: {
    goradia2021: number | null;
    kotani2023: number | null;
  };
  receptorProfiles: DoseDependentReceptorProfile[];
  citationIds: string[];
  standardConcentration: StandardConcentration;
}

export const RECEPTOR_ACTIVITY_SCALE: Record<ReceptorActivity, number> = {
  none: 0,
  minimal: 1,
  mild: 2,
  moderate: 3,
  strong: 4,
  very_strong: 5,
};

export const RECEPTOR_ACTIVITY_LABEL: Record<ReceptorActivity, string> = {
  none: 'Tidak ada',
  minimal: 'Minimal',
  mild: 'Ringan',
  moderate: 'Sedang',
  strong: 'Kuat',
  very_strong: 'Sangat Kuat',
};

export const HEMODYNAMIC_DRUGS: HemodynamicDrug[] = [
  {
    id: 'norepinephrine',
    nameId: 'Norepinefrin (NE)',
    category: 'vasopressor',
    unit: 'mcg/kgBB/menit',
    isWeightBased: true,
    doseMin: 0.01,
    doseMax: 3,
    doseStep: 0.01,
    highDoseThreshold: 0.5,
    neeConversionFactor: { goradia2021: 1, kotani2023: 1 },
    receptorProfiles: [
      {
        doseRangeLabel: '0.01–0.5 mcg/kgBB/menit (dosis standar)',
        doseBandMin: 0.01,
        doseBandMax: 0.5,
        alpha1: 'strong',
        beta1: 'mild',
        beta2: 'minimal',
        v1: 'none',
        dominantEffect: 'Vasokonstriksi kuat dengan efek inotropik ringan-sedang; agen vasopresor lini pertama pada syok septik.',
      },
      {
        doseRangeLabel: '>0.5 mcg/kgBB/menit (dosis tinggi / refrakter)',
        doseBandMin: 0.5,
        doseBandMax: 3,
        alpha1: 'very_strong',
        beta1: 'moderate',
        beta2: 'minimal',
        v1: 'none',
        dominantEffect: 'Vasokonstriksi sangat kuat; ambang dosis ini secara konsisten berkaitan dengan syok vasoplegik refrakter dan mortalitas tinggi.',
      },
    ],
    citationIds: ['ssc2026', 'debacker2010', 'goradia2021', 'statpearls_inotropes'],
    standardConcentration: { value: 80, unit: 'mcg/mL', syringeLabel: '4 mg dalam 50 mL D5% = 80 mcg/mL' },
  },
  {
    id: 'epinephrine',
    nameId: 'Epinefrin',
    category: 'vaso_inotrope',
    unit: 'mcg/kgBB/menit',
    isWeightBased: true,
    doseMin: 0.01,
    doseMax: 1,
    doseStep: 0.01,
    highDoseThreshold: 0.2,
    neeConversionFactor: { goradia2021: 1, kotani2023: 1 },
    receptorProfiles: [
      {
        doseRangeLabel: '0.01–0.05 mcg/kgBB/menit (dosis rendah)',
        doseBandMin: 0.01,
        doseBandMax: 0.05,
        alpha1: 'mild',
        beta1: 'strong',
        beta2: 'strong',
        v1: 'none',
        dominantEffect: 'Efek inotropik & kronotropik dominan (mirip dobutamin); vasodilatasi ringan via beta2.',
      },
      {
        doseRangeLabel: '0.05–0.2 mcg/kgBB/menit (dosis sedang)',
        doseBandMin: 0.05,
        doseBandMax: 0.2,
        alpha1: 'moderate',
        beta1: 'strong',
        beta2: 'moderate',
        v1: 'none',
        dominantEffect: 'Efek campuran inotropik dan vasokonstriksi mulai seimbang.',
      },
      {
        doseRangeLabel: '>0.2 mcg/kgBB/menit (dosis tinggi)',
        doseBandMin: 0.2,
        doseBandMax: 1,
        alpha1: 'very_strong',
        beta1: 'strong',
        beta2: 'mild',
        v1: 'none',
        dominantEffect: 'Alpha1 makin dominan sehingga menjadi vasopresor kuat; risiko iskemia splanknik dan aritmia meningkat.',
      },
    ],
    citationIds: ['ssc2026', 'statpearls_inotropes'],
    standardConcentration: { value: 80, unit: 'mcg/mL', syringeLabel: '4 mg dalam 50 mL D5% = 80 mcg/mL' },
  },
  {
    id: 'phenylephrine',
    nameId: 'Fenilefrin',
    category: 'vasopressor',
    unit: 'mcg/kgBB/menit',
    isWeightBased: true,
    doseMin: 0.1,
    doseMax: 5,
    doseStep: 0.1,
    highDoseThreshold: 3,
    neeConversionFactor: { goradia2021: 0.1, kotani2023: 0.06 },
    receptorProfiles: [
      {
        doseRangeLabel: '0.1–5 mcg/kgBB/menit',
        doseBandMin: 0.1,
        doseBandMax: 5,
        alpha1: 'very_strong',
        beta1: 'none',
        beta2: 'none',
        v1: 'none',
        dominantEffect: 'Vasokonstriksi alpha1 murni; tidak ada efek inotropik/kronotropik — risiko refleks bradikardia dan penurunan curah jantung, terutama bila fungsi jantung sudah terganggu.',
      },
    ],
    citationIds: ['statpearls_inotropes'],
    standardConcentration: { value: 100, unit: 'mcg/mL', syringeLabel: '10 mg dalam 100 mL NaCl = 100 mcg/mL' },
  },
  {
    id: 'vasopressin',
    nameId: 'Vasopresin',
    category: 'non_adrenergic_vasopressor',
    unit: 'U/menit',
    isWeightBased: false,
    doseMin: 0.01,
    doseMax: 0.06,
    doseStep: 0.01,
    highDoseThreshold: 0.04,
    neeConversionFactor: { goradia2021: 2.5, kotani2023: 2.5 },
    receptorProfiles: [
      {
        doseRangeLabel: '0.01–0.04 U/menit (dosis fisiologis, fixed-dose)',
        doseBandMin: 0.01,
        doseBandMax: 0.06,
        alpha1: 'none',
        beta1: 'none',
        beta2: 'none',
        v1: 'very_strong',
        dominantEffect: 'Vasokonstriksi via reseptor V1; tidak ada efek inotropik/kronotropik langsung. Agen non-katekolamin, umumnya diberikan fixed-dose (bukan dititrasi terus seperti katekolamin).',
      },
    ],
    citationIds: ['russell2008vasst', 'gordon2016vanish', 'ssc2026'],
    standardConcentration: { value: 0.2, unit: 'U/mL', syringeLabel: '20 unit dalam 100 mL NaCl = 0.2 unit/mL' },
  },
  {
    id: 'dobutamine',
    nameId: 'Dobutamin',
    category: 'inotrope',
    unit: 'mcg/kgBB/menit',
    isWeightBased: true,
    doseMin: 2.5,
    doseMax: 20,
    doseStep: 0.5,
    highDoseThreshold: 10,
    neeConversionFactor: { goradia2021: null, kotani2023: null },
    receptorProfiles: [
      {
        doseRangeLabel: '2.5–10 mcg/kgBB/menit (dosis standar)',
        doseBandMin: 2.5,
        doseBandMax: 10,
        alpha1: 'minimal',
        beta1: 'strong',
        beta2: 'mild',
        v1: 'none',
        dominantEffect: 'Inotropik kuat (peningkatan kontraktilitas & curah jantung) dengan vasodilatasi ringan ("inodilator").',
      },
      {
        doseRangeLabel: '10–20 mcg/kgBB/menit (dosis tinggi)',
        doseBandMin: 10,
        doseBandMax: 20,
        alpha1: 'minimal',
        beta1: 'very_strong',
        beta2: 'mild',
        v1: 'none',
        dominantEffect: 'Efek inotropik maksimal; risiko takikardia dan aritmia meningkat, serta dapat menurunkan MAP jika SVR sudah rendah.',
      },
    ],
    citationIds: ['statpearls_inotropes', 'kapur2019'],
    standardConcentration: { value: 5000, unit: 'mcg/mL', syringeLabel: '250 mg dalam 50 mL NaCl = 5000 mcg/mL' },
  },
  {
    id: 'dopamine',
    nameId: 'Dopamin',
    category: 'vaso_inotrope',
    unit: 'mcg/kgBB/menit',
    isWeightBased: true,
    doseMin: 2,
    doseMax: 20,
    doseStep: 1,
    highDoseThreshold: 10,
    neeConversionFactor: { goradia2021: 0.01, kotani2023: null },
    receptorProfiles: [
      {
        doseRangeLabel: '2–5 mcg/kgBB/menit (dosis rendah / "dopaminergik")',
        doseBandMin: 2,
        doseBandMax: 5,
        alpha1: 'none',
        beta1: 'mild',
        beta2: 'minimal',
        v1: 'none',
        dominantEffect: 'Historis disebut efek dopaminergik/renal; evidence renoprotektif saat ini lemah, tidak lagi menjadi dasar rekomendasi.',
      },
      {
        doseRangeLabel: '5–10 mcg/kgBB/menit (dosis sedang)',
        doseBandMin: 5,
        doseBandMax: 10,
        alpha1: 'mild',
        beta1: 'strong',
        beta2: 'mild',
        v1: 'none',
        dominantEffect: 'Efek beta1 dominan (inotropik & kronotropik).',
      },
      {
        doseRangeLabel: '>10 mcg/kgBB/menit (dosis tinggi)',
        doseBandMin: 10,
        doseBandMax: 20,
        alpha1: 'strong',
        beta1: 'strong',
        beta2: 'minimal',
        v1: 'none',
        dominantEffect: 'Alpha1 makin dominan (vasokonstriksi); risiko aritmia lebih tinggi dibanding norepinefrin.',
      },
    ],
    citationIds: ['debacker2010', 'ssc2026', 'statpearls_inotropes'],
    standardConcentration: { value: 4000, unit: 'mcg/mL', syringeLabel: '200 mg dalam 50 mL NaCl = 4000 mcg/mL' },
  },
];

export function getDrugById(id: string): HemodynamicDrug | undefined {
  return HEMODYNAMIC_DRUGS.find((d) => d.id === id);
}

export function getReceptorProfileForDose(drug: HemodynamicDrug, dose: number): DoseDependentReceptorProfile {
  const band = drug.receptorProfiles.find((p) => dose >= p.doseBandMin && dose <= p.doseBandMax);
  return band || drug.receptorProfiles[drug.receptorProfiles.length - 1];
}

/** Rate (mL/jam) syringe pump berdasarkan konsentrasi standar, mengikuti formula yang sama dengan KalkulatorPump. */
export function calculatePumpRateMlPerHour(drug: HemodynamicDrug, dose: number, weightKg: number | null): number | null {
  const concValue = drug.standardConcentration.value;
  if (drug.isWeightBased) {
    if (!weightKg || weightKg <= 0) return null;
    return (dose * weightKg * 60) / concValue;
  }
  return (dose * 60) / concValue;
}
