import React, { useState } from 'react';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { Wind } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { AbbrLegend } from '../../components/ui/AbbrLegend';
import { CalcActionBar } from '../../components/ui/CalcActionBar';

export default function ScoringCpis() {
  const [f1, setF1] = useState<number | null>(null);
  const [f2, setF2] = useState<number | null>(null);
  const [f3, setF3] = useState<number | null>(null);
  const [f4, setF4] = useState<number | null>(null);
  const [f5, setF5] = useState<number | null>(null);
  const [f6, setF6] = useState<number | null>(null);

  // Item belum dijawab = null (bukan 0) — skor/rekomendasi baru tampil setelah 6 item lengkap,
  // agar item yang terlewat tidak menurunkan skor lalu memicu saran menghentikan antibiotik.
  const items = [f1, f2, f3, f4, f5, f6];
  const answered = items.filter((v) => v !== null).length;
  const complete = answered === 6;
  const total = items.reduce<number>((a, v) => a + (v ?? 0), 0);
  const isVap = complete && total > 6;

  const btnClass = (val: number, cur: number | null) => {
    return `w-full text-left p-3 text-sm border rounded-xl transition-all ${
      val === cur 
      ? 'bg-blue-500 text-white shadow-md ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-[var(--dk-surface-1)] border-blue-500 font-bold' 
      : 'bg-slate-50 dark:bg-[var(--dk-surface-2)] border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[var(--dk-surface-4)] text-slate-700 dark:text-slate-300'
    }`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-6 py-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 overflow-x-hidden">
      {/* Active Patient Widget */}
      <ActivePatientBriefCard />

      <div className="bg-white dark:bg-[var(--dk-surface-1)] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
         
         <div className="hidden md:flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
           <div>
             <h2 className="text-xl font-bold flex items-center gap-2">
               <Wind className="w-5 h-5 text-teal-500" />
               CPIS
             </h2>
             <p className="text-sm text-muted-foreground mt-1">Clinical Pulmonary Infection Score</p>
           </div>
           <div className={`px-4 py-2 border rounded-xl text-center flex flex-col items-center justify-center ${isVap ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'}`}>
              <div className="text-xs opacity-80 font-semibold mb-1">Skor CPIS</div>
              <div className="text-3xl font-black">{complete ? total : '—'}</div>
              {!complete && <div className="text-[11px] font-semibold mt-0.5">{answered}/6 item dijawab</div>}
           </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2">
             <div className="font-bold text-sm">Suhu (°C)</div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
               <button onClick={() => setF1(0)} className={`${btnClass(0, f1)} min-h-[44px]`}>36.5 - 38.4 (0)</button>
               <button onClick={() => setF1(1)} className={`${btnClass(1, f1)} min-h-[44px]`}>38.5 - 38.9 (1)</button>
               <button onClick={() => setF1(2)} className={`${btnClass(2, f1)} min-h-[44px]`}>≥ 39.0 atau ≤ 36.0 (2)</button>
             </div>
           </div>

           <div className="space-y-2">
             <div className="font-bold text-sm">Leukosit Darah (per mm³)</div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
               <button onClick={() => setF2(0)} className={`${btnClass(0, f2)} min-h-[44px]`}>4,000 - 11,000 (0)</button>
               <button onClick={() => setF2(1)} className={`${btnClass(1, f2)} min-h-[44px]`}>&lt;4,000 atau &gt;11,000 (1)</button>
               <button onClick={() => setF2(2)} className={`${btnClass(2, f2)} min-h-[44px]`}>&lt;4k/&gt;11k + band form &ge;50% (2)</button>
             </div>
           </div>

           <div className="space-y-2">
             <div className="font-bold text-sm">Sekresi Trakea / Sputum</div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
               <button onClick={() => setF3(0)} className={`${btnClass(0, f3)} min-h-[44px]`}>Jarang / Tidak ada (0)</button>
               <button onClick={() => setF3(1)} className={`${btnClass(1, f3)} min-h-[44px]`}>Banyak (abundant), non purulen (1)</button>
               <button onClick={() => setF3(2)} className={`${btnClass(2, f3)} min-h-[44px]`}>Banyak (abundant), purulen (2)</button>
             </div>
           </div>

           <div className="space-y-2">
             <div className="font-bold text-sm">Oksigenasi (PaO₂/FiO₂ mmHg)</div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
               <button onClick={() => setF4(0)} className={`${btnClass(0, f4)} min-h-[44px]`}>&gt; 240 atau ada ARDS (0)</button>
               <button onClick={() => setF4(2)} className={`${btnClass(2, f4)} min-h-[44px]`}>&le; 240 tanpa ARDS (2)</button>
             </div>
           </div>

           <div className="space-y-2">
             <div className="font-bold text-sm">Radiografi Paru (Chest X-Ray)</div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
               <button onClick={() => setF5(0)} className={`${btnClass(0, f5)} min-h-[44px]`}>Infiltrat tidak ada (0)</button>
               <button onClick={() => setF5(1)} className={`${btnClass(1, f5)} min-h-[44px]`}>Infiltrat difus/patchy (1)</button>
               <button onClick={() => setF5(2)} className={`${btnClass(2, f5)} min-h-[44px]`}>Infiltrat terlokalisasi/segmental (2)</button>
             </div>
           </div>

           <div className="space-y-2">
             <div className="font-bold text-sm">Kultur Trakeal / Sputum</div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
               <button onClick={() => setF6(0)} className={`${btnClass(0, f6)} min-h-[44px]`}>Belum ada hasil / tidak ada patogen (0)</button>
               <button onClick={() => setF6(1)} className={`${btnClass(1, f6)} min-h-[44px]`}>Kuman patogen ditemukan (1)</button>
               <button onClick={() => setF6(2)} className={`${btnClass(2, f6)} min-h-[44px]`}>Kuman + Pewarnaan Gram sesuai (2)</button>
             </div>
           </div>
         </div>

         <div id="cpis-hasil" className="scroll-mt-4">
         {!complete ? (
           <div className="mt-6 p-4 rounded-xl border bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm">
             Jawab ke-6 item ({answered}/6) untuk melihat interpretasi. Bila kultur belum keluar, pilih "Belum ada hasil / tidak ada patogen" (CPIS modifikasi Singh dinilai tanpa kultur pada awal).
           </div>
         ) : (
         <div className={`mt-6 p-4 rounded-xl border ${isVap ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' : 'bg-teal-500/10 border-teal-500/20 text-teal-600 dark:text-teal-500'}`}>
            <div className="font-bold text-sm mb-1">{isVap ? 'CPIS > 6 (VAP Kemungkinan Besar)' : 'CPIS ≤ 6 (VAP kurang mungkin)'}</div>
            <div className="text-sm opacity-90 text-slate-800 dark:text-slate-200">
              {isVap 
                ? 'Lanjutkan antibiotik VAP sesuai panduan lokal. De-eskalasi berdasarkan kultur. Evaluasi dalam 48–72 jam.' 
                : 'Pertimbangkan de-eskalasi/penghentian antibiotik (Protokol Singh hari ke-3). Evaluasi ulang 24-48 jam.'}
            </div>
         </div>
         )}
         </div>
      </div>

      <Accordion title="📖 Teori CPIS — VAP Diagnosis & De-eskalasi Singh">
        <ul className="pl-4 space-y-1 list-disc text-muted-foreground text-sm">
          <li><strong className="text-foreground">Latar Belakang:</strong> CPIS pertama dipublikasikan Pugin et al. (1991). Modified CPIS (Singh et al. 2000) digunakan dalam protokol de-eskalasi: pasien VAP empiris dievaluasi pada hari ke-3.</li>
          <li><strong className="text-foreground">Protokol Singh:</strong> Jika CPIS &le; 6 dan kultur negatif, antibiotik dapat dihentikan pada hari ke-3.</li>
          <li><strong className="text-foreground">Keterbatasan CPIS:</strong> Sensitivitas dan spesifisitas moderat (65-72%). Panduan ATS/IDSA 2016 tidak lagi merekomendasikan CPIS sebagai alat diagnosis tunggal, melainkan lebih ke arah panduan untuk de-eskalasi antibiotik. Diagnosis klinis VAP tetap berdasarkan tanda klinis + kultur kuantitatif.</li>
          <li><strong className="text-foreground">Pedoman ERS/ESICM/ESCMID/ALAT 2017 (Torres et al.):</strong> diagnosis HAP/VAP tetap berbasis klinis + mikrobiologi; skor seperti CPIS bukan kriteria diagnosis tunggal.</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[var(--dk-surface-1)] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 Pugin J et al. (CPIS original) Am Rev Respir Dis 1991;143:1121 · Singh N et al. (modified CPIS + de-eskalasi) Am J Respir Crit Care Med 2000;162:505 · Kalil AC et al. (IDSA/ATS HAP/VAP 2016) Clin Infect Dis 2016;63:e61 · Torres A et al. (ERS/ESICM/ESCMID/ALAT HAP/VAP 2017) Eur Respir J 2017;50:1700582
        </div>
      </Accordion>
      <CalcActionBar
        mode="live"
        summary={complete ? `CPIS ${total} · ${isVap ? 'VAP kemungkinan besar' : 'VAP kurang mungkin'}` : null}
        summaryTone={isVap ? 'bad' : 'good'}
        caption={complete ? (isVap ? 'CPIS > 6 · ketuk untuk tindakan' : 'CPIS ≤ 6 · ketuk untuk tindakan') : undefined}
        resultTargetId="cpis-hasil"
        emptyText={`Jawab ke-6 item (${answered}/6) untuk melihat skor`}
      />
      <AbbrLegend terms={['CPIS', 'VAP', 'HAP', 'PaO2', 'FiO2', 'ARDS', 'ATS', 'IDSA', 'ERS', 'ESICM', 'ESCMID', 'ALAT']} />
    </div>
  );
}
