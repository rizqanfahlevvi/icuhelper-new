import React, { useState } from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { SaveToHistoryButton } from '../../../components/ui/SaveToHistoryButton';

export function RenalHdIndikasi() {
  const [acidosis, setAcidosis] = useState(false);
  const [electrolytes, setElectrolytes] = useState(false);
  const [intoxication, setIntoxication] = useState(false);
  const [overload, setOverload] = useState(false);
  const [uremia, setUremia] = useState(false);

  const activeCount = [acidosis, electrolytes, intoxication, overload, uremia].filter(Boolean).length;
  const isIndicated = activeCount > 0;

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4 flex gap-3 items-start">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
          Kriteria <strong>AEIOU</strong> merepresentasikan indikasi absolut inisiasi terapi pengganti ginjal (Renal Replacement Therapy / RRT) pada kondisi akut (KDIGO / STARRT-AKI).
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
        <label className="flex items-start gap-3 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors rounded-t-xl">
          <input type="checkbox" checked={acidosis} onChange={e=>setAcidosis(e.target.checked)} className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
          <div className="flex-1">
            <div className="text-[14px] font-bold text-slate-800 dark:text-slate-200">A — Acidosis (Asidosis Berat)</div>
            <div className="text-[12px] text-slate-500 mt-1">Asidosis metabolik berat (pH &lt; 7.1) yang refrakter terhadap terapi medis.</div>
          </div>
        </label>
        
        <label className="flex items-start gap-3 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors">
          <input type="checkbox" checked={electrolytes} onChange={e=>setElectrolytes(e.target.checked)} className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
          <div className="flex-1">
            <div className="text-[14px] font-bold text-slate-800 dark:text-slate-200">E — Electrolytes (Hiperkalemia)</div>
            <div className="text-[12px] text-slate-500 mt-1">Hiperkalemia refrakter (K &gt; 6.5 mEq/L) atau disritmia akibat hiperkalemia.</div>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors">
          <input type="checkbox" checked={intoxication} onChange={e=>setIntoxication(e.target.checked)} className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
          <div className="flex-1">
            <div className="text-[14px] font-bold text-slate-800 dark:text-slate-200">I — Intoxications (Keracunan)</div>
            <div className="text-[12px] text-slate-500 mt-1">Intoksikasi bahan yang dapat didialisis (contoh: Lithium, Salisilat, Metanol, Etilen Glikol).</div>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors">
          <input type="checkbox" checked={overload} onChange={e=>setOverload(e.target.checked)} className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
          <div className="flex-1">
            <div className="text-[14px] font-bold text-slate-800 dark:text-slate-200">O — Overload (Kelebihan Cairan)</div>
            <div className="text-[12px] text-slate-500 mt-1">Edema paru akut atau fluid overload berat yang tidak responsif dengan diuretik.</div>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors rounded-b-xl">
          <input type="checkbox" checked={uremia} onChange={e=>setUremia(e.target.checked)} className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
          <div className="flex-1">
            <div className="text-[14px] font-bold text-slate-800 dark:text-slate-200">U — Uremia (Komplikasi Uremik)</div>
            <div className="text-[12px] text-slate-500 mt-1">Ensefalopati uremik, perikarditis, atau neuropati/miopati berat (umumnya BUN &gt; 100 mg/dL).</div>
          </div>
        </label>
      </div>

      {isIndicated && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl p-5 text-center mt-2 animate-in fade-in zoom-in-95">
          <ShieldAlert className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <div className="text-[15px] font-bold text-red-700 dark:text-red-400">INDIKASI RRT TERPENUHI</div>
          <div className="text-[13px] text-red-600/80 dark:text-red-400 mt-1">Terdapat {activeCount} kriteria absolut untuk segera memulai dialisis/RRT. Pertimbangkan konsul Nefrologi segera.</div>
          
          <div className="mt-4">
            <SaveToHistoryButton 
              module="renal_hd" 
              label={`Indikasi HD: Ya (${activeCount} kriteria)`}
              inputs={{ acidosis, electrolytes, intoxication, overload, uremia }}
              summary={`Indikasi absolut RRT terpenuhi: ${[acidosis&&'Acidosis', electrolytes&&'Electrolytes', intoxication&&'Intoxication', overload&&'Overload', uremia&&'Uremia'].filter(Boolean).join(', ')}`}
              className="w-full"
            />
          </div>
        </div>
      )}
      
      {!isIndicated && (
        <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-center mt-2 text-slate-500 text-[13px]">
          Belum ada indikasi absolut (kriteria AEIOU) yang dipilih.
        </div>
      )}
    </div>
  );
}
