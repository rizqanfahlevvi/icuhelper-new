import { useState } from 'react';
import { CalcSteps, type CalcStep } from '../../../components/ui/CalcSteps';
import { Accordion } from '../../../components/ui/Accordion';
import { SaveToHistoryButton } from '../../../components/ui/SaveToHistoryButton';
import {
  correctedCalcium, caMgdlToMmol, caGluconateInfusion, hyperCaSeverity,
  CA_GLUCONATE_ELEMENTAL_MG_PER_ML, HYPOCA_SEVERE_MMOL,
} from '../../../utils/electrolytes';
import { FieldRow, NumField, TargetField, ToggleList, useToggleSet, StrategyFlow, InfoBox, RefLine, Disclaimer, fmt, type FlowStep } from './ElektroUI';

// Gejala/tanda hipokalsemia (SfE 2016).
const CA_SX = ['Parestesia perioral / jari', 'Tanda Trousseau / Chvostek', 'Tetani / spasme karpopedal', 'Laringospasme', 'QT memanjang / aritmia', 'Kejang'];
const CA_CTX = ['Gagal ginjal tahap akhir / dialisis', 'Mendapat digoksin / aritmia jantung'];

const CA_TARGETS = [
  { value: '8.4', label: 'SfE (2.1 mmol/L)', note: 'SfE 2016: Ca terkoreksi >2.1 mmol/L (8.4 mg/dL) dipakai sebagai ambang aman (mis. pasca-tiroidektomi boleh pulang). Infus dititrasi menuju normokalsemia.' },
  { value: '8.5', label: 'Batas bawah normal lab', note: 'Rentang rujukan bervariasi antar-laboratorium (umumnya ±8.5–10.5 mg/dL).' },
];
const RATE_OPTIONS = [
  { value: '50', label: 'SfE batas bawah', note: '50 mL/jam ≈ 42 mg Ca elemental/jam.' },
  { value: '100', label: 'SfE batas atas', note: '100 mL/jam ≈ 85 mg Ca elemental/jam.' },
];

export function useKalsiumState() {
  const [target, setTarget] = useState('8.4');
  const [ica, setIca] = useState('');
  const [rate, setRate] = useState('50');
  const [sx, toggleSx] = useToggleSet();
  const [ctx, toggleCtx] = useToggleSet();
  return { target, setTarget, ica, setIca, rate, setRate, sx, toggleSx, ctx, toggleCtx };
}
export type KalsiumState = ReturnType<typeof useKalsiumState>;

function corrOf(ca: string, alb: string): { corr: number; usedAlb: boolean } {
  const c = parseFloat(ca);
  const a = parseFloat(alb);
  if (!(c > 0)) return { corr: NaN, usedAlb: false };
  return a > 0 ? { corr: correctedCalcium(c, a), usedAlb: true } : { corr: c, usedAlb: false };
}

export function KalsiumInputs({ s, ca, alb }: { s: KalsiumState; ca: string; alb: string }) {
  const { corr } = corrOf(ca, alb);
  const iv = parseFloat(s.ica);
  const hypo = corr < 8.5 || (iv > 0 && iv < 1.12);
  return (
    <>
      <FieldRow label="Ca ion terukur" sub="opsional, lebih akurat dari koreksi albumin">
        <NumField value={s.ica} onChange={s.setIca} placeholder="Opsional" unit="mmol/L" step="0.01" />
      </FieldRow>
      {hypo && (
        <>
          <ToggleList title="Gejala / Tanda Hipokalsemia" hint="Bergejala pada kadar berapa pun = BERAT (SfE 2016)." items={CA_SX} selected={s.sx} onToggle={s.toggleSx} tone="red" />
          <TargetField label="Target Ca terkoreksi" value={s.target} onChange={s.setTarget} unit="mg/dL" step="0.1" options={CA_TARGETS} />
          <TargetField label="Laju infus rumatan" sub="100 mL Ca glukonat 10% dalam 1 L" value={s.rate} onChange={s.setRate} unit="mL/jam" step="5" options={RATE_OPTIONS} />
          <ToggleList title="Konteks" items={CA_CTX} selected={s.ctx} onToggle={s.toggleCtx} />
        </>
      )}
    </>
  );
}

