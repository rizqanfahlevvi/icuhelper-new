import React, { useState } from 'react';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { Activity, ShieldAlert } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';

export default function ScoringCandida() {
  const [tpn, setTpn] = useState(false);
  const [surg, setSurg] = useState(false);
  const [multi, setMulti] = useState(false);
  const [sepsis, setSepsis] = useState(false);

  let total = 0;
  if (tpn) total += 1;
  if (surg) total += 1;
  if (multi) total += 1;
  if (sepsis) total += 2;

  const isHighRisk = total >= 3;

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Active Patient Widget */}
      <ActivePatientBriefCard />

      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
         
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
           <div>
             <h2 className="text-xl font-bold flex items-center gap-2">
               <ShieldAlert className="w-5 h-5 text-emerald-500" />
               Candida Score
             </h2>
             <p className="text-sm text-muted-foreground mt-1">Penilaian risiko infeksi Candida invasif di ICU</p>
           </div>
           <div className={`px-4 py-2 border rounded-xl text-center ${isHighRisk ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'}`}>
              <div className="text-xs opacity-80 font-semibold mb-1">Total Skor</div>
              <div className="text-3xl font-black">{total}</div>
           </div>
         </div>

         <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-sm text-amber-700 dark:text-amber-500 mb-6">
           <strong>📌 Indikasi:</strong> Pasien ICU non-neutropenik untuk menentukan perlu-tidaknya antijamur empiris.
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className={`flex items-start gap-3 p-4 border rounded-xl transition-all cursor-pointer ${tpn ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-[#3C3C3E]'}`}>
              <input type="checkbox" checked={tpn} onChange={e => setTpn(e.target.checked)} className="mt-1 w-5 h-5 accent-primary" />
              <div className="flex-1">
                <div className="font-bold text-sm">Total Parenteral Nutrition (TPN/NPT)</div>
                <div className="text-xs text-muted-foreground">Sedang mendapat nutrisi parenteral sentral aktif.</div>
              </div>
              <div className="font-bold text-lg text-primary">+1</div>
            </label>

            <label className={`flex items-start gap-3 p-4 border rounded-xl transition-all cursor-pointer ${surg ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-[#3C3C3E]'}`}>
              <input type="checkbox" checked={surg} onChange={e => setSurg(e.target.checked)} className="mt-1 w-5 h-5 accent-primary" />
              <div className="flex-1">
                <div className="font-bold text-sm">Operasi Mayor Saat Masuk ICU</div>
                <div className="text-xs text-muted-foreground">Termasuk operasi intra-abdomen, thoraks, jantung terbuka.</div>
              </div>
              <div className="font-bold text-lg text-primary">+1</div>
            </label>

            <label className={`flex items-start gap-3 p-4 border rounded-xl transition-all cursor-pointer ${multi ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-[#3C3C3E]'}`}>
              <input type="checkbox" checked={multi} onChange={e => setMulti(e.target.checked)} className="mt-1 w-5 h-5 accent-primary" />
              <div className="flex-1">
                <div className="font-bold text-sm">Kolonisasi Candida Multifokal</div>
                <div className="text-xs text-muted-foreground">Isolasi candida dari &gt;1 letak anatomi yang berbeda (sputum, feses, urin, dll.)</div>
              </div>
              <div className="font-bold text-lg text-primary">+1</div>
            </label>

            <label className={`flex items-start gap-3 p-4 border rounded-xl transition-all cursor-pointer ${sepsis ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-[#3C3C3E]'}`}>
              <input type="checkbox" checked={sepsis} onChange={e => setSepsis(e.target.checked)} className="mt-1 w-5 h-5 accent-primary" />
              <div className="flex-1">
                <div className="font-bold text-sm">Sepsis Berat / Septic Shock</div>
                <div className="text-xs text-muted-foreground">Sepsis dengan disfungsi organ akut (SOFA ≥2 + infeksi).</div>
              </div>
              <div className="font-bold text-lg text-primary">+2</div>
            </label>
         </div>

         <div className={`mt-6 p-4 rounded-xl border ${isHighRisk ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-500'}`}>
            <div className="font-bold text-sm mb-1">{isHighRisk ? 'Risiko Tinggi Infeksi Candida (Skor ≥ 3)' : 'Risiko Rendah Infeksi Candida (Skor < 3)'}</div>
            <div className="text-sm opacity-90 text-slate-800 dark:text-slate-200">
              {isHighRisk 
                ? 'Kandidiasis invasif mungkin terjadi. Pertimbangkan antijamur empiris (Flukonazol 400 mg/hari atau Ekinokandin). Evaluasi 4-5 hari.' 
                : 'Antijamur empiris TIDAK direkomendasikan. Pantau ketat.'}
            </div>
         </div>
      </div>

      <Accordion title="📖 Teori Candida Score (León et al. 2006)">
        <ul className="pl-4 space-y-1 list-disc text-muted-foreground text-sm">
          <li><strong className="text-foreground">Latar Belakang:</strong> Dikembangkan untuk mengidentifikasi pasien ICU non-neutropenik berisiko tinggi terhadap kandidiasis invasif, sehingga dapat memulai terapi antijamur empiris lebih cepat tanpa menunggu kultur positif (NPV &gt; 97%).</li>
          <li><strong className="text-foreground">Pilihan Antijamur (ESCMID/IDSA):</strong> Flukonazol 400 mg/hari jika pasien stabil, tidak ada riwayat terapi azole sebelumnya. Jika pasien dalam kondisi syok berat atau probabilitas *C. krusei / glabrata* tinggi, maka pilih Ekinokandin (Caspofungin / Micafungin).</li>
          <li><strong className="text-foreground">De-eskalasi:</strong> Turunkan dari ekinokandin ke flukonazol bila pasien sudah klinis stabil dan hasil kultur terbukti sensitif. Hentikan terapi sesudah 4-5 hari jika diagnostik negatif dan perbaikan klinis nyata.</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 León C et al. (2006) Crit Care Med; Pappas PG et al. (2016) Clin Infect Dis.
        </div>
      </Accordion>
    </div>
  );
}
