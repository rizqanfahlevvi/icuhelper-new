import React, { useState, useEffect, useMemo } from 'react';
import { Syringe, AlertTriangle } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';

const PUMP_CATEGORIES = {
  sedasi:      [['fentanyl','Fentanyl'],['morphin','Morfin'],['midazolam','Midazolam'],['propofol','Propofol 1%'],['dexmed','Dexmedetomidine'],['thiopental','Thiopental (Tiopol)']],
  vasopressor: [['norepinef','Norepinefrin'],['epinefrin','Epinefrin'],['dopamin','Dopamin'],['dobutamin','Dobutamin'],['vasopressin','Vasopressin'],['phenylephrine','Phenylephrine (Phenerin)']],
  antiaritmia: [['amiodarone','Amiodaron'],['lidokain','Lidokain']],
  diuretik:    [['furosemide','Furosemide']],
  lainnya:     [['atrakurium','Atrakurium'],['cisatrakurium','Cisatrakurium'],['nitrogliserin','Nitrogliserin']]
};

const PUMP_INFO: Record<string, {info:string, unit:string, conc:number}> = {
  fentanyl:     { info:'Dosis: 25–200 mcg/kg/jam. Syringe: 500 mcg dalam 50 mL NaCl = 10 mcg/mL.', unit:'mcg/kg/jam', conc:10 },
  morphin:      { info:'Dosis: 20–80 mcg/kg/jam. Syringe: 20 mg dalam 20 mL NaCl = 1 mg/mL.', unit:'mcg/kg/jam', conc:1000 },
  midazolam:    { info:'Dosis: 0.02–0.1 mg/kg/jam. Syringe: 50 mg dalam 50 mL NaCl = 1 mg/mL.', unit:'mg/kg/jam', conc:1 },
  propofol:     { info:'Dosis: 5–80 mcg/kg/mnt. Syringe: Propofol 1% (10 mg/mL) langsung pakai.', unit:'mcg/kg/mnt', conc:10000 },
  dexmed:       { info:'Dosis: 0.2–1.4 mcg/kg/jam. Syringe: 200 mcg dalam 50 mL NaCl = 4 mcg/mL.', unit:'mcg/kg/jam', conc:4 },
  thiopental:   { info:'Dosis drip: 1–5 mg/kg/jam. Syringe: 500 mg dalam 50 mL NaCl = 10 mg/mL.', unit:'mg/kg/jam', conc:10 },
  norepinef:    { info:'Dosis: 0.01–1 mcg/kg/mnt. Syringe: 4 mg dalam 50 mL D5% = 80 mcg/mL.', unit:'mcg/kg/mnt', conc:80 },
  epinefrin:    { info:'Dosis: 0.01–1 mcg/kg/mnt. Syringe: 4 mg dalam 50 mL D5% = 80 mcg/mL.', unit:'mcg/kg/mnt', conc:80 },
  dopamin:      { info:'Dosis: 2–20 mcg/kg/mnt. Syringe: 200 mg dalam 50 mL NaCl = 4000 mcg/mL.', unit:'mcg/kg/mnt', conc:4000 },
  dobutamin:    { info:'Dosis: 2–20 mcg/kg/mnt. Syringe: 250 mg dalam 50 mL NaCl = 5000 mcg/mL.', unit:'mcg/kg/mnt', conc:5000 },
  vasopressin:  { info:'Dosis: 0.01–0.04 units/mnt. Syringe: 20 unit dalam 100 mL NaCl = 0.2 unit/mL.', unit:'units/mnt', conc:0.2 },
  phenylephrine:{ info:'Dosis: 0.05–6 mcg/kg/mnt. Syringe: 10 mg dalam 100 mL NaCl = 100 mcg/mL.', unit:'mcg/kg/mnt', conc:100 },
  amiodarone:   { info:'Maintenance: 0.5–1 mg/mnt. Syringe: 450 mg dalam 250 mL D5% = 1.8 mg/mL.', unit:'mg/mnt', conc:1.8 },
  lidokain:     { info:'Dosis: 1–4 mg/mnt. Syringe: 1000 mg dalam 500 mL D5% = 2 mg/mL.', unit:'mg/mnt', conc:2 },
  furosemide:   { info:'Dosis drip: 5–20 mg/jam. Syringe: 100 mg dalam 100 mL NaCl 0.9% = 1 mg/mL.', unit:'mg/jam', conc:1 },
  atrakurium:   { info:'Dosis: 5–12 mcg/kg/mnt. Syringe: 250 mg dalam 50 mL NaCl = 5 mg/mL.', unit:'mcg/kg/mnt', conc:5000 },
  cisatrakurium:{ info:'Dosis: 1–3 mcg/kg/mnt. Syringe: 20 mg dalam 20 mL NaCl = 1 mg/mL.', unit:'mcg/kg/mnt', conc:1000 },
  nitrogliserin:{ info:'Dosis: 10–200 mcg/mnt. Syringe: 50 mg dalam 50 mL D5% = 1 mg/mL.', unit:'mcg/mnt', conc:1000 }
};

