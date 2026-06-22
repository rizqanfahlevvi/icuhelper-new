import React, { useState } from 'react';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { Brain } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';

export default function ScoringCamicu() {
  const [rassOk, setRassOk] = useState<boolean | null>(null);
  const [f1, setF1] = useState<boolean | null>(null);
  const [f2, setF2] = useState<boolean | null>(null);
  const [f3, setF3] = useState<boolean | null>(null);
  const [f4, setF4] = useState<boolean | null>(null);

  const getResult = () => {
    if (rassOk === false) return 'UTA';
    if (rassOk === null) return null;
    
    if (f1 === null || f2 === null) return null;
    if (f1 === false || f2 === false) return false; // Negatif
    if (f3 === true) return true; // Positif
    if (f3 === false && f4 !== null) return f4; // Cek f4 jika f3 false
    return null;
  };

  const res = getResult();

  const getBtnClass = (val: boolean, current: boolean | null) => {
    return `flex-1 py-3 text-sm border rounded-xl transition-all font-bold ${
      current === val
        ? 'bg-blue-500 text-white shadow-md ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-[#1C1C1E] border-blue-500'
        : 'bg-slate-50 dark:bg-[#2C2C2E] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#3C3C3E]'
    }`;
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Active Patient Widget */}
      <ActivePatientBriefCard />

      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
         
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
           <div>
             <h2 className="text-xl font-bold flex items-center gap-2">
               <Brain className="w-5 h-5 text-indigo-500" />
               CAM-ICU
             </h2>
             <p className="text-sm text-muted-foreground mt-1">Confusion Assessment Method for ICU</p>
           </div>
           
           {res !== null && (
             <div className={`px-4 py-3 border rounded-xl text-center font-bold ${res === 'UTA' ? 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-500' : res ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-500'}`}>
                {res === 'UTA' ? 'UTA (Unable to Assess)' : `Delirium: ${res ? 'POSITIF' : 'NEGATIF'}`}
             </div>
           )}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="bg-slate-50 dark:bg-[#2C2C2E]/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
             <div className="font-bold text-sm mb-1 text-indigo-500 dark:text-indigo-400">Prasyarat: Cek RASS Terlebih Dahulu</div>
             <div className="text-xs text-muted-foreground mb-3">Berapa nilai RASS saat ini? Jika RASS -4 atau -5, pasien tidak bisa dinilai (UTA). Ulangi saat sedasi dikurangi.</div>
             <div className="flex gap-3">
               <button onClick={() => setRassOk(true)} className={getBtnClass(true, rassOk)}>RASS -3 s/d +4 (Lanjut)</button>
               <button onClick={() => setRassOk(false)} className={getBtnClass(false, rassOk)}>RASS -4 atau -5 (UTA)</button>
             </div>
           </div>

           {rassOk === true && (
             <>
               <div className="bg-slate-50 dark:bg-[#2C2C2E]/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
                 <div className="font-bold text-sm mb-1">Fitur 1: Onset Akut / Fluktuatif</div>
                 <div className="text-xs text-muted-foreground mb-3">Apakah terdapat perubahan akut status mental / RASS dari baseline pasien ATAU berfluktuasi dalam 24 jam terakhir?</div>
                 <div className="flex gap-3">
                   <button onClick={() => setF1(true)} className={getBtnClass(true, f1)}>Ya (Positif)</button>
                   <button onClick={() => setF1(false)} className={getBtnClass(false, f1)}>Tidak (Negatif)</button>
                 </div>
               </div>

               {(f1 === true || f1 === null) && (
                 <div className="bg-slate-50 dark:bg-[#2C2C2E]/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
                   <div className="font-bold text-sm mb-1">Fitur 2: Gangguan Perhatian (Inattention)</div>
                   <div className="text-xs text-muted-foreground mb-3">Gunakan tes konsentrasi (Uji huruf SAVEAHAART atau gambar). Apakah ada &gt; 2 kesalahan?</div>
                   <div className="flex gap-3">
                     <button onClick={() => setF2(true)} className={getBtnClass(true, f2)}>Ya (&gt; 2 Kesalahan)</button>
                     <button onClick={() => setF2(false)} className={getBtnClass(false, f2)}>Tidak (0-2 Kesalahan)</button>
                   </div>
                 </div>
               )}

               {f1 === true && f2 === true && (
                 <div className="bg-slate-50 dark:bg-[#2C2C2E]/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
                   <div className="font-bold text-sm mb-1">Fitur 3: Perubahan Tingkat Kesadaran (Altered Level)</div>
                   <div className="text-xs text-muted-foreground mb-3">Apakah skor RASS pasien SESUATU SELAIN nol (0)? (+4 s/d +1, atau -1 s/d -3)</div>
                   <div className="flex gap-3">
                     <button onClick={() => setF3(true)} className={getBtnClass(true, f3)}>Ya (Positif)</button>
                     <button onClick={() => setF3(false)} className={getBtnClass(false, f3)}>Tidak (RASS = 0)</button>
                   </div>
                 </div>
               )}

               {f1 === true && f2 === true && f3 === false && (
                 <div className="bg-slate-50 dark:bg-[#2C2C2E]/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
                   <div className="font-bold text-sm mb-1">Fitur 4: Pemikiran Tidak Terorganisir (Disorganized)</div>
                   <div className="text-xs text-muted-foreground mb-3">Evaluasi dengan 4 pertanyaan iya/tidak (cth: "apakah batu mengapung?"), dan mengacungkan jari/perintah spesifik. Apakah kombinasi error &gt; 1?</div>
                   <div className="flex gap-3">
                     <button onClick={() => setF4(true)} className={getBtnClass(true, f4)}>Ya (&gt; 1 Kesalahan)</button>
                     <button onClick={() => setF4(false)} className={getBtnClass(false, f4)}>Tidak (0-1 Kesalahan)</button>
                   </div>
                 </div>
               )}
             </>
           )}
           
           {res === true && (
              <div className="p-4 rounded-xl border bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 mt-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="font-bold text-sm mb-1 uppercase tracking-wider">Tindakan — Mnemonic THINK</div>
                  <div className="text-sm space-y-1 text-slate-800 dark:text-slate-200">
                    <p><strong>T</strong>oxic: Sepsis, obat-obatan (benzo/opioid/antikolinergik), withdrawal.</p>
                    <p><strong>H</strong>ypoxemia: Cek PaO2, anemia.</p>
                    <p><strong>I</strong>mmobilization: Mobilisasi dini, reposisi.</p>
                    <p><strong>N</strong>on-pharmacologic first: Orientasi, siklus tidur-bangun, pencahayaan.</p>
                    <p><strong>K</strong>ey drugs to avoid: Hindari/Hentikan benzodiazepin. Evaluasi ulang terapi sedasi.</p>
                  </div>
              </div>
           )}
         </div>
      </div>

      <Accordion title="📖 Teori CAM-ICU & Manajemen Delirium (PADIS 2018)">
        <ul className="pl-4 space-y-1 list-disc text-muted-foreground text-sm">
          <li><strong className="text-foreground">Latar Belakang:</strong> Delirium terjadi pada 60–80% pasien ICU berventilasi mekanik. Dikaitkan dengan mortalitas lebih tinggi, lama rawat yang lebih panjang, dan gangguan kognitif jangka panjang.</li>
          <li><strong className="text-foreground">Diagnosis:</strong> Menggunakan CAM-ICU (Ely et al. 2001) sebagai gold standard. Pasien delirium bisa hadir dengan hiperaktif (25%), hipoaktif (50%), atau tipe campuran.</li>
          <li><strong className="text-foreground">Prinsip Manajemen:</strong> Tindakan farmakologis dengan Haloperidol/Quetiapine BUKAN untuk menyembuhkan secara langsung, melainkan manajemen simptomatik hiperaktif. Utamakan perbaikan penyebab (THINK) dan hindari benzodiazepin. Dexmedetomidine sering disarankan meminimalisir delirium vs Propofol/Benzo.</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 Ely EW et al. (2001) JAMA; Devlin JW et al. (2018) Crit Care Med.
        </div>
      </Accordion>
    </div>
  );
}
