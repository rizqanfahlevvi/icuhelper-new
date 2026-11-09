import React, { useState, useEffect, useMemo } from 'react';
import { Settings, AlertTriangle } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { SaveToHistoryButton } from '../../components/ui/SaveToHistoryButton';
import { CalcSteps } from '../../components/ui/CalcSteps';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { UnifiedSyncBanner, type SyncField } from '../../components/UnifiedSyncBanner';
import { calcIbw } from '../../utils/anthropometry';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';
import { ardsOxygenation, ardsnetLowPeep, ARDS_OTHER_CRITERIA, SF_MAX_SPO2 } from '../../utils/oxygenation';
import {
  drivingPressure, staticCompliance, mechanicalPower, assumedInspTime, airwayResistance,
  meanAirwayPressureEstimate, alveoliHighPeep, vtTarget, MP_RISK_THRESHOLD, type VentCondition, type VtTarget,
} from '../../utils/ventilation';
import { AbbrLegend } from '../../components/ui/AbbrLegend';
import { CalcActionBar } from '../../components/ui/CalcActionBar';
import { useCalcTrigger } from '../../hooks/useCalcTrigger';
import { DecimalInput } from '../../components/ui/DecimalInput';

const MISSING_RING = ' ring-2 ring-[var(--sys-red)]';
// Baris label-kiri / input-kanan yang membungkus saat sempit (font besar / layar 360 px) — tidak overflow.
const ROW = 'flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2';

interface VentResult {
  dp: number; cstat: number | null; mp: number;
  resist: number | null; resistEstimated: boolean; ti: number | null;
  mpaw: number; mpawEstimated: boolean;
  ve: number; vtL: number;
  pf: number | null; sf: number | null; sfValid: boolean; oi: number | null; osi: number | null;
  berlin: string; global: string;
  peepLow: string | null; peepHigh: string | null;
  vtIbw: number | null; target: VtTarget; vIbw: number;
  warnings: string[];
  vVt: number; vRr: number; vPplat: number; vPeep: number; vPpeak: number; f: number | null; flowLpm: number | null;
}

