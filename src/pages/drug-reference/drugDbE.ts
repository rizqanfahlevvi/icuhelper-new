import { DrugDatabase } from './types';

export const ICU_DRUGS: DrugDatabase = {

"sefoperazon_sulbaktam": {
  name: "Cefoperazone-Sulbactam",
  brand_id: ["Sulperazon"],
  class: "Sefalosporin gen-3 + inhibitor β-laktamase",
  category: ["antibiotik"],
  common_in_id: true,
  mechanism: "Sulbaktam memiliki aktivitas intrinsik vs Acinetobacter baumannii.",
  indications: { icu_primary: ["Infeksi Acinetobacter", "VAP/HAP"] },
  contraindications: ["Alergi sefalosporin/penisilin"],
  precautions: ["Efek disulfiram dengan alkohol", "Koagulopati"],
  dosing: {
    standard: "2 g (1g/1g) IV q12j",
    route: ["IV"]
  },
  renal_adjustment: {
    ge60:   { dose: "2 g (1g/1g)", interval: "q12j", note: "Dosis standar" },
    r30_60: { dose: "2 g (1g/1g)", interval: "q12j", note: "Tidak diperlukan penyesuaian" },
    r15_30: { dose: "2 g (1g/1g)", interval: "q12j", note: "Maksimal sulbaktam 4 g/hari" },
    r_lt15: { dose: "1–2 g (0.5g/0.5g s.d 1g/1g)", interval: "q12j", note: "Maksimal sulbaktam 2 g/hari" },
    hd:     { dose: "1–2 g", interval: "q12j", note: "Berikan SETELAH sesi HD" },
    crrt:   { dose: "2 g", interval: "q12j", note: "Terdialisis oleh CRRT" },
    badge: "adjust",
    dialyzable: true,
    monitoring_renal: "Fungsi ginjal berkala (Kreatinin/BUN)"
  },
  pregnancy: { fda_category: "B" },
  monitoring: { safety: ["PT/INR"] },
  adverse_effects: { critical: ["Koagulopati"] },
  pump_link: false,
  evidence: [
    { ref_id: "perdici2021", note: "Pedoman Tata Laksana Sepsis & Infeksi Acinetobacter baumannii PERDICI 2021" }
  ]
},

"gentamisin": {
  name: "Gentamisin",
  brand_id: ["Garamycin"],
  class: "Aminoglikosida",
  category: ["antibiotik"],
  common_in_id: true,
  mechanism: "Inhibitor 30S.",
  indications: { icu_primary: ["Kombinasi empiris sepsis"] },
  contraindications: ["Miastenia gravis", "Kehamilan"],
  precautions: ["Nefrotoksisitas", "Ototoksisitas"],
  dosing: {
    standard: "5–7 mg/kg IV once-daily",
    route: ["IV"]
  },
  renal_adjustment: {
    ge60:   { dose: "5–7 mg/kg", interval: "q24j", note: "Skema Dosis Sekali Sehari (Extended Interval)" },
    r30_60: { dose: "5–7 mg/kg", interval: "q36j s.d q48j", note: "Penyesuaian interval sangat direkomendasikan" },
    r15_30: { dose: "2–3 mg/kg", interval: "q48j", note: "Atau gunakan dosis konvensional lebih rendah didasarkan level TDM" },
    r_lt15: { dose: "Dosis loading 2 mg/kg, lalu dosis selanjutnya HANYA berdasarkan level serum TDM", interval: "PRN (berdasarkan serum TDM)", note: "Hindari bila ada alternatif non-nefrotoksik" },
    hd:     { dose: "1–1.5 mg/kg", interval: "Setiap selesai HD", note: "Sangat terdialisis. Berikan pasca-HD." },
    crrt:   { dose: "2–2.5 mg/kg", interval: "q24j s.d q48j", note: "Gunakan panduan TDM ketat" },
    badge: "adjust",
    dialyzable: true,
    monitoring_renal: "Level Trough (target <1 mcg/mL), level Peak, Kreatinin tiap 48 jam"
  },
  pregnancy: { fda_category: "D" },
  monitoring: { safety: ["Level TDM", "Kreatinin"] },
  adverse_effects: { critical: ["Ototoksisitas"] },
  pump_link: false,
  evidence: [
    { ref_id: "kdigo2012", note: "KDIGO Clinical Practice Guideline for Acute Kidney Injury — Amikacin & Gentamicin Extended-Interval Dosing" }
  ]
},

"seftazidim": {
  name: "Ceftazidime",
  brand_id: ["Fortum"],
  class: "Sefalosporin",
  category: ["antibiotik"],
  common_in_id: true,
  mechanism: "Sefalosporin anti-pseudomonal gen 3.",
  indications: { icu_primary: ["VAP Pseudomonas", "Neutropenia febris"] },
  contraindications: ["Alergi sefalosporin"],
  precautions: ["Penyesuaian ginjal", "Tidak cover gram-positif"],
  dosing: {
    standard: "1–2 g IV q8j",
    route: ["IV"]
  },
  renal_adjustment: {
    ge60:   { dose: "1–2 g", interval: "q8j", note: "Dosis standar" },
    r30_60: { dose: "1–2 g", interval: "q12j", note: "Penyesuaian interval" },
    r15_30: { dose: "1 g", interval: "q24j", note: "Penyesuaian dosis dan interval" },
    r_lt15: { dose: "500 mg s.d 1 g", interval: "q24j s.d q48j", note: "Risiko neurotoksisitas/ensefalopati sefalosporin pada akumulasi" },
    hd:     { dose: "1 g loading, dilanjutkan 500 mg s.d 1 g", interval: "Setiap selesai HD", note: "Sangat terdialisis. Tambahkan dosis pasca-HD." },
    crrt:   { dose: "1–2 g", interval: "q12j s.d q24j", note: "Tergantung laju ultrafiltrasi CRRT" },
    badge: "adjust",
    dialyzable: true,
    monitoring_renal: "Kreatinin dan status neurologis (waspadai kejang/ensefalopati)"
  },
  pregnancy: { fda_category: "B" },
  monitoring: { safety: ["Kreatinin"] },
  adverse_effects: { critical: ["Ensefalopati"] },
  pump_link: false,
  evidence: [
    { ref_id: "idsa2022", note: "IDSA Guidance on the Treatment of Antimicrobial-Resistant Gram-Negative Infections (Pseudomonas aeruginosa) 2022" }
  ]
},

"moxifloksasin": {
  name: "Moxifloxacin",
  brand_id: ["Avelox"],
  class: "Fluorokuinolon",
  category: ["antibiotik"],
  common_in_id: true,
  mechanism: "Gen 4. Tidak aktif terhadap Pseudomonas. Ekskresi bilier dominan.",
  indications: { icu_primary: ["CAP berat", "HAP non-Pseudomonas"] },
  contraindications: ["QTc prolongasi"],
  precautions: ["Ruptur tendon", "Aritmia"],
  dosing: {
    standard: "400 mg IV/PO q24j",
    route: ["IV", "PO"]
  },
  renal_adjustment: {
    ge60:   { dose: "400 mg", interval: "q24j", note: "Normal" },
    r30_60: { dose: "400 mg", interval: "q24j", note: "Tidak perlu penyesuaian" },
    r15_30: { dose: "400 mg", interval: "q24j", note: "Tidak perlu penyesuaian" },
    r_lt15: { dose: "400 mg", interval: "q24j", note: "Tidak perlu penyesuaian" },
    hd:     { dose: "400 mg", interval: "q24j", note: "Tidak terdialisis. Berikan tanpa tambahan dosis post-HD." },
    crrt:   { dose: "400 mg", interval: "q24j", note: "Tidak perlu penyesuaian" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Aman untuk ginjal, namun pantau fungsi hati (LFT) dan QTc"
  },
  pregnancy: { fda_category: "C" },
  monitoring: { safety: ["QTc", "LFT"] },
  adverse_effects: { critical: ["Torsades de Pointes", "Hepatotoksisitas"] },
  pump_link: false,
  evidence: [
    { ref_id: "sanford2023", note: "Sanford Guide to Antimicrobial Therapy — Respiratory Fluoroquinolones & Hepatic Elimination Profile" }
  ]
},

"flukonazol": {
  name: "Flukonazol",
  brand_id: ["Diflucan"],
  class: "Antijamur triazol",
  category: ["antifungal"],
  common_in_id: true,
  mechanism: "Inhibisi ergosterol. Resistensi C. krusei dan glabrata.",
  indications: { icu_primary: ["Kandidemia (Candida albicans/parapsilosis/tropicalis)"] },
  contraindications: ["QTc prolongasi ekstrim"],
  precautions: ["Hepatotoksik", "Interaksi obat luas"],
  dosing: {
    standard: "Loading 800 mg, maint 400 mg/hari IV/PO",
    route: ["IV", "PO"]
  },
  renal_adjustment: {
    ge60:   { dose: "Loading 800 mg, diikuti 400 mg", interval: "q24j", note: "Atau loading 400 mg, maint 200 mg q24j" },
    r30_60: { dose: "Gunakan 50% dosis biasa (100–200 mg)", interval: "q24j", note: "Atau mempertahankan dosis penuh dengan interval q48j" },
    r15_30: { dose: "Gunakan 50% dosis biasa (100–200 mg)", interval: "q24j atau q48j", note: "Kurangi dosis atau perpanjang interval" },
    r_lt15: { dose: "Gunakan 50% dosis biasa (50–100 mg)", interval: "q24j atau q48j", note: "Penyesuaian dosis ekstrim" },
    hd:     { dose: "Normal (100–200 mg)", interval: "Setiap selesai HD", note: "Sangat terdialisis. Berikan dosis pasca-HD." },
    crrt:   { dose: "200–400 mg", interval: "q24j", note: "Clearance CRRT tinggi, pertahankan dosis normal" },
    badge: "reduce",
    dialyzable: true,
    monitoring_renal: "Fungsi ginjal berkala, LFT, QTc interval"
  },
  pregnancy: { fda_category: "D" },
  monitoring: { safety: ["LFT", "Kultur"] },
  adverse_effects: { critical: ["Hepatotoksisitas berat"] },
  pump_link: false,
  evidence: [
    { ref_id: "idsa2016", note: "IDSA Clinical Practice Guideline for the Management of Candidiasis — Fluconazole renal dosing guidelines" }
  ]
},

"kaspofungin": {
  name: "Kaspofungin",
  brand_id: ["Cancidas"],
  class: "Antijamur echinocandin",
  category: ["antifungal"],
  common_in_id: false,
  mechanism: "Inhibisi beta-(1,3)-D-glucan sintase. First line Candida ICU.",
  indications: { icu_primary: ["Kandidemia ICU"] },
  contraindications: ["Hipersensitivitas"],
  precautions: ["Hepatotoksik"],
  dosing: {
    standard: "Loading 70 mg, maint 50 mg/hari IV",
    route: ["IV"]
  },
  renal_adjustment: {
    ge60:   { dose: "Loading 70 mg, maint 50 mg", interval: "q24j", note: "Normal" },
    r30_60: { dose: "Normal (Loading 70 mg, maint 50 mg)", interval: "q24j", note: "Tidak perlu penyesuaian" },
    r15_30: { dose: "Normal (Loading 70 mg, maint 50 mg)", interval: "q24j", note: "Tidak perlu penyesuaian" },
    r_lt15: { dose: "Normal (Loading 70 mg, maint 50 mg)", interval: "q24j", note: "Tidak perlu penyesuaian" },
    hd:     { dose: "Normal", interval: "q24j", note: "Tidak dialisis. Berikan dosis normal tanpa suplemen." },
    crrt:   { dose: "Normal", interval: "q24j", note: "Tidak perlu penyesuaian" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Bukan nefrotoksik, hanya monitor fungsi hati (LFT)"
  },
  pregnancy: { fda_category: "C" },
  monitoring: { safety: ["LFT"] },
  adverse_effects: { critical: ["Anafilaksis"] },
  pump_link: false,
  evidence: [
    { ref_id: "idsa2016_cas", note: "IDSA Clinical Practice Guideline for the Management of Candidiasis — Echinocandins as first-line empiric therapy in ICU" }
  ]
},

"vorikonazol": {
  name: "Vorikonazol",
  brand_id: ["Vfend"],
  class: "Antijamur triazol",
  category: ["antifungal"],
  common_in_id: false,
  mechanism: "Gen 2 spektrum luas.",
  indications: { icu_primary: ["Aspergillosis invasif (first-line)"] },
  contraindications: ["Penggunaan rifampisin"],
  precautions: ["Visi buram", "TDM wajib"],
  dosing: {
    standard: "Loading 6 mg/kg q12j, maint 4 mg/kg IV q12j",
    route: ["IV", "PO"]
  },
  renal_adjustment: {
    ge60:   { dose: "Loading 6 mg/kg [IV], maint 4 mg/kg [IV]", interval: "q12j", note: "Atau oral: 200 mg q12j" },
    r30_60: { dose: "Oral lebih disukai (200 mg)", interval: "q12j", note: "Hindari IV jika eGFR <50 karena risiko akumulasi pembawa SBECD nefrotoksik" },
    r15_30: { dose: "Oral: 200 mg", interval: "q12j", note: "Bila terpaksa IV: pantau ketat kreatinin, monitor akumulasi excipient SBECD" },
    r_lt15: { dose: "Oral: 200 mg", interval: "q12j", note: "Hindari IV sama sekali. SBECD tidak dapat diekskresi." },
    hd:     { dose: "Oral: 200 mg", interval: "q12j", note: "SBECD terdialisis oleh HD, namun oral tetap disukai. Dosis pasca-HD." },
    crrt:   { dose: "Normal (IV atau Oral)", interval: "q12j", note: "SBECD dibersihkan oleh CRRT secara efisien, sehingga infus IV aman" },
    badge: "adjust",
    dialyzable: "Hanya pembawa SBECD yang terdialisis",
    monitoring_renal: "Kreatinin harian jika infus IV pada eGFR <50, TDM level serum"
  },
  pregnancy: { fda_category: "D" },
  monitoring: { safety: ["Level Trough", "LFT"] },
  adverse_effects: { critical: ["Hepatotoksisitas"] },
  pump_link: false,
  evidence: [
    { ref_id: "idsa2016_asp", note: "IDSA Practice Guidelines for the Diagnosis and Management of Aspergillosis — Oral vs IV Voriconazole in renal impairment" }
  ]
},

"oseltamivir": {
  name: "Oseltamivir",
  brand_id: ["Tamiflu"],
  class: "Antiviral",
  category: ["antiviral"],
  common_in_id: true,
  mechanism: "Inhibitor neuraminidase.",
  indications: { icu_primary: ["Influenza berat (tambahan >48 jam tetap diberikan)"] },
  contraindications: ["Gagal ginjal terminal tanpa HD"],
  precautions: ["Halusinasi"],
  dosing: {
    standard: "150 mg PO q12j untuk ICU",
    route: ["PO"]
  },
  renal_adjustment: {
    ge60:   { dose: "75–150 mg", interval: "q12j", note: "Dosis penuh" },
    r30_60: { dose: "30–75 mg", interval: "q12j", note: "Penyesuaian dosis dasar" },
    r15_30: { dose: "30 mg q12j atau 75 mg", interval: "q24j", note: "Penyesuaian dosis dan interval" },
    r_lt15: { dose: "30 mg", interval: "q24j s.d q48j", note: "Penyesuaian interval ekstrim" },
    hd:     { dose: "30 mg", interval: "Pasca sesi HD", note: "Berikan setelah tiap sesi HD (biasanya 3x seminggu)" },
    crrt:   { dose: "30 mg q12j atau 75 mg", interval: "q24j", note: "Dibersihkan sedang oleh CRRT" },
    badge: "reduce",
    dialyzable: true,
    monitoring_renal: "Fungsi ginjal untuk penyesuaian dosis harian"
  },
  pregnancy: { fda_category: "C" },
  monitoring: { safety: ["Fungsi ginjal"] },
  adverse_effects: { critical: ["Delirium"] },
  pump_link: false,
  evidence: [
    { ref_id: "cdc_flu2023", note: "CDC Influenza Antiviral Guidelines for Clinicians — treatment in hospitalized patient and renal dose adjustments" }
  ]
},

"asiklovir_iv": {
  name: "Asiklovir IV",
  brand_id: ["Zovirax"],
  class: "Antiviral",
  category: ["antiviral"],
  common_in_id: true,
  mechanism: "Analog nukleosida (menghambat DNA polimerase herpes).",
  indications: { icu_primary: ["Ensefalitis HSV"] },
  contraindications: ["Hipersensitivitas"],
  precautions: ["Kristaluria (hidrasi wajib)", "Neurotoksisitas gagal ginjal"],
  dosing: {
    standard: "10 mg/kg IV q8j (14-21 hari)",
    route: ["IV"]
  },
  renal_adjustment: {
    ge60:   { dose: "10 mg/kg", interval: "q8j", note: "Infus lambat >1 jam. Hidrasi cukup wajib untuk mencegah kristaluria!" },
    r30_60: { dose: "10 mg/kg", interval: "q12j", note: "Penyesuaian interval" },
    r15_30: { dose: "10 mg/kg", interval: "q24j", note: "Penyesuaian interval signifikan" },
    r_lt15: { dose: "5 mg/kg", interval: "q24j", note: "Kurangi dosis & perpanjang interval" },
    hd:     { dose: "5 mg/kg", interval: "q24j", note: "Berikan SETELAH sesi HD pada hari dialisis (60% dibersihkan)" },
    crrt:   { dose: "5–10 mg/kg", interval: "q12j s.d q24j", note: "Pantau klirens, hidrasi cukup" },
    badge: "reduce",
    dialyzable: true,
    monitoring_renal: "Kreatinin harian, urin output, hidrasi cairan IV"
  },
  pregnancy: { fda_category: "B" },
  monitoring: { safety: ["Kreatinin", "Volume urin"] },
  adverse_effects: { critical: ["Nefrotoksisitas ATN"] },
  pump_link: false,
  evidence: [
    { ref_id: "idsa2008_enc", note: "IDSA Practice Guidelines for the Management of Encephalitis — High dose IV Acyclovir and hydration protocol to prevent ATN" }
  ]
},

"gansiklovir": {
  name: "Gansiklovir",
  brand_id: ["Cymevene"],
  class: "Antiviral",
  category: ["antiviral"],
  common_in_id: false,
  mechanism: "Analog guanosin. Ul97 kinase spesifik.",
  indications: { icu_primary: ["CMV end-organ disease"] },
  contraindications: ["Neutrofil <500"],
  precautions: ["Myelosupresi", "Teratogen"],
  dosing: {
    standard: "Induksi 5 mg/kg IV q12j",
    route: ["IV"]
  },
  renal_adjustment: {
    ge60:   { dose: "5 mg/kg (induksi)", interval: "q12j", note: "Dosis pemeliharaan: 5 mg/kg q24j" },
    r30_60: { dose: "2.5 mg/kg", interval: "q12j s.d q24j", note: "eGFR 50-69: 2.5 mg/kg q12j; eGFR 25-49: 2.5 mg/kg q24j" },
    r15_30: { dose: "1.25 mg/kg", interval: "q24j", note: "eGFR 10-24: 1.25 mg/kg q24j" },
    r_lt15: { dose: "1.25 mg/kg", interval: "3 kali seminggu", note: "Penyesuaian interval ekstrim" },
    hd:     { dose: "1.25 mg/kg", interval: "Selesai HD", note: "Berikan setelah tiap sesi HD (Sangat terdialisis)" },
    crrt:   { dose: "2.5 mg/kg", interval: "q24j", note: "Sesuaikan dengan TDM bila ada" },
    badge: "reduce",
    dialyzable: true,
    monitoring_renal: "CBC (neutropenia berat), Kreatinin harian berkala"
  },
  pregnancy: { fda_category: "C" },
  monitoring: { safety: ["CBC tiap 2 kali seminggu"] },
  adverse_effects: { critical: ["Neutropenia berat"] },
  pump_link: false,
  evidence: [
    { ref_id: "transplant2020", note: "International Consensus Guidelines on the Management of Cytomegalovirus in Solid Organ Transplant" }
  ]
},

"nikardipin": {
  name: "Nikardipin",
  brand_id: ["Perdipine"],
  class: "Antihipertensi",
  category: ["antihipertensi"],
  common_in_id: true,
  mechanism: "CCB dihidropiridin. Vasodilatasi perifer dan koroner.",
  indications: { icu_primary: ["Hipertensi berat / krisis hipertensi"] },
  contraindications: ["Stenosis aorta berat"],
  precautions: ["Reflex tachycardia", "Flebitis"],
  dosing: {
    standard: "5 mg/jam IV, titrasi 2.5 mg/jam tiap 5-15 menit",
    route: ["IV"]
  },
  renal_adjustment: {
    ge60:   { dose: "Normal (Mulai 5 mg/jam)", interval: "Kontinu", note: "Normal" },
    r30_60: { dose: "Mulai 5 mg/jam", interval: "Kontinu", note: "Titrasi lebih lambat/hati-hati" },
    r15_30: { dose: "Mulai 2.5–5 mg/jam", interval: "Kontinu", note: "Titrasi perlahan" },
    r_lt15: { dose: "Mulai 2.5 mg/jam", interval: "Kontinu", note: "Titrasi dan monitor TD ketat" },
    hd:     { dose: "Normal", interval: "Kontinu", note: "Tidak terdialisis. Monitor TD harian." },
    crrt:   { dose: "Normal", interval: "Kontinu", note: "Titrasi biasa" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Tekanan darah kontinyu, urin output harian"
  },
  pregnancy: { fda_category: "C" },
  monitoring: { safety: ["TD", "HR"] },
  adverse_effects: { critical: ["Hipotensi", "Tachycardia"] },
  pump_link: true,
  pump_drug_key: "nikardipin",
  evidence: [
    { ref_id: "aha2019_stroke", note: "AHA/ASA Guidelines for the Early Management of Patients with Acute Ischemic Stroke — Nicardipine continuous infusion" }
  ]
},

"labetolol": {
  name: "Labetalol",
  brand_id: ["Trandate"],
  class: "Antihipertensi",
  category: ["antihipertensi"],
  common_in_id: false,
  mechanism: "Alfa-1 + Beta (1&2) Blocker. Menurunkan SVR tanpa reflex tachycardia.",
  indications: { icu_primary: ["Hipertensi preeklampsia/eklampsia", "Diseksi aorta"] },
  contraindications: ["Asma berat", "Bradikardia"],
  precautions: ["Bronkospasme", "Hipotensi"],
  dosing: {
    standard: "20 mg IV bolus",
    route: ["IV"]
  },
  renal_adjustment: {
    ge60:   { dose: "20 mg bolus lambat", interval: "Interval PRN", note: "Normal" },
    r30_60: { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    r15_30: { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    r_lt15: { dose: "Normal", interval: "Normal", note: "Gunakan titrasi hati-hati" },
    hd:     { dose: "Normal", interval: "Normal", note: "Tidak terdialisis secara bermakna" },
    crrt:   { dose: "Normal", interval: "Normal", note: "Tidak perlu penyesuaian" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Denyut jantung (HR) dan tekanan darah berkala"
  },
  pregnancy: { fda_category: "C" },
  monitoring: { safety: ["HR", "SpO2"] },
  adverse_effects: { critical: ["Bradikardia berat", "Gagal jantung"] },
  pump_link: false,
  evidence: [
    { ref_id: "acog2020", note: "ACOG Practice Bulletin No. 222: Gestational Hypertension and Preeclampsia — IV Labetalol acute dosing" }
  ]
},

"esmolol": {
  name: "Esmolol",
  brand_id: ["Brevibloc"],
  class: "Antihipertensi / Antiaritmia",
  category: ["antihipertensi", "antiaritmia"],
  common_in_id: false,
  mechanism: "Beta-1 Blocker ultra-short acting. Metabolisme esterase.",
  indications: { icu_primary: ["SVT", "Hipertensi perioperatif", "Diseksi aorta"] },
  contraindications: ["Bradikardia", "Asma bronkial berat"],
  precautions: ["Loading dose"],
  dosing: {
    standard: "Loading 500 mcg/kg, maint 50 mcg/kg/min",
    route: ["IV"]
  },
  renal_adjustment: {
    ge60:   { dose: "Mulai 50 mcg/kg/min", interval: "Kontinu", note: "Normal setelah loading" },
    r30_60: { dose: "Normal", interval: "Kontinu", note: "Tidak perlu penyesuaian" },
    r15_30: { dose: "Normal dengan monitoring", interval: "Kontinu", note: "Akumulasi metabolit asam (AS-1), pantau sedasi/TD" },
    r_lt15: { dose: "Gunakan dosis minimal, titrasi lambat", interval: "Kontinu", note: "Akumulasi metabolit asam bermakna. Monitor aritmia." },
    hd:     { dose: "Gunakan dosis minimal", interval: "Kontinu", note: "Terdialisis sedang" },
    crrt:   { dose: "Normal", interval: "Kontinu", note: "Dibersihkan dengan baik oleh CRRT" },
    badge: "safe",
    dialyzable: true,
    monitoring_renal: "EKG kontinyu, tekanan darah, tanda akumulasi metabolit"
  },
  pregnancy: { fda_category: "C" },
  monitoring: { safety: ["EKG", "TD"] },
  adverse_effects: { critical: ["Asistol"] },
  pump_link: true,
  pump_drug_key: "esmolol",
  evidence: [
    { ref_id: "acc_aha2015", note: "ACC/AHA/HRS Guideline for the Management of Adult Patients with Supraventricular Tachycardia — Esmolol rapid-titration" }
  ]
},

"ceftriakson": {
  name: "Ceftriakson",
  brand_id: ["Broadced", "Ceftriaxone Indofarma", "Rocephin", "Cefaxon"],
  brand_id_notes: "Rocephin adalah sediaan inovator. Terjual sangat luas baik generik maupun bermerek di Indonesia.",
  class: "Antibiotik β-laktam",
  subclass: "Sefalosporin Gen-3",
  category: ["antibiotik"],
  common_in_id: true,
  common_in_id_note: "Lini pertama yang paling sering digunakan di IGD, bangsal, dan ICU seluruh Indonesia.",
  mechanism: "Inhibisi sintesis dinding sel bakteri dengan mengikat Penicillin-Binding Proteins (PBP). Memiliki aktivitas broad-spectrum gram-negatif sediaan non-pseudomonal dan beberapa gram-positif.",
  pkpd_type: "time_dependent",
  pkpd_note: "Target T>MIC. Waktu paruh panjang (~8 jam) memungkinkan pemberian satu kail sehari (q24j).",
  spectrum: {
    gram_pos: "Sangat baik terhadap Streptococcus pneumoniae, cukup untuk Staphylococcus aureus (MSSA). Enterococcus: RESISTEN.",
    gram_neg: "Sangat baik terhadap Neisseria spp., H. influenzae, E. coli dan Klebsiella pneumoniae (bukan ESBL). Pseudomonas: RESISTEN total.",
    anaerob: "Terbatas (Bacteroides fragilis resisten)",
    mrsa: false,
    vre: false,
    esbl: false,
    pseudomonas: false,
    acinetobacter: false,
    fungi: null as any,
    virus: null as any
  },
  indications: {
    icu_primary: ["Terapi empiris pneumonia komunitas (CAP) rawat inap erat/ICU (kombinasi makrolida/respiratory kuinolon)", "Meningitis bakteri (dosis tinggi 2g tiap 12 jam)", "Sepsis intra-abdominal (dikombinasikan dengan metronidazol)"],
    icu_secondary: ["Infeksi saluran kemih (ISK) berkomplikasi dan urosepsis", "Profilaksis bedah perioperatif (bedah kardiovaskular dan neurologis tertentu)"],
    local_guideline: "PPM PAPDI / PDPI: Ceftriakson + Azitromisin/Levofloksasin direkomendasikan untuk CAP derajat sedang-berat di IGD.",
    intl_guideline: "Sanford Guide 2024: Ceftriaxone adalah tulang punggung terapi empiris CAP rawat inap dan meningitis bakteri akut."
  },
  contraindications: ["Hipersensitivitas terhadap sefalosporin atau penisilin dengan reaksi tipe cepat", "Neonatus dengan ikterus (risiko ensefalopati bilirubin) atau neonatus yang membutuhkan terapi kalsium IV"],
  precautions: ["Penggunaan kalsium IV bersamaan (risiko presipitasi garam kalsium-ceftriaxone di organ vital)", "Dosis tinggi jangka panjang dapat menyebabkan kolesistitis semu (biliary sludge)"],
  dosing: {
    standard: "1–2 g IV setiap 24 jam",
    range_low: "1 g IV setiap 24 jam",
    range_high: "2 g IV setiap 12 jam (untuk infeksi SSP/meningitis)",
    max: "4 g/hari",
    loading: null as any,
    maintenance: "1–2 g q24j tergantung lokasi and keparahan infeksi",
    route: ["IV"],
    dilution: "1 g dilarutkan dalam 10 mL larutan steril (bolus lambat) ATAU 50-100 mL NS/D5W untuk infus jangka pendek.",
    rate: "Bolus IV lambat selama 2–4 menit atau infus IV selama 15–30 menit.",
    titration: null as any,
    special_notes: "⚠️ JANGAN campur dengan cairan mengandung kalsium (misal: Ringer Laktat) dalam jalur infus yang sama."
  },
  renal_adjustment: {
    ge60:   { dose: "1–2 g", interval: "q24j", note: "Normal" },
    r30_60: { dose: "1–2 g", interval: "q24j", note: "Sangat aman. Penyesuaian tidak diperlukan." },
    r15_30: { dose: "1–2 g", interval: "q24j", note: "Tidak perlu penyesuaian selama fungsi hati normal." },
    r_lt15: { dose: "Maks 2 g", interval: "q24j", note: "Aman tanpa akumulasi berlebih karena kompensasi eliminasi empedu." },
    hd:     { dose: "Normal (Maks 2g/hari)", interval: "q24j", note: "Tidak tereliminasi melalui dialisis, tidak perlu dosis tambahan post-HD." },
    crrt:   { dose: "1–2 g", interval: "q24j", note: "Aman tanpa modifikasi" },
    badge: "safe",
    dialyzable: false,
    monitoring_renal: "Kreatinin dan output urin harian"
  },
  pregnancy: { fda_category: "B" },
  monitoring: { safety: ["Fungsi ginjal dan hepar (berkala)", "Adanya nyeri perut kanan atas (tanda pseudokolesistitis)"] },
  adverse_effects: { critical: ["Anafilaksis", "Kolesistitis semu (biliary sludge)", "Diare akibat Clostridioides difficile"] },
  pump_link: false,
  evidence: [
    { ref_id: "sanford2024", note: "Sanford Guide to Antimicrobial Therapy 2024 — Ceftriaxone dosing & pharmacology" },
    { ref_id: "idsa2004_men", note: "IDSA Practice Guidelines for the Management of Bacterial Meningitis — Ceftriaxone 2g q12j recommendations" }
  ]
},

"vankomisin": {
  name: "Vankomisin",
  brand_id: ["Vancep", "Vancomycin HCl", "Vancocin"],
  brand_id_notes: "Tersedia sediaan generik dan paten. Biasanya dilarutkan dalam NS.",
  class: "Antibiotik Glikopeptida",
  subclass: "Glikopeptida",
  category: ["antibiotik"],
  common_in_id: true,
  common_in_id_note: "Garis pertahanan utama untuk Gram-positif resisten (MRSA) di IGD, ICU, dan bangsal bedah.",
  mechanism: "Menghambat sintesis dinding sel bakteri dengan mengikat kuat prekursor peptidoglikan D-alanyl-D-alanine, merusak polimerisasi.",
  pkpd_type: "auc_mic",
  pkpd_note: "Target AUC24/MIC ≥400 hingga 600 untuk efikasi klinis maksimal dan pencegahan cedera ginjal akut (AKI).",
  spectrum: {
    gram_pos: "Sangat baik terhadap Staphylococcus aureus (termasuk MRSA), Staphylococcus epidermidis (MRSE), Streptococcus spp., Enterococcus faecalis. C. difficile (oral).",
    gram_neg: "RESISTEN total (molekul terlalu besar)",
    anaerob: "Hanya Gram-positif anaerob (seperti Clostridium spp.)",
    mrsa: true,
    vre: false,
    esbl: false,
    pseudomonas: false,
    acinetobacter: false,
    fungi: null as any,
    virus: null as any
  },
  indications: {
    icu_primary: ["Terapi empiris/definitif sepsis berat/syok septik dengan risiko tinggi MRSA", "HAP/VAP berat dengan faktor risiko resistensi antibiotik multidrug", "Meningitis bakteri (kombinasi seftriakson untuk pneumokokus resisten penicilin)"],
    icu_secondary: ["Infeksi kateter vaskular (line-associated infections)", "Kolitis pseudomembranosa berat akibat Clostridioides difficile (HANYA via RUTE ORAL/NGT, tidak efektif via IV)"],
    local_guideline: "PPM IDSA/PERDICI VAP 2021: Gunakan vankomisin IV jika sediaan klinis mencurigakan MRSA atau prevalensi lokal >10-20%.",
    intl_guideline: "IDSA/ASHP Consensus Guideline 2020: Target terapi berbasis pemantauan kadar obat terapeutik (bayesian AUC atau level trough 15–20 mcg/mL)."
  },
  contraindications: ["Riwayat hipersensitivitas parah terhadap vankomisin"],
  precautions: ["Risiko tinggi toksisitas ginjal jika digabungkan dengan piperasilin-tazobaktam", "Red Man Syndrome saat diinfus terlalu cepat", "Ototoksisitas bilamana dikombinasikan dengan aminoglikosida"],
  dosing: {
    standard: "15–20 mg/kg IV setiap 8–12 jam (fungsional normal)",
    range_low: "15 mg/kg IV setiap 12 jam",
    range_high: "20 mg/kg IV setiap 8 jam (untuk meningitis/infeksi serius SSP)",
    max: "2 g sekali pemberian / total 4 g per hari",
    loading: "20–35 mg/kg IV dosis muatan tunggal (Sangat penting pada pasien kritis di IGD/ICU untuk mencapai kadar terapeutik dengan cepat)",
    maintenance: "Berdasarkan estimasi eGFR and serum level monitoring",
    route: ["IV", "Oral (khusus sediaan untuk C. difficile)"],
    dilution: "Maksimal konsentrasi 5 mg/mL (misal 500 mg dalam 100 mL, 1 g dalam 200 mL NS atau D5W) untuk menghindari flebitis.",
    rate: "Kecepatan infus MAKSIMAL 10 mg/menit (minimal infus selama 60–120 menit). JANGAN bolus lambat atau cepat.",
    titration: "Sesuaikan berdasarkan kadar trough serum sebelum dosis ke-4 (target 15-20 mcg/mL untuk infeksi serius berkelanjutan).",
    special_notes: "⚠️ Red Man Syndrome disebabkan pelepasan histamin langsung. Bukan alergi sejati. Hentikan rute infus, berikan antihistamin, dan lanjutkan infus dengan setengah kecepatan awal."
  },
  renal_adjustment: {
    ge60:   { dose: "Normal 15–20 mg/kg", interval: "q12j", note: "Mulai dengan loading dose" },
    r30_60: { dose: "15 mg/kg", interval: "q24j", note: "Ekskresi utama lewat urin. Waktu paruh meningkat tajam." },
    r15_30: { dose: "10–15 mg/kg", interval: "q48j", note: "Periksa trough level secara serial. Risiko nefrotoksisitas melonjak." },
    r_lt15: { dose: "500 mg – 1 g sekali", interval: "Dosis berkala (pulse dosing) tiap 3-5 hari saat trough level <15 mg/L", note: "Hindari dosis terjadwal reguler." },
    hd:     { dose: "Mulai loading 15-20 mg/kg, lalu berikan 500-1000 mg post-HD", interval: "Hanya saat kadar serum trough di bawah 15 mcg/mL", note: "Terdialisis sedang oleh membran high-flux. Monitor ketat." },
    crrt:   { dose: "10–15 mg/kg", interval: "q24–48j", note: "Bersihan oleh filtrasi CRRT cukup tinggi. Monitor kadar obat harian." },
    badge: "caution",
    dialyzable: true,
    monitoring_renal: "Kreatinin harian wajib, pemantauan ketat volume urin, and kadar trough vancomycin"
  },
  pregnancy: { fda_category: "C" },
  monitoring: { safety: ["Kreatinin harian (Wajib)", "Kadar trough vankomisin serial", "Fungsi pendengaran bila perlu"] },
  adverse_effects: { critical: ["Cedera Ginjal Akut (AKI)", "Red Man Syndrome berat", "Ototoksisitas/ketulian"] },
  pump_link: false,
  evidence: [
    { ref_id: "idsaashp2020", note: "Therapeutic Monitoring of Vancomycin for Serious Methicillin-Resistant Staphylococcus aureus Infections: IDSA/ASHP 2020 Guideline" },
    { ref_id: "nihvancomycin", note: "Clinical Guidelines for Vancomycin Dosing and Therapeutic Drug Monitoring in ICU Patients" }
  ]
}

};
