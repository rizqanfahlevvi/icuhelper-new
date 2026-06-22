import React, { useState, useEffect, useMemo } from 'react';
import { Activity, Thermometer, Wind, Beaker, ChevronsRight } from 'lucide-react';
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

  // Ca
  const [ca, setCa] = useState('');
  const [alb, setAlb] = useState('');

  // Mg
  const [mg, setMg] = useState('');

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

    setRes(null);
  };

  const calculate = () => {
    const w = parseFloat(bw);
    if (!w) return;

    if (tab === 'na') {
      const n = parseFloat(na);
      const g = parseFloat(glu);
      if (!n) return;

      const tbwF = sex === 'm' ? 0.6 : 0.5;
      const tbw = w * tbwF;
      const naT = 140;

      let naCorr = n;
      if (!isNaN(g) && g > 100) {
        naCorr = n + 1.6 * (g - 100) / 100;
      }

      if (n < 135) {
        const limLo = onset === 'akut' ? 10 : 6;
        const limHi = onset === 'akut' ? 12 : 8;
        const tgt = Math.min(n + limLo, naT);
        const d = tgt - n;
        const vol3 = (d * tbw * 1000) / 513;

        setRes({
          type: 'hipo', tbw, v: vol3.toFixed(0), d: d.toFixed(1),
          rate: (vol3 / (d/0.5)).toFixed(1), h: (d/0.5).toFixed(1),
          lim: `${limLo}-${limHi}`
        });
      } else if (n > 145) {
        const d = tbw * (n / naT - 1);
        const rate = (d * 1000) / 48; // 48 jam
        setRes({ type: 'hiper', v: d.toFixed(2), rate: rate.toFixed(0) });
      } else {
         setRes({ type: 'normal' });
      }
    } else if (tab === 'k') {
      const kv = parseFloat(k);
      if (!kv) return;
      if (kv < 3.5) {
         const def = (3.5 - kv) * 100 * (w/70);
         const defHi = (3.5 - kv) * 200 * (w/70);
         setRes({ type: 'hipo', d1: def.toFixed(0), d2: defHi.toFixed(0) });
      } else if (kv > 5.0) {
         setRes({ type: 'hiper', sev: kv > 6.0 ? 'Berat (Emergensi)' : 'Sedang' });
      } else {
         setRes({ type: 'normal' });
      }
    } else if (tab === 'ca') {
      const cav = parseFloat(ca);
      const al = parseFloat(alb);
      if (!cav || !al) return;
      
      const corr = cav + 0.8 * (4 - al);
      setRes({ type: 'ca', corr: corr.toFixed(2) });
    } else if (tab === 'mg') {
      const mv = parseFloat(mg);
      if (!mv) return;
      if (mv < 1.7) {
        setRes({ type: 'hipo', d: Math.min(0.04 * w, 4).toFixed(1) });
      } else {
        setRes({ type: 'normal' });
      }
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
      ];
    } else if (tab === 'ca') {
      return [
        ...common,
        { key: 'ca' as const, label: 'Kalsium', value: ca, setter: setCa, unit: 'mg/dL' },
        { key: 'albumin' as const, label: 'Albumin', value: alb, setter: setAlb, unit: 'g/dL' },
      ];
    } else { // mg
      return [
        ...common,
        { key: 'mg' as const, label: 'Magnesium', value: mg, setter: setMg, unit: 'mg/dL' },
      ];
    }
  }, [tab, bw, na, glu, k, ca, alb, mg]);

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
              <div className="flex items-center justify-between px-4 py-3 gap-4">
                 <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">K Serum</span>
                 <div className="flex-1 flex items-center justify-end gap-2">
                   <input type="number" step="0.1" value={k} onChange={e=>setK(e.target.value)} placeholder="3.5" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" />
                   <span className="text-xs font-semibold text-slate-500 w-12 text-left">mEq/L</span>
                 </div>
              </div>
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
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Albumin</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" step="0.1" value={alb} onChange={e=>setAlb(e.target.value)} placeholder="4.0" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" />
                     <span className="text-xs font-semibold text-slate-500 w-12 text-left">g/dL</span>
                   </div>
                </div>
              </>
            )}

            {tab === 'mg' && (
              <div className="flex items-center justify-between px-4 py-3 gap-4">
                 <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Mg Serum</span>
                 <div className="flex-1 flex items-center justify-end gap-2">
                   <input type="number" step="0.1" value={mg} onChange={e=>setMg(e.target.value)} placeholder="1.7" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" />
                   <span className="text-xs font-semibold text-slate-500 w-12 text-left">mg/dL</span>
                 </div>
              </div>
            )}
         </div>

         <div className="px-4 mt-4">
            <button onClick={calculate} className={`w-full py-3.5 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px] ${tab === 'na' ? 'bg-cyan-600 hover:bg-cyan-700' : tab === 'k' ? 'bg-red-600 hover:bg-red-700' : tab === 'ca' ? 'bg-stone-500 hover:bg-stone-600' : 'bg-green-600 hover:bg-green-700'}`}>
               Hitung Koreksi
            </button>
         </div>

         <div className="mt-4 pb-6">
            {res && (
               <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                 {tab === 'na' && res.type === 'hipo' && (
                   <div className="w-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-5 flex flex-col items-center text-center">
                     <div className="text-[12px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">Hiponatremia (Target ↑ {parseFloat(na) + parseFloat(res.d)})</div>
                     <div className="font-mono text-3xl font-bold mb-1 text-blue-700 dark:text-blue-300">
                       NaCl 3% : {res.v} <span className="text-[16px] text-blue-500 font-sans font-medium">mL</span>
                     </div>
                     <div className="text-[13px] text-blue-700/80 dark:text-blue-300/80 mt-1">Laju: <strong>{res.rate} mL/jam</strong> (habis dlm {res.h} jam)</div>
                     <div className="text-[11px] text-blue-500 max-w-[80%] uppercase font-semibold mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                       Batas maks induksi {onset}: {res.lim} mEq/L/24j
                     </div>
                   </div>
                 )}
                 {tab === 'na' && res.type === 'hiper' && (
                   <div className="w-full bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-5 flex flex-col items-center text-center">
                     <div className="text-[12px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2">Hipernatremia</div>
                     <div className="font-mono text-3xl font-bold mb-1 text-red-700 dark:text-red-300">
                       Defisit Air : {res.v} <span className="text-[16px] text-red-500 font-sans font-medium">L</span>
                     </div>
                     <div className="text-[13px] text-red-700/80 dark:text-red-300/80 mt-1">Laju infus: <strong>{res.rate} mL/jam</strong> (selama 48 jam)</div>
                   </div>
                 )}

                 {tab === 'k' && res.type === 'hipo' && (
                   <div className="w-full bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-5 flex flex-col items-center text-center">
                     <div className="text-[12px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 mb-2">Hipokalemia</div>
                     <div className="font-mono text-3xl font-bold mb-1 text-amber-700 dark:text-amber-400">
                       Defisit: {res.d1} – {res.d2} <span className="text-[16px] text-amber-500 font-sans font-medium">mEq</span>
                     </div>
                     <div className="text-[13px] text-amber-700/80 dark:text-amber-300/80 mt-1 space-x-3">
                       <span>V. Perifer maks: <strong>10 mEq/j</strong></span>
                       <span>&middot;</span>
                       <span>V. Sentral maks: <strong>20 mEq/j</strong></span>
                     </div>
                   </div>
                 )}
                 {tab === 'k' && res.type === 'hiper' && (
                   <div className="w-full bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-5 flex flex-col items-start md:items-center text-left md:text-center">
                     <div className="text-[12px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-3 md:w-full">Hiperkalemia {res.sev}</div>
                     <div className="text-[14px] text-red-800 dark:text-red-300 space-y-2">
                       <p><strong className="text-red-900 dark:text-red-200">1. Stabilisasi:</strong> Ca Glukonat 10% 10mL IV</p>
                       <p><strong className="text-red-900 dark:text-red-200">2. Shift IC:</strong> Insulin 10U + D40% 25mL IV</p>
                       <p><strong className="text-red-900 dark:text-red-200">3. Eliminasi:</strong> Diuretik loop / Hemodialisis</p>
                     </div>
                   </div>
                 )}

                 {tab === 'ca' && (
                   <div className="w-full bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
                     <div className="text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Ca Terkoreksi Albumin</div>
                     <div className="font-mono text-4xl font-bold mb-1 text-slate-800 dark:text-slate-200">
                       {res.corr} <span className="text-[16px] text-slate-500 font-sans font-medium">mg/dL</span>
                     </div>
                     {parseFloat(res.corr) < 8.5 && (
                       <div className="mt-4 px-4 py-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl text-[13px] text-amber-700 dark:text-amber-400 font-medium">
                         Hipokalsemia: pertimbangkan Ca Glukonat 1g IV.
                       </div>
                     )}
                   </div>
                 )}

                 {tab === 'mg' && res.type === 'hipo' && (
                   <div className="w-full bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-5 flex flex-col items-center text-center">
                     <div className="text-[12px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">Hipomagnesemia</div>
                     <div className="font-mono text-3xl font-bold mb-1 text-emerald-700 dark:text-emerald-300">
                       MgSO₄ : {res.d} <span className="text-[16px] text-emerald-500 font-sans font-medium">gram IV</span>
                     </div>
                     <div className="text-[13px] text-emerald-700/80 dark:text-emerald-300/80 mt-1 max-w-[90%]">Dilarutkan dalam 250mL NS, habiskan dalam 4-6 jam terus menerus.</div>
                   </div>
                 )}

                 {(res.type === 'normal') && (
                   <div className="w-full bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-5 flex items-center justify-center text-center">
                     <span className="font-bold text-[15px] text-emerald-700 dark:text-emerald-400">✅ Kadar Elektrolit Normal</span>
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
