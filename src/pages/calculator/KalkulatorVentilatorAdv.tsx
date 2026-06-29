import React, { useState, useEffect, useMemo } from 'react';
import { Settings, AlertTriangle } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { SaveToHistoryButton } from '../../components/ui/SaveToHistoryButton';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';

export default function KalkulatorVentilatorAdv() {
  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();

  const [kondisi, setKondisi] = useState('normal');
  const [ibw, setIbw] = useState('');
  const [vt, setVt] = useState('');
  const [rr, setRr] = useState('');
  const [fio2, setFio2] = useState('');
  const [ppeak, setPpeak] = useState('');
  const [pplat, setPplat] = useState('');
  const [peep, setPeep] = useState('');
  const [spo2, setSpo2] = useState('');
  const [pao2, setPao2] = useState('');

  const [res, setRes] = useState<any>(null);

  // Auto-loaded on mount
  useEffect(() => {
    if (clinicalStore.data.rr) setRr(clinicalStore.data.rr);
    if (clinicalStore.data.peep) setPeep(clinicalStore.data.peep);
    if (clinicalStore.data.spo2) setSpo2(clinicalStore.data.spo2);
    if (clinicalStore.data.pao2) setPao2(clinicalStore.data.pao2);
  }, []);

  const syncFields = useMemo(() => [
    { key: 'rr' as const, label: 'Respiratory Rate', value: rr, setter: setRr, unit: 'x/menit' },
    { key: 'peep' as const, label: 'PEEP', value: peep, setter: setPeep, unit: 'cmH₂O' },
    { key: 'spo2' as const, label: 'SpO₂', value: spo2, setter: setSpo2, unit: '%' },
    { key: 'pao2' as const, label: 'PaO₂', value: pao2, setter: setPao2, unit: 'mmHg' },
  ], [rr, peep, spo2, pao2]);

  const handleAutofill = (data: any) => {
    if (clinicalStore.data.rr) setRr(clinicalStore.data.rr);
    if (clinicalStore.data.peep) setPeep(clinicalStore.data.peep);
    if (clinicalStore.data.spo2) setSpo2(clinicalStore.data.spo2);
    if (clinicalStore.data.pao2) setPao2(clinicalStore.data.pao2);
    setRes(null);
  };


  const spo2ToPao2 = (s: number) => {
    if (s <= 88) return 55;
    if (s >= 100) return 145;
    const table = [
      { s: 88, p: 55 }, { s: 90, p: 60 }, { s: 92, p: 70 },
      { s: 94, p: 79 }, { s: 96, p: 93 }, { s: 98, p: 113 }, { s: 100, p: 145 }
    ];
    for (let i = 0; i < table.length - 1; i++) {
      if (s >= table[i].s && s <= table[i+1].s) {
        const frac = (s - table[i].s) / (table[i+1].s - table[i].s);
        return Math.round((table[i].p + frac * (table[i+1].p - table[i].p)) * 10) / 10;
      }
    }
    return 100;
  };

  const getArdsnetPeep = (f: number, higher: boolean) => {
    const tableLower = [ { f: 0.3, p: 5 }, { f: 0.4, p: 5 }, { f: 0.5, p: 8 }, { f: 0.6, p: 10 }, { f: 0.7, p: 10 }, { f: 0.8, p: 10 }, { f: 0.9, p: 14 }, { f: 1.0, p: 14 } ];
    const tableHigher = [ { f: 0.3, p: 5 }, { f: 0.4, p: 8 }, { f: 0.5, p: 10 }, { f: 0.6, p: 14 }, { f: 0.7, p: 14 }, { f: 0.8, p: 16 }, { f: 0.9, p: 18 }, { f: 1.0, p: 22 } ];
    const table = higher ? tableHigher : tableLower;
    let best = table[0];
    let minDiff = Math.abs(f - best.f);
    for (let i = 1; i < table.length; i++) {
      const diff = Math.abs(f - table[i].f);
      if (diff < minDiff) { minDiff = diff; best = table[i]; }
    }
    return best.p;
  };

  const calculate = () => {
    const vIbw = parseFloat(ibw);
    const vVt = parseFloat(vt);
    const vRr = parseFloat(rr);
    const vPpeak = parseFloat(ppeak);
    const vPplat = parseFloat(pplat);
    const vPeep = parseFloat(peep);
    const vFio2 = parseFloat(fio2);
    const vSpo2 = parseFloat(spo2);
    const vPao2 = parseFloat(pao2);

    if (!vVt || !vRr || !vPpeak || !vPplat || isNaN(vPeep)) return;

    const dp = vPplat - vPeep;
    const cstat = dp > 0 ? vVt / dp : 0;
    const vtL = vVt / 1000;
    const mp = 0.098 * vRr * vtL * (vPpeak - Math.abs(dp) / 2);
    
    const ti = 60 / (vRr * 3);
    const flowLSec = (vtL / ti);
    const resist = flowLSec > 0 ? (vPpeak - vPplat) / flowLSec : 0;

    const ve = vtL * vRr;
    
    let pao2Used = null;
    let isEstimated = false;
    if (!isNaN(vPao2) && vPao2 > 0) {
      pao2Used = vPao2;
    } else if (!isNaN(vSpo2) && vSpo2 > 0) {
      pao2Used = spo2ToPao2(vSpo2);
      isEstimated = true;
    }

    let pfRatio = null;
    let oi = null;
    let osi = null;
    const mapVent = (vPpeak + 2 * vPeep) / 3;
    
    if (pao2Used && !isNaN(vFio2)) {
      pfRatio = pao2Used / (vFio2 / 100);
      oi = (vFio2 * mapVent) / pao2Used; 
    }
    
    if (!isNaN(vSpo2) && vSpo2 > 0 && !isNaN(vFio2)) {
       osi = (vFio2 * mapVent) / vSpo2;
    }
    
    let peepLow = null;
    let peepHigh = null;
    if (!isNaN(vFio2)) {
      peepLow = getArdsnetPeep(vFio2 / 100, false);
      peepHigh = getArdsnetPeep(vFio2 / 100, true);
    }

    let warnings = [];
    if (dp > 15) warnings.push(`Driving pressure tinggi (${Math.round(dp)} > 15 cmH₂O) — risiko VILI`);
    if (mp > 17) warnings.push(`Mechanical Power tinggi (${mp.toFixed(1)} > 17 J/min) — risiko VILI`);
    if (cstat > 0 && cstat < 30) warnings.push(`Compliance sangat rendah (${Math.round(cstat)} < 30 mL/cmH₂O)`);
    if (resist > 15) warnings.push(`Resistensi airway meningkat (${resist.toFixed(1)} > 15)`);
    if (vPplat > 30) warnings.push(`Pplat > 30 cmH₂O — bahaya barotrauma`);
    if (pfRatio && pfRatio < 150) warnings.push(`P/F < 150 — pertimbangkan prone positioning (PROSEVA)`);
    if (ve > 12) warnings.push(`Minute ventilation tinggi (${ve.toFixed(1)} L/mnt)`);
    if (ve < 5) warnings.push(`Minute ventilation rendah (${ve.toFixed(1)} L/mnt) — risiko hipoventilasi`);

    let vtIbw = '';
    let vtSug = '';
    if (vIbw > 0) {
      const vkg = vVt / vIbw;
      vtIbw = vkg.toFixed(1);
      if (kondisi === 'ards') {
         vtSug = `Target 4-6 mL/kg IBW: ${(4*vIbw).toFixed(0)} - ${(6*vIbw).toFixed(0)} mL`;
         if (vkg > 6) warnings.push(`VT > 6 mL/kg IBW pada ARDS`);
      } else if (kondisi === 'copd') {
         vtSug = `Target 7-8 mL/kg IBW: ${(7*vIbw).toFixed(0)} - ${(8*vIbw).toFixed(0)} mL`;
      } else {
         vtSug = `Target 6-8 mL/kg IBW: ${(6*vIbw).toFixed(0)} - ${(8*vIbw).toFixed(0)} mL`;
      }
    }

    setRes({ 
      dp, cstat, mp, resist, ve, vtIbw, vtSug, 
      pao2Used, isEstimated, pfRatio, oi, osi,
      peepLow, peepHigh, mapVent,
      warnings 
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 overflow-x-hidden">
      
      {/* Active Patient Widget & Sync Banner */}
      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />

      <div className="flex flex-col gap-0 mt-2">
        <h2 className="mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          Parameter Ventilator Lanjutan
        </h2>
         
        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex justify-between px-4 py-3 items-center gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left w-24">Kondisi</span>
            <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={kondisi} onChange={e=>setKondisi(e.target.value)}>
              <option value="normal">Normal / Post-op</option>
              <option value="ards">ARDS</option>
              <option value="copd">PPOK</option>
            </select>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">IBW (kg)</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={ibw} onChange={e=>setIbw(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">FiO₂ (%)</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={fio2} onChange={e=>setFio2(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Tidal Vol. (mL)</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={vt} onChange={e=>setVt(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Resp Rate (/m)</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={rr} onChange={e=>setRr(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4 bg-red-50/50 dark:bg-red-900/10">
            <span className="text-[13px] font-semibold text-red-700 dark:text-red-400 flex-shrink-0">Ppeak</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-red-50 dark:bg-red-900/20 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-red-700 dark:text-red-400 placeholder:text-red-300 focus:ring-2 focus:ring-red-500/50 text-[14px] transition-all" value={ppeak} onChange={e=>setPpeak(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4 bg-red-50/50 dark:bg-red-900/10">
            <span className="text-[13px] font-semibold text-red-700 dark:text-red-400 flex-shrink-0">Pplat</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-red-50 dark:bg-red-900/20 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-red-700 dark:text-red-400 placeholder:text-red-300 focus:ring-2 focus:ring-red-500/50 text-[14px] transition-all" value={pplat} onChange={e=>setPplat(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4 bg-blue-50/50 dark:bg-blue-900/10">
            <span className="text-[13px] font-semibold text-blue-700 dark:text-blue-400 flex-shrink-0">PEEP</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-blue-50 dark:bg-blue-900/20 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-blue-700 dark:text-blue-400 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={peep} onChange={e=>setPeep(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4 bg-teal-50/50 dark:bg-teal-900/10">
            <span className="text-[13px] font-semibold text-teal-700 dark:text-teal-400 flex-shrink-0">SpO₂ (%)</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-teal-50 dark:bg-teal-900/20 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-teal-700 dark:text-teal-400 placeholder:text-teal-300 focus:ring-2 focus:ring-teal-500/50 text-[14px] transition-all" placeholder="opsional" value={spo2} onChange={e=>setSpo2(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4 bg-teal-50/50 dark:bg-teal-900/10">
            <span className="text-[13px] font-semibold text-teal-700 dark:text-teal-400 flex-shrink-0">PaO₂ (mmHg)</span>
            <div className="flex-1 flex items-center justify-end gap-2">
               <input type="number" className="w-full bg-teal-50 dark:bg-teal-900/20 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-teal-700 dark:text-teal-400 placeholder:text-teal-300 focus:ring-2 focus:ring-teal-500/50 text-[14px] transition-all" placeholder="opsional" value={pao2} onChange={e=>setPao2(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button onClick={calculate} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px]">
          Hitung Mekanik Paru & Oksigenasi
        </button>
      </div>

      {res && (
        <div className="mt-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            
            <div className="grid grid-cols-2 p-4 gap-4 bg-slate-50 dark:bg-[#1C1C1E]">
              <div className={`p-3 rounded-xl border ${res.dp > 15 ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-white dark:bg-[#2C2C2E] border-slate-200 dark:border-slate-700'}`}>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Driving Pressure</div>
                <div className={`text-2xl font-black ${res.dp > 15 ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                  {Math.round(res.dp)} <span className="text-[12px] font-semibold opacity-70">cmH₂O</span>
                </div>
                <div className="text-[10px] font-medium opacity-60 mt-0.5">Target &le; 15</div>
              </div>
              <div className={`p-3 rounded-xl border ${res.mp > 17 ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' : 'bg-white dark:bg-[#2C2C2E] border-slate-200 dark:border-slate-700'}`}>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Mech. Power</div>
                <div className={`text-2xl font-black ${res.mp > 17 ? 'text-orange-600 dark:text-orange-400' : 'text-slate-800 dark:text-slate-200'}`}>
                  {res.mp.toFixed(1)} <span className="text-[12px] font-semibold opacity-70">J/min</span>
                </div>
                <div className="text-[10px] font-medium opacity-60 mt-0.5">Target &lt; 17</div>
              </div>
            </div>

            <div className="grid grid-cols-2 p-4 gap-4 pb-5">
              <div className="text-center">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">C-Stat</div>
                <div className="text-[16px] font-bold text-slate-800 dark:text-slate-200">
                  {Math.round(res.cstat)} <span className="text-[12px] font-normal text-slate-500">mL/cmH₂O</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Resistensi</div>
                <div className="text-[16px] font-bold text-slate-800 dark:text-slate-200">
                  {res.resist.toFixed(1)} <span className="text-[12px] font-normal text-slate-500">cmH₂O/L/s</span>
                </div>
              </div>
              
              {res.pfRatio && (
                <div className="text-center col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">P/F Ratio & Berlin ARDS</div>
                  <div className={`text-[18px] font-bold ${res.pfRatio < 300 ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {Math.round(res.pfRatio)}
                  </div>
                  <div className="text-[12px] text-slate-500 mt-1">
                    {res.isEstimated && <i>(Estimasi dari SpO₂) </i>}
                    {res.pfRatio >= 300 ? 'Tidak memenuhi kriteria ARDS' : res.pfRatio >= 200 ? 'ARDS Ringan (200-300)' : res.pfRatio >= 100 ? 'ARDS Sedang (100-200)' : 'ARDS Berat (<100)'}
                  </div>
                </div>
              )}
              
              {res.oi !== null && (
                <div className="text-center col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">OI (Oxygenation Index)</div>
                  <div className="text-[15px] font-semibold text-slate-800 dark:text-slate-200">
                    {res.oi.toFixed(1)}
                  </div>
                </div>
              )}

              <div className="text-center col-span-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Min. Ventilation</div>
                <div className="text-[15px] font-semibold text-slate-800 dark:text-slate-200">
                  {res.ve.toFixed(1)} <span className="text-[12px] font-normal text-slate-500">L/min</span>
                </div>
              </div>
              
              {res.vtIbw && (
                <div className="text-center col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">VT per IBW</div>
                  <div className="text-[15px] font-semibold text-blue-600 dark:text-blue-400">
                    {res.vtIbw} mL/kg
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">{res.vtSug}</div>
                </div>
              )}
            </div>

            {res.peepLow !== null && (
              <div className="p-4 bg-sky-50 dark:bg-sky-900/10 border-t border-sky-100 dark:border-sky-900/30">
                <div className="font-bold flex items-center gap-1.5 mb-3 text-[13px] text-sky-700 dark:text-sky-400">
                  <Settings className="w-4 h-4"/> ARDSNet PEEP-FiO₂ Ladder 
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                   <div className="bg-white/60 dark:bg-black/20 p-2 rounded-xl border border-sky-200/50 dark:border-sky-800/50">
                      <div className="text-[10px] text-sky-600/80 dark:text-sky-400/80 font-bold uppercase tracking-wide">Lower PEEP</div>
                      <div className="text-lg font-black text-sky-700 dark:text-sky-300">{res.peepLow} <span className="text-[10px] font-normal">cmH₂O</span></div>
                      <div className="text-[9px] text-sky-600/60 mt-0.5">ARDS Ringan/Sedang</div>
                   </div>
                   <div className="bg-white/60 dark:bg-black/20 p-2 rounded-xl border border-sky-200/50 dark:border-sky-800/50">
                      <div className="text-[10px] text-sky-600/80 dark:text-sky-400/80 font-bold uppercase tracking-wide">Higher PEEP</div>
                      <div className="text-lg font-black text-sky-700 dark:text-sky-300">{res.peepHigh} <span className="text-[10px] font-normal">cmH₂O</span></div>
                      <div className="text-[9px] text-sky-600/60 mt-0.5">ARDS Berat / Recruitment</div>
                   </div>
                </div>
                <div className="text-[10px] text-sky-600/70 dark:text-sky-400/70 mt-3 text-center">
                   FiO₂ Saat Ini: {fio2}% | MAP: {res.mapVent.toFixed(1)} cmH₂O
                </div>
              </div>
            )}

            {res.warnings && res.warnings.length > 0 && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border-t border-slate-100 dark:border-slate-800">
                <div className="font-bold flex items-center gap-1.5 mb-2 text-[13px] text-amber-700 dark:text-amber-500">
                  <AlertTriangle className="w-4 h-4"/> Peringatan Terdeteksi
                </div>
                <ul className="list-disc pl-5 space-y-1.5">
                  {res.warnings.map((w: string, i: number) => (
                    <li key={i} className="text-[12px] text-amber-700/80 dark:text-amber-400/80 leading-snug">{w}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
               <SaveToHistoryButton 
                 module="ventilator_adv" 
                 label={`Ventilator Adv — DP: ${Math.round(res.dp)} cmH₂O`}
                 inputs={{ kondisi, ibw, vt, rr, fio2, ppeak, pplat, peep, spo2, pao2 }}
                 summary={`Driving Pressure: ${Math.round(res.dp)} cmH₂O, Mech. Power: ${res.mp.toFixed(1)} J/min${res.pfRatio ? `, P/F: ${Math.round(res.pfRatio)}` : ''}`}
                 className="w-full"
               />
            </div>
          </div>
        </div>
      )}

      <Accordion title="📖 Teori & Referensi: Mekanik Paru Lanjutan">
        <ul className="pl-4 space-y-2 mb-4 list-disc text-slate-600 dark:text-slate-400 text-[13px] leading-relaxed">
          <li><strong className="text-slate-800 dark:text-slate-200">Compliance Statis (Cstat):</strong> Elastisitas paru dan dinding dada. Cstat = Vol Tidal / (Pplat - PEEP). Normal &gt; 60 mL/cmH2O. Pada ARDS, paru menjadi "kaku" sehingga compliance menurun signifikan (&lt; 40 mL/cmH2O). Penurunan Cstat meningkatkan driving pressure.</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Mechanical Power (MP):</strong> Ukuran total energi mekanik yang dihantarkan ke paru oleh ventilator setiap menit (diukur dalam Joule/menit). Meliputi volume, tekanan, dan laju pernapasan (RR). MP &gt; 17 J/min dikaitkan erat dengan Ventilator-Induced Lung Injury (VILI).</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Resistensi Jalan Napas (Raw):</strong> Hambatan struktural pada bronkus/ETT (tube). Raw = (Ppeak - Pplat) / Flow (diubah ke L/s). Normal &lt; 10 cmH2O/L/s (dengan ETT).</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Oxygenation Index (OI):</strong> Mengukur keparahan gagal napas dengan mempertimbangkan tekanan jalan napas. OI = (FiO2 × MAP) / PaO2.</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 Gattinoni L et al. (2016) Mechanical power. Intensive Care Med; Amato MBP et al. (2015) Driving pressure and survival in ARDS. NEJM; ARDSNet Guidelines.
        </div>
      </Accordion>
    </div>
  );
}
