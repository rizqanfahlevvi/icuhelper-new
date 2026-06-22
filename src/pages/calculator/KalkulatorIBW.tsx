import { useState, useEffect, useMemo } from 'react';
import { useHistoryStore } from '../../store/useHistoryStore';
import { Accordion } from '../../components/ui/Accordion';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';

export default function KalkulatorIBW() {
  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();

  const [sex, setSex] = useState<'m' | 'f'>('m');
  const [height, setHeight] = useState<string>('');
  const [actualBW, setActualBW] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [condition, setCondition] = useState<string>('normal');
  const [hb, setHb] = useState<string>('');
  
  const [results, setResults] = useState<any>(null);
  const addHistory = useHistoryStore((state) => state.addEntry);

  // Auto-load on mount
  useEffect(() => {
    const parentWeight = patient.weightKg || clinicalStore.data.weight || '';
    if (parentWeight) setActualBW(parentWeight);

    const parentHeight = patient.heightCm || clinicalStore.data.height || '';
    if (parentHeight) setHeight(parentHeight);

    const parentAge = patient.ageYears || clinicalStore.data.age || '';
    if (parentAge) setAge(parentAge);

    const parentGender = patient.gender || clinicalStore.data.gender || '';
    if (parentGender) {
      setSex(parentGender.toLowerCase() === 'p' ? 'f' : 'm');
    }

    if (clinicalStore.data.hb) setHb(clinicalStore.data.hb);
  }, []);

  const syncFields = useMemo(() => [
    { key: 'weight' as const, label: 'Berat Badan', value: actualBW, setter: setActualBW, unit: 'kg' },
    { key: 'height' as const, label: 'Tinggi Badan', value: height, setter: setHeight, unit: 'cm' },
    { key: 'age' as const, label: 'Usia', value: age, setter: setAge, unit: 'tahun' },
    { key: 'hb' as const, label: 'HB', value: hb, setter: setHb, unit: 'g/dL' },
  ], [actualBW, height, age, hb]);

  const handleAutofill = (data: { weightKg: string; heightCm?: string; age?: string; gender?: string }) => {
    if (data.weightKg) setActualBW(data.weightKg);
    if (data.heightCm) setHeight(data.heightCm);
    if (data.age) setAge(data.age);
    if (data.gender) {
      setSex(data.gender.toLowerCase() === 'p' ? 'f' : 'm');
    }
    if (clinicalStore.data.hb) setHb(clinicalStore.data.hb);

    setResults(null);
  };


  const calculate = () => {
    const h = parseFloat(height);
    const aBW = parseFloat(actualBW);
    const ageNum = parseFloat(age);
    const hbVal = parseFloat(hb);

    if (!h || isNaN(h)) {
      alert('Masukkan tinggi badan');
      return;
    }

    const ibw = sex === 'm' ? 50 + 0.91 * (h - 152.4) : 45.5 + 0.91 * (h - 152.4);
    const ibwR = Math.max(ibw, 30);

    let vtLow, vtHigh, vtNote;
    if (condition === 'ards') {
      vtLow = 4; vtHigh = 6; vtNote = 'Lung-protective ARDS — ARDSNet Protocol';
    } else if (condition === 'copd') {
      vtLow = 6; vtHigh = 8; vtNote = 'PPOK — permissive hypercapnia; ekspirasi panjang';
    } else if (condition === 'asthma') {
      vtLow = 6; vtHigh = 8; vtNote = 'Asma — controlled hypoventilation; Pplat <30';
    } else if (condition === 'neuro') {
      vtLow = 10; vtHigh = 12; vtNote = 'NMD — paru normal, butuh VT lebih besar';
    } else {
      vtLow = 6; vtHigh = 8; vtNote = 'Ventilasi standar';
    }

    const vtLowML = (vtLow * ibwR).toFixed(0);
    const vtHighML = (vtHigh * ibwR).toFixed(0);
    const mv = (ibwR * vtLow * 0.001 * 16).toFixed(1);

    let adjBW = null;
    let bmiValue = null;
    if (aBW && !isNaN(aBW)) {
      bmiValue = aBW / ((h / 100) * (h / 100));
      if (bmiValue > 30 && aBW > ibwR) {
        adjBW = ibwR + 0.4 * (aBW - ibwR);
      }
    }

    let extraParams: any = null;
    if (aBW && !isNaN(aBW)) {
      const bsa = Math.sqrt((h * aBW) / 3600);
      const lbw = sex === 'm' 
        ? (9270 * aBW) / (6680 + 216 * bmiValue!) 
        : (9270 * aBW) / (8780 + 244 * bmiValue!);
      const ebv = aBW * (sex === 'm' ? 70 : 65);
      
      let bmiLabel = '', bmiColor = '';
      if (bmiValue! < 18.5) { bmiLabel = 'Underweight'; bmiColor = 'var(--blue)'; }
      else if (bmiValue! < 25) { bmiLabel = 'Normal'; bmiColor = 'var(--green)'; }
      else if (bmiValue! < 30) { bmiLabel = 'Overweight'; bmiColor = 'var(--amber)'; }
      else if (bmiValue! < 35) { bmiLabel = 'Obesitas I'; bmiColor = 'var(--red)'; }
      else if (bmiValue! < 40) { bmiLabel = 'Obesitas II'; bmiColor = 'var(--red)'; }
      else { bmiLabel = 'Obesitas III'; bmiColor = 'var(--red)'; }

      let ree = null, calMin = null, calMax = null, protMin = null, protMax = null;
      if (ageNum && !isNaN(ageNum)) {
        ree = sex === 'm' 
          ? 88.4 + 13.4 * aBW + 4.8 * h - 5.68 * ageNum 
          : 447.6 + 9.25 * aBW + 3.1 * h - 4.33 * ageNum;
        calMin = Math.round(25 * aBW);
        calMax = Math.round(30 * aBW);
        protMin = (1.2 * aBW).toFixed(0);
        protMax = (2.0 * aBW).toFixed(0);
      }

      let mabl = null, mablKolf = null, mablWarn = null;
      if (hbVal && !isNaN(hbVal)) {
        const hbMin = 7;
        mabl = ebv * (hbVal - hbMin) / hbVal;
        mablKolf = Math.ceil(Math.max(0, (hbMin - hbVal) * aBW * 4) / 250);
        mablWarn = hbVal <= hbMin;
      }

      extraParams = {
        bmi: bmiValue!.toFixed(1), bmiLabel, bmiColor,
        bsa: bsa.toFixed(2), lbw: lbw.toFixed(1), ebv: (ebv / 1000).toFixed(2),
        ree: ree ? Math.round(ree) : null, calMin, calMax, protMin, protMax,
        mabl: mabl ? Math.max(0, mabl).toFixed(0) : null, mablKolf, mablWarn
      };
    }

    setResults({
      ibwR, vtLow, vtHigh, vtLowML, vtHighML, vtNote, mv,
      aBW, adjBW, bmiValue, extraParams
    });

    addHistory(
      'ibw',
      `IBW ${ibwR.toFixed(1)} kg`,
      { sex, height, actualBW, age, condition, hb },
      `IBW ${ibwR.toFixed(1)} kg · VT ${vtLowML}–${vtHighML} mL (${vtLow}–${vtHigh} mL/kg) — ${vtNote}`
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Active Patient & Sync Banner */}
      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />

      <div className="flex flex-col gap-0 mt-2">
         <h2 className="mb-2 px-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
           Kalkulator IBW & Parameter Awal
         </h2>

         <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mx-4">
            <div className="flex justify-between px-4 py-3 items-center gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left w-32">Jenis Kelamin</span>
              <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={sex} onChange={e=>setSex(e.target.value as 'm'|'f')}>
                <option value="m">Laki-laki</option>
                <option value="f">Perempuan</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between px-4 py-3 gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Tinggi Badan</span>
              <div className="flex-1 flex items-center justify-end gap-2">
                <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={height} onChange={e=>setHeight(e.target.value)} placeholder="165" />
                <span className="text-xs font-semibold text-slate-500 w-6 text-left">cm</span>
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-3 gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Berat Aktual</span>
              <div className="flex-1 flex items-center justify-end gap-2">
                <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={actualBW} onChange={e=>setActualBW(e.target.value)} placeholder="70" />
                <span className="text-xs font-semibold text-slate-500 w-6 text-left">kg</span>
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-3 gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Usia</span>
              <div className="flex-1 flex items-center justify-end gap-2">
                <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={age} onChange={e=>setAge(e.target.value)} placeholder="45" />
                <span className="text-xs font-semibold text-slate-500 w-6 text-left">th</span>
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-3 gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Hb Aktual (Opsi)</span>
              <div className="flex-1 flex items-center justify-end gap-2">
                <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={hb} onChange={e=>setHb(e.target.value)} placeholder="—" />
                <span className="text-xs font-semibold text-slate-500 w-8 text-left">g/dL</span>
              </div>
            </div>

            <div className="flex justify-between px-4 py-3 items-center gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left w-32">Kondisi Klinis</span>
              <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={condition} onChange={e=>setCondition(e.target.value)}>
                <option value="normal">Umum / Post-op</option>
                <option value="ards">ARDS</option>
                <option value="copd">PPOK</option>
                <option value="asthma">Asma Berat</option>
                <option value="neuro">Neuromuskular</option>
              </select>
            </div>
         </div>

         <div className="px-4 mt-3">
            <div className="p-3 bg-slate-50 dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed italic">
              <strong>Formula Devine (IBW):</strong> <br/>
              L: 50 + 0.91 × (TB − 152.4) <br/>
              P: 45.5 + 0.91 × (TB − 152.4)
            </div>
         </div>
      </div>
      
      <div className="px-4 mt-4">
        <button onClick={calculate} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px]">
          Hitung IBW & Parameter
        </button>
      </div>

        {results && (
          <div className="px-4 animate-in fade-in slide-in-from-bottom-2 duration-300 mt-6">
            <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/20">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-white dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 p-3 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">IBW</div>
                  <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200">{results.ibwR.toFixed(1)} <span className="text-[11px] font-sans">kg</span></div>
                  <div className="text-[11px] text-slate-500 mt-1">Devine formula — dasar VT</div>
                </div>
                <div className="bg-white dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 p-3 rounded-xl">
                  <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">VT Rendah</div>
                  <div className="text-xl font-bold font-mono text-indigo-700 dark:text-indigo-300">{results.vtLowML} <span className="text-[11px] font-sans">mL</span></div>
                  <div className="text-[11px] text-slate-500 mt-1">{results.vtLow} mL/kg (Target awal)</div>
                </div>
                <div className="bg-white dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 p-3 rounded-xl">
                  <div className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">VT Tinggi</div>
                  <div className="text-xl font-bold font-mono text-teal-700 dark:text-teal-300">{results.vtHighML} <span className="text-[11px] font-sans">mL</span></div>
                  <div className="text-[11px] text-slate-500 mt-1">{results.vtHigh} mL/kg (Batas atas)</div>
                </div>
                <div className="bg-white dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 p-3 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">MV Estimasi</div>
                  <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200">{results.mv} <span className="text-[11px] font-sans">L/mnt</span></div>
                  <div className="text-[11px] text-slate-500 mt-1">RR 16, VT rendah</div>
                </div>
                
                {results.aBW && !isNaN(results.aBW) && (
                  <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 p-3 rounded-xl col-span-2">
                    <div className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">VT Jika Pakai Actual BW</div>
                    <div className="text-xl font-bold font-mono text-red-700 dark:text-red-300">{(results.vtLow * results.aBW).toFixed(0)} <span className="text-[11px] font-sans">mL</span></div>
                    <div className="text-[11px] text-red-600/80 dark:text-red-400 mt-1">↑{(((results.aBW - results.ibwR) / results.ibwR) * 100).toFixed(0)}% vs IBW — bahaya overdistensi alveolar</div>
                  </div>
                )}
                {results.adjBW !== null && (
                  <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 p-3 rounded-xl col-span-2">
                    <div className="text-[11px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-1">Adjusted BW (Obesitas)</div>
                    <div className="text-xl font-bold font-mono text-amber-700 dark:text-amber-400">{results.adjBW.toFixed(1)} <span className="text-[11px] font-sans">kg</span></div>
                    <div className="text-[11px] text-amber-600/80 dark:text-amber-400 mt-1">IBW + 0.4×(ABW−IBW) · utk dosis obat</div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
              <div className="text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">Rekomendasi Setting Awal — {condition.toUpperCase()}</div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px] whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-[#2C2C2E] border-y border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 uppercase text-[11px] tracking-wider font-semibold">
                    <tr><th className="px-4 py-2">Parameter</th><th className="px-4 py-2">Nilai</th><th className="px-4 py-2">Keterangan</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-slate-700 dark:text-slate-300">
                    {condition === 'ards' && (
                      <>
                        <tr><td className="px-4 py-2.5 font-medium">Mode</td><td className="px-4 py-2.5">VC-AC</td><td className="px-4 py-2.5 text-slate-500">Kontrol VT ketat</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">VT</td><td className="px-4 py-2.5 font-mono">{results.vtLowML}–{results.vtHighML} mL</td><td className="px-4 py-2.5 text-slate-500">{results.vtLow}–{results.vtHigh} mL/kg IBW</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">RR</td><td className="px-4 py-2.5 font-mono">16–22 bpm</td><td className="px-4 py-2.5 text-slate-500">Sesuai kebutuhan; naikkan jika pH drop</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">PEEP</td><td className="px-4 py-2.5 font-mono">8–13 cmH₂O</td><td className="px-4 py-2.5 text-slate-500">Titrasi FiO₂/PEEP table ARDSNet</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">Pplat target</td><td className="px-4 py-2.5 font-mono">&lt;30 cmH₂O</td><td className="px-4 py-2.5 text-slate-500">Lakukan inspiratory hold 0.5 det</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">Driving pressure</td><td className="px-4 py-2.5 font-mono">≤15 cmH₂O</td><td className="px-4 py-2.5 text-slate-500">Pplat − PEEP; target ≤13 ideal</td></tr>
                      </>
                    )}
                    {condition === 'copd' && (
                      <>
                        <tr><td className="px-4 py-2.5 font-medium">Mode</td><td className="px-4 py-2.5">VC-AC</td><td className="px-4 py-2.5 text-slate-500">Flow tinggi 60–80 L/mnt</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">VT</td><td className="px-4 py-2.5 font-mono">{results.vtLowML}–{results.vtHighML} mL</td><td className="px-4 py-2.5 text-slate-500">{results.vtLow}–{results.vtHigh} mL/kg IBW</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">RR</td><td className="px-4 py-2.5 font-mono">10–14 bpm</td><td className="px-4 py-2.5 text-slate-500">Rendah — ekspirasi panjang</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">I:E ratio</td><td className="px-4 py-2.5 font-mono">1:3 sampai 1:5</td><td className="px-4 py-2.5 text-slate-500">Cegah auto-PEEP</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">PEEP</td><td className="px-4 py-2.5 font-mono">5–8 cmH₂O</td><td className="px-4 py-2.5 text-slate-500">75–85% auto-PEEP terukur</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">PaCO₂ target</td><td className="px-4 py-2.5 font-mono">Baseline pasien</td><td className="px-4 py-2.5 text-slate-500">Koreksi bertahap</td></tr>
                      </>
                    )}
                    {condition === 'asthma' && (
                      <>
                        <tr><td className="px-4 py-2.5 font-medium">Mode</td><td className="px-4 py-2.5">VC-AC</td><td className="px-4 py-2.5 text-slate-500">Kontrol VT; PC tidak ideal</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">VT</td><td className="px-4 py-2.5 font-mono">{results.vtLowML}–{results.vtHighML} mL</td><td className="px-4 py-2.5 text-slate-500">{results.vtLow}–{results.vtHigh} mL/kg IBW</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">RR</td><td className="px-4 py-2.5 font-mono">8–12 bpm</td><td className="px-4 py-2.5 text-slate-500">SANGAT LAMBAT</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">I:E ratio</td><td className="px-4 py-2.5 font-mono">1:4 sampai 1:5</td><td className="px-4 py-2.5 text-slate-500">Ekspirasi panjang wajib</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">PEEP</td><td className="px-4 py-2.5 font-mono">0–5 cmH₂O</td><td className="px-4 py-2.5 text-slate-500">Rendah — auto-PEEP sudah ada</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">PaCO₂ target</td><td className="px-4 py-2.5 font-mono">45–70 mmHg</td><td className="px-4 py-2.5 text-slate-500">Permissive hypercapnia</td></tr>
                      </>
                    )}
                    {condition === 'neuro' && (
                      <>
                        <tr><td className="px-4 py-2.5 font-medium">Mode</td><td className="px-4 py-2.5">VC-AC atau SIMV+PSV</td><td className="px-4 py-2.5 text-slate-500">Preserve spontaneous effort</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">VT</td><td className="px-4 py-2.5 font-mono">{results.vtLowML}–{results.vtHighML} mL</td><td className="px-4 py-2.5 text-slate-500">{results.vtLow}–{results.vtHigh} mL/kg IBW</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">RR</td><td className="px-4 py-2.5 font-mono">12–16 bpm</td><td className="px-4 py-2.5 text-slate-500">Backup; spontan diutamakan</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">PEEP</td><td className="px-4 py-2.5 font-mono">5 cmH₂O</td><td className="px-4 py-2.5 text-slate-500">Standar</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">Monitor</td><td className="px-4 py-2.5 font-mono">VC serial tiap 4–6 jam</td><td className="px-4 py-2.5 text-slate-500">Target VC &gt;20 mL/kg sebelum ekstubasi</td></tr>
                      </>
                    )}
                    {condition === 'normal' && (
                      <>
                        <tr><td className="px-4 py-2.5 font-medium">Mode</td><td className="px-4 py-2.5">VC-AC atau PC-AC</td><td className="px-4 py-2.5 text-slate-500">Sesuai kondisi</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">VT</td><td className="px-4 py-2.5 font-mono">{results.vtLowML}–{results.vtHighML} mL</td><td className="px-4 py-2.5 text-slate-500">{results.vtLow}–{results.vtHigh} mL/kg IBW</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">RR</td><td className="px-4 py-2.5 font-mono">12–18 bpm</td><td className="px-4 py-2.5 text-slate-500">Sesuai target ventilasi</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">PEEP</td><td className="px-4 py-2.5 font-mono">5–8 cmH₂O</td><td className="px-4 py-2.5 text-slate-500">Cegah atelektasis</td></tr>
                        <tr><td className="px-4 py-2.5 font-medium">FiO₂</td><td className="px-4 py-2.5 font-mono">1.0 → titrasi</td><td className="px-4 py-2.5 text-slate-500">Target SpO₂ 94–98%</td></tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Catatan:</span> {results.vtNote} &middot; IBW = {results.ibwR.toFixed(1)} kg ({sex === 'm' ? 'Laki-laki' : 'Perempuan'}, TB {height} cm)
              </div>
            </div>

            {results.adjBW !== null && (
              <div className="p-4 mx-4 mb-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl">
                <div className="text-[12px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-wide mb-2">⚠ BMI {results.bmiValue.toFixed(1)} — Obesitas</div>
                <div className="text-[13px] text-amber-900 dark:text-amber-400 font-mono mb-3">AdjBW = IBW + 0.4 × (ABW − IBW) = {results.adjBW.toFixed(1)} kg</div>
                <div className="overflow-x-auto bg-white/50 dark:bg-black/20 rounded-xl border border-amber-100 dark:border-amber-800/30">
                  <table className="w-full text-[12px] text-left">
                    <thead className="bg-amber-100/50 dark:bg-amber-900/30 border-b border-amber-100 dark:border-amber-800/50 text-amber-800 dark:text-amber-500 uppercase tracking-wider font-semibold">
                      <tr><th className="px-3 py-2">Tujuan</th><th className="px-3 py-2">Gunakan</th><th className="px-3 py-2">Nilai</th></tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100/50 dark:divide-amber-800/20 text-amber-900 dark:text-amber-200">
                      <tr><td className="px-3 py-2">VT Ventilator</td><td className="px-3 py-2 font-bold">IBW</td><td className="px-3 py-2 font-mono">{results.ibwR.toFixed(1)} kg</td></tr>
                      <tr><td className="px-3 py-2">Aminoglikosida, Heparin berat-badan</td><td className="px-3 py-2 font-bold">AdjBW</td><td className="px-3 py-2 font-mono">{results.adjBW.toFixed(1)} kg</td></tr>
                      <tr><td className="px-3 py-2">Vancomycin loading</td><td className="px-3 py-2 font-bold">Actual BW</td><td className="px-3 py-2 font-mono">{results.aBW} kg</td></tr>
                      <tr><td className="px-3 py-2">LMWH (enoxaparin) obesitas</td><td className="px-3 py-2 font-bold">AdjBW</td><td className="px-3 py-2 font-mono">{results.adjBW.toFixed(1)} kg</td></tr>
                      <tr><td className="px-3 py-2">Kalori ICU fase akut</td><td className="px-3 py-2 font-bold">IBW atau AdjBW</td><td className="px-3 py-2">ESPEN: no overfeeding</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {results.extraParams && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">Antropometri & Parameter Klinis</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <div className="bg-white dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 p-3 rounded-xl" style={{ borderColor: results.extraParams.bmiColor }}>
                    <div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: results.extraParams.bmiColor }}>BMI ({results.extraParams.bmiLabel})</div>
                    <div className="text-xl font-bold font-mono" style={{ color: results.extraParams.bmiColor }}>{results.extraParams.bmi}</div>
                    <div className="text-[11px] text-slate-500 mt-1">kg/m²</div>
                  </div>
                  <div className="bg-white dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 p-3 rounded-xl">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">BSA (Mosteller)</div>
                    <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200">{results.extraParams.bsa} <span className="text-[11px] font-sans">m²</span></div>
                    <div className="text-[11px] text-slate-500 mt-1">Dosis kemoterapi</div>
                  </div>
                  <div className="bg-white dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 p-3 rounded-xl">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">LBW (Janmahasatian)</div>
                    <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200">{results.extraParams.lbw} <span className="text-[11px] font-sans">kg</span></div>
                    <div className="text-[11px] text-slate-500 mt-1">Propofol/rocuronium</div>
                  </div>
                  <div className="bg-white dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 p-3 rounded-xl">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">EBV</div>
                    <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200">{results.extraParams.ebv} <span className="text-[11px] font-sans">L</span></div>
                    <div className="text-[11px] text-slate-500 mt-1">{sex === 'm' ? 70 : 65} mL/kg</div>
                  </div>
                </div>

                {results.extraParams.ree !== null && (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="bg-slate-50 dark:bg-[#2C2C2E]/60 border border-slate-200 dark:border-slate-700 p-3 rounded-xl">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">REE (Harris-Benedict)</div>
                      <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200">{results.extraParams.ree}</div>
                      <div className="text-[11px] text-slate-500 mt-1">kcal/hari (istirahat)</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#2C2C2E]/60 border border-slate-200 dark:border-slate-700 p-3 rounded-xl">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Kalori ICU</div>
                      <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200">{results.extraParams.calMin}-{results.extraParams.calMax}</div>
                      <div className="text-[11px] text-slate-500 mt-1">kcal/hari (25-30 kcal/kg)</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#2C2C2E]/60 border border-slate-200 dark:border-slate-700 p-3 rounded-xl">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Protein ICU</div>
                      <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200">{results.extraParams.protMin}-{results.extraParams.protMax}</div>
                      <div className="text-[11px] text-slate-500 mt-1">g/hari (1.2-2.0 g/kg)</div>
                    </div>
                  </div>
                )}

                {results.extraParams.mabl !== null && (
                  <div className={`mt-4 p-4 rounded-2xl border ${!results.extraParams.mablWarn ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30' : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30'}`}>
                    <div className={`text-[12px] font-bold uppercase tracking-wide mb-1 ${!results.extraParams.mablWarn ? 'text-blue-700 dark:text-blue-400' : 'text-red-700 dark:text-red-400'}`}>
                      {(!results.extraParams.mablWarn) ? 'MABL (Max Allowable Blood Loss)' : '⚠ Hb di Bawah Trigger Transfusi'}
                    </div>
                    {(!results.extraParams.mablWarn) ? (
                      <>
                        <div className="font-mono text-lg text-blue-900 dark:text-blue-300 font-bold mb-2">{results.extraParams.mabl} mL</div>
                        <div className="text-[13px] text-blue-800/80 dark:text-blue-300">
                          Perdarahan &gt;{results.extraParams.mabl} mL → pertimbangkan transfusi PRC. Pre-operatif: evaluasi autologous donation atau cell saver.
                        </div>
                      </>
                    ) : (
                      <div className="text-[13px] text-red-800 dark:text-red-300 mt-2">
                        Hb {hb} g/dL &lt; 7 g/dL — pertimbangkan transfusi PRC. Estimasi kebutuhan PRC: ±{results.extraParams.mablKolf} kolf. Gunakan tab 🩸 Transfusi untuk kalkulasi lengkap.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <Accordion title="📖 Mengapa IBW & Bukan Actual Body Weight?">
        <ul className="pl-4 space-y-1 list-disc text-muted-foreground">
          <li><strong className="text-foreground">Dasar fisiologis:</strong> Volume paru (FRC, TLC) berkorelasi dengan tinggi badan, bukan berat badan aktual. Pasien obesitas memiliki paru berukuran normal namun berat badan jauh lebih tinggi.</li>
          <li><strong className="text-foreground">Risiko pada obesitas:</strong> Jika VT dihitung dari actual BW → overdistensi alveolar → volutrauma → VILI. Pada pasien 100 kg obesitas dengan tinggi 165 cm, IBW ~65 kg. Perbedaan VT: 600 mL (actual) vs 390 mL (IBW) — risiko signifikan.</li>
          <li><strong className="text-foreground">ARDSNet trial:</strong> VT 6 mL/kg IBW terbukti menurunkan mortalitas 22% vs 12 mL/kg. Seluruh kalkulasi berbasis IBW.</li>
          <li><strong className="text-foreground">Adjusted BW (ABW):</strong> Untuk pasien obesitas ekstrem: ABW = IBW + 0.4 × (Actual BW − IBW). Digunakan untuk dosis obat tertentu, bukan untuk VT ventilator.</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 ardsnet2000, devine1974, singer2023
        </div>
      </Accordion>
    </div>
  );
}
