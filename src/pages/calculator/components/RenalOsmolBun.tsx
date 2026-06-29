import React, { useState } from 'react';
import { SaveToHistoryButton } from '../../../components/ui/SaveToHistoryButton';

export function RenalOsmolBun() {
  // Osmolalitas
  const [sna, setSna] = useState('');
  const [bun, setBun] = useState('');
  const [glucose, setGlucose] = useState('');
  const [measuredOsm, setMeasuredOsm] = useState('');

  // BUN:Cr
  const [bunRatio, setBunRatio] = useState('');
  const [scrRatio, setScrRatio] = useState('');

  const calculateOsmol = () => {
    const vNa = parseFloat(sna);
    const vBun = parseFloat(bun);
    const vGluc = parseFloat(glucose);
    const vMeas = parseFloat(measuredOsm);

    if (!vNa || !vGluc || !vBun) return null;

    const calcOsm = (2 * vNa) + (vGluc / 18) + (vBun / 2.8);
    let gap = null;
    if (vMeas > 0) {
      gap = vMeas - calcOsm;
    }
    return { calcOsm, gap };
  };

  const calculateRatio = () => {
    const vBun = parseFloat(bunRatio);
    const vScr = parseFloat(scrRatio);
    if (!vBun || !vScr) return null;
    return vBun / vScr;
  };

  const osmRes = calculateOsmol();
  const ratioRes = calculateRatio();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* SECTION 1: OSMOLALITAS */}
      <div>
        <h3 className="mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          Osmolalitas & Osmolar Gap
        </h3>
        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Sodium (Na)</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 text-right font-bold focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={sna} onChange={e=>setSna(e.target.value)} placeholder="140" />
              <span className="text-xs text-slate-500 w-12">mEq/L</span>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Ureum (BUN)</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 text-right font-bold focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={bun} onChange={e=>setBun(e.target.value)} placeholder="14" />
              <span className="text-xs text-slate-500 w-12">mg/dL</span>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Glukosa</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 text-right font-bold focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={glucose} onChange={e=>setGlucose(e.target.value)} placeholder="100" />
              <span className="text-xs text-slate-500 w-12">mg/dL</span>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4 bg-blue-50/50 dark:bg-blue-900/10">
            <span className="text-[13px] font-semibold text-blue-700 dark:text-blue-400">Osm Terukur (Opsi)</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-blue-50 dark:bg-blue-900/20 border-none rounded-lg px-3 py-2 text-right font-bold text-blue-700 focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={measuredOsm} onChange={e=>setMeasuredOsm(e.target.value)} placeholder="Lab" />
              <span className="text-xs text-blue-500/70 w-12">mOsm</span>
            </div>
          </div>
        </div>

        {osmRes && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Osmolalitas Kalkulasi</div>
              <div className="text-2xl font-black text-slate-800 dark:text-slate-200">{osmRes.calcOsm.toFixed(1)}</div>
              <div className="text-[11px] text-slate-500 mt-1">Normal: 275 - 295</div>
            </div>
            {osmRes.gap !== null ? (
              <div className={`border rounded-xl p-4 text-center ${osmRes.gap > 10 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'} dark:bg-[#1C1C1E] dark:border-slate-800`}>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Osmolar Gap</div>
                <div className={`text-2xl font-black ${osmRes.gap > 10 ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>{osmRes.gap.toFixed(1)}</div>
                <div className="text-[11px] text-slate-500 mt-1">&gt; 10 = curiga intoksikasi alkohol/toksin</div>
              </div>
            ) : (
               <div className="bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex items-center justify-center text-slate-400 text-[11px] text-center">
                 Masukkan Osmolalitas Terukur (Lab) untuk menghitung Gap
               </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
        <h3 className="mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          Rasio BUN : Kreatinin (Diferensiasi AKI)
        </h3>
        
        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mb-3">
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Ureum (BUN)</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 text-right font-bold focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={bunRatio} onChange={e=>setBunRatio(e.target.value)} placeholder="20" />
              <span className="text-xs text-slate-500 w-12">mg/dL</span>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Kreatinin</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 text-right font-bold focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={scrRatio} onChange={e=>setScrRatio(e.target.value)} placeholder="1.0" />
              <span className="text-xs text-slate-500 w-12">mg/dL</span>
            </div>
          </div>
        </div>

        {ratioRes && (
          <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Rasio BUN:Cr</div>
            <div className={`text-3xl font-black ${ratioRes > 20 ? 'text-orange-500' : ratioRes >= 10 ? 'text-blue-500' : 'text-emerald-500'}`}>
              {ratioRes.toFixed(1)}
            </div>
            <div className="text-[13px] font-medium mt-2 text-slate-700 dark:text-slate-300">
              {ratioRes > 20 ? 'Pre-Renal (Dehidrasi, Hipoperfusi)' : ratioRes >= 10 ? 'Normal / Post-Renal (Inkonklusif)' : 'Renal Intrinsik (ATN)'}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
