import { DrugDatabase } from './types';

export const ICU_DRUGS: DrugDatabase = {

"furosemid": {
  name: "Furosemid",
  brand_id: ["Lasix", "Diuvar"],
  class: "Diuretik",
  category: ["diuretik", "kardiovaskular"],
  common_in_id: true,
  mechanism: "Loop diuretic. Menghambat NKCC2 di lengkung Henle asendens.",
  indications: { icu_primary: ["Fluid overload akut", "Oliguria pada AKI"] },
  contraindications: ["Anuria tanpa fluid overload"],
  precautions: ["Hipokalemia", "Ototoksisitas"],
  dosing: {
    standard: "20-40 mg IV bolus",
    route: ["IV"]
  },
  renal_adjustment: {
    ge60:   { dose: "20–40 mg IV", interval: "q12j s.d q24j", note: "Dosis standar" },
    r30_60: { dose: "40–80 mg IV", interval: "q12j s.d q24j", note: "Hambatan sekresi luminal tubular membutuhkan dosis bolus lebih tinggi" },
    r15_30: { dose: "80–120 mg IV", interval: "Infus kontinu 10–20 mg/jam", note: "Diuretic resistance: memerlukan dosis tinggi untuk mencapai efek terapetik" },
    r_lt15: { dose: "120–240 mg IV", interval: "Infus kontinu 20–40 mg/jam", note: "Dosis sangat tinggi diperlukan. Pantau risiko ototoxicity berat pada bolus!" },
    hd:     { dose: "Hindari jika anuria total", interval: "—", note: "Bila urin minimal: 120–240 mg post-HD. Pada anuria total, tidak ada manfaat obat." },
    crrt:   { dose: "20–80 mg IV", interval: "q12j s.d kontinu", note: "Kurang diperlukan jika ultrafiltrasi CRRT sudah mengontrol balans cairan" },
    badge: "adjust",
    dialyzable: false,
    monitoring_renal: "Balans cairan, elektrolit (K+, Na+, Cl-), fungsi pendengaran (mencegah ototoxicity)"
  },
  pregnancy: { fda_category: "C" },
  monitoring: { safety: ["Elektrolit", "Urine output"] },
  adverse_effects: { critical: ["Hipovolemia", "Ototoksisitas"] },
  pump_link: false
},

"spironolakton": {
  name: "Spironolakton",
  brand_id: ["Aldactone"],
  class: "Diuretik hemat kalium",
  category: ["diuretik"],
  common_in_id: true,
  mechanism: "Antagonis aldosteron.",
  indications: { icu_primary: ["CHF NYHA II-IV", "Asites sirosis"] },
  contraindications: ["Hiperkalemia"],
  precautions: ["Monitor kalium", "Ginekomastia"],
  dosing: {
    standard: "25-50 mg per hari PO",
    route: ["PO", "NGT"]
  },
  renal_adjustment: {
    ge60:   { dose: "25–50 mg", interval: "q24j", note: "Dosis standar" },
    r30_60: { dose: "12.5–25 mg", interval: "q24j s.d q48j", note: "Mulai kurangi dosis (eGFR 30-50). Cek kalium serum berkala." },
    r15_30: { dose: "Hindari (Kontraindikasi jika eGFR <30)", interval: "—", note: "Risiko hiperkalemia fatal sangat tinggi" },
    r_lt15: { dose: "Kontraindikasi", interval: "—", note: "Sangat berbahaya" },
    hd:     { dose: "Kontraindikasi", interval: "—", note: "Risiko tinggi aritmia akibat hiperkalemia" },
    crrt:   { dose: "Hindari", interval: "—", note: "Kecuali dengan pemantauan elektrolit CRRT yang konstan" },
    badge: "avoid",
    dialyzable: false,
    monitoring_renal: "Kalium serum harian (hentikan segera jika K >5.0 mEq/L), Kreatinin harian"
  },
  pregnancy: { fda_category: "C" },
  monitoring: { safety: ["Kalium"] },
  adverse_effects: { critical: ["Hiperkalemia berat"] },
  pump_link: false
},

"manitol": {
  name: "Manitol",
  brand_id: ["Osmofundin", "Manitol 20%"],
  class: "Diuretik Osmotik",
  category: ["diuretik", "neurologi"],
  common_in_id: true,
  mechanism: "Meningkatkan osmolaritas plasma, menarik cairan dari otak.",
  indications: { icu_primary: ["Elevasi TIK akut"] },
  contraindications: ["Anuria", "Dehidrasi"],
  precautions: ["Osmolal gap >20 (stop)"],
  dosing: {
    standard: "0.25-1 g/kg IV bolus",
    route: ["IV"]
  },
  renal_adjustment: {
    ge60:   { dose: "0.25–1 g/kg", interval: "PRN atau q6j s.d q8j", note: "Normal. Target osmolaritas plasma <320 mOsm/kg." },
    r30_60: { dose: "0.25–0.5 g/kg", interval: "Monitor ketat", note: "Cek osmolal gap harian. Risiko AKI memburuk." },
    r15_30: { dose: "Hindari (Kontraindikasi jika eGFR <30)", interval: "—", note: "Risiko edema paru akut dan hiponatrema dilusional akibat ekspansi volume ekstraseluler" },
    r_lt15: { dose: "Kontraindikasi", interval: "—", note: "Kecuali jika dibersihan simultan oleh HD/RRT" },
    hd:     { dose: "Hindari", interval: "—", note: "Dibersihan oleh HD, namun risiko tinggi sebelum dialisis" },
    crrt:   { dose: "Gunakan dengan ekstra hati-hati", interval: "—", note: "Monitor osmolal gap & volume cairan ketat" },
    badge: "avoid",
    dialyzable: true,
    monitoring_renal: "Osmolaritas serum (osmolal gap harian, kemih, stop jika gap >20 mOsm), Kreatinin"
  },
  pregnancy: { fda_category: "C" },
  monitoring: { safety: ["Osmolalitas serum tiap 4-6 jam"] },
  adverse_effects: { critical: ["Rebound edema", "Hiperosmolalitas"] },
  pump_link: false
},

"hidrokortison": {
  name: "Hidrokortison",
  brand_id: ["Solu-Cortef"],
  class: "Kortikosteroid",
  category: ["kortikosteroid"],
  common_in_id: true,
  mechanism: "Agonis glukokortikoid dan mineralokortikoid.",
  indications: { icu_primary: ["Syok septik refrakter", "Krisis adrenal"] },
  contraindications: ["Infeksi tidak terkontrol"],
  precautions: ["Hiperglikemia", "Tapering perlahan"],
  dosing: {
    standard: "200 mg/hari IV (infus atau bagi dosis)",
    route: ["IV"]
  },
  renal_adjustment: {
    ge60:   { dose: "50 mg IV", interval: "q6j", note: "Dosis standar syok septik (atau 200 mg/hari kontinu)" },
    r30_60: { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    hd:     { dose: "Normal", interval: "Normal", note: "Tidak terdialisis secara signifikan" },
    crrt:   { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Urin output harian, glukosa harian, elektrolit (retensi natrium)"
  },
  pregnancy: { fda_category: "C" },
  monitoring: { safety: ["Glukosa", "Na/K"] },
  adverse_effects: { critical: ["Hiperglikemia", "Infeksi sekunder"] },
  pump_link: false
},

"metilprednisolon": {
  name: "Metilprednisolon",
  brand_id: ["Solu-Medrol"],
  class: "Kortikosteroid",
  category: ["kortikosteroid"],
  common_in_id: true,
  mechanism: "Anti-inflamasi poten. Sedikit efek mineralokortikoid.",
  indications: { icu_primary: ["Status asmatikus", "Eksaserbasi PPOK"] },
  contraindications: ["Infeksi fungal sistemik"],
  precautions: ["Hiperglikemia"],
  dosing: {
    standard: "40-80 mg/hari IV",
    route: ["IV"]
  },
  renal_adjustment: {
    ge60:   { dose: "40–120 mg IV", interval: "q12j s.d q24j", note: "Dosis disesuaikan indikasi" },
    r30_60: { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    hd:     { dose: "Normal", interval: "Normal", note: "Minim terdialisis" },
    crrt:   { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Balans cairan, glukosa darah harian"
  },
  pregnancy: { fda_category: "C" },
  monitoring: { safety: ["Glukosa darah"] },
  adverse_effects: { critical: ["Perdarahan GI", "Miopati steroid"] },
  pump_link: false
},

"deksametason": {
  name: "Deksametason",
  brand_id: ["Kalmethasone", "Decadron"],
  class: "Kortikosteroid",
  category: ["kortikosteroid"],
  common_in_id: true,
  mechanism: "Glukokortikoid poten long-acting. Tidak ada efek mineralokortikoid.",
  indications: { icu_primary: ["COVID-19 ARDS", "Edema serebral"] },
  contraindications: ["Infeksi tidak terkontrol"],
  precautions: ["Hiperglikemia", "Supresi HPA"],
  dosing: {
    standard: "COVID: 6 mg IV/PO x 10 hari",
    route: ["IV", "PO"]
  },
  renal_adjustment: {
    ge60:   { dose: "6 mg IV/PO", interval: "q24j", note: "Dosis standar COVID-19/ARDS" },
    r30_60: { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    hd:     { dose: "Normal", interval: "Normal", note: "Tidak terdialisis secara bermakna" },
    crrt:   { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Glukosa harian, kekuatan otot (pantau steroid myopathy)"
  },
  pregnancy: { fda_category: "C" },
  monitoring: { safety: ["Glukosa"] },
  adverse_effects: { critical: ["Osteoporosis", "Infeksi sekunder"] },
  pump_link: false
},

"pantoprazol": {
  name: "Pantoprazol",
  brand_id: ["Pantozol", "Controloc"],
  class: "Gastroproteksi",
  category: ["gi"],
  common_in_id: true,
  mechanism: "PPI.",
  indications: { icu_primary: ["Profilaksis SUP", "Perdarahan GI akut"] },
  contraindications: ["Alergi PPI"],
  precautions: ["C. difficile", "Hipomagnesemia"],
  dosing: {
    standard: "40 mg IV q24j",
    loading: "Perdarahan: 80 mg IV bolus",
    route: ["IV"]
  },
  renal_adjustment: {
    ge60:   { dose: "40 mg IV", interval: "q24j", note: "Normal" },
    r30_60: { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    hd:     { dose: "Normal", interval: "Normal", note: "Tidak dialisis" },
    crrt:   { dose: "Normal", interval: "Normal", note: "Tidak terdialisis" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Tidak nefrotoksik, monitor efek interaksi obat PPI harian"
  },
  pregnancy: { fda_category: "B" },
  monitoring: { safety: ["Mg (kronis)"] },
  adverse_effects: { critical: ["Fraktur (lama)"] },
  pump_link: false
},

"sukralfat": {
  name: "Sukralfat",
  brand_id: ["Ulsidex", "Inpepsa"],
  class: "Gastroproteksi",
  category: ["gi"],
  common_in_id: true,
  mechanism: "Cytoprotective agent. Tidak menaikkan pH lambung.",
  indications: { icu_primary: ["Profilaksis SUP"] },
  contraindications: ["Disfagia berat"],
  precautions: ["Toksisitas aluminium pada gagal ginjal"],
  dosing: {
    standard: "1 g tiap 6 jam PO/NGT",
    route: ["PO", "NGT"]
  },
  renal_adjustment: {
    ge60:   { dose: "1 g", interval: "q6j", note: "Dosis standar" },
    r30_60: { dose: "1 g", interval: "q6j", note: "Monitor potensi akumulasi aluminium" },
    r15_30: { dose: "1 g", interval: "q12j s.d q24j", note: "Kurangi frekuensi. Hanya disarankan untuk penggunaan jangka pendek." },
    r_lt15: { dose: "Hindari bila ada alternatif", interval: "—", note: "Risiko tinggi toksisitas aluminium sistemik (osteomalasia, ensefalopati)" },
    hd:     { dose: "Hindari", interval: "—", note: "Aluminium tidak terdialisis secara efektif" },
    crrt:   { dose: "Gunakan dengan ekstra hati-hati", interval: "q12j", note: "Batasi durasi <5 hari" },
    badge: "adjust",
    dialyzable: false,
    monitoring_renal: "Kreatinin harian, konsistensi feses, status neurologis"
  },
  pregnancy: { fda_category: "B" },
  monitoring: { safety: ["Fungsi ginjal", "Konstipasi"] },
  adverse_effects: { critical: ["Toksisitas aluminium (gagal ginjal)"] },
  pump_link: false
},

"metoklopramid": {
  name: "Metoklopramid",
  brand_id: ["Primperan", "Vometa"],
  class: "Prokinetik",
  category: ["gi", "antiemetik"],
  common_in_id: true,
  mechanism: "D2 antagonist. Mencegah PONV, gastroparesis.",
  indications: { icu_primary: ["Gastroparesis ICU", "PONV"] },
  contraindications: ["Obstruksi mekanik GI", "Perdarahan GI"],
  precautions: ["Efek ekstrapiramidal (EPS)"],
  dosing: {
    standard: "10 mg IV q6-8h",
    route: ["IV", "PO"]
  },
  renal_adjustment: {
    ge60:   { dose: "10 mg IV", interval: "q8j", note: "Bolus lambat >2 menit untuk meminimalkan kecemasan transien" },
    r30_60: { dose: "5–10 mg IV", interval: "q8j s.d q12j", note: "Pada eGFR <40: gunakan 50% dosis standar (5 mg)" },
    r15_30: { dose: "5 mg IV", interval: "q12j", note: "Kurangi dosis 50% dan kurangi frekuensi pemberian" },
    r_lt15: { dose: "5 mg IV", interval: "q24j", note: "Dosis minimal. Risiko tinggi EPS (distonia akut, tardive dyskinesia)." },
    hd:     { dose: "5 mg IV", interval: "q24j", note: "Tidak terdialisis secara signifikan. Berikan pasca-sesi." },
    crrt:   { dose: "5 mg IV", interval: "q12j", note: "Sesuaikan dengan evaluasi gejala ekstrapiramidal berkala" },
    badge: "reduce",
    dialyzable: false,
    monitoring_renal: "Wajib pantau ketat efek ekstrapiramidal (EPS) seperti kekakuan otot/distonia"
  },
  pregnancy: { fda_category: "B" },
  monitoring: { safety: ["EPS", "QTc"] },
  adverse_effects: { critical: ["Tardive dyskinesia", "Distonia akut"] },
  pump_link: false
},

"ondansetron": {
  name: "Ondansetron",
  brand_id: ["Zofran"],
  class: "Antiemetik",
  category: ["antiemetik"],
  common_in_id: true,
  mechanism: "5-HT3 antagonist.",
  indications: { icu_primary: ["PONV", "Mual akibat opioid/kemoterapi"] },
  contraindications: ["QT memanjang berat"],
  precautions: ["QTc prolongasi"],
  dosing: {
    standard: "4-8 mg IV q8h",
    route: ["IV", "PO"]
  },
  renal_adjustment: {
    ge60:   { dose: "4–8 mg IV", interval: "q8j", note: "Normal" },
    r30_60: { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    hd:     { dose: "Normal", interval: "Normal", note: "Tidak terdialisis" },
    crrt:   { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "EKG (QTc) bila ada hipokalemia/hipomagnesemia sekutu"
  },
  pregnancy: { fda_category: "B" },
  monitoring: { safety: ["EKG (QTc)"] },
  adverse_effects: { critical: ["Aritmia", "QT prolongasi"] },
  pump_link: false
},

"nac_iv": {
  name: "N-Acetylcysteine (NAC) IV",
  brand_id: ["Fluimucil", "Parvolex"],
  class: "Antidot / Hepatoprotektif",
  category: ["antidot"],
  common_in_id: true,
  mechanism: "Prekursor glutathione.",
  indications: { icu_primary: ["Overdosis parasetamol"] },
  contraindications: ["Hipersensitivitas"],
  precautions: ["Reaksi anaphylactoid"],
  dosing: {
    standard: "Protokol 21 jam (150 mg/kg -> 50 mg/kg -> 100 mg/kg)",
    route: ["IV"]
  },
  renal_adjustment: {
    ge60:   { dose: "Sesuai protokol parasetamol (150mg/kg -> 50mg/kg -> 100mg/kg)", interval: "Siklus 21 jam", note: "Normal" },
    r30_60: { dose: "Normal", interval: "Normal", note: "Tidak ada penyesuaian" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Tidak ada penyesuaian" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "Tidak ada penyesuaian" },
    hd:     { dose: "Normal", interval: "Normal", note: "Sangat terdialisis, namun ikuti protokol keracunan standar" },
    crrt:   { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    badge: "safe",
    dialyzable: true,
    monitoring_renal: "Pantau reaksi anafilaktoid harian dan urin output"
  },
  pregnancy: { fda_category: "B" },
  monitoring: { safety: ["Reaksi alergi"] },
  adverse_effects: { critical: ["Anaphylactoid rx saat loading"] },
  pump_link: false
},

"atrakurium": {
  name: "Atrakurium",
  brand_id: ["Tracrium"],
  class: "NMB",
  category: ["nmb"],
  common_in_id: true,
  mechanism: "Degradasi Hofmann. Histamin rilis lebih sering dari sisatrakurium.",
  indications: { icu_primary: ["Fasilitasi intubasi", "ARDS berat"] },
  contraindications: ["Tanpa sedasi"],
  precautions: ["Histamin release"],
  dosing: {
    standard: "Intubasi 0.4-0.5 mg/kg. Infus 5-10 mcg/kg/min",
    route: ["IV"]
  },
  renal_adjustment: {
    ge60:   { dose: "Mulai 5–10 mcg/kg/min", interval: "Infus Kontinyu", note: "Normal setelah bolus 0.4–0.5 mg/kg" },
    r30_60: { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian (Eliminasi Hofmann mandiri)" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "Kelebihan metabolit laudanosine berisiko epilektogenik teoretis pada infus jangka sangat panjang" },
    hd:     { dose: "Normal", interval: "Normal", note: "Tidak terdialisis (ikatan protein tinggi)" },
    crrt:   { dose: "Normal", interval: "Normal", note: "Degradasi Hofmann tetap berjalan lancar" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "TOF (Train of Four) untuk monitoring tingkat blok neuromuskular"
  },
  pregnancy: { fda_category: "C" },
  monitoring: { safety: ["TOF"] },
  adverse_effects: { critical: ["ICUAW", "Neurotoksisitas (laudanosine)"] },
  pump_link: false
},

"diltiazem": {
  name: "Diltiazem",
  brand_id: ["Herbeser"],
  class: "Calcium Channel Blocker",
  category: ["antihipertensi", "antiaritmia"],
  common_in_id: true,
  mechanism: "Blok kanal kalsium di nodus SA/AV. Inotropik negatif ringan.",
  indications: { icu_primary: ["Rate control AF dengan RVR"] },
  contraindications: ["Gagal jantung berat EF<30%", "Kombinasi beta-blocker IV"],
  precautions: ["Bradikardia", "Hipotensi"],
  dosing: {
    standard: "0.25 mg/kg bolus, lalu 5-15 mg/jam infus",
    route: ["IV"]
  },
  renal_adjustment: {
    ge60:   { dose: "Mulai 5–15 mg/jam", interval: "Infus Kontinyu", note: "Normal setelah bolus diltiazem" },
    r30_60: { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    r_lt15: { dose: "Mulai dengan dosis rendah", interval: "Normal", note: "Mulai 5 mg/jam, titrasi ekstra hati-hati" },
    hd:     { dose: "Normal", interval: "Normal", note: "Tidak terdialisis secara signifikan" },
    crrt:   { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Laju jantung (HR) kontinyu dan Tekanan Darah harian"
  },
  pregnancy: { fda_category: "C" },
  monitoring: { safety: ["HR", "TD"] },
  adverse_effects: { critical: ["Blok AV"] },
  pump_link: true,
  pump_drug_key: "diltiazem"
}

};
