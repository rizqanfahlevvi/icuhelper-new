import React, { useState, useEffect } from 'react';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { Accordion } from '../../components/ui/Accordion';
import { Activity, Beaker, Brain, HeartPulse, Wind, Droplets, AlertTriangle, Calculator, Info } from 'lucide-react';
import { useClinicalStore } from '../../store/useClinicalStore';
import { useHistoryStore } from '../../store/useHistoryStore';

interface OrganScore {
  organ: string;
  icon: string;
  detail: string;
  score: number | null;
  skipped: boolean;
}

interface SofaResult {
  total: number;
  organScores: OrganScore[];
  skippedOrgans: string[];
  isPartial: boolean;
  mortalityText: string;
  mortalityCategory: string;
  mortalityColor: string;
  delta: number | null;
  baseline: number | null;
  pfRatio: number | null;
  sfRatio: number | null;
}

const CategoryHeader = ({ icon: Icon, title, tooltip }: { icon: any; title: string; tooltip: React.ReactNode }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="space-y-2">
      <h3 
        className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 cursor-pointer select-none w-fit"
        onClick={() => setShowTooltip(!showTooltip)}
      >
        <Icon className="w-4 h-4 text-blue-500" /> {title}
        <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 ml-1" />
      </h3>
      {showTooltip && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 p-2.5 rounded-lg text-xs text-slate-600 dark:text-slate-300 animate-in fade-in slide-in-from-top-1">
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default function ScoringSofa() {
  // Input states
  const [pao2, setPao2] = useState('');
  const [fio2Persen, setFio2Persen] = useState('');
  const [fio2Desimal, setFio2Desimal] = useState('');
  const [fio2Mode, setFio2Mode] = useState<'persen' | 'desimal'>('persen');
  const [useSpO2, setUseSpO2] = useState(false);
  const [spo2, setSpo2] = useState('');
  const [ventMekanik, setVentMekanik] = useState<'ya' | 'tidak' | ''>('');
  
  const [trombosit, setTrombosit] = useState('');
  const [bilirubin, setBilirubin] = useState('');
  const [cvVal, setCvVal] = useState('');
  const [gcs, setGcs] = useState('');
  
  const [kreatinin, setKreatinin] = useState('');
  const [urineOutput, setUrineOutput] = useState('');
  const [sofaBaseline, setSofaBaseline] = useState('');

  const [result, setResult] = useState<SofaResult | null>(null);

  // Pre-populate from clinical store
  useEffect(() => {
    const d = useClinicalStore.getState().data;
    if (d.pao2) setPao2(d.pao2);
    if (d.fio2) { 
      setFio2Persen(d.fio2); 
      setFio2Mode('persen'); 
    }
    if (d.spo2) setSpo2(d.spo2);
    if (d.trombosit) setTrombosit(d.trombosit);
    if (d.bilirubinTotal) setBilirubin(d.bilirubinTotal);
    if (d.gcs) setGcs(d.gcs);
    if (d.creatinine) setKreatinin(d.creatinine);
  }, []);

  const handleCalculate = () => {
    let total = 0;
    const organScores: OrganScore[] = [];
    const skippedOrgans: string[] = [];
    let isPartial = false;

    // --- 1. Respirasi ---
    let respScore: number | null = null;
    let respDetail = '';
    let currPf: number | null = null;
    let currSf: number | null = null;

    const fio2Dec = fio2Mode === 'persen' ? parseFloat(fio2Persen) / 100 : parseFloat(fio2Desimal);

    if (!isNaN(fio2Dec) && fio2Dec > 0) {
      if (!useSpO2 && pao2 !== '') {
        const pa = parseFloat(pao2);
        if (!isNaN(pa)) {
          currPf = pa / fio2Dec;
          respDetail = `P/F = ${Math.round(currPf)} (VM: ${ventMekanik === 'ya' ? 'Ya' : 'Tdk'})`;
          if (currPf >= 400) respScore = 0;
          else if (currPf >= 300) respScore = 1;
          else if (currPf >= 200) respScore = 2;
          else if (currPf >= 100) respScore = ventMekanik === 'ya' ? 3 : 2;
          else respScore = ventMekanik === 'ya' ? 4 : 2;
        }
      } else if (useSpO2 && spo2 !== '') {
        const sp = parseFloat(spo2);
        if (!isNaN(sp)) {
          currSf = sp / fio2Dec;
          respDetail = `S/F = ${Math.round(currSf)} (VM: ${ventMekanik === 'ya' ? 'Ya' : 'Tdk'})`;
          if (currSf > 315) respScore = 0;
          else if (currSf > 264) respScore = 1;
          else if (currSf > 221) respScore = 2;
          else respScore = ventMekanik === 'ya' ? 3 : 2;
        }
      }
    }

    if (respScore !== null) {
      total += respScore;
      organScores.push({ organ: 'Respirasi (PaO₂/FiO₂)', icon: 'Wind', detail: respDetail, score: respScore, skipped: false });
    } else {
      isPartial = true;
      skippedOrgans.push('Respirasi (PaO₂/FiO₂)');
      organScores.push({ organ: 'Respirasi (PaO₂/FiO₂)', icon: 'Wind', detail: 'Tidak tersedia — tidak dihitung', score: null, skipped: true });
    }

    // --- 2. Koagulasi ---
    let pltScore: number | null = null;
    let pltDetail = '';
    if (trombosit !== '') {
      const plt = parseFloat(trombosit);
      if (!isNaN(plt)) {
        pltDetail = `PLT ${plt} ×10³/μL`;
        if (plt >= 150) pltScore = 0;
        else if (plt >= 100) pltScore = 1;
        else if (plt >= 50) pltScore = 2;
        else if (plt >= 20) pltScore = 3;
        else pltScore = 4;
      }
    }
    
    if (pltScore !== null) {
      total += pltScore;
      organScores.push({ organ: 'Koagulasi (Trombosit)', icon: 'Droplets', detail: pltDetail, score: pltScore, skipped: false });
    } else {
      isPartial = true;
      skippedOrgans.push('Koagulasi');
      organScores.push({ organ: 'Koagulasi (Trombosit)', icon: 'Droplets', detail: 'Tidak tersedia — tidak dihitung', score: null, skipped: true });
    }

    // --- 3. Hepar ---
    let bilScore: number | null = null;
    let bilDetail = '';
    if (bilirubin !== '') {
      const bil = parseFloat(bilirubin);
      if (!isNaN(bil)) {
        bilDetail = `Bil ${bil} mg/dL`;
        if (bil < 1.2) bilScore = 0;
        else if (bil <= 1.9) bilScore = 1;
        else if (bil <= 5.9) bilScore = 2;
        else if (bil <= 11.9) bilScore = 3;
        else bilScore = 4;
      }
    }
    
    if (bilScore !== null) {
      total += bilScore;
      organScores.push({ organ: 'Hepar (Bilirubin total)', icon: 'Beaker', detail: bilDetail, score: bilScore, skipped: false });
    } else {
      isPartial = true;
      skippedOrgans.push('Hepar');
      organScores.push({ organ: 'Hepar (Bilirubin total)', icon: 'Beaker', detail: 'Tidak tersedia — tidak dihitung', score: null, skipped: true });
    }

    // --- 4. Kardiovaskular ---
    let cvScore: number | null = null;
    let cvDetail = '';
    if (cvVal !== '') {
      cvScore = parseInt(cvVal, 10);
      const cvLabels: Record<number, string> = {
        0: 'MAP ≥70 mmHg',
        1: 'MAP <70 mmHg',
        2: 'Dopamin ≤5 atau Dobutamin',
        3: 'Dopamin 5.1–15 / Epi ≤0.1 / NE ≤0.1',
        4: 'Dopamin >15 / Epi >0.1 / NE >0.1'
      };
      cvDetail = cvLabels[cvScore] || '';
    }

    if (cvScore !== null) {
      total += cvScore;
      organScores.push({ organ: 'Kardiovaskular', icon: 'HeartPulse', detail: cvDetail, score: cvScore, skipped: false });
    } else {
      isPartial = true;
      skippedOrgans.push('Kardiovaskular');
      organScores.push({ organ: 'Kardiovaskular', icon: 'HeartPulse', detail: 'Tidak tersedia — tidak dihitung', score: null, skipped: true });
    }

    // --- 5. SSP (GCS) ---
    let cnsScore: number | null = null;
    let cnsDetail = '';
    if (gcs !== '') {
      const g = parseInt(gcs, 10);
      if (!isNaN(g)) {
        cnsDetail = `GCS ${g}`;
        if (g === 15) cnsScore = 0;
        else if (g >= 13) cnsScore = 1;
        else if (g >= 10) cnsScore = 2;
        else if (g >= 6) cnsScore = 3;
        else cnsScore = 4;
      }
    }

    if (cnsScore !== null) {
      total += cnsScore;
      organScores.push({ organ: 'SSP (GCS)', icon: 'Brain', detail: cnsDetail, score: cnsScore, skipped: false });
    } else {
      isPartial = true;
      skippedOrgans.push('SSP (GCS)');
      organScores.push({ organ: 'SSP (GCS)', icon: 'Brain', detail: 'Tidak tersedia — tidak dihitung', score: null, skipped: true });
    }

    // --- 6. Renal ---
    let crScore: number | null = null;
    let uoScore: number | null = null;
    let crDetail = '';
    let uoDetail = '';
    
    if (kreatinin !== '') {
      const cr = parseFloat(kreatinin);
      if (!isNaN(cr)) {
        crDetail = `Cr ${cr} mg/dL`;
        if (cr < 1.2) crScore = 0;
        else if (cr <= 1.9) crScore = 1;
        else if (cr <= 3.4) crScore = 2;
        else if (cr <= 4.9) crScore = 3;
        else crScore = 4;
      }
    }
    if (urineOutput !== '') {
      const uo = parseFloat(urineOutput);
      if (!isNaN(uo)) {
        uoDetail = `UO ${uo} mL/24j`;
        if (uo >= 500) uoScore = 0;
        else if (uo >= 200) uoScore = 3;
        else uoScore = 4;
      }
    }
    
    let renScore: number | null = null;
    let renDetail = '';
    if (crScore !== null && uoScore !== null) {
      renScore = Math.max(crScore, uoScore);
      renDetail = `${crDetail} + ${uoDetail}`;
    } else if (crScore !== null) {
      renScore = crScore;
      renDetail = crDetail;
    } else if (uoScore !== null) {
      renScore = uoScore;
      renDetail = uoDetail;
    }

    if (renScore !== null) {
      total += renScore;
      organScores.push({ organ: 'Renal (Kreatinin + UO)', icon: 'Activity', detail: renDetail, score: renScore, skipped: false });
    } else {
      isPartial = true;
      skippedOrgans.push('Renal');
      organScores.push({ organ: 'Renal (Kreatinin + UO)', icon: 'Activity', detail: 'Tidak tersedia — tidak dihitung', score: null, skipped: true });
    }

    // --- Mortality Calculation ---
    let mortalityText = '';
    let mortalityCategory = '';
    let mortalityColor = '';
    
    if (total <= 6) {
      mortalityText = '< 10%';
      mortalityCategory = 'Risiko Rendah';
      mortalityColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
    } else if (total <= 9) {
      mortalityText = '15–20%';
      mortalityCategory = 'Risiko Sedang';
      mortalityColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
    } else if (total <= 12) {
      mortalityText = '40–50%';
      mortalityCategory = 'Risiko Tinggi';
      mortalityColor = 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
    } else {
      mortalityText = '> 80%';
      mortalityCategory = 'Risiko Sangat Tinggi';
      mortalityColor = 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    }

    // --- Delta SOFA ---
    let delta: number | null = null;
    let baselineVal: number | null = null;
    if (sofaBaseline !== '') {
      const b = parseFloat(sofaBaseline);
      if (!isNaN(b)) {
        baselineVal = b;
        delta = total - b;
      }
    }

    setResult({
      total,
      organScores,
      skippedOrgans,
      isPartial,
      mortalityText,
      mortalityCategory,
      mortalityColor,
      delta,
      baseline: baselineVal,
      pfRatio: currPf,
      sfRatio: currSf,
    });
    
    useHistoryStore.getState().addEntry(
      'scoring_sofa',
      `SOFA: ${total}`,
      { pao2, fio2Mode, fio2Desimal, fio2Persen, spo2, ventMekanik, trombosit, bilirubin, cvVal, gcs, kreatinin, urineOutput, sofaBaseline },
      `Skor Total: ${total} - ${mortalityText}`
    );
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-slate-400 dark:text-slate-500';
    if (score === 0) return 'text-emerald-500';
    if (score === 1) return 'text-blue-500';
    if (score === 2) return 'text-amber-500';
    if (score === 3) return 'text-orange-500';
    if (score === 4) return 'text-red-500';
    return '';
  };

  const renderDots = (score: number | null) => {
    if (score === null) return '—';
    const dots = [];
    for (let i = 0; i < 4; i++) {
      dots.push(i < score ? '●' : '○');
    }
    return dots.join('');
  };

  const inputClass = "w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const selectClass = "w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const cardClass = "bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 overflow-x-hidden">
      <ActivePatientBriefCard />

      <div className={cardClass}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">SOFA Score</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Sequential Organ Failure Assessment</p>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Semua parameter opsional.</strong> Kosongkan input yang tidak tersedia. SOFA parsial akan dihitung secara otomatis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kolom Kiri */}
          <div className="space-y-6">
            
            {/* Respirasi */}
            <div className="space-y-4">
              <CategoryHeader 
                icon={Wind} 
                title="Respirasi" 
                tooltip={
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>P/F &ge; 400: <strong>0</strong></li>
                    <li>P/F 300–399: <strong>1</strong></li>
                    <li>P/F 200–299: <strong>2</strong></li>
                    <li>P/F 100–199 &amp; VM: <strong>3</strong></li>
                    <li>P/F &lt; 100 &amp; VM: <strong>4</strong></li>
                  </ul>
                } 
              />
              
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Format FiO₂</label>
                  <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
                    <button
                      onClick={() => setFio2Mode('persen')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${fio2Mode === 'persen' ? 'bg-white dark:bg-slate-900 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      Persen (%)
                    </button>
                    <button
                      onClick={() => setFio2Mode('desimal')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${fio2Mode === 'desimal' ? 'bg-white dark:bg-slate-900 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      Desimal
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                      FiO₂ {fio2Mode === 'persen' ? '(21–100)' : '(0.21–1.0)'}
                    </label>
                    <input
                      type="number"
                      className={inputClass}
                      value={fio2Mode === 'persen' ? fio2Persen : fio2Desimal}
                      onChange={(e) => fio2Mode === 'persen' ? setFio2Persen(e.target.value) : setFio2Desimal(e.target.value)}
                      placeholder={fio2Mode === 'persen' ? '21' : '0.21'}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                      {useSpO2 ? 'SpO₂ (%)' : 'PaO₂ (mmHg)'}
                    </label>
                    <input
                      type="number"
                      className={inputClass}
                      value={useSpO2 ? spo2 : pao2}
                      onChange={(e) => useSpO2 ? setSpo2(e.target.value) : setPao2(e.target.value)}
                      placeholder={useSpO2 ? '95' : '80'}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="useSpO2"
                    checked={useSpO2}
                    onChange={(e) => setUseSpO2(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-900 dark:border-slate-600"
                  />
                  <label htmlFor="useSpO2" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                    Gunakan SpO₂ (jika AGD tidak tersedia)
                  </label>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Ventilasi Mekanik (Invasif / NIV)</label>
                  <select className={selectClass} value={ventMekanik} onChange={(e) => setVentMekanik(e.target.value as any)}>
                    <option value="">-- Pilih --</option>
                    <option value="ya">Ya</option>
                    <option value="tidak">Tidak</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Koagulasi */}
            <div className="space-y-4">
              <CategoryHeader 
                icon={Droplets} 
                title="Koagulasi" 
                tooltip={
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>&ge; 150: <strong>0</strong></li>
                    <li>100–149: <strong>1</strong></li>
                    <li>50–99: <strong>2</strong></li>
                    <li>20–49: <strong>3</strong></li>
                    <li>&lt; 20: <strong>4</strong></li>
                  </ul>
                } 
              />
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Trombosit (×10³/μL)</label>
                <input
                  type="number"
                  className={inputClass}
                  value={trombosit}
                  onChange={(e) => setTrombosit(e.target.value)}
                  placeholder="Contoh: 150"
                />
              </div>
            </div>

            {/* Hepar */}
            <div className="space-y-4">
              <CategoryHeader 
                icon={Beaker} 
                title="Hepar" 
                tooltip={
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>&lt; 1.2 mg/dL: <strong>0</strong></li>
                    <li>1.2–1.9 mg/dL: <strong>1</strong></li>
                    <li>2.0–5.9 mg/dL: <strong>2</strong></li>
                    <li>6.0–11.9 mg/dL: <strong>3</strong></li>
                    <li>&ge; 12.0 mg/dL: <strong>4</strong></li>
                  </ul>
                } 
              />
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Bilirubin total (mg/dL)</label>
                <input
                  type="number"
                  className={inputClass}
                  value={bilirubin}
                  onChange={(e) => setBilirubin(e.target.value)}
                  placeholder="Contoh: 1.1"
                />
              </div>
            </div>

          </div>

          {/* Kolom Kanan */}
          <div className="space-y-6">
            
            {/* Kardiovaskular */}
            <div className="space-y-4">
              <CategoryHeader 
                icon={HeartPulse} 
                title="Kardiovaskular" 
                tooltip={
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>MAP &ge; 70: <strong>0</strong></li>
                    <li>MAP &lt; 70: <strong>1</strong></li>
                    <li>Dopamin &le; 5 atau Dobutamin: <strong>2</strong></li>
                    <li>Dop 5.1–15, Epi &le; 0.1, NE &le; 0.1: <strong>3</strong></li>
                    <li>Dop &gt; 15, Epi &gt; 0.1, NE &gt; 0.1: <strong>4</strong></li>
                  </ul>
                } 
              />
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">MAP atau Dosis Vasopressor</label>
                <select className={selectClass} value={cvVal} onChange={(e) => setCvVal(e.target.value)}>
                  <option value="">-- Pilih (Opsional) --</option>
                  <option value="0">MAP ≥ 70 mmHg (Tanpa vasopressor)</option>
                  <option value="1">MAP &lt; 70 mmHg (Tanpa vasopressor)</option>
                  <option value="2">Dopamin ≤ 5 atau Dobutamin</option>
                  <option value="3">Dopamin 5.1–15 / Epinefrin ≤ 0.1 / NE ≤ 0.1</option>
                  <option value="4">Dopamin &gt; 15 / Epinefrin &gt; 0.1 / NE &gt; 0.1</option>
                </select>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Dosis dalam μg/kg/menit (dosis untuk MAP ≥ 65)</p>
              </div>
            </div>

            {/* SSP */}
            <div className="space-y-4">
              <CategoryHeader 
                icon={Brain} 
                title="Sistem Saraf Pusat" 
                tooltip={
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>GCS 15: <strong>0</strong></li>
                    <li>GCS 13–14: <strong>1</strong></li>
                    <li>GCS 10–12: <strong>2</strong></li>
                    <li>GCS 6–9: <strong>3</strong></li>
                    <li>GCS &lt; 6: <strong>4</strong></li>
                  </ul>
                } 
              />
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">GCS (3–15)</label>
                <input
                  type="number"
                  className={inputClass}
                  value={gcs}
                  onChange={(e) => setGcs(e.target.value)}
                  placeholder="Contoh: 15"
                  min="3" max="15"
                />
              </div>
            </div>

            {/* Renal */}
            <div className="space-y-4">
              <CategoryHeader 
                icon={Activity} 
                title="Renal" 
                tooltip={
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Cr &lt; 1.2: <strong>0</strong></li>
                    <li>Cr 1.2–1.9: <strong>1</strong></li>
                    <li>Cr 2.0–3.4: <strong>2</strong></li>
                    <li>Cr 3.5–4.9 atau UO &lt; 500: <strong>3</strong></li>
                    <li>Cr &ge; 5.0 atau UO &lt; 200: <strong>4</strong></li>
                  </ul>
                } 
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Kreatinin (mg/dL)</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={kreatinin}
                    onChange={(e) => setKreatinin(e.target.value)}
                    placeholder="1.0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Urine (mL/24j)</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={urineOutput}
                    onChange={(e) => setUrineOutput(e.target.value)}
                    placeholder="Contoh: 1200"
                  />
                </div>
              </div>
            </div>

            {/* Baseline */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Δ SOFA (Sepsis-3)</h3>
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">SOFA Baseline (sebelum sakit ini)</label>
                <input
                  type="number"
                  className={inputClass}
                  value={sofaBaseline}
                  onChange={(e) => setSofaBaseline(e.target.value)}
                  placeholder="Isi 0 jika tidak diketahui/tidak ada disfungsi organ kronis"
                />
              </div>
            </div>

          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Hitung SOFA Score
          </button>
        </div>
      </div>

      {/* HASIL */}
      {result && (
        <div className={`${cardClass} animate-in fade-in slide-in-from-bottom-4`}>
          <div className={`p-4 rounded-xl border ${result.mortalityColor} flex flex-col md:flex-row items-center justify-between gap-4 mb-6`}>
            <div>
              <div className="text-sm font-semibold opacity-80 uppercase tracking-wider mb-1">
                {result.isPartial ? 'Partial SOFA Score' : 'Total SOFA Score'}
              </div>
              <div className="text-4xl font-black">
                {result.total}
              </div>
            </div>
            <div className="w-full md:w-px h-px md:h-12 bg-current opacity-20"></div>
            <div className="text-left w-full md:w-auto">
              <div className="font-bold text-lg">{result.mortalityCategory}</div>
              <div className="text-sm opacity-90 mt-0.5">Mortalitas ICU estimasi {result.mortalityText}</div>
              {result.isPartial && (
                <div className="text-xs font-medium mt-1 flex items-center gap-1.5 opacity-90">
                  <AlertTriangle className="w-3.5 h-3.5" /> {result.skippedOrgans.length} parameter dilewati
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1 mb-6">
            {result.organScores.map((org, idx) => {
              const IconComp = {
                Wind, Droplets, Beaker, HeartPulse, Brain, Activity
              }[org.icon] || Info;

              return (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#2C2C2E]/30 border border-slate-100 dark:border-slate-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white dark:bg-slate-800 rounded-md shadow-sm">
                      <IconComp className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${org.skipped ? 'text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                        {org.organ}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{org.detail}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-mono tracking-widest text-slate-300 dark:text-slate-600">
                      {renderDots(org.score)}
                    </div>
                    <div className={`text-lg font-bold w-6 text-right ${getScoreColor(org.score)}`}>
                      {org.score !== null ? `[${org.score}]` : '[—]'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {result.delta !== null && (
            <div className={`p-4 rounded-xl border ${result.delta >= 2 ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300' : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400'} mb-6`}>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <strong className="block mb-1">
                    Δ SOFA = {result.delta >= 0 ? `+${result.delta}` : result.delta} 
                    <span className="font-normal opacity-80 text-sm ml-2">
                      (baseline: {result.baseline} → sekarang: {result.total})
                    </span>
                  </strong>
                  <p className="text-sm leading-relaxed opacity-90">
                    {result.delta >= 2 
                      ? 'Kriteria disfungsi organ Sepsis-3 TERPENUHI. Konfirmasi adanya sumber infeksi untuk diagnosis Sepsis.' 
                      : 'Kriteria disfungsi organ Sepsis-3 tidak terpenuhi (Δ SOFA < 2).'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {result.isPartial && (
            <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-6 flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <AlertTriangle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <strong>Parameter dilewati:</strong> {result.skippedOrgans.join(' · ')}<br />
                <span className="opacity-80">Skor ini bersifat PARSIAL — kemungkinan underestimate risiko yang sebenarnya.</span>
              </div>
            </div>
          )}

          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div>📚 [1] Vincent JL et al. Intensive Care Med 1996;22:707</div>
            <div>[2] Singer M et al. (Sepsis-3) JAMA 2016;315:801</div>
            <div>[3] Ferreira FL et al. JAMA 2001;286:1754</div>
            <div>[4] Lambden S et al. Crit Care 2019;23:374</div>
            <div>[5] Evans L et al. (SSC 2024) ICM 2024;50:744</div>
            <div>[6] Pandharipande PP et al. Crit Care Med 2023 (SpO₂/FiO₂)</div>
          </div>
        </div>
      )}

      {/* THEORI */}
      <Accordion title="📖 Teori SOFA Score & Definisi Sepsis-3">
        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 break-words w-full max-w-full overflow-hidden min-w-0">
          <div>
            <strong className="text-slate-900 dark:text-slate-100 block mb-1">Latar Belakang</strong>
            SOFA Score (Sequential Organ Failure Assessment) dikembangkan oleh Vincent et al. untuk menilai disfungsi organ secara serial di ICU [1]. Pada Sepsis-3 (Singer et al. JAMA 2016), SOFA menjadi dasar definisi baru: <strong>Sepsis = Infeksi + Δ SOFA ≥ 2 dari baseline</strong> [2], menggantikan kriteria SIRS yang terlalu sensitif.
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <strong className="text-slate-900 dark:text-slate-100 text-xs">Tabel Kriteria SOFA Score</strong>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 sm:hidden animate-pulse">
                <span>← Geser horizontal untuk detail →</span>
              </span>
            </div>
            <div className="w-full max-w-full overflow-x-auto relative border border-slate-200 dark:border-slate-800 rounded-lg scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-[740px] w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs text-left table-fixed">
                  <colgroup>
                    <col className="w-[110px]" />
                    <col className="w-[150px]" />
                    <col className="w-[96px]" />
                    <col className="w-[96px]" />
                    <col className="w-[96px]" />
                    <col className="w-[96px]" />
                    <col className="w-[96px]" />
                  </colgroup>
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr className="text-slate-600 dark:text-slate-400">
                      <th className="px-3 py-2 font-semibold sticky left-0 z-20 bg-slate-50 dark:bg-[#2C2C2E] border-r border-slate-200 dark:border-slate-800">Sistem</th>
                      <th className="px-3 py-2 font-semibold">Parameter</th>
                      <th className="px-2 py-2 font-semibold text-center bg-slate-100/30 dark:bg-slate-800/20">0</th>
                      <th className="px-2 py-2 font-semibold text-center">1</th>
                      <th className="px-2 py-2 font-semibold text-center">2</th>
                      <th className="px-2 py-2 font-semibold text-center">3</th>
                      <th className="px-2 py-2 font-semibold text-center">4</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                    <tr>
                      <td className="px-3 py-2 font-medium sticky left-0 z-10 bg-white dark:bg-[#1C1C1E] border-r border-slate-200 dark:border-slate-800">Respirasi</td>
                      <td className="px-3 py-2">PaO₂/FiO₂ (mmHg)</td>
                      <td className="px-2 py-2 text-center bg-slate-50/20 dark:bg-slate-800/5">≥400</td>
                      <td className="px-2 py-2 text-center">300–399</td>
                      <td className="px-2 py-2 text-center">200–299</td>
                      <td className="px-2 py-2 text-center">100–199*</td>
                      <td className="px-2 py-2 text-center">&lt;100*</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-medium sticky left-0 z-10 bg-white dark:bg-[#1C1C1E] border-r border-slate-200 dark:border-slate-800">Koagulasi</td>
                      <td className="px-3 py-2">Trombosit (×10³/μL)</td>
                      <td className="px-2 py-2 text-center bg-slate-50/20 dark:bg-slate-800/5">≥150</td>
                      <td className="px-2 py-2 text-center">100–149</td>
                      <td className="px-2 py-2 text-center">50–99</td>
                      <td className="px-2 py-2 text-center">20–49</td>
                      <td className="px-2 py-2 text-center">&lt;20</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-medium sticky left-0 z-10 bg-white dark:bg-[#1C1C1E] border-r border-slate-200 dark:border-slate-800">Hepar</td>
                      <td className="px-3 py-2">Bilirubin (mg/dL)</td>
                      <td className="px-2 py-2 text-center bg-slate-50/20 dark:bg-slate-800/5">&lt;1.2</td>
                      <td className="px-2 py-2 text-center">1.2–1.9</td>
                      <td className="px-2 py-2 text-center">2.0–5.9</td>
                      <td className="px-2 py-2 text-center">6.0–11.9</td>
                      <td className="px-2 py-2 text-center">≥12.0</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-medium sticky left-0 z-10 bg-white dark:bg-[#1C1C1E] border-r border-slate-200 dark:border-slate-800">Kardiovaskular</td>
                      <td className="px-3 py-2">MAP/Vasopressor</td>
                      <td className="px-2 py-2 text-center bg-slate-50/20 dark:bg-slate-800/5">MAP≥70</td>
                      <td className="px-2 py-2 text-center">MAP&lt;70</td>
                      <td className="px-2 py-2 text-center">DA≤5/DOB</td>
                      <td className="px-2 py-2 text-center">DA 5–15 / E,NE≤0.1</td>
                      <td className="px-2 py-2 text-center">DA&gt;15 / E,NE&gt;0.1</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-medium sticky left-0 z-10 bg-white dark:bg-[#1C1C1E] border-r border-slate-200 dark:border-slate-800">SSP</td>
                      <td className="px-3 py-2">GCS</td>
                      <td className="px-2 py-2 text-center bg-slate-50/20 dark:bg-slate-800/5">15</td>
                      <td className="px-2 py-2 text-center">13–14</td>
                      <td className="px-2 py-2 text-center">10–12</td>
                      <td className="px-2 py-2 text-center">6–9</td>
                      <td className="px-2 py-2 text-center">&lt;6</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-medium sticky left-0 z-10 bg-white dark:bg-[#1C1C1E] border-r border-slate-200 dark:border-slate-800">Renal</td>
                      <td className="px-3 py-2">Kreatinin (mg/dL)</td>
                      <td className="px-2 py-2 text-center bg-slate-50/20 dark:bg-slate-800/5">&lt;1.2</td>
                      <td className="px-2 py-2 text-center">1.2–1.9</td>
                      <td className="px-2 py-2 text-center">2.0–3.4</td>
                      <td className="px-2 py-2 text-center">3.5–4.9 / UO&lt;500</td>
                      <td className="px-2 py-2 text-center">≥5.0 / UO&lt;200</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/30 p-2 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800/50">
                *Skor 3–4 respirasi membutuhkan ventilasi mekanik (invasif atau NIV) [2,3]<br/>
                DA=Dopamine, DOB=Dobutamine, E=Epinefrin, NE=Norepinefrin (μg/kg/mnt)
              </div>
            </div>
          </div>

          <div>
            <strong className="text-slate-900 dark:text-slate-100 block mb-1">SpO₂/FiO₂ sebagai Substitusi PaO₂/FiO₂</strong>
            (jika AGD tidak tersedia) [6]:
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>S/F ≤ 315 → setara P/F ≤ 300 (SOFA skor ≥1)</li>
              <li>S/F ≤ 264 → setara P/F ≤ 200 (SOFA skor ≥2)</li>
              <li>S/F ≤ 221 → setara P/F ≤ 150 (SOFA skor ≥3 jika VM)</li>
            </ul>
          </div>

          <div>
            <strong className="text-slate-900 dark:text-slate-100 block mb-1 text-xs">Mortalitas Berdasarkan Total SOFA Score</strong>
            <div className="w-full max-w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
              <table className="w-full min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr className="text-slate-600 dark:text-slate-400">
                    <th className="px-3 py-2 font-semibold">SOFA Total</th>
                    <th className="px-3 py-2 font-semibold">Mortalitas ICU (estimasi)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                  <tr>
                    <td className="px-3 py-2 font-medium">0–6</td>
                    <td className="px-3 py-2">&lt; 10%</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium">7–9</td>
                    <td className="px-3 py-2">15–20%</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium">10–12</td>
                    <td className="px-3 py-2">40–50%</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium">≥13</td>
                    <td className="px-3 py-2">&gt; 80%</td>
                  </tr>
                  <tr className="bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300">
                    <td className="px-3 py-2 font-medium">Δ SOFA ≥2</td>
                    <td className="px-3 py-2">→ Kriteria Sepsis-3 (jika ada infeksi)</td>
                  </tr>
                </tbody>
              </table>
              <div className="bg-slate-50 dark:bg-slate-800/30 p-2 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800/50">
                PENTING: Hanya 4 range ini yang validated. Jangan interpolasi nilai granular di antaranya [3,4].
              </div>
            </div>
          </div>

          <div>
            <strong className="text-slate-900 dark:text-slate-100 block mb-1">Definisi Sepsis-3 [2]</strong>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li><strong>Sepsis:</strong> Disfungsi organ mengancam jiwa akibat disregulasi respons host terhadap infeksi (Δ SOFA ≥2 dari baseline)</li>
              <li><strong>Septic Shock:</strong> Sepsis + vasopressor untuk MAP ≥65 mmHg + Laktat &gt;2 mmol/L meski resusitasi adekuat</li>
              <li><strong>qSOFA:</strong> Skrining pre-ICU — RR ≥22 + GCS &lt;15 + Sistolik ≤100 → skor ≥2 = risiko tinggi [7]</li>
            </ul>
          </div>

          <div>
            <strong className="text-slate-900 dark:text-slate-100 block mb-1">Delta-SOFA [3,5]</strong>
            ΔSOFA pada 48 jam pertama lebih prediktif daripada nilai absolut; ΔSOFA meningkat = prognosis buruk independen dari skor awal. Gunakan untuk monitoring respons terapi harian. SSC 2024 merekomendasikan evaluasi SOFA serial sebagai bagian monitoring sepsis [5].
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-6 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
            <div>[1] Vincent JL, Moreno R, Takala J, et al. Intensive Care Med 1996;22:707–710.</div>
            <div>[2] Singer M, Deutschman CS, Seymour CW, et al. JAMA 2016;315(8):801–810.</div>
            <div>[3] Ferreira FL, Bota DP, Bross A, Mélot C, Vincent JL. JAMA 2001;286(14):1754–1758.</div>
            <div>[4] Lambden S, Laterre PF, Levy MM, Francois B. Crit Care 2019;23:374.</div>
            <div>[5] Evans L, Rhodes A, Alhazzani W, et al. Intensive Care Med 2024;50:744–777.</div>
            <div>[6] Pandharipande PP, Shintani AK, Hagerman HE, et al. Crit Care Med 2023.</div>
            <div>[7] Seymour CW, Liu VX, Iwashyna TJ, et al. JAMA 2016;315(8):762–774.</div>
          </div>
        </div>
      </Accordion>
    </div>
  );
}
