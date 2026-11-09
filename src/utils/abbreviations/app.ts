import type { AbbrDict } from './types';

/** Singkatan tambahan yang khusus muncul di kalkulator & halaman lain (di luar Teori/Referensi). */
export const APP_ABBR = {
  // ── Umum / statistik ───────────────────────────────────────────────────────
  'RR-risiko': { label: 'RR', full: 'Relative Risk', id: 'risiko relatif' },
  NPV: { full: 'Negative Predictive Value', id: 'nilai duga negatif' },
  ADL: { full: 'Activities of Daily Living', id: 'aktivitas dasar sehari-hari (mandi, berpakaian, makan, dll.)' },
  IADL: { full: 'Instrumental Activities of Daily Living', id: 'aktivitas instrumental sehari-hari (belanja, keuangan, transportasi)' },

  // ── Skoring ────────────────────────────────────────────────────────────────
  BFS: { full: 'Bedside Frailty Scale', id: 'skala kerapuhan (frailty) bedside' },
  APS: { full: 'Acute Physiology Score', id: 'skor fisiologi akut (komponen APACHE-II)' },
  NYHA: { full: 'New York Heart Association', id: 'klasifikasi fungsional gagal jantung (kelas I–IV)' },
  UTA: { full: 'Unable to Assess', id: 'tidak dapat dinilai' },
  DSM: { full: 'Diagnostic and Statistical Manual of Mental Disorders', id: 'manual diagnostik & statistik gangguan jiwa' },
  eCASH: { full: 'early Comfort using Analgesia, minimal Sedatives and maximal Humane care', id: 'kenyamanan dini dengan analgesia, sedatif minimal, perawatan manusiawi maksimal' },
  BIS: { full: 'Bispectral Index', id: 'indeks bispektral — pemantauan kedalaman sedasi berbasis EEG' },
  HICP: { full: 'High Intracranial Pressure', id: 'tekanan intrakranial tinggi' },
  CTPA: { full: 'Computed Tomography Pulmonary Angiography', id: 'angiografi paru dengan CT scan' },
  FEU: { full: 'Fibrinogen Equivalent Units', id: 'satuan setara fibrinogen (pelaporan D-dimer)' },
  PERC: { full: 'Pulmonary Embolism Rule-out Criteria', id: 'kriteria untuk menyingkirkan emboli paru' },
  SSP: { full: 'Susunan Saraf Pusat' },

  // ── Lab & obat ─────────────────────────────────────────────────────────────
  Hb: { full: 'Hemoglobin' },
  Ht: { full: 'Hematokrit' },
  PLT: { full: 'Platelet', id: 'trombosit' },
  Cr: { full: 'Creatinine', id: 'kreatinin serum' },
  CrCl: { full: 'Creatinine Clearance', id: 'klirens kreatinin' },
  DA: { full: 'Dopamin' },
  DOB: { full: 'Dobutamin' },
  NPT: { full: 'Nutrisi Parenteral Total' },
  TV: { full: 'Tidal Volume', id: 'volume tidal (sama dengan VT)' },

  // ── Organisasi & panduan ───────────────────────────────────────────────────
  ESCMID: { full: 'European Society of Clinical Microbiology and Infectious Diseases' },
  ALAT: { full: 'Asociación Latinoamericana del Tórax', id: 'Asosiasi Toraks Amerika Latin' },
  ECMM: { full: 'European Confederation of Medical Mycology' },
  ISHAM: { full: 'International Society for Human and Animal Mycology' },
  ASM: { full: 'American Society for Microbiology' },
} as const satisfies AbbrDict;
