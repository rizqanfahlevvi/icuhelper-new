import { AlertTriangle, Info } from 'lucide-react';
import { CalcSteps, type CalcStep } from '../../../components/ui/CalcSteps';
import { Accordion } from '../../../components/ui/Accordion';
import { SaveToHistoryButton } from '../../../components/ui/SaveToHistoryButton';
import type { NaResult } from '../../../utils/sodium';
import { StrategyFlow, InfoBox, RefLine, Disclaimer, fmt, type FlowStep } from './ElektroUI';

type Severity = 'berat' | 'sedang' | 'ringan';
interface Props {
  r: NaResult; na: string; glu: string; ureum: string; ureaUnit: string; sex: string; age: string; onset: string;
  naSeverity: Severity; odsFactors: Set<string>; saveInputs: Record<string, unknown>;
}

const glucoseStep = (r: NaResult, na: string, glu: string): CalcStep => ({
  label: 'Langkah 0 — Koreksi Na terhadap hiperglikemia (Katz/Hillier):',
  formula: `Na terkoreksi = Na + 1.6 × (glukosa − 100) ÷ 100\n= ${na} + 1.6 × (${glu} − 100) ÷ 100 = ${fmt(r.calcN, 1)} mEq/L`,
  note: 'Glukosa menarik air keluar sel sehingga Na terukur rendah "palsu"; semua perhitungan memakai Na terkoreksi.',
});
const tbwStep = (r: NaResult, sex: string, age: string): CalcStep => ({
  label: 'Langkah 1 — Total Body Water (TBW):',
  formula: `TBW = faktor × BB = ${r.tbwF} × ${r.w} kg = ${fmt(r.tbw, 1)} L`,
  note: `Faktor ${r.tbwF} (${sex === 'm' ? 'pria' : 'wanita'}${age ? `, ${age} th` : ''}; lansia ≥65 th memakai faktor lebih kecil). Pada dehidrasi berat TBW nyata bisa lebih rendah.`,
});

type Osm = NaResult['osm'];
const ureaLabel = (unit: string) => (unit === 'bun' ? 'BUN/2.8' : 'Ureum/6');

/** Langkah 0b — osmolalitas serum terhitung (efektif & total), plus terukur & Na direct bila ada. */
const osmStep = (o: Osm, na: string, glu: string, ureum: string, ureaUnit: string): CalcStep => {
  if (isNaN(o.effective)) {
    return { label: 'Langkah 0b — Osmolalitas serum (konfirmasi tonisitas):', formula: 'Isi glukosa (dan ureum) untuk menghitung osmolalitas.', note: 'Langkah pertama pedoman: memastikan hiponatremia HIPOTONIK (osmolalitas <275 mOsm/kg) sebelum memilih terapi.' };
  }
  const lines = [
    `Efektif = 2 × Na + Glukosa/18 = 2 × ${na} + ${glu}/18 = ${fmt(o.effective, 1)} mOsm/kg → ${o.calcClass}`,
  ];
  if (!isNaN(o.total)) lines.push(`Total   = efektif + ${ureaLabel(ureaUnit)} = ${fmt(o.effective, 1)} + ${fmt(o.ureaTerm, 1)} = ${fmt(o.total, 1)} mOsm/kg`);
  if (o.hasMeasured) {
    lines.push(`Terukur = ${o.measuredOsm} mOsm/kg → ${o.measuredClass}${!isNaN(o.effFromMeasured) ? ` · efektif ≈ ${o.measuredOsm} − ${fmt(o.ureaTerm, 1)} = ${fmt(o.effFromMeasured, 1)}` : ''}`);
    if (!isNaN(o.gap)) lines.push(`Osmolar gap = terukur − total = ${o.measuredOsm} − ${fmt(o.total, 1)} = ${fmt(o.gap, 1)}`);
  }
  if (o.hasDirect) lines.push(`Na gas darah ${o.naDirect} − Na lab ${na} = ${o.naDiff > 0 ? '+' : ''}${fmt(o.naDiff, 1)} mEq/L`);
  return {
    label: 'Langkah 0b — Osmolalitas serum (konfirmasi tonisitas):',
    formula: lines.join('\n'),
    note: 'Urea bebas melintasi membran sel (osmol tidak efektif) — yang menentukan tonisitas adalah osmolalitas EFEKTIF. Osm terhitung <275 belum menyingkirkan osmol tak terukur (manitol, glisin, kontras) maupun pseudohiponatremia; osm TERUKUR <275 selalu berarti hipotonik (Spasovski 2014).',
  };
};

