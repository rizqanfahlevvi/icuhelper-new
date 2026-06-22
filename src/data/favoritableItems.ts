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
}

export const ALL_FAVORITABLE_ITEMS: FavoritableItem[] = [
  // CALCULATORS
  { path: '/calculator/cairan', name: 'Kalkulator Cairan', category: 'Kalkulator', desc: 'Kebutuhan cairan basal & koreksi resusitasi', icon: Droplets },
  { path: '/calculator/drug', name: 'Drip Obat / Vasopresor', category: 'Kalkulator', desc: 'Dosis drip, syringe pump, dan gtt infus', icon: Syringe },
  { path: '/calculator/electro', name: 'Koreksi Elektrolit', category: 'Kalkulator', desc: 'Koreksi cepat defisit Kalium, Natrium, dll', icon: Activity },
  { path: '/calculator/ibw', name: 'IBW & Tidal Volume', category: 'Kalkulator', desc: 'Berat badan ideal & setting tidal volume ARDSNet', icon: Dna },
  { path: '/calculator/insulin', name: 'Kalkulator Insulin', category: 'Kalkulator', desc: 'Titrasi & sliding scale drip insulin', icon: Syringe },
  { path: '/calculator/nlr', name: 'Rasio NLR', category: 'Kalkulator', desc: 'Neutrophil-to-Lymphocyte Ratio indeks inflamasi', icon: FileDigit },
  { path: '/calculator/nutrisi', name: 'Kalkulator Nutrisi', category: 'Kalkulator', desc: 'Perhitungan target kalori & klor enteral-parenteral', icon: HeartPulse },
  { path: '/calculator/pf', name: 'P/F Ratio', category: 'Kalkulator', desc: 'Evaluasi PaO2/FiO2 & derajat ARDS', icon: Activity },
  { path: '/calculator/pulmo', name: 'Pulmonologi', category: 'Kalkulator', desc: 'Skor CURB-65 & gradient A-a oksigenasi', icon: Option },
  { path: '/calculator/pump', name: 'Syringe Pump', category: 'Kalkulator', desc: 'Perhitungan laju syringe pump umum', icon: Syringe },
  { path: '/calculator/renal', name: 'Renal / CrCl', category: 'Kalkulator', desc: 'Kalkulasi klirens kreatinin (eGFR) & dosis ginjal', icon: Activity },
  { path: '/calculator/transfusi', name: 'Kebutuhan Transfusi', category: 'Kalkulator', desc: 'Estimasi volume kolf PRC / WB untuk target Hb', icon: Droplets },
  { path: '/calculator/ventilator-adv', name: 'Ventilator Advanced', category: 'Kalkulator', desc: 'Tahanan jalan napas, compliance, & dead space', icon: Wind },

  // SCORING
  { path: '/scoring/sofa', name: 'SOFA Score', category: 'Skoring', desc: 'Sequential Organ Failure Assessment derajat disfungsi organ', icon: BarChart2 },
  { path: '/scoring/apache', name: 'APACHE II Score', category: 'Skoring', desc: 'Sistem keparahan penyakit umum di ICU & proyeksi mortalitas', icon: ClipboardList },
  { path: '/scoring/camicu', name: 'CAM-ICU', category: 'Skoring', desc: 'Asesmen konfusi & delirium di ruang intensif', icon: FileText },
  { path: '/scoring/rass', name: 'RASS Score', category: 'Skoring', desc: 'Richmond Agitation-Sedation Scale evaluasi tingkat sedasi', icon: Activity },
  { path: '/scoring/bfs', name: 'BFS/CFS', category: 'Skoring', desc: 'Bedside Frailty Scale & Clinical Frailty Scale', icon: ClipboardList },
  { path: '/scoring/candida', name: 'Candida Score', category: 'Skoring', desc: 'Stratifikasi risiko infeksi jamur candida invasif', icon: Activity },
  { path: '/scoring/cpis', name: 'CPIS Score', category: 'Skoring', desc: 'Clinical Pulmonary Infection Score deteksi VAP dini', icon: FileText },

  // FLUIDS & DRUGS DIRECT ROUTES
  { path: '/drug-reference', name: 'iObat & Interaksi', category: 'Referensi', desc: 'Database 146 obat kritis, dosis induksi RSI & interaksi', icon: Pill },
  { path: '/cairan', name: 'Cairan Klinis', category: 'Referensi', desc: 'Kandungan ionik & jenis kristaloid-koloid', icon: Droplets },
  { path: '/abg', name: 'AGD (Asam-Basa)', category: 'Kalkulator', desc: 'Interpretasi gas darah arteri komprehensif (Boston)', icon: Activity },
  { path: '/weaning', name: 'Weaning Evaluator', category: 'Kalkulator', desc: 'Evaluasi kesiapan ekstubasi & RSBI index', icon: Wind },
  { path: '/monitoring', name: 'Monitor Bedside', category: 'Referensi', desc: 'Visualisasi asuhan ventilasi mekanis harian', icon: Activity },
  { path: '/reference', name: 'Peralatan & Literatur', category: 'Referensi', desc: '54+ bukti sains, pustaka rujukan, & sitasi medis', icon: BookMarked },

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
];

export function getFavoritableItemByPath(path: string): FavoritableItem | undefined {
  return ALL_FAVORITABLE_ITEMS.find(item => item.path === path);
}
