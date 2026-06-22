import React, { useState, useEffect, useMemo } from 'react';
import { Syringe, AlertTriangle } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';

export default function KalkulatorInsulin() {
  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();

  const [mode, setMode] = useState<'bbc' | 'ss' | 'hipo'>('bbc');

  // BBC & SS
  const [bb, setBb] = useState('');
  const [gds, setGds] = useState('');
  const [target, setTarget] = useState('150');
  const [tddPrev, setTddPrev] = useState('');
  const [makan, setMakan] = useState('makan');
  const [kondisi, setKondisi] = useState('normal');

  // Hipo
  const [hipoGds, setHipoGds] = useState('');
  const [hipoBb, setHipoBb] = useState('');
  const [hipoTarget, setHipoTarget] = useState('150');
  const [kesadaran, setKesadaran] = useState('sadar');
  const [route, setRoute] = useState('iv');

  // Auto-load on mount
  useEffect(() => {
    const parentWeight = patient.weightKg || clinicalStore.data.weight || '';
    if (parentWeight) {
      setBb(parentWeight);
      setHipoBb(parentWeight);
    }
    const parentGlucose = clinicalStore.data.glukosa || '';
    if (parentGlucose) {
      setGds(parentGlucose);
      setHipoGds(parentGlucose);
    }
  }, []);

  const syncFields = useMemo(() => {
    const activeWeight = mode === 'hipo' ? hipoBb : bb;
    const activeSetterWeight = mode === 'hipo' ? setHipoBb : setBb;

    const activeGds = mode === 'hipo' ? hipoGds : gds;
    const activeSetterGds = mode === 'hipo' ? setHipoGds : setGds;

    return [
      { key: 'weight' as const, label: 'Berat Badan', value: activeWeight, setter: activeSetterWeight, unit: 'kg' },
      { key: 'glukosa' as const, label: 'Glukosa', value: activeGds, setter: activeSetterGds, unit: 'mg/dL' },
    ];
  }, [mode, bb, hipoBb, gds, hipoGds]);

  const handleAutofill = (data: { weightKg: string }) => {
    if (data.weightKg) {
      setBb(data.weightKg);
      setHipoBb(data.weightKg);
    }
    if (clinicalStore.data.glukosa) {
      setGds(clinicalStore.data.glukosa);
      setHipoGds(clinicalStore.data.glukosa);
    }
  };

  const calcBBC = () => {
    const w = parseFloat(bb);
    const g = parseFloat(gds);
    const t = parseFloat(target) || 150;
    if (!w || !g) return null;

    if (g < 70) {
       return { 
         error: true, 
         msg: `GDS ${g} mg/dL — HIPOGLIKEMIA! Tatalaksana hipo dulu: D40% 25 mL IV bolus. STOP semua insulin.` 
       };
    }

    const tPrev = parseFloat(tddPrev);
    let doseFactor = 0.5;
    if (kondisi === 'ginjal' || kondisi === 'lansia' || kondisi === 'kritis') doseFactor = 0.3;
    else if (kondisi === 'steroid') doseFactor = 0.6;

    let tdd = (!isNaN(tPrev) && tPrev > 0) ? tPrev : Math.round(w * doseFactor);
    let basal = Math.round(tdd * 0.5);
    let bolusTotal = tdd - basal;

    let mealCount = makan === 'makan' ? 3 : makan === 'sebagian' ? 2 : 0;
    let bolusPerMeal = mealCount > 0 ? Math.round((bolusTotal / mealCount) * 10) / 10 : 0;

    let cf = Math.round(1800 / tdd);
    let correctionRaw = (g - t) / cf;
    let correction = Math.max(0, Math.round(correctionRaw * 10) / 10);

    let totalNow = mealCount > 0 ? Math.round((bolusPerMeal + correction) * 10) / 10 : correction;

    let warnings = [];
    if (kondisi === 'steroid') warnings.push('Steroid: pertimbangkan NPH pagi jika steroid 1x pagi.');
    if (kondisi === 'ginjal') warnings.push('GFR <30/HD: eliminasi insulin lambat — mulai dosis rendah.');
    if (kondisi === 'kritis') warnings.push('Pasien ICU: pertimbangkan insulin infus IV.');
    if (kondisi === 'lansia') warnings.push('Lansia: target lebih longgar (160–180) dianjurkan.');
    if (mealCount === 0) warnings.push('Pasien puasa/NPO: bolus makan distop, hanya basal + koreksi.');
    if (g > 350) warnings.push('GDS >350: pertimbangkan insulin infus IV.');

    return { error: false, tdd, basal, bolusPerMeal, cf, correction, totalNow, mealCount, warnings, tPrev, doseFactor, w, g, t };
  };

  const bbcRes = mode === 'bbc' ? calcBBC() : null;

  const ssLabel = (g: number) => {
    if (g < 70) return 'HIPOGLIKEMIA';
    if (g <= 200) return 'Tidak perlu koreksi';
    if (g <= 250) return '2N (2 unit)';
    if (g <= 300) return '4N (4 unit)';
    if (g <= 350) return '6N (6 unit)';
    return '8N (8 unit)';
  };

  const ssArr = [
    { min: 0, max: 69, lbl: '<70', d: '—', n: 'HIPOGLIKEMIA — stop insulin', c: 'text-red-500' },
    { min: 70, max: 200, lbl: '70–200', d: '—', n: 'Target / tidak perlu koreksi', c: 'text-green-500' },
    { min: 201, max: 250, lbl: '201–250', d: '2N', n: '2 unit Novorapid/Actrapid SC', c: 'text-foreground' },
    { min: 251, max: 300, lbl: '251–300', d: '4N', n: '4 unit', c: 'text-foreground' },
    { min: 301, max: 350, lbl: '301–350', d: '6N', n: '6 unit', c: 'text-foreground' },
    { min: 351, max: 999, lbl: '>350', d: '8N', n: '8 unit / lapor dokter', c: 'text-foreground' }
  ];

  const calcHipo = () => {
    const g = parseFloat(hipoGds);
    const w = parseFloat(hipoBb);
    const t = parseFloat(hipoTarget) || 150;
    if (!w || !g) return null;

    let lvl, lvlLbl, lvlCls;
    if (kesadaran === 'tidak-sadar') { lvl = 3; lvlLbl = 'Level 3 — Berat'; lvlCls = 'text-red-500 bg-red-500/10 border-red-500/20'; }
    else if (g < 54) { lvl = 2; lvlLbl = 'Level 2 — Signifikan'; lvlCls = 'text-orange-500 bg-orange-500/10 border-orange-500/20'; }
    else { lvl = 1; lvlLbl = 'Level 1 — Alert'; lvlCls = 'text-amber-500 bg-amber-500/10 border-amber-500/20'; }

    let delta = Math.max(t - g, 30);
    let glucG = Math.round(delta * 0.2 * w / 100 * 10) / 10;
    
    let volD40 = Math.round(glucG / 0.4 * 10) / 10;
    let volD20 = Math.round(glucG / 0.2 * 10) / 10;
    let volD10 = Math.round(glucG / 0.1 * 10) / 10;

    let d40Bolus = volD40 <= 25 ? '25 mL' : Math.ceil(volD40 / 25) * 25 + ' mL';

    return { lvlLbl, lvlCls, delta, glucG, volD40, volD20, volD10, d40Bolus };
  };

  const hipoRes = mode === 'hipo' ? calcHipo() : null;

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Active Patient Profile & Unified Sync Banner */}
      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />

      <div className="flex bg-slate-100 dark:bg-[#2C2C2E] p-1 rounded-xl w-full max-w-lg mx-auto shadow-sm mb-4 mt-2">
        <button className={`flex-1 py-1.5 text-[12px] md:text-[13px] font-bold rounded-lg transition-colors ${mode === 'bbc' ? 'bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'}`} onClick={() => setMode('bbc')}>Basal-Bolus</button>
        <button className={`flex-1 py-1.5 text-[12px] md:text-[13px] font-bold rounded-lg transition-colors ${mode === 'ss' ? 'bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'}`} onClick={() => setMode('ss')}>Sliding Scale</button>
        <button className={`flex-1 py-1.5 text-[12px] md:text-[13px] font-bold rounded-lg transition-colors ${mode === 'hipo' ? 'bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'}`} onClick={() => setMode('hipo')}>Koreksi Hipo</button>
      </div>

      <div className="flex flex-col gap-0 mt-2">
         <h2 className="mb-2 px-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
           {mode === 'bbc' ? 'Basal-Bolus-Koreksi' : mode === 'ss' ? 'Sliding Scale Insulin' : 'Koreksi Hipoglikemia'}
         </h2>

         {(mode === 'bbc' || mode === 'ss') && (
           <>
             <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mx-4">
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Berat Badan</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={bb} onChange={e=>setBb(e.target.value)} />
                     <span className="text-xs font-semibold text-slate-500 w-6 text-left">kg</span>
                   </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">GDS Saat Ini</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={gds} onChange={e=>setGds(e.target.value)} />
                     <span className="text-xs font-semibold text-slate-500 w-10 text-left">mg/dL</span>
                   </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Target GDS</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={target} onChange={e=>setTarget(e.target.value)} placeholder="150" />
                     <span className="text-xs font-semibold text-slate-500 w-10 text-left">mg/dL</span>
                   </div>
                </div>
                
                {mode === 'bbc' && (
                  <>
                    <div className="flex items-center justify-between px-4 py-3 gap-4">
                       <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">TDD Sblmnya (opsi)</span>
                       <div className="flex-1 flex items-center justify-end gap-2">
                         <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={tddPrev} onChange={e=>setTddPrev(e.target.value)} />
                         <span className="text-xs font-semibold text-slate-500 w-10 text-left">unit</span>
                       </div>
                    </div>
                    <div className="flex justify-between px-4 py-3 items-center gap-4">
                      <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left w-24">Status Makan</span>
                      <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={makan} onChange={e=>setMakan(e.target.value)}>
                        <option value="makan">Makan normal (3×)</option>
                        <option value="sebagian">Makan sebagian (1-2×)</option>
                        <option value="puasa">Puasa / NPO</option>
                      </select>
                    </div>
                    <div className="flex justify-between px-4 py-3 items-center gap-4">
                      <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left w-24">Kondisi Khusus</span>
                      <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={kondisi} onChange={e=>setKondisi(e.target.value)}>
                        <option value="normal">Tidak ada</option>
                        <option value="steroid">Terapi steroid</option>
                        <option value="ginjal">GFR &lt;30 / HD</option>
                        <option value="lansia">Lansia (&gt;70 th)</option>
                        <option value="kritis">Kritis (ICU)</option>
                      </select>
                    </div>
                  </>
                )}
             </div>

             {mode === 'bbc' && bbcRes && (
               <div className="px-4 mt-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
                 {bbcRes.error ? (
                   <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30 p-4 rounded-xl font-bold flex gap-3 text-[14px] shadow-sm">
                     <AlertTriangle className="w-5 h-5 shrink-0" /> {bbcRes.msg}
                   </div>
                 ) : (
                   <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden p-4">
                      
                      <div className="bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800/50 rounded-xl p-4 text-teal-700 dark:text-teal-400 text-center mb-4 shadow-sm">
                         <div className="text-[11px] font-bold uppercase tracking-widest opacity-80 mb-1">Total Diberikan Sekarang</div>
                         <div className="text-4xl font-black">{bbcRes.totalNow} <span className="font-semibold text-lg opacity-80">unit</span></div>
                         <div className="text-sm mt-1 opacity-90 font-medium">
                           {bbcRes.mealCount > 0 ? `Bolus (${bbcRes.bolusPerMeal}) + Koreksi (${bbcRes.correction})` : `Hanya Koreksi (${bbcRes.correction}) — Puasa`}
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-slate-50 dark:bg-[#2C2C2E] p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-center">
                          <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1">Total Daily (TDD)</div>
                          <div className="text-xl font-bold text-slate-800 dark:text-slate-200">{bbcRes.tdd} <span className="font-normal text-[12px] opacity-70">u</span></div>
                          <div className="text-[10px] font-medium opacity-60 text-slate-600 dark:text-slate-400">{bbcRes.tPrev ? 'Dari input' : `${bbcRes.w}kg × ${bbcRes.doseFactor}`}</div>
                        </div>
                        <div className="bg-slate-50 dark:bg-[#2C2C2E] p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-center">
                          <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1">Basal Malam</div>
                          <div className="text-xl font-bold text-slate-800 dark:text-slate-200">{bbcRes.basal} <span className="font-normal text-[12px] opacity-70">u</span></div>
                        </div>
                        <div className="bg-slate-50 dark:bg-[#2C2C2E] p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-center">
                          <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1">Bolus per Makan</div>
                          <div className="text-xl font-bold text-slate-800 dark:text-slate-200">{bbcRes.mealCount > 0 ? bbcRes.bolusPerMeal : '—'}</div>
                          <div className="text-[10px] font-medium opacity-60 text-slate-600 dark:text-slate-400">{bbcRes.mealCount > 0 ? `${bbcRes.mealCount}× sehari` : 'Puasa'}</div>
                        </div>
                        <div className="bg-slate-50 dark:bg-[#2C2C2E] p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-center">
                          <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1">Correction (CF)</div>
                          <div className="text-xl font-bold text-slate-800 dark:text-slate-200">{bbcRes.cf}</div>
                          <div className="text-[10px] font-medium opacity-60 text-slate-600 dark:text-slate-400">mg/dL per unit</div>
                        </div>
                      </div>

                      {bbcRes.warnings && bbcRes.warnings.length > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-3 text-sm text-amber-700 dark:text-amber-500 font-medium leading-snug">
                          <ul className="list-disc pl-5 space-y-1">
                            {bbcRes.warnings.map((w,i) => <li key={i}>{w}</li>)}
                          </ul>
                        </div>
                      )}
                   </div>
                 )}
               </div>
             )}

             {mode === 'ss' && ssArr && ssArr.length > 0 && (
               <div className="px-4 mt-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
                 <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                   <div className="p-3 bg-slate-50 dark:bg-[#2C2C2E] border-b border-slate-200 dark:border-slate-700 flex justify-between items-center text-[12px]">
                     <span className="font-bold text-slate-500 uppercase">Rentang GDS</span>
                     <span className="font-bold text-slate-500 uppercase">Dosis Insulin</span>
                   </div>
                   <div className="divide-y divide-slate-100 dark:divide-slate-800">
                     {ssArr.map((r, i) => {
                       const ag = parseInt(gds || '0');
                       const active = ag >= r.min && ag <= r.max;
                       return (
                       <div key={i} className={`flex justify-between items-center p-3 text-[14px] ${active ? 'bg-teal-50 dark:bg-teal-900/20 font-bold text-teal-800 dark:text-teal-300' : 'text-slate-700 dark:text-slate-300'}`}>
                         <span>{r.lbl} mg/dL</span>
                         <span className="text-right">{r.d} {r.d.includes('N') ? 'Unit' : ''}</span>
                       </div>
                     )})}
                   </div>
                   <div className="p-4 bg-slate-50 dark:bg-[#2C2C2E] border-t border-slate-200 dark:border-slate-700 text-[12px] text-slate-500 leading-relaxed italic">
                     *Pemberian secara Subkutan (SC) Rapid Acting Insulin. Pemantauan ketat setiap 4 jam direkomendasikan pada pasien dengan risiko hipoglikemia.
                   </div>
                 </div>
               </div>
             )}
           </>
         )}

         {mode === 'hipo' && (
           <>
             <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mx-4">
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">GDS Saat Ini</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={hipoGds} onChange={e=>setHipoGds(e.target.value)} placeholder="mis: 45" />
                     <span className="text-xs font-semibold text-slate-500 w-10 text-left">mg/dL</span>
                   </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Berat Badan</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={hipoBb} onChange={e=>setHipoBb(e.target.value)} />
                     <span className="text-xs font-semibold text-slate-500 w-6 text-left">kg</span>
                   </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Target GDS</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={hipoTarget} onChange={e=>setHipoTarget(e.target.value)} placeholder="150" />
                     <span className="text-xs font-semibold text-slate-500 w-10 text-left">mg/dL</span>
                   </div>
                </div>
                <div className="flex justify-between px-4 py-3 items-center gap-4">
                  <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left w-24">Kesadaran</span>
                  <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={kesadaran} onChange={e=>setKesadaran(e.target.value)}>
                    <option value="sadar">Sadar penuh</option>
                    <option value="mengantuk">Mengantuk / konfusi</option>
                    <option value="tidak-sadar">Tidak sadar / NPO</option>
                  </select>
                </div>
                <div className="flex justify-between px-4 py-3 items-center gap-4">
                  <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left w-24">Route Medis</span>
                  <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={route} onChange={e=>setRoute(e.target.value)}>
                    <option value="iv">Ada akses IV</option>
                    <option value="oral">Bisa oral / NGT</option>
                    <option value="im">Injeksi IM / SC</option>
                  </select>
                </div>
             </div>
             
             <div className="px-4 mt-4">
               {hipoRes ? (
                 <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 space-y-4">
                   <div className={`px-5 py-3 border rounded-xl text-center text-sm font-bold shadow-sm ${hipoRes.lvlCls}`}>{hipoRes.lvlLbl}</div>
                   
                   <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                     <div className="text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Kebutuhan Glukosa</div>
                     <div className="flex justify-between items-center mb-2 text-sm text-slate-800 dark:text-slate-200">
                       <span className="text-slate-600 dark:text-slate-400">Kenaikan (Δ)</span>
                       <span className="font-bold text-slate-900 dark:text-slate-100">{hipoRes.delta.toFixed(1)} mg/dL</span>
                     </div>
                     <div className="flex justify-between items-center text-sm text-slate-800 dark:text-slate-200">
                       <span className="text-slate-600 dark:text-slate-400">Glukosa dibutuhkan</span>
                       <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{hipoRes.glucG.toFixed(1)} g</span>
                     </div>
                     <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">Formula: Δ × 0.2 × BB / 100</div>
                   </div>

                   {route === 'iv' && (
                     <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 shadow-sm rounded-xl p-4">
                        <div className="text-[12px] font-bold text-blue-700 dark:text-blue-400 mb-3 uppercase tracking-wide">D40% (Dextrose 40%) ★ Pilihan Cepat</div>
                        <div className="flex justify-between items-center mb-2 text-sm text-slate-800 dark:text-slate-200">
                          <span className="text-blue-700/80 dark:text-blue-300/80">Kalkulasi volume</span>
                          <span className="font-bold text-blue-900 dark:text-blue-100">{hipoRes.volD40.toFixed(0)} mL</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-slate-800 dark:text-slate-200">
                          <span className="text-blue-700/80 dark:text-blue-300/80">Protokol</span>
                          <span className="font-bold text-red-600 dark:text-red-400">{hipoRes.d40Bolus} IV bolus pelan</span>
                        </div>
                        <div className="text-[11px] text-blue-600/70 dark:text-blue-400/70 mt-3 pt-2 border-t border-blue-200/50 dark:border-blue-800/50">Berikan pelan dalam 1-3 menit. Flush dengan NaCl. Wajib evaluasi GDS ulang 15 menit sesudahnya.</div>
                     </div>
                   )}

                   {route === 'oral' && (
                     <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4">
                        <div className="text-[12px] font-bold text-amber-700 dark:text-amber-500 mb-2 uppercase tracking-wide">Rule of 15 (Terapi Oral)</div>
                        <div className="text-[13px] space-y-1.5 text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
                          <p>1. Berikan segera 15 gram karbohidrat (150 mL jus / teh manis hangat atau 3 sdm gula/madu)</p>
                          <p>2. Evaluasi GDS ulang setelah 15 menit</p>
                          <p>3. Ulangi bila GDS masih di bawah target</p>
                          <p>4. Jika terpasang NGT: pertimbangkan Maintenance D10% {hipoRes.volD10.toFixed(0)} mL</p>
                        </div>
                     </div>
                   )}

                   {route === 'im' && (
                     <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl p-4">
                        <div className="text-[12px] font-bold text-red-700 dark:text-red-500 mb-2 uppercase tracking-wide">Injeksi Glucagon IM/SC</div>
                        <div className="text-[13px] space-y-1.5 text-red-900 dark:text-red-200 font-medium leading-relaxed">
                          <p>Dewasa atau Anak &gt;25kg: <strong>1 mg</strong> IM / SC</p>
                          <p>Anak &lt;25kg: <strong>0.5 mg</strong> IM / SC</p>
                          <p className="mt-2 text-[11px] italic opacity-80">*Glucagon menguras cadangan glikogen hati. Segera berikan karbohidrat kompleks/IV setelah pasien pulih kesadarannya.</p>
                        </div>
                     </div>
                   )}
                 </div>
               ) : (
                 <div className="flex items-center justify-center p-6 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 text-sm bg-slate-50/50 dark:bg-[#1C1C1E]">
                   Masukkan nilai GDS hipoglikemia (&lt; 70 mg/dL)
                 </div>
               )}
             </div>
           </>
         )}
      </div>

      <Accordion title="📖 Teori & Referensi: Terapi Insulin & Hipoglikemia">
        <ul className="pl-4 space-y-2 mb-4 list-disc text-slate-600 dark:text-slate-400 text-[13px] leading-relaxed">
          <li><strong className="text-slate-800 dark:text-slate-200">Basal-Bolus-Correction (BBC):</strong> Regimen insulin fisiologis terfavorit untuk pasien DM di ruang rawat inap. Komponennya: (1) Basal untuk glukosa puasa (50% dari TDD), (2) Prandial/Bolus untuk mengatasi beban makanan (50% dibagi 3 makan), dan (3) Koreksional untuk hiperglikemia persisten berdasar sensitivitas (1800/TDD). TDD (Total Daily Dose) awal bervariasi dari 0.2 unit/kg (risiko hipoglikemi/CKD) hingga 0.5 unit/kg (DM kronis/obesitas).</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Sliding Scale (Koreksional Independen):</strong> Penggunaan regimen reaktif (hanya memberikan insulin saat gula sudah tinggi). Menurut panduan ADA terbaru, penggunaan Sliding Scale secara independen untuk jangka panjang sangat tidak disarankan karena mencetuskan fluktuasi glukosa yang buruk, namun bisa digunakan sementara.</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Manajemen Hipoglikemia:</strong> Rule of 15: Berikan 15g karbohidrat simpleks (jika pasien sadar) dan cek ulang GDS 15 menit kemudian. Untuk pasien tidak sadar (Koma Hipoglikemik), berikan Dekstrosa IV bolus cepat (D40% sebanyak 25-50 mL atau 1-2 flakon).</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 American Diabetes Association (ADA) Standards of Medical Care in Diabetes; PERKENI KONSENSUS PENGELOLAAN DIABETES MELITUS.
        </div>
      </Accordion>
    </div>
  );
}

