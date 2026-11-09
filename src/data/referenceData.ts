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
        "col1": "Grasselli G et al. ESICM ARDS Guidelines. Intensive Care Med 2023;49:727",
        "col2": "ARDS — Guidelines",
        "col3": "Pedoman ESICM: definisi ARDS diperluas (termasuk pasien non-intubasi dengan HFNO); VT rendah 4–8 mL/kg PBW; prone ≥16 jam untuk ARDS sedang–berat; tidak menganjurkan manuver rekrutmen tekanan tinggi berkepanjangan. Fenotipe hipo/hiperinflamasi belum siap untuk keputusan klinis."
      },
      {
        "col1": "Lewis K et al. SCCM PADIS Focused Update. Crit Care Med 2025;53:e711",
        "col2": "Sedasi ICU — PADIS",
        "col3": "Rekomendasi kondisional: deksmedetomidin dibanding propofol untuk sedasi pasien ventilasi mekanik; mobilisasi/rehabilitasi yang ditingkatkan; melatonin untuk tidur. Tidak ada rekomendasi untuk benzodiazepin pada ansietas maupun antipsikotik untuk delirium."
      },
      {
        "col1": "Prekker ME et al. DEVICE. N Engl J Med 2023;389:418",
        "col2": "Intubasi — Laringoskopi",
        "col3": "1.417 pasien kritis: video laringoskop vs laringoskop direk — keberhasilan percobaan pertama 85,1% vs 70,8%; komplikasi berat tidak berbeda bermakna. Mendukung VL sebagai pilihan pertama."
      },
      {
        "col1": "Torres A et al. ERS/ESICM/ESCMID/ALAT HAP/VAP Guidelines. Eur Respir J 2017;50:1700582",
        "col2": "HAP/VAP — Guidelines",
        "col3": "Panduan Eropa HAP/VAP: antibiotik empiris berdasarkan risiko MDR & ekologi lokal; durasi 7–8 hari untuk sebagian besar pasien tanpa imunodefisiensi berat atau patogen sulit; de-eskalasi berdasarkan kultur."
      },
      {
        "col1": "Cornely OA et al. Global Guideline Candidiasis (ECMM/ISHAM/ASM). Lancet Infect Dis 2025;25:e280",
        "col2": "Kandidiasis Invasif",
        "col3": "Ekinokandin lini pertama kandidemia/kandidiasis invasif pada pasien kritis; β-D-glukan (mis. ≥80 pg/mL pada uji Fungitell) membantu diagnosis; step-down ke flukonazol bila pasien stabil, isolat sensitif, dan klinis membaik."
      },
      {
        "col1": "Gaudry S et al. AKIKI-2. Lancet 2021;397:1293",
        "col2": "RRT — Timing",
        "col3": "AKI stage 3 dengan oliguria >72 jam atau BUN >112 mg/dL: menunda RRT lebih lama lagi (sampai BUN 140 mg/dL atau indikasi mendesak) tidak menambah hari bebas RRT dan berhubungan dengan mortalitas 60 hari lebih tinggi."
      },
      {
        "col1": "STARRT-AKI Investigators. NEJM 2020;383:240",
        "col2": "RRT — Timing",
        "col3": "3.019 pasien AKI berat: accelerated vs standar — mortalitas 90 hari 43,9% vs 43,7%; 38,2% kelompok standar tidak pernah mendapat RRT; ketergantungan RRT hari ke-90 lebih tinggi pada accelerated (10,4% vs 6,0%)."
      },
      {
        "col1": "Hernández G et al. ANDROMEDA-SHOCK-2. JAMA 2025;334:1988",
        "col2": "Sepsis — Resusitasi",
        "col3": "1.467 pasien syok septik dini: resusitasi personal berbasis CRT vs perawatan biasa — unggul pada luaran komposit hierarkis (win ratio 1,16), terutama karena durasi bantuan hidup lebih singkat; mortalitas tidak berbeda bermakna."
      },
      {
        "col1": "Meyhoff TS et al. CLASSIC. NEJM 2022;386:2459",
        "col2": "Sepsis — Cairan Restriktif",
        "col3": "1.554 pasien syok septik: cairan restriktif vs standar setelah resusitasi awal — mortalitas 90 hari 42,3% vs 42,1%; efek samping serius tidak berbeda."
      },
      {
        "col1": "Lamontagne F et al. LOVIT. NEJM 2022;386:2387",
        "col2": "Vitamin C — Sepsis",
        "col3": "872 pasien sepsis dengan vasopresor: vitamin C IV 50 mg/kg tiap 6 jam selama 96 jam → kematian atau disfungsi organ persisten hari ke-28 lebih tinggi (44,5% vs 38,5%; RR 1,21). Tidak direkomendasikan."
      },
      {
        "col1": "Fujii T et al. VITAMINS. JAMA 2020;323:423",
        "col2": "Vit C+Hc+Thiamin",
        "col3": "Triple therapy (vitamin C + hidrokortison + tiamin) vs hidrokortison saja: tidak ada perbedaan vasopressor-free days. Kombinasi triple tidak direkomendasikan."
      },
      {
        "col1": "Singer P et al. ESPEN 2023. Clin Nutr 2023;42:1671",
        "col2": "Nutrisi ICU",
        "col3": "ESPEN 2023: energi hipokalorik (≤70%) pada fase akut awal lalu 80–100% setelah hari ke-3; protein 1,3 g/kg/hari dicapai bertahap; EN dini dalam 24–48 jam; hindari overfeeding."
      },
      {
        "col1": "Compher C et al. ASPEN 2022. JPEN 2022;46:12",
        "col2": "Nutrisi ICU",
        "col3": "Energi 12–25 kkal/kg/hari pada 7–10 hari pertama; protein 1,2–2,0 g/kg/hari; EN atau PN sama-sama dapat diterima pada fase awal."
      },
      {
        "col1": "Pun BT et al. ABCDEF Bundle. Crit Care Med 2019;47:3",
        "col2": "ABCDEF Bundle",
        "col3": "15.226 pasien ICU: kepatuhan bundle ABCDEF yang lebih tinggi berhubungan dengan mortalitas lebih rendah serta lebih sedikit koma, delirium, restrain fisik, dan readmisi ICU — hubungan dose-response."
      },
      {
        "col1": "Flaatten H et al. Ann Intensive Care 2021;11:22",
        "col2": "Frailty — CFS ICU",
        "col3": "1.923 pasang penilai pada pasien ICU usia ≥80 tahun (VIP-2): reliabilitas antar-penilai CFS sangat tinggi (weighted kappa 0,86)."
      },
      {
        "col1": "GOLD 2024 Report (goldcopd.org)",
        "col2": "PPOK — Panduan",
        "col3": "Klasifikasi ABE menggantikan ABCD. NIV untuk eksaserbasi dengan asidosis respiratorik (pH ≤7,35 dan PaCO₂ ≥45 mmHg). Ventilasi invasif: hindari hiperinflasi dinamis, terima hiperkapnia permisif."
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
        "col3": "VT 6 vs 12 mL/kg PBW → mortalitas ↓ dari 39,8% menjadi 31,0%. Landasan ventilasi protektif paru."
      },
      {
        "col1": "Guérin C (PROSEVA). NEJM 2013;368:2159",
        "col2": "Prone position",
        "col3": "Prone ≥16 jam/hari pada P/F <150 (FiO₂ ≥0,6, PEEP ≥5) → mortalitas 28 hari ↓ dari 32,8% menjadi 16,0%. NNT ≈ 6."
      },
      {
        "col1": "Amato MB. NEJM 2015;372:747",
        "col2": "Driving pressure",
        "col3": "Driving pressure (Pplat − PEEP) adalah variabel ventilasi yang paling kuat berhubungan dengan mortalitas; tiap kenaikan 1 SD (±7 cmH₂O) → RR kematian 1,41. Data asosiasi, bukan uji strategi yang dipandu DP."
      },
      {
        "col1": "Berlin Definition. JAMA 2012;307:2526",
        "col2": "Definisi ARDS",
        "col3": "Klasifikasi ringan/sedang/berat berdasarkan P/F (>200–≤300 / >100–≤200 / ≤100) dengan PEEP/CPAP ≥5. Menggantikan definisi AECC 1994."
      },
      {
        "col1": "Matthay MA et al. Global ARDS Definition. Am J Respir Crit Care Med 2024;209:37",
        "col2": "Global ARDS Definisi",
        "col3": "Definisi global ARDS: pasien dengan HFNO ≥30 L/menit (atau NIV/CPAP) dapat didiagnosis; S/F ≤315 (bila SpO₂ ≤97%) dapat menggantikan P/F ≤300; USG paru diterima untuk pencitraan."
      },
      {
        "col1": "Papazian (ACURASYS). NEJM 2010;363:1107",
        "col2": "NMB ARDS",
        "col3": "Cisatrakurium 48 jam pada ARDS dini dengan P/F <150 → mortalitas 90 hari (disesuaikan) lebih rendah & barotrauma lebih sedikit. ROSE 2019 (P/F <150): tidak terkonfirmasi dibanding sedasi ringan tanpa NMB."
      },
      {
        "col1": "Frat JP (FLORALI). NEJM 2015;372:2185",
        "col2": "HFNC vs NIV",
        "col3": "Gagal napas hipoksemik non-hiperkapnik: intubasi hari ke-28 tidak berbeda bermakna (38% vs 47% vs 50%; P=0,18); mortalitas 90 hari lebih rendah dengan HFNC (HR 2,01 O₂ standar vs HFNC; 2,50 NIV vs HFNC)."
      },
      {
        "col1": "Ferreyro BL. JAMA 2020;324:57",
        "col2": "NIV meta-analisis",
        "col3": "Meta-analisis jaringan: dibanding O₂ standar, NIV helmet (RR 0,40; kepastian rendah) dan NIV masker (RR 0,83; kepastian sedang) berhubungan dengan mortalitas lebih rendah; HFNC menurunkan risiko intubasi (RR 0,76)."
      },
      {
        "col1": "Roca O. AJRCCM 2019;199:1368",
        "col2": "ROX Index",
        "col3": "ROX ≥4,88 pada jam 2/6/12 → risiko intubasi rendah; <2,85 (jam 2), <3,47 (jam 6), <3,85 (jam 12) → risiko tinggi. Validasi prospektif multisenter."
      },
      {
        "col1": "Talmor D. NEJM 2008;359:2095",
        "col2": "Esophageal PEEP",
        "col3": "PEEP dipandu tekanan esofagus (transpulmoner) → oksigenasi & compliance lebih baik dibanding tabel ARDSNet (EPVent). EPVent-2 (Beitler, JAMA 2019) tidak memperbaiki luaran mortalitas/hari bebas ventilator."
      },
      {
        "col1": "Meade MO (LOV). JAMA 2008;299:637",
        "col2": "High PEEP ARDS",
        "col3": "PEEP tinggi vs ARDSNet: mortalitas tidak berbeda bermakna, tetapi hipoksemia refrakter & kebutuhan terapi penyelamatan lebih sedikit."
      },
      {
        "col1": "Hernandez G. JAMA 2016;316:1565",
        "col2": "HFNC post-ekstubasi",
        "col3": "Pasien risiko tinggi gagal ekstubasi: HFNC pasca-ekstubasi tidak inferior dibanding NIV untuk reintubasi (22,8% vs 19,1%); gagal napas pasca-ekstubasi lebih jarang (26,9% vs 39,8%)."
      },
      {
        "col1": "Lawn ND et al. Arch Neurol 2001;58:893",
        "col2": "GBS — Rule 20-30-40",
        "col3": "GBS: kapasitas vital <20 mL/kg, MIP lebih lemah dari −30 cmH₂O, atau MEP <40 cmH₂O (aturan 20/30/40) → risiko gagal napas; pertimbangkan intubasi elektif."
      },
      {
        "col1": "Rochwerg B. Eur Respir J 2017;50:1602426",
        "col2": "NIV ERS/ATS",
        "col3": "NIV: rekomendasi kuat untuk PPOK eksaserbasi dengan asidosis respiratorik dan edema paru kardiogenik; kondisional untuk pasien imunokompromais dan pasca-operasi."
      },
      {
        "col1": "GOLD 2024 Report (goldcopd.org)",
        "col2": "PPOK",
        "col3": "NIV pada eksaserbasi dengan asidosis respiratorik (pH ≤7,35, PaCO₂ ≥45 mmHg). Hiperkapnia permisif pada ventilasi invasif."
      },
      {
        "col1": "Girard TD (ABC protocol). Lancet 2008;371:126",
        "col2": "SAT + SBT",
        "col3": "SAT + SBT berpasangan → +3,1 hari bebas ventilator, lama rawat ICU & RS lebih singkat, mortalitas 1 tahun lebih rendah."
      },
      {
        "col1": "Yang KL, Tobin MJ. NEJM 1991;324:1445",
        "col2": "RSBI",
        "col3": "RSBI ≤105 → prediktor keberhasilan weaning (sensitivitas 97%, spesifisitas 64%) — bukan kriteria tunggal."
      },
      {
        "col1": "Duan J et al. Intensive Care Med 2017;43:192",
        "col2": "HACOR Score",
        "col3": "HACOR >5 pada jam ke-1 NIV → prediksi gagal NIV (AUC 0,88; sensitivitas 72,6%, spesifisitas 90,2%)."
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
        "col1": "Brown CA III, Sakles JC, Mick NW. The Walls Manual of Emergency Airway Management. 6th ed.",
        "col2": "RSI — Algoritma",
        "col3": "Standar referensi 7P RSI. Panduan komprehensif airway emergensi termasuk DSI dan failed airway management."
      },
      {
        "col1": "Tran DT et al. Cochrane Database Syst Rev 2015;(10):CD002788",
        "col2": "Sux vs Rocuronium RSI",
        "col3": "50 uji (4.151 pasien): suksinilkolin lebih unggul untuk kondisi intubasi 'excellent' (RR 0,86) dan yang dapat diterima (RR 0,97). Dibanding rocuronium 1,2 mg/kg tidak berbeda bermakna, tetapi suksinilkolin lebih pendek kerjanya. Kualitas bukti moderat."
      },
      {
        "col1": "Guihard B et al. CURASMUR. JAMA 2019;322:2303",
        "col2": "Rocuronium vs suksinilkolin — RSI pra-RS",
        "col3": "1.248 pasien RSI pra-RS: rocuronium 1,2 mg/kg gagal membuktikan non-inferioritas vs suksinilkolin 1 mg/kg untuk keberhasilan percobaan pertama (74,6% vs 79,4%)."
      },
      {
        "col1": "Jabre P. Lancet 2009;374:293",
        "col2": "Etomidate — adrenal",
        "col3": "KETASED (pra-RS/IGD, 655 pasien): kondisi intubasi setara; insufisiensi adrenal lebih sering dengan etomidat; skor SOFA maksimal dan mortalitas tidak berbeda."
      },
      {
        "col1": "Zeiler FA et al. Neurocrit Care 2014;21:163",
        "col2": "Ketamine & TIK",
        "col3": "Tinjauan sistematis: ketamin tidak meningkatkan TIK pada pasien cedera otak traumatik yang tersedasi & berventilasi."
      },
      {
        "col1": "Cohen L et al. Ann Emerg Med 2015;65:43",
        "col2": "Ketamine emergensi",
        "col3": "Tinjauan sistematis: ketamin tidak memperburuk TIK, CPP, maupun luaran neurologis — mendukung keamanannya untuk induksi pada cedera kepala."
      },
      {
        "col1": "Weingart SD. Ann Emerg Med 2015;65:349",
        "col2": "DSI",
        "col3": "Delayed Sequence Intubation: ketamine 1–1.5 mg/kg memungkinkan pre-oksigenasi optimal pada pasien agitasi."
      },
      {
        "col1": "Lee C et al. Anesthesiology 2009;110:1020",
        "col2": "Sugammadex rescue",
        "col3": "Sugammadex 16 mg/kg 3 menit setelah rocuronium 1,2 mg/kg: rasio TOF 0,9 tercapai rata-rata 2,2 menit setelah sugammadex; pemulihan lebih cepat dibanding pemulihan spontan suksinilkolin 1 mg/kg. Reversal tidak menjamin jalan napas aman pada CICO."
      },
      {
        "col1": "Brueckmann B et al. Br J Anaesth 2015;115:743",
        "col2": "Sugammadex",
        "col3": "Sugammadex vs neostigmin pada bedah abdomen: blok neuromuskular residual di PACU 0% vs 43,4%; siap keluar kamar operasi lebih cepat (14,7 vs 18,6 menit)."
      },
      {
        "col1": "Devlin JW (PADIS). Crit Care Med 2018;46:e825",
        "col2": "Sedasi ICU",
        "col3": "PADIS 2018: analgesia dulu, sedasi ringan (RASS −2 s/d +1), hindari benzodiazepin, SAT + SBT harian, mobilisasi dini."
      },
      {
        "col1": "Evans L et al. Surviving Sepsis Campaign 2021. Crit Care Med 2021;49:e1063",
        "col2": "Sepsis",
        "col3": "Antibiotik ≤1 jam pada kemungkinan syok septik/sepsis probable (≤3 jam bila sepsis possible), kristaloid seimbang, norepinefrin lini pertama dengan target awal MAP ≥65 mmHg, vasopresin sebagai tambahan."
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
        "col3": "Persamaan eGFR CKD-EPI 2021 tanpa variabel ras; akurasi setara. Direkomendasikan NKF-ASN sebagai persamaan utama."
      },
      {
        "col1": "KDIGO 2024 CKD Guideline. Kidney Int 2024;105(4S):S117",
        "col2": "CKD — Panduan terbaru",
        "col3": "Staging CKD G1–G5 + albuminuria A1–A3; gunakan persamaan eGFR tervalidasi (mis. CKD-EPI 2021), konfirmasi dengan sistatin C bila perlu."
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
        "col3": "Staging AKI berdasarkan SCr (↑ ≥0,3 mg/dL dalam 48 jam atau ≥1,5× baseline dalam 7 hari) dan/atau UO (<0,5 mL/kg/jam ≥6 jam)."
      },
      {
        "col1": "Miller TR et al. Ann Intern Med 1978;89:47",
        "col2": "FENa",
        "col3": "FENa <1% = pre-renal; >2% = renal intrinsik. Tidak valid pada pasien diuretik."
      },
      {
        "col1": "Carvounis CP et al. Kidney Int 2002;62:2223",
        "col2": "FEUrea",
        "col3": "FEUrea ≤35% mendukung azotemia pre-renal — lebih andal daripada FENa pada pasien yang mendapat diuretik."
      },
      {
        "col1": "Bhagat CI et al. Clin Chem 1984;30:1703",
        "col2": "Osmolalitas serum",
        "col3": "Osmolalitas terhitung ≈ 2×Na + glukosa/18 + ureum/6 (glukosa & ureum dalam mg/dL; atau BUN/2,8). Osmolar gap >10 mOsm/kg → curiga toksin osmolar (metanol, etilen glikol)."
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
        "col1": "Dépret F et al. Ann Intensive Care 2019;9:32",
        "col2": "Hiperkalemia ICU",
        "col3": "Tinjauan hiperkalemia pada pasien akut: tiap terapi punya efek samping — insulin-glukosa (sering disglikemia), β2-agonis (iskemia/aritmia), bikarbonat hipertonik pada pasien asidosis (beban natrium), RRT (efektif tetapi invasif). Sesuaikan terapi dengan kondisi pasien."
      },
      {
        "col1": "Batterink J et al. Cochrane Database Syst Rev 2015;(10):CD010344",
        "col2": "Hiperkalemia — Intervensi",
        "col3": "Bukti terbatas; tidak ada studi yang menunjukkan perbaikan luaran klinis. Salbutamol (rute apa pun) dan insulin-dekstrosa IV paling efektif menurunkan K⁺; bikarbonat & aminofilin bukti terbatas; kalsium IV dan resin pengikat K belum diuji dalam RCT."
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
        "col1": "Hansen BA, Bruserud Ø. J Intensive Care 2018;6:21",
        "col2": "Hipomagnesemia ICU",
        "col3": "Hipomagnesemia sering pada pasien kritis dan berhubungan dengan luaran buruk; koreksi MgSO₄ IV dengan memperhatikan fungsi ginjal."
      },
      {
        "col1": "de Baaij JHF et al. Physiol Rev 2015;95:1",
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
        "col3": "Skor 5 kriteria untuk stratifikasi CAP. Skor 0–1: rawat jalan; 2: rawat inap; ≥3: berat (pertimbangkan ICU pada skor 4–5)."
      },
      {
        "col1": "Fine MJ et al. NEJM 1997;336:243",
        "col2": "PSI / PORT Score",
        "col3": "Pneumonia Severity Index — 20 variabel, 5 kelas risiko. Banyak dipakai untuk stratifikasi CAP."
      },
      {
        "col1": "Metlay JP et al. (ATS/IDSA). Am J Respir Crit Care Med 2019;200:e45",
        "col2": "CAP — Guidelines",
        "col3": "Pedoman CAP ATS/IDSA 2019 (menggantikan 2007): CAP berat → β-laktam + makrolida atau β-laktam + fluorokuinolon respirasi; cakupan MRSA/Pseudomonas hanya bila ada faktor risiko."
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
        "col1": "Gattinoni L et al. Intensive Care Med 2020;46:1099",
        "col2": "COVID-ARDS Phenotype",
        "col3": "Hipotesis fenotipe COVID-ARDS tipe L vs tipe H (compliance berbeda) → pendekatan ventilasi berbeda. Hipotesis ini belum divalidasi dan diperdebatkan."
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
        "col1": "Berend K et al. NEJM 2014;371:1434",
        "col2": "Pendekatan Asam-Basa",
        "col3": "Systematic physiological approach to assessment of acid-base disturbances: 5-step approach, kompensasi, dan kelainan campuran."
      },
      {
        "col1": "Seifter JL. NEJM 2014;371:1821",
        "col2": "Asam-Basa & Elektrolit",
        "col3": "Integration of acid-base and electrolyte disorders — keterkaitan antara gangguan asam-basa dan kelainan elektrolit, terutama Na dan K."
      },
      {
        "col1": "Albert MS, Dell RB, Winters RW. Ann Intern Med 1967;66:312",
        "col2": "Winter's Formula",
        "col3": "Kompensasi respiratorik pada asidosis metabolik: PaCO₂ ekspektasi = 1,5 × HCO₃⁻ + 8 ± 2. Bedakan kompensasi adekuat dari gangguan campuran."
      },
      {
        "col1": "Rastegar A. J Am Soc Nephrol 2007;18:2429",
        "col2": "Delta-Delta Ratio",
        "col3": "ΔAG/ΔHCO₃⁻ untuk mendeteksi gangguan campuran pada asidosis AG tinggi: 1–2 = asidosis AG tinggi murni; <1 = disertai asidosis AG normal (hiperkloremik); >2 = disertai alkalosis metabolik."
      },
      {
        "col1": "Emmett M. CJASN 2020;15:1848",
        "col2": "Alkalosis Metabolik",
        "col3": "Klasifikasi, pendekatan diagnostik, dan tatalaksana alkalosis metabolik — klorid-responsif vs klorid-resisten."
      },
      {
        "col1": "Kraut JA & Madias NE. Nat Rev Nephrol 2012;8:589",
        "col2": "NaHCO3 Asidosis",
        "col3": "Evaluasi penggunaan NaHCO3 pada metabolik asidosis. Dosis, indikasi, dan risiko. Kontroversial pada asidosis laktat; evidence lebih baik pada asidosis bukan laktat."
      },
      {
        "col1": "Duhon B et al. Ann Pharmacother 2013;47:970",
        "col2": "NaHCO3 DKA",
        "col3": "Kajian retrospektif KAD berat: bikarbonat IV tidak mempercepat perbaikan asidosis. ADA/EASD 2024: pertimbangkan bikarbonat hanya bila pH <7,0."
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
        "col3": "ROX = (SpO₂/FiO₂)/RR sebagai prediktor keberhasilan HFNC. Risiko tinggi gagal bila <2,85 (jam 2), <3,47 (jam 6), <3,85 (jam 12); ≥4,88 = risiko rendah."
      },
      {
        "col1": "Rice TW et al. Chest 2007;132:410",
        "col2": "SpO2/FiO2 vs P/F",
        "col3": "S/F sebagai pengganti P/F non-invasif bila SpO₂ ≤97%: S/F 235 ≈ P/F 200 dan S/F 315 ≈ P/F 300."
      },
      {
        "col1": "Jubran A. Crit Care 2015;19:272",
        "col2": "Validasi SaO2 vs SpO2",
        "col3": "Oksimetri nadi kurang akurat pada perfusi perifer buruk, dishemoglobinemia (CO-Hb, Met-Hb), saturasi rendah, dan kulit berpigmen gelap (Sjoding, NEJM 2020) — konfirmasi dengan SaO₂ dari AGD bila ragu."
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
        "col3": "15.802 pasien ICU: kristaloid seimbang vs NaCl 0,9% → MAKE30 lebih rendah (14,3% vs 15,4%; OR 0,90). Dasar utama pemilihan kristaloid seimbang di ICU."
      },
      {
        "col1": "Self WH et al. SALT-ED trial. NEJM 2018;378:819",
        "col2": "Balanced vs NS — IGD",
        "col3": "13.347 pasien IGD non-kritis: hari bebas RS tidak berbeda; MAKE30 lebih rendah dengan kristaloid seimbang (4,7% vs 5,6%)."
      },
      {
        "col1": "Zampieri FG et al. BaSICS trial. JAMA 2021;326:818",
        "col2": "Balanced vs NS — Brazil",
        "col3": "10.520 pasien ICU: larutan seimbang (Plasma-Lyte) vs NaCl 0,9% — mortalitas 90 hari 26,4% vs 27,2% (HR 0,97), tidak berbeda bermakna."
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
        "col3": "6.997 pasien ICU: albumin 4% vs salin — mortalitas 28 hari setara; subgrup sepsis berat cenderung lebih baik (RR 0,87; tidak bermakna); subgrup cedera otak traumatik mortalitas lebih tinggi dengan albumin."
      },
      {
        "col1": "Caironi P et al. ALBIOS trial. NEJM 2014;370:1412",
        "col2": "Albumin — Sepsis berat",
        "col3": "1818 pasien sepsis berat: albumin untuk target 30 g/L vs kristaloid — mortalitas 28-hari tidak berbeda. MAP lebih stabil dengan albumin."
      },
      {
        "col1": "Evans L et al. SSC Guidelines 2021. Intensive Care Med 2021;47:1181",
        "col2": "Sepsis — Cairan",
        "col3": "Kristaloid seimbang sebagai cairan pilihan; albumin sebagai tambahan bila butuh kristaloid dalam jumlah besar; tidak menganjurkan HES/starch pada sepsis."
      },
      {
        "col1": "Perner A et al. 6S trial. NEJM 2012;367:124",
        "col2": "HES vs Ringer Asetat",
        "col3": "±800 pasien sepsis berat: HES 130/0,42 vs Ringer asetat → mortalitas 90 hari lebih tinggi pada HES (51% vs 43%) dan lebih banyak RRT. Dasar kontraindikasi HES pada sepsis."
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
        "col3": "126 pasien SBP: albumin IV + sefotaksim → gangguan ginjal (10% vs 33%) dan mortalitas RS (10% vs 29%) lebih rendah dibanding antibiotik saja. Dosis: 1,5 g/kg hari ke-1 + 1 g/kg hari ke-3."
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
        "col3": "Protein 1,3 g/kg/hari dicapai bertahap; EN dini prioritas; bila EN kontraindikasi, PN dalam 3–7 hari (lebih dini & bertahap pada malnutrisi berat); hindari overfeeding."
      },
      {
        "col1": "Spasovski G et al. Eur J Endocrinol 2014;170:G1",
        "col2": "Hiponatremia — Guideline",
        "col3": "Panduan Eropa (ESE/ESICM/ERBP) hiponatremia: gejala berat → NaCl 3% 150 mL dalam 20 menit (dapat diulang), target ↑Na 5 mmol/L pada jam pertama; batas kenaikan 10 mmol/L dalam 24 jam pertama dan 8 mmol/L tiap 24 jam berikutnya."
      },
      {
        "col1": "Carney N et al. Neurosurgery 2017;80:6",
        "col2": "TBI — Hiperosmolar",
        "col3": "Pedoman TBI edisi 4 (BTF): terapi bila ICP >22 mmHg; target CPP 60–70 mmHg; SBP ≥100 (usia 50–69) / ≥110 (usia 15–49 atau >70); bukti belum cukup untuk memilih manitol vs salin hipertonik."
      },
      {
        "col1": "NICE CG174. IV Fluids in Adults. 2013 (updated 2023)",
        "col2": "IV Fluids — Dewasa",
        "col3": "Framework 5D (Drug, Dose, Duration, Direction, Details) untuk tatalaksana cairan IV dewasa. Resusitasi vs replacement vs maintenance."
      },
      {
        "col1": "Jaber S et al. BICAR-ICU trial. Lancet 2018;392:31",
        "col2": "NaHCO3 — ICU",
        "col3": "389 pasien asidemia metabolik berat (pH ≤7,20): bikarbonat 4,2% tidak memperbaiki luaran komposit (kematian/gagal organ) secara keseluruhan; pada strata AKI berat (AKIN 2–3) mortalitas 28 hari lebih rendah dan RRT lebih sedikit."
      },
      {
        "col1": "Magpie Trial Collaborative Group. Lancet 2002;359:1877",
        "col2": "MgSO4 — Eklampsia",
        "col3": "10.141 wanita preeklampsia: MgSO₄ vs plasebo → risiko eklampsia ↓ 58% (NNT ≈ 91), tanpa perbedaan mortalitas maternal. Lini pertama profilaksis eklampsia."
      },
      {
        "col1": "Panchal AR et al. (AHA 2020). Circulation 2020;142:S366",
        "col2": "Henti Jantung — Ca²⁺",
        "col3": "CaCl₂ 10% 5–10 mL IV pada henti jantung dengan hipokalsemia, hiperkalemia, atau overdosis penyekat kanal kalsium. Tidak direkomendasikan rutin pada henti jantung tanpa indikasi spesifik."
      },
      {
        "col1": "Kraft MD et al. Am J Health Syst Pharm 2005;62:1663",
        "col2": "Koreksi Elektrolit ICU",
        "col3": "Panduan komprehensif koreksi elektrolit pada ICU dewasa: K, Mg, Ca, Na, P. Dosis, kecepatan, monitoring, dan interaksi obat."
      },
      {
        "col1": "ESPGHAN/ESPEN/ESPR/CSPEN Pediatric PN Guidelines. Clin Nutr 2018;37:2306–2423",
        "col2": "Nutrisi Parenteral Pediatrik",
        "col3": "Pedoman PN pediatrik: asam amino neonatus preterm mulai ≥1,5 g/kg pada hari ke-1 lalu 2,5–3,5 g/kg/hari mulai hari ke-2; laju infus glukosa disesuaikan usia; pemilihan formulasi AA pediatrik."
      },
      {
        "col1": "NICE NG29. IV Fluids in Children and Young People. 2015 (updated 2020)",
        "col2": "IV Fluids — Pediatrik",
        "col3": "Maintenance: kristaloid isotonik (Na 131–154 mmol/L) — hindari cairan hipotonik karena risiko hiponatremia; pantau elektrolit & glukosa."
      }
    ]
  },
  {
    "id": "literatur-teori-kalkulator-tambahan",
    "title": "Literatur Teori & Kalkulator (Tambahan)",
    "headers": [
      "Topik",
      "Publikasi / Penulis",
      "Relevansi / Konteks"
    ],
    "items": [
      {
        "col1": "Ventilator & Mekanik Paru",
        "col2": "Tobin MJ (2013); Chatburn RL (Respir Care 2014); Esteban A (AJRCCM 2008); Gattinoni L (ICM 2016)",
        "col3": "Prinsip ventilasi mekanik, taksonomi mode, mechanical power & driving pressure."
      },
      {
        "col1": "Nutrisi ICU",
        "col2": "Singer P (ESPEN 2023); Compher C (ASPEN 2022); McClave SA (ASPEN/SCCM 2016); da Silva JSV (ASPEN refeeding 2020); NICE-SUGAR",
        "col3": "Target energi & protein, refeeding syndrome, kontrol glukosa."
      },
      {
        "col1": "Analisis Gas Darah (AGD)",
        "col2": "Kaufman DA (ATS); Kraut JA & Madias NE (CJASN 2007); Seifter JL (NEJM 2014); Berend K (NEJM 2014)",
        "col3": "Interpretasi AGD, integrasi gangguan asam-basa & elektrolit, anion gap."
      },
      {
        "col1": "Cedera Otak (TIK)",
        "col2": "Carney N (BTF 2017); Hawryluk GWJ (SIBICC 2019); Hutchinson PJ (RESCUEicp 2016); Cooper DJ (DECRA 2011); Mokri B (2001)",
        "col3": "Manajemen TIK bertingkat, doktrin Monro-Kellie, kraniektomi dekompresi."
      },
      {
        "col1": "PADIS & Mobilisasi",
        "col2": "Devlin JW (PADIS 2018); Lewis K (PADIS 2025); Girard TD (ABC 2008); Schweickert WD (2009); TEAM (2022)",
        "col3": "Nyeri, sedasi, delirium, imobilitas & tidur; SAT-SBT berpasangan; mobilisasi dini."
      },
      {
        "col1": "Insulin & Diabetes",
        "col2": "ADA Standards of Care 2024; PERKENI; Umpierrez GE (2024)",
        "col3": "Hyperglycemic Crises (DKA/HHS), Basal-Bolus-Correction regimen, Hypoglycemia management."
      },
      {
        "col1": "Manajemen Airway",
        "col2": "Brown CA (Walls Manual 6th ed); Prekker ME (DEVICE 2023); Gibbs KW (PREOXI 2024); Russell DW (PREPARE II 2022); DAS 2025",
        "col3": "Manajemen jalan napas emergensi, video laringoskop, preoksigenasi NIV, cairan pra-intubasi, algoritma intubasi sulit."
      },
      {
        "col1": "Elektrolit Lanjutan",
        "col2": "Weisberg LS (CCM 2008); Batterink J (Cochrane 2015); Cooper MS & Gittoes NJ (BMJ 2008); de Baaij JHF (Physiol Rev 2015)",
        "col3": "Hiperkalemia berat, hipokalsemia, fisiologi magnesium."
      },
      {
        "col1": "Pulmonologi Klinis",
        "col2": "Metlay JP (ATS/IDSA 2019); Lim WS (2003); Charles PG (2008)",
        "col3": "CAP Guidelines, CURB-65, SMART-COP score untuk prediksi ICU/ventilasi."
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
        "col1": "Carson JL et al. AABB International Guidelines. JAMA 2023;330:1892",
        "col2": "Panduan Transfusi AABB",
        "col3": "Ambang Hb 7 g/dL untuk pasien rawat inap yang stabil termasuk ICU; 7,5 g/dL untuk bedah jantung; 8 g/dL untuk bedah ortopedi atau penyakit kardiovaskular yang sudah ada."
      },
      {
        "col1": "Rossaint R et al. European Trauma Bleeding Guideline (6th ed). Crit Care 2023;27:80",
        "col2": "Perdarahan Masif — MTP",
        "col3": "Perdarahan masif pada trauma: FFP:PRC minimal 1:2 atau konsentrat fibrinogen; fibrinogen bila <1,5 g/L; asam traneksamat dalam 3 jam; pantau dan pertahankan kalsium terionisasi dalam rentang normal."
      },
      {
        "col1": "Giancarelli A et al. J Surg Res 2016;202:182",
        "col2": "Toksisitas Sitrat & Ca",
        "col3": "Hipokalsemia sering pada transfusi masif (sitrat mengikat Ca²⁺) dan berhubungan dengan mortalitas lebih tinggi — pantau iCa dan ganti kalsium. CaCl₂ 10% mengandung ±3× kalsium elemental dibanding Ca-glukonat 10%."
      },
      {
        "col1": "Spahn DR et al. (ESMR). Crit Care 2019;23:98",
        "col2": "Trauma Perdarahan",
        "col3": "Panduan Eropa perdarahan masif pada trauma: resusitasi hemostatik terarah, uji viskoelastik (TEG/ROTEM), suplementasi fibrinogen, hipotensi permisif (SBP 80–90 mmHg) sampai perdarahan terkontrol bila tanpa cedera otak."
      },
      {
        "col1": "Sihler KC & Napolitano LM. Chest 2010;137:209",
        "col2": "Transfusi Masif — Komplikasi",
        "col3": "Review komplikasi MTP: TACO, TRALI, hipotermia, hipokalsemia, asidosis dilutional, koagulopati dilutional. Framework pencegahan dan pemantauan selama MTP."
      },
      {
        "col1": "Holcomb JB et al. PROPPR Trial. JAMA 2015;313:471",
        "col2": "Rasio FFP:PRC MTP",
        "col3": "680 pasien trauma masif: rasio 1:1:1 vs 1:1:2 — mortalitas 24 jam dan 30 hari tidak berbeda bermakna; hemostasis lebih sering tercapai (86% vs 78%) dan kematian akibat perdarahan dalam 24 jam lebih sedikit."
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
        "col1": "Kemenkes RI. KMK No. HK.01.07/MENKES/1541/2022 — PNPK Tata Laksana Anestesiologi dan Terapi Intensif",
        "col2": "Kementerian Kesehatan RI",
        "col3": "Pedoman nasional tata laksana anestesiologi & terapi intensif (menggantikan PNPK 2015)."
      },
      {
        "col1": "Kemenkes RI. KMK No. HK.01.07/MENKES/342/2017 — PNPK Tata Laksana Sepsis",
        "col2": "Kementerian Kesehatan RI",
        "col3": "Pedoman nasional sepsis dewasa; berbasis SSC 2012 — sebagian rekomendasi sudah diperbarui SSC 2021."
      },
      {
        "col1": "Kemenkes RI. KMK No. 1778/MENKES/SK/XII/2010 — Pedoman Penyelenggaraan Pelayanan ICU di Rumah Sakit",
        "col2": "Kementerian Kesehatan RI",
        "col3": "Standar penyelenggaraan, ketenagaan, dan klasifikasi pelayanan ICU di RS Indonesia."
      },
      {
        "col1": "Kemenkes RI. Permenkes No. 519/MENKES/PER/III/2011 — Pedoman Penyelenggaraan Pelayanan Anestesiologi dan Terapi Intensif di RS",
        "col2": "Kementerian Kesehatan RI",
        "col3": "Regulasi penyelenggaraan pelayanan anestesiologi dan terapi intensif di rumah sakit."
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
        "col2": "Lexicomp Drug Reference 2024 · BNF 2024",
        "col3": ""
      },
      {
        "col1": "Remifentanil",
        "col2": "Ultiva SmPC · BNF 2024",
        "col3": ""
      },
      {
        "col1": "Propofol",
        "col2": "BNF 2024 · Diprivan SmPC · SCCM PADIS 2018",
        "col3": ""
      },
      {
        "col1": "Ketamine",
        "col2": "Cohen L. Ann Emerg Med 2015 · Lexicomp 2024 · Miller RD. Miller's Anesthesia 9th ed. 2020",
        "col3": ""
      },
      {
        "col1": "Etomidate",
        "col2": "Jabre P. Lancet 2009 (KETASED) · Lexicomp 2024",
        "col3": ""
      },
      {
        "col1": "Midazolam (induksi & ICU)",
        "col2": "Reves JG. Anesthesiology 1985 · PADIS 2018 · BNF 2024",
        "col3": ""
      },
      {
        "col1": "Dexmedetomidine",
        "col2": "Precedex SmPC · Riker RR. JAMA 2009 (SEDCOM) · Pandharipande PP. JAMA 2007 (MENDS) · PADIS 2018/2025",
        "col3": ""
      },
      {
        "col1": "Suksinilkolin",
        "col2": "Tran DT. Cochrane 2015 · Walls Manual of Emergency Airway Management 6th ed.",
        "col3": ""
      },
      {
        "col1": "Rocuronium",
        "col2": "Tran DT. Cochrane 2015 · Guihard B. JAMA 2019 (CURASMUR) · Lexicomp 2024",
        "col3": ""
      },
      {
        "col1": "Vecuronium, Atrakurium, Cisatrakurium",
        "col2": "Papazian NEJM 2010 · Miller RD. Miller's Anesthesia 2020 · Lexicomp 2024",
        "col3": ""
      },
      {
        "col1": "Sugammadex",
        "col2": "Brueckmann B. Br J Anaesth 2015 · Lee C. Anesthesiology 2009 · Bridion SmPC",
        "col3": ""
      },
      {
        "col1": "Lidokain (airway)",
        "col2": "Walls Manual of Emergency Airway Management 6th ed. · Lexicomp 2024",
        "col3": ""
      },
      {
        "col1": "Norepinefrin, Dopamin, Dobutamin",
        "col2": "De Backer D. NEJM 2010 · Annane D. Lancet 2007 (CATS) · SSC 2021",
        "col3": ""
      },
      {
        "col1": "Nitrogliserin, Amiodarone",
        "col2": "ESC ACS Guidelines 2023 · ACC/AHA Guidelines 2023 · BNF 2024",
        "col3": ""
      },
      {
        "col1": "Koreksi Na, K, Ca, Mg",
        "col2": "Adrogue HJ. NEJM 2000 · Sterns RH. NEJM 2015 · de Baaij JHF. Physiol Rev 2015 · Cooper MS. BMJ 2008 · Kraft MD. Am J Health Syst Pharm 2005",
        "col3": ""
      },
      {
        "col1": "MgSO4 (asma, eklampsia, TdP)",
        "col2": "GINA 2024 · Rowe BH. Cochrane 2000 · Magpie Trial. Lancet 2002 · UpToDate: Hypomagnesemia 2023",
        "col3": ""
      },
      {
        "col1": "KCl 7,46% — Koreksi Hipokalemia",
        "col2": "Kraft MD. Am J Health Syst Pharm 2005 · UpToDate: Hypokalemia Treatment 2023",
        "col3": ""
      },
      {
        "col1": "NaHCO3 8,4% — Koreksi Asidosis",
        "col2": "Jaber S. BICAR-ICU. Lancet 2018 · Kraut JA. Nat Rev Nephrol 2012 · UpToDate: Bicarbonate Therapy 2023",
        "col3": ""
      },
      {
        "col1": "Ca-Glukonas 10% / CaCl2 10%",
        "col2": "AHA ACLS 2020 · Cooper MS. BMJ 2008 · Rossaint R. Crit Care 2023 · Giancarelli A. J Surg Res 2016 · UpToDate: Hypocalcemia 2023",
        "col3": ""
      },
      {
        "col1": "Insulin Regular (hiperkalemia)",
        "col2": "Dépret F. Ann Intensive Care 2019 · Batterink J. Cochrane 2015 · UpToDate: Treatment of Hyperkalemia 2023",
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
