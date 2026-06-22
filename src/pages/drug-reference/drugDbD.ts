import { DrugDatabase } from './types';

export const ICU_DRUGS: DrugDatabase = {

"sisatrakurium": {
  name: "Sisatrakurium (Cisatracurium)",
  brand_id: ["Nimbex"],
  brand_id_notes: "Nimbex (AstraZeneca/GSK). Tersedia di RS besar Indonesia. Harga lebih tinggi dari rokuronium.",
  class: "Neuromuskular bloker",
  subclass: "Benzilisokuinolin NDNMB non-depolarizing",
  category: ["nmb"],
  common_in_id: true,
  common_in_id_note: "Tersedia di RS ICU Indonesia. Pilihan NMB untuk ARDS berat.",
  mechanism: "Blok kompetitif reseptor nikotinik asetilkolin di neuromuscular junction. UNIK: Eliminasi via degradasi Hofmann (spontan, pH dan suhu dependen) + hidrolisis ester enzim — TIDAK tergantung fungsi hati atau ginjal. Tidak melepaskan histamin.",
  pkpd_type: null as any,
  pkpd_note: "Onset 2–3 menit. Durasi 45–75 menit per bolus. Metabolit laudanosin inaktif (tidak toksik pada dosis ICU).",
  spectrum: null as any,
  indications: {
    icu_primary: ["ARDS berat (P/F ratio <150) — fasilitasi lung-protective ventilation", "Fasilitasi intubasi darurat dan sinkronisasi ventilator awal"],
    icu_secondary: ["Status asmatikus refrakter memerlukan ventilasi terkontrol penuh", "Hipotermia terapeutik post-cardiac arrest (mencegah shivering)"],
    local_guideline: "PERDICI: NMB pada ARDS berat (P/F <150) dalam 48 jam pertama. Protokol TOF monitoring.",
    intl_guideline: "ACURASYS trial (Papazian 2010, NEJM): CIS 48 jam pada ARDS berat ↓ 90-hari mortalitas. RE-EVAL (Moss 2019, NEJM): tidak konfirmasi manfaat jika sedasi dalam sudah adekuat. Panduan saat ini: pertimbangkan NMB pada ARDS berat jika dyssynchrony persisten."
  },
  contraindications: ["Hipersensitivitas terhadap sisatrakurium", "TANPA sedasi/analgesia adekuat (KONTRAINDIKASI ETIS — pasien conscious paralysis)"],
  precautions: ["SELALU berikan sedasi/analgesia adekuat sebelum dan selama NMB", "TOF monitoring wajib untuk titrasi dosis", "ICU-acquired weakness (ICUAW) — risiko pada penggunaan >48 jam"],
  dosing: {
    standard: "Infus: 0.5–3 mcg/kg/min IV kontinyu",
    range_low: "0.5–1 mcg/kg/min",
    range_high: "3 mcg/kg/min",
    max: "10 mcg/kg/min (jarang)",
    loading: "0.15–0.2 mg/kg IV bolus untuk intubasi (onset 2–3 menit)",
    maintenance: "Infus 0.5–3 mcg/kg/min, titrasi per TOF",
    route: ["IV"],
    dilution: "200 mg dalam 200 mL NS → 1 mg/mL. Atau 100 mg dalam 100 mL → 1 mg/mL.",
    rate: "(mcg/kg/min × BB × 60) / 1000 = mL/jam (konsentrasi 1 mg/mL)",
    titration: "TOF (Train-of-Four): target 1–2/4 twitches. Kurangi dosis jika TOF 0/4.",
    special_notes: "WAJIB monitoring TOF setiap 4–8 jam. SELALU pastikan sedasi adekuat. Re-evaluasi kebutuhan NMB setiap 24–48 jam."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Degradasi Hofmann — aman" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "AMAN — tidak tergantung ginjal" },
    hd:     { dose: "Normal", interval: "Normal", note: "Degradasi Hofmann independen dialisis" },
    crrt:   { dose: "Normal", interval: "Normal", note: "Aman" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Sisatrakurium AMAN pada gagal ginjal — pilihan NMB terbaik pada AKI/CKD"
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal — degradasi Hofmann tidak hepatik",
    note: "TIDAK memerlukan penyesuaian pada gagal hati apapun derajatnya."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Data hewan aman",
    trimester_2: "Dapat digunakan jika diperlukan",
    trimester_3: "Dapat digunakan pada SC emergensi",
    labor_delivery: "Dapat digunakan dengan monitoring neonatus",
    fetal_risk: "NMB dapat melewati plasenta — monitor neonatus",
    lactation: "Data tidak ada. Kemungkinan aman — t½ pendek.",
    lactation_note: null as any
  },
  monitoring: {
    efficacy: ["TOF (Train-of-Four) setiap 4–8 jam — target 1–2/4", "Sinkronisasi ventilator", "Parameter ARDS: P/F ratio, driving pressure"],
    safety: ["Sedasi adekuat setiap 2 jam (RASS/BIS)", "Tanda ICUAW setelah stop NMB", "Suhu tubuh (Hofmann degrades lebih lambat pada hipotermia)"],
    frequency: "TOF monitoring setiap 4–8 jam. Re-evaluasi NMB setiap 24–48 jam.",
    therapeutic_range: "TOF: target 1–2/4 (tidak 0/4)"
  },
  adverse_effects: {
    critical: ["ICU-acquired weakness (ICUAW) — terutama penggunaan >48 jam dengan kortikosteroid", "Conscious paralysis jika sedasi tidak adekuat (etis berbahaya)"],
    common: ["Sedikit pelepasan histamin (sangat minimal vs atrakurium)", "Bradikardi (efek vagotonik ringan)"],
    antidote: "Sugammadex TIDAK efektif (bukan steroidal NMB). Neostigmin 0.04 mg/kg + atropin 0.02 mg/kg — efek reversal terbatas."
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Aminoglikosida", effect: "Potensiasi blok neuromuskular" },
      { drug: "Magnesium sulfat", effect: "Potensiasi blok — kurangi dosis NMB" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "papazian2010", note: "ACURASYS: CIS 48 jam pada ARDS berat P/F <150 — manfaat mortalitas (namun RE-EVAL 2019 tidak konfirmasi)" }
  ]
},

"rokuronium_icu": {
  name: "Rokuronium (ICU)",
  brand_id: ["Esmeron", "Rokuronium Hameln", "Rokuronium Fresenius"],
  brand_id_notes: "Esmeron (MSD/Merck) originator. Generik tersedia. Paling umum untuk RSI di Indonesia.",
  class: "Neuromuskular bloker",
  subclass: "Aminosteroid NDNMB non-depolarizing",
  category: ["nmb"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua ICU dan OK Indonesia. Pilihan RSI.",
  mechanism: "Blok kompetitif reseptor nikotinik asetilkolin. Onset cepat (60–90 detik pada dosis RSI). Metabolisme hepatik dan ekskresi bilier. Reversal cepat dengan sugammadex (enkapsulasi langsung).",
  pkpd_type: null as any,
  pkpd_note: "Onset RSI: 60–90 detik. Durasi intubasi 30–60 menit. Pada gagal ginjal: durasi memanjang via akumulasi.",
  spectrum: null as any,
  indications: {
    icu_primary: ["RSI (Rapid Sequence Intubation) — pilihan utama menggantikan suksinilkolin jika ada kontraindikasi", "Fasilitasi intubasi elektif ICU"],
    icu_secondary: ["Infus NMB pada ARDS berat (alternatif sisatrakurium jika tidak tersedia)", "Fasilitasi prosedur ICU memerlukan immobilisasi"],
    local_guideline: "PERDICI: Rokuronium 1.2 mg/kg untuk RSI (setara suksinilkolin, terutama jika suksinilkolin kontraindikasi).",
    intl_guideline: "Rokuronium 1.2 mg/kg + sugammadex 16 mg/kg untuk reversal cepat RSI jika intubasi gagal. ACEP: Rokuronium setara suksinilkolin untuk RSI."
  },
  contraindications: ["Hipersensitivitas terhadap rokuronium", "TANPA sedasi/analgesia adekuat untuk infus ICU"],
  precautions: ["Akumulasi pada gagal ginjal — durasi memanjang", "Akumulasi pada gagal hati — durasi memanjang", "ICUAW pada infus berkepanjangan", "Selalu sediakan sugammadex jika RSI"],
  dosing: {
    standard: "RSI: 1.2 mg/kg IV bolus. Infus ICU: 0.3–0.6 mg/kg/jam",
    range_low: "Intubasi standar: 0.6 mg/kg",
    range_high: "RSI: 1.2 mg/kg (onset setara suksinilkolin)",
    max: "1.2 mg/kg untuk RSI",
    loading: "RSI: 1.2 mg/kg IV bolus cepat. Intubasi standar: 0.6 mg/kg.",
    maintenance: "Infus 0.3–0.6 mg/kg/jam titrasi per TOF",
    route: ["IV"],
    dilution: "Infus: 200 mg dalam 40 mL NS → 5 mg/mL.",
    rate: "(mg/kg/jam × BB) / 5 = mL/jam",
    titration: "Titrasi per TOF. Target 1–2/4.",
    special_notes: "Sugammadex 16 mg/kg tersedia sebagai reversal CEPAT jika RSI gagal/cannot intubate. WAJIB sediakan sugammadex sebelum RSI."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal bolus RSI", interval: "Interval infus ↑", note: "Durasi memanjang 20–30%" },
    r15_30: { dose: "Normal bolus RSI", interval: "Kurangi infus 25–50%", note: "Akumulasi bermakna" },
    r_lt15: { dose: "Normal bolus RSI", interval: "Kurangi infus 50%, monitor TOF ketat", note: "Durasi bolus bisa 2–3× normal" },
    hd:     { dose: "Normal bolus RSI", interval: "Monitor TOF ketat", note: "HD tidak efektif mengeluarkan rokuronium" },
    crrt:   { dose: "Normal bolus RSI", interval: "Monitor TOF", note: "" },
    badge: "adjust",
    dialyzable: false,
    monitoring_renal: "TOF wajib setiap 4 jam pada gagal ginjal — durasi memanjang tak terduga"
  },
  hepatic_adjustment: {
    child_a: "Normal bolus; kurangi infus 25%", child_b: "Kurangi infus 50%", child_c: "Bolus hanya jika diperlukan; hindari infus — akumulasi dramatis",
    note: "Ekskresi bilier hepatik utama. Sirosis → clearance ↓ signifikan."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali RSI emergensi",
    trimester_2: "RSI emergensi jika diperlukan",
    trimester_3: "Dapat digunakan pada SC emergensi (RSI)",
    labor_delivery: "Dapat melewati plasenta — monitor neonatus",
    fetal_risk: "Relaksasi otot neonatus transien",
    lactation: "Data tidak ada. Kemungkinan aman — t½ pendek.",
    lactation_note: null as any
  },
  monitoring: {
    efficacy: ["TOF setiap 4–8 jam untuk infus ICU", "Kondisi intubasi untuk RSI"],
    safety: ["Sedasi adekuat selama NMB", "Tanda ICUAW setelah stop"],
    frequency: "TOF setiap 4–8 jam jika infus ICU. RSI: satu kali bolus.",
    therapeutic_range: "TOF target 1–2/4 untuk infus ICU"
  },
  adverse_effects: {
    critical: ["ICUAW pada infus berkepanjangan", "Conscious paralysis jika sedasi tidak adekuat"],
    common: ["Takikardia ringan (efek vagolitik)", "Peningkatan bronkosekresi (jarang)"],
    antidote: "Sugammadex: reversal RSI (1.2 mg/kg) → 16 mg/kg. Reversal standar: 2–4 mg/kg. BEKERJA dalam 3 menit."
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Aminoglikosida / Magnesium sulfat", effect: "Potensiasi blok neuromuskular" },
      { drug: "Antibiotik (klindamisin, linkomisin)", effect: "Potensiasi NMB" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "ssc2024", note: "RSI di ICU — rokuronium 1.2 mg/kg setara suksinilkolin" }
  ]
},

"vekuronum": {
  name: "Vekuronium",
  brand_id: ["Norcuron", "Vekuronium Hameln"],
  brand_id_notes: "Norcuron (MSD). Tersedia di beberapa RS Indonesia. Kurang umum dari rokuronium.",
  class: "Neuromuskular bloker",
  subclass: "Aminosteroid NDNMB non-depolarizing",
  category: ["nmb"],
  common_in_id: false,
  common_in_id_note: "Tersedia terbatas — lebih jarang dari rokuronium",
  mechanism: "Blok kompetitif reseptor nikotinik. Onset intermediate (2–3 menit). Metabolisme hepatik ke metabolit 3-desasetil-vekuronium (aktif, akumulasi pada gagal ginjal). Tidak melepaskan histamin.",
  pkpd_type: null as any,
  pkpd_note: "Metabolit aktif 3-OH-vekuronium dapat berakumulasi pada gagal ginjal → blok berkepanjangan.",
  spectrum: null as any,
  indications: {
    icu_primary: ["Fasilitasi intubasi — alternatif rokuronium", "Infus NMB ICU jika rokuronium/sisatrakurium tidak tersedia"],
    icu_secondary: ["NMB perioperatif"],
    local_guideline: "Penggunaan menurun — rokuronium dan sisatrakurium lebih disukai.",
    intl_guideline: "Penggunaan ICU menurun drastis — sisatrakurium/rokuronium lebih dipilih karena keunggulan farmakokinetik."
  },
  contraindications: ["Hipersensitivitas terhadap vekuronium", "Tanpa sedasi/analgesia adekuat"],
  precautions: ["Akumulasi metabolit aktif pada gagal ginjal", "Akumulasi pada gagal hati", "ICUAW pada penggunaan lama + kortikosteroid"],
  dosing: {
    standard: "Intubasi: 0.1 mg/kg IV. Infus: 0.05–0.1 mg/kg/jam",
    range_low: "0.05 mg/kg/jam",
    range_high: "0.1 mg/kg/jam",
    max: "0.1 mg/kg bolus untuk intubasi",
    loading: "0.1 mg/kg IV bolus (onset 2–3 menit)",
    maintenance: "Infus 0.05–0.1 mg/kg/jam, titrasi per TOF",
    route: ["IV"],
    dilution: "10 mg (setelah rekonstitusi) dalam 50 mL NS → 0.2 mg/mL.",
    rate: "(mg/kg/jam × BB) / 0.2 = mL/jam",
    titration: "TOF target 1–2/4",
    special_notes: "Rekonstitusi dengan WFI: 5 mg powder + 5 mL WFI → 1 mg/mL."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal bolus", interval: "Kurangi infus 25%", note: "Metabolit 3-OH mulai akumulasi" },
    r15_30: { dose: "Normal bolus", interval: "Kurangi infus 50%", note: "Akumulasi bermakna" },
    r_lt15: { dose: "Normal bolus", interval: "Pertimbangkan sisatrakurium", note: "Akumulasi metabolit aktif — lebih baik ganti sisatrakurium" },
    hd:     { dose: "Hindari infus — gunakan sisatrakurium", interval: "—", note: "Metabolit aktif tidak terdialisis efektif" },
    crrt:   { dose: "Dosis rendah, TOF ketat", interval: "Monitor", note: "" },
    badge: "adjust",
    dialyzable: false,
    monitoring_renal: "Pada eGFR <30: pertimbangkan ganti sisatrakurium. TOF wajib setiap 4 jam."
  },
  hepatic_adjustment: {
    child_a: "Kurangi 25%", child_b: "Kurangi 50%", child_c: "Hindari infus — gunakan sisatrakurium",
    note: "Metabolisme dan ekskresi bilier hepatik. Sirosis → akumulasi bermakna."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari", trimester_2: "Emergensi saja", trimester_3: "Emergensi saja",
    labor_delivery: "Dapat digunakan SC emergensi",
    fetal_risk: "Blok neuromuskular neonatus transien",
    lactation: "Data tidak ada",
    lactation_note: null as any
  },
  monitoring: {
    efficacy: ["TOF setiap 4–8 jam"],
    safety: ["Sedasi adekuat", "ICUAW post-stop"],
    frequency: "TOF setiap 4–8 jam",
    therapeutic_range: "TOF 1–2/4"
  },
  adverse_effects: {
    critical: ["ICUAW", "Blok berkepanjangan pada gagal ginjal/hati"],
    common: ["Tidak ada efek otonom bermakna"],
    antidote: "Neostigmin 0.04 mg/kg + atropin 0.02 mg/kg. Sugammadex juga efektif (steroidal NMB)."
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Aminoglikosida / Magnesium", effect: "Potensiasi blok neuromuskular" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "ssc2024", note: "NMB ICU — sisatrakurium lebih disukai pada gagal ginjal/hati" }
  ]
},

"pankuronum": {
  name: "Pankuronium",
  brand_id: ["Pavulon"],
  brand_id_notes: "Pavulon (MSD/Organon). Ketersediaan semakin berkurang. Paling murah dari semua NMB.",
  class: "Neuromuskular bloker",
  subclass: "Aminosteroid NDNMB long-acting",
  category: ["nmb"],
  common_in_id: false,
  common_in_id_note: "Ketersediaan menurun di Indonesia — digantikan rokuronium/vekuronium",
  mechanism: "Blok kompetitif reseptor nikotinik. Long-acting (60–100 menit per bolus). Efek vagolitik kuat → takikardia (membedakan dari vekuronium). Akumulasi bermakna pada gagal ginjal dan hati.",
  pkpd_type: null as any,
  pkpd_note: "t½ eliminasi 100–120 menit. Sangat tidak predictable pada ICU — tidak dianjurkan untuk infus kontinu.",
  spectrum: null as any,
  indications: {
    icu_primary: ["Fasilitasi intubasi elektif jika rokuronium tidak tersedia"],
    icu_secondary: ["Bolus intermiten jika NMB lain tidak tersedia"],
    local_guideline: "Tidak direkomendasikan sebagai NMB utama ICU modern. Dipertahankan hanya jika tidak ada pilihan lain.",
    intl_guideline: "TIDAK direkomendasikan untuk infus kontinu ICU. Akumulasi tidak terprediksi. Gunakan rokuronium atau sisatrakurium."
  },
  contraindications: ["Gangguan ginjal atau hati signifikan (akumulasi)", "Takikardia signifikan (efek vagolitik)", "Tanpa sedasi/analgesia adekuat"],
  precautions: ["Akumulasi dramatis pada gagal ginjal/hati", "Takikardia berat via efek vagolitik", "Tidak untuk infus kontinu — tidak predictable", "ICUAW sangat tinggi"],
  dosing: {
    standard: "Intubasi: 0.08–0.1 mg/kg IV bolus",
    range_low: "0.08 mg/kg",
    range_high: "0.1 mg/kg",
    max: "0.1 mg/kg per bolus",
    loading: "0.08–0.1 mg/kg IV bolus (onset 3–5 menit)",
    maintenance: "Bolus intermiten 0.01–0.02 mg/kg jika diperlukan — BUKAN infus kontinu",
    route: ["IV"],
    dilution: "Ready-to-use 2 mg/mL",
    rate: "Hanya bolus",
    titration: "TOF monitoring jika berulang",
    special_notes: "⚠ TIDAK untuk infus kontinu ICU — akumulasi tidak terprediksi. Gunakan rokuronium atau sisatrakurium."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Kurangi 25–50%", interval: "Perpanjang interval", note: "Akumulasi" },
    r15_30: { dose: "HINDARI", interval: "—", note: "Akumulasi dramatis. Ganti sisatrakurium." },
    r_lt15: { dose: "HINDARI", interval: "—", note: "Kontraindikasi relatif. Gunakan sisatrakurium." },
    hd:     { dose: "HINDARI", interval: "—", note: "Tidak efektif terdialisis" },
    crrt:   { dose: "HINDARI", interval: "—", note: "Gunakan sisatrakurium" },
    badge: "avoid",
    dialyzable: false,
    monitoring_renal: "⚠ HINDARI pada eGFR <30 — gunakan sisatrakurium sebagai gantinya"
  },
  hepatic_adjustment: {
    child_a: "Kurangi 50%", child_b: "Hindari", child_c: "Hindari — gunakan sisatrakurium",
    note: "Ekskresi bilier dan renal. Sirosis → akumulasi dramatis."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari", trimester_2: "Hindari", trimester_3: "Emergensi saja",
    labor_delivery: "Tidak dianjurkan",
    fetal_risk: "Blok neonatus berkepanjangan",
    lactation: "Data tidak ada",
    lactation_note: null as any
  },
  monitoring: {
    efficacy: ["TOF jika bolus berulang"],
    safety: ["HR — takikardia vagolitik", "Durasi blok — sangat variabel"],
    frequency: "TOF setiap bolus",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Blok berkepanjangan tidak terprediksi pada gagal ginjal/hati", "ICUAW sangat tinggi"],
    common: ["Takikardia (vagolitik)", "Hipertensi", "Salivasi meningkat"],
    antidote: "Neostigmin 0.04 mg/kg + atropin 0.02 mg/kg. Sugammadex efektif (steroidal NMB)."
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Aminoglikosida / Magnesium", effect: "Potensiasi blok" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "ssc2024", note: "Pankuronium tidak direkomendasikan untuk infus ICU modern" }
  ]
},

"insulin_infus": {
  name: "Insulin Regular (Infus ICU)",
  brand_id: ["Actrapid HM", "Humulin R", "Insulin Regular Novo Nordisk"],
  brand_id_notes: "Actrapid paling umum di Indonesia. Humulin R tersedia di RS besar.",
  class: "Hormon / Antidiabetik",
  subclass: "Insulin regular (soluble)",
  category: ["high_alert"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua ICU Indonesia. Termasuk daftar obat HIGH-ALERT ISMP.",
  mechanism: "Berikatan reseptor insulin (RTK) → sinyal intraseluler → uptake glukosa oleh sel otot dan lemak, inhibisi glikogenolisis dan glukoneogenesis hati, anabolisme protein. Pada hiperglikemia ICU: manfaat dari kontrol glukosa moderat (140–180 mg/dL) tanpa hipoglikemia.",
  pkpd_type: null as any,
  pkpd_note: "Onset infus: 15–30 menit. t½ 5–10 menit. Efek bervariasi per resistensi insulin pasien.",
  spectrum: null as any,
  indications: {
    icu_primary: ["Hiperglikemia ICU — target glukosa 140–180 mg/dL (NICE-SUGAR 2009)", "Hiperosmoler hiperglikemik state (HHS)", "DKA berat (biasanya infus setelah loading)"],
    icu_secondary: ["Hiperkalemia darurat (insulin 10 unit + D50 → K masuk sel)", "Nutrisi parenteral total (TPN) — mengatur glukosa"],
    local_guideline: "PERDICI: Target glukosa ICU 140–180 mg/dL. Protokol sliding scale atau infus kontinu per algoritma.",
    intl_guideline: "NICE-SUGAR (2009, NEJM): Target 140–180 mg/dL aman. Intensive control (80–110) → ↑ mortalitas dan hipoglikemia. SCCM 2012: Konsisten 140–180 mg/dL."
  },
  contraindications: ["Hipoglikemia (BG <70 mg/dL) — STOP SEGERA", "Hipersensitivitas (sangat jarang)"],
  precautions: ["Hipoglikemia — efek samping paling berbahaya di ICU", "Variabilitas glukosa tinggi → outcome buruk", "Adsorpsi ke kantong dan selang IV — gunakan selang polipropilen, flush sebelum mulai"],
  dosing: {
    standard: "Infus: mulai 0.05–0.1 unit/kg/jam, titrasi per protokol glukosa",
    range_low: "0.02 unit/kg/jam",
    range_high: "0.2–0.5 unit/kg/jam (resistensi insulin berat)",
    max: "Tidak ada batas kaku — titrasi per glukosa",
    loading: "DKA: 0.1 unit/kg bolus IV. HHS: biasanya tanpa bolus.",
    maintenance: "Infus kontinu titrasi per protokol GCU (glucose control unit)",
    route: ["IV"],
    dilution: "50 unit dalam 50 mL NS → 1 unit/mL. Kocok perlahan. Flush 20 mL sebelum mulai (adsorpsi ke selang).",
    rate: "unit/jam / 1 = mL/jam",
    titration: "Cek glukosa setiap 1–2 jam. Naikkan/turunkan 0.01–0.02 unit/kg/jam per algoritma.",
    special_notes: "⚠ Adsorpsi insulin ke selang PVC: flush 20 mL larutan insulin sebelum mulai infus ke pasien. Gunakan selang polipropilen."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Kurangi 25%", interval: "Monitor GD lebih sering", note: "Waktu paruh insulin ↑ pada GFR rendah" },
    r15_30: { dose: "Kurangi 50%", interval: "GD setiap 1 jam", note: "Akumulasi insulin" },
    r_lt15: { dose: "Kurangi 50–75%", interval: "GD setiap 30–60 menit", note: "Risiko hipoglikemia sangat tinggi" },
    hd:     { dose: "Kurangi 50%", interval: "GD setiap 1 jam", note: "Clearance ↓. Monitor ketat." },
    crrt:   { dose: "Kurangi 25–50%", interval: "GD setiap 1–2 jam", note: "Glucose dari dialysate mungkin berubah" },
    badge: "reduce",
    dialyzable: false,
    monitoring_renal: "Hipoglikemia sangat mudah terjadi pada gagal ginjal — kurangi dosis dan monitor GD lebih sering"
  },
  hepatic_adjustment: {
    child_a: "Kurangi 25% — glikogenolisis ↓", child_b: "Kurangi 50%", child_c: "Kurangi 50–75% — hipoglikemia sangat mudah",
    note: "Metabolisme insulin sebagian hepatik. Sirosis: hipoglikemia puasa dan pada koreksi."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Aman — insulin tidak melewati plasenta (protein besar)",
    trimester_2: "Aman — dosis mungkin lebih tinggi karena resistensi insulin",
    trimester_3: "Aman",
    labor_delivery: "Monitor glukosa ketat — target 80–140 mg/dL intrapartum",
    fetal_risk: "Hipoglikemia neonatus jika hipoglikemia maternal",
    lactation: "Aman — insulin tidak masuk ASI",
    lactation_note: "Aman menyusui"
  },
  monitoring: {
    efficacy: ["GD setiap 1–2 jam selama infus", "Target GD 140–180 mg/dL (NICE-SUGAR)"],
    safety: ["⚠ Hipoglikemia: GD <70 mg/dL = BAHAYA", "Tanda hipoglikemia: tremor, keringat, penurunan kesadaran (mungkin tidak tampak pada pasien terintubasi/sedasi)", "Kalium (insulin → ↓K)"],
    frequency: "GD setiap 1 jam selama titrasi, setiap 2 jam jika stabil",
    therapeutic_range: "Target GD 140–180 mg/dL (ICU). Hipoglikemia <70 mg/dL = STOP SEGERA."
  },
  adverse_effects: {
    critical: ["Hipoglikemia berat (GD <40 mg/dL) → seizure, kerusakan otak, kematian", "Hipokalemia (insulin memindahkan K ke intraseluler)"],
    common: ["Hipoglikemia ringan-sedang (GD 70–100)", "Hipokalemia", "Edema (efek anabolik)"],
    antidote: "Hipoglikemia: D50W 50 mL IV bolus (atau D10W 200 mL). Ulangi dan cek GD 15 menit."
  },
  interactions: {
    major: [
      { drug: "β-blocker", effect: "Menyembunyikan tanda takikardia hipoglikemia — keringat masih ada", management: "Monitor GD lebih ketat pada pasien β-blocker" }
    ],
    moderate: [
      { drug: "Kortikosteroid", effect: "Antagonis insulin → kebutuhan insulin ↑↑", management: "Tingkatkan dosis insulin saat mulai steroid" }
    ]
  },
  stewardship: null as any,
  high_alert: true,
  high_alert_warnings: [
    "⛔ HIPOGLIKEMIA dapat terjadi tanpa gejala pada pasien sedasi/terintubasi — monitor GD setiap 1 jam",
    "⛔ Adsorpsi ke selang IV: FLUSH 20 mL larutan insulin sebelum sambung ke pasien",
    "⚠ Target GD ICU: 140–180 mg/dL — bukan <110 (NICE-SUGAR: intensif → ↑ mortalitas)",
    "⚠ Pada gagal ginjal: kurangi dosis 50% — insulin tidak terdialisis",
    "⚠ Hati-hati pada pasien β-blocker: gejala hipoglikemia (takikardia) tersembunyi"
  ],
  high_alert_protocol: "Double-check dosis oleh 2 perawat. Protap GCU (Glucose Control Unit) tertulis. GD setiap 1 jam.",
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "nice_sugar2009", note: "NICE-SUGAR 2009, NEJM: Target GD 140–180 lebih aman dari kontrol intensif 80–110" }
  ]
},

"heparin_ufh": {
  name: "Heparin Tidak Terfraksinasi (UFH)",
  brand_id: ["Heparin Sodium Inviclot", "Heparin Dexa", "Heparin B. Braun"],
  brand_id_notes: "Tersedia di semua RS Indonesia. Ampul 5000 IU/mL dan 25000 IU/5 mL.",
  class: "Antikoagulan",
  subclass: "Inhibitor trombin dan faktor Xa",
  category: ["high_alert"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua ICU Indonesia. Paling umum untuk antikoagulasi akut.",
  mechanism: "Berikatan antitrombin III (AT-III) → kompleks AT-III-heparin mengaktifkan AT-III 1000× → inhibisi trombin (IIa) dan faktor Xa. Reversal dengan protamin sulfat.",
  pkpd_type: null as any,
  pkpd_note: "t½ 1–2 jam (dosis dependen). Monitoring via aPTT (target 60–100 detik) atau anti-Xa (target 0.3–0.7 IU/mL untuk full antikoagulasi).",
  spectrum: null as any,
  indications: {
    icu_primary: ["DVT/PE akut — antikoagulasi terapi", "ACS (STEMI, NSTEMI) bersama reperfusi", "CRRT antikoagulasi sirkuit"],
    icu_secondary: ["Profilaksis DVT pada pasien ICU berisiko tinggi (dosis rendah)", "Antikoagulasi ECMO/IABP/LVAD", "HIT type 2 — STOP dan ganti argatroban/bivalirudin"],
    local_guideline: "PERDICI: UFH untuk antikoagulasi akut ICU. Monitoring aPTT target 60–100 detik.",
    intl_guideline: "ACCP 2016: UFH atau LMWH untuk DVT/PE. UFH lebih disukai di ICU (reversibel cepat dengan protamin, dapat dialisis)."
  },
  contraindications: ["Perdarahan aktif mayor", "HIT type 2 (sejarah atau curent) — STOP HEPARIN SEGERA", "Trombositopenia berat <50.000 (relatif)"],
  precautions: ["HIT (Heparin-Induced Thrombocytopenia) — periksa trombosit setiap 2–3 hari", "Resistensi heparin pada defisiensi AT-III", "Monitor perdarahan aktif"],
  dosing: {
    standard: "DVT/PE: 80 unit/kg bolus → 18 unit/kg/jam infus. Profilaksis: 5000 unit SC q8–12j",
    range_low: "10 unit/kg/jam (profilaksis/CRRT)",
    range_high: "30–35 unit/kg/jam (trombosis masif)",
    max: "Titrasi per aPTT — tidak ada batas kaku",
    loading: "80 unit/kg IV bolus (DVT/PE). 60 unit/kg maksimal 4000 unit (ACS).",
    maintenance: "18 unit/kg/jam → titrasi per nomogram aPTT",
    route: ["IV", "SC"],
    dilution: "25000 unit dalam 50 mL NS → 500 unit/mL. Atau 25000 unit dalam 250 mL → 100 unit/mL.",
    rate: "(unit/kg/jam × BB) / 500 = mL/jam",
    titration: "Nomogram: aPTT <50: +4 unit/kg/jam; 50–59: +2; 60–100: tidak ubah; 101–120: -2; >120: stop 1 jam -3.",
    special_notes: "⚠ Periksa trombosit hari ke 4–14. Penurunan trombosit >50% → curiga HIT → stop heparin SEGERA."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "Monitor aPTT lebih ketat" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Monitor aPTT — clearance sedikit ↓" },
    r_lt15: { dose: "Normal dosis, monitor ketat", interval: "Normal", note: "Risiko perdarahan meningkat" },
    hd:     { dose: "Normal atau gunakan untuk antikoagulasi HD", interval: "Normal", note: "Monitoring aPTT post-HD" },
    crrt:   { dose: "10–15 unit/kg/jam antikoagulasi sirkuit", interval: "Normal", note: "Anti-Xa target 0.3–0.5 IU/mL untuk CRRT" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Monitor aPTT setiap 6 jam. Risiko perdarahan meningkat pada AKI — pertimbangkan anti-Xa monitoring."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Monitor ketat — AT-III mungkin rendah", child_c: "Hati-hati — koagulopati baseline + AT-III rendah",
    note: "Metabolisme: retikulo-endotelial sistem. Tidak bergantung CYP hepatik."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Aman — tidak melewati plasenta",
    trimester_2: "Aman",
    trimester_3: "Aman",
    labor_delivery: "Stop 4–6 jam sebelum persalinan atau regional anestesi",
    fetal_risk: "Tidak ada (tidak melewati plasenta)",
    lactation: "Aman — tidak masuk ASI",
    lactation_note: "Pilihan antikoagulan aman saat menyusui"
  },
  monitoring: {
    efficacy: ["aPTT setiap 6 jam sampai stabil, lalu setiap 24 jam", "Anti-Xa jika tersedia (lebih akurat, target 0.3–0.7 IU/mL)", "Tanda dan gejala trombosis"],
    safety: ["Trombosit setiap 2–3 hari (hari 4–14) — HIT screening", "Tanda perdarahan aktif", "Hb/Ht harian jika perdarahan dicurigai"],
    frequency: "aPTT setiap 6 jam saat titrasi. Trombosit setiap 2–3 hari.",
    therapeutic_range: "aPTT 60–100 detik (full antikoagulasi). Profilaksis: aPTT tidak perlu monitoring."
  },
  adverse_effects: {
    critical: ["HIT type 2 (Heparin-Induced Thrombocytopenia + Thrombosis) — paradoksal trombosis fatal", "Perdarahan mayor (intrakranial, retroperitoneal, GI)"],
    common: ["Trombositopenia ringan (HIT type 1, jinak, hari 1–4)", "Perdarahan minor", "Osteoporosis (penggunaan lama >3 bulan)"],
    antidote: "Perdarahan/overdosis: Protamin sulfat 1 mg per 100 unit UFH yang tersisa (infus <10 menit). Maks 50 mg."
  },
  interactions: {
    major: [
      { drug: "Antiplatelet (aspirin, klopidogrel)", effect: "↑ risiko perdarahan", management: "Monitor ketat — kombinasi kadang diperlukan pada ACS" }
    ],
    moderate: [
      { drug: "NSAID", effect: "↑ risiko perdarahan GI" }
    ]
  },
  stewardship: null as any,
  high_alert: true,
  high_alert_warnings: [
    "⛔ HIT type 2: penurunan trombosit >50% hari ke-4–14 → STOP HEPARIN SEGERA, ganti argatroban/fondaparinux",
    "⚠ Periksa trombosit setiap 2–3 hari selama 2 minggu pertama",
    "⚠ Overdosis: Protamin sulfat 1 mg per 100 unit UFH (maks 50 mg, infus pelan)",
    "⚠ Monitor aPTT setiap 6 jam saat titrasi — aPTT >120 detik: STOP 1 jam lalu kurangi dosis"
  ],
  high_alert_protocol: "Double-check dosis oleh 2 perawat. Nomogram heparin tertulis. Trombosit rutin.",
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "ssc2024", note: "UFH atau LMWH untuk profilaksis dan terapi VTE di ICU" }
  ]
},

"nacl_3pct": {
  name: "NaCl 3% (Saline Hipertonik)",
  brand_id: ["NaCl 3% Otsuka", "Hypertonic Saline 3% B. Braun"],
  brand_id_notes: "Tersedia di RS besar Indonesia. Harus diencerkan/dipersiapkan di beberapa institusi.",
  class: "Elektrolit",
  subclass: "Salin hipertonik",
  category: ["high_alert"],
  common_in_id: true,
  common_in_id_note: "Tersedia di RS besar dan ICU tersier Indonesia",
  mechanism: "Osmolalitas tinggi (1026 mOsm/L) → menarik cairan dari intraseluler ke ekstraseluler → mengoreksi hiponatremia, ↓ edema serebral (↑ osmolalitas plasma → air keluar dari otak). Untuk ICP: ↓ volume otak dalam 15–30 menit.",
  pkpd_type: null as any,
  pkpd_note: "Koreksi Na terlalu cepat (>10–12 mEq/24 jam) → Osmotic Demyelination Syndrome (ODS) irreversibel.",
  spectrum: null as any,
  indications: {
    icu_primary: ["Hiponatremia simtomatik berat (Na <120 mEq/L dengan gejala neurologis)", "Hipertensi intrakranial (ICP >20 cmH₂O) — alternatif atau adjun mannitol"],
    icu_secondary: ["Hiponatremia akut (<48 jam) — koreksi lebih agresif aman", "Edema serebral post-stroke, TBI, post-reseksi massa"],
    local_guideline: "Panduan TBI Indonesia: NaCl 3% atau mannitol 20% untuk ICP. PERDICI: Koreksi hiponatremia tidak melebihi 10–12 mEq/L per 24 jam.",
    intl_guideline: "Spasiani 2022, ESICM: NaCl 3% untuk ICP. EAO/ESE 2014: Hiponatremia simtomatik berat → NaCl 3% 150 mL bolus 20 menit, ulangi bila perlu."
  },
  contraindications: ["Hipernatremia (Na >145 mEq/L)", "Edema paru berat (kelebihan cairan)", "Gagal jantung dekompensasi berat (relatif)"],
  precautions: ["Koreksi Na tidak boleh >10–12 mEq/L per 24 jam — ODS", "Pada hiponatremia kronik (>48 jam): lebih lambat, maksimal 8–10 mEq/24 jam", "Monitor Na setiap 2–4 jam selama koreksi"],
  dosing: {
    standard: "Hiponatremia berat: 1–2 mL/kg/jam sampai gejala membaik atau Na naik 5–6 mEq/L. ICP: 100–200 mL bolus 30 menit.",
    range_low: "0.5 mL/kg/jam",
    range_high: "2 mL/kg/jam (hiponatremia simtomatik akut)",
    max: "Tidak boleh menaikkan Na lebih dari 10–12 mEq/L dalam 24 jam",
    loading: "ICP emergensi: 100–250 mL bolus 15–30 menit. Hiponatremia gejala: 150 mL bolus 20 menit.",
    maintenance: "1–2 mL/kg/jam, monitor Na setiap 2 jam",
    route: ["IV"],
    dilution: "Ready-to-use 3% (513 mEq/L). HANYA via CVC — sangat iritatif ke vena perifer.",
    rate: "Volume (mL) / waktu (jam) = mL/jam",
    titration: "Cek Na setiap 2 jam. Stop atau turunkan rate jika Na naik >2 mEq/L per 2 jam.",
    special_notes: "⚠ HANYA via CVC. Perifer dapat menyebabkan flebitis berat. Batas 10–12 mEq/24 jam untuk hiponatremia kronik — ODS tidak reversibel."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Monitor Na dan volume lebih ketat", interval: "Normal", note: "" },
    r15_30: { dose: "Hati-hati — retensi Na dan volume", interval: "Monitor ketat", note: "Oliguria → akumulasi" },
    r_lt15: { dose: "Sangat hati-hati — gunakan dengan panduan nephrology", interval: "Na setiap 1–2 jam", note: "Oliguria/anuria: akumulasi Na cepat" },
    hd:     { dose: "Koordinasi dengan jadwal HD", interval: "Na setiap 1–2 jam", note: "HD dapat mengeluarkan Na berlebih" },
    crrt:   { dose: "Normal dengan monitoring Na ketat", interval: "Na setiap 2 jam", note: "" },
    badge: "safe",
    dialyzable: true,
    monitoring_renal: "Gagal ginjal → akumulasi Na dan volume. Na setiap 1–2 jam, urin output ketat."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Hati-hati — asites dapat memburuk", child_c: "Hati-hati — ascites dan edema",
    note: "Tidak ada penyesuaian metabolik — risiko volume overload pada sirosis."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Gunakan hanya emergensi", trimester_2: "Idem", trimester_3: "Idem",
    labor_delivery: "Gunakan dengan monitoring ketat",
    fetal_risk: "Hipernatremia fetal",
    lactation: "Aman dalam jangka singkat",
    lactation_note: null as any
  },
  monitoring: {
    efficacy: ["Na serum setiap 2 jam selama koreksi", "GCS/gejala neurologis jika hiponatremia", "ICP monitoring jika TBI"],
    safety: ["Na tidak boleh naik >12 mEq/24 jam (kronik) atau >18 mEq/24 jam (akut)", "Volume status: TD, edema paru", "Osmolalitas serum target <320 mOsm/L (ICP)"],
    frequency: "Na setiap 2 jam selama koreksi aktif. Setiap 4–6 jam jika stabil.",
    therapeutic_range: "Koreksi Na: maks 10–12 mEq/L per 24 jam (kronik). Target ICP: osmolalitas 300–320 mOsm/L."
  },
  adverse_effects: {
    critical: ["ODS (Osmotic Demyelination Syndrome) — koreksi Na terlalu cepat: paralisis, disfagia, kematian (IRREVERSIBEL)", "Overload cairan / edema paru", "Flebitis berat via vena perifer"],
    common: ["Hipernatremia", "Retensi air dan Na berlebih", "Mual (NaCl hypertonic)"],
    antidote: "ODS: Tidak ada antidot. Pencegahan adalah satu-satunya manajemen."
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Kortikosteroid", effect: "Potensiasi retensi Na → hipernatremia dan volume overload" }
    ]
  },
  stewardship: null as any,
  high_alert: true,
  high_alert_warnings: [
    "⛔ ODS (Osmotic Demyelination Syndrome): koreksi Na terlalu cepat → IRREVERSIBEL. Batas 10–12 mEq/24 jam (kronik)",
    "⛔ HANYA via CVC — flebitis berat pada vena perifer",
    "⚠ Monitor Na setiap 2 jam selama koreksi aktif",
    "⚠ Stop infus jika Na naik >2 mEq/L per 2 jam atau sudah naik 8–10 mEq/L"
  ],
  high_alert_protocol: "Verifikasi oleh 2 perawat. Protokol koreksi hiponatremia tertulis. Na setiap 2 jam wajib.",
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "kraft2005", note: "Panduan koreksi elektrolit ICU — koreksi Na aman" }
  ]
},

