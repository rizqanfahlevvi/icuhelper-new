import { 
  Calculator, 
  BarChart2, 
  Pill, 
  BookMarked, 
  Activity, 
  Droplets, 
  Syringe, 
  Dna, 
  FileDigit, 
  HeartPulse, 
  Option, 
  Wind,
  ClipboardList,
  FileText,
  BookOpen
} from 'lucide-react';
import React from 'react';

export interface FavoritableItem {
  path: string; // The navigation path (e.g., "/calculator/ibw")
  name: string; // The short display name
  fullName?: string; // Long display name for searches or detail headers
  category: 'Kalkulator' | 'Skoring' | 'Teori' | 'Referensi';
  desc: string;
  icon: React.ComponentType<any>;
  /** Kelompok sistem organ untuk indeks Kalkulator/Skoring. */
  group?: ToolGroup;
}

export type ToolGroup =
  | 'respirasi' | 'asam-basa' | 'ginjal' | 'kardio' | 'cairan-obat' | 'metabolik' | 'lainnya'
  | 'keparahan' | 'neuro' | 'infeksi';

/** Urutan & label kelompok di indeks Kalkulator. */
export const CALC_GROUPS: { id: ToolGroup; label: string }[] = [
  { id: 'respirasi', label: 'Respirasi & Ventilator' },
  { id: 'asam-basa', label: 'Asam-Basa & Elektrolit' },
  { id: 'kardio', label: 'Kardiovaskular & Hemodinamik' },
  { id: 'cairan-obat', label: 'Cairan, Obat & Transfusi' },
  { id: 'ginjal', label: 'Ginjal' },
  { id: 'metabolik', label: 'Metabolik & Nutrisi' },
  { id: 'lainnya', label: 'Lainnya' },
];

/** Urutan & label kelompok di indeks Skoring. */
export const SCORING_GROUPS: { id: ToolGroup; label: string }[] = [
  { id: 'keparahan', label: 'Keparahan & Prognosis' },
  { id: 'neuro', label: 'Neurologi, Sedasi & Delirium' },
  { id: 'infeksi', label: 'Infeksi' },
  { id: 'kardio', label: 'Kardiovaskular & Tromboemboli' },
  { id: 'lainnya', label: 'Frailty & Lainnya' },
];

