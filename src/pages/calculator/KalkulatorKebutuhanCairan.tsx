import React, { useState, useEffect, useMemo } from 'react';
import { Droplets, Activity, Calculator, Scale, Info } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { SaveToHistoryButton } from '../../components/ui/SaveToHistoryButton';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { ClinicalReport } from '../../components/ui/ClinicalReport';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';

const ROSE_DATA: Record<string, any> = {
  R: {
    label: '🔴 Resuscitation', colorText: 'text-red-600 dark:text-red-400', bgBorder: 'border-red-500 bg-red-500/5',
    target: '+500 s/d +1.500 mL/24 jam', targetMin: 500, targetMax: 1500,
    desc: 'Tujuan: pulihkan perfusi organ, atasi shock. Berikan bolus cairan terukur (250–500 mL kristaloid isotonik) dan nilai ulang setiap pemberian.',
    hint: 'Hentikan resusitasi jika tidak ada fluid responsiveness. Positive balance terbatas dan terukur.'
  },
  O: {
    label: '🟠 Optimization', colorText: 'text-orange-600 dark:text-orange-400', bgBorder: 'border-orange-500 bg-orange-500/5',
    target: '0 s/d +500 mL/24 jam', targetMin: 0, targetMax: 500,
    desc: 'Tujuan: fine-tune perfusi organ, titrasi vasopresor/inotropik, optimalkan preload.',
    hint: 'Hindari volume loading berlebih. Gunakan parameter dinamik (PLR, PPV, SVV, IVC). Balance mendekati nol.'
  },
  S: {
    label: '🟢 Stabilization', colorText: 'text-emerald-600 dark:text-emerald-400', bgBorder: 'border-emerald-500 bg-emerald-500/5',
    target: '±0 mL (net zero)', targetMin: -200, targetMax: 300,
    desc: 'Tujuan: pertahankan organ perfusion dengan cairan maintenance saja.',
    hint: 'Ganti kehilangan terukur. Prioritas: jangan tambah positive balance. Evaluasi kesiapan Evacuation.'
  },
  E: {
    label: '🔵 Evacuation', colorText: 'text-blue-600 dark:text-blue-400', bgBorder: 'border-blue-500 bg-blue-500/5',
    target: '−500 s/d −1.500 mL/24 jam', targetMin: -1500, targetMax: -500,
    desc: 'Tujuan: mobilisasi dan eliminasi kelebihan cairan. Indikasi: FO >10% BB baseline.',
    hint: 'Strategi: furosemid IV, pembatasan input, CRRT jika gagal ginjal. Target negative balance bertahap.'
  }
};

