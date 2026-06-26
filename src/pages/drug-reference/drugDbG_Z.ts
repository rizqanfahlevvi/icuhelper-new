import { DrugDatabase } from './types';

export const ICU_DRUGS: DrugDatabase = {

"citicoline": {
  name: "Citicoline (CDP-Choline)",
  brand_id: ["Brainact", "Bralin", "Neulin", "Citicoline Bernofarm"],
  brand_id_notes: "Sangat umum diresepkan sebagai neuroprotektor di Indonesia.",
  class: "Neuroprotektor",
  subclass: "Nootropik",
  category: ["neuro"],
  common_in_id: true,
  common_in_id_note: "Sering digunakan empiris di IGD/ICU pada stroke iskemik maupun hemoragik.",
  mechanism: "Prekursor fosfatidilkolin (komponen membran sel saraf). Diduga memperbaiki membran sel neuron, mengurangi disfungsi kognitif, dan menekan apoptosis pada iskemia serebral.",
  pkpd_type: null as any,
  pkpd_note: null as any,
  spectrum: null as any,
  indications: {
    icu_primary: ["Stroke iskemik akut", "Cedera kepala traumatik (TBI)", "Penyakit serebrovaskular kronik"],
    icu_secondary: ["Ensefalopati metabolik (off-label)", "Gangguan kognitif pasca trauma/stroke"],
    local_guideline: "PERDOSSI (Perhimpunan Dokter Spesialis Saraf Indonesia): sering direkomendasikan sebagai ajuvan neuroprotektor pada fase akut stroke.",
    intl_guideline: "Cochrane Review 2020: Bukti efikasi citicoline masih diperdebatkan di panduan internasional (AHA/ASA tidak memasukkan sebagai terapi standar wajib), namun luas dipakai di Asia & Eropa."
  },
  contraindications: ["Hipersensitivitas terhadap citicoline", "Hipertonia parasimpatik"],
  precautions: ["Bukan pengganti terapi trombolitik pada stroke iskemik akut", "Bisa menyebabkan eksitasi/insomnia jika diberikan malam hari"],
  dosing: {
    standard: "250-1000 mg IV setiap 12-24 jam",
    range_low: "250 mg IV/IM",
    range_high: "1000 mg IV/IM",
    max: "2000 mg/hari",
    loading: null as any,
    maintenance: "Dosis dapat dilanjutkan per oral setelah pasien stabil.",
    route: ["IV", "IM", "PO"],
    dilution: "Dapat diberikan langsung (bolus lambat) atau dilarutkan dalam NS/D5W.",
    rate: "Injeksi IV lambat: 3-5 menit.",
    titration: null as any,
    special_notes: "Evaluasi respon klinis. Jika perdarahan intrakranial persisten, monitor ketat karena teori vasodilatasi (meski jarang)."
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
    monitoring_renal: "Kadar obat tidak bergantung pada fungsi ginjal secara signifikan"
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal",
    note: "Dimetabolisme cepat di dinding usus/hati menjadi kolin dan sitidin."
  },
  pregnancy: {
    fda_category: "Belum ditetapkan",
    trimester_1: "Hindari kecuali sangat perlu",
    trimester_2: "Gunakan bila manfaat melebihi risiko",
    trimester_3: "Gunakan bila manfaat melebihi risiko",
    labor_delivery: "Aman, tidak ada efek spesifik",
    fetal_risk: "Studi hewan tidak menunjukkan teratogenisitas pada dosis terapi",
    lactation: "Tidak diketahui apakah diekskresi ke ASI",
    lactation_note: "Sebaiknya hindari kecuali indikasi kuat"
  },
  monitoring: {
    efficacy: ["GCS (Glasgow Coma Scale)", "Tanda-tanda vital neuro (pupil, motorik)", "Skala stroke (NIHSS)"],
    safety: ["Agitasi / gelisah", "Sakit kepala", "Tekanan darah (dapat sedikit ↓ atau ↑)"],
    frequency: "Setiap hari selama fase akut",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Jarang terjadi efek samping fatal"],
    common: ["Sakit kepala", "Insomnia", "Agitasi", "Mual", "Hipotensi sementara"],
    antidote: null as any
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Levodopa", effect: "Dapat meningkatkan efek Levodopa", management: "Bisa menurunkan dosis Levodopa jika muncul efek aditif" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "perdossi", note: "Digunakan luas di Asia untuk neuroproteksi pasca cedera akut SSP." }
  ]
},

"piracetam": {
  name: "Piracetam",
  brand_id: ["Nootropil", "Neurotam", "Piracetam Dexa"],
  brand_id_notes: "Generik sangat tersedia luas di BPJS/RS Pemerintah.",
  class: "Neuroprotektor",
  subclass: "Derivat GABA",
  category: ["neuro"],
  common_in_id: true,
  common_in_id_note: "Sering menjadi pendamping terapi pada penurunan kesadaran/cedera otak akut.",
  mechanism: "Derivat siklik GABA yang bekerja pada sistem saraf pusat. Diduga melindungi neuron dari hipoksia, memperbaiki mikrosirkulasi tanpa efek vasodilatasi, dan modulasi transmisi glutamaterejik/kolinergik.",
  pkpd_type: null as any,
  pkpd_note: null as any,
  spectrum: null as any,
  indications: {
    icu_primary: ["Mioplonus kortikal (indikasi paling kuat di literatur Barat)", "Sindrom involusi terkait usia (demensia/gangguan memori)"],
    icu_secondary: ["TBI (Cedera Kepala)", "Stroke iskemik akut", "Vertigo / pusing pasca trauma"],
    local_guideline: "Sering digunakan di Indonesia untuk fase akut TBI atau stroke, walau evidence Barat lemah.",
    intl_guideline: "Hanya disetujui FDA untuk myoclonus kortikal (sebagai orphan drug). Di Eropa luas dipakai untuk kognisi."
  },
  contraindications: ["Gagal ginjal stadium akhir (ESRD) tanpa dialisis", "Perdarahan serebral luas (relatif - menurut pabrikan hati-hati pada perdarahan berat karena efek inhibisi agregasi trombosit ringan)", "Huntington's chorea"],
  precautions: ["Gangguan ginjal sedang-berat perlu penyesuaian dosis", "Hati-hati pada pasien dengan risiko perdarahan tinggi, ulkus GI parah, atau riwayat stroke hemoragik"],
  dosing: {
    standard: "1-3 g IV bolus/infus setiap 8-12 jam",
    range_low: "1 g/hari",
    range_high: "12 g/hari (untuk mioklonus kortikal berat)",
    max: "24 g/hari (hanya indikasi khusus)",
    loading: "12 g IV dibagi 2-4 dosis pada fase sangat akut (tergantung protokol RS)",
    maintenance: "1-3 g IV setiap 8 jam",
    route: ["IV", "PO"],
    dilution: "Bisa dilarutkan dalam NS, RL, atau D5W.",
    rate: "Bolus IV lambat (beberapa menit) atau drip kontinyu.",
    titration: null as any,
    special_notes: "Penghentian tiba-tiba pada myoclonus dapat mencetuskan myoclonic/generalized seizure."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Kurangi dosis", interval: "Normal", note: "Dosis menjadi 2/3" },
    r15_30: { dose: "Kurangi dosis", interval: "Normal", note: "Dosis menjadi 1/3" },
    r_lt15: { dose: "Kurangi dosis ekstrim / HINDARI", interval: "Normal", note: "Dosis 1/6" },
    hd:     { dose: "Disesuaikan post HD", interval: "Normal", note: "Piracetam diekskresi via ginjal secara utuh >95%" },
    crrt:   { dose: "Monitor klirens", interval: "Normal", note: "" },
    badge: "adjust",
    dialyzable: true,
    monitoring_renal: "Kreatinin wajib dicek sebelum inisiasi terapi dosis tinggi."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal",
    note: "Tidak dimetabolisme di hati."
  },
  pregnancy: {
    fda_category: "Belum ditetapkan",
    trimester_1: "Sebaiknya dihindari",
    trimester_2: "Sebaiknya dihindari",
    trimester_3: "Sebaiknya dihindari",
    labor_delivery: "Aman",
    fetal_risk: "Menembus sawar plasenta. Hati-hati.",
    lactation: "Diekskresikan ke ASI. Hindari menyusui.",
    lactation_note: "Pabrik menyarankan stop menyusui selama terapi."
  },
  monitoring: {
    efficacy: ["Perbaikan kesadaran", "Fungsi kognitif", "Frekuensi mioklonus"],
    safety: ["Profil koagulasi (jika ada masalah perdarahan)", "Fungsi ginjal secara periodik"],
    frequency: "Evaluasi harian",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Reaksi alergi/anafilaksis (jarang)"],
    common: ["Hiperkinesia", "Kenaikan berat badan", "Nervousness/Gelisah", "Depresi", "Asthenia"],
    antidote: null as any
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Antikoagulan / Antiplatelet", effect: "Potensiasi efek perdarahan", management: "Monitor INR/PT jika digunakan bersama warfarin atau aspirin dosis tinggi" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "ema2020", note: "Di Eropa masih disetujui untuk mioklonus kortikal, tapi untuk kognisi dibatasi." }
  ]
},

"lola": {
  name: "L-Ornithine L-Aspartate (LOLA)",
  brand_id: ["Hepamerz", "Lola", "Sola", "Aminoleban (mengandung BCAAs)"],
  brand_id_notes: "Sering digunakan pada pasien kritis dengan gangguan hati dan hiperamonemia.",
  class: "Hepatoprotektor / Penurun Amonia",
  subclass: "Asam amino",
  category: ["hepato"],
  common_in_id: true,
  common_in_id_note: "Rutin diresepkan di ICU untuk Hepatic Encephalopathy (HE).",
  mechanism: "Menstimulasi siklus urea di hati (ornithine) dan sintesis glutamin di hati, otot, & otak (aspartate), yang pada akhirnya akan mengikat dan membersihkan amonia (NH3) dari sirkulasi darah.",
  pkpd_type: null as any,
  pkpd_note: null as any,
  spectrum: null as any,
  indications: {
    icu_primary: ["Ensefalopati Hepatik (Hepatic Encephalopathy)", "Hiperamonemia sekunder pada penyakit hati kronik/akut"],
    icu_secondary: ["Sirosis hepatis dekompensata (sebagai terapi suportif)"],
    local_guideline: "PGI (Perkumpulan Gastroenterologi Indonesia): Rekomendasi tambahan setelah laktulosa / rifaximin pada HE.",
    intl_guideline: "EASL/AASLD: LOLA adalah obat lini kedua/ajuvan yang efektif menurunkan level amonia darah dan memperbaiki status mental pada HE persisten."
  },
  contraindications: ["Gangguan fungsi ginjal berat (Kreatinin >3 mg/dL)", "Hipersensitivitas"],
  precautions: ["Bukan monoterapi untuk ensefalopati hepatik", "Pemberian dosis tinggi (ampul) bisa menyebabkan mual jika diberikan terlalu cepat"],
  dosing: {
    standard: "10-20 g (2-4 ampul) IV drip dalam 24 jam",
    range_low: "10 g IV/hari",
    range_high: "40 g IV/hari (kondisi pre-koma atau koma hepatikum)",
    max: "Max 4 ampul/500mL cairan infus (konsentrasi tinggi bisa iritasi vena)",
    loading: null as any,
    maintenance: "1-2 sachet (3-6 g) PO 3x sehari setelah fase akut.",
    route: ["IV", "PO"],
    dilution: "Dilarutkan dalam D5W atau NS. 1 ampul (5g) dalam minimal 100mL.",
    rate: "Infus kontinyu atau drip lambat (max 5 g / jam untuk mencegah mual).",
    titration: null as any,
    special_notes: "Harus dibarengi dengan manajemen konstipasi (Laktulosa) untuk membuang amonia dari kolon."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Monitor", interval: "Normal", note: "" },
    r15_30: { dose: "Hati-hati", interval: "Normal", note: "Bisa akumulasi urea/amonia jika ginjal gagal klirens produk metabolit." },
    r_lt15: { dose: "HINDARI", interval: "Normal", note: "Kontraindikasi jika Cr > 3 mg/dL." },
    hd:     { dose: "Dosis perlu penyesuaian", interval: "Normal", note: "Koma hepatikum dengan gagal ginjal memerlukan CRRT/HD." },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "adjust",
    dialyzable: true,
    monitoring_renal: "Monitor BUN/Kreatinin (Siklus urea menghasilkan urea yang dibuang via ginjal)"
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal",
    note: "Justru diindikasikan untuk disfungsi hati."
  },
  pregnancy: {
    fda_category: "Belum ditetapkan",
    trimester_1: "Sebaiknya dihindari",
    trimester_2: "Gunakan jika mutlak perlu",
    trimester_3: "Gunakan jika mutlak perlu",
    labor_delivery: "Aman",
    fetal_risk: "Tidak ada studi definitif",
    lactation: "Tidak direkomendasikan",
    lactation_note: "Kurangnya data"
  },
  monitoring: {
    efficacy: ["Status mental (Grade Ensefalopati Hepatik I-IV)", "Level amonia darah (meski korelasi klinis kadang tidak linear)", "Kepatuhan laktulosa/BAB"],
    safety: ["BUN, Serum Kreatinin", "Reaksi lokal di tempat infus (flebitis)"],
    frequency: "Setiap hari pada ICU",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Jarang"],
    common: ["Mual / muntah sementara", "Kembung (jika bentuk sachet)"],
    antidote: null as any
  },
  interactions: {
    major: [],
    moderate: []
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "easl2022", note: "Direkomendasikan sebagai terapi ajuvan laktulosa/rifaximin untuk HE grade I-IV." }
  ]
},