export const ALL_FAVORITABLE_ITEMS: FavoritableItem[] = [
  // CALCULATORS
  { path: '/calculator/cairan', name: 'Kalkulator Cairan', category: 'Kalkulator', desc: 'Kebutuhan cairan basal & koreksi resusitasi', icon: Droplets, group: 'cairan-obat' },
  { path: '/calculator/drug', name: 'Intubasi & Sedasi ICU', category: 'Kalkulator', desc: 'Dosis obat RSI (induksi, pelumpuh otot) & sedasi-analgesia maintenance', icon: Syringe, group: 'cairan-obat' },
  { path: '/calculator/electro', name: 'Koreksi Elektrolit', category: 'Kalkulator', desc: 'Koreksi cepat defisit Kalium, Natrium, dll', icon: Activity, group: 'asam-basa' },
  { path: '/calculator/ibw', name: 'IBW & Tidal Volume', category: 'Kalkulator', desc: 'Berat badan ideal & setting tidal volume ARDSNet', icon: Dna, group: 'respirasi' },
  { path: '/calculator/insulin', name: 'Kalkulator Insulin', category: 'Kalkulator', desc: 'Titrasi & sliding scale drip insulin', icon: Syringe, group: 'metabolik' },
  { path: '/calculator/nlr', name: 'Rasio NLR', category: 'Kalkulator', desc: 'Neutrophil-to-Lymphocyte Ratio indeks inflamasi', icon: FileDigit, group: 'lainnya' },
  { path: '/calculator/nutrisi', name: 'Kalkulator Nutrisi', category: 'Kalkulator', desc: 'Perhitungan target kalori & klor enteral-parenteral', icon: HeartPulse, group: 'metabolik' },
  { path: '/calculator/pf', name: 'P/F Ratio', category: 'Kalkulator', desc: 'Evaluasi PaO2/FiO2 & derajat ARDS', icon: Activity, group: 'respirasi' },
  { path: '/calculator/pulmo', name: 'Pulmonologi', category: 'Kalkulator', desc: 'Skor CURB-65 & gradient A-a oksigenasi', icon: Option, group: 'respirasi' },
  { path: '/calculator/pump', name: 'Syringe Pump', category: 'Kalkulator', desc: 'Perhitungan laju syringe pump umum', icon: Syringe, group: 'cairan-obat' },
  { path: '/calculator/renal', name: 'Renal / CrCl', category: 'Kalkulator', desc: 'Kalkulasi klirens kreatinin (eGFR) & dosis ginjal', icon: Activity, group: 'ginjal' },
  { path: '/calculator/transfusi', name: 'Kebutuhan Transfusi', category: 'Kalkulator', desc: 'Estimasi volume kolf PRC / WB untuk target Hb', icon: Droplets, group: 'cairan-obat' },
  { path: '/calculator/ventilator-adv', name: 'Ventilator Advanced', category: 'Kalkulator', desc: 'Tahanan jalan napas, compliance, & dead space', icon: Wind, group: 'respirasi' },
  { path: '/calculator/hemodinamik', name: 'Hemodynamic Support', category: 'Kalkulator', desc: 'Vasopresor/inotropik, profil reseptor & skor NEE', icon: HeartPulse, group: 'kardio' },
  { path: '/calculator/burn', name: 'Luka Bakar / Burn', category: 'Kalkulator', desc: 'TBSA Rule of Nines & Parkland', icon: Activity, group: 'cairan-obat' },
  { path: '/calculator/anion-gap', name: 'Anion Gap', category: 'Kalkulator', desc: 'Koreksi Anion & Osmolar Gap', icon: Activity, group: 'asam-basa' },

  // SCORING
  { path: '/scoring/sofa', name: 'SOFA Score', category: 'Skoring', desc: 'Sequential Organ Failure Assessment derajat disfungsi organ', icon: BarChart2, group: 'keparahan' },
  { path: '/scoring/apache', name: 'APACHE II Score', category: 'Skoring', desc: 'Sistem keparahan penyakit umum di ICU & proyeksi mortalitas', icon: ClipboardList, group: 'keparahan' },
  { path: '/scoring/camicu', name: 'CAM-ICU', category: 'Skoring', desc: 'Asesmen konfusi & delirium di ruang intensif', icon: FileText, group: 'neuro' },
  { path: '/scoring/rass', name: 'RASS Score', category: 'Skoring', desc: 'Richmond Agitation-Sedation Scale evaluasi tingkat sedasi', icon: Activity, group: 'neuro' },
  { path: '/scoring/bfs', name: 'BFS/CFS', category: 'Skoring', desc: 'Bedside Frailty Scale & Clinical Frailty Scale', icon: ClipboardList, group: 'lainnya' },
  { path: '/scoring/candida', name: 'Candida Score', category: 'Skoring', desc: 'Stratifikasi risiko infeksi jamur candida invasif', icon: Activity, group: 'infeksi' },
  { path: '/scoring/cpis', name: 'CPIS Score', category: 'Skoring', desc: 'Clinical Pulmonary Infection Score deteksi VAP dini', icon: FileText, group: 'infeksi' },
  { path: '/scoring/wells', name: 'Wells Score', category: 'Skoring', desc: 'Penilaian klinis risiko Emboli Paru (PE/DVT)', icon: ClipboardList, group: 'kardio' },

  // FLUIDS & DRUGS DIRECT ROUTES
  { path: '/pharmacy', name: 'Obat & Cairan', category: 'Referensi', desc: 'Database obat kritis, dosis induksi RSI, interaksi & cairan IV', icon: Pill },
  { path: '/abg', name: 'AGD (Asam-Basa)', category: 'Kalkulator', desc: 'Interpretasi gas darah arteri komprehensif (Boston)', icon: Activity, group: 'asam-basa' },
  { path: '/weaning', name: 'Weaning Evaluator', category: 'Kalkulator', desc: 'Evaluasi kesiapan ekstubasi & RSBI index', icon: Wind, group: 'respirasi' },
  { path: '/monitoring', name: 'Monitor Bedside', category: 'Referensi', desc: 'Visualisasi asuhan ventilasi mekanis harian', icon: Activity },
  { path: '/reference', name: 'Peralatan & Literatur', category: 'Referensi', desc: 'Literatur & guideline rujukan, plus glosarium singkatan', icon: BookMarked },

  // THEORY
  { path: '/theory/sepsis', name: 'Teori Sepsis-3', category: 'Teori', desc: 'Klinis epidemiologi, diagnosis, & tatalaksana sepsis', icon: BookOpen },
  { path: '/theory/syok', name: 'Teori Resusitasi Syok', category: 'Teori', desc: 'Klasifikasi syok & parameter resusitasi cairan', icon: BookOpen },
  { path: '/theory/airway', name: 'Edukasi Intubasi Airway', category: 'Teori', desc: 'Panduan jalan napas sulit & skenario induksi kilat', icon: BookOpen },
  { path: '/theory/gagalnapas', name: 'Patofisiologi Gagal Napas', category: 'Teori', desc: 'Tipe I-IV, mekanisme shunt, mismatch V/Q', icon: BookOpen },
  { path: '/theory/dka-hhs', name: 'Klinik DKA & HHS', category: 'Teori', desc: 'Manajemen cairan & insulin kontinu pada krisis hiperglikemia', icon: BookOpen },
  { path: '/theory/aki-crrt', name: 'Staging AKI & CRRT', category: 'Teori', desc: 'KDIGO staging, indikasi insiasi CRRT di ICU', icon: BookOpen },
  { path: '/theory/sat-sbt-vap', name: 'SAT, SBT & VAP Bundle', category: 'Teori', desc: 'ICU Liberation, protokol weaning, & pencegahan pneumonia', icon: BookOpen },
  { path: '/theory/b1b6', name: 'Overview Asesmen B1-B6', category: 'Teori', desc: 'Sistem Brain, Breath, Blood, Bowel, Bladder, Bone bedside', icon: BookOpen },
  { path: '/theory/nutrisi', name: 'Target Nutrisi Kritis', category: 'Teori', desc: 'Kapan memulai nutrisi, kalkulasi kalori & protein harian', icon: BookOpen },
  { path: '/theory/impending', name: 'Teori Gagal Napas Mengintai', category: 'Teori', desc: 'Tanda fisik dini impending respiratory failure pada pasien', icon: BookOpen },
  { path: '/theory/agd', name: 'Interpretasi AGD', category: 'Teori', desc: 'Analisa gas darah dan asam-basa', icon: BookOpen },
  { path: '/theory/padis', name: 'Guideline PADIS', category: 'Teori', desc: 'Pain, Agitation, Delirium, Immobility, Sleep', icon: BookOpen },
  { path: '/theory/tik', name: 'Manajemen TIK', category: 'Teori', desc: 'Tatalaksana Peningkatan Tekanan Intrakranial', icon: BookOpen },
  { path: '/theory/vent-dasar', name: 'Mode Ventilator Dasar', category: 'Teori', desc: 'VC, PC, SIMV, dan PSV', icon: BookOpen },
  { path: '/theory/fisiologi', name: 'Fisiologi Ventilasi Mekanik', category: 'Teori', desc: 'Mekanika respirasi dan interaksi paru-ventilator', icon: BookOpen },
  { path: '/theory/cardiac-rhythm', name: 'Cardiac Rhythm Guide', category: 'Teori', desc: 'Aritmia life-threatening & EKG', icon: BookOpen },
];

export function getFavoritableItemByPath(path: string): FavoritableItem | undefined {
  return ALL_FAVORITABLE_ITEMS.find(item => item.path === path);
}
