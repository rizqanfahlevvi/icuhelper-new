import React, { useState } from 'react';
import { AlertTriangle, Activity } from 'lucide-react';
import { SaveToHistoryButton } from '../../../components/ui/SaveToHistoryButton';

export function RenalAkiStaging() {
  const [baselineScr, setBaselineScr] = useState('');
  const [currentScr, setCurrentScr] = useState('');
  const [urineOutput, setUrineOutput] = useState('');
  const [urineDuration, setUrineDuration] = useState('');
  const [weight, setWeight] = useState('');
  
  const [res, setRes] = useState<any>(null);

  const calculate = () => {
    const bScr = parseFloat(baselineScr);
    const cScr = parseFloat(currentScr);
    const uo = parseFloat(urineOutput);
    const uDur = parseFloat(urineDuration);
    const w = parseFloat(weight);

    if (!cScr && !uo) return;

    let stageScr = 0;
    if (bScr > 0 && cScr > 0) {
      const ratio = cScr / bScr;
      const diff = cScr - bScr;
      if (cScr >= 4.0 || ratio >= 3) stageScr = 3;
      else if (ratio >= 2) stageScr = 2;
      else if (ratio >= 1.5 || diff >= 0.3) stageScr = 1;
    }

    let stageUo = 0;
    if (uo >= 0 && uDur > 0 && w > 0) {
      const mlKgHr = uo / w / uDur;
      if (mlKgHr < 0.3 && uDur >= 24) stageUo = 3;
      else if (uo === 0 && uDur >= 12) stageUo = 3;
      else if (mlKgHr < 0.5 && uDur >= 12) stageUo = 2;
      else if (mlKgHr < 0.5 && uDur >= 6) stageUo = 1;
    }

    const finalStage = Math.max(stageScr, stageUo);
    
    let desc = '';
    let color = '';
    if (finalStage === 3) { desc = 'AKI Stage 3 (Berat)'; color = 'text-red-600 dark:text-red-400'; }
    else if (finalStage === 2) { desc = 'AKI Stage 2 (Sedang)'; color = 'text-orange-500'; }
    else if (finalStage === 1) { desc = 'AKI Stage 1 (Ringan)'; color = 'text-yellow-600 dark:text-yellow-500'; }
    else { desc = 'Tidak memenuhi kriteria AKI'; color = 'text-emerald-600 dark:text-emerald-400'; }

    setRes({ stage: finalStage, desc, color });
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
        <div className="p-3 text-[12px] font-bold text-slate-500 uppercase tracking-wide">Kriteria Serum Kreatinin</div>
        <div className="flex items-center justify-between px-4 py-3 gap-4">
          <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">SCr Baseline</span>
          <div className="flex-1 flex items-center justify-end gap-2">
            <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 text-right font-bold focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={baselineScr} onChange={e=>setBaselineScr(e.target.value)} placeholder="opsional" />
            <span className="text-xs text-slate-500 w-10">mg/dL</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 gap-4">
          <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">SCr Saat Ini</span>
          <div className="flex-1 flex items-center justify-end gap-2">
            <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 text-right font-bold focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={currentScr} onChange={e=>setCurrentScr(e.target.value)} placeholder="wajib bila tak ada UO" />
            <span className="text-xs text-slate-500 w-10">mg/dL</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
        <div className="p-3 text-[12px] font-bold text-slate-500 uppercase tracking-wide">Kriteria Urine Output (UO)</div>
        <div className="flex items-center justify-between px-4 py-3 gap-4">
          <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Berat Badan</span>
          <div className="flex-1 flex items-center justify-end gap-2">
            <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 text-right font-bold focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="kg" />
            <span className="text-xs text-slate-500 w-10">kg</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 gap-4">
          <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Total UO</span>
          <div className="flex-1 flex items-center justify-end gap-2">
            <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 text-right font-bold focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={urineOutput} onChange={e=>setUrineOutput(e.target.value)} placeholder="mL" />
            <span className="text-xs text-slate-500 w-10">mL</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 gap-4">
          <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Durasi Evaluasi</span>
          <div className="flex-1 flex items-center justify-end gap-2">
            <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 text-right font-bold focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={urineDuration} onChange={e=>setUrineDuration(e.target.value)} placeholder="jam" />
            <span className="text-xs text-slate-500 w-10">jam</span>
          </div>
        </div>
      </div>

      <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-sm transition-all text-sm flex items-center justify-center gap-2">
        <Activity className="w-4 h-4"/> Evaluasi Staging AKI
      </button>

      {res && (
        <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-5 text-center mt-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">Klasifikasi KDIGO 2012</div>
          <div className={`text-2xl font-black ${res.color}`}>{res.desc}</div>
          <div className="mt-4">
            <SaveToHistoryButton 
              module="renal_aki" 
              label={res.desc}
              inputs={{ baselineScr, currentScr, urineOutput, weight, urineDuration }}
              summary={`Staging AKI KDIGO: ${res.desc}`}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
