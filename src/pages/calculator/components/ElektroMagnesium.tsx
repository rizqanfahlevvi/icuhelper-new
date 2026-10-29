import { useState } from 'react';
import { CalcSteps, type CalcStep } from '../../../components/ui/CalcSteps';
import { Accordion } from '../../../components/ui/Accordion';
import { SaveToHistoryButton } from '../../../components/ui/SaveToHistoryButton';
import { mgMgdlToMeq, mgMgdlToMmol, mgso4DoseToTarget, mgInfusionHours, MEQ_PER_G_MGSO4, MG_RISE_MEQ_PER_G } from '../../../utils/electrolytes';
import { TargetField, ToggleList, useToggleSet, StrategyFlow, InfoBox, RefLine, Disclaimer, fmt, type FlowStep } from './ElektroUI';

const MG_SX = ['Aritmia / torsades / hemodinamik tidak stabil', 'Kejang / tetani', 'Hipokalemia atau hipokalsemia refrakter'];
const MG_TARGETS = [
  { value: '1.8', label: 'Batas bawah normal', note: 'Rentang normal ±1.8–2.3 mg/dL (= 1.5–1.9 mEq/L; Hansen 2018). Rentang lab bervariasi.' },
  { value: '2.0', label: 'Tengah rentang normal', note: 'Di tengah rentang normal; memberi ruang bila Mg turun lagi akibat kehilangan yang berlanjut.' },
];

export function useMagnesiumState() {
  const [target, setTarget] = useState('2.0');
  const [sx, toggleSx] = useToggleSet();
  return { target, setTarget, sx, toggleSx };
}
export type MagnesiumState = ReturnType<typeof useMagnesiumState>;

export function MagnesiumInputs({ s, mg }: { s: MagnesiumState; mg: string }) {
  const mv = parseFloat(mg);
  if (!(mv > 0) || mv > 2.6) return null;
  return (
    <>
      <TargetField label="Target Mg" sub="ketik atau pilih rujukan" value={s.target} onChange={s.setTarget} unit="mg/dL" step="0.1" options={MG_TARGETS} />
      <ToggleList title="Gejala / Konteks" hint="Gejala bermakna → jalur IV meski Mg tidak terlalu rendah." items={MG_SX} selected={s.sx} onToggle={s.toggleSx} tone="red" />
    </>
  );
}

