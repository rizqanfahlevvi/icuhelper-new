import { DrugDatabase } from './types';
import { ICU_DRUGS as ImportedDrugs } from './drugDb';

export const ICU_DRUGS: DrugDatabase = ImportedDrugs;

export const VASOPRESSOR_FLOWCHART = [
  {
    id: 'distributive',
    label: 'Syok Distributif / Septik',
    icon: '🦠',
    color: 'border-orange-500',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-500',
    steps: [
      { step: 1, agent: 'Norepinefrin', dose: '0.01–0.5 mcg/kg/min', note: 'First-line. SSC 2024. Titrasi MAP ≥65 mmHg.', drug_key: 'norepinefrin' },
      { step: 2, agent: '+ Vasopressin', dose: '0.03–0.04 IU/min (tetap)', note: 'Tambahkan jika NE ≥0.25 mcg/kg/min. Sparing katekolamin.', drug_key: 'vasopressin' },
      { step: 3, agent: '+ Epinefrin', dose: '0.01–0.5 mcg/kg/min', note: 'Jika MAP tetap <65 meski NE + vasopressin. Atau jika ada disfungsi miokard.', drug_key: 'epinefrin' },
      { step: 4, agent: '± Dobutamin', dose: '2–20 mcg/kg/min', note: 'Tambahkan jika ScvO₂ <70% atau tanda hipoperfusi persisten. Bukan untuk MAP.', drug_key: 'dobutamin' }
    ]
  },
  {
    id: 'cardiogenic',
    label: 'Syok Kardiogenik',
    icon: '🫀',
    color: 'border-red-500',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-500',
    steps: [
      { step: 1, agent: 'Norepinefrin', dose: '0.01–0.3 mcg/kg/min', note: 'Pertahankan perfusi. MAP ≥65 mmHg. Gunakan dosis rendah.', drug_key: 'norepinefrin' },
      { step: 2, agent: '+ Dobutamin', dose: '2–20 mcg/kg/min', note: 'Tingkatkan cardiac output (CI target >2.2 L/min/m²). Kombinasi dengan NE.', drug_key: 'dobutamin' },
      { step: 3, agent: 'Atau Milrinon', dose: '0.375–0.75 mcg/kg/min', note: 'Jika pasien dalam β-blocker kronik atau down-regulated β-receptor.', drug_key: 'milrinon' },
      { step: 4, agent: 'Atau Levosimendan', dose: '0.05–0.2 mcg/kg/min × 24 jam', note: 'Refrakter dobutamin/milrinon. Efek berlanjut 7–9 hari via OR-1896.', drug_key: 'levosimendan' }
    ]
  },
  {
    id: 'hypovolemic',
    label: 'Syok Hipovolemik',
    icon: '💧',
    color: 'border-blue-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    steps: [
      { step: 1, agent: 'Resusitasi Cairan', dose: '30 mL/kg kristaloid (jika sepsis)', note: 'KOREKSI VOLUME DULU. Vasopressor sebelum volume koreksi memperburuk outcome.', drug_key: null },
      { step: 2, agent: 'Norepinefrin (bridge)', dose: '0.01–0.1 mcg/kg/min', note: 'Bridge sementara jika MAP sangat rendah mengancam jiwa, sambil koreksi volume.', drug_key: 'norepinefrin' }
    ]
  },
  {
    id: 'obstructive',
    label: 'Syok Obstruktif',
    icon: '🚧',
    color: 'border-purple-500',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-500',
    steps: [
      { step: 1, agent: 'Norepinefrin (bridge)', dose: '0.01–0.3 mcg/kg/min', note: 'Bridge sementara. KOREKSI PENYEBAB (PE → trombolisis/embolektomi; tension PTX → dekompresi; tamponade → perikardiosentesis).', drug_key: 'norepinefrin' }
    ]
  }
];

export const SEDATION_LADDER = [
  {
    level: 1,
    label: 'Analgesia Saja (RASS 0 hingga -1)',
    color: 'border-green-500',
    bgColor: 'bg-green-500',
    description: 'Pasien tidak terintubasi atau baru intubasi, tidak ada agitasi bermakna.',
    agents: [
      { name: 'Fentanil', dose: '25–100 mcg/jam infus atau bolus PRN', note: 'Analgesia-first. CPOT target 0–2.', drug_key: 'fentanil' },
      { name: 'Parasetamol IV', dose: '1g IV q6–8j (multimodal)', note: 'Opioid-sparing. Aman semua kondisi kecuali gagal hati berat.', drug_key: 'parasetamol_iv' },
      { name: 'Ketorolak', dose: '15–30 mg IV q6j (maks 5 hari)', note: 'Bila tidak ada kontraindikasi renal/GI.', drug_key: 'ketorolak' }
    ]
  },
  {
    level: 2,
    label: 'Sedasi Ringan (RASS -1 hingga -2)',
    color: 'border-blue-500',
    bgColor: 'bg-blue-500',
    description: 'Pasien terintubasi dengan agitasi ringan atau untuk memfasilitasi ventilasi.',
    agents: [
      { name: 'Deksmedetomidin', dose: '0.2–0.7 mcg/kg/jam', note: 'Pilihan utama — pasien masih bisa komunikasi, non-GABA, preservasi napas.', drug_key: 'deksmedetomidin' },
      { name: 'Propofol', dose: '5–30 mcg/kg/min', note: 'Alternatif. Onset/offset cepat. Hitung kalori lemak.', drug_key: 'propofol' }
    ]
  },
  {
    level: 3,
    label: 'Sedasi Dalam (RASS -3 hingga -4)',
    color: 'border-orange-500',
    bgColor: 'bg-orange-500',
    description: 'ARDS berat (P/F <150), asinkroni ventilator refrakter, prosedur.',
    agents: [
      { name: 'Propofol', dose: '10–50 mcg/kg/min (maks 4 mg/kg/jam)', note: 'Monitor TG setiap 48 jam. Waspadai PRIS jika >48–72 jam dosis tinggi.', drug_key: 'propofol' },
      { name: 'Midazolam', dose: '0.02–0.1 mg/kg/jam', note: 'Jika propofol tidak tersedia/kontraindikasi. Risiko delirium lebih tinggi.', drug_key: 'midazolam' },
      { name: '+ NMB (Sisatrakurium)', dose: '0.5–3 mcg/kg/min', note: 'Tambahkan jika P/F <150 + dyssynchrony persisten. PASTIKAN sedasi adekuat DULU.', drug_key: 'sisatrakurium' }
    ]
  },
  {
    level: 4,
    label: 'Sedasi Refrakter / Status Epileptikus',
    color: 'border-red-500',
    bgColor: 'bg-red-500',
    description: 'Status epileptikus refrakter (RSE), agitasi berat tidak terkontrol.',
    agents: [
      { name: 'Propofol', dose: 'Hingga 4 mg/kg/jam (batas PRIS)', note: 'Lini pertama RSE: 1–5 mg/kg/jam. EEG monitoring.', drug_key: 'propofol' },
      { name: 'Ketamin', dose: '1–2 mg/kg/jam infus', note: 'Status epileptikus refrakter. Mempertahankan MAP — berguna pada syok bersamaan.', drug_key: 'ketamin_icu' },
      { name: 'Tiopental', dose: '3–5 mg/kg bolus → 1–5 mg/kg/jam', note: 'Lini ketiga RSE. EEG burst-suppression. Hemodinamik tidak stabil.', drug_key: 'tiopental' }
    ]
  }
];
