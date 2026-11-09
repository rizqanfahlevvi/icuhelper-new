import { useState, useMemo, useEffect, useRef } from 'react';
import { usePatientStore } from '../../store/usePatientStore';
import { calcIbw } from '../../utils/anthropometry';
import AbgInterpreter from './AbgInterpreter';
import AcidBaseCorrection from './AcidBaseCorrection';
import AbgTheory from './AbgTheory';
import { AbgInputs, defaultAbgInputs } from './types';
import { Star, Droplet } from 'lucide-react';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { UnifiedSyncBanner, type SyncField } from '../../components/UnifiedSyncBanner';
import { albuminGdlFromMgdl, albuminMgdlFromGdl, kpaFromMmHg, mmHgFromKpa } from '../../utils/clinicalUnits';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { fio2ToPercentString, fio2FromStoreString } from '../../utils/abg';
import { AbbrLegend } from '../../components/ui/AbbrLegend';
import { CalcActionBar, type CalcTone } from '../../components/ui/CalcActionBar';
import { useCalcTrigger } from '../../hooks/useCalcTrigger';
import { useAbgCalculator } from './useAbgCalculator';
import { abgSummary } from '../../utils/respirasiSummary';
import type { CorrectionBarState } from './AcidBaseCorrection';

export default function AbgPage() {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const [abgInputs, setAbgInputs] = useState<AbgInputs>(defaultAbgInputs);
  const patientWeight = usePatientStore(s => s.weightKg);
  const patientHeight = usePatientStore(s => s.heightCm);
  const patientGender = usePatientStore(s => s.gender);
  const [weightOverride, setWeightOverride] = useState('');
  // BB untuk kalkulator koreksi: dari autofill/pasien aktif. BBI (Devine) hanya bila TB & jenis kelamin ada.
  const weightForCorrection = weightOverride || patientWeight || '';
  const ibwForCorrection = useMemo(() => {
    const h = parseFloat(patientHeight);
    if (!(h > 0) || (patientGender !== 'L' && patientGender !== 'P')) return '';
    return calcIbw(h, patientGender === 'P').toFixed(1);
  }, [patientHeight, patientGender]);
  const isFav = isFavorite('/abg');

  // Interpretasi dihitung via memo (selalu sesuai input); tombol Hitung hanya membuka tampilan hasil.
  // Setelah Hitung pertama, hasil ikut berubah otomatis → tidak pernah ada hasil basi.
  const calcResult = useAbgCalculator(abgInputs);
  const calc = useCalcTrigger({
    compute: () => {},
    deps: [],
    required: [
      { id: 'abg-ph', label: 'pH', filled: abgInputs.ph.trim() !== '' },
      { id: 'abg-pco2', label: abgInputs.sampleType === 'vena' ? 'PvCO₂' : 'PaCO₂', filled: abgInputs.pco2.trim() !== '' },
      { id: 'abg-hco3', label: 'HCO₃⁻', filled: abgInputs.hco3.trim() !== '' },
    ],
  });
  const interpSum = calc.armed ? abgSummary(calcResult) : null;

  // Bilah bawah mengikuti bagian yang sedang dilihat: interpretasi ABG atau kalkulator koreksi (tab aktif).
  const koreksiRef = useRef<HTMLDivElement>(null);
  const [inKoreksi, setInKoreksi] = useState(false);
  const [koreksiBar, setKoreksiBar] = useState<CorrectionBarState | null>(null);
  useEffect(() => {
    const el = koreksiRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setInKoreksi(e.isIntersecting), { rootMargin: '0px 0px -55% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const useKoreksiBar = inKoreksi && koreksiBar !== null;

  // Autofill dari pasien aktif: usia (A-a gradient normal) & BB (kalkulator koreksi).
  const handleAutofill = (data: { weightKg: string; temp?: string; age?: string; gender?: string }) => {
    const age = data.age;
    if (age) setAbgInputs(prev => ({ ...prev, age }));
    if (data.weightKg) setWeightOverride(data.weightKg);
  };

  // Sinkron ke data pasien dalam SATUAN KANONIK store (mmHg, g/dL, FiO₂ %).
  // Gas darah VENA tidak pernah ditulis ke kunci arteri (ph/pco2/pao2/hco3/be) —
  // PvO₂ ≈ 40 mmHg yang terbaca sebagai PaO₂ akan memalsukan P/F, SOFA, & APACHE.
  const syncFields = useMemo<SyncField[]>(() => {
    const set = (k: keyof AbgInputs) => (val: string) => setAbgInputs(prev => ({ ...prev, [k]: val }));
    const kpa = abgInputs.paco2Unit === 'kPa';
    const gasToStore = (v: string) => (kpa ? mmHgFromKpa(v) : v);
    const gasFromStore = (v: string) => (kpa ? kpaFromMmHg(v) : v);
    const albMg = abgInputs.albUnit === 'mg/dL';
    const isArterial = abgInputs.sampleType !== 'vena';

    const arterial: SyncField[] = isArterial ? [
      { key: 'ph', label: 'pH', value: abgInputs.ph, setter: set('ph'), unit: '' },
      { key: 'pco2', label: 'PaCO₂', value: gasToStore(abgInputs.pco2), rawValue: abgInputs.pco2, setter: (v: string) => set('pco2')(gasFromStore(v)), unit: 'mmHg' },
      { key: 'pao2', label: 'PaO₂', value: gasToStore(abgInputs.po2), rawValue: abgInputs.po2, setter: (v: string) => set('po2')(gasFromStore(v)), unit: 'mmHg' },
      { key: 'hco3', label: 'HCO₃⁻', value: abgInputs.hco3, setter: set('hco3'), unit: 'mmol/L' },
      { key: 'be', label: 'BE', value: abgInputs.be, setter: set('be'), unit: 'mEq/L' },
    ] : [];

    return [
      ...arterial,
      { key: 'na', label: 'Na', value: abgInputs.na, setter: set('na'), unit: 'mEq/L' },
      { key: 'cl', label: 'Cl', value: abgInputs.cl, setter: set('cl'), unit: 'mEq/L' },
      {
        key: 'albumin', label: 'Albumin',
        value: albMg ? albuminGdlFromMgdl(abgInputs.alb) : abgInputs.alb,
        rawValue: abgInputs.alb,
        setter: (v: string) => set('alb')(albMg ? albuminMgdlFromGdl(v) : v),
        unit: 'g/dL',
      },
      { key: 'laktat', label: 'Laktat', value: abgInputs.laktat, setter: set('laktat'), unit: 'mmol/L' },
      // SpO₂ hanya dari pulse oximetry (SaO₂ AGD tidak ditulis ke kunci SpO₂).
      { key: 'spo2', label: 'SpO₂', value: abgInputs.spo2Source === 'pulse' ? abgInputs.spo2 : '', setter: (v: string) => setAbgInputs(prev => ({ ...prev, spo2: v, spo2Source: 'pulse' })), unit: '%' },
      { key: 'mpaw', label: 'mPaw', value: abgInputs.mapV, setter: set('mapV'), unit: 'cmH₂O' },
      { key: 'rr', label: 'RR', value: abgInputs.rr, setter: set('rr'), unit: 'x/menit' },
      { key: 'peep', label: 'PEEP', value: abgInputs.peep, setter: set('peep'), unit: 'cmH₂O' },
      { key: 'age', label: 'Usia', value: abgInputs.age, setter: set('age'), unit: 'tahun' },
      // Clinical store menyimpan FiO₂ dalam PERSEN (21–100); ABG memakai fraksi → konversi dua arah.
      { key: 'fio2', label: 'FiO₂', value: abgInputs.fio2Mode === 'direct' ? fio2ToPercentString(abgInputs.fio2Direct) : '', rawValue: abgInputs.fio2Direct, setter: (val: string) => setAbgInputs(prev => ({ ...prev, fio2Direct: fio2FromStoreString(val), fio2Mode: 'direct' })), unit: '%' },
    ];
  }, [abgInputs]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 w-full max-w-4xl mx-auto space-y-6 pb-20 overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="md:pt-2">
        <PageHeader 
          compact
          badgeIcon={Droplet}
          badgeText="GAS DARAH"
          title="ABG & Asam-Basa"
          description="Interpretasi gas darah 7 langkah (asam-basa, kompensasi, anion gap, oksigenasi), serta kalkulator koreksi."
          rightContent={
            <button
              onClick={() => toggleFavorite('/abg')}
              className={`flex items-center justify-center p-2.5 sm:px-4 sm:py-2.5 rounded-xl border font-bold text-sm shadow-sm transition-all active:scale-95 ${isFav ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              title={isFav ? "Hapus dari Favorit" : "Sematkan ke Favorit"}
            >
              <Star className={`w-4 h-4 sm:mr-2 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span className="hidden sm:inline">{isFav ? 'Difavoritkan' : 'Favoritkan'}</span>
            </button>
          }
        />
      </div>

      {/* Active Patient Widget & Sync Banner */}
      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />

      <AbgInterpreter inputs={abgInputs} setInputs={setAbgInputs} calcResult={calcResult} showResult={calc.armed} isMissing={calc.isMissing} />
      <div ref={koreksiRef}>
        <AcidBaseCorrection abgInputs={abgInputs} patientWeight={weightForCorrection} patientIbw={ibwForCorrection} onBarChange={setKoreksiBar} />
      </div>
      <AbgTheory />
      <AbbrLegend
        terms={[
          'ABG', 'AGD', 'VBG', 'PaCO2', 'PaO2', 'PAO2', 'PCO2', 'PO2', 'PvCO2', 'PvO2', 'HCO3', 'BE', 'AG',
          'HAGMA', 'NAGMA', 'LKURS', 'SID', 'UAG', 'OG-osmolar', 'FiO2', 'SpO2', 'SaO2', 'P/F', 'S/F', 'A-a', 'OI',
          'Paw', 'ROX', 'RQ', 'PH2O', 'Patm', 'PEEP', 'CPAP', 'EPAP', 'IPAP', 'BiPAP', 'NIV', 'HFNC', 'NRM', 'AHRF', 'ARDS', 'ARDSNet',
          'VD/VT', 'WOB', 'NMB', 'ECMO', 'VV', 'PPOK', 'NMD', 'USG', 'CT', 'MAP', 'RR', 'NE', 'GCS', 'DKA', 'GDS',
          'KCl', 'KRT', 'RRT', 'AKI', 'AKIN', 'RTA', 'eGFR', 'UO', 'EKG', 'COVID-19', 'PRC', 'Hb', 'NNT', 'HF', 'AF',
          'ACS', 'NTG', 'RV', 'PLR', 'PPV', 'VTI', 'IV', 'NGT', 'NG-nasogastrik', 'CVC', 'BB', 'BBI', 'BBP',
          'TB', 'AHA', 'ATS', 'ERS', 'ESICM', 'SSC', 'GOLD', 'ADA', 'EASD', 'JBDS', 'AACE', 'DTS', 'BTS', 'ICS', 'ESC',
        ]}
      />
      {useKoreksiBar && koreksiBar ? (
        <CalcActionBar
          mode={koreksiBar.mode}
          armed={koreksiBar.armed}
          onCalculate={koreksiBar.onCalculate}
          label={koreksiBar.label}
          summary={koreksiBar.summary}
          summaryTone={koreksiBar.tone}
          caption={koreksiBar.caption}
          missing={koreksiBar.missing}
          resultTargetId={koreksiBar.resultTargetId}
          emptyText={koreksiBar.emptyText}
        />
      ) : (
        <CalcActionBar
          armed={calc.armed}
          onCalculate={calc.trigger}
          label="Interpretasi ABG"
          summary={interpSum?.text ?? null}
          summaryTone={(interpSum?.tone ?? 'neutral') as CalcTone}
          caption={interpSum?.caption}
          missing={calc.missing}
          resultTargetId="abg-hasil"
        />
      )}
    </div>
  );
}
