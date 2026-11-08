/**
 * Registri variabel klinis pasien — SATU sumber kebenaran untuk kunci, label,
 * satuan, dan pengelompokan semua data klinis/lab yang dipakai lintas kalkulator.
 *
 * Aturan satuan (WAJIB dipatuhi oleh setiap modul yang membaca/menulis store):
 * - Semua nilai disimpan dalam SATUAN KANONIK di kolom `unit` di bawah.
 *   Modul yang menampilkan satuan lain (µmol/L, kPa, BUN, fraksi FiO₂, dst.)
 *   WAJIB mengonversi saat publish/import (lihat utils/clinicalUnits.ts).
 * - Gas darah (ph, pco2, pao2, hco3, be) = sampel ARTERI. Nilai VBG tidak boleh
 *   ditulis ke kunci ini.
 * - FiO₂ disimpan dalam PERSEN (21–100).
 * - `ureum` = urea serum (mg/dL), BUKAN BUN. BUN = ureum ÷ 2,14.
 * - `glukosa` = gula darah sewaktu (GDS) terkini, mg/dL.
 */

export interface ClinicalData {
  // Demografi (dicerminkan dari data pasien aktif)
  age?: string;             // tahun
  gender?: 'm' | 'f' | '';  // m / f (patient store memakai L/P — konversi di utils/patientContext)
  weight?: string;          // kg (BB aktual)
  height?: string;          // cm

  // Tanda vital
  systolic?: string;        // mmHg
  diastolic?: string;       // mmHg
  map?: string;             // mmHg
  hr?: string;              // x/menit
  rr?: string;              // x/menit
  temp?: string;            // °C
  spo2?: string;            // %
  gcs?: string;             // skor total 3–15

  // AGD arteri & respirasi
  fio2?: string;            // % (21–100) — modul berbasis fraksi WAJIB konversi (utils/abg: fio2ToPercentString / fio2FromStoreString)
  peep?: string;            // cmH₂O
  ph?: string;              // pH arteri
  pco2?: string;            // PaCO₂ mmHg
  pao2?: string;            // PaO₂ mmHg
  hco3?: string;            // mmol/L
  be?: string;              // mEq/L
  laktat?: string;          // mmol/L

  // Hematologi
  hb?: string;              // g/dL
  hematokrit?: string;      // %
  leukosit?: string;        // 10³/µL
  neutrofilPct?: string;    // % hitung jenis (segmen + batang)
  limfositPct?: string;     // % hitung jenis
  monositPct?: string;      // % hitung jenis
  trombosit?: string;       // 10³/µL
  mcv?: string;             // fL
  mch?: string;             // pg
  mchc?: string;            // g/dL

  // Kimia klinik & glukosa
  glukosa?: string;         // mg/dL — GDS terkini (kunci kanonik; dulu juga `gds`)
  gdp?: string;             // mg/dL
  gd2pp?: string;           // mg/dL
  hba1c?: string;           // %
  albumin?: string;         // g/dL
  acidUric?: string;        // mg/dL
  cholesterol?: string;     // mg/dL
  ldl?: string;             // mg/dL
  hdl?: string;             // mg/dL
  trigliserida?: string;    // mg/dL

  // Ginjal & hati
  ureum?: string;           // mg/dL (urea, bukan BUN)
  creatinine?: string;      // mg/dL — terkini
  creatinineBaseline?: string; // mg/dL — kreatinin basal (KDIGO AKI)
  sgot?: string;            // U/L
  sgpt?: string;            // U/L
  bilirubinTotal?: string;  // mg/dL
  bilirubinDirek?: string;  // mg/dL
  bilirubinIndirek?: string;// mg/dL

  // Elektrolit
  na?: string;              // mEq/L
  k?: string;               // mEq/L
  cl?: string;              // mEq/L
  ca?: string;              // mg/dL (kalsium total)
  mg?: string;              // mg/dL

  // Lain-lain
  diagnosis?: string;       // diagnosis utama (teks)
}

export type ClinicalKey = keyof ClinicalData;
/** Cap waktu (epoch ms) pembaruan terakhir per variabel. */
export type ClinicalTimestamps = Partial<Record<ClinicalKey, number>>;

export type ClinicalGroup = 'demografi' | 'vital' | 'respirasi' | 'hematologi' | 'kimia' | 'ginjalHati' | 'elektrolit' | 'lain';

export interface ClinicalVariableMeta {
  label: string;
  /** Label pendek untuk chip/banner. */
  short: string;
  /** Satuan kanonik penyimpanan ('' bila tanpa satuan). */
  unit: string;
  group: ClinicalGroup;
  /** Contoh nilai untuk placeholder input (bukan nilai default!). */
  example?: string;
  kind?: 'number' | 'text';
  /** Catatan pendek di bawah input (satuan/definisi). */
  hint?: string;
  /** true = diisi di form identitas pasien, bukan di form klinis/lab. */
  demographic?: boolean;
}

