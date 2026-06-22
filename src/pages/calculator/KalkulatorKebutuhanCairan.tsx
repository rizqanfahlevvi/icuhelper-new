import React, { useState, useEffect, useMemo } from 'react';
import { Droplets, AlertTriangle, AlertCircle, Info, Wind } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';

export default function KalkulatorKebutuhanCairan() {
  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();

  // Box 1
  const [bw, setBw] = useState('');
  const [targetMaint, setTargetMaint] = useState('25');
  const [b1Res, setB1Res] = useState<any>(null);

  // Box 2
  const [rose, setRose] = useState('');
  const [temp, setTemp] = useState('37.0');
  const [vent, setVent] = useState('spontan');
  const [sweat, setSweat] = useState('none');
  const [uoTgt, setUoTgt] = useState('0.5');
  const [ngt, setNgt] = useState('');
  const [drain, setDrain] = useState('');
  const [other, setOther] = useState('');
  const [b2Res, setB2Res] = useState<any>(null);

  // Auto-load on mount
  useEffect(() => {
    const parentWeight = patient.weightKg || clinicalStore.data.weight || '';
    if (parentWeight) {
      setBw(parentWeight);
    }
    const parentTemp = clinicalStore.data.temp || '';
    if (parentTemp) {
      setTemp(parentTemp);
    }
  }, []);

  // Sync fields
  const syncFields = useMemo(() => [
    { key: 'weight' as const, label: 'Berat Badan', value: bw, setter: setBw, unit: 'kg' },
    { key: 'temp' as const, label: 'Suhu Tubuh', value: temp, setter: setTemp, unit: '°C' },
  ], [bw, temp]);

  const handleAutofill = (data: { weightKg: string; temp?: string }) => {
    if (data.weightKg) setBw(data.weightKg);
    if (data.temp) setTemp(data.temp);
    setB1Res(null);
    setB2Res(null);
  };

  const calcBasal = () => {
    const w = parseFloat(bw);
    const t = parseInt(targetMaint);
    if (!w) return;

    const icuDay = w * t;
    const icuHr = icuDay / 24;

    let hs;
    if (w <= 10) hs = w * 100;
    else if (w <= 20) hs = 1000 + (w - 10) * 50;
    else hs = 1500 + (w - 20) * 20;

    const diff = hs - icuDay;
    const diffPct = Math.round((diff / hs) * 100);

    setB1Res({ icuDay, icuHr, hs, diff, diffPct });
  };

  const calcCorrection = () => {
    const w = parseFloat(bw);
    const tm = parseFloat(temp) || 37;
    const ut = parseFloat(uoTgt) || 0.5;
    const n = parseFloat(ngt) || 0;
    const d = parseFloat(drain) || 0;
    const o = parseFloat(other) || 0;

    if (!w) return;

    const t = parseInt(targetMaint) || 25;
    const maint = w * t;

    let iwlBase;
    if (vent === 'ventilator') iwlBase = w * 6.5;
    else if (vent === 'hfnc') iwlBase = w * 9;
    else iwlBase = w * 12;

    let tempCorr = 0;
    const tDelta = tm - 37.5;
    if (tDelta > 0) tempCorr = maint * 0.10 * tDelta;

    const sMap: any = { none: 0, mild: 200, moderate: 500, severe: 900 };
    const sweatCorr = sMap[sweat] || 0;

    const iwlTotal = iwlBase + tempCorr + sweatCorr;
    const uoDay = ut * w * 24;

    const total = maint + iwlTotal + uoDay + n + d + o;

    setB2Res({ maint, iwlBase, tempCorr, sweatCorr, iwlTotal, uoDay, n, d, o, total });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />
      
      {/* SECTION 1: Kebutuhan Cairan Basal */}
      <div className="flex flex-col gap-0">
        <h2 className="mt-2 mb-2 px-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          Kebutuhan Cairan Basal ICU
        </h2>
        
        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mx-4">
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Berat Badan</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input 
                type="number" 
                value={bw} 
                onChange={e => {setBw(e.target.value); setB1Res(null); setB2Res(null);}} 
                placeholder="70" 
                className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
              />
              <span className="text-xs font-semibold text-slate-500 w-10 text-left">kg</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Target Maint.</span>
            <select 
              className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" 
              value={targetMaint} 
              onChange={e => setTargetMaint(e.target.value)}
            >
              <option value="20">20 mL/kg/hari (Restriksi)</option>
              <option value="25">25 mL/kg/hari (Standar)</option>
              <option value="30">30 mL/kg/hari (Liberal)</option>
              <option value="35">35 mL/kg/hari (Tinggi)</option>
            </select>
          </div>
        </div>

        <div className="px-4 mt-4">
          <button onClick={calcBasal} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px]">
             Hitung Cairan Basal
          </button>
        </div>

          {b1Res && (
            <div className="mt-4 px-4 pb-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <h2 className="mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Hasil Kalkulasi Basal
              </h2>
              <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 grid grid-cols-2">
                <div className="p-4 flex flex-col items-center justify-center text-center bg-blue-50/50 dark:bg-blue-900/10">
                  <div className="text-[12px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">Restriksi Rasional</div>
                  <div className="font-mono text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {b1Res.icuDay.toFixed(0)} <span className="text-[11px] font-sans font-medium text-blue-600/70 dark:text-blue-400/70">mL/hari</span>
                  </div>
                  <div className="text-[12px] text-blue-600/80 dark:text-blue-400/80 mt-1">Rate infus: {b1Res.icuHr.toFixed(1)} mL/jam</div>
                </div>
                <div className="p-4 flex flex-col items-center justify-center text-center border-l border-slate-100 dark:border-slate-800">
                  <div className="text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Form. Holliday-Segar</div>
                  <div className="font-mono text-2xl font-bold text-slate-700 dark:text-slate-300">
                    {b1Res.hs.toFixed(0)} <span className="text-[11px] font-sans font-medium text-slate-500/70 dark:text-slate-400/70">mL/hari</span>
                  </div>
                  <div className="text-[12px] text-amber-600 dark:text-amber-400 font-medium mt-1">Selisih {b1Res.diff.toFixed(0)} mL ({b1Res.diffPct}%)</div>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* SECTION 2: Koreksi & Total */}
      <div className="flex flex-col gap-0 mt-4">
        <h2 className="mt-2 mb-2 px-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          Faktor Koreksi & Total Kebutuhan
        </h2>
        
        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mx-4">
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Suhu Tubuh</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input 
                type="number" step="0.1"
                value={temp} 
                onChange={e => setTemp(e.target.value)} 
                placeholder="37.0" 
                className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
              />
              <span className="text-xs font-semibold text-slate-500 w-10 text-left">°C</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Status Ventilasi</span>
            <select 
              className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" 
              value={vent} onChange={e => setVent(e.target.value)}
            >
              <option value="spontan">Napas spontan</option>
              <option value="ventilator">Ventilator mekanik</option>
              <option value="hfnc">HFNC / NIV</option>
            </select>
          </div>

          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Diaphoresis</span>
            <select 
              className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" 
              value={sweat} onChange={e => setSweat(e.target.value)}
            >
              <option value="none">Tidak ada</option>
              <option value="mild">Ringan (+200 mL)</option>
              <option value="moderate">Sedang (+500 mL)</option>
              <option value="severe">Berat (+900 mL)</option>
            </select>
          </div>

          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Target UO</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input 
                type="number" step="0.1"
                value={uoTgt} 
                onChange={e => setUoTgt(e.target.value)} 
                placeholder="0.5" 
                className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
              />
              <span className="text-[11px] font-semibold text-slate-500 w-12 text-left">mL/kg/j</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-[#1C1C1E]">
            <span className="font-bold text-[10px] uppercase tracking-wider text-slate-700 dark:text-slate-300 select-none">Output Ekstra (mL/hari)</span>
          </div>

          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">NGT / GT</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input 
                type="number" value={ngt} onChange={e => setNgt(e.target.value)} placeholder="0" 
                className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
              />
              <span className="text-xs font-semibold text-slate-500 w-10 text-left">mL</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Drain / Kateter</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input 
                type="number" value={drain} onChange={e => setDrain(e.target.value)} placeholder="0" 
                className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
              />
              <span className="text-xs font-semibold text-slate-500 w-10 text-left">mL</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Lainnya</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input 
                type="number" value={other} onChange={e => setOther(e.target.value)} placeholder="0" 
                className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all"
              />
              <span className="text-xs font-semibold text-slate-500 w-10 text-left">mL</span>
            </div>
          </div>
        </div>

        <div className="px-4 mt-4">
          <button onClick={calcCorrection} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px]">
             Hitung Total Kebutuhan
          </button>
        </div>

          {b2Res && (
            <div className="mt-4 px-4 pb-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <h2 className="mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Hasil Total Kebutuhan
              </h2>
              <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                <div className="p-4 bg-slate-50 dark:bg-[#2C2C2E]">
                  <div className="space-y-1.5 mb-2">
                    <div className="flex justify-between text-[13px] text-slate-700 dark:text-slate-300"><span>Maintenance Basal</span><span className="font-mono text-slate-700 dark:text-slate-300">{b2Res.maint.toFixed(0)} mL</span></div>
                    <div className="flex justify-between text-[13px] text-slate-700 dark:text-slate-300"><span>IWL Base</span><span className="font-mono text-slate-700 dark:text-slate-300">{b2Res.iwlBase.toFixed(0)} mL</span></div>
                    {b2Res.tempCorr > 0 && <div className="flex justify-between text-[13px] font-medium text-slate-700 dark:text-slate-200"><span>Koreksi Suhu</span><span className="font-mono text-amber-500">+{b2Res.tempCorr.toFixed(0)} mL</span></div>}
                    {b2Res.sweatCorr > 0 && <div className="flex justify-between text-[13px] font-medium text-slate-700 dark:text-slate-200"><span>Diaphoresis</span><span className="font-mono text-amber-500">+{b2Res.sweatCorr.toFixed(0)} mL</span></div>}
                    <div className="flex justify-between text-[13px] text-slate-700 dark:text-slate-300"><span>Target UO</span><span className="font-mono text-slate-700 dark:text-slate-300">{b2Res.uoDay.toFixed(0)} mL</span></div>
                    {(b2Res.n > 0 || b2Res.d > 0 || b2Res.o > 0) && (
                      <div className="flex justify-between text-[13px] font-medium border-t border-slate-200 dark:border-slate-700 pt-2 mt-2 text-slate-700 dark:text-slate-200"><span>Output Ekstra</span><span className="font-mono">{(b2Res.n + b2Res.d + b2Res.o).toFixed(0)} mL</span></div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center py-6 bg-indigo-50 dark:bg-indigo-900/10">
                  <div className="text-[12px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-1">Total Cairan (Net Zero)</div>
                  <div className="font-mono text-4xl font-bold text-indigo-600 dark:text-indigo-400 leading-tight">
                    {b2Res.total.toFixed(0)} <span className="text-[14px] text-indigo-500/70 font-sans font-medium">mL/hari</span>
                  </div>
                  <div className="text-[13px] text-indigo-600/80 dark:text-indigo-400/80 font-medium mt-1">Rate infus tunggal: {(b2Res.total/24).toFixed(1)} mL/jam</div>
                </div>
              </div>
            </div>
          )}
      </div>

      <Accordion title="📖 Teori & Referensi: Terapi Cairan & IWL">
        <ul className="pl-4 space-y-1 list-disc text-muted-foreground text-sm">
          <li><strong className="text-foreground">Maintenance Cairan:</strong> Panduan NICE menyarankan 25-30 mL/kg/hari untuk Maintenance pasien dewasa normal. Formula 4-2-1 Holiday-Segar lebih umum dipakai pada pediatrik namun dapat diaplikasikan kasar sebagai batas laju infus rumatan per jam.</li>
          <li><strong className="text-foreground">Insensible Water Loss (IWL):</strong> Estimasi kehilangan cairan dari respirasi dan kulit yang tidak terukur. Normal dewasa: 15 mL/kg/hari. Perjalanan napas cepat (Takipnea) dan Demam sangat meningkatkan IWL (tiap kenaikan 1&deg;C di atas 37&deg;C menambah IWL sebesar 10-15%).</li>
          <li><strong className="text-foreground">Koreksi Suhu:</strong> Pasien febris &gt; 38&deg;C dengan BB 60 kg bisa memiliki IWL tambahan ratusan mL per harinya. Pasien dengan ventilator humidifikasi umumnya IWL-nya berkurang.</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 NICE Guideline (2013) Intravenous fluid therapy in adults; Malbrain ML et al. (2014) Fluid overload.
        </div>
      </Accordion>
    </div>
  );
}
