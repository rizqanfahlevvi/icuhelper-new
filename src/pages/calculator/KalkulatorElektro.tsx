import { useState, useEffect, useMemo } from 'react';
import { Accordion } from '../../components/ui/Accordion';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';
import { InputWarning } from '../../components/ui/InputWarning';
import { weightPlausibilityWarning, rangeWarning } from '../../utils/validation';
import { computeNa, glucoseCorrectedNa, NA_FLUIDS, type UreaUnit } from '../../utils/sodium';
import { TargetField, ToggleList, useToggleSet, FieldRow, NumField, inputCls } from './components/ElektroUI';
import { NatriumResult } from './components/ElektroNatrium';
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
  // Konfirmasi tonisitas (osmolalitas terhitung dari panel lab rutin)
  const [ureum, setUreum] = useState('');
  const [ureaUnit, setUreaUnit] = useState<UreaUnit>('ureum');
  const [naDirect, setNaDirect] = useState('');          // Na analyzer gas darah (direct ISE)
  const [measuredOsm, setMeasuredOsm] = useState('');    // osmolalitas terukur (bila ada)

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
    if (clinicalStore.data.ureum) setUreum(clinicalStore.data.ureum);
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
    if (clinicalStore.data.ureum) setUreum(clinicalStore.data.ureum);
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

  // ── Perhitungan Natrium (live) — fungsi murni di utils/sodium.ts ─────────
  const naRes = useMemo(() => computeNa({
    weightKg: parseFloat(bw), na: parseFloat(na), glucose: parseFloat(glu),
    sex: sex as 'm' | 'f', age: parseFloat(age), onset, fluidId: naFluid,
    odsRiskFactors: odsFactors.size, riseTarget: parseFloat(naRise),
    hyperTargetNa: parseFloat(hyperTarget), hyperDropPer24: parseFloat(hyperDrop),
    urea: parseFloat(ureum), ureaUnit, measuredOsm: parseFloat(measuredOsm), naDirect: parseFloat(naDirect),
  }), [bw, na, glu, age, sex, onset, naFluid, odsFactors, naRise, hyperTarget, hyperDrop, ureum, ureaUnit, measuredOsm, naDirect]);

  // Na terkoreksi glukosa untuk menentukan input mana yang relevan (hipo vs hiper) sebelum dihitung.
  const naPreview = parseFloat(na) > 0 ? glucoseCorrectedNa(parseFloat(na), parseFloat(glu)).value : NaN;

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
        { key: 'ureum' as const, label: 'Ureum', value: ureum, setter: setUreum, unit: 'mg/dL' },
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
  }, [tab, bw, na, glu, ureum, k, ph, gdsK, ca, alb, caPh, mg]);

  // Keparahan diturunkan LIVE dari checklist gejala → hasil ikut berubah tanpa
  // perlu menekan "Hitung Koreksi" lagi saat gejala di-toggle.
  const naSeverity: 'berat' | 'sedang' | 'ringan' =
    SEVERE_SX.some(s => symptoms.has(s)) ? 'berat'
    : MODERATE_SX.some(s => symptoms.has(s)) ? 'sedang'
    : 'ringan';

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
                <FieldRow label={ureaUnit === 'ureum' ? 'Ureum' : 'BUN'} sub="untuk osmolalitas terhitung">
                  <div className="flex-1 flex items-center justify-end gap-2">
                    <input type="number" value={ureum} onChange={e=>setUreum(e.target.value)} placeholder="Opsional" className={inputCls} />
                    <select value={ureaUnit} onChange={e=>setUreaUnit(e.target.value as UreaUnit)} className="bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-2 py-2 text-[12px] font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                      <option value="ureum">Ureum</option>
                      <option value="bun">BUN</option>
                    </select>
                  </div>
                </FieldRow>
                {naPreview < 135 && (
                  <>
                    <FieldRow label="Na gas darah" sub="analyzer gas darah (direct ISE), opsional">
                      <NumField value={naDirect} onChange={setNaDirect} placeholder="Opsional" unit="mEq/L" />
                    </FieldRow>
                    <FieldRow label="Osm terukur" sub="bila lab memeriksa, opsional">
                      <NumField value={measuredOsm} onChange={setMeasuredOsm} placeholder="Opsional" unit="mOsm" />
                    </FieldRow>
                  </>
                )}
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
              <NatriumResult r={res} na={na} glu={glu} ureum={ureum} ureaUnit={ureaUnit} sex={sex} age={age} onset={onset} naSeverity={naSeverity} odsFactors={odsFactors}
                saveInputs={{ tab, bw, na, glu, ureum, ureaUnit, naDirect, measuredOsm, onset, sex, age, naFluid, naRise, hyperTarget, hyperDrop, gejala: [...symptoms], risikoODS: [...odsFactors] }} />
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
          <li><strong className="text-foreground">Osmolalitas & tonisitas (langkah pertama hiponatremia):</strong> Osm efektif = 2×Na + glukosa/18; osm total = efektif + ureum/6 (BUN/2.8). Urea adalah osmol tidak efektif → yang menentukan tonisitas adalah osm efektif. Osm <strong>terukur</strong> &lt;275 selalu hipotonik; osm <strong>terhitung</strong> &lt;275 belum menyingkirkan osmol tak terukur (manitol, glisin, kontras) maupun pseudohiponatremia <em>(Spasovski 2014)</em>. Pseudohiponatremia: Na lab (indirect ISE) rendah palsu pada lipid/protein tinggi, sedangkan Na analyzer gas darah (direct ISE) tidak terpengaruh; normalnya kedua metode berbeda rata-rata &lt;±1 mmol/L <em>(El Hage 2018; Vera 2022)</em>.</li>
          <li><strong className="text-foreground">Bukti terbaru kecepatan koreksi Na:</strong> Meta-analisis 7 kohort (6.032 pasien hiponatremia berat): ODS 0.48%; koreksi cepat meningkatkan risiko ODS (RR 3.9) tetapi berkaitan dengan mortalitas RS lebih rendah (RR 0.51) — ODS juga dapat terjadi pada koreksi lambat <em>(See 2024)</em>. Batas pedoman tetap dipakai; jangan menunda terapi gejala berat demi "terlalu hati-hati". Pada hipernatremia, data observasional bertentangan (Chauhan 2019 vs Chacon-Palma 2025).</li>
          <li><strong className="text-foreground">Kalium — hipokalemia:</strong> Berat &lt;2.5 mEq/L. Tiap turun 1 mEq/L ≈ defisit 200–400 mEq (gambaran, bisa meleset). K 2.5–3.4 tanpa gejala/EKG → oral; &lt;2.5, bergejala, EKG berubah, atau tidak bisa oral → IV dengan monitor EKG. Empiris di ICU: 20 mEq KCl ≈ +0.25 mmol/L. Pelarut NaCl 0.9% (bukan dekstrosa). Koreksi Mg bersamaan. Target: rentang normal 3.5–5.0; IMA mortalitas terendah 3.5–&lt;4.5; pasca-CABG suplementasi hanya bila &lt;3.6. <em>(Kardalas 2018; Kruse 1990; Goyal 2012; TIGHT-K 2024)</em></li>
          <li><strong className="text-foreground">Kalium — hiperkalemia:</strong> Verifikasi (pseudohiperkalemia) → Ca glukonat 10% <strong>30 mL</strong> bila EKG berubah/K ≥6.5 → insulin 10 U (5 U pada gangguan ginjal berat) + dekstrosa 25 g (+ D10% 50 mL/jam × 5 jam bila GDS &lt;7 mmol/L) + salbutamol 10–20 mg nebul → keluarkan K (dialisis bila refrakter) → pantau K 1–2 j & 2–4 j, GDS tiap 30 mnt × 2 j lalu tiap jam ≥6 j. NaHCO₃ dan binder oral bukan terapi akut rutin. <em>(Ford 2026; Jessen 2025)</em></li>
          <li><strong className="text-foreground">Kalsium:</strong> Ca terkoreksi = Ca + 0.8 × (4.0 − albumin) — hanya perkiraan; gunakan Ca ion bila ada. Berat = &lt;1.9 mmol/L (7.6 mg/dL) dan/atau bergejala → Ca glukonat 10% 10–20 mL/10 menit lalu infus 100 mL/1 L @50–100 mL/jam; koreksi Mg. Hiperkalsemia: NaCl 0.9% 4–6 L/24 jam → bisfosfonat IV; diuretik loop hanya bila overload. <em>(SfE 2016)</em></li>
          <li><strong className="text-foreground">Magnesium:</strong> Mg serum tidak mencerminkan Mg tubuh total. IV bila &lt;0.5 mmol/L (≈1.2 mg/dL) atau bergejala; 1 g MgSO₄ ≈ +0.15 mEq/L (18–30 jam); maksimal 1.5 mEq/kg; &lt;6 g dalam 8–12 jam. Aritmia tidak stabil: 2 g dalam 2–15 menit. Gangguan ginjal: sesuaikan & pantau. <em>(Hansen 2018)</em></li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 <strong>Hiponatremia:</strong> Spasovski G, et al. Eur J Endocrinol 2014;170:G1 / Nephrol Dial Transplant 2014;29(Suppl 2):i1 · Verbalis JG, et al. Am J Med 2013;126(10 Suppl 1):S1 · Adrogué HJ, Madias NE. NEJM 2000;342:1581 · Adrogué HJ, Tucker BM, Madias NE. JAMA 2022;328:280 · See XY, et al. J Crit Care Med 2024;10:209 · El Hage L, et al. AACE Clin Case Rep 2018;5:e172 · Vera MA, et al. Lab Med 2022;53:e105. <strong>Hipernatremia:</strong> Adrogué HJ, Madias NE. NEJM 2000;342:1493 · Miller NE, et al. Am Fam Physician 2023;108:476 · Chauhan K, et al. CJASN 2019;14:656 · Chacon-Palma G, et al. Kidney360 2025;6:1305. <strong>Kalium:</strong> Kardalas E, et al. Endocr Connect 2018;7:R135 · Kruse JA, Carlson RW. Arch Intern Med 1990;150:613 · Goyal A, et al. JAMA 2012;307:157 · O'Brien B, et al. JAMA 2024;332:979 · Ford S, et al. Aust Prescr 2026;49:194 · Jessen MK, et al. Resuscitation 2025;208:110489. <strong>Kalsium:</strong> Turner J, et al. Endocr Connect 2016;5:G7 · Walsh J, et al. Endocr Connect 2016;5:G9. <strong>Magnesium:</strong> Hansen BA, Bruserud Ø. J Intensive Care 2018;6:21. <strong>Umum:</strong> Sterns RH. NEJM 2015;372:55.
        </div>
      </Accordion>
    </div>
  );
}
