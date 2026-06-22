import React, { useState } from 'react';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { Wind } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';

export default function ScoringCpis() {
  const [f1, setF1] = useState(0);
  const [f2, setF2] = useState(0);
  const [f3, setF3] = useState(0);
  const [f4, setF4] = useState(0);
  const [f5, setF5] = useState(0);
  const [f6, setF6] = useState(0);

  const total = f1 + f2 + f3 + f4 + f5 + f6;
  const isVap = total > 6;

  const btnClass = (val: number, cur: number) => {
    return `w-full text-left p-3 text-sm border rounded-xl transition-all ${
      val === cur 
      ? 'bg-blue-500 text-white shadow-md ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-[#1C1C1E] border-blue-500 font-bold' 
      : 'bg-slate-50 dark:bg-[#2C2C2E] border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#3C3C3E] text-slate-700 dark:text-slate-300'
    }`;
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Active Patient Widget */}
      <ActivePatientBriefCard />

      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
         
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
           <div>
             <h2 className="text-xl font-bold flex items-center gap-2">
               <Wind className="w-5 h-5 text-teal-500" />
               CPIS
             </h2>
             <p className="text-sm text-muted-foreground mt-1">Clinical Pulmonary Infection Score</p>
           </div>
           <div className={`px-4 py-2 border rounded-xl text-center flex flex-col items-center justify-center ${isVap ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'}`}>
              <div className="text-xs opacity-80 font-semibold mb-1">Skor CPIS</div>
              <div className="text-3xl font-black">{total}</div>
           </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2">
             <div className="font-bold text-sm">Suhu (°C)</div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
               <button onClick={() => setF1(0)} className={btnClass(0, f1)}>36.5 - 38.4 (0)</button>
               <button onClick={() => setF1(1)} className={btnClass(1, f1)}>38.5 - 38.9 (1)</button>
               <button onClick={() => setF1(2)} className={btnClass(2, f1)}>≥ 39.0 atau ≤ 36.0 (2)</button>
             </div>
           </div>

           <div className="space-y-2">
             <div className="font-bold text-sm">Leukosit Darah (per mm³)</div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
               <button onClick={() => setF2(0)} className={btnClass(0, f2)}>4,000 - 11,000 (0)</button>
               <button onClick={() => setF2(1)} className={btnClass(1, f2)}>&lt;4,000 atau &gt;11,000 (1)</button>
               <button onClick={() => setF2(2)} className={btnClass(2, f2)}>&lt;4k/&gt;11k + band form &ge;50% (2)</button>
             </div>
           </div>

           <div className="space-y-2">
             <div className="font-bold text-sm">Sekresi Trakea / Sputum</div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
               <button onClick={() => setF3(0)} className={btnClass(0, f3)}>Jarang / Tidak ada (0)</button>
               <button onClick={() => setF3(1)} className={btnClass(1, f3)}>Banyak (abundant), non purulen (1)</button>
               <button onClick={() => setF3(2)} className={btnClass(2, f3)}>Banyak (abundant), purulen (2)</button>
             </div>
           </div>

           <div className="space-y-2">
             <div className="font-bold text-sm">Oksigenasi (PaO₂/FiO₂ mmHg)</div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
               <button onClick={() => setF4(0)} className={btnClass(0, f4)}>&gt; 240 atau ada ARDS (0)</button>
               <button onClick={() => setF4(2)} className={btnClass(2, f4)}>&le; 240 tanpa ARDS (2)</button>
             </div>
           </div>

           <div className="space-y-2">
             <div className="font-bold text-sm">Radiografi Paru (Chest X-Ray)</div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
               <button onClick={() => setF5(0)} className={btnClass(0, f5)}>Infiltrat tidak ada (0)</button>
               <button onClick={() => setF5(1)} className={btnClass(1, f5)}>Infiltrat difus/patchy (1)</button>
               <button onClick={() => setF5(2)} className={btnClass(2, f5)}>Infiltrat terlokalisasi/segmental (2)</button>
             </div>
           </div>

           <div className="space-y-2">
             <div className="font-bold text-sm">Kultur Trakeal / Sputum</div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
               <button onClick={() => setF6(0)} className={btnClass(0, f6)}>Lewati / Tidak ada patogen (0)</button>
               <button onClick={() => setF6(1)} className={btnClass(1, f6)}>Kuman patogen ditemukan (1)</button>
               <button onClick={() => setF6(2)} className={btnClass(2, f6)}>Kuman + Pewarnaan Gram sesuai (2)</button>
             </div>
           </div>
         </div>

         <div className={`mt-6 p-4 rounded-xl border ${isVap ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' : 'bg-teal-500/10 border-teal-500/20 text-teal-600 dark:text-teal-500'}`}>
            <div className="font-bold text-sm mb-1">{isVap ? 'CPIS > 6 (VAP Kemungkinan Besar)' : 'CPIS ≤ 6 (VAP Tidak Mungkin)'}</div>
            <div className="text-sm opacity-90 text-slate-800 dark:text-slate-200">
              {isVap 
                ? 'Lanjutkan antibiotik VAP sesuai panduan lokal. De-eskalasi berdasarkan kultur. Evaluasi dalam 48–72 jam.' 
                : 'Pertimbangkan de-eskalasi/penghentian antibiotik (Protokol Singh hari ke-3). Evaluasi ulang 24-48 jam.'}
            </div>
         </div>
      </div>

      <Accordion title="📖 Teori CPIS — VAP Diagnosis & De-eskalasi Singh">
        <ul className="pl-4 space-y-1 list-disc text-muted-foreground text-sm">
          <li><strong className="text-foreground">Latar Belakang:</strong> CPIS pertama dipublikasikan Pugin et al. (1991). Modified CPIS (Singh et al. 2000) digunakan dalam protokol de-eskalasi: pasien VAP empiris dievaluasi pada hari ke-3.</li>
          <li><strong className="text-foreground">Protokol Singh:</strong> Jika CPIS &le; 6 dan kultur negatif, antibiotik dapat dihentikan pada hari ke-3.</li>
          <li><strong className="text-foreground">Keterbatasan CPIS:</strong> Sensitivitas dan spesifisitas moderat (65-72%). Panduan ATS/IDSA 2016 tidak lagi merekomendasikan CPIS sebagai alat diagnosis tunggal, melainkan lebih ke arah panduan untuk de-eskalasi antibiotik. Diagnosis klinis VAP tetap berdasarkan tanda klinis + kultur kuantitatif.</li>
          <li><strong className="text-foreground">ERS/ESICM HAP/VAP Guidelines 2022:</strong> Menekankan bahwa CPIS berguna hanya untuk de-eskalasi antibiotik, bukan kriteria diagnosis definitif.</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 Singh N et al. (2000) Am J Respir Crit Care Med; Torres A et al. (2022) Eur Respir J.
        </div>
      </Accordion>
    </div>
  );
}