export function MagnesiumResult({ s, mg, egfr, bw }: { s: MagnesiumState; mg: string; egfr: string; bw: string }) {
  const mv = parseFloat(mg);
  if (!(mv > 0)) return null;
  const w = parseFloat(bw);
  const eg = parseFloat(egfr);
  const renal = eg > 0 && eg < 30;
  const meq = mgMgdlToMeq(mv);
  const mmol = mgMgdlToMmol(mv);

  const save = (summary: string) => (
    <SaveToHistoryButton module="elektrolit" label="Koreksi Elektrolit — Mg" className="w-full"
      inputs={{ mg, egfr, bw, target: s.target, gejala: [...s.sx] }} summary={summary} />
  );

  const toxBox = (
    <InfoBox tone="red" title="⚠ Toksisitas Mg">
      Mg sangat tinggi (&gt;4–5 mmol/L) → kelemahan otot, depresi napas, hingga henti jantung. Antidot: Ca IV 100–200 mg elemental dalam 5–10 menit (≈ 10–20 mL Ca glukonat 10%). Pantau refleks patela & laju napas selama infus Mg (Hansen 2018).
    </InfoBox>
  );

  if (mv > 2.6) {
    return (
      <div className="space-y-3">
        <InfoBox tone="amber" title={`Mg ${mv} mg/dL — di atas rentang normal`}>Hentikan sumber Mg (infus, antasida/laksatif ber-Mg). Risiko meningkat pada gangguan ginjal.</InfoBox>
        {toxBox}
        {save(`Mg: ${mv} mg/dL — di atas normal`)}
      </div>
    );
  }

  const tParsed = parseFloat(s.target);
  const tgt = tParsed >= 1.5 && tParsed <= 2.6 ? tParsed : 2.0;
  const urgent = s.sx.has(MG_SX[0]);
  const symptomatic = s.sx.size > 0;
  const iv = mmol < 0.5 || symptomatic;
  const dose = mgso4DoseToTarget(mv, tgt, w);
  const hrs = mgInfusionHours(dose.grams);
  const hrsText = hrs.max ? `${hrs.min}–${hrs.max}` : `>${hrs.min}`;
  const bodyDefLo = w > 0 ? 1 * w : NaN;   // defisit tubuh 1–2 mEq/kg (Hansen 2018) — konteks
  const bodyDefHi = w > 0 ? 2 * w : NaN;

  if (dose.grams === 0 && !symptomatic) {
    return (
      <div className="space-y-3">
        <InfoBox tone="emerald" title={`✅ Mg ${mv} mg/dL (${fmt(meq, 2)} mEq/L) — sudah ≥ target ${tgt}`}>
          Mg serum dapat normal walau Mg tubuh total kurang. Pada pasien berisiko dengan gejala khas, terapi tetap dapat dipertimbangkan (Hansen 2018).
        </InfoBox>
        {save(`Mg: ${mv} mg/dL — normal`)}
      </div>
    );
  }

  // ① Langkah dasar
  const basic: CalcStep[] = [
    { label: 'Langkah 1 — Konversi satuan:', formula: `mmol/L = ${mv} × 10 ÷ 24.305 = ${fmt(mmol, 2)}\nmEq/L = mmol/L × 2 = ${fmt(meq, 2)}`, note: `Ambang IV: Mg <0.5 mmol/L (≈1.2 mg/dL) atau gejala bermakna → pasien ini: ${iv ? 'IV' : 'oral cukup'}.` },
    { label: 'Langkah 2 — Selisih ke target:', formula: `Target ${tgt} mg/dL = ${fmt(mgMgdlToMeq(tgt), 2)} mEq/L\nΔMg = ${fmt(mgMgdlToMeq(tgt), 2)} − ${fmt(meq, 2)} = ${fmt(dose.deltaMeq, 2)} mEq/L` },
    { label: 'Langkah 3 — Kebutuhan MgSO₄ (aturan empiris ICU):', formula: `1 g MgSO₄ (${MEQ_PER_G_MGSO4} mEq) ≈ +${MG_RISE_MEQ_PER_G} mEq/L\nKebutuhan = ${fmt(dose.deltaMeq, 2)} ÷ ${MG_RISE_MEQ_PER_G} = ${fmt(dose.rawGrams, 2)} g → dibulatkan ${dose.capped ? `${Math.ceil(dose.rawGrams * 2) / 2} g` : `${dose.grams} g`}\nBatas hipomagnesemia berat 1.5 mEq/kg = ${w > 0 ? `${fmt(dose.maxGrams, 1)} g` : '(isi BB)'}${dose.capped ? ` → DIBATASI ${dose.grams} g` : ''}`, note: 'Kenaikan dinilai dalam 18–30 jam; distribusi Mg ke jaringan lambat dan ekskresi ginjal cepat (Hansen 2018).' },
    { label: 'Langkah 4 — Konteks: defisit Mg tubuh:', formula: w > 0 ? `≈ 1–2 mEq/kg × ${w} kg = ${fmt(bodyDefLo, 0)}–${fmt(bodyDefHi, 0)} mEq\n≈ ${fmt(bodyDefLo / MEQ_PER_G_MGSO4, 1)}–${fmt(bodyDefHi / MEQ_PER_G_MGSO4, 1)} g MgSO₄` : 'Isi BB untuk menghitung', note: 'Mg serum hanya 0.3% Mg tubuh. Defisit tubuh jauh lebih besar dari kebutuhan Langkah 3, dan sebagian besar Mg IV terbuang lewat ginjal — itulah sebabnya penggantian berulang beberapa hari dengan Mg serial.' },
  ];

  // ② Cara pemberian
  const give: CalcStep[] = [];
  if (urgent) give.push({ label: 'Langkah P1 — Bolus darurat:', formula: '2 g MgSO₄ (16 mEq) IV dalam 2–15 menit\n= 10 mL MgSO₄ 20% = 5 mL MgSO₄ 40%', note: 'Untuk aritmia berat/tidak stabil, lalu lanjutkan infus kontinu.' });
  give.push({ label: `Langkah P${urgent ? 2 : 1} — Volume & durasi infus:`, formula: `${dose.grams} g = ${fmt(dose.grams / 0.2, 1)} mL MgSO₄ 20% = ${fmt(dose.grams / 0.4, 1)} mL MgSO₄ 40%\nDurasi ${hrsText} jam → ${hrs.max ? `${fmt(dose.grams / hrs.max, 2)}–${fmt(dose.grams / hrs.min, 2)}` : `≤${fmt(dose.grams / hrs.min, 2)}`} g/jam`, note: renal ? `eGFR ${eg}: risiko hipermagnesemia — dosis harus disesuaikan & dipantau ketat; tidak ada angka baku (mis. mulai separuh dosis lalu titrasi dengan Mg serial).` : 'Dosis <6 g dalam 8–12 jam; dosis lebih besar >25 jam (Hansen 2018).' });

  const flow: FlowStep[] = [
    { title: 'Konfirmasi & pahami keterbatasan', body: 'Mg serum (0.3% Mg tubuh) bisa normal meski defisit intrasel; hipoalbuminemia menurunkan Mg total palsu. Pasien berisiko + gejala khas dapat diterapi walau Mg normal (Hansen 2018).' },
    { title: `Hitung dasar: Δ ${fmt(dose.deltaMeq, 2)} mEq/L → MgSO₄ ${dose.grams} g`, body: 'Lihat ① Hasil Dasar.', state: 'now' },
    { title: 'Cari penyebab', body: 'GI: diare, NGT, fistula, pankreatitis. Ginjal: diuretik loop, aminoglikosida, cisplatin, siklosporin, diuresis osmotik, cairan NaCl lama. Lain: KAD, alkoholisme, kelaparan, PPI.' },
    { title: 'Darurat: 2 g MgSO₄ IV dalam 2–15 menit', body: 'Untuk aritmia berat / hemodinamik tidak stabil, lalu infus kontinu.', state: urgent ? 'now' : 'skip' },
    { title: `Rute: ${iv ? `IV ${dose.grams} g MgSO₄ dalam ${hrsText} jam` : 'ORAL'}`, body: iv ? <>Dalam NaCl 0.9%/D5W.{dose.capped && <strong> Dosis dibatasi 1.5 mEq/kg.</strong>}</> : <>Mg ≥0.5 mmol/L tanpa gejala bermakna → suplemen oral (dosis sesuai sediaan). Estimasi IV bila oral tidak mungkin: {dose.grams} g.</>, state: 'now' },
    { title: 'Sesuaikan dengan fungsi ginjal', body: renal ? <strong>eGFR {eg} — dosis harus dikurangi & dipantau ketat (refleks patela, napas, Mg serial).</strong> : 'Isi eGFR. Gagal ginjal → risiko hipermagnesemia; Mg umumnya tidak dianjurkan kecuali defisiensi berat, dengan dosis disesuaikan.', state: renal ? 'now' : 'todo' },
    { title: 'Pantau & koreksi elektrolit terkait', body: 'Mg ulang (efek penuh 18–30 jam). Hipomagnesemia menyebabkan hipokalemia (kebocoran K ginjal via ROMK) & hipokalsemia (PTH terhambat) — koreksi K & Ca bersamaan.' },
  ];

  return (
    <div className="space-y-4">
      {/* ① HASIL DASAR */}
      <div className="w-full bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-5 text-left">
        <div className="text-[12px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">① Hasil Dasar · Hipomagnesemia · Mg {mv} → target {tgt} mg/dL</div>
        <div className="font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-300">Kebutuhan MgSO₄: {dose.grams} g</div>
        <p className="text-[12px] text-emerald-800/80 dark:text-emerald-300/80">= ΔMg {fmt(dose.deltaMeq, 2)} mEq/L ÷ 0.15 per gram{dose.capped ? ' (dibatasi 1.5 mEq/kg)' : ''}</p>
        <div className="grid grid-cols-3 gap-2 mt-3 text-[12px]">
          <div className="bg-white/60 dark:bg-black/20 rounded-lg p-2 border border-emerald-200 dark:border-emerald-800/50">
            <div className="font-semibold text-emerald-700 dark:text-emerald-400">Mg serum</div>
            <div className="font-mono font-bold text-[14px] text-slate-800 dark:text-slate-100">{fmt(mmol, 2)} mmol/L</div>
            <div className="text-[11px] opacity-80">{fmt(meq, 2)} mEq/L</div>
          </div>
          <div className="bg-white/60 dark:bg-black/20 rounded-lg p-2 border border-emerald-300 dark:border-emerald-700">
            <div className="font-semibold text-emerald-700 dark:text-emerald-400">Δ ke target</div>
            <div className="font-mono font-bold text-[14px] text-slate-800 dark:text-slate-100">{fmt(dose.deltaMeq, 2)} mEq/L</div>
            <div className="text-[11px] opacity-80">{iv ? 'jalur IV' : 'oral cukup'}</div>
          </div>
          <div className="bg-white/60 dark:bg-black/20 rounded-lg p-2 border border-emerald-200 dark:border-emerald-800/50">
            <div className="font-semibold text-emerald-700 dark:text-emerald-400">Defisit tubuh</div>
            <div className="font-mono font-bold text-[14px] text-slate-800 dark:text-slate-100">{w > 0 ? `${fmt(bodyDefLo, 0)}–${fmt(bodyDefHi, 0)}` : '–'}</div>
            <div className="text-[11px] opacity-80">mEq · konteks</div>
          </div>
        </div>
      </div>
      <CalcSteps tone="emerald" title="🧮 Langkah Dasar — dari input ke kebutuhan MgSO₄" steps={basic} footer="Aturan empiris pasien kritis — respons individual bervariasi; titrasi dengan Mg serial." />

      {/* ② CARA PEMBERIAN */}
      <div className="text-[13px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 pt-2">② Cara Pemberian</div>
      <div className="w-full bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-left space-y-2">
        <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">{iv ? `IV (${mmol < 0.5 ? 'Mg <0.5 mmol/L' : 'bergejala'})` : 'Oral dianjurkan — estimasi IV bila oral tidak mungkin'}</div>
        <div className="font-mono text-xl font-bold text-slate-800 dark:text-slate-100">{urgent ? '2 g bolus → ' : ''}MgSO₄ {dose.grams} g dalam {hrsText} jam</div>
        <p className="text-[12px] text-slate-700 dark:text-slate-300">{fmt(dose.grams / 0.2, 1)} mL MgSO₄ 20% · {fmt(dose.grams / 0.4, 1)} mL MgSO₄ 40%{renal ? ' · ⚠ eGFR <30: kurangi & pantau' : ''}</p>
        <CalcSteps tone="slate" title="🧮 Rincian pemberian" steps={give} />
      </div>
      {toxBox}
      <StrategyFlow steps={flow} />
      <Accordion title="📖 Dasar rujukan hipomagnesemia">
        <ul className="list-disc pl-4 space-y-1 text-[12px] text-slate-700 dark:text-slate-300">
          <li>Defisit Mg tubuh dapat 1–2 mEq/kg. Ringan/tanpa gejala → oral; IV bila Mg &lt;0.5 mmol/L atau gejala bermakna.</li>
          <li>1 g MgSO₄ IV menaikkan Mg serum ±0.15 mEq/L dalam 18–30 jam (aturan empiris ICU).</li>
          <li>Hipomagnesemia berat: hingga 1.5 mEq/kg; &lt;6 g dalam 8–12 jam, lebih besar &gt;25 jam. Darurat: 16 mEq (2 g) dalam 2–15 menit lalu infus.</li>
          <li>Praktik pengganti Mg sebagian besar berasal dari uji infark miokard (bolus 2 g lalu infus hingga 16 g/24 jam).</li>
        </ul>
      </Accordion>
      <RefLine>Hansen BA, Bruserud Ø. Hypomagnesemia in critically ill patients. J Intensive Care 2018;6:21 · Turner J, et al. Endocr Connect 2016;5:G7</RefLine>
      <Disclaimer />
      {save(`Mg: ${mv} → target ${tgt} mg/dL — Δ ${fmt(dose.deltaMeq, 2)} mEq/L → ${urgent ? '2 g bolus + ' : ''}MgSO₄ ${dose.grams} g ${iv ? 'IV' : '(oral dianjurkan)'} dalam ${hrsText} jam`)}
    </div>
  );
}
