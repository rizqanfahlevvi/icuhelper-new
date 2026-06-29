import React, { useState, useEffect, useMemo } from 'react';
import { Pill, Syringe, Clock, AlertTriangle, Info, RefreshCw, User, Activity, CheckCircle, Scale } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { SaveToHistoryButton } from '../../components/ui/SaveToHistoryButton';
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

    // Premed & Analgesik
    if (ituPremed === 'fentanyl') drugs.push({ cat: 'Premedikasi & Analgesik', n: 'Fentanyl', d: w * 2, u: 'mcg', note: '1-3 menit sebelum induksi (Dosis 2 mcg/kg).' });
    if (ituLidocaine) drugs.push({ cat: 'Premedikasi & Analgesik', n: 'Lidokain', d: w * 1.5, u: 'mg', note: '3 menit sebelum induksi (indikasi khusus ICP/Asma, 1.5 mg/kg).' });

    // Induksi / Sedasi
    if (ituScenario === 'shock' || ituScenario === 'bronchospasm') {
      drugs.push({ cat: 'Induksi / Sedasi', n: 'Ketamine', d: w * 1.5, u: 'mg', note: '1.5 mg/kg. Bagus untuk stabilitas hemodinamik / bronkodilator.' });
    } else if (ituScenario === 'icp') {
      drugs.push({ cat: 'Induksi / Sedasi', n: 'Propofol', d: w * 1.5, u: 'mg', note: '1.5 mg/kg. Membantu menurunkan TIK.' });
      drugs.push({ cat: 'Induksi / Sedasi', n: 'Etomidate', d: w * 0.3, u: 'mg', note: 'Alternatif (0.3 mg/kg). Stabil hemo, turunkan TIK.' });
    } else {
      drugs.push({ cat: 'Induksi / Sedasi', n: 'Propofol 1%', d: w * 2, u: 'mg', note: '2 mg/kg. Awasi risiko efek samping hipotensi.' });
      drugs.push({ cat: 'Induksi / Sedasi', n: 'Ketamine', d: w * 1.5, u: 'mg', note: 'Alternatif (1.5 mg/kg). Stabil hemodinamik / analgesik kuat.' });
      drugs.push({ cat: 'Induksi / Sedasi', n: 'Midazolam', d: w * 0.2, u: 'mg', note: 'Alternatif (0.2 mg/kg). Awasi hipotensi.' });
    }

    // NMB (Pelumpuh Otot)
    if (ituNmb === 'sux') {
      if (ituScenario === 'hyperkalemia') {
        drugs.push({ cat: 'Pelumpuh Otot (NMB)', n: 'Rocuronium (RSI)', d: w * 1.2, u: 'mg', note: 'Alternatif Rocuronium, Suksinilkolin kontraindikasi mutlak!' });
      } else {
        drugs.push({ cat: 'Pelumpuh Otot (NMB)', n: 'Suksinilkolin', d: w * 1.5, u: 'mg', note: '1.5 mg/kg. Onset sangat cepat 45 detik.' });
      }
    } else if (ituNmb === 'atracurium') {
      drugs.push({ cat: 'Pelumpuh Otot (NMB)', n: 'Atracurium', d: w * 0.5, u: 'mg', note: '0.5 mg/kg. Onset lambat (3-5 mnt), bukan untuk RSI ideal. Aman untuk gagal ginjal/hati.' });
    } else {
      drugs.push({ cat: 'Pelumpuh Otot (NMB)', n: 'Rocuronium (RSI)', d: w * 1.2, u: 'mg', note: '1.2 mg/kg (Dosis RSI). Pastikan kesediaan Sugammadex jika ada.' });
    }

    // Obat Emergensi
    drugs.push({ cat: 'Obat Emergensi & Resusitasi', n: 'Epinefrin Push', d: 10, u: 'mcg', note: 'Untuk syok paska intubasi (10-20 mcg IV push tiap 1-2 mnt).' });
    drugs.push({ cat: 'Obat Emergensi & Resusitasi', n: 'Efedrin', d: 5, u: 'mg', note: 'Untuk hipotensi dengan bradikardia (5-10 mg IV push).' });
    drugs.push({ cat: 'Obat Emergensi & Resusitasi', n: 'Atropin', d: 0.5, u: 'mg', note: 'Untuk bradikardia simptomatik (0.5 mg IV push tiap 3-5 mnt).' });

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
    if (icuPain === 'mild') {
      drugs.push({ cat: 'Analgesia (Nyeri)', n: 'Fentanyl Drip', v: 25, u: 'mcg/kg/jam', note: 'Dosis rendah untuk CPOT/NRS ringan.' });
    } else if (icuPain === 'moderate') {
      drugs.push({ cat: 'Analgesia (Nyeri)', n: 'Fentanyl Drip', v: 50, u: 'mcg/kg/jam', note: 'Dosis sedang untuk CPOT/NRS sedang.' });
    } else {
      drugs.push({ cat: 'Analgesia (Nyeri)', n: 'Fentanyl Drip', v: 75, u: 'mcg/kg/jam', note: 'Dosis tinggi untuk nyeri hebat.' });
      drugs.push({ cat: 'Analgesia (Nyeri)', n: 'Ketamine Drip', v: 0.1, u: 'mg/kg/jam', note: 'Adjuvan (0.1-0.2 mg/kg/jam) nyeri refrakter opioid.' });
    }

    // Sedation
    if (icuRass === 'light') {
      drugs.push({ cat: 'Sedasi (Target RASS)', n: 'Propofol 1%', v: 5, u: 'mcg/kg/mnt', note: 'Laju awal sedasi ringan (RASS -1 s/d 0).' });
      drugs.push({ cat: 'Sedasi (Target RASS)', n: 'Dexmedetomidine', v: 0.3, u: 'mcg/kg/jam', note: 'Rumatan sedasi ringan tanpa depresi napas.' });
    } else if (icuRass === 'moderate') {
      drugs.push({ cat: 'Sedasi (Target RASS)', n: 'Propofol 1%', v: 15, u: 'mcg/kg/mnt', note: 'Laju sedang sedasi moderat (RASS -2 s/d -3).' });
      drugs.push({ cat: 'Sedasi (Target RASS)', n: 'Dexmedetomidine', v: 0.6, u: 'mcg/kg/jam', note: 'Dosis rumatan optimal.' });
    } else {
      drugs.push({ cat: 'Sedasi (Target RASS)', n: 'Propofol 1%', v: 30, u: 'mcg/kg/mnt', note: 'Sedasi dalam (RASS -4 s/d -5).' });
      drugs.push({ cat: 'Sedasi (Target RASS)', n: 'Midazolam', v: 0.05, u: 'mg/kg/jam', note: 'Gunakan hanya jika propofol kontraindikasi.' });
      drugs.push({ cat: 'Pelumpuh Otot (Bila Perlu)', n: 'Atracurium Drip', v: 0.3, u: 'mg/kg/jam', note: 'Untuk paralisis dalam (ARDS/Asinkroni vent), 0.3-0.6 mg/kg/jam.' });
    }

    setResIcu({ drugs });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-x-hidden">
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
          <div className="mb-4">
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

          <h2 className="mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            Parameter Skenario Intubasi
          </h2>

          <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
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
                <option value="atracurium">Atracurium (0.5)</option>
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

          <div className="mt-4">
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
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 mt-4 pb-6">
              <h2 className="mb-2 text-[13px] font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Hasil Perhitungan Dosis RSI
              </h2>

              <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                <div className="flex items-center justify-between p-3 gap-4 bg-slate-50 dark:bg-[#2C2C2E]">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 select-none">Regimen Farmakoterapi</span>
                </div>
                {resRsi.drugs.map((d: any, i: number) => {
                  const showCat = i === 0 || resRsi.drugs[i - 1].cat !== d.cat;
                  return (
                    <React.Fragment key={i}>
                      {showCat && d.cat && (
                        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          {d.cat}
                        </div>
                      )}
                      <div className="flex items-center justify-between p-4 gap-4">
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
                    </React.Fragment>
                  );
                })}
                
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#2C2C2E]">
                  <SaveToHistoryButton 
                    module="drug_rsi" 
                    label={`Intubasi RSI — BB ${ituBb} kg`}
                    inputs={{ bb: ituBb, scenario: ituScenario, nmb: ituNmb, premed: ituPremed, lidocaine: ituLidocaine }}
                    summary={`RSI ${ituScenario} - Induksi: ${resRsi.drugs.map((d: any) => `${d.n} ${Math.round(d.d)}${d.u}`).join(', ')}`}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PANEL 2: ICU MAINTENANCE (PADIS 2018) */}
      {panel === 'icu' && (
        <div className="flex flex-col gap-0 mt-2">
          <div className="mb-4">
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

          <h2 className="mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            Parameter Analgesia & Sedasi Rumatan
          </h2>

          <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
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

          <div className="mt-4">
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
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 mt-4 pb-6">
              <h2 className="mb-2 text-[13px] font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Hasil Kalkulasi Laju Titrasi
              </h2>

              <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                <div className="flex items-center justify-between p-3 gap-4 bg-slate-50 dark:bg-[#2C2C2E]">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 select-none">Regimen Titrasi Rumatan</span>
                </div>
                {resIcu.drugs.map((d: any, i: number) => {
                  const showCat = i === 0 || resIcu.drugs[i - 1].cat !== d.cat;
                  return (
                    <React.Fragment key={i}>
                      {showCat && d.cat && (
                        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          {d.cat}
                        </div>
                      )}
                      <div className="flex items-center justify-between p-4 gap-4">
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
                    </React.Fragment>
                  );
                })}
                
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#2C2C2E]">
                  <SaveToHistoryButton 
                    module="drug_icu" 
                    label={`Sedasi ICU — BB ${icuBb} kg`}
                    inputs={{ bb: icuBb, pain: icuPain, rass: icuRass }}
                    summary={`Target RASS: ${icuRass}, Nyeri: ${icuPain}`}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Accordion Theory */}
      <Accordion title="📖 Strategi Sedasi & Analgesia ICU — PADIS Guidelines 2018">
        <div className="mb-2 font-semibold text-slate-800 dark:text-slate-200 text-[13px]">Prinsip eCASH</div>
        <ul className="pl-4 space-y-2 mb-4 list-disc text-slate-600 dark:text-slate-400 text-[13px] leading-relaxed">
          <li><strong>eCASH:</strong> early Comfort using Analgesia, minimal Sedatives, and maximal Humane care — target sedasi ringan (RASS -1 sd 0) lebih baik dari deep sedation.</li>
          <li><strong>Analgesia first:</strong> Fentanyl/morphin sebelum sedatif. CPOT untuk pasien tidak dapat komunikasi.</li>
          <li><strong>Hindari benzodiazepin:</strong> Midazolam/lorazepam dihubungkan dengan delirium, weaning sulit, ICU-acquired weakness. Gunakan propofol atau dexmedetomidine.</li>
          <li><strong>Dexmedetomidine:</strong> Alpha-2 agonist — sedasi tanpa depresi napas, menurunkan kejadian delirium. Hindari pada bradikardia/blok jantung.</li>
          <li><strong>Daily SAT:</strong> Hentikan sedasi setiap pagi → nilai kesadaran → mulai SBT jika memenuhi syarat (ABC protocol: SAT + SBT).</li>
        </ul>
      </Accordion>

      <Accordion title="📖 Algoritma RSI — 7 Langkah, Variasi & Indikasi Khusus">
        <div className="mb-2 font-semibold text-slate-800 dark:text-slate-200 text-[13px]">7 Langkah RSI (7P)</div>
        <ul className="pl-4 space-y-2 mb-4 list-disc text-slate-600 dark:text-slate-400 text-[13px] leading-relaxed">
          <li><strong>1. Preparation:</strong> Siapkan alat & obat. Laryngoscope, ETT (7.0–8.0), stylet, BVM, suction, monitor EKG, SpO2, ETCO2. Akses IV paten.</li>
          <li><strong>2. Pre-oxygenation:</strong> NRM 15 L/mnt minimal 3 mnt ATAU 8 napas vital capacity. Posisi head-up 20–30°. Target SpO2 &gt;95%.</li>
          <li><strong>3. Pre-medication:</strong> T minus 3 mnt. Fentanyl (blunting hemodynamic spike). Lidokain (opsional, ↑TIK). Atropin jika indikasi.</li>
          <li><strong>4. Paralysis + Induction:</strong> T-0: simultan. Agen induksi IV push → NMB IV push segera setelahnya. Tidak ada ventilasi bag-mask antara keduanya (RSI klasik).</li>
          <li><strong>5. Protection:</strong> Sellick manuver. Tekanan krikoid. (Kontroversial, banyak guideline tidak lagi merekomendasikan rutin).</li>
          <li><strong>6. Placement:</strong> Laringoskopi & intubasi. Konfirmasi dengan ETCO2 waveform.</li>
          <li><strong>7. Post-intubation care:</strong> Mulai sedasi/analgesia IV. Ventilasi protektif (VT 6 mL/kg IBW). Cek posisi ETT dengan CXR. Pasang NGT.</li>
        </ul>
      </Accordion>

      <Accordion title="📖 Suksinilkolin vs Rocuronium untuk RSI">
        <div className="mb-2 font-semibold text-slate-800 dark:text-slate-200 text-[13px]">Perbandingan Klinis & Rekomendasi</div>
        <ul className="pl-4 space-y-2 mb-4 list-disc text-slate-600 dark:text-slate-400 text-[13px] leading-relaxed">
          <li><strong>Suksinilkolin:</strong> Onset 45-60 dtk. Durasi 8-12 menit. Reversal spontan. Kontraindikasi: hiperkalemia, luka bakar &gt;24 jam, crush injury &gt;72 jam, imobilisasi berkepanjangan, miopati, MH.</li>
          <li><strong>Rocuronium:</strong> Dosis RSI (1.2 mg/kg) onset 60-75 dtk. Durasi 60-90 menit. Reversal menggunakan Sugammadex (16 mg/kg). Aman untuk hiperkalemia dan MH.</li>
          <li><strong>Rekomendasi Cochrane 2022:</strong> Rocuronium 1.2 mg/kg non-inferior to succinylcholine untuk intubation conditions jika Sugammadex tersedia.</li>
          <li><strong>Sugammadex Rescue:</strong> Skenario "Can't Intubate, Can't Oxygenate" (CICO): Jika rocuronium RSI baru diberikan dan intubasi gagal → Sugammadex 16 mg/kg IV segera → blokade terangkat dalam ~3 mnt.</li>
        </ul>
      </Accordion>

      <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic text-center">
        📚 <strong>Referensi Utama:</strong>
        <br />SCCM PADIS Guidelines (2018)
        <br />Sorensen MK et al. Cochrane Database Syst Rev (2022)
        <br />STRIVE Hi Trial, Anaesthesia (2021)
      </div>
    </div>
  );
}
