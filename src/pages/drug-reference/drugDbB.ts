import { DrugDatabase } from './types';

export const ICU_DRUGS: DrugDatabase = {

"dopamin": {
  name: "Dopamin",
  brand_id: ["Dopamin Hameln", "Dopamine Fresenius", "Giludop"],
  brand_id_notes: "Tersedia luas. Ampul 200 mg/5 mL.",
  class: "Katekolamin",
  subclass: "Vasopressor dopaminergik",
  category: ["vasopressor", "inotropik"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua ICU Indonesia",
  mechanism: "Dosis-dependen: Renal (<3 mcg/kg/min): agonis DA1 → vasodilatasi renal, ↑ diuresis. Kardiak (3–10): agonis β₁ → ↑kontraktilitas, ↑HR. Vasopressor (>10): agonis α₁ → vasokonstriksi, ↑MAP. Catatan: 'dosis renal' tidak terbukti secara klinis melindungi ginjal.",
  pkpd_type: null as any,
  pkpd_note: null as any,
  spectrum: null as any,
  indications: {
    icu_primary: ["Syok kardiogenik dengan bradikardia (dopamin > norepinefrin)", "Bradikardia simtomatik refrakter atropin (dosis inotropik)"],
    icu_secondary: ["Alternatif norepinefrin bila tidak tersedia (syok septik)", "Syok kardiogenik — dosis inotropik 5–10 mcg/kg/min"],
    local_guideline: "PERDICI: Dopamin tidak lagi first-line syok septik. SSC 2016+ merekomendasikan norepinefrin.",
    intl_guideline: "SSC 2024: Dopamin hanya untuk subset syok septik dengan bradikardia atau disfungsi sistolik berat. ACLS 2020: Infus dopamin 2–10 mcg/kg/min untuk bradikardia simtomatik."
  },
  contraindications: ["Feokromositoma", "Fibrilasi ventrikel", "Hipovolemia tidak terkoreksi"],
  precautions: ["Risiko takiaritmia lebih tinggi dibanding norepinefrin", "Ekstravasasi: nekrosis jaringan", "Gangguan sirkulasi perifer berat"],
  dosing: {
    standard: "2–20 mcg/kg/min IV kontinyu",
    range_low: "1–3 mcg/kg/min (efek dopaminergik/diuresis)",
    range_high: "10–20 mcg/kg/min (vasopressor penuh)",
    max: "20–50 mcg/kg/min (sangat refrakter, jarang)",
    loading: null as any,
    maintenance: "Titrasi sesuai MAP dan HR target",
    route: ["IV"],
    dilution: "200 mg dalam 50 mL NS/D5W → 4000 mcg/mL. Atau 200 mg dalam 250 mL → 800 mcg/mL.",
    rate: "(mcg/kg/min × BB × 60) / 4000 = mL/jam (konsentrasi 4000 mcg/mL)",
    titration: "Naikan 1–4 mcg/kg/min setiap 10–30 menit per respons klinis",
    special_notes: "HANYA via CVC. Tidak direkomendasikan sebagai first-line vasopressor syok septik (SSC 2024)."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Monitor HR ketat" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "Monitor aritmia — akumulasi metabolit" },
    hd:     { dose: "Normal", interval: "Normal", note: "Sedikit terdialisis" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Urin output — 'dosis renal' tidak terbukti nefroprotektif"
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal",
    note: "Metabolisme: MAO dan COMT."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali emergensi",
    trimester_2: "Gunakan hanya jika indikasi kuat",
    trimester_3: "Idem — risiko vasokonstriksi uterus",
    labor_delivery: "Monitor fetal heart rate",
    fetal_risk: "Vasokonstriksi uterus pada dosis tinggi",
    lactation: "Data tidak ada. Hindari menyusui.",
    lactation_note: null as any
  },
  monitoring: {
    efficacy: ["MAP target ≥65 mmHg", "HR — hindari >120 bpm", "Urin output"],
    safety: ["EKG kontinyu — aritmia lebih sering vs norepinefrin", "Tanda ekstravasasi"],
    frequency: "Continuous hemodynamic monitoring",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Takiaritmia (AF, SVT, VT) — lebih sering dari norepinefrin", "Nekrosis jaringan berat akibat ekstravasasi"],
    common: ["Takikardia", "Nausea/vomiting", "Sakit kepala", "Ansietas"],
    antidote: "Ekstravasasi: Fentolamin 5 mg dalam 9 mL NS subkutan"
  },
  interactions: {
    major: [
      { drug: "MAO Inhibitor", effect: "Krisis hipertensi fatal", management: "Kontraindikasi — tunggu 14 hari" },
      { drug: "Fenitoin IV", effect: "Hipotensi berat dan bradikardia", management: "Hindari kombinasi" }
    ],
    moderate: []
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: true,
  pump_drug_key: "dopamin",
  evidence: [
    { ref_id: "ssc2024", note: "Tidak lagi first-line; dipertimbangkan pada syok dengan bradikardia" }
  ]
},

"vasopressin": {
  name: "Vasopressin (ADH)",
  brand_id: ["Vasopressin Hameln", "Pitressin", "Empressin"],
  brand_id_notes: "Tersedia di RS besar Indonesia. Ampul 20 IU/mL.",
  class: "Vasopresin endogen",
  subclass: "Non-adrenergik vasopressor",
  category: ["vasopressor"],
  common_in_id: true,
  common_in_id_note: "Tersedia di ICU RS rujukan. Ketersediaan terbatas di daerah.",
  mechanism: "Agonis reseptor V1 (vasokonstriksi otot polos vaskular, ↑SVR) dan V2 (retensi air renal). Mekanisme independen dari katekolamin — efektif pada syok yang relatif kehabisan vasopresin endogen. Tidak menyebabkan takikardia.",
  pkpd_type: null as any,
  pkpd_note: null as any,
  spectrum: null as any,
  indications: {
    icu_primary: ["Syok septik refrakter — add-on norepinefrin untuk spare dose katekolamin (VASST trial)", "Vasoplegia post-cardiac surgery"],
    icu_secondary: ["Diabetes insipidus sentral (dosis berbeda: 5–10 IU IM/IV)", "Perdarahan varises esofagus (terlipressin lebih sering digunakan)"],
    local_guideline: "PERDICI: Vasopressin 0.03 IU/min sebagai add-on norepinefrin pada syok septik refrakter",
    intl_guideline: "SSC 2024: Tambahkan vasopressin 0.03 IU/min jika norepinefrin ≥0.25 mcg/kg/min untuk target MAP."
  },
  contraindications: ["Syok kardiogenik tanpa vasopressor (relatif — ↓CO)", "Penyakit vaskular perifer berat (relatif)"],
  precautions: ["Iskemia koroner — vasokonstriksi koroner mungkin terjadi", "Hiponatremia — efek V2 retensi air", "Tidak dititrasi seperti katekolamin — dosis tetap"],
  dosing: {
    standard: "0.03–0.04 IU/min IV kontinyu (tetap, tidak dititrasi)",
    range_low: "0.01 IU/min",
    range_high: "0.04 IU/min (jarang >0.04)",
    max: "0.06 IU/min (dosis tinggi → iskemia)",
    loading: null as any,
    maintenance: "Dosis tetap — tidak dititrasi naik seperti katekolamin",
    route: ["IV"],
    dilution: "20 IU dalam 50 mL NS → 0.4 IU/mL. 0.03 IU/min = 4.5 mL/jam.",
    rate: "0.03 IU/min × 60 / 0.4 IU/mL = 4.5 mL/jam",
    titration: "TIDAK dititrasi seperti katekolamin. Tambahkan/kurangi norepinefrin sebagai vasopressor utama.",
    special_notes: "Dosis >0.04 IU/min meningkatkan risiko iskemia miokard dan digital. Selalu via CVC."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Monitor Na+ — efek antidiuretik" },
    r_lt15: { dose: "Pertimbangkan dosis lebih rendah", interval: "Normal", note: "Risiko hiponatremia lebih tinggi" },
    hd:     { dose: "Normal", interval: "Normal", note: "" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Natrium serum, urin output, tanda retensi cairan berlebih"
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Hati-hati — varises risiko perdarahan", child_c: "Hati-hati",
    note: "Degradasi oleh vasopressinase — tidak bergantung hati."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali emergensi",
    trimester_2: "Gunakan hanya jika mutlak perlu",
    trimester_3: "Dapat menstimulasi kontraksi uterus",
    labor_delivery: "Risiko induksi kontraksi uterus",
    fetal_risk: "Vasokonstriksi uteroplasenta",
    lactation: "Data terbatas.",
    lactation_note: null as any
  },
  monitoring: {
    efficacy: ["MAP setiap 15–30 menit", "Respons terhadap penurunan kebutuhan norepinefrin"],
    safety: ["Na+ serum setiap 6–12 jam (hiponatremia)", "Tanda iskemia: EKG, nyeri dada", "Tanda iskemia perifer"],
    frequency: "Monitoring hemodinamik kontinyu",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Iskemia miokard", "Iskemia digital/mesenterika pada dosis tinggi", "Hiponatremia berat"],
    common: ["Bradikardia refleks", "Pucat kulit", "Retensi air/hiponatremia", "Nausea"],
    antidote: null as any
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Indometasin", effect: "Potensiasi efek antidiuretik vasopressin → hiponatremia" },
      { drug: "Katekolamin dosis tinggi", effect: "Vasokonstriksi berlebih → iskemia" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "ssc2024", note: "Add-on vasopressin 0.03 IU/min bila NE ≥0.25 mcg/kg/min" }
  ]
},

"dobutamin": {
  name: "Dobutamin",
  brand_id: ["Dobutamin Hameln", "Inotrop", "Dobutamin Fresenius"],
  brand_id_notes: "Tersedia di ICU Indonesia. Ampul 250 mg/20 mL.",
  class: "Katekolamin sintetik",
  subclass: "Inotropik selektif β₁",
  category: ["inotropik", "vasopressor"],
  common_in_id: true,
  common_in_id_note: "Tersedia di RS ICU Indonesia",
  mechanism: "Agonis selektif β₁ (↑kontraktilitas, ↑HR) dan β₂ ringan (vasodilatasi ringan, ↓SVR). Efek α sangat minimal. Net: ↑CO, sedikit ↓SVR. Tidak meningkatkan MAP secara langsung — bahkan dapat menurunkan pada dosis tinggi.",
  pkpd_type: null as any,
  pkpd_note: null as any,
  spectrum: null as any,
  indications: {
    icu_primary: ["Syok kardiogenik dengan cardiac output rendah dan SVR tinggi", "Dekompensasi akut gagal jantung dengan hipoperfusi"],
    icu_secondary: ["Kombinasi dengan norepinefrin: syok septik dengan disfungsi miokard (EF <40%)", "Stress echocardiography (dosis rendah 5–20 mcg/kg/min)"],
    local_guideline: "PERDICI/PERKI: Dobutamin untuk syok kardiogenik. Monitor CO/ScvO₂ untuk panduan titrasi.",
    intl_guideline: "ESC HF 2021: Dobutamin 2–20 mcg/kg/min pada dekompensasi akut dengan CO rendah. SSC 2024: Tambahkan dobutamin pada syok septik dengan disfungsi miokard."
  },
  contraindications: ["Stenosis aorta berat (obstruksi alur keluar) — meningkatkan gradient", "Kardiomiopati hipertrofik obstruktif", "Hipovolemia tidak terkoreksi"],
  precautions: ["Takikardia — dapat memperburuk iskemia miokard", "Aritmia atrial — gunakan hati-hati pada AF (meningkatkan ventricular rate)", "Toleransi setelah 72 jam penggunaan terus-menerus (down-regulation β)"],
  dosing: {
    standard: "2–20 mcg/kg/min IV kontinyu",
    range_low: "2–5 mcg/kg/min (inotropik ringan)",
    range_high: "15–20 mcg/kg/min (inotropik maksimal)",
    max: "40 mcg/kg/min (sangat jarang, risiko aritmia tinggi)",
    loading: null as any,
    maintenance: "Titrasi berdasar CO/ScvO₂/tanda perfusi",
    route: ["IV"],
    dilution: "250 mg dalam 50 mL NS/D5W → 5000 mcg/mL. Atau 250 mg dalam 250 mL → 1000 mcg/mL.",
    rate: "(mcg/kg/min × BB × 60) / 5000 = mL/jam",
    titration: "Naikan 2.5 mcg/kg/min setiap 10–15 menit. Target ScvO₂ >70% atau CI >2.2 L/min/m².",
    special_notes: "TIDAK meningkatkan MAP — jika hipotensi, tambahkan vasopressor (norepinefrin). Toleransi tachyphylaxis setelah 48–72 jam."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "Monitor aritmia" },
    hd:     { dose: "Normal", interval: "Normal", note: "Tidak terdialisis secara bermakna" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Urin output sebagai marker CO. Monitor elektrolit."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal",
    note: "Metabolisme oleh COMT. Tidak bergantung fungsi hati."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Data hewan aman. Gunakan jika indikasi kuat.",
    trimester_2: "Dapat digunakan pada syok kardiogenik",
    trimester_3: "Idem",
    labor_delivery: "Monitor fetal heart rate",
    fetal_risk: "Takikardia fetal mungkin terjadi",
    lactation: "Data tidak ada.",
    lactation_note: null as any
  },
  monitoring: {
    efficacy: ["Cardiac output/index (target CI >2.2 L/min/m²)", "ScvO₂ (target >70%)", "Klirens laktat", "Urin output"],
    safety: ["EKG kontinyu — takiaritmia", "HR — hindari >120 bpm", "MAP — waspadai penurunan"],
    frequency: "Monitoring hemodinamik invasif direkomendasikan",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Takiaritmia (AF, VT)", "Memperburuk iskemia miokard pada dosis tinggi"],
    common: ["Takikardia", "Palpitasi", "Sakit kepala", "Nausea", "Hipotensi (efek β₂)"],
    antidote: null as any
  },
  interactions: {
    major: [
      { drug: "β-blocker", effect: "Antagonis efek inotropik — ↓ efektivitas dobutamin", management: "Jika harus diberikan, pertimbangkan dosis lebih tinggi atau agen lain" }
    ],
    moderate: [
      { drug: "Halothane / anestesi volatile", effect: "Potensiasi aritmia ventrikel" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: true,
  pump_drug_key: "dobutamin",
  evidence: [
    { ref_id: "ssc2024", note: "Tambahkan dobutamin jika disfungsi miokard + CO rendah pada sepsis" }
  ]
},

"milrinon": {
  name: "Milrinon",
  brand_id: ["Primacor", "Milrinon Hameln", "Milrinon Hospira"],
  brand_id_notes: "Tersedia terbatas di RS besar/jantung Indonesia. Ampul 10 mg/10 mL.",
  class: "Inhibitor Fosfodiesterase III (PDE3i)",
  subclass: "Inodilator",
  category: ["vasopressor"],
  common_in_id: false,
  common_in_id_note: "Ketersediaan terbatas — RS jantung dan ICU tersier",
  mechanism: "Inhibisi PDE3 → ↑cAMP intrasel → ↑kontraktilitas miokard (inotropik positif) + vasodilatasi sistemik dan pulmonal (↓SVR, ↓PVR). Mekanisme independen dari β-adrenergik — efektif pada pasien dengan β-blocker atau down-regulated β-receptor.",
  pkpd_type: null as any,
  pkpd_note: "Waktu paruh 2–3 jam. Ekskresi utama renal (85%). Akumulasi signifikan pada gagal ginjal.",
  spectrum: null as any,
  indications: {
    icu_primary: ["Syok kardiogenik dengan SVR tinggi refrakter dobutamin", "Gagal jantung akut dengan hipertensi pulmonal signifikan (↓PVR)", "Post-cardiac surgery low cardiac output syndrome"],
    icu_secondary: ["Pasien dengan β-blocker kronik — inotropik non-adrenergik", "Bridge ke LVAD atau transplantasi jantung"],
    local_guideline: "PERKI: Milrinon untuk syok kardiogenik refrakter atau hipertensi pulmonal berat",
    intl_guideline: "ESC HF 2021: Milrinon 0.375–0.75 mcg/kg/min pada syok kardiogenik, terutama bila pasien dalam β-blocker. AHA/ACC 2022 HF Guidelines: Level IIb."
  },
  contraindications: ["Stenosis aorta/pulmonal berat (obstruksi alur keluar)", "Hipovolemia tidak terkoreksi", "Syok hipovolemik"],
  precautions: ["Aritmia atrial dan ventrikel", "Hipotensi — vasodilatasi bermakna", "Gagal ginjal: akumulasi bermakna — kurangi dosis"],
  dosing: {
    standard: "0.375–0.75 mcg/kg/min IV kontinyu (tanpa loading di ICU)",
    range_low: "0.125–0.25 mcg/kg/min",
    range_high: "0.75 mcg/kg/min",
    max: "0.75 mcg/kg/min",
    loading: "50 mcg/kg selama 10 menit (sering dihindari di ICU — menyebabkan hipotensi akut)",
    maintenance: "0.375–0.5 mcg/kg/min, titrasi per CO dan MAP",
    route: ["IV"],
    dilution: "10 mg dalam 40 mL NS/D5W → 200 mcg/mL. Atau 20 mg dalam 80 mL → 200 mcg/mL.",
    rate: "(mcg/kg/min × BB × 60) / 200 = mL/jam",
    titration: "Tanpa loading — mulai maintenance langsung. Titrasi setiap 2–4 jam.",
    special_notes: "Hindari loading dose di ICU akut — menyebabkan hipotensi berat. Akumulasi bermakna pada eGFR <30."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal",            interval: "Normal", note: "" },
    r30_60: { dose: "0.25–0.375 mcg/kg/min", interval: "Normal", note: "Kurangi 25–50%" },
    r15_30: { dose: "0.2–0.3 mcg/kg/min",    interval: "Normal", note: "Kurangi 50%, monitor ketat" },
    r_lt15: { dose: "0.1–0.2 mcg/kg/min",    interval: "Normal", note: "Kurangi 75% — akumulasi bermakna" },
    hd:     { dose: "0.1 mcg/kg/min",         interval: "Normal", note: "Sedikit terdialisis. Monitor hipotensi." },
    crrt:   { dose: "0.2–0.25 mcg/kg/min",    interval: "Normal", note: "Monitoring ketat" },
    badge: "reduce",
    dialyzable: false,
    monitoring_renal: "Tanda akumulasi: hipotensi berat, aritmia. Periksa kreatinin setiap 12 jam."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal dengan monitoring", child_c: "Hati-hati — data terbatas",
    note: "Metabolisme: minimal hepatik (12%). Utama ekskresi renal."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Data terbatas",
    trimester_2: "Gunakan hanya emergensi",
    trimester_3: "Idem",
    labor_delivery: "Data tidak ada",
    fetal_risk: "Data tidak memadai",
    lactation: "Data tidak ada. Hindari menyusui.",
    lactation_note: null as any
  },
  monitoring: {
    efficacy: ["Cardiac index (target >2.2 L/min/m²)", "ScvO₂", "Tekanan pulmonal jika ada kateter PA", "Klirens laktat"],
    safety: ["EKG kontinyu — aritmia supraventrikel dan ventrikel", "MAP — waspadai hipotensi berat", "Kreatinin setiap 12–24 jam"],
    frequency: "Monitoring hemodinamik invasif direkomendasikan",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Aritmia ventrikel (VT/VF) — dosis tinggi", "Hipotensi berat terutama dengan loading"],
    common: ["Sakit kepala", "Hipotensi", "Aritmia supraventrikel (AF/flutter)"],
    antidote: null as any
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Furosemid", effect: "Presipitat jika dicampur dalam satu line — jangan campurkan" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "ssc2024", note: "Alternatif dobutamin pada pasien β-blocker atau down-regulated β-receptor" }
  ]
},

"levosimendan": {
  name: "Levosimendan",
  brand_id: ["Simdax"],
  brand_id_notes: "Simdax (Orion Pharma). Tersedia sangat terbatas di Indonesia. Harga tinggi.",
  class: "Sensitizer Kalsium",
  subclass: "Inodilator kalsium-sensitizing",
  category: ["vasopressor"],
  common_in_id: false,
  common_in_id_note: "Sangat terbatas — hanya RS tersier jantung Indonesia",
  mechanism: "Berikatan dengan troponin C → meningkatkan sensitivitas filamen kontraktil terhadap kalsium → ↑kontraktilitas tanpa ↑kalsium intrasel (tidak proaritmik). Membuka kanal KATP vaskular → vasodilatasi koroner dan sistemik (↓SVR, ↓PVR). Efek berlangsung 7–9 hari via metabolit aktif (OR-1896).",
  pkpd_type: null as any,
  pkpd_note: "Metabolit aktif OR-1896: t½ 70–80 jam. Efek berlanjut 7–9 hari setelah infus 24 jam — memungkinkan intermittent dosing.",
  spectrum: null as any,
  indications: {
    icu_primary: ["Syok kardiogenik refrakter dobutamin/milrinon", "Dekompensasi akut gagal jantung berat dengan CO rendah"],
    icu_secondary: ["Post-cardiac surgery LCOS (Low Cardiac Output Syndrome)", "Weaning dari ECMO/IABP", "Kardioproteksi peri-operatif (off-label)"],
    local_guideline: "Belum ada guideline lokal spesifik. Merujuk ESC.",
    intl_guideline: "ESC HF 2021: Levosimendan atau milrinon pada syok kardiogenik, terutama post-β-blocker. ESC/EACTS 2022 cardiac surgery: pertimbangkan levosimendan LCOS."
  },
  contraindications: ["Hipotensi berat (SBP <85 mmHg) — tanpa vasopressor backup", "Stenosis aorta/pulmonal berat", "Gagal ginjal berat (eGFR <30) — akumulasi metabolit"],
  precautions: ["Hipotensi — efek vasodilator kuat", "Aritmia — lebih jarang dari catecholamine tapi mungkin", "Hipokalemia meningkatkan risiko aritmia"],
  dosing: {
    standard: "0.05–0.2 mcg/kg/min IV selama 24 jam",
    range_low: "0.05–0.1 mcg/kg/min",
    range_high: "0.2 mcg/kg/min",
    max: "0.2 mcg/kg/min",
    loading: "6–12 mcg/kg IV selama 10 menit (sering dihindari di ICU kritis — hipotensi)",
    maintenance: "Infus 24 jam, kemudian stop — efek berlanjut 7–9 hari via OR-1896",
    route: ["IV"],
    dilution: "Simdax 2.5 mg/mL: encerkan ke 0.025–0.1 mg/mL dalam D5W atau NS.",
    rate: "0.1 mcg/kg/min × 70 kg × 60 / 250 mcg/mL = 1.68 mL/jam (contoh)",
    titration: "Mulai 0.05–0.1 mcg/kg/min. Naikan ke 0.2 bila toleransi baik setelah 4–6 jam.",
    special_notes: "Efek berlanjut 7–9 hari setelah infus 24 jam. Pertimbangkan intermittent weekly dosing pada HF refrakter."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal",             interval: "Normal", note: "" },
    r30_60: { dose: "Normal dengan monitoring", interval: "Normal", note: "Monitor hipotensi" },
    r15_30: { dose: "Kurangi 50%",        interval: "Normal", note: "Akumulasi OR-1896" },
    r_lt15: { dose: "Hindari",            interval: "—",      note: "Akumulasi metabolit aktif — risiko tinggi" },
    hd:     { dose: "Hindari",            interval: "—",      note: "Data tidak memadai" },
    crrt:   { dose: "Dosis rendah 0.05 mcg/kg/min", interval: "Normal", note: "Monitor ketat" },
    badge: "avoid",
    dialyzable: false,
    monitoring_renal: "Hindari pada eGFR <30. Akumulasi OR-1896 memperpanjang efek vasodilator."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Kurangi dosis", child_c: "Hindari — data sangat terbatas",
    note: "Metabolisme hepatik signifikan. Gangguan hati berat → akumulasi."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Kontraindikasi relatif",
    trimester_2: "Hanya emergensi mengancam jiwa",
    trimester_3: "Idem",
    labor_delivery: "Data tidak ada",
    fetal_risk: "Tidak diketahui",
    lactation: "Kontraindikasi — data tidak ada",
    lactation_note: null as any
  },
  monitoring: {
    efficacy: ["Cardiac index/CO", "ScvO₂", "Klirens laktat", "Perbaikan gejala HF selama 7–9 hari"],
    safety: ["MAP — hipotensi", "EKG — aritmia (AF)", "Kalium (koreksi hipokalemia sebelum mulai)"],
    frequency: "Monitoring hemodinamik invasif selama infus",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Hipotensi berat (terutama dengan loading)", "Aritmia supraventrikel (AF, atrial flutter)"],
    common: ["Sakit kepala", "Hipotensi", "Mual", "Hipokalemia"],
    antidote: null as any
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Nitrat", effect: "Potensiasi vasodilatasi → hipotensi berat" },
      { drug: "Diuretik", effect: "Hipokalemia meningkatkan risiko aritmia" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "ssc2024", note: "Alternatif inotropik pada syok kardiogenik refrakter" }
  ]
},

"fenilefrin": {
  name: "Fenilefrin (Phenylephrine)",
  brand_id: ["Neo-Synephrine", "Fenilefrin Hameln"],
  brand_id_notes: "Ketersediaan terbatas di Indonesia. Lebih umum di setting anestesi.",
  class: "Katekolamin sintetik",
  subclass: "Vasopressor selektif α₁",
  category: ["vasopressor"],
  common_in_id: false,
  common_in_id_note: "Tersedia terbatas — lebih umum di kamar operasi",
  mechanism: "Agonis selektif α₁ murni → vasokonstriksi perifer, ↑SVR, ↑MAP. TIDAK ada efek inotropik (β₁) → tidak meningkatkan HR, bahkan dapat menyebabkan bradikardia refleks. Pilihan pada takikardia dengan hipotensi.",
  pkpd_type: null as any,
  pkpd_note: null as any,
  spectrum: null as any,
  indications: {
    icu_primary: ["Hipotensi perioperatif/anestesi spinal", "Vasodilatory shock dengan takikardia (HR >120 bpm) dimana norepinefrin memperburuk takikardia"],
    icu_secondary: ["Hipotensi pada Fallot/RVOTO untuk meningkatkan SVR (mengurangi R→L shunt)", "SVT dengan hipotensi (refleks vagal via hipertensi akut)"],
    local_guideline: "Tidak ada guideline lokal spesifik. Merujuk SOAP/ASA.",
    intl_guideline: "SOAP 2017: Fenilefrin atau efedrin untuk hipotensi spinal pada SC. SSC tidak merekomendasikan sebagai first-line ICU."
  },
  contraindications: ["Bradikardi berat (efek refleks bradikardi)", "Syok kardiogenik dengan CO rendah (↑SVR → ↑afterload LV)", "Hipovolemia tidak terkoreksi"],
  precautions: ["Bradikardia refleks — siapkan atropin", "↑Afterload: buruk pada gagal jantung kiri berat", "Vasokonstriksi renal dan mesenterika"],
  dosing: {
    standard: "Bolus: 50–200 mcg IV; Infus: 0.5–6 mcg/kg/min",
    range_low: "0.5 mcg/kg/min",
    range_high: "6 mcg/kg/min",
    max: "6–10 mcg/kg/min",
    loading: "Bolus 50–100 mcg IV (hipotensi akut anestesi)",
    maintenance: "Infus 0.5–6 mcg/kg/min",
    route: ["IV"],
    dilution: "10 mg dalam 100 mL NS → 100 mcg/mL. Bolus: larutkan ke 100 mcg/mL.",
    rate: "(mcg/kg/min × BB × 60) / 100 = mL/jam",
    titration: "Titrasi per MAP. Waspadai bradikardia refleks.",
    special_notes: "Bradikardia refleks umum — siapkan atropin 0.5–1 mg. Tidak direkomendasikan sebagai vasopressor utama ICU."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "" },
    hd:     { dose: "Normal", interval: "Normal", note: "" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Urin output — vasokonstriksi renal mungkin terjadi"
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal",
    note: "Metabolisme oleh MAO. Tidak bergantung fungsi hati."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali emergensi",
    trimester_2: "Pilihan untuk hipotensi spinal pada operasi caesar",
    trimester_3: "Lebih disukai dari efedrin untuk SC (SOAP guideline)",
    labor_delivery: "Aman untuk hipotensi spinal SC",
    fetal_risk: "Bradikardia fetal pada dosis tinggi",
    lactation: "Data tidak ada",
    lactation_note: null as any
  },
  monitoring: {
    efficacy: ["MAP target", "HR — bradikardia refleks"],
    safety: ["EKG", "Tanda hipoperfusi CO rendah"],
    frequency: "Monitoring hemodinamik",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Bradikardia refleks berat (HR <40) bila dosis bolus berlebihan"],
    common: ["Bradikardia", "Hipertensi", "Sakit kepala", "Mual"],
    antidote: "Bradikardia: Atropin 0.5–1 mg IV"
  },
  interactions: {
    major: [
      { drug: "MAO Inhibitor", effect: "Krisis hipertensi", management: "Kontraindikasi" }
    ],
    moderate: []
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "ssc2024", note: "Tidak direkomendasikan first-line ICU; pertimbangkan pada takikardia dengan hipotensi" }
  ]
}

};
