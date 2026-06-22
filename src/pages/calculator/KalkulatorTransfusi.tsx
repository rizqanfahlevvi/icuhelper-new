import React, { useState, useEffect, useMemo } from 'react';
import { Droplets, AlertTriangle } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';

export default function KalkulatorTransfusi() {
  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();

  const [tab, setTab] = useState<'prc' | 'wb' | 'ffp' | 'tc' | 'cryo'>('prc');

  const [hb, setHb] = useState('');
  const [hbt, setHbt] = useState('');
  const [bb, setBb] = useState('');
  const [sex, setSex] = useState('m');
  const [premed, setPremed] = useState('none');

  const [ffpDose, setFfpDose] = useState('15');
  const [ffpInr, setFfpInr] = useState('');

  const [tcPlt, setTcPlt] = useState('');
  const [tcPltt, setTcPltt] = useState('');
  const [tcType, setTcType] = useState('rd');

  const [cryoFib, setCryoFib] = useState('');
  const [cryoTarget, setCryoTarget] = useState('150');

  const [res, setRes] = useState<any>(null);

  // Auto-loaded on mount
  useEffect(() => {
    const parentWeight = patient.weightKg || clinicalStore.data.weight || '';
    if (parentWeight) setBb(parentWeight);

    if (clinicalStore.data.hb) setHb(clinicalStore.data.hb);
    if (clinicalStore.data.trombosit) setTcPlt(clinicalStore.data.trombosit);

    const parentGender = patient.gender || clinicalStore.data.gender || '';
    if (parentGender) setSex(parentGender.toLowerCase() === 'p' ? 'f' : 'm');
  }, []);

  const syncFields = useMemo(() => [
    { key: 'weight' as const, label: 'Berat Badan', value: bb, setter: setBb, unit: 'kg' },
    { key: 'hb' as const, label: 'Hemoglobin', value: hb, setter: setHb, unit: 'g/dL' },
    { key: 'trombosit' as const, label: 'Trombosit', value: tcPlt, setter: setTcPlt, unit: '10³/µL' },
  ], [bb, hb, tcPlt]);

  const handleAutofill = (data: { weightKg: string; gender?: string }) => {
    if (data.weightKg) setBb(data.weightKg);
    if (data.gender) setSex(data.gender.toLowerCase() === 'p' ? 'f' : 'm');

    if (clinicalStore.data.hb) setHb(clinicalStore.data.hb);
    if (clinicalStore.data.trombosit) setTcPlt(clinicalStore.data.trombosit);

    setRes(null);
  };


  const calculate = () => {
    const w = parseFloat(bb);
    if (!w) return;

    if (tab === 'prc') {
      const h1 = parseFloat(hb);
      const h2 = parseFloat(hbt);
      if (!h1 || !h2 || h2 <= h1) return;
      
      const dhb = h2 - h1;
      const vol = dhb * w * 4;
      const kolf = Math.ceil(vol / 250);
      const ebv = w * (sex === 'm' ? 70 : 65);
      
      setRes({ type: 'prc', vol, kolf, dhb, ebv });
    } else if (tab === 'wb') {
      const h1 = parseFloat(hb);
      const h2 = parseFloat(hbt);
      if (!h1 || !h2 || h2 <= h1) return;
      
      const dhb = h2 - h1;
      const vol = dhb * w * 6;
      const kolf = Math.ceil(vol / 450);
      
      setRes({ type: 'wb', vol, kolf, dhb });
    } else if (tab === 'ffp') {
      const d = parseInt(ffpDose);
      const vol = d * w;
      const kolf = Math.ceil(vol / 250);
      setRes({ type: 'ffp', vol, kolf, d });
    } else if (tab === 'tc') {
      const p1 = parseFloat(tcPlt);
      const p2 = parseFloat(tcPltt);
      if (!p1 || !p2 || p2 <= p1) return;
      
      const dplt = p2 - p1;
      if (tcType === 'rd') {
        const uTarget = Math.ceil((dplt / 7.5) * (w / 70));
        const uMin = Math.ceil(w / 10);
        const units = Math.max(uMin, Math.min(uTarget, 10));
        const vol = units * 60;
        setRes({ type: 'tc', subtype: 'rd', units, vol, expected: Math.min((units * 7.5 * (70/w)), dplt) });
      } else {
        const expected = Math.round(45 * (70/w));
        setRes({ type: 'tc', subtype: 'sda', units: 1, vol: 250, expected: Math.min(expected, dplt) });
      }
    } else if (tab === 'cryo') {
      const f1 = parseFloat(cryoFib);
      const f2 = parseFloat(cryoTarget);
      if (!f1 || !f2 || f2 <= f1) return;
      
      const pv = w * 40;
      const deficit = ((f2 - f1) * pv) / 100;
      const kForm = Math.ceil(deficit / 200);
      const kRule = Math.ceil(w / 10);
      const kolf = Math.max(kForm, kRule);
      
      setRes({ type: 'cryo', deficit, kolf, vol: kolf * 17 });
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Active Patient Widget & Sync Banner */}
      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />

      <div className="flex bg-slate-100 dark:bg-[#2C2C2E] p-1 rounded-xl w-full max-w-xl mx-auto shadow-sm mb-4">
        <button className={`flex-1 py-1.5 text-[12px] md:text-[13px] font-bold rounded-lg transition-colors ${tab === 'prc' ? 'bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'}`} onClick={() => {setTab('prc'); setRes(null);}}>PRC</button>
        <button className={`flex-1 py-1.5 text-[12px] md:text-[13px] font-bold rounded-lg transition-colors ${tab === 'wb' ? 'bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'}`} onClick={() => {setTab('wb'); setRes(null);}}>WB</button>
        <button className={`flex-1 py-1.5 text-[12px] md:text-[13px] font-bold rounded-lg transition-colors ${tab === 'ffp' ? 'bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'}`} onClick={() => {setTab('ffp'); setRes(null);}}>FFP</button>
        <button className={`flex-1 py-1.5 text-[12px] md:text-[13px] font-bold rounded-lg transition-colors ${tab === 'tc' ? 'bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'}`} onClick={() => {setTab('tc'); setRes(null);}}>TC</button>
        <button className={`flex-1 py-1.5 text-[12px] md:text-[13px] font-bold rounded-lg transition-colors ${tab === 'cryo' ? 'bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'}`} onClick={() => {setTab('cryo'); setRes(null);}}>Cryo</button>
      </div>

      <div className="flex flex-col gap-0 mt-2">
         <h2 className="mb-2 px-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
           Parameter Klinis
         </h2>

         <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mx-4">
               <div className="flex items-center justify-between px-4 py-3 gap-4">
                 <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Berat Badan</span>
                 <div className="flex-1 flex items-center justify-end gap-2">
                   <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={bb} onChange={e=>setBb(e.target.value)} placeholder="cth: 70" />
                   <span className="text-xs font-semibold text-slate-500 w-10 text-left">kg</span>
                 </div>
               </div>

             {(tab === 'prc' || tab === 'wb') && (
               <>
                 <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Hb Aktual</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" step="0.1" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={hb} onChange={e=>setHb(e.target.value)} placeholder="cth: 7.5" />
                     <span className="text-xs font-semibold text-slate-500 w-10 text-left">g/dL</span>
                   </div>
                 </div>
                 <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Target Hb</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" step="0.1" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={hbt} onChange={e=>setHbt(e.target.value)} placeholder="cth: 10" />
                     <span className="text-xs font-semibold text-slate-500 w-10 text-left">g/dL</span>
                   </div>
                 </div>
               </>
             )}
             
             {tab === 'prc' && (
               <>
                 <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Jenis Kelamin</span>
                   <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={sex} onChange={e=>setSex(e.target.value)}>
                     <option value="m">Laki-laki</option>
                     <option value="f">Perempuan</option>
                   </select>
                 </div>
                 <div className="flex justify-between px-4 py-3 items-center gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left max-w-[100px]">Premedikasi</span>
                   <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all overflow-hidden text-ellipsis" value={premed} onChange={e=>setPremed(e.target.value)}>
                     <option value="none">Tidak ada</option>
                     <option value="furosemide">Furosemide</option>
                     <option value="allergy">Diphenhydramine</option>
                   </select>
                 </div>
               </>
             )}

             {tab === 'ffp' && (
               <>
                 <div className="flex justify-between px-4 py-3 items-center gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left max-w-[120px]">Indikasi</span>
                   <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all overflow-hidden text-ellipsis" value={ffpDose} onChange={e=>setFfpDose(e.target.value)}>
                     <option value="10">Koagulopati (10 mL/kg)</option>
                     <option value="15">Koreksi INR (15 mL/kg)</option>
                     <option value="20">DIC (20 mL/kg)</option>
                     <option value="30">Reversal cepat (30 mL/kg)</option>
                   </select>
                 </div>
                 <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">INR Aktual <span className="font-normal opacity-75 text-[10px]">(ops)</span></span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" step="0.1" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={ffpInr} onChange={e=>setFfpInr(e.target.value)} placeholder="cth: 2.5" />
                   </div>
                 </div>
               </>
             )}

             {tab === 'tc' && (
               <>
                 <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Trombosit Aktual</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={tcPlt} onChange={e=>setTcPlt(e.target.value)} placeholder="cth: 20" />
                     <span className="text-[10px] font-semibold text-slate-500 w-10 text-left">×10³/µL</span>
                   </div>
                 </div>
                 <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Target Plt</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={tcPltt} onChange={e=>setTcPltt(e.target.value)} placeholder="cth: 100" />
                     <span className="text-[10px] font-semibold text-slate-500 w-10 text-left">×10³/µL</span>
                   </div>
                 </div>
                 <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Tipe Produk</span>
                   <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={tcType} onChange={e=>setTcType(e.target.value)}>
                     <option value="rd">Random Donor (RD)</option>
                     <option value="sda">Apheresis (SDA)</option>
                   </select>
                 </div>
               </>
             )}

             {tab === 'cryo' && (
               <>
                 <div className="flex items-center justify-between px-4 py-3 gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Fibrinogen Aktual</span>
                   <div className="flex-1 flex items-center justify-end gap-2">
                     <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={cryoFib} onChange={e=>setCryoFib(e.target.value)} placeholder="cth: 100" />
                     <span className="text-[10px] font-semibold text-slate-500 w-10 text-left">mg/dL</span>
                   </div>
                 </div>
                 <div className="flex justify-between px-4 py-3 items-center gap-4">
                   <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left max-w-[120px]">Target</span>
                   <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all overflow-hidden text-ellipsis" value={cryoTarget} onChange={e=>setCryoTarget(e.target.value)}>
                     <option value="150">150 mg/dL (Umum/DIC)</option>
                     <option value="200">200 mg/dL (Perdarahan Masif)</option>
                     <option value="100">100 mg/dL (Minimum)</option>
                   </select>
                 </div>
               </>
             )}
            </div>

             <div className="px-4 mt-4">
               <button onClick={calculate} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px]">
                 Hitung Kebutuhan
               </button>
             </div>

             {res && (
               <div className="animate-in fade-in duration-300 mt-6 px-4">
                 <div className="text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">
                   <span>Hasil Kalkulasi</span>
                 </div>
                 
                 <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
                   
                 {(res.type === 'prc' || res.type === 'wb') && (
                   <div className="flex flex-col flex-1 divide-y divide-slate-100 dark:divide-slate-800">
                     <div className="p-4 flex flex-col items-center justify-center text-center flex-1 bg-red-50/50 dark:bg-red-900/10">
                       <div className="text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Jumlah Kolf</div>
                       <div className="font-mono text-4xl font-bold text-red-600 dark:text-red-400">
                         {res.kolf} <span className="text-xl font-medium text-slate-700 dark:text-slate-300">kolf</span>
                       </div>
                       <div className="text-[13px] font-medium text-slate-700 dark:text-slate-300 mt-2">
                         Volume Total: ~{Math.round(res.vol)} mL
                       </div>
                     </div>
                     <div className="p-4 flex flex-col items-center justify-center text-center flex-1 bg-slate-50/50 dark:bg-[#2C2C2E]/50">
                       <div className="text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Target Kenaikan</div>
                       <div className="font-mono text-2xl font-bold text-slate-700 dark:text-slate-300">
                         +{res.dhb.toFixed(1)} <span className="text-[15px] font-medium text-slate-700 dark:text-slate-300">g/dL</span>
                       </div>
                       {res.type === 'prc' && (
                         <div className="text-[12px] text-blue-600/80 dark:text-blue-400/80 mt-1">
                           EBV Pasien: {(res.ebv/1000).toFixed(1)} L
                         </div>
                       )}
                     </div>
                   </div>
                 )}

                 {res.type === 'ffp' && (
                   <div className="flex flex-col flex-1">
                     <div className="p-4 flex flex-col items-center justify-center text-center flex-1 bg-amber-50/80 dark:bg-amber-900/10">
                       <div className="text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Kebutuhan FFP</div>
                       <div className="font-mono text-4xl font-bold text-amber-600 dark:text-amber-500">
                         {res.kolf} <span className="text-xl font-medium text-slate-700 dark:text-slate-300">kolf</span>
                       </div>
                       <div className="text-[13px] font-medium text-slate-700 dark:text-slate-300 mt-2">
                         Dosis: {res.d} mL/kg → {Math.round(res.vol)} mL total
                       </div>
                     </div>
                   </div>
                 )}

                 {res.type === 'tc' && (
                   <div className="flex flex-col flex-1 divide-y divide-slate-100 dark:divide-slate-800">
                     <div className="p-4 flex flex-col items-center justify-center text-center flex-1 bg-orange-50/80 dark:bg-orange-900/10">
                       <div className="text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Kebutuhan Trombosit</div>
                       <div className="font-mono text-4xl font-bold text-orange-600 dark:text-orange-500">
                         {res.units} <span className="text-lg font-medium text-slate-700 dark:text-slate-300">{res.subtype === 'rd' ? 'unit RD' : 'kantong apheresis'}</span>
                       </div>
                     </div>
                     <div className="p-4 flex flex-col items-center justify-center text-center flex-1 bg-slate-50/50 dark:bg-[#2C2C2E]/50">
                       <div className="text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Estimasi Kenaikan</div>
                       <div className="font-mono text-2xl font-bold text-slate-700 dark:text-slate-300">
                         +{Math.round(res.expected)} <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300 inline-block align-middle ml-1">×10³/µL</span>
                       </div>
                     </div>
                   </div>
                 )}

                 {res.type === 'cryo' && (
                   <div className="flex flex-col flex-1 divide-y divide-slate-100 dark:divide-slate-800">
                     <div className="p-4 flex flex-col items-center justify-center text-center flex-1 bg-blue-50/80 dark:bg-blue-900/10">
                       <div className="text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Kebutuhan Cryo</div>
                       <div className="font-mono text-4xl font-bold text-blue-600 dark:text-blue-500">
                         {res.kolf} <span className="text-xl font-medium text-slate-700 dark:text-slate-300">kolf</span>
                       </div>
                     </div>
                     <div className="p-4 flex flex-col items-center justify-center text-center flex-1 bg-slate-50/50 dark:bg-[#2C2C2E]/50">
                       <div className="text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Defisit Fibrinogen</div>
                       <div className="font-mono text-2xl font-bold text-slate-700 dark:text-slate-300">
                         {Math.round(res.deficit)} <span className="text-[15px] font-medium text-slate-700 dark:text-slate-300">mg</span>
                       </div>
                     </div>
                   </div>
                 )}

                 </div>
               </div>
             )}
           </div>

      <Accordion title="📖 Teori & Referensi: Transfusi Darah">
        <ul className="pl-4 space-y-1 list-disc text-muted-foreground text-sm">
          <li><strong className="text-foreground">Packed Red Cells (PRC):</strong> Menggunakan rumus (Hb Target - Hb Pasien) &times; BB &times; 3 (dan &times; 6 untuk Whole Blood). Triggers transfusi umum: Hb &lt; 7.0 g/dL pada pasien stabil, atau Hb &lt; 8.0 g/dL pada bedah kardiovaskular / iskemia.</li>
          <li><strong className="text-foreground">Fresh Frozen Plasma (FFP):</strong> Mengandung seluruh faktor koagulasi. Dosis umum 10-15 mL/kg untuk koreksi ringan, hingga 20-30 mL/kg pada koagulopati berat (DIC). Asumsi 1 kolf = 200 mL.</li>
          <li><strong className="text-foreground">Trombosit (TC):</strong> Standar transfusi umumnya 1 unit donor per 10 kg BB (menyumbang peningkatan ~30,000 sampai 50,000/&mu;L) atau langsung menggunakan Apheresis (setara 6 unit TC biasa).</li>
          <li><strong className="text-foreground">Cryoprecipitate:</strong> Sangat kaya fibrinogen (sekitar 200-250 mg per kolf), Faktor VIII, dan vWF. Sangat bermanfaat pada hipofibrinogenemia massal. Rumus: Defisit Fibrinogen / 250.</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 Carson JL et al. (2016) Clinical Practice Guidelines; Hunt BJ (2014) Bleeding and Coagulopathies in Critical Care.
        </div>
      </Accordion>
    </div>
  );
}
