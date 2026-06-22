import React, { useState, useEffect, useMemo } from 'react';
import { Utensils, AlertTriangle } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';

export default function KalkulatorNutrisi() {
  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();

  const [bb, setBb] = useState('');
  const [ibwIn, setIbwIn] = useState('');
  const [tb, setTb] = useState('');
  const [fase, setFase] = useState('akut-lanjut');
  const [kondisi, setKondisi] = useState('kritis');
  const [route, setRoute] = useState('en');
  const [refeeding, setRefeeding] = useState('rendah');
  const [res, setRes] = useState<any>(null);

  // Auto-load on mount
  useEffect(() => {
    const parentWeight = patient.weightKg || clinicalStore.data.weight || '';
    if (parentWeight) setBb(parentWeight);

    const parentHeight = patient.heightCm || clinicalStore.data.height || '';
    if (parentHeight) setTb(parentHeight);
  }, []);

  const syncFields = useMemo(() => [
    { key: 'weight' as const, label: 'Berat Badan', value: bb, setter: setBb, unit: 'kg' },
    { key: 'height' as const, label: 'Tinggi Badan', value: tb, setter: setTb, unit: 'cm' },
  ], [bb, tb]);

  const handleAutofill = (data: { weightKg: string; heightCm?: string }) => {
    if (data.weightKg) setBb(data.weightKg);
    if (data.heightCm) setTb(data.heightCm);
    setRes(null);
  };


  const calculate = () => {
    const w = parseFloat(bb);
    if (!w) return;
    const t = parseFloat(tb);
    const i = parseFloat(ibwIn);

    const bmi = (!isNaN(t) && t > 0) ? Math.round(w / ((t / 100) * (t / 100)) * 10) / 10 : null;
    const isObese = (bmi !== null && bmi >= 30) || kondisi === 'obese';

    const ibw = (!isNaN(i) && i > 0) ? i : w;
    const adjBW = isObese ? Math.round((ibw + 0.25 * (w - ibw)) * 10) / 10 : null;
    const dosingWt = isObese ? (adjBW || w) : w;

    let kMin, kMax, kNote;
    if (fase === 'akut-awal') {
      kMin = Math.round(dosingWt * 8); kMax = Math.round(dosingWt * 15);
      kNote = '50-70% target — fase hipometabolik (0-48 jam)';
    } else if (fase === 'recovery') {
      kMin = Math.round(dosingWt * 25); kMax = Math.round(dosingWt * 35);
      kNote = '25-35 kkal/kg/hari — fase recovery >7 hari';
    } else {
      if (kondisi === 'ards') {
        kMin = Math.round(dosingWt * 22); kMax = Math.round(dosingWt * 25);
        kNote = '22-25 kkal/kg — ARDS berat, hindari over-feeding (CO₂ ↑)';
      } else if (isObese) {
        kMin = Math.round(ibw * 22); kMax = Math.round(ibw * 25);
        kNote = `22-25 kkal/kg IBW — obesitas, gunakan IBW ${ibw} kg`;
      } else {
        kMin = Math.round(dosingWt * 25); kMax = Math.round(dosingWt * 30);
        kNote = '25-30 kkal/kg/hari — ICU umum';
      }
    }

    let pMin, pMax, pNote;
    if (kondisi === 'renal-pre') {
      pMin = dosingWt * 0.8; pMax = dosingWt * 1.0;
      pNote = '0.8-1.0 g/kg — AKI/CKD pre-dialisis';
    } else if (kondisi === 'crrt') {
      pMin = dosingWt * 1.5; pMax = dosingWt * 2.0;
      pNote = '1.5-2.0 g/kg — CRRT';
    } else if (kondisi === 'trauma') {
      pMin = dosingWt * 2.0; pMax = dosingWt * 2.5;
      pNote = '2.0-2.5 g/kg — trauma/luka bakar';
    } else if (isObese) {
      pMin = ibw * 2.0; pMax = ibw * 2.5;
      pNote = `2.0-2.5 g/kg IBW`;
    } else if (fase === 'recovery') {
      pMin = dosingWt * 1.5; pMax = dosingWt * 2.0;
      pNote = '1.5-2.0 g/kg — recovery';
    } else {
      pMin = dosingWt * 1.2; pMax = dosingWt * 2.0;
      pNote = '1.2-2.0 g/kg — kritis standar';
    }

    let rfNote = '';
    if (refeeding === 'tinggi') {
      kMin = Math.round(dosingWt * 10); kMax = Math.round(dosingWt * 20);
      rfNote = 'Mulai pelan! 10-20 kkal/kg/hari. Suplementasi tiamin, fosfat, K, Mg.';
    } else if (refeeding === 'sedang') {
      kMin = Math.round(dosingWt * 15); kMax = Math.round(dosingWt * 22);
      rfNote = 'Risiko sedang. Mulai 15-22 kkal/kg/hari.';
    }

    const enVol = route !== 'pn' ? Math.round(((kMin + kMax) / 2) / 1.2) : null;

    setRes({
      kMin, kMax, kNote,
      pMin: pMin.toFixed(1), pMax: pMax.toFixed(1), pNote,
      cMin: Math.round(dosingWt * 3), cMax: Math.round(dosingWt * 5),
      fMin: (dosingWt * 0.7).toFixed(1), fMax: (dosingWt * 1.5).toFixed(1),
      bmi: bmi ? bmi.toFixed(1) : null,
      isObese,
      dosingWt,
      rfNote,
      enVol
    });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Active Patient Widget & Sync Banner */}
      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />

      <div className="flex flex-col gap-0 mt-2">
         <h2 className="mb-2 px-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
           Kalkulator Nutrisi ICU
         </h2>
         
         <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mx-4">
            <div className="flex justify-between px-4 py-3 items-center gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left w-24">Fase Rawat</span>
              <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={fase} onChange={e=>setFase(e.target.value)}>
                <option value="akut-awal">Akut awal (0-48 jam)</option>
                <option value="akut-lanjut">Akut lanjut (48j - 7h)</option>
                <option value="recovery">Recovery (&gt;7 hari)</option>
              </select>
            </div>
            <div className="flex justify-between px-4 py-3 items-center gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left w-24">Kondisi Klinis</span>
              <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={kondisi} onChange={e=>setKondisi(e.target.value)}>
                <option value="kritis">Kritis umum (ICU)</option>
                <option value="ards">ARDS berat</option>
                <option value="sepsis">Sepsis / Syok Septik</option>
                <option value="trauma">Trauma / Luka Bakar</option>
                <option value="obese">Obesitas (BMI &gt;30)</option>
                <option value="renal-pre">AKI/CKD pre-dialisis</option>
                <option value="crrt">AKI dengan CRRT</option>
              </select>
            </div>
            <div className="flex justify-between px-4 py-3 items-center gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left w-24">Route Nutrisi</span>
              <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={route} onChange={e=>setRoute(e.target.value)}>
                <option value="en">Enteral (NGT/Oral)</option>
                <option value="pn">Parenteral (TPN)</option>
                <option value="mixed">Kombinasi EN + PN</option>
              </select>
            </div>
            <div className="flex justify-between px-4 py-3 items-center gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left w-24">Risiko Refeed</span>
              <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={refeeding} onChange={e=>setRefeeding(e.target.value)}>
                <option value="rendah">Rendah</option>
                <option value="sedang">Sedang (1 faktor)</option>
                <option value="tinggi">Tinggi (&ge;2 faktor)</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between px-4 py-3 gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Berat BB Aktual</span>
              <div className="flex-1 flex items-center justify-end gap-2">
                <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={bb} onChange={e=>setBb(e.target.value)} />
                <span className="text-xs font-semibold text-slate-500 w-6 text-left">kg</span>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3 gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">IBW (opsional)</span>
              <div className="flex-1 flex items-center justify-end gap-2">
                <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={ibwIn} onChange={e=>setIbwIn(e.target.value)} />
                <span className="text-xs font-semibold text-slate-500 w-6 text-left">kg</span>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3 gap-4 bg-blue-50/50 dark:bg-blue-900/10">
              <span className="text-[13px] font-semibold text-blue-700 dark:text-blue-400 flex-shrink-0">Tinggi Badan</span>
              <div className="flex-1 flex items-center justify-end gap-2">
                <input type="number" className="w-full bg-blue-50 dark:bg-blue-900/20 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-blue-700 dark:text-blue-400 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={tb} onChange={e=>setTb(e.target.value)} />
                <span className="text-xs font-semibold text-blue-500 w-6 text-left">cm</span>
              </div>
            </div>
         </div>
      </div>

      <div className="px-4 mt-4">
        <button onClick={calculate} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px]">
          Hitung Target Nutrisi
        </button>
      </div>

      {res && (
        <div className="px-4 mt-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            {res.rfNote && (
              <div className="p-4 bg-red-50 dark:bg-red-900/10">
                <div className="font-bold flex items-start gap-1.5 text-[13px] text-red-700 dark:text-red-500">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="leading-snug">{res.rfNote}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 p-4 gap-4 bg-slate-50 dark:bg-[#1C1C1E]">
              <div className="bg-white dark:bg-[#2C2C2E] p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Target Kalori</div>
                <div className="text-[20px] font-black text-slate-800 dark:text-slate-100 leading-none mb-1">
                  {res.kMin}-{res.kMax} <span className="text-[12px] font-semibold opacity-70">kkal</span>
                </div>
                <div className="text-[10px] font-medium opacity-60 px-1 leading-tight">{res.kNote}</div>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1">Target Protein</div>
                <div className="text-[20px] font-black text-emerald-700 dark:text-emerald-300 leading-none mb-1">
                  {res.pMin}-{res.pMax} <span className="text-[12px] font-semibold opacity-70">g</span>
                </div>
                <div className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-medium px-1 leading-tight">{res.pNote}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 p-4 gap-4">
              <div className="text-center">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Karbohidrat</div>
                <div className="text-[16px] font-bold text-slate-800 dark:text-slate-200">
                  {res.cMin}-{res.cMax} <span className="text-[12px] font-normal text-slate-500">g</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Lemak</div>
                <div className="text-[16px] font-bold text-slate-800 dark:text-slate-200">
                  {res.fMin}-{res.fMax} <span className="text-[12px] font-normal text-slate-500">g</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">BMI</div>
                <div className="text-[15px] font-semibold text-slate-800 dark:text-slate-200">
                  {res.bmi || '—'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Berat Dosis</div>
                <div className="text-[15px] font-semibold text-slate-800 dark:text-slate-200">
                  {res.dosingWt} kg
                  <span className="block text-[10px] text-slate-500 font-normal">{res.isObese ? 'Adjusted BW' : 'Aktual'}</span>
                </div>
              </div>
              
              {res.enVol && (
                <div className="text-center col-span-2 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Estimasi Volume Enteral (1.2 kkal/mL)</div>
                  <div className="text-[18px] font-bold text-blue-600 dark:text-blue-400">
                    {res.enVol} mL/hari
                  </div>
                  <div className="text-[12px] font-medium text-slate-500 mt-0.5">
                    ≈ {Math.round(res.enVol/24)} mL/jam (kontinyu)
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Accordion title="📖 Teori & Referensi: Nutrisi ICU">
        <ul className="pl-4 space-y-2 mb-4 list-disc text-slate-600 dark:text-slate-400 text-[13px] leading-relaxed">
          <li><strong className="text-slate-800 dark:text-slate-200">Target Kalori & Protein:</strong> Panduan ASPEN/SCCM merekomendasikan 25-30 kkal/kg/hari. Pasien trauma/luka bakar mungkin butuh stres faktor (1.2 - 1.5). Target protein sangat penting di fase akut (1.2-2.0 g/kg/hari) untuk mencegah katabolisme massa otot.</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Pasien Obesitas:</strong> BMI &ge; 30 disarankan hipokalorik-high protein (11-14 kkal/kg aktual atau 22-25 kkal/kg IBW) dengan target protein &ge; 2.0 g/kg IBW.</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Refeeding Syndrome:</strong> Pasien malnutrisi berat, puasa lama, atau anoreksia nervosa berisiko tinggi saat diinisiasi nutrisi. Tandai risiko pada skor NRS-2002. Awali asupan 10-15 kkal/kg, naikkan perlahan, dan pantau elektrolit (Fosfat, Magnesium, Kalium).</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 McClave SA et al. (2016) ASPEN/SCCM Guidelines; Singer P et al. (2019) ESPEN guideline on clinical nutrition in the ICU.
        </div>
      </Accordion>
    </div>
  );
}