"mgso4_icu": {
  name: "Magnesium Sulfat (MgSO₄) ICU",
  brand_id: ["MgSO4 20% Otsuka", "Magnesium Sulfate 40% B. Braun", "Sulfas Magnesikus"],
  brand_id_notes: "Tersedia di semua RS Indonesia. Konsentrasi BERBEDA-BEDA (20%, 40%) — HARUS diperhatikan.",
  class: "Elektrolit / Antikonvulsan / Antiaritmia",
  subclass: "Antagonis kalsium endogen",
  category: ["high_alert"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua ICU Indonesia. HIGH-ALERT karena overdosis → cardiac arrest.",
  mechanism: "Kofaktor >300 enzim, antagonis kalsium endogen (kompetisi di kanal Ca²⁺). Efek: antiaritmia (mempersingkat aksi potensial), bronkodilatasi (otot polos relaksasi), antikonvulsan (pre-eklampsia/eklampsia — NMDA antagonis), tokolitik (relaksasi uterus), koreksi defisiensi.",
  pkpd_type: null as any,
  pkpd_note: "Level terapetik 4–7 mEq/L. Toksik >7 mEq/L. Lethal >15 mEq/L. Monitoring klonik patellar wajib.",
  spectrum: null as any,
  indications: {
    icu_primary: ["Pre-eklampsia/eklampsia — antikonvulsan LINI PERTAMA", "Torsades de Pointes (TdP) — 2g IV bolus", "Hipomagnesemia sedang-berat (Mg <1.7 mg/dL)"],
    icu_secondary: ["Status asmatikus berat — bronkodilatasi", "Hipokalemia refrakter (koreksi Mg dulu)", "Aritmia atrial refrakter (AF, flutter) dengan hipomagnesemia"],
    local_guideline: "POGI/PERDICI: MgSO4 antikonvulsan pre-eklampsia. Dosis Pritchard (IM) atau Zuspan (IV).",
    intl_guideline: "AHA 2019: Mg 2g IV untuk TdP. WHO: MgSO4 lini pertama pre-eklampsia berat/eklampsia."
  },
  contraindications: ["Blok AV derajat 2–3 (Mg menekan konduksi)", "Miastenia gravis — memperburuk NMJ blok", "Anuria (akumulasi dramatis)"],
  precautions: ["Monitor toksisitas: reflek patela hilang (level 7–10 mEq/L) → STOP. Depresi napas (level >10 mEq/L). Cardiac arrest (>15 mEq/L)", "Pemberian bolus terlalu cepat → flushing, hipotensi, cardiac arrest"],
  dosing: {
    standard: "Pre-eklampsia (IV Zuspan): 4g IV 15–20 menit → 1g/jam infus. TdP: 2g IV bolus 2–5 menit. Hipomagnesemia: 2g IV 15–60 menit.",
    range_low: "1g IV (defisiensi ringan)",
    range_high: "6–8g IV (preeklampsia berat loading)",
    max: "Loading: 4–6g. Maintenance: 2g/jam pada eklampsia refrakter (max 8g dalam 8 jam pertama)",
    loading: "Pre-eklampsia: 4g IV pelan 15–20 menit. TdP: 2g IV 2 menit.",
    maintenance: "1–2g/jam IV kontinu (pre-eklampsia). Hipomagnesemia: infus 4g dalam 4 jam.",
    route: ["IV", "IM"],
    dilution: "MgSO4 40% (1 mL = 0.4 g = 3.2 mEq). Encerkan ke konsentrasi ≤20% untuk perifer atau ≤50% untuk CVC.",
    rate: "1g/jam = 5 mL/jam (40% MgSO4 dalam 50 mL NS → 200 mg/mL = 0.2 g/mL)",
    titration: "Titrasi per gejala klinis dan level Mg. Stop jika reflek patela hilang.",
    special_notes: "⚠ Konsentrasi berbeda di pasaran (20% vs 40%) — VERIFIKASI SELALU. 1g MgSO4 = 8.1 mEq Mg²⁺. Antidot: kalsium glukonat."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Kurangi maintenance 25–50%", interval: "Monitor Mg setiap 4–6 jam", note: "Ekskresi renal ↓" },
    r15_30: { dose: "Kurangi 50%", interval: "Mg setiap 2–4 jam", note: "Akumulasi cepat" },
    r_lt15: { dose: "Bolus saja jika mutlak perlu", interval: "Monitor Mg setiap 1–2 jam", note: "Hindari infus kontinu" },
    hd:     { dose: "Hindari infus kontinu", interval: "Monitor Mg post-HD", note: "HD mengeluarkan Mg efektif" },
    crrt:   { dose: "Kurangi 50%", interval: "Mg setiap 2–4 jam", note: "CRRT menurunkan Mg — mungkin perlu suplementasi" },
    badge: "reduce",
    dialyzable: true,
    monitoring_renal: "Mg serum setiap 2–4 jam pada gagal ginjal. Reflek patela wajib diperiksa sebelum setiap bolus."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal — ekskresi renal",
    note: "Tidak dimetabolisme hepatik."
  },
  pregnancy: {
    fda_category: "A",
    trimester_1: "Aman untuk suplementasi",
    trimester_2: "Aman",
    trimester_3: "LINI PERTAMA pre-eklampsia/eklampsia",
    labor_delivery: "Dosis loading 4g → maintenance 1g/jam. Monitor neonatus (hipermagnesemia).",
    fetal_risk: "Hipermagnesemia neonatus: hipotonia, depresi napas (transien)",
    lactation: "Aman — Mg normal di ASI",
    lactation_note: "Aman menyusui"
  },
  monitoring: {
    efficacy: ["Mg serum setiap 4–6 jam (target 4–7 mEq/L terapetik, atau 2–3 mEq/L suplementasi)", "Kejang (pre-eklampsia — tidak ada seizure = efektif)"],
    safety: ["Reflek patela sebelum setiap bolus dan setiap 1–2 jam — hilangnya reflek = STOP", "RR — depresi napas (target >12/menit)", "SpO₂ kontinyu", "Tekanan darah", "Urin output (≥25–30 mL/jam) — anuria → akumulasi fatal"],
    frequency: "Mg serum setiap 4–6 jam. Reflek patela setiap 1–2 jam. SpO₂ kontinyu.",
    therapeutic_range: "Suplementasi: 2–3 mEq/L. Antikonvulsan: 4–7 mEq/L. Toksik: >7 mEq/L."
  },
  adverse_effects: {
    critical: ["Depresi napas (Mg >10 mEq/L) → apnea", "Cardiac arrest (Mg >15 mEq/L — henti jantung)", "Hilang reflek patellar (Mg 7–10 mEq/L) = tanda awal toksisitas"],
    common: ["Flushing / rasa panas saat bolus", "Hipotensi", "Mual/muntah", "Kelemahan otot"],
    antidote: "TOKSISITAS MG: Kalsium glukonat 10% 10–20 mL IV pelan (10 menit). Antagonis Mg langsung. SIAP SELALU di samping bed."
  },
  interactions: {
    major: [
      { drug: "NMB (rokuronium, sisatrakurium)", effect: "Potensiasi blok neuromuskular — kurangi dosis NMB 25–50%", management: "TOF monitoring lebih ketat" }
    ],
    moderate: [
      { drug: "Nifedipin", effect: "Potensiasi hipotensi berat pada pre-eklampsia" },
      { drug: "Gentamisin/Aminoglikosida", effect: "Potensiasi toksisitas neuromuskular" }
    ]
  },
  stewardship: null as any,
  high_alert: true,
  high_alert_warnings: [
    "⛔ TOKSISITAS: Reflek patela hilang → STOP SEGERA. Antidot: Kalsium glukonat 10% 10 mL IV pelan",
    "⛔ Bolus TERLALU CEPAT → flushing berat, hipotensi, dan cardiac arrest",
    "⛔ Anuria/oliguria berat: akumulasi → cardiac arrest. Pastikan urin output ≥25 mL/jam",
    "⚠ Konsentrasi di pasaran BERBEDA (20% vs 40%) — verifikasi konsentrasi sebelum hitung dosis",
    "⚠ Selalu siapkan Kalsium Glukonat 10% di samping bed selama infus MgSO4"
  ],
  high_alert_protocol: "Double-check konsentrasi dan dosis oleh 2 perawat. Kalsium glukonat siap di bed. Monitoring reflek patela.",
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "kraft2005", note: "Panduan koreksi elektrolit ICU — magnesium" }
  ]
},

