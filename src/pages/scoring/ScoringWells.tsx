import React, { useState } from 'react';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { Activity as ActivityIcon } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';

export default function ScoringWells() {
  const [signsOfDvt, setSignsOfDvt] = useState(false);
  const [altDiagnosis, setAltDiagnosis] = useState(false);
  const [heartRate, setHeartRate] = useState(false);
  const [immobilization, setImmobilization] = useState(false);
  const [prevDvtPe, setPrevDvtPe] = useState(false);
  const [hemoptysis, setHemoptysis] = useState(false);
  const [malignancy, setMalignancy] = useState(false);

  const calculateScore = () => {
    let score = 0;
    if (signsOfDvt) score += 3.0;
    if (altDiagnosis) score += 3.0;
    if (heartRate) score += 1.5;
    if (immobilization) score += 1.5;
    if (prevDvtPe) score += 1.5;
    if (hemoptysis) score += 1.0;
    if (malignancy) score += 1.0;
    return score;
  };

  const total = calculateScore();

  const getRiskTwoTier = () => {
    if (total <= 4) return { risk: 'PE Unlikely', color: 'text-emerald-600 dark:text-emerald-400' };
    return { risk: 'PE Likely', color: 'text-red-600 dark:text-red-400' };
  };

  const getRiskThreeTier = () => {
    if (total < 2) return 'Low Risk';
    if (total <= 6) return 'Moderate Risk';
    return 'High Risk';
  };

  const getBtnClass = (active: boolean) => {
    return `px-3 py-3 text-[13px] border rounded-xl transition-colors w-full text-left font-medium flex justify-between items-center ${
      active
        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/50'
        : 'bg-slate-50 dark:bg-[#2C2C2E] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#3C3C3E]'
    }`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-6 py-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 overflow-x-hidden">
      <ActivePatientBriefCard />

      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
           <div>
             <h2 className="text-xl font-bold flex items-center gap-2">
               <ActivityIcon className="w-5 h-5 text-blue-500" />
               Wells' Criteria for PE
             </h2>
             <p className="text-sm text-muted-foreground mt-1">Penilaian kemungkinan klinis Emboli Paru (Pulmonary Embolism)</p>
           </div>
           
           <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-3 rounded-xl text-center flex flex-col items-center min-w-[120px]">
             <div className="text-xs text-muted-foreground font-semibold mb-1">Total Score</div>
             <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{total}</div>
           </div>
         </div>

         {/* Two-tier Interpretation */}
         <div className="mb-6 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
            <div>
              <div className="text-xs text-muted-foreground font-medium">Interpretasi (2-Tier)</div>
              <div className={`font-bold text-lg ${getRiskTwoTier().color}`}>
                {getRiskTwoTier().risk}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground font-medium">Interpretasi (3-Tier)</div>
              <div className="font-bold text-lg text-slate-700 dark:text-slate-300">
                {getRiskThreeTier()}
              </div>
            </div>
         </div>

         <div className="space-y-3">
           <button onClick={() => setSignsOfDvt(!signsOfDvt)} className={getBtnClass(signsOfDvt)}>
             <span>Clinical signs and symptoms of DVT</span>
             <span className="shrink-0 text-xs px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded">+3.0</span>
           </button>
           <button onClick={() => setAltDiagnosis(!altDiagnosis)} className={getBtnClass(altDiagnosis)}>
             <span>PE is #1 diagnosis OR equally likely</span>
             <span className="shrink-0 text-xs px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded">+3.0</span>
           </button>
           <button onClick={() => setHeartRate(!heartRate)} className={getBtnClass(heartRate)}>
             <span>Heart rate &gt; 100 beats/min</span>
             <span className="shrink-0 text-xs px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded">+1.5</span>
           </button>
           <button onClick={() => setImmobilization(!immobilization)} className={getBtnClass(immobilization)}>
             <span>Immobilization at least 3 days OR surgery in previous 4 weeks</span>
             <span className="shrink-0 text-xs px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded">+1.5</span>
           </button>
           <button onClick={() => setPrevDvtPe(!prevDvtPe)} className={getBtnClass(prevDvtPe)}>
             <span>Previous, objectively diagnosed PE or DVT</span>
             <span className="shrink-0 text-xs px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded">+1.5</span>
           </button>
           <button onClick={() => setHemoptysis(!hemoptysis)} className={getBtnClass(hemoptysis)}>
             <span>Hemoptysis</span>
             <span className="shrink-0 text-xs px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded">+1.0</span>
           </button>
           <button onClick={() => setMalignancy(!malignancy)} className={getBtnClass(malignancy)}>
             <span>Malignancy with treatment within 6 months or palliative</span>
             <span className="shrink-0 text-xs px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded">+1.0</span>
           </button>
         </div>
      </div>

      <Accordion title="📖 Teori & Panduan Tata Laksana">
        <ul className="pl-4 space-y-2 list-disc text-muted-foreground text-[13px]">
          <li><strong className="text-foreground">Tujuan:</strong> Wells' Criteria membantu stratifikasi risiko PE sebelum dilakukan pemeriksaan diagnostik (D-dimer atau CTPA).</li>
          <li><strong className="text-foreground">2-Tier Model (Modified Wells):</strong>
            <ul className="pl-4 mt-1 space-y-1 list-circle">
              <li><strong>PE Unlikely (≤ 4):</strong> Cek D-dimer (High sensitivity). Jika negatif, PE dapat dieksklusi. Jika positif, pertimbangkan CTPA.</li>
              <li><strong>PE Likely (&gt; 4):</strong> Langsung lakukan CTPA (Computed Tomography Pulmonary Angiography). D-dimer tidak berguna untuk mengeksklusi pada kelompok ini.</li>
            </ul>
          </li>
          <li><strong className="text-foreground">PERC Rule:</strong> Jika pasien low probability, pertimbangkan kriteria PERC (Pulmonary Embolism Rule-out Criteria) untuk membatalkan pemeriksaan D-dimer (bila skor PERC = 0).</li>
        </ul>
      </Accordion>
    </div>
  );
}
