import React, { useState, useEffect, useMemo } from 'react';
import { Droplets, Activity, Calculator, Scale, Info } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { SaveToHistoryButton } from '../../components/ui/SaveToHistoryButton';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { ClinicalReport } from '../../components/ui/ClinicalReport';
import { CalcSteps } from '../../components/ui/CalcSteps';
import { InputWarning } from '../../components/ui/InputWarning';
import { weightPlausibilityWarning } from '../../utils/validation';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';
import { calcBmi, calcIbw } from '../../utils/anthropometry';
import {
  fluidRequirement, fluidOverloadFromBalance, IWL_ML_PER_KG_DAY, SWEAT_EXTRA_ML, FEVER_THRESHOLD_C,
  type VentMode, type SweatLevel, type FluidRequirementResult,
} from '../../utils/fluids';
import { AbbrLegend } from '../../components/ui/AbbrLegend';
import { CalcActionBar } from '../../components/ui/CalcActionBar';
import { useCalcTrigger } from '../../hooks/useCalcTrigger';
import {
  basalSummary, totalCairanSummary, kumulatifSummary, overloadSummary, balance24Summary, type BarSummary,
} from '../../utils/cairanObatSummary';

type CairanTab = 'basal' | 'total' | 'balance' | 'kumulatif' | 'overload';
const CAIRAN_TABS: { id: CairanTab; label: string }[] = [
  { id: 'basal', label: 'Basal' },
  { id: 'total', label: 'Total' },
  { id: 'balance', label: 'Balance 24 j' },
  { id: 'kumulatif', label: 'Kumulatif' },
  { id: 'overload', label: 'Overload' },
];
const MISSING_RING = ' ring-2 ring-[var(--sys-red)]';

interface RosePhase {
  label: string; colorText: string; bgBorder: string;
  /** Arah balans menurut konsep ROSE (Malbrain 2018). */
  direction: string;
  /** Contoh rentang praktis — BUKAN ambang dari Malbrain 2018. */
  target: string; targetMin: number; targetMax: number;
  desc: string; hint: string;
}

const ROSE_DATA: Record<string, RosePhase> = {
  R: {
    label: '🔴 Resuscitation', colorText: 'text-red-600 dark:text-red-400', bgBorder: 'border-red-500 bg-red-500/5',
    direction: 'Positif — cairan diberikan selama masih responsif (fluid-responsive)',
    target: '+500 s/d +1.500 mL/24 jam', targetMin: 500, targetMax: 1500,
    desc: 'Tujuan: pulihkan perfusi organ, atasi syok. Berikan bolus/fluid challenge terukur (kristaloid isotonik; volume minimal yang bermakna ≈4 mL/kg) dan nilai ulang respons setiap pemberian.',
    hint: 'Hentikan resusitasi jika tidak ada fluid responsiveness. Positive balance terbatas dan terukur.'
  },
  O: {
    label: '🟠 Optimization', colorText: 'text-orange-600 dark:text-orange-400', bgBorder: 'border-orange-500 bg-orange-500/5',
    direction: 'Hentikan akumulasi — cairan hanya bila indeks responsivitas masih positif',
    target: '0 s/d +500 mL/24 jam', targetMin: 0, targetMax: 500,
    desc: 'Tujuan: fine-tune perfusi organ, titrasi vasopresor/inotropik. Pertanyaan kunci fase ini: kapan BERHENTI memberi cairan.',
    hint: 'Hindari volume loading berlebih. Gunakan parameter dinamik (PLR, PPV, SVV, end-expiratory occlusion).'
  },
  S: {
    label: '🟢 Stabilization', colorText: 'text-emerald-600 dark:text-emerald-400', bgBorder: 'border-emerald-500 bg-emerald-500/5',
    direction: 'Netral — hanya maintenance + penggantian kehilangan yang berlanjut',
    target: '±0 mL (net zero)', targetMin: -200, targetMax: 300,
    desc: 'Tujuan: cairan hanya untuk maintenance (kehilangan normal ginjal, GI, insensible) dan replacement kehilangan patologis yang berlanjut.',
    hint: 'Hitung cairan tersembunyi (obat, flush, nutrisi) — bisa >1 L/hari. Bila kebutuhan sudah terpenuhi lewat nutrisi/obat, hentikan cairan maintenance IV.'
  },
  E: {
    label: '🔵 Evacuation', colorText: 'text-blue-600 dark:text-blue-400', bgBorder: 'border-blue-500 bg-blue-500/5',
    direction: 'Negatif — de-resusitasi (diuretik / ultrafiltrasi)',
    target: '−500 s/d −1.500 mL/24 jam', targetMin: -1500, targetMax: -500,
    desc: 'Tujuan: mobilisasi dan eliminasi kelebihan cairan. Fluid overload didefinisikan ≥10% akumulasi cairan terhadap BB basal.',
    hint: 'Strategi: furosemid IV, pembatasan input, RRT dengan ultrafiltrasi bila perlu. Hindari terlalu agresif (risiko hipoperfusi) — uji responsivitas preload dapat menjadi batas.'
  }
};

