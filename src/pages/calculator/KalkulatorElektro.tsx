import React, { useState, useEffect, useMemo } from 'react';
import { Activity, Thermometer, Wind, Beaker, ChevronsRight, AlertTriangle } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';

export default function KalkulatorElektro() {
  const [tab, setTab] = useState<'na' | 'k' | 'ca' | 'mg'>('na');

  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();

  const [bw, setBw] = useState('');
  
  // Na
  const [na, setNa] = useState('');
  const [sex, setSex] = useState('m');
  const [glu, setGlu] = useState('');
  const [onset, setOnset] = useState('kronik');
  
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
      const tbwF = sex === 'm' ? 0.6 : 0.5;
      const tbw = w * tbwF;
      const naT = 140;

      if (calcN < 135) {
        const limLo = onset === 'akut' ? 10 : 6;
        const limHi = onset === 'akut' ? 12 : 8;
        const tgt = Math.min(calcN + limLo, naT);
        const d = tgt - calcN;
        const vol3 = (d * tbw * 1000) / 513;

        setRes({
          type: 'hipo', tbw, v: vol3.toFixed(0), d: d.toFixed(1),
          rate: (vol3 / (d/0.5)).toFixed(1), h: (d/0.5).toFixed(1),
          lim: `${limLo}-${limHi}`, onset, isEmergensi: calcN < 120,
          calcN: calcN.toFixed(1), hasHyper: hasHyperglycemia
        });
      } else if (calcN > 145) {
        const d = tbw * (calcN / naT - 1);
        const rate = (d * 1000) / 48; // 48 jam
        setRes({ 
          type: 'hiper', 
          v: d.toFixed(2), 
          rate: rate.toFixed(0),
          calcN: calcN.toFixed(1),
          hasHyper: hasHyperglycemia 
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
      let ionized = corr * 0.25;
      let hasPh = false;
      if (!isNaN(pv) && pv > 0) {
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

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
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
         <h2 className="mt-2 mb-2 px-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
           Parameter Koreksi Elektrolit
         </h2>
         
         <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mx-4">
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

         <div className="px-4 mt-4">
            <button onClick={calculate} className={`w-full py-3.5 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px] ${tab === 'na' ? 'bg-cyan-600 hover:bg-cyan-700' : tab === 'k' ? 'bg-red-600 hover:bg-red-700' : tab === 'ca' ? 'bg-stone-500 hover:bg-stone-600' : 'bg-green-600 hover:bg-green-700'}`}>
               Hitung Koreksi
            </button>
         </div>

         <div className="mt-4 pb-6">
            {res && (
               <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                 
                 {tab === 'na' && res.hasHyper && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-[13px] text-amber-800 dark:text-amber-300">
                      <strong>Koreksi Hiperglikemia:</strong> Na terkoreksi adalah <strong>{res.calcN} mEq/L</strong> (berdasarkan glukosa {glu} mg/dL).<br/>
                      <span className="text-[11px] opacity-80 italic">📚 Adrogue HJ. NEJM 2000;342:1581</span>
                    </div>
                 )}

                 {tab === 'na' && res.type === 'hipo' && (
                   <>
                     {res.isEmergensi && (
                       <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex flex-col text-left">
                         <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold mb-2">
                           <AlertTriangle className="w-5 h-5" />
                           PROTOKOL EMERGENSI
                         </div>
                         <div className="text-[13px] text-red-800 dark:text-red-300 space-y-1">
                           <p>Jika ada gejala berat (Kejang / Penurunan Kesadaran):</p>
                           <ul className="list-disc pl-4 space-y-1 font-medium mt-1">
                             <li><strong>BOLUS NaCl 3%:</strong> 150 mL IV dalam 20 menit</li>
                             <li>Dapat diulang hingga 2&times; jika kejang belum berhenti</li>
                             <li>Target: Na naik 5 mEq/L (cukup untuk hentikan kejang)</li>
                             <li>Setelah gejala terkontrol: lanjut infus lambat.</li>
                           </ul>
                           <p className="mt-2 text-[11px] italic opacity-80">📚 Spasovski G (ERBP/ESE). Nephrol Dial Transplant 2014;29 Suppl 2:i1</p>
                         </div>
                       </div>
                     )}

                     <div className="w-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-5 flex flex-col items-center text-center">
                       <div className="text-[12px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">Hiponatremia (Target ↑ {parseFloat(res.calcN) + parseFloat(res.d)})</div>
                       <div className="font-mono text-3xl font-bold mb-1 text-blue-700 dark:text-blue-300">
                         NaCl 3% : {res.v} <span className="text-[16px] text-blue-500 font-sans font-medium">mL</span>
                       </div>
                       <div className="text-[13px] text-blue-700/80 dark:text-blue-300/80 mt-1">Laju: <strong>{res.rate} mL/jam</strong> (habis dlm 24 jam)</div>
                       <div className="text-[11px] text-blue-500 max-w-[80%] uppercase font-semibold mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                         Batas maks induksi {res.onset}: {res.limLo} - {res.limHi} mEq/L / 24j
                       </div>
                       <p className="mt-3 text-[11px] italic text-blue-700/70 dark:text-blue-300/70">📚 Sterns RH. NEJM 2015;372:55 &middot; Hoorn EJ. NEJM 2023;388:2340</p>
                     </div>

                     <Accordion title="⚠ Rescue Protocol (Overcorrection)">
                       <div className="text-[12px] text-slate-700 dark:text-slate-300 space-y-2">
                         <p>Jika Na naik &gt;10 mEq/L dalam 24 jam (risiko ODS tinggi):</p>
                         <ol className="list-decimal pl-4 space-y-1">
                           <li>STOP semua cairan hipotonik dan koreksi aktif</li>
                           <li><strong>DDAVP (Desmopressin)</strong> 2–4 &mu;g SC/IV tiap 6–8 jam (mencegah Na naik lebih lanjut)</li>
                           <li><strong>D5W</strong> infus lambat untuk re-lower Na jika perlu</li>
                           <li>Target: total kenaikan Na tidak melebihi 10 mEq/L dalam 24 jam pertama</li>
                         </ol>
                         <p className="pt-2 text-[11px] italic opacity-80 border-t border-slate-200 dark:border-slate-700 mt-2">📚 Verbalis JG. Am J Med 2013;126:S1</p>
                       </div>
                     </Accordion>
                   </>
                 )}

                 {tab === 'na' && res.type === 'hiper' && (
                   <div className="w-full bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-5 flex flex-col items-center text-center">
                     <div className="text-[12px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2">Hipernatremia</div>
                     <div className="font-mono text-3xl font-bold mb-1 text-red-700 dark:text-red-300">
                       Defisit Air : {res.v} <span className="text-[16px] text-red-500 font-sans font-medium">L</span>
                     </div>
                     <div className="text-[13px] text-red-700/80 dark:text-red-300/80 mt-1">Laju infus: <strong>{res.rate} mL/jam</strong> (selama 48 jam)</div>
                     <p className="mt-3 text-[11px] italic text-red-700/70 dark:text-red-300/70">📚 Adrogue HJ. NEJM 2000;342:1581 &middot; Hoorn EJ. NEJM 2023;388:2340</p>
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
               </div>
            )}
         </div>
      </div>

      <Accordion title="📖 Teori & Referensi: Koreksi Elektrolit">
        <ul className="pl-4 space-y-1 list-disc text-muted-foreground text-sm">
          <li><strong className="text-foreground">Defisit Natrium:</strong> Koreksi Hiponatremia bergejala dibatasi (max 8-10 mEq/L per 24 jam) untuk mencegah <em>Osmotic Demyelination Syndrome</em> (ODS). Na Defisit = Total Body Water &times; (Na Target - Na Pasien). TBW = 0.6 &times; BB (pria) / 0.5 &times; BB (wanita).</li>
          <li><strong className="text-foreground">Koreksi Kalium:</strong> Kadar Kalium harus dilihat bersama pH pasien karena asidemia menggeser K+ intrasel ke ekstrasel, menciptakan hiperkalemia palsu. Rumus koreksi empiris: Defisit K+ = (Target K+ - Pasien K+) &times; 100. Rekomendasi rate KCL Vena Perifer maks 10 mEq/jam.</li>
          <li><strong className="text-foreground">Kalsium & Albumin:</strong> Kalsium terikat dengan protein albumin. Kalsium Terkoreksi = Kalsium Total + 0.8 &times; (4.0 - Albumin). Pada kasus kritis, disarankan pengukuran fraksi Ionized Kalsium bebas dibandingkan terkoreksi albumin.</li>
          <li><strong className="text-foreground">Magnesium:</strong> Sering berkorelasi dengan hipokalemia persisten. Jika Mg &lt; 1.5, berikan 1-2 gr Magnesium Sulfat dalam bolus lambat (4-6 jam).</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 Adrogué HJ, Madias NE (2000). Hyponatremia. NEJM; Weisberg LS. (2008) Management of severe hyperkalemia. Crit Care Med.
        </div>
      </Accordion>
    </div>
  );
}
