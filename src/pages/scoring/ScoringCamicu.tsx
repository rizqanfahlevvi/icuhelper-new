import React, { useState } from 'react';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { Brain } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { AbbrLegend } from '../../components/ui/AbbrLegend';
import { CalcActionBar } from '../../components/ui/CalcActionBar';

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
    <div className="w-full max-w-2xl mx-auto px-4 md:px-6 py-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 overflow-x-hidden">
      {/* Active Patient Widget */}
      <ActivePatientBriefCard />

      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
         
         <div className="hidden md:flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
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
               <button onClick={() => setRassOk(true)} className={`${getBtnClass(true, rassOk)} min-h-[44px]`}>RASS -3 s/d +4 (Lanjut)</button>
               <button onClick={() => setRassOk(false)} className={`${getBtnClass(false, rassOk)} min-h-[44px]`}>RASS -4 atau -5 (UTA)</button>
             </div>
           </div>

           {rassOk === true && (
             <>
               <div className="bg-slate-50 dark:bg-[#2C2C2E]/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
                 <div className="font-bold text-sm mb-1">Fitur 1: Onset Akut / Fluktuatif</div>
                 <div className="text-xs text-muted-foreground mb-3">Apakah terdapat perubahan akut status mental / RASS dari baseline pasien ATAU berfluktuasi dalam 24 jam terakhir?</div>
                 <div className="flex gap-3">
                   <button onClick={() => setF1(true)} className={`${getBtnClass(true, f1)} min-h-[44px]`}>Ya (Positif)</button>
                   <button onClick={() => setF1(false)} className={`${getBtnClass(false, f1)} min-h-[44px]`}>Tidak (Negatif)</button>
                 </div>
               </div>

               {(f1 === true || f1 === null) && (
                 <div className="bg-slate-50 dark:bg-[#2C2C2E]/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
                   <div className="font-bold text-sm mb-1">Fitur 2: Gangguan Perhatian (Inattention)</div>
                   <div className="text-xs text-muted-foreground mb-3">Gunakan tes konsentrasi (Uji huruf SAVEAHAART atau gambar). Apakah ada &gt; 2 kesalahan?</div>
                   <div className="flex gap-3">
                     <button onClick={() => setF2(true)} className={`${getBtnClass(true, f2)} min-h-[44px]`}>Ya (&gt; 2 Kesalahan)</button>
                     <button onClick={() => setF2(false)} className={`${getBtnClass(false, f2)} min-h-[44px]`}>Tidak (0-2 Kesalahan)</button>
                   </div>
                 </div>
               )}

               {f1 === true && f2 === true && (
                 <div className="bg-slate-50 dark:bg-[#2C2C2E]/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
                   <div className="font-bold text-sm mb-1">Fitur 3: Perubahan Tingkat Kesadaran (Altered Level)</div>
                   <div className="text-xs text-muted-foreground mb-3">Apakah skor RASS pasien SESUATU SELAIN nol (0)? (+4 s/d +1, atau -1 s/d -3)</div>
                   <div className="flex gap-3">
                     <button onClick={() => setF3(true)} className={`${getBtnClass(true, f3)} min-h-[44px]`}>Ya (Positif)</button>
                     <button onClick={() => setF3(false)} className={`${getBtnClass(false, f3)} min-h-[44px]`}>Tidak (RASS = 0)</button>
                   </div>
                 </div>
               )}

               {f1 === true && f2 === true && f3 === false && (
                 <div className="bg-slate-50 dark:bg-[#2C2C2E]/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
                   <div className="font-bold text-sm mb-1">Fitur 4: Pemikiran Tidak Terorganisir (Disorganized)</div>
                   <div className="text-xs text-muted-foreground mb-3">Evaluasi dengan 4 pertanyaan iya/tidak (cth: "apakah batu mengapung?"), dan mengacungkan jari/perintah spesifik. Apakah kombinasi error &gt; 1?</div>
                   <div className="flex gap-3">
                     <button onClick={() => setF4(true)} className={`${getBtnClass(true, f4)} min-h-[44px]`}>Ya (&gt; 1 Kesalahan)</button>
                     <button onClick={() => setF4(false)} className={`${getBtnClass(false, f4)} min-h-[44px]`}>Tidak (0-1 Kesalahan)</button>
                   </div>
                 </div>
               )}
             </>
           )}
           
           {res === true && (
              <div id="camicu-hasil" className="scroll-mt-4 p-4 rounded-xl border bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 mt-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="font-bold text-sm mb-1 uppercase tracking-wider">Tindakan — Mnemonic THINK</div>
                  <div className="text-sm space-y-1 text-slate-800 dark:text-slate-200">
                    <p><strong>T</strong>oxic situations: syok, gagal jantung, dehidrasi, gagal organ baru; obat deliriogenik (benzodiazepin, antikolinergik, opioid berlebih) & withdrawal — evaluasi ulang sedasi, hindari benzodiazepin.</p>
                    <p><strong>H</strong>ypoxemia: cek SpO₂/AGD, anemia.</p>
                    <p><strong>I</strong>nfection/sepsis & Immobilization: cari infeksi baru; mobilisasi dini.</p>
                    <p><strong>N</strong>onpharmacological: kacamata/alat bantu dengar, reorientasi, siklus tidur-bangun, kurangi bising.</p>
                    <p><strong>K</strong>⁺ / elektrolit: koreksi gangguan elektrolit (K, Na, Ca, Mg) & glukosa.</p>
                  </div>
              </div>
           )}
         </div>
      </div>

      <Accordion title="📖 Teori CAM-ICU & Manajemen Delirium (PADIS 2018)">
        <ul className="pl-4 space-y-1 list-disc text-muted-foreground text-sm">
          <li><strong className="text-foreground">Latar Belakang:</strong> Delirium terjadi pada 60–80% pasien ICU berventilasi mekanik. Dikaitkan dengan mortalitas lebih tinggi, lama rawat yang lebih panjang, dan gangguan kognitif jangka panjang.</li>
          <li><strong className="text-foreground">Diagnosis:</strong> CAM-ICU (Ely et al. 2001) adalah alat skrining tervalidasi terhadap kriteria DSM oleh psikiater. Subtipe campuran (54,9%) dan hipoaktif (43,5%) paling sering; hiperaktif murni jarang (1,6%) — delirium hipoaktif mudah terlewat tanpa skrining aktif (Peterson 2006).</li>
          <li><strong className="text-foreground">Prinsip Manajemen:</strong> Antipsikotik tidak direkomendasikan rutin untuk mencegah/mengobati delirium (PADIS 2018; pembaruan PADIS 2025 tidak membuat rekomendasi); dapat dipertimbangkan jangka pendek bila ada distres berat (agitasi berbahaya, halusinasi menakutkan). Utamakan perbaikan penyebab (THINK) dan hindari benzodiazepin. Untuk sedasi, PADIS 2025 menyarankan dexmedetomidine dibanding propofol (rekomendasi kondisional).</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 Ely EW et al. (CAM-ICU) JAMA 2001;286:2703 · Devlin JW et al. (PADIS 2018) Crit Care Med 2018;46:e825 · Lewis K et al. (PADIS 2025 focused update) Crit Care Med 2025;53:e711 · Hughes CG et al. (MENDS2) N Engl J Med 2021;384:1424 · Peterson JF et al. (subtipe delirium) J Am Geriatr Soc 2006;54:479
        </div>
      </Accordion>
      <CalcActionBar
        mode="live"
        summary={res === null ? null : res === 'UTA' ? 'UTA — tidak dapat dinilai' : `Delirium: ${res ? 'POSITIF' : 'NEGATIF'}`}
        summaryTone={res === 'UTA' ? 'warn' : res ? 'bad' : 'good'}
        caption={res === 'UTA' ? 'RASS −4/−5 · ulangi saat sedasi dikurangi' : res ? 'Ketuk untuk tindakan (THINK)' : res === false ? 'CAM-ICU negatif' : undefined}
        resultTargetId={res === true ? 'camicu-hasil' : undefined}
        emptyText="Jawab prasyarat RASS & fitur CAM-ICU"
      />
      <AbbrLegend terms={['CAM-ICU', 'ICU', 'RASS', 'UTA', 'DSM', 'PADIS', 'SpO2', 'AGD']} />
    </div>
  );
}