export default function KalkulatorKebutuhanCairan() {
  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();

  // Satu bagian per tab (dulu 5 bagian bertumpuk dengan 5 tombol Hitung).
  const [tab, setTab] = useState<CairanTab>('basal');

  // Box 1
  const [bw, setBw] = useState('');
  const [targetMaint, setTargetMaint] = useState('25');
  const [b1Res, setB1Res] = useState<{ icuDay: number; icuHr: number; hs: number; diff: number; diffPct: number } | null>(null);

  // Box 2
  const [rose, setRose] = useState<string | null>(null);
  // Kosong = normotermi (perhitungan memakai 37 °C, tanpa koreksi demam) — bukan nilai pasien buatan.
  const [temp, setTemp] = useState('');
  const [vent, setVent] = useState<VentMode>('spontan');
  const [sweat, setSweat] = useState<SweatLevel>('none');
  // Target UO = target PEMANTAUAN, tidak ditambahkan ke kebutuhan cairan.
  const [uoTgt, setUoTgt] = useState('0.5');
  const [ngt, setNgt] = useState('');
  const [drain, setDrain] = useState('');
  const [other, setOther] = useState('');
  const [b2Res, setB2Res] = useState<FluidRequirementResult | null>(null);

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
  };

  const calcBasal = () => {
    const w = parseFloat(bw);
    const t = parseInt(targetMaint);
    // Input belum lengkap → kosongkan hasil (tidak boleh ada hasil basi).
    if (!w) { setB1Res(null); return; }

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

  // Pendekatan A (NICE CG174 / Malbrain 2018): total = maintenance + kehilangan ABNORMAL.
  // IWL dasar & target UO sudah tercakup dalam maintenance → hanya ditampilkan sebagai informasi.
  const calcCorrection = () => {
    const r = fluidRequirement({
      weightKg: parseFloat(bw),
      maintPerKg: parseInt(targetMaint) || 25,
      tempC: temp === '' ? undefined : parseFloat(temp),
      vent,
      sweat,
      uoTargetMlKgH: parseFloat(uoTgt),
      ngtMl: parseFloat(ngt),
      drainMl: parseFloat(drain),
      otherMl: parseFloat(other),
    });
    setB2Res(r);
  };

  // Catatan NICE CG174 untuk obesitas & volume besar (butuh TB; BBI butuh JK).
  const niceNotes = (totalMl: number | null): string[] => {
    const notes: string[] = [];
    const w = parseFloat(bw);
    const h = parseFloat(patient.heightCm || '');
    if (w > 0 && h > 0) {
      const bmi = calcBmi(w, h);
      if (bmi >= 30) {
        const ibwTxt = patient.gender === 'L' || patient.gender === 'P'
          ? ` (BBI ≈ ${calcIbw(h, patient.gender === 'P').toFixed(1)} kg → ${(calcIbw(h, patient.gender === 'P') * (parseInt(targetMaint) || 25)).toFixed(0)} mL/hari pada ${targetMaint} mL/kg)`
          : ' (isi jenis kelamin pasien untuk menghitung BBI)';
        notes.push(`IMT ${bmi.toFixed(1)} kg/m² — NICE CG174: pada pasien obes, resepkan berdasarkan BB ideal${ibwTxt} dengan rentang per-kg bawah; jarang butuh >3 L/hari total.${bmi > 40 ? ' IMT >40 → konsultasikan ke ahli.' : ''}`);
      }
    }
    if (totalMl !== null && totalMl > 2500) notes.push('NICE CG174: meresepkan >2,5 L/hari meningkatkan risiko hiponatremia — pantau Na serum.');
    return notes;
  };

  const calcCumulative = () => {
    const values = cumbalDays.map(v => v === '' ? null : parseFloat(v));
    const filledDays = values.filter(v => v !== null) as number[];
    if (filledDays.length === 0) { setCumbalRes(null); return; }

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

    const baseKg = parseFloat(foDry) || parseFloat(bw);
    const foPct = fluidOverloadFromBalance(cumulative, baseKg);
    setCumbalRes({ history: history.filter(h => h !== null), cumulative, avgBalance, color, label, msg, days: filledDays.length, foPct, baseKg });
  };

  const calcFluidOverload = () => {
    const dry = parseFloat(foDry);
    const curr = parseFloat(foCurrent);
    if (!dry || !curr || dry <= 0 || curr <= 0) { setFoRes(null); return; }

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
        hint = '→ Masuk fase 🔵 E (Evacuation). Contoh target praktis: balans negatif −500 s/d −1.500 mL/hari.';
    } else {
        color = 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-800'; label = 'Overload Berat (FO ≥15%) 🚨';
        msg = 'Overload berat — risiko edema paru, ARDS, disfungsi organ. Intervensi segera diperlukan.';
        hint = '→ Fase 🔵 E (Evacuation) — target negatif agresif, konsultasikan nefrologi.';
    }

    setFoRes({ diffKg, diffML, foPercent, color, label, msg, hint });
  };

  const calcFluidBalance = () => {
    // Belum ada angka sama sekali → tidak ada hasil (bukan "balance 0").
    if (![...Object.values(fbInputs), ...Object.values(fbOutputs)].some(v => v.trim() !== '')) { setFbRes(null); return; }
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
        msg = 'Fluid balance dalam rentang pedoman praktis (–500 s/d +1.000 mL). Sesuaikan dengan fase ROSE.';
    } else if (balance >= -1500) {
        color = 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-800'; label = 'Balance Negatif (De-resusitasi)';
        msg = 'Balance negatif ringan-sedang — dapat diterima pada fase Evacuation.';
    } else {
        color = 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-800'; label = 'Balance Negatif Berat (<−1.5 L)';
        msg = 'Balance sangat negatif — periksa tanda hipovolemia dan kehilangan yang tidak terhitung.';
    }

    setFbRes({ totalIn, totalOut, balance, color, label, msg });
  };

  // Satu pemicu per tab: Hitung sekali → setelah itu hasil tab tsb ikut berubah otomatis.
  const bwFilled = parseFloat(bw) > 0;
  const trBasal = useCalcTrigger({ compute: calcBasal, deps: [bw, targetMaint], required: [{ id: 'cairan-bw', label: 'Berat badan', filled: bwFilled }] });
  const trTotal = useCalcTrigger({
    compute: calcCorrection,
    deps: [bw, targetMaint, temp, vent, sweat, uoTgt, ngt, drain, other],
    required: [{ id: 'cairan-bw', label: 'Berat badan', filled: bwFilled }],
  });
  const trBalance = useCalcTrigger({
    compute: calcFluidBalance,
    deps: [fbInputs, fbOutputs],
    required: [{ id: 'cairan-fb-iv', label: 'Minimal satu input/output', filled: [...Object.values(fbInputs), ...Object.values(fbOutputs)].some(v => v.trim() !== '') }],
  });
  const trKumulatif = useCalcTrigger({
    compute: calcCumulative,
    deps: [cumbalDays, foDry, bw],
    required: [{ id: 'cairan-h1', label: 'Balans minimal 1 hari', filled: cumbalDays.some(v => v.trim() !== '') }],
  });
  const trOverload = useCalcTrigger({
    compute: calcFluidOverload,
    deps: [foDry, foCurrent],
    required: [
      { id: 'cairan-fo-dry', label: 'BB kering', filled: parseFloat(foDry) > 0 },
      { id: 'cairan-fo-current', label: 'BB saat ini', filled: parseFloat(foCurrent) > 0 },
    ],
  });
  const tr = { basal: trBasal, total: trTotal, balance: trBalance, kumulatif: trKumulatif, overload: trOverload }[tab];
  const ring = (id: string) => (tr.isMissing(id) ? MISSING_RING : '');
  const bar: BarSummary | null =
    tab === 'basal' ? (b1Res ? basalSummary(b1Res.icuDay, b1Res.icuHr, targetMaint) : null)
    : tab === 'total' ? (b2Res ? totalCairanSummary(b2Res.total, b2Res.rateMlH, rose ? ROSE_DATA[rose].label : null) : null)
    : tab === 'balance' ? (fbRes ? balance24Summary(fbRes.balance, fbRes.totalIn, fbRes.totalOut, fbRes.label) : null)
    : tab === 'kumulatif' ? (cumbalRes ? kumulatifSummary(cumbalRes.cumulative, cumbalRes.days, cumbalRes.label) : null)
    : (foRes ? overloadSummary(foRes.foPercent, foRes.diffKg, foRes.label) : null);
  const barLabel = { basal: 'Hitung Cairan Basal', total: 'Hitung Total Kebutuhan', balance: 'Hitung Balance 24 Jam', kumulatif: 'Hitung Balans Kumulatif', overload: 'Hitung Fluid Overload' }[tab];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 overflow-x-hidden">
      
      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />

      {/* Pilih bagian — satu bagian tampil sekaligus */}
      <div role="tablist" aria-label="Bagian kalkulator cairan" className="flex flex-wrap w-full bg-slate-100 dark:bg-[#2C2C2E] p-1 rounded-xl gap-1">
        {CAIRAN_TABS.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 min-w-[5.5rem] px-2 py-2 text-[12px] font-bold rounded-lg whitespace-nowrap transition-colors ${tab === t.id ? 'bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      
      {/* SECTION 1: Kebutuhan Cairan Basal (BB & target maintenance juga dipakai tab Total) */}
      {(tab === 'basal' || tab === 'total') && (
      <div className="flex flex-col gap-0">
        <h2 className="mt-2 mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-500" /> {tab === 'basal' ? 'Kebutuhan Cairan Basal ICU' : 'Berat Badan & Maintenance'}
        </h2>
        
        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-1 min-w-[7rem]">Berat Badan</span>
            <div className="flex-1 min-w-[9rem] flex items-center justify-end gap-2">
              <input 
                id="cairan-bw"
                type="number" inputMode="decimal"
                value={bw} 
                onChange={e => {setBw(e.target.value); setFoDry(e.target.value);}} 
                placeholder="70" 
                className={`w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all${ring('cairan-bw')}`}
              />
              <span className="text-xs font-semibold text-slate-500 w-10 text-left">kg</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-1 min-w-[7rem]">Target Maint.</span>
            <select 
              className="flex-1 min-w-[9rem] max-w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" 
              value={targetMaint} 
              onChange={e => setTargetMaint(e.target.value)}
            >
              <option value="20">20 mL/kg/hari (rendah: lansia/rapuh, ginjal, jantung)</option>
              <option value="25">25 mL/kg/hari (NICE batas bawah)</option>
              <option value="30">30 mL/kg/hari (NICE batas atas)</option>
              <option value="35">35 mL/kg/hari (di atas rentang NICE)</option>
            </select>
          </div>
        </div>

          {tab === 'basal' && b1Res && <InputWarning message={weightPlausibilityWarning(parseFloat(bw))} />}
          {tab === 'basal' && b1Res && (
            <div id="cairan-hasil" className="scroll-mt-4 mt-4 pb-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <h2 className="mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Hasil Kalkulasi Basal
              </h2>
              <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 grid grid-cols-2">
                <div className="p-4 flex flex-col items-center justify-center text-center bg-blue-50/50 dark:bg-blue-900/10">
                  <div className="text-[12px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">Maintenance (NICE)</div>
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
                <CalcSteps
                  tone="blue"
                  steps={[
                    {
                      label: 'Langkah 1 — Maintenance dewasa (NICE CG174):',
                      formula: `Basal = target × BB = ${targetMaint} × ${bw} = ${b1Res.icuDay.toFixed(0)} mL/hari\nLaju = ${b1Res.icuDay.toFixed(0)} ÷ 24 = ${b1Res.icuHr.toFixed(1)} mL/jam`,
                      note: 'NICE: 25–30 mL/kg/hari air; pertimbangkan 20–25 mL/kg/hari pada lansia/rapuh, gangguan ginjal, gagal jantung, malnutrisi/risiko refeeding. Sudah mencakup kehilangan normal (urine + IWL).',
                    },
                    {
                      label: 'Langkah 2 — Pembanding Holliday-Segar (4-2-1):',
                      formula: (() => {
                        const w = parseFloat(bw);
                        if (w <= 10) return `BB ≤10 kg: ${w} × 100 = ${b1Res.hs.toFixed(0)} mL/hari`;
                        if (w <= 20) return `10 kg pertama: 1000 mL\n+ ${(w - 10).toFixed(0)} kg berikutnya × 50 = ${((w - 10) * 50).toFixed(0)} mL\nTotal = ${b1Res.hs.toFixed(0)} mL/hari`;
                        return `10 kg pertama: 1000 mL\n10 kg kedua: 500 mL\n+ ${(w - 20).toFixed(0)} kg sisanya × 20 = ${((w - 20) * 20).toFixed(0)} mL\nTotal = ${b1Res.hs.toFixed(0)} mL/hari`;
                      })(),
                      note: `Selisih vs restriksi ICU: ${b1Res.diff.toFixed(0)} mL (${b1Res.diffPct}%) — Holliday-Segar dirancang untuk pediatri/pasien stabil, cenderung berlebih untuk dewasa kritis.`,
                    },
                  ]}
                  footer="Ini baru maintenance basal — tambahan untuk kehilangan abnormal (demam, diaforesis, NGT/drain) dihitung di bagian Faktor Koreksi di bawah."
                />
              </div>
              <div className="mt-3"><InputWarning messages={niceNotes(null)} /></div>
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
      )}

      {/* SECTION 2: Koreksi & Total */}
      {tab === 'total' && (
      <div className="flex flex-col gap-0">
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
              <div className="font-bold mb-1">Arah balans: {ROSE_DATA[rose].direction}</div>
              <p className="text-[12px] opacity-90 leading-relaxed">{ROSE_DATA[rose].desc}</p>
              <p className="text-[11px] opacity-80 leading-relaxed mt-1">Contoh rentang praktis: {ROSE_DATA[rose].target} — bukan ambang baku dari Malbrain 2018.</p>
            </div>
          )}
        </div>
        
        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-1 min-w-[7rem]">Suhu Tubuh</span>
            <div className="flex-1 min-w-[9rem] flex items-center justify-end gap-2">
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

          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-1 min-w-[7rem]">Status Ventilasi <span className="font-normal text-slate-500">(info IWL)</span></span>
            <select 
              className="flex-1 min-w-[9rem] max-w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-indigo-500/50 text-[14px] transition-all" 
              value={vent} onChange={e => setVent(e.target.value as VentMode)}
            >
              <option value="spontan">Napas spontan</option>
              <option value="ventilator">Ventilator mekanik</option>
              <option value="hfnc">HFNC / NIV</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-1 min-w-[7rem]">Diaphoresis</span>
            <select 
              className="flex-1 min-w-[9rem] max-w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-indigo-500/50 text-[14px] transition-all" 
              value={sweat} onChange={e => setSweat(e.target.value as SweatLevel)}
            >
              <option value="none">Tidak ada</option>
              <option value="mild">Ringan (+{SWEAT_EXTRA_ML.mild} mL, estimasi)</option>
              <option value="moderate">Sedang (+{SWEAT_EXTRA_ML.moderate} mL, estimasi)</option>
              <option value="severe">Berat (+{SWEAT_EXTRA_ML.severe} mL, estimasi)</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-1 min-w-[7rem]">Target UO <span className="font-normal text-slate-500">(pantau)</span></span>
            <div className="flex-1 min-w-[9rem] flex items-center justify-end gap-2">
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
            <span className="font-bold text-[10px] uppercase tracking-wider text-slate-700 dark:text-slate-300 select-none">Kehilangan Abnormal Terukur (mL/hari)</span>
          </div>

          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-1 min-w-[7rem]">NGT / GT</span>
            <div className="flex-1 min-w-[9rem] flex items-center justify-end gap-2">
              <input 
                type="number" value={ngt} onChange={e => setNgt(e.target.value)} placeholder="0" 
                className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/50 text-[14px] transition-all"
              />
              <span className="text-xs font-semibold text-slate-500 w-10 text-left">mL</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-1 min-w-[7rem]">Drain / Kateter</span>
            <div className="flex-1 min-w-[9rem] flex items-center justify-end gap-2">
              <input 
                type="number" value={drain} onChange={e => setDrain(e.target.value)} placeholder="0" 
                className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/50 text-[14px] transition-all"
              />
              <span className="text-xs font-semibold text-slate-500 w-10 text-left">mL</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-1 min-w-[7rem]">Lainnya</span>
            <div className="flex-1 min-w-[9rem] flex items-center justify-end gap-2">
              <input 
                type="number" value={other} onChange={e => setOther(e.target.value)} placeholder="0" 
                className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/50 text-[14px] transition-all"
              />
              <span className="text-xs font-semibold text-slate-500 w-10 text-left">mL</span>
            </div>
          </div>
        </div>

          {b2Res && (
            <div id="cairan-hasil" className="scroll-mt-4 mt-4 pb-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                <div className="p-4 bg-slate-50 dark:bg-[#2C2C2E]">
                  <div className="space-y-1.5 mb-2">
                    <div className="flex justify-between text-[13px] text-slate-700 dark:text-slate-300"><span>Maintenance (termasuk urine & IWL normal)</span><span className="font-mono text-slate-700 dark:text-slate-300">{b2Res.maint.toFixed(0)} mL</span></div>
                    {b2Res.feverExtra > 0 && <div className="flex justify-between text-[13px] font-medium text-slate-700 dark:text-slate-200"><span>+ Demam (estimasi)</span><span className="font-mono text-amber-600 dark:text-amber-400">+{b2Res.feverExtra.toFixed(0)} mL</span></div>}
                    {b2Res.sweatExtra > 0 && <div className="flex justify-between text-[13px] font-medium text-slate-700 dark:text-slate-200"><span>+ Diaforesis (estimasi)</span><span className="font-mono text-amber-600 dark:text-amber-400">+{b2Res.sweatExtra.toFixed(0)} mL</span></div>}
                    {b2Res.measuredLosses > 0 && (
                      <div className="flex justify-between text-[13px] font-medium text-slate-700 dark:text-slate-200"><span>+ Kehilangan abnormal terukur</span><span className="font-mono">+{b2Res.measuredLosses.toFixed(0)} mL</span></div>
                    )}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Tidak dijumlahkan (sudah tercakup maintenance): IWL dasar ≈ {b2Res.iwlBaseInfo.toFixed(0)} mL/hari (estimasi).
                    {b2Res.uoTargetMlH !== null && <> Target UO ≥ {b2Res.uoTargetMlH.toFixed(0)} mL/jam (≈ {b2Res.uoTargetMlDay?.toFixed(0)} mL/hari) — target pemantauan, bukan cairan tambahan.</>}
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center py-6 bg-indigo-50 dark:bg-indigo-900/10">
                  <div className="text-[12px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-1">Total Cairan Harian</div>
                  <div className="font-mono text-4xl font-bold text-indigo-600 dark:text-indigo-400 leading-tight">
                    {b2Res.total.toFixed(0)} <span className="text-[14px] text-indigo-500/70 font-sans font-medium">mL/hari</span>
                  </div>
                  <div className="text-[13px] text-indigo-600/80 dark:text-indigo-400/80 font-medium mt-1">Rate infus tunggal: {(b2Res.total/24).toFixed(1)} mL/jam</div>
                  <div className="text-[11px] text-indigo-600/70 dark:text-indigo-400/70 font-medium mt-1">Total per kgBB: {b2Res.perKgDay.toFixed(1)} mL/kg/hari</div>
                </div>
              </div>
              <div className="mt-3">
                <CalcSteps
                  tone="blue"
                  steps={(() => {
                    const r = b2Res;
                    const hasExtra = r.feverExtra > 0 || r.sweatExtra > 0;
                    const hasLoss = r.measuredLosses > 0;
                    const parts = [r.maint, ...(r.feverExtra > 0 ? [r.feverExtra] : []), ...(r.sweatExtra > 0 ? [r.sweatExtra] : []), ...(hasLoss ? [r.measuredLosses] : [])];
                    let n = 1;
                    return [
                      {
                        label: `Langkah ${n++} — Maintenance (NICE CG174):`,
                        formula: `Maintenance = ${targetMaint} mL/kg × ${bw} kg = ${r.maint.toFixed(0)} mL/hari`,
                        note: 'Sudah mencakup kehilangan normal: urine obligat + insensible water loss (Malbrain 2018: maintenance menutup kehilangan normal ginjal, GI, insensible).',
                      },
                      ...(hasExtra ? [{
                        label: `Langkah ${n++} — Tambahan demam / diaforesis (estimasi praktis):`,
                        formula: [
                          r.feverExtra > 0 ? `Demam: ${r.maint.toFixed(0)} × 10% × (${temp} − ${FEVER_THRESHOLD_C}) = +${r.feverExtra.toFixed(0)} mL` : '',
                          r.sweatExtra > 0 ? `Diaforesis (${sweat === 'mild' ? 'ringan' : sweat === 'moderate' ? 'sedang' : 'berat'}) = +${r.sweatExtra.toFixed(0)} mL` : '',
                        ].filter(Boolean).join('\n'),
                        note: 'Konstanta (10%/°C di atas 37,5 °C; diaforesis 200/500/900 mL) = estimasi praktis, tidak tersumber guideline — validasi dengan balans & BB harian.',
                      }] : []),
                      ...(hasLoss ? [{
                        label: `Langkah ${n++} — Kehilangan abnormal terukur (replacement):`,
                        formula: `NGT ${r.ngt} + drain ${r.drain} + lainnya ${r.other} = ${r.measuredLosses.toFixed(0)} mL`,
                        note: 'Ganti sesuai volume DAN komposisi cairan yang hilang (NICE CG174; mis. cairan lambung kaya klorida).',
                      }] : []),
                      {
                        label: `Langkah ${n++} — Total kebutuhan 24 jam:`,
                        formula: `Total = ${parts.map(v => v.toFixed(0)).join(' + ')} = ${r.total.toFixed(0)} mL/hari\nLaju = ${r.total.toFixed(0)} ÷ 24 = ${r.rateMlH.toFixed(1)} mL/jam`,
                        note: 'Kurangi input lain yang sudah berjalan (obat drip, flush, nutrisi enteral/TPN) — cairan "tersembunyi" bisa >1 L/hari (Malbrain 2018).',
                      },
                      {
                        label: 'Tidak dijumlahkan (mencegah hitung ganda):',
                        formula: `IWL dasar ≈ ${IWL_ML_PER_KG_DAY[vent]} mL/kg × ${bw} kg = ${r.iwlBaseInfo.toFixed(0)} mL/hari (estimasi; bagian dari maintenance)` +
                          (r.uoTargetMlH !== null ? `\nTarget UO = ${uoTgt} mL/kg/jam × ${bw} kg = ${r.uoTargetMlH.toFixed(0)} mL/jam (target pemantauan)` : ''),
                        note: 'Versi lama menambahkan IWL dan target UO di atas maintenance sehingga kebutuhan terhitung ganda (≈2× lipat).',
                      },
                    ];
                  })()}
                  footer="Estimasi kebutuhan — sesuaikan dengan fase ROSE, balans harian aktual, dan status volume klinis."
                />
              </div>
              <div className="mt-3"><InputWarning messages={niceNotes(b2Res.total)} /></div>
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
      )}

      {/* SECTION 3: Balans Kumulatif */}
      {tab === 'kumulatif' && (
      <div className="flex flex-col gap-0">
        <h2 className="mt-2 mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-2">
          <Calculator className="w-4 h-4 text-emerald-500" /> Balans Kumulatif 7 Hari
        </h2>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-4">
          {cumbalDays.map((val, i) => (
            <div key={i} className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">H {i + 1}</label>
              <input
                id={`cairan-h${i + 1}`}
                type="number" inputMode="decimal"
                value={val}
                onChange={e => {
                  const newDays = [...cumbalDays];
                  newDays[i] = e.target.value;
                  setCumbalDays(newDays);
                }}
                placeholder="±mL"
                className={`w-full bg-slate-50 dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 outline-none text-center font-mono font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/50 text-[13px] transition-all${i === 0 ? ring('cairan-h1') : ''}`}
              />
            </div>
          ))}
        </div>

        {cumbalRes && (
          <div id="cairan-hasil" className="scroll-mt-4 mt-4 pb-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className={`p-4 rounded-xl border ${cumbalRes.color}`}>
              <div className="font-bold mb-1 text-sm">{cumbalRes.label}</div>
              <div className="text-2xl font-bold font-mono my-2">{cumbalRes.cumulative >= 0 ? '+' : ''}{cumbalRes.cumulative} mL</div>
              <p className="text-[12px] opacity-90 leading-relaxed mb-1">{cumbalRes.msg}</p>
              {cumbalRes.foPct !== null && (
                <p className="text-[12px] font-semibold leading-relaxed mb-1">
                  Akumulasi cairan = {(cumbalRes.cumulative / 1000).toFixed(2)} L ÷ {cumbalRes.baseKg} kg × 100 = {cumbalRes.foPct.toFixed(1)}%{cumbalRes.foPct >= 10 ? ' → memenuhi definisi fluid overload (≥10%)' : ''}
                </p>
              )}
              <p className="text-[11px] opacity-75 leading-relaxed mb-3">Ambang 2/5/10 L = pedoman praktis (bukan ambang baku). Definisi fluid overload: akumulasi ≥10% BB basal (Bouchard 2009; Malbrain 2018).</p>
              
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
      )}

      {/* SECTION 4: Fluid Overload Assessment */}
      {tab === 'overload' && (
      <div className="flex flex-col gap-0">
        <h2 className="mt-2 mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-2">
          <Scale className="w-4 h-4 text-amber-500" /> Fluid Overload Assessment
        </h2>

        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-1 min-w-[7rem]">BB Kering / Baseline</span>
            <div className="flex-1 min-w-[9rem] flex items-center justify-end gap-2">
              <input 
                id="cairan-fo-dry"
                type="number" inputMode="decimal"
                value={foDry} 
                onChange={e => setFoDry(e.target.value)} 
                placeholder="60" 
                className={`w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/50 text-[14px] transition-all${ring('cairan-fo-dry')}`}
              />
              <span className="text-xs font-semibold text-slate-500 w-10 text-left">kg</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-1 min-w-[7rem]">BB Saat Ini</span>
            <div className="flex-1 min-w-[9rem] flex items-center justify-end gap-2">
              <input 
                id="cairan-fo-current"
                type="number" inputMode="decimal"
                value={foCurrent} 
                onChange={e => setFoCurrent(e.target.value)} 
                placeholder="66" 
                className={`w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/50 text-[14px] transition-all${ring('cairan-fo-current')}`}
              />
              <span className="text-xs font-semibold text-slate-500 w-10 text-left">kg</span>
            </div>
          </div>
        </div>

        {foRes && (
          <div id="cairan-hasil" className="scroll-mt-4 mt-4 pb-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className={`p-4 rounded-xl border ${foRes.color}`}>
              <div className="font-bold mb-1 text-sm">{foRes.label}</div>
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-2xl font-bold font-mono">{foRes.foPercent >= 0 ? '+' : ''}{foRes.foPercent.toFixed(1)}%</div>
                <div className="text-sm opacity-80">({foRes.diffKg > 0 ? '+' : ''}{foRes.diffKg.toFixed(1)} kg)</div>
              </div>
              <p className="text-[12px] opacity-90 leading-relaxed font-medium mb-1">{foRes.msg}</p>
              <p className="text-[11px] opacity-80 leading-relaxed">{foRes.hint}</p>
              <p className="text-[11px] opacity-70 leading-relaxed mt-1">Ambang 10% tersumber (Bouchard 2009: FO &gt;10% kenaikan BB dari basal berhubungan independen dengan mortalitas pada AKI); batas 5% & 15% = pembagian praktis.</p>
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
      )}

      {/* SECTION 5: Fluid Balance 24 Jam Aktual */}
      {tab === 'balance' && (
      <div className="flex flex-col gap-0">
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
                <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300 min-w-0">{item.label}</span>
                <input
                  id={`cairan-fb-${item.key}`}
                  type="number" inputMode="decimal"
                  value={(fbInputs as any)[item.key]} 
                  onChange={e => setFbInputs({...fbInputs, [item.key]: e.target.value})} 
                  placeholder="0" 
                  className={`w-20 shrink-0 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-2 py-1.5 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[13px] transition-all${item.key === 'iv' ? ring('cairan-fb-iv') : ''}`}
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
                <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300 min-w-0">{item.label}</span>
                <input
                  id={`cairan-fb-out-${item.key}`}
                  type="number" inputMode="decimal"
                  value={(fbOutputs as any)[item.key]} 
                  onChange={e => setFbOutputs({...fbOutputs, [item.key]: e.target.value})} 
                  placeholder="0" 
                  className="w-20 shrink-0 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-2 py-1.5 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[13px] transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {fbRes && (
          <div id="cairan-hasil" className="scroll-mt-4 mt-4 pb-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className={`p-4 rounded-xl border ${fbRes.color}`}>
              <div className="font-bold mb-1 text-sm">{fbRes.label}</div>
              <div className="text-3xl font-bold font-mono my-2">{fbRes.balance >= 0 ? '+' : ''}{fbRes.balance.toFixed(0)} mL</div>
              
              <div className="flex gap-4 text-[11px] font-mono opacity-80 mb-2">
                <div>IN: {fbRes.totalIn} mL</div>
                <div>OUT: {fbRes.totalOut} mL</div>
              </div>

              <p className="text-[12px] opacity-90 leading-relaxed font-medium mb-1">{fbRes.msg}</p>
              <p className="text-[11px] opacity-75 leading-relaxed">Kategori &gt;2 L / 1–2 L / −500 s/d +1.000 mL = pedoman praktis. Malbrain 2018: balans harian positif yang menetap berhubungan dengan mortalitas lebih tinggi; dua hari berturut-turut balans negatif pada minggu pertama ICU merupakan prediktor kesintasan.</p>

              {rose && (
                <div className={`mt-3 p-2 rounded border text-[11px] ${ROSE_DATA[rose].bgBorder} ${ROSE_DATA[rose].colorText}`}>
                  Fase saat ini: <strong>{ROSE_DATA[rose].label}</strong> — arah: {ROSE_DATA[rose].direction}<br/>
                  {fbRes.balance >= ROSE_DATA[rose].targetMin && fbRes.balance <= ROSE_DATA[rose].targetMax 
                    ? <span className="font-bold">✓ Dalam contoh rentang praktis ({ROSE_DATA[rose].target}).</span> 
                    : <span className="font-bold">✗ Di luar contoh rentang praktis ({ROSE_DATA[rose].target}) — nilai klinis.</span>}
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
      )}

      <Accordion title="📖 Teori & Referensi: Terapi Cairan & IWL">
        <ul className="pl-4 space-y-2 list-disc text-slate-600 dark:text-slate-400 text-sm">
          <li><strong className="text-slate-800 dark:text-slate-200">Konsep ROSE:</strong> 4 fase terapi cairan (Malbrain 2018): Resuscitation, Optimization, Stabilization, Evacuation — tiap fase menuntut sikap berbeda, menjawab 4 pertanyaan: kapan mulai cairan, kapan berhenti, kapan mulai de-resusitasi, kapan berhenti de-resusitasi. Rentang mL per fase di aplikasi ini adalah contoh praktis, bukan ambang dari makalah tersebut.</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Maintenance:</strong> NICE CG174: 25–30 mL/kg/hari air, ±1 mmol/kg/hari K⁺, Na⁺, Cl⁻, dan 50–100 g/hari glukosa; pertimbangkan 20–25 mL/kg/hari pada lansia/rapuh, gangguan ginjal, gagal jantung, malnutrisi/risiko refeeding. Pasien obes: pakai BB ideal, jarang butuh &gt;3 L/hari. &gt;2,5 L/hari meningkatkan risiko hiponatremia.</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Tanpa hitung ganda:</strong> maintenance sudah menutup kehilangan normal (urine + IWL). Yang ditambahkan hanya kehilangan abnormal yang berlanjut (replacement), idealnya sesuai volume dan komposisinya.</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Restriktif vs standar:</strong> CLASSIC (2022, syok septik di ICU) — mortalitas 90 hari 42,3% vs 42,1% (tidak berbeda); CLOVERS (2023, hipotensi akibat sepsis) — 14,0% vs 14,9% (tidak berbeda). Restriksi aman tetapi tidak terbukti menurunkan mortalitas.</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Fluid overload:</strong> akumulasi &gt;10% dari BB basal berhubungan independen dengan mortalitas pada AKI (Bouchard 2009, PICARD; OR kematian 2,07 saat inisiasi dialisis).</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Balans kumulatif:</strong> balans lebih positif meningkatkan risiko kematian pada sepsis (Sakr 2017).</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Estimasi praktis (tidak tersumber guideline):</strong> IWL 12 / 9 / 6,5 mL/kg/hari (spontan / HFNC-NIV / ventilator), diaforesis +200 / 500 / 900 mL, demam +10% maintenance per °C di atas 37,5 °C.</li>
        </ul>
        <div className="mt-4 p-4 bg-slate-100 dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[11px] text-slate-500 dark:text-slate-400 italic">
          [1] Malbrain MLNG et al. Principles of fluid management and stewardship in septic shock. Ann Intensive Care 2018;8:66. <br/>
          [2] NICE CG174. Intravenous fluid therapy in adults in hospital (2013, diperbarui 2017). <br/>
          [3] Meyhoff TS et al. (CLASSIC). N Engl J Med 2022;386:2459–70. <br/>
          [4] Shapiro NI et al. (CLOVERS). N Engl J Med 2023;388:499–510. <br/>
          [5] Bouchard J et al. Kidney Int 2009;76:422–7. <br/>
          [6] Sakr Y et al. Crit Care Med 2017;45:386–94.
        </div>
      </Accordion>
      <AbbrLegend
        terms={[
          'ROSE', 'PLR', 'PPV', 'SVV', 'GI', 'IV', 'BB', 'BBI', 'IMT', 'JK', 'RRT', 'CRRT', 'NICE', 'CG', 'MAP', 'UO',
          'ARDS', 'AKI', 'FO', 'ICU', 'IWL', 'NGT', 'GT', 'WSD', 'HFNC', 'NIV', 'TPN', 'EN', 'PN', 'OR-odds',
        ]}
      />
      <CalcActionBar
        armed={tr.armed}
        onCalculate={tr.trigger}
        label={barLabel}
        summary={bar?.text ?? null}
        summaryTone={bar?.tone ?? 'neutral'}
        caption={bar?.caption}
        missing={tr.missing}
        resultTargetId="cairan-hasil"
      />
    </div>
  );
}
