import { DrugDatabase } from './types';

export const ICU_DRUGS: DrugDatabase = {

"propofol": {
  name: "Propofol",
  brand_id: ["Recofol", "Diprivan", "Propofol Fresenius", "Propofol Hameln"],
  brand_id_notes: "Diprivan (AstraZeneca) originator. Recofol dan generik lokal umum di ICU Indonesia.",
  class: "Anastetik intravena",
  subclass: "Sedatif GABA-ergik",
  category: ["sedasi"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua ICU Indonesia. Pilihan utama sedasi ICU.",
  mechanism: "Potensiasi reseptor GABA-A → inhibisi SSP. Onset cepat (30–60 detik), pemulihan cepat (meski infus berkepanjangan) melalui redistribusi. Sifat antiemetik, antikonvulsan ringan, dan vasodilator.",
  pkpd_type: null as any,
  pkpd_note: "Konteks-sensitif: waktu pemulihan meningkat pada infus >24–48 jam karena akumulasi di jaringan perifer. Namun tetap lebih predictable dari benzodiazepin.",
  spectrum: null as any,
  indications: {
    icu_primary: ["Sedasi ICU jangka pendek-menengah (<48–72 jam)", "Status epileptikus refrakter (dosis tinggi)"],
    icu_secondary: ["Sedasi selama bronkoskopi/prosedur ICU", "Sedasi pada ARDS (facilitating prone positioning)"],
    local_guideline: "PERDICI: Propofol pilihan utama sedasi ICU. Target RASS -2 hingga 0. Protokol SAT (Spontaneous Awakening Trial) harian.",
    intl_guideline: "SCCM PADIS 2018: Propofol atau deksmedetomidin lebih disukai dari benzodiazepin untuk sedasi ICU. Light sedation (RASS -1 to 0) superior."
  },
  contraindications: ["Hipersensitivitas terhadap propofol, soya, telur (mengandung lecithin telur dan soybean oil)", "Hipertrigliseridemia berat (TG >500 mg/dL)", "TIDAK untuk sedasi pada anak <3 tahun di ICU (PRIS risiko)"],
  precautions: ["PRIS (Propofol Infusion Syndrome) — lihat high_alert_warnings", "Hipotensi — efek vasodilator dan inotropik negatif ringan", "Hiperlipidemia — 1 mL = 0.1 g lemak (1.1 kkal/mL)", "Infeksi jika teknik aseptik tidak ketat (medium kultur bakteri)"],
  dosing: {
    standard: "5–50 mcg/kg/min IV kontinyu (0.3–3 mg/kg/jam)",
    range_low: "5–10 mcg/kg/min (sedasi ringan)",
    range_high: "50 mcg/kg/min (4 mg/kg/jam) — BATAS PRIS",
    max: "4 mg/kg/jam (66 mcg/kg/min) — JANGAN LEBIH dari 48–72 jam pada dosis tinggi",
    loading: "Tidak dianjurkan di ICU (hipotensi). Jika perlu: 0.5 mg/kg pelan-pelan.",
    maintenance: "Titrasi per RASS target. Turunkan dosis setiap 24 jam (SAT).",
    route: ["IV"],
    dilution: "Ready-to-use 10 mg/mL (1%). Tidak perlu diencerkan. Ganti line setiap 12 jam.",
    rate: "mcg/kg/min × BB × 60 / 10000 = mL/jam (konsentrasi 10 mg/mL)",
    titration: "Titrasi per RASS. Light sedation (RASS -1 s/d 0) direkomendasikan.",
    special_notes: "⚠ HITUNG kalori dari propofol: 1.1 kkal/mL → kurangi dari target nutrisi. Ganti set infus setiap 12 jam (media pertumbuhan bakteri)."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Monitor TG" },
    r_lt15: { dose: "Normal — hati-hati akumulasi metabolit", interval: "Normal", note: "Monitor TG setiap 48 jam" },
    hd:     { dose: "Normal", interval: "Normal", note: "Sedikit terdialisis" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Trigliserida setiap 48–72 jam pada infus >24 jam atau dosis >4 mg/kg/jam"
  },
  hepatic_adjustment: {
    child_a: "Normal dengan monitoring", child_b: "Monitor ketat — clearance ↓", child_c: "Kurangi dosis 25–50% — risiko akumulasi",
    note: "Metabolisme hepatik utama via glucuronidasi. Disfungsi hati berat → clearance ↓."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Hindari kecuali emergensi",
    trimester_2: "Gunakan dosis minimal yang efektif",
    trimester_3: "Idem — risiko depresi SSP neonatus",
    labor_delivery: "Tidak untuk analgesia persalinan. Dapat digunakan pada SC emergensi.",
    fetal_risk: "Depresi SSP neonatus, apnea",
    lactation: "Diekskresikan ke ASI. Hindari menyusui 24 jam post-infus berkepanjangan.",
    lactation_note: "Propofol larut lemak — exkresi ke ASI signifikan"
  },
  monitoring: {
    efficacy: ["RASS setiap 2–4 jam (target sesuai protokol)", "CAM-ICU harian untuk delirium screening"],
    safety: ["Trigliserida setiap 48–72 jam (target <400 mg/dL)", "pH arteri + laktat (tanda PRIS)", "EKG jika dosis tinggi >48 jam (RBBB/LBBB baru = tanda PRIS)", "Tekanan darah — hipotensi"],
    frequency: "Monitoring sedasi setiap 2 jam. Hematologi metabolik setiap 24–48 jam pada infus tinggi.",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: [
      "PRIS (Propofol Infusion Syndrome): Dosis >4–5 mg/kg/jam >48 jam → asidosis metabolik anion gap tinggi, rhabdomiolisis, aritmia (RBBB, LBBB), gagal ginjal akut, gagal jantung. Angka mortalitas tinggi. STOP SEGERA jika dicurigai.",
      "Hipotensi berat — terutama bolus atau pada pasien hipovolemik"
    ],
    common: ["Hipotensi (terutama awal)", "Hipertrigliseridemia", "Nyeri injeksi (vena perifer)", "Urin hijau (metabolit — jinak)"],
    antidote: "PRIS: Hentikan propofol SEGERA, ganti sedasi (midazolam atau ketamin), koreksi asidosis, RRT jika diperlukan"
  },
  interactions: {
    major: [
      { drug: "Fentanil/Opioid", effect: "Sinergisme sedasi — risiko apnea dan hipotensi berat", management: "Kurangi dosis kedua obat. Monitor ketat." }
    ],
    moderate: [
      { drug: "Rifampisin", effect: "Menginduksi metabolisme propofol → dosis lebih tinggi dibutuhkan" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: true,
  pump_drug_key: "propofol",
  evidence: [
    { ref_id: "devlin2018", note: "SCCM PADIS 2018: Propofol/deksmedetomidin lebih disukai dari benzodiazepin ICU" }
  ]
},

"deksmedetomidin": {
  name: "Deksmedetomidin",
  brand_id: ["Precedex", "Dexdor", "Deksmedetomidin Fresenius"],
  brand_id_notes: "Precedex (Pfizer) dan Dexdor (Orion). Tersedia terbatas di ICU Indonesia — harga lebih tinggi.",
  class: "Agonis alfa-2 adrenergik",
  subclass: "Sedatif non-GABA",
  category: ["sedasi"],
  common_in_id: true,
  common_in_id_note: "Tersedia di RS ICU Indonesia, umumnya sebagai second-line atau pilihan weaning",
  mechanism: "Agonis selektif α₂-adrenergik di locus ceruleus (batang otak) → sedasi menyerupai tidur fisiologis. TIDAK menyebabkan depresi napas bermakna. Efek analgetik ringan via α₂ spinal. Antisialagog. Bradikardia dan hipotensi via α₂ vaskular.",
  pkpd_type: null as any,
  pkpd_note: "Onset 15 menit. Waktu paruh 2 jam. Clearance hepatik — penyesuaian pada gangguan hati berat.",
  spectrum: null as any,
  indications: {
    icu_primary: ["Sedasi ICU ringan-sedang (RASS 0 hingga -2) terutama pada pasien kooperatif", "Weaning ventilator — pasien dapat diajak komunikasi lebih baik"],
    icu_secondary: ["Pencegahan dan manajemen delirium ICU (MENDS-2 2024: tidak superior dari propofol)", "Agitasi berat post-operasi", "Manajemen withdrawal alkohol/opioid"],
    local_guideline: "PERDICI: Deksmedetomidin sebagai pilihan sedasi pada pasien yang perlu tetap komunikatif atau dalam protokol weaning.",
    intl_guideline: "SCCM PADIS 2018: Gunakan propofol atau deksmedetomidin (bukan benzodiazepin) untuk sedasi ICU. MENDS-2 (Hughes 2021, NEJM): Deksmedetomidin tidak mengurangi delirium dibanding propofol pada sepsis."
  },
  contraindications: ["Blok AV derajat 2–3 (tanpa pacemaker)", "Bradikardia berat (HR <50) tanpa backup", "Hipotensi berat tidak terkoreksi"],
  precautions: ["Bradikardia — sangat umum terutama loading", "Hipotensi — terutama pada hipovolemia", "Tidak untuk sedasi dalam (bila butuh RASS -3 sampai -5, kurang efektif)", "Waktu paruh pendek — agitasi rebound jika stop mendadak"],
  dosing: {
    standard: "0.2–0.7 mcg/kg/jam IV kontinyu",
    range_low: "0.2–0.4 mcg/kg/jam",
    range_high: "1.5 mcg/kg/jam (off-label, refrakter)",
    max: "1.5 mcg/kg/jam",
    loading: "1 mcg/kg selama 10 menit — SERING DIHINDARI ICU (bradikardia/hipotensi berat). Mulai maintenance langsung.",
    maintenance: "0.2–0.7 mcg/kg/jam, titrasi per RASS",
    route: ["IV"],
    dilution: "200 mcg dalam 50 mL NS → 4 mcg/mL. Atau 400 mcg dalam 100 mL → 4 mcg/mL.",
    rate: "(mcg/kg/jam × BB) / 4 = mL/jam",
    titration: "Naikan 0.1 mcg/kg/jam setiap 30 menit per RASS. Hindari loading di ICU.",
    special_notes: "Pasien dapat dibangunkan dan komunikasi saat deksmedetomidin — keunggulan utama vs propofol. Tapering bertahap saat stop."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal dengan monitoring", interval: "Normal", note: "Monitor hemodinamik ketat" },
    r_lt15: { dose: "Normal — clearance tidak berubah bermakna", interval: "Normal", note: "Monitor akumulasi metabolit" },
    hd:     { dose: "Normal", interval: "Normal", note: "Tidak terdialisis bermakna" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Monitoring hemodinamik — gagal ginjal sering disertai hipovolemia"
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Kurangi 30–50%", child_c: "Mulai dosis rendah 0.2 mcg/kg/jam — clearance ↓ bermakna",
    note: "Metabolisme hepatik via glucuronidasi dan N-glukuronidasi. Sirosis berat: clearance ↓ signifikan."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Data terbatas — hindari",
    trimester_2: "Hanya emergensi",
    trimester_3: "Idem",
    labor_delivery: "Data tidak ada",
    fetal_risk: "Tidak diketahui",
    lactation: "Data tidak ada. Hindari menyusui.",
    lactation_note: null as any
  },
  monitoring: {
    efficacy: ["RASS setiap 2 jam", "CAM-ICU harian (delirium)", "Kemampuan pasien untuk bangun dan komunikasi"],
    safety: ["HR — bradikardia (target >50 bpm)", "TD setiap 15 menit pertama", "EKG jika bradikardia berat"],
    frequency: "Monitoring RASS setiap 2–4 jam. Tanda vital setiap 15–30 menit selama titrasi.",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Bradikardia berat (HR <40) — terutama dengan loading dose", "Hipotensi berat — terutama hipovolemia"],
    common: ["Bradikardia (21–42%)", "Hipotensi (25–54%)", "Mulut kering", "Nausea", "Agitasi rebound saat stop mendadak"],
    antidote: "Bradikardia berat: Atropin 0.5–1 mg IV. Stop infus sementara."
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "β-blocker", effect: "Potensiasi bradikardia dan hipotensi" },
      { drug: "Digoksin", effect: "Bradikardia sinergistik" },
      { drug: "Anestesi/sedatif lain", effect: "Potensiasi sedasi — kurangi dosis" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: true,
  pump_drug_key: "deksmedetomidin",
  evidence: [
    { ref_id: "devlin2018", note: "PADIS 2018: Pilihan sedasi ICU non-GABA, preservasi napas spontan" }
  ]
},

"midazolam": {
  name: "Midazolam",
  brand_id: ["Dormicum", "Miloz", "Midazolam Hameln", "Midazolam Kalbe"],
  brand_id_notes: "Dormicum paling umum. Miloz (Pfizer). Tersedia di semua RS Indonesia.",
  class: "Benzodiazepin",
  subclass: "Sedatif GABA-ergik",
  category: ["sedasi"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua ICU Indonesia. Harga murah.",
  mechanism: "Modulator allosterik positif reseptor GABA-A → ↑ frekuensi pembukaan kanal Cl⁻ → hiperpolarisasi → inhibisi SSP. Efek: sedasi, ansiolitik, amnesia anterograd, antikonvulsan, relaksasi otot.",
  pkpd_type: null as any,
  pkpd_note: "Konteks-sensitif: waktu pemulihan meningkat signifikan pada infus berkepanjangan karena akumulasi metabolit aktif (1-OH-midazolam) terutama pada gagal ginjal.",
  spectrum: null as any,
  indications: {
    icu_primary: ["Status epileptikus (first-line IM atau IV)", "Sedasi prosedural ICU jangka pendek", "Sedasi pada kondisi dimana propofol tidak tersedia/kontraindikasi"],
    icu_secondary: ["Withdrawal alkohol (CIWA protokol)", "Sedasi pada ARDS berat memerlukan RASS -4/-5 (setelah propofol/deks gagal)", "Premedikasi"],
    local_guideline: "PERDICI: Midazolam tidak direkomendasikan sebagai sedatif utama ICU (delirium ↑). Gunakan untuk status epileptikus.",
    intl_guideline: "SCCM PADIS 2018: HINDARI benzodiazepin sebagai sedatif rutin ICU — meningkatkan delirium dan durasi ventilasi. ESICM: Midazolam hanya jika propofol/deks tidak tersedia atau kontraindikasi."
  },
  contraindications: ["Glaukoma sudut sempit akut", "Hipersensitivitas terhadap benzodiazepin", "Miastenia gravis berat"],
  precautions: ["Delirium ICU — benzodiazepin signifikan meningkatkan risiko", "Akumulasi pada gagal ginjal (metabolit 1-OH-midazolam)", "Depresi napas — risiko apnea terutama dengan opioid", "Toleransi dan ketergantungan pada penggunaan berkepanjangan"],
  dosing: {
    standard: "Infus: 0.02–0.1 mg/kg/jam IV kontinyu",
    range_low: "0.01–0.02 mg/kg/jam",
    range_high: "0.2 mg/kg/jam (refrakter)",
    max: "0.2 mg/kg/jam (agitasi refrakter)",
    loading: "0.02–0.05 mg/kg IV pelan (prosedur). Status epileptikus: 0.1–0.2 mg/kg IV/IM.",
    maintenance: "Infus titrasi per RASS. Turunkan dosis setiap 24 jam (SAT).",
    route: ["IV", "IM", "Intranasal", "Bukal"],
    dilution: "50 mg dalam 50 mL NS → 1 mg/mL. Atau 100 mg dalam 100 mL → 1 mg/mL.",
    rate: "(mg/kg/jam × BB) / 1 = mL/jam",
    titration: "Titrasi per RASS. Light sedation lebih diutamakan.",
    special_notes: "Pada gagal ginjal: metabolit aktif 1-OH-midazolam berakumulasi → sedasi berkepanjangan tidak terduga. Monitor RASS lebih sering."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Kurangi 25%", interval: "Normal", note: "Akumulasi metabolit 1-OH-midazolam" },
    r15_30: { dose: "Kurangi 50%", interval: "Normal", note: "Risiko sedasi berkepanjangan" },
    r_lt15: { dose: "Kurangi 50–75%", interval: "Normal", note: "Akumulasi bermakna — pertimbangkan propofol" },
    hd:     { dose: "Kurangi 50%", interval: "Normal", note: "HD tidak menghilangkan metabolit aktif secara bermakna" },
    crrt:   { dose: "Kurangi 25–50%", interval: "Normal", note: "Monitor sedasi ketat" },
    badge: "reduce",
    dialyzable: false,
    monitoring_renal: "RASS setiap 2 jam — waspadai sedasi berkepanjangan. 1-OH-midazolam dapat toksik pada gagal ginjal."
  },
  hepatic_adjustment: {
    child_a: "Normal dengan monitoring", child_b: "Kurangi 25–50%", child_c: "Kurangi 50% — clearance sangat ↓",
    note: "Metabolisme utama CYP3A4 hepatik. Sirosis berat → clearance ↓ signifikan."
  },
  pregnancy: {
    fda_category: "D",
    trimester_1: "Risiko palatoschisis — hindari",
    trimester_2: "Hindari kecuali emergensi",
    trimester_3: "Dapat menyebabkan floppy infant syndrome",
    labor_delivery: "Hindari — risiko depresi napas neonatus dan withdrawal",
    fetal_risk: "Depresi SSP neonatus, floppy infant, withdrawal",
    lactation: "Ekskresi ke ASI. Hindari menyusui atau tunggu 24 jam.",
    lactation_note: "Waktu paruh neonatus sangat panjang"
  },
  monitoring: {
    efficacy: ["RASS setiap 2 jam", "CAM-ICU harian — risiko delirium tinggi"],
    safety: ["RR dan SpO₂ — apnea", "Akumulasi pada gagal ginjal: RASS lebih dalam dari target"],
    frequency: "Monitoring sedasi setiap 2 jam. SAT harian.",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Apnea — terutama kombinasi dengan opioid", "Delirium ICU (meningkatkan risiko 2–3×)", "Akumulasi pada gagal ginjal → koma berkepanjangan"],
    common: ["Sedasi berlebihan", "Amnesia", "Depresi napas", "Hipotensi", "Toleransi"],
    antidote: "Flumazenil 0.2 mg IV, dapat diulang setiap 1 menit, maks 1 mg. Waktu paruh flumazenil pendek — resedasi mungkin terjadi."
  },
  interactions: {
    major: [
      { drug: "Opioid", effect: "Sinergisme depresi napas — risiko apnea fatal", management: "Kurangi dosis keduanya. Monitor SpO₂ kontinyu." }
    ],
    moderate: [
      { drug: "CYP3A4 inhibitor (flukonazol, eritromisin)", effect: "↑ kadar midazolam 3–5× → sedasi berkepanjangan" },
      { drug: "CYP3A4 inducer (rifampisin, fenitoin)", effect: "↓ kadar midazolam → sedasi tidak adekuat" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: true,
  pump_drug_key: "midazolam",
  evidence: [
    { ref_id: "devlin2018", note: "PADIS 2018: Hindari benzodiazepin sebagai sedatif utama ICU" }
  ]
},

"ketamin_icu": {
  name: "Ketamin (ICU)",
  brand_id: ["Ketalar", "Ketamin Hameln", "Ketamin Dexa"],
  brand_id_notes: "Ketalar (Pfizer). Generik lokal tersedia. Tersedia di semua RS Indonesia.",
  class: "Anastetik disosiatif",
  subclass: "Antagonis NMDA",
  category: ["sedasi"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua RS Indonesia. Harga sangat terjangkau.",
  mechanism: "Antagonis non-kompetitif reseptor NMDA → amnesia, analgesia, dan sedasi ('anestesi disosiatif'). Uniknya: mempertahankan tonus otot pernapasan, refleks protektif jalan napas, dan bahkan merangsang kardiovaskular (simpatomimetik). Bronkodilator via β₂ simpatomimetik.",
  pkpd_type: null as any,
  pkpd_note: "Metabolit aktif: norkietamin (1/3–1/5 potensi). Onset IV: 30–60 detik. Durasi bolus: 10–15 menit.",
  spectrum: null as any,
  indications: {
    icu_primary: ["Analgesia/sedasi prosedural ICU (intubasi, drainase, debridemen) tanpa depresi napas", "Sedasi status asmatikus berat (bronkodilatasi)", "Analgesia opioid-sparing (dosis sub-disosiatif 0.1–0.3 mg/kg/jam)"],
    icu_secondary: ["Sedasi pada syok refrakter (efek simpatomimetik mempertahankan MAP)", "Status epileptikus refrakter", "Agen ko-sedasi saat stop propofol (PRIS atau ketersediaan terbatas)"],
    local_guideline: "Tersedia luas, terjangkau — pilihan praktis di ICU dengan keterbatasan sumber daya.",
    intl_guideline: "SCCM PADIS 2018: Ketamin sebagai adjun analgetik opioid-sparing. AHA/ACC: Ketamin untuk intubasi pada syok berat (mempertahankan MAP)."
  },
  contraindications: ["Hipertensi berat tidak terkontrol (efek simpatomimetik)", "Riwayat psikosis atau skizofrenia", "Peningkatan TIK yang signifikan (relatif — data terbaru kurang mendukung kontraindikasi ini)"],
  precautions: ["Emergence reactions (halusinasi, mimpi buruk) — premedikasi benzodiazepin mengurangi risiko", "Hipersalivasi — siapkan suction", "Sekresi oral meningkat — mungkin perlu atropin premedikasi", "Pada hipertensi berat: ↑HR dan BP"],
  dosing: {
    standard: "Bolus sedasi prosedural: 1–2 mg/kg IV (atau 4 mg/kg IM). Sub-disosiatif analgesia: 0.1–0.3 mg/kg/jam infus",
    range_low: "0.1 mg/kg/jam (analgesia adjun)",
    range_high: "2–3 mg/kg bolus (anestesi disosiatif)",
    max: "Infus: 2 mg/kg/jam (status epileptikus). Bolus: tidak ada batas mutlak.",
    loading: "1–2 mg/kg IV pelan (30 detik) atau 4 mg/kg IM",
    maintenance: "Infus 0.1–0.5 mg/kg/jam untuk sedasi. 1–2 mg/kg/jam untuk status epileptikus.",
    route: ["IV", "IM"],
    dilution: "500 mg dalam 50 mL NS → 10 mg/mL. Untuk infus harian: 500 mg dalam 250 mL → 2 mg/mL.",
    rate: "0.2 mg/kg/jam × 70 kg / 10 mg/mL = 1.4 mL/jam",
    titration: "Titrasi per respons klinis dan RASS",
    special_notes: "Premedikasi midazolam 0.03–0.05 mg/kg IV mengurangi emergence reactions. Monitor SpO₂ — ketamin aman namun apnea mungkin pada dosis besar cepat."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal dengan monitoring", interval: "Normal", note: "Akumulasi metabolit" },
    r_lt15: { dose: "Pertimbangkan dosis lebih rendah", interval: "Normal", note: "Data terbatas" },
    hd:     { dose: "Normal", interval: "Normal", note: "Terdialisis sebagian" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: true,
    monitoring_renal: "Monitoring sedasi ketat pada gagal ginjal"
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Kurangi 25%", child_c: "Kurangi 50% — clearance ↓",
    note: "Metabolisme hepatik (CYP2B6, CYP3A4) ke norkietamin aktif."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali emergensi",
    trimester_2: "Dapat digunakan dengan monitoring",
    trimester_3: "Dapat digunakan pada prosedur emergensi",
    labor_delivery: "Induksi SC emergensi: 1–1.5 mg/kg IV (efek simpatomimetik berguna pada syok)",
    fetal_risk: "Depresi SSP neonatus pada dosis tinggi",
    lactation: "Data tidak ada. Hindari menyusui 12 jam post-bolus.",
    lactation_note: null as any
  },
  monitoring: {
    efficacy: ["Level sedasi/analgesia", "RASS jika infus kontinu", "Nyeri (NRS/CPOT)"],
    safety: ["TD dan HR — hipertensi dan takikardia", "SpO₂ — meski aman, apnea mungkin pada dosis besar", "Tanda emergence reactions saat pemulihan"],
    frequency: "Monitoring tanda vital setiap 5 menit selama prosedur",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Emergence reactions: halusinasi, agitasi berat (5–30%) — premedikasi mengurangi", "Laringospasme (jarang, <1%)"],
    common: ["Hipertensi dan takikardia", "Hipersalivasi", "Mual/muntah", "Nystagmus", "Peningkatan TIO"],
    antidote: "Emergence reactions: Midazolam 0.05 mg/kg IV atau propofol 0.5 mg/kg IV"
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Obat antihipertensi", effect: "Ketamin dapat mengatasi efek antihipertensi" },
      { drug: "Tiroid hormone", effect: "Potensiasi efek simpatomimetik ketamin → hipertensi/takikardia" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "devlin2018", note: "PADIS 2018: Ketamin adjun analgetik opioid-sparing ICU" }
  ]
},

"tiopental": {
  name: "Tiopental Natrium",
  brand_id: ["Thiopental Hameln", "Intraval Sodium", "Tiopental Kalbe"],
  brand_id_notes: "Ketersediaan terbatas dan menurun di Indonesia. Gunakan hanya jika propofol tidak tersedia.",
  class: "Barbiturat",
  subclass: "Anastetik intravena ultrashort-acting",
  category: ["sedasi"],
  common_in_id: false,
  common_in_id_note: "Ketersediaan sangat terbatas di Indonesia — propofol lebih sering dipakai",
  mechanism: "Potensiasi GABA-A (↑durasi pembukaan kanal Cl⁻) + inhibisi reseptor AMPA/kainat. Menekan metabolisme serebral (CMRO₂), menurunkan TIK, antikonvulsan kuat. Onset sangat cepat (10–30 detik). Durasi singkat via redistribusi.",
  pkpd_type: null as any,
  pkpd_note: "Konteks-sangat-sensitif: t½ eliminasi 5–12 jam. Akumulasi bermakna pada infus berkepanjangan. Sedasi hari-hari setelah stop.",
  spectrum: null as any,
  indications: {
    icu_primary: ["Status epileptikus refrakter (lini ketiga setelah benzodiazepin + fenitoin gagal)", "Induksi anestesi jika propofol tidak tersedia", "Koma barbiturat untuk TIK refrakter (neurosurgical ICU)"],
    icu_secondary: ["Perlindungan serebral pada TIK refrakter (kontroversial)", "Kejang refrakter pada pasien tidak toleransi propofol"],
    local_guideline: "Panduan status epileptikus Indonesia: Tiopental lini ketiga. Dosis koma barbiturat: target EEG burst-suppression.",
    intl_guideline: "NCS Status Epilepticus 2012/2016: Pentobarbital/tiopental sebagai agen anestesi untuk RSE. Neurocritical care: koma barbiturat TIK >25 cmH₂O refrakter terapi lain."
  },
  contraindications: ["Hipersensitivitas terhadap barbiturat", "Gagal napas tanpa intubasi", "Porfiri akut intermiten — KONTRAINDIKASI ABSOLUT"],
  precautions: ["Hipotensi berat — efek kardiodepresan + vasodilatasi", "Akumulasi bermakna — pemulihan tertunda berhari-hari", "Tidak untuk sedasi rutin ICU — terlalu banyak kelemahan vs propofol"],
  dosing: {
    standard: "Status epileptikus: 3–5 mg/kg IV bolus pelan → infus 1–5 mg/kg/jam",
    range_low: "1 mg/kg/jam (maintenance)",
    range_high: "10 mg/kg/jam (RSE berat)",
    max: "Tidak ada batas kaku — titrasi per EEG burst-suppression",
    loading: "3–5 mg/kg IV bolus (dilakukan pelan, 30–60 detik) untuk induksi/kontrol akut",
    maintenance: "Infus 1–5 mg/kg/jam titrasi per EEG",
    route: ["IV"],
    dilution: "500 mg dalam 20 mL WFI → 25 mg/mL (2.5% solusi). Jangan campurkan dengan larutan asam.",
    rate: "(mg/kg/jam × BB) / 25 = mL/jam",
    titration: "Titrasi per EEG — target burst-suppression (1 burst per 5–10 detik)",
    special_notes: "⚠ pH sangat basa (10–11) — nekrosis jaringan jika ekstravasasi. HANYA via CVC. Larutan 2.5% — JANGAN berikan konsentrasi lebih tinggi."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Kurangi 25%", interval: "Normal", note: "Akumulasi pada GFR rendah" },
    r_lt15: { dose: "Kurangi 50%", interval: "Normal", note: "Protein binding ↓ pada uremia → efek lebih besar" },
    hd:     { dose: "Kurangi 50%", interval: "Normal", note: "HD tidak efektif mengeluarkan tiopental (protein binding tinggi)" },
    crrt:   { dose: "Kurangi 25–50%", interval: "Normal", note: "" },
    badge: "reduce",
    dialyzable: false,
    monitoring_renal: "Sedasi berkepanjangan lebih mungkin pada gagal ginjal. EEG monitoring."
  },
  hepatic_adjustment: {
    child_a: "Kurangi 25%", child_b: "Kurangi 50%", child_c: "Hindari jika memungkinkan — clearance sangat ↓",
    note: "Metabolisme hepatik utama (CYP2C19). Sirosis → clearance ↓ drastis."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali emergensi",
    trimester_2: "Dapat digunakan pada status epileptikus refrakter",
    trimester_3: "Idem",
    labor_delivery: "Dapat digunakan untuk induksi SC emergensi",
    fetal_risk: "Depresi SSP neonatus bermakna",
    lactation: "Hindari menyusui. Ekskresi ke ASI signifikan.",
    lactation_note: null as any
  },
  monitoring: {
    efficacy: ["EEG kontinyu — target burst-suppression untuk koma barbiturat", "TIK monitoring jika tersedia"],
    safety: ["TD — hipotensi berat sangat umum", "EKG — bradikardi", "SpO₂ — apnea", "Fungsi hati dan ginjal setiap 24–48 jam"],
    frequency: "EEG kontinyu wajib jika koma barbiturat. Monitoring hemodinamik invasif direkomendasikan.",
    therapeutic_range: "Target EEG: burst-suppression (koma barbiturat TIK)"
  },
  adverse_effects: {
    critical: ["Hipotensi berat — terutama bolus cepat", "Depresi miokard", "Apnea", "Nekrosis jaringan akibat ekstravasasi (pH sangat basa)"],
    common: ["Hipotensi", "Bradikardi", "Bronkospasme (histamine release)", "Pemulihan tertunda berhari-hari"],
    antidote: "Ekstravasasi: Injeksi NS 0.9% + prokain 0.5% subkutan. Tidak ada antidot spesifik."
  },
  interactions: {
    major: [
      { drug: "CYP2C19 inhibitor (omeprazol, flukonazol)", effect: "↑ kadar tiopental", management: "Monitor sedasi ketat" }
    ],
    moderate: [
      { drug: "Opioid", effect: "Potensiasi depresi napas dan kardiovaskular" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "devlin2018", note: "Barbiturat lini ketiga status epileptikus refrakter — PADIS 2018" }
  ]
},

"fentanil": {
  name: "Fentanil",
  brand_id: ["Fentanyl Hameln", "Fentanil Kalbe", "Durogesic (patch — bukan ICU)"],
  brand_id_notes: "Ampul 50 mcg/mL tersedia luas. Pilihan utama analgesia ICU Indonesia.",
  class: "Opioid",
  subclass: "Opioid sintetik kuat",
  category: ["analgesia"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua ICU Indonesia. Pilihan utama analgesia ICU.",
  mechanism: "Agonis reseptor μ-opioid → analgesia, sedasi, euforia, depresi napas. Lipofilik tinggi → onset sangat cepat (1–2 menit IV). Durasi bolus 30–60 menit. Pada infus kontinu: akumulasi bermakna. TIDAK menyebabkan pelepasan histamin (berbeda dari morfin).",
  pkpd_type: null as any,
  pkpd_note: "Konteks-sangat-sensitif: t½ efektif meningkat drastis setelah infus >12 jam. Metabolit inaktif — tidak terakumulasi toksik pada gagal ginjal (keunggulan vs morfin).",
  spectrum: null as any,
  indications: {
    icu_primary: ["Analgesia pada pasien terintubasi (A1C protocol — Analgesia first)", "Infus kontinu: sedoanalgesia kompromi pada ARDS/syok"],
    icu_secondary: ["Analgesia prosedural (bronkoskopi, CVC insertion, chest tube)", "Analgesia pre-operatif dan perioperatif"],
    local_guideline: "PERDICI: Fentanil pilihan utama analgesia ICU. Protokol A1C (Analgesia, Light sedation, Cognitive status). Target CPOT 0–2.",
    intl_guideline: "SCCM PADIS 2018: Pendekatan analgesia-first. Fentanil atau hidromorfon untuk pasien intubasi. Titrasi per CPOT/NRS."
  },
  contraindications: ["Hipersensitivitas terhadap fentanil", "Depresi napas berat tanpa intubasi dan ventilator"],
  precautions: ["Akumulasi bermakna pada infus >12 jam", "Rigiditas dada pada bolus cepat dosis besar (>5 mcg/kg cepat) — tangani dengan NMB atau nalokson", "Ileus paralitik pada infus lama", "Toleransi dan ketergantungan"],
  dosing: {
    standard: "Infus: 25–100 mcg/jam. Bolus: 25–100 mcg IV pelan.",
    range_low: "25 mcg/jam",
    range_high: "200–400 mcg/jam (toleransi opioid tinggi)",
    max: "Tidak ada batas mutlak — titrasi per nyeri",
    loading: "Bolus 25–50 mcg IV pelan tiap 5–10 menit sampai nyeri terkontrol",
    maintenance: "Infus kontinu 25–100 mcg/jam, titrasi per CPOT/NRS",
    route: ["IV"],
    dilution: "500 mcg dalam 50 mL NS → 10 mcg/mL. Atau 1000 mcg dalam 100 mL → 10 mcg/mL.",
    rate: "mcg/jam / 10 = mL/jam",
    titration: "Naikan 25 mcg/jam tiap 1–2 jam per CPOT. SAT harian.",
    special_notes: "Lebih disukai dari morfin pada gagal ginjal (tidak ada metabolit aktif terakumulasi). Rotasi opioid jika toleransi tinggi."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Monitor sedasi berlebih" },
    r_lt15: { dose: "Normal — metabolit inaktif", interval: "Normal", note: "Keunggulan vs morfin: tidak ada M6G. Monitor sedasi." },
    hd:     { dose: "Normal", interval: "Normal", note: "Tidak terdialisis bermakna" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Fentanil AMAN pada gagal ginjal — tidak ada metabolit aktif toksik. Tetap monitor sedasi."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Kurangi 25%", child_c: "Kurangi 50% — clearance ↓",
    note: "Metabolisme CYP3A4 hepatik ke norfentanil inaktif."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali emergensi",
    trimester_2: "Dapat digunakan pada nyeri berat",
    trimester_3: "Risiko depresi napas dan withdrawal neonatus",
    labor_delivery: "Gunakan dengan sangat hati-hati — siapkan nalokson neonatus",
    fetal_risk: "Depresi napas neonatus, NAS (neonatal abstinence syndrome)",
    lactation: "Diekskresikan ke ASI. Pantau bayi untuk sedasi.",
    lactation_note: "Kadar rendah di ASI — umumnya aman pada dosis terapeutik"
  },
  monitoring: {
    efficacy: ["CPOT (Critical-Care Pain Observation Tool) setiap 2–4 jam", "NRS jika pasien dapat berkomunikasi", "RR dan SpO₂"],
    safety: ["RR < 8/menit = bahaya depresi napas", "Ileus: bising usus, distensi abdomen", "Tanda opioid-induced sedation yang berlebihan"],
    frequency: "CPOT setiap 2–4 jam. SpO₂ kontinyu.",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Depresi napas — apnea (dosis tinggi atau bolus cepat)", "Rigiditas dada pada bolus besar cepat"],
    common: ["Mual/muntah", "Konstipasi/ileus", "Retensi urin", "Bradikardi", "Pruritus (jarang vs morfin)", "Toleransi"],
    antidote: "Nalokson 0.04–0.4 mg IV, dapat diulang setiap 2–3 menit, maks 10 mg. Hati-hati: nalokson juga membalikkan analgesia."
  },
  interactions: {
    major: [
      { drug: "Benzodiazepin/propofol", effect: "Sinergisme depresi napas", management: "Kurangi dosis. Monitor SpO₂ kontinyu." }
    ],
    moderate: [
      { drug: "CYP3A4 inhibitor (flukonazol, eritromisin)", effect: "↑ kadar fentanil → depresi napas berlebih" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: true,
  pump_drug_key: "fentanil",
  evidence: [
    { ref_id: "devlin2018", note: "PADIS 2018: Analgesia-first ICU — fentanil atau hidromorfon IV" }
  ]
},

"morfin": {
  name: "Morfin",
  brand_id: ["Morfin HCl Kimia Farma", "MST Continus (oral)", "Morfin Hameln"],
  brand_id_notes: "Ampul 10 mg/mL dan 20 mg/mL. Tersedia di semua RS Indonesia.",
  class: "Opioid",
  subclass: "Opioid alami",
  category: ["analgesia"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua ICU Indonesia. Lebih murah dari fentanil.",
  mechanism: "Agonis reseptor μ-opioid. Metabolit aktif: M6G (morfin-6-glukoronid) — potensi analgetik 10× > morfin, diekskresikan renal. Menyebabkan pelepasan histamin (tidal vs fentanil) — pruritus dan bronkospasme.",
  pkpd_type: null as any,
  pkpd_note: "M6G berakumulasi pada gagal ginjal → sedasi berkepanjangan, depresi napas bermakna. HINDARI pada eGFR <30.",
  spectrum: null as any,
  indications: {
    icu_primary: ["Analgesia ICU bila fentanil tidak tersedia", "Nyeri kronik kanker di ICU", "Edema paru akut kardiogenik (vasodilatasi + analgesia)"],
    icu_secondary: ["Analgesia post-operasi", "Paliatif ICU"],
    local_guideline: "PERDICI: Fentanil lebih disukai dari morfin di ICU. Morfin sebagai alternatif bila fentanil tidak tersedia.",
    intl_guideline: "SCCM PADIS 2018: Morfin atau fentanil sama-sama direkomendasikan untuk analgesia ICU — namun morfin dihindari pada gagal ginjal."
  },
  contraindications: ["Gagal ginjal berat (eGFR <30) — akumulasi M6G → depresi napas fatal", "Asma berat aktif (histamine release)", "Ileus paralitik"],
  precautions: ["HINDARI pada eGFR <30 — gunakan fentanil sebagai gantinya", "Histamin release: pruritus, hipotensi, bronkospasme", "Akumulasi M6G lebih berbahaya dari morfin itu sendiri pada GFR rendah"],
  dosing: {
    standard: "Infus: 1–5 mg/jam IV. Bolus: 2–5 mg IV pelan.",
    range_low: "1–2 mg/jam",
    range_high: "10–15 mg/jam (toleransi tinggi)",
    max: "Titrasi per nyeri — tidak ada batas mutlak pada nyeri kronis kanker",
    loading: "Bolus 2–4 mg IV pelan, ulangi setiap 5–10 menit per respons",
    maintenance: "Infus 1–5 mg/jam, titrasi per CPOT/NRS",
    route: ["IV", "IM", "SC", "Oral"],
    dilution: "50 mg dalam 50 mL NS → 1 mg/mL.",
    rate: "mg/jam / 1 = mL/jam",
    titration: "Naikan 1 mg/jam tiap 2–4 jam per CPOT",
    special_notes: "⚠ GANTI dengan fentanil jika eGFR <30 mL/min — M6G berakumulasi dan menyebabkan depresi napas berkepanjangan."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal",  interval: "Normal", note: "" },
    r30_60: { dose: "Kurangi 25–50%", interval: "q6–8j", note: "M6G mulai terakumulasi" },
    r15_30: { dose: "Kurangi 50–75%", interval: "q8–12j", note: "Risiko M6G tinggi — pertimbangkan fentanil" },
    r_lt15: { dose: "HINDARI", interval: "—", note: "Akumulasi M6G → depresi napas berkepanjangan, koma. Ganti dengan FENTANIL." },
    hd:     { dose: "HINDARI", interval: "—", note: "M6G tidak terdialisis efektif. GUNAKAN FENTANIL." },
    crrt:   { dose: "Dosis sangat rendah jika mutlak perlu", interval: "Monitor ketat", note: "Fentanil lebih aman" },
    badge: "avoid",
    dialyzable: false,
    monitoring_renal: "⚠ HINDARI jika eGFR <30. M6G berakumulasi dan menyebabkan depresi napas FATAL yang tidak reversibel dengan nalokson standar."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Kurangi 25–50%", child_c: "Kurangi 50% — gunakan hati-hati",
    note: "Metabolisme hepatik via glucuronidasi (UGT2B7). Disfungsi hati: clearance ↓."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari kecuali emergensi",
    trimester_2: "Dapat digunakan dengan monitoring",
    trimester_3: "Risiko NAS neonatus",
    labor_delivery: "Gunakan dengan hati-hati — siapkan nalokson neonatus",
    fetal_risk: "Depresi napas neonatus, NAS",
    lactation: "Ekskresi rendah ke ASI. Monitor bayi.",
    lactation_note: null as any
  },
  monitoring: {
    efficacy: ["CPOT setiap 2–4 jam", "NRS jika pasien komunikatif"],
    safety: ["RR — apnea (<8/menit: bahaya)", "SpO₂ kontinyu", "Fungsi ginjal harian jika infus lama"],
    frequency: "CPOT setiap 2–4 jam. Kreatinin setiap 24–48 jam.",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Depresi napas — apnea, terutama pada gagal ginjal (M6G)", "Bronkospasme pada asma (histamine)"],
    common: ["Pruritus (histamine release)", "Mual/muntah", "Konstipasi berat", "Retensi urin", "Hipotensi", "Bradikardi"],
    antidote: "Nalokson 0.04–0.4 mg IV. Perhatian: t½ nalokson < t½ morfin/M6G — resedasi mungkin terjadi."
  },
  interactions: {
    major: [
      { drug: "Benzodiazepin", effect: "Sinergisme depresi napas", management: "Kurangi dosis. Monitor SpO₂." }
    ],
    moderate: [
      { drug: "MAO Inhibitor", effect: "Serotonin syndrome dan depresi napas berat", management: "Kontraindikasi — tunggu 14 hari" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "devlin2018", note: "PADIS 2018: Morfin atau fentanil — namun hindari morfin pada eGFR <30" }
  ]
},

"remifentanil": {
  name: "Remifentanil",
  brand_id: ["Ultiva", "Remifentanil Hameln"],
  brand_id_notes: "Ultiva (Aspen/GSK). Tersedia sangat terbatas dan harga sangat mahal di Indonesia.",
  class: "Opioid",
  subclass: "Opioid ultra-short-acting",
  category: ["analgesia"],
  common_in_id: false,
  common_in_id_note: "Tersedia sangat terbatas — RS tersier dan swasta besar Indonesia",
  mechanism: "Agonis μ-opioid. UNIK: Metabolisme oleh esterase plasma dan jaringan → t½ 3–10 menit TANPA akumulasi meski infus berkepanjangan. Prediktabilitas pemulihan yang sangat tinggi. Metabolit (remifentanil asam) inaktif — aman pada gagal ginjal.",
  pkpd_type: null as any,
  pkpd_note: "Tidak ada efek konteks-sensitif — t½ tetap 3–10 menit berapa pun lama infus. Pemulihan sempurna dalam 10–15 menit setelah stop.",
  spectrum: null as any,
  indications: {
    icu_primary: ["Sedoanalgesia ICU dengan kebutuhan pemulihan cepat (weaning, neurological assessment)", "Analgesia TIVA (total intravenous anesthesia) di OR"],
    icu_secondary: ["Prosedur ICU yang memerlukan analgesia kuat namun singkat", "Pasien neurologis yang perlu pemeriksaan neurologi berkala tanpa sedasi residual"],
    local_guideline: "Tidak ada guideline lokal spesifik. Mahal — penggunaan terbatas.",
    intl_guideline: "SCCM PADIS 2018: Remifentanil sebagai alternatif pada pasien yang butuh waktu pemulihan pendek (weaning cepat, neurological monitoring)."
  },
  contraindications: ["Hipersensitivitas terhadap remifentanil", "Tidak untuk injeksi neuraxial (formula mengandung glisin)"],
  precautions: ["Analgesic gap saat stop — WAJIB berikan analgesik transisi sebelum stop", "Rigiditas dada jika bolus cepat dosis besar", "Depresi napas — meski reversibel cepat"],
  dosing: {
    standard: "Analgesia ICU: 0.025–0.2 mcg/kg/min IV kontinyu",
    range_low: "0.025 mcg/kg/min",
    range_high: "0.2–0.5 mcg/kg/min (prosedur)",
    max: "1 mcg/kg/min (prosedur, jarang)",
    loading: "Tidak dianjurkan rutin (rigiditas). Jika perlu: 0.5–1 mcg/kg pelan 30–60 detik.",
    maintenance: "Infus titrasi per CPOT/NRS",
    route: ["IV"],
    dilution: "5 mg dalam 250 mL NS atau D5W → 20 mcg/mL. Atau 2 mg dalam 100 mL → 20 mcg/mL.",
    rate: "(mcg/kg/min × BB × 60) / 20 = mL/jam",
    titration: "Naikan/turunkan 0.025–0.05 mcg/kg/min setiap 5–10 menit",
    special_notes: "⚠ WAJIB siapkan analgesik transisi (fentanil atau morfin) 15–30 menit SEBELUM stop remifentanil — analgesic gap menyebabkan nyeri akut dan agitasi hebat."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Aman — metabolisme non-renal" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "Metabolit inaktif. AMAN pada gagal ginjal." },
    hd:     { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Remifentanil AMAN pada gagal ginjal — metabolisme esterase non-hepatik non-renal"
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal — metabolisme esterase, bukan hepatik",
    note: "TIDAK memerlukan penyesuaian pada gangguan hati — esterase plasma."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Hindari",
    trimester_2: "Hanya emergensi",
    trimester_3: "Data SC: crossing plasenta namun metabolisme cepat pada neonatus",
    labor_delivery: "Dapat digunakan pada SC emergensi — pemulihan neonatus cepat",
    fetal_risk: "Depresi napas neonatus transien — pemulihan cepat",
    lactation: "Aman untuk menyusui — t½ sangat pendek",
    lactation_note: null as any
  },
  monitoring: {
    efficacy: ["CPOT setiap 2–4 jam", "Persiapan analgesik transisi sebelum stop"],
    safety: ["SpO₂ kontinyu", "RR — apnea meski reversibel cepat"],
    frequency: "CPOT setiap 2 jam. SpO₂ kontinyu.",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Analgesic gap saat stop mendadak → nyeri akut dan agitasi berat", "Apnea (reversibel dalam menit)"],
    common: ["Depresi napas (dosis-dependen)", "Bradikardi", "Rigiditas dada (bolus cepat)", "Mual"],
    antidote: "Nalokson 0.04–0.4 mg IV. Namun t½ remifentanil sangat pendek — mungkin tidak diperlukan."
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Sedatif/anestesi", effect: "Sinergisme depresi napas" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "devlin2018", note: "Alternatif analgesia ICU pada kebutuhan weaning/pemeriksaan neurologis cepat" }
  ]
},

"parasetamol_iv": {
  name: "Parasetamol IV (Acetaminophen)",
  brand_id: ["Paracetamol Fresenius", "Perfalgan", "Paracetamol B. Braun"],
  brand_id_notes: "Perfalgan (Bristol-Myers Squibb) originator. Tersedia di RS besar Indonesia. Lebih mahal dari oral.",
  class: "Analgetik-antipiretik non-opioid",
  subclass: "Inhibitor COX sentral / aktivasi TRPV1 spinal",
  category: ["analgesia"],
  common_in_id: true,
  common_in_id_note: "Tersedia di RS besar. Tablet/sirup lebih umum — IV untuk pasien tidak bisa oral.",
  mechanism: "Mekanisme belum sepenuhnya dipahami. Inhibisi COX-3 sentral, modulasi sistem endokanabinoid spinal (TRPV1), dan jalur serotoninergik desenden. Tidak memiliki efek antiinflamasi perifer bermakna (bukan NSAID). Analgesia dan antipiretik tanpa efek gastrointestinal atau antiplatelet.",
  pkpd_type: null as any,
  pkpd_note: "Onset IV: 15–30 menit. Durasi: 4–6 jam. Bioavailabilitas IV > oral pada kondisi syok/hipoperfusi GI.",
  spectrum: null as any,
  indications: {
    icu_primary: ["Analgesia non-opioid — bagian dari strategi opioid-sparing multimodal", "Demam — antipiretik lini pertama (lebih aman dari NSAID di ICU)", "Nyeri ringan-sedang pada pasien ICU"],
    icu_secondary: ["Ko-analgesia bersama opioid → mengurangi kebutuhan opioid 20–30%", "Pasien dengan kontraindikasi NSAID (gagal ginjal, peptic ulcer)"],
    local_guideline: "PERDICI: Parasetamol sebagai analgesik multimodal dan antipiretik lini pertama. Aman pada gagal ginjal.",
    intl_guideline: "SCCM PADIS 2018: Parasetamol sebagai ko-analgesik untuk mengurangi konsumsi opioid ICU."
  },
  contraindications: ["Gagal hati berat (Child-Pugh C — kontraindikasi relatif)", "Hipersensitivitas terhadap parasetamol", "Fenilketonuria (formulasi tertentu mengandung aspartam)"],
  precautions: ["Batas aman 4 g/hari — SANGAT PENTING diikuti", "Alkoholisme kronik: hepatotoksik pada dosis lebih rendah (2 g/hari lebih aman)", "Malnutrisi berat: cadangan glutathion ↓ → hepatotoksisitas"],
  dosing: {
    standard: "1 g IV setiap 6–8 jam (infus 15 menit)",
    range_low: "500 mg IV setiap 6 jam",
    range_high: "1 g IV setiap 4 jam (maks 4 g/hari)",
    max: "4 g/hari (3 g/hari pada elderly, alkoholisme, malnutrisi)",
    loading: null as any,
    maintenance: "1 g IV setiap 6 jam rutin (bukan PRN — kadar stabil lebih efektif)",
    route: ["IV", "Oral", "Rektal"],
    dilution: "Ready-to-use 10 mg/mL (100 mL = 1 g). Infus selama 15 menit.",
    rate: "100 mL selama 15 menit",
    titration: "Dosis reguler lebih efektif dari PRN untuk nyeri kronis/persisteren",
    special_notes: "Hindari double-dosis dari kombinasi yang mengandung parasetamol (kombinasi OBH, paracetamol oral, dll) — hepatotoksik."
  },
  renal_adjustment: {
    ge60:   { dose: "1 g",   interval: "q6j", note: "" },
    r30_60: { dose: "1 g",   interval: "q6j", note: "Aman" },
    r15_30: { dose: "1 g",   interval: "q6–8j", note: "Perpanjang interval" },
    r_lt15: { dose: "500mg–1g", interval: "q8j", note: "Akumulasi metabolit minor. Umumnya aman." },
    hd:     { dose: "1 g",   interval: "q8j post-HD", note: "Terdialisis sebagian" },
    crrt:   { dose: "1 g",   interval: "q6–8j", note: "" },
    badge: "safe",
    dialyzable: true,
    monitoring_renal: "Parasetamol AMAN pada gagal ginjal — pilih ini dibanding NSAID/morfin"
  },
  hepatic_adjustment: {
    child_a: "Normal (maks 3 g/hari)", child_b: "1 g q8j (maks 2 g/hari)", child_c: "Kontraindikasi relatif — bila mutlak: 500 mg q8j",
    note: "Metabolisme hepatik utama. Overdosis → NAPQI toksik → gagal hati akut."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Aman — pilihan analgesik/antipiretik pada kehamilan",
    trimester_2: "Aman",
    trimester_3: "Aman dalam dosis terapeutik",
    labor_delivery: "Aman",
    fetal_risk: "Tidak ada bukti teratogenik pada dosis terapeutik",
    lactation: "Aman — ekskresi ke ASI minimal",
    lactation_note: "Pilihan analgesik paling aman saat laktasi"
  },
  monitoring: {
    efficacy: ["NRS/CPOT setiap 4–6 jam", "Suhu tubuh jika sebagai antipiretik"],
    safety: ["LFT (ALT/AST) setiap 48–72 jam pada pasien risiko hepatotoksisitas", "Pastikan tidak ada double-dosing parasetamol dari sumber lain"],
    frequency: "Monitoring nyeri setiap 4–6 jam.",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Hepatotoksik pada overdosis (>4 g/hari, atau lebih rendah pada alkoholisme/malnutrisi)", "Gagal hati akut fulminan — NAC (N-acetylcysteine) sebagai antidot"],
    common: ["Umumnya sangat baik ditoleransi", "Trombositopenia (jarang)", "Hipersensitivitas (jarang)"],
    antidote: "Overdosis: N-acetylcysteine (NAC) IV. Loading 150 mg/kg dalam 200 mL D5W (60 menit) → 50 mg/kg/4 jam → 100 mg/kg/16 jam."
  },
  interactions: {
    major: [
      { drug: "Warfarin", effect: "↑ INR — parasetamol dosis tinggi (>2 g/hari reguler) → ↑ efek antikoagulan", management: "Monitor INR jika dosis tinggi reguler" }
    ],
    moderate: [
      { drug: "Alkohol kronik", effect: "↑ risiko hepatotoksisitas — gunakan dosis rendah" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "devlin2018", note: "PADIS 2018: Analgesik multimodal opioid-sparing di ICU" }
  ]
},

"ketorolak": {
  name: "Ketorolak (Ketorolac)",
  brand_id: ["Toradol", "Ketorolac Dexa", "Torasic", "Dolac"],
  brand_id_notes: "Tersedia luas di Indonesia. Ampoule 30 mg/mL. Relatif murah.",
  class: "NSAID",
  subclass: "Analgetik non-opioid (COX inhibitor)",
  category: ["analgesia"],
  common_in_id: true,
  common_in_id_note: "Tersedia di semua RS Indonesia. Sering digunakan post-operasi.",
  mechanism: "Inhibisi non-selektif COX-1 dan COX-2 → ↓ sintesis prostaglandin → analgesia dan antiinflamasi. TIDAK menyebabkan sedasi atau depresi napas. Analgesia setara morfin 6–12 mg untuk nyeri akut. Efek antiplatelet via COX-1.",
  pkpd_type: null as any,
  pkpd_note: "Dosis tunggal efektif 6–8 jam. Jangan gunakan >5 hari — risiko GI dan renal meningkat dramatis.",
  spectrum: null as any,
  indications: {
    icu_primary: ["Nyeri post-operasi akut — opioid-sparing", "Nyeri muskuloskeletal/pleuritik pada pasien ICU"],
    icu_secondary: ["Ko-analgesia dalam protokol multimodal", "Kolic renal (nyeri hebat tanpa indikasi opioid)"],
    local_guideline: "Digunakan luas post-operasi Indonesia. Hindari pada gagal ginjal.",
    intl_guideline: "SCCM PADIS 2018: NSAID sebagai adjun analgesia multimodal. Hindari pada pasien dengan risiko AKI, GI bleed, atau trombosit rendah."
  },
  contraindications: ["Gagal ginjal (AKI atau CKD eGFR <30) — nefrotoksik", "Riwayat ulkus peptikum aktif atau perdarahan GI", "Koagulopati atau trombositopenia <100.000", "Pasien post-CABG (meningkatkan risiko kardiovaskular)", "Dehidrasi berat"],
  precautions: ["Gunakan maksimum 5 hari", "Hindari kombinasi dengan antikoagulan (↑ risiko perdarahan GI)", "Monitoring urin output dan kreatinin", "Pada syok: hindari — vasokonstriksi renal memperburuk perfusi"],
  dosing: {
    standard: "15–30 mg IV/IM setiap 6 jam",
    range_low: "15 mg IV/IM (elderly, BB <50 kg, eGFR 30–60)",
    range_high: "30 mg IV/IM q6j",
    max: "120 mg/hari (atau 90 mg/hari pada elderly/BB rendah/CKD ringan)",
    loading: "Dosis pertama boleh 30–60 mg IM (dosis tunggal)",
    maintenance: "15–30 mg IV/IM setiap 6 jam — MAKS 5 HARI",
    route: ["IV", "IM"],
    dilution: "Dapat diberikan langsung undiluted IV pelan (>15 detik) atau diencerkan dalam 50 mL NS.",
    rate: "IV pelan >15 detik. Atau infus 15 menit jika diencerkan.",
    titration: null as any,
    special_notes: "⚠ BATAS 5 HARI KETAT — risiko GI dan renal meningkat tajam setelah hari ke-5. Transisi ke analgesik oral segera bila bisa."
  },
  renal_adjustment: {
    ge60:   { dose: "30 mg q6j", interval: "Normal", note: "" },
    r30_60: { dose: "15 mg q6j", interval: "Normal", note: "Kurangi dosis 50%. Monitor kreatinin." },
    r15_30: { dose: "HINDARI", interval: "—", note: "Risiko AKI sangat tinggi. Gunakan parasetamol." },
    r_lt15: { dose: "HINDARI", interval: "—", note: "Kontraindikasi — nefrotoksik berat" },
    hd:     { dose: "HINDARI", interval: "—", note: "Kontraindikasi" },
    crrt:   { dose: "HINDARI", interval: "—", note: "Kontraindikasi" },
    badge: "avoid",
    dialyzable: false,
    monitoring_renal: "⚠ HINDARI pada eGFR <30. Monitor kreatinin setiap 24–48 jam jika eGFR 30–60."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Gunakan dengan hati-hati — risiko GI ↑", child_c: "Hindari — risiko perdarahan variseal dan GI",
    note: "Metabolisme hepatik. Sirosis: risiko perdarahan GI dan variseal ↑."
  },
  pregnancy: {
    fda_category: "C (TM 1–2) / D (TM 3)",
    trimester_1: "Hindari — teratogen pada hewan",
    trimester_2: "Hindari jika memungkinkan",
    trimester_3: "KONTRAINDIKASI — penutupan dukus arteriosus prematur, oligohidramnios",
    labor_delivery: "Kontraindikasi — perdarahan maternal dan neonatus",
    fetal_risk: "TM 3: penutupan dukus arteriosus, oligohidramnios, hipertensi pulmonal neonatus",
    lactation: "Hindari — ekskresi ke ASI bermakna",
    lactation_note: null as any
  },
  monitoring: {
    efficacy: ["NRS/CPOT setiap 4–6 jam"],
    safety: ["Kreatinin dan urin output setiap 24–48 jam", "Tanda perdarahan GI (melena, hematemesis)", "Trombosit jika perdarahan"],
    frequency: "Monitor fungsi ginjal setiap 24–48 jam selama penggunaan",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["AKI (terutama pada hipovolemia, CKD, elderly)", "Perdarahan GI berat", "Perdarahan post-operasi (antiplatelet)"],
    common: ["Dispepsia", "Mual", "↑ kreatinin transien", "Retensi cairan", "Sakit kepala"],
    antidote: null as any
  },
  interactions: {
    major: [
      { drug: "Antikoagulan (warfarin, heparin, LMWH)", effect: "↑ risiko perdarahan GI dan sistemik", management: "Hindari kombinasi atau monitor sangat ketat" }
    ],
    moderate: [
      { drug: "ACE Inhibitor/ARB", effect: "↑ risiko AKI (tripple whammy: NSAID+ACEi+diuretik)" },
      { drug: "Kortikosteroid", effect: "↑ risiko ulkus peptikum dan perdarahan GI" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "devlin2018", note: "PADIS 2018: NSAID sebagai komponen analgesia multimodal; hindari pada risiko AKI/GI" }
  ]
}

};
