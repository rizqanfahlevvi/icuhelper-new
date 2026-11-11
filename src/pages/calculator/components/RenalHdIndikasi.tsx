import React, { useState } from 'react';
import { CalcActionBar } from '../../../components/ui/CalcActionBar';
import { ShieldAlert, Info } from 'lucide-react';
import { SaveToHistoryButton } from '../../../components/ui/SaveToHistoryButton';

export function RenalHdIndikasi() {
  const [acidosis, setAcidosis] = useState(false);
  const [electrolytes, setElectrolytes] = useState(false);
  const [intoxication, setIntoxication] = useState(false);
  const [overload, setOverload] = useState(false);
  const [uremia, setUremia] = useState(false);
  // AKIKI-2 (Gaudry, Lancet 2021): pada AKI stage 3 dengan oliguria >72 jam atau BUN >112 mg/dL,
  // menunda RRT lebih lama berkaitan dengan mortalitas lebih tinggi.
  const [oliguria72, setOliguria72] = useState(false);
  const [bunHigh, setBunHigh] = useState(false);

  const activeCount = [acidosis, electrolytes, intoxication, overload, uremia].filter(Boolean).length;
  const isIndicated = activeCount > 0;
  const akiki2 = oliguria72 || bunHigh;

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4 flex gap-3 items-start">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
          Kriteria <strong>AEIOU</strong> adalah indikasi konvensional/mendesak untuk memulai terapi pengganti ginjal (RRT) pada AKI. KDIGO 2012 tidak menetapkan ambang angka baku. Pada AKI berat <em>tanpa</em> komplikasi tersebut, memulai RRT lebih dini tidak menurunkan mortalitas (AKIKI 2016, STARRT-AKI 2020) dan sebagian pasien pulih tanpa RRT.
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-[var(--dk-surface-2)] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
        <label className="flex items-start gap-3 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors rounded-t-xl">
          <input type="checkbox" checked={acidosis} onChange={e=>setAcidosis(e.target.checked)} className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
          <div className="flex-1">
            <div className="text-[14px] font-bold text-slate-800 dark:text-slate-200">A — Acidosis (Asidosis Berat)</div>
            <div className="text-[12px] text-slate-500 mt-1">Asidosis metabolik berat yang refrakter terhadap terapi medis (contoh ambang yang lazim dipakai: pH &lt; 7,1 — tidak ada ambang baku).</div>
          </div>
        </label>
        
        <label className="flex items-start gap-3 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors">
          <input type="checkbox" checked={electrolytes} onChange={e=>setElectrolytes(e.target.checked)} className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
          <div className="flex-1">
            <div className="text-[14px] font-bold text-slate-800 dark:text-slate-200">E — Electrolytes (Hiperkalemia)</div>
            <div className="text-[12px] text-slate-500 mt-1">Hiperkalemia refrakter terhadap terapi medis (contoh ambang yang lazim dipakai: K &gt; 6,5 mEq/L — tidak ada ambang baku) atau perubahan EKG/disritmia.</div>
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
            <div className="text-[12px] text-slate-500 mt-1">Komplikasi uremik klinis: ensefalopati, perikarditis, perdarahan uremik, neuropati/miopati — keputusan berdasarkan gejala, bukan angka ureum semata.</div>
          </div>
        </label>
      </div>

      <div className="bg-slate-50 dark:bg-[var(--dk-surface-2)] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
        <div className="p-3 text-[12px] font-bold text-slate-500 uppercase tracking-wide">AKI stage 3 tanpa komplikasi di atas (AKIKI)</div>
        <label className="flex items-start gap-3 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors">
          <input type="checkbox" checked={oliguria72} onChange={e=>setOliguria72(e.target.checked)} className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
          <div className="flex-1">
            <div className="text-[14px] font-bold text-slate-800 dark:text-slate-200">Oliguria &gt; 72 jam</div>
          </div>
        </label>
        <label className="flex items-start gap-3 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors rounded-b-xl">
          <input type="checkbox" checked={bunHigh} onChange={e=>setBunHigh(e.target.checked)} className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
          <div className="flex-1">
            <div className="text-[14px] font-bold text-slate-800 dark:text-slate-200">BUN &gt; 112 mg/dL (≈ ureum &gt; 240 mg/dL)</div>
            <div className="text-[12px] text-slate-500 mt-1">Lab Indonesia umumnya melaporkan ureum: ureum = BUN × 2,14.</div>
          </div>
        </label>
      </div>

      {akiki2 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-[13px] text-amber-800 dark:text-amber-300 leading-relaxed">
          <strong>Pertimbangkan memulai RRT.</strong> Ini kriteria inisiasi strategi "tunda" pada AKIKI; pada AKIKI-2, menunda lebih lama lagi (sampai BUN 140 mg/dL atau muncul indikasi mendesak) tidak memberi manfaat dan berkaitan dengan mortalitas 60 hari lebih tinggi (HR 1,65).
        </div>
      )}

      {isIndicated && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl p-5 text-center mt-2 animate-in fade-in zoom-in-95">
          <ShieldAlert className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <div className="text-[15px] font-bold text-red-700 dark:text-red-400">INDIKASI RRT MENDESAK</div>
          <div className="text-[13px] text-red-600/80 dark:text-red-400 mt-1">Terdapat {activeCount} indikasi mendesak untuk memulai RRT. Pertimbangkan konsul Nefrologi segera.</div>
          
          <div className="mt-4">
            <SaveToHistoryButton 
              module="renal_hd" 
              label={`Indikasi HD: Ya (${activeCount} kriteria)`}
              inputs={{ acidosis, electrolytes, intoxication, overload, uremia, oliguria72, bunHigh }}
              summary={`Indikasi absolut RRT terpenuhi: ${[acidosis&&'Acidosis', electrolytes&&'Electrolytes', intoxication&&'Intoxication', overload&&'Overload', uremia&&'Uremia'].filter(Boolean).join(', ')}`}
              className="w-full"
            />
          </div>
        </div>
      )}
      
      {!isIndicated && !akiki2 && (
        <div className="bg-white dark:bg-[var(--dk-surface-1)] border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-center mt-2 text-slate-500 text-[13px]">
          Belum ada indikasi mendesak (AEIOU) maupun kriteria AKIKI yang dipilih.
        </div>
      )}

      {/* Daftar centang → bilah selalu live (tanpa tombol Hitung). Label sama dengan kotak hasil di atas. */}
      <CalcActionBar
        mode="live"
        summary={isIndicated ? `INDIKASI RRT MENDESAK · ${activeCount} kriteria AEIOU` : akiki2 ? 'Pertimbangkan memulai RRT (kriteria AKIKI)' : 'Belum ada indikasi mendesak'}
        summaryTone={isIndicated ? 'bad' : akiki2 ? 'warn' : 'neutral'}
        caption={isIndicated ? 'Pertimbangkan konsul Nefrologi segera' : 'Centang kriteria yang terpenuhi'}
      />

      <div className="text-[11px] text-slate-500 dark:text-slate-400 italic leading-relaxed">
        📚 KDIGO AKI Guideline 2012 · Gaudry S et al. (AKIKI) N Engl J Med 2016;375:122 · STARRT-AKI Investigators. N Engl J Med 2020;383:240 · Gaudry S et al. (AKIKI 2) Lancet 2021;397:1293. Alat bantu edukasi — keputusan RRT tetap bersama DPJP/nefrologi.
      </div>
    </div>
  );
}
