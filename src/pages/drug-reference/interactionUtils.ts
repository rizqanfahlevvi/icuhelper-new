import { ICU_DRUGS } from './data';

export interface UnifiedInteraction {
  keyA: string;
  keyB: string;
  nameA: string;
  nameB: string;
  severity: 'major' | 'moderate';
  descriptions: string[];
  managements: string[];
  references: string[];
}

export const SMART_RULES = [
  {
    id: 'qt_prolongation',
    keys: ['amiodarone', 'moxifloksasin', 'ondansetron', 'flukonazol', 'vorikonazol', 'fentanil'],
    severity: 'major' as const,
    name: 'Sinergi Perpanjangan Interval QTc (Risiko Torsades de Pointes)',
    effect: 'Penggunaan kombinasi obat yang memperpanjang interval QT secara bersamaan dapat menyebabkan akumulasi efek pada repolarisasi ventrikel, sangat meningkatkan risiko aritmia ventrikel fatal (Torsades de Pointes).',
    management: 'Lakukan pemeriksaan EKG 12-lead berkala untuk mengukur interval QTc. Hindari kombinasi jika QTc awal > 470 ms (pria) atau > 485 ms (wanita), atau jika melampaui 500 ms selama terapi. Pertahankan kadar Kalium serum ≥ 4.0 mEq/L dan Magnesium ≥ 2.0 mg/dL.',
    reference: 'AHA/ACC Scientific Statement on Drug-Induced Arrhythmia & Sanford Guide 2024'
  },
  {
    id: 'bradyarrhythmia',
    keys: ['diltiazem', 'esmolol', 'labetolol', 'amiodarone'],
    severity: 'major' as const,
    name: 'Sinergi Depresi Konduksi Nodus SA/AV (Bradikardia Akut)',
    effect: 'Kombinasi obat penyekat beta (esmolol, labetalol), pemblok kanal kalsium non-dihidropiridin (diltiazem), atau amiodaron menghambat konduksi dan otomatisitas jantung secara aditif.',
    management: 'Risiko bradikardia berat yang mengancam nyawa, AV block derajat tinggi, dan kolaps sirkulasi. Monitor denyut jantung dan tekanan darah secara kontinu di IGD/ICU. Siapkan Atropin IV, Dopamin, atau transcutaneous pacing standby.',
    reference: 'Guidelines for Bradycardia Management'
  },
  {
    id: 'nephrotoxicity',
    keys: ['vankomisin', 'gentamisin', 'furosemid'],
    severity: 'major' as const,
    name: 'Sinergisme Toksisitas Ginjal (Cidera Ginjal Akut/AKI)',
    effect: 'Vankomisin plus Gentamisin meningkatkan secara multiplikatif laju destruksi tubulus ginjal proksimal, diperparah oleh dehidrasi seluler tubuler akibat obat diuretik kuat Furosemid.',
    management: 'Hindari kombinasi ini kecuali tidak ada opsi terapetik lain. Pantau pengeluaran urin harian, kreatinin serum harian, dan lakukan Therapeutic Drug Monitoring (TDM) untuk kadar trough obat. Pertahankan status hidrasi yang adekuat.',
    reference: 'KDIGO Clinical Practice Guideline for Acute Kidney Injury'
  },
  {
    id: 'sedation_synergy',
    keys: ['midazolam', 'propofol', 'fentanil', 'morfin', 'remifentanil', 'deksmedetomidin', 'ketamin_icu'],
    severity: 'moderate' as const,
    name: 'Over-sedasi Sinergis & Risiko Depresi Pernapasan',
    effect: 'Kombinasi beberapa agen sedatif atau opioid memicu depresi sinergis berlebih pada sistem saraf pusat (SSP) dan pusat respirasi di medula.',
    management: 'Gunakan protokol sedasi terpandu (skor target RASS -2 s/d 0). Monitor laju napas, SpO₂ kontinu, dan pertimbangkan kapnografi jika pasien tidak menggunakan ventilator mekanis.',
    reference: 'SCCM PADIS Guideline 2018'
  },
  {
    id: 'hyperkalemia',
    keys: ['kcl_konsentrat', 'spironolakton'],
    severity: 'major' as const,
    name: 'Penyimpanan Kalium Ekstrem (Hiperkalemia Mengancam Jiwa)',
    effect: 'Suplementasi Kalium pekat secara IV ketika pasien mengonsumsi antagonis aldosteron (Spironolakton) membatasi sekresi kalium secara ekstrem di tubulus kolektivus, memobilisasi kadar kalium ke zona aritmia fatal.',
    management: 'Kontraindikasi relatif. Hanya berikan suplementasi jika kalium serum terbukti < 3.0 mEq/L. Periksa kadar elektrolit harian atau tiap 6 jam saat infus berjalan, dan pasang monitor jantung untuk menilai tanda hiperkalemia.',
    reference: 'ESC / AHA Guidelines on Acute Hyperkalemia Management'
  },
  {
    id: 'extravasation_risk',
    keys: ['norepinefrin', 'epinefrin', 'dopamin', 'kcl_konsentrat', 'nacl_3pct'],
    severity: 'major' as const,
    name: 'Ancaman Tromboflebitis Berat dan Nekrosis Ekstravasasi',
    effect: 'Kombinasi infus vasoaktif vasopressor pekat dengan larutan elektrolit hipertonis iitator vena dalam jalur vena perifer yang sama melipatgandakan risiko sklerosis pembuluh darah dan nekrosis jaringan.',
    management: 'Sangat direkomendasikan mengalirkan cairan/obat ini melalui kateter vena sentral (CVC) atau lumen CVC yang berbeda. Jika terpaksa di perifer, pasang pada vena besar anggota gerak atas, inspeksi kepatenan kanula tiap jam, dan siapkan Fentolamin injeksi.',
    reference: 'INS Infusion Therapy Standards of Practice 2021'
  },
  {
    id: 'bleeding_risk_nsaid',
    keys: ['heparin_ufh', 'ketorolak'],
    severity: 'major' as const,
    name: 'Risiko Perdarahan Internal dan Mukosa Hebat',
    effect: 'NSAID Ketorolak mendepresi fungsi fungsional aggregasi keping darah, sementara Heparin menarget pembentukan fibrin koagulasi. Kombinasi meningkatkan perdarahan sistemik secara tajam.',
    management: 'Kontraindikasi relatif hebat. Hindari pemberian Ketorolak pada pasien dengan infus Heparin terapeutik. Pilih Parasetamol (Acetaminophen) IV untuk antipiretik atau kontrol nyeri sedang di ICU/IGD.',
    reference: 'CHEST Guideline on Antithrombotic Therapy'
  }
];

