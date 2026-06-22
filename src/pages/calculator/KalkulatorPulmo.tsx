import React, { useState, useEffect, useMemo } from 'react';
import { Stethoscope, Wind, FileText, ChevronDown } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';

export default function KalkulatorPulmo() {
  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();

  const [ureumMgdl, setUreumMgdl] = useState('');
  const [ureumMmol, setUreumMmol] = useState('');
  const [bunMgdl, setBunMgdl] = useState('');

  // CURB-65
  const [curbC, setCurbC] = useState('0');
  const [curbRr, setCurbRr] = useState('');
  const [curbSbp, setCurbSbp] = useState('');
  const [curbDbp, setCurbDbp] = useState('');
  const [curbAge, setCurbAge] = useState('');
  const [curbRes, setCurbRes] = useState<any>(null);

  // A-a Gradient
  const [aaFio2, setAaFio2] = useState('');
  const [aaPaco2, setAaPaco2] = useState('');
  const [aaPao2, setAaPao2] = useState('');
  const [aaPatm, setAaPatm] = useState('760');
  const [aaAge, setAaAge] = useState('');
  const [aaRes, setAaRes] = useState<any>(null);

  const handleUreumChange = (val: string, type: 'mgdl' | 'mmol' | 'bun') => {
    if (val === '') {
      setUreumMgdl(''); setUreumMmol(''); setBunMgdl('');
      return;
    }
    const num = parseFloat(val);
    if (type === 'mgdl') {
      setUreumMgdl(val);
      setUreumMmol((num / 6.006).toFixed(2));
      setBunMgdl((num * 0.4667).toFixed(1));
    } else if (type === 'mmol') {
      setUreumMmol(val);
      setUreumMgdl((num * 6.006).toFixed(1));
      setBunMgdl((num * 2.8).toFixed(1));
    } else {
      setBunMgdl(val);
      setUreumMgdl((num / 0.4667).toFixed(1));
      setUreumMmol((num / 2.8).toFixed(2));
    }
  };

  // Auto load on mount
  useEffect(() => {
    const parentUreum = clinicalStore.data.ureum || '';
    if (parentUreum) {
      handleUreumChange(parentUreum, 'mgdl');
    }
    if (clinicalStore.data.rr) setCurbRr(clinicalStore.data.rr);
    if (clinicalStore.data.systolic) setCurbSbp(clinicalStore.data.systolic);
    if (clinicalStore.data.diastolic) setCurbDbp(clinicalStore.data.diastolic);

    const parentAge = patient.ageYears || clinicalStore.data.age || '';
    if (parentAge) {
      setCurbAge(parentAge);
      setAaAge(parentAge);
    }

    if (clinicalStore.data.pco2) setAaPaco2(clinicalStore.data.pco2);
    if (clinicalStore.data.pao2) setAaPao2(clinicalStore.data.pao2);
  }, []);

  const syncFields = useMemo(() => [
    { key: 'ureum' as const, label: 'Ureum', value: ureumMgdl, setter: (val: string) => handleUreumChange(val, 'mgdl'), unit: 'mg/dL' },
    { key: 'rr' as const, label: 'Respiratory Rate', value: curbRr, setter: setCurbRr, unit: 'x/menit' },
    { key: 'systolic' as const, label: 'Tekanan Darah Sistolik', value: curbSbp, setter: setCurbSbp, unit: 'mmHg' },
    { key: 'diastolic' as const, label: 'Tekanan Darah Diastolik', value: curbDbp, setter: setCurbDbp, unit: 'mmHg' },
    { key: 'pco2' as const, label: 'PaCO₂', value: aaPaco2, setter: setAaPaco2, unit: 'mmHg' },
    { key: 'pao2' as const, label: 'PaO₂', value: aaPao2, setter: setAaPao2, unit: 'mmHg' },
  ], [ureumMgdl, curbRr, curbSbp, curbDbp, aaPaco2, aaPao2]);

  const handleAutofill = (data: any) => {
    const parentUreum = clinicalStore.data.ureum || '';
    if (parentUreum) {
      handleUreumChange(parentUreum, 'mgdl');
    }
    if (clinicalStore.data.rr) setCurbRr(clinicalStore.data.rr);
    if (clinicalStore.data.systolic) setCurbSbp(clinicalStore.data.systolic);
    if (clinicalStore.data.diastolic) setCurbDbp(clinicalStore.data.diastolic);

    const parentAge = patient.ageYears || clinicalStore.data.age || '';
    if (parentAge) {
      setCurbAge(parentAge);
      setAaAge(parentAge);
    }

    if (clinicalStore.data.pco2) setAaPaco2(clinicalStore.data.pco2);
    if (clinicalStore.data.pao2) setAaPao2(clinicalStore.data.pao2);

    setCurbRes(null);
    setAaRes(null);
  };


  const calcCurb = () => {
    let score = parseInt(curbC);
    let rows = [];

    rows.push({ n: 'C — Confusion', d: curbC === '1' ? 'Ya' : 'Tidak', p: parseInt(curbC) });

    if (ureumMgdl) {
      const u = parseFloat(ureumMgdl) > 42 ? 1 : 0;
      rows.push({ n: 'U — Urea (>42 mg/dL)', d: u ? 'Ya' : 'Tidak', p: u });
      score += u;
    } else {
      rows.push({ n: 'U — Urea', d: 'Tidak dimasukkan', p: 0 });
    }

    if (curbRr) {
      const r = parseFloat(curbRr) >= 30 ? 1 : 0;
      rows.push({ n: 'R — Respiratory Rate (≥30)', d: r ? 'Ya' : 'Tidak', p: r });
      score += r;
    }

    if (curbSbp && curbDbp) {
      const b = (parseFloat(curbSbp) < 90 || parseFloat(curbDbp) <= 60) ? 1 : 0;
      rows.push({ n: 'B — Blood Pressure', d: b ? 'Ya (Hipotensi)' : 'Tidak', p: b });
      score += b;
    }

    if (curbAge) {
      const a = parseFloat(curbAge) >= 65 ? 1 : 0;
      rows.push({ n: '65 — Usia (≥65)', d: a ? 'Ya' : 'Tidak', p: a });
      score += a;
    }

    let interp, act, cls;
    if (score <= 1) { interp = 'Risiko Rendah'; act = 'Rawat jalan. Mortalitas ~1.5%'; cls = 'text-teal-500'; }
    else if (score === 2) { interp = 'Risiko Sedang'; act = 'Rawat inap, terapi IV. Mortalitas ~9.2%'; cls = 'text-amber-500'; }
    else { interp = 'Risiko Tinggi'; act = 'Rawat inap, pertimbangkan ICU. Mortalitas 22-57%'; cls = 'text-red-500'; }

    setCurbRes({ score, rows, interp, act, cls });
  };

  const calcAa = () => {
    const f = parseFloat(aaFio2);
    const pco2 = parseFloat(aaPaco2);
    const po2 = parseFloat(aaPao2);
    const patm = parseFloat(aaPatm) || 760;
    const age = parseFloat(aaAge);

    if (!f || !pco2 || !po2) return;

    const paO2calc = f * (patm - 47) - pco2 / 0.8;
    const aaGrad = paO2calc - po2;
    const normalAa = !isNaN(age) ? (age / 4 + 4) : 15;

    let ai, ac;
    if (aaGrad <= normalAa) { ai = 'Normal — kemungkinan hipoventilasi murni'; ac = 'text-teal-500'; }
    else if (aaGrad <= 35) { ai = 'Meningkat ringan — V/Q mismatch ringan'; ac = 'text-amber-500'; }
    else if (aaGrad <= 100) { ai = 'Meningkat signifikan — V/Q mismatch, gangguan difusi, shunt'; ac = 'text-amber-500'; }
    else { ai = '⚠ Meningkat berat — pertimbangkan shunt besar'; ac = 'text-red-500'; }

    setAaRes({ grad: aaGrad.toFixed(1), calc: paO2calc.toFixed(1), normal: normalAa.toFixed(0), ai, ac });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Active Patient Widget & Sync Banner */}
      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />

      {/* Konversi Ureum */}
      <div className="flex flex-col gap-0 mt-2">
        <h2 className="mb-2 px-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          Konversi Ureum ↔ BUN
        </h2>

        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mx-4">
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 truncate">Ureum (mg/dL)</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={ureumMgdl} onChange={e => handleUreumChange(e.target.value, 'mgdl')} />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 truncate">Ureum (mmol/L)</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={ureumMmol} onChange={e => handleUreumChange(e.target.value, 'mmol')} />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 truncate">BUN (mg/dL)</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={bunMgdl} onChange={e => handleUreumChange(e.target.value, 'bun')} />
            </div>
          </div>
        </div>
      </div>

      {/* CURB-65 */}
      <div className="flex flex-col gap-0 mt-4">
        <h2 className="mb-2 px-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          CURB-65 Score
        </h2>

        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mx-4">
          <div className="flex justify-between px-4 py-3 items-center gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left w-32 truncate">C — Confusion</span>
            <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all overflow-hidden text-ellipsis" value={curbC} onChange={e => setCurbC(e.target.value)}>
              <option value="0">Tidak (0)</option>
              <option value="1">Ya (1)</option>
            </select>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 truncate">U — Ureum (&gt;42)</span>
            <div className="flex-1 flex items-center justify-end gap-2 opacity-60">
              <input type="number" disabled className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={ureumMgdl} placeholder="Dari konversi" />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 truncate">R — Resp. Rate</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={curbRr} onChange={e => setCurbRr(e.target.value)} />
              <span className="text-xs font-semibold text-slate-500 w-8 text-left">/mnt</span>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 truncate">B — Sistolik</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={curbSbp} onChange={e => setCurbSbp(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 truncate">B — Diastolik</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={curbDbp} onChange={e => setCurbDbp(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 truncate">65 — Usia</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={curbAge} onChange={e => setCurbAge(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
         <button onClick={calcCurb} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px]">
           Hitung CURB-65
         </button>
      </div>

      {curbRes && (
        <div className="px-4 mt-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden p-4 text-center">
            <div className={`text-5xl font-black mb-2 ${curbRes.cls}`}>{curbRes.score}</div>
            <div className={`text-[15px] font-bold mb-1 ${curbRes.cls}`}>{curbRes.interp}</div>
            <div className="text-[13px] text-slate-600 dark:text-slate-400 font-medium mb-4">{curbRes.act}</div>
            <div className="space-y-2 mt-4 text-left">
              {curbRes.rows.map((r:any) => (
                <div key={r.n} className="flex justify-between items-center text-[13px] bg-slate-50 dark:bg-[#2C2C2E] p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{r.n.split('—')[0]}</span> <span className="text-slate-500 font-medium mx-1">{r.d}</span>
                  </div>
                  <div className="font-bold text-slate-700 dark:text-slate-300">+{r.p}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* A-a Gradient */}
      <div className="flex flex-col gap-0 mt-6">
        <h2 className="mb-2 px-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          A-a Gradient — Analisis Hipoksemia
        </h2>

        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mx-4">
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">FiO₂ (0.21-1.0)</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" step="0.01" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={aaFio2} onChange={e=>setAaFio2(e.target.value)}/>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">PaCO₂ (mmHg)</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={aaPaco2} onChange={e=>setAaPaco2(e.target.value)}/>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">PaO₂ (mmHg)</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={aaPao2} onChange={e=>setAaPao2(e.target.value)}/>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Usia (Tahun)</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={aaAge} onChange={e=>setAaAge(e.target.value)}/>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">P. atm (mmHg)</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={aaPatm} onChange={e=>setAaPatm(e.target.value)} placeholder="760"/>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <button onClick={calcAa} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px]">
          Hitung A-a Gradient
        </button>
      </div>

      {aaRes && (
        <div className="px-4 mt-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-5 text-center">
             <div className={`text-[12px] font-bold uppercase tracking-wider mb-1 ${aaRes.ac}`}>A-a Gradient</div>
             <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">{aaRes.grad} <span className="text-[15px] font-semibold text-slate-500">mmHg</span></div>
             <div className="text-[13px] text-slate-700 dark:text-slate-300 mb-5 font-medium">Normal ≤ {aaRes.normal} mmHg</div>

             <div className="grid grid-cols-2 gap-3 mb-5">
               <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-100 dark:border-slate-800 p-3 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">PAO₂ (Alveolar)</div>
                  <div className="text-[17px] font-black text-slate-800 dark:text-slate-200">{aaRes.calc}</div>
               </div>
               <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-100 dark:border-slate-800 p-3 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">PaO₂ (Arteri)</div>
                  <div className="text-[17px] font-black text-slate-800 dark:text-slate-200">{aaPao2}</div>
               </div>
             </div>

             <div className={`text-[14px] font-bold ${aaRes.ac} p-3 rounded-xl border border-current bg-current/5`}>
               {aaRes.ai}
             </div>
          </div>
        </div>
      )}

      <Accordion title="📖 Teori & Referensi: Pneumonia & A-a Gradient">
        <ul className="pl-4 space-y-1 list-disc text-muted-foreground text-sm">
          <li><strong className="text-foreground">CURB-65 & PSI/PORT:</strong> Skoring utama untuk menentukan setting perawatan Community-Acquired Pneumonia (CAP) apakah Rawat Jalan, Ruang Rawat Biasa, atau ICU. PSI memiliki sensitivitas lebih tinggi untuk mortalitas rendah, sedangkan CURB-65 lebih sederhana untuk digunakan di IGD.</li>
          <li><strong className="text-foreground">SMART-COP:</strong> Prediktor klinis yang didesain secara spesifik memprediksi kebutuhan dukungan inotropik (vasopressor) atau dukungan ventilator intervensi (CPAP/Intubasi) pada kasus pneumonia komunitas.</li>
          <li><strong className="text-foreground">Alveolar-arterial (A-a) Gradient:</strong> Digunakan membedakan penyebab hipoksemia. A-a normal (Hipoventilasi, Ketinggian, FiO2 rendah). A-a meningkat (V/Q mismatch, R-L shunt, defek difusi seperti ILD). Normal A-a = (Usia / 4) + 4. Meningkat berkisar 10-20 mmHg tiap penambahan usia.</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 Lim WS et al. (2003) Guidelines CAP; Fine MJ et al. (1997) NEJM PSI; Charles PG et al. (2008) Clin Infect Dis SMART-COP.
        </div>
      </Accordion>
    </div>
  );
}