"omeprazole": {
  name: "Omeprazole",
  brand_id: ["Losec", "Pumpitor", "Inhipump", "Omeprazole Dexa"],
  brand_id_notes: "PPI yang paling luas tersedia dalam bentuk IV dan PO.",
  class: "Gastroprotektor",
  subclass: "Proton Pump Inhibitor (PPI)",
  category: ["gi", "simtomatik"],
  common_in_id: true,
  common_in_id_note: "Terapi standar profilaksis stress ulcer (SUP) di ICU.",
  mechanism: "Menghambat enzim H+/K+ ATPase (pompa proton) secara ireversibel di sel parietal lambung, memblokir sekresi asam lambung.",
  pkpd_type: null as any,
  pkpd_note: null as any,
  spectrum: null as any,
  indications: {
    icu_primary: ["Profilaksis stress ulcer (SUP) pada pasien dengan risiko tinggi (ventilator >48 jam, koagulopati)", "Perdarahan Saluran Cerna Bagian Atas (UGIB)"],
    icu_secondary: ["GERD berat", "Dispepsia di ranap"],
    local_guideline: "Digunakan luas sesuai indikasi SUP (Stress Ulcer Prophylaxis).",
    intl_guideline: "Surviving Sepsis Campaign: Rekomendasi SUP dengan PPI atau H2RA HANYA pada pasien dengan faktor risiko perdarahan GI."
  },
  contraindications: ["Hipersensitivitas terhadap omeprazole atau benzimidazole lain"],
  precautions: ["Bisa meningkatkan risiko infeksi C. difficile dan Hospital-Acquired Pneumonia (HAP/VAP) jika digunakan tanpa indikasi", "Penggunaan jangka panjang berisiko hipomagnesemia dan fraktur tulang"],
  dosing: {
    standard: "40 mg IV setiap 12-24 jam",
    range_low: "40 mg/hari (SUP)",
    range_high: "80 mg bolus diikuti 8 mg/jam kontinyu (UGIB aktif)",
    max: "80 mg IV bolus + 8 mg/jam",
    loading: "80 mg IV bolus lambat (hanya untuk perdarahan varises/non-varises aktif)",
    maintenance: "8 mg/jam infus kontinyu selama 72 jam (untuk UGIB), dilanjutkan 40 mg PO/IV 2x sehari.",
    route: ["IV", "PO", "NGT"],
    dilution: "Injeksi dilarutkan dengan pelarut khusus bawaan (10mL). Infus dilarutkan dalam 100mL NS/D5W.",
    rate: "IV bolus minimal 2.5 menit. Infus kontinyu 8 mg/jam.",
    titration: null as any,
    special_notes: "Untuk NGT, sediaan kapsul enteric-coated tidak boleh digerus. Granul dalam kapsul bisa dilarutkan dengan air bikarbonat (hati-hati sumbatan NGT)."
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
    monitoring_renal: "Tidak ada penyesuaian dosis."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Max 20mg/hari", child_c: "Max 20mg/hari",
    note: "Bioavailabilitas dan waktu paruh sangat meningkat pada gangguan hati berat."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Relatif aman",
    trimester_2: "Relatif aman",
    trimester_3: "Relatif aman",
    labor_delivery: "Aman",
    fetal_risk: "Tidak ada risiko kongenital mayor dari data manusia luas.",
    lactation: "Diekskresikan ke ASI",
    lactation_note: "Kadar dalam ASI sangat rendah, dianggap aman oleh AAP."
  },
  monitoring: {
    efficacy: ["Tanda perdarahan GI (NGT kopi, melena, Hb serial)", "Gejala refluks"],
    safety: ["Magnesium serum (pemakaian kronis)", "Tanda infeksi nosokomial (C. diff, HAP)"],
    frequency: "Setiap hari. Evaluasi perlunya meneruskan PPI jika pasien ekstubasi dan sudah toleransi diet oral.",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["C. difficile associated diarrhea", "Nefritis interstitial akut (Aki yang imbas obat)"],
    common: ["Sakit kepala", "Diare", "Nyeri perut", "Kembung"],
    antidote: null as any
  },
  interactions: {
    major: [
      { drug: "Clopidogrel", effect: "Penurunan efikasi Clopidogrel (inhibisi CYP2C19)", management: "Pilih PPI lain seperti Pantoprazole atau Rabeprazole." }
    ],
    moderate: [
      { drug: "Obat yang butuh pH asam (Ketoconazole, Itraconazole, Besi)", effect: "Penurunan absorpsi obat", management: "Pemisahan waktu, gunakan suplemen IV jika perlu" }
    ]
  },
  stewardship: {
    empiric_sources: ["SUP pada pasien ventilator, trauma kapitis, luka bakar luas, syok."],
    deescalation_to: ["PO formulasi", "H2RA"],
    duration_standard: "Selama faktor risiko stress ulcer ada.",
    duration_short: "Stop segera setelah pasien ekstubasi dan makan oral.",
    duration_note: "Depreskripsi adalah indikator mutu ICU yang baik.",
    stop_criteria: "Toleransi diet enteral penuh dan tidak memakai ventilasi mekanik.",
    avoid_for: ["Pasien bangsal biasa tanpa riwayat ulkus", "ICU stay <48 jam tanpa risiko tinggi perdarahan"],
    local_pattern_note: "Penggunaan PPI overprescribed di ICU."
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: true,
  pump_drug_key: "omeprazole",
  evidence: [
    { ref_id: "ssc2024", note: "SUP diindikasikan hanya untuk pasien kritis dengan risiko perdarahan." },
    { ref_id: "acg_ugib", note: "Rekomendasi bolus 80mg dan kontinyu 8mg/jam untuk UGIB aktif." }
  ]
},

"pantoprazole": {
  name: "Pantoprazole",
  brand_id: ["Pantozol", "Pranza", "Pantoprazole Dexa"],
  brand_id_notes: "Alternatif PPI IV yang sering dipakai jika ada interaksi clopidogrel.",
  class: "Gastroprotektor",
  subclass: "Proton Pump Inhibitor (PPI)",
  category: ["gi", "simtomatik"],
  common_in_id: true,
  common_in_id_note: "Digunakan setara dengan omeprazole.",
  mechanism: "Sama dengan omeprazole. Inhibitor ireversibel pompa proton H+/K+ ATPase.",
  pkpd_type: null as any,
  pkpd_note: null as any,
  spectrum: null as any,
  indications: {
    icu_primary: ["Profilaksis stress ulcer (SUP)", "UGIB aktif (Peptic Ulcer Disease)"],
    icu_secondary: ["GERD", "Hipersekresi patologis (Zollinger-Ellison)"],
    local_guideline: "Dipilih jika pasien ACS sedang memakai Clopidogrel.",
    intl_guideline: "Pilihan utama PPI pada dual antiplatelet therapy (DAPT) karena tidak menginhibisi CYP2C19 sekuat omeprazole."
  },
  contraindications: ["Hipersensitivitas"],
  precautions: ["Risiko C. difficile dan HAP", "Hipomagnesemia"],
  dosing: {
    standard: "40 mg IV setiap 12-24 jam",
    range_low: "40 mg/hari",
    range_high: "80 mg bolus lalu 8 mg/jam (UGIB aktif)",
    max: "80 mg IV + 8 mg/jam",
    loading: "80 mg IV bolus",
    maintenance: "8 mg/jam kontinyu",
    route: ["IV", "PO"],
    dilution: "Vial 40 mg dilarutkan dalam 10 mL NS. Untuk infus 8 mg/jam, larutkan 80 mg dalam 100 mL NS.",
    rate: "IV bolus perlahan (2 menit). Infus 15 menit. Kontinyu 8 mg/jam.",
    titration: null as any,
    special_notes: "Lebih mahal dari omeprazole, sediaan IV serbuk kering tanpa pelarut khusus (pakai NS biasa)."
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
    monitoring_renal: "Tanpa penyesuaian dosis."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Max 20 mg/hari (atau 40mg tiap 2 hari)",
    note: "Metabolisme ekstensif di hati."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Aman",
    trimester_2: "Aman",
    trimester_3: "Aman",
    labor_delivery: "Aman",
    fetal_risk: "Kategori B (lebih aman dari omeprazole C di beberapa regulasi, walau data mirip).",
    lactation: "Diekskresikan minimal",
    lactation_note: "Cukup aman"
  },
  monitoring: {
    efficacy: ["Evaluasi perdarahan GI", "Toleransi oral"],
    safety: ["Mg serum jika terapi lama", "Risiko pneumonia nosokomial"],
    frequency: "Harian",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["C. diff enterocolitis", "Akut interstitial nefritis"],
    common: ["Sakit kepala", "Diare", "Tromboflebitis di lokasi infus"],
    antidote: null as any
  },
  interactions: {
    major: [],
    moderate: [
      { drug: "Obat bergantung pH", effect: "Penyerapan turun", management: "Pisahkan waktu" }
    ]
  },
  stewardship: {
    empiric_sources: [],
    deescalation_to: [],
    duration_standard: "Selama stres faktor ada.",
    duration_short: "Stop segera.",
    duration_note: "Hentikan jika indikasi selesai.",
    stop_criteria: "Ekstubasi, toleransi oral baik.",
    avoid_for: ["Low risk ICU patients"],
    local_pattern_note: ""
  },
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: true,
  pump_drug_key: "pantoprazole",
  evidence: [
    { ref_id: "aha_acs", note: "PPI pilihan pada ACS dengan clopidogrel karena minimal inhibisi CYP2C19." }
  ]
},

"metoklopramid": {
  name: "Metoklopramid",
  brand_id: ["Primperan", "Vomipram", "Metoclopramide Dexa"],
  brand_id_notes: "Sangat luas dipakai di ruang IGD dan operasi.",
  class: "Prokinetik / Antiemetik",
  subclass: "Antagonis Reseptor Dopamin (D2)",
  category: ["gi", "simtomatik"],
  common_in_id: true,
  common_in_id_note: "Sering digunakan untuk stasis lambung di ICU.",
  mechanism: "Memblok reseptor D2 di zona trigger kemoreseptor (CTZ) di medulla untuk efek antiemetik. Di traktus GI, mensensitisasi jaringan ke asetilkolin, memfasilitasi pengosongan lambung dan tonus sfingter esofagus bawah.",
  pkpd_type: null as any,
  pkpd_note: null as any,
  spectrum: null as any,
  indications: {
    icu_primary: ["Stasis lambung (high gastric residual volume pada pasien enteral feeding)", "Mual dan muntah pasca operasi (PONV)"],
    icu_secondary: ["Gastroenteritis akut / mual parah", "Pencegahan aspirasi paru"],
    local_guideline: "Dipakai rutin sebelum insersi OGT/NGT berat atau saat residu lambung >250-500 mL.",
    intl_guideline: "SCCM Nutrition Guideline 2016: Rekomendasi lini pertama prokinetik untuk intoleransi enteral feeding (bersama dengan erythromycin)."
  },
  contraindications: ["Obstruksi usus mekanik, perforasi GI, atau perdarahan lambung", "Riwayat kejang/epilepsi (dapat menurunkan ambang kejang)", "Pheochromocytoma (dapat krisis hipertensi)", "Penyakit Parkinson (antagonis dopamin)"],
  precautions: ["Bisa menyebabkan reaksi ekstrapiramidal (EPS) terutama pada dewasa muda/anak-anak", "Dapat memicu Tardive Dyskinesia (TD) pada penggunaan jangka panjang (>12 minggu)"],
  dosing: {
    standard: "10 mg IV setiap 6-8 jam",
    range_low: "5 mg IV (lansia/renal)",
    range_high: "10 mg IV",
    max: "30-40 mg/hari (FDA maks 12 minggu)",
    loading: null as any,
    maintenance: "10 mg IV sebelum makan/feeding enteral.",
    route: ["IV", "IM", "PO"],
    dilution: "Bisa IV bolus langsung (lambat selama 1-2 menit).",
    rate: "Bolus IV lambat untuk menghindari akatisia/kecemasan mendadak.",
    titration: null as any,
    special_notes: "Bila digunakan untuk feeding intolerans, berikan 15-30 menit sebelum feeding tube dibilas."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Kurangi 50%", interval: "Normal", note: "Atau perpanjang interval" },
    r15_30: { dose: "Kurangi 50%", interval: "Normal", note: "Atau perpanjang interval" },
    r_lt15: { dose: "Kurangi 50%", interval: "Normal", note: "Atau perpanjang interval" },
    hd:     { dose: "5 mg per hari", interval: "Normal", note: "Tidak perlu dosis tambahan usai HD" },
    crrt:   { dose: "Normal atau kurangi 50%", interval: "Normal", note: "Monitor efek samping" },
    badge: "adjust",
    dialyzable: false,
    monitoring_renal: "Pasien gagal ginjal rentan terhadap reaksi EPS. Kurangi dosis 50% untuk eGFR < 40."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Kurangi dosis 50%",
    note: "Metabolisme hati, hati-hati pada sirosis dekompensata."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Aman",
    trimester_2: "Aman",
    trimester_3: "Aman",
    labor_delivery: "Aman",
    fetal_risk: "Tidak meningkatkan risiko malformasi mayor.",
    lactation: "Diekskresi ke ASI. Kadang dipakai off-label sbg galactagogue, tapi hindari pemakaian panjang karena risiko depresi/EPS pada ibu.",
    lactation_note: "Relatif aman untuk pemakaian singkat."
  },
  monitoring: {
    efficacy: ["Penurunan volume residu lambung (GRV)", "Perbaikan mual/muntah"],
    safety: ["Tanda EPS (akatisia, distonia, tremor)", "Nyeri perut hebat (obstruksi tertutup)"],
    frequency: "Harian",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Tardive Dyskinesia (ireversibel)", "Neuroleptic Malignant Syndrome (NMS) - jarang"],
    common: ["Akatisia (rasa gelisah, tidak bisa diam)", "Drowsiness / Somnolens", "Diare"],
    antidote: "Reaksi distonia/EPS akut: Diphenhydramine 25-50 mg IV atau Benztropine 1-2 mg IV."
  },
  interactions: {
    major: [
      { drug: "Obat Antipsikotik", effect: "Meningkatkan risiko EPS dan NMS", management: "Hindari kombinasi dengan haloperidol, chlorpromazine, dll." }
    ],
    moderate: [
      { drug: "Opioid / Antikolinergik", effect: "Mengantagonis efek prokinetik metoklopramid", management: "Metoklopramid jadi tidak efektif untuk motilitas GI." }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "sccm2016", note: "First-line agent untuk intoleransi enteral feeding di ICU (residu lambung > 500 mL)." }
  ]
},

"asam_traneksamat": {
  name: "Asam Traneksamat",
  brand_id: ["Kalnex", "Transamin", "Asam Traneksamat Bernofarm"],
  brand_id_notes: "Tersedia generik dan paten luas di UGD, IBS, ICU.",
  class: "Hemostatik",
  subclass: "Antifibrinolitik",
  category: ["hemostatik", "high_alert"],
  common_in_id: true,
  common_in_id_note: "First line trauma akut & perdarahan postpartum.",
  mechanism: "Sintetik turunan lisin. Mengikat reseptor lisin pada plasminogen secara kompetitif, sehingga memblokir aktivasi plasminogen menjadi plasmin → menghambat pemecahan bekuan darah (fibrinolisis).",
  pkpd_type: null as any,
  pkpd_note: null as any,
  spectrum: null as any,
  indications: {
    icu_primary: ["Perdarahan masif pasca trauma (Protokol CRASH-2)", "Perdarahan Post-Partum (Protokol WOMAN)", "Perdarahan pembedahan mayor (Ortho, CABG)"],
    icu_secondary: ["Epitaksis refrakter", "Pencabutan gigi pada pasien hemofilia/antikoagulan"],
    local_guideline: "Rutin dalam algoritma trauma mayor: 1 gram IV bolus diikuti 1 gram kontinyu dalam 8 jam.",
    intl_guideline: "CRASH-2: Berikan dalam 3 JAM pertama sejak trauma. Jika >3 jam, pemberian TXA meningkatkan risiko kematian akibat perdarahan mikrovaskular."
  },
  contraindications: ["Pemberian >3 jam pasca cedera (pada trauma) - bisa pro-thrombotik", "Riwayat trombosis aktif (DVT, PE)", "Perdarahan subarachnoid (vasospasme bisa memburuk)"],
  precautions: ["Bisa memicu kejang jika diberikan IV bolus terlalu cepat atau pada dosis tinggi (terutama jika ada gagal ginjal)", "Hematuria berat dari tractus urogenital atas (bekuan darah bisa obstruksi ureter)"],
  dosing: {
    standard: "1 g IV bolus dalam 10 menit",
    range_low: "500 mg IV",
    range_high: "1000 mg IV",
    max: "Umumnya 2 g / hari pada protokol trauma",
    loading: "1 g IV bolus pelan selama 10 menit (Trauma CRASH-2)",
    maintenance: "1 g IV infus kontinyu selama 8 jam (Trauma CRASH-2). HPP: 1 g lagi jika perdarahan lanjut usai 30 menit.",
    route: ["IV", "PO", "Topikal"],
    dilution: "Bolus langsung IV lambat. Atau drip dalam 100-500 mL NS.",
    rate: "Max rate infus bolus 100 mg/menit (1 gram = minimal 10 menit) untuk hindari hipotensi.",
    titration: null as any,
    special_notes: "Krusial: harus diberikan <3 JAM SEJAK KEJADIAN trauma/perdarahan."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Kurangi dosis", interval: "Normal", note: "Dosis maintenance kurangi 50%" },
    r_lt15: { dose: "Kurangi dosis", interval: "Normal", note: "Dosis maintenance kurangi 75%" },
    hd:     { dose: "Disesuaikan", interval: "Normal", note: "Beresiko kejang akumulasi pada ESRD." },
    crrt:   { dose: "Monitor", interval: "Normal", note: "" },
    badge: "adjust",
    dialyzable: true,
    monitoring_renal: "Obat diekskresi 95% utuh di urin. Penurunan dosis wajib pada gagal ginjal berat hindari neurotoksisitas (kejang)."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Normal",
    note: "Tidak perlu penyesuaian dosis."
  },
  pregnancy: {
    fda_category: "B",
    trimester_1: "Aman jika indikasi kuat",
    trimester_2: "Aman",
    trimester_3: "Aman",
    labor_delivery: "Aman. First line untuk HPP (Hemato Post Partum) trial WOMAN.",
    fetal_risk: "Menembus plasenta. Tapi life-saving untuk ibu.",
    lactation: "Diekskresikan sangat sedikit",
    lactation_note: "Aman menyusui."
  },
  monitoring: {
    efficacy: ["Penghentian perdarahan", "Stabilitas hemodinamik", "Hb / Hct"],
    safety: ["Tanda DVT/PE paska terapi", "Tekanan darah saat IV bolus (hindari hipotensi)", "Kejang umum / myoclonus (tanda neurotoksisitas dosis tinggi)"],
    frequency: "Setiap 1-2 jam selama infus. Cek klinis dan D-dimer / fibrinogen.",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Trombosis (DVT, Pulmonary Embolism, Stroke)", "Kejang umum (GABA-A reseptor antagonisme pada dosis tinggi/IV cepat)", "Hipotensi mendadak (bila bolus terlalu cepat)"],
    common: ["Mual / muntah", "Sakit kepala", "Diare"],
    antidote: null as any
  },
  interactions: {
    major: [
      { drug: "Prothrombin Complex Concentrates (PCC) / Factor IX", effect: "Peningkatan risiko trombosis ekstrem", management: "Hindari kombinasi kecuali perdarahan luar biasa refrakter." }
    ],
    moderate: [
      { drug: "Estrogen / Kontrasepsi Hormonal", effect: "Risiko trombosis sedikit meningkat", management: "Gunakan jika mutlak perlu." }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: ["Berikan dalam <3 jam onset trauma", "Berikan bolus pelan >10 menit hindari kejang/hipotensi"],
  high_alert_protocol: null as any,
  pump_link: true,
  pump_drug_key: "asam_traneksamat",
  evidence: [
    { ref_id: "crash2_2010", note: "CRASH-2: Mengurangi mortalitas perdarahan trauma jika diberikan < 3 jam." },
    { ref_id: "woman_2017", note: "WOMAN Trial: Menurunkan kematian akibat perdarahan post-partum (HPP)." }
  ]
},

"dexamethason": {
  name: "Deksametason",
  brand_id: ["Kalmethasone", "Oradexon", "Dexamethasone Dexa"],
  brand_id_notes: "Sangat luas dipakai, injeksi ampul 5 mg/mL.",
  class: "Kortikosteroid",
  subclass: "Glukokortikoid Kerja Panjang",
  category: ["steroid", "simtomatik"],
  common_in_id: true,
  common_in_id_note: "Pilihan utama sterioid anti-inflamasi kuat di Indonesia.",
  mechanism: "Menghambat transkripsi gen inflamasi, menurunkan permeabilitas kapiler, menekan respon imun. Potensi anti-inflamasi 25x hidrokotison, tanpa aktivitas mineralokortikoid (tidak menahan garam/air). Waktu paruh biologis 36-72 jam.",
  pkpd_type: null as any,
  pkpd_note: null as any,
  spectrum: null as any,
  indications: {
    icu_primary: ["COVID-19 berat/kritis dengan kebutuhan oksigen (RECOVERY Trial)", "Edema serebral terkait tumor otak / abses", "Syok anafilaksis (mencegah reaksi biphasic)", "Bacterial Meningitis (diberikan sebelum antibiotik pertama)"],
    icu_secondary: ["Eksaserbasi PPOK / Asma berat", "Ekstubasi stridor profilaksis (edema laring)"],
    local_guideline: "Standard protocol untuk COVID-19 (6 mg IV/PO per hari) dan syok anafilaksis.",
    intl_guideline: "RECOVERY (2020): Dexamethasone 6mg/hari selama 10 hari menurunkan mortalitas COVID-19. IDSA: Wajib pada meningitis pneumokokus dewasa sebelum abx."
  },
  contraindications: ["Infeksi jamur sistemik yang tidak diterapi", "Malaria serebral", "Hipersensitivitas"],
  precautions: ["Hiperglikemia berat", "Peningkatan risiko infeksi sekunder", "Tukak lambung/GI bleeding (sering diprofilaksis PPI)", "Sindrom withdrawal steroid bila dihentikan mendadak setelah pemakaian panjang"],
  dosing: {
    standard: "Sesuai indikasi (contoh: 6 mg IV/hari untuk COVID-19)",
    range_low: "4 mg IV",
    range_high: "10-20 mg IV bolus (Edema serebral / TIK)",
    max: "Tergantung indikasi, bisa 40 mg/hari (Meningitis, dll)",
    loading: "Edema otak: 10 mg IV. Meningitis: 0.15 mg/kg IV q6h.",
    maintenance: "Meningitis: 0.15 mg/kg tiap 6 jam selama 4 hari. Edema laring: 5 mg IV tiap 6 jam sebelum ekstubasi.",
    route: ["IV", "IM", "PO"],
    dilution: "Bisa IV bolus langsung (lambat).",
    rate: "Bolus pelan lebih dari 1 menit.",
    titration: null as any,
    special_notes: "Tidak punya efek mineralokortikoid, jadi TIDAK dipakai untuk Syok Septik / Insufisiensi Adrenal akut (Pilih Hidrokortison)."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "" },
    hd:     { dose: "Normal", interval: "Normal", note: "Tidak terdialisis bermakna" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Tanpa penyesuaian dosis ginjal."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Monitor efek terapi",
    note: "Metabolisme hati."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Peningkatan kecil risiko celah bibir",
    trimester_2: "Aman jika indikasi kuat",
    trimester_3: "Menembus plasenta secara utuh (beda dengan prednison). Dipakai untuk maturasi paru janin pre-term.",
    labor_delivery: "Aman",
    fetal_risk: "Maturasi paru janin (indikasi positif). Risiko IUGR jika kronik.",
    lactation: "Bisa ditekan sekresinya, menekan tumbuh kembang bayi",
    lactation_note: "Gunakan dosis terkecil untuk waktu terpendek."
  },
  monitoring: {
    efficacy: ["Saturasi / sesak nafas membaik", "Stridor berkurang", "GCS membaik (edema serebral)"],
    safety: ["Gula darah kapiler (wajib monitor ketat)", "Tanda infeksi (WBC meningkat, walau steroid bikin demarginasi WBC)"],
    frequency: "GDS tiap 6-8 jam pada pasien diabetes.",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Hiperglikemia berat / DKA", "Perdarahan lambung", "Perforasi usus", "Psikosis steroid", "Immunosupresi berat"],
    common: ["Insomnia", "Agitasi", "Retensi cairan ringan (walau tanpa efek MC)", "Leukositosis (efek demarginasi normal)"],
    antidote: null as any
  },
  interactions: {
    major: [
      { drug: "NSAID", effect: "Risiko tukak lambung ganda", management: "Hindari kombinasi. Berikan profilaksis PPI." }
    ],
    moderate: [
      { drug: "Fluoroquinolone", effect: "Meningkatkan risiko ruptur tendon", management: "Hati-hati, waspada nyeri lutut/tumit." },
      { drug: "Insulin", effect: "Kebutuhan insulin meningkat tajam", management: "Titrasi naik dosis insulin." }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: [],
  high_alert_protocol: null as any,
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "recovery_2020", note: "RECOVERY trial: Dexamethasone 6 mg/hari menurunkan 28-day mortality pada COVID-19." }
  ]
},

"metilprednisolon": {
  name: "Metilprednisolon",
  brand_id: ["Solu-Medrol", "Sanexon", "Lameson", "Methylprednisolone Novell"],
  brand_id_notes: "Sediaan injeksi sangat mahal (Solu-Medrol). Sering dipakai bentuk natrium suksinat (IV).",
  class: "Kortikosteroid",
  subclass: "Glukokortikoid Kerja Sedang",
  category: ["steroid", "simtomatik"],
  common_in_id: true,
  common_in_id_note: "Gold standard untuk eksaserbasi asma berat / PPOK di IGD/ICU.",
  mechanism: "Anti-inflamasi kuat. Potensi 5x hidrokortison, dengan aktivitas mineralokortikoid minimal (0.5x). Waktu paruh biologis 12-36 jam.",
  pkpd_type: null as any,
  pkpd_note: null as any,
  spectrum: null as any,
  indications: {
    icu_primary: ["Eksaserbasi Asma Akut Berat", "Eksaserbasi PPOK Akut", "Syok Anafilaksis", "Reaksi Alergi Berat"],
    icu_secondary: ["Spinal Cord Injury akut (penggunaan dosis tinggi mega-dose sekarang kontroversial dan tidak direkomendasi rutin)", "ARDS non-resolving (fase fibroproliferatif)"],
    local_guideline: "Perhimpunan Dokter Paru Indonesia (PDPI): Metilprednisolon IV 40-60 mg tiap 6 jam untuk status asmatikus.",
    intl_guideline: "GINA (Asma) & GOLD (PPOK): Kortikosteroid sistemik IV/PO mempercepat resolusi dan mencegah relaps."
  },
  contraindications: ["Infeksi jamur sistemik", "Bayi prematur (sediaan mengandung benzyl alcohol - fatal gasping syndrome)"],
  precautions: ["Hiperglikemia persisten", "Kelemahan otot / Critical Illness Polyneuropathy (CIPNM) sering muncul bila digabung dengan pelumpuh otot (NMB)", "Immunosupresi lambat"],
  dosing: {
    standard: "40 - 125 mg IV setiap 6-8 jam (Asma/PPOK akut)",
    range_low: "40 mg IV / hari",
    range_high: "125 mg IV tiap 6 jam",
    max: "Bisa 1 gram IV/hari untuk pulse-dose penyakit autoimun",
    loading: "125 mg IV (pada asma akut / anafilaksis berat)",
    maintenance: "40-60 mg IV tiap 6-8 jam",
    route: ["IV", "PO", "IM"],
    dilution: "Campurkan vial bubuk natrium suksinat dengan pelarut bawaan. Dosis >250 mg harus dilarutkan dalam 50mL D5W/NS (infus 30 menit).",
    rate: "Dosis <250 mg bisa di bolus lambat (beberapa menit). Pulse dose >250mg wajib drip lambat >30 menit menghindari aritmia.",
    titration: null as any,
    special_notes: "Vial bubuk harus dikocok pelan usai dicampur pelarut."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal", interval: "Normal", note: "" },
    r30_60: { dose: "Normal", interval: "Normal", note: "" },
    r15_30: { dose: "Normal", interval: "Normal", note: "" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "" },
    hd:     { dose: "Normal", interval: "Normal", note: "" },
    crrt:   { dose: "Normal", interval: "Normal", note: "" },
    badge: "safe",
    dialyzable: true,
    monitoring_renal: "Tidak perlu ajustasi."
  },
  hepatic_adjustment: {
    child_a: "Normal", child_b: "Normal", child_c: "Monitor klinis",
    note: "Metabolisme hepatik ekstensif (CYP3A4)."
  },
  pregnancy: {
    fda_category: "C",
    trimester_1: "Peningkatan kecil sumbing bibir/palatum",
    trimester_2: "Aman jika perlu",
    trimester_3: "Dimetabolisme oleh plasenta (11-beta-OHSD), sangat sedikit masuk ke janin. Lebih disukai dari dexamethasone HANYA untuk obati IBU.",
    labor_delivery: "Aman",
    fetal_risk: "Tidak dominan (plasenta barier kuat)",
    lactation: "Disekresi sedikit di ASI. Cukup aman.",
    lactation_note: "Sebaiknya tunggu 4 jam post dosis untuk menyusui bila ibu dapat pulse dose."
  },
  monitoring: {
    efficacy: ["Laju Pernafasan, Wheezing berkurang", "Perbaikan PF dan gas darah"],
    safety: ["Gula darah (hiperglikemia sangat menonjol)", "Kalium (hipokalemia dapat terjadi)", "Miokardium aritmia (saat bolus cepat tinggi)"],
    frequency: "Pantau GDS Q6H selama fase akut.",
    therapeutic_range: null as any
  },
  adverse_effects: {
    critical: ["Myopathy akut / CIPNM (terutama bila pakai bersama Rocuronium/Atracurium di ICU)", "Aritmia fatal / henti jantung (jika IV bolus >500 mg terlalu cepat)", "Infeksi / Sepsis"],
    common: ["Hiperglikemia", "Hipokalemia", "Agitasi / Psikosis steroid", "Retensi cairan dan Hipertensi"],
    antidote: null as any
  },
  interactions: {
    major: [
      { drug: "Neuromuscular Blockers (NMB) - Rocuronium, dll", effect: "Risiko CIPNM / miopati kuadriplegia persisten meningkat", management: "Hindari steroid bersama NMB jika mungkin, atau kurangi durasi NMB seminimal mungkin." }
    ],
    moderate: [
      { drug: "Makrolida (Eritromisin/Klaritromisin)", effect: "Inhibisi metabolisme MP → efek steroid meningkat", management: "Pantau glukosa darah ketat" }
    ]
  },
  stewardship: null as any,
  high_alert: false,
  high_alert_warnings: ["Dosis tinggi (pulse) JANGAN bolus cepat"],
  high_alert_protocol: null as any,
  pump_link: false,
  pump_drug_key: null as any,
  evidence: [
    { ref_id: "gina2023", note: "Steroid sistemik (Methylprednisolone IV) kunci resolusi asma eksaserbasi berat." }
  ]
}

};
