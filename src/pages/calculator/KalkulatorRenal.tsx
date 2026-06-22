import { useState, useEffect, useMemo } from 'react';
import { useHistoryStore } from '../../store/useHistoryStore';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';
import { Accordion } from '../../components/ui/Accordion';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { 
  Activity, 
  Info, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Scale, 
  User, 
  ShieldAlert,
  Dna
} from 'lucide-react';

export default function KalkulatorRenal() {
  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();
  const addHistory = useHistoryStore((state) => state.addEntry);

  // Main active tab: 'gfr_crcl' or 'fena_feurea'
  const [activeTab, setActiveTab] = useState<'gfr_crcl' | 'fena_feurea'>('gfr_crcl');

  // --- TAB 1: GFR & CrCl STATE ---
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'m' | 'f'>('m');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [scrVal, setScrVal] = useState('');
  const [scrUnit, setScrUnit] = useState<'mg' | 'umol'>('mg');
  const [crclResults, setCrclResults] = useState<any>(null);

  // --- TAB 2: FENA & FEUREA STATE ---
  const [sna, setSna] = useState('');
  const [scr, setScr] = useState('');
  const [una, setUna] = useState('');
  const [ucr, setUcr] = useState('');
  const [sureum, setSureum] = useState('');
  const [uureum, setUureum] = useState('');
  const [fenaResults, setFenaResults] = useState<any>(null);

  // Auto-load on mount
  useEffect(() => {
    // Tab 1 fields
    const parentAge = patient.ageYears || clinicalStore.data.age || '';
    if (parentAge) setAge(parentAge);
    
    const parentGender = patient.gender || clinicalStore.data.gender || '';
    if (parentGender) {
      setSex(parentGender.toLowerCase() === 'p' ? 'f' : 'm');
    }

    const parentWeight = patient.weightKg || clinicalStore.data.weight || '';
    if (parentWeight) setWeight(parentWeight);

    const parentHeight = patient.heightCm || clinicalStore.data.height || '';
    if (parentHeight) setHeight(parentHeight);

    if (clinicalStore.data.creatinine) {
      setScrVal(clinicalStore.data.creatinine);
      setScr(clinicalStore.data.creatinine);
    }

    // Tab 2 fields
    if (clinicalStore.data.na) setSna(clinicalStore.data.na);
    if (clinicalStore.data.ureum) setSureum(clinicalStore.data.ureum);
  }, []);

  const handleAutofill = (data: { weightKg: string; heightCm?: string; age?: string; gender?: string }) => {
    if (data.age) setAge(data.age);
    if (data.gender) {
      setSex(data.gender.toLowerCase() === 'p' ? 'f' : 'm');
    }
    if (data.weightKg) setWeight(data.weightKg);
    if (data.heightCm) setHeight(data.heightCm);

    if (clinicalStore.data.creatinine) {
      setScrVal(clinicalStore.data.creatinine);
      setScr(clinicalStore.data.creatinine);
    }
    if (clinicalStore.data.na) setSna(clinicalStore.data.na);
    if (clinicalStore.data.ureum) setSureum(clinicalStore.data.ureum);

    setCrclResults(null);
    setFenaResults(null);
  };


  // --- CALCULATOR LOGIC FOR GFR & CRCL ---
  const calculateCrCl = () => {
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const scrRaw = parseFloat(scrVal);

    if (isNaN(scrRaw) || scrRaw <= 0) {
      alert('Masukkan nilai Kreatinin Serum (SCr) yang valid');
      return;
    }

    // Convert SCr from µmol/L to mg/dL if needed
    const scrNum = scrUnit === 'umol' ? scrRaw / 88.4 : scrRaw;

    // Pediatric check (< 18 years)
    const isPed = !isNaN(ageNum) && ageNum < 18;

    if (isPed) {
      if (isNaN(heightNum) || heightNum <= 0) {
        alert('Untuk pasien anak (<18 tahun), masukkan tinggi badan (cm) untuk menggunakan rumus Schwartz');
        return;
      }
      // Bedside Schwartz Equation: GFR = 0.413 * Height(cm) / SCr(mg/dL)
      const schwartzGfr = (0.413 * heightNum) / scrNum;

      let stage = '';
      let stageDesc = '';
      let stageColor = '';
      let stageBg = '';
      if (schwartzGfr >= 90) {
        stage = 'G1';
        stageDesc = 'Fungsi normal atau tinggi';
        stageColor = 'text-emerald-600 dark:text-emerald-400';
        stageBg = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300';
      } else if (schwartzGfr >= 60) {
        stage = 'G2';
        stageDesc = 'Penurunan fungsi minimal';
        stageColor = 'text-yellow-600 dark:text-yellow-400';
        stageBg = 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-300';
      } else if (schwartzGfr >= 45) {
        stage = 'G3a';
        stageDesc = 'Penurunan ringan sampai sedang';
        stageColor = 'text-amber-500';
        stageBg = 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 dark:text-amber-300';
      } else if (schwartzGfr >= 30) {
        stage = 'G3b';
        stageDesc = 'Penurunan sedang sampai berat';
        stageColor = 'text-orange-500';
        stageBg = 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-300';
      } else if (schwartzGfr >= 15) {
        stage = 'G4';
        stageDesc = 'Penurunan berat (Pre-dialisis)';
        stageColor = 'text-red-500';
        stageBg = 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 dark:text-red-300';
      } else {
        stage = 'G5';
        stageDesc = 'Gagal ginjal terminal / Uremia';
        stageColor = 'text-red-700 dark:text-red-300 dark:text-red-400';
        stageBg = 'bg-red-600/15 border-red-500/30 text-red-700 dark:text-red-300 dark:text-red-200 font-bold';
      }

      setCrclResults({
        isPediatric: true,
        schwartz: schwartzGfr.toFixed(1),
        stage,
        stageDesc,
        stageColor,
        stageBg,
        scrMgDl: scrNum.toFixed(2),
        height: heightNum
      });

      addHistory(
        'renal',
        `Pediatric eGFR (Schwartz) ${schwartzGfr.toFixed(1)} mL/min/1.73m²`,
        { age, sex, height, scrVal, scrUnit },
        `LFG Anak (Schwartz): ${schwartzGfr.toFixed(1)} mL/min/1.73m² (Kategori ${stage}: ${stageDesc})`
      );
      return;
    }

    // Adult Calculations (Age >= 18)
    if (isNaN(ageNum) || ageNum <= 0) {
      alert('Masukkan usia pasien (minimal 18 tahun untuk kalkulator dewasa)');
      return;
    }
    if (isNaN(weightNum) || weightNum <= 0) {
      alert('Masukkan berat badan pasien (kg)');
      return;
    }

    // Calculate Ideal Body Weight (IBW)
    let ibw = 0;
    if (!isNaN(heightNum) && heightNum > 0) {
      ibw = sex === 'm' ? 50 + 0.91 * (heightNum - 152.4) : 45.5 + 0.91 * (heightNum - 152.4);
      if (ibw < 30) ibw = 30; // clamp
    } else {
      // Default estimation without height based on typical demographic norms
      ibw = sex === 'm' ? 65 : 55;
    }

    // BMI calculation
    let bmi = null;
    if (!isNaN(heightNum) && heightNum > 0) {
      bmi = weightNum / Math.pow(heightNum / 100, 2);
    }

    // Adjusted Body Weight for obese/overweight patients
    const isObeseOrOverweight = weightNum > 1.2 * ibw || (bmi && bmi >= 25);
    const adjBw = isObeseOrOverweight ? ibw + 0.4 * (weightNum - ibw) : weightNum;

    // Body Surface Area (BSA) DuBois
    let bsa = 1.73;
    if (!isNaN(heightNum) && heightNum > 0) {
      bsa = 0.007184 * Math.pow(weightNum, 0.425) * Math.pow(heightNum, 0.725);
    }

    // Cockcroft-Gault Calculations
    const cgActual = ((140 - ageNum) * weightNum) / (72 * scrNum) * (sex === 'f' ? 0.85 : 1.0);
    const cgIdeal = ((140 - ageNum) * ibw) / (72 * scrNum) * (sex === 'f' ? 0.85 : 1.0);
    const cgAdjusted = ((140 - ageNum) * adjBw) / (72 * scrNum) * (sex === 'f' ? 0.85 : 1.0);

    // Dose adjustment recommendations based on selected weight
    let cgRecommended = cgActual;
    let weightLabel = 'Actual Body Weight (ABW)';
    if (weightNum < ibw) {
      cgRecommended = cgActual;
      weightLabel = 'Berat Aktual (karena pasien Underweight, BB < IBW)';
    } else if (isObeseOrOverweight) {
      cgRecommended = cgAdjusted;
      weightLabel = 'Adjusted Body Weight (AdjBW) — Direkomendasikan karena Overweight / Obesitas';
    } else {
      cgRecommended = cgIdeal;
      weightLabel = 'Ideal Body Weight (IBW) atau Aktual';
    }

    // CKD-EPI 2021 LFG Formula
    const k = sex === 'f' ? 0.7 : 0.9;
    const alpha = sex === 'f' ? -0.241 : -0.302;
    const sexFactor = sex === 'f' ? 1.012 : 1.0;
    const minTerm = Math.min(scrNum / k, 1);
    const maxTerm = Math.max(scrNum / k, 1);

    const ckdEpiGfr = 142 * Math.pow(minTerm, alpha) * Math.pow(maxTerm, -1.2) * Math.pow(0.9938, ageNum) * sexFactor;
    
    // Absolute GFR (mL/min) = eGFR * BSA / 1.73
    const absoluteGfr = ckdEpiGfr * (bsa / 1.73);

    // MDRD 4-variable equation
    const mdrdGfr = 175 * Math.pow(scrNum, -1.154) * Math.pow(ageNum, -0.203) * (sex === 'f' ? 0.742 : 1.0);

    // Chronic Kidney Disease classification based on eGFR (CKD-EPI 2021)
    let stage = '';
    let stageDesc = '';
    let stageColor = '';
    let stageBg = '';
    if (ckdEpiGfr >= 90) {
      stage = 'G1';
      stageDesc = 'LFG Normal atau Tinggi';
      stageColor = 'text-emerald-600 dark:text-emerald-400';
      stageBg = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300';
    } else if (ckdEpiGfr >= 60) {
      stage = 'G2';
      stageDesc = 'Penurunan LFG Ringan';
      stageColor = 'text-yellow-600 dark:text-yellow-400';
      stageBg = 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-300';
    } else if (ckdEpiGfr >= 45) {
      stage = 'G3a';
      stageDesc = 'Penurunan LFG Ringan-Sedang';
      stageColor = 'text-amber-500';
      stageBg = 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 dark:text-amber-300';
    } else if (ckdEpiGfr >= 30) {
      stage = 'G3b';
      stageDesc = 'Penurunan LFG Sedang-Berat';
      stageColor = 'text-orange-500';
      stageBg = 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-300';
    } else if (ckdEpiGfr >= 15) {
      stage = 'G4';
      stageDesc = 'Penurunan LFG Berat (Pre-dialisis)';
      stageColor = 'text-red-500';
      stageBg = 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 dark:text-red-300';
    } else {
      stage = 'G5';
      stageDesc = 'Gagal Ginjal Terminal (End-stage)';
      stageColor = 'text-red-700 dark:text-red-300 dark:text-red-400';
      stageBg = 'bg-red-600/15 border-red-500/30 text-red-700 dark:text-red-300 dark:text-red-200 font-bold';
    }

    setCrclResults({
      isPediatric: false,
      cgActual: cgActual.toFixed(1),
      cgIdeal: cgIdeal.toFixed(1),
      cgAdjusted: cgAdjusted.toFixed(1),
      cgRecommended: cgRecommended.toFixed(1),
      recommendWeight: weightLabel,
      ckdEpi: ckdEpiGfr.toFixed(1),
      absoluteGfr: absoluteGfr.toFixed(1),
      mdrd: mdrdGfr.toFixed(1),
      ibw: ibw.toFixed(1),
      adjBw: adjBw.toFixed(1),
      bsa: bsa.toFixed(2),
      bmi: bmi ? bmi.toFixed(1) : null,
      stage,
      stageDesc,
      stageColor,
      stageBg,
      scrMgDl: scrNum.toFixed(2),
    });

    addHistory(
      'renal',
      `eGFR ${ckdEpiGfr.toFixed(1)} mL/min (CKD-EPI 2021)`,
      { age, sex, weight, height, scrVal, scrUnit },
      `Adult LFG eGFR (CKD-EPI): ${ckdEpiGfr.toFixed(1)} mL/min, CrCl (Cockcroft-Gault): ${cgRecommended.toFixed(1)} mL/min (${stageDesc})`
    );
  };

  // --- CALCULATOR LOGIC FOR FENA & FEUREA ---
  const calculateFena = () => {
    const naS = parseFloat(sna);
    const crS = parseFloat(scr);
    const naU = parseFloat(una);
    const crU = parseFloat(ucr);
    const ureaS = parseFloat(sureum);
    const ureaU = parseFloat(uureum);

    if (isNaN(naS) || isNaN(crS) || isNaN(naU) || isNaN(crU)) {
      alert('Masukkan Na serum, SCr, Na urin, dan Cr urin yang valid');
      return;
    }

    const fena = (naU * crS) / (naS * crU) * 100;
    
    let fi = '', fc = '', fcls = '';
    if (fena < 1) { 
      fi = 'Pre-renal AKI — terjadi retensi Na maksimal, respons tubulus masih utuh (intakt)'; 
      fc = 'var(--sys-green)'; 
      fcls = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'; 
    } else if (fena < 2) { 
      fi = 'Inkonklusif (Zona Abu-abu) — evaluasi kondisi klinis (pasien sedang diberi diuretik? atau obstruksi?)'; 
      fc = 'var(--sys-orange)'; 
      fcls = 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300 dark:text-amber-300'; 
    } else { 
      fi = 'Renal Intrinsik AKI / ATN — cedera tubulus ginjal, kemampuan menahan natrium hilang'; 
      fc = 'var(--sys-red)'; 
      fcls = 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300 dark:text-red-300'; 
    }

    let feurea = null;
    let fui = '', fuc = '', fucls = '';
    
    if (!isNaN(ureaS) && ureaS > 0 && !isNaN(ureaU) && ureaU > 0) {
      feurea = (ureaU * crS) / (ureaS * crU) * 100;
      if (feurea < 35) { 
        fui = 'Pre-renal KO (Valid meskipun sedang mendapat terapi diuretik)'; 
        fuc = 'var(--sys-green)'; 
        fucls = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'; 
      } else if (feurea < 50) { 
        fui = 'Inkonklusif (Evaluasi klinis penuh)'; 
        fuc = 'var(--sys-orange)'; 
        fucls = 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300 dark:text-amber-300'; 
      } else { 
        fui = 'Renal Intrinsik / Gangguan Tubulus Ginjal'; 
        fuc = 'var(--sys-red)'; 
        fucls = 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300 dark:text-red-300'; 
      }
    }

    setFenaResults({
      fena: fena.toFixed(2), fi, fc, fcls,
      feurea: feurea ? feurea.toFixed(2) : null, fui, fuc, fucls
    });

    addHistory(
      'renal',
      `FENa ${fena.toFixed(2)}%`,
      { sna, scr, una, ucr, sureum, uureum },
      `FENa: ${fena.toFixed(2)}% (${fi})`
    );
  };

  // Convert SCr in input fields if user changes unit mid-entry
  const handleUnitChange = (newUnit: 'mg' | 'umol') => {
    if (newUnit === scrUnit) return;
    setScrUnit(newUnit);
    const curVal = parseFloat(scrVal);
    if (!isNaN(curVal) && curVal > 0) {
      if (newUnit === 'umol') {
        setScrVal((curVal * 88.4).toFixed(1));
      } else {
        setScrVal((curVal / 88.4).toFixed(2));
      }
    }
  };

  const syncFields = useMemo(() => {
    if (activeTab === 'gfr_crcl') {
      return [
        { key: 'age' as const, label: 'Usia', value: age, setter: setAge, unit: 'tahun' },
        { key: 'gender' as const, label: 'Jenis Kelamin', value: sex, setter: (val: string) => setSex(val === 'f' ? 'f' : 'm'), formatDisplay: (val: string) => val === 'f' ? 'Perempuan' : 'Laki-laki' },
        { key: 'weight' as const, label: 'Berat Badan', value: weight, setter: setWeight, unit: 'kg' },
        { key: 'height' as const, label: 'Tinggi Badan', value: height, setter: setHeight, unit: 'cm' },
        { key: 'creatinine' as const, label: 'Kreatinin Serum', value: scrVal, setter: setScrVal, unit: 'mg/dL' },
      ];
    } else {
      return [
        { key: 'na' as const, label: 'S-Natrium', value: sna, setter: setSna, unit: 'mEq/L' },
        { key: 'creatinine' as const, label: 'S-Kreatinin', value: scr, setter: setScr, unit: 'mg/dL' },
        { key: 'ureum' as const, label: 'S-Ureum', value: sureum, setter: setSureum, unit: 'mg/dL' },
      ];
    }
  }, [activeTab, age, sex, weight, height, scrVal, sna, scr, sureum]);

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 mb-1.5 flex-wrap">
            ⚡ Kalkulator Renal & AKI
          </h1>
          <p className="text-muted-foreground text-[13px]">
            Estimasi Laju Filtrasi Glomerulus (eGFR), Klirens Cockcroft-Gault, FENa, dan FEUrea.
          </p>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex w-full md:w-auto bg-muted/65 p-1 rounded-2xl border border-border/80 shadow-sm shrink-0">
          <button
            onClick={() => setActiveTab('gfr_crcl')}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'gfr_crcl'
                ? 'bg-background text-primary shadow-sm border border-border/10 font-black'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            <span>LFG, CrCl & Dosis</span>
          </button>
          <button
            onClick={() => setActiveTab('fena_feurea')}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'fena_feurea'
                ? 'bg-background text-primary shadow-sm border border-border/10 font-black'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>FENa & FEUrea</span>
          </button>
        </div>
      </div>

      {/* Active Patient Profile Card */}
      <ActivePatientBriefCard onAutofill={handleAutofill} />

      {/* Unified Clinical Synchronization Banner */}
      <UnifiedSyncBanner fields={syncFields} />

      {/* TAB 1: GFR, CRCL & DOSE ADJUSTMENT PANEL */}
      {activeTab === 'gfr_crcl' && (
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
              {/* Left Column: Demographics */}
              <div>
                <div className="text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">
                  <span>Biodata Klinis Pasien</span>
                </div>
                
                <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="flex items-center justify-between px-4 py-3 gap-4">
                    <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Usia</span>
                    <div className="flex-1 flex items-center justify-end gap-2">
                      <input 
                        type="number" 
                        value={age} 
                        onChange={e => setAge(e.target.value)} 
                        placeholder="cth: 53" 
                        className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
                      />
                      <span className="text-xs font-semibold text-slate-500 w-14 text-left">tahun</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 gap-4">
                    <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Jenis Kelamin</span>
                    <select 
                      value={sex}
                      onChange={e => setSex(e.target.value as 'm' | 'f')}
                      className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
                    >
                      <option value="m">Laki-laki</option>
                      <option value="f">Perempuan</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 gap-4">
                    <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Berat Badan</span>
                    <div className="flex-1 flex items-center justify-end gap-2">
                      <input 
                        type="number" 
                        value={weight} 
                        onChange={e => setWeight(e.target.value)} 
                        placeholder="cth: 72" 
                        className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
                      />
                      <span className="text-xs font-semibold text-slate-500 w-14 text-left">kg</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 gap-4">
                    <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Tinggi Badan</span>
                    <div className="flex-1 flex items-center justify-end gap-2">
                      <input 
                        type="number" 
                        value={height} 
                        onChange={e => setHeight(e.target.value)} 
                        placeholder="cth: 168" 
                        className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
                      />
                      <span className="text-xs font-semibold text-slate-500 w-14 text-left">cm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Lab Values */}
              <div>
                <div className="text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">
                  <span>Nilai Laboratorium</span>
                </div>

                <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="flex items-center justify-between px-4 py-3 gap-4">
                    <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Satuan Kreatinin</span>
                    <select
                      value={scrUnit}
                      onChange={e => handleUnitChange(e.target.value as 'mg' | 'umol')}
                      className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
                    >
                      <option value="mg">mg/dL</option>
                      <option value="umol">µmol/L</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 gap-4">
                    <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Kreatinin Serum (SCr)</span>
                    <div className="flex-1 flex items-center justify-end gap-2">
                      <input 
                        type="number" 
                        value={scrVal} 
                        onChange={e => setScrVal(e.target.value)} 
                        placeholder={scrUnit === 'mg' ? 'cth: 1.25' : 'cth: 110'} 
                        step="0.01"
                        className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
                      />
                      <span className="text-xs font-semibold text-slate-500 w-14 text-left">{scrUnit === 'mg' ? 'mg/dL' : 'µmol/L'}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4 flex gap-3 items-start mt-4">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 dark:text-blue-400">Interpretasi & Formula</p>
                    <ul className="text-[13px] font-medium leading-relaxed text-slate-700 dark:text-slate-300 list-disc pl-4 space-y-0.5 animate-pulse-slow">
                      <li>Dewasa (&ge; 18 thn): Estimasi LFG (eGFR) menggunakan <strong>CKD-EPI (2021)</strong> dan klirens CrCl menggunakan <strong>Cockcroft-Gault</strong>.</li>
                      <li>Anak-anak (&lt; 18 thn): Estimasi GFR menggunakan rumus <strong>Bedside Schwartz</strong> dari tinggi badan.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 mt-4 mb-2">
              <button 
                className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--accent)] text-[var(--accent-fg)] font-bold rounded-2xl shadow-md cursor-pointer hover:opacity-95 transition-all text-sm active:scale-[0.99]"
                onClick={calculateCrCl}
              >
                <Activity className="w-4 h-4" />
                Hitung LFG & Klirens Ginjal
              </button>
            </div>

          {/* RESULTS OUTPUT TAB 1 */}
          {crclResults && (
            <div className="mt-4 pb-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <h2 className="mb-2 px-1 text-[13px] font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Hasil Estimasi Fungsi Ginjal
              </h2>
              
              {crclResults.isPediatric ? (
                <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800 flex flex-col sm:flex-row">
                  <div className="flex-1 p-4 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-[#2C2C2E]/30">
                    <div className="text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">eGFR Bedside Schwartz (Anak)</div>
                    <div className="font-mono text-3xl font-bold text-slate-800 dark:text-white">
                      {crclResults.schwartz} <span className="text-[12px] font-sans font-medium text-slate-500/70 dark:text-slate-400/70 block sm:inline">mL/min/1.73m²</span>
                    </div>
                    <div className="text-[12px] text-slate-500 mt-2">TB {crclResults.height} cm · SCr {crclResults.scrMgDl} mg/dL</div>
                  </div>
                  <div className="flex-1 p-4 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-[#2C2C2E]/30">
                    <div className="text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Klasifikasi KDIGO</div>
                    <div className={`font-mono text-3xl font-black ${crclResults.stageColor}`}>
                      {crclResults.stage}
                    </div>
                    <div className="text-[12px] text-slate-600 dark:text-slate-300 mt-1">{crclResults.stageDesc}</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800 flex flex-col sm:flex-row">
                    <div className="flex-1 p-4 flex flex-col items-center justify-center text-center bg-teal-50/30 dark:bg-teal-900/10">
                      <div className="text-[12px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 dark:text-teal-400 mb-1">eGFR CKD-EPI (2021)</div>
                      <div className="font-mono text-3xl font-bold text-teal-700 dark:text-teal-300">
                        {crclResults.ckdEpi} <span className="text-[11px] font-sans font-medium text-teal-600 dark:text-teal-400/70 block sm:inline">mL/min/1.73m²</span>
                      </div>
                      <div className="text-[11px] text-teal-600 dark:text-teal-400/80 mt-1 uppercase font-semibold">Global Standard</div>
                    </div>
                    
                    <div className="flex-1 p-4 flex flex-col items-center justify-center text-center bg-sky-50/30 dark:bg-sky-900/10">
                      <div className="text-[12px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1">CrCl (Cockcroft-Gault)</div>
                      <div className="font-mono text-3xl font-bold text-sky-700 dark:text-sky-400">
                        {crclResults.cgRecommended} <span className="text-[11px] font-sans font-medium text-sky-600/70 block sm:inline">mL/min</span>
                      </div>
                      <div className="text-[11px] text-sky-600/80 mt-1 font-medium">{crclResults.recommendWeight}</div>
                    </div>

                    <div className="flex-1 p-4 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-[#2C2C2E]/30">
                      <div className="text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">KDIGO Stage</div>
                      <div className={`font-mono text-3xl font-black ${crclResults.stageColor}`}>
                        {crclResults.stage}
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 font-medium text-center leading-tight">
                        {crclResults.stageDesc}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                    <div className="flex items-center justify-between p-3 gap-4 bg-slate-50 dark:bg-[#2C2C2E]">
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 select-none">Detail Analisis & Berat Alternatif</span>
                    </div>
                    <div className="flex justify-between items-center p-3 px-4">
                      <span className="text-[14px] text-slate-700 dark:text-slate-300">Berat Aktual ({weight} kg)</span>
                      <span className="font-mono font-bold text-[15px] text-slate-900 dark:text-white">{crclResults.cgActual} <span className="text-[11px] text-slate-400">mL/min</span></span>
                    </div>
                    <div className="flex justify-between items-center p-3 px-4">
                      <span className="text-[14px] text-slate-700 dark:text-slate-300">Berat Ideal (IBW {crclResults.ibw} kg)</span>
                      <span className="font-mono font-bold text-[15px] text-slate-900 dark:text-white">{crclResults.cgIdeal} <span className="text-[11px] text-slate-400">mL/min</span></span>
                    </div>
                    <div className="flex justify-between items-center p-3 px-4">
                      <span className="text-[14px] text-slate-700 dark:text-slate-300">Berat Adjusted (AdjBW {crclResults.adjBw} kg)</span>
                      <span className="font-mono font-bold text-[15px] text-slate-900 dark:text-white">{crclResults.cgAdjusted} <span className="text-[11px] text-slate-400">mL/min</span></span>
                    </div>
                    <div className="flex justify-between items-center p-3 px-4 bg-slate-50/50 dark:bg-[#2C2C2E]/50">
                      <span className="text-[14px] text-slate-700 dark:text-slate-300">BSA ({crclResults.bsa} m²) · Absolute GFR</span>
                      <span className="font-mono font-bold text-[15px] text-slate-900 dark:text-white">{crclResults.absoluteGfr} <span className="text-[11px] text-slate-400">mL/min</span></span>
                    </div>
                  </div>

                  {/* ICU DRUG DOSE ADJUSTMENT ADVISORY */}
                  <div className="w-full bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-4 flex gap-3 items-start">
                    <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1.5 w-full">
                      <h4 className="text-[11px] font-black tracking-wider text-amber-600 dark:text-amber-400 dark:text-amber-500 uppercase">Rekomendasi Dosis ICU (GFR/CrCl Pasien)</h4>
                      
                      {parseFloat(crclResults.cgRecommended) < 15 ? (
                        <div className="text-[13px] space-y-1 text-slate-700 dark:text-slate-300">
                          <span className="text-red-600 dark:text-red-400 dark:text-red-400 font-bold uppercase block text-[11px]">CRITICAL DOSE REDUCTION! (CrCl &lt; 15 mL/min)</span>
                          <p>Mayoritas antibiotik renal-clearance harus dipotong signifikan (cth: Meropenem dipotong menjadi 500mg tiap 24 jam; Piperacillin/Tazobactam maksimal 2.25g / 3.375g tiap 12 jam). Enoxaparin kontraterapeutik.</p>
                        </div>
                      ) : parseFloat(crclResults.cgRecommended) < 30 ? (
                        <div className="text-[13px] space-y-1 text-slate-700 dark:text-slate-300">
                          <span className="text-orange-600 dark:text-orange-400 font-bold uppercase block text-[11px]">SEVERE DOSE ADJUSTMENT (CrCl 15 - 29 mL/min)</span>
                          <p><strong>Enoxaparin (Profilaksis):</strong> Dosis dikurangi menjadi 30 mg SC harian. <strong>Enoxaparin (Terapeutik):</strong> Hindari atau turunkan 50%. <strong>Meropenem:</strong> 500 mg tiap 12 jam. <strong>Piperacillin/Tazobactam:</strong> 2.25g tiap 6-8 jam.</p>
                        </div>
                      ) : parseFloat(crclResults.cgRecommended) < 50 ? (
                        <div className="text-[13px] space-y-1 text-slate-700 dark:text-slate-300">
                          <span className="text-yellow-600 dark:text-yellow-400 font-bold uppercase block text-[11px]">MODERATE DOSE ADJUSTMENT (CrCl 30 - 49 mL/min)</span>
                          <p><strong>Meropenem:</strong> Kurangi ke 1g tiap 12 jam. <strong>Ranitidine:</strong> Turunkan ke 50 mg IV tiap 12-24 jam atau 150 mg oral harian. <strong>Ciprofloxacin:</strong> Kurangi atau batasi dosis.</p>
                        </div>
                      ) : (
                        <p className="text-[13px] text-slate-700 dark:text-slate-300">Fungsi ginjal pasien normal atau sedikit menurun (CrCl &gt; 50 mL/min). Sebagian besar obat dapat diberikan dalam dosis penuh/standar. Lakukan pengawasan ketat jika pasien kritis atau memiliki risiko dehidrasi / instabilitas hemodinamik.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reference Card with Dose Chart */}
          <Accordion title="📑 Panduan Dosis Obat Ginjal ICU (KDIGO & Antimikroba)">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--separator)] bg-[var(--bg-secondary)] font-bold text-[var(--label-primary)]">
                    <th className="p-3">Nama Obat</th>
                    <th className="p-3">CrCl &gt; 50 mL/min</th>
                    <th className="p-3">CrCl 30 - 50 mL/min</th>
                    <th className="p-3">CrCl 10 - 29 mL/min</th>
                    <th className="p-3">CrCl &lt; 10 mL/min</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--separator)] text-[var(--label-secondary)]">
                  <tr className="hover:bg-[var(--fill-secondary)]/10 transition-colors">
                    <td className="p-3 font-semibold text-[var(--label-primary)]">Meropenem</td>
                    <td className="p-3">1 g tiap 8 jam</td>
                    <td className="p-3">1 g tiap 12 jam</td>
                    <td className="p-3">500 mg tiap 12 jam</td>
                    <td className="p-3">500 mg tiap 24 jam</td>
                  </tr>
                  <tr className="hover:bg-[var(--fill-secondary)]/10 transition-colors">
                    <td className="p-3 font-semibold text-[var(--label-primary)]">Pip-Tazobactam</td>
                    <td className="p-3">4.5 g tiap 6-8 jam</td>
                    <td className="p-3">3.375 g tiap 6 jam</td>
                    <td className="p-3">2.25 g tiap 6 jam</td>
                    <td className="p-3">2.25 g tiap 8 jam</td>
                  </tr>
                  <tr className="hover:bg-[var(--fill-secondary)]/10 transition-colors">
                    <td className="p-3 font-semibold text-[var(--label-primary)]">Levofloxacin</td>
                    <td className="p-3">500-750 mg harian</td>
                    <td className="p-3">Awal 500-750, lanjut 250-500 tiap 48 j</td>
                    <td className="p-3">Awal 500-750, lanjut 250 tiap 48 j</td>
                    <td className="p-3">Sesuaikan ketat / monitor</td>
                  </tr>
                  <tr className="hover:bg-[var(--fill-secondary)]/10 transition-colors">
                    <td className="p-3 font-semibold text-[var(--label-primary)]">Ranitidine</td>
                    <td className="p-3">50 mg IV tiap 8 jam</td>
                    <td className="p-3">50 mg IV tiap 12 jam</td>
                    <td className="p-3">50 mg IV tiap 18-24 jam</td>
                    <td className="p-3">50 mg IV tiap 24 jam</td>
                  </tr>
                  <tr className="hover:bg-[var(--fill-secondary)]/10 transition-colors">
                    <td className="p-3 font-semibold text-[var(--label-primary)]">Enoxaparin</td>
                    <td className="p-3">Dosis standar</td>
                    <td className="p-3">Dosis standar</td>
                    <td className="p-3">Profilaksis: 30mg SC harian</td>
                    <td className="p-3">Hindari atau pantau ketat</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Accordion>
        </div>
      )}

      {/* TAB 2: FENA & FEUREA PANEL */}
      {activeTab === 'fena_feurea' && (
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 animate-in fade-in duration-200">
              {/* Serum Row */}
              <div>
                <div className="text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">
                  <span>Spesimen Serum (Darah)</span>
                </div>
                
                <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="flex items-center justify-between px-4 py-3 gap-4">
                    <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Na Serum</span>
                    <div className="flex-1 flex items-center justify-end gap-2">
                      <input 
                        type="number" 
                        value={sna} 
                        onChange={e => setSna(e.target.value)} 
                        placeholder="cth: 138" 
                        className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
                      />
                      <span className="text-xs font-semibold text-slate-500 w-14 text-left">mEq/L</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 gap-4">
                    <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Kreatinin Serum (SCr)</span>
                    <div className="flex-1 flex items-center justify-end gap-2">
                      <input 
                        type="number" 
                        value={scr} 
                        onChange={e => setScr(e.target.value)} 
                        placeholder="cth: 2.1" 
                        step="0.01"
                        className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
                      />
                      <span className="text-xs font-semibold text-slate-500 w-14 text-left">mg/dL</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 gap-4">
                    <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 flex items-center gap-1">
                      Ureum Serum <span className="text-[9px] text-slate-500 font-normal">(opsional)</span>
                    </span>
                    <div className="flex-1 flex items-center justify-end gap-2">
                      <input 
                        type="number" 
                        value={sureum} 
                        onChange={e => setSureum(e.target.value)} 
                        placeholder="opsional" 
                        step="0.1"
                        className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
                      />
                      <span className="text-xs font-semibold text-slate-500 w-14 text-left">mg/dL</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Urine Row */}
              <div>
                <div className="text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">
                  <span>Spesimen Urin (Spot Urine)</span>
                </div>

                <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="flex items-center justify-between px-4 py-3 gap-4">
                    <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Na Urin (UNa)</span>
                    <div className="flex-1 flex items-center justify-end gap-2">
                      <input 
                        type="number" 
                        value={una} 
                        onChange={e => setUna(e.target.value)} 
                        placeholder="cth: 80" 
                        className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
                      />
                      <span className="text-xs font-semibold text-slate-500 w-14 text-left">mEq/L</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 gap-4">
                    <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Kreatinin Urin (UCr)</span>
                    <div className="flex-1 flex items-center justify-end gap-2">
                      <input 
                        type="number" 
                        value={ucr} 
                        onChange={e => setUcr(e.target.value)} 
                        placeholder="cth: 120" 
                        className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
                      />
                      <span className="text-xs font-semibold text-slate-500 w-14 text-left">mg/dL</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 gap-4">
                    <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 flex items-center gap-1">
                      Ureum Urin <span className="text-[9px] text-slate-500 font-normal">(opsional)</span>
                    </span>
                    <div className="flex-1 flex items-center justify-end gap-2">
                      <input 
                        type="number" 
                        value={uureum} 
                        onChange={e => setUureum(e.target.value)} 
                        placeholder="opsional" 
                        step="0.1"
                        className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
                      />
                      <span className="text-xs font-semibold text-slate-500 w-14 text-left">mg/dL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-4 flex gap-3 items-start mt-4 mx-4">
              <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-[13px] font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                <strong>Pemberian Diuretik:</strong> Gunakan <strong>FEUrea</strong> jika pasien telah mendapat terapi diuretik (seperti Furosemid/Lasis). Diuretik menginduksi natriuresis sehingga hasil FENa menjadi tinggi palsu, sedangkan penyerapan urea kurang terpengaruh.
              </div>
            </div>

            <div className="px-4 mt-2 mb-2">
              <button 
                className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--accent)] text-[var(--accent-fg)] font-bold rounded-2xl shadow-md cursor-pointer hover:opacity-95 transition-all text-sm active:scale-[0.99]"
                onClick={calculateFena}
              >
                Hitung FENa / FEUrea
              </button>
            </div>

          {/* RESULTS OUTPUT TAB 2 */}
          {fenaResults && (
            <div className="mt-5 animate-in fade-in duration-300 tint-renal">
              <div className="text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3 px-1">
                <span>Hasil Analisi FENa & FEUrea</span>
              </div>
              
              <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800 flex flex-col sm:flex-row mb-4">
                <div className="flex-1 p-4 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-[#2C2C2E]/30">
                  <div className="text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">FENa (Sodium)</div>
                  <div className="font-mono text-4xl font-bold" style={{ color: fenaResults.fc }}>
                    {fenaResults.fena}<span className="text-[18px] opacity-70">%</span>
                  </div>
                  <div className="text-[12px] text-slate-600 dark:text-slate-300 mt-1 font-medium">
                    {parseFloat(fenaResults.fena) < 1 ? 'Pre-renal (< 1%)' : parseFloat(fenaResults.fena) < 2 ? 'Inkonklusif (1–2%)' : 'Renal Intrinsik (> 2%)'}
                  </div>
                </div>

                {fenaResults.feurea && (
                  <div className="flex-1 p-4 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-[#2C2C2E]/30">
                    <div className="text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">FEUrea</div>
                    <div className="font-mono text-4xl font-bold" style={{ color: fenaResults.fuc }}>
                      {fenaResults.feurea}<span className="text-[18px] opacity-70">%</span>
                    </div>
                    <div className="text-[12px] text-slate-600 dark:text-slate-300 mt-1 font-medium">
                      {parseFloat(fenaResults.feurea) < 35 ? 'Pre-renal (< 35%)' : parseFloat(fenaResults.feurea) < 50 ? 'Inkonklusif' : 'Renal Intrinsik (> 50%)'}
                    </div>
                  </div>
                )}
              </div>

              {/* Commentary FENa */}
              <div className="mb-4 w-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4 flex gap-3 items-start">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
                <div className="flex-1 space-y-1">
                  <span className="text-[11px] font-black uppercase tracking-wider block text-blue-600 dark:text-blue-400 dark:text-blue-400">Analisis FENa — {fenaResults.fena}%</span>
                  <p className="text-[13px] font-medium leading-relaxed text-slate-700 dark:text-slate-300">{fenaResults.fi}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-2">Rumus FENa: (UNa &times; SCr) / (SNa &times; UCr) &times; 100%</p>
                </div>
              </div>

              {/* Commentary FEUrea */}
              {fenaResults.feurea && (
                <div className="w-full bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-4 flex gap-3 items-start">
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
                  <div className="flex-1 space-y-1">
                    <span className="text-[11px] font-black uppercase tracking-wider block text-amber-600 dark:text-amber-400 dark:text-amber-500">Analisis FEUrea — {fenaResults.feurea}%</span>
                    <p className="text-[13px] font-medium leading-relaxed text-slate-700 dark:text-slate-300">{fenaResults.fui}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-2">Rumus FEUrea: (Urin Ureum &times; SCr) / (Serum Ureum &times; UCr) &times; 100%</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Theory Accordion for Tab 2 */}
          <Accordion title="📖 Teori & Referensi: Diferensiasi AKI">
            <ul className="pl-4 space-y-2 list-disc text-[var(--label-secondary)] text-xs leading-relaxed">
              <li>
                <strong className="text-[var(--label-primary)]">Fractional Excretion of Sodium (FENa):</strong> 
                Membantu mendiferensiasi Acute Kidney Injury (AKI) pre-renal (hipovolemia, deplesi cairan) dari renal intrinsik (Acute Tubular Necrosis). 
                Pada kondisi pre-renal, perfusi ginjal menurun tetapi tubulus ginjal masih sehat dan berusaha mereabsorpsi natrium maksimal sehingga FENa &lt; 1%. 
                Jika tubulus rusak (ATN), kemampuan menahan natrium hilang sehingga FENa &gt; 2%.
              </li>
              <li>
                <strong className="text-[var(--label-primary)]">Fractional Excretion of Urea (FEUrea):</strong> 
                Diuretik menghambat reabsorpsi natrium secara langsung di loop Henle atau tubulus distal. Akibatnya, ekskresi natrium meningkat meskipun sebenarnya pasien hipovolemik (pre-renal), membuat hasil FENa &gt; 1% (tinggi palsu). 
                Reabsorpsi urea tidak terpengaruh oleh loop diuretik, sehingga FEUrea tetap rendah (&lt; 35%) jika penyebab asalnya adalah pre-renal.
              </li>
            </ul>
          </Accordion>
        </div>
      )}
    </div>
  );
}
