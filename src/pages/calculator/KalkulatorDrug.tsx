import React, { useState, useEffect, useMemo } from 'react';
import { Pill, Syringe, Clock, AlertTriangle, Info, RefreshCw, User, Activity, CheckCircle, Scale } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';

const RSI_SCENARIOS = {
  general: { label: 'Kondisi umum', ind: 'Propofol', nmb: 'Suksinilkolin / Rocuronium' },
  shock: { label: 'Syok / Instabil', ind: 'Ketamine', nmb: 'Rocuronium / Suksinilkolin' },
  icp: { label: 'TIK Meningkat', ind: 'Propofol / Etomidate', nmb: 'Rocuronium' },
  bronchospasm: { label: 'Bronkospasme', ind: 'Ketamine', nmb: 'Rocuronium' },
  hyperkalemia: { label: 'Hiperkalemia', ind: 'Propofol / Ketamine', nmb: 'Rocuronium (Sugammadex sedia)' },
};

export default function KalkulatorDrug() {
  const [panel, setPanel] = useState<'icu' | 'intubasi'>('intubasi');
  
  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();
  const hasPatientData = !!patient.weightKg || !!patient.nama;

  // Intubasi States
  const [ituBb, setItuBb] = useState('');
  const [ituScenario, setItuScenario] = useState<keyof typeof RSI_SCENARIOS>('general');
  const [ituNmb, setItuNmb] = useState('roc_rsi');
  const [ituPremed, setItuPremed] = useState('fentanyl');
  const [ituLidocaine, setItuLidocaine] = useState(false);
  
  // ICU States
  const [icuBb, setIcuBb] = useState('');
  const [icuRass, setIcuRass] = useState('light');
  const [icuPain, setIcuPain] = useState('mild');

  const [resRsi, setResRsi] = useState<any>(null);
  const [resIcu, setResIcu] = useState<any>(null);

  // Auto-load weight on mount
  useEffect(() => {
    const parentWeight = patient.weightKg || clinicalStore.data.weight || '';
    if (parentWeight) {
      setItuBb(parentWeight);
      setIcuBb(parentWeight);
    }
  }, []);

  const syncFields = useMemo(() => {
    const activeWeight = panel === 'intubasi' ? ituBb : icuBb;
    const activeSetter = panel === 'intubasi' ? setItuBb : setIcuBb;
    return [
      { key: 'weight' as const, label: 'Berat Badan', value: activeWeight, setter: activeSetter, unit: 'kg' }
    ];
  }, [panel, ituBb, icuBb]);

  const handleAutofill = (data: { weightKg: string }) => {
    if (data.weightKg) {
      setItuBb(data.weightKg);
      setIcuBb(data.weightKg);
    }
    setResRsi(null);
    setResIcu(null);
  };

  const calcRsi = () => {
    const w = parseFloat(ituBb);
    if (!w) {
      alert('Masukkan berat badan pasien yang valid');
      return;
    }

    let drugs = [];

    // Premed
    if (ituPremed === 'fentanyl') drugs.push({ n: 'Fentanyl', d: w * 2, u: 'mcg', note: '1-2 menit sebelum. Dosis 2 mcg/kg.' });
    if (ituLidocaine) drugs.push({ n: 'Lidokain', d: w * 1.5, u: 'mg', note: '3 menit sebelum (indikasi khusus ICP/Asma).' });

    // Induction
    if (ituScenario === 'shock' || ituScenario === 'bronchospasm') {
      drugs.push({ n: 'Ketamine', d: w * 1.5, u: 'mg', note: '1.5 mg/kg. Bagus untuk stabilitas hemodinamik / bronkodilator.' });
    } else if (ituScenario === 'icp') {
      drugs.push({ n: 'Propofol', d: w * 1.5, u: 'mg', note: 'Atau Etomidate 0.3 mg/kg. Membantu menurunkan TIK.' });
    } else {
      drugs.push({ n: 'Propofol 1%', d: w * 2, u: 'mg', note: '2 mg/kg. Awasi risiko efek samping hipotensi.' });
    }

    // NMB
    if (ituNmb === 'sux') {
      if (ituScenario === 'hyperkalemia') {
        drugs.push({ n: 'Rocuronium (RSI)', d: w * 1.2, u: 'mg', note: 'Alternatif Rocuronium, Suksinilkolin kontraindikasi mutlak!' });
      } else {
        drugs.push({ n: 'Suksinilkolin', d: w * 1.5, u: 'mg', note: '1.5 mg/kg. Onset sangat cepat 45 detik.' });
      }
    } else {
      drugs.push({ n: 'Rocuronium (RSI)', d: w * 1.2, u: 'mg', note: '1.2 mg/kg (Dosis RSI). Pastikan kesediaan Sugammadex jika ada.' });
    }

    setResRsi({ drugs });
  };

  const calcIcu = () => {
    const w = parseFloat(icuBb);
    if (!w) {
      alert('Masukkan berat badan pasien yang valid');
      return;
    }

    let drugs = [];

    // Analgesia First
    if (icuPain === 'mild') drugs.push({ n: 'Fentanyl Drip', v: 25, u: 'mcg/kg/jam', note: 'Dosis rendah untuk CPOT/NRS ringan.' });
    else if (icuPain === 'moderate') drugs.push({ n: 'Fentanyl Drip', v: 50, u: 'mcg/kg/jam', note: 'Dosis sedang untuk CPOT/NRS sedang.' });
    else drugs.push({ n: 'Fentanyl Drip', v: 75, u: 'mcg/kg/jam', note: 'Dosis tinggi untuk nyeri hebat.' });

    // Sedation
    if (icuRass === 'light') {
      drugs.push({ n: 'Propofol 1%', v: 5, u: 'mcg/kg/mnt', note: 'Laju awal sedasi ringan (RASS -1 s/d 0).' });
      drugs.push({ n: 'Dexmedetomidine', v: 0.3, u: 'mcg/kg/jam', note: 'Rumatan sedasi ringan tanpa depresi napas.' });
    } else if (icuRass === 'moderate') {
      drugs.push({ n: 'Propofol 1%', v: 15, u: 'mcg/kg/mnt', note: 'Laju sedang sedasi moderat (RASS -2 s/d -3).' });
      drugs.push({ n: 'Dexmedetomidine', v: 0.6, u: 'mcg/kg/jam', note: 'Dosis rumatan optimal.' });
    } else {
      drugs.push({ n: 'Propofol 1%', v: 30, u: 'mcg/kg/mnt', note: 'Sedasi dalam (RASS -4 s/d -5).' });
      drugs.push({ n: 'Midazolam', v: 0.05, u: 'mg/kg/jam', note: 'Gunakan hanya jika propofol kontraindikasi.' });
    }

    setResIcu({ drugs });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2">
        <div className="flex bg-slate-100 dark:bg-[#2C2C2E] p-1 rounded-xl w-full max-w-sm mx-auto shadow-sm">
          <button
            className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-colors ${panel === 'intubasi' ? 'bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'}`}
            aria-selected={panel === 'intubasi'}
            onClick={() => setPanel('intubasi')}
          >
            Induksi Intubasi
          </button>
          <button
            className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-colors ${panel === 'icu' ? 'bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'}`}
            aria-selected={panel === 'icu'}
            onClick={() => setPanel('icu')}
          >
            ICU Maintenance
          </button>
        </div>
      </div>

      {/* Active Patient Widget & Unified Sync Banner */}
      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />

      {/* PANEL 1: RAPID SEQUENCE INTUBATION (RSI) */}
      {panel === 'intubasi' && (
        <div className="flex flex-col gap-0 mt-2">
          <div className="px-4 mb-4">
             <div className="w-full bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-4 flex gap-3 items-start">
               <Info className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
               <div className="space-y-1">
                 <p className="text-[11px] font-black uppercase tracking-wider text-red-600 dark:text-red-400">Rekomendasi Utama Skenario</p>
                 <p className="text-[14px] font-bold text-slate-800 dark:text-slate-100">{RSI_SCENARIOS[ituScenario].label}</p>
                 <ul className="text-[13px] font-medium text-slate-700 dark:text-slate-300 list-disc pl-4 space-y-0.5">
                   <li>Induksi terpilih: <strong>{RSI_SCENARIOS[ituScenario].ind}</strong></li>
                   <li>Relaksan Neuromuskular: <strong>{RSI_SCENARIOS[ituScenario].nmb}</strong></li>
                 </ul>
               </div>
             </div>
          </div>

          <h2 className="mb-2 px-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            Parameter Skenario Intubasi
          </h2>

          <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mx-4">
            <div className="flex items-center justify-between px-4 py-3 gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Berat Badan</span>
              <div className="flex-1 flex items-center justify-end gap-2">
                <input 
                  type="number" 
                  value={ituBb} 
                  onChange={e => setItuBb(e.target.value)} 
                  placeholder="70" 
                  className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
                />
                <span className="text-xs font-semibold text-slate-500 w-10 text-left">kg</span>
              </div>
            </div>

            <div className="flex justify-between px-4 py-3 items-center gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left max-w-[120px]">Skenario Klinis</span>
              <select 
                value={ituScenario}
                onChange={e => setItuScenario(e.target.value as keyof typeof RSI_SCENARIOS)}
                className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all overflow-hidden text-ellipsis"
              >
                <option value="general">Kondisi umum / Elektif</option>
                <option value="shock">Syok / Instabilitas Hemo</option>
                <option value="icp">Trauma TIK ↑</option>
                <option value="bronchospasm">Bronkospasme / Asma</option>
                <option value="hyperkalemia">Hiperkalemia</option>
              </select>
            </div>

            <div className="flex items-center justify-between px-4 py-3 gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Pilihan NMB</span>
              <select 
                value={ituNmb}
                onChange={e => setItuNmb(e.target.value)}
                className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
              >
                <option value="roc_rsi">Rocuronium RSI (1.2)</option>
                <option value="sux">Suksinilkolin (1.5)</option>
              </select>
            </div>
            
            <label className="flex items-center justify-between px-4 py-3 gap-4 active:bg-slate-100 dark:active:bg-[#3C3C3E] cursor-pointer">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-1 pr-4">Premedikasi Fentanyl</span>
              <input 
                type="checkbox" 
                checked={ituPremed === 'fentanyl'} 
                onChange={e => setItuPremed(e.target.checked ? 'fentanyl' : 'none')} 
                className="w-5 h-5 rounded text-blue-600 dark:text-blue-400 focus:ring-blue-500 border-slate-300"
              />
            </label>

            <label className="flex items-center justify-between px-4 py-3 gap-4 active:bg-slate-100 dark:active:bg-[#3C3C3E] cursor-pointer">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-1 pr-4 max-w-[200px]">Lidokain (Profilaksis TIK/Bronkospasme)</span>
              <input 
                type="checkbox" 
                checked={ituLidocaine} 
                onChange={e => setItuLidocaine(e.target.checked)} 
                className="w-5 h-5 rounded text-blue-600 dark:text-blue-400 focus:ring-blue-500 border-slate-300"
              />
            </label>
          </div>

          <div className="px-5 mt-4 text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed text-center italic">
            * RSI memerlukan monitor EKG, SpO2, IV paten, dan perangkat intubasi cadangan.
          </div>

          <div className="px-4 mt-4">
            <button 
              onClick={calcRsi}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px] flex items-center justify-center gap-2"
            >
              <Activity className="w-5 h-5" />
              Hitung Dosis Induksi RSI
            </button>
          </div>

          {/* RESULTS FOR RSI */}
          {resRsi && (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 mt-4 px-4 pb-6">
              <h2 className="mb-2 text-[13px] font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Hasil Perhitungan Dosis RSI
              </h2>

              <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                <div className="flex items-center justify-between p-3 gap-4 bg-slate-50 dark:bg-[#2C2C2E]">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 select-none">Regimen Farmakoterapi</span>
                </div>
                {resRsi.drugs.map((d: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                      <Syringe className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 ml-3">
                      <div className="font-bold text-slate-900 dark:text-white text-[15px]">
                        {d.n}
                      </div>
                      <div className="text-[12px] text-slate-700 dark:text-slate-300 leading-snug">
                        {d.note}
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-center shrink-0 pl-2">
                      <div className="font-mono text-lg font-bold text-red-600 dark:text-red-400">
                        {Math.round(d.d)} <span className="text-xs text-slate-700 dark:text-slate-300 font-sans font-medium">{d.u}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PANEL 2: ICU MAINTENANCE (PADIS 2018) */}
      {panel === 'icu' && (
        <div className="flex flex-col gap-0 mt-2">
          <div className="px-4 mb-4">
            <div className="w-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4 flex gap-3 items-start">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 w-full">
                <p className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 dark:text-blue-400">Strategi Analgesia First (PADIS 2018)</p>
                <p className="text-[13px] font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                  Sesuai pedoman SCCM PADIS, penanganan nyeri (analgesia) harus diintervensi terlebih dahulu sebelum pemberian zat sedatif. Pasien yang nyaman membutuhkan agen sedatif jauh lebih sedikit, mempercepat penyapihan ETT.
                </p>
              </div>
            </div>
          </div>

          <h2 className="mb-2 px-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            Parameter Analgesia & Sedasi Rumatan
          </h2>

          <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mx-4">
            <div className="flex items-center justify-between px-4 py-3 gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Berat Badan</span>
              <div className="flex-1 flex items-center justify-end gap-2">
                <input 
                  type="number" 
                  value={icuBb} 
                  onChange={e => setIcuBb(e.target.value)} 
                  placeholder="70" 
                  className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
                />
                <span className="text-xs font-semibold text-slate-500 w-10 text-left">kg</span>
              </div>
            </div>

            <div className="flex justify-between px-4 py-3 items-center gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left max-w-[120px]">Target Sedasi RASS</span>
              <select 
                value={icuRass}
                onChange={e => setIcuRass(e.target.value)}
                className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all overflow-hidden text-ellipsis"
              >
                <option value="light">Sedasi Ringan (RASS -1..0)</option>
                <option value="moderate">Sedasi Sedang (RASS -2..-3)</option>
                <option value="deep">Sedasi Dalam (RASS -4..-5)</option>
              </select>
            </div>

            <div className="flex justify-between px-4 py-3 items-center gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left max-w-[120px]">Tingkat Nyeri</span>
              <select 
                value={icuPain}
                onChange={e => setIcuPain(e.target.value)}
                className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all overflow-hidden text-ellipsis"
              >
                <option value="mild">Nyeri Ringan / CPOT 0–2</option>
                <option value="moderate">Nyeri Sedang / CPOT 3–5</option>
                <option value="severe">Nyeri Berat / CPOT &gt; 5</option>
              </select>
            </div>
          </div>

          <div className="px-5 mt-4 text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed text-center italic">
            * Evaluasi target RASS dan CPOT secara berkala tiap 2-4 jam oleh perawat ruang intensif untuk melakukan titrasi laju drip obat.
          </div>

          <div className="px-4 mt-4">
            <button 
              onClick={calcIcu}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px] flex items-center justify-center gap-2"
            >
              <Activity className="w-5 h-5" />
              Hitung Laju Drip Rumatan
            </button>
          </div>

          {/* RESULTS FOR ICU MAINTENANCE */}
          {resIcu && (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 mt-4 px-4 pb-6">
              <h2 className="mb-2 text-[13px] font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Hasil Kalkulasi Laju Titrasi
              </h2>

              <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                <div className="flex items-center justify-between p-3 gap-4 bg-slate-50 dark:bg-[#2C2C2E]">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 select-none">Regimen Titrasi Rumatan</span>
                </div>
                {resIcu.drugs.map((d: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                      <Pill className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 ml-3">
                      <div className="font-bold text-slate-900 dark:text-white text-[15px]">
                        {d.n}
                      </div>
                      <div className="text-[12px] text-slate-700 dark:text-slate-300 leading-snug">
                        {d.note}
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-center shrink-0 pl-2">
                      <div className="font-mono text-base font-bold text-blue-600 dark:text-blue-400 dark:text-blue-400 leading-snug">
                        {d.v} <span className="text-[10px] text-slate-700 dark:text-slate-300 block font-sans font-medium">{d.u}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Accordion Theory */}
      <Accordion title="📖 Teori & Referensi: Dosis Sedasi & Intubasi Cepat (RSI)">
        <ul className="pl-4 space-y-2 list-disc text-muted-foreground text-xs leading-relaxed">
          <li>
            <strong className="text-foreground">Rapid Sequence Intubation (RSI):</strong> Induksi dan relaksasi farmakologis simultan untuk mengamankan jalan napas dengan aman menghindari risiko aspirasi. Pre-medikasi (opsional spt Fentanyl/Lidocain), Induksi (Propofol/Ketamine/Etomidate), dan Paralisis (Rocuronium/Suksinilkolin).
          </li>
          <li>
            <strong className="text-foreground">Sedasi ICU Berbasis Analgesia:</strong> Panduan SCCM PADIS menyarankan strategi <em>analgesia-first</em> (sedasi berbasis analgetik seperti fentanyl infusi).
          </li>
          <li>
            <strong className="text-foreground">Dosis Penyesuaian Berat Badan:</strong> Pada pasien obesitas, Suksinilkolin menggunakan TBW (Total Body Weight) karena distribusinya yang unik, sedangkan agen relaksan otot non-depolarisasi seperti Rocuronium seringkali didekati lewat berat badan ideal (IBW) untuk menghindari blok lama.
          </li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 SCCM PADIS Guidelines (2018); Walls RM, Murphy MF (2012). Manual of Emergency Airway Management.
        </div>
      </Accordion>
    </div>
  );
}
