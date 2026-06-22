import { useState, useMemo, Dispatch, SetStateAction } from 'react';
import { 
  AlertCircle, 
  Plus, 
  X, 
  Info, 
  Trash2, 
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  GitBranch,
  Search,
  BookOpen
} from 'lucide-react';
import { ICU_DRUGS } from './data';

interface UnifiedInteraction {
  keyA: string;
  keyB: string;
  nameA: string;
  nameB: string;
  severity: 'major' | 'moderate';
  descriptions: string[];
  managements: string[];
  references: string[];
}

const SMART_RULES = [
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

const CATEGORY_TABS = [
  { id: 'all', name: 'Semua', icon: '📋' },
  { id: 'vasoactive', name: 'Presor', icon: '⚡' },
  { id: 'sedatives', name: 'Sedatif', icon: '💤' },
  { id: 'antimicrobials', name: 'Antibiotik', icon: '🦠' },
  { id: 'cardio', name: 'Jantung', icon: '🫀' },
  { id: 'others', name: 'Elektrolit', icon: '🧪' },
];

const classifyDrugCategory = (key: string, drug: any): string => {
  const cats = drug.category || [];
  const cls = (drug.class || "").toLowerCase();
  const sub = (drug.subclass || "").toLowerCase();

  if (
    cats.includes("vasopressor") || 
    cats.includes("inotropik") || 
    sub.includes("vasopressor") || 
    sub.includes("inotropik") || 
    key === "norepinefrin" || 
    key === "epinefrin" || 
    key === "dopamin" || 
    key === "vasopressin" || 
    key === "dobutamin" || 
    key === "milrinon" || 
    key === "levosimendan" || 
    key === "fenilefrin"
  ) {
    return "vasoactive";
  }
  if (
    cats.includes("sedatif") || 
    cats.includes("analgetik") || 
    cats.includes("nmb") || 
    cls.includes("sedatif") || 
    cls.includes("analgesia") || 
    cls.includes("opiat") || 
    cls.includes("pelumpuh") || 
    sub.includes("pelumpuh") || 
    sub.includes("blocker") || 
    cls.includes("anestesi") || 
    key === "propofol" || 
    key === "deksmedetomidin" || 
    key === "midazolam" || 
    key === "ketamin_icu" || 
    key === "tiopental" || 
    key === "fentanil" || 
    key === "morfin" || 
    key === "remifentanil" || 
    key === "parasetamol_iv" || 
    key === "ketorolak" || 
    key === "sisatrakurium" || 
    key === "atrakurium" || 
    key === "rokuronium_icu" || 
    key === "vekuronum" || 
    key === "pankuronum"
  ) {
    return "sedatives";
  }
  if (
    cats.includes("antibiotik") || 
    cats.includes("antifungal") || 
    cats.includes("antiviral") || 
    cats.includes("antimikroba") || 
    cls.includes("antibiotik") || 
    cls.includes("antiviral") || 
    cls.includes("antifungal") || 
    cls.includes("antimikroba") || 
    key === "meropenem" || 
    key === "ceftriakson" || 
    key === "vankomisin" || 
    key === "sefoperazon_sulbaktam" || 
    key === "seftazidim" || 
    key === "gentamisin" || 
    key === "moxifloksasin" || 
    key === "flukonazol" || 
    key === "kaspofungin" || 
    key === "vorikonazol" || 
    key === "oseltamivir" || 
    key === "asiklovir_iv" || 
    key === "gansiklovir"
  ) {
    return "antimicrobials";
  }
  if (
    cats.includes("antihipertensi") || 
    cats.includes("antiaritmia") || 
    cats.includes("kardiovaskular") || 
    cls.includes("antihipertensi") || 
    cls.includes("antiaritmia") || 
    cls.includes("kardiorenal") || 
    key === "amiodarone" || 
    key === "nitroprusid" || 
    key === "nikardipin" || 
    key === "labetolol" || 
    key === "esmolol" || 
    key === "diltiazem"
  ) {
    return "cardio";
  }
  return "others";
};

export default function DrugInteractionChecker({
  selectedDrugs,
  setSelectedDrugs,
}: {
  selectedDrugs: string[];
  setSelectedDrugs: Dispatch<SetStateAction<string[]>>;
}) {
  const [highlightedPair, setHighlightedPair] = useState<string | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<'all' | 'major' | 'moderate' | 'safe'>('all');

  const removeDrug = (key: string) => {
    setSelectedDrugs(prev => prev.filter(d => d !== key));
    setHighlightedPair(null);
  };

  const clearAll = () => {
    setSelectedDrugs([]);
    setHighlightedPair(null);
    setActiveResultTab('all');
  };

  const allDrugKeys = Object.keys(ICU_DRUGS);

  // Helper matching logic for static DB entries
  const matchDrugWithInteractionTarget = (target: string, drug: any) => {
    const normTarget = target.toLowerCase();
    const normName = drug.name.toLowerCase();
    const normClass = (drug.class || "").toLowerCase();
    const normSubclass = (drug.subclass || "").toLowerCase();

    if (normName.includes(normTarget) || normTarget.includes(normName)) return true;
    if (normClass.includes(normTarget) || normSubclass.includes(normTarget)) return true;
    if (drug.brand_id?.some((b: string) => b.toLowerCase().includes(normTarget))) return true;

    // Class wide mappings
    if (normTarget === 'β-blocker' || normTarget === 'beta blocker' || normTarget === 'beta-blocker') {
      return normSubclass.includes('blocker') || normSubclass.includes('bloker') || normClass.includes('blocker') || normClass.includes('bloker');
    }
    return false;
  };

  // Main interaction aggregator
  const interactions = useMemo((): UnifiedInteraction[] => {
    if (selectedDrugs.length < 2) return [];

    const list: UnifiedInteraction[] = [];
    const seenPairs = new Set<string>();

    for (let i = 0; i < selectedDrugs.length; i++) {
      for (let j = i + 1; j < selectedDrugs.length; j++) {
        const keyA = selectedDrugs[i];
        const keyB = selectedDrugs[j];
        const drugA = ICU_DRUGS[keyA];
        const drugB = ICU_DRUGS[keyB];

        const pairId = [keyA, keyB].sort().join('-');
        if (seenPairs.has(pairId)) continue;

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

        // 3. Ad-hoc Adrenergic Receptor Antagonism Check
        const isBetaBlocker = (k: string) => k === 'esmolol' || k === 'labetolol';
        const isBetaAgonist = (k: string) => k === 'dobutamin' || k === 'dopamin' || k === 'epinefrin';
        if ((isBetaBlocker(keyA) && isBetaAgonist(keyB)) || (isBetaBlocker(keyB) && isBetaAgonist(keyA))) {
          severity = 'major';
          descriptions.push("Efek Antagonisme Reseptor Beta-1 Adrenergik Direk.");
          managements.push("Penyekat beta menghambat secara paksa aksi stimulasi jantung (inotropik/kronotropik positif) dari obat dobutamin, dopamin, atau epinefrin. Hindari kombinasi kecuali pada indikasi klinis darurat terstruktur.");
          references.push("Pharmacodynamics of Adrenergic Agonists & Antagonists");
        }

        // 4. Smart global rules checks
        SMART_RULES.forEach(rule => {
          const hasA = rule.keys.includes(keyA);
          const hasB = rule.keys.includes(keyB);
          if (hasA && hasB) {
            if (rule.severity === 'major') {
              severity = 'major';
            } else if (severity !== 'major') {
              severity = 'moderate';
            }
            descriptions.push(rule.effect);
            managements.push(rule.management);
            references.push(rule.reference);
          }
        });

        if (severity) {
          seenPairs.add(pairId);
          list.push({
            keyA,
            keyB,
            nameA: drugA.name,
            nameB: drugB.name,
            severity,
            descriptions: Array.from(new Set(descriptions)),
            managements: Array.from(new Set(managements)),
            references: Array.from(new Set(references)),
          });
        }
      }
    }

    return list;
  }, [selectedDrugs]);

  // Statistics counters
  const counters = useMemo(() => {
    if (selectedDrugs.length < 2) return { major: 0, moderate: 0, safe: 0 };
    let major = 0;
    let moderate = 0;

    interactions.forEach(ix => {
      if (ix.severity === 'major') major++;
      else if (ix.severity === 'moderate') moderate++;
    });

    const totalPossiblePairs = (selectedDrugs.length * (selectedDrugs.length - 1)) / 2;
    const safe = Math.max(0, totalPossiblePairs - (major + moderate));

    return { major, moderate, safe };
  }, [selectedDrugs, interactions]);

  // Dynamic safe pairs calculation
  const safePairs = useMemo(() => {
    if (selectedDrugs.length < 2) return [];
    const list: { keyA: string; keyB: string; nameA: string; nameB: string }[] = [];
    const seenPairs = new Set<string>();

    for (let i = 0; i < selectedDrugs.length; i++) {
      for (let j = i + 1; j < selectedDrugs.length; j++) {
        const keyA = selectedDrugs[i];
        const keyB = selectedDrugs[j];
        
        const pairId = [keyA, keyB].sort().join('-');
        if (seenPairs.has(pairId)) continue;

        const hasInteraction = interactions.some(ix => 
          (ix.keyA === keyA && ix.keyB === keyB) || (ix.keyA === keyB && ix.keyB === keyA)
        );

        if (!hasInteraction) {
          seenPairs.add(pairId);
          list.push({
            keyA,
            keyB,
            nameA: ICU_DRUGS[keyA].name,
            nameB: ICU_DRUGS[keyB].name,
          });
        }
      }
    }
    return list;
  }, [selectedDrugs, interactions]);

  // Fast matrix lookup helper
  const getPairInteraction = (key1: string, key2: string) => {
    if (key1 === key2) return 'diagonal';
    const match = interactions.find(ix => 
      (ix.keyA === key1 && ix.keyB === key2) || (ix.keyA === key2 && ix.keyB === key1)
    );
    return match ? match.severity : 'none';
  };

  return (
    <div className="mt-8 border border-border bg-card rounded-2xl p-5 shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Interactive Drug-Drug Interaction Checker</h2>
            <p className="text-[11px] text-muted-foreground">
              Uji sinergi, bahaya, dan kompatibilitas polifarmasi klinis secara simultan (Maks 8 obat)
            </p>
          </div>
        </div>
        {selectedDrugs.length > 0 && (
          <button 
            onClick={clearAll} 
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 border border-destructive/20 rounded-lg font-medium transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" /> Hapus Semua
          </button>
        )}
      </div>

      {selectedDrugs.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5 pb-4 border-b border-border/40 items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
            Daftar Obat Terpilih ({selectedDrugs.length}/8):
          </span>
          {selectedDrugs.map(key => (
            <span 
              key={key} 
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-primary/5 hover:bg-primary/10 border border-border rounded-xl transition-colors text-foreground"
            >
              {ICU_DRUGS[key]?.name || key}
              <button 
                onClick={() => removeDrug(key)}
                className="hover:bg-red-500/10 hover:text-red-500 p-0.5 rounded cursor-pointer transition-colors"
                title={`Hapus ${ICU_DRUGS[key]?.name}`}
              >
                <X className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="w-full">
        {selectedDrugs.length < 2 ? (
          <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-border/60 rounded-2xl min-h-[220px]">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <GitBranch className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-foreground mb-1">Dibutuhkan Minimal 2 Jenis Obat</h3>
            <p className="text-[11px] text-muted-foreground max-w-sm leading-relaxed mb-4">
              Silakan pilih obat pada tab <strong className="text-primary font-bold">Obat</strong>, atau klik obat-obatan ICU populer di bawah ini untuk menguji interaksi secara cepat:
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 max-w-lg">
              {['norepinefrin', 'dobutamin', 'propofol', 'fentanil', 'midazolam', 'esmolol', 'labetolol', 'amiodaron', 'heparin', 'insulin_infus'].map(key => {
                const drug = ICU_DRUGS[key];
                if (!drug) return null;
                const isSelected = selectedDrugs.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedDrugs(prev => prev.filter(k => k !== key));
                      } else if (selectedDrugs.length < 8) {
                        setSelectedDrugs(prev => [...prev, key]);
                      }
                    }}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-background hover:bg-muted text-muted-foreground border-border/80'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {drug.name}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Counter Widgets Row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-red-500/5 border border-red-500/15 p-2 rounded-xl text-center">
                <div className="text-xl font-black text-red-500 leading-none">{counters.major}</div>
                <div className="text-[9px] font-bold text-red-600 dark:text-red-400/80 uppercase tracking-wider mt-1">🔴 Bahaya Major</div>
              </div>
              <div className="bg-amber-500/5 border border-amber-500/15 p-2 rounded-xl text-center">
                <div className="text-xl font-black text-amber-500 leading-none">{counters.moderate}</div>
                <div className="text-[9px] font-bold text-amber-600 dark:text-amber-400/80 uppercase tracking-wider mt-1">🟡 Moderate (Monitor)</div>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/15 p-2 rounded-xl text-center">
                <div className="text-xl font-black text-emerald-500 leading-none">{counters.safe}</div>
                <div className="text-[9px] font-bold text-emerald-600/80 uppercase tracking-wider mt-1">🟢 Pasangan Aman</div>
              </div>
            </div>

            {/* Co-prescription Matrix table */}
            <div className="border border-border rounded-xl p-3 bg-muted/10 overflow-hidden">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/40">
                <span className="text-[10px] font-black uppercase tracking-wider text-foreground">Matriks Kompatibilitas Polifarmasi</span>
                {highlightedPair && (
                  <button 
                    onClick={() => setHighlightedPair(null)}
                    className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md hover:bg-primary/20 transition-all cursor-pointer"
                  >
                    Lihat Semua
                  </button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[320px]">
                  <thead>
                    <tr>
                      <th className="p-1.5 text-[9px] font-bold text-muted-foreground border-b border-border/30 w-16 truncate">Obat</th>
                      {selectedDrugs.map(key => (
                        <th key={key} className="p-1.5 text-[9px] font-bold text-muted-foreground text-center border-b border-border/30 truncate" title={ICU_DRUGS[key].name}>
                          {ICU_DRUGS[key].name.slice(0, 5)}..
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDrugs.map((rowKey, rIdx) => (
                      <tr key={rowKey} className="hover:bg-muted/30">
                        <td className="p-1.5 text-[9px] font-bold text-foreground border-r border-border/30 bg-muted/20 truncate" title={ICU_DRUGS[rowKey].name}>
                          {ICU_DRUGS[rowKey].name}
                        </td>
                        {selectedDrugs.map((colKey, cIdx) => {
                          const result = getPairInteraction(rowKey, colKey);
                          const pairId = [rowKey, colKey].sort().join('-');
                          const isSelected = highlightedPair === pairId;

                          if (result === 'diagonal') {
                            return <td key={colKey} className="p-1 text-center bg-muted/30 text-muted-foreground text-[8px] font-mono select-none border-b border-r border-border/20">-</td>;
                          }

                          let dotColor = "bg-muted-foreground/30";
                          let cellBg = "bg-transparent";
                          let hoverTitle = "Tidak ada interaksi mayor/sedang yang tercatat (Pasangan Aman)";

                          if (result === 'major') {
                            dotColor = "bg-red-500 animate-pulse";
                            cellBg = isSelected ? "bg-red-500/10" : "hover:bg-red-500/5";
                            hoverTitle = "⚡ BAHAYA MAJOR! Klik untuk lihat detail.";
                          } else if (result === 'moderate') {
                            dotColor = "bg-amber-500";
                            cellBg = isSelected ? "bg-amber-500/10" : "hover:bg-amber-500/5";
                            hoverTitle = "⚠️ Risiko Moderate. Klik untuk lihat detail.";
                          } else {
                            cellBg = isSelected ? "bg-emerald-500/10" : "hover:bg-emerald-500/5";
                          }

                          return (
                            <td 
                              key={colKey} 
                              onClick={() => {
                                if (result === 'diagonal') return;
                                const nextPairId = isSelected ? null : pairId;
                                setHighlightedPair(nextPairId);
                                if (nextPairId) {
                                  if (result === 'major') {
                                    setActiveResultTab('major');
                                  } else if (result === 'moderate') {
                                    setActiveResultTab('moderate');
                                  } else {
                                    setActiveResultTab('safe');
                                  }
                                }
                              }}
                              className={`p-1 text-center border-b border-r border-border/20 align-middle cursor-pointer transition-colors ${cellBg}`}
                              title={hoverTitle}
                            >
                              {result !== 'none' ? (
                                <span className={`inline-block w-2.5 h-2.5 rounded-full ${dotColor}`}></span>
                              ) : (
                                <span className={`inline-block w-1.5 h-1.5 rounded-full bg-emerald-500/40 ${isSelected ? 'scale-125 bg-emerald-500' : ''}`}></span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactions Card Results Section */}
      {selectedDrugs.length >= 2 && (
        <div className="mt-5 border-t border-border/50 pt-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Hasil Analisis & Keputusan Klinis
            </h3>
            {highlightedPair && (
              <button 
                onClick={() => setHighlightedPair(null)}
                className="text-[10px] font-bold text-destructive hover:underline cursor-pointer self-start md:self-auto"
              >
                Hapus Filter Matriks (Melihat Semua)
              </button>
            )}
          </div>

          {/* Dynamic Tabs Navigation Bar */}
          <div className="flex gap-1 overflow-x-auto pb-1.5 border-b border-border/50 mb-4 scrollbar-none">
            <button
              onClick={() => setActiveResultTab('all')}
              className={`flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border cursor-pointer ${
                activeResultTab === 'all'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-background hover:bg-muted/70 text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              <span>Semua Interaksi</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold ${
                activeResultTab === 'all' ? 'bg-white/20 text-white' : 'bg-muted-foreground/10 text-muted-foreground'
              }`}>
                {counters.major + counters.moderate}
              </span>
            </button>

            <button
              onClick={() => setActiveResultTab('major')}
              className={`flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border cursor-pointer ${
                activeResultTab === 'major'
                  ? 'bg-red-500 text-white border-red-500 shadow-sm'
                  : 'bg-background hover:bg-muted/70 text-red-500 border-border hover:text-red-700 dark:text-red-300'
              }`}
            >
              <span>🔴 Major (Bahaya)</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold ${
                activeResultTab === 'major' ? 'bg-white/20 text-white' : 'bg-red-500/10 text-red-500'
              }`}>
                {counters.major}
              </span>
            </button>

            <button
              onClick={() => setActiveResultTab('moderate')}
              className={`flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border cursor-pointer ${
                activeResultTab === 'moderate'
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                  : 'bg-background hover:bg-muted/70 text-amber-500 border-border hover:text-amber-700 dark:text-amber-300'
              }`}
            >
              <span>🟡 Moderate (Monitor)</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold ${
                activeResultTab === 'moderate' ? 'bg-white/20 text-white' : 'bg-amber-500/10 text-amber-500'
              }`}>
                {counters.moderate}
              </span>
            </button>

            <button
              onClick={() => setActiveResultTab('safe')}
              className={`flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border cursor-pointer ${
                activeResultTab === 'safe'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-background hover:bg-muted/70 text-emerald-600 border-border hover:text-emerald-700'
              }`}
            >
              <span>🟢 Pasangan Aman</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold ${
                activeResultTab === 'safe' ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-600'
              }`}>
                {safePairs.length}
              </span>
            </button>
          </div>

          {/* Tab Contents */}
          {(() => {
            if (activeResultTab === 'all') {
              const list = interactions.filter(ix => !highlightedPair || [ix.keyA, ix.keyB].sort().join('-') === highlightedPair);
              if (list.length === 0) {
                return (
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold text-emerald-700 block mb-0.5">KOMPATIBILITAS SEHAT (TIDAK ADA BAHAYA UTAMA TERKAJI)</span>
                      <span className="text-[11px] text-emerald-600/90 leading-relaxed block">
                        Tidak ada interaksi patofisiologis mayor atau sedang yang tercatat di antara obat terpilih dalam database klinis kami. 
                        Meskipun demikian, selalu pantau tanda vital, laju infus, dan fungsi ginjal/hati pasien secara dinamis di bawah supervisi medis langsung.
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {list.map((ix, i) => (
                    <InteractionCard key={i} ix={ix} isHighlighted={highlightedPair === [ix.keyA, ix.keyB].sort().join('-')} />
                  ))}
                </div>
              );
            }

            if (activeResultTab === 'major') {
              const list = interactions.filter(ix => ix.severity === 'major' && (!highlightedPair || [ix.keyA, ix.keyB].sort().join('-') === highlightedPair));
              if (list.length === 0) {
                return (
                  <div className="p-5 border border-dashed border-border/60 rounded-2xl bg-muted/5 flex flex-col items-center justify-center text-center min-h-[140px]">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                    <h4 className="text-xs font-bold text-foreground">Bebas Interaksi Major</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5 max-w-sm">
                      Kombinasi obat yang dipilih tidak memicu peringatan interaksi major yang mengancam nyawa.
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {list.map((ix, i) => (
                    <InteractionCard key={i} ix={ix} isHighlighted={highlightedPair === [ix.keyA, ix.keyB].sort().join('-')} />
                  ))}
                </div>
              );
            }

            if (activeResultTab === 'moderate') {
              const list = interactions.filter(ix => ix.severity === 'moderate' && (!highlightedPair || [ix.keyA, ix.keyB].sort().join('-') === highlightedPair));
              if (list.length === 0) {
                return (
                  <div className="p-5 border border-dashed border-border/60 rounded-2xl bg-muted/5 flex flex-col items-center justify-center text-center min-h-[140px]">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                    <h4 className="text-xs font-bold text-foreground">Bebas Interaksi Moderate</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5 max-w-sm">
                      Kombinasi obat yang terpilih bebas dari interaksi dengan intensitas moderat (monitor sedang).
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {list.map((ix, i) => (
                    <InteractionCard key={i} ix={ix} isHighlighted={highlightedPair === [ix.keyA, ix.keyB].sort().join('-')} />
                  ))}
                </div>
              );
            }

            if (activeResultTab === 'safe') {
              const filterId = highlightedPair;
              const list = safePairs.filter(pair => !filterId || [pair.keyA, pair.keyB].sort().join('-') === filterId);
              if (list.length === 0) {
                return (
                  <div className="p-5 border border-dashed border-border/60 rounded-2xl bg-muted/5 flex flex-col items-center justify-center text-center min-h-[140px]">
                    <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
                    <h4 className="text-xs font-bold text-foreground">Tidak Ada Pasangan Bebas Risiko</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5 max-w-sm">
                      Setiap pasangan obat terpilih terdeteksi memiliki interaksi klinis mayor atau sedang yang membutuhkan penanganan medis spesifik.
                    </p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {list.map((pair, i) => (
                    <div 
                      key={i} 
                      className={`p-4 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01] rounded-2xl border transition-all ${
                        highlightedPair === [pair.keyA, pair.keyB].sort().join('-')
                          ? 'ring-2 ring-emerald-500 border-emerald-500/40 bg-emerald-500/5'
                          : 'border-emerald-500/15 hover:border-emerald-500/30'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="font-bold text-[13px] text-foreground">
                            {pair.nameA} + {pair.nameB}
                          </span>
                        </div>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                          AMAN
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Kompatibilitas terapeutis dinilai aman bersama. Tidak terdeteksi adanya interaksi mayor atau sedang yang signifikan dalam basis pengetahuan ICU kami. Selalu perhatikan respons hemodinamik pasien secara individu.
                      </p>
                    </div>
                  ))}
                </div>
              );
            }

            return null;
          })()}

          {highlightedPair && (
            <div className="text-center mt-4">
              <button 
                onClick={() => setHighlightedPair(null)} 
                className="text-xs text-primary font-bold hover:underline cursor-pointer"
              >
                Tampilkan seluruh data pada tab saat ini →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Extracted Sub-component for code modularity and clean readability
function InteractionCard({ ix, isHighlighted }: { ix: UnifiedInteraction; isHighlighted: boolean; key?: any }) {
  return (
    <div 
      className={`p-4 rounded-xl border transition-all ${
        isHighlighted ? 'ring-2 ring-primary bg-primary/5' : 'bg-card'
      } ${
        ix.severity === 'major' 
          ? 'border-l-4 border-l-red-500 border-red-500/20' 
          : 'border-l-4 border-l-amber-500 border-amber-500/20'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-base shrink-0 ${ix.severity === 'major' ? 'text-red-500' : 'text-amber-500'}`}>⚡</span>
          <span className="font-bold text-[13px] text-foreground">
            {ix.nameA} + {ix.nameB}
          </span>
        </div>
        <span className={`text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full text-white self-start ${
          ix.severity === 'major' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
        }`}>
          {ix.severity === 'major' ? '🔴 DANGER (MAJOR)' : '🟡 MONITOR (MODERATE)'}
        </span>
      </div>

      {/* Descriptions */}
      <div className="space-y-1.5 text-xs text-muted-foreground leading-relaxed pl-1 md:pl-6 max-w-4xl">
        {ix.descriptions.map((desc, idx) => (
          <p key={idx}>{desc}</p>
        ))}
      </div>

      {/* Actionable managements block */}
      {ix.managements.length > 0 && (
        <div className="mt-3 md:ml-6 p-3 bg-muted/40 rounded-lg border border-border/50 text-[11px] leading-relaxed text-foreground">
          <strong className="text-primary font-bold block mb-1">📝 REKOMENDASI MANAJEMEN KLINIS:</strong>
          <ul className="list-disc pl-4 space-y-1">
            {ix.managements.map((mgmt, idx) => (
              <li key={idx}>{mgmt}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Scientific Evidence references */}
      {ix.references.length > 0 && (
        <div className="mt-2 md:ml-6 flex items-center gap-1.5 text-[9px] text-muted-foreground">
          <span className="font-mono bg-muted/60 px-1 py-0.5 rounded font-bold">Ref:</span>
          <span className="italic">{ix.references.join(', ')}</span>
        </div>
      )}
    </div>
  );
}