"amiodarone": {
  name: "Amiodarone",
  brand_id: ["Cordarone", "Tiaryt", "Amiodarone Dexa", "Kendaron"],
  brand_id_notes: "Cordarone (Sanofi) originator. Generik lokal tersedia. Tersedia di semua RS Indonesia.",
  class: "Antiaritmia",
  subclass: "Kelas III (inhibitor kanal K) + I + II + IV",
  category: ["high_alert"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua ICU Indonesia. Pilihan utama aritmia ventrikel ICU.",
  mechanism: "Multi-kelas antiaritmia: Kelas III dominan (inhibisi kanal K → ↑ durasi aksi potensial, ↑ refrakter), kelas I (Na channel), II (β-adrenergik antagonis), IV (Ca channel). Waktu paruh sangat panjang (40–55 hari).",
  pkpd_type: null as any,
  pkpd_note: "t½ 40–55 hari (sangat panjang karena akumulasi di jaringan lemak dan paru). Efek dapat bertahan berbulan-bulan setelah stop.",
  spectrum: null as any,
  indications: {
    icu_primary: ["VF/pulseless VT refrakter defibrilasi (ACLS: 300 mg bolus)", "VT/SVT stabil hemodinamik dengan LV disfungsi", "AF dengan rapid ventricular rate pada syok"],
    icu_secondary: ["Profilaksis post-cardiac surgery AF", "Konversi AF/flutter (IV)", "VT berulang refrakter antiaritmia lain"],
    local_guideline: "AHA ACLS 2020: Amiodarone 300 mg IV/IO pada VF/pVT setelah defibrilasi ke-3 tidak berhasil.",
    intl_guideline: "AHA 2019 Ventricular Arrhythmia: Amiodarone lini pertama VT/VF. AHA AF 2019: Rate control AF jika metoprolol kontraindikasi."
  },
  contraindications: ["Bradikardi sinus berat tanpa pacemaker", "Blok AV derajat 2–3 tanpa pacemaker", "Tirotoksikosis (mengandung yodium)", "Hipersensitivitas terhadap yodium"],
  precautions: ["Toksisitas paru (fibrosis paru) — infus >3 bulan", "Toksisitas tiroid (hipo/hipertiroid) — evaluasi TFT sebelum mulai dan berkala", "Hepatotoksik — LFT monitoring", "Interaksi luas — banyak obat dipengaruhi", "Hipotensi berat pada infus cepat IV"],
  dosing: {
    standard: "ACLS VF/pVT: 300 mg IV bolus. Infus loading: 150 mg dalam 10 menit → 1 mg/min × 6 jam → 0.5 mg/min × 18 jam.",
    range_low: "0.5 mg/min (maintenance infus)",
    range_high: "1 mg/min (loading 6 jam)",
    max: "2.2 g/hari (total loading + maintenance)",
    loading: "VF/pVT ACLS: 300 mg IV bolus. Infus loading elektif: 150 mg dalam 100 mL D5W (10 menit).",
    maintenance: "1 mg/min × 6 jam (360 mg) → 0.5 mg/min × 18 jam (540 mg). Oral setelah stabilisasi.",
    route: ["IV", "Oral"],
    dilution: "150 mg dalam 100 mL D5W → 1.5 mg/mL (gunakan D5W, BUKAN NS — presipitat). Infus via CVC untuk konsentrasi >2 mg/mL.",
    rate: "1 mg/min = 60 mL/jam (konsentrasi 1 mg/mL). HITUNG sesuai konsentrasi.",
    titration: "Loading elektif → maintenance. Oral setelah stabilisasi jangka panjang.",
    special_notes: "⚠ GUNAKAN D5W — presipitat dengan NS. Perifer hanya konsentrasi <2 mg/mL. Flebitis sangat umum via vena perifer — gunakan CVC."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", route: null as any, note: "" },
    r30_60: { dose: "Normal", interval: "Normal", route: null as any, note: "" },
    r15_30: { dose: "Normal", interval: "Normal", route: null as any, note: "Tidak memerlukan penyesuaian dosis" },
    r_lt15: { dose: "Normal", interval: "Normal", route: "Batasi durasi infus IV — propylene glycol (pelarut amiodarone IV) akumulasi pada gagal ginjal berat, nefrotoksik", note: "Ekskresi renal minimal — t½ tidak berubah bermakna" },
    hd:     { dose: "Normal", interval: "Normal", route: "Tidak terdialisis (Vd sangat besar, t½ 40–55 hari)", note: "HD tidak mengeliminasi amiodarone secara bermakna" },
    crrt:   { dose: "Normal", interval: "Normal", route: null as any, note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Tidak memerlukan penyesuaian pada gagal ginjal — ekskresi utama feses"
  },
  hepatic_adjustment: {
    child_a: "Normal dengan monitoring LFT", child_b: "Kurangi dosis maintenance 25%", child_c: "Kurangi 50% — hepatotoksik pada baseline penyakit hati",
    note: "Metabolisme hepatik (CYP3A4, CYP2C8) ke metabolit aktif desetilamiodarone. Sirosis → akumulasi."
  },
  pregnancy: {
    fda_category: "D",
    trimester_1: "HINDARI — teratogen (mengandung yodium, hipotiroid neonatus)",
    trimester_2: "Hanya life-threatening arrhythmia",
    trimester_3: "Idem — yodium → hipotiroid/hipertiroid neonatus",
    labor_delivery: "Pertimbangkan alternatif",
    fetal_risk: "Hipotiroid neonatus, IUGR, prematur",
    lactation: "KONTRAINDIKASI — amiodarone dan metabolit masuk ASI bermakna",
    lactation_note: "Berhenti menyusui jika harus menggunakan amiodarone"
  },
  monitoring: {
    efficacy: ["EKG kontinyu selama infus IV", "Ritme kardiak (konversi ke SR atau kontrol rate)"],
    safety: ["TFT (TSH, fT4) sebelum mulai dan setiap 3–6 bulan", "LFT (ALT/AST) setiap 3–6 bulan", "Foto toraks setiap 6–12 bulan (toksisitas paru)", "QTc — perpanjangan QT (hati-hati TdP meski jarang dari amiodarone sendiri)", "TD selama infus IV (hipotensi)"],
    frequency: "EKG kontinyu selama IV. Foto toraks dan LFT berkala untuk penggunaan kronik.",
    therapeutic_range: "Level plasma tidak dipantau rutin (tidak korelasi baik dengan efikasi/toksisitas)"
  },
  adverse_effects: {
    critical: ["Toksisitas paru (pneumonitis, fibrosis) — dapat fatal, terutama penggunaan >6 bulan", "Hipotensi berat saat infus IV cepat"],
    common: ["Bradikardi", "Hipotensi IV", "Hipotiroid atau hipertiroid", "↑ LFT", "Fotosensitivitas kulit", "Deposit kornea (umum, jinak)", "Neuropati perifer"],
    antidote: null as any
  },
  interactions: {
    major: [
      { drug: "Warfarin", effect: "↑ INR 33–50% — amiodarone inhibisi CYP2C9", management: "Kurangi warfarin 33–50% saat mulai amiodarone. Monitor INR ketat." },
      { drug: "Digoksin", effect: "↑ kadar digoksin 70–100% — inhibisi P-gp renal", management: "Kurangi digoksin 50% saat mulai amiodarone. Monitor level." },
      { drug: "Statin (simvastatin, lovastatin)", effect: "↑ kadar statin → miopati/rabdomiolisis", management: "Kurangi dosis statin atau ganti rosuvastatin" }
    ],
    moderate: [
      { drug: "β-blocker / Ca channel blocker", effect: "Sinergisme bradikardi dan blok AV" }
    ]
  },
  stewardship: null as any,
  high_alert: true,
  high_alert_warnings: [
    "⛔ Infus IV cepat → HIPOTENSI BERAT — loading selalu ≥10 menit",
    "⛔ Toksisitas paru pada penggunaan kronik: batuk, dispnea, demam subfebrile → STOP dan evaluasi",
    "⚠ GUNAKAN PELARUT D5W — presipitat dengan NS",
    "⚠ Interaksi warfarin: kurangi dosis warfarin 33–50% + monitor INR ketat",
    "⚠ t½ 40–55 hari — efek samping dapat bertahan berbulan-bulan setelah stop"
  ],
  high_alert_protocol: "Verifikasi pelarut (D5W bukan NS). Double-check dosis. Monitoring EKG kontinyu selama IV.",
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "ssc2024", note: "AHA ACLS 2020: Amiodarone 300 mg untuk VF/pVT refrakter defibrilasi" }
  ]
},