/** Banner status tonisitas di atas hasil hiponatremia. */
function TonicityBanner({ o, na }: { o: Osm; na: string }) {
  const directLine = o.hasDirect && o.status !== 'curiga-pseudo'
    ? <p className="mt-1">Na gas darah {o.naDirect} vs Na lab {na}: selisih {o.naDiff > 0 ? '+' : ''}{fmt(o.naDiff, 1)} mEq/L. Normalnya kedua metode berbeda rata-rata &lt;±1 mmol/L (Vera 2022); selisih jauh lebih besar berarti sebagian penurunan Na lab kemungkinan artefak (lipid/protein tinggi).</p>
    : null;
  const gapLine = o.hasMeasured && !isNaN(o.gap)
    ? <p className="mt-1">Osmolar gap {fmt(o.gap, 1)} mOsm/kg{o.gap > 10 ? ' — meningkat: curiga osmol tak terukur (manitol, alkohol toksik, glisin) atau pseudohiponatremia.' : '.'}</p>
    : null;
  switch (o.status) {
    case 'pasti-hipotonik':
      return <InfoBox tone="emerald" title={`✓ Hiponatremia HIPOTONIK terkonfirmasi (osm terukur ${o.measuredOsm} <275)`}>Lanjutkan alur di bawah.{gapLine}{directLine}</InfoBox>;
    case 'kemungkinan-hipotonik':
      return <InfoBox tone="blue" title={`Kemungkinan hipotonik — osm efektif ${o.hasMeasured && !isNaN(o.effFromMeasured) ? `≈${fmt(o.effFromMeasured, 1)} (dari terukur)` : `terhitung ${fmt(o.effective, 1)}`} mOsm/kg`}>Belum menyingkirkan osmol tak terukur (manitol, glisin pasca-TURP, kontras) dan pseudohiponatremia. Bila ada analyzer gas darah, isi Na gas darah untuk pembanding.{gapLine}{directLine}</InfoBox>;
    case 'curiga-pseudo':
      return <InfoBox tone="red" title={<span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Curiga PSEUDOhiponatremia</span>}>Na gas darah (direct ISE) {o.naDirect} sudah normal, sedangkan Na lab (indirect ISE) {na} rendah. Indirect ISE menganggap air plasma 93% — trigliserida/protein sangat tinggi membuat Na tampak rendah palsu (El Hage 2018). <strong>Jangan koreksi berdasarkan Na lab.</strong> Periksa trigliserida, kolesterol, protein total.{gapLine}</InfoBox>;
    case 'bukan-hipotonik':
      return <InfoBox tone="red" title={<span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> BUKAN hiponatremia hipotonik ({o.hasMeasured ? `osm terukur ${o.measuredOsm}` : `osm efektif ${fmt(o.effective, 1)}`} → {o.hasMeasured ? o.measuredClass : o.calcClass})</span>}>Jangan berikan NaCl 3% berdasarkan angka Na ini. Cari penyebab: hiperglikemia (lihat Na terkoreksi), manitol, glisin/sorbitol (irigasi TURP), kontras, atau pseudohiponatremia (lipid/protein tinggi — bandingkan dengan Na gas darah).{gapLine}{directLine}</InfoBox>;
    default:
      return <InfoBox tone="slate" title="Tonisitas belum dinilai">Isi glukosa dan ureum (panel lab rutin) untuk menghitung osmolalitas efektif — langkah pertama memastikan hiponatremia hipotonik.</InfoBox>;
  }
}

export function NatriumResult(p: Props) {
  const { r } = p;
  if (r.type === 'hipo') return <HypoNa {...p} r={r} />;
  if (r.type === 'hiper') return <HyperNa {...p} r={r} />;
  return (
    <div className="space-y-3">
      <InfoBox tone="emerald" title={`✅ Na ${fmt(r.calcN, 1)} mEq/L — dalam rentang normal`}>
        {r.hasHyper ? `Na terukur ${p.na} terkoreksi glukosa ${p.glu} mg/dL menjadi ${fmt(r.calcN, 1)} mEq/L.` : 'Tidak perlu koreksi.'}
      </InfoBox>
      <SaveToHistoryButton module="elektrolit" label="Koreksi Elektrolit — NA" className="w-full" inputs={p.saveInputs} summary={`Na: ${p.na} mEq/L — normal`} />
    </div>
  );
}