export default function KalkulatorVentilatorAdv() {
  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();

  const [kondisi, setKondisi] = useState<VentCondition>('normal');
  const [ibw, setIbw] = useState('');
  const [vt, setVt] = useState('');
  const [rr, setRr] = useState('');
  const [fio2, setFio2] = useState('');
  const [ppeak, setPpeak] = useState('');
  const [pplat, setPplat] = useState('');
  const [peep, setPeep] = useState('');
  const [flow, setFlow] = useState('');
  const [mpawIn, setMpawIn] = useState('');
  const [spo2, setSpo2] = useState('');
  const [pao2, setPao2] = useState('');

  const [res, setRes] = useState<VentResult | null>(null);

  useEffect(() => {
    if (clinicalStore.data.rr) setRr(clinicalStore.data.rr);
    if (clinicalStore.data.peep) setPeep(clinicalStore.data.peep);
    if (clinicalStore.data.fio2) setFio2(clinicalStore.data.fio2);
    if (clinicalStore.data.spo2) setSpo2(clinicalStore.data.spo2);
    if (clinicalStore.data.pao2) setPao2(clinicalStore.data.pao2);
    if (clinicalStore.data.mpaw) setMpawIn(clinicalStore.data.mpaw);
  }, []);

  const syncFields = useMemo<SyncField[]>(() => [
    { key: 'rr', label: 'RR', value: rr, setter: setRr, unit: 'x/menit' },
    { key: 'peep', label: 'PEEP', value: peep, setter: setPeep, unit: 'cmH₂O' },
    { key: 'fio2', label: 'FiO₂', value: fio2, setter: setFio2, unit: '%' },
    { key: 'spo2', label: 'SpO₂', value: spo2, setter: setSpo2, unit: '%' },
    { key: 'pao2', label: 'PaO₂', value: pao2, setter: setPao2, unit: 'mmHg' },
    { key: 'mpaw', label: 'mPaw', value: mpawIn, setter: setMpawIn, unit: 'cmH₂O' },
  ], [rr, peep, fio2, spo2, pao2, mpawIn]);

  // PBW (Devine) dari TB & JK pasien aktif — ditawarkan, tidak diisi diam-diam.
  const patientPbw = useMemo(() => {
    const h = parseFloat(patient.heightCm);
    if (!(h > 0) || (patient.gender !== 'L' && patient.gender !== 'P')) return '';
    return calcIbw(h, patient.gender === 'P').toFixed(1);
  }, [patient.heightCm, patient.gender]);

  const handleAutofill = () => {
    if (clinicalStore.data.rr) setRr(clinicalStore.data.rr);
    if (clinicalStore.data.peep) setPeep(clinicalStore.data.peep);
    if (clinicalStore.data.fio2) setFio2(clinicalStore.data.fio2);
    if (clinicalStore.data.spo2) setSpo2(clinicalStore.data.spo2);
    if (clinicalStore.data.pao2) setPao2(clinicalStore.data.pao2);
    if (clinicalStore.data.mpaw) setMpawIn(clinicalStore.data.mpaw);
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
    const vFlow = parseFloat(flow);
    const vMpaw = parseFloat(mpawIn);

    if (!vVt || !vRr || !vPpeak || !vPplat || isNaN(vPeep)) { setRes(null); return; }

    const dp = drivingPressure(vPplat, vPeep);
    const cstat = staticCompliance(vVt, dp);
    const mp = mechanicalPower(vRr, vVt, vPpeak, dp);
    const vtL = vVt / 1000;
    const ve = vtL * vRr;

    // Resistensi: flow terukur bila diisi; bila tidak → estimasi Ti dari asumsi I:E 1:2.
    const resistEstimated = !(vFlow > 0);
    const ti = resistEstimated ? assumedInspTime(vRr) : null;
    const flowLps = resistEstimated ? vtL / (ti as number) : vFlow / 60;
    const resist = airwayResistance(vPpeak, vPplat, flowLps);

    const mpawEstimated = !(vMpaw > 0);
    const mpaw = mpawEstimated ? meanAirwayPressureEstimate(vPpeak, vPeep) : vMpaw;

    // Oksigenasi — TANPA estimasi PaO₂ dari SpO₂ (P/F hanya dari PaO₂ terukur; S/F & OSI dari SpO₂).
    const f = vFio2 >= 21 && vFio2 <= 100 ? vFio2 / 100 : null;
    const pf = f !== null && vPao2 > 0 ? vPao2 / f : null;
    const ox = ardsOxygenation({
      pf, spo2: vSpo2 > 0 ? vSpo2 : null, fio2: f, support: 'invasif', peep: vPeep, hfnoFlow: null, fio2Estimated: false,
    });
    const oi = f !== null && vPao2 > 0 ? (vFio2 * mpaw) / vPao2 : null;
    const osi = f !== null && vSpo2 > 0 && vSpo2 <= SF_MAX_SPO2 ? (vFio2 * mpaw) / vSpo2 : null;

    const warnings: string[] = [];
    if (fio2 && f === null) warnings.push('FiO₂ harus 21–100%.');
    if (dp > 15) warnings.push(`Driving pressure ${Math.round(dp)} cmH₂O (>15) — berhubungan dengan mortalitas lebih tinggi pada ARDS (Amato 2015).`);
    if (mp > MP_RISK_THRESHOLD) warnings.push(`Mechanical power ${mp.toFixed(1)} J/menit (>17) — risiko kematian meningkat konsisten di atas 17 J/menit (Serpa Neto 2018).`);
    if (cstat !== null && cstat < 30) warnings.push(`Compliance statis rendah (${Math.round(cstat)} mL/cmH₂O).`);
    if (resist !== null && resist > 15) warnings.push(`Resistensi jalan napas ${resist.toFixed(1)} cmH₂O/L/detik${resistEstimated ? ' (estimasi)' : ''} — cek sekret, bronkospasme, tekukan ETT.`);
    if (vPplat > 30) warnings.push('Pplat >30 cmH₂O — melebihi batas ventilasi protektif.');
    if (pf !== null && pf < 150 && f !== null && f >= 0.6 && vPeep >= 5) warnings.push(`P/F ${Math.round(pf)} (<150) dengan FiO₂ ≥0,6 & PEEP ≥5 — kriteria PROSEVA: pertimbangkan prone >12 jam/hari (rekomendasi kuat untuk ARDS berat, ATS/ESICM/SCCM 2017).`);
    if (dp <= 0) warnings.push('Pplat ≤ PEEP — periksa ulang angka (ΔP harus positif).');

    const target = vtTarget(kondisi);
    let vtIbw: number | null = null;
    if (vIbw > 0) {
      vtIbw = vVt / vIbw;
      if (vtIbw > target.max) warnings.push(`VT ${vtIbw.toFixed(1)} mL/kg PBW melebihi target ${target.min}–${target.max}.`);
    }

    setRes({
      dp, cstat, mp, resist, resistEstimated, ti, mpaw, mpawEstimated, ve, vtL,
      pf, sf: ox.sf, sfValid: ox.sfValid, oi, osi, berlin: ox.berlin, global: ox.global,
      peepLow: f !== null ? ardsnetLowPeep(f) : null, peepHigh: f !== null ? alveoliHighPeep(f) : null,
      vtIbw, target, vIbw, warnings,
      vVt, vRr, vPplat, vPeep, vPpeak, f, flowLpm: vFlow > 0 ? vFlow : null,
    });
  };

  const inputCls = 'w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all';
  // Hitung sekali → setelah itu hasil ikut berubah otomatis (tidak ada hasil basi).
  const calc = useCalcTrigger({
    compute: () => calculate(),
    deps: [kondisi, ibw, vt, rr, fio2, ppeak, pplat, peep, flow, mpawIn, spo2, pao2],
    required: [
      { id: 'va-vt', label: 'VT', filled: parseFloat(vt) > 0 },
      { id: 'va-rr', label: 'RR', filled: parseFloat(rr) > 0 },
      { id: 'va-ppeak', label: 'Ppeak', filled: parseFloat(ppeak) > 0 },
      { id: 'va-pplat', label: 'Pplat', filled: parseFloat(pplat) > 0 },
      { id: 'va-peep', label: 'PEEP', filled: peep.trim() !== '' && !isNaN(parseFloat(peep)) },
    ],
  });
  const shown = calc.armed ? res : null;
  const barTone = shown ? (shown.dp > 15 || shown.mp > MP_RISK_THRESHOLD ? 'bad' : 'good') : 'neutral';
  const barCaption = shown
    ? [
        shown.pf !== null ? `P/F ${Math.round(shown.pf)}` : shown.sf !== null ? `S/F ${Math.round(shown.sf)}` : '',
        shown.cstat !== null ? `Cstat ${Math.round(shown.cstat)}` : '',
        shown.warnings.length ? `${shown.warnings.length} peringatan` : '',
      ].filter(Boolean).join(' · ') || undefined
    : undefined;

  const row = (id: string, label: React.ReactNode, value: string, set: (v: string) => void, placeholder = '', tone = '') => (
    <div className={`${ROW} ${tone}`}>
      <label htmlFor={id} className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-1 min-w-[7rem]">{label}</label>
      <div className="flex-1 min-w-[8rem] flex items-center justify-end gap-2">
        <DecimalInput id={id} inputMode="decimal" className={inputCls + (calc.isMissing(id) ? MISSING_RING : '')} value={value} placeholder={placeholder} onChange={e => set(e.target.value)} />
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 overflow-x-hidden">

      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />

      <div className="flex flex-col gap-0 mt-2">
        <h2 className="mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          Parameter Ventilator Lanjutan
        </h2>

        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
          <div className={ROW}>
            <label htmlFor="va-kondisi" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left w-24">Kondisi</label>
            <select id="va-kondisi" className="flex-1 min-w-[10rem] bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={kondisi} onChange={e => setKondisi(e.target.value as VentCondition)}>
              <option value="normal">Tanpa ARDS / Post-op</option>
              <option value="ards">ARDS</option>
              <option value="copd">PPOK</option>
              <option value="asma">Asma berat</option>
              <option value="neuro">Neuromuskular</option>
            </select>
          </div>
          <div className={ROW}>
            <label htmlFor="va-ibw" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-1 min-w-[7rem]">PBW / IBW (kg)</label>
            <div className="flex-1 min-w-[8rem] flex items-center justify-end gap-2">
              <DecimalInput id="va-ibw" inputMode="decimal" className={inputCls} value={ibw} onChange={e => setIbw(e.target.value)} />
              {patientPbw && ibw !== patientPbw && (
                <button type="button" onClick={() => setIbw(patientPbw)} className="shrink-0 text-[11px] font-semibold text-[var(--accent)] hover:underline whitespace-nowrap">
                  PBW pasien {patientPbw}
                </button>
              )}
            </div>
          </div>
          {row('va-fio2', 'FiO₂ (%)', fio2, setFio2)}
          {row('va-vt', 'Tidal Vol. (mL)', vt, setVt)}
          {row('va-rr', 'Resp Rate (/mnt)', rr, setRr)}
          {row('va-ppeak', 'Ppeak', ppeak, setPpeak, '', 'bg-red-50/50 dark:bg-red-900/10')}
          {row('va-pplat', 'Pplat', pplat, setPplat, '', 'bg-red-50/50 dark:bg-red-900/10')}
          {row('va-peep', 'PEEP', peep, setPeep, '', 'bg-blue-50/50 dark:bg-blue-900/10')}
          {row('va-flow', <>Flow inspirasi <span className="font-normal text-slate-500">(L/mnt, opsional)</span></>, flow, setFlow, 'dari layar')}
          {row('va-mpaw', <>mPaw <span className="font-normal text-slate-500">(opsional)</span></>, mpawIn, setMpawIn, 'dari layar')}
          {row('va-spo2', 'SpO₂ (%)', spo2, setSpo2, 'opsional', 'bg-teal-50/50 dark:bg-teal-900/10')}
          {row('va-pao2', 'PaO₂ (mmHg)', pao2, setPao2, 'opsional', 'bg-teal-50/50 dark:bg-teal-900/10')}
        </div>
      </div>

      {shown && (() => { const res = shown; return (
        <div id="va-hasil" className="scroll-mt-4 mt-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">

            <div className="grid grid-cols-2 p-4 gap-4 bg-slate-50 dark:bg-[#1C1C1E]">
              <div className={`p-3 rounded-xl border ${res.dp > 15 ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-white dark:bg-[#2C2C2E] border-slate-200 dark:border-slate-700'}`}>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Driving Pressure</div>
                <div className={`text-2xl font-black ${res.dp > 15 ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                  {Math.round(res.dp)} <span className="text-[12px] font-semibold opacity-70">cmH₂O</span>
                </div>
                <div className="text-[10px] font-medium opacity-60 mt-0.5">Target ≤15</div>
              </div>
              <div className={`p-3 rounded-xl border ${res.mp > MP_RISK_THRESHOLD ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' : 'bg-white dark:bg-[#2C2C2E] border-slate-200 dark:border-slate-700'}`}>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Mech. Power</div>
                <div className={`text-2xl font-black ${res.mp > MP_RISK_THRESHOLD ? 'text-orange-600 dark:text-orange-400' : 'text-slate-800 dark:text-slate-200'}`}>
                  {res.mp.toFixed(1)} <span className="text-[12px] font-semibold opacity-70">J/mnt</span>
                </div>
                <div className="text-[10px] font-medium opacity-60 mt-0.5">Risiko ↑ bila &gt;17</div>
              </div>
            </div>

            <div className="grid grid-cols-2 p-4 gap-4 pb-5">
              <div className="text-center">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">C-Stat</div>
                <div className="text-[16px] font-bold text-slate-800 dark:text-slate-200">
                  {res.cstat !== null ? Math.round(res.cstat) : '—'} <span className="text-[12px] font-normal text-slate-500">mL/cmH₂O</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Resistensi{res.resistEstimated ? ' (estimasi)' : ''}</div>
                <div className="text-[16px] font-bold text-slate-800 dark:text-slate-200">
                  {res.resist !== null ? res.resist.toFixed(1) : '—'} <span className="text-[12px] font-normal text-slate-500">cmH₂O/L/dtk</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Min. Ventilation</div>
                <div className="text-[15px] font-semibold text-slate-800 dark:text-slate-200">
                  {res.ve.toFixed(1)} <span className="text-[12px] font-normal text-slate-500">L/mnt</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">mPaw{res.mpawEstimated ? ' (estimasi)' : ''}</div>
                <div className="text-[15px] font-semibold text-slate-800 dark:text-slate-200">
                  {res.mpaw.toFixed(1)} <span className="text-[12px] font-normal text-slate-500">cmH₂O</span>
                </div>
              </div>
              {res.vtIbw !== null && (
                <div className="text-center col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">VT per PBW</div>
                  <div className={`text-[15px] font-semibold ${res.vtIbw > res.target.max ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                    {res.vtIbw.toFixed(1)} mL/kg
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Target {res.target.min}–{res.target.max} mL/kg = {Math.round(res.target.min * res.vIbw)}–{Math.round(res.target.max * res.vIbw)} mL
                    {res.target.start !== null && ` · mulai ${res.target.start} mL/kg = ${Math.round(res.target.start * res.vIbw)} mL`}
                  </div>
                </div>
              )}
            </div>

            {(res.pf !== null || res.sf !== null) && (
              <div className="p-4 space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Oksigenasi</div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div className="text-[11px] text-slate-500">P/F (PaO₂ terukur)</div>
                    <div className="text-[18px] font-bold text-slate-800 dark:text-slate-200">{res.pf !== null ? Math.round(res.pf) : '—'}</div>
                    {res.oi !== null && <div className="text-[11px] text-slate-500">OI {res.oi.toFixed(1)}</div>}
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">S/F</div>
                    <div className="text-[18px] font-bold text-slate-800 dark:text-slate-200">{res.sf !== null ? Math.round(res.sf) : '—'}</div>
                    <div className="text-[11px] text-slate-500">{res.sf !== null && !res.sfValid ? `tidak valid (SpO₂ >${SF_MAX_SPO2}%)` : res.osi !== null ? `OSI ${res.osi.toFixed(1)}` : ''}</div>
                  </div>
                </div>
                <p className="text-[12px] text-slate-700 dark:text-slate-300">{res.berlin}</p>
                <p className="text-[12px] text-slate-700 dark:text-slate-300">{res.global}</p>
                <p className="text-[11px] text-slate-500">{ARDS_OTHER_CRITERIA} PaO₂ tidak lagi diestimasi dari SpO₂ — tanpa AGD gunakan S/F (definisi Global 2023).</p>
              </div>
            )}

            {(res.peepLow !== null || res.peepHigh !== null) && (
              <div className="p-4 bg-sky-50 dark:bg-sky-900/10">
                <div className="font-bold flex items-center gap-1.5 mb-3 text-[13px] text-sky-700 dark:text-sky-400">
                  <Settings className="w-4 h-4" /> Tabel PEEP/FiO₂ untuk FiO₂ {fio2}%
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-white/60 dark:bg-black/20 p-2 rounded-xl border border-sky-200/50 dark:border-sky-800/50">
                    <div className="text-[10px] text-sky-700 dark:text-sky-400 font-bold uppercase tracking-wide">PEEP rendah (ARDSNet)</div>
                    <div className="text-lg font-black text-sky-700 dark:text-sky-300">{res.peepLow ?? '—'} <span className="text-[10px] font-normal">cmH₂O</span></div>
                  </div>
                  <div className="bg-white/60 dark:bg-black/20 p-2 rounded-xl border border-sky-200/50 dark:border-sky-800/50">
                    <div className="text-[10px] text-sky-700 dark:text-sky-400 font-bold uppercase tracking-wide">PEEP tinggi (ALVEOLI)</div>
                    <div className="text-lg font-black text-sky-700 dark:text-sky-300">{res.peepHigh ?? '—'} <span className="text-[10px] font-normal">cmH₂O</span></div>
                  </div>
                </div>
                <div className="text-[11px] text-sky-700/80 dark:text-sky-400/80 mt-3 leading-relaxed">
                  ALVEOLI: luaran PEEP tinggi vs rendah setara (VT 6 mL/kg, Pplat ≤30). ATS/ESICM/SCCM 2017: PEEP lebih tinggi disarankan (kondisional) pada ARDS sedang–berat. Tabel PEEP tinggi ALVEOLI berasal dari protokol (sumber sekunder); setelah 171 pasien kombinasi PEEP &lt;12 dihapus.
                </div>
              </div>
            )}

            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
              <CalcSteps
                tone="slate"
                steps={[
                  {
                    label: 'Langkah 1 — Driving Pressure (ΔP):',
                    formula: `ΔP = Pplat − PEEP = ${res.vPplat} − ${res.vPeep} = ${Math.round(res.dp)} cmH₂O`,
                    note: 'ΔP berhubungan kuat dengan mortalitas ARDS (Amato 2015); target praktis ≤15.',
                  },
                  {
                    label: 'Langkah 2 — Compliance statis:',
                    formula: res.cstat !== null ? `Cstat = VT ÷ ΔP = ${res.vVt} ÷ ${Math.round(res.dp)} = ${Math.round(res.cstat)} mL/cmH₂O` : 'ΔP ≤0 — tidak dapat dihitung',
                  },
                  {
                    label: `Langkah 3 — Resistensi jalan napas${res.resistEstimated ? ' (estimasi)' : ''}:`,
                    formula: res.resistEstimated
                      ? `Ti asumsi (I:E 1:2) = 60 ÷ (${res.vRr} × 3) = ${(res.ti as number).toFixed(2)} dtk → flow ≈ ${res.vtL.toFixed(2)} ÷ ${(res.ti as number).toFixed(2)} = ${(res.vtL / (res.ti as number)).toFixed(2)} L/dtk\nRaw = (${res.vPpeak} − ${res.vPplat}) ÷ ${(res.vtL / (res.ti as number)).toFixed(2)} = ${res.resist?.toFixed(1)} cmH₂O/L/dtk`
                      : `Raw = (Ppeak − Pplat) ÷ flow = (${res.vPpeak} − ${res.vPplat}) ÷ (${res.flowLpm} ÷ 60) = ${res.resist?.toFixed(1)} cmH₂O/L/dtk`,
                    note: res.resistEstimated
                      ? 'Estimasi mengasumsikan I:E 1:2 tanpa jeda inspirasi & aliran konstan — isi flow dari layar ventilator agar akurat.'
                      : 'Valid untuk mode volume-control dengan aliran konstan (square wave).',
                  },
                  {
                    label: 'Langkah 4 — Minute ventilation:',
                    formula: `VE = VT(L) × RR = ${res.vtL.toFixed(2)} × ${res.vRr} = ${res.ve.toFixed(1)} L/mnt`,
                  },
                  {
                    label: 'Langkah 5 — Mechanical Power (rumus sederhana Gattinoni):',
                    formula: `MP = 0,098 × RR × VT(L) × (Ppeak − ΔP/2)\n= 0,098 × ${res.vRr} × ${res.vtL.toFixed(2)} × (${res.vPpeak} − ${Math.round(res.dp)}/2) = ${res.mp.toFixed(1)} J/mnt`,
                    note: 'Rumus Gattinoni 2016 (volume-control). Ambang >17 J/menit dari Serpa Neto 2018.',
                  },
                  {
                    label: `Langkah 6 — mPaw${res.mpawEstimated ? ' (estimasi)' : ''}:`,
                    formula: res.mpawEstimated
                      ? `mPaw ≈ PEEP + (Ppeak − PEEP) × 1/3 = ${res.vPeep} + (${res.vPpeak} − ${res.vPeep}) ÷ 3 = ${res.mpaw.toFixed(1)} cmH₂O`
                      : `mPaw dari layar ventilator = ${res.mpaw.toFixed(1)} cmH₂O`,
                    note: res.mpawEstimated ? 'Asumsi I:E 1:2 & gelombang tekanan persegi — cenderung lebih tinggi dari nilai sebenarnya pada volume-control. Isi mPaw dari layar bila ada.' : undefined,
                  },
                  ...(res.vtIbw !== null ? [{
                    label: 'Langkah 7 — Tidal volume per PBW:',
                    formula: `VT/PBW = ${res.vVt} ÷ ${res.vIbw} = ${res.vtIbw.toFixed(1)} mL/kg`,
                    note: res.target.note,
                  }] : []),
                ]}
                footer="Angka mekanik paru memandu setting protektif — korelasikan dengan klinis, AGD, dan sinkroni pasien-ventilator."
              />
            </div>

            {res.warnings.length > 0 && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border-t border-slate-100 dark:border-slate-800">
                <div className="font-bold flex items-center gap-1.5 mb-2 text-[13px] text-amber-700 dark:text-amber-500">
                  <AlertTriangle className="w-4 h-4" /> Peringatan Terdeteksi
                </div>
                <ul className="list-disc pl-5 space-y-1.5">
                  {res.warnings.map((w, i) => (
                    <li key={i} className="text-[12px] text-amber-700/80 dark:text-amber-400/80 leading-snug">{w}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
              <SaveToHistoryButton
                module="ventilator_adv"
                label={`Ventilator Adv — DP: ${Math.round(res.dp)} cmH₂O`}
                inputs={{ kondisi, ibw, vt, rr, fio2, ppeak, pplat, peep, flow, mpaw: mpawIn, spo2, pao2 }}
                summary={`ΔP ${Math.round(res.dp)} cmH₂O · MP ${res.mp.toFixed(1)} J/mnt${res.pf !== null ? ` · P/F ${Math.round(res.pf)}` : ''}${res.sf !== null ? ` · S/F ${Math.round(res.sf)}` : ''}`}
                className="w-full"
              />
            </div>
          </div>
        </div>
      ); })()}

      <Accordion title="📖 Teori & Referensi: Mekanik Paru Lanjutan">
        <ul className="pl-4 space-y-2 mb-4 list-disc text-slate-600 dark:text-slate-400 text-[13px] leading-relaxed">
          <li><strong className="text-slate-800 dark:text-slate-200">Ventilasi protektif:</strong> ARDS — VT 4–8 mL/kg PBW dan Pplat &lt;30 cmH₂O (rekomendasi kuat, ATS/ESICM/SCCM 2017); prone &gt;12 jam/hari pada ARDS berat (kuat); PEEP lebih tinggi & manuver rekrutmen hanya kondisional. Tanpa ARDS, VT rendah menurunkan cedera paru (RR 0,33) dan mortalitas (RR 0,64) (Serpa Neto 2012).</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Driving pressure:</strong> ΔP = Pplat − PEEP; berhubungan paling kuat dengan kesintasan ARDS (Amato 2015).</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Mechanical power:</strong> energi per menit yang dihantarkan ventilator; rumus sederhana volume-control MP = 0,098 × RR × VT × (Ppeak − ΔP/2) (Gattinoni 2016). Risiko kematian meningkat konsisten pada MP &gt;17 J/menit (Serpa Neto 2018).</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Resistensi & mPaw:</strong> Raw = (Ppeak − Pplat) ÷ flow, valid pada aliran konstan. Tanpa flow & mPaw dari layar ventilator, aplikasi memakai asumsi I:E 1:2 (estimasi).</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Oksigenasi:</strong> P/F hanya dari PaO₂ terukur; tanpa AGD gunakan S/F (≤315 bila SpO₂ ≤97%, definisi Global 2023) dan OSI = FiO₂ × mPaw ÷ SpO₂. OI = FiO₂ × mPaw ÷ PaO₂ (tidak ada ambang dewasa baku).</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[12px] text-slate-700 dark:text-slate-300 italic leading-relaxed">
          📚 Fan E et al. ATS/ESICM/SCCM ARDS guideline. AJRCCM 2017;195:1253–63 · Amato MBP et al. NEJM 2015;372:747–55 · Gattinoni L et al. Intensive Care Med 2016;42:1567–75 · Serpa Neto A et al. Intensive Care Med 2018;44:1914–22 · Serpa Neto A et al. JAMA 2012;308:1651–9 · ARDS Network. NEJM 2000;342:1301–8 · Brower RG et al. (ALVEOLI). NEJM 2004;351:327–36 · Guérin C et al. (PROSEVA). NEJM 2013;368:2159–68 · Matthay MA et al. Global definition of ARDS. AJRCCM 2024;209:37–47.
        </div>
      </Accordion>
      <AbbrLegend
        terms={[
          'ARDS', 'PPOK', 'PBW', 'IBW', 'RR', 'RR-risiko', 'PEEP', 'Ppeak', 'Pplat', 'mPaw', 'ΔP', 'DP', 'Cstat',
          'Raw', 'Ti', 'I:E', 'VE', 'MP', 'VT', 'OI', 'OSI', 'SpO2', 'FiO2', 'PaO2', 'P/F', 'AGD', 'ETT', 'ARDSNet',
          'S/F', 'CT', 'USG', 'ATS', 'ESICM', 'SCCM',
        ]}
      />
      <CalcActionBar
        armed={calc.armed}
        onCalculate={calc.trigger}
        label="Hitung Mekanik Paru & Oksigenasi"
        summary={shown ? `ΔP ${Math.round(shown.dp)} · MP ${shown.mp.toFixed(1)} J/mnt` : null}
        summaryTone={barTone}
        caption={barCaption}
        missing={calc.missing}
        resultTargetId="va-hasil"
        emptyText="Lengkapi data untuk melihat hasil"
      />
    </div>
  );
}