export function KalsiumResult({ s, ca, alb, bw }: { s: KalsiumState; ca: string; alb: string; bw: string }) {
  const { corr, usedAlb } = corrOf(ca, alb);
  if (!(corr > 0)) return null;
  const w = parseFloat(bw);
  const iv = parseFloat(s.ica);
  const hasIca = iv > 0;
  const mmol = caMgdlToMmol(corr);

  const save = (summary: string) => (
    <SaveToHistoryButton module="elektrolit" label="Koreksi Elektrolit — Ca" className="w-full"
      inputs={{ ca, alb, ica: s.ica, bw, target: s.target, rate: s.rate, gejala: [...s.sx], konteks: [...s.ctx] }} summary={summary} />
  );

  const corrStep: CalcStep = usedAlb
    ? { label: 'Langkah 1 — Ca terkoreksi albumin (Payne):', formula: `Ca terkoreksi = Ca + 0.8 × (4.0 − albumin)\n= ${ca} + 0.8 × (4.0 − ${alb}) = ${fmt(corr, 2)} mg/dL`, note: 'Hanya perkiraan; bila tersedia, gunakan Ca ion terukur.' }
    : { label: 'Langkah 1 — Ca total (albumin tidak diisi):', formula: `Ca = ${ca} mg/dL (tanpa koreksi albumin)`, note: 'Isi albumin agar Ca dikoreksi — hipoalbuminemia membuat Ca total tampak rendah palsu.' };
  const mmolStep: CalcStep = { label: 'Langkah 2 — Konversi ke mmol/L:', formula: `${fmt(corr, 2)} ÷ 4.008 = ${fmt(mmol, 2)} mmol/L` };

  if (corr > 10.5) {
    const sev = hyperCaSeverity(corr);
    const sevText = { ringan: 'Ringan (<3.0 mmol/L / <12 mg/dL) — sering asimtomatik, biasanya tidak perlu koreksi segera', sedang: 'Sedang (3.0–3.5 mmol/L / 12–14 mg/dL) — terapi segera biasanya diindikasikan, terutama bila bergejala', berat: 'BERAT (>3.5 mmol/L / >14 mg/dL) — koreksi URGEN: risiko disritmia & koma' }[sev];
    const flow: FlowStep[] = [
      { title: 'Konfirmasi & EKG', body: 'Ca terkoreksi albumin; EKG untuk QT pendek / gangguan konduksi. Periksa fosfat, PTH, ureum-kreatinin.' },
      { title: 'Rehidrasi NaCl 0.9% 4–6 L / 24 jam', body: <>≈ 170–250 mL/jam. Pantau overload terutama pada gangguan ginjal & lansia.</>, state: sev === 'ringan' ? 'todo' : 'now' },
      { title: 'Bisfosfonat IV bila masih perlu', body: 'Zoledronat 4 mg dalam 15 menit, ATAU pamidronat 30–90 mg (sesuai beratnya) @20 mg/jam, ATAU ibandronat 2–4 mg. Lebih lambat / dosis dikurangi pada gangguan ginjal. Nadir Ca 2–4 hari.', state: sev === 'ringan' ? 'skip' : 'now' },
      { title: 'Lini kedua', body: 'Kalsitonin, denosumab, kalsimimetik (dosis sesuai label/spesialis); glukokortikoid (prednisolon 40 mg/hari) pada limfoma, penyakit granulomatosa, intoksikasi vitamin D. Dialisis bila gagal ginjal berat.' },
      { title: 'Diuretik loop — BUKAN terapi rutin', body: 'Hanya bila terjadi overload cairan; tidak efektif untuk menurunkan Ca (SfE 2016).', state: 'skip' },
      { title: 'Cari penyebab', body: 'Ca tinggi + PTH tinggi → hiperparatiroid primer/tersier; Ca tinggi + PTH rendah → keganasan atau penyebab lain (vit D, granulomatosa, tiazid, litium, imobilisasi). 90% kasus = hiperparatiroid primer atau keganasan.' },
    ];
    return (
      <div className="space-y-4">
        <div className="w-full bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800 rounded-2xl p-5 text-left">
          <div className="text-[12px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-1">Hiperkalsemia</div>
          <div className="font-mono text-2xl font-bold text-red-700 dark:text-red-300">{fmt(corr, 2)} mg/dL · {fmt(mmol, 2)} mmol/L</div>
          <p className="text-[12px] text-red-800 dark:text-red-300 mt-1">{sevText}</p>
        </div>
        <StrategyFlow steps={flow} />
        <CalcSteps tone="red" steps={[corrStep, mmolStep, { label: 'Langkah 3 — Laju rehidrasi:', formula: '4–6 L ÷ 24 jam = 167–250 mL/jam', note: 'Sesuaikan dengan status volume, fungsi jantung & ginjal.' }]} />
        <RefLine>Walsh J, Gittoes N, Selby P. SfE Endocrine Emergency Guidance: acute hypercalcaemia. Endocr Connect 2016;5:G9</RefLine>
        <Disclaimer />
        {save(`Ca terkoreksi ${fmt(corr, 2)} mg/dL — hiperkalsemia ${sev}`)}
      </div>
    );
  }

  const icaLow = hasIca && iv < 1.12;
  if (corr >= 8.5 && !icaLow) {
    return (
      <div className="space-y-3">
        <InfoBox tone="emerald" title={`✅ Ca terkoreksi ${fmt(corr, 2)} mg/dL — dalam rentang normal`}>
          {hasIca ? `Ca ion ${iv} mmol/L juga normal.` : 'Pada pasien kritis, konfirmasi dengan Ca ion bila tersedia.'}
        </InfoBox>
        {save(`Ca terkoreksi ${fmt(corr, 2)} mg/dL — normal`)}
      </div>
    );
  }

  // ── Hipokalsemia ──
  const severe = mmol < HYPOCA_SEVERE_MMOL || s.sx.size > 0;
  const eskd = s.ctx.has(CA_CTX[0]);
  const digoxin = s.ctx.has(CA_CTX[1]);
  const tParsed = parseFloat(s.target);
  const tgt = tParsed >= 7.5 && tParsed <= 10.5 ? tParsed : 8.4;
  const rParsed = parseFloat(s.rate);
  const rate = rParsed > 0 && rParsed <= 200 ? rParsed : 50;
  const inf = caGluconateInfusion(rate, w);
  const bagHours = 1100 / rate;

  const steps: CalcStep[] = [corrStep, {
    ...mmolStep,
    note: `Ambang BERAT SfE: <${HYPOCA_SEVERE_MMOL} mmol/L (≈7.6 mg/dL) dan/atau bergejala → ${severe ? `pasien ini BERAT (${mmol < HYPOCA_SEVERE_MMOL ? 'kadar' : ''}${mmol < HYPOCA_SEVERE_MMOL && s.sx.size > 0 ? ' + ' : ''}${s.sx.size > 0 ? 'gejala' : ''})` : 'pasien ini RINGAN (asimtomatik, >1.9 mmol/L)'}.`,
  }];
  if (severe) {
    steps.push(
      { label: 'Langkah 3 — Bolus awal:', formula: `Ca glukonat 10% 10–20 mL = ${fmt(10 * CA_GLUCONATE_ELEMENTAL_MG_PER_ML, 0)}–${fmt(20 * CA_GLUCONATE_ELEMENTAL_MG_PER_ML, 0)} mg Ca elemental\ndalam 50–100 mL D5W, IV 10 menit, dengan monitor EKG`, note: 'Dapat diulang hingga pasien asimtomatik.' },
      { label: 'Langkah 4 — Infus rumatan:', formula: `100 mL Ca glukonat 10% (${fmt(100 * CA_GLUCONATE_ELEMENTAL_MG_PER_ML, 0)} mg) dalam 1 L NaCl 0.9%/D5W → ±1100 mL\nKonsentrasi = ${fmt(100 * CA_GLUCONATE_ELEMENTAL_MG_PER_ML, 0)} ÷ 1100 = ${fmt(inf.concMgPerMl, 2)} mg/mL\nLaju ${rate} mL/jam × ${fmt(inf.concMgPerMl, 2)} = ${fmt(inf.mgPerHr, 0)} mg/jam${w > 0 ? ` = ${fmt(inf.mgPerKgPerHr, 2)} mg/kg/jam` : ''}\n1 kantong habis ±${fmt(bagHours, 0)} jam`, note: 'SfE: 50–100 mL/jam, titrasi menuju normokalsemia sampai terapi penyebab bekerja.' },
    );
  } else {
    steps.push({ label: 'Langkah 3 — Terapi ringan:', formula: 'Suplemen kalsium oral + terapi penyebab', note: 'Vitamin D bila defisiensi; Mg bila hipomagnesemia. Ulang Ca dalam 24 jam (SfE 2016).' });
  }
  steps.push({ label: `Langkah ${severe ? 5 : 4} — Selisih ke target:`, formula: `Target ${tgt} − ${fmt(corr, 2)} = ${fmt(Math.max(0, tgt - corr), 2)} mg/dL`, note: 'Tidak ada rumus dosis→kenaikan Ca yang andal; laju dititrasi dengan Ca serial (SfE: pemeriksaan sering pada fase stabilisasi).' });

  const flow: FlowStep[] = [
    { title: 'Konfirmasi', body: <>Ca terkoreksi albumin{hasIca ? ` dan Ca ion ${iv} mmol/L` : ' — lebih baik Ca ion terukur bila ada'}. Periksa fosfat, PTH, ureum-kreatinin, vitamin D, <strong>magnesium</strong>.</> },
    { title: `Keparahan: ${severe ? 'BERAT — kegawatan medis' : 'ringan'}`, body: severe ? 'Kadar <1.9 mmol/L dan/atau bergejala (parestesia, Trousseau/Chvostek, tetani, laringospasme, QT memanjang/aritmia, kejang).' : 'Asimtomatik dan >1.9 mmol/L.', state: 'now' },
    { title: 'Koreksi Mg bila rendah', body: 'Hipomagnesemia menghambat sekresi PTH → hipokalsemia refrakter. SfE: Mg IV 24 mmol/24 jam (= 6 g MgSO₄ dalam 500 mL NaCl 0.9%/D5W). Gunakan tab Magnesium.' },
    { title: 'Bolus Ca glukonat 10% 10–20 mL / 10 menit', body: 'Dalam 50–100 mL D5W, dengan monitor EKG; ulang sampai asimtomatik.', state: severe ? 'now' : 'skip' },
    { title: `Infus rumatan ${rate} mL/jam`, body: <>100 mL Ca glukonat 10% dalam 1 L → {fmt(inf.mgPerHr, 0)} mg Ca elemental/jam. Titrasi menuju target {tgt} mg/dL.{eskd && <strong> Gagal ginjal tahap akhir/dialisis: infus volume besar TIDAK dianjurkan — ikuti panduan KDOQI/konsul nefrologi.</strong>}</>, state: severe ? 'now' : 'skip' },
    { title: 'Oral + terapi penyebab', body: 'Suplemen kalsium oral; hipoparatiroid → alfakalsidol/kalsitriol 0.25–0.5 µg/hari (pantau ketat, risiko hiperkalsemia); defisiensi vitamin D → loading kole/ergokalsiferol.', state: severe ? 'todo' : 'now' },
  ];

  return (
    <div className="space-y-4">
      <div className={`w-full rounded-2xl p-5 text-left border ${severe ? 'bg-red-50 dark:bg-red-900/15 border-red-200 dark:border-red-800' : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30'}`}>
        <div className={`text-[12px] font-bold uppercase tracking-wider mb-1 ${severe ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>Hipokalsemia {severe ? 'BERAT' : 'ringan'} · target {tgt} mg/dL</div>
        <div className="font-mono text-2xl font-bold text-slate-800 dark:text-slate-100">{fmt(corr, 2)} mg/dL · {fmt(mmol, 2)} mmol/L{hasIca ? ` · iCa ${iv}` : ''}</div>
        <p className="text-[12px] text-slate-700 dark:text-slate-300 mt-1">
          {severe ? `Bolus 10–20 mL Ca glukonat 10% → infus ${rate} mL/jam (${fmt(inf.mgPerHr, 0)} mg/jam)` : 'Kalsium oral + terapi penyebab; ulang Ca 24 jam'}
        </p>
      </div>

      <StrategyFlow steps={flow} />
      <CalcSteps tone="amber" steps={steps} />

      <InfoBox tone="red" title="⚠ Keamanan Ca IV">
        Ca klorida 10% (10 mL = 6.8 mmol, ±3× Ca glukonat) hanya via vena sentral — lebih iritan. Jangan campur dengan NaHCO₃ atau fosfat (presipitasi). Efek samping: flebitis, hipotensi, aritmia.{digoxin ? ' Pasien digoksin/aritmia: monitor EKG kontinu selama Ca IV (SfE 2016).' : ' Pasien digoksin/aritmia perlu monitor EKG kontinu.'}
      </InfoBox>

      <Accordion title="📖 Dasar rujukan hipokalsemia">
        <ul className="list-disc pl-4 space-y-1 text-[12px] text-slate-700 dark:text-slate-300">
          <li>Gejala biasanya muncul bila Ca terkoreksi &lt;±1.9 mmol/L, tetapi bergantung kecepatan penurunan (SfE 2016).</li>
          <li>Ca glukonat 10%: 10 mL = 93 mg Ca elemental (2.3 mmol; 4.65 mEq).</li>
          <li>Penyebab tersering di RS: pasca-tiroidektomi total; lainnya defisiensi vitamin D berat, hipomagnesemia (termasuk akibat PPI), obat sitotoksik, pankreatitis, rabdomiolisis, transfusi masif.</li>
        </ul>
      </Accordion>

      <RefLine>Turner J, Gittoes N, Selby P. SfE Endocrine Emergency Guidance: acute hypocalcaemia. Endocr Connect 2016;5:G7 · Payne RB. BMJ 1973</RefLine>
      <Disclaimer />
      {save(`Ca terkoreksi ${fmt(corr, 2)} mg/dL — hipokalsemia ${severe ? 'berat' : 'ringan'}${severe ? `; bolus 10–20 mL + infus ${rate} mL/jam` : '; oral'}`)}
    </div>
  );
}
