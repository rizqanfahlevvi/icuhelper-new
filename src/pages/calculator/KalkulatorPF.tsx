import React, { useState, useEffect, useMemo } from 'react';
import { Activity, Wind, Info, ChevronDown } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';

export default function KalkulatorPF() {
  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();

  const [pao2, setPao2] = useState('');
  const [fio2Mode, setFio2Mode] = useState<'direct' | 'lowflow'>('direct');
  const [fio2, setFio2] = useState('');
  const [device, setDevice] = useState('nasal');
  const [flow, setFlow] = useState('2');
  const [map, setMap] = useState('');
  const [spo2Source, setSpo2Source] = useState<'pulse' | 'abg'>('pulse');
  const [spo2, setSpo2] = useState('');
  const [pplat, setPplat] = useState('');
  const [peep, setPeep] = useState('');
  const [paco2, setPaco2] = useState('');
  const [result, setResult] = useState<any>(null);

  // Auto-load on mount
  useEffect(() => {
    if (clinicalStore.data.pao2) setPao2(clinicalStore.data.pao2);
    if (clinicalStore.data.spo2) setSpo2(clinicalStore.data.spo2);
    if (clinicalStore.data.peep) setPeep(clinicalStore.data.peep);
    if (clinicalStore.data.pco2) setPaco2(clinicalStore.data.pco2);
  }, []);

  const syncFields = useMemo(() => [
    { key: 'pao2' as const, label: 'PaO₂', value: pao2, setter: setPao2, unit: 'mmHg' },
    { key: 'spo2' as const, label: 'SpO₂', value: spo2, setter: setSpo2, unit: '%' },
    { key: 'peep' as const, label: 'PEEP', value: peep, setter: setPeep, unit: 'cmH₂O' },
    { key: 'pco2' as const, label: 'PaCO₂', value: paco2, setter: setPaco2, unit: 'mmHg' },
  ], [pao2, spo2, peep, paco2]);

  const handleAutofill = (data: any) => {
    if (clinicalStore.data.pao2) setPao2(clinicalStore.data.pao2);
    if (clinicalStore.data.spo2) setSpo2(clinicalStore.data.spo2);
    if (clinicalStore.data.peep) setPeep(clinicalStore.data.peep);
    if (clinicalStore.data.pco2) setPaco2(clinicalStore.data.pco2);
    setResult(null);
  };


  const estimateFio2 = (dev: string, fl: number) => {
    let f = 0.21;
    if (dev.startsWith('venturi')) {
      f = parseInt(dev.replace('venturi', '')) / 100;
    } else if (dev === 'nasal' && !isNaN(fl)) {
      f = Math.min(0.21 + 0.04 * fl, 0.44);
    } else if (dev === 'simple' && !isNaN(fl)) {
      if (fl <= 6) f = 0.35;
      else if (fl >= 10) f = 0.60;
      else f = 0.35 + (fl - 6) * 0.0625;
    } else if (dev === 'nrm' && !isNaN(fl)) {
      if (fl <= 10) f = 0.80;
      else if (fl >= 15) f = 0.95;
      else f = 0.80 + (fl - 10) * 0.03;
    }
    return f;
  };

  const getFio2Value = () => {
    if (fio2Mode === 'direct') return parseFloat(fio2);
    return estimateFio2(device, parseFloat(flow));
  };

  const spo2ToPao2 = (s: number) => {
    const table = [
      { s: 88, p: 55 }, { s: 90, p: 60 }, { s: 92, p: 70 }, { s: 94, p: 79 },
      { s: 96, p: 93 }, { s: 98, p: 113 }, { s: 100, p: 145 }
    ];
    if (s <= 88) return 55;
    if (s >= 100) return 145;
    for (let i = 0; i < table.length - 1; i++) {
      if (s >= table[i].s && s <= table[i + 1].s) {
        const frac = (s - table[i].s) / (table[i + 1].s - table[i].s);
        return table[i].p + frac * (table[i + 1].p - table[i].p);
      }
    }
    return 29;
  };

  const calculate = () => {
    const o2 = parseFloat(pao2) || (parseFloat(spo2) ? spo2ToPao2(parseFloat(spo2)) : null);
    const f = getFio2Value();
    const m = parseFloat(map);
    const s = parseFloat(spo2);
    const plat = parseFloat(pplat);
    const p = parseFloat(peep);
    const pCO2 = parseFloat(paco2);

    if (!o2 || !f) {
      setResult(null);
      return;
    }

    const pf = o2 / f;
    let pfClass, pfColor;
    if (pf >= 400) { pfClass = 'Normal'; pfColor = 'text-green-500'; }
    else if (pf >= 300) { pfClass = 'Hipoksemia Ringan'; pfColor = 'text-teal-500'; }
    else if (pf >= 200) { pfClass = 'ARDS Mild (Berlin)'; pfColor = 'text-amber-500'; }
    else if (pf >= 100) { pfClass = 'ARDS Moderate (Berlin)'; pfColor = 'text-orange-500'; }
    else { pfClass = 'ARDS Severe (Berlin)'; pfColor = 'text-red-500'; }

    let oiRes = null;
    if (m && o2 && f) {
      const oi = (m * f * 100) / o2;
      const oiClass = oi < 5 ? 'Ringan' : oi < 25 ? 'Moderate' : oi < 40 ? 'Berat' : 'Sangat Berat (ECMO)';
      const oiColor = oi < 5 ? 'text-green-500' : oi < 25 ? 'text-amber-500' : 'text-red-500';
      oiRes = { val: oi.toFixed(1), cls: oiClass, col: oiColor };
    }

    let dpRes = null;
    if (!isNaN(plat) && !isNaN(p)) {
      const dp = plat - p;
      const dpCol = dp <= 13 ? 'text-green-500' : dp <= 15 ? 'text-amber-500' : 'text-red-500';
      const dpCls = dp <= 13 ? 'Optimal (≤13)' : dp <= 15 ? 'Batas (≤15)' : '⚠ Tinggi (risiko VILI)';
      dpRes = { val: dp, cls: dpCls, col: dpCol };
    }

    let osiRes = null;
    if (s && m && f) {
      const osi = (m * f * 100) / s;
      osiRes = { val: osi.toFixed(1) };
    }

    let failType = null;
    if (pCO2) {
      if (pCO2 > 50) {
        failType = { t: 'Tipe II (Hiperkapnik)', d: 'Kegagalan ventilasi. PaCO₂ > 50 mmHg.', c: 'text-red-500' };
      } else if (pf < 300 || o2 < 60) {
        failType = { t: 'Tipe I (Hipoksemik)', d: 'Kegagalan oksigenasi tanpa retensi CO₂.', c: 'text-amber-500' };
      } else {
        failType = { t: 'Bukan Tipe I/II yang jelas', d: 'Oksigenasi baik, PaCO₂ normal/rendah.', c: 'text-green-500' };
      }
    }

    setResult({ pf: pf.toFixed(1), pfClass, pfColor, o2, f, oiRes, dpRes, osiRes, failType });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Active Patient Widget & Sync Banner */}
      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />

      <div className="flex flex-col gap-0 mt-2">
        <h2 className="mb-2 px-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          Parameter Oksigenasi
        </h2>

        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mx-4">
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">PaO₂ ABG</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" placeholder="80" value={pao2} onChange={e => setPao2(e.target.value)} />
              <span className="text-xs font-semibold text-slate-500 w-10 text-left">mmHg</span>
            </div>
          </div>

          <div className="flex flex-col px-4 py-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Fraksi Oksigen (FiO₂)</span>
            </div>
            <div className="flex bg-slate-200 dark:bg-[#1C1C1E] p-1 rounded-lg mb-2">
              <button className={`flex-1 text-xs py-1.5 rounded-md font-bold transition-colors ${fio2Mode === 'direct' ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`} onClick={() => setFio2Mode('direct')}>Input Desimal</button>
              <button className={`flex-1 text-xs py-1.5 rounded-md font-bold transition-colors ${fio2Mode === 'lowflow' ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`} onClick={() => setFio2Mode('lowflow')}>Pilih Device</button>
            </div>
            {fio2Mode === 'direct' ? (
              <div className="flex items-center justify-end gap-2">
                <input type="number" step="0.01" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" placeholder="0.21-1.0" value={fio2} onChange={e => setFio2(e.target.value)} />
              </div>
            ) : (
              <div className="flex gap-2 items-center justify-between">
                <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-left font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[13px] transition-all" value={device} onChange={e => setDevice(e.target.value)}>
                  <option value="nasal">Nasal Cannula</option>
                  <option value="simple">Simple Mask</option>
                  <option value="nrm">NRM</option>
                  <option value="venturi24">Venturi 24%</option>
                  <option value="venturi28">Venturi 28%</option>
                  <option value="venturi31">Venturi 31%</option>
                  <option value="venturi35">Venturi 35%</option>
                  <option value="venturi40">Venturi 40%</option>
                  <option value="venturi60">Venturi 60%</option>
                </select>
                {!device.startsWith('venturi') && (
                  <div className="flex items-center justify-end gap-2 bg-white dark:bg-[#1C1C1E] rounded-md px-2 py-1 shadow-sm border border-slate-200 dark:border-slate-800">
                    <input type="number" className="w-16 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-2 py-1 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[13px] transition-all" placeholder="O₂" value={flow} onChange={e => setFlow(e.target.value)} />
                    <span className="text-[11px] font-semibold text-slate-500">L/m</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">MAP Ventilator</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" placeholder="14" value={map} onChange={e => setMap(e.target.value)} />
              <span className="text-[11px] font-semibold text-slate-500 w-12 text-left">cmH₂O</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-0">
        <h2 className="mb-2 px-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          Parameter Mekanik Ventilasi & SpO₂
        </h2>

        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mx-4">
          <div className="flex flex-col px-4 py-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">SpO₂ / SaO₂ (%)</span>
            </div>
            <div className="flex bg-slate-200 dark:bg-[#1C1C1E] p-1 rounded-lg mb-2">
              <button className={`flex-1 text-xs py-1.5 rounded-md font-bold transition-colors ${spo2Source === 'pulse' ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`} onClick={() => setSpo2Source('pulse')}>Pulse Ox (SpO₂)</button>
              <button className={`flex-1 text-xs py-1.5 rounded-md font-bold transition-colors ${spo2Source === 'abg' ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`} onClick={() => setSpo2Source('abg')}>ABG SaO₂</button>
            </div>
            <div className="flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" placeholder="94" value={spo2} onChange={e => setSpo2(e.target.value)} />
              <span className="text-[11px] font-semibold text-slate-500 w-6 text-left">%</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Pplat</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" placeholder="25" value={pplat} onChange={e => setPplat(e.target.value)} />
              <span className="text-[11px] font-semibold text-slate-500 w-12 text-left">cmH₂O</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">PEEP</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" placeholder="5" value={peep} onChange={e => setPeep(e.target.value)} />
              <span className="text-[11px] font-semibold text-slate-500 w-12 text-left">cmH₂O</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">PaCO₂ ABG</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" placeholder="Opsional" value={paco2} onChange={e => setPaco2(e.target.value)} />
              <span className="text-xs font-semibold text-slate-500 w-10 text-left">mmHg</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4">
        <button onClick={calculate} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px]">
          Hitung P/F & Klasifikasi
        </button>
      </div>

      {result && (
        <div className="px-4 mt-4 space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
            <div className={`text-[12px] uppercase tracking-wider font-bold mb-1 ${result.pfColor}`}>P/F Ratio — Klasifikasi Oksigenasi</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">{result.pf} mmHg — {result.pfClass}</div>
            <div className="text-[13px] font-medium text-slate-700 dark:text-slate-300">PaO₂ {result.o2.toFixed(1)} ÷ FiO₂ {result.f.toFixed(2)}</div>
          </div>

          {result.oiRes && (
            <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
              <div className={`text-[12px] uppercase tracking-wider font-bold mb-1 ${result.oiRes.col}`}>Oxygenation Index (OI)</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white mb-1">{result.oiRes.val} — {result.oiRes.cls}</div>
              <div className="text-[13px] font-medium text-slate-700 dark:text-slate-300">OI = (MAP {map} × FiO₂ {result.f} × 100) / PaO₂ {result.o2.toFixed(1)}</div>
            </div>
          )}

          {result.dpRes && (
            <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
              <div className={`text-[12px] uppercase tracking-wider font-bold mb-1 ${result.dpRes.col}`}>Driving Pressure</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white mb-1">{result.dpRes.val} cmH₂O — {result.dpRes.cls}</div>
              <div className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Pplat {pplat} − PEEP {peep} · Target ≤15 (ideal ≤13)</div>
            </div>
          )}

          {result.osiRes && (
            <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
              <div className="text-[12px] uppercase tracking-wider font-bold mb-1 text-blue-500">OSI (SpO₂-based OI)</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white mb-1">OSI = {result.osiRes.val}</div>
              <div className="text-[13px] font-medium text-slate-700 dark:text-slate-300">OSI = (MAP {map} × FiO₂ {result.f.toFixed(2)} × 100) / SpO₂ {spo2}%</div>
            </div>
          )}

          {result.failType && (
            <div className={`bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm ${result.failType.c}`}>
              <div className={`text-[12px] uppercase tracking-wider font-bold mb-1 ${result.failType.c}`}>Tipe Gagal Napas</div>
              <div className="text-xl font-bold mb-1">{result.failType.t}</div>
              <div className="text-[13px] font-medium opacity-80">{result.failType.d} (PaCO₂ = {paco2} mmHg)</div>
            </div>
          )}
        </div>
      )}

      <Accordion title="📖 Teori & Referensi: P/F Ratio & Oksigenasi">
        <ul className="pl-4 space-y-1 list-disc text-muted-foreground text-sm">
          <li><strong className="text-foreground">P/F Ratio (Horovitz Quotient):</strong> Rasio PaO2 (tekanan parsial oksigen arterial) dibagi dengan FiO2 (fraksi oksigen inspirasi desimal). Normal &gt; 400. Merupakan kriteria utama dari klasifikasi <em>Berlin Definition of ARDS</em>.</li>
          <li><strong className="text-foreground">Klasifikasi ARDS (Berlin 2012):</strong>
            <ul className="pl-4 list-circle">
              <li>Mild: 200 &lt; PaO2/FiO2 &le; 300 (PEEP atau CPAP &ge; 5 cmH2O)</li>
              <li>Moderate: 100 &lt; PaO2/FiO2 &le; 200 (PEEP &ge; 5 cmH2O)</li>
              <li>Severe: PaO2/FiO2 &le; 100 (PEEP &ge; 5 cmH2O)</li>
            </ul>
          </li>
          <li><strong className="text-foreground">Oxygenation Index (OI):</strong> OI = (MAP &times; FiO2 &times; 100) / PaO2. Indikator perburukan paru. OI &gt; 25 merepresentasikan kegagalan oksigenasi berat yang sering menjadi indikasi ECMO (terutama pada pediatrik).</li>
          <li><strong className="text-foreground">OSI (Oxygenation Saturation Index):</strong> Menggunakan SpO2 sebagai pengganti PaO2. Validasi klinis menunjukkan korelasi kuat dengan OI pada SpO2 &lt; 97%.</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 ARDS Definition Task Force (2012) JAMA; Trachsel et al. (2005) ICM.
        </div>
      </Accordion>
    </div>
  );
}