function HypoNa({ r, na, glu, ureum, ureaUnit, sex, age, onset, naSeverity, odsFactors, saveInputs }: Props & { r: Extract<NaResult, { type: 'hipo' }> }) {
  const o = r.osm;
  const tonicityOk = o.status === 'pasti-hipotonik' || o.status === 'kemungkinan-hipotonik' || o.status === 'belum-dinilai';
  // ① Langkah dasar
  const basic: CalcStep[] = [];
  if (r.hasHyper) basic.push(glucoseStep(r, na, glu));
  basic.push(osmStep(o, na, glu, ureum, ureaUnit));
  basic.push(
    tbwStep(r, sex, age),
    { label: `Langkah 2 — Target kenaikan Na 24 jam (${onset === 'akut' ? 'akut' : 'kronik'}):`, formula: `ΔNa = +${fmt(r.d, 1)} mEq/L (anjuran ${r.lim.goalLo}–${r.lim.goalHi}; batas ${r.lim.limit24}${r.highOdsRisk ? ', risiko ODS tinggi' : ''})\nNa target 24 jam = ${fmt(r.calcN, 1)} + ${fmt(r.d, 1)} = ${fmt(r.tgt, 1)} mEq/L`, note: onset === 'akut' ? 'Onset akut (<48 jam) terdokumentasi: otak belum beradaptasi → risiko ODS rendah; bahaya utama edema serebri.' : 'Kronik/tidak tahu: otak sudah beradaptasi → kecepatan dibatasi untuk mencegah ODS.' },
    { label: 'Langkah 3 — Defisit Na untuk target 24 jam:', formula: `Defisit = TBW × ΔNa = ${fmt(r.tbw, 1)} × ${fmt(r.d, 1)} = ${fmt(r.deficit, 0)} mEq`, note: 'Jumlah Na yang menaikkan seluruh air tubuh sebesar ΔNa — inilah yang dikejar hari ini.' },
    { label: 'Langkah 4 — Konteks: defisit total ke 140:', formula: `Defisit total = TBW × (140 − Na) = ${fmt(r.tbw, 1)} × (140 − ${fmt(r.calcN, 1)}) = ${fmt(r.totalDeficit, 0)} mEq\nPada +${fmt(Math.min(r.rise, r.lim.limit24), 0)} mEq/L/hari → ≥${r.daysTo140} hari`, note: 'Rumus "defisit natrium" klasik ini TIDAK diberikan sekaligus — memberikannya dalam 24 jam akan melampaui batas ODS. Dipakai hanya untuk memahami besarnya masalah.' },
  );

  // ② Cara pemberian — estimasi NaCl 3% (koreksi lambat)
  const give: CalcStep[] = [
    { label: 'Langkah P1 — Volume via metode defisit:', formula: `NaCl 3% = 513 mEq Na/L\nVolume = ${fmt(r.deficit, 0)} ÷ 513 × 1000 = ${fmt(r.v, 0)} mL`, note: 'Batas bawah (tidak memperhitungkan dilusi oleh air yang ikut masuk).' },
    { label: 'Langkah P2 — Volume via Adrogué–Madías:', formula: `ΔNa per 1 L NaCl 3% = (513 − Na) ÷ (TBW + 1)\n= (513 − ${fmt(r.calcN, 1)}) ÷ (${fmt(r.tbw, 1)} + 1) = ${fmt(r.amPerLiter, 1)} mEq/L per L\nVolume = ${fmt(r.d, 1)} ÷ ${fmt(r.amPerLiter, 1)} × 1000 = ${fmt(r.vAM, 0)} mL`, note: 'Memperhitungkan dilusi → batas atas. Bila juga diberi KCl, K ikut menaikkan Na (pakai Na+K infusat).' },
    { label: 'Langkah P3 — Laju 24 jam:', formula: `Defisit: ${fmt(r.v, 0)} ÷ 24 = ${fmt(r.rate, 1)} mL/jam · Adrogué: ${fmt(r.vAM, 0)} ÷ 24 = ${fmt(r.rateAM, 1)} mL/jam\nBatas laju absolut (setara +0.5 mEq/L/jam) = ${fmt(r.rateMax, 1)} mL/jam`, note: `Kecepatan rata-rata ${fmt(r.d / 24, 2)} mEq/L/jam — jauh di bawah 0.5 mEq/L/jam.` },
  ];

  const flow: FlowStep[] = [
    { title: o.status === 'pasti-hipotonik' ? '✓ Hipotonik terkonfirmasi (osm terukur)' : o.status === 'kemungkinan-hipotonik' ? `Kemungkinan hipotonik (osm efektif ${fmt(o.hasMeasured && !isNaN(o.effFromMeasured) ? o.effFromMeasured : o.effective, 0)})` : o.status === 'belum-dinilai' ? 'Pastikan hiponatremia hipotonik' : '⚠ Belum terbukti hipotonik — hentikan dulu', body: <>Osmolalitas efektif &lt;275 mOsm/kg (terhitung: 2×Na + glukosa/18; urea tidak dihitung karena tidak efektif){r.hasHyper ? `; Na terkoreksi glukosa ${fmt(r.calcN, 1)}` : ''}. Singkirkan pseudohiponatremia: bandingkan dengan Na analyzer gas darah (direct ISE).</>, state: o.status === 'pasti-hipotonik' ? 'done' : 'now' },
    { title: `Hitung dasar: target +${fmt(r.d, 1)} → defisit ${fmt(r.deficit, 0)} mEq`, body: `Lihat ① Hasil Dasar. Batas ${r.lim.limit24} mEq/L di 24 jam pertama, ${r.lim.limitNext24} tiap 24 jam berikutnya.`, state: r.riseOverLimit ? 'now' : 'todo' },
    { title: `Nilai gejala → ${naSeverity.toUpperCase()}`, body: naSeverity === 'berat' ? 'Bolus NaCl 3% 150 mL/20 menit, ulang s/d gejala reda atau Na naik ~5 (target jam-1 +4–6).' : naSeverity === 'sedang' ? 'Infus tunggal NaCl 3% 150 mL/20 menit, lalu re-evaluasi.' : 'NaCl 3% tidak rutin. Fokus penyebab & status volume.', state: 'now' },
    { title: `Onset: ${onset === 'akut' ? 'akut (<48 jam)' : 'kronik / tidak tahu'}`, body: onset === 'akut' ? 'Risiko ODS rendah; bahaya utama edema serebri.' : 'Otak sudah beradaptasi → batasi kecepatan koreksi (risiko ODS). Jika ragu, perlakukan sebagai kronik.' },
    { title: 'Tentukan status volume & atasi penyebab', body: 'Hipovolemik → NaCl 0.9%; euvolemik/SIADH → restriksi cairan; hipervolemik → restriksi + terapi penyakit dasar. Hentikan obat pemicu (tiazid, SSRI, dll).' },
    { title: 'Pantau & cegah overkoreksi', body: <>Na tiap 4–6 jam (tiap 20 menit saat bolus). Waspadai diuresis air (urin encer banyak) setelah penyebab teratasi → Na melonjak. Bila melewati batas: hentikan hipertonik, D5W ± desmopressin (lihat Rescue Protocol).{odsFactors.has('Hipokalemia') ? ' Koreksi KCl ikut menaikkan Na — hitung dalam target.' : ''}</> },
  ];

  const calcBox = (
    <div className="w-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-5 text-left space-y-3">
      <div className="text-[11px] font-semibold text-blue-700/80 dark:text-blue-400/80">Koreksi lambat NaCl 3% — untuk mencapai +{fmt(r.d, 1)} mEq/L dalam 24 jam</div>
      <div className="font-mono text-2xl font-bold text-blue-700 dark:text-blue-300">{fmt(Math.min(r.v, r.vAM), 0)} – {fmt(Math.max(r.v, r.vAM), 0)} mL / 24 jam</div>
      <div className="grid grid-cols-2 gap-2 text-[12px]">
        <div className="bg-white/60 dark:bg-black/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800/50">
          <div className="font-bold text-blue-800 dark:text-blue-300">Metode defisit</div>
          <div className="font-mono">{fmt(r.v, 0)} mL · {fmt(r.rate, 1)} mL/jam</div>
          <div className="text-[11px] italic opacity-70">batas bawah</div>
        </div>
        <div className="bg-white/60 dark:bg-black/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800/50">
          <div className="font-bold text-blue-800 dark:text-blue-300">Adrogué–Madías</div>
          <div className="font-mono">{fmt(r.vAM, 0)} mL · {fmt(r.rateAM, 1)} mL/jam</div>
          <div className="text-[11px] italic opacity-70">memperhitungkan dilusi</div>
        </div>
      </div>
      <p className="text-[12px] text-blue-900 dark:text-blue-200">Batas laju absolut <strong>{fmt(r.rateMax, 1)} mL/jam</strong>. Mulai dari estimasi lebih rendah, titrasi dengan Na serial tiap 4–6 jam; vena sentral bila memungkinkan.</p>
      <CalcSteps tone="blue" title="🧮 Rincian volume & laju" steps={give} footer="Kedua rumus estimasi awal — respons nyata dipengaruhi output urin (diuresis air) dan penyebab hiponatremia." />
    </div>
  );

  return (
    <div className="space-y-4">
      <TonicityBanner o={o} na={na} />
      {/* ① HASIL DASAR */}
      <div className="w-full bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-900/30 rounded-2xl p-5 text-left">
        <div className="text-[12px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 mb-1">① Hasil Dasar · Hiponatremia biokimia {r.bioClass} · gejala {naSeverity} · Na {fmt(r.calcN, 1)} → {fmt(r.tgt, 1)} (24 jam)</div>
        {r.hasHyper && <p className="text-[11px] text-cyan-800 dark:text-cyan-300 mb-1">Na terukur {na} → terkoreksi glukosa {fmt(r.calcN, 1)} mEq/L.</p>}
        <div className="font-mono text-2xl font-bold text-cyan-700 dark:text-cyan-300">Defisit Na: {fmt(r.deficit, 0)} mEq</div>
        <p className="text-[12px] text-cyan-800/80 dark:text-cyan-300/80">= TBW {fmt(r.tbw, 1)} L × ΔNa +{fmt(r.d, 1)} mEq/L (target 24 jam)</p>
        {!isNaN(o.effective) && <p className="text-[12px] text-cyan-800 dark:text-cyan-300 mt-1">Osm efektif {fmt(o.effective, 1)}{!isNaN(o.total) ? ` · total ${fmt(o.total, 1)}` : ''}{o.hasMeasured ? ` · terukur ${o.measuredOsm}` : ''} mOsm/kg</p>}
        <div className="grid grid-cols-3 gap-2 mt-3 text-[12px]">
          <div className="bg-white/60 dark:bg-black/20 rounded-lg p-2 border border-cyan-200 dark:border-cyan-800/50">
            <div className="text-cyan-700 dark:text-cyan-400 font-semibold">TBW</div>
            <div className="font-mono font-bold text-[14px] text-slate-800 dark:text-slate-100">{fmt(r.tbw, 1)} L</div>
            <div className="text-[11px] opacity-80">{r.tbwF} × {r.w} kg</div>
          </div>
          <div className="bg-white/60 dark:bg-black/20 rounded-lg p-2 border border-cyan-300 dark:border-cyan-700">
            <div className="text-cyan-700 dark:text-cyan-400 font-semibold">Batas 24 jam</div>
            <div className="font-mono font-bold text-[14px] text-slate-800 dark:text-slate-100">≤{r.lim.limit24} mEq/L</div>
            <div className="text-[11px] opacity-80">lalu ≤{r.lim.limitNext24}/24 jam</div>
          </div>
          <div className="bg-white/60 dark:bg-black/20 rounded-lg p-2 border border-cyan-200 dark:border-cyan-800/50">
            <div className="text-cyan-700 dark:text-cyan-400 font-semibold">Defisit ke 140</div>
            <div className="font-mono font-bold text-[14px] text-slate-800 dark:text-slate-100">{fmt(r.totalDeficit, 0)} mEq</div>
            <div className="text-[11px] opacity-80">konteks · ≥{r.daysTo140} hari</div>
          </div>
        </div>
        {r.riseOverLimit && <p className="mt-2 text-[12px] font-bold text-red-700 dark:text-red-400">⚠ Target +{r.rise} melebihi batas {r.lim.limit24} mEq/L/24 jam{r.highOdsRisk ? ' untuk pasien risiko ODS tinggi' : ''} — turunkan target.</p>}
        {!r.riseOverLimit && r.riseOverGoal && <p className="mt-2 text-[12px] text-amber-700 dark:text-amber-400">Target di atas anjuran {r.lim.goalLo}–{r.lim.goalHi} mEq/L; masih di bawah batas, tetapi sisakan ruang untuk kenaikan tak terduga (diuresis air).</p>}
      </div>

      {r.highOdsRisk && (
        <InfoBox tone="red" title={<span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Risiko tinggi ODS ({[r.odsAuto ? 'Na ≤105' : null, ...odsFactors].filter(Boolean).join(', ')})</span>}>
          Batasi kenaikan Na ≤8 mEq/L / 24 jam; target dianjurkan {r.lim.goalLo}–{r.lim.goalHi}. <span className="italic opacity-80">📚 Sterns RH. NEJM 2015 · Verbalis JG. Am J Med 2013</span>
        </InfoBox>
      )}

      <CalcSteps tone="blue" title="🧮 Langkah Dasar — dari input ke defisit Na" steps={basic} />

      {/* ② CARA PEMBERIAN */}
      <div className="text-[13px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 pt-2">② Cara Pemberian — ditentukan GEJALA{tonicityOk ? '' : ' (TUNDA sampai tonisitas jelas)'}</div>

      {naSeverity === 'berat' && (
        <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-left">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold mb-2"><AlertTriangle className="w-5 h-5" /> GEJALA BERAT — BOLUS NaCl 3% SEGERA</div>
          <ul className="list-disc pl-4 space-y-1 font-medium text-[13px] text-red-800 dark:text-red-300 bg-red-100/50 dark:bg-red-900/40 p-3 rounded-lg border border-red-200 dark:border-red-800/60">
            <li><strong>Bolus NaCl 3%: 150 mL IV dalam 20 menit</strong> (alternatif 100 mL/10 menit).</li>
            <li>Cek Na ulang tiap 20 menit; ulangi bolus hingga 2–3× sampai gejala membaik atau Na naik ~5 mEq/L.</li>
            <li>Target jam pertama: <strong>+4–6 mEq/L</strong> untuk menghentikan krisis serebral — <strong>bukan</strong> menormalkan Na.</li>
            <li>Setelah krisis reda: STOP hipertonik. Total kenaikan <strong>≤ {r.lim.limit24} mEq/L / 24 jam</strong>.</li>
          </ul>
          <p className="mt-2 text-[11px] italic text-red-700/80 dark:text-red-300/80">📚 Spasovski G. NDT 2014;29(Suppl 2):i1 · Sterns RH. NEJM 2015;372:55</p>
        </div>
      )}
      {naSeverity === 'sedang' && (
        <div className="w-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-left">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold mb-2"><AlertTriangle className="w-5 h-5" /> GEJALA SEDANG — INFUS TUNGGAL NaCl 3%</div>
          <ul className="list-disc pl-4 space-y-1 font-medium text-[13px] text-amber-800 dark:text-amber-300 bg-amber-100/40 dark:bg-amber-900/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800/60">
            <li><strong>Infus tunggal NaCl 3% 150 mL dalam 20 menit</strong>, lalu cek Na ulang & re-evaluasi.</li>
            <li>Target kenaikan {r.lim.goalLo}–{r.lim.goalHi} mEq/L / 24 jam; batas <strong>≤ {r.lim.limit24} mEq/L / 24 jam</strong>.</li>
            <li>Cari & atasi penyebab bersamaan (obat pemicu, SIADH, status volume).</li>
          </ul>
          <p className="mt-2 text-[11px] italic text-amber-700/80 dark:text-amber-300/80">📚 Spasovski G. NDT 2014;29(Suppl 2):i1</p>
        </div>
      )}
      {naSeverity === 'ringan' && (
        <div className="w-full bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 text-left">
          <div className="flex items-start gap-2 text-emerald-800 dark:text-emerald-300 text-[13px]">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block mb-1">Ringan / asimtomatik — NaCl 3% TIDAK rutin diindikasikan</strong>
              <p className="leading-relaxed mb-2">Prioritas: <strong>cari & atasi penyebab</strong>, hentikan obat/cairan hipotonik pemicu. Pilih terapi sesuai status volume:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>Hipovolemik</strong> → NaCl 0.9% (isotonik) + atasi sumber kehilangan.</li>
                <li><strong>Euvolemik / SIADH</strong> → restriksi cairan (mis. &lt;800–1000 mL/hari).</li>
                <li><strong>Hipervolemik</strong> (gagal jantung/sirosis) → restriksi cairan + terapi penyakit dasar.</li>
              </ul>
              <p className="mt-2 leading-relaxed"><strong>Pengecualian:</strong> bila penurunan <strong>akut</strong> terdokumentasi &gt;10 mEq/L meski gejala ringan, pertimbangkan infus tunggal 150 mL 3%.</p>
              {r.isProfound && <p className="mt-2 text-[12px] font-semibold text-emerald-900 dark:text-emerald-200">Na &lt;125 (profound): tetap perlu evaluasi & mungkin koreksi lambat hati-hati — pertimbangkan konsul.</p>}
              <p className="mt-2 text-[11px] italic opacity-80">📚 Spasovski G. NDT 2014;29(Suppl 2):i1 · Verbalis JG. Am J Med 2013;126:S1</p>
            </div>
          </div>
        </div>
      )}

      {naSeverity === 'ringan'
        ? <Accordion title="🧮 Estimasi koreksi lambat NaCl 3% (buka bila koreksi aktif diputuskan)">{calcBox}</Accordion>
        : calcBox}

      <Accordion title="⚠ Rescue Protocol (Overcorrection)">
        <div className="text-[12px] text-slate-700 dark:text-slate-300 space-y-2">
          <p>Jika Na naik &gt; 8-10 mEq/L dalam 24 jam (risiko ODS tinggi):</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li><strong>STOP</strong> semua cairan saline hipertonik (NaCl 3%).</li>
            <li><strong>Konsul ICU/Nefrologi segera.</strong></li>
            <li><strong>DDAVP (Desmopressin):</strong> 2–4 &mu;g SC/IV tiap 6–8 jam (menghentikan water loss ginjal).</li>
            <li><strong>D5W (Dekstrosa 5%):</strong> infus lambat (3 mL/kg/jam) untuk "re-lower" Na.</li>
            <li>Target: Na absolut tidak melebihi (Na Awal + 8) mEq/L dalam 24 jam pertama.</li>
          </ol>
          <p className="pt-2 text-[11px] italic opacity-80 border-t border-slate-200 dark:border-slate-700 mt-2">📚 Verbalis JG et al. Am J Med 2013;126:S1-42</p>
        </div>
      </Accordion>

      <StrategyFlow steps={flow} />
      <RefLine>Spasovski G. NDT 2014;29(Suppl 2):i1 · Verbalis JG. Am J Med 2013;126:S1 · Adrogué HJ, Madias NE. NEJM 2000;342:1581 · Sterns RH. NEJM 2015;372:55 · Adrogué HJ, Tucker BM, Madias NE. JAMA 2022;328:280</RefLine>
      <Disclaimer />
      <SaveToHistoryButton module="elektrolit" label="Koreksi Elektrolit — NA" className="w-full" inputs={saveInputs}
        summary={`Na: ${na} mEq/L — target +${fmt(r.d, 1)}/24 jam → ${fmt(r.tgt, 1)}; defisit Na ${fmt(r.deficit, 0)} mEq (total ke 140: ${fmt(r.totalDeficit, 0)}); NaCl 3% ${fmt(r.v, 0)}–${fmt(r.vAM, 0)} mL (gejala ${naSeverity})`} />
    </div>
  );
}

