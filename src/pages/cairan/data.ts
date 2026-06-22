import { FluidItem, PackageData } from './types';

const CF_PKG_DATA: Record<string, PackageData> = {
  'nacl-09': {
    pkg: ['100 mL', '250 mL', '500 mL', '1000 mL'],
    pkgRef: '500 mL',
    pkgComp: [
      { l: 'Na⁺', v: '77 mEq' },
      { l: 'Cl⁻', v: '77 mEq' }
    ]
  },
  'ringer-laktat': {
    pkg: ['500 mL', '1000 mL'],
    pkgRef: '500 mL',
    pkgComp: [
      { l: 'Na⁺',    v: '65 mEq' },
      { l: 'K⁺',     v: '2 mEq' },
      { l: 'Ca²⁺',   v: '1,35 mEq' },
      { l: 'Cl⁻',    v: '54,5 mEq' },
      { l: 'Laktat', v: '14 mEq' }
    ]
  },
  'ringer-asetat': {
    pkg: ['500 mL'],
    pkgRef: '500 mL',
    pkgComp: [
      { l: 'Na⁺',    v: '65 mEq' },
      { l: 'K⁺',     v: '2 mEq' },
      { l: 'Ca²⁺',   v: '1,35 mEq' },
      { l: 'Cl⁻',    v: '54,5 mEq' },
      { l: 'Asetat', v: '14 mEq' }
    ]
  },
  'ringer-fundin': {
    pkg: ['500 mL'],
    pkgRef: '500 mL',
    pkgComp: [
      { l: 'Na⁺',    v: '70 mEq' },
      { l: 'K⁺',     v: '2 mEq' },
      { l: 'Ca²⁺',   v: '1,25 mEq' },
      { l: 'Mg²⁺',   v: '0,5 mEq' },
      { l: 'Cl⁻',    v: '63,5 mEq' },
      { l: 'Asetat', v: '12 mEq' },
      { l: 'Malat',  v: '2,5 mEq' }
    ]
  },
  'physiolyte': {
    pkg: ['500 mL', '1000 mL'],
    pkgRef: '500 mL',
    pkgComp: [
      { l: 'Na⁺',      v: '70 mEq' },
      { l: 'K⁺',       v: '2,5 mEq' },
      { l: 'Mg²⁺',     v: '0,75 mEq' },
      { l: 'Cl⁻',      v: '49 mEq' },
      { l: 'Asetat',   v: '13,5 mEq' },
      { l: 'Glukonat', v: '11,5 mEq' }
    ]
  },
  'widabest': {
    pkg: ['500 mL'],
    pkgRef: '500 mL',
    pkgComp: [
      { l: 'Na⁺', v: '~65 mEq *' },
      { l: 'K⁺',  v: '~2 mEq *' },
      { l: 'Cl⁻', v: '~54,5 mEq *' }
    ]
  },
  'nacl-3': {
    pkg: ['100 mL', '500 mL'],
    pkgRef: '100 mL',
    pkgComp: [
      { l: 'Na⁺', v: '51,3 mEq' },
      { l: 'Cl⁻', v: '51,3 mEq' }
    ]
  },
  'd5': {
    pkg: ['100 mL', '250 mL', '500 mL', '1000 mL'],
    pkgRef: '500 mL',
    pkgComp: [
      { l: 'Dextrose', v: '25 g' },
      { l: 'Kalori',   v: '85 kcal' }
    ]
  },
  'd10': {
    pkg: ['100 mL', '250 mL', '500 mL'],
    pkgRef: '500 mL',
    pkgComp: [
      { l: 'Dextrose', v: '50 g' },
      { l: 'Kalori',   v: '170 kcal' }
    ]
  },
  'd20': {
    pkg: ['100 mL', '500 mL'],
    pkgRef: '500 mL',
    pkgComp: [
      { l: 'Dextrose', v: '100 g' },
      { l: 'Kalori',   v: '340 kcal' }
    ]
  },
  'd5-quarter-ns': {
    pkg: ['250 mL', '500 mL'],
    pkgRef: '500 mL',
    pkgComp: [
      { l: 'Na⁺',      v: '19,25 mEq' },
      { l: 'Cl⁻',      v: '19,25 mEq' },
      { l: 'Dextrose', v: '25 g' }
    ]
  },
  'd5-half-ns': {
    pkg: ['250 mL', '500 mL'],
    pkgRef: '500 mL',
    pkgComp: [
      { l: 'Na⁺',      v: '38,5 mEq' },
      { l: 'Cl⁻',      v: '38,5 mEq' },
      { l: 'Dextrose', v: '25 g' }
    ]
  },
  'kaen-3b': {
    pkg: ['500 mL'],
    pkgRef: '500 mL',
    pkgComp: [
      { l: 'Na⁺',    v: '25 mEq' },
      { l: 'K⁺',     v: '10 mEq' },
      { l: 'Cl⁻',    v: '25 mEq' },
      { l: 'Laktat', v: '10 mEq' },
      { l: 'Glucose', v: '13,5 g' },
      { l: 'Kalori',  v: '45,5 kcal' }
    ]
  },
  'tutosol': {
    pkg: ['500 mL'],
    pkgRef: '500 mL',
    pkgComp: [
      { l: 'Na⁺',    v: '~25 mEq *' },
      { l: 'K⁺',     v: '~10 mEq *' },
      { l: 'Cl⁻',    v: '~25 mEq *' },
      { l: 'Glucose', v: '~13,5 g *' }
    ]
  },
  'aminofusin': {
    pkg: ['500 mL (5%)', '500 mL (10%)'],
    pkgRef: '500 mL (10%)',
    pkgComp: [
      { l: 'Protein equiv', v: '50 g' },
      { l: 'Nitrogen',      v: '~8 g' }
    ]
  },
  'aminosteril': {
    pkg: ['500 mL'],
    pkgRef: '500 mL',
    pkgComp: [
      { l: 'Total AA',    v: '50 g' },
      { l: 'Nitrogen',    v: '7,65 g' },
      { l: 'Kalori (AA)', v: '~200 kcal' }
    ]
  },
  'aminosteril-infant': {
    pkg: ['100 mL', '250 mL'],
    pkgRef: '100 mL',
    pkgComp: [
      { l: 'Total AA',    v: '10 g' },
      { l: 'Nitrogen',    v: '~1,53 g' },
      { l: 'Taurin',      v: '60 mg' },
      { l: 'Sistein',     v: '100 mg' },
      { l: 'Kalori (AA)', v: '~40 kcal' }
    ]
  },
  'aminoleban': {
    pkg: ['500 mL'],
    pkgRef: '500 mL',
    pkgComp: [
      { l: 'Asam Amino total', v: '40 g' },
      { l: 'BCAA (Leu+Ile+Val)', v: '~14,4 g' }
    ]
  },
  'albumin-5': {
    pkg: ['250 mL', '500 mL'],
    pkgRef: '250 mL',
    pkgComp: [
      { l: 'Albumin', v: '12,5 g' }
    ]
  },
  'albumin-25': {
    pkg: ['50 mL', '100 mL'],
    pkgRef: '100 mL',
    pkgComp: [
      { l: 'Albumin', v: '25 g' }
    ]
  },
  'gelatin': {
    pkg: ['500 mL'],
    pkgRef: '500 mL',
    pkgComp: [
      { l: 'Gelatin', v: '20 g' },
      { l: 'Na⁺',     v: '77 mEq' },
      { l: 'Cl⁻',     v: '~62,5 mEq' }
    ]
  },
  'hes': {
    pkg: ['500 mL'],
    pkgRef: '500 mL',
    pkgComp: [
      { l: 'HES 130/0,4', v: '30 g' },
      { l: 'Na⁺',         v: '77 mEq' },
      { l: 'Cl⁻',         v: '77 mEq' }
    ]
  },
  'kcl-746': {
    pkg: ['10 mL', '25 mL'],
    pkgRef: '10 mL',
    pkgComp: [
      { l: 'K⁺',  v: '10 mEq' },
      { l: 'Cl⁻', v: '10 mEq' }
    ]
  },
  'mgso4-20': {
    pkg: ['10 mL', '25 mL'],
    pkgRef: '25 mL',
    pkgComp: [
      { l: 'Mg²⁺',    v: '40,6 mEq' },
      { l: 'SO₄²⁻',   v: '40,6 mEq' },
      { l: 'MgSO₄',   v: '5 g' }
    ]
  },
  'mgso4-40': {
    pkg: ['25 mL'],
    pkgRef: '25 mL',
    pkgComp: [
      { l: 'Mg²⁺',    v: '81,3 mEq' },
      { l: 'SO₄²⁻',   v: '81,3 mEq' },
      { l: 'MgSO₄',   v: '10 g' }
    ]
  },
  'd40': {
    pkg: ['25 mL'],
    pkgRef: '25 mL',
    pkgComp: [
      { l: 'Glukosa', v: '10 g' },
      { l: 'Kalori',  v: '~34 kcal' }
    ]
  },
  'nahco3-84': {
    pkg: ['25 mL', '50 mL', '100 mL'],
    pkgRef: '25 mL',
    pkgComp: [
      { l: 'Na⁺',     v: '25 mEq' },
      { l: 'HCO₃⁻',  v: '25 mEq' },
      { l: 'NaHCO₃',  v: '2,1 g' }
    ]
  },
  'ca-gluconas': {
    pkg: ['10 mL'],
    pkgRef: '10 mL',
    pkgComp: [
      { l: 'Ca²⁺',         v: '4,65 mEq' },
      { l: 'Ca elemental', v: '93 mg' },
      { l: 'Ca-Glukonas',  v: '1 g' }
    ]
  },
  'cacl2': {
    pkg: ['10 mL'],
    pkgRef: '10 mL',
    pkgComp: [
      { l: 'Ca²⁺',         v: '13,6 mEq' },
      { l: 'Ca elemental', v: '272 mg' },
      { l: 'CaCl₂',        v: '1 g' }
    ]
  },
  'mannitol-20': {
    pkg: ['250 mL botol', '500 mL botol'],
    pkgRef: '500 mL',
    pkgComp: [
      { l: 'Mannitol', v: '100 g' },
      { l: 'Osmolarity', v: '~549 mOsm' }
    ]
  },
  'mannitol-10': {
    pkg: ['250 mL botol', '500 mL botol'],
    pkgRef: '500 mL',
    pkgComp: [
      { l: 'Mannitol', v: '50 g' },
      { l: 'Osmolarity', v: '~275 mOsm' }
    ]
  },
  'lipofundin-20': {
    pkg: ['100 mL botol', '250 mL botol', '500 mL botol'],
    pkgRef: '250 mL',
    pkgComp: [
      { l: 'MCT',      v: '25 g' },
      { l: 'LCT',      v: '25 g' },
      { l: 'Gliserin', v: '6,25 g' },
      { l: 'Energi',   v: '~480 kcal' }
    ]
  },
  'kabiven': {
    pkg: ['1440 mL kantong', '1920 mL kantong'],
    pkgRef: '1440 mL',
    pkgComp: [
      { l: 'Asam Amino', v: '~34 g' },
      { l: 'Glukosa',    v: '~97 g' },
      { l: 'Lipid',      v: '~57 g' },
      { l: 'Energi',     v: '~1260 kcal' }
    ]
  },
  'nacl-045': {
    pkg: ['500 mL', '1000 mL'],
    pkgRef: '500 mL',
    pkgComp: [
      { l: 'Na⁺', v: '38,5 mEq' },
      { l: 'Cl⁻', v: '38,5 mEq' }
    ]
  },
  'na-asetat': {
    pkg: ['20 mEq/10 mL vial', '40 mEq/20 mL vial'],
    pkgRef: '20 mEq/10 mL',
    pkgComp: [
      { l: 'Na⁺',    v: '20 mEq' },
      { l: 'Asetat', v: '20 mEq' }
    ]
  },
  'k-fosfat': {
    pkg: ['15 mL vial (45 mmol fosfat)', '5 mL vial (15 mmol fosfat)'],
    pkgRef: '15 mL vial',
    pkgComp: [
      { l: 'K⁺ / Na⁺', v: '45 mEq' },
      { l: 'Fosfat',    v: '45 mmol' }
    ]
  }
};

