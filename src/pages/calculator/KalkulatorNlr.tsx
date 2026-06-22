import React, { useState, useEffect, useMemo } from 'react';
import { Activity, TestTube, AlertTriangle } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';

export default function KalkulatorNlr() {
  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();

  const [mode, setMode] = useState<'abs' | 'pct'>('abs');
  
  // Absolut
  const [neutA, setNeutA] = useState('');
  const [lymphA, setLymphA] = useState('');
  const [monoA, setMonoA] = useState('');
  const [pltA, setPltA] = useState('');
  const [wbcA, setWbcA] = useState('');

  // Persen
  const [wbcP, setWbcP] = useState('');
  const [neutP, setNeutP] = useState('');
  const [lymphP, setLymphP] = useState('');
  const [monoP, setMonoP] = useState('');
  const [pltP, setPltP] = useState('');

  const [res, setRes] = useState<any>(null);

  // Auto-load on mount
  useEffect(() => {
    if (clinicalStore.data.leukosit) {
      setWbcA(clinicalStore.data.leukosit);
      setWbcP(clinicalStore.data.leukosit);
    }
    if (clinicalStore.data.trombosit) {
      setPltA(clinicalStore.data.trombosit);
      setPltP(clinicalStore.data.trombosit);
    }
  }, []);

  const syncFields = useMemo(() => {
    const activePlt = mode === 'abs' ? pltA : pltP;
    const activeSetterPlt = mode === 'abs' ? setPltA : setPltP;

    const activeWbc = mode === 'abs' ? wbcA : wbcP;
    const activeSetterWbc = mode === 'abs' ? setWbcA : setWbcP;

    return [
      { key: 'leukosit' as const, label: 'Leukosit (WBC)', value: activeWbc, setter: activeSetterWbc, unit: '10³/µL' },
      { key: 'trombosit' as const, label: 'Trombosit (PLT)', value: activePlt, setter: activeSetterPlt, unit: '10³/µL' },
    ];
  }, [mode, pltA, pltP, wbcA, wbcP]);

  const handleAutofill = (data: any) => {
    if (clinicalStore.data.leukosit) {
      setWbcA(clinicalStore.data.leukosit);
      setWbcP(clinicalStore.data.leukosit);
    }
    if (clinicalStore.data.trombosit) {
      setPltA(clinicalStore.data.trombosit);
      setPltP(clinicalStore.data.trombosit);
    }
    setRes(null);
  };


  const calculate = () => {
    let neut, lymph, mono, plt, wbc;
    
    if (mode === 'pct') {
      const wp = parseFloat(wbcP);
      const np = parseFloat(neutP);
      const lp = parseFloat(lymphP);
      const mp = parseFloat(monoP);
      
      if (!wp || !np || !lp) return;
      neut = (np / 100) * wp;
      lymph = (lp / 100) * wp;
      mono = isNaN(mp) ? null : (mp / 100) * wp;
      plt = parseFloat(pltP);
      wbc = wp;
    } else {
      neut = parseFloat(neutA);
      lymph = parseFloat(lymphA);
      mono = parseFloat(monoA);
      plt = parseFloat(pltA);
      wbc = parseFloat(wbcA) || null;
    }

    if (!neut || !lymph) return;

    const nlr = neut / lymph;
    const plr = plt ? plt / lymph : null;
    const sii = plt ? (neut * plt) / lymph : null;
    const mlr = mono ? mono / lymph : null;

    let wbcNote = null;
    if (wbc && (neut + lymph + (mono || 0)) > 0) {
      const diff = neut + lymph + (mono || 0);
      const ratio = diff / wbc;
      if (ratio < 0.6 || ratio > 1.1) {
        wbcNote = '⚠ Jumlah differential tidak sesuai WBC total. Periksa input absolut vs persentase.';
      }
    }

    const badge = (val:number, low:number, mid:number, high:number, lowLbl:string, midLbl:string, highLbl:string) => {
       if (val <= low) return { color: 'text-green-500', bg: 'border-green-500', lbl: lowLbl };
       if (val <= mid) return { color: 'text-amber-500', bg: 'border-amber-500', lbl: midLbl };
       return { color: 'text-red-500', bg: 'border-red-500', lbl: highLbl };
    };

    const n = badge(nlr, 3, 5, 9, 'Normal (1-3)', 'Meningkat (3-5)', 'Tinggi (>5)');
    const p = plr !== null ? badge(plr, 150, 300, 999, 'Normal', 'Meningkat', 'Tinggi (>300)') : null;
    const s = sii !== null ? badge(sii, 500, 1000, 9999, 'Normal', 'Meningkat', 'Kritis (>1000)') : null;
    const m = mlr !== null ? badge(mlr, 0.3, 0.5, 999, 'Normal', 'Meningkat', 'Tinggi (>0.5)') : null;

    let ni, nc;
    if (nlr <= 3) { ni='NLR normal — tidak ada inflamasi sistemik signifikan.'; nc='text-teal-500 border-teal-500 bg-teal-500/10'; }
    else if (nlr <= 5) { ni='NLR meningkat — inflamasi aktif. Evaluasi konteks klinis (infeksi, stres, post-op).'; nc='text-amber-500 border-amber-500 bg-amber-500/10'; }
    else if (nlr <= 9) { ni='NLR tinggi — inflamasi berat. Berkorelasi dengan sepsis, pneumonia berat, AMI.'; nc='text-amber-500 border-amber-500 bg-amber-500/10'; }
    else { ni='NLR sangat tinggi (>9) — prediktor mortalitas ICU. Indikator respons inflamasi masif.'; nc='text-red-500 border-red-500 bg-red-500/10'; }

    setRes({ nlr, plr, sii, mlr, n, p, s, m, ni, nc, wbcNote });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Active Patient & Sync Banner */}
      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />

      <div className="flex bg-slate-100 dark:bg-[#2C2C2E] p-1 rounded-xl w-full max-w-lg mx-auto shadow-sm mb-4">
        <button className={`flex-1 py-1.5 text-[12px] md:text-[13px] font-bold rounded-lg transition-colors ${mode === 'abs' ? 'bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'}`} onClick={() => setMode('abs')}>Absolut (10³/µL)</button>
        <button className={`flex-1 py-1.5 text-[12px] md:text-[13px] font-bold rounded-lg transition-colors ${mode === 'pct' ? 'bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'}`} onClick={() => setMode('pct')}>Persen (%)</button>
      </div>

      <div className="flex flex-col gap-0 mt-2">
         <h2 className="mb-2 px-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
           Indeks Inflamasi
         </h2>
         
         <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mx-4">
            {mode === 'abs' ? (
              <>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Neutrofil</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={neutA} onChange={e=>setNeutA(e.target.value)} />
                     <span className="text-xs font-semibold text-slate-500 w-12 text-left">10³/µL</span>
                   </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Limfosit</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={lymphA} onChange={e=>setLymphA(e.target.value)} />
                     <span className="text-xs font-semibold text-slate-500 w-12 text-left">10³/µL</span>
                   </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Monosit</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={monoA} onChange={e=>setMonoA(e.target.value)} />
                     <span className="text-xs font-semibold text-slate-500 w-12 text-left">10³/µL</span>
                   </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Trombosit</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={pltA} onChange={e=>setPltA(e.target.value)} />
                     <span className="text-xs font-semibold text-slate-500 w-12 text-left">10³/µL</span>
                   </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">WBC Total (opsional)</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={wbcA} onChange={e=>setWbcA(e.target.value)} />
                     <span className="text-xs font-semibold text-slate-500 w-12 text-left">10³/µL</span>
                   </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">WBC Total (wajib)</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={wbcP} onChange={e=>setWbcP(e.target.value)} />
                     <span className="text-xs font-semibold text-slate-500 w-12 text-left">10³/µL</span>
                   </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Neutrofil</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={neutP} onChange={e=>setNeutP(e.target.value)} />
                     <span className="text-xs font-semibold text-slate-500 w-12 text-left">%</span>
                   </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Limfosit</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={lymphP} onChange={e=>setLymphP(e.target.value)} />
                     <span className="text-xs font-semibold text-slate-500 w-12 text-left">%</span>
                   </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Monosit</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={monoP} onChange={e=>setMonoP(e.target.value)} />
                     <span className="text-xs font-semibold text-slate-500 w-12 text-left">%</span>
                   </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Trombosit</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={pltP} onChange={e=>setPltP(e.target.value)} />
                     <span className="text-xs font-semibold text-slate-500 w-12 text-left">10³/µL</span>
                   </div>
                </div>
              </>
            )}
         </div>
         
         <div className="px-4 mt-4">
            <button onClick={calculate} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px]">
               Hitung Indeks
            </button>
         </div>

         {res && (
           <div className="px-4 mt-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
             <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4">
               {res.wbcNote && (
                 <div className="flex gap-2.5 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-3 rounded-lg border border-red-200 dark:border-red-800/30 text-[13px] mb-4">
                   <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                   <div>{res.wbcNote}</div>
                 </div>
               )}

               <div className="grid grid-cols-2 gap-3 mb-4">
                 <div className={`p-3 rounded-xl border ${res.n.color === 'text-red-500' ? 'bg-red-50/50 border-red-200 text-red-800' : res.n.color === 'text-amber-500' ? 'bg-amber-50/50 border-amber-200 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-800'} dark:bg-[#2C2C2E] dark:border-slate-700 dark:text-slate-200`}>
                   <div className="text-[11px] font-bold uppercase tracking-wide mb-0.5 opacity-60">NLR</div>
                   <div className="text-2xl font-black">{res.nlr.toFixed(2)}</div>
                   <div className={`text-[10px] font-semibold mt-1 ${res.n.color}`}>{res.n.lbl}</div>
                 </div>
                 {res.plr && (
                   <div className={`p-3 rounded-xl border ${res.p.color === 'text-red-500' ? 'bg-red-50/50 border-red-200 text-red-800' : res.p.color === 'text-amber-500' ? 'bg-amber-50/50 border-amber-200 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-800'} dark:bg-[#2C2C2E] dark:border-slate-700 dark:text-slate-200`}>
                     <div className="text-[11px] font-bold uppercase tracking-wide mb-0.5 opacity-60">PLR</div>
                     <div className="text-2xl font-black">{res.plr.toFixed(1)}</div>
                     <div className={`text-[10px] font-semibold mt-1 ${res.p.color}`}>{res.p.lbl}</div>
                   </div>
                 )}
                 {res.sii && (
                   <div className={`p-3 rounded-xl border ${res.s.color === 'text-red-500' ? 'bg-red-50/50 border-red-200 text-red-800' : res.s.color === 'text-amber-500' ? 'bg-amber-50/50 border-amber-200 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-800'} dark:bg-[#2C2C2E] dark:border-slate-700 dark:text-slate-200`}>
                     <div className="text-[11px] font-bold uppercase tracking-wide mb-0.5 opacity-60">SII</div>
                     <div className="text-2xl font-black">{Math.round(res.sii)}</div>
                     <div className={`text-[10px] font-semibold mt-1 ${res.s.color}`}>{res.s.lbl}</div>
                   </div>
                 )}
                 {res.mlr && (
                   <div className={`p-3 rounded-xl border ${res.m.color === 'text-red-500' ? 'bg-red-50/50 border-red-200 text-red-800' : res.m.color === 'text-amber-500' ? 'bg-amber-50/50 border-amber-200 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-800'} dark:bg-[#2C2C2E] dark:border-slate-700 dark:text-slate-200`}>
                     <div className="text-[11px] font-bold uppercase tracking-wide mb-0.5 opacity-60">MLR</div>
                     <div className="text-2xl font-black">{res.mlr.toFixed(2)}</div>
                     <div className={`text-[10px] font-semibold mt-1 ${res.m.color}`}>{res.m.lbl}</div>
                   </div>
                 )}
               </div>

               <div className={`p-3 rounded-xl text-[13px] font-medium leading-relaxed ${res.nc} border`}>
                 <div className="font-bold text-[11px] uppercase tracking-wider mb-1 opacity-80">Interpretasi Klinis NLR</div>
                 {res.ni}
               </div>
             </div>
           </div>
         )}
      </div>

      <Accordion title="📖 Teori & Referensi: NLR, PLR, MLR, dan SII">
        <ul className="pl-4 space-y-2 mb-4 list-disc text-slate-600 dark:text-slate-400 text-[13px] leading-relaxed">
          <li><strong className="text-slate-800 dark:text-slate-200">Neutrophil-to-Lymphocyte Ratio (NLR):</strong> Indikator keseimbangan antara respon inflamasi sistemik (Neutrofil) dan tingkat regulasi adaptif serta imunitas (Limfosit). Secara klasik, NLR &gt; 3.0 mengindikasikan inflamasi patologis, dan NLR &gt; 5.0 atau 6.0 sering digunakan sebagai threshold risiko tinggi (terutama masa Pandemi COVID-19 maupun Sepsis berat).</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Platelet-to-Lymphocyte Ratio (PLR):</strong> Trombosit sebagai penanda respon imun prothrombotic. Peningkatan dramatis PLR (sering ditandai di atas 150 - 200) konsisten dengan keadaan inflamasi aktif kronis/keganasan atau preeklampsia.</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Systemic Immune-inflammation Index (SII):</strong> Formula: (Neutrofil &times; Trombosit) / Limfosit. Marker terpadu yang kuat untuk prognosis sepsis dan evaluasi keganasan solid. SII yang terlampau tinggi menandakan perburukan agresif sistem imun.</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 Zahorec R. (2001) Ratio of neutrophil to lymphocyte. Bratisl Lek Listy; Hu B et al. (2014) SII Index. Clin Cancer Res.
        </div>
      </Accordion>
    </div>
  );
}