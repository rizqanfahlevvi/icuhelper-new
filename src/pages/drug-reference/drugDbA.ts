import { DrugDatabase } from './types';

export const ICU_DRUGS: DrugDatabase = {

"norepinefrin": {
  name: "Norepinefrin",
  brand_id: ["Vascon", "Norepinefrin Fresenius Kabi", "Norepinefrin Hameln"],
  brand_id_notes: "Vascon paling umum di Indonesia. Fresenius tersedia di RS besar.",
  class: "Katekolamin",
  subclass: "Vasopressor adrenergik",
  category: ["vasopressor"],
  common_in_id: true,
  common_in_id_note: "Tersedia luas di ICU seluruh Indonesia",
  mechanism: "Agonis kuat α₁ (vasokonstriksi perifer, ↑SVR) dan agonis moderat β₁ (↑kontraktilitas, ↑HR). Efek β₂ minimal. Net effect: ↑MAP dengan preservasi cardiac output.",
  pkpd_type: null as any,
  pkpd_note: null as any,
  spectrum: null as any,
  indications: {
    icu_primary: ["Syok septik — first-line vasopressor (MAP target ≥65 mmHg)", "Syok distributif refrakter cairan"],
    icu_secondary: ["Syok kardiogenik dengan vasodilatasi (kombinasi dengan dobutamin)", "Syok vasoplegi post-cardiac surgery"],
    local_guideline: "PERDICI/PAPDI Panduan Sepsis 2022: Norepinefrin lini pertama jika MAP <65 setelah resusitasi cairan 30 mL/kg",
    intl_guideline: "SSC 2024: Norepinefrin first-line. Target MAP 65 mmHg pada sepsis, 80–85 pada TBI."
  },
  contraindications: ["Hipovolemia yang belum dikoreksi (relatif)", "Hipersensitivitas terhadap sulfit (beberapa formulasi)"],
  precautions: ["Iskemia mesenterika pada dosis tinggi", "Aritmia pada pasien dengan penyakit jantung iskemik", "Ekstravasasi menyebabkan nekrosis jaringan"],
  dosing: {
    standard: "0.01–0.5 mcg/kg/min IV kontinyu",
    range_low: "0.01 mcg/kg/min",
    range_high: "2–3 mcg/kg/min (refrakter)",
    max: "3 mcg/kg/min (dosis lebih tinggi: diskusikan dengan spesialis)",
    loading: null as any,
    maintenance: "Titrasi setiap 5–10 menit berdasar MAP",
    route: ["IV"],
    dilution: "4 mg dalam 46 mL NS/D5W → 80 mcg/mL. Atau 8 mg dalam 92 mL → 80 mcg/mL (syringe 50 mL).",
    rate: "Hitung: (mcg/kg/min × BB × 60) / konsentrasi (mcg/mL) = mL/jam",
    titration: "Naikan 0.02–0.05 mcg/kg/min setiap 5–10 menit sampai MAP ≥65 mmHg. De-eskalasi setiap 2–4 jam jika stabil.",
    special_notes: "HANYA via vena sentral (CVC/CVP). Vena perifer: maksimum 4 jam darurat, konsentrasi ≤0.1 mg/mL."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "" },
    hd:     { dose: "Normal", interval: "Normal", note: "Tidak terdialisis secara signifikan" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Urin output (target >0.5 mL/kg/jam) — vasokonstriksi dapat ↓ perfusi renal"
  },
  hepatic_adjustment: {
    child_a: "Normal",
    child_b: "Normal dengan monitoring ketat",
    child_c: "Gunakan dosis minimum efektif; risiko iskemia hepatik ↑",
    note: "Metabolisme: uptake neuronal dan MAO/COMT. Tidak bergantung fungsi hati."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Data terbatas. Hindari kecuali life-threatening.",
    trimester_2: "Dapat digunakan pada syok mengancam jiwa — manfaat >> risiko",
    trimester_3: "Idem. Monitor fetal heart rate secara kontinyu.",
    labor_delivery: "Vasokonstriksi uterus dapat ↓ perfusi utero-plasenta.",
    fetal_risk: "Vasokonstriksi uterus → risiko fetal distress pada dosis tinggi",
    lactation: "Data tidak ada. Hindari menyusui selama penggunaan.",
    lactation_note: "Waktu paruh pendek (~2 menit); jika harus menyusui, tunggu 4–6 jam setelah stop."
  },
  monitoring: {
    efficacy: ["MAP setiap 5–15 menit selama titrasi", "Laktat arteri setiap 2–4 jam (target <2 mmol/L)", "Urin output setiap jam (target >0.5 mL/kg/jam)"],
    safety: ["Tanda iskemia perifer: jari pucat, mottled skin", "EKG: aritmia", "Tanda ekstravasasi di area infus"],
    frequency: "Continuous hemodynamic monitoring",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Iskemia distal (jari tangan/kaki, hidung) — terutama dosis tinggi", "Aritmia ventrikel", "Nekrosis jaringan berat akibat ekstravasasi"],
    common: ["Hipertensi", "Bradikardi refleks", "Sakit kepala", "Ansietas"],
    antidote: "Ekstravasasi: Fentolamin 5 mg dilarutkan dalam 9 mL NS → injeksi subkutan di area ekstravasasi"
  },
  interactions: {
    major: [
      { drug: "MAO Inhibitor", effect: "Krisis hipertensi fatal", management: "Kontraindikasi absolut. Tunggu 14 hari setelah stop MAOI." }
    ],
    moderate: [
      { drug: "β-blocker", effect: "Blok efek β₁ → hipertensi tanpa kompensasi HR" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: true,
  pump_drug_key: "norepinefrin",
  evidence: [
    { ref_id: "ssc2024", note: "First-line vasopressor syok septik, MAP ≥65" }
  ]
},

"meropenem": {
  name: "Meropenem",
  brand_id: ["Meronem", "Meropenem Dexa Medica", "Granem", "Meropenem Kalbe"],
  brand_id_notes: "Meronem (AstraZeneca) brand originator. Generik lokal lebih umum di RS pemerintah.",
  class: "Antibiotik β-laktam",
  subclass: "Karbapenem",
  category: ["antibiotik"],
  common_in_id: true,
  common_in_id_note: "Tersedia di seluruh RS Indonesia. Termasuk obat formularium nasional.",
  mechanism: "Inhibisi sintesis dinding sel bakteri melalui ikatan dengan Penicillin-Binding Proteins (PBP). Lebih stabil terhadap DHP-1 renal dibanding imipenem.",
  pkpd_type: "time_dependent",
  pkpd_note: "Target T>MIC ≥40% (bakteriostatik) hingga ≥100% (bakterisidal optimal). Extended infusion 3–4 jam untuk patogen resisten.",
  spectrum: {
    gram_pos: "Streptokokus (baik), Enterokokus (moderat), Stafilokokus sensitif penisilin",
    gram_neg: "Sangat baik: Enterobacteriaceae (termasuk ESBL+), Pseudomonas aeruginosa (variabel)",
    anaerob: "Baik: Bacteroides fragilis dan anaerob lainnya",
    mrsa: false,
    vre: false,
    esbl: true,
    pseudomonas: true,
    acinetobacter: false,
    fungi: null as any,
    virus: null as any
  },
  indications: {
    icu_primary: ["Sepsis berat/syok septik sumber tidak jelas (empiris)", "VAP/HAP berat dengan risiko Pseudomonas atau MDR", "Infeksi intra-abdominal kompleks"],
    icu_secondary: ["Febrile neutropenia (high-risk)", "Infeksi ESBL-producing Enterobacteriaceae", "Meningitis bakteri (dosis tinggi 2g/8jam)"],
    local_guideline: "PERDICI 2022: Lini kedua/empiris berat jika risiko MDR. Panduan VAP PERDICI 2021.",
    intl_guideline: "IDSA HAP/VAP 2016: Karbapenem untuk late-onset VAP atau risiko MDR. ESCMID 2023: Extended infusion direkomendasikan untuk MIC tinggi."
  },
  contraindications: ["Hipersensitivitas terhadap karbapenem", "Riwayat anafilaksis terhadap penisilin (risiko cross-reaktivitas ~1%)"],
  precautions: ["Risiko kejang meningkat pada dosis tinggi + eGFR rendah", "Penggunaan bersama asam valproat: ↓ kadar valproat → kejang"],
  dosing: {
    standard: "1g IV setiap 8 jam (infeksi berat)",
    range_low: "500mg IV setiap 8 jam",
    range_high: "2g IV setiap 8 jam (Pseudomonas, meningitis)",
    max: "2g setiap 8 jam (6g/hari)",
    loading: null as any,
    maintenance: "Dosis standar sesuai indikasi",
    route: ["IV"],
    dilution: "500mg atau 1g dalam 50–100 mL NS. Stabil 4–8 jam suhu ruang.",
    rate: "Infus standar: 15–30 menit. Extended infusion: 3–4 jam untuk MIC >2 mg/L.",
    titration: null as any,
    special_notes: "Extended infusion: larutkan dalam 100–250 mL NS. Superior pada Pseudomonas/Acinetobacter dengan MIC borderline."
  },
  renal_adjustment: {
    ge60:   { dose: "1–2g",  interval: "q8j",  route: null as any, note: "Dosis penuh" },
    r30_60: { dose: "1g",    interval: "q12j", route: null as any, note: "Kurangi frekuensi" },
    r15_30: { dose: "500mg", interval: "q12j", route: "Pertimbangkan prolonged infusion 3–4j (T>MIC optimal pada eGFR rendah dengan kuman curiga resisten)", note: "Kurangi dosis dan frekuensi" },
    r_lt15: { dose: "500mg", interval: "q24j", route: null as any, note: "Monitor neurotoksisitas ketat" },
    hd:     { dose: "500mg", interval: "q24j", route: "Berikan SETELAH sesi HD", note: "Suplementasi 500mg post-HD. Terdialisis bermakna." },
    crrt:   { dose: "500mg–1g", interval: "q12j", route: null as any, note: "Sesuaikan dengan effluent rate CRRT." },
    badge: "adjust",
    dialyzable: true,
    monitoring_renal: "Tanda neurotoksisitas (myoklonus, kejang) jika eGFR <30 dan dosis tidak diturunkan"
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal — ekskresi utama renal",
    note: "Tidak memerlukan penyesuaian dosis pada gangguan fungsi hati."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Data hewan: tidak teratogenik. Gunakan jika indikasi kuat.",
    trimester_2: "Dapat digunakan.",
    trimester_3: "Dapat digunakan.",
    labor_delivery: "Dapat digunakan pada infeksi berat intrapartum",
    fetal_risk: "Tidak ada bukti teratogenisitas pada dosis terapeutik",
    lactation: "Diekskresikan ke ASI dalam jumlah kecil (<0.2%). Umumnya aman.",
    lactation_note: "Monitor bayi untuk diare atau rash."
  },
  monitoring: {
    efficacy: ["Suhu dan tanda klinis setiap 12–24 jam", "Procalcitonin (PCT) setiap 48–72 jam", "Hasil kultur dan sensitivitas"],
    safety: ["Fungsi ginjal (kreatinin) setiap 48 jam", "Tanda neurotoksisitas jika eGFR rendah", "Kadar valproat jika pakai antikonvulsan"],
    frequency: "Kultur darah sebelum mulai. Evaluasi klinis 48–72 jam.",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Kejang (dosis tinggi + eGFR rendah)", "Anafilaksis (jarang, <0.01%)"],
    common: ["Diare / C. difficile colitis", "↑ LFT transien", "Tromboflebitis lokasi infus"],
    antidote: null as any
  },
  interactions: {
    major: [
      { drug: "Asam Valproat", effect: "Meropenem ↓ kadar valproat 50–100% → risiko kejang breakthrough", management: "Hindari kombinasi jika memungkinkan. Monitor kadar valproat." }
    ],
    moderate: []
  },
  stewardship: {
    empiric_sources: ["Sepsis berat/syok septik", "VAP late-onset (≥5 hari)", "Infeksi intra-abdominal kompleks"],
    deescalation_to: ["seftriakson", "ampi_sulbaktam"],
    duration_standard: "7",
    duration_short: "5",
    duration_note: "VAP: 7 hari. Infeksi abdomen terkontrol: 4–5 hari.",
    stop_criteria: "PCT turun >80% dari baseline, atau absolut <0.5 ng/mL + perbaikan klinis",
    avoid_for: ["CAP ringan-sedang tanpa risiko MDR", "Profilaksis operasi"],
    local_pattern_note: "Resistensi Pseudomonas terhadap karbapenem di ICU Indonesia: 20–40%. Periksa antibiogram lokal."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "ssc2024", note: "Antibiotik empiris sepsis berat dalam 1 jam" }
  ]
},

"kcl_konsentrat": {
  name: "Kalium Klorida (KCl) 7.46% — Konsentrat",
  brand_id: ["KCl 7.46% Otsuka", "Kalium Klorida Ikhapharmindo", "KCl Dexa"],
  brand_id_notes: "Tersedia luas. WAJIB diencerkan — TIDAK BOLEH diberikan undiluted.",
  class: "Elektrolit",
  subclass: "Suplemen kalium",
  category: ["high_alert"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua RS Indonesia. Termasuk daftar obat high-alert ISMP.",
  mechanism: "Menggantikan defisit kalium. Esensial untuk potensial aksi membran dan kontraksi otot.",
  pkpd_type: null as any,
  pkpd_note: "Setiap 1 mEq/L penurunan K serum ≈ defisit 100–200 mEq total body K.",
  spectrum: null as any,
  indications: {
    icu_primary: ["Hipokalemia sedang (K 2.5–3.0 mEq/L) dengan gejala atau EKG changes", "Hipokalemia berat (K <2.5 mEq/L) — IV wajib"],
    icu_secondary: ["Hipokalemia refrakter (koreksi setelah Mg dikoreksi terlebih dahulu)", "Pemeliharaan K pada pasien TPN"],
    local_guideline: "PERDICI: Koreksi K IV via CVC. Rate aman ≤20 mEq/jam sentral, ≤10 mEq/jam perifer.",
    intl_guideline: "Kraft MD. AJHSP 2005: Panduan komprehensif koreksi elektrolit ICU."
  },
  contraindications: ["Hiperkalemia (K ≥5.0 mEq/L)", "Anuria/oliguria berat tanpa monitoring ketat"],
  precautions: ["Gagal ginjal: akumulasi K — kurangi dosis 50%", "Digitalis: hipokalemia meningkatkan toksisitas digoksin"],
  dosing: {
    standard: "10–20 mEq dalam 100 mL NS, infus 1–2 jam",
    range_low: "10 mEq/100 mL NS",
    range_high: "40 mEq dalam 200 mL NS (via CVC, emergensi)",
    max: "Sentral: 20–40 mEq/jam. Perifer: 10 mEq/jam, konsentrasi ≤40 mEq/L",
    loading: null as any,
    maintenance: "Sesuai hasil K serial. Target K 3.5–5.0 mEq/L.",
    route: ["IV"],
    dilution: "WAJIB diencerkan. KCl 7.46% = 1 mEq/mL. Encerkan ke ≤80 mEq/L (CVC) atau ≤40 mEq/L (perifer).",
    rate: "Sentral: maks 20 mEq/jam dengan monitoring EKG. Perifer: maks 10 mEq/jam.",
    titration: "Cek K serum setiap 2 jam selama koreksi aktif. Stop jika K ≥3.8 mEq/L.",
    special_notes: "Koreksi Mg DULU jika Mg <1.7 mg/dL — hipokalemia refrakter tanpa normomagnesia."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Kurangi 25–50%", interval: "Monitor lebih ketat", note: "Cek K setiap 1–2 jam" },
    r15_30: { dose: "Kurangi 50%", interval: "Monitor setiap 1 jam", note: "Risiko akumulasi K tinggi" },
    r_lt15: { dose: "Dosis minimal 5–10 mEq dengan monitoring EKG kontinyu", interval: "Cek K setiap 30–60 menit", note: "Pertimbangkan RRT jika K sulit dikontrol" },
    hd:     { dose: "Hindari jika K >4.5 sebelum HD", interval: "Post-HD: monitor K", note: "HD menurunkan K secara efektif" },
    crrt:   { dose: "Monitor K setiap 4–6 jam", interval: "Mungkin perlu suplementasi rutin", note: "Dialysate K-free dapat menyebabkan hipokalemia" },
    badge: "reduce",
    dialyzable: true,
    monitoring_renal: "EKG kontinyu, K serum setiap 1–2 jam, waspadai hiperkalemia"
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Hati-hati — sirosis sering disertai gangguan K",
    note: "Tidak dimetabolisme hepatik."
  },
  pregnancy: {
    fda_category: "A",
    trimester_1: "Aman — suplemen esensial",
    trimester_2: "Aman",
    trimester_3: "Aman — monitor K normal",
    labor_delivery: "Aman pada kadar fisiologis",
    fetal_risk: "Tidak ada risiko pada dosis terapeutik",
    lactation: "Aman — K adalah komponen normal ASI",
    lactation_note: "Tidak memerlukan pembatasan menyusui."
  },
  monitoring: {
    efficacy: ["K serum setiap 2 jam selama koreksi aktif", "Gejala hipokalemia: kelemahan otot, kram, palpitasi"],
    safety: ["EKG kontinyu (lead II) selama koreksi K >10 mEq/jam", "Tanda hiperkalemia: peaked T wave, PR prolongasi, wide QRS"],
    frequency: "Cek K serum setiap 2 jam selama infus. EKG sebelum dan sesudah koreksi.",
    therapeutic_range: "Target K serum 3.5–5.0 mEq/L (ICU: 4.0–4.5 lebih aman)"
  },
  adverse_effects: {
    critical: ["Hiperkalemia → cardiac arrest (VF/asistol) jika overdosis atau terlalu cepat", "Cardiac arrest dari pemberian bolus undiluted"],
    common: ["Iritasi vena (flebitis) jika perifer", "Rasa terbakar di lokasi infus"],
    antidote: "Hiperkalemia: Kalsium glukonat 10% 10–20 mL IV + Insulin 10 unit + D50 + pertimbangkan HD"
  },
  interactions: {
    major: [
      { drug: "Digoksin", effect: "Hipokalemia meningkatkan toksisitas digoksin", management: "Jaga K ≥4.0 mEq/L pada pasien digoksin" },
      { drug: "ACE Inhibitor / ARB / Spironolakton", effect: "↑ risiko hiperkalemia", management: "Monitor K ketat, kurangi dosis koreksi" }
    ],
    moderate: [
      { drug: "NSAID", effect: "↓ ekskresi K renal → risiko akumulasi" }
    ]
  },
  stewardship: null as any,
  high_alert: true,
  high_alert_warnings: [
    "⛔ TIDAK BOLEH diberikan undiluted/bolus — menyebabkan CARDIAC ARREST",
    "⛔ HANYA via vena sentral jika >40 mEq/L atau rate >10 mEq/jam",
    "⛔ Selalu encerkan dalam minimal 100 mL sebelum diberikan",
    "⚠ Monitor EKG kontinyu jika rate >10 mEq/jam",
    "⚠ Koreksi Mg terlebih dahulu jika hipokalemia refrakter"
  ],
  high_alert_protocol: "Verifikasi ganda (double-check) oleh 2 perawat sebelum pemberian. Label merah pada infus.",
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "kraft2005", note: "Panduan koreksi elektrolit ICU dewasa komprehensif" }
  ]
},

"epinefrin": {
  name: "Epinefrin (Adrenalin)",
  brand_id: ["Adrenalin", "Epinefrin Hameln", "Epinefrin Fahrenheit"],
  brand_id_notes: "Ampul 1 mg/mL (1:1000). Sering tersedia di semua RS.",
  class: "Katekolamin",
  subclass: "Vasopressor & inotropik adrenergik",
  category: ["vasopressor"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua ICU dan UGD Indonesia",
  mechanism: "Agonis kuat α₁ (vasokonstriksi, ↑SVR), β₁ (↑HR, ↑kontraktilitas), β₂ (bronkodilatasi, vasodilatasi muskuloskeletal). Dosis rendah (<0.1 mcg/kg/min): dominan β. Dosis tinggi: dominan α.",
  pkpd_type: null as any,
  pkpd_note: null as any,
  spectrum: null as any,
  indications: {
    icu_primary: ["Syok anafilaktik — lini pertama (IM 0.3–0.5 mg)", "Henti jantung (VF/pVT/PEA/asistol) — ACLS"],
    icu_secondary: ["Syok septik refrakter norepinefrin (add-on)", "Syok kardiogenik dengan cardiac output rendah", "Bronkospasme berat refrakter inhalasi"],
    local_guideline: "AHA ACLS 2020: Epinefrin 1 mg IV/IO setiap 3–5 menit pada henti jantung",
    intl_guideline: "SSC 2024: Epinefrin sebagai vasopressor ke-2 jika norepinefrin tidak cukup. WAO 2020: IM epinefrin lini pertama anafilaksis."
  },
  contraindications: ["Tidak ada kontraindikasi absolut pada kondisi mengancam jiwa", "Hipertiroidisme berat (relatif)", "Feokromositoma (relatif)"],
  precautions: ["Aritmia berat — monitor EKG kontinyu", "Iskemia miokard — hindari takikardia berlebih", "Hipertensi berat"],
  dosing: {
    standard: "Infus ICU: 0.01–0.5 mcg/kg/min IV kontinyu",
    range_low: "0.01 mcg/kg/min",
    range_high: "1 mcg/kg/min (refrakter)",
    max: "Tidak ada batas mutlak — titrasi per respons",
    loading: "Anafilaksis: 0.3–0.5 mg IM paha lateral (1:1000). ACLS: 1 mg IV/IO bolus.",
    maintenance: "Titrasi infus setiap 5–10 menit",
    route: ["IV", "IM", "IO", "Intratrakheal (darurat)"],
    dilution: "1 mg dalam 49 mL NS → 20 mcg/mL. Atau 4 mg dalam 46 mL → 80 mcg/mL.",
    rate: "(mcg/kg/min × BB × 60) / konsentrasi = mL/jam",
    titration: "Titrasi bertahap. MAP target ≥65 mmHg.",
    special_notes: "HANYA via CVC untuk infus kontinu. IM paha lateral > IM lengan pada anafilaksis."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "" },
    hd:     { dose: "Normal", interval: "Normal", note: "Tidak terdialisis" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Monitor urin output — vasokonstriksi dapat ↓ perfusi renal"
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal",
    note: "Metabolisme: MAO dan COMT. Tidak bergantung fungsi hati."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali mengancam jiwa",
    trimester_2: "Gunakan jika indikasi anafilaksis/henti jantung",
    trimester_3: "Idem — manfaat >> risiko pada kondisi kritis",
    labor_delivery: "Dapat menyebabkan vasokonstriksi uterus",
    fetal_risk: "Vasokonstriksi uterus, aritmia fetal pada dosis tinggi",
    lactation: "Tidak ada data. Hindari menyusui selama penggunaan.",
    lactation_note: "Waktu paruh sangat pendek (~2 menit)"
  },
  monitoring: {
    efficacy: ["MAP setiap 5 menit selama titrasi", "HR kontinyu — hindari takikardia >120 bpm jika bisa"],
    safety: ["EKG kontinyu — aritmia", "Tanda iskemia perifer", "Glukosa darah — epinefrin → hiperglikemia"],
    frequency: "Monitoring hemodinamik kontinyu",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Takiaritmia berat (AF, VT)", "Iskemia miokard", "Nekrosis akibat ekstravasasi"],
    common: ["Takikardia", "Hipertensi", "Ansietas", "Tremor", "Hiperglikemia"],
    antidote: "Ekstravasasi: Fentolamin 5 mg subkutan di area ekstravasasi"
  },
  interactions: {
    major: [
      { drug: "MAO Inhibitor", effect: "Krisis hipertensi fatal", management: "Kontraindikasi absolut" },
      { drug: "β-blocker non-selektif", effect: "Hipertensi paradoksal + bradikardia berat", management: "Pertimbangkan α-blocker terlebih dahulu" }
    ],
    moderate: [
      { drug: "Antidepresan trisiklik", effect: "Potensiasi efek simpatomimetik" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: true,
  pump_drug_key: "epinefrin",
  evidence: [
    { ref_id: "ssc2024", note: "Vasopressor ke-2 syok septik refrakter norepinefrin" }
  ]
}

};
