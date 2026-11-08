import React, { useMemo, useState } from 'react';
import { Activity } from 'lucide-react';
import { SaveToHistoryButton } from '../../../components/ui/SaveToHistoryButton';
import { UnifiedSyncBanner, type SyncField } from '../../../components/UnifiedSyncBanner';
import { stageAki, type AkiResult } from '../../../utils/aki';

const STAGE_STYLE: Record<number, { desc: string; color: string }> = {
  0: { desc: 'Tidak memenuhi kriteria AKI', color: 'text-emerald-600 dark:text-emerald-400' },
  1: { desc: 'AKI Stage 1', color: 'text-amber-600 dark:text-amber-400' },
  2: { desc: 'AKI Stage 2', color: 'text-orange-500' },
  3: { desc: 'AKI Stage 3', color: 'text-red-600 dark:text-red-400' },
};

export function RenalAkiStaging() {
  const [baselineScr, setBaselineScr] = useState('');
  const [currentScr, setCurrentScr] = useState('');
  const [urineOutput, setUrineOutput] = useState('');
  const [urineDuration, setUrineDuration] = useState('');
  const [weight, setWeight] = useState('');
  const [rrt, setRrt] = useState(false);

  const [res, setRes] = useState<(AkiResult & { desc: string; color: string }) | null>(null);

  const syncFields = useMemo<SyncField[]>(() => [
    { key: 'creatinineBaseline', label: 'SCr basal', value: baselineScr, setter: setBaselineScr, unit: 'mg/dL' },
    { key: 'creatinine', label: 'SCr saat ini', value: currentScr, setter: setCurrentScr, unit: 'mg/dL' },
    { key: 'weight', label: 'BB', value: weight, setter: setWeight, unit: 'kg' },
  ], [baselineScr, currentScr, weight]);

  const calculate = () => {
    const num = (v: string) => (v.trim() === '' ? undefined : parseFloat(v));
    const r = stageAki({
      baselineScr: num(baselineScr), currentScr: num(currentScr), rrt,
      uoMl: num(urineOutput), uoHours: num(urineDuration), weightKg: num(weight),
    });
    const style = r.stage === null
      ? { desc: 'Belum dapat dinilai', color: 'text-slate-600 dark:text-slate-300' }
      : STAGE_STYLE[r.stage];
    setRes({ ...r, ...style });
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      <UnifiedSyncBanner fields={syncFields} />
      <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
        <div className="p-3 text-[12px] font-bold text-slate-500 uppercase tracking-wide">Kriteria Serum Kreatinin</div>
        <div className="flex items-center justify-between px-4 py-3 gap-4">
          <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">SCr Baseline</span>
          <div className="flex-1 flex items-center justify-end gap-2">
            <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 text-right font-bold focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={baselineScr} onChange={e=>setBaselineScr(e.target.value)} placeholder="nilai stabil sebelum sakit" />
            <span className="text-xs text-slate-500 w-10">mg/dL</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 gap-4">
          <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">SCr Saat Ini</span>
          <div className="flex-1 flex items-center justify-end gap-2">
            <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 text-right font-bold focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={currentScr} onChange={e=>setCurrentScr(e.target.value)} placeholder="terbaru" />
            <span className="text-xs text-slate-500 w-10">mg/dL</span>
          </div>
        </div>
        <label className="flex items-center gap-3 px-4 py-3 cursor-pointer">
          <input type="checkbox" checked={rrt} onChange={e => setRrt(e.target.checked)} className="w-4 h-4 accent-blue-600" />
          <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Sudah dimulai terapi pengganti ginjal (RRT) → stage 3</span>
        </label>
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
          {res.reasons.length > 0 && (
            <ul className="mt-3 text-left text-[13px] text-slate-700 dark:text-slate-300 space-y-1 list-disc pl-5">
              {res.reasons.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          )}
          {res.notes.length > 0 && (
            <div className="mt-3 text-left text-[12px] text-amber-800 dark:text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 space-y-1">
              {res.notes.map((n, i) => <div key={i}>• {n}</div>)}
            </div>
          )}
          <div className="mt-4">
            <SaveToHistoryButton 
              module="renal_aki" 
              label={res.desc}
              inputs={{ baselineScr, currentScr, rrt, urineOutput, weight, urineDuration }}
              summary={`Staging AKI KDIGO: ${res.desc}`}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
