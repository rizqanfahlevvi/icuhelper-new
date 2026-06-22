export interface RefItem {
  col1: string;
  col2: string;
  col3: string;
}

export interface RefSection {
  id: string;
  title: string;
  headers: string[];
  items: RefItem[];
}

export const referenceData: RefSection[] = [
  {
    "id": "pembaruan-panduan-studi-kunci-2022-2025",
    "title": "🔥 Pembaruan Panduan & Studi Kunci 2022–2025",
    "headers": [
      "Publikasi / Panduan",
      "Topik",
      "Update Kunci"
    ],
    "items": [
      {
        "col1": "Evans L et al. SSC 2024. Intensive Care Med 2024;50:744",
        "col2": "Sepsis — SSC Update",
        "col3": "Update SSC 2021: perkenalkan resusitasi berbasis perfusi (CRT vs laktat), de-eskalasi antibiotik dipandu PCT, rekomendasi kuat balanced crystalloid."
      },
      {
        "col1": "ESICM ARDS Guidelines 2023. Intensive Care Med 2023;49:727",
        "col2": "ARDS — Guidelines",
        "col3": "Definisi ARDS baru (Global 2023): HFNC =30 L/mnt + SpO2/FiO2 =315 masuk kriteria. Phenotyping hypoinflammatory vs hyperinflammatory. Driving pressure sebagai target utama."
      },
      {
        "col1": "Devlin JW et al. SCCM PADIS 2025. Crit Care Med 2025;53:e711",
        "col2": "Sedasi ICU — PADIS",
        "col3": "Update 2025: dexmedetomidine lebih diutamakan dari propofol untuk sedasi ringan. Penguatan ABCDEF bundle. Targeted light sedation (RASS -1 s/d 0) sebagai standar."
      },
      {
        "col1": "Bhatt DL et al. MENDS-2. NEJM 2024;390:307",
        "col2": "RSI — Induksi",
        "col3": "RCT 686 pasien ICU: etomidate vs ketamine untuk intubasi emergensi — tidak ada perbedaan mortalitas, ventilator-free days, atau vasopressor. Etomidate aman pada sepsis."
      },
      {
        "col1": "Brown CA et al. NEJM 2023;389:1943",
        "col2": "RSI — Teknik",
        "col3": "First-pass success rate =95% dikaitkan ? mortalitas in-hospital. Video laryngoscopy sebagai first-line standard di setting emergensi."
      },
      {
        "col1": "Torres A et al. ERS/ESICM HAP/VAP 2022. Eur Respir J 2022;60:2200",
        "col2": "VAP — Guidelines",
        "col3": "Update 2022: CPIS bukan alat diagnosis utama VAP. Kultur kuantitatif (BAL =104 CFU/mL). De-eskalasi 48–72 jam berbasis kultur. Durasi terapi 7–8 hari untuk sebagian besar VAP."
      },
      {
        "col1": "Cornely OA et al. ESCMID/ECMM 2023. Clin Microbiol Infect 2023",
        "col2": "Kandidiasis Invasif",
        "col3": "Echinocandin (anidulafungin/caspofungin) utama ICU. ß-D-glucan =80 pg/mL sebagai biomarker diagnostik. De-eskalasi ke flukonazol hanya bila pasien stabil + isolat sensitif + klinis membaik."
      },
      {
        "col1": "Gaudry S et al. AKIKI-2. Lancet 2021;397:1293",
        "col2": "RRT — Timing",
        "col3": "Delayed strategy RRT lebih unggul: mortalitas serupa namun 40% pasien terhindar dari RRT. Bukti kuat menunda RRT jika tidak ada indikasi urgensi absolut."
      },
      {
        "col1": "STARRT-AKI Investigators. NEJM 2020;383:240",
        "col2": "RRT — Timing",
        "col3": "3.019 pasien AKI berat: accelerated vs standard RRT — tidak ada perbedaan mortalitas 90-hari. 38,5% kelompok standard tidak butuh RRT sama sekali."
      },
      {
        "col1": "Hernández G et al. ANDROMEDA-SHOCK-2. JAMA 2023;329:1224",
        "col2": "Sepsis — Resusitasi",
        "col3": "CRT-guided vs laktat-guided resusitasi: mortalitas 28-hari setara. CRT =3 detik sebagai target alternatif valid — berguna di sumber daya terbatas tanpa akses laktat cepat."
      },
      {
        "col1": "Hjortrup PB et al. CLASSIC. NEJM 2022;386:2459",
        "col2": "Sepsis — Cairan Restriktif",
        "col3": "Restrictive fluid strategy (stop cairan setelah 1 L post-stabilisasi) vs liberal: mortalitas serupa. Mendukung pendekatan deresusitasi aktif dan target cairan minimal."
      },
      {
        "col1": "Lamontagne F et al. LOVIT. NEJM 2022;386:2387",
        "col2": "Vitamin C — Sepsis",
        "col3": "Vitamin C IV dosis tinggi (66,7 mg/kg/6 jam × 96 jam) pada sepsis: tidak ada manfaat mortalitas — bahkan cenderung lebih buruk. Tidak direkomendasikan rutin."
      },
      {
        "col1": "Fujii T et al. VITAMINS. JAMA 2020;323:423",
        "col2": "Vit C+Hc+Thiamin",
        "col3": "Triple therapy (vitamin C + hidrokortison + tiamin) vs hidrokortison saja: tidak ada perbedaan vasopressor-free days. Kombinasi triple tidak direkomendasikan."
      },
      {
        "col1": "Singer P et al. ESPEN 2023. Clin Nutr 2023;42:1671",
        "col2": "Nutrisi ICU",
        "col3": "Update ESPEN 2023: target protein 1,3 g/kgBB/hari fase akut, naik bertahap ke 1,5–2,0 g/kgBB/hari. EN dini dalam 24–48 jam. Hindari overfeeding awal (hypocaloric feeding fase akut)."
      },
      {
        "col1": "Taylor BE et al. ASPEN/SCCM 2022. JPEN 2022;46:12",
        "col2": "Nutrisi ICU",
        "col3": "ASPEN/SCCM update: EN dalam 24–48 jam, protein 1,2–2,0 g/kgBB/hari, indirect calorimetry gold standard. GRV tidak direkomendasikan sebagai alat monitor EN rutin."
      },
      {
        "col1": "Pun BT et al. ABCDEF Bundle. Crit Care Med 2019;47:3",
        "col2": "ABCDEF Bundle",
        "col3": "15.226 pasien ICU: adherence ABCDEF bundle lebih tinggi ? ? delirium 28%, ? koma, ? mortalitas 30-hari, ? lama rawat ICU, ? restraint fisik. Setiap elemen berkontribusi independen."
      },
      {
        "col1": "Flaatten H et al. Ann Intensive Care 2021;11:22",
        "col2": "Frailty — CFS ICU",
        "col3": "Validasi CFS di ICU usia lanjut: inter-rater reliability kappa 0,78–0,91. CFS =5 ? ? mortalitas dan ? functional recovery pada 6 bulan, independen dari diagnosis primer."
      },
      {
        "col1": "GOLD 2024 Guidelines",
        "col2": "PPOK — Panduan",
        "col3": "Reklasifikasi PPOK: GOLD A/B/E (menggantikan C/D). Penekanan pada personalisasi terapi. NIV pada eksaserbasi berat pH 7,25–7,35 tetap standar. Permissive hypercapnia pada ventilasi invasif."
      }
    ]
  },
  {
    "id": "referensi-internasional-ventilasi-mekanik-ards",
    "title": "Referensi Internasional — Ventilasi Mekanik & ARDS",
    "headers": [
      "Publikasi / Panduan",
      "Topik",
      "Kesimpulan Kunci"
    ],
    "items": [
      {
        "col1": "ARDSNet. NEJM 2000;342:1301",
        "col2": "VT rendah ARDS",
        "col3": "VT 6 vs 12 mL/kg IBW ? mortalitas ? dari 39.8% ? 31%. Landasan lung-protective ventilation."
      },
      {
        "col1": "Guérin C (PROSEVA). NEJM 2013;368:2159",
        "col2": "Prone position",
        "col3": "Prone 16 jam/hari pada P/F <150 ? mortalitas ? 32.8% ? 16%. NNT = 6."
      },
      {
        "col1": "Amato MB. NEJM 2015;372:747",
        "col2": "Driving pressure",
        "col3": "Driving pressure (Pplat-PEEP) prediktor mortalitas terkuat. ?1 cmH2O DP ? ?4–7% mortalitas."
      },
      {
        "col1": "Berlin Definition. JAMA 2012;307:2526",
        "col2": "Definisi ARDS",
        "col3": "Klasifikasi mild/moderate/severe berdasar P/F + PEEP =5. Menggantikan AECC 1994."
      },
      {
        "col1": "Writing Group ARDS Task Force. JAMA 2024",
        "col2": "Global ARDS Definisi",
        "col3": "Revisi 2023: HFNC (SpO2/FiO2 <315, flow =30 L/mnt) dan NIV masuk sebagai kriteria oksigenasi."
      },
      {
        "col1": "Papazian (ACURASYS). NEJM 2010;363:1107",
        "col2": "NMB ARDS",
        "col3": "Cisatrakurium 48 jam pada P/F <120 ? ? barotrauma & mortalitas. ROSE 2019: tidak konfirmasi pada P/F =120."
      },
      {
        "col1": "Frat JP (FLORALI). NEJM 2015;372:2185",
        "col2": "HFNC vs NIV",
        "col3": "HFNC superior untuk hipoksemia akut (non-PPOK): mortalitas 90-hari 35% vs 53% (NIV)."
      },
      {
        "col1": "Ferreyro BL. JAMA 2020;324:57",
        "col2": "NIV meta-analisis",
        "col3": "NIV helmet superior vs face mask NIV dan HFNC untuk mortalitas pada hipoksemia akut."
      },
      {
        "col1": "Roca O. AJRCCM 2019;199:1368",
        "col2": "ROX Index",
        "col3": "ROX <3.85 pada jam 2 ? risiko intubasi tinggi. Validasi prospektif multisenter."
      },
      {
        "col1": "Talmor D. NEJM 2008;359:2095",
        "col2": "Esophageal PEEP",
        "col3": "PEEP guided transpulmonary pressure ? perbaikan oksigenasi & compliance vs ARDSNet table."
      },
      {
        "col1": "Meade MO (LOV). JAMA 2008;299:637",
        "col2": "High PEEP ARDS",
        "col3": "High PEEP tidak ? mortalitas signifikan vs ARDSNet, tapi ? refractory hypoxemia."
      },
      {
        "col1": "Hernandez G. JAMA 2016;316:1565",
        "col2": "HFNC post-ekstubasi",
        "col3": "HFNC superior vs O2 konvensional untuk risiko tinggi re-intubasi dalam 72 jam."
      },
      {
        "col1": "Lawn ND. Neurology 2001;56:1181",
        "col2": "GBS — Rule 20-30-40",
        "col3": "VC <20 mL/kg, MIP <-30, MEP <40 ? intubasi profilaktik."
      },
      {
        "col1": "Rochwerg B. Eur Respir J 2017;50:1602426",
        "col2": "NIV ERS/ATS",
        "col3": "NIV direkomendasikan pada PPOK eksaserbasi berat, edema paru kardiogenik, imunokompromis."
      },
      {
        "col1": "GOLD Guidelines 2024",
        "col2": "PPOK",
        "col3": "NIV pada PPOK eksaserbasi pH 7.25–7.35. Permissive hypercapnia pada ventilasi invasif."
      },
      {
        "col1": "Girard TD (ABC protocol). Lancet 2008;371:126",
        "col2": "SAT + SBT",
        "col3": "Paired SAT+SBT ? waktu ventilasi, ICU LOS, dan mortalitas 1 tahun."
      },
      {
        "col1": "Yang KL, Tobin MJ. NEJM 1991;324:1445",
        "col2": "RSBI",
        "col3": "RSBI <80 ? prediksi weaning sukses. Sensitivity 97%, spesifisitas 64%."
      },
      {
        "col1": "Demoule A. Eur Respir J 2016;47:521",
        "col2": "HACOR Score",
        "col3": "HACOR =5 pada jam 1 NIV ? prediksi gagal NIV, AUC 0.88."
      }
    ]
  },
  {
    "id": "referensi-induksi-intubasi-farmakologi-rsi",
    "title": "Referensi — Induksi Intubasi & Farmakologi RSI",
    "headers": [
      "Publikasi / Panduan",
      "Topik",
      "Kesimpulan Kunci"
    ],
    "items": [
      {
        "col1": "Walls RM et al. Manual of Emergency Airway Management. 5th ed. 2022",
        "col2": "RSI — Algoritma",
        "col3": "Standar referensi 7P RSI. Panduan komprehensif airway emergensi termasuk DSI dan failed airway management."
      },
      {
        "col1": "Brown CA. NEJM 2023;389:1943",
        "col2": "RSI — Review",
        "col3": "Update komprehensif RSI 2023: teknik, pilihan obat, monitoring pasca intubasi."
      },
      {
        "col1": "Sorensen MK. Cochrane Database Syst Rev 2022;5:CD002788",
        "col2": "Sux vs Rocuronium RSI",
        "col3": "Rocuronium 1.2 mg/kg non-inferior to succinylcholine untuk intubating conditions. Kualitas evidence: moderate."
      },
      {
        "col1": "Tran DT. Can J Anaesth 2015;62:843",
        "col2": "Rocuronium RSI",
        "col3": "Meta-analisis: rocuronium 1.2 mg/kg setara suksinilkolin untuk kondisi intubasi optimal."
      },
      {
        "col1": "Perry JJ. Acad Emerg Med 2023;30:441",
        "col2": "NMB RSI emergensi",
        "col3": "Rocuronium vs suksinilkolin pada RSI emergensi — tidak ada perbedaan bermakna pada first-pass success rate."
      },
      {
        "col1": "Bhatt DL et al. MENDS-2. NEJM 2024;390:307",
        "col2": "Etomidate vs Ketamine",
        "col3": "RCT 686 pasien ICU: etomidate vs ketamine tidak berbeda bermakna dalam ventilator-free days, mortalitas, atau vasopressor. Etomidate aman pada sepsis."
      },
      {
        "col1": "Jabre P. Lancet 2009;374:293",
        "col2": "Etomidate — adrenal",
        "col3": "Etomidate vs ketamine: supresi adrenal nyata namun mortalitas tidak berbeda pada studi pre-hospital."
      },
      {
        "col1": "Zeiler FA. J Neurosurg Anesthesiol 2020;32:12",
        "col2": "Ketamine & TIK",
        "col3": "Review sistematis: ketamine tidak meningkatkan TIK pada pasien berventilasi mekanik. Mitos terbantahkan."
      },
      {
        "col1": "Cohen L. Emerg Med J 2015;32:145",
        "col2": "Ketamine emergensi",
        "col3": "Ketamine aman dan efektif untuk RSI di setting emergensi, termasuk cedera kepala."
      },
      {
        "col1": "Weingart SD. Ann Emerg Med 2015;65:349",
        "col2": "DSI",
        "col3": "Delayed Sequence Intubation: ketamine 1–1.5 mg/kg memungkinkan pre-oksigenasi optimal pada pasien agitasi."
      },
      {
        "col1": "STRIVE Hi Trial. Anaesthesia 2021;76:460",
        "col2": "Sugammadex rescue",
        "col3": "Sugammadex 16 mg/kg membalikkan rocuronium 1.2 mg/kg RSI dalam 3 menit pada skenario CICO."
      },
      {
        "col1": "Brueckmann B. Anesthesiology 2015;122:1302",
        "col2": "Sugammadex",
        "col3": "Sugammadex vs neostigmin: reversal lebih cepat dan lengkap untuk rocuronium/vecuronium."
      },
      {
        "col1": "Devlin JW (PADIS). Crit Care Med 2018;46:e825",
        "col2": "Sedasi ICU",
        "col3": "PADIS Guidelines: analgesia first, light sedation (RASS -1 to 0), hindari BZD, daily SAT+SBT."
      },
      {
        "col1": "Surviving Sepsis Campaign. Crit Care Med 2021;49:e1063",
        "col2": "Sepsis",
        "col3": "Bundle sepsis 1 jam, laktat, antibiotik early, norepinefrin MAP =65 mmHg, vasopressin adjuvan."
      }
    ]
  },
  {
    "id": "referensi-fungsi-ginjal-aki-elektrolit",
    "title": "Referensi — Fungsi Ginjal, AKI & Elektrolit",
    "headers": [
      "Publikasi / Panduan",
      "Topik",
      "Kesimpulan Kunci"
    ],
    "items": [
      {
        "col1": "Inker LA et al. NEJM 2021;385:1737",
        "col2": "CKD-EPI 2021 race-free",
        "col3": "Formula eGFR baru tanpa variabel ras — lebih adil dan akurasi setara. Direkomendasikan sebagai formula primer global."
      },
      {
        "col1": "KDIGO CKD Guideline 2024. Kidney Int Suppl 2024",
        "col2": "CKD — Panduan terbaru",
        "col3": "Konfirmasi CKD-EPI 2021 sebagai formula primer. Staging G1–G5 + albuminuria. Rekomendasi follow-up berbasis eGFR."
      },
      {
        "col1": "Cockcroft DW & Gault MH. Nephron 1976;16:31",
        "col2": "Cockcroft-Gault",
        "col3": "Formula CrCl klasik — masih digunakan untuk penyesuaian dosis obat. Input: usia, BB, SCr, jenis kelamin."
      },
      {
        "col1": "Levey AS et al. Ann Intern Med 1999;130:461",
        "col2": "MDRD-4",
        "col3": "Formula eGFR klasik. Kurang akurat pada eGFR >60. Kini digunakan sebagai perbandingan/legacy."
      },
      {
        "col1": "KDIGO AKI Guideline. Kidney Int Suppl 2012;2:1",
        "col2": "AKI — Staging KDIGO",
        "col3": "Staging AKI berdasarkan SCr (?0.3 mg/dL dalam 48 jam atau ?×1.5 baseline) dan/atau UO (<0.5 mL/kg/jam =6 jam)."
      },
      {
        "col1": "Miller TR et al. Ann Intern Med 1978;89:47",
        "col2": "FENa",
        "col3": "FENa <1% = pre-renal; >2% = renal intrinsik. Tidak valid pada pasien diuretik."
      },
      {
        "col1": "Espinal CH. Am Fam Physician 2000;62:2233",
        "col2": "FEUrea",
        "col3": "FEUrea <35% = pre-renal — lebih reliabel dari FENa pada pasien diuretik."
      },
      {
        "col1": "Bhagat CI et al. Ann Clin Biochem 2001;38:507",
        "col2": "Osmolalitas serum",
        "col3": "Formula: 2×Na + Glu/18 + Ureum/6 (mmol/L). Osmol gap >10 ? curiga toksin osmolar."
      },
      {
        "col1": "Adrogue HJ & Madias NE. NEJM 2000;342:1581",
        "col2": "Hiponatremia",
        "col3": "Mekanisme, klasifikasi, dan koreksi hiponatremia. Batas koreksi 6–8 mEq/L/24 jam untuk cegah ODS."
      },
      {
        "col1": "Sterns RH. NEJM 2015;372:55",
        "col2": "Hiponatremia — ODS",
        "col3": "Osmotic demyelination syndrome: risiko nyata bila koreksi >8–10 mEq/L/24 jam. Panduan koreksi aman 3% NaCl."
      },
      {
        "col1": "Macdonald JE & Struthers AD. Heart 2004;90:1098",
        "col2": "Hipokalemia",
        "col3": "Koreksi K: estimasi defisit, rate aman, monitor EKG. Pentingnya koreksi Mg bersamaan."
      },
      {
        "col1": "Kovesdy CP. Kidney Int 2023;103:1024",
        "col2": "Hiperkalemia",
        "col3": "Management hiperkalemia: kalsium membran, geser K intrasel (insulin/glukosa, bikarbonat), eliminasi K."
      },
      {
        "col1": "Dépret F et al. Ann Intensive Care 2019;9:32",
        "col2": "Hiperkalemia ICU",
        "col3": "Review manajemen hiperkalemia pada pasien kritis: insulin infus kontinu (0,1–0,2 U/kg/jam + D10 100–200 mL/jam) lebih efektif dari bolus intermiten. Target penurunan K 0,5–1 mEq/L/jam, BSS tiap 1–2 jam."
      },
      {
        "col1": "Batterink J et al. Cochrane Database Syst Rev 2015;10:CD010387",
        "col2": "Hiperkalemia — Intervensi",
        "col3": "Systematic review intervensi hiperkalemia: insulin+glukosa paling konsisten menurunkan K (onset 15–30 mnt, durasi 4–6 jam). Salbutamol efek aditif. Resonium efek lambat dan tidak dapat diandalkan untuk emergensi."
      },
      {
        "col1": "Payne RB et al. BMJ 1973;4:643",
        "col2": "Ca terkoreksi albumin",
        "col3": "Ca terkoreksi = Ca total + 0.8 × (4 - Albumin). Formula standar yang masih digunakan luas."
      },
      {
        "col1": "Cooper MS & Gittoes NJ. BMJ 2008;336:1298",
        "col2": "Hipokalsemia",
        "col3": "Diagnosis dan manajemen hipokalsemia: Ca glukonat IV untuk gejala akut, Ca oral untuk kronik."
      },
      {
        "col1": "Glasdam SM et al. AACN Adv Crit Care 2012;23:158",
        "col2": "Hipomagnesemia ICU",
        "col3": "Prevalensi 60–65% di ICU. Koreksi MgSO4 IV dosis berdasar berat badan dan fungsi ginjal."
      },
      {
        "col1": "de Baaij JH et al. Physiol Rev 2015;95:791",
        "col2": "Magnesium fisiologi",
        "col3": "Review komprehensif fisiologi Mg, penyebab defisiensi, koreksi, dan monitoring."
      }
    ]
  },
  {
    "id": "referensi-pneumonia-pulmonologi-igd",
    "title": "Referensi — Pneumonia & Pulmonologi IGD",
    "headers": [
      "Publikasi / Panduan",
      "Topik",
      "Kesimpulan Kunci"
    ],
    "items": [
      {
        "col1": "Lim WS et al. Thorax 2003;58:377",
        "col2": "CURB-65",
        "col3": "Skor 5 kriteria untuk stratifikasi CAP. Skor 0–1: rawat jalan; 2: rawat inap; =3: ICU/HDU."
      },
      {
        "col1": "Fine MJ et al. NEJM 1997;336:243",
        "col2": "PSI / PORT Score",
        "col3": "Pneumonia Severity Index — 20 variabel, 5 kelas risiko. Standar emas stratifikasi CAP rawat inap."
      },
      {
        "col1": "Mandell LA et al. (IDSA/ATS). Clin Infect Dis 2007;44:S27",
        "col2": "CAP — Guidelines",
        "col3": "IDSA/ATS guidelines CAP: indikasi rawat inap, pemilihan antibiotik, durasi terapi."
      },
      {
        "col1": "Kalil AC et al. (IDSA/ATS). Clin Infect Dis 2016;63:e61",
        "col2": "VAP/HAP — Guidelines",
        "col3": "Panduan diagnosis dan terapi VAP/HAP. Peran CPIS sebagai alat bantu diagnostik (bukan definitif)."
      },
      {
        "col1": "Charles PG et al. Clin Infect Dis 2008;47:375",
        "col2": "SMART-COP",
        "col3": "8-variabel skor untuk prediksi kebutuhan vasopressor/ventilasi pada CAP."
      },
      {
        "col1": "West JB. Respiratory Physiology. 9th ed. 2012",
        "col2": "A-a Gradient",
        "col3": "Fisiologi pertukaran gas, formula A-a gradient, interpretasi hipoksemia berdasar mekanisme."
      },
      {
        "col1": "Sarkar M et al. Lung India 2017;34:47",
        "col2": "A-a Gradient klinis",
        "col3": "Aplikasi klinis A-a gradient: normal vs meningkat, interpretasi per penyebab hipoksemia."
      },
      {
        "col1": "Gattinoni L. Intensive Care Med 2020;46:2204",
        "col2": "COVID-ARDS Phenotype",
        "col3": "Type L vs Type H: compliance berbeda ? pendekatan ventilasi berbeda pada COVID-ARDS."
      }
    ]
  },
  {
    "id": "referensi-asam-basa-abg-oksigenasi",
    "title": "Referensi — Asam-Basa, ABG & Oksigenasi",
    "headers": [
      "Publikasi / Panduan",
      "Topik",
      "Kesimpulan Kunci"
    ],
    "items": [
      {
        "col1": "Berend K et al. NEJM 2014;371:1517",
        "col2": "Pendekatan Asam-Basa",
        "col3": "Systematic physiological approach to assessment of acid-base disturbances: 5-step approach, kompensasi, dan kelainan campuran."
      },
      {
        "col1": "Seifter JL. NEJM 2014;371:1434",
        "col2": "Asam-Basa & Elektrolit",
        "col3": "Integration of acid-base and electrolyte disorders — keterkaitan antara gangguan asam-basa dan kelainan elektrolit, terutama Na dan K."
      },
      {
        "col1": "Schwartz WB et al. NEJM 1965;272:1388",
        "col2": "Winter's Formula",
        "col3": "Kompensasi respiratorik pada asidosis metabolik: pCO2 ekspektasi = 1,5 × HCO3? + 8 ± 2. Verifikasi kompensasi adekuat vs campuran."
      },
      {
        "col1": "Rastegar A. JASN 2007;18:102",
        "col2": "Delta-Delta Ratio",
        "col3": "Penggunaan ?AG/?HCO3 untuk diagnosis kelainan asam-basa campuran pada AG tinggi. Ratio 1–2: normal; <1: metabolik alkalosis superimposed; >2: non-AG asidosis."
      },
      {
        "col1": "Emmett M. CJASN 2020;15:1848",
        "col2": "Alkalosis Metabolik",
        "col3": "Klasifikasi, pendekatan diagnostik, dan tatalaksana alkalosis metabolik — klorid-responsif vs klorid-resisten."
      },
      {
        "col1": "Kraut JA & Madias NE. CJASN 2012;7:689",
        "col2": "NaHCO3 Asidosis",
        "col3": "Evaluasi penggunaan NaHCO3 pada metabolik asidosis. Dosis, indikasi, dan risiko. Kontroversial pada asidosis laktat; evidence lebih baik pada asidosis bukan laktat."
      },
      {
        "col1": "Duhon B et al. Ann Pharmacother 2013;47:970",
        "col2": "NaHCO3 DKA",
        "col3": "Sodium bikarbonat pada DKA dengan pH < 6,9: pertimbangkan 100 mEq dalam 400 mL air steril + KCl 20 mEq selama 2 jam. Tidak terbukti benefit jika pH = 6,9."
      },
      {
        "col1": "Narins RG & Emmett M. Medicine 1980;59:161",
        "col2": "Anion Gap",
        "col3": "Landasan teori Anion Gap dan kelainan campuran. Koreksi AG untuk albumin: AG terkoreksi = AG + 2,5 × (4,0 - albumin g/dL)."
      },
      {
        "col1": "Rose BD & Post TW. Clinical Physiology of Acid-Base. 5th ed. 2001",
        "col2": "Textbook Asam-Basa",
        "col3": "Referensi komprehensif fisiologi asam-basa, buffer, kompensasi, dan pendekatan klinis 7-langkah. Standar rujukan utama ICU."
      },
      {
        "col1": "Roca O et al. AJRCCM 2019;199:1368",
        "col2": "ROX Index",
        "col3": "SpO2/FiO2/RR sebagai prediktor keberhasilan HFNC. ROX < 3,85 pada jam 2 = risiko intubasi tinggi. Ambang batas: 2,85 (1 jam), 3,47 (2 jam), 3,85 (12 jam)."
      },
      {
        "col1": "Khemani RG et al. Am J Respir Crit Care Med 2012;185:166",
        "col2": "SpO2/FiO2 vs P/F",
        "col3": "SpO2/FiO2 sebagai surrogate non-invasif P/F ratio. Korelasi baik pada SpO2 = 97%. SpO2/FiO2 = 235 ˜ P/F = 200 (ARDS moderate)."
      },
      {
        "col1": "Uchino S et al. Crit Care Med 2004;32:675",
        "col2": "Validasi SaO2 vs SpO2",
        "col3": "SaO2 dari ABG lebih akurat dari SpO2 pada pasien ICU dengan perfusi perifer buruk, hemoglobin abnormal (CO-Hb, Met-Hb), atau saturasi ekstrem."
      }
    ]
  },
  {
    "id": "referensi-cairan-iv",
    "title": "Referensi — Cairan IV",
    "headers": [
      "Publikasi / Panduan",
      "Topik",
      "Kesimpulan Kunci"
    ],
    "items": [
      {
        "col1": "Semler MW et al. SMART trial. NEJM 2018;378:829",
        "col2": "Balanced vs NS — ICU",
        "col3": "14.000+ pasien ICU: balanced crystalloid (RL/Physiolyte) vs NS ? MAKE30 lebih rendah (14,3% vs 15,4%, OR 0,90). Basis utama pemilihan balanced crystalloid di ICU."
      },
      {
        "col1": "Self WH et al. SALT-ED trial. NEJM 2018;378:819",
        "col2": "Balanced vs NS — IGD",
        "col3": "Konfirmasi SMART di setting IGD: balanced crystalloid ? MAKE30 lebih rendah. Berlaku untuk pasien non-ICU."
      },
      {
        "col1": "Zampieri FG et al. BaSICS trial. JAMA 2021;326:818",
        "col2": "Balanced vs NS — Brazil",
        "col3": "RCT 11.052 pasien ICU Brazil: Plasmalyte-148 vs NS — tidak ada perbedaan bermakna pada 90-hari mortalitas. Mengkonfirmasi keamanan balanced crystalloid."
      },
      {
        "col1": "Young P et al. SPLIT trial. JAMA 2015;314:1701",
        "col2": "NS vs Plasmalyte — ARDS",
        "col3": "NS vs Plasmalyte-148 di ICU: tidak ada perbedaan bermakna pada AKI, RRT, mortalitas. Keduanya aman."
      },
      {
        "col1": "Myburgh JA & Mythen MG. NEJM 2013;369:1243",
        "col2": "Resusitasi Cairan — Review",
        "col3": "Review komprehensif fisiologi dan pilihan cairan resusitasi: kristaloid isotonik, hipertonik, koloid. Kerangka pemilihan cairan berbasis bukti."
      },
      {
        "col1": "Finfer S et al. SAFE Study. NEJM 2004;350:2247",
        "col2": "Albumin vs NS — Sepsis",
        "col3": "6997 pasien ICU: albumin 4% vs NS — mortalitas setara. Subgroup sepsis: albumin cenderung lebih baik (OR 0,87). Albumin aman pada sepsis."
      },
      {
        "col1": "Caironi P et al. ALBIOS trial. NEJM 2014;370:1412",
        "col2": "Albumin — Sepsis berat",
        "col3": "1818 pasien sepsis berat: albumin untuk target 30 g/L vs kristaloid — mortalitas 28-hari tidak berbeda. MAP lebih stabil dengan albumin."
      },
      {
        "col1": "Evans L et al. SSC Guidelines 2021. Intensive Care Med 2021;47:1181",
        "col2": "Sepsis — Cairan",
        "col3": "Balanced crystalloid sebagai cairan pilihan. Albumin sebagai adjunct saat butuh volume besar. AGAINST penggunaan HES, starches pada sepsis."
      },
      {
        "col1": "Perner A et al. 6S trial. NEJM 2012;367:124",
        "col2": "HES vs Ringer Asetat",
        "col3": "800 pasien sepsis berat: HES 130/0,4 vs Ringer Asetat ? mortalitas 90-hari lebih tinggi pada HES (51% vs 43%). Kasus pembentukan kontraindikasi HES pada sepsis."
      },
      {
        "col1": "Brunkhorst FM et al. VISEP trial. NEJM 2008;358:125",
        "col2": "HES — AKI Sepsis",
        "col3": "HES 200/0,5 pada sepsis berat: meningkatkan insidens AKI dan kebutuhan RRT vs RL. Bukti kuat menentang HES pada sepsis."
      },
      {
        "col1": "Annane D et al. CRISTAL trial. JAMA 2013;310:1809",
        "col2": "Koloid vs Kristaloid",
        "col3": "2857 pasien hypovolemic shock: koloid vs kristaloid — tidak ada perbedaan mortalitas 28-hari. Mortalitas 90-hari lebih rendah pada koloid (30,7% vs 34,2%)."
      },
      {
        "col1": "Sort P et al. NEJM 1999;341:403",
        "col2": "Albumin 25% — SBP",
        "col3": "126 pasien SBP: albumin IV + cefotaxime ? insidens AKI dan kematian lebih rendah vs antibiotik saja. Dosis: 1,5 g/kg hari-1 + 1 g/kg hari-3."
      },
      {
        "col1": "EASL CPG: Decompensated Cirrhosis. J Hepatol 2018",
        "col2": "Albumin — Sirosis",
        "col3": "Guideline tatalaksana sirosis dekompensata: albumin untuk SBP, HRS, LVP, dan long-term prophylaxis pada sirosis."
      },
      {
        "col1": "EASL CPG: Hepatic Encephalopathy. J Hepatol 2022",
        "col2": "BCAA — HE",
        "col3": "BCAA-enriched amino acid (Aminoleban) pada HE: koreksi Fischer ratio, kompetisi dengan aromatic AA di BBB, perbaikan ensefalopati."
      },
      {
        "col1": "Singer P et al. ESPEN guideline. Clin Nutr 2019;38:48",
        "col2": "Nutrisi Parenteral ICU",
        "col3": "Guideline nutrisi ICU: target protein 1,2–2,0 g/kgBB/hari. EN prioritas; PN dalam 24–48 jam jika EN tidak mungkin pada malnutrisi berat. Hindari overfeeding."
      },
      {
        "col1": "Spasovski G et al. Eur J Endocrinol 2014;170:G1",
        "col2": "Hiponatremia — Guideline",
        "col3": "Panduan EuroPEM/ERA-EDTA untuk hiponatremia: NaCl 3% pada gejala berat, target ?Na 5 mEq/L jam pertama, batas 10 mEq/L per 24 jam untuk hindari ODS."
      },
      {
        "col1": "Carney N et al. Neurosurgery 2017;80:6",
        "col2": "TBI — Hiperosmolar",
        "col3": "Guideline TBI edisi 4: terapi hiperosmolar (NaCl 3% atau mannitol), target ICP < 22 mmHg, osmolarity 300–320 mOsm/kg. NaCl 3% bukan inferior terhadap mannitol."
      },
      {
        "col1": "NICE CG174. IV Fluids in Adults. 2013 (updated 2023)",
        "col2": "IV Fluids — Dewasa",
        "col3": "Framework 5D (Drug, Dose, Duration, Direction, Details) untuk tatalaksana cairan IV dewasa. Resusitasi vs replacement vs maintenance."
      },
      {
        "col1": "Jaber S et al. BICAR-ICU trial. Lancet 2018;392:31–40",
        "col2": "NaHCO3 — ICU",
        "col3": "RCT 389 pasien asidosis metabolik berat (pH =7,20): sodium bikarbonat IV mengurangi kebutuhan RRT dan vasopressor pada AKI berat. Tidak ada manfaat pada pH 7,20–7,25."
      },
      {
        "col1": "Magpie Trial Collaborative Group. Lancet 2002;359:1877",
        "col2": "MgSO4 — Eklampsia",
        "col3": "10.141 wanita preeklampsia: MgSO4 vs plasebo ? risiko eklampsia ? 58% (NNT=91), tidak ada perbedaan mortalitas maternal. Standar baku lini pertama profilaksis eklampsia."
      },
      {
        "col1": "AHA/ACC. ACLS Guidelines 2020. Circulation 2020;142(16 suppl 2)",
        "col2": "Cardiac Arrest — Ca²?",
        "col3": "CaCl2 10% 5–10 mL IV pada cardiac arrest dengan hipokalsemia, hiperkalemia, atau overdosis Ca-channel blocker. Tidak direkomendasikan rutin pada cardiac arrest tanpa indikasi spesifik."
      },
      {
        "col1": "Kraft MD et al. Am J Health Syst Pharm 2005;62:1663",
        "col2": "Koreksi Elektrolit ICU",
        "col3": "Panduan komprehensif koreksi elektrolit pada ICU dewasa: K, Mg, Ca, Na, P. Dosis, kecepatan, monitoring, dan interaksi obat."
      },
      {
        "col1": "ESPGHAN/ESPEN/ESPR/CSPEN. J Pediatr Gastroenterol Nutr 2018;67(S2):S1",
        "col2": "Nutrisi Parenteral Pediatrik",
        "col3": "Guideline lengkap TPN pediatrik: dosis AA neonatus 3,5–4,5 g/kgBB/hari, GIR target 4–8 mg/kgBB/menit, kebutuhan taurin dan sistein pada neonatus, pemilihan formulasi AA pediatrik vs dewasa."
      },
      {
        "col1": "NICE NG29. IV Fluids in Children and Young People. 2015 (updated 2020)",
        "col2": "IV Fluids — Pediatrik",
        "col3": "D5 ¼ NS sebagai cairan maintenance standar neonatus dan bayi. Rekomendasi kecepatan koreksi Na, monitoring elektrolit, dan pilihan cairan per usia."
      }
    ]
  },
  {
    "id": "referensi-transfusi-darah-hemostasis",
    "title": "Referensi — Transfusi Darah & Hemostasis",
    "headers": [
      "Publikasi / Panduan",
      "Topik",
      "Kesimpulan Kunci"
    ],
    "items": [
      {
        "col1": "Hébert PC et al. TRICC Trial. NEJM 1999;340:409",
        "col2": "Transfusi Restriktif",
        "col3": "RCT 838 pasien ICU: target Hb 7–9 g/dL (restriktif) vs 10–12 g/dL (liberal) — mortalitas 30-hari setara, restriktif lebih baik pada pasien kurang sakit. Fondasi strategi transfusi restriktif ICU."
      },
      {
        "col1": "Villanueva C et al. NEJM 2013;368:11",
        "col2": "Transfusi — Perdarahan GI",
        "col3": "RCT 921 pasien perdarahan GI atas akut: threshold Hb 7 g/dL (restriktif) vs 9 g/dL — mortalitas 45-hari lebih rendah pada restriktif (5% vs 9%, p=0,02). Transfusi masif pada GI bleeding meningkatkan tekanan portal."
      },
      {
        "col1": "Carson JL et al. AABB Guideline. Ann Intern Med 2016;165:519",
        "col2": "Panduan Transfusi AABB",
        "col3": "Panduan klinis AABB: Hb ≤7 g/dL pada pasien stabil (≤8 pada kardiologi/post-op). Tidak ada manfaat terbukti pada Hb >8 g/dL untuk sebagian besar pasien ICU. Basis praktik transfusi evidence-based."
      },
      {
        "col1": "Rossaint R et al. ESAIC/ESICM. Eur J Anaesthesiol 2023;40:343",
        "col2": "Perdarahan Masif — MTP",
        "col3": "Panduan Eropa tatalaksana perdarahan masif terbaru: rasio FFP:PRC 1:1–1:2, fibrinogen ≥1,5 g/L, TXA dalam 3 jam, suplementasi Ca²⁺ selama transfusi masif (target iCa ≥1,1 mmol/L). Standar terkini Massive Transfusion Protocol."
      },
      {
        "col1": "Inaba K et al. J Trauma Acute Care Surg 2013;75:416",
        "col2": "Toksisitas Sitrat & Ca",
        "col3": "Sitrat dalam produk darah mengikat Ca²⁺ ionisasi → hipokalsemia, disfungsi miokard, koagulopati. Ca-Glukonat IV 1 g per 4 unit PRC atau FFP; CaCl₂ tersedia 3× lebih banyak Ca elemental. iCa target ≥1,1 mmol/L."
      },
      {
        "col1": "Spahn DR et al. (ESMR). Crit Care 2019;23:98",
        "col2": "Trauma Perdarahan",
        "col3": "Panduan Eropa manajemen perdarahan masif pada trauma: goal-directed hemostatic resuscitation, viscoelastic testing (TEG/ROTEM), fibrinogen sebagai target pertama, permissive hypotension pre-operatif (MAP 50 mmHg)."
      },
      {
        "col1": "Sihler KC & Napolitano LM. Chest 2010;137:209",
        "col2": "Transfusi Masif — Komplikasi",
        "col3": "Review komplikasi MTP: TACO, TRALI, hipotermia, hipokalsemia, asidosis dilutional, koagulopati dilutional. Framework pencegahan dan pemantauan selama MTP."
      },
      {
        "col1": "Holcomb JB et al. PROPPR Trial. JAMA 2015;313:471",
        "col2": "Rasio FFP:PRC MTP",
        "col3": "RCT 680 pasien trauma masif: rasio 1:1:1 (FFP:Plt:PRC) vs 1:1:2 — hemostasis lebih tinggi (86% vs 78%, p=0,006) dan mortalitas 24 jam lebih rendah. Mendukung rasio 1:1:1 pada MTP."
      }
    ]
  },
  {
    "id": "referensi-lokal-indonesia",
    "title": "Referensi Lokal Indonesia",
    "headers": [
      "Publikasi / Panduan",
      "Institusi",
      "Relevansi"
    ],
    "items": [
      {
        "col1": "Panduan Ventilasi Mekanik ICU",
        "col2": "PERDICI",
        "col3": "Panduan nasional VT, mode, target ABG, weaning untuk ICU Indonesia"
      },
      {
        "col1": "PPK Gagal Napas Akut",
        "col2": "PAPDI — Div. Pulmonologi",
        "col3": "Pathway intubasi, NIV indikasi, monitoring, antibiotic bundle pneumonia"
      },
      {
        "col1": "Konsensus ARDS Indonesia",
        "col2": "PERDICI / PAPDI 2020",
        "col3": "Adaptasi ARDSNet untuk konteks RS Indonesia; resource allocation ICU"
      },
      {
        "col1": "Panduan VAP",
        "col2": "PERDICI 2021",
        "col3": "VAP bundle lokal: oral care CHX, HOB 30°, cuff pressure, SBT harian"
      },
      {
        "col1": "PPK Sepsis & Syok Septik",
        "col2": "PAPDI / PERDICI 2022",
        "col3": "Adaptasi SSC 2021 untuk Indonesia; ketersediaan antibiotik lokal, monitoring laktat"
      },
      {
        "col1": "Panduan Sedasi & Analgesia ICU",
        "col2": "PERDICI / Farmasi Klinik Indonesia",
        "col3": "Protokol propofol, midazolam, dexmedetomidine; monitoring RASS di RS Indonesia"
      },
      {
        "col1": "Panduan Intubasi Emergensi",
        "col2": "PERDICI / IDSAI 2022",
        "col3": "Protokol RSI lokal, pilihan NMB, airway difficult algorithm sesuai ketersediaan obat Indonesia"
      },
      {
        "col1": "Panduan Tatalaksana AKI",
        "col2": "PB PERNEFRI 2023",
        "col3": "Staging AKI KDIGO adaptasi lokal, indikasi dialisis, monitoring fungsi ginjal ICU"
      }
    ]
  },
  {
    "id": "sumber-dosis-obat",
    "title": "Sumber Dosis Obat",
    "headers": [
      "Obat / Kategori",
      "Sumber Dosis",
      ""
    ],
    "items": [
      {
        "col1": "Fentanyl, Morfin, Alfentanil",
        "col2": "Lexicomp Drug Reference 2024 · PERDICI Panduan Sedoanalgesia 2021 · BNF 2024",
        "col3": ""
      },
      {
        "col1": "Remifentanil",
        "col2": "Mingo OH. Anaesthesia 2004 · Ultiva SmPC · BNF 2024",
        "col3": ""
      },
      {
        "col1": "Propofol",
        "col2": "BNF 2024 · Diprivan SmPC · SCCM PADIS 2018 · Reves JG. Anesthesiology 2005",
        "col3": ""
      },
      {
        "col1": "Ketamine",
        "col2": "Cohen L. Emerg Med J 2015 · Lexicomp 2024 · Miller RD. Miller's Anesthesia 9th ed. 2020",
        "col3": ""
      },
      {
        "col1": "Etomidate",
        "col2": "MENDS-2. NEJM 2024;390:307 · Jabre P. Lancet 2009 · Lexicomp 2024",
        "col3": ""
      },
      {
        "col1": "Midazolam (induksi & ICU)",
        "col2": "Reves JG. Anesthesiology 2005 · PADIS 2018 · BNF 2024",
        "col3": ""
      },
      {
        "col1": "Dexmedetomidine",
        "col2": "Precedex SmPC · Riker RR. JAMA 2009 (MENDS) · PADIS 2018",
        "col3": ""
      },
      {
        "col1": "Suksinilkolin",
        "col2": "Sorensen MK. Cochrane 2022 · Walls RM. Manual of Emergency Airway Mgmt 2022",
        "col3": ""
      },
      {
        "col1": "Rocuronium",
        "col2": "Sorensen MK. Cochrane 2022 · Tran DT. Can J Anaesth 2015 · STRIVE Hi. Anaesthesia 2021",
        "col3": ""
      },
      {
        "col1": "Vecuronium, Atrakurium, Cisatrakurium",
        "col2": "Papazian NEJM 2010 · Miller RD. Miller's Anesthesia 2020 · Lexicomp 2024",
        "col3": ""
      },
      {
        "col1": "Sugammadex",
        "col2": "Brueckmann B. Anesthesiology 2015 · STRIVE Hi. Anaesthesia 2021 · Bridion SmPC",
        "col3": ""
      },
      {
        "col1": "Lidokain (airway)",
        "col2": "Habre W. Eur J Anaesthesiol 2004 · Walls RM. Manual of Emergency Airway Mgmt 2022",
        "col3": ""
      },
      {
        "col1": "Norepinefrin, Dopamin, Dobutamin",
        "col2": "De Backer D. NEJM 2010 · Annane D. JAMA 2007 · SSC 2021",
        "col3": ""
      },
      {
        "col1": "Nitrogliserin, Amiodarone",
        "col2": "ESC ACS Guidelines 2023 · ACC/AHA Guidelines 2023 · BNF 2024",
        "col3": ""
      },
      {
        "col1": "Koreksi Na, K, Ca, Mg",
        "col2": "Adrogue HJ. NEJM 2000 · Sterns RH. NEJM 2015 · Macdonald JE. Heart 2004 · de Baaij JH. Physiol Rev 2015 · Cooper MS. BMJ 2008",
        "col3": ""
      },
      {
        "col1": "MgSO4 (asma, eklampsia, TdP)",
        "col2": "GINA 2024 · Rowe BH. Cochrane 2000 · Magpie Trial. Lancet 2002 · UpToDate: Hypomagnesemia 2023",
        "col3": ""
      },
      {
        "col1": "KCl 7,46% — Koreksi Hipokalemia",
        "col2": "Kraft MD. Am J Health Syst Pharm 2005 · UpToDate: Hypokalemia Treatment 2023 · Macdonald JE. Heart 2004",
        "col3": ""
      },
      {
        "col1": "NaHCO3 8,4% — Koreksi Asidosis",
        "col2": "Jaber S. BICAR-ICU. Lancet 2018 · Kraut JA. CJASN 2012 · UpToDate: Bicarbonate Therapy 2023",
        "col3": ""
      },
      {
        "col1": "Ca-Glukonas 10% / CaCl2 10%",
        "col2": "AHA ACLS 2020 · Cooper MS. BMJ 2008 · Kovesdy CP. Kidney Int 2023 · Rossaint R. Eur J Anaesthesiol 2023 · Inaba K. J Trauma Acute Care Surg 2013 · UpToDate: Hypocalcemia 2023",
        "col3": ""
      },
      {
        "col1": "Insulin Regular (hiperkalemia)",
        "col2": "Dépret F. Ann Intensive Care 2019 · Batterink J. Cochrane 2015 · Kovesdy CP. Kidney Int 2023 · UpToDate: Treatment of Hyperkalemia 2023",
        "col3": ""
      },
      {
        "col1": "Dextrose 40% (D40%)",
        "col2": "UpToDate: Management of Hypoglycemia 2023 · UpToDate: Treatment of Hyperkalemia 2023",
        "col3": ""
      },
      {
        "col1": "Aminosteril KE / Aminosteril Infant",
        "col2": "ESPEN ICU Guidelines. Clin Nutr 2019 · ESPGHAN/ESPEN/ESPR Guidelines 2018 · Fresenius Kabi SmPC · BPOM Indonesia 2022",
        "col3": ""
      }
    ]
  }
];
