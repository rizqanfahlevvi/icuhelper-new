import React, { useState, useEffect, useMemo } from 'react';
import { Activity, Wind, Info, ChevronDown } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { SaveToHistoryButton } from '../../components/ui/SaveToHistoryButton';
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
  const [fio2DirectMode, setFio2DirectMode] = useState<'decimal' | 'percent'>('decimal');
  const [fio2Error, setFio2Error] = useState('');
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
    if (clinicalStore.data.fio2) {
      setFio2DirectMode('percent');
      setFio2(clinicalStore.data.fio2);
      setFio2Mode('direct');
    }
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
    if (clinicalStore.data.fio2) {
      setFio2DirectMode('percent');
      setFio2(clinicalStore.data.fio2);
      setFio2Mode('direct');
    }
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

  const getFio2Value = (): number => {
    if (fio2Mode === 'direct') {
      const raw = parseFloat(fio2);
      if (isNaN(raw)) return NaN;
      return fio2DirectMode === 'percent' ? raw / 100 : raw;
    }
    return estimateFio2(device, parseFloat(flow));
  };

  const getFio2Hint = (): { text: string; isError: boolean } => {
    if (!fio2 || fio2Mode !== 'direct') return { text: '', isError: false };
    const raw = parseFloat(fio2);
    if (isNaN(raw)) return { text: '', isError: false };
    const dec = fio2DirectMode === 'percent' ? raw / 100 : raw;
    if (dec < 0.21 || dec > 1.0) {
      return {
        text: `⚠ FiO₂ tidak valid. Harus ${fio2DirectMode === 'percent' ? '21–100%' : '0.21–1.0'}`,
        isError: true
      };
    }
    return {
      text: fio2DirectMode === 'decimal'
        ? `= ${(dec * 100).toFixed(0)}%`
        : `= ${dec.toFixed(2)} (desimal)`,
      isError: false
    };
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

    if (!o2 || !f || isNaN(f)) {
      setResult(null);
      return;
    }
    if (f < 0.21 || f > 1.0) {
      setFio2Error(`FiO₂ tidak valid (${fio2DirectMode === 'percent' ? `${fio2}% = ${f.toFixed(2)}` : fio2}). Harus 0.21–1.0.`);
      setResult(null);
      return;
    }
    setFio2Error('');

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
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-x-hidden">
      
      {/* Active Patient Widget & Sync Banner */}
      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />

      <div className="flex flex-col gap-0 mt-2">
        <h2 className="mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          Parameter Oksigenasi
        </h2>

        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
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
              <div className="flex flex-col gap-1.5">
                {/* Sub-toggle: Desimal vs Persen */}
                <div className="flex bg-slate-300/50 dark:bg-[#0F0F0F] p-0.5 rounded-lg">
                  <button
                    className={`flex-1 text-[11px] py-1 rounded-md font-bold transition-colors ${
                      fio2DirectMode === 'decimal'
                        ? 'bg-white dark:bg-[#3A3A3C] shadow-sm text-slate-900 dark:text-white'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                    onClick={() => { setFio2DirectMode('decimal'); setFio2(''); setFio2Error(''); }}
                  >
                    Desimal (0.21–1.0)
                  </button>
                  <button
                    className={`flex-1 text-[11px] py-1 rounded-md font-bold transition-colors ${
                      fio2DirectMode === 'percent'
                        ? 'bg-white dark:bg-[#3A3A3C] shadow-sm text-slate-900 dark:text-white'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                    onClick={() => { setFio2DirectMode('percent'); setFio2(''); setFio2Error(''); }}
                  >
                    Persen (21–100%)
                  </button>
                </div>

                {/* Input */}
                <input
                  type="number"
                  step={fio2DirectMode === 'decimal' ? '0.01' : '1'}
                  min={fio2DirectMode === 'decimal' ? '0.21' : '21'}
                  max={fio2DirectMode === 'decimal' ? '1.0' : '100'}
                  placeholder={fio2DirectMode === 'decimal' ? '0.21 – 1.0' : '21 – 100'}
                  className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
                  value={fio2}
                  onChange={e => { setFio2(e.target.value); setFio2Error(''); }}
                />

                {/* Hint / Error */}
                {fio2 && (() => {
                  const hint = getFio2Hint();
                  return hint.text ? (
                    <p className={`text-[11px] text-right ${hint.isError ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`}>
                      {hint.text}
                    </p>
                  ) : null;
                })()}

                {/* Inline error dari calculate() */}
                {fio2Error && (
                  <p className="text-[11px] text-red-500 text-right">{fio2Error}</p>
                )}
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
        <h2 className="mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          Parameter Mekanik Ventilasi & SpO₂
        </h2>

        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
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
        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
            <div className={`text-[12px] uppercase tracking-wider font-bold mb-1 ${result.pfColor}`}>P/F Ratio — Klasifikasi Oksigenasi</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">{result.pf} mmHg — {result.pfClass}</div>
            <div className="text-[13px] font-medium text-slate-700 dark:text-slate-300">PaO₂ {result.o2.toFixed(1)} ÷ FiO₂ {result.f.toFixed(2)}</div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 italic text-center">
              ARDS Definition Task Force. <em>JAMA</em> 2012;307:2526–2533 ·
              Matthay MA et al. <em>AJRCCM</em> 2023;207(4):374–393
            </p>
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
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 italic text-center">
                Amato MB et al. <em>N Engl J Med</em> 2015;372:747–755
              </p>
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

          <div className="mt-4">
            <SaveToHistoryButton 
              module="pf_ratio" 
              label={`P/F Ratio: ${result.pf} (${result.pfClass})`}
              inputs={{ pao2, fio2Mode, fio2, device, flow, map, spo2Source, spo2, pplat, peep, paco2 }}
              summary={`P/F: ${result.pf} (${result.pfClass}) · PaO₂: ${result.o2.toFixed(1)} · FiO₂: ${result.f.toFixed(2)}${result.dpRes ? ` · DP: ${result.dpRes.val}` : ''}`}
              className="w-full bg-blue-600 hover:bg-blue-700"
            />
          </div>
        </div>
      )}

      <Accordion title="📖 Teori & Referensi: P/F Ratio, ARDS & Gagal Napas">
        <div className="space-y-5 text-[13px]">

          {/* ── TIPE GAGAL NAPAS ── */}
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">
              Klasifikasi Gagal Napas (Tipe I–IV)
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-[12px]">
                <thead className="bg-slate-100 dark:bg-[#2C2C2E]">
                  <tr>
                    <th className="px-3 py-2 text-left font-bold text-slate-700 dark:text-slate-300">Tipe</th>
                    <th className="px-3 py-2 text-left font-bold text-slate-700 dark:text-slate-300">Mekanisme</th>
                    <th className="px-3 py-2 text-left font-bold text-slate-700 dark:text-slate-300">Kriteria Lab</th>
                    <th className="px-3 py-2 text-left font-bold text-slate-700 dark:text-slate-300">Contoh Klinis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr className="bg-white dark:bg-[#1C1C1E]">
                    <td className="px-3 py-2 font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">Tipe I<br/><span className="text-[10px] font-normal text-slate-500">Hipoksemik</span></td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">V/Q mismatch, shunting, gangguan difusi</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">PaO₂ &lt;60 mmHg<br/>PaCO₂ normal/rendah<br/>A-a gradient ↑</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Pneumonia, ARDS, Edema paru, Emboli paru</td>
                  </tr>
                  <tr className="bg-slate-50/50 dark:bg-[#242426]">
                    <td className="px-3 py-2 font-semibold text-red-600 dark:text-red-400 whitespace-nowrap">Tipe II<br/><span className="text-[10px] font-normal text-slate-500">Hiperkapnik</span></td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Kegagalan pompa ventilasi, hipoventilasi alveolar</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">PaCO₂ &gt;50 mmHg<br/>pH &lt;7.35<br/>A-a gradient normal</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Eksaserbasi PPOK, Asma berat, Overdosis opioid, MG crisis</td>
                  </tr>
                  <tr className="bg-white dark:bg-[#1C1C1E]">
                    <td className="px-3 py-2 font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">Tipe III<br/><span className="text-[10px] font-normal text-slate-500">Perioperatif</span></td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Atelektasis, penurunan FRC pasca operasi</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Hipoksemia pasca bedah, SpO₂ turun hari 1–2</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Post-laparotomi, Post-torakotomi, Obesitas + supine</td>
                  </tr>
                  <tr className="bg-slate-50/50 dark:bg-[#242426]">
                    <td className="px-3 py-2 font-semibold text-purple-600 dark:text-purple-400 whitespace-nowrap">Tipe IV<br/><span className="text-[10px] font-normal text-slate-500">Syok</span></td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Hipoperfusi, otot napas hipermetabolik</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Gagal napas sekunder syok, laktat ↑</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Syok kardiogenik, Syok septik berat</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 italic">
              Pasien dapat mengalami mixed failure — misal Tipe I + II pada ARDS lanjut dengan kelelahan otot napas.
            </p>
          </div>

          {/* ── BERLIN ARDS ── */}
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">
              Klasifikasi ARDS — Berlin 2012 + Update Global ARDS 2023
            </h3>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mb-2">
              Global ARDS Definition 2023 (Matthay et al.) mempertahankan threshold P/F Berlin namun memperluas kriteria ke pasien HFNO/NIV tanpa intubasi.
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-[12px]">
                <thead className="bg-slate-100 dark:bg-[#2C2C2E]">
                  <tr>
                    <th className="px-3 py-2 text-left font-bold text-slate-700 dark:text-slate-300">Parameter</th>
                    <th className="px-3 py-2 text-center font-bold text-amber-600 dark:text-amber-400">Mild</th>
                    <th className="px-3 py-2 text-center font-bold text-orange-600 dark:text-orange-400">Moderate</th>
                    <th className="px-3 py-2 text-center font-bold text-red-600 dark:text-red-400">Severe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr className="bg-white dark:bg-[#1C1C1E]">
                    <td className="px-3 py-2 font-semibold text-slate-700 dark:text-slate-300">P/F Ratio</td>
                    <td className="px-3 py-2 text-center text-slate-700 dark:text-slate-300">200–300 mmHg</td>
                    <td className="px-3 py-2 text-center text-slate-700 dark:text-slate-300">100–200 mmHg</td>
                    <td className="px-3 py-2 text-center text-slate-700 dark:text-slate-300">&lt;100 mmHg</td>
                  </tr>
                  <tr className="bg-slate-50/50 dark:bg-[#242426]">
                    <td className="px-3 py-2 font-semibold text-slate-700 dark:text-slate-300">PEEP minimal</td>
                    <td className="px-3 py-2 text-center text-slate-600 dark:text-slate-400" colSpan={3}>≥5 cmH₂O (semua kategori)</td>
                  </tr>
                  <tr className="bg-white dark:bg-[#1C1C1E]">
                    <td className="px-3 py-2 font-semibold text-slate-700 dark:text-slate-300">OI ekuivalen</td>
                    <td className="px-3 py-2 text-center text-slate-700 dark:text-slate-300">4–8</td>
                    <td className="px-3 py-2 text-center text-slate-700 dark:text-slate-300">8–16</td>
                    <td className="px-3 py-2 text-center text-slate-700 dark:text-slate-300">&gt;16</td>
                  </tr>
                  <tr className="bg-slate-50/50 dark:bg-[#242426]">
                    <td className="px-3 py-2 font-semibold text-slate-700 dark:text-slate-300">Mortalitas 28-hari</td>
                    <td className="px-3 py-2 text-center text-amber-600 dark:text-amber-400 font-bold">~27%</td>
                    <td className="px-3 py-2 text-center text-orange-600 dark:text-orange-400 font-bold">~32%</td>
                    <td className="px-3 py-2 text-center text-red-600 dark:text-red-400 font-bold">~45%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── IMPLIKASI KLINIS ── */}
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">
              Implikasi Klinis per Kategori ARDS
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-[12px]">
                <thead className="bg-slate-100 dark:bg-[#2C2C2E]">
                  <tr>
                    <th className="px-3 py-2 text-left font-bold text-slate-700 dark:text-slate-300">Intervensi</th>
                    <th className="px-3 py-2 text-center font-bold text-amber-600 dark:text-amber-400">Mild</th>
                    <th className="px-3 py-2 text-center font-bold text-orange-600 dark:text-orange-400">Moderate</th>
                    <th className="px-3 py-2 text-center font-bold text-red-600 dark:text-red-400">Severe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  <tr className="bg-white dark:bg-[#1C1C1E]">
                    <td className="px-3 py-2 font-semibold">VT target</td>
                    <td className="px-3 py-2 text-center">6 mL/kg IBW</td>
                    <td className="px-3 py-2 text-center">6 mL/kg IBW</td>
                    <td className="px-3 py-2 text-center">4–6 mL/kg IBW</td>
                  </tr>
                  <tr className="bg-slate-50/50 dark:bg-[#242426]">
                    <td className="px-3 py-2 font-semibold">PEEP</td>
                    <td className="px-3 py-2 text-center">5–8</td>
                    <td className="px-3 py-2 text-center">8–13</td>
                    <td className="px-3 py-2 text-center">13–18 cmH₂O</td>
                  </tr>
                  <tr className="bg-white dark:bg-[#1C1C1E]">
                    <td className="px-3 py-2 font-semibold">Prone positioning</td>
                    <td className="px-3 py-2 text-center">Tidak rutin</td>
                    <td className="px-3 py-2 text-center">Pertimbangkan &gt;12 j/hr</td>
                    <td className="px-3 py-2 text-center font-bold text-red-600 dark:text-red-400">≥16 j/hr ✓</td>
                  </tr>
                  <tr className="bg-slate-50/50 dark:bg-[#242426]">
                    <td className="px-3 py-2 font-semibold">NMBA (Cisatrakurium)</td>
                    <td className="px-3 py-2 text-center">Tidak</td>
                    <td className="px-3 py-2 text-center">Jika asinkron berat</td>
                    <td className="px-3 py-2 text-center">Selektif — 48j awal</td>
                  </tr>
                  <tr className="bg-white dark:bg-[#1C1C1E]">
                    <td className="px-3 py-2 font-semibold">Target SpO₂</td>
                    <td className="px-3 py-2 text-center">92–96%</td>
                    <td className="px-3 py-2 text-center">88–95%</td>
                    <td className="px-3 py-2 text-center">88–92%</td>
                  </tr>
                  <tr className="bg-slate-50/50 dark:bg-[#242426]">
                    <td className="px-3 py-2 font-semibold">ECMO VV</td>
                    <td className="px-3 py-2 text-center">Tidak</td>
                    <td className="px-3 py-2 text-center">Tidak (kecuali refrakter)</td>
                    <td className="px-3 py-2 text-center font-bold">P/F &lt;80 + OI &gt;25</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 italic">
              Prone positioning: PROSEVA 2013 (Guérin et al. NEJM 2013) menunjukkan penurunan mortalitas 28-hr signifikan pada severe ARDS (P/F &lt;150).
            </p>
          </div>

          {/* ── DRIVING PRESSURE ── */}
          <div className="bg-slate-50 dark:bg-[#2C2C2E] rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">
              Driving Pressure (DP) — Prediktor Mortalitas ARDS
            </h3>
            <p className="text-[12px] text-slate-600 dark:text-slate-400 mb-2">
              <strong className="text-slate-800 dark:text-slate-200">DP = Pplat − PEEP = VT / Crs</strong>
            </p>
            <ul className="space-y-1.5 text-[12px] text-slate-700 dark:text-slate-300 list-disc pl-4">
              <li>Target: <strong>DP ≤15 cmH₂O</strong> (idealnya ≤13 cmH₂O)</li>
              <li>Amato et al. NEJM 2015: setiap kenaikan 1 cmH₂O DP → mortalitas ↑ 11% secara independen (lebih kuat dari VT atau PEEP saja)</li>
              <li>DP &gt;15 → pertimbangkan: turunkan VT, naikkan PEEP jika meningkatkan Crs, prone positioning</li>
              <li className="text-amber-600 dark:text-amber-400 font-semibold">DP hanya valid pada pasien fully sedated/paralyzed — usaha napas spontan mengubah Pplat</li>
            </ul>
          </div>

          {/* ── OI / OSI ── */}
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">
              OI & OSI — Indikator Oksigenasi Komprehensif
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-[12px]">
                <thead className="bg-slate-100 dark:bg-[#2C2C2E]">
                  <tr>
                    <th className="px-3 py-2 text-left font-bold text-slate-700 dark:text-slate-300">Indeks</th>
                    <th className="px-3 py-2 text-center font-bold text-slate-700 dark:text-slate-300">Formula</th>
                    <th className="px-3 py-2 text-center font-bold text-slate-700 dark:text-slate-300">Threshold ECMO</th>
                    <th className="px-3 py-2 text-left font-bold text-slate-700 dark:text-slate-300">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  <tr className="bg-white dark:bg-[#1C1C1E]">
                    <td className="px-3 py-2 font-semibold">OI</td>
                    <td className="px-3 py-2 text-center font-mono text-[11px]">MAP × FiO₂ × 100 / PaO₂</td>
                    <td className="px-3 py-2 text-center font-bold text-red-600 dark:text-red-400">&gt;25</td>
                    <td className="px-3 py-2">Mempertimbangkan MAP — lebih akurat dari P/F pada MV</td>
                  </tr>
                  <tr className="bg-slate-50/50 dark:bg-[#242426]">
                    <td className="px-3 py-2 font-semibold">OSI</td>
                    <td className="px-3 py-2 text-center font-mono text-[11px]">MAP × FiO₂ × 100 / SpO₂</td>
                    <td className="px-3 py-2 text-center font-bold text-orange-600 dark:text-orange-400">&gt;16</td>
                    <td className="px-3 py-2">Non-invasif — cocok jika ABG tidak tersedia (SpO₂ &lt;97%)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 italic">
              OSI berkorelasi kuat dengan OI pada SpO₂ 88–97% — akurasi menurun di luar range ini.
            </p>
          </div>

          {/* ── REFERENSI ── */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Referensi</h3>
            <ol className="space-y-1 list-decimal pl-4 text-[12px] text-slate-600 dark:text-slate-400">
              <li>ARDS Definition Task Force, Ranieri VM et al. <em>JAMA</em> 2012;307(23):2526–2533. doi:10.1001/jama.2012.5669</li>
              <li>Matthay MA, Arabi Y, Arroliga AC, et al. <em>Am J Respir Crit Care Med</em> 2023;207(4):374–393. doi:10.1164/rccm.202208-1533SO</li>
              <li>ESICM Taskforce on ARDS. <em>Intensive Care Med</em> 2023. doi:10.1007/s00134-023-07050-7</li>
              <li>ARDSNet. <em>N Engl J Med</em> 2000;342:1301–1308. doi:10.1056/NEJM200005043421801</li>
              <li>Amato MB, Meade MO, Slutsky AS, et al. <em>N Engl J Med</em> 2015;372:747–755. doi:10.1056/NEJMsa1410639</li>
              <li>Guérin C, Reignier J, Richard JC, et al. (PROSEVA). <em>N Engl J Med</em> 2013;368:2159–2168. doi:10.1056/NEJMoa1214103</li>
              <li>Fan E, Del Sorbo L, Goligher EC, et al. (ATS/ESICM/SCCM). <em>Am J Respir Crit Care Med</em> 2017;195:1253–1263. doi:10.1164/rccm.201703-0548ST</li>
            </ol>
          </div>

        </div>
      </Accordion>
    </div>
  );
}
