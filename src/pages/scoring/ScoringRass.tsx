import React, { useState } from 'react';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { Activity } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';

const RASS_LEVELS = [
  { val: 4, label: '+4 Combative — Agresif', desc: 'Agresif/kekerasan, bahaya langsung terhadap staf. Dapat mencabut infus, ETT.', a: '⚠️ DARURAT: Amankan pasien & jalur IV/ETT segera! Analgesik IV bolus → sedatif titrasi. Evaluasi penyebab: nyeri, hipoksia, retensi urin, delirium hiperaktif.', c: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
  { val: 3, label: '+3 Very Agitated — Sangat Gelisah', desc: 'Menarik/mencabut tube/kateter; agresif terhadap staf.', a: 'Evaluasi nyeri (CPOT), hipoksia, distensi kandung kemih, withdrawal. Analgesik IV terlebih dahulu. Pertimbangkan midazolam bolus atau dexmedetomidine.', c: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
  { val: 2, label: '+2 Agitated — Gelisah', desc: 'Gerakan yang sering dan tidak bertujuan; melawan/fighting ventilator.', a: 'Evaluasi penyebab reversibel. Titrasi sedatif ke atas. Pertimbangkan reposisi, analgesik, dexmedetomidine.', c: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20' },
  { val: 1, label: '+1 Restless — Tidak Tenang', desc: 'Cemas, apprehensif, namun gerakan tidak agresif atau kuat.', a: 'Cek kenyamanan: nyeri? posisi? kandung kemih? NGT bermasalah? Orientasikan pasien. Analgesik sebelum tambah sedatif.', c: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
  { val: 0, label: '0 Alert and Calm ✓ TARGET', desc: 'Sadar dan tenang — TARGET SEDASI IDEAL (PADIS 2018 / eCASH).', a: 'TARGET SEDASI IDEAL (PADIS 2018/eCASH). Pertahankan. Monitor setiap 4 jam. Lakukan SAT jika memenuhi syarat.', c: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' },
  { val: -1, label: '-1 Drowsy — Mengantuk', desc: 'Tidak sepenuhnya alert; kontak mata bertahan >10 detik saat dipanggil.', a: 'Target ringan ICU tercapai. Monitor setiap 4 jam. Lakukan SAT (Spontaneous Awakening Trial) + SBT jika kondisi memungkinkan.', c: 'text-teal-500', bg: 'bg-teal-500/10 border-teal-500/20' },
  { val: -2, label: '-2 Light Sedation — Sedasi Ringan', desc: 'Kontak mata singkat (<10 detik) saat dipanggil namanya. Masih dapat dibangunkan.', a: 'Dalam rentang target. Pertimbangkan kurangi dosis sedatif bertahap menuju RASS 0/-1 jika kondisi stabil.', c: 'text-teal-500', bg: 'bg-teal-500/10 border-teal-500/20' },
  { val: -3, label: '-3 Moderate Sedation — Sedasi Sedang', desc: 'Ada gerakan atau buka mata saat dipanggil — tetapi tidak ada kontak mata bermakna.', a: 'Lebih dalam dari target standar. Kurangi dosis secara bertahap. CAM-ICU masih dapat dinilai. Pertimbangkan SAT.', c: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
  { val: -4, label: '-4 Deep Sedation — Sedasi Dalam', desc: 'Tidak respons suara; gerakan/buka mata ada dengan stimulasi fisik. CAM-ICU: UTA.', a: 'Hanya untuk indikasi khusus (HICP, NMB, status epileptikus refrakter). CAM-ICU TIDAK dapat dinilai (UTA). Re-evaluasi indikasi sedasi dalam setiap 24 jam.', c: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20' },
  { val: -5, label: '-5 Unarousable — Tidak Dapat Dibangunkan', desc: 'Tidak ada respons terhadap suara maupun stimulasi fisik. CAM-ICU: UTA.', a: 'Sedasi paling dalam. Monitor BIS/EEG jika tersedia. CAM-ICU TIDAK dapat dinilai. Re-evaluasi indikasi segera.', c: 'text-slate-500', bg: 'bg-slate-500/10 border-slate-500/20' },
];

export default function ScoringRass() {
  const [scoreObj, setScoreObj] = useState<typeof RASS_LEVELS[0] | null>(null);

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Active Patient Widget */}
      <ActivePatientBriefCard />

      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
         
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
           <div>
             <h2 className="text-xl font-bold flex items-center gap-2">
               <Activity className="w-5 h-5 text-violet-500" />
               RASS
             </h2>
             <p className="text-sm text-muted-foreground mt-1">Richmond Agitation-Sedation Scale</p>
           </div>
         </div>

         <div className="flex flex-col-reverse lg:flex-row gap-6">
           <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
             {RASS_LEVELS.map((item) => (
               <button
                 key={item.val}
                 onClick={() => setScoreObj(item)}
                 className={`w-full text-left p-2.5 border rounded-xl transition-all ${
                   scoreObj?.val === item.val
                     ? `bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-sm ring-1 ring-blue-500`
                     : 'bg-slate-50 dark:bg-[#2C2C2E] border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#3C3C3E]'
                 }`}
               >
                 <div className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold font-mono text-sm shrink-0 ${
                     item.val > 0 ? 'bg-red-500 text-white' : item.val === 0 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                   }`}>
                     {item.val > 0 ? `+${item.val}` : item.val}
                   </div>
                   <div className="font-semibold text-sm text-foreground">{item.label.substring(item.label.indexOf(' ') + 1)}</div>
                 </div>
               </button>
             ))}
           </div>

           <div className="lg:w-1/3 shrink-0">
              {scoreObj ? (
                <div className={`p-5 border rounded-2xl ${scoreObj.bg} sticky top-24`}>
                  <div className="text-sm font-semibold opacity-80 uppercase tracking-widest mb-1">RASS Score</div>
                  <div className={`text-4xl font-black ${scoreObj.c} mb-2`}>
                    {scoreObj.val > 0 ? `+${scoreObj.val}` : scoreObj.val}
                  </div>
                  <div className={`text-lg font-bold ${scoreObj.c} leading-tight mb-3`}>{scoreObj.label}</div>
                  
                  <div className="text-sm text-muted-foreground mb-4">{scoreObj.desc}</div>
                  
                  <div className="bg-slate-50 dark:bg-[#2C2C2E]/60 rounded-lg p-3 border border-slate-200 dark:border-slate-800">
                    <strong className="text-xs uppercase text-foreground mb-1 block">Tindakan Klinis:</strong>
                    <div className="text-sm text-foreground/90">{scoreObj.a}</div>
                  </div>
                </div>
              ) : (
                <div className="p-5 border border-dashed rounded-2xl flex flex-col items-center justify-center text-center h-full min-h-[300px] text-muted-foreground">
                  <Activity className="w-8 h-8 mb-3 opacity-20" />
                  <p>Pilih tingkat kondisi pasien di sebelahnya untuk melihat interpretasi dan rekomendasi tindakan.</p>
                </div>
              )}
           </div>
         </div>
      </div>

      <Accordion title="📖 Teori RASS & Target Sedasi ICU (PADIS 2018)">
        <ul className="pl-4 space-y-1 list-disc text-muted-foreground text-sm">
          <li><strong className="text-foreground">Tentang RASS:</strong> Alat penilaian tingkat sedasi di ICU. Diadopsi dalam PADIS 2018 sebagai skala sedasi utama karena validitas tinggi.</li>
          <li><strong className="text-foreground">eCASH Principle:</strong> <em>early Comfort using Analgesia, minimal Sedatives, maximal Humane care</em>.</li>
          <li><strong className="text-foreground">Analgesia First:</strong> Atasi nyeri dahulu (CPOT/NRS) sebelum pemberian sedatif.</li>
          <li><strong className="text-foreground">Target Standar:</strong> Target Sedasi ICU pada umumnya adalah RASS 0 hingga -1 (Alert and Calm atau Drowsy). Hindari sedasi konstan berlebihan.</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 Sessler CN et al. (2002) Am J Respir Crit Care Med; Devlin JW et al. (2018) Crit Care Med.
        </div>
      </Accordion>
    </div>
  );
}