export const CLINICAL_VARIABLES: Record<ClinicalKey, ClinicalVariableMeta> = {
  age: { label: 'Usia', short: 'Usia', unit: 'tahun', group: 'demografi', demographic: true },
  gender: { label: 'Jenis Kelamin', short: 'JK', unit: '', group: 'demografi', demographic: true },
  weight: { label: 'Berat Badan Aktual', short: 'BB', unit: 'kg', group: 'demografi', demographic: true },
  height: { label: 'Tinggi Badan', short: 'TB', unit: 'cm', group: 'demografi', demographic: true },

  systolic: { label: 'TD Sistolik', short: 'TDS', unit: 'mmHg', group: 'vital', example: '120' },
  diastolic: { label: 'TD Diastolik', short: 'TDD', unit: 'mmHg', group: 'vital', example: '80' },
  map: { label: 'Mean Arterial Pressure (MAP)', short: 'MAP', unit: 'mmHg', group: 'vital', example: '93', hint: 'Terisi otomatis dari TDS/TDD; bisa ditimpa (mis. dari arteri line).' },
  hr: { label: 'Laju Nadi (HR)', short: 'HR', unit: 'x/menit', group: 'vital', example: '85' },
  rr: { label: 'Laju Napas (RR)', short: 'RR', unit: 'x/menit', group: 'vital', example: '18' },
  temp: { label: 'Suhu Tubuh', short: 'Suhu', unit: '°C', group: 'vital', example: '36.8' },
  spo2: { label: 'SpO₂ (pulse oximetry)', short: 'SpO₂', unit: '%', group: 'vital', example: '97' },
  gcs: { label: 'Glasgow Coma Scale (GCS)', short: 'GCS', unit: 'skor', group: 'vital', example: '15', hint: 'Total E+V+M (3–15).' },

  fio2: { label: 'FiO₂', short: 'FiO₂', unit: '%', group: 'respirasi', example: '21', hint: 'Dalam persen (21–100), bukan fraksi.' },
  peep: { label: 'PEEP / EPAP', short: 'PEEP', unit: 'cmH₂O', group: 'respirasi', example: '5' },
  ph: { label: 'pH Arteri', short: 'pH', unit: '', group: 'respirasi', example: '7.40', hint: 'Sampel arteri (AGD). Jangan isi dengan pH vena.' },
  pco2: { label: 'PaCO₂', short: 'PaCO₂', unit: 'mmHg', group: 'respirasi', example: '40' },
  pao2: { label: 'PaO₂', short: 'PaO₂', unit: 'mmHg', group: 'respirasi', example: '90' },
  hco3: { label: 'HCO₃⁻', short: 'HCO₃⁻', unit: 'mmol/L', group: 'respirasi', example: '24' },
  be: { label: 'Base Excess', short: 'BE', unit: 'mEq/L', group: 'respirasi', example: '0' },
  laktat: { label: 'Laktat', short: 'Laktat', unit: 'mmol/L', group: 'respirasi', example: '1.5' },

  hb: { label: 'Hemoglobin (Hb)', short: 'Hb', unit: 'g/dL', group: 'hematologi', example: '12.5' },
  hematokrit: { label: 'Hematokrit', short: 'Ht', unit: '%', group: 'hematologi', example: '38' },
  leukosit: { label: 'Leukosit (WBC)', short: 'Leukosit', unit: '10³/µL', group: 'hematologi', example: '9.8' },
  neutrofilPct: { label: 'Neutrofil (hitung jenis)', short: 'Neutrofil', unit: '%', group: 'hematologi', example: '70', hint: 'Segmen + batang.' },
  limfositPct: { label: 'Limfosit (hitung jenis)', short: 'Limfosit', unit: '%', group: 'hematologi', example: '20' },
  monositPct: { label: 'Monosit (hitung jenis)', short: 'Monosit', unit: '%', group: 'hematologi', example: '6' },
  trombosit: { label: 'Trombosit', short: 'Trombosit', unit: '10³/µL', group: 'hematologi', example: '250' },
  mcv: { label: 'MCV', short: 'MCV', unit: 'fL', group: 'hematologi', example: '88' },
  mch: { label: 'MCH', short: 'MCH', unit: 'pg', group: 'hematologi', example: '30' },
  mchc: { label: 'MCHC', short: 'MCHC', unit: 'g/dL', group: 'hematologi', example: '33' },

  glukosa: { label: 'Gula Darah Sewaktu (GDS)', short: 'GDS', unit: 'mg/dL', group: 'kimia', example: '145', hint: 'Glukosa darah terkini — dipakai kalkulator Insulin, Natrium, Osmolalitas, Kalium.' },
  gdp: { label: 'Gula Darah Puasa (GDP)', short: 'GDP', unit: 'mg/dL', group: 'kimia', example: '95' },
  gd2pp: { label: 'GD 2 Jam PP', short: 'GD2PP', unit: 'mg/dL', group: 'kimia', example: '135' },
  hba1c: { label: 'HbA1c', short: 'HbA1c', unit: '%', group: 'kimia', example: '5.8' },
  albumin: { label: 'Albumin', short: 'Albumin', unit: 'g/dL', group: 'kimia', example: '3.5' },
  acidUric: { label: 'Asam Urat', short: 'As. urat', unit: 'mg/dL', group: 'kimia', example: '6.2' },
  cholesterol: { label: 'Kolesterol Total', short: 'Kolesterol', unit: 'mg/dL', group: 'kimia', example: '185' },
  ldl: { label: 'LDL', short: 'LDL', unit: 'mg/dL', group: 'kimia', example: '105' },
  hdl: { label: 'HDL', short: 'HDL', unit: 'mg/dL', group: 'kimia', example: '45' },
  trigliserida: { label: 'Trigliserida', short: 'TG', unit: 'mg/dL', group: 'kimia', example: '140' },

  ureum: { label: 'Ureum', short: 'Ureum', unit: 'mg/dL', group: 'ginjalHati', example: '30', hint: 'Urea, bukan BUN (BUN = ureum ÷ 2,14).' },
  creatinine: { label: 'Kreatinin (terkini)', short: 'Kreatinin', unit: 'mg/dL', group: 'ginjalHati', example: '0.9', hint: 'mg/dL (µmol/L ÷ 88,4).' },
  creatinineBaseline: { label: 'Kreatinin Basal', short: 'Kreatinin basal', unit: 'mg/dL', group: 'ginjalHati', example: '0.8', hint: 'Nilai stabil sebelum sakit akut — untuk staging AKI KDIGO.' },
  sgot: { label: 'SGOT (AST)', short: 'SGOT', unit: 'U/L', group: 'ginjalHati', example: '28' },
  sgpt: { label: 'SGPT (ALT)', short: 'SGPT', unit: 'U/L', group: 'ginjalHati', example: '32' },
  bilirubinTotal: { label: 'Bilirubin Total', short: 'Bil. total', unit: 'mg/dL', group: 'ginjalHati', example: '0.8' },
  bilirubinDirek: { label: 'Bilirubin Direk', short: 'Bil. direk', unit: 'mg/dL', group: 'ginjalHati', example: '0.3' },
  bilirubinIndirek: { label: 'Bilirubin Indirek', short: 'Bil. indirek', unit: 'mg/dL', group: 'ginjalHati', example: '0.5' },

  na: { label: 'Natrium (Na)', short: 'Na', unit: 'mEq/L', group: 'elektrolit', example: '140' },
  k: { label: 'Kalium (K)', short: 'K', unit: 'mEq/L', group: 'elektrolit', example: '4.0' },
  cl: { label: 'Klorida (Cl)', short: 'Cl', unit: 'mEq/L', group: 'elektrolit', example: '102' },
  ca: { label: 'Kalsium Total (Ca)', short: 'Ca', unit: 'mg/dL', group: 'elektrolit', example: '9.0' },
  mg: { label: 'Magnesium (Mg)', short: 'Mg', unit: 'mg/dL', group: 'elektrolit', example: '2.0' },

  diagnosis: { label: 'Diagnosis Utama', short: 'Diagnosis', unit: '', group: 'lain', kind: 'text' },
};