export default function KalkulatorPump() {
  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();

  const [bb, setBb] = useState('');
  const [cat, setCat] = useState<keyof typeof PUMP_CATEGORIES>('sedasi');
  const [drug, setDrug] = useState('fentanyl');
  const [dose, setDose] = useState('');
  const [vol, setVol] = useState('50');
  const [result, setResult] = useState<any>(null);

  // Auto-load on mount
  useEffect(() => {
    const parentWeight = patient.weightKg || clinicalStore.data.weight || '';
    if (parentWeight) setBb(parentWeight);
  }, []);

  const syncFields = useMemo(() => [
    { key: 'weight' as const, label: 'Berat Badan', value: bb, setter: setBb, unit: 'kg' },
  ], [bb]);

  const handleAutofill = (data: { weightKg: string }) => {
    if (data.weightKg) setBb(data.weightKg);
    setResult(null);
  };


  const handleCatChange = (e: any) => {
    const c = e.target.value;
    setCat(c);
    setDrug(PUMP_CATEGORIES[c as keyof typeof PUMP_CATEGORIES][0][0]);
    setResult(null);
  };

  const calculate = () => {
    const b = parseFloat(bb);
    const d = parseFloat(dose);
    const v = parseFloat(vol);
    if (!b || !d || !v) return;

    const info = PUMP_INFO[drug];
    if (!info) return;

    const unit = info.unit;
    const conc = info.conc;
    let rateMlH = 0;

    if (unit === 'mg/jam') {
      rateMlH = d / conc;
    } else if (unit === 'mg/mnt' || unit === 'mcg/mnt' || unit === 'units/mnt') {
      rateMlH = (d * 60) / conc;
    } else if (unit === 'mcg/kg/jam' || unit === 'mg/kg/jam') {
      rateMlH = (d * b) / conc;
    } else {
      rateMlH = (d * b * 60) / conc;
    }

    const duration = (v / rateMlH).toFixed(1);
    const isFlatDose = (unit === 'mg/jam' || unit === 'mg/mnt' || unit === 'mcg/mnt' || unit === 'units/mnt');

    setResult({ rate: rateMlH.toFixed(2), duration, unit, isFlatDose, info: info.info, b, d, v });
  };

  const info = PUMP_INFO[drug];

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Active Patient Widget & Sync Banner */}
      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />

      <div className="flex flex-col gap-0 mt-2">
        <h2 className="mb-2 px-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          Parameter Syringe Pump
        </h2>

        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mx-4">
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Berat Badan</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={bb} onChange={e=>setBb(e.target.value)} placeholder="70" />
              <span className="text-xs font-semibold text-slate-500 w-10 text-left">kg</span>
            </div>
          </div>

          <div className="flex justify-between px-4 py-3 items-center gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left max-w-[120px]">Kategori</span>
            <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all overflow-hidden text-ellipsis" value={cat} onChange={handleCatChange}>
              <option value="sedasi">💊 Sedasi / Analgetik</option>
              <option value="vasopressor">🫀 Vasopressor / Inotropik</option>
              <option value="antiaritmia">⚡ Antiaritmia</option>
              <option value="diuretik">💧 Diuretik</option>
              <option value="lainnya">🔧 Lainnya</option>
            </select>
          </div>

          <div className="flex justify-between px-4 py-3 items-center gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left max-w-[60px]">Obat</span>
            <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all overflow-hidden text-ellipsis" value={drug} onChange={e=>{setDrug(e.target.value); setResult(null);}}>
              {PUMP_CATEGORIES[cat].map(pair => (
                <option key={pair[0]} value={pair[0]}>{pair[1]}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 truncate w-24">Dosis</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" step="0.01" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={dose} onChange={e=>setDose(e.target.value)} />
              <span className="text-[11px] font-semibold text-slate-500 w-20 text-left line-clamp-1">{info?.unit}</span>
            </div>
          </div>

          <div className="flex justify-between px-4 py-3 items-center gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left max-w-[120px]">Spuit / Pelarut</span>
            <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={vol} onChange={e=>setVol(e.target.value)}>
              <option value="50">50 mL</option>
              <option value="25">25 mL</option>
              <option value="10">10 mL</option>
            </select>
          </div>
        </div>
      </div>

      <div className="px-4">
        {info && (
          <div className="bg-slate-100 dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-4">
            <h3 className="font-bold text-[13px] mb-1.5 text-slate-800 dark:text-slate-200">{PUMP_CATEGORIES[cat].find(p=>p[0]===drug)?.[1]}</h3>
            <p className="text-[13px] text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">{info.info}</p>
            <div className="inline-block px-2 py-1 bg-white dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded text-[11px] font-mono text-slate-700 dark:text-slate-300">{info.unit}</div>
          </div>
        )}
        <button onClick={calculate} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px]">
          Hitung Laju (mL/jam)
        </button>
      </div>

      {result && (
        <div className="px-4 mt-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            <div className="p-5 text-center bg-blue-50 dark:bg-blue-900/10">
              <div className="text-[12px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Rate Laju Syringe Pump</div>
              <div className="text-4xl font-black text-blue-700 dark:text-blue-300">
                {result.rate} <span className="text-[15px] font-semibold text-blue-600/70 dark:text-blue-400/70">mL/jam</span>
              </div>
            </div>
            <div className="grid grid-cols-2 p-4 gap-4 bg-white dark:bg-[#1C1C1E]">
              <div className="text-center">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Syringe & Durasi</div>
                <div className="font-bold text-[14px] text-slate-800 dark:text-slate-200">{result.v} mL / {result.duration} jam</div>
              </div>
              <div className="text-center">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Dosis Aktual</div>
                <div className="font-bold text-[14px] text-slate-800 dark:text-slate-200">{result.d} <span className="text-xs font-normal text-slate-500">{result.unit}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Accordion title="📖 Teori & Referensi: Syringe Pump & Titrasi">
        <ul className="pl-4 space-y-1 list-disc text-muted-foreground text-sm">
          <li><strong className="text-foreground">Prinsip Konsentrasi:</strong> Kecepatan jalan syringe pump (cc/jam atau mL/jam) ditentukan oleh Konsentrasi Obat (Pengenceran). Semakin pekat konsentrasinya, semakin lambat mL/jam yang diberikan untuk mencapai dosis target yang sama.</li>
          <li><strong className="text-foreground">Rumus Dasar Titrasi:</strong><br />
            - mcg/kg/menit = (Rate [mL/jam] &times; Konsentrasi [mcg/mL]) / (BB [kg] &times; 60 menit)<br />
            - Rate [mL/jam] = (Target Dosis [mcg/kg/menit] &times; BB [kg] &times; 60 menit) / Konsentrasi [mcg/mL].</li>
          <li><strong className="text-foreground">Receptor Vasopressor (Inotropik/Vasokonstriktor):</strong> Norepinefrin lebih condong ke Alpha-1 (vasokonstriksi), Epinefrin memiliki efek Beta-1 predominan pada dosis rendah namun efek Alpha mendominasi pada dosis lebih tinggi.</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 Overgaard CB et al. (2008) Inotropes and vasopressors. Circulation; Levy B et al. Intensive Care Med.
        </div>
      </Accordion>
    </div>
  );
}
