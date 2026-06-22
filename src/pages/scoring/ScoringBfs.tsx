import React, { useState } from 'react';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { Activity } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';

const CFS_LEVELS = [
  { val: 1, label: '1 - Sangat Bugar (Very Fit)', desc: 'Energik, aktif, motivasi tinggi, berolahraga rutin. Kondisi paling prima untuk usianya.', c: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20', interp: 'Tidak Frail', detail: 'Risiko rendah, toleransi intervensi ICU baik. Tidak ada pembatasan berbasis frailty.' },
  { val: 2, label: '2 - Bugar (Well)', desc: 'Tidak ada penyakit aktif namun kurang prima. Berolahraga sesekali atau aktif musiman.', c: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20', interp: 'Tidak Frail', detail: 'Kondisi medis terkontrol, risiko rendah. Tidak ada pembatasan berbasis frailty.' },
  { val: 3, label: '3 - Mengatasi dengan Baik (Managing Well)', desc: 'Penyakit medis terkontrol, tidak rutin berolahraga. Kadang mengeluh lambat/kelelahan ringan.', c: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20', interp: 'Pre-Frail Ringan', detail: 'Risiko relatif rendah. Monitoring fungsional pasca-ICU dianjurkan.' },
  { val: 4, label: '4 - Frailty Sangat Ringan (Very Mild)', desc: 'Tidak tergantung penuh, sering mengeluh lambat atau kelelahan siang hari.', c: 'text-teal-500', bg: 'bg-teal-500/10 border-teal-500/20', interp: 'Pre-Frail', detail: 'Mulai diskusikan tujuan perawatan lebih awal. Risiko komplikasi pasca-ICU meningkat.' },
  { val: 5, label: '5 - Frailty Ringan (Mild)', desc: 'Ketergantungan parsial untuk IADL (belanja, keuangan, transportasi). Mandiri untuk ADL dasar.', c: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20', interp: 'Frailty Ringan', detail: 'Risiko moderat. Diskusi tujuan perawatan & harapan fungsional pasca-ICU penting bersama keluarga.' },
  { val: 6, label: '6 - Frailty Sedang (Moderate)', desc: 'Butuh bantuan semua aktivitas di luar rumah. Di dalam rumah masih bisa naik tangga/mandi sendiri (kadang butuh bantuan).', c: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20', interp: 'Frailty Sedang', detail: 'Risiko tinggi mortalitas ICU. Pertimbangkan eskalasi vs de-eskalasi secara hati-hati bersama keluarga & tim etik.' },
  { val: 7, label: '7 - Frailty Berat (Severe)', desc: 'Ketergantungan total untuk perawatan pribadi. Klinis stabil, tidak berisiko meninggal dalam 6 bulan.', c: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20', interp: 'Frailty Berat', detail: 'Risiko sangat tinggi. Konsultasi tim paliatif dianjurkan. Manfaat intervensi intensif mungkin sangat terbatas.' },
  { val: 8, label: '8 - Frailty Sangat Berat (Very Severe)', desc: 'Ketergantungan total, mendekati akhir kehidupan. Tidak dapat pulih dari sakit ringan sekalipun.', c: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20', interp: 'Frailty Sangat Berat', detail: 'Manfaat intervensi agresif sangat terbatas. Prioritaskan comfort care dan diskusi advance directive.' },
  { val: 9, label: '9 - Sakit Terminal (Terminally Ill)', desc: 'Harapan hidup <6 bulan, tidak tampak frail secara klinis. Mendekati akhir kehidupan.', c: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20', interp: 'Sakit Terminal', detail: 'Harapan hidup <6 bulan. Prioritaskan comfort care, advance directive, dan dukungan keluarga.' },
];

export default function ScoringBfs() {
  const [scoreObj, setScoreObj] = useState<typeof CFS_LEVELS[0] | null>(null);

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Active Patient Widget */}
      <ActivePatientBriefCard />

      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
         
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
           <div>
             <h2 className="text-xl font-bold flex items-center gap-2">
               <Activity className="w-5 h-5 text-blue-500" />
               BFS / CFS
             </h2>
             <p className="text-sm text-muted-foreground mt-1">Bedside Frailty Scale / Clinical Frailty Scale</p>
           </div>
         </div>

         <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-sm text-amber-700 dark:text-amber-500 mb-6">
           <strong>📌 Petunjuk:</strong> Pilih kategori yang paling sesuai kondisi pasien <em>sebelum</em> sakit akut (status fungsional baseline 2 minggu yang lalu).
         </div>

         <div className="flex flex-col-reverse lg:flex-row gap-6">
           <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
             {CFS_LEVELS.map((item) => (
               <button
                 key={item.val}
                 onClick={() => setScoreObj(item)}
                 className={`w-full text-left p-2.5 border rounded-xl transition-all ${
                   scoreObj?.val === item.val
                     ? `bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-sm ring-1 ring-blue-500`
                     : 'bg-slate-50 dark:bg-[#2C2C2E] border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#3C3C3E]'
                 }`}
               >
                 <div className="flex items-start gap-3">
                   <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold font-mono text-sm shrink-0 bg-blue-500 text-white mt-0.5`}>
                     {item.val}
                   </div>
                   <div>
                     <div className="font-semibold text-sm text-foreground">{item.label.substring(4)}</div>
                     <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{item.desc}</div>
                   </div>
                 </div>
               </button>
             ))}
           </div>

           <div className="lg:w-1/3 shrink-0">
              {scoreObj ? (
                <div className={`p-5 border rounded-2xl ${scoreObj.bg} sticky top-24`}>
                  <div className="text-sm font-semibold opacity-80 uppercase tracking-widest mb-1">CFS Score</div>
                  <div className={`text-4xl font-black ${scoreObj.c} mb-2`}>{scoreObj.val}</div>
                  <div className={`text-lg font-bold ${scoreObj.c} leading-tight mb-1`}>{scoreObj.label.substring(4)}</div>
                  <div className={`text-sm font-semibold ${scoreObj.c} mb-3`}>{scoreObj.interp}</div>
                  
                  <div className="bg-slate-50 dark:bg-[#2C2C2E]/60 rounded-lg p-3 border border-slate-200 dark:border-slate-800">
                    <strong className="text-xs uppercase text-foreground mb-1 block">Implikasi ICU:</strong>
                    <div className="text-sm text-foreground/90">{scoreObj.detail}</div>
                  </div>
                </div>
              ) : (
                <div className="p-5 border border-dashed rounded-2xl flex flex-col items-center justify-center text-center h-full min-h-[300px] text-muted-foreground">
                  <Activity className="w-8 h-8 mb-3 opacity-20" />
                  <p>Pilih tingkat frailty pasien di sebelahnya untuk melihat interpretasi dan implikasi klinis.</p>
                </div>
              )}
           </div>
         </div>
      </div>

      <Accordion title="📖 Teori BFS/CFS — Frailty di ICU (Rockwood et al. 2005)">
        <ul className="pl-4 space-y-1 list-disc text-muted-foreground text-sm">
          <li><strong className="text-foreground">Definisi Frailty:</strong> Penurunan cadangan fisiologis multidimensional dan kerentanan terhadap stresor. Skala CFS menilai status pra-morbid.</li>
          <li><strong className="text-foreground">Signifikansi Kritis:</strong> Dalam ICU, frailty pra-morbid adalah prediktor kuat mortalitas, lama rawat, ketergantungan fungsional pasca-ICU, dan re-admission.</li>
          <li><strong className="text-foreground">Temuan Relevan (FROG-ICU):</strong> CFS &ge; 5 terkait mortalitas 6-bulan meningkat signifikan (HR 1.6), independen dari usia dan diagnosis.</li>
          <li><strong className="text-foreground">Keterbatasan:</strong> CFS tidak valid sebagai baseline pada pasien dengan disabilitas perkembangan kronik atau kondisi neurologi kronik parah yang stabil (misal: cerebral palsy). Gunakan kondisi fungsional terbaik 2 minggu sebelum sakit akut.</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 Rockwood K et al. (2005) CMAJ; Darvall JN et al. (2019) Crit Care.
        </div>
      </Accordion>
    </div>
  );
}