export const matchDrugWithInteractionTarget = (target: string, drug: any) => {
  if (!drug) return false;
  const normTarget = target.toLowerCase();
  const normName = (drug.name || "").toLowerCase();
  const normClass = (drug.class || "").toLowerCase();
  const normSubclass = (drug.subclass || "").toLowerCase();

  if (normName.includes(normTarget) || normTarget.includes(normName)) return true;
  if (normClass.includes(normTarget) || normSubclass.includes(normTarget)) return true;
  if (drug.brand_id?.some((b: string) => b.toLowerCase().includes(normTarget))) return true;

  if (normTarget === 'β-blocker' || normTarget === 'beta blocker' || normTarget === 'beta-blocker') {
    return normSubclass.includes('blocker') || normSubclass.includes('bloker') || normClass.includes('blocker') || normClass.includes('bloker');
  }
  return false;
};

export const checkPairInteraction = (keyA: string, keyB: string): UnifiedInteraction | null => {
  const drugA = ICU_DRUGS[keyA];
  const drugB = ICU_DRUGS[keyB];
  
  if (!drugA || !drugB) return null;

  let severity: 'major' | 'moderate' | null = null;
  const descriptions: string[] = [];
  const managements: string[] = [];
  const references: string[] = [];

  // 1. Static interactions from drug A -> drug B
  if (drugA.interactions?.major) {
    drugA.interactions.major.forEach((ix: any) => {
      const targetName = typeof ix === 'string' ? ix : ix.drug;
      const targetEffect = typeof ix === 'string' ? 'Interaksi mayor' : ix.effect;
      const targetMgmt = typeof ix === 'string' ? undefined : ix.management;
      if (targetName && matchDrugWithInteractionTarget(targetName, drugB)) {
        severity = 'major';
        descriptions.push(targetEffect || 'Interaksi major');
        if (targetMgmt) managements.push(targetMgmt);
      }
    });
  }
  if (drugA.interactions?.moderate) {
    drugA.interactions.moderate.forEach((ix: any) => {
      const targetName = typeof ix === 'string' ? ix : ix.drug;
      const targetEffect = typeof ix === 'string' ? 'Interaksi moderate' : ix.effect;
      const targetMgmt = typeof ix === 'string' ? undefined : ix.management;
      if (targetName && matchDrugWithInteractionTarget(targetName, drugB)) {
        if (severity !== 'major') severity = 'moderate';
        descriptions.push(targetEffect || 'Interaksi moderate');
        if (targetMgmt) managements.push(targetMgmt);
      }
    });
  }

  // 2. Static interactions from drug B -> drug A
  if (drugB.interactions?.major) {
    drugB.interactions.major.forEach((ix: any) => {
      const targetName = typeof ix === 'string' ? ix : ix.drug;
      const targetEffect = typeof ix === 'string' ? 'Interaksi mayor' : ix.effect;
      const targetMgmt = typeof ix === 'string' ? undefined : ix.management;
      if (targetName && matchDrugWithInteractionTarget(targetName, drugA)) {
        severity = 'major';
        descriptions.push(targetEffect || 'Interaksi major');
        if (targetMgmt) managements.push(targetMgmt);
      }
    });
  }
  if (drugB.interactions?.moderate) {
    drugB.interactions.moderate.forEach((ix: any) => {
      const targetName = typeof ix === 'string' ? ix : ix.drug;
      const targetEffect = typeof ix === 'string' ? 'Interaksi moderate' : ix.effect;
      const targetMgmt = typeof ix === 'string' ? undefined : ix.management;
      if (targetName && matchDrugWithInteractionTarget(targetName, drugA)) {
        if (severity !== 'major') severity = 'moderate';
        descriptions.push(targetEffect || 'Interaksi moderate');
        if (targetMgmt) managements.push(targetMgmt);
      }
    });
  }

  // Ad-hoc Adrenergic Receptor Antagonism Check
  const isBetaBlocker = (k: string) => k === 'esmolol' || k === 'labetolol';
  const isBetaAgonist = (k: string) => k === 'dobutamin' || k === 'dopamin' || k === 'epinefrin';
  if ((isBetaBlocker(keyA) && isBetaAgonist(keyB)) || (isBetaBlocker(keyB) && isBetaAgonist(keyA))) {
    severity = 'major';
    descriptions.push("Efek Antagonisme Reseptor Beta-1 Adrenergik Direk.");
    managements.push("Penyekat beta menghambat secara paksa aksi stimulasi jantung (inotropik/kronotropik positif) dari obat dobutamin, dopamin, atau epinefrin. Hindari kombinasi kecuali pada indikasi klinis darurat terstruktur.");
    references.push("Pharmacodynamics of Adrenergic Agonists & Antagonists");
  }

  // 3. SMART Rules (Group Synergy)
  SMART_RULES.forEach(rule => {
    if (rule.keys.includes(keyA) && rule.keys.includes(keyB)) {
      if (rule.severity === 'major') severity = 'major';
      else if (severity !== 'major') severity = 'moderate';
      descriptions.push(`[Sinergi SMART] ${rule.name}: ${rule.effect}`);
      managements.push(rule.management);
      references.push(rule.reference);
    }
  });

  if (severity) {
    return {
      keyA,
      keyB,
      nameA: drugA.name,
      nameB: drugB.name,
      severity: severity as 'major' | 'moderate',
      descriptions: Array.from(new Set(descriptions)),
      managements: Array.from(new Set(managements)),
      references: Array.from(new Set(references))
    };
  }

  return null;
};
