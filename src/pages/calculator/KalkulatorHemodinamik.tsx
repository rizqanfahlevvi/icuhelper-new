import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Plus, X, Info, AlertTriangle, ShieldAlert, ExternalLink } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { SaveToHistoryButton } from '../../components/ui/SaveToHistoryButton';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';
import {
  HEMODYNAMIC_DRUGS,
  HemodynamicDrug,
  ReceptorActivity,
  RECEPTOR_ACTIVITY_SCALE,
  RECEPTOR_ACTIVITY_LABEL,
  getDrugById,
  getReceptorProfileForDose,
} from '../../data/hemodynamicDrugs';

interface ActiveDrug {
  id: string;
  dose: number;
}

type NeeFormula = 'goradia' | 'kotani';
type FlagLevel = 'info' | 'perhatian' | 'peringatan';

interface ClinicalFlag {
  level: FlagLevel;
  text: string;
  citationIds: string[];
}

const CATEGORY_BADGE: Record<HemodynamicDrug['category'], { label: string; className: string }> = {
  vasopressor: { label: 'Vasopresor', className: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  inotrope: { label: 'Inotropik', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  vaso_inotrope: { label: 'Vaso-Inotropik', className: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
  non_adrenergic_vasopressor: { label: 'Non-Katekolamin', className: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
};

const FLAG_STYLE: Record<FlagLevel, { wrap: string; icon: string; label: string }> = {
  info: { wrap: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300', icon: 'text-blue-500', label: 'INFO' },
  perhatian: { wrap: 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300', icon: 'text-amber-500', label: 'PERHATIAN' },
  peringatan: { wrap: 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300', icon: 'text-red-500', label: 'PERINGATAN' },
};

const CITATION_TEXT: Record<string, string> = {
  ssc2026: 'Prescott HC et al. SSC Guidelines 2026. ICM 2026.',
  debacker2010: 'De Backer D et al. NEJM 2010;362:779.',
  goradia2021: 'Goradia S et al. J Crit Care 2021;61:233.',
  kotani2023: 'Kotani Y et al. Crit Care 2023;27:29.',
  russell2008vasst: 'Russell JA et al. (VASST) NEJM 2008;358:877.',
  gordon2016vanish: 'Gordon AC et al. (VANISH) JAMA 2016;316:509.',
  statpearls_inotropes: 'Jain A et al. Inotropes and Vasopressors. StatPearls 2024.',
  vincent2013: 'Vincent JL, De Backer D. Circulatory shock. NEJM 2013;369:1726.',
  kapur2019: 'Baran DA et al. SCAI Cardiogenic Shock Classification. 2019.',
  monnet2016: 'Monnet X et al. ICM 2016;42:1935.',
  ssc2021: 'Evans L et al. SSC Guidelines 2021. ICM 2021;47:1181.',
};

function calculateNEE(activeDrugs: ActiveDrug[], formula: NeeFormula): { score: number; excludedDrugs: string[] } {
  let score = 0;
  const excludedDrugs: string[] = [];

  activeDrugs.forEach((ad) => {
    const drug = getDrugById(ad.id);
    if (!drug) return;
    const factor = formula === 'goradia' ? drug.neeConversionFactor.goradia2021 : drug.neeConversionFactor.kotani2023;
    if (factor === null || factor === undefined) {
      excludedDrugs.push(drug.nameId);
      return;
    }
    score += ad.dose * factor;
  });

  return { score, excludedDrugs };
}

function getNeeStatus(score: number): { level: 'normal' | 'warning' | 'danger'; label: string; desc: string; className: string } {
  if (score > 0.5) {
    return {
      level: 'danger',
      label: 'Syok Vasoplegik Refrakter',
      desc: 'Ambang ini secara konsisten berkaitan dengan mortalitas tinggi di literatur. Pertimbangkan re-evaluasi diagnosis, kortikosteroid dosis stres (bila sepsis), dan diskusi dengan konsulen/intensivist.',
      className: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400',
    };
  }
  if (score >= 0.25) {
    return {
      level: 'warning',
      label: 'Dosis Tinggi',
      desc: 'Pertimbangkan evaluasi ulang sumber syok, adekuasi volume, dan indikasi penambahan agen kedua sesuai kelas obat yang sudah dipakai.',
      className: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400',
    };
  }
  return {
    level: 'normal',
    label: 'Dosis Vasopresor Standar',
    desc: 'Skor NEE masih dalam rentang dosis vasopresor standar.',
    className: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400',
  };
}

function evaluateHemodynamicFlags(activeDrugs: ActiveDrug[]): ClinicalFlag[] {
  const flags: ClinicalFlag[] = [];
  const find = (id: string) => activeDrugs.find((d) => d.id === id);

  const ne = find('norepinephrine');
  const epi = find('epinephrine');
  const phenyl = find('phenylephrine');
  const vaso = find('vasopressin');
  const dobu = find('dobutamine');
  const dopa = find('dopamine');

  const neHighDose = !!ne && ne.dose > 0.5;

  if (neHighDose && activeDrugs.length === 1) {
    flags.push({
      level: 'peringatan',
      text: 'NE dosis tinggi (>0.5 mcg/kgBB/menit) tanpa agen kedua. Pertimbangkan menambah vasopresin dibanding terus menaikkan dosis NE.',
      citationIds: ['ssc2026'],
    });
  }

  if (phenyl && neHighDose) {
    flags.push({
      level: 'perhatian',
      text: 'Kombinasi Fenilefrin + NE dosis tinggi tidak memiliki dasar bukti terstruktur di guideline internasional terbaru. Risiko refleks bradikardia & penurunan curah jantung meningkat, khususnya bila fungsi jantung sudah terganggu — pertimbangkan echocardiography bedside bila belum dilakukan.',
      citationIds: ['statpearls_inotropes'],
    });
  }

  if (epi && neHighDose) {
    flags.push({
      level: 'peringatan',
      text: 'Kombinasi katekolamin ganda (Epinefrin + NE dosis tinggi) meningkatkan risiko aritmia dan iskemia splanknik; evidence quality rendah untuk kombinasi ini di guideline terbaru.',
      citationIds: ['ssc2026'],
    });
  }

  if (dobu) {
    flags.push({
      level: 'info',
      text: 'Dobutamin (atau epinefrin) untuk syok septik direkomendasikan spesifik pada disfungsi jantung dengan hipoperfusi persisten meski volume & MAP sudah adekuat — bukan default add-on rutin.',
      citationIds: ['ssc2026', 'kapur2019'],
    });
  }

  if (vaso && vaso.dose > 0.04) {
    flags.push({
      level: 'peringatan',
      text: 'Dosis Vasopresin di atas rentang yang dipelajari pada studi acak terkontrol (VASST/VANISH); tidak ada bukti tambahan manfaat, potensi risiko iskemik meningkat.',
      citationIds: ['russell2008vasst', 'gordon2016vanish'],
    });
  }

  if (dopa && !ne) {
    flags.push({
      level: 'info',
      text: 'Guideline internasional konsisten memprioritaskan norepinefrin dibanding dopamin sebagai vasopresor lini pertama karena profil aritmia dopamin lebih tinggi.',
      citationIds: ['debacker2010', 'ssc2026'],
    });
  }

  if (activeDrugs.length >= 3) {
    flags.push({
      level: 'peringatan',
      text: 'Syok refrakter multi-agen (≥3 vasopresor/inotropik aktif) — pertimbangkan skrining etiologi non-septik (adrenal, kardiogenik, obstruktif) dan diskusi tim/konsulen.',
      citationIds: ['kapur2019', 'vincent2013'],
    });
  }

  return flags;
}

function ReceptorBar({ label, activity }: { label: string; activity: ReceptorActivity }) {
  const pct = (RECEPTOR_ACTIVITY_SCALE[activity] / 5) * 100;
  return (
    <div className="flex items-center gap-2">
      <span className="w-10 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-blue-500 dark:bg-blue-400 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-16 text-[10px] font-medium text-slate-600 dark:text-slate-400 text-right shrink-0">
        {RECEPTOR_ACTIVITY_LABEL[activity]}
      </span>
    </div>
  );
}

export default function KalkulatorHemodinamik() {
  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();

  const [bw, setBw] = useState('');
  const [activeDrugs, setActiveDrugs] = useState<ActiveDrug[]>([]);
  const [neeFormula, setNeeFormula] = useState<NeeFormula>('goradia');
  const [showNeeInfo, setShowNeeInfo] = useState(false);

  React.useEffect(() => {
    const parentWeight = patient.weightKg || clinicalStore.data.weight || '';
    if (parentWeight) setBw(parentWeight);
  }, []);

  const handleAutofill = (data: { weightKg: string }) => {
    if (data.weightKg) setBw(data.weightKg);
  };

  const syncFields = useMemo(
    () => [{ key: 'weight' as const, label: 'Berat Badan', value: bw, setter: setBw, unit: 'kg' }],
    [bw]
  );

  const availableDrugs = HEMODYNAMIC_DRUGS.filter((d) => !activeDrugs.some((ad) => ad.id === d.id));

  const addDrug = (drug: HemodynamicDrug) => {
    setActiveDrugs((prev) => [...prev, { id: drug.id, dose: drug.doseMin }]);
  };

  const removeDrug = (id: string) => {
    setActiveDrugs((prev) => prev.filter((ad) => ad.id !== id));
  };

  const updateDose = (id: string, dose: number) => {
    setActiveDrugs((prev) => prev.map((ad) => (ad.id === id ? { ...ad, dose } : ad)));
  };

  const { score: neeScore, excludedDrugs } = useMemo(
    () => calculateNEE(activeDrugs, neeFormula),
    [activeDrugs, neeFormula]
  );
  const neeStatus = useMemo(() => getNeeStatus(neeScore), [neeScore]);
  const flags = useMemo(() => evaluateHemodynamicFlags(activeDrugs), [activeDrugs]);

  const weightNum = parseFloat(bw);
  const historySummary = activeDrugs.length
    ? `${activeDrugs.length} agen aktif — NEE (${neeFormula}): ${neeScore.toFixed(2)} mcg/kgBB/menit (${neeStatus.label})`
    : 'Belum ada obat aktif';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 overflow-x-hidden">
      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />

      <div className="flex items-start gap-3 pb-2">
        <div className="p-2.5 rounded-xl bg-red-500/10 dark:bg-red-500/5">
          <HeartPulse className="w-5 h-5 text-red-500 dark:text-red-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Hemodynamic Support Calculator</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kombinasikan vasopresor/inotropik secara bebas urutan, lihat profil reseptor dosis-tergantung, dan pantau skor NEE kumulatif secara langsung.
          </p>
        </div>
      </div>

      {/* Weight Input */}
      <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl">
        <div className="flex items-center justify-between px-4 py-3 gap-4">
          <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Berat Badan Pasien</span>
          <div className="flex-1 flex items-center justify-end gap-2">
            <input
              type="number"
              value={bw}
              onChange={(e) => setBw(e.target.value)}
              placeholder="70"
              className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
            />
            <span className="text-xs font-semibold text-slate-500 w-10 text-left">kg</span>
          </div>
        </div>
      </div>

      {/* Add Drug Panel */}
      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <h4 className="text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">Tambah Obat</h4>
        {availableDrugs.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">Semua obat sudah ditambahkan.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableDrugs.map((drug) => {
              const badge = CATEGORY_BADGE[drug.category];
              return (
                <button
                  key={drug.id}
                  onClick={() => addDrug(drug)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#2C2C2E]/50 hover:bg-slate-100 dark:hover:bg-[#2C2C2E] text-[13px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                  {drug.nameId}
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${badge.className}`}>{badge.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Drug Cards */}
      {activeDrugs.length > 0 && (
        <div className="space-y-4">
          {activeDrugs.map((ad) => {
            const drug = getDrugById(ad.id)!;
            const profile = getReceptorProfileForDose(drug, ad.dose);
            const badge = CATEGORY_BADGE[drug.category];
            const isHighDose = ad.dose > drug.highDoseThreshold;
            const absoluteDose = drug.isWeightBased && weightNum ? ad.dose * weightNum : null;

            return (
              <div key={ad.id} className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-[14px] font-bold text-slate-900 dark:text-slate-100">{drug.nameId}</h4>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${badge.className}`}>{badge.label}</span>
                    {isHighDose && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">DOSIS TINGGI</span>
                    )}
                  </div>
                  <button
                    onClick={() => removeDrug(ad.id)}
                    className="p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Dose Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-semibold text-slate-600 dark:text-slate-400">Dosis</span>
                    <span className="font-mono text-[15px] font-bold text-slate-900 dark:text-white">
                      {ad.dose.toFixed(drug.doseStep < 1 ? 2 : 0)} <span className="text-[11px] font-sans font-medium text-slate-500">{drug.unit}</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={drug.doseMin}
                    max={drug.doseMax}
                    step={drug.doseStep}
                    value={ad.dose}
                    onChange={(e) => updateDose(ad.id, parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>{drug.doseMin} {drug.unit}</span>
                    <span>{drug.doseMax} {drug.unit}</span>
                  </div>
                  {absoluteDose !== null && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Dosis absolut: <strong className="text-slate-700 dark:text-slate-300">{absoluteDose.toFixed(1)} mcg/menit</strong> (BB {weightNum} kg)
                    </p>
                  )}
                  {!drug.isWeightBased && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
                      Fixed-dose (bukan per kgBB) — umumnya tidak dititrasi berkelanjutan seperti katekolamin.
                    </p>
                  )}
                </div>

                {/* Receptor Profile */}
                <div className="bg-slate-50 dark:bg-[#2C2C2E]/40 rounded-xl p-3 space-y-2 border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Profil Reseptor — {profile.doseRangeLabel}
                  </p>
                  <div className="space-y-1.5">
                    <ReceptorBar label="α1" activity={profile.alpha1} />
                    <ReceptorBar label="β1" activity={profile.beta1} />
                    <ReceptorBar label="β2" activity={profile.beta2} />
                    {drug.id === 'vasopressin' && <ReceptorBar label="V1" activity={profile.v1} />}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-800">
                    {profile.dominantEffect}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* NEE Panel */}
      {activeDrugs.length > 0 && (
        <div className={`rounded-2xl border p-5 space-y-3 ${neeStatus.className}`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold uppercase tracking-wider">Skor NEE (Norepinephrine Equivalent)</span>
              <button
                onClick={() => setShowNeeInfo((v) => !v)}
                className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                title="Apa itu NEE?"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex bg-white/60 dark:bg-black/20 p-0.5 rounded-lg text-[11px] font-bold">
              <button
                onClick={() => setNeeFormula('goradia')}
                className={`px-2.5 py-1 rounded-md transition-colors ${neeFormula === 'goradia' ? 'bg-white dark:bg-[#1C1C1E] shadow-sm' : ''}`}
              >
                Goradia 2021
              </button>
              <button
                onClick={() => setNeeFormula('kotani')}
                className={`px-2.5 py-1 rounded-md transition-colors ${neeFormula === 'kotani' ? 'bg-white dark:bg-[#1C1C1E] shadow-sm' : ''}`}
              >
                Kotani 2023
              </button>
            </div>
          </div>

          <div className="font-mono text-4xl font-extrabold">
            {neeScore.toFixed(2)} <span className="text-[15px] font-sans font-medium">mcg/kgBB/menit</span>
          </div>
          <div className="text-[13px] font-bold">{neeStatus.label}</div>
          <p className="text-[12px] opacity-90">{neeStatus.desc}</p>

          {excludedDrugs.length > 0 && (
            <p className="text-[11px] italic opacity-80 border-t border-current/20 pt-2">
              Catatan: {excludedDrugs.join(', ')} tidak masuk formula {neeFormula === 'kotani' ? 'Kotani 2023' : 'Goradia 2021'}
              {neeFormula === 'kotani' ? ', gunakan Goradia 2021 jika dopamin digunakan.' : '.'}
            </p>
          )}

          {showNeeInfo && (
            <div className="text-[12px] bg-white/60 dark:bg-black/20 rounded-xl p-3 border border-current/10 space-y-2">
              <p>
                NEE adalah metode standarisasi untuk membandingkan "beban" total vasopresor/inotropik pasien dengan mengonversi semua obat ke dalam
                ekuivalen dosis Norepinefrin, sehingga memudahkan komunikasi tingkat keparahan syok antar tim atau penelitian.
              </p>
              <p className="font-mono text-[11px] bg-slate-900/5 dark:bg-white/5 p-2 rounded">
                {neeFormula === 'goradia'
                  ? 'NEE = NE + Epinefrin + (Fenilefrin/10) + (Dopamin/100) + (Vasopresin×2.5)'
                  : 'NEE = NE + Epinefrin + (0.06×Fenilefrin) + (2.5×Vasopresin)'}
              </p>
              <p className="text-[11px] italic opacity-80">
                📚 {neeFormula === 'goradia' ? CITATION_TEXT.goradia2021 : CITATION_TEXT.kotani2023}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Clinical Flags Panel */}
      {flags.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Flag Klinis Kontekstual</h4>
          {flags.map((flag, idx) => {
            const style = FLAG_STYLE[flag.level];
            return (
              <div key={idx} className={`border rounded-xl p-3.5 text-[13px] flex items-start gap-2.5 ${style.wrap}`}>
                {flag.level === 'peringatan' ? (
                  <ShieldAlert className={`w-4 h-4 mt-0.5 shrink-0 ${style.icon}`} />
                ) : (
                  <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${style.icon}`} />
                )}
                <div className="flex-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider block mb-1">{style.label}</span>
                  <p>{flag.text}</p>
                  <p className="text-[11px] italic opacity-75 mt-1.5">
                    📚 {flag.citationIds.map((cid) => CITATION_TEXT[cid] || cid).join(' · ')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeDrugs.length > 0 && (
        <div className="flex justify-end">
          <SaveToHistoryButton
            module="hemodinamik"
            label="Hemodynamic Support"
            inputs={{ bw, activeDrugs, neeFormula }}
            summary={historySummary}
          />
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 text-center">
        Alat bantu edukasi & referensi cepat — bukan pengganti penilaian klinis, keputusan DPJP/intensivist, atau kondisi hemodinamik pasien aktual.
      </div>

      {/* Theory Accordion */}
      <Accordion title="📖 Teori & Referensi: Hemodynamic Support">
        <div className="space-y-4">
          <div>
            <h5 className="font-bold text-slate-800 dark:text-slate-200 text-[13px] mb-2">Tabel Farmakologi Reseptor Lengkap</h5>
            <div className="w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
              <table className="w-full min-w-[600px] text-xs text-left divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-bold">
                  <tr>
                    <th className="px-3 py-2">Obat</th>
                    <th className="px-3 py-2">α1</th>
                    <th className="px-3 py-2">β1</th>
                    <th className="px-3 py-2">β2</th>
                    <th className="px-3 py-2">V1</th>
                    <th className="px-3 py-2">Kategori</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-slate-700 dark:text-slate-300">
                  {HEMODYNAMIC_DRUGS.map((drug) => {
                    const lastProfile = drug.receptorProfiles[drug.receptorProfiles.length - 1];
                    return (
                      <tr key={drug.id}>
                        <td className="px-3 py-2 font-semibold">{drug.nameId}</td>
                        <td className="px-3 py-2">{RECEPTOR_ACTIVITY_LABEL[lastProfile.alpha1]}</td>
                        <td className="px-3 py-2">{RECEPTOR_ACTIVITY_LABEL[lastProfile.beta1]}</td>
                        <td className="px-3 py-2">{RECEPTOR_ACTIVITY_LABEL[lastProfile.beta2]}</td>
                        <td className="px-3 py-2">{RECEPTOR_ACTIVITY_LABEL[lastProfile.v1]}</td>
                        <td className="px-3 py-2">{CATEGORY_BADGE[drug.category].label}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 italic">
              📚 {CITATION_TEXT.statpearls_inotropes}
            </p>
          </div>

          <div>
            <h5 className="font-bold text-slate-800 dark:text-slate-200 text-[13px] mb-1">Perubahan SSC 2021 → 2026 (Vasopresor)</h5>
            <p className="text-slate-600 dark:text-slate-400">
              Panduan SSC 2026 tetap merekomendasikan norepinefrin sebagai vasopresor lini pertama pada syok septik, namun sebagian rekomendasi
              yang sebelumnya bersifat kuat ("recommend") pada SSC 2021 kini di-<em>downgrade</em> menjadi rekomendasi lemah ("suggest") — termasuk
              beberapa aspek terkait waktu penambahan vasopresin sebagai agen kedua. Perubahan ini eksplisit disebutkan dalam guideline terbaru dan
              tidak disembunyikan di modul ini.
              <br />
              📚 {CITATION_TEXT.ssc2026} · {CITATION_TEXT.ssc2021}
            </p>
          </div>

          <div>
            <h5 className="font-bold text-slate-800 dark:text-slate-200 text-[13px] mb-1">Formula NEE & Keterbatasannya</h5>
            <p className="text-slate-600 dark:text-slate-400">
              Skor NEE bersifat <strong>aditif linear</strong> berdasarkan bobot konversi masing-masing obat terhadap norepinefrin. Skor ini{' '}
              <strong>bukan model sinergi atau interaksi farmakodinamik</strong> antar obat — literatur saat ini tidak memiliki model tervalidasi
              untuk menghitung efek gabungan/sinergi vasopresor secara kuantitatif. NEE hanya berguna sebagai penanda beban vasopresor total untuk
              komunikasi klinis dan stratifikasi keparahan syok, bukan prediktor presisi efek klinis gabungan.
              <br />
              📚 {CITATION_TEXT.goradia2021} · {CITATION_TEXT.kotani2023}
            </p>
          </div>

          <div>
            <h5 className="font-bold text-slate-800 dark:text-slate-200 text-[13px] mb-1">Konten Terkait</h5>
            <Link
              to="/theory/syok"
              className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Lihat Teori Syok & Tabel Vasopressor Utama <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1.5">Daftar Pustaka</p>
            <ul className="pl-4 space-y-1 list-disc text-slate-500 dark:text-slate-400 text-[11px]">
              {Object.entries(CITATION_TEXT).map(([id, text]) => (
                <li key={id}>{text}</li>
              ))}
            </ul>
          </div>
        </div>
      </Accordion>
    </div>
  );
}