"nitroprusid": {
  name: "Natrium Nitroprusid (SNP)",
  brand_id: ["Nipride", "Nitroprusside Hameln"],
  brand_id_notes: "Tersedia sangat terbatas di Indonesia. Lebih jarang tersedia dibanding nikardipin. Harus terlindung cahaya.",
  class: "Vasodilator",
  subclass: "Donor nitrit oksida (NO)",
  category: ["high_alert"],
  common_in_id: false,
  common_in_id_note: "Ketersediaan sangat terbatas di Indonesia — nikardipin atau labetolol lebih sering dipakai",
  mechanism: "Donor langsung NO (nitrit oksida) → aktivasi guanilat siklase → ↑ cGMP → relaksasi otot polos arteri DAN vena → ↓ preload DAN afterload. Onset 30–60 detik, durasi 1–10 menit. Metabolisme: sianida bebas (toksik) → tiosianat (renal ekskresi).",
  pkpd_type: null as any,
  pkpd_note: "Onset: <1 menit. Offset: 1–10 menit. Toksisitas sianida: >72 jam infus atau dosis tinggi >4 mcg/kg/min.",
  spectrum: null as any,
  indications: {
    icu_primary: ["Hipertensi emergensi berat (SBP >220 mmHg dengan end-organ damage)", "Syok kardiogenik — ↓ afterload dan preload (kombinasi dengan inotropik)"],
    icu_secondary: ["Diseksi aorta (kombinasi esmolol + nitroprusid)", "Hypertensive emergency perioperatif"],
    local_guideline: "Tersedia terbatas — nikardipin IV lebih umum tersedia di Indonesia.",
    intl_guideline: "AHA Hypertensive Emergency 2017: Nitroprusid untuk hipertensi emergensi dengan HF akut. Hindari pada iskemia serebral (coronary steal)."
  },
  contraindications: ["Hipertensi kompensatoria (coarctation, AV shunt)", "Gangguan ginjal berat (akumulasi tiosianat)", "Defisiensi B12 atau hipotiroid (risiko toksisitas sianida ↑)", "Atrofi optik Leber"],
  precautions: ["Toksisitas sianida — infus >72 jam atau >4 mcg/kg/min", "LINDUNGI dari cahaya — solusi terurai cepat dengan cahaya (gunakan foil/lindungi set)", "Hipotensi berat (titrasi hati-hati)", "Rebound hipertensi saat stop mendadak"],
  dosing: {
    standard: "0.3–10 mcg/kg/min IV kontinyu",
    range_low: "0.3–0.5 mcg/kg/min",
    range_high: "10 mcg/kg/min (maks 10 menit saja pada dosis ini)",
    max: "10 mcg/kg/min (sangat singkat). Dosis >4 mcg/kg/min >72 jam → RISIKO SIANIDA",
    loading: null as any,
    maintenance: "Titrasi per tekanan darah target. Kurangi dosis segera jika tekanan darah tercapai.",
    route: ["IV"],
    dilution: "50 mg dalam 250 mL D5W → 200 mcg/mL. LINDUNGI DARI CAHAYA (foil/kantong gelap).",
    rate: "(mcg/kg/min × BB × 60) / 200 = mL/jam",
    titration: "Naikan/turunkan 0.5 mcg/kg/min setiap 2–3 menit per respons MAP.",
    special_notes: "⚠ LINDUNGI DARI CAHAYA — ganti larutan setiap 4–8 jam. ⚠ Jika tidak respon dalam 10 menit pada dosis maks → stop dan ganti agen lain."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal, batasi durasi", interval: "Normal", note: "Tiosianat mulai akumulasi" },
    r15_30: { dose: "Kurangi — monitor tiosianat", interval: "Normal", note: "Akumulasi tiosianat bermakna" },
    r_lt15: { dose: "HINDARI infus >24 jam", interval: "—", note: "Tiosianat akumulasi → toksisitas. Ganti nikardipin." },
    hd:     { dose: "Hindari atau durasi sangat singkat", interval: "Monitor tiosianat", note: "HD mengeluarkan tiosianat efektif" },
    crrt:   { dose: "Hati-hati — batasi durasi", interval: "Normal", note: "" },
    badge: "avoid",
    dialyzable: true,
    monitoring_renal: "⚠ HINDARI pada eGFR <30 mL/min — tiosianat akumulasi. Ganti nikardipin IV."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Hati-hati — defisiensi B12 mungkin", child_c: "Hati-hati",
    note: "Konversi sianida ke tiosianat via tiosulfat/rhodanase (hati dan jaringan lain)."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "HINDARI — sianida melewati plasenta",
    trimester_2: "Hanya emergensi singkat",
    trimester_3: "Hindari jika ada alternatif (labetolol, nikardipin lebih aman)",
    labor_delivery: "Gunakan <10 menit jika emergensi",
    fetal_risk: "Toksisitas sianida fetal",
    lactation: "Kontraindikasi",
    lactation_note: null as any
  },
  monitoring: {
    efficacy: ["MAP setiap 1–2 menit selama titrasi (monitoring arterial line direkomendasikan)", "Target MAP biasanya turun 10–25% dalam 1 jam pertama"],
    safety: ["Tiosianat serum jika infus >24–48 jam (target <10 mg/dL)", "Tanda toksisitas sianida: laktat meningkat, metabolik asidosis anion gap, tanda CNS (confused, seizure)", "TD — hipotensi"],
    frequency: "MAP arterial line kontinyu. Tiosianat serum jika infus >24 jam atau gagal ginjal.",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Toksisitas sianida: asidosis metabolik, hipotensi refrakter, kejang, kematian (dosis tinggi/lama/gagal ginjal)", "Hipotensi berat", "Toksisitas tiosianat (kronik): gangguan tiroid, neurotoksisitas"],
    common: ["Hipotensi", "Mual/muntah", "Sakit kepala", "Rebound hipertensi saat stop"],
    antidote: "Toksisitas sianida: Natrium tiosulfat 12.5 g IV (atau 25 mL larutan 50%) + Hidroksikobalamin 5g IV (Cyanokit). Stop nitroprusid SEGERA."
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Antihipertensi lain / PDE5i (sildenafil)", effect: "Hipotensi berat — efek vasodilator aditif" }
    ]
  },
  stewardship: null as any,
  high_alert: true,
  high_alert_warnings: [
    "⛔ LINDUNGI DARI CAHAYA — larutan terurai dengan cahaya. Ganti setiap 4–8 jam, tutup dengan foil",
    "⛔ Toksisitas SIANIDA pada infus >72 jam atau >4 mcg/kg/min: laktat ↑, asidosis → STOP SEGERA",
    "⛔ HINDARI pada eGFR <30 — akumulasi tiosianat. Ganti nikardipin IV",
    "⚠ Antidot toksisitas sianida: Hidroksikobalamin 5g IV + Natrium tiosulfat 12.5g IV",
    "⚠ Monitoring arterial line sangat dianjurkan — onset/offset sangat cepat"
  ],
  high_alert_protocol: "Lindungi larutan dari cahaya (foil). Monitoring arterial line. Double-check dosis.",
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "ssc2024", note: "Hipertensi emergensi ICU — nitroprusid jika tidak ada nikardipin" }
  ]
}

};
