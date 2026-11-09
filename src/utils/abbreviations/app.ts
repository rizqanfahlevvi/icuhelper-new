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

  // ── Antropometri ───────────────────────────────────────────────────────────
  BW: { full: 'Body Weight', id: 'berat badan' },
  AdjBW: { full: 'Adjusted Body Weight', id: 'berat badan terkoreksi (obesitas) = IBW + 0,4 × (BB − IBW)' },
  'ABW-aktual': { label: 'ABW', full: 'Actual Body Weight', id: 'berat badan aktual — sebagian rumus memakai ABW untuk arti ini' },
  LPT: { full: 'Luas Permukaan Tubuh' },
  EBV: { full: 'Estimated Blood Volume', id: 'perkiraan volume darah' },
  MABL: { full: 'Maximum Allowable Blood Loss', id: 'batas kehilangan darah yang masih dapat ditoleransi' },
  REE: { full: 'Resting Energy Expenditure', id: 'pengeluaran energi saat istirahat' },

  // ── Ventilasi, jalan napas & oksigen ───────────────────────────────────────
  MV: { full: 'Minute Ventilation', id: 'ventilasi semenit = VT × RR' },
  'VC-vital': { label: 'VC', full: 'Vital Capacity', id: 'kapasitas vital' },
  FRC: { full: 'Functional Residual Capacity', id: 'kapasitas residu fungsional' },
  TLC: { full: 'Total Lung Capacity', id: 'kapasitas paru total' },
  ARDSNet: { full: 'ARDS Clinical Trials Network', id: 'jejaring uji klinis ARDS (NHLBI)' },
  BVM: { full: 'Bag-Valve-Mask', id: 'kantong-katup-masker (bag/ambu)' },
  NRM: { full: 'Non-Rebreathing Mask', id: 'masker non-rebreathing dengan kantong reservoir' },
  CXR: { full: 'Chest X-Ray', id: 'foto toraks' },
  MH: { full: 'Malignant Hyperthermia', id: 'hipertermia maligna' },
  'ABC-protokol': { label: 'ABC', full: 'Awakening and Breathing Controlled', id: 'protokol SAT yang dipasangkan dengan SBT' },

  // ── Elektrolit, ginjal & cairan ────────────────────────────────────────────
  NAGMA: { full: 'Normal Anion Gap Metabolic Acidosis', id: 'asidosis metabolik dengan anion gap normal (hiperkloremik)' },
  ISE: { full: 'Ion-Selective Electrode', id: 'elektroda ion-selektif (direct = analyzer gas darah; indirect = lab sentral)' },
  Osm: { full: 'Osmolalitas', id: 'osmolalitas serum/urin (mOsm/kg)' },
  ADH: { full: 'Antidiuretic Hormone', id: 'hormon antidiuretik (vasopresin)' },
  DI: { full: 'Diabetes Insipidus' },
  DDAVP: { full: '1-Deamino-8-D-Arginine Vasopressin', id: 'desmopresin' },
  HTS: { full: 'Hypertonic Saline', id: 'salin hipertonik (mis. NaCl 3%)' },
  UOP: { full: 'Urine Output', id: 'produksi urin' },
  D50: { full: 'Dekstrosa 50%' },
  KSR: { full: 'Kalium Slow Release', id: 'tablet KCl lepas lambat 600 mg (8 mEq)' },
  ESKD: { full: 'End-Stage Kidney Disease', id: 'penyakit ginjal tahap akhir' },
  ROMK: { full: 'Renal Outer Medullary Potassium channel', id: 'kanal kalium medula luar ginjal' },
  TURP: { full: 'Transurethral Resection of the Prostate', id: 'reseksi prostat transuretra' },
  NPO: { full: 'Nil Per Os', id: 'puasa — tanpa asupan lewat mulut' },

  // ── Jantung, obat & metabolik ──────────────────────────────────────────────
  IMA: { full: 'Infark Miokard Akut' },
  CABG: { full: 'Coronary Artery Bypass Grafting', id: 'bedah pintas arteri koroner' },
  ACEi: { full: 'Angiotensin-Converting Enzyme inhibitor', id: 'penghambat ACE' },
  ARB: { full: 'Angiotensin II Receptor Blocker', id: 'penyekat reseptor angiotensin II' },
  MRA: { full: 'Mineralocorticoid Receptor Antagonist', id: 'antagonis reseptor mineralokortikoid (mis. spironolakton)' },
  'RAAS-i': { full: 'Renin-Angiotensin-Aldosterone System inhibitor', id: 'penghambat sistem renin-angiotensin-aldosteron (ACEi/ARB/MRA)' },
  SSRI: { full: 'Selective Serotonin Reuptake Inhibitor', id: 'penghambat ambilan ulang serotonin selektif' },
  LMWH: { full: 'Low Molecular Weight Heparin', id: 'heparin berat molekul rendah' },
  APTT: { full: 'Activated Partial Thromboplastin Time', id: 'waktu tromboplastin parsial teraktivasi' },
  Vd: { full: 'Volume of distribution', id: 'volume distribusi obat' },
  DM: { full: 'Diabetes Melitus' },
  BBC: { full: 'Basal-Bolus-Correction', id: 'regimen insulin basal + bolus prandial + koreksi' },
  SS: { full: 'Sliding Scale', id: 'skala geser insulin (dosis koreksi menurut GDS)' },
  CF: { full: 'Correction Factor', id: 'faktor koreksi — penurunan GDS (mg/dL) per 1 unit insulin' },

  // ── Organisasi & panduan ───────────────────────────────────────────────────
  ATLS: { full: 'Advanced Trauma Life Support', id: 'bantuan hidup lanjut trauma' },
  ABLS: { full: 'Advanced Burn Life Support', id: 'bantuan hidup lanjut luka bakar' },
  ABA: { full: 'American Burn Association' },
  SCAI: { full: 'Society for Cardiovascular Angiography and Interventions' },
  SfE: { full: 'Society for Endocrinology', id: 'perhimpunan endokrinologi Inggris' },
  ILCOR: { full: 'International Liaison Committee on Resuscitation' },
  KDOQI: { full: 'Kidney Disease Outcomes Quality Initiative' },
  CG: { full: 'Clinical Guideline', id: 'nomor pedoman klinis NICE (mis. CG174)' },
  PERKENI: { full: 'Perkumpulan Endokrinologi Indonesia' },
  ESCMID: { full: 'European Society of Clinical Microbiology and Infectious Diseases' },
  ALAT: { full: 'Asociación Latinoamericana del Tórax', id: 'Asosiasi Toraks Amerika Latin' },
  ECMM: { full: 'European Confederation of Medical Mycology' },
  ISHAM: { full: 'International Society for Human and Animal Mycology' },
  ASM: { full: 'American Society for Microbiology' },
} as const satisfies AbbrDict;