function HyperNa({ r, na, glu, ureum, ureaUnit, sex, age, onset, saveInputs }: Props & { r: Extract<NaResult, { type: 'hiper' }> }) {
  const basic: CalcStep[] = [];
  if (r.hasHyper) basic.push(glucoseStep(r, na, glu));
  if (!isNaN(r.osm.effective)) basic.push({ ...osmStep(r.osm, na, glu, ureum, ureaUnit), label: 'Langkah 0b — Osmolalitas serum:', note: 'Hipernatremia selalu berarti hipertonisitas (defisit air relatif). Osmolalitas di sini sebagai gambaran beratnya.' });
  basic.push(
    tbwStep(r, sex, age),
    { label: 'Langkah 2 — Defisit air bebas:', formula: `Defisit = TBW × (Na ÷ Na target − 1)\n= ${fmt(r.tbw, 1)} × (${fmt(r.calcN, 1)} ÷ ${r.targetNa} − 1) = ${fmt(r.deficit, 2)} L`, note: 'Air yang hilang relatif terhadap Na. Belum termasuk IWL & kehilangan yang berlanjut.' },
    { label: 'Langkah 3 — Batas penurunan & target hari ini:', formula: `ΔNa total = ${fmt(r.calcN, 1)} − ${r.targetNa} = ${fmt(r.totalDrop, 1)} mEq/L\nBatas ${r.maxDropPer24} mEq/L/24 jam (${fmt(r.maxDropPer24 / 24, 2)}/jam) → hari ini turunkan ${fmt(r.targetDrop, 1)} mEq/L\nTotal ±${r.days} hari`, note: onset === 'akut' ? 'Onset akut (<48 jam) boleh ~1 mEq/L/jam.' : 'Kronik/tidak tahu ≤10 mEq/L/24 jam (~0.5/jam) — mencegah edema serebri. Jika ragu onset → perlakukan sebagai kronik.' },
  );

  const give: CalcStep[] = [
    { label: 'Langkah P1 — Efek 1 L cairan (Adrogué–Madías):', formula: `ΔNa/L = (Na infusat − Na serum) ÷ (TBW + 1)\n= (${r.fluid.na} − ${fmt(r.calcN, 1)}) ÷ (${fmt(r.tbw, 1)} + 1) = ${fmt(r.dNaPerL, 2)} mEq/L per L` },
  ];
  if (r.lowersNa && r.volForTarget !== null && r.rateMlHr !== null) {
    give.push({ label: 'Langkah P2 — Volume & laju hari ini:', formula: `Volume = target hari ini ÷ |ΔNa/L| = ${fmt(r.targetDrop, 1)} ÷ ${fmt(Math.abs(r.dNaPerL), 2)} = ${fmt(r.volForTarget, 2)} L\nLaju = ${fmt(r.volForTarget * 1000, 0)} ÷ 24 = ${fmt(r.rateMlHr, 0)} mL/jam`, note: 'Tambahkan IWL (~30–40 mL/jam) & kehilangan berlanjut pada laju total.' });
  }

  const flow: FlowStep[] = [
    { title: 'Klasifikasi status volume & penyebab', body: 'Hipovolemik (GI, diuretik, diuresis osmotik) · euvolemik (Diabetes Insipidus, insensible loss) · hipervolemik (iatrogenik NaHCO₃/hipertonik). Osmolalitas urin membantu.' },
    { title: 'Syok / hipovolemia berat? → NaCl 0.9% dulu', body: 'Stabilkan hemodinamik dengan isotonik, baru ganti ke air bebas.' },
    { title: `Hitung dasar: defisit air ${fmt(r.deficit, 2)} L, hari ini −${fmt(r.targetDrop, 1)} mEq/L`, body: 'Lihat ① Hasil Dasar.', state: 'now' },
    { title: `Pilih cairan: ${r.fluid.label}`, body: <>{r.rateMlHr !== null ? `±${fmt(r.rateMlHr, 0)} mL/jam` : 'Cairan ini tidak menurunkan Na — pilih cairan hipotonik'}. Air oral/NGT &gt; D5W &gt; NaCl 0.45%.{r.dropOverGuideline ? ' ⚠ Batas melebihi pedoman kronik (≤10).' : ''}</>, state: 'now' },
    { title: 'Tambahkan IWL & kehilangan berlanjut', body: 'IWL ±30–40 mL/jam + urin encer (DI) + GI loss — tambahkan pada laju total, bukan bagian dari defisit.' },
    { title: 'Pantau Na tiap 2–4 jam & hitung ULANG', body: 'Atasi penyebab: DI sentral → desmopressin; nefrogenik → tiazid + NSAID. Waspadai edema serebri bila penurunan terlalu cepat.' },
  ];

  return (
    <div className="space-y-4">
      {/* ① HASIL DASAR */}
      <div className="w-full bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-5 text-left">
        <div className="text-[12px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-1">① Hasil Dasar · Hipernatremia {onset === 'akut' ? '(akut)' : '(kronik / tidak tahu)'} · Na {fmt(r.calcN, 1)} → {r.targetNa}</div>
        {r.hasHyper && <p className="text-[11px] text-red-800 dark:text-red-300 mb-1">Na terukur {na} → terkoreksi glukosa {fmt(r.calcN, 1)} mEq/L.</p>}
        <div className="font-mono text-2xl font-bold text-red-700 dark:text-red-300">Defisit air bebas: {fmt(r.deficit, 2)} L</div>
        <p className="text-[12px] text-red-800/80 dark:text-red-300/80">= TBW {fmt(r.tbw, 1)} L × ({fmt(r.calcN, 1)} ÷ {r.targetNa} − 1)</p>
        <div className="grid grid-cols-3 gap-2 mt-3 text-[12px]">
          <div className="bg-white/60 dark:bg-black/20 rounded-lg p-2 border border-red-200 dark:border-red-800/50">
            <div className="text-red-700 dark:text-red-400 font-semibold">TBW</div>
            <div className="font-mono font-bold text-[14px] text-slate-800 dark:text-slate-100">{fmt(r.tbw, 1)} L</div>
            <div className="text-[11px] opacity-80">{r.tbwF} × {r.w} kg</div>
          </div>
          <div className="bg-white/60 dark:bg-black/20 rounded-lg p-2 border border-red-300 dark:border-red-700">
            <div className="text-red-700 dark:text-red-400 font-semibold">Hari ini</div>
            <div className="font-mono font-bold text-[14px] text-slate-800 dark:text-slate-100">−{fmt(r.targetDrop, 1)} mEq/L</div>
            <div className="text-[11px] opacity-80">batas {r.maxDropPer24}/24 jam</div>
          </div>
          <div className="bg-white/60 dark:bg-black/20 rounded-lg p-2 border border-red-200 dark:border-red-800/50">
            <div className="text-red-700 dark:text-red-400 font-semibold">ΔNa total</div>
            <div className="font-mono font-bold text-[14px] text-slate-800 dark:text-slate-100">{fmt(r.totalDrop, 1)} mEq/L</div>
            <div className="text-[11px] opacity-80">±{r.days} hari</div>
          </div>
        </div>
        {r.dropOverGuideline && <p className="mt-2 text-[12px] font-bold text-red-700 dark:text-red-400">⚠ Melebihi batas pedoman hipernatremia kronik (≤10 mEq/L/24 jam). Bukti observasional terbaru belum konsisten (Chauhan 2019: koreksi cepat tidak terkait edema serebri; Chacon-Palma 2025: koreksi lambat terkait mortalitas lebih rendah) — ikuti pedoman kecuali ada alasan kuat.</p>}
      </div>

      <CalcSteps tone="red" title="🧮 Langkah Dasar — dari input ke defisit air" steps={basic} />

      {/* ② CARA PEMBERIAN */}
      <div className="text-[13px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 pt-2">② Cara Pemberian</div>
      <div className="w-full bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-left space-y-3">
        <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Cairan: {r.fluid.label} ({r.fluid.na} mEq/L)</div>
        {r.lowersNa && r.volForTarget !== null && r.rateMlHr !== null ? (
          <>
            <div className="font-mono text-2xl font-bold text-slate-800 dark:text-slate-100">{fmt(r.volForTarget, 2)} L / 24 jam ≈ {fmt(r.rateMlHr, 0)} mL/jam</div>
            <p className="text-[12px] text-slate-700 dark:text-slate-300">1 L menurunkan Na {fmt(Math.abs(r.dNaPerL), 2)} mEq/L · + IWL (~30–40 mL/jam) & kehilangan berlanjut. {r.fluid.note}</p>
          </>
        ) : (
          <InfoBox tone="amber"><strong>NaCl 0.9% tidak menurunkan Na</strong> pada Na &lt; 154 (ΔNa/L = +{fmt(r.dNaPerL, 2)}). Gunakan hanya untuk resusitasi hipovolemia sampai stabil, lalu ganti ke air bebas (D5W/oral/0.45%).</InfoBox>
        )}
        <CalcSteps tone="slate" title="🧮 Rincian cairan" steps={give} footer="Estimasi awal (sistem tertutup). Cek Na tiap 2–4 jam & hitung ULANG dengan Na terbaru." />
      </div>

      <Accordion title="🔎 Klasifikasi Status Volume & Penyebab">
        <div className="text-[12px] space-y-2 text-slate-700 dark:text-slate-300">
          <p><strong>Hipovolemik</strong> (defisit air &gt; Na): GI losses, diuretik, luka bakar, diuresis osmotik (DKA/HHS, manitol) → NaCl 0.9% dulu bila syok, lalu air bebas.</p>
          <p><strong>Euvolemik:</strong> Diabetes Insipidus (sentral: defisit ADH → <em>desmopressin</em>; nefrogenik: ginjal tak respons ADH → <em>tiazid + NSAID</em>), insensible losses.</p>
          <p><strong>Hipervolemik</strong> (biasanya iatrogenik): NaHCO₃ hipertonik, NaCl 3%/HTS, resusitasi tinggi Na → hentikan sumber, ± diuretik.</p>
          <p className="pt-1 border-t border-slate-200 dark:border-slate-700"><strong>Evaluasi osmolalitas urin:</strong> &lt;300 mOsm/kg → curiga DI (uji desmopressin bedakan sentral vs nefrogenik); &gt;800 → kehilangan ekstrarenal; 300–800 → kehilangan renal parsial.</p>
        </div>
      </Accordion>
      <Accordion title="⚠ Interaksi dengan Oliguria / AKI">
        <div className="text-[12px] space-y-2 text-slate-700 dark:text-slate-300">
          <p>Volume koreksi bisa besar (liter/24 jam). Bila UOP tidak mengimbangi (khususnya AKI intrinsik/ATN), risiko <strong>volume overload</strong> nyata.</p>
          <p>Bedakan: <strong>pre-renal</strong> (butuh cairan, jangan dibatasi) · <strong>intrinsik</strong> (rencana volume dikompromikan dengan balans) · <strong>post-renal</strong> (atasi obstruksi).</p>
          <p>Pada AKI oliguria dengan kebutuhan koreksi Na signifikan, <strong>CRRT</strong> dapat menangani volume + kecepatan koreksi Na sekaligus.</p>
        </div>
      </Accordion>
      <InfoBox title="Monitoring">Na serum tiap <strong>2–4 jam</strong> selama koreksi aktif · hitung ulang defisit berkala · awasi tanda edema serebri (nyeri kepala, mual, penurunan kesadaran, kejang) bila kecepatan terlampaui.</InfoBox>

      <StrategyFlow steps={flow} />
      <RefLine>Adrogué HJ, Madias NE. NEJM 2000;342:1493 · Sterns RH. NEJM 2015;372:55 · Miller NE, et al. Am Fam Physician 2023;108:476</RefLine>
      <Disclaimer />
      <SaveToHistoryButton module="elektrolit" label="Koreksi Elektrolit — NA" className="w-full" inputs={saveInputs}
        summary={`Na: ${na} mEq/L — defisit air ${fmt(r.deficit, 2)} L menuju ${r.targetNa}; hari ini −${fmt(r.targetDrop, 1)} mEq/L (${r.fluid.label}${r.rateMlHr !== null ? ` ±${fmt(r.rateMlHr, 0)} mL/jam` : ''})`} />
    </div>
  );
}