const _CF_FLUIDS_RAW: Partial<FluidItem>[] = [
  {
    id: 'nacl-09',
    name: 'NaCl 0,9%',
    alias: 'Normal Saline · NS',
    cat: 'kristaloid',
    badge: 'Isotonik',
    osm: '308 mOsm/L',
    img: '/assets/img/cairan/nacl-09.jpg',
    comp: [
      { l: 'Na⁺',       v: '154 mEq/L' },
      { l: 'Cl⁻',       v: '154 mEq/L' },
      { l: 'K⁺',        v: '0' },
      { l: 'Buffer',    v: 'Tidak ada' },
      { l: 'Osmolarity',v: '308 mOsm/L' },
      { l: 'pH',        v: '4,5–7,0' },
      { l: 'Tonisitas', v: 'Isotonik (sedikit hipertonik)' }
    ],
    ind: [
      { i: '✅', t: 'Resusitasi volume lini pertama' },
      { i: '✅', t: 'Diluent / vehicle obat-obatan IV' },
      { i: '✅', t: 'Koreksi hiponatremia ringan–sedang' },
      { i: '✅', t: 'Alkalosis metabolik hipokloremik' },
      { i: '✅', t: 'Kompatibel dengan semua produk darah' },
      { i: '✅', t: 'Aman pada TBI / peningkatan ICP' }
    ],
    warn: [
      { i: '⚠️', t: 'Risiko hyperchloremic metabolic acidosis pada volume besar (Cl 154 >> plasma 98–106 mEq/L)' },
      { i: '⚠️', t: 'Risiko AKI lebih tinggi vs balanced crystalloid — SMART trial 2018' },
      { i: '⚠️', t: 'Monitor Cl⁻ serum dan pH pada pemberian > 2 L' },
      { i: '✅', t: 'Tidak mengandung Ca²⁺ — kompatibel penuh dengan transfusi darah' }
    ],
    tips: [
      'Pertimbangkan balanced crystalloid (RL / Physiolyte) untuk resusitasi volume besar',
      'Tetap pilihan utama untuk drug dilution dan koreksi alkalosis hipokloremik',
      'Monitor AGD dan elektrolit pada pemberian masif'
    ],
    ref: [
      { t: 'Semler MW et al. SMART trial.', j: 'NEJM 2018', d: '378:829–839' },
      { t: 'Self WH et al. SALT-ED trial.', j: 'NEJM 2018', d: '378:819–828' },
      { t: 'Myburgh JA & Mythen MG. Resuscitation Fluids.', j: 'NEJM 2013', d: '369:1243–1251' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Hindari sebagai maintenance — risiko asidosis hiperkloremik dan hipernatremia lebih tinggi. Aman sebagai diluent obat jangka pendek.' },
      { g: 'Pediatrik', n: 'Aman untuk resusitasi singkat dan drug dilution. Pertimbangkan balanced crystalloid untuk volume > 20 mL/kgBB.' },
      { g: 'Dewasa',    n: 'Pilihan utama resusitasi, drug dilution, koreksi alkalosis hipokloremik. Monitor Cl⁻ pada pemberian > 2 L.' }
    ]
  },
  {
    id: 'ringer-laktat',
    name: 'Ringer Laktat',
    alias: "RL · Hartmann's Solution",
    cat: 'kristaloid',
    badge: 'Balanced',
    osm: '273 mOsm/L',
    img: '/assets/img/cairan/ringer-laktat.jpg',
    comp: [
      { l: 'Na⁺',       v: '130 mEq/L' },
      { l: 'K⁺',        v: '4 mEq/L' },
      { l: 'Ca²⁺',      v: '2,7 mEq/L' },
      { l: 'Cl⁻',       v: '109 mEq/L' },
      { l: 'Laktat',    v: '28 mEq/L' },
      { l: 'Osmolarity',v: '273 mOsm/L' },
      { l: 'pH',        v: '6,0–7,5' },
      { l: 'Tonisitas', v: 'Sedikit hipotonik' }
    ],
    ind: [
      { i: '✅', t: 'Resusitasi volume lini pertama ICU & perioperatif' },
      { i: '✅', t: 'Trauma termasuk perdarahan (hemoragik)' },
      { i: '✅', t: 'Resusitasi sepsis sebagai balanced alternative' },
      { i: '✅', t: 'Luka bakar' }
    ],
    warn: [
      { i: '⚠️', t: 'Hindari pada gagal hati berat — laktat tidak dapat dimetabolisme' },
      { i: '⚠️', t: 'Hipotonik ringan (273 mOsm/L) — hindari monoterapi pada TBI / edema serebral' },
      { i: '🔴', t: 'TIDAK kompatibel dengan produk darah — Ca²⁺ memicu koagulasi' },
      { i: '⚠️', t: 'Hati-hati pada hiperkalemia (K⁺ 4 mEq/L)' }
    ],
    tips: [
      'Laktat → dimetabolisme hati → HCO₃⁻ (efek buffer ringan)',
      'Gagal hati berat: gunakan Ringer Asetat atau Physiolyte',
      'Butuh kompatibel darah: gunakan NS atau Physiolyte',
      'SMART trial: RL setara Physiolyte, keduanya superior NS untuk MAKE30'
    ],
    ref: [
      { t: 'Semler MW et al. SMART trial.', j: 'NEJM 2018', d: '378:829–839' },
      { t: 'Young P et al. SPLIT trial.', j: 'JAMA 2015', d: '314(16):1701–1710' },
      { t: 'Zampieri FG et al. BaSICS trial.', j: 'JAMA 2021', d: '326(9):818–829' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Gunakan dengan hati-hati — Ca²⁺ inkompatibel dengan transfusi darah; K⁺ 4 mEq/L berisiko pada neonatus dengan fungsi ginjal imatur.' },
      { g: 'Pediatrik', n: 'Pilihan resusitasi trauma dan perioperatif anak. Awasi hiperkalemia pada neonatus < 1 bulan.' },
      { g: 'Dewasa',    n: 'Lini pertama resusitasi volume besar, trauma, sepsis, luka bakar.' }
    ]
  },
  {
    id: 'ringer-asetat',
    name: 'Ringer Asetat',
    alias: 'Asering',
    cat: 'kristaloid',
    badge: 'Balanced',
    osm: '280 mOsm/L',
    img: '/assets/img/cairan/ringer-asetat.jpg',
    comp: [
      { l: 'Na⁺',       v: '130 mEq/L' },
      { l: 'K⁺',        v: '4 mEq/L' },
      { l: 'Ca²⁺',      v: '2,7 mEq/L' },
      { l: 'Cl⁻',       v: '109 mEq/L' },
      { l: 'Asetat',    v: '28 mEq/L' },
      { l: 'Osmolarity',v: '280 mOsm/L' },
      { l: 'pH',        v: '~6,5' }
    ],
    ind: [
      { i: '✅', t: 'Resusitasi volume — alternatif Ringer Laktat' },
      { i: '✅', t: 'Pilihan utama pada gagal hati berat' },
      { i: '✅', t: 'Pankreatitis akut' },
      { i: '✅', t: 'Perioperatif pada pasien hepatik' }
    ],
    warn: [
      { i: '⚠️', t: 'Tidak kompatibel dengan produk darah (mengandung Ca²⁺)' },
      { i: '⚠️', t: 'Hati-hati pada hiperkalemia (K⁺ 4 mEq/L)' },
      { i: '✅', t: 'Asetat dimetabolisme di semua jaringan — tidak tergantung fungsi hati' },
      { i: '✅', t: 'Preferred dibanding RL pada gagal hati berat' }
    ],
    tips: [
      'Asetat metabolisme lebih cepat dari laktat dan tidak butuh fungsi hati',
      'Efektivitas resusitasi setara RL'
    ],
    ref: [
      { t: 'Van Regenmortel N et al. Acetate-based balanced solutions.', j: 'Intensive Care Med 2018' },
      { t: 'Zampieri FG et al. BaSICS trial.', j: 'JAMA 2021', d: '326(9):818–829' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Lebih aman dari RL pada disfungsi hati — asetat dimetabolisme otot, bukan hati. Tetap monitor K⁺.' },
      { g: 'Pediatrik', n: 'Alternatif RL pada anak dengan disfungsi hepatik atau kadar laktat tinggi.' },
      { g: 'Dewasa',    n: 'Pilihan utama pada gagal hati berat dan pankreatitis akut. Asetat lebih stabil dari laktat.' }
    ]
  },
  {
    id: 'ringer-fundin',
    name: 'Ringer Fundin',
    alias: 'Sterofundin ISO · R-Fundin',
    cat: 'kristaloid',
    badge: 'Balanced',
    osm: '304 mOsm/L',
    img: '/assets/img/cairan/ringer-fundin.jpg',
    comp: [
      { l: 'Na⁺',       v: '140 mEq/L' },
      { l: 'K⁺',        v: '4 mEq/L' },
      { l: 'Ca²⁺',      v: '2,5 mEq/L' },
      { l: 'Mg²⁺',      v: '1 mEq/L' },
      { l: 'Cl⁻',       v: '127 mEq/L' },
      { l: 'Asetat',    v: '24 mEq/L' },
      { l: 'Malat',     v: '5 mEq/L' },
      { l: 'Osmolarity',v: '304 mOsm/L' },
      { l: 'pH',        v: '5,1–5,9' }
    ],
    ind: [
      { i: '✅', t: 'Resusitasi volume perioperatif dan ICU' },
      { i: '✅', t: 'Balanced crystalloid dengan Na mendekati plasma (140 mEq/L)' },
      { i: '✅', t: 'Pasien yang memerlukan suplementasi Mg²⁺' }
    ],
    warn: [
      { i: '⚠️', t: 'Tidak kompatibel dengan produk darah (mengandung Ca²⁺)' },
      { i: '✅', t: 'Dual buffer asetat + malat — metabolisme di berbagai jaringan' },
      { i: '✅', t: 'Tanpa laktat — aman pada gagal hati' },
      { i: '✅', t: 'Na 140 mEq/L — tidak menyebabkan hiponatremia dilusi' }
    ],
    tips: [
      'Komposisi paling mendekati plasma di antara balanced crystalloid yang mengandung Ca²⁺',
      'Malat dimetabolisme terutama di ginjal dan jantung'
    ],
    ref: [
      { t: 'Myburgh JA & Mythen MG. Resuscitation Fluids.', j: 'NEJM 2013', d: '369:1243–1251' },
      { t: 'Zampieri FG et al. BaSICS trial.', j: 'JAMA 2021', d: '326(9):818–829' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Data sangat terbatas — tidak direkomendasikan pada neonatus.' },
      { g: 'Pediatrik', n: 'Data terbatas pada anak < 12 tahun. Gunakan hanya jika kristaloid standar tidak tersedia.' },
      { g: 'Dewasa',    n: 'Balanced crystalloid modern dengan malat — cocok untuk perioperatif dan ICU dewasa.' }
    ]
  },
  {
    id: 'physiolyte',
    name: 'Physiolyte',
    alias: 'PlasmaLyte 148 · Normosol-R',
    cat: 'kristaloid',
    badge: 'Balanced',
    osm: '294 mOsm/L',
    img: '/assets/img/cairan/physiolyte.jpg',
    comp: [
      { l: 'Na⁺',       v: '140 mEq/L' },
      { l: 'K⁺',        v: '5 mEq/L' },
      { l: 'Mg²⁺',      v: '1,5 mEq/L' },
      { l: 'Cl⁻',       v: '98 mEq/L' },
      { l: 'Asetat',    v: '27 mEq/L' },
      { l: 'Glukonat',  v: '23 mEq/L' },
      { l: 'Ca²⁺',      v: '0' },
      { l: 'Laktat',    v: '0' },
      { l: 'Osmolarity',v: '294 mOsm/L' },
      { l: 'pH',        v: '7,4' }
    ],
    ind: [
      { i: '✅', t: 'Resusitasi volume — pilihan most physiological' },
      { i: '✅', t: 'Perioperatif dan ICU' },
      { i: '✅', t: 'Butuh kompatibel darah sekaligus balanced' },
      { i: '✅', t: 'Gagal hati berat (tanpa laktat, tanpa Ca²⁺)' },
      { i: '✅', t: 'TBI — osmolarity isotonik, tidak hipotonik' }
    ],
    warn: [
      { i: '✅', t: 'pH 7,4 — satu-satunya kristaloid dengan pH setara plasma' },
      { i: '✅', t: 'Cl 98 mEq/L — identik plasma normal, minimal risiko asidosis hiperkloremik' },
      { i: '✅', t: 'Kompatibel dengan produk darah (tidak mengandung Ca²⁺)' },
      { i: '✅', t: 'Dual buffer asetat + glukonat — tidak tergantung fungsi hati' },
      { i: '✅', t: 'Tanpa laktat — aman pada gagal hati berat' }
    ],
    tips: [
      'Menggabungkan keunggulan RL (balanced) dan NS (kompatibel darah, safe TBI)',
      'Digunakan sebagai salah satu balanced crystalloid dalam SMART trial 2018',
      'Pilihan ideal saat butuh cairan kompatibel darah sekaligus paling fisiologis'
    ],
    ref: [
      { t: 'Semler MW et al. SMART trial.', j: 'NEJM 2018', d: '378:829–839' },
      { t: 'Young P et al. SPLIT trial.', j: 'JAMA 2015', d: '314(16):1701–1710' },
      { t: 'Myburgh JA & Mythen MG. Resuscitation Fluids.', j: 'NEJM 2013', d: '369:1243–1251' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Data terbatas. Bebas Ca²⁺ membuatnya kompatibel dengan transfusi, namun studi pada neonatus belum memadai.' },
      { g: 'Pediatrik', n: 'Alternatif RL/RA untuk anak > 2 tahun. Kompatibel dengan produk darah.' },
      { g: 'Dewasa',    n: 'Balanced crystalloid bebas Ca²⁺ — satu-satunya balanced yang kompatibel penuh dengan transfusi. SMART trial: setara RL.' }
    ]
  },
  {
    id: 'widabest',
    name: 'Widabest',
    alias: 'Balanced Crystalloid (Lokal)',
    cat: 'kristaloid',
    badge: 'Balanced',
    osm: '~280 mOsm/L',
    img: '/assets/img/cairan/widabest.jpg',
    pending: true,
    comp: [
        { l: 'Na⁺',       v: '~130 mEq/L *' },
        { l: 'K⁺',        v: '~4 mEq/L *' },
        { l: 'Ca²⁺',      v: '~2,7 mEq/L *' },
        { l: 'Cl⁻',       v: '~109 mEq/L *' },
        { l: 'Buffer',    v: 'Laktat/Asetat *' },
        { l: 'Osmolarity',v: '~280 mOsm/L *' }
    ],
    ind: [
      { i: '✅', t: 'Resusitasi volume (balanced crystalloid)' },
      { i: '✅', t: 'Alternatif RL / Ringer Asetat' }
    ],
    warn: [
      { i: '⚠️', t: 'Data berdasarkan estimasi — konfirmasi insert kemasan resmi sebelum penggunaan kritis' }
    ],
    tips: [
      'Produk lokal Indonesia — verifikasi komposisi dari kemasan'
    ],
    ref: [
      { t: 'Konfirmasi komposisi dari insert kemasan resmi Widabest.', j: '' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Tidak direkomendasikan — belum ada studi pada neonatus.' },
      { g: 'Pediatrik', n: 'Data sangat terbatas. Tidak digunakan rutin pada anak.' },
      { g: 'Dewasa',    n: 'Balanced crystalloid untuk perioperatif dan ICU dewasa. Formulasi lokal Indonesia.' }
    ]
  },
  {
    id: 'nacl-3',
    name: 'NaCl 3%',
    alias: 'Hypertonic Saline · HTS',
    cat: 'hipertonik',
    badge: 'Hipertonik',
    osm: '1026 mOsm/L',
    img: '/assets/img/cairan/nacl-3.jpg',
    comp: [
      { l: 'Na⁺',       v: '513 mEq/L' },
      { l: 'Cl⁻',       v: '513 mEq/L' },
      { l: 'Osmolarity',v: '1026 mOsm/L' },
      { l: 'pH',        v: '4,5–7,0' }
    ],
    ind: [
      { i: '✅', t: 'Hiponatremia simptomatik berat (seizure, GCS ↓, herniasi)' },
      { i: '✅', t: 'Edema serebral / Elevated ICP' },
      { i: '✅', t: 'Trauma kapitis berat (TBI) — terapi hiperosmolar' }
    ],
    warn: [
      { i: '🔴', t: 'HANYA via CVC — risiko phlebitis / nekrosis vena perifer' },
      { i: '🔴', t: 'Koreksi Na ≤ 10 mEq/L per 24 jam — risiko Osmotic Demyelination Syndrome (ODS)' },
      { i: '⚠️', t: 'Monitor Na serum setiap 4–6 jam selama koreksi aktif' },
      { i: '⚠️', t: 'Target Na TBI: 145–155 mEq/L, tidak melebihi 160 mEq/L' },
      { i: '⚠️', t: 'Target osmolarity TBI: 300–320 mOsm/kg' }
    ],
    tips: [
      'Hiponatremia simptomatik: 150 mL bolus 20 menit, dapat diulang 1–2x → target ↑Na 5 mEq/L jam pertama',
      'TBI / elevated ICP: bolus 2–3 mL/kgBB, titrasi sesuai ICP monitor',
      'Setelah koreksi akut: beralih ke cairan isosmotik, hindari free water'
    ],
    ref: [
      { t: 'Spasovski G et al. Clinical practice guideline on hyponatraemia.', j: 'Eur J Endocrinol 2014', d: '170:G1–G47' },
      { t: 'Carney N et al. Guidelines for Management of Severe TBI, 4th ed.', j: 'Neurosurgery 2017', d: '80:6–15' },
      { t: 'Cook AM et al. Pharmacological Treatment of Patients with TBI.', j: 'J Neurotrauma 2020' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Penggunaan sangat terbatas — risiko perdarahan intrakranial dan osmolalitas berlebihan. Hanya emergensi hiponatremia berat dengan monitoring ketat.' },
      { g: 'Pediatrik', n: 'Koreksi hiponatremia simtomatik berat (kejang, penurunan kesadaran). Kecepatan koreksi Na⁺ < 0,5 mEq/L/jam.' },
      { g: 'Dewasa',    n: 'Hiponatremia simtomatik, TBI dengan herniasi, SIADH berat. Koreksi max 8–10 mEq/L per 24 jam.' }
    ]
  },
  {
    id: 'd5',
    name: 'Dextrose 5%',
    alias: 'D5W · D5%',
    cat: 'dextrose',
    badge: 'Dextrose',
    osm: '252 mOsm/L',
    img: '/assets/img/cairan/d5.jpg',
    comp: [
      { l: 'Dextrose',          v: '50 g/L' },
      { l: 'Osmolarity',        v: '252 mOsm/L' },
      { l: 'pH',                v: '3,5–6,5' },
      { l: 'Kalori',            v: '170 kcal/L' },
      { l: 'Tonisitas efektif', v: 'Hipotonik (setelah dextrose dimetabolisme)' }
    ],
    ind: [
      { i: '✅', t: 'Vehicle / diluent obat-obatan IV' },
      { i: '✅', t: 'Hipoglikemia ringan' },
      { i: '✅', t: 'Koreksi hipernatremia (free water replacement)' },
      { i: '✅', t: 'Partial caloric support — cegah katabolisme protein' }
    ],
    warn: [
      { i: '🔴', t: 'BUKAN cairan resusitasi — distribusi ke semua kompartemen, ekspansi intravaskular minimal' },
      { i: '⚠️', t: 'Hindari pada TBI / edema serebral — efektif hipotonik setelah metabolisme dextrose' },
      { i: '⚠️', t: 'Risiko hiponatremia dilusi pada pemberian volume besar' },
      { i: '⚠️', t: 'Monitor GDS pada drip berkelanjutan' }
    ],
    tips: [
      'Setelah dextrose dimetabolisme → setara free water, bukan volume expander',
      'Koreksi hipernatremia: hitung free water deficit terlebih dahulu'
    ],
    ref: [
      { t: 'Myburgh JA & Mythen MG. Resuscitation Fluids.', j: 'NEJM 2013', d: '369:1243–1251' },
      { t: 'NICE Guidelines: IV Fluids in Adults in Hospital.', j: 'CG174, 2013 (updated 2023)' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Digunakan sebagai cairan maintenance basal neonatus term. Target GIR 4–6 mg/kgBB/menit. Monitor GD setiap 2–4 jam.' },
      { g: 'Pediatrik', n: 'Maintenance anak dikombinasi dengan elektrolit (D5 + NaCl). Bukan untuk resusitasi.' },
      { g: 'Dewasa',    n: 'Koreksi hipoglikemia ringan, maintenance non-resusitasi. Hindari sebagai cairan resusitasi.' }
    ]
  },
  {
    id: 'd10',
    name: 'Dextrose 10%',
    alias: 'D10W · D10%',
    cat: 'dextrose',
    badge: 'Dextrose',
    osm: '505 mOsm/L',
    img: '/assets/img/cairan/d10.jpg',
    comp: [
      { l: 'Dextrose',  v: '100 g/L' },
      { l: 'Osmolarity',v: '505 mOsm/L' },
      { l: 'pH',        v: '3,5–6,5' },
      { l: 'Kalori',    v: '340 kcal/L' }
    ],
    ind: [
      { i: '✅', t: 'Hipoglikemia sedang–berat' },
      { i: '✅', t: 'Glucose support neonatus (GIR calculation)' },
      { i: '✅', t: 'Hiperalimentasi parsial' },
      { i: '✅', t: 'Transisi pasca insulin drip' }
    ],
    warn: [
      { i: '⚠️', t: 'Osmolarity 505 mOsm/L — risiko phlebitis vena perifer, gunakan vena besar' },
      { i: '⚠️', t: 'Monitor GDS ketat' },
      { i: '⚠️', t: 'Bukan cairan resusitasi' }
    ],
    tips: [
      'GIR (Glucose Infusion Rate) = (% dextrose × rate mL/jam) ÷ (6 × BB kg)',
      'Target GIR neonatus: 4–8 mg/kgBB/menit',
      'Pasca insulin drip: mulai D10 jika GDS < 150 mg/dL, titrasi insulin turun'
    ],
    ref: [
      { t: 'NICE NG29: IV Fluid Therapy in Children and Young People.', j: '2015 (updated 2020)' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Pilihan utama neonatus preterm dan hipoglikemia neonatal. GIR 6–8 mg/kgBB/menit via PICC atau UAC. Monitor GD tiap 1–2 jam.' },
      { g: 'Pediatrik', n: 'Hipoglikemia sedang–berat pada anak. Dosis 2–5 mL/kgBB IV. Monitor GD serial.' },
      { g: 'Dewasa',    n: 'Transisi pasca insulin drip (mulai saat GD < 150 mg/dL). Monitor GDS ketat.' }
    ]
  },
  {
    id: 'd20',
    name: 'Dextrose 20%',
    alias: 'D20W · D20%',
    cat: 'dextrose',
    badge: 'Dextrose',
    osm: '~1110 mOsm/L',
    img: '/assets/img/cairan/d20.jpg',
    comp: [
      { l: 'Dextrose',   v: '200 g/L (200 mg/mL)' },
      { l: 'Kalori',     v: '~680 kcal/L' },
      { l: 'Osmolarity', v: '~1110 mOsm/L' },
      { l: 'pH',         v: '3,5–6,5' },
      { l: 'Tonisitas',  v: 'Hipertonik' }
    ],
    ind: [
      { i: '✅', t: 'Suplemen kalori via CVC pada pasien restriksi cairan' },
      { i: '✅', t: 'Koreksi hipoglikemia sedang (lebih terkontrol dari D40%)' },
      { i: '✅', t: 'Komponen TPN (total parenteral nutrition)' },
      { i: '✅', t: 'Transisi dari TPN penuh ke enteral — bridge nutrition' },
      { i: '✅', t: 'Hiperkalemia: kombinasi dengan Insulin Regular (jika D40% tidak tersedia)' }
    ],
    warn: [
      { i: '⚠️', t: 'Osmolarity ~1110 mOsm/L — wajib via CVC untuk infus lama' },
      { i: '⚠️', t: 'Via perifer hanya boleh jangka sangat pendek — risiko phlebitis berat' },
      { i: '⚠️', t: 'Monitor GDS ketat — risiko hiperglikemia' },
      { i: '⚠️', t: 'Hindari pada TBI — hiperglikemia memperburuk outcome neurologis' },
      { i: '⚠️', t: 'Bukan cairan resusitasi' }
    ],
    tips: [
      'Koreksi hipoglikemia: 50–100 mL IV pelan via CVC (lebih terkontrol dari D40%)',
      'Suplemen kalori ICU: 500 mL/hari memberikan 340 kcal — tambahkan elektrolit sesuai kebutuhan',
      'D20% + Insulin Regular 10 IU: alternatif D40% untuk hiperkalemia jika stok terbatas',
      'GIR (Glucose Infusion Rate): (20 × rate mL/jam) ÷ (6 × BB kg) mg/kgBB/menit'
    ],
    ref: [
      { t: 'Uptodate: Parenteral nutrition in adults.', j: 'UpToDate', d: '2023' },
      { t: 'Uptodate: Management of hypoglycemia in hospitalized adults.', j: 'UpToDate', d: '2023' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Jarang digunakan — terlalu pekat. Encerkan terlebih dahulu jika diperlukan. Berikan hanya via PICC atau UAC.' },
      { g: 'Pediatrik', n: 'Suplemen kalori via CVC pada anak dengan restriksi cairan. Monitor GDS ketat.' },
      { g: 'Dewasa',    n: 'Suplemen kalori ICU, koreksi hipoglikemia terkontrol via CVC, komponen TPN.' }
    ]
  },
  {
    id: 'd5-quarter-ns',
    name: 'D5 ¼ NS',
    alias: 'D5 0,225% NaCl',
    cat: 'dextrose',
    badge: 'Dextrose',
    osm: '~329 mOsm/L',
    img: '/assets/img/cairan/d5-quarter-ns.jpg',
    comp: [
      { l: 'Na⁺',       v: '38,5 mEq/L' },
      { l: 'Cl⁻',       v: '38,5 mEq/L' },
      { l: 'Dextrose',  v: '50 g/L' },
      { l: 'Osmolarity',v: '~329 mOsm/L' }
    ],
    ind: [
      { i: '✅', t: 'Maintenance pediatri (penggunaan historis)' },
      { i: '✅', t: 'Kombinasi hidrasi + kalori minimal' }
    ],
    warn: [
      { i: '⚠️', t: 'Risiko hiponatremia — terutama pada anak sakit' },
      { i: '⚠️', t: 'NICE 2015: beralih ke isotonic maintenance (NaCl 0,9%) pada anak' },
      { i: '⚠️', t: 'Penggunaan semakin ditinggalkan' }
    ],
    tips: [
      'Lebih disarankan NaCl 0,9% atau balanced solution sebagai maintenance anak saat ini'
    ],
    ref: [
      { t: 'Moritz ML & Ayus JC. Preventing neurological complications from dysnatremias in children.', j: 'Ped Nephrology 2005' },
      { t: 'NICE NG29: IV Fluid Therapy in Children.', j: '2015 (updated 2020)' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Cairan maintenance standar neonatus (NICE NG29). Kombinasi dengan KCl 10–20 mEq/L sesuai kebutuhan.' },
      { g: 'Pediatrik', n: 'Maintenance baku anak < 2 tahun per NICE/PALS. Waspadai hiponatremia dilutional.' },
      { g: 'Dewasa',    n: 'Jarang pada dewasa — hanya maintenance post-op singkat. Bukan untuk resusitasi.' }
    ]
  },
  {
    id: 'd5-half-ns',
    name: 'D5 ½ NS',
    alias: 'D5 0,45% NaCl',
    cat: 'dextrose',
    badge: 'Dextrose',
    osm: '~406 mOsm/L',
    img: '/assets/img/cairan/d5-half-ns.jpg',
    comp: [
      { l: 'Na⁺',       v: '77 mEq/L' },
      { l: 'Cl⁻',       v: '77 mEq/L' },
      { l: 'Dextrose',  v: '50 g/L' },
      { l: 'Osmolarity',v: '~406 mOsm/L' }
    ],
    ind: [
      { i: '✅', t: 'Maintenance hipotonik + kalori' },
      { i: '✅', t: 'Kondisi yang memerlukan restriksi sodium' }
    ],
    warn: [
      { i: '⚠️', t: 'Risiko hiponatremia — sama seperti D5 ¼ NS' },
      { i: '⚠️', t: 'Tidak direkomendasikan sebagai maintenance rutin anak (NICE 2015)' }
    ],
    tips: [
      'Pertimbangkan NaCl 0,9% + KCl sebagai maintenance yang lebih aman'
    ],
    ref: [
      { t: 'NICE NG29: IV Fluid Therapy in Children.', j: '2015 (updated 2020)' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Tidak direkomendasikan untuk neonatus — kandungan Na lebih rendah meningkatkan risiko hiponatremia.' },
      { g: 'Pediatrik', n: 'Maintenance anak 2–12 tahun. Lebih sering digunakan dari D5 ¼ NS pada anak yang lebih besar.' },
      { g: 'Dewasa',    n: 'Maintenance post-operasi ringan. Monitor elektrolit bila pemberian > 24 jam.' }
    ]
  },
  {
    id: 'kaen-3b',
    name: 'KAEN 3B',
    alias: 'Otsuka · Maintenance Standard',
    cat: 'maintenance',
    badge: 'Maintenance',
    osm: '~330 mOsm/L',
    img: '/assets/img/cairan/kaen-3b.jpg',
    comp: [
      { l: 'Na⁺',       v: '50 mEq/L' },
      { l: 'K⁺',        v: '20 mEq/L' },
      { l: 'Cl⁻',       v: '50 mEq/L' },
      { l: 'Laktat',    v: '20 mEq/L' },
      { l: 'Glucose',   v: '27 g/L (4,3%)' },
      { l: 'Kalori',    v: '91 kcal/L' },
      { l: 'Osmolarity',v: '~330 mOsm/L' }
    ],
    ind: [
      { i: '✅', t: 'Maintenance standar dewasa dan anak' },
      { i: '✅', t: 'Post-operatif rutin' },
      { i: '✅', t: 'Pasien dengan intake oral terbatas' }
    ],
    warn: [
      { i: '🔴', t: 'BUKAN untuk resusitasi — Na rendah 50 mEq/L' },
      { i: '⚠️', t: 'K⁺ 20 mEq/L — hati-hati gagal ginjal / hiperkalemia' },
      { i: '⚠️', t: 'Monitor elektrolit serum secara berkala' },
      { i: '✅', t: 'Kalori 91 kcal/L → partial caloric support' }
    ],
    tips: [
      'Holliday-Segar: 4 mL/kg/jam (10 kg pertama) · 2 mL/kg/jam (10 kg kedua) · 1 mL/kg/jam (sisanya)',
      'Varian: KAEN 1B (neonatus, tanpa K) · KAEN 3A (K 10 mEq/L) · KAEN 4A/4B (glukosa lebih tinggi)'
    ],
    ref: [
      { t: 'Holliday MA & Segar WE. The maintenance need for water in parenteral fluid therapy.', j: 'Pediatrics 1957', d: '19:823–832' },
      { t: 'NICE NG29: IV Fluid Therapy in Children.', j: '2015 (updated 2020)' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Tidak direkomendasikan — kandungan Na dan K perlu diindividualisasi pada neonatus, terutama < 1 bulan.' },
      { g: 'Pediatrik', n: 'Cairan maintenance populer di Indonesia untuk anak > 1 bulan. Monitor elektrolit pada penggunaan jangka panjang.' },
      { g: 'Dewasa',    n: 'Maintenance post-operasi ICU. Bukan untuk resusitasi. Monitor elektrolit.' }
    ]
  },
  {
    id: 'tutosol',
    name: 'Tutosol',
    alias: 'Maintenance Elektrolit (Lokal)',
    cat: 'maintenance',
    badge: 'Maintenance',
    osm: '~320 mOsm/L',
    img: '/assets/img/cairan/tutosol.jpg',
    pending: true,
    comp: [
      { l: 'Na⁺',       v: '~50 mEq/L *' },
      { l: 'K⁺',        v: '~20 mEq/L *' },
      { l: 'Cl⁻',       v: '~50 mEq/L *' },
      { l: 'Glucose',   v: '~27 g/L *' },
      { l: 'Osmolarity',v: '~280–320 mOsm/L *' }
    ],
    ind: [
      { i: '✅', t: 'Maintenance elektrolit dan cairan' },
      { i: '✅', t: 'Secara klinis ekuivalen dengan KAEN 3B' }
    ],
    warn: [
      { i: '⚠️', t: 'Data berdasarkan estimasi — konfirmasi insert kemasan resmi' },
      { i: '🔴', t: 'BUKAN untuk resusitasi' }
    ],
    tips: [
      'Produk lokal Indonesia — verifikasi komposisi dari kemasan sebelum penggunaan kritis'
    ],
    ref: [
      { t: 'Konfirmasi komposisi dari insert kemasan resmi Tutosol.', j: '' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Data sangat terbatas. Tidak direkomendasikan pada neonatus.' },
      { g: 'Pediatrik', n: 'Alternatif KaEn 3B untuk maintenance anak. Data terbatas — gunakan hanya jika KaEn tidak tersedia.' },
      { g: 'Dewasa',    n: 'Maintenance ICU. Bukan cairan resusitasi. Monitor elektrolit.' }
    ]
  },
  {
    id: 'aminofusin',
    name: 'Aminofusin',
    alias: 'Fresenius Kabi · Amino Acid Solution',
    cat: 'amino',
    badge: 'Amino',
    osm: 'Bervariasi',
    img: '/assets/img/cairan/aminofusin.jpg',
    comp: [
      { l: 'Konsentrasi AA',   v: '5% – 10%' },
      { l: 'Protein equivalen',v: '50–100 g/L' },
      { l: 'Nitrogen',         v: '~8–16 g/L' },
      { l: 'pH',               v: '~5,5–6,5' }
    ],
    ind: [
      { i: '✅', t: 'Komponen parenteral nutrition (PN) pada pasien tidak toleran enteral' },
      { i: '✅', t: 'Malnutrisi pada pasien kritis' },
      { i: '✅', t: 'Katabolisme berat di ICU' },
      { i: '✅', t: 'Pre/post-operatif besar' }
    ],
    warn: [
      { i: '⚠️', t: 'Harus dikombinasikan dengan energi (dextrose + lipid) untuk complete PN' },
      { i: '⚠️', t: 'Monitor BUN dan kreatinin — sesuaikan dosis pada AKI' },
      { i: '⚠️', t: 'Monitor fungsi hati secara berkala' },
      { i: '✅', t: 'Target protein ICU: 1,2–2,0 g/kgBB/hari (ESPEN 2019)' }
    ],
    tips: [
      'Prioritaskan enteral nutrition jika memungkinkan',
      'Mulai PN dalam 24–48 jam jika enteral tidak mungkin pada malnutrisi berat',
      'Fase akut kritis: mulai 0,8–1,0 g/kgBB/hari, tingkatkan bertahap',
      'Hindari overfeeding — hitung kebutuhan kalori dengan formula prediksi'
    ],
    ref: [
      { t: 'Singer P et al. ESPEN guideline on clinical nutrition in the ICU.', j: 'Clin Nutr 2019', d: '38:48–79' },
      { t: 'McClave SA et al. ASPEN/SCCM Guidelines for Nutrition Support Therapy in Critically Ill Adults.', j: 'JPEN 2016' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Tidak direkomendasikan — gunakan formula amino khusus neonatus (Primene 10%, TrophAmine).' },
      { g: 'Pediatrik', n: 'Penggunaan off-label anak > 2 tahun. Preferensi solusi amino pediatrik khusus jika tersedia.' },
      { g: 'Dewasa',    n: 'Standar sumber nitrogen TPN ICU dewasa. Kombinasikan dengan dextrose dan lipid.' }
    ]
  },
  {
    id: 'aminosteril',
    name: 'Aminosteril KE 10%',
    alias: 'Aminosteril · Asam Amino Esensial 10%',
    cat: 'amino',
    badge: 'Amino',
    osm: '~875 mOsm/L',
    img: '/assets/img/cairan/aminosteril.jpg',
    comp: [
      { l: 'Total AA',    v: '100 g/L' },
      { l: 'Nitrogen',    v: '15,3 g/L' },
      { l: 'Kalori (AA)', v: '~400 kcal/L' },
      { l: 'Osmolarity',  v: '~875 mOsm/L' },
      { l: 'pH',          v: '5,0–7,0' },
      { l: 'Tonisitas',   v: 'Hipertonik' }
    ],
    ind: [
      { i: '✅', t: 'Sumber nitrogen pada TPN (total parenteral nutrition)' },
      { i: '✅', t: 'Hipoproteinemia / katabolisme berat pada pasien ICU' },
      { i: '✅', t: 'Dukungan nutrisi pasca operasi mayor' },
      { i: '✅', t: 'Kombinasi dengan dextrose dan lipid untuk TPN lengkap' }
    ],
    warn: [
      { i: '⚠️', t: 'Osmolarity ~875 mOsm/L — wajib via CVC untuk pemberian lama' },
      { i: '⚠️', t: 'Monitor BUN/kreatinin — beban nitrogen pada gagal ginjal' },
      { i: '⚠️', t: 'Kontraindikasi pada gagal hati berat — gunakan Aminoleban (BCAA)' },
      { i: '⚠️', t: 'Bukan cairan resusitasi — tidak untuk koreksi volume' },
      { i: '⚠️', t: 'Monitor glukosa darah saat dikombinasi dengan dextrose' }
    ],
    tips: [
      'Dosis nitrogen: 0,15–0,25 g N/kgBB/hari (katabolisme ringan–sedang)',
      'Rasio kalori non-protein : nitrogen = 100–150 kcal per 1 g N',
      'Kombinasikan dengan Dextrose 20–40% dan lipid emulsi untuk TPN 3-in-1',
      'Cek albumin, prealbumin, dan balans nitrogen setiap 3–5 hari',
      'Gagal hati: beralih ke Aminoleban (enriched BCAA)'
    ],
    ref: [
      { t: 'ESPEN Guidelines on Clinical Nutrition in the ICU.', j: 'Clin Nutr', d: '2019;38(1):48–79' },
      { t: 'Fresenius Kabi. Aminosteril KE 10% Product Insert.', j: 'BPOM Indonesia', d: '2022' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Tidak direkomendasikan — gunakan formula amino khusus neonatus (Aminosteril Infant, Primene 10%).' },
      { g: 'Pediatrik', n: 'Off-label pada anak > 2 tahun. Preferensi formulasi pediatrik jika tersedia.' },
      { g: 'Dewasa',    n: 'Standar sumber nitrogen TPN ICU dewasa. Rasio kalori non-protein : N = 100–150 kcal/g N.' }
    ]
  },
  {
    id: 'aminosteril-infant',
    name: 'Aminosteril Infant',
    alias: 'Amino Acid Solution for Infants · Fresenius Kabi',
    cat: 'amino',
    badge: 'Amino',
    osm: '~875 mOsm/L',
    img: '/assets/img/cairan/aminosteril-infant.jpg',
    comp: [
      { l: 'Total AA',    v: '100 g/L' },
      { l: 'Nitrogen',    v: '~15,3 g/L' },
      { l: 'Taurin',      v: '0,6 g/L — esensial neonatus' },
      { l: 'Sistein',     v: '1,0 g/L — kondisional esensial' },
      { l: 'Kalori (AA)', v: '~400 kcal/L' },
      { l: 'Osmolarity',  v: '~875 mOsm/L' },
      { l: 'pH',          v: '5,0–7,0' }
    ],
    ind: [
      { i: '✅', t: 'TPN neonatus dan bayi < 2 tahun — pilihan utama' },
      { i: '✅', t: 'Prematuritas yang memerlukan nutrisi parenteral' },
      { i: '✅', t: 'Dukungan nutrisi pasca operasi pada bayi dan anak' },
      { i: '✅', t: 'Sindrom usus pendek (short bowel syndrome) pada bayi' }
    ],
    warn: [
      { i: '⚠️', t: 'Osmolarity ~875 mOsm/L — wajib via CVC/PICC/UAC pada neonatus' },
      { i: '⚠️', t: 'Monitor BUN/kreatinin dan amonia serum — beban nitrogen pada fungsi ginjal imatur' },
      { i: '⚠️', t: 'Tidak direkomendasikan untuk dewasa — formulasi spesifik pediatrik' },
      { i: '⚠️', t: 'Selalu kombinasikan dengan dextrose dan lipid emulsi pediatrik untuk TPN lengkap' }
    ],
    tips: [
      'Kandungan taurin dan sistein yang esensial untuk neonatus (tidak bisa disintesis sendiri)',
      'Dosis nitrogen neonatus: 0,35–0,45 g N/kgBB/hari (aminogenesis dan growth)',
      'Mulai dari dosis rendah dan tingkatkan bertahap — toleransi sesuai fungsi ginjal',
      'Kombinasikan dengan dextrose (GIR target 4–8 mg/kgBB/menit) dan Intralipid 20%',
      'Monitor: glukosa, BUN, amonia, LFT, TG setiap 2–3 hari saat TPN'
    ],
    ref: [
      { t: 'ESPGHAN/ESPEN/ESPR Guidelines on Pediatric Parenteral Nutrition.', j: 'J Pediatr Gastroenterol Nutr', d: '2018;67(S2):S1–S4' },
      { t: 'Fresenius Kabi. Aminosteril Infant Product Insert.', j: 'BPOM Indonesia', d: '2022' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Pilihan utama TPN neonatus dan prematur. Mengandung taurin dan sistein yang tidak bisa disintesis neonatus. Mulai GIR 4–6 mg/kgBB/menit, tingkatkan bertahap.' },
      { g: 'Pediatrik', n: 'Cocok untuk bayi dan anak hingga ± 2 tahun. Di atas 2 tahun pertimbangkan beralih ke formulasi dewasa (Aminosteril KE / Aminofusin).' },
      { g: 'Dewasa',    n: 'Tidak direkomendasikan — formulasi khusus pediatrik. Gunakan Aminosteril KE 10% atau Aminofusin untuk dewasa.' }
    ]
  },
  {
    id: 'aminoleban',
    name: 'Aminoleban',
    alias: 'BCAA-Enriched · Otsuka',
    cat: 'amino',
    badge: 'Amino',
    osm: '~700 mOsm/L',
    img: '/assets/img/cairan/aminoleban.jpg',
    comp: [
      { l: 'BCAA (Leu, Ile, Val)',v: '~36% — sangat tinggi' },
      { l: 'Aromatic AA',         v: 'Sangat rendah' },
      { l: 'Methionine',          v: 'Rendah' },
      { l: 'Fischer Ratio',       v: 'Tinggi (BCAA : Aromatic)' },
      { l: 'Konsentrasi AA',      v: '8%' }
    ],
    ind: [
      { i: '✅', t: 'Hepatic Encephalopathy (HE) — indikasi utama' },
      { i: '✅', t: 'Sirosis hepatis dengan malnutrisi berat' },
      { i: '✅', t: 'Pre / post hepatektomi' },
      { i: '✅', t: 'Pasien hepatik yang tidak toleran protein standar' }
    ],
    warn: [
      { i: '🔴', t: 'BUKAN untuk pasien non-hepatik — BCAA excess tidak bermanfaat' },
      { i: '⚠️', t: 'Osmolarity tinggi (~700) — pertimbangkan jalur central pada infus lama' },
      { i: '✅', t: 'Mekanisme: BCAA kompetisi dengan aromatic AA di blood-brain barrier → ↓ neurotransmiter palsu' },
      { i: '✅', t: 'Koreksi imbalance Fischer ratio yang khas pada sirosis' }
    ],
    tips: [
      'Fischer ratio normal: 3,0–3,5 · Pada HE berat: < 1,0',
      'Kombinasikan dengan manajemen faktor presipitasi HE: infeksi, perdarahan, obstipasi',
      'Monitor status neurologis (flapping tremor, GCS) dan ammonia serum'
    ],
    ref: [
      { t: 'EASL Clinical Practice Guidelines: Hepatic Encephalopathy.', j: 'J Hepatol 2022' },
      { t: 'Marchesini G et al. BCAA supplementation in liver disease.', j: 'J Nutr 2003' },
      { t: 'Kawaguchi T et al. AA solution with BCAA in liver cirrhosis.', j: 'J Gastroenterol 2008' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Kontraindikasi — tidak ada data keamanan pada neonatus.' },
      { g: 'Pediatrik', n: 'Data sangat terbatas. Tidak direkomendasikan pada anak.' },
      { g: 'Dewasa',    n: 'Khusus sirosis dan ensefalopati hepatikum dewasa. BCAA menekan produksi amonia.' }
    ]
  },
  {
    id: 'albumin-5',
    name: 'Albumin 5%',
    alias: 'Human Albumin · Isooncotic',
    cat: 'koloid',
    badge: 'Koloid',
    osm: '~300 mOsm/L',
    img: '/assets/img/cairan/albumin-5.jpg',
    comp: [
      { l: 'Albumin',          v: '50 g/L (5%)' },
      { l: 'Na⁺',              v: '~130–160 mEq/L' },
      { l: 'Oncotic pressure', v: '~20 mmHg' },
      { l: 'Volume expansion', v: '~1:1 (isooncotic)' },
      { l: 'Half-life',        v: '~16–24 jam' }
    ],
    ind: [
      { i: '✅', t: 'Resusitasi volume pada septic shock sebagai adjunct kristaloid' },
      { i: '✅', t: 'Hypoalbuminemia simptomatik berat' },
      { i: '✅', t: 'Fluid resuscitation saat kristaloid tidak adekuat' }
    ],
    warn: [
      { i: '⚠️', t: 'Mahal — pertimbangkan cost-effectiveness' },
      { i: '⚠️', t: 'ALBIOS trial: tidak menurunkan mortalitas vs kristaloid pada sepsis secara keseluruhan' },
      { i: '✅', t: 'SAFE trial: albumin aman pada sepsis, tidak inferior vs NS' },
      { i: '✅', t: 'Mempertahankan MAP lebih stabil vs kristaloid (ALBIOS)' }
    ],
    tips: [
      'Pertimbangkan saat septic shock butuh kristaloid > 3L tanpa respons memadai',
      'SSC 2021: dapat digunakan sebagai adjunct pada pasien yang memerlukan cairan besar'
    ],
    ref: [
      { t: 'Finfer S et al. SAFE Study.', j: 'NEJM 2004', d: '350:2247–2256' },
      { t: 'Caironi P et al. ALBIOS trial.', j: 'NEJM 2014', d: '370:1412–1421' },
      { t: 'Evans L et al. SSC Guidelines 2021.', j: 'Intensive Care Med 2021', d: '47:1181–1247' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Dapat digunakan pada syok atau hipoalbuminemia berat neonatus (albumin < 2 g/dL). Dosis 10 mL/kgBB, berikan lambat.' },
      { g: 'Pediatrik', n: 'Resusitasi koloid jika kristaloid gagal atau pada kondisi spesifik (SBP, peritonitis). Dosis 10–20 mL/kgBB.' },
      { g: 'Dewasa',    n: 'Lini pertama pada SBP, SHR, parasentesis > 5 L, sepsis hipoalbuminemia. SSC 2021 merekomendasikan pada kondisi spesifik.' }
    ]
  },
  {
    id: 'albumin-25',
    name: 'Albumin 25%',
    alias: 'Human Albumin · Hyperoncotic',
    cat: 'koloid',
    badge: 'Koloid',
    osm: '~330 mOsm/L',
    img: '/assets/img/cairan/albumin-25.jpg',
    comp: [
      { l: 'Albumin',          v: '250 g/L (25%)' },
      { l: 'Na⁺',              v: '~130–160 mEq/L' },
      { l: 'Oncotic pressure', v: '~100 mmHg' },
      { l: 'Volume expansion', v: '~4–5x volume diberikan' },
      { l: 'Half-life',        v: '~16–24 jam' }
    ],
    ind: [
      { i: '✅', t: 'SBP (Spontaneous Bacterial Peritonitis): 1,5 g/kg hari-1, 1 g/kg hari-3' },
      { i: '✅', t: 'Hepatorenal Syndrome (HRS): kombinasi dengan terlipressin' },
      { i: '✅', t: 'Large Volume Paracentesis (> 5L): 6–8 g per liter yang dikeluarkan' },
      { i: '✅', t: 'Hipoalbuminemia berat pada sirosis dengan edema refrakter' }
    ],
    warn: [
      { i: '⚠️', t: 'Volume besar dapat menyebabkan overload — monitor ketat' },
      { i: '⚠️', t: 'Sangat mahal — gunakan sesuai indikasi berbasis bukti' },
      { i: '✅', t: 'Evidence kuat untuk SBP, HRS, dan post-LVP paracentesis' },
      { i: '✅', t: 'Hyperoncotic: menarik cairan interstitial → intravaskular' }
    ],
    tips: [
      'SBP: albumin hari-1 dan hari-3 terbukti menurunkan insidens HRS dan mortalitas (Sort et al. 1999)',
      'HRS: terlipressin 0,5–2 mg/4–6 jam + albumin 20–40 g/hari IV',
      'Hindari penggunaan di luar indikasi berbasis bukti'
    ],
    ref: [
      { t: 'EASL Clinical Practice Guidelines: Decompensated Cirrhosis.', j: 'J Hepatol 2018' },
      { t: 'Sort P et al. Albumin in SBP.', j: 'NEJM 1999', d: '341:403–409' },
      { t: 'Guevara M et al. Albumin in HRS.', j: 'Hepatology 2012' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Sangat jarang — risiko volume overload. Hanya pada hipoalbuminemia ekstrem dengan restriksi cairan ketat.' },
      { g: 'Pediatrik', n: 'Jarang digunakan — albumin 5% lebih sering dipilih pada anak. Hati-hati overload.' },
      { g: 'Dewasa',    n: 'Koreksi hipoalbuminemia berat dengan restriksi cairan. EASL 2022: efektif pada SHR tipe 1.' }
    ]
  },
  {
    id: 'gelatin',
    name: 'Gelatin',
    alias: 'Gelofusine · Haemaccel',
    cat: 'koloid',
    badge: 'Koloid',
    osm: '~308 mOsm/L',
    img: '/assets/img/cairan/gelatin.jpg',
    comp: [
      { l: 'Gelatin (suksinilasi)',v: '40 g/L' },
      { l: 'MW',                   v: '~30.000 Dalton' },
      { l: 'Na⁺',                  v: '~154 mEq/L (Gelofusine)' },
      { l: 'Oncotic pressure',     v: '~20 mmHg' },
      { l: 'Durasi efek',          v: '2–4 jam' }
    ],
    ind: [
      { i: '✅', t: 'Volume expander jangka pendek' },
      { i: '✅', t: 'Perioperatif saat kristaloid tidak mencukupi' },
      { i: '✅', t: 'Alternatif saat albumin tidak tersedia' }
    ],
    warn: [
      { i: '⚠️', t: 'Risiko reaksi anafilaktoid lebih tinggi vs kristaloid (~0,35%)' },
      { i: '⚠️', t: 'Haemaccel mengandung Ca²⁺ 12,5 mEq/L — tidak kompatibel produk darah' },
      { i: '⚠️', t: 'Bukti RCT besar masih terbatas' },
      { i: '✅', t: 'Lebih aman untuk fungsi ginjal dibanding HES' }
    ],
    tips: [
      'Siapkan epinefrin dan antihistamin — risiko anafilaksis lebih tinggi dari kristaloid',
      'Pilih Gelofusine (bukan Haemaccel) jika butuh kompatibilitas dengan darah'
    ],
    ref: [
      { t: 'Myburgh JA & Mythen MG. Resuscitation Fluids.', j: 'NEJM 2013', d: '369:1243–1251' },
      { t: 'Annane D et al. CRISTAL trial.', j: 'JAMA 2013', d: '310(17):1809–1817' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Kontraindikasi — tidak disetujui untuk neonatus dan bayi < 1 tahun.' },
      { g: 'Pediatrik', n: 'Gunakan dengan hati-hati anak > 2 tahun. Risiko reaksi anafilaksis lebih tinggi dari kristaloid.' },
      { g: 'Dewasa',    n: 'Ekspansi volume sementara. Tidak superior dibanding balanced crystalloid. Hindari pada koagulopati.' }
    ]
  },
  {
    id: 'hes',
    name: 'HES / Voluven',
    alias: 'Hydroxyethyl Starch · HAES-steril',
    cat: 'koloid',
    badge: 'Koloid',
    osm: '~308 mOsm/L',
    img: '/assets/img/cairan/hes.jpg',
    deprecated: true,
    comp: [
      { l: 'HES 130/0,4',      v: '60 g/L' },
      { l: 'Na⁺',              v: '154 mEq/L' },
      { l: 'Oncotic pressure', v: '~36 mmHg' },
      { l: 'MW',               v: '130.000 Dalton' }
    ],
    ind: [
      { i: '⚠️', t: 'Historis: volume expander perioperatif dan ICU (tidak lagi direkomendasikan)' }
    ],
    warn: [
      { i: '🔴', t: 'EMA 2018: Suspend marketing authorization di Eropa untuk semua indikasi' },
      { i: '🔴', t: 'FDA 2023: Black box warning — meningkatkan mortalitas dan AKI pada critically ill / sepsis' },
      { i: '🔴', t: 'SSC Guidelines 2021: Rekomendasikan AGAINST penggunaan HES pada pasien sepsis' },
      { i: '⚠️', t: 'Terbukti meningkatkan kebutuhan renal replacement therapy (RRT)' },
      { i: '⚠️', t: 'Koagulopati — mengganggu faktor von Willebrand dan faktor VIII' }
    ],
    tips: [
      'Tidak direkomendasikan untuk pasien ICU / sepsis',
      'Gunakan balanced crystalloid atau albumin sebagai alternatif'
    ],
    ref: [
      { t: 'Perner A et al. 6S trial. HES vs Ringer Acetate in severe sepsis.', j: 'NEJM 2012', d: '367:124–134' },
      { t: 'Brunkhorst FM et al. VISEP trial.', j: 'NEJM 2008', d: '358:125–139' },
      { t: 'Evans L et al. SSC Guidelines 2021.', j: 'Intensive Care Med 2021', d: '47:1181–1247' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Kontraindikasi mutlak — akumulasi toksik pada organ dengan metabolisme imatur.' },
      { g: 'Pediatrik', n: 'Kontraindikasi pada anak sakit kritis (EMA 2018). Tidak ada data keamanan yang memadai.' },
      { g: 'Dewasa',    n: 'DEPRECATED — EMA 2018 dan FDA 2023 mencabut izin edar pada ICU. Hindari pada semua pasien kritis dewasa.' }
    ]
  },
  {
    id: 'kcl-746',
    name: 'KCl 7,46%',
    alias: 'Potassium Chloride · KCl Concentrate',
    cat: 'elektrolit',
    badge: 'Konsentrat',
    osm: '~2000 mOsm/L',
    img: '/assets/img/cairan/kcl-746.jpg',
    comp: [
      { l: 'K⁺',         v: '1000 mEq/L (1 mEq/mL)' },
      { l: 'Cl⁻',        v: '1000 mEq/L' },
      { l: 'Osmolarity', v: '~2000 mOsm/L' },
      { l: 'pH',         v: '4,0–8,0' },
      { l: 'Tonisitas',  v: 'Sangat hipertonik' }
    ],
    ind: [
      { i: '✅', t: 'Koreksi hipokalemia sedang–berat (K⁺ < 3,0 mEq/L)' },
      { i: '✅', t: 'Hipokalemia refrakter' },
      { i: '✅', t: 'Pencegahan aritmia akibat hipokalemia' }
    ],
    warn: [
      { i: '🔴', t: 'JANGAN pernah bolus / undiluted IV — fatal, cardiac arrest' },
      { i: '⚠️', t: 'Wajib diencerkan: maks 20–40 mEq per 100–250 mL' },
      { i: '⚠️', t: 'Kecepatan maks via perifer: 10 mEq/jam; via CVC dengan monitoring: 20–40 mEq/jam' },
      { i: '⚠️', t: 'Monitor EKG kontinu saat koreksi cepat' }
    ],
    tips: [
      'Kecepatan koreksi tidak boleh > 0,5 mEq/kgBB/jam',
      'Cek Mg²⁺ serum — hipomagnesemia menyebabkan hipokalemia refrakter',
      'Hindari dextrose sebagai pelarut — stimulasi insulin memperburuk hipokalemia',
      'Gunakan NaCl 0,9% sebagai pelarut pilihan'
    ],
    ref: [
      { t: 'Kraft MD et al. Treatment of electrolyte disorders in adult ICU.', j: 'Am J Health Syst Pharm', d: '2005;62(16):1663–82' },
      { t: 'Uptodate: Treatment and prevention of hypokalemia in adults.', j: 'UpToDate', d: '2023' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Gunakan sangat hati-hati — wajib via PICC/UAC. Kecepatan max 0,2 mEq/kgBB/jam. EKG monitoring kontinu.' },
      { g: 'Pediatrik', n: 'Koreksi hipokalemia berat. Kecepatan max 0,3 mEq/kgBB/jam via CVC dengan monitoring EKG.' },
      { g: 'Dewasa',    n: 'Standar koreksi hipokalemia ICU. Max 0,5 mEq/kgBB/jam via CVC. Monitor EKG kontinu.' }
    ]
  },
  {
    id: 'mgso4-20',
    name: 'MgSO₄ 20%',
    alias: 'Magnesium Sulfate 20%',
    cat: 'elektrolit',
    badge: 'Elektrolit',
    osm: '~1626 mOsm/L',
    img: '/assets/img/cairan/mgso4.jpg',
    comp: [
      { l: 'Mg²⁺',       v: '1,62 mEq/mL (1626 mEq/L)' },
      { l: 'SO₄²⁻',      v: '1,62 mEq/mL' },
      { l: 'Osmolarity', v: '~1626 mOsm/L' },
      { l: 'pH',         v: '5,5–7,0' },
      { l: 'Tonisitas',  v: 'Sangat hipertonik' }
    ],
    ind: [
      { i: '✅', t: 'Koreksi hipomagnesemia' },
      { i: '✅', t: 'Preeklampsia / eklampsia — lini pertama' },
      { i: '✅', t: 'Torsades de pointes (TdP)' },
      { i: '✅', t: 'Status asmatikus refrakter' },
      { i: '✅', t: 'Hipokalemia / hipofosfatemia refrakter — koreksi Mg terlebih dahulu' }
    ],
    warn: [
      { i: '⚠️', t: 'Monitor refleks patella — hilang jika Mg serum > 5 mEq/L' },
      { i: '⚠️', t: 'Depresi napas pada Mg > 5 mEq/L — siapkan Ca-Glukonas sebagai antidotum' },
      { i: '⚠️', t: 'Hindari pada gagal ginjal berat (GFR < 30) tanpa monitoring ketat' },
      { i: '✅', t: 'Antidotum: Ca-Glukonas 10% 1 g IV bolus' }
    ],
    tips: [
      'Eklampsia — loading: 4–6 g dalam 15–20 menit, maintenance: 1–2 g/jam',
      'TdP: 1–2 g IV dalam 1–2 menit',
      'Koreksi rutin hipomagnesemia: 1–2 g dalam 1 jam',
      'Monitor kadar Mg, RR, dan refleks patella setiap 1–2 jam saat infus'
    ],
    ref: [
      { t: 'Uptodate: Hypomagnesemia — Treatment.', j: 'UpToDate', d: '2023' },
      { t: 'Magpie Trial Group. Pre-eclampsia and MgSO₄.', j: 'Lancet', d: '2002;359:1877–90' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Hipomagnesia dan seizure refrakter neonatus. Dosis: 25–50 mg/kgBB IV lambat 20–30 menit. Monitor RR dan refleks.' },
      { g: 'Pediatrik', n: 'Status asmatikus, hipomagnesemia. Dosis: 25–50 mg/kgBB (maks 2 g) dalam 20 menit. Monitor refleks patella.' },
      { g: 'Dewasa',    n: 'Loading eklampsia 4–6 g, TdP 1–2 g, asma 1–2 g. Monitor refleks, RR, dan Mg serum.' }
    ]
  },
  {
    id: 'mgso4-40',
    name: 'MgSO₄ 40%',
    alias: 'Magnesium Sulfate 40%',
    cat: 'elektrolit',
    badge: 'Elektrolit',
    osm: '~3253 mOsm/L',
    img: '/assets/img/cairan/mgso4.jpg',
    comp: [
      { l: 'Mg²⁺',       v: '3,25 mEq/mL (3253 mEq/L)' },
      { l: 'SO₄²⁻',      v: '3,25 mEq/mL' },
      { l: 'Osmolarity', v: '~3253 mOsm/L' },
      { l: 'pH',         v: '5,5–7,0' },
      { l: 'Tonisitas',  v: 'Sangat hipertonik' }
    ],
    ind: [
      { i: '✅', t: 'Koreksi hipomagnesemia (konsentrasi lebih pekat, volume lebih kecil)' },
      { i: '✅', t: 'Preeklampsia / eklampsia — loading dose' },
      { i: '✅', t: 'Torsades de pointes (TdP)' }
    ],
    warn: [
      { i: '⚠️', t: 'Lebih pekat dari 20% — wajib diencerkan sebelum pemberian IV' },
      { i: '⚠️', t: 'Monitor refleks patella dan RR secara ketat' },
      { i: '⚠️', t: 'Hindari pada gagal ginjal berat' },
      { i: '✅', t: 'Antidotum: Ca-Glukonas 10% 1 g IV bolus' }
    ],
    tips: [
      'Encerkan 1:1 dengan NS atau D5% sebelum infus',
      'Volume lebih kecil dari 20% untuk dosis Mg yang setara',
      'Selalu sediakan Ca-Glukonas di samping pasien saat pemberian MgSO₄'
    ],
    ref: [
      { t: 'Uptodate: Hypomagnesemia — Treatment.', j: 'UpToDate', d: '2023' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Encerkan hingga konsentrasi ≤ 10% sebelum pemberian. Kecepatan sangat lambat, monitoring ketat.' },
      { g: 'Pediatrik', n: 'Encerkan hingga 20% atau kurang. Kecepatan tidak lebih dari 0,2 mEq/kgBB/menit.' },
      { g: 'Dewasa',    n: 'Encerkan 1:1 dengan NS atau D5% sebelum infus. Dosis setara MgSO₄ 20% namun volume lebih kecil.' }
    ]
  },
  {
    id: 'd40',
    name: 'Dextrose 40%',
    alias: 'D40% · Glukosa 40%',
    cat: 'elektrolit',
    badge: 'Hipertonik',
    osm: '~2220 mOsm/L',
    img: '/assets/img/cairan/d40.jpg',
    comp: [
      { l: 'Glukosa',    v: '400 g/L (400 mg/mL)' },
      { l: 'Kalori',     v: '~1360 kcal/L' },
      { l: 'Osmolarity', v: '~2220 mOsm/L' },
      { l: 'pH',        v: '3,5–6,5' },
      { l: 'Tonisitas', v: 'Sangat hipertonik' }
    ],
    ind: [
      { i: '✅', t: 'Koreksi hipoglikemia berat / simtomatik — lini pertama ICU' },
      { i: '✅', t: 'Hiperkalemia: D40% + Insulin Regular (shift K⁺ intrasel)' },
      { i: '✅', t: 'Suplemen kalori jangka pendek via CVC' }
    ],
    warn: [
      { i: '🔴', t: 'JANGAN berikan via perifer — sangat veno-iritan, phlebitis berat' },
      { i: '⚠️', t: 'Monitor GD serial post koreksi hipoglikemia' },
      { i: '⚠️', t: 'Hindari pada TBI — hiperglikemia memperburuk outcome neurologis' },
      { i: '⚠️', t: 'Risiko hiponatremia dilutional jika diberikan volume besar' }
    ],
    tips: [
      'Hipoglikemia: 25 mL (= 10 g) IV bolus via CVC, ulangi jika GD belum ≥ 70 mg/dL',
      'Hiperkalemia: 25–50 mL D40% + Insulin Regular 10 IU IV → turunkan K⁺ 0,5–1,5 mEq/L dalam 15–60 menit',
      'Selalu siapkan D40% di ICU untuk koreksi hipoglikemia darurat'
    ],
    ref: [
      { t: 'Uptodate: Management of hypoglycemia in hospitalized adults.', j: 'UpToDate', d: '2023' },
      { t: 'Uptodate: Treatment of hyperkalemia in adults.', j: 'UpToDate', d: '2023' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Tidak digunakan — terlalu pekat. Gunakan D10% atau D12,5% via PICC/UAC untuk hipoglikemia neonatus.' },
      { g: 'Pediatrik', n: 'Hipoglikemia berat: gunakan D10% 2 mL/kgBB IV (lebih aman dan terkontrol dari D40%). D40% hanya jika D10% tidak tersedia.' },
      { g: 'Dewasa',    n: 'Standar koreksi hipoglikemia berat ICU via CVC, kombinasi dengan insulin untuk hiperkalemia.' }
    ]
  },
  {
    id: 'nahco3-84',
    name: 'NaHCO₃ 8,4%',
    alias: 'Meylon · Sodium Bicarbonate 8,4%',
    cat: 'elektrolit',
    badge: 'Alkali',
    osm: '~2000 mOsm/L',
    img: '/assets/img/cairan/nahco3.jpg',
    comp: [
      { l: 'Na⁺',        v: '1000 mEq/L (1 mEq/mL)' },
      { l: 'HCO₃⁻',      v: '1000 mEq/L (1 mEq/mL)' },
      { l: 'Osmolarity', v: '~2000 mOsm/L' },
      { l: 'pH',         v: '7,0–8,5' },
      { l: 'Tonisitas',  v: 'Sangat hipertonik' }
    ],
    ind: [
      { i: '✅', t: 'Asidosis metabolik berat (pH < 7,10 atau BE < −10)' },
      { i: '✅', t: 'Hiperkalemia refrakter — shift K⁺ intrasel' },
      { i: '✅', t: 'Overdosis TCA / salisilat / barbiturat' },
      { i: '✅', t: 'Alkalinisasi urin (toksikologi)' },
      { i: '✅', t: 'Cardiac arrest dengan asidosis berat' }
    ],
    warn: [
      { i: '⚠️', t: 'Paradoxical intracellular acidosis — CO₂ menembus membran lebih cepat dari HCO₃⁻' },
      { i: '⚠️', t: 'Risiko hipernatremia dan hiperosmolalitas' },
      { i: '🔴', t: 'TIDAK boleh dicampur dengan Ca²⁺ — presipitasi CaCO₃' },
      { i: '⚠️', t: 'Hanya via CVC — sangat veno-iritan via perifer' },
      { i: '⚠️', t: 'Koreksi hanya jika pH < 7,10 — benefit tidak terbukti pada pH 7,10–7,25' }
    ],
    tips: [
      'Dosis: (24 − HCO₃⁻ aktual) × BB × 0,5 = total mEq → berikan 50% dalam 30–60 menit',
      'Alternatif: 1–2 mEq/kgBB IV lambat (encerkan jika < 1 mEq/mL)',
      'Evaluasi ulang AGD 30 menit setelah koreksi',
      'JANGAN campur dengan Ca²⁺, dopamin, dobutamin, atau obat bersifat asam'
    ],
    ref: [
      { t: 'Jaber S et al. BICAR-ICU trial.', j: 'Lancet', d: '2018;392:31–40' },
      { t: 'Uptodate: Bicarbonate therapy in lactic acidosis.', j: 'UpToDate', d: '2023' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Encerkan 1:1 dengan air steril menjadi 4,2% sebelum pemberian. Kecepatan < 1 mEq/kgBB/menit. Hanya asidosis berat pH < 7,10.' },
      { g: 'Pediatrik', n: 'Encerkan hingga 4,2% pada anak < 2 tahun. Dosis 1–2 mEq/kgBB IV lambat. Evaluasi AGD pasca koreksi.' },
      { g: 'Dewasa',    n: 'Hanya via CVC pada 8,4%. Dosis (24 – HCO₃⁻) × BB × 0,5. Berikan 50% dalam 30–60 menit, evaluasi ulang AGD.' }
    ]
  },
  {
    id: 'ca-gluconas',
    name: 'Ca-Glukonas 10%',
    alias: 'Calcium Gluconate 10%',
    cat: 'elektrolit',
    badge: 'Elektrolit',
    osm: '~680 mOsm/L',
    img: '/assets/img/cairan/ca-gluconas.jpg',
    comp: [
      { l: 'Ca²⁺',         v: '9,3 mg/mL (0,465 mEq/mL)' },
      { l: 'Glukonat',     v: '0,465 mEq/mL' },
      { l: 'Ca elemental', v: '93 mg / 10 mL' },
      { l: 'Osmolarity',   v: '~680 mOsm/L' },
      { l: 'pH',           v: '6,0–8,2' }
    ],
    ind: [
      { i: '✅', t: 'Hipokalsemia simtomatik (tetani, tanda Chvostek / Trousseau)' },
      { i: '✅', t: 'Hiperkalemia — stabilisasi membran miokard (lini pertama sebelum shift K⁺)' },
      { i: '✅', t: 'Antidotum hipermagnesemia simtomatik' },
      { i: '✅', t: 'Overdosis Ca-channel blocker' },
      { i: '✅', t: 'Sindrom refeeding' }
    ],
    warn: [
      { i: '🔴', t: 'JANGAN campur dengan NaHCO₃ atau fosfat — presipitasi kalsium' },
      { i: '⚠️', t: 'Ekstravasasi menyebabkan nekrosis jaringan — hindari SC/IM' },
      { i: '⚠️', t: 'Berikan lambat (< 1 g/menit) — bradikardi jika terlalu cepat' },
      { i: '✅', t: 'Aman via perifer; Ca elemental 3× lebih sedikit dari CaCl₂' }
    ],
    tips: [
      'Hipokalsemia simtomatik: 1–2 g IV dalam 10 menit, maintenance 0,5–1 g/jam',
      'Hiperkalemia: 1–2 g IV dalam 2–3 menit, onset 1–3 menit, durasi 30–60 menit',
      'Monitor EKG saat pemberian bolus',
      'Pilih CaCl₂ via CVC jika butuh efek lebih cepat dan poten'
    ],
    ref: [
      { t: 'Uptodate: Management of hypocalcemia in adults.', j: 'UpToDate', d: '2023' },
      { t: 'Uptodate: Treatment of hyperkalemia in adults.', j: 'UpToDate', d: '2023' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Aman — pilihan utama hipokalsemia neonatus. Dosis 100 mg/kgBB (10 mg/mL) IV lambat 30 menit via PICC. Monitor EKG.' },
      { g: 'Pediatrik', n: 'Hipokalsemia simtomatik: 1–2 mL/kgBB (maks 20 mL) dalam 10–30 menit. Hiperkalemia: 0,5 mL/kgBB lambat. Monitor EKG.' },
      { g: 'Dewasa',    n: 'Hipokalsemia: 1–2 g dalam 10 menit. Hiperkalemia: 1–2 g dalam 2–3 menit. Onset 1–3 menit, durasi 30–60 menit.' }
    ]
  },
  {
    id: 'cacl2',
    name: 'CaCl₂ 10%',
    alias: 'Calcium Chloride 10%',
    cat: 'elektrolit',
    badge: 'Elektrolit',
    osm: '~2040 mOsm/L',
    img: '/assets/img/cairan/cacl2.jpg',
    comp: [
      { l: 'Ca²⁺',         v: '27,2 mg/mL (1,36 mEq/mL)' },
      { l: 'Cl⁻',          v: '2,72 mEq/mL' },
      { l: 'Ca elemental', v: '272 mg / 10 mL' },
      { l: 'Osmolarity',   v: '~2040 mOsm/L' },
      { l: 'pH',           v: '5,5–7,5' }
    ],
    ind: [
      { i: '✅', t: 'Cardiac arrest dengan hipokalsemia / hiperkalemia / overdosis Ca-channel blocker' },
      { i: '✅', t: 'Hiperkalemia berat — respons sangat cepat dibutuhkan' },
      { i: '✅', t: 'Hipokalsemia berat refrakter terhadap Ca-Glukonas' },
      { i: '✅', t: 'Hipermagnesemia berat' }
    ],
    warn: [
      { i: '🔴', t: 'Hanya via CVC — sangat veno-iritan, nekrosis vena perifer' },
      { i: '🔴', t: 'JANGAN campur dengan NaHCO₃ atau fosfat' },
      { i: '⚠️', t: 'Lebih kardiotoksik dari Ca-Glukonas — monitoring EKG ketat' },
      { i: '⚠️', t: 'Risiko hiperkalsemia lebih besar — monitor Ca²⁺ serum serial' }
    ],
    tips: [
      'Cardiac arrest: 5–10 mL (500–1000 mg) IV bolus, ulangi sesuai respons',
      'Ca elemental 3× lebih banyak dari Ca-Glukonas 10% — lebih poten untuk emergensi',
      'Pilih Ca-Glukonas untuk akses perifer; CaCl₂ untuk CVC / emergensi kardiak',
      'Encerkan dengan D5% atau NS jika tidak dalam kondisi arrest'
    ],
    ref: [
      { t: 'Uptodate: Management of hypocalcemia in adults.', j: 'UpToDate', d: '2023' },
      { t: 'AHA ACLS Guidelines 2020.', j: 'Circulation', d: '2020;142(16 suppl 2)' }
    ],
    pop: [
      { g: 'Neonatus',  n: 'Hindari kecuali cardiac arrest — jauh lebih pekat dari Ca-Glukonas. Risiko nekrosis ekstravaskular sangat tinggi pada akses perifer.' },
      { g: 'Pediatrik', n: 'Hanya pada cardiac arrest atau emergensi ekstrem via CVC. Preferensi Ca-Glukonas untuk kondisi non-arrest.' },
      { g: 'Dewasa',    n: 'Cardiac arrest, emergensi kardiogenik. Hanya via CVC. Ca elemental 3× lebih banyak dari Ca-Glukonas.' }
    ]
  },
  {
    id: 'mannitol-20',
    name: 'Mannitol 20%',
    alias: 'Mannitol 200 mg/mL',
    cat: 'osmotik',
    badge: 'Osmotik',
    osm: '~1098 mOsm/L',
    img: '/assets/img/cairan/mannitol-20.jpg',
    comp: [
      { l: 'Mannitol', v: '200 g/L' },
      { l: 'Osmolarity', v: '~1098 mOsm/L' },
      { l: 'pH', v: '4,5–7,0' },
      { l: 'Kalori', v: '0 kcal/L' }
    ],
    ind: [
      { i: '✅', t: 'Peningkatan tekanan intrakranial (cedera kepala, stroke hemoragik, tumor, ensefalitis)' },
      { i: '✅', t: 'Edema serebri akut — pilihan pertama sebelum terapi bedah' },
      { i: '✅', t: 'Glaukoma akut — penurunan tekanan intraokular' },
      { i: '✅', t: 'Diuresis osmotik — oliguria prerenal / gagal ginjal akut awal' }
    ],
    warn: [
      { i: '🔴', t: 'Kontraindikasi: anuria, gagal ginjal berat, edema paru, dehidrasi berat' },
      { i: '🔴', t: 'Monitor osmolalitas serum — hentikan jika osmolal gap >20 mOsm/kg' },
      { i: '⚠️', t: 'Dapat menyebabkan hipovolemia, hipernatremia, hipokalemia' },
      { i: '⚠️', t: 'Gunakan filter 5 micron — kristal mannitol dapat terbentuk pada suhu rendah' }
    ],
    tips: [
      'Dosis standar: 0,25–1 g/kgBB IV infus 15–30 menit; TIK akut berat: 1–1,5 g/kgBB',
      'Bolus cepat 15–20 menit lebih efektif dari infus lambat untuk menurunkan TIK',
      'Target: ICP <20 mmHg, CPP >60 mmHg; monitor setiap 4–6 jam',
      'Monitor osmolalitas, kreatinin, Na⁺, K⁺, dan output urin serial',
      'Alternatif: NaCl 3% (hipertonik salin) — terutama jika hiponatremia atau osmolalitas sudah tinggi'
    ],
    ref: [
      { t: 'Brain Trauma Foundation Guidelines. Management of Severe TBI 4th Edition.', j: 'Neurosurgery', d: '2017;80(1):6-15' },
      { t: 'Hays AN, et al. Osmotherapy: Use and Limitations.', j: 'Neurocrit Care', d: '2011;14(2):305-13' },
      { t: 'UpToDate: Management of acute severe traumatic brain injury.', j: 'UpToDate', d: '2024' }
    ],
    pop: [
      { g: 'Neonatus', n: 'Sangat jarang digunakan. Jika diperlukan: 0,25 g/kgBB IV, monitor ketat osmolalitas dan keseimbangan cairan. Risiko hipernatremia dan dehidrasi tinggi.' },
      { g: 'Pediatrik', n: 'Dosis 0,25–1 g/kgBB IV bolus 15–30 menit. Efektif untuk TIK akut. Monitor output urin, osmolalitas, dan elektrolit. Batasi dosis kumulatif.' },
      { g: 'Dewasa', n: 'Dosis standar 0,25–1 g/kgBB. Untuk TIK berat: hingga 1,5 g/kgBB. Ulangi tiap 4–6 jam sesuai osmolalitas. Hentikan jika osmolal gap >20.' }
    ]
  },
  {
    id: 'mannitol-10',
    name: 'Mannitol 10%',
    alias: 'Mannitol 100 mg/mL',
    cat: 'osmotik',
    badge: 'Osmotik',
    osm: '~549 mOsm/L',
    img: '/assets/img/cairan/mannitol-10.jpg',
    comp: [
      { l: 'Mannitol', v: '100 g/L' },
      { l: 'Osmolarity', v: '~549 mOsm/L' },
      { l: 'pH', v: '4,5–7,0' },
      { l: 'Kalori', v: '0 kcal/L' }
    ],
    ind: [
      { i: '✅', t: 'Peningkatan TIK ringan–sedang — osmolalitas sudah dekat batas aman' },
      { i: '✅', t: 'Titrasi penurunan TIK setelah fase akut — dosis lebih terkontrol' },
      { i: '✅', t: 'Diuresis osmotik — gagal ginjal akut awal / oliguria prerenal' },
      { i: '✅', t: 'Glaukoma akut pada pasien yang tidak dapat toleransi dosis tinggi' }
    ],
    warn: [
      { i: '🔴', t: 'Kontraindikasi: anuria, gagal ginjal berat, edema paru, dehidrasi berat' },
      { i: '⚠️', t: 'Efek osmotik lebih lemah dari Mannitol 20% — volume lebih besar untuk dosis yang sama' },
      { i: '⚠️', t: 'Monitor osmolalitas serum; hentikan jika osmolal gap >20 mOsm/kg' },
      { i: '⚠️', t: 'Tetap gunakan filter 5 micron untuk pencegahan kristalisasi' }
    ],
    tips: [
      'Dosis: 0,5–2 g/kgBB IV; untuk volume kerja lebih besar dari Mannitol 20%',
      'Pilih Mannitol 10% bila tersedia dan Mannitol 20% habis, atau untuk titrasi dosis lebih tepat',
      'Monitor osmolalitas, elektrolit, dan urine output sama seperti Mannitol 20%'
    ],
    ref: [
      { t: 'Brain Trauma Foundation Guidelines. Management of Severe TBI 4th Edition.', j: 'Neurosurgery', d: '2017;80(1):6-15' },
      { t: 'UpToDate: Management of acute severe traumatic brain injury.', j: 'UpToDate', d: '2024' }
    ],
    pop: [
      { g: 'Neonatus', n: 'Sangat jarang; jika diperlukan 0,25–0,5 g/kgBB IV perlahan. Monitor hipernatremia, hiperglikemia, dan osmolalitas.' },
      { g: 'Pediatrik', n: 'Dosis 0,5–1,5 g/kgBB IV. Volume lebih besar dibanding Mannitol 20% — perhitungkan beban cairan pada pasien pediatri.' },
      { g: 'Dewasa', n: 'Dosis 0,5–2 g/kgBB. Digunakan jika Mannitol 20% tidak tersedia atau untuk titrasi dosis lebih presisi.' }
    ]
  },
  {
    id: 'lipofundin-20',
    name: 'Lipofundin MCT/LCT 20%',
    alias: 'Lipofundin, Intralipid 20%, Smoflipid',
    cat: 'amino',
    badge: 'Lipid',
    osm: '~380 mOsm/L',
    img: '/assets/img/cairan/lipofundin-20.jpg',
    comp: [
      { l: 'MCT (C8–C10)', v: '100 g/L' },
      { l: 'LCT (soya)',   v: '100 g/L' },
      { l: 'Gliserin',     v: '25 g/L' },
      { l: 'Total lemak',  v: '200 g/L' },
      { l: 'Energi',       v: '~1920 kcal/L' }
    ],
    ind: [
      { i: '✅', t: 'Komponen lipid dalam TPN (nutrisi parenteral total)' },
      { i: '✅', t: 'Defisiensi asam lemak esensial pada pasien puasa >2 minggu' },
      { i: '✅', t: 'Sumber energi non-protein pada pasien kritis dengan kebutuhan kalori tinggi' },
      { i: '✅', t: 'TPN pada pasien gangguan toleransi glukosa (hiperglikemia berat)' }
    ],
    warn: [
      { i: '🔴', t: 'Kontraindikasi: hipertrigliseridemia berat (>400 mg/dL), gangguan oksidasi lipid, syok berat' },
      { i: '🔴', t: 'Kecepatan maks 0,15 g/kgBB/jam (MCT/LCT 20%) — infus terlalu cepat → sindrom kelebihan lemak' },
      { i: '⚠️', t: 'Monitor trigliserida serum sebelum dan selama pemberian — target <400 mg/dL' },
      { i: '⚠️', t: 'Hati-hati pada sepsis berat, disfungsi hati, dan ARDS — oksidasi lipid terganggu' }
    ],
    tips: [
      'Mulai dosis rendah 0,5 g/kgBB/hari → tingkatkan bertahap hingga 1–2 g/kgBB/hari',
      'Lipofundin MCT/LCT lebih aman dari pure LCT karena MCT dimetabolisme lebih cepat',
      'Jangan campur dengan elektrolit konsentrasi tinggi (Ca²⁺, Mg²⁺) dalam satu syringe',
      'Gunakan dalam 24 jam setelah dibuka; infus melalui filter 1,2 micron',
      'Smoflipid (mengandung EPA/DHA) tersedia untuk pasien kritis dengan manfaat anti-inflamasi'
    ],
    ref: [
      { t: 'ESPEN Guidelines on clinical nutrition in the ICU.', j: 'Clin Nutr', d: '2019;38(1):48-79' },
      { t: 'Singer P, et al. ESPEN practical and partially revised guideline: Clinical nutrition in the ICU.', j: 'Clin Nutr', d: '2023;42(9):1671-1689' },
      { t: 'Mirtallo J, et al. Safe practices for parenteral nutrition.', j: 'JPEN', d: '2004;28(6):S39-70' }
    ],
    pop: [
      { g: 'Neonatus', n: 'Mulai 0,5–1 g/kgBB/hari, tingkatkan perlahan hingga maks 3 g/kgBB/hari. Gunakan lipid emulsi khusus neonatus jika tersedia (mis. SMOFlipid). Monitor trigliserida ketat.' },
      { g: 'Pediatrik', n: 'Dosis 1–3 g/kgBB/hari. Monitor trigliserida, fungsi hati, dan bilirubin. Hindari pada sepsis berat atau disfungsi hati.' },
      { g: 'Dewasa', n: 'Dosis 1–2 g/kgBB/hari (maks 2,5 g/kgBB/hari). Kecepatan maks 0,15 g/kgBB/jam. Monitor trigliserida setiap 2–3 hari.' }
    ]
  },
  {
    id: 'kabiven',
    name: 'Kabiven Peripheral',
    alias: 'Kabiven, ClinOleic, Smofkabiven, TPN 3-in-1',
    cat: 'amino',
    badge: 'Nutrisi',
    osm: '~750 mOsm/L',
    img: '/assets/img/cairan/kabiven.jpg',
    comp: [
      { l: 'Asam Amino', v: '~34–57 g / kantong' },
      { l: 'Glukosa',    v: '~97–130 g / kantong' },
      { l: 'Lipid',      v: '~57–76 g / kantong' },
      { l: 'Nitrogen',   v: '~4,6–6,6 g / kantong' },
      { l: 'Energi',     v: '~1260–1680 kcal / kantong' }
    ],
    ind: [
      { i: '✅', t: 'TPN via akses vena perifer (Kabiven Peripheral ~750 mOsm/L)' },
      { i: '✅', t: 'TPN via CVC (Kabiven Central ~1800 mOsm/L) — densitas kalori lebih tinggi' },
      { i: '✅', t: 'Malnutrisi sedang–berat yang tidak dapat makan oral/enteral' },
      { i: '✅', t: 'Puasa berkepanjangan (>5–7 hari) atau pasca-operasi mayor' }
    ],
    warn: [
      { i: '🔴', t: 'Refeeding syndrome: mulai perlahan pada pasien malnutrisi berat — monitor K⁺, Mg²⁺, fosfat ketat' },
      { i: '🔴', t: 'Kabiven Central hanya via CVC — osmolalitas ~1800 mOsm/L menyebabkan tromboflebitis via perifer' },
      { i: '⚠️', t: 'Kabiven Peripheral: pantau tanda tromboflebitis vena perifer — ganti akses tiap 72 jam' },
      { i: '⚠️', t: 'Hiperglikemia sering terjadi — monitor GDS; target 140–180 mg/dL pada ICU' }
    ],
    tips: [
      'Hitung kebutuhan kalori lebih dulu: 25–30 kcal/kgBB/hari; protein 1,2–2 g/kgBB/hari',
      'Aktifkan kantong 3-in-1 dengan menghancurkan sekat antar ruang sebelum diinfus',
      'Tambahkan vitamin, mineral, dan trace elements sesuai kebutuhan harian',
      'Monitor GDS, fungsi hati (ALT/AST), trigliserida, dan elektrolit selama TPN',
      'Pertimbangkan enteral dini jika GIT berfungsi — lebih aman dari TPN'
    ],
    ref: [
      { t: 'ESPEN Guidelines on clinical nutrition in the ICU.', j: 'Clin Nutr', d: '2019;38(1):48-79' },
      { t: 'McClave SA, et al. SCCM/ASPEN Guidelines for nutrition support therapy.', j: 'JPEN', d: '2016;40(2):159-211' },
      { t: 'NICE guideline NG22: Nutrition support for adults.', j: 'NICE', d: '2017' }
    ],
    pop: [
      { g: 'Neonatus', n: 'Kabiven tidak direkomendasikan untuk neonatus — gunakan TPN individual yang diformulasikan khusus (dosis asam amino, glukosa, lipid disesuaikan berat lahir dan usia gestasi). Konsultasi farmasi klinis.' },
      { g: 'Pediatrik', n: 'Tersedia formulasi Kabiven Pediatrik di beberapa negara. Di Indonesia, umumnya TPN individual lebih disukai. Jika digunakan, hitung sesuai berat badan dan kebutuhan kalori/nitrogen.' },
      { g: 'Dewasa', n: '1 kantong/hari disesuaikan dengan kebutuhan. Kabiven Peripheral 1440 mL (~1260 kcal) atau 1920 mL (~1680 kcal). Monitor metabolik rutin 2–3× per minggu.' }
    ]
  },
  {
    id: 'nacl-045',
    name: 'NaCl 0,45%',
    alias: 'Half Normal Saline, ½ NS, Hipotonik NaCl',
    cat: 'kristaloid',
    badge: 'Kristaloid',
    osm: '~154 mOsm/L',
    img: '/assets/img/cairan/nacl-045.jpg',
    comp: [
      { l: 'Na⁺', v: '77 mEq/L' },
      { l: 'Cl⁻', v: '77 mEq/L' },
      { l: 'Osmolarity', v: '154 mOsm/L (hipotonik)' },
      { l: 'pH', v: '4,5–7,0' }
    ],
    ind: [
      { i: '✅', t: 'Koreksi hipernatremia — penurunan Na⁺ bertahap (maks 10 mEq/24 jam)' },
      { i: '✅', t: 'Maintenance cairan harian — kebutuhan elektrolit lebih rendah dari NS' },
      { i: '✅', t: 'Hiperosmolar hyperglycemic state (HHS) — fase setelah stabilisasi awal dengan NS' },
      { i: '✅', t: 'DKA fase maintenance setelah koreksi awal dengan cairan isotonik' }
    ],
    warn: [
      { i: '🔴', t: 'BUKAN cairan resusitasi — jangan gunakan untuk syok atau deficit volume akut' },
      { i: '🔴', t: 'Koreksi hipernatremia maks 10 mEq/L per 24 jam — koreksi cepat → edema serebral' },
      { i: '⚠️', t: 'Hipotonik — risiko edema seluler dan hiponatremia jika berlebihan' },
      { i: '⚠️', t: 'Hindari pada pasien berisiko hiponatremia (SIADH, post-op, anak-anak)' }
    ],
    tips: [
      'Maintenance dewasa: 1–1,5 mL/kgBB/jam; anak: 4-2-1 rule atau Holliday-Segar',
      'Koreksi hipernatremia: hitung free water deficit, berikan 50% dalam 24 jam pertama',
      'Pada HHS: ganti ke ½ NS setelah Na terkoreksi dan GDS mulai turun',
      'Tersedia dalam kombinasi dengan KCl (mis. ½ NS + 20 mEq KCl/L untuk maintenance'
    ],
    ref: [
      { t: 'Adrogue HJ, Madias NE. Hypernatremia.', j: 'N Engl J Med', d: '2000;342(20):1493-9' },
      { t: 'Kitabchi AE, et al. Hyperglycemic crises in adult patients with diabetes.', j: 'Diabetes Care', d: '2009;32(7):1335-43' }
    ],
    pop: [
      { g: 'Neonatus', n: 'Sangat jarang digunakan pada neonatus — risiko hiponatremia tinggi. Jika diindikasikan, hanya untuk koreksi hipernatremia dengan pemantauan ketat Na⁺ serum tiap 4–6 jam.' },
      { g: 'Pediatrik', n: 'Untuk koreksi hipernatremia atau maintenance. Hati-hati: studi menunjukkan NaCl 0,45% + 5% dextrose meningkatkan risiko hiponatremia iatrogenik pada anak rawat inap. Pertimbangkan isotonik untuk maintenance.' },
      { g: 'Dewasa', n: 'Indikasi utama: koreksi hipernatremia dan HHS fase lanjut. Maintenance 1–1,5 mL/kgBB/jam. Hindari sebagai cairan utama pada pasien perioperatif atau kritis.' }
    ]
  },
  {
    id: 'na-asetat',
    name: 'Sodium Asetat',
    alias: 'Natrium Asetat, Sodium Acetate',
    cat: 'elektrolit',
    badge: 'Elektrolit',
    osm: 'Konsentrat (2 mEq/mL)',
    img: '/assets/img/cairan/na-asetat.jpg',
    comp: [
      { l: 'Sodium Acetate', v: '2 mEq/mL (vial 20 mEq/10 mL)' },
      { l: 'Na⁺',            v: '2 mEq/mL' },
      { l: 'Asetat (CH₃COO⁻)', v: '2 mEq/mL → HCO₃⁻ setelah metabolisme' },
      { l: 'pH', v: '6,5–8,5' }
    ],
    ind: [
      { i: '✅', t: 'Koreksi asidosis metabolik sebagai sumber bikarbonat ekuivalen (alternatif NaHCO₃)' },
      { i: '✅', t: 'Komponen buffer dalam cairan dialisis (hemodialisis, CRRT)' },
      { i: '✅', t: 'Penambah natrium dengan efek alkalinisasi dalam larutan TPN' },
      { i: '✅', t: 'Asidosis metabolik pada pasien yang tidak toleransi CO₂ tambahan dari NaHCO₃' }
    ],
    warn: [
      { i: '🔴', t: 'HARUS diencerkan sebelum pemberian — TIDAK BOLEH IV langsung dari vial konsentrat' },
      { i: '🔴', t: 'Metabolisme asetat ke bikarbonat memerlukan fungsi hati dan otot yang adekuat — hati-hati pada gagal hati' },
      { i: '⚠️', t: 'Monitor Na⁺ serum, pH darah, dan bikarbonat selama koreksi' },
      { i: '⚠️', t: 'Infus cepat dapat menyebabkan hipernatremia, alkalosis metabolik, dan vasodilatasi' }
    ],
    tips: [
      'Encerkan dalam NS atau D5% sebelum infus; jangan berikan langsung dari ampul',
      '1 mmol asetat menghasilkan 1 mmol HCO₃⁻ setelah metabolisme hepatik',
      'Lebih stabil dari NaHCO₃ dalam larutan TPN — tidak menyebabkan presipitasi kalsium',
      'Pilih NaHCO₃ jika koreksi cepat diperlukan; pilih Na-asetat untuk koreksi bertahap atau dalam TPN'
    ],
    ref: [
      { t: 'Forsythe SM, Schmidt GA. Sodium bicarbonate for the treatment of lactic acidosis.', j: 'Chest', d: '2000;117(1):260-7' },
      { t: 'UpToDate: Bicarbonate therapy in lactic acidosis.', j: 'UpToDate', d: '2024' }
    ],
    pop: [
      { g: 'Neonatus', n: 'Digunakan dalam campuran TPN neonatus sebagai sumber natrium dan buffer. Harus diformulasikan oleh farmasi klinis. Monitor Na⁺ dan pH ketat.' },
      { g: 'Pediatrik', n: 'Komponen TPN atau koreksi asidosis metabolik ringan-sedang. Dosis disesuaikan dengan deficit bikarbonat. Monitor elektrolit dan status asam-basa.' },
      { g: 'Dewasa', n: 'Koreksi asidosis metabolik atau komponen dialisis/TPN. Encerkan sebelum infus. Monitor Na⁺, bikarbonat, dan pH. Hati-hati pada gagal hati.' }
    ]
  },
  {
    id: 'k-fosfat',
    name: 'Kalium Fosfat / Na-Fosfat',
    alias: 'Potassium Phosphate, Sodium Phosphate, K₂HPO₄, KH₂PO₄',
    cat: 'elektrolit',
    badge: 'Elektrolit',
    osm: 'Konsentrat (3 mmol/mL)',
    img: '/assets/img/cairan/k-fosfat.jpg',
    comp: [
      { l: 'K-Fosfat',    v: 'K⁺ 3 mEq/mL + HPO₄²⁻ 3 mmol/mL (vial 15 mL)' },
      { l: 'Na-Fosfat',   v: 'Na⁺ 3 mEq/mL + HPO₄²⁻ 3 mmol/mL (vial 15 mL)' },
      { l: 'pH',          v: '~6,2–7,8' }
    ],
    ind: [
      { i: '✅', t: 'Koreksi hipofosfatemia berat (<1,5 mg/dL) — refeeding syndrome, DKA, malnutrisi' },
      { i: '✅', t: 'TPN jangka panjang — suplementasi fosfat harian' },
      { i: '✅', t: 'Hipofosfatemia pada pasien kritis — sepsis, post-operasi besar, cedera termal' },
      { i: '✅', t: 'Koreksi fosfat pada pasien dengan fosfaturia (mis. hiperparatiroidisme)' }
    ],
    warn: [
      { i: '🔴', t: 'TIDAK BOLEH IV push langsung dari vial konsentrat — HARUS diencerkan terlebih dahulu' },
      { i: '🔴', t: 'JANGAN campur dengan kalsium dalam satu larutan — presipitasi kalsium fosfat' },
      { i: '⚠️', t: 'Risiko hiperfosfatemia → hipokalsemia → tetani dan aritmia jika overdosis' },
      { i: '⚠️', t: 'Monitor fosfat, kalsium, kreatinin, dan kalium serial selama koreksi' }
    ],
    tips: [
      'Hipofosfatemia ringan (2–2,5 mg/dL): suplementasi oral lebih disukai',
      'Hipofosfatemia sedang (1–2 mg/dL): 0,08–0,16 mmol/kgBB IV dalam 4–6 jam',
      'Hipofosfatemia berat (<1 mg/dL): 0,32–0,64 mmol/kgBB IV dalam 8–12 jam',
      'Gunakan K-Fosfat jika pasien juga hipokalemia; Na-Fosfat jika kalium normal/tinggi',
      'Encerkan dalam NS atau D5W — kecepatan infus maks 7 mmol fosfat/jam'
    ],
    ref: [
      { t: 'Gaasbeek A, Meinders AE. Hypophosphatemia: An update on its etiology and treatment.', j: 'Am J Med', d: '2005;118(10):1094-101' },
      { t: 'Strickley RG. Solubilizing excipients in oral and injectable formulations.', j: 'Pharm Res', d: '2004;21(2):201-30' },
      { t: 'ASPEN Board of Directors. Clinical guidelines for the use of parenteral and enteral nutrition.', j: 'JPEN', d: '2009;33(3):255-9' }
    ],
    pop: [
      { g: 'Neonatus', n: 'Fosfat esensial untuk mineralisasi tulang. Kebutuhan 1–2 mmol/kgBB/hari dalam TPN. Rasio Ca:P 1,3–1,7:1 untuk mencegah presipitasi. Konsultasi farmasi klinis untuk formulasi TPN.' },
      { g: 'Pediatrik', n: 'Koreksi hipofosfatemia 0,08–0,32 mmol/kgBB IV tergantung derajat. Monitor Ca²⁺ dan fosfat ketat. Risiko hiperfosfatemia lebih tinggi pada GFR rendah.' },
      { g: 'Dewasa', n: 'Koreksi sesuai derajat hipofosfatemia. Kecepatan maks 7 mmol fosfat/jam. Monitor elektrolit, kalsium, dan kreatinin. Suplementasi oral jika pasien bisa menelan.' }
    ]
  }
];

export const CF_FLUIDS: FluidItem[] = _CF_FLUIDS_RAW.map(f => ({
  ...f,
  packageData: CF_PKG_DATA[f.id!]
})) as FluidItem[];
