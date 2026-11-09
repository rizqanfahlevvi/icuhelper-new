import React, { useState, useEffect, useMemo } from 'react';
import { Utensils, AlertTriangle } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { SaveToHistoryButton } from '../../components/ui/SaveToHistoryButton';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { UnifiedSyncBanner, type SyncField } from '../../components/UnifiedSyncBanner';
import { CalcSteps } from '../../components/ui/CalcSteps';
import { InputWarning } from '../../components/ui/InputWarning';
import { weightPlausibilityWarning } from '../../utils/validation';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';
import { patientGenderToClinical } from '../../utils/patientContext';
import {
  nutritionTargets, refeedingStart, enteralVolume, pnLimits, espenPhaseFactor, ESPEN_EE_PER_KG,
  type NutritionPhase, type NutritionCondition, type NutritionSex, type NutritionResult, type Range, type TargetBlock,
} from '../../utils/nutrition';
import { AbbrLegend } from '../../components/ui/AbbrLegend';

type Route = 'en' | 'pn' | 'mixed';

interface CalcState {
  r: NutritionResult;
  refeed: Range | null;
  en: { block: TargetBlock; vol: Range; proteinG: Range | null }[] | null;
  pn: { glucoseG: number; lipidG: number; basisKg: number } | null;
  nonNutr: number;
  density: number;
}

const fmtRange = (r: Range, unit = '') => (r.min === r.max ? `${r.min}${unit}` : `${r.min}–${r.max}${unit}`);
const fmtPerKg = (r: Range) => (r.min === r.max ? `${r.min}` : `${r.min}–${r.max}`);

const PHASE_LABEL: Record<NutritionPhase, string> = {
  'akut-awal': 'Akut awal (hari 1–2)',
  'akut-lanjut': 'Akut lanjut (hari 3–7)',
  recovery: 'Pemulihan (>7 hari)',
};

