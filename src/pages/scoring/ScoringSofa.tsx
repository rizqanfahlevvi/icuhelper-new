import React, { useState } from 'react';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { Activity, Beaker, Brain, Heart, Wind, Droplets } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';

export default function ScoringSofa() {
  const [respi, setRespi] = useState(0);
  const [coag, setCoag] = useState(0);
  const [liver, setLiver] = useState(0);
  const [cardio, setCardio] = useState(0);
  const [cns, setCns] = useState(0);
  const [renal, setRenal] = useState(0);

  const total = respi + coag + liver + cardio + cns + renal;

  const mortality = () => {
    if (total <= 1) return { m: '0%', r: 'Normal' };
    if (total <= 3) return { m: '< 5%', r: 'Rendah' };
    if (total <= 5) return { m: '< 10%', r: 'Sedang-Rendah' };
    if (total <= 7) return { m: '15-20%', r: 'Sedang' };
    if (total <= 9) return { m: '25-33%', r: 'Tinggi' };
    if (total <= 11) return { m: '40-50%', r: 'Sangat Tinggi' };
    if (total <= 14) return { m: '50-60%', r: 'Kritis' };
    return { m: '> 90%', r: 'Fatum' };
  };

  const getBtnClass = (val: number, current: number) => {
    return `px-3 py-2 text-[13px] border rounded-md transition-colors ${
      current === val
        ? 'bg-blue-500 text-white shadow-md ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-[#1C1C1E] border-blue-500 font-bold'
        : 'bg-slate-50 dark:bg-[#2C2C2E] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#3C3C3E]'
    }`;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Active Patient Widget */}
      <ActivePatientBriefCard />

      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
         
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
           <div>
             <h2 className="text-xl font-bold flex items-center gap-2">
               <Activity className="w-5 h-5 text-blue-500" />
               SOFA Score
             </h2>
             <p className="text-sm text-muted-foreground mt-1">Sequential Organ Failure Assessment</p>
           </div>
           <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl text-center flex gap-4 items-center">
              <div>
                <div className="text-xs text-muted-foreground font-semibold">Total Score</div>
                <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{total}</div>
              </div>
              <div className="w-px h-10 bg-blue-500/20"></div>
              <div className="text-left">
                <div className="text-xs text-muted-foreground font-semibold">Estimasi Mortalitas</div>
                <div className="font-bold text-lg text-foreground">{mortality().m}</div>
              </div>
           </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Respirasi */}
           <div className="space-y-2">
             <div className="text-sm font-bold flex items-center gap-2"><Wind className="w-4 h-4 text-blue-400"/> Respirasi (PaO₂/FiO₂)</div>
             <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
               <button onClick={() => setRespi(0)} className={getBtnClass(0, respi)}>≥ 400</button>
               <button onClick={() => setRespi(1)} className={getBtnClass(1, respi)}>&lt; 400</button>
               <button onClick={() => setRespi(2)} className={getBtnClass(2, respi)}>&lt; 300</button>
               <button onClick={() => setRespi(3)} className={getBtnClass(3, respi)}>&lt; 200 + Bantuan Napas</button>
               <button onClick={() => setRespi(4)} className={getBtnClass(4, respi)}>&lt; 100 + Bantuan Napas</button>
             </div>
           </div>

           {/* Koagulasi */}
           <div className="space-y-2">
             <div className="text-sm font-bold flex items-center gap-2"><Droplets className="w-4 h-4 text-red-500"/> Koagulasi (Trombosit ×10³/µL)</div>
             <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
               <button onClick={() => setCoag(0)} className={getBtnClass(0, coag)}>≥ 150</button>
               <button onClick={() => setCoag(1)} className={getBtnClass(1, coag)}>&lt; 150</button>
               <button onClick={() => setCoag(2)} className={getBtnClass(2, coag)}>&lt; 100</button>
               <button onClick={() => setCoag(3)} className={getBtnClass(3, coag)}>&lt; 50</button>
               <button onClick={() => setCoag(4)} className={getBtnClass(4, coag)}>&lt; 20</button>
             </div>
           </div>

           {/* Liver */}
           <div className="space-y-2">
             <div className="text-sm font-bold flex items-center gap-2"><Beaker className="w-4 h-4 text-yellow-500"/> Liver (Bilirubin mg/dL)</div>
             <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
               <button onClick={() => setLiver(0)} className={getBtnClass(0, liver)}>&lt; 1.2</button>
               <button onClick={() => setLiver(1)} className={getBtnClass(1, liver)}>1.2 – 1.9</button>
               <button onClick={() => setLiver(2)} className={getBtnClass(2, liver)}>2.0 – 5.9</button>
               <button onClick={() => setLiver(3)} className={getBtnClass(3, liver)}>6.0 – 11.9</button>
               <button onClick={() => setLiver(4)} className={getBtnClass(4, liver)}>≥ 12.0</button>
             </div>
           </div>

           {/* KV */}
           <div className="space-y-2">
             <div className="text-sm font-bold flex items-center gap-2"><Heart className="w-4 h-4 text-rose-500"/> Kardiovaskular (Hipotensi)</div>
             <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
               <button onClick={() => setCardio(0)} className={getBtnClass(0, cardio)}>MAP ≥ 70 mmHg</button>
               <button onClick={() => setCardio(1)} className={getBtnClass(1, cardio)}>MAP &lt; 70 mmHg</button>
               <button onClick={() => setCardio(2)} className={getBtnClass(2, cardio)}>Dopamin &le; 5 atau Dobutamin</button>
               <button onClick={() => setCardio(3)} className={getBtnClass(3, cardio)}>Dopamin &gt; 5 / Epi &le; 0.1 / NE &le; 0.1</button>
               <button onClick={() => setCardio(4)} className={getBtnClass(4, cardio)}>Dopamin &gt; 15 / Epi &gt; 0.1 / NE &gt; 0.1</button>
             </div>
           </div>

           {/* CNS */}
           <div className="space-y-2">
             <div className="text-sm font-bold flex items-center gap-2"><Brain className="w-4 h-4 text-purple-500"/> SSP (Glasgow Coma Scale)</div>
             <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
               <button onClick={() => setCns(0)} className={getBtnClass(0, cns)}>15</button>
               <button onClick={() => setCns(1)} className={getBtnClass(1, cns)}>13 – 14</button>
               <button onClick={() => setCns(2)} className={getBtnClass(2, cns)}>10 – 12</button>
               <button onClick={() => setCns(3)} className={getBtnClass(3, cns)}>6 – 9</button>
               <button onClick={() => setCns(4)} className={getBtnClass(4, cns)}>&lt; 6</button>
             </div>
           </div>

           {/* Ginjal */}
           <div className="space-y-2">
             <div className="text-sm font-bold flex items-center gap-2"><Droplets className="w-4 h-4 text-amber-500"/> Ginjal (Kreatinin mg/dL / Urine output)</div>
             <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
               <button onClick={() => setRenal(0)} className={getBtnClass(0, renal)}>&lt; 1.2</button>
               <button onClick={() => setRenal(1)} className={getBtnClass(1, renal)}>1.2 – 1.9</button>
               <button onClick={() => setRenal(2)} className={getBtnClass(2, renal)}>2.0 – 3.4</button>
               <button onClick={() => setRenal(3)} className={getBtnClass(3, renal)}>3.5 – 4.9 atau UO &lt; 500 mL/H</button>
               <button onClick={() => setRenal(4)} className={getBtnClass(4, renal)}>≥ 5.0 atau UO &lt; 200 mL/H</button>
             </div>
           </div>
         </div>
      </div>

      <Accordion title="📖 Teori SOFA Score & Sepsis-3">
        <ul className="pl-4 space-y-1 list-disc text-muted-foreground text-sm">
          <li><strong className="text-foreground">Latar Belakang:</strong> Dikembangkan Vincent et al. (1996) untuk menilai disfungsi organ secara berurutan. Pada <em>Sepsis-3</em> (2016), SOFA dijadikan dasar definisi baru: Sepsis = Infeksi + Δ SOFA &ge; 2 dari baseline.</li>
          <li><strong className="text-foreground">Sepsis-3:</strong> Disfungsi organ mengancam jiwa akibat disregulasi respons host terhadap infeksi. Menggantikan kriteria SIRS yang terlalu sensitif.</li>
          <li><strong className="text-foreground">Septic Shock:</strong> Sepsis + vasopressor untuk MAP &ge; 65 mmHg + Laktat &gt; 2 mmol/L meski sudah resusitasi adekuat.</li>
          <li><strong className="text-foreground">Delta-SOFA:</strong> ΔSOFA pada 48 jam lebih prediktif dari nilai absolut; ΔSOFA meningkat = prognosis buruk independen. Gunakan untuk monitoring respons terapi harian.</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 Singer M et al. (2016) JAMA; Vincent JL et al. (1996) Intensive Care Med.
        </div>
      </Accordion>
    </div>
  );
}
