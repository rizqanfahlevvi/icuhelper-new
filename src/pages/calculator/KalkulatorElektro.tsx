import { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { SaveToHistoryButton } from '../../components/ui/SaveToHistoryButton';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';
import { InputWarning } from '../../components/ui/InputWarning';
import { weightPlausibilityWarning, rangeWarning } from '../../utils/validation';
import { tbwFactor, freeWaterDeficit, adrogueDeltaNaPerLiter, hypoNaRiseLimits, NA_FLUIDS } from '../../utils/sodium';
import { TargetField, ToggleList, useToggleSet, StrategyFlow, type FlowStep } from './components/ElektroUI';
import { useKaliumState, KaliumInputs, KaliumResult } from './components/ElektroKalium';
import { useKalsiumState, KalsiumInputs, KalsiumResult } from './components/ElektroKalsium';
import { useMagnesiumState, MagnesiumInputs, MagnesiumResult } from './components/ElektroMagnesium';

// Klasifikasi gejala hiponatremia (Spasovski 2014, ERBP/ESE/ESICM).
// Indikasi NaCl 3% ditentukan oleh GEJALA, bukan angka natrium semata.
const SEVERE_SX = ['Muntah', 'Distres kardiorespirasi', 'Kejang', 'Kantuk dalam / somnolen abnormal', 'Penurunan kesadaran / koma (GCS ≤8)'];
const MODERATE_SX = ['Mual (tanpa muntah)', 'Bingung / konfusi', 'Nyeri kepala'];
// Faktor risiko ODS selain Na ≤105 (Verbalis 2013).
const ODS_RISK = ['Hipokalemia', 'Alkoholisme', 'Malnutrisi', 'Penyakit hati lanjut'];

const NA_RISE_OPTIONS = [
  { value: '4', label: 'Risiko ODS tinggi', note: 'Risiko ODS tinggi: target 4–6 mEq/L/24 jam, batas 8 (Verbalis 2013).' },
  { value: '6', label: 'Standar kronik', note: 'Target minimal 4–8 mEq/L/24 jam; cukup untuk mengurangi risiko klinis (Verbalis 2013).' },
  { value: '8', label: 'Batas atas target', note: 'Batas atas target risiko normal. Batas absolut 24 jam pertama 10 mEq/L, lalu 8 tiap 24 jam berikutnya (Spasovski 2014).' },
];
const HYPER_TARGET_OPTIONS = [
  { value: '140', label: 'Formula klasik', note: 'Rumus defisit air bebas Adrogué–Madías memakai Na target 140.' },
  { value: '145', label: 'Batas atas normal', note: 'Target lebih konservatif (volume air lebih kecil); tetap koreksi bertahap hari berikutnya bila perlu.' },
];
const HYPER_DROP_OPTIONS = [
  { value: '8', label: 'Kronik konservatif', note: 'Kronik/tidak tahu onset: 8–10 mEq/L/24 jam (~0.5 mEq/L/jam) — mencegah edema serebri.' },
  { value: '10', label: 'Kronik (pedoman)', note: 'Batas umum hipernatremia kronik ≤10 mEq/L/24 jam (Adrogué–Madías 2000).' },
  { value: '24', label: 'Akut <48 jam', note: 'Onset jelas <48 jam: boleh ~1 mEq/L/jam karena otak belum beradaptasi.' },
];

export default function KalkulatorElektro() {
  const [tab, setTab] = useState<'na' | 'k' | 'ca' | 'mg'>('na');

  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();

  const [bw, setBw] = useState('');

  // Na
  const [na, setNa] = useState('');
  const [sex, setSex] = useState('m');
  const [age, setAge] = useState('');
  const [glu, setGlu] = useState('');
  const [onset, setOnset] = useState('kronik');
  const [naFluid, setNaFluid] = useState('d5w'); // pilihan cairan koreksi hipernatremia
  const [symptoms, toggleSymptom] = useToggleSet();
  const [odsFactors, toggleOds] = useToggleSet();
  const [naRise, setNaRise] = useState('6');            // target kenaikan Na /24 jam (hipo)
  const [hyperTarget, setHyperTarget] = useState('140'); // Na target akhir (hiper)
  const [hyperDrop, setHyperDrop] = useState('10');      // batas penurunan /24 jam (hiper)

  // K
  const [k, setK] = useState('');
  const [ph, setPh] = useState('');
  const [gdsK, setGdsK] = useState('');
  
  // Ca
  const [ca, setCa] = useState('');
  const [alb, setAlb] = useState('');
  const [caPh, setCaPh] = useState('');

  // Mg
  const [mg, setMg] = useState('');
  const [egfr, setEgfr] = useState('');

  // State target/konteks per elektrolit (modul terpisah di ./components)
  const kState = useKaliumState();
  const caState = useKalsiumState();
  const mgState = useMagnesiumState();

  // Hasil tampil setelah "Hitung Koreksi" ditekan, lalu ikut berubah LIVE saat input/target diubah.
  const [shown, setShown] = useState(false);

  // Auto-load on mount
  useEffect(() => {
    const parentWeight = patient.weightKg || clinicalStore.data.weight || '';
    if (parentWeight) setBw(parentWeight);

    const parentGender = patient.gender || clinicalStore.data.gender || '';
    if (parentGender) {
      setSex(parentGender.toLowerCase() === 'p' ? 'f' : 'm');
    }

    if (clinicalStore.data.na) setNa(clinicalStore.data.na);
    if (clinicalStore.data.glukosa) setGlu(clinicalStore.data.glukosa);
    if (clinicalStore.data.k) setK(clinicalStore.data.k);
    if (clinicalStore.data.ca) setCa(clinicalStore.data.ca);
    if (clinicalStore.data.albumin) setAlb(clinicalStore.data.albumin);
    if (clinicalStore.data.mg) setMg(clinicalStore.data.mg);
    if (clinicalStore.data.gds) setGdsK(clinicalStore.data.gds);
    if (clinicalStore.data.ph) {
      setPh(clinicalStore.data.ph);
      setCaPh(clinicalStore.data.ph);
    }
  }, []);

  const handleAutofill = (data: { weightKg: string; gender?: string }) => {
    if (data.weightKg) setBw(data.weightKg);
    if (data.gender) {
      setSex(data.gender.toLowerCase() === 'p' ? 'f' : 'm');
    }
    // Pull any available clinically saved data as well
    if (clinicalStore.data.na) setNa(clinicalStore.data.na);
    if (clinicalStore.data.glukosa) setGlu(clinicalStore.data.glukosa);
    if (clinicalStore.data.k) setK(clinicalStore.data.k);
    if (clinicalStore.data.ca) setCa(clinicalStore.data.ca);
    if (clinicalStore.data.albumin) setAlb(clinicalStore.data.albumin);
    if (clinicalStore.data.mg) setMg(clinicalStore.data.mg);
    if (clinicalStore.data.gds) setGdsK(clinicalStore.data.gds);
    if (clinicalStore.data.ph) {
      setPh(clinicalStore.data.ph);
      setCaPh(clinicalStore.data.ph);
    }
  };

  // ── Perhitungan Natrium (live) ──────────────────────────────────────────
  const naRes = useMemo(() => {
    const w = parseFloat(bw);
    const n = parseFloat(na);
    const g = parseFloat(glu);
    if (!(w > 0) || !(n > 0)) return null;

    let naCorr = n;
    let hasHyperglycemia = false;
    if (!isNaN(g) && g > 100) {
      naCorr = n + 1.6 * ((g - 100) / 100);
      hasHyperglycemia = true;
    }

    const calcN = naCorr;
    const ageNum = parseFloat(age);
    const tbwF = tbwFactor(sex as 'm' | 'f', ageNum);
    const tbw = w * tbwF;
    const naT = 140;

    if (calcN < 135) {
      // Risiko ODS tinggi: Na ≤105 (otomatis) atau faktor risiko yang dicentang (Verbalis 2013).
      const odsAuto = calcN <= 105;
      const highOdsRisk = odsAuto || odsFactors.size > 0;
      const lim = hypoNaRiseLimits(highOdsRisk);
      const riseIn = parseFloat(naRise);
      const rise = riseIn > 0 ? riseIn : 6;
      const d = Math.min(rise, naT - calcN);
      const tgt = calcN + d;
      // Metode 1 — Defisit natrium: ΔNa × TBW, dikonversi ke volume NaCl 3% (513 mEq/L)
      const deficit = d * tbw; // mEq Na yang dibutuhkan
      const vol3 = (deficit * 1000) / 513;
      const rate24 = vol3 / 24; // habis dalam 24 jam
      const rateMax = (0.5 * tbw * 1000) / 513; // laju setara 0.5 mEq/L/jam
      // Metode 2 — Adrogué–Madías: kenaikan Na per 1 L NaCl 3% = (513 − Na)/(TBW+1)
      const amPerLiter = (513 - calcN) / (tbw + 1);
      const volAM = (d / amPerLiter) * 1000; // mL untuk mencapai ΔNa target
      const rateAM = volAM / 24;

      return {
        type: 'hipo' as const, v: vol3.toFixed(0), d: d.toFixed(1),
        rate: rate24.toFixed(1), rateMax: rateMax.toFixed(1),
        vAM: volAM.toFixed(0), rateAM: rateAM.toFixed(1),
        amPerLiter: amPerLiter.toFixed(1),
        lim, rise, riseOverGoal: rise > lim.goalHi, riseOverLimit: rise > lim.limit24,
        highOdsRisk, odsAuto,
        isProfound: calcN < 125,
        calcN: calcN.toFixed(1), hasHyper: hasHyperglycemia,
        tgt: tgt.toFixed(1), tbw: tbw.toFixed(1), tbwF, w,
        deficit: deficit.toFixed(0),
      };
    }
    if (calcN > 145) {
      const tIn = parseFloat(hyperTarget);
      const targetNa = tIn >= 135 && tIn <= 150 ? tIn : naT;
      const deficit = Math.max(0, freeWaterDeficit(tbw, calcN, targetNa)); // L
      const dIn = parseFloat(hyperDrop);
      const maxDropPer24 = dIn > 0 ? dIn : (onset === 'akut' ? 24 : 10);
      const totalDrop = Math.max(0, calcN - targetNa);                 // ΔNa menuju target
      const targetDrop = Math.min(totalDrop, maxDropPer24);            // yang dikoreksi HARI INI
      const days = Math.max(1, Math.ceil(totalDrop / maxDropPer24));
      // Adrogué–Madías untuk cairan terpilih
      const fluid = NA_FLUIDS.find(f => f.id === naFluid) ?? NA_FLUIDS[1];
      const dNaPerL = adrogueDeltaNaPerLiter(fluid.na, calcN, tbw); // mEq/L per L (negatif = menurunkan)
      const lowersNa = dNaPerL < 0;
      const volForTarget = lowersNa ? targetDrop / -dNaPerL : null;  // L untuk drop hari ini
      const rateMlHr = volForTarget !== null ? (volForTarget * 1000) / 24 : null;
      return {
        type: 'hiper' as const,
        calcN: calcN.toFixed(1),
        tbw: tbw.toFixed(1), tbwF, w,
        targetNa, deficit: deficit.toFixed(2),
        onset, maxDropPer24, totalDrop: totalDrop.toFixed(1),
        dropOverGuideline: onset !== 'akut' && maxDropPer24 > 10,
        targetDrop: targetDrop.toFixed(1), days,
        fluidId: fluid.id, fluidLabel: fluid.label, fluidNa: fluid.na, fluidNote: fluid.note,
        dNaPerL: dNaPerL.toFixed(2), lowersNa,
        volForTarget: volForTarget !== null ? volForTarget.toFixed(2) : null,
        rateMlHr: rateMlHr !== null ? rateMlHr.toFixed(0) : null,
        hasHyper: hasHyperglycemia,
      };
    }
    return { type: 'normal' as const, calcN: calcN.toFixed(1), hasHyper: hasHyperglycemia };
  }, [bw, na, glu, age, sex, onset, naFluid, odsFactors, naRise, hyperTarget, hyperDrop]);

  // Na terkoreksi glukosa untuk menentukan input mana yang relevan (hipo vs hiper) sebelum dihitung.
  const naPreview = (() => {
    const n = parseFloat(na);
    const g = parseFloat(glu);
    if (!(n > 0)) return NaN;
    return !isNaN(g) && g > 100 ? n + 1.6 * ((g - 100) / 100) : n;
  })();

  const res = shown && tab === 'na' ? naRes : null;
  const calculate = () => setShown(true);

  const syncFields = useMemo(() => {
    const common = [
      { key: 'weight' as const, label: 'Weight', value: bw, setter: setBw, unit: 'kg' }
    ];
    
    if (tab === 'na') {
      return [
        ...common,
        { key: 'na' as const, label: 'Natrium', value: na, setter: setNa, unit: 'mEq/L' },
        { key: 'glukosa' as const, label: 'Glukosa', value: glu, setter: setGlu, unit: 'mg/dL' },
      ];
    } else if (tab === 'k') {
      return [
        ...common,
        { key: 'k' as const, label: 'Kalium', value: k, setter: setK, unit: 'mEq/L' },
        { key: 'ph' as const, label: 'pH Arteri', value: ph, setter: setPh, unit: '' },
        { key: 'gds' as const, label: 'GDS (HiperK)', value: gdsK, setter: setGdsK, unit: 'mg/dL' },
      ];
    } else if (tab === 'ca') {
      return [
        ...common,
        { key: 'ca' as const, label: 'Kalsium', value: ca, setter: setCa, unit: 'mg/dL' },
        { key: 'albumin' as const, label: 'Albumin', value: alb, setter: setAlb, unit: 'g/dL' },
        { key: 'ph' as const, label: 'pH Arteri', value: caPh, setter: setCaPh, unit: '' },
      ];
    } else { // mg
      return [
        ...common,
        { key: 'mg' as const, label: 'Magnesium', value: mg, setter: setMg, unit: 'mg/dL' },
      ];
    }
  }, [tab, bw, na, glu, k, ph, gdsK, ca, alb, caPh, mg]);

  // Keparahan diturunkan LIVE dari checklist gejala → hasil ikut berubah tanpa
  // perlu menekan "Hitung Koreksi" lagi saat gejala di-toggle.
  const naSeverity: 'berat' | 'sedang' | 'ringan' =
    SEVERE_SX.some(s => symptoms.has(s)) ? 'berat'
    : MODERATE_SX.some(s => symptoms.has(s)) ? 'sedang'
    : 'ringan';

  // Alur strategi koreksi Na (Spasovski 2014; Verbalis 2013; Sterns 2015; Adrogué–Madías 2000).
  const hypoNaFlow: FlowStep[] | null = res && res.type === 'hipo' ? [
    { title: 'Pastikan hiponatremia hipotonik', body: <>Koreksi terhadap glukosa{res.hasHyper ? ` (Na terkoreksi ${res.calcN})` : ''}; osmolalitas serum &lt;275 mOsm/kg; singkirkan pseudohiponatremia (lipid/protein sangat tinggi).</> },
    { title: `Nilai gejala → ${naSeverity.toUpperCase()}`, body: naSeverity === 'berat' ? 'Bolus NaCl 3% 150 mL/20 menit, ulang s/d gejala reda atau Na naik ~5 (target jam-1 +4–6).' : naSeverity === 'sedang' ? 'Infus tunggal NaCl 3% 150 mL/20 menit, lalu re-evaluasi.' : 'NaCl 3% tidak rutin. Fokus penyebab & status volume.', state: 'now' },
    { title: `Onset: ${onset === 'akut' ? 'akut (<48 jam)' : 'kronik / tidak tahu'}`, body: onset === 'akut' ? 'Risiko ODS rendah; bahaya utama edema serebri.' : 'Otak sudah beradaptasi → batasi kecepatan koreksi (risiko ODS). Jika ragu, perlakukan sebagai kronik.' },
    { title: 'Tentukan status volume & atasi penyebab', body: 'Hipovolemik → NaCl 0.9%; euvolemik/SIADH → restriksi cairan; hipervolemik → restriksi + terapi penyakit dasar. Hentikan obat pemicu (tiazid, SSRI, dll).' },
    { title: `Target +${res.rise} / batas ${res.lim.limit24} mEq/L dalam 24 jam`, body: <>Na target 24 jam ~{res.tgt}. Hari berikutnya batas {res.lim.limitNext24} mEq/L per 24 jam.{res.highOdsRisk ? ' Risiko ODS tinggi → batas lebih ketat.' : ''}{odsFactors.has('Hipokalemia') ? ' Koreksi KCl ikut menaikkan Na (K infusat masuk rumus Adrogué–Madías: Na+K infusat) — hitung dalam target.' : ''}</>, state: res.riseOverLimit ? 'now' : 'todo' },
    { title: 'Pantau & cegah overkoreksi', body: 'Na tiap 4–6 jam (tiap 20 menit saat bolus). Waspadai diuresis air (urin encer banyak) setelah penyebab teratasi → Na melonjak. Bila melewati batas: hentikan hipertonik, D5W ± desmopressin (lihat Rescue Protocol).' },
  ] : null;

  const hyperNaFlow: FlowStep[] | null = res && res.type === 'hiper' ? [
    { title: 'Klasifikasi status volume & penyebab', body: 'Hipovolemik (GI, diuretik, diuresis osmotik) · euvolemik (Diabetes Insipidus, insensible loss) · hipervolemik (iatrogenik NaHCO₃/hipertonik). Osmolalitas urin membantu.' },
    { title: 'Syok / hipovolemia berat? → NaCl 0.9% dulu', body: 'Stabilkan hemodinamik dengan isotonik, baru ganti ke air bebas.' },
    { title: `Defisit air ${res.deficit} L menuju Na ${res.targetNa}`, body: 'Air oral/NGT bila saluran cerna berfungsi > D5W > NaCl 0.45%.', state: 'now' },
    { title: `Batas penurunan ${res.maxDropPer24} mEq/L / 24 jam`, body: <>Hari ini turunkan {res.targetDrop} mEq/L → {res.rateMlHr ? `±${res.rateMlHr} mL/jam ${res.fluidLabel}` : 'pilih cairan hipotonik'}; total ±{res.days} hari.{res.dropOverGuideline ? ' ⚠ Melebihi batas kronik pedoman (≤10).' : ''}</>, state: 'now' },
    { title: 'Tambahkan IWL & kehilangan berlanjut', body: 'IWL ±30–40 mL/jam + urin encer (DI) + GI loss — tambahkan pada laju total, bukan bagian dari defisit.' },
    { title: 'Pantau Na tiap 2–4 jam & hitung ULANG', body: 'Atasi penyebab: DI sentral → desmopressin; nefrogenik → tiazid + NSAID. Waspadai edema serebri bila penurunan terlalu cepat.' },
  ] : null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 overflow-x-hidden">
      
      {/* Active Patient Widget */}
      <ActivePatientBriefCard onAutofill={handleAutofill} />

      {/* Unified Clinical Synchronization Banner */}
      <UnifiedSyncBanner fields={syncFields} />
      
      <div className="flex bg-slate-100 dark:bg-[#2C2C2E] p-1 rounded-xl w-full max-w-lg mx-auto shadow-sm mb-4">
        <button className={`flex-1 py-1.5 text-[12px] md:text-[13px] font-bold rounded-lg transition-colors ${tab === 'na' ? 'bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'}`} onClick={() => {setTab('na'); setShown(false)}}>Natrium</button>
        <button className={`flex-1 py-1.5 text-[12px] md:text-[13px] font-bold rounded-lg transition-colors ${tab === 'k' ? 'bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'}`} onClick={() => {setTab('k'); setShown(false)}}>Kalium</button>
        <button className={`flex-1 py-1.5 text-[12px] md:text-[13px] font-bold rounded-lg transition-colors ${tab === 'ca' ? 'bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'}`} onClick={() => {setTab('ca'); setShown(false)}}>Kalsium</button>
        <button className={`flex-1 py-1.5 text-[12px] md:text-[13px] font-bold rounded-lg transition-colors ${tab === 'mg' ? 'bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'}`} onClick={() => {setTab('mg'); setShown(false)}}>Magnesium</button>
      </div>

      <div className="flex flex-col gap-0">
         <h2 className="mt-2 mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
           Parameter Koreksi Elektrolit
         </h2>
         
         <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex items-center justify-between px-4 py-3 gap-4">
               <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Berat Badan</span>
               <div className="flex-1 flex items-center justify-end gap-2">
                 <input 
                   type="number" 
                   value={bw} 
                   onChange={e=>setBw(e.target.value)} 
                   placeholder="70" 
                   className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
                 />
                 <span className="text-xs font-semibold text-slate-500 w-10 text-left">kg</span>
               </div>
            </div>

            {tab === 'na' && (
              <>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Na Serum</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" value={na} onChange={e=>setNa(e.target.value)} placeholder="135" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" />
                     <span className="text-xs font-semibold text-slate-500 w-12 text-left">mEq/L</span>
                   </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Jenis Kelamin</span>
                   <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={sex} onChange={e=>setSex(e.target.value)}>
                     <option value="m">Laki-laki</option>
                     <option value="f">Perempuan</option>
                   </select>
                </div>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Usia</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" value={age} onChange={e=>setAge(e.target.value)} placeholder="untuk faktor TBW" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" />
                     <span className="text-xs font-semibold text-slate-500 w-12 text-left">tahun</span>
                   </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Glukosa GDS</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" value={glu} onChange={e=>setGlu(e.target.value)} placeholder="Opsional" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" />
                     <span className="text-xs font-semibold text-slate-500 w-12 text-left">mg/dL</span>
                   </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Onset</span>
                   <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={onset} onChange={e=>{ setOnset(e.target.value); setHyperDrop(e.target.value === 'akut' ? '24' : '10'); }}>
                     <option value="kronik">Kronik / Tidak tahu</option>
                     <option value="akut">Akut (&lt;48 jam)</option>
                   </select>
                </div>
                {naPreview > 145 && (
                  <>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Cairan koreksi</span>
                   <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={naFluid} onChange={e=>setNaFluid(e.target.value)}>
                     {NA_FLUIDS.map(f => <option key={f.id} value={f.id}>{f.label} ({f.na} mEq/L)</option>)}
                   </select>
                </div>
                    <TargetField label="Target Na akhir" sub="untuk rumus defisit air" value={hyperTarget} onChange={setHyperTarget} unit="mEq/L" step="1" options={HYPER_TARGET_OPTIONS} />
                    <TargetField label="Batas penurunan / 24 jam" sub="kecepatan koreksi" value={hyperDrop} onChange={setHyperDrop} unit="mEq/L" step="1" options={HYPER_DROP_OPTIONS} />
                  </>
                )}
                {naPreview < 135 && (
                  <>
                <div className="px-4 py-3">
                  <div className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Gejala Hiponatremia</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5 leading-relaxed">Centang gejala yang <em>plausibel disebabkan</em> hiponatremia. Indikasi NaCl 3% ditentukan oleh gejala, bukan angka Na semata.</p>
                  <div className="space-y-2.5">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-1.5">🔴 Berat</div>
                      <div className="flex flex-wrap gap-1.5">
                        {SEVERE_SX.map(s => (
                          <button key={s} type="button" onClick={()=>toggleSymptom(s)} className={`text-[12px] px-2.5 py-1.5 rounded-lg border transition-colors ${symptoms.has(s) ? 'bg-red-500/15 border-red-500/40 text-red-700 dark:text-red-300 font-semibold' : 'bg-slate-100/80 dark:bg-white/5 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>{s}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1.5">🟠 Sedang</div>
                      <div className="flex flex-wrap gap-1.5">
                        {MODERATE_SX.map(s => (
                          <button key={s} type="button" onClick={()=>toggleSymptom(s)} className={`text-[12px] px-2.5 py-1.5 rounded-lg border transition-colors ${symptoms.has(s) ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300 font-semibold' : 'bg-slate-100/80 dark:bg-white/5 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>{s}</button>
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">Tidak ada yang dicentang = ringan / asimtomatik → 3% tidak rutin diindikasikan.</p>
                  </div>
                </div>
                    <TargetField label="Target kenaikan Na / 24 jam" sub="koreksi lambat (bila diputuskan)" value={naRise} onChange={setNaRise} unit="mEq/L" step="1" options={NA_RISE_OPTIONS} />
                    <ToggleList title="Faktor Risiko ODS" hint="Na ≤105 otomatis dihitung berisiko tinggi. Risiko tinggi → batas 8 mEq/L/24 jam (Verbalis 2013)." items={ODS_RISK} selected={odsFactors} onToggle={toggleOds} tone="amber" />
                  </>
                )}
              </>
            )}

            {tab === 'k' && (
              <>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">K Serum</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" step="0.1" value={k} onChange={e=>setK(e.target.value)} placeholder="3.5" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" />
                     <span className="text-xs font-semibold text-slate-500 w-12 text-left">mEq/L</span>
                   </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 gap-4 border-t border-slate-100 dark:border-slate-800">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">pH Arteri</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" step="0.01" value={ph} onChange={e=>setPh(e.target.value)} placeholder="Opsional" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" />
                   </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 gap-4 border-t border-slate-100 dark:border-slate-800">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">GDS Pre-Koreksi</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" step="1" value={gdsK} onChange={e=>setGdsK(e.target.value)} placeholder="Opsional" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" />
                     <span className="text-xs font-semibold text-slate-500 w-12 text-left">mg/dL</span>
                   </div>
                </div>
                <KaliumInputs s={kState} k={k} />
              </>
            )}

            {tab === 'ca' && (
              <>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Ca Total</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" step="0.1" value={ca} onChange={e=>setCa(e.target.value)} placeholder="8.5" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" />
                     <span className="text-xs font-semibold text-slate-500 w-12 text-left">mg/dL</span>
                   </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 gap-4 border-t border-slate-100 dark:border-slate-800">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Albumin</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" step="0.1" value={alb} onChange={e=>setAlb(e.target.value)} placeholder="4.0" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" />
                     <span className="text-xs font-semibold text-slate-500 w-12 text-left">g/dL</span>
                   </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 gap-4 border-t border-slate-100 dark:border-slate-800">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">pH Arteri</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" step="0.01" value={caPh} onChange={e=>setCaPh(e.target.value)} placeholder="Opsional" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" />
                   </div>
                </div>
                <KalsiumInputs s={caState} ca={ca} alb={alb} />
              </>
            )}

            {tab === 'mg' && (
              <>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Mg Serum</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" step="0.1" value={mg} onChange={e=>setMg(e.target.value)} placeholder="1.7" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" />
                     <span className="text-xs font-semibold text-slate-500 w-12 text-left">mg/dL</span>
                   </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 gap-4 border-t border-slate-100 dark:border-slate-800">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">eGFR / CrCl</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" step="1" value={egfr} onChange={e=>setEgfr(e.target.value)} placeholder="Opsional" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" />
                     <span className="text-xs font-semibold text-slate-500 w-12 text-left">mL/min</span>
                   </div>
                </div>
                <MagnesiumInputs s={mgState} mg={mg} />
              </>
            )}
         </div>

         <div className="mt-4">
            <button onClick={calculate} className={`w-full py-3.5 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px] ${tab === 'na' ? 'bg-cyan-600 hover:bg-cyan-700' : tab === 'k' ? 'bg-red-600 hover:bg-red-700' : tab === 'ca' ? 'bg-stone-500 hover:bg-stone-600' : 'bg-green-600 hover:bg-green-700'}`}>
               Hitung Koreksi
            </button>
         </div>

         <div className="mt-4 pb-6">
            {shown && <InputWarning messages={[
              weightPlausibilityWarning(parseFloat(bw)),
              tab === 'na' ? rangeWarning(parseFloat(na), 100, 180, 'Na', ' mEq/L') : null,
              tab === 'k' ? rangeWarning(parseFloat(k), 1.5, 9, 'K', ' mEq/L') : null,
              tab === 'ca' ? rangeWarning(parseFloat(ca), 4, 18, 'Ca', ' mg/dL') : null,
              tab === 'mg' ? rangeWarning(parseFloat(mg), 0.5, 6, 'Mg', ' mg/dL') : null,
            ]} />}
            {shown && tab === 'k' && <KaliumResult s={kState} k={k} ph={ph} gds={gdsK} bw={bw} />}
            {shown && tab === 'ca' && <KalsiumResult s={caState} ca={ca} alb={alb} bw={bw} />}
            {shown && tab === 'mg' && <MagnesiumResult s={mgState} mg={mg} egfr={egfr} bw={bw} />}
            {res && (
               <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                 
                 {tab === 'na' && res.hasHyper && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-[13px] text-amber-800 dark:text-amber-300">
                      <strong>Koreksi Hiperglikemia:</strong> Na terkoreksi adalah <strong>{res.calcN} mEq/L</strong> (berdasarkan glukosa {glu} mg/dL).<br/>
                      <span className="text-[11px] opacity-80 italic">📚 Adrogue HJ. NEJM 2000;342:1581</span>
                    </div>
                 )}

                 {tab === 'na' && res.type === 'hipo' && (
                   <div className="space-y-4">
                     {/* Kartu terapi utama — di-gate oleh keparahan GEJALA, bukan angka Na (Spasovski 2014) */}
                     {naSeverity === 'berat' && (
                       <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-left">
                         <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold mb-2">
                           <AlertTriangle className="w-5 h-5" />
                           GEJALA BERAT — PROTOKOL BOLUS 3% SEGERA
                         </div>
                         <div className="text-[13px] text-red-800 dark:text-red-300 space-y-1">
                           <ul className="list-disc pl-4 space-y-1 font-medium mt-1 bg-red-100/50 dark:bg-red-900/40 p-3 rounded-lg border border-red-200 dark:border-red-800/60">
                             <li><strong>Bolus NaCl 3%: 150 mL IV dalam 20 menit</strong> (alternatif 100 mL/10 menit).</li>
                             <li>Cek Na ulang tiap 20 menit; ulangi bolus hingga 2–3× sampai gejala membaik atau Na naik ~5 mEq/L.</li>
                             <li>Target jam pertama: <strong>+4–6 mEq/L</strong> untuk menghentikan krisis serebral — <strong>bukan</strong> menormalkan Na.</li>
                             <li>Setelah krisis reda: STOP hipertonik. Total kenaikan <strong>≤ {res.lim.limit24} mEq/L / 24 jam</strong> (plafon ODS).</li>
                           </ul>
                           <p className="mt-3 text-[11px] italic opacity-80 border-t border-red-200 dark:border-red-800/50 pt-2">📚 Spasovski G. NDT 2014;29(Suppl 2):i1 · Sterns RH. NEJM 2015;372:55</p>
                         </div>
                       </div>
                     )}

                     {naSeverity === 'sedang' && (
                       <div className="w-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-left">
                         <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold mb-2">
                           <AlertTriangle className="w-5 h-5" />
                           GEJALA SEDANG — INFUS TUNGGAL 3%
                         </div>
                         <div className="text-[13px] text-amber-800 dark:text-amber-300 space-y-1">
                           <ul className="list-disc pl-4 space-y-1 font-medium mt-1 bg-amber-100/40 dark:bg-amber-900/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800/60">
                             <li><strong>Infus tunggal NaCl 3% 150 mL dalam 20 menit</strong>, lalu cek Na ulang & re-evaluasi.</li>
                             <li>Target kenaikan {res.lim.goalLo}–{res.lim.goalHi} mEq/L / 24 jam; plafon <strong>≤ {res.lim.limit24} mEq/L / 24 jam</strong>.</li>
                             <li>Cari & atasi penyebab bersamaan (obat pemicu, SIADH, status volume).</li>
                           </ul>
                           <p className="mt-3 text-[11px] italic opacity-80 border-t border-amber-200 dark:border-amber-800/50 pt-2">📚 Spasovski G. NDT 2014;29(Suppl 2):i1</p>
                         </div>
                       </div>
                     )}

                     {naSeverity === 'ringan' && (
                       <div className="w-full bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 text-left">
                         <div className="flex items-start gap-2 text-emerald-800 dark:text-emerald-300 text-[13px]">
                           <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                           <div>
                             <strong className="block mb-1">Ringan / asimtomatik — NaCl 3% TIDAK rutin diindikasikan</strong>
                             <p className="leading-relaxed mb-2">Prioritas: <strong>cari & atasi penyebab</strong>, hentikan obat/cairan hipotonik pemicu. Pilih terapi sesuai status volume:</p>
                             <ul className="list-disc pl-4 space-y-1">
                               <li><strong>Hipovolemik</strong> → NaCl 0.9% (isotonik) + atasi sumber kehilangan.</li>
                               <li><strong>Euvolemik / SIADH</strong> → restriksi cairan (mis. &lt;800–1000 mL/hari).</li>
                               <li><strong>Hipervolemik</strong> (gagal jantung/sirosis) → restriksi cairan + terapi penyakit dasar.</li>
                             </ul>
                             <p className="mt-2 leading-relaxed"><strong>Pengecualian:</strong> bila penurunan <strong>akut</strong> terdokumentasi &gt;10 mEq/L meski gejala ringan, pertimbangkan infus tunggal 150 mL 3%.</p>
                             {res.isProfound && <p className="mt-2 text-[12px] font-semibold text-emerald-900 dark:text-emerald-200">Na &lt;125 (profound): tetap perlu evaluasi & mungkin koreksi lambat hati-hati — pertimbangkan konsul.</p>}
                             <p className="mt-2 text-[11px] italic opacity-80">📚 Spasovski G. NDT 2014;29(Suppl 2):i1 · Verbalis JG. Am J Med 2013;126:S1</p>
                           </div>
                         </div>
                       </div>
                     )}

                     {res.highOdsRisk && (
                       <div className="w-full bg-rose-50 dark:bg-rose-900/15 border border-rose-200 dark:border-rose-800/60 rounded-xl p-3 text-[12px] text-rose-800 dark:text-rose-300">
                         <strong className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Risiko tinggi ODS ({[res.odsAuto ? 'Na ≤105' : null, ...odsFactors].filter(Boolean).join(', ')})</strong>
                         <p className="mt-1 leading-relaxed">Batasi kenaikan Na <strong>≤8 mEq/L / 24 jam</strong>. Target dianjurkan {res.lim.goalLo}–{res.lim.goalHi} mEq/L/24 jam. Faktor risiko: Na ≤105, hipokalemia, alkoholisme, malnutrisi, penyakit hati lanjut (centang di input). <span className="italic opacity-80">📚 Sterns RH. NEJM 2015 · Verbalis JG. Am J Med 2013</span></p>
                       </div>
                     )}

                     {hypoNaFlow && <StrategyFlow steps={hypoNaFlow} />}

                     {(() => { const calcBox = (
                     <div className="w-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-5 flex flex-col items-start text-left">
                       <div className="text-[13px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3 w-full border-b border-blue-200 dark:border-blue-800/50 pb-2">
                         Estimasi Koreksi Lambat &amp; Batas Aman ({onset === 'akut' ? 'Akut' : 'Kronik'})
                       </div>
                       
                       <div className="text-[13px] text-blue-900 dark:text-blue-200 space-y-4 w-full">
                         <div>
                           <strong className="text-[14px] text-blue-700 dark:text-blue-400 block mb-1">Target Koreksi Aman (Batas 24 Jam)</strong>
                           <p>Peningkatan maksimal yang direkomendasikan untuk mencegah <em>Osmotic Demyelination Syndrome (ODS)</em>:</p>
                           <ul className="list-disc pl-4 mt-1 font-semibold">
                             <li>Target pilihan Anda: <strong>+{res.rise} mEq/L / 24 jam</strong> (anjuran {res.lim.goalLo}–{res.lim.goalHi}).</li>
                             <li>Batas absolut: <strong>{res.lim.limit24} mEq/L</strong> di 24 jam pertama, lalu <strong>{res.lim.limitNext24} mEq/L</strong> tiap 24 jam berikutnya.</li>
                             <li>Target Na 24 jam: <strong>~{res.tgt} mEq/L</strong> (dari {res.calcN} mEq/L).</li>
                           </ul>
                           {res.riseOverLimit && <p className="mt-2 text-[12px] font-bold text-red-700 dark:text-red-400">⚠ Target +{res.rise} melebihi batas {res.lim.limit24} mEq/L/24 jam{res.highOdsRisk ? ' untuk pasien risiko ODS tinggi' : ''} — turunkan target.</p>}
                           {!res.riseOverLimit && res.riseOverGoal && <p className="mt-2 text-[12px] text-amber-700 dark:text-amber-400">Target di atas anjuran {res.lim.goalLo}–{res.lim.goalHi} mEq/L; masih di bawah batas, tetapi sisakan ruang untuk kenaikan tak terduga (diuresis air).</p>}
                         </div>

                         <div>
                           <strong className="text-[14px] text-blue-700 dark:text-blue-400 block mb-1">Resep NaCl 3% (Hipertonis)</strong>
                           <div className="bg-white/60 dark:bg-black/30 rounded-xl p-3 mt-1 border border-blue-200 dark:border-blue-900/50">
                             <div className="text-[11px] uppercase tracking-wide font-semibold text-blue-600/80 dark:text-blue-400/80 mb-1">Estimasi Kebutuhan Volume (Rentang 2 Metode)</div>
                             <div className="font-mono text-2xl font-bold mb-1 text-blue-700 dark:text-blue-300">
                               {Math.min(parseFloat(res.v), parseFloat(res.vAM))} – {Math.max(parseFloat(res.v), parseFloat(res.vAM))} <span className="text-[16px] text-blue-500 font-sans font-medium">mL</span>
                             </div>
                             <div className="grid grid-cols-2 gap-2 mt-2 text-[12px]">
                               <div className="bg-blue-100/40 dark:bg-blue-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800/50">
                                 <div className="font-bold text-blue-800 dark:text-blue-300">Metode Defisit</div>
                                 <div className="font-mono">{res.v} mL</div>
                                 <div className="text-[11px]">Laju {res.rate} mL/jam · 24 jam</div>
                                 <div className="text-[10px] italic opacity-70">konservatif (batas bawah)</div>
                               </div>
                               <div className="bg-blue-100/40 dark:bg-blue-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800/50">
                                 <div className="font-bold text-blue-800 dark:text-blue-300">Adrogué–Madías</div>
                                 <div className="font-mono">{res.vAM} mL</div>
                                 <div className="text-[11px]">Laju {res.rateAM} mL/jam · 24 jam</div>
                                 <div className="text-[10px] italic opacity-70">memperhitungkan dilusi (batas atas)</div>
                               </div>
                             </div>
                             <p className="mt-2 text-[12px]">Batas atas laju absolut: <strong>{res.rateMax} mL/jam</strong> (setara kecepatan koreksi 0.5 mEq/L/jam) — jangan dilampaui di luar kondisi emergensi bergejala.</p>
                             <p className="text-[11px] mt-1 italic text-blue-700/80">Mulai dari estimasi lebih rendah, titrasi berdasarkan Na serial. Gunakan vena sentral jika memungkinkan. Periksa Na tiap 4-6 jam.</p>
                           </div>
                         </div>

                         <div>
                           <strong className="text-[14px] text-blue-700 dark:text-blue-400 block mb-1">🧮 Rincian Perhitungan (Langkah demi Langkah)</strong>
                           <div className="bg-white/60 dark:bg-black/30 rounded-xl p-3 mt-1 border border-blue-200 dark:border-blue-900/50 space-y-2.5 text-[12.5px]">
                             {res.hasHyper && (
                               <div>
                                 <p className="font-bold">Langkah 0 — Koreksi Na terhadap hiperglikemia (Katz/Hillier):</p>
                                 <p className="font-mono text-[11.5px] mt-0.5 pl-2 border-l-2 border-blue-300 dark:border-blue-700">Na terkoreksi = Na terukur + 1.6 × (Glukosa − 100)/100<br/>= {na} + 1.6 × ({glu} − 100)/100 = <strong>{res.calcN} mEq/L</strong></p>
                               </div>
                             )}
                             <div>
                               <p className="font-bold">Langkah 1 — Total Body Water (TBW):</p>
                               <p className="font-mono text-[11.5px] mt-0.5 pl-2 border-l-2 border-blue-300 dark:border-blue-700">TBW = {res.tbwF} × BB = {res.tbwF} × {res.w} kg = <strong>{res.tbw} L</strong></p>
                               <p className="text-[11px] italic opacity-80 mt-0.5">Faktor {res.tbwF} ({sex === 'm' ? 'pria' : 'wanita'}{age ? `, ${age} th` : ''}; lansia ≥65 th memakai faktor lebih kecil).</p>
                             </div>
                             <div>
                               <p className="font-bold">Langkah 2 — Target kenaikan Na ({onset === 'akut' ? 'akut' : 'kronik'}):</p>
                               <p className="font-mono text-[11.5px] mt-0.5 pl-2 border-l-2 border-blue-300 dark:border-blue-700">ΔNa = {res.d} mEq/L (anjuran {res.lim.goalLo}–{res.lim.goalHi}; batas {res.lim.limit24} per 24 jam{res.highOdsRisk ? ', risiko ODS tinggi' : ''})<br/>Target Na = {res.calcN} + {res.d} = <strong>{res.tgt} mEq/L</strong></p>
                               {onset === 'akut' && <p className="text-[11px] italic opacity-80 mt-0.5">Onset akut (&lt;48 jam) terdokumentasi: otak belum beradaptasi → risiko ODS rendah; bahaya utama edema serebri.</p>}
                             </div>
                             <div>
                               <p className="font-bold">Langkah 3 — Defisit natrium yang perlu diberikan:</p>
                               <p className="font-mono text-[11.5px] mt-0.5 pl-2 border-l-2 border-blue-300 dark:border-blue-700">Defisit Na = TBW × ΔNa = {res.tbw} × {res.d} = <strong>{res.deficit} mEq</strong></p>
                             </div>
                             <div>
                               <p className="font-bold">Langkah 4a — Volume via Metode Defisit:</p>
                               <p className="font-mono text-[11.5px] mt-0.5 pl-2 border-l-2 border-blue-300 dark:border-blue-700">NaCl 3% mengandung 513 mEq Na per liter.<br/>Volume = {res.deficit} ÷ 513 × 1000 = <strong>{res.v} mL</strong></p>
                             </div>
                             <div>
                               <p className="font-bold">Langkah 4b — Volume via Adrogué–Madías:</p>
                               <p className="font-mono text-[11.5px] mt-0.5 pl-2 border-l-2 border-blue-300 dark:border-blue-700">Kenaikan Na per 1 L NaCl 3% = (513 − Na)/(TBW + 1)<br/>= (513 − {res.calcN})/({res.tbw} + 1) = <strong>{res.amPerLiter} mEq/L per L</strong><br/>Volume = ΔNa ÷ {res.amPerLiter} × 1000 = {res.d} ÷ {res.amPerLiter} × 1000 = <strong>{res.vAM} mL</strong></p>
                               <p className="text-[11px] italic opacity-80 mt-0.5">Metode ini memperhitungkan dilusi cairan yang ikut masuk, sehingga volumenya lebih tinggi dari metode defisit.</p>
                             </div>
                             <div>
                               <p className="font-bold">Langkah 5 — Laju infus:</p>
                               <p className="font-mono text-[11.5px] mt-0.5 pl-2 border-l-2 border-blue-300 dark:border-blue-700">Defisit: {res.v} ÷ 24 = <strong>{res.rate} mL/jam</strong> · Adrogué: {res.vAM} ÷ 24 = <strong>{res.rateAM} mL/jam</strong></p>
                               <p className="text-[11px] italic opacity-80 mt-0.5">Diberikan merata 24 jam supaya kecepatan kenaikan Na ({res.d}/24 ≈ {(parseFloat(res.d) / 24).toFixed(2)} mEq/L/jam) jauh di bawah batas 0.5 mEq/L/jam.</p>
                             </div>
                             <p className="text-[11px] italic opacity-70 border-t border-blue-200 dark:border-blue-800/50 pt-2">Kedua rumus adalah estimasi awal — respons nyata dipengaruhi output urin dan penyebab hiponatremia. Mulai dari estimasi lebih rendah dan nilai ulang dengan hasil Na serial tiap 4-6 jam.</p>
                           </div>
                         </div>
                       </div>
                       
                       <p className="mt-4 text-[11px] italic text-blue-700/70 dark:text-blue-300/70 w-full text-center border-t border-blue-200 dark:border-blue-800/50 pt-3">
                         📚 Adrogué HJ, Madias NE. NEJM 2000;342:1581 &middot; Sterns RH. NEJM 2015;372:55 &middot; Adrogué HJ, Tucker BM, Madias NE. JAMA 2022;328:280
                       </p>
                     </div>
                     ); return naSeverity === 'ringan'
                       ? <Accordion title="🧮 Estimasi koreksi lambat NaCl 3% (buka bila koreksi aktif diputuskan)">{calcBox}</Accordion>
                       : calcBox; })()}

                     <Accordion title="⚠ Rescue Protocol (Overcorrection)">
                       <div className="text-[12px] text-slate-700 dark:text-slate-300 space-y-2">
                         <p>Jika Na naik &gt; 8-10 mEq/L dalam 24 jam (risiko ODS tinggi):</p>
                         <ol className="list-decimal pl-4 space-y-1">
                           <li><strong>STOP</strong> semua cairan saline hiperaktif (NaCl 3%).</li>
                           <li><strong>Konsul ICU/Nefrologi segera.</strong></li>
                           <li><strong>DDAVP (Desmopressin):</strong> 2–4 &mu;g SC/IV tiap 6–8 jam (menghentikan water loss ginjal).</li>
                           <li><strong>D5W (Dekstrosa 5%):</strong> infus lambat (3 mL/kg/jam) untuk "re-lower" Na.</li>
                           <li>Target: Na absolut tidak melebihi (Na Awal + 8) mEq/L dalam 24 jam pertama.</li>
                         </ol>
                         <p className="pt-2 text-[11px] italic opacity-80 border-t border-slate-200 dark:border-slate-700 mt-2">📚 Verbalis JG et al. Am J Med 2013;126:S1-42</p>
                       </div>
                     </Accordion>
                   </div>
                 )}

                 {tab === 'na' && res.type === 'hiper' && (
                   <div className="space-y-4">
                     {hyperNaFlow && <StrategyFlow steps={hyperNaFlow} />}
                     <div className="w-full bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-5 flex flex-col items-start text-left">
                       <div className="text-[13px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-3 w-full border-b border-red-200 dark:border-red-800/50 pb-2">
                         Koreksi Hipernatremia {onset === 'akut' ? '(Akut)' : '(Kronik / Tidak tahu)'}
                       </div>

                       <div className="font-mono text-3xl font-bold mb-1 text-red-700 dark:text-red-300">
                         Defisit Air Bebas : {res.deficit} <span className="text-[16px] text-red-500 font-sans font-medium">L</span>
                       </div>
                       <p className="text-[12px] text-red-700/80 dark:text-red-300/80">ΔNa menuju target {res.targetNa} = {res.totalDrop} mEq/L · butuh ± <strong>{res.days} hari</strong> pada laju aman.</p>

                       <div className="text-[13px] text-red-900 dark:text-red-200 space-y-4 w-full mt-4">
                         {/* Kecepatan koreksi — batas aman */}
                         <div className="bg-white/60 dark:bg-black/30 rounded-xl p-3 border border-red-200 dark:border-red-900/50">
                           <strong className="text-[14px] text-red-700 dark:text-red-400 block mb-1">Kecepatan Koreksi — batas aman</strong>
                           <ul className="list-disc pl-4 space-y-1">
                             <li>Batas pilihan Anda: <strong>{res.maxDropPer24} mEq/L / 24 jam</strong> ({(res.maxDropPer24 / 24).toFixed(2)} mEq/L/jam) {onset === 'akut' ? '— akut <48 jam boleh ~1 mEq/L/jam' : '— kronik ≤10 mEq/L/24 jam (~0.5/jam)'} untuk mencegah edema serebri.</li>
                             {res.dropOverGuideline && <li className="font-bold text-red-700 dark:text-red-400">⚠ Melebihi batas pedoman hipernatremia kronik (≤10 mEq/L/24 jam). Bukti observasional terbaru belum konsisten (Chauhan 2019: koreksi cepat tidak terkait edema serebri; Chacon-Palma 2025: koreksi lambat terkait mortalitas lebih rendah) — ikuti pedoman kecuali ada alasan kuat.</li>}
                             <li>Hari ini cukup turunkan <strong>{res.targetDrop} mEq/L</strong>; sisanya lanjut hari berikutnya.</li>
                             <li className="text-[11px] italic opacity-80">Jika ragu onset → perlakukan sebagai KRONIK (lebih lambat, lebih aman).</li>
                           </ul>
                         </div>

                         {/* Cairan terpilih — Adrogué–Madías */}
                         <div className="bg-white/60 dark:bg-black/30 rounded-xl p-3 border border-red-200 dark:border-red-900/50">
                           <strong className="text-[14px] text-red-700 dark:text-red-400 block mb-1">Cairan: {res.fluidLabel} ({res.fluidNa} mEq/L)</strong>
                           {res.lowersNa ? (
                             <>
                               <p>Prediksi Adrogué–Madías: 1 L menurunkan Na <strong>{Math.abs(parseFloat(res.dNaPerL)).toFixed(2)} mEq/L</strong>.</p>
                               <p className="mt-1">Untuk penurunan {res.targetDrop} mEq/L hari ini: <strong>{res.volForTarget} L / 24 jam</strong> → laju ± <strong>{res.rateMlHr} mL/jam</strong>.</p>
                               <p className="text-[11px] italic opacity-80 mt-1">Belum termasuk IWL (~30–40 mL/jam) & ongoing losses — tambahkan pada laju total. {res.fluidNote}</p>
                             </>
                           ) : (
                             <div className="text-amber-700 dark:text-amber-400">
                               <p><strong>NaCl 0.9% tidak menurunkan Na</strong> pada Na &lt; 154 (ΔNa/L = +{res.dNaPerL}). Gunakan hanya untuk resusitasi hipovolemia sampai stabil, lalu ganti ke air bebas (D5W/oral/0.45%).</p>
                             </div>
                           )}
                         </div>

                         {/* Rincian langkah */}
                         <div>
                           <strong className="text-[14px] text-red-700 dark:text-red-400 block mb-1">🧮 Rincian Perhitungan (Langkah demi Langkah)</strong>
                           <div className="bg-white/60 dark:bg-black/30 rounded-xl p-3 mt-1 border border-red-200 dark:border-red-900/50 space-y-2.5 text-[12.5px]">
                             {res.hasHyper && (
                               <div>
                                 <p className="font-bold">Langkah 0 — Koreksi Na terhadap hiperglikemia:</p>
                                 <p className="font-mono text-[11.5px] mt-0.5 pl-2 border-l-2 border-red-300 dark:border-red-700">Na terkoreksi = {na} + 1.6 × ({glu} − 100)/100 = <strong>{res.calcN} mEq/L</strong></p>
                               </div>
                             )}
                             <div>
                               <p className="font-bold">Langkah 1 — Total Body Water (TBW):</p>
                               <p className="font-mono text-[11.5px] mt-0.5 pl-2 border-l-2 border-red-300 dark:border-red-700">TBW = {res.tbwF} × {res.w} kg = <strong>{res.tbw} L</strong></p>
                               <p className="text-[11px] italic opacity-80 mt-0.5">Faktor {res.tbwF} ({sex === 'm' ? 'pria' : 'wanita'}{age ? `, ${age} th` : ''}). Pada dehidrasi berat, TBW nyata bisa lebih rendah.</p>
                             </div>
                             <div>
                               <p className="font-bold">Langkah 2 — Defisit air bebas:</p>
                               <p className="font-mono text-[11.5px] mt-0.5 pl-2 border-l-2 border-red-300 dark:border-red-700">Defisit = TBW × (Na ÷ Na target − 1) = {res.tbw} × ({res.calcN} ÷ {res.targetNa} − 1) = <strong>{res.deficit} L</strong></p>
                             </div>
                             <div>
                               <p className="font-bold">Langkah 3 — Prediksi efek cairan (Adrogué–Madías):</p>
                               <p className="font-mono text-[11.5px] mt-0.5 pl-2 border-l-2 border-red-300 dark:border-red-700">ΔNa/L = (Na infusat − Na serum) ÷ (TBW + 1)<br/>= ({res.fluidNa} − {res.calcN}) ÷ ({res.tbw} + 1) = <strong>{res.dNaPerL} mEq/L per L</strong></p>
                             </div>
                             {res.lowersNa && (
                               <div>
                                 <p className="font-bold">Langkah 4 — Volume & laju hari ini:</p>
                                 <p className="font-mono text-[11.5px] mt-0.5 pl-2 border-l-2 border-red-300 dark:border-red-700">Volume = target drop ÷ |ΔNa/L| = {res.targetDrop} ÷ {Math.abs(parseFloat(res.dNaPerL)).toFixed(2)} = <strong>{res.volForTarget} L</strong> → {res.rateMlHr} mL/jam</p>
                               </div>
                             )}
                             <p className="text-[11px] italic opacity-70 border-t border-red-200 dark:border-red-800/50 pt-2">Estimasi awal (sistem tertutup, tak hitung ongoing losses). <strong>Cek Na tiap 2–4 jam & hitung ULANG defisit dengan Na terbaru</strong> — jangan sekali di awal.</p>
                           </div>
                         </div>

                         {/* Klasifikasi status volume & penyebab */}
                         <Accordion title="🔎 Klasifikasi Status Volume & Penyebab">
                           <div className="text-[12px] space-y-2 text-slate-700 dark:text-slate-300">
                             <p><strong>Hipovolemik</strong> (defisit air &gt; Na): GI losses, diuretik, luka bakar, diuresis osmotik (DKA/HHS, manitol) → NaCl 0.9% dulu bila syok, lalu air bebas.</p>
                             <p><strong>Euvolemik:</strong> Diabetes Insipidus (sentral: defisit ADH → <em>desmopressin</em>; nefrogenik: ginjal tak respons ADH → <em>tiazid + NSAID</em>), insensible losses.</p>
                             <p><strong>Hipervolemik</strong> (biasanya iatrogenik): NaHCO₃ hipertonik, NaCl 3%/HTS, resusitasi tinggi Na → hentikan sumber, ± diuretik.</p>
                             <p className="pt-1 border-t border-slate-200 dark:border-slate-700"><strong>Evaluasi osmolalitas urin:</strong> &lt;300 mOsm/kg → curiga DI (uji desmopressin bedakan sentral vs nefrogenik); &gt;800 → kehilangan ekstrarenal; 300–800 → kehilangan renal parsial.</p>
                           </div>
                         </Accordion>

                         {/* Interaksi oliguria/AKI */}
                         <Accordion title="⚠ Interaksi dengan Oliguria / AKI">
                           <div className="text-[12px] space-y-2 text-slate-700 dark:text-slate-300">
                             <p>Volume koreksi bisa besar (liter/24 jam). Bila UOP tidak mengimbangi (khususnya AKI intrinsik/ATN), risiko <strong>volume overload</strong> nyata.</p>
                             <p>Bedakan: <strong>pre-renal</strong> (butuh cairan, jangan dibatasi) · <strong>intrinsik</strong> (rencana volume dikompromikan dengan balans) · <strong>post-renal</strong> (atasi obstruksi).</p>
                             <p>Pada AKI oliguria dengan kebutuhan koreksi Na signifikan, <strong>CRRT</strong> dapat menangani volume + kecepatan koreksi Na sekaligus.</p>
                           </div>
                         </Accordion>

                         <div className="bg-white/60 dark:bg-black/30 rounded-xl p-3 border border-red-200 dark:border-red-900/50">
                           <div className="font-bold mb-1 text-red-800 dark:text-red-300">Monitoring</div>
                           <p>Na serum tiap <strong>2–4 jam</strong> selama koreksi aktif · hitung ulang defisit berkala · awasi tanda edema serebri (nyeri kepala, mual, penurunan kesadaran, kejang) bila kecepatan terlampaui.</p>
                         </div>
                       </div>

                       <p className="mt-4 text-[11px] italic text-red-700/70 dark:text-red-400/70 w-full text-center border-t border-red-200 dark:border-red-800/50 pt-3">
                         📚 Adrogué HJ, Madias NE. NEJM 2000;342:1493 &middot; Sterns RH. NEJM 2015;372:55 &middot; Miller NE, et al. Am Fam Physician 2023;108:476
                       </p>
                       <p className="mt-2 text-[10px] italic text-slate-500 dark:text-slate-400 w-full text-center">Alat bantu edukasi &amp; referensi cepat — bukan pengganti penilaian klinis atau keputusan DPJP.</p>
                     </div>
                   </div>
                 )}

                 {(res.type === 'normal') && (
                   <div className="w-full bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                     <span className="font-bold text-[15px] text-emerald-700 dark:text-emerald-400">✅ Kadar Elektrolit Normal</span>
                     {tab === 'na' && res.hasHyper && (
                       <span className="text-[12px] text-emerald-600 dark:text-emerald-500 mt-1">
                         (Na Terkoreksi glukosa: {res.calcN} mEq/L)
                       </span>
                     )}
                   </div>
                 )}

                 <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#2C2C2E]">
                    <SaveToHistoryButton 
                      module="elektrolit" 
                      label="Koreksi Elektrolit — NA"
                      inputs={{ 
                        tab, bw, na, glu, onset, sex, age, naFluid, naRise, hyperTarget, hyperDrop,
                        gejala: [...symptoms], risikoODS: [...odsFactors],
                      }}
                      summary={
                        `Na: ${na} mEq/L, ${res.type === 'hipo' ? `target +${res.d}/24 jam → ${res.tgt}; NaCl 3% ${res.v}–${res.vAM} mL (gejala ${naSeverity})` : res.type === 'hiper' ? `Defisit air -> ${res.deficit}L menuju ${res.targetNa} (${res.fluidLabel}), turun ${res.targetDrop}/24 jam` : 'Normal'}`
                      }
                      className="w-full"
                    />
                  </div>
               </div>
            )}
         </div>
      </div>

      <Accordion title="📖 Teori & Referensi: Koreksi Elektrolit">
        <ul className="pl-4 space-y-1 list-disc text-muted-foreground text-sm">
          <li><strong className="text-foreground">Hiponatremia — dua sumbu keparahan:</strong> (1) biokimia: ringan 130–135, sedang 125–129, berat/profound &lt;125 mEq/L; (2) gejala. Keduanya bisa tidak sejalan — dan <strong>indikasi NaCl 3% ditentukan oleh GEJALA, bukan angka</strong>. Gejala berat: muntah, distres kardiorespirasi, kejang, penurunan kesadaran/koma. Gejala sedang: mual tanpa muntah, bingung, nyeri kepala. <em>(Spasovski 2014)</em></li>
          <li><strong className="text-foreground">Patofisiologi & dasar risiko ODS:</strong> Pada hiponatremia <strong>kronik</strong> (&gt;48 jam) otak beradaptasi dengan mengeluarkan osmol; koreksi terlalu cepat → <em>Osmotic Demyelination Syndrome</em>. Pada <strong>akut</strong> (&lt;48 jam) otak belum beradaptasi → risiko ODS rendah, bahaya utama justru edema serebri. Karena itu onset akut/kronik menentukan <strong>kecepatan aman</strong>, bukan apakah pakai 3%. <em>(Sterns 2015)</em></li>
          <li><strong className="text-foreground">Terapi berbasis gejala:</strong> Berat → bolus NaCl 3% 150 mL/20 mnt (ulangi s/d +5 mEq/L atau gejala reda; target jam-1 +4–6). Sedang → infus tunggal 150 mL 3%, lalu re-evaluasi. Ringan/asimtomatik → <strong>bukan 3%</strong>: atasi penyebab; hipovolemik→NaCl 0.9%, euvolemik/SIADH→restriksi cairan, hipervolemik→restriksi + penyakit dasar. <em>(Spasovski 2014; Verbalis 2013)</em></li>
          <li><strong className="text-foreground">Plafon kecepatan & ODS:</strong> Batas ≤10 mEq/L/24 jam (≤8 pada risiko tinggi: Na ≤105, hipokalemia, alkoholisme, malnutrisi, penyakit hati lanjut) berlaku di <strong>semua</strong> mode — yang berubah menurut gejala adalah target & metode, bukan plafon. Bila overcorrection: STOP hipertonik, D5W ± desmopressin (DDAVP) untuk re-lowering. <em>(Sterns 2015; Verbalis 2013)</em></li>
          <li><strong className="text-foreground">Dua rumus estimasi (koreksi lambat):</strong> Metode defisit = TBW × ΔNa ÷ 513 (TBW = 0.6 × BB pria / 0.5 × BB wanita); Adrogué–Madías = ΔNa per 1 L 3% = (513 − Na)/(TBW+1). Keduanya estimasi kasar yang sering meleset (mengabaikan output urin/diuresis air) → <strong>wajib ukur Na serial tiap 4–6 jam</strong>. <em>(Adrogué–Madías 2000; Sterns 2015)</em></li>
          <li><strong className="text-foreground">Hipernatremia — definisi & penyebab:</strong> Na &gt;145 mEq/L (berat &gt;160). Hampir selalu mencerminkan <strong>defisit air relatif</strong>, bukan kelebihan natrium murni. Klasifikasi status volume: hipovolemik (GI losses, diuretik, luka bakar, diuresis osmotik DKA/HHS/manitol) · euvolemik (Diabetes Insipidus sentral/nefrogenik, insensible losses) · hipervolemik (iatrogenik: NaHCO₃/NaCl 3%). <em>(Miller 2023; Adrogué–Madías 2000)</em></li>
          <li><strong className="text-foreground">Hipernatremia — evaluasi & tatalaksana:</strong> Osmolalitas urin &lt;300 curiga DI (uji desmopressin: sentral vs nefrogenik), &gt;800 kehilangan ekstrarenal, 300–800 renal parsial. Empat langkah: (1) defisit air = TBW × (Na/140 − 1); TBW = BB × 0.6 (pria dewasa)/0.5 (wanita dewasa/pria lansia)/0.45 (wanita lansia); (2) kecepatan — kronik/tak tahu maks 8–10 mEq/L/24 jam (~0.5/jam), akut boleh ~1/jam (jika ragu → kronik); (3) cairan: air oral/NGT &gt; D5W &gt; NaCl 0.45% &gt; NaCl 0.9% dulu bila hipovolemia berat — prediksi Adrogué–Madías ΔNa/L = (Na infusat − Na serum)/(TBW+1); (4) atasi penyebab (DI sentral→desmopressin, nefrogenik→tiazid+NSAID). <strong>Cek Na tiap 2–4 jam & hitung ULANG defisit</strong>. Pada AKI oliguria, CRRT dapat menangani volume + kecepatan sekaligus. <em>(Adrogué–Madías 2000; Sterns 2015; Miller 2023)</em></li>
          <li><strong className="text-foreground">Bukti terbaru kecepatan koreksi Na:</strong> Meta-analisis 7 kohort (6.032 pasien hiponatremia berat): ODS 0.48%; koreksi cepat meningkatkan risiko ODS (RR 3.9) tetapi berkaitan dengan mortalitas RS lebih rendah (RR 0.51) — ODS juga dapat terjadi pada koreksi lambat <em>(See 2024)</em>. Batas pedoman tetap dipakai; jangan menunda terapi gejala berat demi "terlalu hati-hati". Pada hipernatremia, data observasional bertentangan (Chauhan 2019 vs Chacon-Palma 2025).</li>
          <li><strong className="text-foreground">Kalium — hipokalemia:</strong> Berat &lt;2.5 mEq/L. Tiap turun 1 mEq/L ≈ defisit 200–400 mEq (gambaran, bisa meleset). K 2.5–3.4 tanpa gejala/EKG → oral; &lt;2.5, bergejala, EKG berubah, atau tidak bisa oral → IV dengan monitor EKG. Empiris di ICU: 20 mEq KCl ≈ +0.25 mmol/L. Pelarut NaCl 0.9% (bukan dekstrosa). Koreksi Mg bersamaan. Target: rentang normal 3.5–5.0; IMA mortalitas terendah 3.5–&lt;4.5; pasca-CABG suplementasi hanya bila &lt;3.6. <em>(Kardalas 2018; Kruse 1990; Goyal 2012; TIGHT-K 2024)</em></li>
          <li><strong className="text-foreground">Kalium — hiperkalemia:</strong> Verifikasi (pseudohiperkalemia) → Ca glukonat 10% <strong>30 mL</strong> bila EKG berubah/K ≥6.5 → insulin 10 U (5 U pada gangguan ginjal berat) + dekstrosa 25 g (+ D10% 50 mL/jam × 5 jam bila GDS &lt;7 mmol/L) + salbutamol 10–20 mg nebul → keluarkan K (dialisis bila refrakter) → pantau K 1–2 j & 2–4 j, GDS tiap 30 mnt × 2 j lalu tiap jam ≥6 j. NaHCO₃ dan binder oral bukan terapi akut rutin. <em>(Ford 2026; Jessen 2025)</em></li>
          <li><strong className="text-foreground">Kalsium:</strong> Ca terkoreksi = Ca + 0.8 × (4.0 − albumin) — hanya perkiraan; gunakan Ca ion bila ada. Berat = &lt;1.9 mmol/L (7.6 mg/dL) dan/atau bergejala → Ca glukonat 10% 10–20 mL/10 menit lalu infus 100 mL/1 L @50–100 mL/jam; koreksi Mg. Hiperkalsemia: NaCl 0.9% 4–6 L/24 jam → bisfosfonat IV; diuretik loop hanya bila overload. <em>(SfE 2016)</em></li>
          <li><strong className="text-foreground">Magnesium:</strong> Mg serum tidak mencerminkan Mg tubuh total. IV bila &lt;0.5 mmol/L (≈1.2 mg/dL) atau bergejala; 1 g MgSO₄ ≈ +0.15 mEq/L (18–30 jam); maksimal 1.5 mEq/kg; &lt;6 g dalam 8–12 jam. Aritmia tidak stabil: 2 g dalam 2–15 menit. Gangguan ginjal: sesuaikan & pantau. <em>(Hansen 2018)</em></li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 <strong>Hiponatremia:</strong> Spasovski G, et al. Eur J Endocrinol 2014;170:G1 / Nephrol Dial Transplant 2014;29(Suppl 2):i1 · Verbalis JG, et al. Am J Med 2013;126(10 Suppl 1):S1 · Adrogué HJ, Madias NE. NEJM 2000;342:1581 · Adrogué HJ, Tucker BM, Madias NE. JAMA 2022;328:280 · See XY, et al. J Crit Care Med 2024;10:209. <strong>Hipernatremia:</strong> Adrogué HJ, Madias NE. NEJM 2000;342:1493 · Miller NE, et al. Am Fam Physician 2023;108:476 · Chauhan K, et al. CJASN 2019;14:656 · Chacon-Palma G, et al. Kidney360 2025;6:1305. <strong>Kalium:</strong> Kardalas E, et al. Endocr Connect 2018;7:R135 · Kruse JA, Carlson RW. Arch Intern Med 1990;150:613 · Goyal A, et al. JAMA 2012;307:157 · O'Brien B, et al. JAMA 2024;332:979 · Ford S, et al. Aust Prescr 2026;49:194 · Jessen MK, et al. Resuscitation 2025;208:110489. <strong>Kalsium:</strong> Turner J, et al. Endocr Connect 2016;5:G7 · Walsh J, et al. Endocr Connect 2016;5:G9. <strong>Magnesium:</strong> Hansen BA, Bruserud Ø. J Intensive Care 2018;6:21. <strong>Umum:</strong> Sterns RH. NEJM 2015;372:55.
        </div>
      </Accordion>
    </div>
  );
}