export default function KalkulatorKebutuhanCairan() {
  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();

  // Box 1
  const [bw, setBw] = useState('');
  const [targetMaint, setTargetMaint] = useState('25');
  const [b1Res, setB1Res] = useState<any>(null);

  // Box 2
  const [rose, setRose] = useState<string | null>(null);
  const [temp, setTemp] = useState('37.0');
  const [vent, setVent] = useState('spontan');
  const [sweat, setSweat] = useState('none');
  const [uoTgt, setUoTgt] = useState('0.5');
  const [ngt, setNgt] = useState('');
  const [drain, setDrain] = useState('');
  const [other, setOther] = useState('');
  const [b2Res, setB2Res] = useState<any>(null);

  // Box 3 - Cumulative
  const [cumbalDays, setCumbalDays] = useState(['', '', '', '', '', '', '']);
  const [cumbalRes, setCumbalRes] = useState<any>(null);

  // Box 4 - Fluid Overload
  const [foDry, setFoDry] = useState('');
  const [foCurrent, setFoCurrent] = useState('');
  const [foRes, setFoRes] = useState<any>(null);

  // Box 5 - 24h Balance
  const [fbInputs, setFbInputs] = useState({ iv: '', med: '', nutri: '', bolus: '', oral: '' });
  const [fbOutputs, setFbOutputs] = useState({ uo: '', iwl: '', ngt: '', drain: '', other: '' });
  const [fbRes, setFbRes] = useState<any>(null);

  // Auto-load on mount
  useEffect(() => {
    const parentWeight = patient.weightKg || clinicalStore.data.weight || '';
    if (parentWeight) {
      setBw(parentWeight);
      setFoDry(parentWeight);
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
    if (data.weightKg) {
      setBw(data.weightKg);
      setFoDry(data.weightKg);
    }
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

  const calcCumulative = () => {
    const values = cumbalDays.map(v => v === '' ? null : parseFloat(v));
    const filledDays = values.filter(v => v !== null) as number[];
    if (filledDays.length === 0) return;

    let cumulative = 0;
    const history = values.map((v, i) => {
        if (v === null) return null;
        cumulative += v;
        return { day: i + 1, value: v, cum: cumulative };
    });

    const avgBalance = cumulative / filledDays.length;

    let color, label, msg;
    const cumL = cumulative / 1000;
    if (cumulative <= 0) {
        color = 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-800'; label = 'Balans Kumulatif Negatif / Euvolemia';
        msg = 'Target terpenuhi. Pastikan tidak ada tanda hipovolemia: MAP, laktat, UO.';
    } else if (cumL < 2) {
        color = 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-800'; label = 'Balans Kumulatif Ringan';
        msg = 'Balans kumulatif dalam batas aman. Pertahankan monitoring ketat.';
    } else if (cumL < 5) {
        color = 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-800'; label = 'Balans Kumulatif Sedang — Perlu Perhatian';
        msg = `Balans kumulatif ${cumL.toFixed(1)} L. Pertimbangkan fase Evacuation jika hemodinamik stabil.`;
    } else if (cumL < 10) {
        color = 'text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-800'; label = 'Balans Kumulatif Tinggi — Risiko Meningkat';
        msg = `Balans kumulatif ${cumL.toFixed(1)} L. Risiko disfungsi organ, ARDS, dan mortalitas meningkat. Target active de-resuscitation (fase E).`;
    } else {
        color = 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-800'; label = 'Balans Kumulatif Berat — Intervensi Segera';
        msg = `Balans kumulatif ${cumL.toFixed(1)} L (≥10 L). Berhubungan dengan mortalitas signifikan. Intervensi aktif: furosemid IV kontinu, pertimbangkan CRRT.`;
    }

    setCumbalRes({ history: history.filter(h => h !== null), cumulative, avgBalance, color, label, msg, days: filledDays.length });
  };

  const calcFluidOverload = () => {
    const dry = parseFloat(foDry);
    const curr = parseFloat(foCurrent);
    if (!dry || !curr || dry <= 0 || curr <= 0) return;

    const diffKg = curr - dry;
    const diffML = diffKg * 1000;
    const foPercent = (diffKg / dry) * 100;

    let color, label, msg, hint;
    if (foPercent < 0) {
        color = 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-800'; label = 'Defisit / Kemungkinan Hipovolemia';
        msg = `Berat turun ${Math.abs(foPercent).toFixed(1)}% dari baseline. Evaluasi tanda hipovolemia.`;
        hint = 'Pertimbangkan fase R atau O jika ada tanda hipoperfusi.';
    } else if (foPercent < 5) {
        color = 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-800'; label = 'Euvolemia (FO <5%)';
        msg = 'Fluid overload dalam batas normal.';
        hint = 'Pertahankan fase S (Stabilization).';
    } else if (foPercent < 10) {
        color = 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-800'; label = 'Overload Ringan (FO 5–10%)';
        msg = 'Monitor ketat. Batasi input cairan. Pertimbangkan transisi ke fase Evacuation.';
        hint = 'Evaluasi kesiapan masuk fase E (Evacuation).';
    } else if (foPercent < 15) {
        color = 'text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-800'; label = 'Overload Sedang (FO 10–15%) ⚠️';
        msg = 'Melebihi threshold 10% — indikasi fase Evacuation aktif. Pertimbangkan diuretik furosemid IV.';
        hint = '→ Masuk fase 🔵 E (Evacuation). Target balans negatif −500 s/d −1.500 mL/hari.';
    } else {
        color = 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-800'; label = 'Overload Berat (FO ≥15%) 🚨';
        msg = 'Overload berat — risiko edema paru, ARDS, disfungsi organ. Intervensi segera diperlukan.';
        hint = '→ Fase 🔵 E (Evacuation) — target negatif agresif, konsultasikan nefrologi.';
    }

    setFoRes({ diffKg, diffML, foPercent, color, label, msg, hint });
  };

  const calcFluidBalance = () => {
    const totalIn = (parseFloat(fbInputs.iv)||0) + (parseFloat(fbInputs.med)||0) + (parseFloat(fbInputs.nutri)||0) + (parseFloat(fbInputs.bolus)||0) + (parseFloat(fbInputs.oral)||0);
    const totalOut = (parseFloat(fbOutputs.uo)||0) + (parseFloat(fbOutputs.iwl)||0) + (parseFloat(fbOutputs.ngt)||0) + (parseFloat(fbOutputs.drain)||0) + (parseFloat(fbOutputs.other)||0);
    const balance = totalIn - totalOut;

    let color, label, msg;
    if (balance > 2000) {
        color = 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-800'; label = 'Balance Positif Berat (>2 L)';
        msg = 'Akumulasi >2 L — risiko edema, disfungsi organ, dan mortalitas meningkat. Intervensi aktif.';
    } else if (balance > 1000) {
        color = 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-800'; label = 'Balance Positif Sedang (1–2 L)';
        msg = 'Pertimbangkan pembatasan input dan evaluasi kebutuhan diuretik.';
    } else if (balance >= -500) {
        color = 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-800'; label = 'Balance Netral / Euvolemia';
        msg = 'Fluid balance dalam rentang target (–500 s/d +1.000 mL). Pertahankan.';
    } else if (balance >= -1500) {
        color = 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-800'; label = 'Balance Negatif (De-resusitasi)';
        msg = 'Balance negatif ringan-sedang — dapat diterima pada fase Evacuation.';
    } else {
        color = 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-800'; label = 'Balance Negatif Berat (<−1.5 L)';
        msg = 'Balance sangat negatif — periksa tanda hipovolemia dan kehilangan yang tidak terhitung.';
    }

    setFbRes({ totalIn, totalOut, balance, color, label, msg });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 overflow-x-hidden">
      
      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />
      
      {/* SECTION 1: Kebutuhan Cairan Basal */}
      <div className="flex flex-col gap-0">
        <h2 className="mt-2 mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-500" /> Kebutuhan Cairan Basal ICU
        </h2>
        
        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Berat Badan</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input 
                type="number" 
                value={bw} 
                onChange={e => {setBw(e.target.value); setB1Res(null); setB2Res(null); setFoDry(e.target.value);}} 
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

        <div className="mt-4">
          <button onClick={calcBasal} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px]">
             Hitung Cairan Basal
          </button>
        </div>

          {b1Res && (
            <div className="mt-4 pb-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
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
              <div className="mt-3">
                <SaveToHistoryButton 
                  module="cairan_basal" 
                  label={`Basal: ${b1Res.icuDay.toFixed(0)} mL/hari`}
                  inputs={{ bw, targetMaint }}
                  summary={`Cairan Basal ICU: ${b1Res.icuDay.toFixed(0)} mL/hari (${targetMaint} mL/kg/hari) · Rate: ${b1Res.icuHr.toFixed(1)} mL/jam`}
                  className="w-full"
                />
              </div>
            </div>
          )}
      </div>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* SECTION 2: Koreksi & Total */}
      <div className="flex flex-col gap-0 mt-4">
        <h2 className="mt-2 mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-500" /> Faktor Koreksi & Total Kebutuhan
        </h2>

        {/* Fase ROSE Selection */}
        <div className="mb-4">
          <div className="text-[12px] font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">Fase Klinis ROSE</div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {Object.entries(ROSE_DATA).map(([key, data]) => (
              <button 
                key={key}
                onClick={() => setRose(key)}
                className={`py-2 px-3 rounded-xl border text-[12px] font-bold transition-all ${rose === key ? `${data.bgBorder} ${data.colorText}` : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1C1C1E] text-slate-600 dark:text-slate-400'}`}
              >
                {data.label}
              </button>
            ))}
          </div>
          {rose && (
            <div className={`p-3 rounded-xl border text-sm ${ROSE_DATA[rose].bgBorder} ${ROSE_DATA[rose].colorText}`}>
              <div className="font-bold mb-1">Target Balans: {ROSE_DATA[rose].target}</div>
              <p className="text-[12px] opacity-90 leading-relaxed">{ROSE_DATA[rose].desc}</p>
            </div>
          )}
        </div>
        
        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Suhu Tubuh</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input 
                type="number" step="0.1"
                value={temp} 
                onChange={e => setTemp(e.target.value)} 
                placeholder="37.0" 
                className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/50 text-[14px] transition-all"
              />
              <span className="text-xs font-semibold text-slate-500 w-10 text-left">°C</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Status Ventilasi</span>
            <select 
              className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-indigo-500/50 text-[14px] transition-all" 
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
              className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-indigo-500/50 text-[14px] transition-all" 
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
                className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/50 text-[14px] transition-all"
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
                className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/50 text-[14px] transition-all"
              />
              <span className="text-xs font-semibold text-slate-500 w-10 text-left">mL</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Drain / Kateter</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input 
                type="number" value={drain} onChange={e => setDrain(e.target.value)} placeholder="0" 
                className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/50 text-[14px] transition-all"
              />
              <span className="text-xs font-semibold text-slate-500 w-10 text-left">mL</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Lainnya</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input 
                type="number" value={other} onChange={e => setOther(e.target.value)} placeholder="0" 
                className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/50 text-[14px] transition-all"
              />
              <span className="text-xs font-semibold text-slate-500 w-10 text-left">mL</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button onClick={calcCorrection} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px]">
             Hitung Total Kebutuhan
          </button>
        </div>

          {b2Res && (
            <div className="mt-4 pb-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
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
                  <div className="text-[12px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-1">Total Cairan Harian</div>
                  <div className="font-mono text-4xl font-bold text-indigo-600 dark:text-indigo-400 leading-tight">
                    {b2Res.total.toFixed(0)} <span className="text-[14px] text-indigo-500/70 font-sans font-medium">mL/hari</span>
                  </div>
                  <div className="text-[13px] text-indigo-600/80 dark:text-indigo-400/80 font-medium mt-1">Rate infus tunggal: {(b2Res.total/24).toFixed(1)} mL/jam</div>
                  <div className="text-[11px] text-indigo-600/70 dark:text-indigo-400/70 font-medium mt-1">Total per kgBB: {(b2Res.total/parseFloat(bw)).toFixed(1)} mL/kg/hari</div>
                </div>
              </div>
              <div className="mt-3">
                <SaveToHistoryButton 
                  module="total_cairan" 
                  label={`Total: ${b2Res.total.toFixed(0)} mL/hari`}
                  inputs={{ rose, temp, vent, sweat, uoTgt, ngt, drain, other }}
                  summary={`Total Kebutuhan Cairan: ${b2Res.total.toFixed(0)} mL/hari (Fase ROSE: ${rose ? ROSE_DATA[rose]?.label : 'Tidak dipilih'})`}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                />
              </div>
            </div>
          )}
      </div>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* SECTION 3: Balans Kumulatif */}
      <div className="flex flex-col gap-0 mt-4">
        <h2 className="mt-2 mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-2">
          <Calculator className="w-4 h-4 text-emerald-500" /> Balans Kumulatif 7 Hari
        </h2>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-4">
          {cumbalDays.map((val, i) => (
            <div key={i} className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">H {i + 1}</label>
              <input 
                type="number" 
                value={val}
                onChange={e => {
                  const newDays = [...cumbalDays];
                  newDays[i] = e.target.value;
                  setCumbalDays(newDays);
                }}
                placeholder="±mL"
                className="w-full bg-slate-50 dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 outline-none text-center font-mono font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/50 text-[13px] transition-all"
              />
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button onClick={calcCumulative} className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px]">
             Hitung Balans Kumulatif
          </button>
        </div>

        {cumbalRes && (
          <div className="mt-4 pb-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className={`p-4 rounded-xl border ${cumbalRes.color}`}>
              <div className="font-bold mb-1 text-sm">{cumbalRes.label}</div>
              <div className="text-2xl font-bold font-mono my-2">{cumbalRes.cumulative >= 0 ? '+' : ''}{cumbalRes.cumulative} mL</div>
              <p className="text-[12px] opacity-90 leading-relaxed mb-3">{cumbalRes.msg}</p>
              
              <div className="space-y-1.5 pt-3 border-t border-black/10 dark:border-white/10">
                {cumbalRes.history.map((h: any) => (
                  <div key={h.day} className="flex justify-between text-[11px] font-mono">
                    <span className="opacity-70">Hari {h.day}</span>
                    <span className="opacity-80">{h.value >= 0 ? '+' : ''}{h.value} mL</span>
                    <span className="font-bold">Kumulatif: {h.cum >= 0 ? '+' : ''}{h.cum} mL</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <SaveToHistoryButton 
                  module="balans_kumulatif" 
                  label={`Kumulatif: ${cumbalRes.cumulative >= 0 ? '+' : ''}${cumbalRes.cumulative} mL`}
                  inputs={{ cumbalDays }}
                  summary={`Balans Kumulatif ${cumbalRes.days} hari: ${cumbalRes.cumulative >= 0 ? '+' : ''}${cumbalRes.cumulative} mL (${cumbalRes.label})`}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* SECTION 4: Fluid Overload Assessment */}
      <div className="flex flex-col gap-0 mt-4">
        <h2 className="mt-2 mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-2">
          <Scale className="w-4 h-4 text-amber-500" /> Fluid Overload Assessment
        </h2>

        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">BB Kering / Baseline</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input 
                type="number" 
                value={foDry} 
                onChange={e => setFoDry(e.target.value)} 
                placeholder="60" 
                className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/50 text-[14px] transition-all"
              />
              <span className="text-xs font-semibold text-slate-500 w-10 text-left">kg</span>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">BB Saat Ini</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input 
                type="number" 
                value={foCurrent} 
                onChange={e => setFoCurrent(e.target.value)} 
                placeholder="66" 
                className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/50 text-[14px] transition-all"
              />
              <span className="text-xs font-semibold text-slate-500 w-10 text-left">kg</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button onClick={calcFluidOverload} className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px]">
             Hitung Fluid Overload
          </button>
        </div>

        {foRes && (
          <div className="mt-4 pb-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className={`p-4 rounded-xl border ${foRes.color}`}>
              <div className="font-bold mb-1 text-sm">{foRes.label}</div>
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-2xl font-bold font-mono">{foRes.foPercent >= 0 ? '+' : ''}{foRes.foPercent.toFixed(1)}%</div>
                <div className="text-sm opacity-80">({foRes.diffKg > 0 ? '+' : ''}{foRes.diffKg.toFixed(1)} kg)</div>
              </div>
              <p className="text-[12px] opacity-90 leading-relaxed font-medium mb-1">{foRes.msg}</p>
              <p className="text-[11px] opacity-80 leading-relaxed">{foRes.hint}</p>
              <div className="mt-4">
                <SaveToHistoryButton 
                  module="fluid_overload" 
                  label={`FO: ${foRes.foPercent >= 0 ? '+' : ''}${foRes.foPercent.toFixed(1)}%`}
                  inputs={{ foDry, foCurrent }}
                  summary={`Fluid Overload: ${foRes.foPercent >= 0 ? '+' : ''}${foRes.foPercent.toFixed(1)}% (+${foRes.diffKg.toFixed(1)} kg) — ${foRes.label}`}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* SECTION 5: Fluid Balance 24 Jam Aktual */}
      <div className="flex flex-col gap-0 mt-4">
        <h2 className="mt-2 mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-2">
          <Droplets className="w-4 h-4 text-cyan-500" /> Fluid Balance 24 Jam
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Inputs */}
          <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
            <div className="px-4 py-2 bg-slate-100 dark:bg-[#1C1C1E] rounded-t-xl">
              <span className="font-bold text-[10px] uppercase tracking-wider text-slate-700 dark:text-slate-300">Total Input (mL)</span>
            </div>
            {[
              { key: 'iv', label: 'Cairan IV Maint.' },
              { key: 'med', label: 'Obat IV / Flush' },
              { key: 'nutri', label: 'Nutrisi (EN/PN)' },
              { key: 'bolus', label: 'Bolus Resusitasi' },
              { key: 'oral', label: 'Input Oral/NGT' }
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between px-3 py-2.5 gap-2">
                <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300 flex-shrink-0">{item.label}</span>
                <input 
                  type="number" 
                  value={(fbInputs as any)[item.key]} 
                  onChange={e => setFbInputs({...fbInputs, [item.key]: e.target.value})} 
                  placeholder="0" 
                  className="w-20 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-2 py-1.5 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[13px] transition-all"
                />
              </div>
            ))}
          </div>

          {/* Outputs */}
          <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
            <div className="px-4 py-2 bg-slate-100 dark:bg-[#1C1C1E] rounded-t-xl">
              <span className="font-bold text-[10px] uppercase tracking-wider text-slate-700 dark:text-slate-300">Total Output (mL)</span>
            </div>
            {[
              { key: 'uo', label: 'Urin Output' },
              { key: 'iwl', label: 'IWL (Estimasi)' },
              { key: 'ngt', label: 'Output NGT/Muntah' },
              { key: 'drain', label: 'Output Drain/WSD' },
              { key: 'other', label: 'Output Lain' }
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between px-3 py-2.5 gap-2">
                <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300 flex-shrink-0">{item.label}</span>
                <input 
                  type="number" 
                  value={(fbOutputs as any)[item.key]} 
                  onChange={e => setFbOutputs({...fbOutputs, [item.key]: e.target.value})} 
                  placeholder="0" 
                  className="w-20 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-2 py-1.5 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[13px] transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <button onClick={calcFluidBalance} className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px]">
             Hitung Balance Aktual
          </button>
        </div>

        {fbRes && (
          <div className="mt-4 pb-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className={`p-4 rounded-xl border ${fbRes.color}`}>
              <div className="font-bold mb-1 text-sm">{fbRes.label}</div>
              <div className="text-3xl font-bold font-mono my-2">{fbRes.balance >= 0 ? '+' : ''}{fbRes.balance.toFixed(0)} mL</div>
              
              <div className="flex gap-4 text-[11px] font-mono opacity-80 mb-2">
                <div>IN: {fbRes.totalIn} mL</div>
                <div>OUT: {fbRes.totalOut} mL</div>
              </div>

              <p className="text-[12px] opacity-90 leading-relaxed font-medium mb-1">{fbRes.msg}</p>

              {rose && (
                <div className={`mt-3 p-2 rounded border text-[11px] ${ROSE_DATA[rose].bgBorder} ${ROSE_DATA[rose].colorText}`}>
                  Fase saat ini: <strong>{ROSE_DATA[rose].label}</strong> (Target: {ROSE_DATA[rose].target})<br/>
                  {fbRes.balance >= ROSE_DATA[rose].targetMin && fbRes.balance <= ROSE_DATA[rose].targetMax 
                    ? <span className="font-bold">✓ Sesuai target fase.</span> 
                    : <span className="font-bold">✗ Di luar target fase.</span>}
                </div>
              )}
              
              <div className="mt-4">
                <SaveToHistoryButton 
                  module="fluid_balance_24j" 
                  label={`Balance 24j: ${fbRes.balance >= 0 ? '+' : ''}${fbRes.balance.toFixed(0)} mL`}
                  inputs={{ fbInputs, fbOutputs }}
                  summary={`Fluid Balance 24 Jam: ${fbRes.balance >= 0 ? '+' : ''}${fbRes.balance.toFixed(0)} mL (In: ${fbRes.totalIn} mL, Out: ${fbRes.totalOut} mL)`}
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <Accordion title="📖 Teori & Referensi: Terapi Cairan & IWL">
        <ul className="pl-4 space-y-2 list-disc text-slate-600 dark:text-slate-400 text-sm">
          <li><strong className="text-slate-800 dark:text-slate-200">ROSE Concept:</strong> 4 fase resusitasi cairan menurut Malbrain et al. (2018): Resuscitation, Optimization, Stabilization, dan Evacuation. Setiap fase memiliki target balans cairan yang berbeda.</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Maintenance Cairan:</strong> Panduan NICE menyarankan 25-30 mL/kg/hari untuk Maintenance pasien dewasa normal. Pada ICU (CLASSIC trial), restriksi lebih baik.</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Fluid Overload:</strong> FO &gt;10% berhubungan dengan mortalitas (Sutherland et al., 2010). Segera inisiasi fase Evacuation.</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Cumulative Balance:</strong> Balans positif berkepanjangan meningkatkan mortalitas (Sakr et al., 2017).</li>
        </ul>
        <div className="mt-4 p-4 bg-slate-100 dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[11px] text-slate-500 dark:text-slate-400 italic">
          [1] Malbrain MLNG et al. Ann Intensive Care. 2018;8(1):66. <br/>
          [2] NICE CG174 Intravenous fluid therapy in adults. <br/>
          [3] CLASSIC trial, N Engl J Med. 2022.
        </div>
      </Accordion>
    </div>
  );
}