export default function KalkulatorNutrisi() {
  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();

  const [bb, setBb] = useState('');
  const [tb, setTb] = useState('');
  const [sex, setSex] = useState<NutritionSex>('');
  const [ibwIn, setIbwIn] = useState('');
  const [fase, setFase] = useState<NutritionPhase>('akut-lanjut');
  const [kondisi, setKondisi] = useState<NutritionCondition>('kritis');
  const [route, setRoute] = useState<Route>('en');
  const [refeeding, setRefeeding] = useState<'tidak' | 'ya'>('tidak');
  const [density, setDensity] = useState('1.2');
  const [proteinGL, setProteinGL] = useState('');
  const [nonNutr, setNonNutr] = useState('');
  const [res, setRes] = useState<CalcState | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Auto-load saat mount
  useEffect(() => {
    const parentWeight = patient.weightKg || clinicalStore.data.weight || '';
    if (parentWeight) setBb(parentWeight);
    const parentHeight = patient.heightCm || clinicalStore.data.height || '';
    if (parentHeight) setTb(parentHeight);
    setSex(patientGenderToClinical(patient.gender || clinicalStore.data.gender));
  }, []);

  const syncFields = useMemo<SyncField[]>(() => [
    { key: 'weight', label: 'Berat Badan', value: bb, setter: setBb, unit: 'kg' },
    { key: 'height', label: 'Tinggi Badan', value: tb, setter: setTb, unit: 'cm' },
    {
      key: 'gender', label: 'Jenis Kelamin', value: sex,
      setter: (val: string) => setSex(patientGenderToClinical(val)),
      formatDisplay: (val: string) => (val === 'f' ? 'Perempuan' : val === 'm' ? 'Laki-laki' : val),
    },
  ], [bb, tb, sex]);

  const handleAutofill = (data: { weightKg: string; heightCm?: string; gender?: string }) => {
    if (data.weightKg) setBb(data.weightKg);
    if (data.heightCm) setTb(data.heightCm);
    if (data.gender) setSex(patientGenderToClinical(data.gender));
    setRes(null);
  };

  const calculate = () => {
    const o = nutritionTargets({
      weightKg: parseFloat(bb),
      heightCm: parseFloat(tb),
      sex,
      ibwOverride: parseFloat(ibwIn),
      phase: fase,
      condition: kondisi,
    });
    if (o.ok === false) { setErr(o.error); setRes(null); return; }
    setErr(null);
    const r = o.result;
    const d = parseFloat(density) || 1.2;
    const nn = parseFloat(nonNutr) > 0 ? parseFloat(nonNutr) : 0;
    const pgl = parseFloat(proteinGL) > 0 ? parseFloat(proteinGL) : 0;
    const en = route !== 'pn'
      ? r.energy.map((block) => {
          const vol = enteralVolume(block.total, d, nn);
          return { block, vol, proteinG: pgl ? { min: Math.round(vol.min / 1000 * pgl), max: Math.round(vol.max / 1000 * pgl) } : null };
        })
      : null;
    const pnBasis = r.energyBasisKg;
    setRes({
      r,
      refeed: refeeding === 'ya' ? refeedingStart(r.energyBasisKg, r.energy) : null,
      en,
      pn: route !== 'en' ? { ...pnLimits(pnBasis), basisKg: Math.round(pnBasis * 10) / 10 } : null,
      nonNutr: nn,
      density: d,
    });
  };

  const inputCls = 'w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all';
  const selectCls = 'flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all';
  const reset = () => setRes(null);

  const espenE = res ? res.r.energy.find((e) => e.guideline === 'ESPEN')! : null;
  const aspenE = res ? res.r.energy.find((e) => e.guideline === 'ASPEN')! : null;
  const espenP = res ? res.r.protein.find((e) => e.guideline === 'ESPEN')! : null;
  const aspenP = res ? res.r.protein.find((e) => e.guideline === 'ASPEN')! : null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 overflow-x-hidden">

      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />

      <div className="flex flex-col gap-0 mt-2">
        <h2 className="mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-2">
          <Utensils className="w-4 h-4 text-blue-500" /> Kalkulator Nutrisi ICU
        </h2>

        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex justify-between px-4 py-3 items-center gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left w-24">Fase Rawat</span>
            <select className={selectCls} value={fase} onChange={e => { setFase(e.target.value as NutritionPhase); reset(); }}>
              <option value="akut-awal">{PHASE_LABEL['akut-awal']}</option>
              <option value="akut-lanjut">{PHASE_LABEL['akut-lanjut']}</option>
              <option value="recovery">{PHASE_LABEL.recovery}</option>
            </select>
          </div>
          <div className="flex justify-between px-4 py-3 items-center gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left w-24">Kondisi Klinis</span>
            <select className={selectCls} value={kondisi} onChange={e => { setKondisi(e.target.value as NutritionCondition); reset(); }}>
              <option value="kritis">Kritis umum (ICU)</option>
              <option value="sepsis">Sepsis / Syok septik</option>
              <option value="ards">ARDS</option>
              <option value="trauma">Trauma / Luka bakar</option>
              <option value="aki">AKI tanpa dialisis</option>
              <option value="aki-hd">AKI dengan HD intermiten</option>
              <option value="crrt">AKI dengan CRRT</option>
            </select>
          </div>
          <div className="flex justify-between px-4 py-3 items-center gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left w-24">Route Nutrisi</span>
            <select className={selectCls} value={route} onChange={e => { setRoute(e.target.value as Route); reset(); }}>
              <option value="en">Enteral (NGT/Oral)</option>
              <option value="pn">Parenteral (TPN)</option>
              <option value="mixed">Kombinasi EN + PN</option>
            </select>
          </div>
          <div className="flex justify-between px-4 py-3 items-center gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left w-24">Risiko Refeeding</span>
            <select className={selectCls} value={refeeding} onChange={e => { setRefeeding(e.target.value as 'tidak' | 'ya'); reset(); }}>
              <option value="tidak">Tidak berisiko</option>
              <option value="ya">Berisiko (kriteria NICE/ASPEN)</option>
            </select>
          </div>
          <div className="px-4 py-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Contoh kriteria risiko refeeding: IMT &lt;16, BB turun &gt;15% dalam 3–6 bulan, K/PO₄/Mg rendah sebelum pemberian makan, atau kombinasi faktor seperti asupan minimal &gt;5 hari + riwayat alkohol/obat (insulin, kemoterapi, antasida, diuretik). NRS-2002 adalah skrining malnutrisi, bukan alat penilai risiko refeeding.
          </div>

          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">BB Aktual</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className={inputCls} value={bb} onChange={e => { setBb(e.target.value); reset(); }} />
              <span className="text-xs font-semibold text-slate-500 w-8 text-left">kg</span>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Tinggi Badan</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className={inputCls} value={tb} onChange={e => { setTb(e.target.value); reset(); }} />
              <span className="text-xs font-semibold text-slate-500 w-8 text-left">cm</span>
            </div>
          </div>
          <div className="flex justify-between px-4 py-3 items-center gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left w-24">Jenis Kelamin</span>
            <select className={selectCls} value={sex} onChange={e => { setSex(e.target.value as NutritionSex); reset(); }}>
              <option value="">— Pilih —</option>
              <option value="m">Laki-laki</option>
              <option value="f">Perempuan</option>
            </select>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">BBI manual <span className="font-normal text-slate-500">(opsional)</span></span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className={inputCls} value={ibwIn} onChange={e => { setIbwIn(e.target.value); reset(); }} placeholder="Devine" />
              <span className="text-xs font-semibold text-slate-500 w-8 text-left">kg</span>
            </div>
          </div>

          {route !== 'pn' && (
            <>
              <div className="flex justify-between px-4 py-3 items-center gap-4">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left w-24">Densitas Formula EN</span>
                <select className={selectCls} value={density} onChange={e => { setDensity(e.target.value); reset(); }}>
                  <option value="1.0">1,0 kkal/mL</option>
                  <option value="1.2">1,2 kkal/mL</option>
                  <option value="1.5">1,5 kkal/mL</option>
                  <option value="2.0">2,0 kkal/mL</option>
                </select>
              </div>
              <div className="flex items-center justify-between px-4 py-3 gap-4">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Protein formula <span className="font-normal text-slate-500">(opsional)</span></span>
                <div className="flex-1 flex items-center justify-end gap-2">
                  <input type="number" className={inputCls} value={proteinGL} onChange={e => { setProteinGL(e.target.value); reset(); }} placeholder="label produk" />
                  <span className="text-xs font-semibold text-slate-500 w-8 text-left">g/L</span>
                </div>
              </div>
            </>
          )}
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Kalori non-nutrisi <span className="font-normal text-slate-500">(opsional)</span></span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input type="number" className={inputCls} value={nonNutr} onChange={e => { setNonNutr(e.target.value); reset(); }} placeholder="0" />
              <span className="text-xs font-semibold text-slate-500 w-8 text-left">kkal</span>
            </div>
          </div>
          <div className="px-4 py-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Kalori non-nutrisi per hari: propofol (emulsi lemak — lihat kandungan kalori di label produk), infus dekstrosa, sitrat. Dikurangkan dari kebutuhan saat menghitung volume nutrisi.
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button onClick={calculate} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-[15px]">
          Hitung Target Nutrisi
        </button>
      </div>

      {err && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/40 text-[13px] font-semibold text-red-700 dark:text-red-400 flex gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" /> {err}
        </div>
      )}

      {res && <InputWarning messages={[weightPlausibilityWarning(parseFloat(bb)), ...res.r.warnings]} />}

      {res && espenE && aspenE && espenP && aspenP && (
        <div className="mt-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">

            {res.refeed && (
              <div className="p-4 bg-red-50 dark:bg-red-900/10 text-[12.5px] text-red-800 dark:text-red-300 leading-relaxed space-y-1">
                <div className="font-bold flex items-start gap-1.5 text-[13px] text-red-700 dark:text-red-400">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>Risiko refeeding — mulai {fmtRange(res.refeed, ' kkal/hari')}, naikkan bertahap menuju target</span>
                </div>
                <p>10–20 kkal/kg × {Math.round(res.r.energyBasisKg * 10) / 10} kg, tidak melebihi target terendah. Pantau fosfat, K, Mg ketat; berikan tiamin sebelum mulai (dosis sesuai protokol).</p>
                <p className="text-[11px] opacity-80">Angka 10–20 kkal/kg (ASPEN 2020) belum terverifikasi dari teks resmi; NICE CG32 menganjurkan awal yang lebih rendah. Doig 2015 (RCT, ICU): pada pasien yang mengalami refeeding (hipofosfatemia), restriksi kalori terprotokol meningkatkan kesintasan hari-60 (91% vs 78%).</p>
              </div>
            )}

            <div className="p-4 bg-slate-50 dark:bg-[#1C1C1E]">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">Target Energi — {PHASE_LABEL[fase]}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[espenE, aspenE].map((e) => (
                  <div key={e.guideline} className="bg-white dark:bg-[#2C2C2E] p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">{e.label}</div>
                    <div className="text-[20px] font-black text-slate-800 dark:text-slate-100 leading-tight mt-1">
                      {e.upperOnly ? '≤ ' : ''}{fmtRange(e.total)} <span className="text-[12px] font-semibold opacity-70">kkal/hari</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{e.upperOnly ? '≤ ' : ''}{fmtPerKg(e.perKg)} kkal/kg × {Math.round(e.basisKg * 10) / 10} kg ({e.basisLabel})</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">{e.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">Target Protein</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[espenP, aspenP].map((p) => (
                  <div key={p.guideline} className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">{p.label}</div>
                    <div className="text-[20px] font-black text-emerald-700 dark:text-emerald-300 leading-tight mt-1">
                      {fmtRange(p.total)} <span className="text-[12px] font-semibold opacity-70">g/hari</span>
                    </div>
                    <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">{fmtPerKg(p.perKg)} g/kg × {Math.round(p.basisKg * 10) / 10} kg ({p.basisLabel})</div>
                    <div className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 mt-1 leading-snug">{p.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 p-4 gap-3 text-center">
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">IMT</div>
                <div className="text-[15px] font-semibold text-slate-800 dark:text-slate-200">{res.r.bmi ?? '—'}</div>
                <div className="text-[10px] text-slate-500">{res.r.obese ? 'Obes (≥30)' : res.r.bmi !== null ? 'Tidak obes' : 'TB kosong'}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">BBI</div>
                <div className="text-[15px] font-semibold text-slate-800 dark:text-slate-200">{res.r.ibw !== null ? `${res.r.ibw} kg` : '—'}</div>
                <div className="text-[10px] text-slate-500">{res.r.ibwSource === 'input' ? 'input manual' : res.r.ibwSource === 'devine' ? 'Devine' : 'butuh TB + JK'}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">ABW ESPEN</div>
                <div className="text-[15px] font-semibold text-slate-800 dark:text-slate-200">{res.r.abwEspen !== null ? `${res.r.abwEspen} kg` : '—'}</div>
                <div className="text-[10px] text-slate-500">hanya bila obes</div>
              </div>
            </div>

            {res.en && (
              <div className="p-4">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">Volume Enteral ({String(res.density).replace('.', ',')} kkal/mL){res.nonNutr > 0 ? ` — setelah dikurangi ${res.nonNutr} kkal non-nutrisi` : ''}</div>
                <div className="space-y-2">
                  {res.en.map(({ block, vol, proteinG }) => {
                    const pTarget = res.r.protein.find((p) => p.guideline === block.guideline)!;
                    return (
                      <div key={block.guideline} className="flex flex-wrap items-baseline justify-between gap-2 text-[13px] text-slate-700 dark:text-slate-300">
                        <span className="font-semibold">{block.label}</span>
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {block.upperOnly ? '≤ ' : ''}{fmtRange(vol, ' mL/hari')} ≈ {block.upperOnly ? '≤ ' : ''}{fmtRange({ min: Math.round(vol.min / 24), max: Math.round(vol.max / 24) }, ' mL/jam')}
                        </span>
                        {proteinG && (
                          <span className={`w-full text-[11.5px] ${proteinG.max < pTarget.total.min ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500'}`}>
                            Protein dari formula: {fmtRange(proteinG, ' g')} vs target {fmtRange(pTarget.total, ' g')}{proteinG.max < pTarget.total.min ? ' — belum tercapai, pertimbangkan modul/formula tinggi protein' : ''}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {route === 'mixed' && <div className="text-[11px] text-slate-500 mt-2">Kombinasi EN + PN: volume di atas bila seluruh kebutuhan lewat EN — kurangi sesuai porsi PN.</div>}
              </div>
            )}

            {res.pn && (
              <div className="p-4 text-[12.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Batas Parenteral (ESPEN)</div>
                Glukosa ≤ 5 mg/kg/menit = <strong>{res.pn.glucoseG} g/hari</strong> · Lemak IV ≤ 1,5 g/kg/hari = <strong>{res.pn.lipidG} g/hari</strong> (basis {res.pn.basisKg} kg). Komposisi makro mengikuti target energi & protein di atas.
              </div>
            )}

            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
              <CalcSteps
                tone="slate"
                steps={(() => {
                  const r = res.r;
                  const pf = espenPhaseFactor(fase);
                  const steps = [
                    {
                      label: 'Langkah 1 — Berat badan dasar:',
                      formula: r.bmi !== null
                        ? `IMT = ${bb} ÷ (${tb}/100)² = ${r.bmi}` +
                          (r.obese
                            ? `\nBBI ${r.ibwSource === 'input' ? '(input)' : '(Devine)'} = ${r.ibw} kg\nABW ESPEN = BBI + 0,33 × (BB − BBI) = ${r.ibw} + 0,33 × (${bb} − ${r.ibw}) = ${r.abwEspen} kg`
                            : `\nIMT < 30 → BB aktual ${bb} kg`)
                        : `TB kosong → BB aktual ${bb} kg (obesitas tidak dinilai)`,
                      note: r.obese
                        ? 'Obes: ESPEN memakai BB terkoreksi (faktor 0,33); ASPEN 2016 memakai BB aktual (energi IMT 30–50) atau BBI (energi IMT >50 & protein).'
                        : 'Basis BB untuk semua target di bawah.',
                    },
                    {
                      label: 'Langkah 2 — Energi ESPEN:',
                      formula: `${ESPEN_EE_PER_KG.min}–${ESPEN_EE_PER_KG.max} kkal/kg × faktor fase ${pf.min === pf.max ? `${pf.min * 100}%` : `${pf.min * 100}–${pf.max * 100}%`} = ${espenE.upperOnly ? '≤ ' : ''}${fmtPerKg(espenE.perKg)} kkal/kg\n× ${Math.round(espenE.basisKg * 10) / 10} kg = ${espenE.upperOnly ? '≤ ' : ''}${fmtRange(espenE.total)} kkal/hari`,
                      note: espenE.note,
                    },
                    {
                      label: `Langkah 3 — Energi ${aspenE.label}:`,
                      formula: `${fmtPerKg(aspenE.perKg)} kkal/kg × ${Math.round(aspenE.basisKg * 10) / 10} kg (${aspenE.basisLabel}) = ${fmtRange(aspenE.total)} kkal/hari`,
                      note: aspenE.note,
                    },
                    {
                      label: `Langkah 4 — Protein ${espenP.label}:`,
                      formula: `${fmtPerKg(espenP.perKg)} g/kg × ${Math.round(espenP.basisKg * 10) / 10} kg = ${fmtRange(espenP.total)} g/hari`,
                      note: espenP.note,
                    },
                    {
                      label: `Langkah 5 — Protein ${aspenP.label}:`,
                      formula: `${fmtPerKg(aspenP.perKg)} g/kg × ${Math.round(aspenP.basisKg * 10) / 10} kg (${aspenP.basisLabel}) = ${fmtRange(aspenP.total)} g/hari`,
                      note: aspenP.note,
                    },
                  ];
                  let n = 6;
                  if (res.refeed) {
                    steps.push({
                      label: `Langkah ${n++} — Langkah awal risiko refeeding:`,
                      formula: `10–20 kkal/kg × ${Math.round(r.energyBasisKg * 10) / 10} kg, dibatasi target terendah (${Math.min(...r.energy.map((e) => e.total.max))} kkal) = ${fmtRange(res.refeed)} kkal/hari`,
                      note: 'Angka 10–20 kkal/kg belum terverifikasi dari teks resmi — ikuti protokol RS. Target akhir tetap seperti di atas.',
                    });
                  }
                  if (res.en) {
                    steps.push({
                      label: `Langkah ${n++} — Volume enteral:`,
                      formula: res.en.map(({ block, vol }) => `${block.label}: (${fmtRange(block.total)}${res.nonNutr > 0 ? ` − ${res.nonNutr}` : ''}) ÷ ${res.density} = ${fmtRange(vol, ' mL/hari')}`).join('\n'),
                      note: 'Sesuaikan densitas dengan produk yang dipakai.',
                    });
                  }
                  return steps;
                })()}
                footer="Target adalah tujuan bertahap, bukan laju awal — naikkan sambil memantau toleransi GI, glukosa, dan elektrolit. Kalorimetri indirek lebih disukai bila tersedia."
              />
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1C1C1E]">
              <SaveToHistoryButton
                module="nutrisi"
                label={`Nutrisi: ESPEN ${fmtRange(espenE.total)} · ASPEN ${fmtRange(aspenE.total)} kkal`}
                inputs={{ fase, kondisi, route, refeeding, bb, tb, sex, ibwIn, density, proteinGL, nonNutr }}
                summary={`Energi ESPEN ${espenE.upperOnly ? '≤' : ''}${fmtRange(espenE.total)} kkal / ${aspenE.label} ${fmtRange(aspenE.total)} kkal · Protein ESPEN ${fmtRange(espenP.total)} g / ASPEN ${fmtRange(aspenP.total)} g${res.refeed ? ` · Mulai refeeding ${fmtRange(res.refeed)} kkal` : ''}`}
                className="w-full bg-blue-600 hover:bg-blue-700"
              />
            </div>
          </div>
        </div>
      )}

      <Accordion title="📖 Teori & Referensi: Nutrisi ICU">
        <ul className="pl-4 space-y-2 mb-4 list-disc text-slate-600 dark:text-slate-400 text-[13px] leading-relaxed">
          <li><strong className="text-slate-800 dark:text-slate-200">Energi:</strong> ESPEN — kalorimetri indirek lebih disukai; tanpa itu 20–25 kkal/kg/hari. Fase akut awal (hari 1–2) hipokalorik maks 70% kebutuhan, setelah hari ke-3 naik ke 80–100%. ASPEN 2022 menurunkan rekomendasi energi menjadi 12–25 kkal/kg/hari (2016: 25–30) karena tidak ada perbedaan luaran antara dosis energi tinggi vs rendah.</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Protein:</strong> ESPEN 1,3 g/kg/hari dicapai bertahap; ASPEN 1,2–2,0 g/kg/hari. EFFORT Protein (2023): ≥2,2 vs ≤1,2 g/kg tidak mempercepat pulang hidup dan mungkin merugikan pada AKI serta skor kegagalan organ tinggi.</li>
          <li><strong className="text-slate-800 dark:text-slate-200">AKI:</strong> protein tidak boleh dibatasi untuk menunda dialisis. ESPEN 2021: tanpa KRT 1,0 → 1,3 g/kg; KRT intermiten 1,3–1,5; KRT kontinu 1,5–1,7. ASPEN: standar 1,2–2,0; HD/CRRT hingga 2,5 g/kg.</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Obesitas (IMT ≥30):</strong> ASPEN/SCCM 2016 — hipokalorik protein tinggi: 11–14 kkal/kg BB aktual (IMT 30–50) atau 22–25 kkal/kg BBI (IMT &gt;50); protein 2,0 g/kg BBI (IMT 30–&lt;40) hingga 2,5 g/kg BBI (IMT ≥40). ESPEN — energi & protein (1,3 g/kg) berbasis BB terkoreksi: BBI + 0,33 × (BB − BBI). Kedua pedoman berbeda bermakna sehingga ditampilkan berdampingan.</li>
          <li><strong className="text-slate-800 dark:text-slate-200">ARDS:</strong> EDEN (2012) — EN trofik (±400 kkal/hari) selama 6 hari pertama tidak berbeda dengan EN penuh (±1.300 kkal/hari) untuk hari bebas ventilator dan mortalitas 60 hari, dengan intoleransi GI lebih sedikit.</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Refeeding syndrome:</strong> nilai risiko dengan kriteria NICE CG32 atau ASPEN 2020 (bukan NRS-2002, yang merupakan skrining malnutrisi). Mulai rendah, naikkan bertahap, pantau fosfat/K/Mg, berikan tiamin sebelum mulai. Doig 2015: restriksi kalori terprotokol pada pasien ICU yang mengalami refeeding meningkatkan kesintasan hari-60 (91% vs 78%).</li>
          <li><strong className="text-slate-800 dark:text-slate-200">Parenteral:</strong> glukosa ≤5 mg/kg/menit, lemak IV ≤1,5 g/kg/hari (ESPEN). Hitung kalori non-nutrisi (propofol, dekstrosa, sitrat) agar tidak overfeeding.</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[12px] text-slate-700 dark:text-slate-300 italic leading-relaxed">
          📚 Singer P et al. ESPEN guideline ICU. Clin Nutr 2019;38:48–79 · Singer P et al. ESPEN practical & partially revised guideline ICU. Clin Nutr 2023;42:1671–89 · Compher C et al. ASPEN critical care guideline. JPEN 2022;46:12–41 · McClave SA et al. ASPEN/SCCM. JPEN 2016;40:159–211 · Fiaccadori E et al. ESPEN AKI/CKD. Clin Nutr 2021;40:1644–68 · Heyland DK et al. EFFORT Protein. Lancet 2023;401:568–76 · Rice TW et al. EDEN. JAMA 2012;307:795–803 · da Silva JSV et al. ASPEN refeeding. Nutr Clin Pract 2020;35:178–95 · Doig GS et al. Lancet Respir Med 2015;3:943–52.
        </div>
      </Accordion>

      <AbbrLegend
        terms={[
          'ICU', 'ARDS', 'AKI', 'HD', 'CRRT', 'KRT', 'EN', 'PN', 'TPN', 'NGT', 'NICE', 'CG', 'ASPEN', 'ESPEN', 'SCCM',
          'IMT', 'BB', 'BBI', 'TB', 'JK', 'ABW', 'IV', 'GI', 'RCT', 'NRS-2002', 'RS', 'DPJP',
        ]}
      />
      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 text-center">
        Alat bantu edukasi & referensi cepat — bukan pengganti penilaian klinis, ahli gizi klinik, atau keputusan DPJP.
      </div>
    </div>
  );
}
