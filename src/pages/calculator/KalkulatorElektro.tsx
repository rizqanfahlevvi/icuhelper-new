import React, { useState, useEffect, useMemo } from 'react';
import { Activity, Thermometer, Wind, Beaker, ChevronsRight, AlertTriangle, Info } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { SaveToHistoryButton } from '../../components/ui/SaveToHistoryButton';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';
import { InputWarning } from '../../components/ui/InputWarning';
import { weightPlausibilityWarning, rangeWarning } from '../../utils/validation';
import { tbwFactor, freeWaterDeficit, adrogueDeltaNaPerLiter, NA_FLUIDS } from '../../utils/sodium';

// Klasifikasi gejala hiponatremia (Spasovski 2014, ERBP/ESE/ESICM).
// Indikasi NaCl 3% ditentukan oleh GEJALA, bukan angka natrium semata.
const SEVERE_SX = ['Muntah', 'Distres kardiorespirasi', 'Kejang', 'Kantuk dalam / somnolen abnormal', 'Penurunan kesadaran / koma (GCS ≤8)'];
const MODERATE_SX = ['Mual (tanpa muntah)', 'Bingung / konfusi', 'Nyeri kepala'];

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
  const [symptoms, setSymptoms] = useState<Set<string>>(new Set());
  const toggleSymptom = (s: string) => setSymptoms(prev => {
    const next = new Set(prev);
    next.has(s) ? next.delete(s) : next.add(s);
    return next;
  });
  
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
  const [mgSymp, setMgSymp] = useState('asimtomatik');

  const [res, setRes] = useState<any>(null);

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

    setRes(null);
  };

  const calculate = () => {
    const w = parseFloat(bw);
    if (!w) return;

    if (tab === 'na') {
      const n = parseFloat(na);
      const g = parseFloat(glu);
      if (!n) return;

      let naCorr = n;
      let hasHyperglycemia = false;
      if (!isNaN(g) && g > 100) {
        naCorr = n + 1.6 * ((g - 100) / 100);
        hasHyperglycemia = true;
      }
      
      const calcN = hasHyperglycemia ? naCorr : n;
      const ageNum = parseFloat(age);
      const tbwF = tbwFactor(sex as 'm' | 'f', ageNum);
      const tbw = w * tbwF;
      const naT = 140;

      if (calcN < 135) {
        const limLo = onset === 'akut' ? 10 : 6;
        const limHi = onset === 'akut' ? 12 : 8;
        const tgt = Math.min(calcN + limLo, naT);
        const d = tgt - calcN;
        // Metode 1 — Defisit natrium: ΔNa × TBW, dikonversi ke volume NaCl 3% (513 mEq/L)
        const deficit = d * tbw; // mEq Na yang dibutuhkan
        const vol3 = (deficit * 1000) / 513;
        const rate24 = vol3 / 24; // habis dalam 24 jam
        const rateMax = (0.5 * tbw * 1000) / 513; // laju setara 0.5 mEq/L/jam
        // Metode 2 — Adrogué–Madías: kenaikan Na per 1 L NaCl 3% = (513 − Na)/(TBW+1)
        const amPerLiter = (513 - calcN) / (tbw + 1);
        const volAM = (d / amPerLiter) * 1000; // mL untuk mencapai ΔNa target
        const rateAM = volAM / 24;

        // Keparahan ditentukan gejala (kategori terberat yang tercentang), bukan angka Na.
        const hasSevere = SEVERE_SX.some(s => symptoms.has(s));
        const hasModerate = MODERATE_SX.some(s => symptoms.has(s));
        const severity: 'berat' | 'sedang' | 'ringan' = hasSevere ? 'berat' : hasModerate ? 'sedang' : 'ringan';
        // Faktor risiko tinggi ODS yang bisa dideteksi otomatis: Na sangat rendah (≤105).
        const highOdsRisk = calcN <= 105;

        setRes({
          type: 'hipo', v: vol3.toFixed(0), d: d.toFixed(1),
          rate: rate24.toFixed(1), rateMax: rateMax.toFixed(1),
          vAM: volAM.toFixed(0), rateAM: rateAM.toFixed(1),
          amPerLiter: amPerLiter.toFixed(1),
          limLo, limHi, onset,
          severity, highOdsRisk,
          isProfound: calcN < 125,
          calcN: calcN.toFixed(1), hasHyper: hasHyperglycemia,
          tgt: tgt.toFixed(1), tbw: tbw.toFixed(1), tbwF, w,
          deficit: deficit.toFixed(0),
        });
      } else if (calcN > 145) {
        const deficit = freeWaterDeficit(tbw, calcN, naT); // L
        // Kecepatan aman: kronik/tidak tahu ≤10 mEq/L/24 jam (~0.5/jam);
        // akut (<48 jam, jelas) boleh ~1 mEq/L/jam → ≤24/24 jam.
        const maxDropPer24 = onset === 'akut' ? 24 : 10;
        const totalDrop = calcN - naT;                       // ΔNa menuju 140
        const targetDrop = Math.min(totalDrop, maxDropPer24); // yang dikoreksi HARI INI
        const days = Math.max(1, Math.ceil(totalDrop / maxDropPer24));
        // Adrogué–Madías untuk cairan terpilih
        const fluid = NA_FLUIDS.find(f => f.id === naFluid) ?? NA_FLUIDS[1];
        const dNaPerL = adrogueDeltaNaPerLiter(fluid.na, calcN, tbw); // mEq/L per L (negatif = menurunkan)
        const lowersNa = dNaPerL < 0;
        const volForTarget = lowersNa ? targetDrop / -dNaPerL : null;  // L untuk drop hari ini
        const rateMlHr = volForTarget !== null ? (volForTarget * 1000) / 24 : null;
        setRes({
          type: 'hiper',
          calcN: calcN.toFixed(1),
          tbw: tbw.toFixed(1), tbwF, w,
          deficit: deficit.toFixed(2),
          onset, maxDropPer24, totalDrop: totalDrop.toFixed(1),
          targetDrop: targetDrop.toFixed(1), days,
          fluidId: fluid.id, fluidLabel: fluid.label, fluidNa: fluid.na, fluidNote: fluid.note,
          dNaPerL: dNaPerL.toFixed(2), lowersNa,
          volForTarget: volForTarget !== null ? volForTarget.toFixed(2) : null,
          rateMlHr: rateMlHr !== null ? rateMlHr.toFixed(0) : null,
          hasHyper: hasHyperglycemia,
        });
      } else {
         setRes({ type: 'normal', calcN: calcN.toFixed(1), hasHyper: hasHyperglycemia });
      }
    } else if (tab === 'k') {
      const kv = parseFloat(k);
      const pv = parseFloat(ph);
      const gv = parseFloat(gdsK);
      if (!kv) return;
      
      let kCorr = kv;
      let hasPh = false;
      let isAcidosis = false;
      if (!isNaN(pv) && pv > 0) {
        kCorr = kv - (7.4 - pv) * 6;
        hasPh = true;
        if (pv < 7.35) isAcidosis = true;
      }

      if (kv < 3.5) {
         const def = (3.5 - kv) * 100 * (w/70);
         const defHi = (3.5 - kv) * 200 * (w/70);
         setRes({ 
           type: 'hipo', kv, d1: def.toFixed(0), d2: defHi.toFixed(0),
           kCorr: kCorr.toFixed(2), hasPh, isAcidosis
         });
      } else if (kv > 5.0) {
         setRes({ 
           type: 'hiper', kv,
           sev: kv > 6.0 ? 'Berat (Emergensi)' : 'Sedang',
           gds: !isNaN(gv) ? gv : null,
           kCorr: kCorr.toFixed(2), hasPh, isAcidosis
         });
      } else {
         setRes({ type: 'normal', kv, kCorr: kCorr.toFixed(2), hasPh });
      }
    } else if (tab === 'ca') {
      const cav = parseFloat(ca);
      const al = parseFloat(alb);
      const pv = parseFloat(caPh);
      if (!cav || !al) return;
      
      const corr = cav + 0.8 * (4 - al);
      // Estimasi Ca ionized (mmol/L): total mg/dL ÷ 4.008 (→ mmol/L) × ~0.5 (fraksi ionized) ≈ ×0.125
      let ionized = corr * 0.125;
      let hasPh = false;
      if (!isNaN(pv) && pv > 0) {
        // Asidosis menaikkan Ca ionized ~0.05 mmol/L per penurunan 0.1 unit pH
        ionized = ionized + (7.4 - pv) * 0.5;
        hasPh = true;
      }
      
      let type = 'normal';
      if (corr < 8.5 || (hasPh && ionized < 1.12)) type = 'hipo';
      if (corr > 10.5) type = 'hiper';

      setRes({ 
        type, 
        corr: corr.toFixed(2),
        ionized: ionized.toFixed(2),
        hasPh 
      });
    } else if (tab === 'mg') {
      const mv = parseFloat(mg);
      const egfrV = parseFloat(egfr);
      if (!mv) return;
      
      let type = 'normal';
      if (mv < 1.7) type = 'hipo';

      setRes({ 
        type, 
        d: Math.min(0.04 * w, 4).toFixed(1),
        mv,
        symp: mgSymp,
        egfr: !isNaN(egfrV) ? egfrV : null
      });
    }
  };

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

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 overflow-x-hidden">
      
      {/* Active Patient Widget */}
      <ActivePatientBriefCard onAutofill={handleAutofill} />

      {/* Unified Clinical Synchronization Banner */}
      <UnifiedSyncBanner fields={syncFields} />
      
      <div className="flex bg-slate-100 dark:bg-[#2C2C2E] p-1 rounded-xl w-full max-w-lg mx-auto shadow-sm mb-4">
        <button className={`flex-1 py-1.5 text-[12px] md:text-[13px] font-bold rounded-lg transition-colors ${tab === 'na' ? 'bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'}`} onClick={() => {setTab('na'); setRes(null)}}>Natrium</button>
        <button className={`flex-1 py-1.5 text-[12px] md:text-[13px] font-bold rounded-lg transition-colors ${tab === 'k' ? 'bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'}`} onClick={() => {setTab('k'); setRes(null)}}>Kalium</button>
        <button className={`flex-1 py-1.5 text-[12px] md:text-[13px] font-bold rounded-lg transition-colors ${tab === 'ca' ? 'bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'}`} onClick={() => {setTab('ca'); setRes(null)}}>Kalsium</button>
        <button className={`flex-1 py-1.5 text-[12px] md:text-[13px] font-bold rounded-lg transition-colors ${tab === 'mg' ? 'bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'}`} onClick={() => {setTab('mg'); setRes(null)}}>Magnesium</button>
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
                   <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={onset} onChange={e=>setOnset(e.target.value)}>
                     <option value="kronik">Kronik / Tidak tahu</option>
                     <option value="akut">Akut (&lt;48 jam)</option>
                   </select>
                </div>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Cairan <span className="font-normal text-slate-500 text-[11px]">(hipernatremia)</span></span>
                   <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={naFluid} onChange={e=>setNaFluid(e.target.value)}>
                     {NA_FLUIDS.map(f => <option key={f.id} value={f.id}>{f.label} ({f.na} mEq/L)</option>)}
                   </select>
                </div>
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
                <div className="flex items-center justify-between px-4 py-3 gap-4 border-t border-slate-100 dark:border-slate-800">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Gejala</span>
                   <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={mgSymp} onChange={e=>setMgSymp(e.target.value)}>
                     <option value="asimtomatik">Asimtomatik / Ringan</option>
                     <option value="simtomatik">Gejala Berat (Aritmia/Kejang)</option>
                   </select>
                </div>
              </>
            )}
         </div>

         <div className="mt-4">
            <button onClick={calculate} className={`w-full py-3.5 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px] ${tab === 'na' ? 'bg-cyan-600 hover:bg-cyan-700' : tab === 'k' ? 'bg-red-600 hover:bg-red-700' : tab === 'ca' ? 'bg-stone-500 hover:bg-stone-600' : 'bg-green-600 hover:bg-green-700'}`}>
               Hitung Koreksi
            </button>
         </div>

         <div className="mt-4 pb-6">
            {res && <InputWarning messages={[
              weightPlausibilityWarning(parseFloat(bw)),
              tab === 'na' ? rangeWarning(parseFloat(na), 100, 180, 'Na', ' mEq/L') : null,
              tab === 'k' ? rangeWarning(parseFloat(k), 1.5, 9, 'K', ' mEq/L') : null,
              tab === 'ca' ? rangeWarning(parseFloat(ca), 4, 18, 'Ca', ' mg/dL') : null,
              tab === 'mg' ? rangeWarning(parseFloat(mg), 0.5, 6, 'Mg', ' mg/dL') : null,
            ]} />}
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
                             <li>Setelah krisis reda: STOP hipertonik. Total kenaikan <strong>≤ {res.highOdsRisk ? 8 : 10} mEq/L / 24 jam</strong> (plafon ODS).</li>
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
                             <li>Target kenaikan ~5 mEq/L / 24 jam; plafon <strong>≤ {res.highOdsRisk ? 8 : 10} mEq/L / 24 jam</strong>.</li>
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
                         <strong className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Risiko tinggi ODS (Na ≤105)</strong>
                         <p className="mt-1 leading-relaxed">Batasi kenaikan Na <strong>≤8 mEq/L / 24 jam</strong>. Faktor risiko lain yang perlu dinilai manual: hipokalemia, alkoholisme, malnutrisi, penyakit hati lanjut. <span className="italic opacity-80">📚 Sterns RH. NEJM 2015 · Verbalis JG. Am J Med 2013</span></p>
                       </div>
                     )}

                     {(() => { const calcBox = (
                     <div className="w-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-5 flex flex-col items-start text-left">
                       <div className="text-[13px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3 w-full border-b border-blue-200 dark:border-blue-800/50 pb-2">
                         Estimasi Koreksi Lambat &amp; Batas Aman ({res.onset === 'akut' ? 'Akut' : 'Kronik'})
                       </div>
                       
                       <div className="text-[13px] text-blue-900 dark:text-blue-200 space-y-4 w-full">
                         <div>
                           <strong className="text-[14px] text-blue-700 dark:text-blue-400 block mb-1">Target Koreksi Aman (Batas 24 Jam)</strong>
                           <p>Peningkatan maksimal yang direkomendasikan untuk mencegah <em>Osmotic Demyelination Syndrome (ODS)</em>:</p>
                           <ul className="list-disc pl-4 mt-1 font-semibold">
                             <li>Target Kenaikan Maksimal: <strong>{res.limLo}-{res.limHi} mEq/L dalam 24 jam</strong>.</li>
                             <li>Target Na Sementara: <strong>~{res.tgt} mEq/L</strong> (dari {res.calcN} mEq/L).</li>
                           </ul>
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
                               <p className="text-[11px] italic opacity-80 mt-0.5">Faktor {res.tbwF} untuk {sex === 'm' ? 'laki-laki dewasa' : 'perempuan dewasa'}.</p>
                             </div>
                             <div>
                               <p className="font-bold">Langkah 2 — Target kenaikan Na ({res.onset === 'akut' ? 'akut' : 'kronik'}):</p>
                               <p className="font-mono text-[11.5px] mt-0.5 pl-2 border-l-2 border-blue-300 dark:border-blue-700">ΔNa = {res.d} mEq/L (batas aman {res.limLo}-{res.limHi} mEq/L per 24 jam)<br/>Target Na = {res.calcN} + {res.d} = <strong>{res.tgt} mEq/L</strong></p>
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
                     <div className="w-full bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-5 flex flex-col items-start text-left">
                       <div className="text-[13px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-3 w-full border-b border-red-200 dark:border-red-800/50 pb-2">
                         Koreksi Hipernatremia {res.onset === 'akut' ? '(Akut)' : '(Kronik / Tidak tahu)'}
                       </div>

                       <div className="font-mono text-3xl font-bold mb-1 text-red-700 dark:text-red-300">
                         Defisit Air Bebas : {res.deficit} <span className="text-[16px] text-red-500 font-sans font-medium">L</span>
                       </div>
                       <p className="text-[12px] text-red-700/80 dark:text-red-300/80">ΔNa menuju 140 = {res.totalDrop} mEq/L · butuh ± <strong>{res.days} hari</strong> pada laju aman.</p>

                       <div className="text-[13px] text-red-900 dark:text-red-200 space-y-4 w-full mt-4">
                         {/* Kecepatan koreksi — batas aman */}
                         <div className="bg-white/60 dark:bg-black/30 rounded-xl p-3 border border-red-200 dark:border-red-900/50">
                           <strong className="text-[14px] text-red-700 dark:text-red-400 block mb-1">Kecepatan Koreksi — batas aman</strong>
                           <ul className="list-disc pl-4 space-y-1">
                             <li>Turunkan Na maksimal <strong>{res.maxDropPer24} mEq/L / 24 jam</strong> {res.onset === 'akut' ? '(akut <48 jam boleh ~1 mEq/L/jam)' : '(~0.5 mEq/L/jam)'} — mencegah edema serebri.</li>
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
                               <p className="font-mono text-[11.5px] mt-0.5 pl-2 border-l-2 border-red-300 dark:border-red-700">Defisit = TBW × (Na/140 − 1) = {res.tbw} × ({res.calcN}/140 − 1) = <strong>{res.deficit} L</strong></p>
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

                 {tab === 'k' && res.type === 'hipo' && (
                   <>
                     <div className="w-full bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-5 flex flex-col items-center text-center">
                       <div className="text-[12px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 mb-2">Hipokalemia</div>
                       
                       {res.hasPh && (
                         <div className="text-[12px] mb-3 p-2 bg-white/50 dark:bg-black/20 rounded-lg text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800/50">
                           K intrasel sesungguhnya (pH-adjusted): <strong>{res.kCorr} mEq/L</strong>
                           {res.isAcidosis && (
                             <div className="mt-1 text-red-600 dark:text-red-400 font-bold flex items-start gap-1 text-left">
                               <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                               <span>PERINGATAN KRITIS: Koreksi asidosis akan menurunkan K serum. Koreksi K harus mendahului/bersamaan asidosis!</span>
                             </div>
                           )}
                           <p className="mt-1 text-[10px] italic opacity-70">📚 Macdonald JE. Heart 2004;90:1098</p>
                         </div>
                       )}

                       <div className="font-mono text-3xl font-bold mb-1 text-amber-700 dark:text-amber-400">
                         Defisit: {res.d1} – {res.d2} <span className="text-[16px] text-amber-500 font-sans font-medium">mEq</span>
                       </div>
                       <div className="text-[13px] text-amber-700/80 dark:text-amber-300/80 mt-1 space-x-3">
                         <span>V. Perifer maks: <strong>10 mEq/j</strong></span>
                         <span>&middot;</span>
                         <span>V. Sentral maks: <strong>20 mEq/j</strong></span>
                       </div>
                       <p className="mt-3 text-[11px] italic text-amber-700/70 dark:text-amber-400/70">📚 Palmer BF. NEJM 2020;382:2152 &middot; Kraft MD. AJHSP 2005</p>
                     </div>

                     <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-[12px] text-slate-700 dark:text-slate-300">
                       <strong className="text-[13px] text-slate-900 dark:text-white block mb-2">📋 Strategi Pemberian Bertahap</strong>
                       <ul className="list-disc pl-4 space-y-1">
                         <li>Berikan ~40% estimasi defisit terlebih dahulu</li>
                         <li>Cek K serum setelah infus selesai: <br/>K &lt;2.5 (tiap 1-2j), K 2.5-3.0 (tiap 2-4j)</li>
                         <li>Evaluasi ulang untuk sesi 2. Jangan berikan seluruh defisit sekaligus (distribusi butuh 4-6 jam).</li>
                       </ul>
                       <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                         <strong className="text-amber-600 dark:text-amber-400">💡 Mg REMINDER (Hipokalemia Refrakter):</strong>
                         <p className="mt-1">Jika K tidak naik meski dikoreksi, periksa Mg serum. Hipomagnesemia menyebabkan kebocoran K ginjal. Koreksi: MgSO₄ 2g IV dalam 100 mL NS (20-30 menit).</p>
                       </div>
                     </div>
                   </>
                 )}

                 {tab === 'k' && res.type === 'hiper' && (
                   <div className="space-y-4">
                     <div className="w-full bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-5 flex flex-col items-start text-left">
                       <div className="text-[13px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-3 w-full border-b border-red-200 dark:border-red-800/50 pb-2">
                         Hiperkalemia {res.sev}
                       </div>
                       
                       {res.hasPh && (
                         <div className="text-[12px] mb-3 p-2 bg-white/50 dark:bg-black/20 rounded-lg text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800/50 w-full">
                           K intrasel sesungguhnya (pH-adjusted): <strong>{res.kCorr} mEq/L</strong>
                           {res.isAcidosis && (
                             <p className="mt-1 text-[11px] opacity-80">Koreksi asidosis akan membantu menurunkan K serum.</p>
                           )}
                         </div>
                       )}

                       <div className="text-[13px] text-red-900 dark:text-red-200 space-y-4 w-full">
                         <div>
                           <strong className="text-[14px] text-red-700 dark:text-red-400 block mb-1">STEP 1: Stabilisasi Membran</strong>
                           <p>Ca Glukonat 10% 10mL IV (3-5 menit). Ulang jika EKG tidak membaik dalam 5-10 menit.</p>
                         </div>

                         <div>
                           <strong className="text-[14px] text-red-700 dark:text-red-400 block mb-1">STEP 2: Shift K ke Intrasel (Onset 15-30 mnt)</strong>
                           
                           {/* UKKA 2023 Protocol */}
                           <div className="bg-white/60 dark:bg-black/30 rounded-xl p-3 mt-2 border border-red-200 dark:border-red-900/50">
                             <div className="font-bold mb-1 text-red-800 dark:text-red-300">A. Insulin + Dextrose (Protokol UKKA 2023)</div>
                             {res.gds ? (
                               <div className="space-y-1">
                                 <p>GDS Pre: <strong>{res.gds} mg/dL</strong></p>
                                 {res.gds >= 126 ? (
                                   <div className="p-2 bg-green-100/50 dark:bg-green-900/20 rounded text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800">
                                     <strong>GDS &ge; 126:</strong> Insulin Reg 10 IU + D50% 50mL (atau D40% 25mL) IV Bolus. <br/><em>Tidak perlu D10W follow-on. Monitor GDS tiap 30m.</em>
                                   </div>
                                 ) : (
                                   <div className="p-2 bg-amber-100/50 dark:bg-amber-900/20 rounded text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                     <strong>GDS &lt; 126:</strong> Insulin Reg 10 IU + D50% 50mL (atau D40% 25mL) IV Bolus.<br/>
                                     <span className="font-bold underline">WAJIB TAMBAHKAN:</span> D10% 50 mL/jam selama 5 jam (total 25g glukosa). <br/><em>Risiko hipoglikemia TINGGI. Monitor GDS tiap 30m.</em>
                                   </div>
                                 )}
                               </div>
                             ) : (
                               <p className="italic text-[12px] opacity-80">Masukkan GDS pre-koreksi untuk melihat panduan UKKA 2023 yang spesifik.</p>
                             )}
                           </div>

                           <div className="bg-white/60 dark:bg-black/30 rounded-xl p-3 mt-2 border border-red-200 dark:border-red-900/50">
                             <div className="font-bold mb-1 text-red-800 dark:text-red-300">B. Salbutamol Nebulisasi</div>
                             <p>10-20 mg (2.5-5 ampul @2.5mg). Efek sinergistik dengan insulin. Tidak efektif pada ~40% pasien.</p>
                           </div>

                           <div className="bg-white/60 dark:bg-black/30 rounded-xl p-3 mt-2 border border-red-200 dark:border-red-900/50">
                             <div className="font-bold mb-1 text-red-800 dark:text-red-300">C. NaHCO&sub3; 8.4% 50 mEq IV</div>
                             <p>HANYA jika asidosis metabolik pH &lt;7.2. Tidak efektif sebagai monoterapi pada pH normal.</p>
                           </div>
                         </div>
                       </div>
                       
                       <p className="mt-4 text-[11px] italic text-red-700/70 dark:text-red-400/70 w-full text-center border-t border-red-200 dark:border-red-800/50 pt-3">
                         📚 UKKA Guideline. Oct 2023 &middot; Kovesdy CP. Kidney Int 2023 &middot; Dépret F. Ann Intensive Care 2019;9:32
                       </p>
                     </div>

                     <Accordion title="⏱ Alternatif ICU — Infus Insulin Kontinu">
                       <div className="text-[12px] text-slate-700 dark:text-slate-300 space-y-2">
                         <p><strong>Indikasi:</strong> K 5.5-6.5 tanpa perubahan EKG, mempertahankan efek pasca-bolus, hiperK perioperatif.</p>
                         <p><strong>Preparasi:</strong> Insulin Regular 50 IU + NaCl 0.9% 48 mL = 1 IU/mL.</p>
                         <p><strong>Rate:</strong> 1.5–2 mL/jam (= 1.5–2 IU/jam) selama 6 jam.</p>
                         <p><strong>Pairing Glukosa:</strong> D10% 50–100 mL/jam berjalan bersamaan (jika puasa), atau cek GDS ketat tiap 1-2 jam (jika sudah ada asupan).</p>
                         <p><strong>Stop:</strong> Jika K &lt;4.5 atau GDS &lt;100 mg/dL.</p>
                         <p className="pt-2 text-[11px] italic opacity-80 border-t border-slate-200 dark:border-slate-700 mt-2">📚 Dépret F. Ann Intensive Care 2019;9:32</p>
                       </div>
                     </Accordion>
                   </div>
                 )}

                 {tab === 'ca' && (
                   <div className="space-y-4">
                     <div className="w-full bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
                       <div className="text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Ca Terkoreksi Albumin</div>
                       <div className="font-mono text-4xl font-bold mb-1 text-slate-800 dark:text-slate-200">
                         {res.corr} <span className="text-[16px] text-slate-500 font-sans font-medium">mg/dL</span>
                       </div>
                       
                       <div className="mt-3 w-full max-w-[250px] p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-[13px] text-slate-600 dark:text-slate-400">
                         Estimasi Ca Ionized: <br/><strong className="text-slate-800 dark:text-slate-200">{res.ionized} mmol/L</strong>
                         {res.hasPh && <span className="text-[11px] block mt-1">(pH-adjusted)</span>}
                       </div>
                       
                       <p className="mt-3 text-[11px] italic text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-3 w-full">
                         📚 Payne RB. BMJ 1973 &middot; Cooper MS. BMJ 2003;326:417 &middot; Bilezikian JP. NEJM 2022;386:254
                       </p>
                     </div>

                     {res.type === 'hipo' && (
                       <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-2xl text-[13px] text-amber-800 dark:text-amber-300 text-left">
                         <strong className="text-[14px] mb-2 block">Pilihan Koreksi Hipokalsemia:</strong>
                         <p className="font-bold mt-2">Ca Glukonat 10% (Perifer / Sentral):</p>
                         <ul className="list-disc pl-4 space-y-1">
                           <li>1 ampul (10 mL) = 4.65 mEq Ca&sup2;&⁺;</li>
                           <li><strong>Emergensi (Kejang/Tetani):</strong> 1-2 ampul IV lambat (5-10 mnt) + EKG monitor</li>
                           <li><strong>Koreksi Sedang:</strong> 1 ampul dalam 100 mL NS/D5W &rarr; infus 30-60 mnt</li>
                         </ul>
                         <p className="font-bold mt-3">Ca Klorida 10% (HANYA VIA CVC):</p>
                         <ul className="list-disc pl-4 space-y-1">
                           <li>1 ampul = 13.6 mEq (3&times; lebih poten)</li>
                           <li>Indikasi: syok, henti jantung, transfusi masif</li>
                         </ul>
                         <p className="mt-3 text-[11px] text-red-600 dark:text-red-400 font-bold bg-red-100/50 dark:bg-red-900/20 p-2 rounded">⚠ Jangan campur dengan NaHCO&sub3; atau fosfat. Hati-hati pada pasien digitalis.</p>
                       </div>
                     )}

                     {res.type === 'hiper' && (
                       <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-2xl text-[13px] text-red-800 dark:text-red-300 text-left">
                         <strong className="text-[14px] mb-2 block text-red-600 dark:text-red-400">Protokol Hiperkalsemia (&gt;10.5 mg/dL):</strong>
                         <ol className="list-decimal pl-4 space-y-1 font-medium">
                           <li><strong>Hidrasi:</strong> NaCl 0.9% 200–500 mL/jam (Target UO 100-150 mL/jam)</li>
                           <li><strong>Furosemide:</strong> 20-40 mg IV (HANYA setelah euvolemia)</li>
                           <li><strong>Kalsitonin:</strong> 4-8 IU/kg SC/IM tiap 12 jam (onset cepat)</li>
                           <li><strong>Zoledronat:</strong> 4 mg IV dalam 15 mnt (onset lambat 48j)</li>
                           <li><strong>Denosumab:</strong> 120 mg SC (jika gagal ginjal)</li>
                         </ol>
                       </div>
                     )}
                   </div>
                 )}

                 {tab === 'mg' && res.type === 'hipo' && (
                   <div className="w-full bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-5 flex flex-col items-center text-center">
                     <div className="text-[12px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">Hipomagnesemia</div>
                     
                     {res.egfr && res.egfr < 30 && (
                       <div className="mb-3 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-xl text-[12px] text-red-800 dark:text-red-300 font-medium w-full text-left">
                         <strong className="text-red-600 dark:text-red-400 block mb-1">⚠ eGFR &lt; 30 mL/menit</strong>
                         <ul className="list-disc pl-4 space-y-1">
                           <li>TURUNKAN dosis MgSO&sub4; sebesar 50%</li>
                           <li>Monitor refleks patella tiap 1 jam (STOP infus jika Mg &gt;4)</li>
                           <li>Monitor napas tiap 30m (depresi napas jika Mg &gt;5)</li>
                         </ul>
                       </div>
                     )}

                     <div className="w-full text-left text-[13px] text-emerald-800 dark:text-emerald-200 space-y-3 bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
                       {res.symp === 'simtomatik' ? (
                         <div>
                           <strong className="text-[14px] text-emerald-900 dark:text-emerald-400">Dosis Gejala Berat (Aritmia/Kejang):</strong>
                           <p className="font-mono text-lg font-bold text-emerald-700 dark:text-emerald-300 mt-1">MgSO&sub4; {res.d} gram IV</p>
                           <p>Dalam 100 mL NaCl 0.9% &rarr; Habis dalam 15-20 menit.</p>
                         </div>
                       ) : (
                         <div>
                           <strong className="text-[14px] text-emerald-900 dark:text-emerald-400">Dosis Asimtomatik:</strong>
                           <p className="font-mono text-lg font-bold text-emerald-700 dark:text-emerald-300 mt-1">MgSO&sub4; {res.d} gram IV</p>
                           <p>Dalam 250 mL NaCl 0.9% &rarr; Habis dalam 4-6 jam.</p>
                         </div>
                       )}
                       <div className="pt-2 mt-2 border-t border-emerald-200 dark:border-emerald-800/50 text-[11px]">
                         <em>Catatan: Jika eGFR &lt;30, pastikan memotong dosis di atas sebesar 50%.</em>
                       </div>
                     </div>
                     
                     <p className="mt-3 text-[11px] italic text-emerald-700/70 dark:text-emerald-400/70">📚 de Baaij JH. Physiol Rev 2015;95:791 &middot; Glasdam SM. AACN Adv Crit Care 2012</p>
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
                      label={`Koreksi Elektrolit — ${tab.toUpperCase()}`}
                      inputs={{ 
                        tab, bw, na, glu, onset, k, ph, gdsK, ca, alb, caPh, mg, egfr, mgSymp
                      }}
                      summary={
                        tab === 'na' ? `Na: ${na} mEq/L, ${res.type === 'hipo' ? `Defisit -> ${res.v}mL NaCl 3%` : res.type === 'hiper' ? `Defisit air -> ${res.deficit}L (${res.fluidLabel})` : 'Normal'}` :
                        tab === 'k' ? `K: ${k} mEq/L, ${res.type === 'hipo' ? `Defisit ${res.d1}-${res.d2}mEq` : res.type === 'hiper' ? `HiperK ${res.sev}` : 'Normal'}` :
                        tab === 'ca' ? `Ca Terkoreksi: ${res.corr} mg/dL (${res.type})` :
                        `Mg: ${mg} mg/dL, ${res.type === 'hipo' ? `Butuh ${res.d}g MgSO4` : 'Normal'}`
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
          <li><strong className="text-foreground">Koreksi Kalium:</strong> Kadar Kalium harus dilihat bersama pH pasien karena asidemia menggeser K+ intrasel ke ekstrasel, menciptakan hiperkalemia palsu. Rumus koreksi empiris: Defisit K+ = (Target K+ - Pasien K+) &times; 100. Rekomendasi rate KCL Vena Perifer maks 10 mEq/jam.</li>
          <li><strong className="text-foreground">Kalsium & Albumin:</strong> Kalsium terikat dengan protein albumin. Kalsium Terkoreksi = Kalsium Total + 0.8 &times; (4.0 - Albumin). Pada kasus kritis, disarankan pengukuran fraksi Ionized Kalsium bebas dibandingkan terkoreksi albumin.</li>
          <li><strong className="text-foreground">Magnesium:</strong> Sering berkorelasi dengan hipokalemia persisten. Jika Mg &lt; 1.5, berikan 1-2 gr Magnesium Sulfat dalam bolus lambat (4-6 jam).</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 <strong>Hiponatremia:</strong> Spasovski G, et al. Eur J Endocrinol 2014;170:G1 / Nephrol Dial Transplant 2014;29(Suppl 2):i1 · Verbalis JG, et al. Am J Med 2013;126(10 Suppl 1):S1 · Adrogué HJ, Madias NE. NEJM 2000;342:1581. <strong>Hipernatremia:</strong> Adrogué HJ, Madias NE. NEJM 2000;342:1493 · Miller NE, et al. Am Fam Physician 2023;108:476. <strong>Umum:</strong> Sterns RH. NEJM 2015;372:55 · Adrogué HJ, Tucker BM, Madias NE. JAMA 2022;328:280 · Weisberg LS. Crit Care Med 2008.
        </div>
      </Accordion>
    </div>
  );
}