export const CLINICAL_KEYS = Object.keys(CLINICAL_VARIABLES) as ClinicalKey[];

export const EMPTY_CLINICAL_DATA: ClinicalData = Object.fromEntries(
  CLINICAL_KEYS.map((k) => [k, '']),
) as ClinicalData;

export const CLINICAL_GROUPS: { id: Exclude<ClinicalGroup, 'demografi' | 'lain'>; label: string }[] = [
  { id: 'vital', label: 'Tanda Vital' },
  { id: 'respirasi', label: 'AGD & Respirasi' },
  { id: 'hematologi', label: 'Hematologi' },
  { id: 'kimia', label: 'Kimia & Glukosa' },
  { id: 'ginjalHati', label: 'Ginjal & Hati' },
  { id: 'elektrolit', label: 'Elektrolit' },
];

export function isClinicalKey(k: string): k is ClinicalKey {
  return Object.prototype.hasOwnProperty.call(CLINICAL_VARIABLES, k);
}

/** Format nilai variabel untuk tampilan ringkas (chip/banner). */
export function formatClinicalValue(key: ClinicalKey, value: string): string {
  if (key === 'gender') return value === 'f' ? 'Perempuan' : value === 'm' ? 'Laki-laki' : value;
  const unit = CLINICAL_VARIABLES[key].unit;
  return unit && unit !== 'skor' ? `${value} ${unit}` : value;
}
