import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { CalcSteps, type CalcStep } from '../../../components/ui/CalcSteps';
import { Accordion } from '../../../components/ui/Accordion';
import { SaveToHistoryButton } from '../../../components/ui/SaveToHistoryButton';
import {
  hypoKSeverity, kDeficitRange, kclEmpiricPlan, kProtocol24h, kAtNormalPh, hyperKSeverity, K_RISE_PER_20_MEQ, glucoseMgdlToMmol,
} from '../../../utils/electrolytes';
import { FieldRow, TargetField, ToggleList, useToggleSet, StrategyFlow, InfoBox, RefLine, Disclaimer, selectCls, fmt, type FlowStep, type FlowState } from './ElektroUI';

const K_HYPO_CTX = ['Perubahan EKG / aritmia', 'Gejala (lemah otot, paralisis, ileus)', 'Tidak bisa oral (muntah/NPO)', 'Gangguan ginjal berat / dialisis', 'Mendapat digoksin'];
const K_HYPER_CTX = ['Perubahan EKG (QRS lebar, bradikardia, ritme junctional, T tinggi)', 'Gangguan ginjal berat (AKI / CKD 4–5)', 'Curiga pseudohiperkalemia (hemolisis / hanya dari VBG)'];

const K_TARGETS = [
  { value: '3.5', label: 'Batas bawah normal', note: 'Rentang normal K serum 3.5–5.0 mEq/L (Kardalas 2018).' },
  { value: '3.6', label: 'Pasca-CABG', note: 'TIGHT-K (JAMA 2024, n=1690): suplementasi hanya bila K <3.6 non-inferior dibanding mempertahankan ≥4.5 untuk mencegah AF pasca-CABG — tanpa beda aritmia lain maupun mortalitas.' },
  { value: '4.0', label: 'Umum · IMA', note: 'IMA: mortalitas terendah pada K 3.5–<4.5; pada 4.5–<5.0 mortalitas ±2× (Goyal, JAMA 2012). Target 4.0 berada di tengah rentang aman.' },
];

const K_FACTOR_OPTIONS = [
  { value: '0.4', label: 'Lazim dipakai', note: 'Faktor 0.4 dipakai di materi kasus NEJM 2015 (Gumz et al.) dan kalkulator GlobalRPh. Sumber yang sama mengingatkan: ±98% K ada di dalam sel, jadi rumus ini bisa under- maupun overestimasi dan tidak menghitung kehilangan yang berlanjut.' },
  { value: '0.3', label: 'Protokol lokal', note: 'Sebagian protokol memakai 0.3 (sumber primer tidak ditemukan). Selisih 0.3 vs 0.4 pada 70 kg hanya 7 mEq per 1 mEq/L — kecil dibanding rumatan harian.' },
];
const K_MAINT_OPTIONS = [
  { value: '1', label: 'NICE CG174', note: 'Rumatan ±1 mmol/kg/hari bila kebutuhan dipenuhi dari cairan IV (NICE CG174). Obesitas → pakai BB ideal. Pedoman ini tidak mencakup penyakit ginjal/hati berat.' },
  { value: '0', label: 'Sudah makan / nutrisi ber-K', note: 'Pasien makan atau mendapat nutrisi enteral/parenteral berisi K: rumatan sudah terpenuhi — hitung defisit saja.' },
];

export function useKaliumState() {
  const [target, setTarget] = useState('4.0');
  const [access, setAccess] = useState<'perifer' | 'sentral'>('perifer');
  const [ctx, toggleCtx] = useToggleSet();
  const [factor, setFactor] = useState('0.4'); // protokol 24 jam: faktor defisit × BB
  const [maint, setMaint] = useState('1');     // protokol 24 jam: rumatan mEq/kg/hari
  return { target, setTarget, access, setAccess, ctx, toggleCtx, factor, setFactor, maint, setMaint };
}
export type KaliumState = ReturnType<typeof useKaliumState>;

/** Baris input tambahan tab Kalium (ditampilkan sesuai nilai K: hipo atau hiper). */
export function KaliumInputs({ s, k }: { s: KaliumState; k: string }) {
  const kv = parseFloat(k);
  if (isNaN(kv)) return null;
  if (kv < 3.5) {
    return (
      <>
        <TargetField label="Target K" sub="ketik atau pilih rujukan" value={s.target} onChange={s.setTarget} unit="mEq/L" step="0.1" options={K_TARGETS} />
        <FieldRow label="Akses IV">
          <select className={selectCls} value={s.access} onChange={e => s.setAccess(e.target.value as 'perifer' | 'sentral')}>
            <option value="perifer">Vena perifer</option>
            <option value="sentral">Vena sentral (CVC)</option>
          </select>
        </FieldRow>
        <ToggleList title="Konteks Klinis" hint="Menentukan rute (oral vs IV) dan tingkat kehati-hatian." items={K_HYPO_CTX} selected={s.ctx} onToggle={s.toggleCtx} tone="amber" />
        <TargetField label="Faktor defisit" sub="protokol 24 jam: faktor × ΔK × BB" value={s.factor} onChange={s.setFactor} unit="× BB" step="0.05" options={K_FACTOR_OPTIONS} />
        <TargetField label="Rumatan K" sub="protokol 24 jam, per hari" value={s.maint} onChange={s.setMaint} unit="mEq/kg" step="0.1" options={K_MAINT_OPTIONS} />
      </>
    );
  }
  if (kv > 5.0) {
    return <ToggleList title="Konteks Klinis" hint="Perubahan EKG menentukan perlu-tidaknya Ca IV; fungsi ginjal menentukan dosis insulin." items={K_HYPER_CTX} selected={s.ctx} onToggle={s.toggleCtx} tone="red" />;
  }
  return null;
}

export function KaliumResult({ s, k, ph, gds, bw }: { s: KaliumState; k: string; ph: string; gds: string; bw: string }) {
  const kv = parseFloat(k);
  const pv = parseFloat(ph);
  const w = parseFloat(bw);
  if (!(kv > 0)) return null;
  const hasPh = pv > 6.5 && pv < 8;
  const kNorm = hasPh ? kAtNormalPh(kv, pv) : NaN;

  const saveInputs = { k, ph, gds, bw, target: s.target, access: s.access, konteks: [...s.ctx], faktorDefisit: s.factor, rumatanPerKg: s.maint };

  if (kv >= 3.5 && kv <= 5.0) {
    return (
      <div className="space-y-3">
        <InfoBox tone="emerald" title="✅ K dalam rentang normal (3.5–5.0 mEq/L)">
          Tidak perlu koreksi. Pasca-CABG, suplementasi rutin untuk mengejar K ≥4.5 tidak bermanfaat (TIGHT-K 2024).
        </InfoBox>
        <SaveToHistoryButton module="elektrolit" label="Koreksi Elektrolit — K" className="w-full" inputs={saveInputs} summary={`K: ${k} mEq/L — normal`} />
      </div>
    );
  }

  return kv < 3.5
    ? <HypoK s={s} kv={kv} pv={pv} hasPh={hasPh} kNorm={kNorm} w={w} saveInputs={saveInputs} />
    : <HyperK s={s} kv={kv} pv={pv} hasPh={hasPh} kNorm={kNorm} gds={gds} saveInputs={saveInputs} />;
}

function HypoK({ s, kv, pv, hasPh, kNorm, w, saveInputs }: { s: KaliumState; kv: number; pv: number; hasPh: boolean; kNorm: number; w: number; saveInputs: Record<string, unknown> }) {
  const sev = hypoKSeverity(kv);
  const ecg = s.ctx.has(K_HYPO_CTX[0]);
  const symp = s.ctx.has(K_HYPO_CTX[1]);
  const noOral = s.ctx.has(K_HYPO_CTX[2]);
  const renal = s.ctx.has(K_HYPO_CTX[3]);
  const digoxin = s.ctx.has(K_HYPO_CTX[4]);

  const tParsed = parseFloat(s.target);
  const tgt = tParsed >= 3 && tParsed <= 5.5 ? tParsed : 4.0;
  const targetInvalid = !(tParsed >= 3 && tParsed <= 5.5);

  const ivReasons: string[] = [];
  if (sev === 'berat') ivReasons.push('K <2.5');
  if (ecg) ivReasons.push('perubahan EKG/aritmia');
  if (symp) ivReasons.push('bergejala');
  if (noOral) ivReasons.push('tidak bisa oral');
  const iv = ivReasons.length > 0;

  const plan = kclEmpiricPlan(kv, tgt);
  const def = kDeficitRange(kv, tgt, w);
  const sessionCap = renal ? 20 : 40;
  const sessionMeq = Math.min(plan.totalMeq, sessionCap);
  const rateMax = s.access === 'sentral' ? 20 : 10;
  const hours = sessionMeq / rateMax;
  const kAfter = kv + (sessionMeq / 20) * K_RISE_PER_20_MEQ;
  const remaining = Math.max(0, plan.totalMeq - sessionMeq);
  const tablets = Math.ceil(sessionMeq / 8);

  // Opsi B — protokol 24 jam (defisit faktor × ΔK × BB + rumatan harian)
  const fParsed = parseFloat(s.factor);
  const factor = fParsed > 0 && fParsed <= 1 ? fParsed : 0.4;
  const mParsed = parseFloat(s.maint);
  const maintPerKg = mParsed >= 0 && mParsed <= 3 ? mParsed : 1;
  const proto = w > 0 ? kProtocol24h(kv, tgt, w, factor, maintPerKg) : null;
  const protoTooSlow = sev === 'berat' || ecg || symp;

  const steps: CalcStep[] = [];
  if (hasPh) {
    steps.push({
      label: 'Langkah 0 — Pengaruh pH terhadap K (pergeseran transseluler):',
      formula: `K pada pH 7.40 ≈ K − ((7.40 − pH) ÷ 0.1) × 0.6\n= ${kv} − ((7.40 − ${pv}) ÷ 0.1) × 0.6 = ${fmt(kNorm, 2)} mEq/L`,
      note: pv < 7.35
        ? 'Asidosis: K serum "tertolong" oleh perpindahan K keluar sel — defisit sebenarnya LEBIH besar, dan K akan turun lagi saat asidosis dikoreksi.'
        : pv > 7.45 ? 'Alkalosis memindahkan K ke dalam sel; koreksi alkalosis akan ikut menaikkan K.' : 'pH normal — pergeseran transseluler minimal.',
    });
  }
  steps.push(
    { label: 'Langkah 1 — Selisih ke target:', formula: `ΔK = target − K = ${tgt} − ${kv} = ${fmt(plan.delta, 2)} mEq/L` },
    {
      label: 'Langkah 2 — Gambaran defisit K total tubuh:',
      formula: `Defisit ≈ ΔK × (200–400 mEq) × (BB ÷ 70)\n= ${fmt(plan.delta, 2)} × (200–400) × (${w > 0 ? w : 70} ÷ 70) = ${fmt(def.lo, 0)}–${fmt(def.hi, 0)} mEq`,
      note: '98% K ada di dalam sel; K serum hanya "jendela kecil". Angka ini menjelaskan mengapa koreksi butuh beberapa sesi — bukan dosis yang diberikan sekaligus (Kardalas 2018).',
    },
    {
      label: 'Langkah 3 — Rencana empiris KCl:',
      formula: `Jumlah infus @20 mEq = ⌈ΔK ÷ 0.25⌉ = ⌈${fmt(plan.delta, 2)} ÷ 0.25⌉ = ${plan.doses20}\nTotal ≈ ${plan.doses20} × 20 = ${plan.totalMeq} mEq`,
      note: 'Pada pasien ICU, tiap 20 mEq KCl IV menaikkan K rata-rata 0.25 mmol/L (Kruse & Carlson 1990). Respons individual bervariasi — selalu cek ulang.',
    },
    {
      label: `Langkah 4 — Sesi 1 (${iv ? 'IV' : 'oral'}):`,
      formula: iv
        ? `Dosis sesi = min(total, ${sessionCap}) = ${sessionMeq} mEq\nLaju maks ${s.access} = ${rateMax} mEq/jam → durasi ≥ ${sessionMeq} ÷ ${rateMax} = ${fmt(hours, 1)} jam\nVolume KCl 7.46% (1 mEq/mL) = ${sessionMeq} mL\nPrediksi K setelah sesi ≈ ${kv} + (${sessionMeq} ÷ 20) × 0.25 = ${fmt(kAfter, 2)} mEq/L`
        : `Dosis sesi = ${sessionMeq} mEq ≈ ${tablets} tablet KSR 600 mg (8 mEq/tablet), dosis terbagi\nPrediksi K ≈ ${fmt(kAfter, 2)} mEq/L (aturan IV, untuk oral hanya kasar)`,
      note: renal ? 'Gangguan ginjal berat: sesi dibatasi 20 mEq — K diganti sangat hati-hati dan libatkan tim renal (Kardalas 2018).' : undefined,
    },
  );

  const flow: FlowStep[] = [
    { title: 'Konfirmasi & rekam EKG', body: <>EKG dianjurkan untuk <strong>semua</strong> pasien hipokalemia (ST depresi, T datar, gelombang U, aritmia).{digoxin && <strong> Pasien digoksin: risiko aritmia lebih tinggi — monitor EKG kontinu.</strong>}</>, state: ecg || digoxin ? 'now' : 'todo' },
    { title: 'Cari & hentikan penyebab', body: 'Diuretik, muntah/NGT, diare, insulin/β-agonis (pergeseran ke sel), alkalosis. Tanpa ini K akan turun lagi.' },
    { title: 'Periksa & koreksi Magnesium', body: '>50% hipokalemia bermakna disertai defisiensi Mg; hipokalemia refrakter tidak akan terkoreksi sebelum Mg dikoreksi (Kardalas 2018). Gunakan tab Magnesium.' },
    { title: `Rute: ${iv ? 'INTRAVENA' : 'ORAL'}`, body: iv ? <>Alasan IV: {ivReasons.join(', ')}. Pada K &lt;2.5 / bergejala: monitor EKG kontinu & K serial.</> : 'K 2.5–3.4 tanpa gejala/EKG & bisa minum: oral cukup dan lebih aman (Kardalas 2018). Minum dengan 100–250 mL air, bersama/setelah makan.', state: 'now' },
    { title: `Beri sesi 1: ${sessionMeq} mEq`, body: iv ? <>KCl dalam <strong>NaCl 0.9%</strong> (bukan dekstrosa — glukosa memicu insulin & menggeser K ke sel). Laju ≤{rateMax} mEq/jam ({s.access}); konsentrasi & volume pelarut ikuti protokol RS.</> : `${tablets} tablet KSR 600 mg dalam dosis terbagi.`, state: 'now' },
    ...(proto ? [{ title: `Alternatif: protokol ${proto.rounded} mEq / 24 jam`, body: <>Defisit ({factor} × ΔK × BB) + rumatan {maintPerKg} mEq/kg/hari, ≈{fmt(proto.ratePerHr, 1)} mEq/jam.{protoTooSlow ? ' Tidak cukup sendirian untuk pasien ini — dahulukan Opsi A.' : ' Sesuai untuk ringan–sedang yang stabil.'}</>, state: (protoTooSlow ? 'skip' : 'todo') as FlowState }] : []),
    { title: 'Cek ulang K → ulangi sampai target', body: remaining > 0 ? <>Sisa perkiraan ±{remaining} mEq ({remaining / 20} × 20 mEq). Cek K sebelum tiap sesi berikutnya — jangan berikan seluruh rencana sekaligus.</> : 'Target kemungkinan tercapai setelah sesi ini — konfirmasi dengan K ulang.' },
    { title: `Pertahankan target ${tgt} mEq/L`, body: 'Atasi penyebab; pertimbangkan diuretik hemat-K bila hipokalemia akibat diuretik dan diuretik tetap diperlukan (Kardalas 2018).' },
  ];

  return (
    <div className="space-y-4">
      {hasPh && pv < 7.35 && (
        <InfoBox tone="red" title={<span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Hipokalemia + asidosis</span>}>
          Koreksi asidosis (mis. NaHCO₃, insulin pada KAD) akan menurunkan K lebih jauh. Koreksi K harus mendahului atau bersamaan.
        </InfoBox>
      )}

      <div className="w-full bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-5 text-left">
        <div className="text-[12px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 mb-1">Hipokalemia {sev} · K {kv} → target {tgt} mEq/L</div>
        {targetInvalid && <p className="text-[11px] text-amber-700 dark:text-amber-400 mb-1">Target di luar 3.0–5.5 — dipakai 4.0.</p>}
        {tgt > 4.5 && <p className="text-[11px] text-amber-700 dark:text-amber-400 mb-1">Target &gt;4.5 tidak terbukti bermanfaat (TIGHT-K 2024) dan pada IMA berkaitan dengan mortalitas lebih tinggi (Goyal 2012).</p>}
        {plan.totalMeq === 0 ? (
          <p className="text-[13px] text-amber-800 dark:text-amber-300">K sudah ≥ target — tidak perlu suplementasi ke target ini.</p>
        ) : (
          <>
            <div className="text-[11px] font-semibold text-amber-700/80 dark:text-amber-400/80">Opsi A — koreksi per sesi (empiris ICU)</div>
            <div className="font-mono text-2xl font-bold text-amber-700 dark:text-amber-400">Sesi 1: {sessionMeq} mEq KCl {iv ? 'IV' : 'oral'}</div>
            <div className="text-[13px] text-amber-800 dark:text-amber-300 mt-1 space-y-0.5">
              {iv && <p>≥ {fmt(hours, 1)} jam via {s.access} (≤{rateMax} mEq/jam) · {sessionMeq} mL KCl 7.46%</p>}
              {!iv && <p>≈ {tablets} tablet KSR 600 mg, terbagi</p>}
              <p>Perkiraan total ke target: <strong>{plan.totalMeq} mEq</strong> ({plan.doses20} × 20 mEq) · defisit tubuh {fmt(def.lo, 0)}–{fmt(def.hi, 0)} mEq</p>
            </div>
          </>
        )}
      </div>

      {proto && (
        <div className="w-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-5 text-left space-y-2">
          <div className="text-[11px] font-semibold text-blue-700/80 dark:text-blue-400/80">Opsi B — protokol 24 jam (defisit + rumatan)</div>
          <div className="font-mono text-2xl font-bold text-blue-700 dark:text-blue-300">KCl {proto.rounded} mEq / 24 jam</div>
          <p className="text-[13px] text-blue-900 dark:text-blue-200">≈ {fmt(proto.ratePerHr, 1)} mEq/jam · {proto.rounded} mL KCl 7.46% · hitungan mentah {fmt(proto.raw, 0)} mEq (defisit {fmt(proto.deficit, 0)} + rumatan {fmt(proto.maint, 0)})</p>
          {protoTooSlow && (
            <InfoBox tone="red" title="⚠ Kemungkinan terlalu lambat untuk pasien ini">
              {sev === 'berat' ? 'K <2.5' : ecg ? 'Perubahan EKG' : 'Bergejala'}: ≈{fmt(proto.ratePerHr, 1)} mEq/jam merata 24 jam. Pedoman menganjurkan KCl IV dengan monitor EKG dan koreksi aktif per sesi (Opsi A) sampai keluar dari zona bahaya, baru lanjut protokol harian (Kardalas 2018).
            </InfoBox>
          )}
          {renal && maintPerKg > 0 && (
            <InfoBox tone="amber" title="Gangguan ginjal berat">Rumatan 1 mEq/kg/hari berasal dari pedoman yang tidak mencakup penyakit ginjal berat (NICE CG174) — pertimbangkan rumatan 0 dan titrasi dengan K serial.</InfoBox>
          )}
          <p className="text-[11px] italic text-blue-800/80 dark:text-blue-300/80">Belum termasuk kehilangan berlanjut (diuretik, diare, NGT, insulin pada KAD) — tambahkan. Obesitas → BB ideal untuk rumatan. Cek K minimal harian; protokol diulang dengan K terbaru.</p>
        </div>
      )}

      {proto && plan.totalMeq > 0 && (
        <CalcSteps tone="blue" title="⚖️ Protokol 24 Jam vs Kalkulator — memahami selisihnya" steps={[
          { label: 'Langkah B1 — Defisit menurut protokol:', formula: `Defisit = faktor × ΔK × BB = ${factor} × ${fmt(proto.delta, 2)} × ${w} = ${fmt(proto.deficit, 1)} mEq`, note: `Faktor ${factor} × BB ≈ ruang ekstrasel; tiap 1 mEq/L hanya dihitung ${fmt(factor * w, 0)} mEq.` },
          { label: 'Langkah B2 — Rumatan harian:', formula: `Rumatan = ${maintPerKg} mEq/kg/hari × ${w} kg = ${fmt(proto.maint, 0)} mEq` },
          { label: 'Langkah B3 — Total & paket protokol:', formula: `Total = ${fmt(proto.deficit, 1)} + ${fmt(proto.maint, 0)} = ${fmt(proto.raw, 1)} mEq → paket ${proto.rounded} mEq/24 jam\nLaju = ${proto.rounded} ÷ 24 = ${fmt(proto.ratePerHr, 2)} mEq/jam`, note: 'Dibulatkan ke kelipatan 50 mEq terdekat (minimal 50) — sesuaikan dengan paket yang tersedia di RS.' },
          { label: 'Langkah B4 — Tiga angka, tiga arti:', formula: `Protokol 24 jam        : ${proto.rounded} mEq dalam 24 jam (≈${fmt(proto.ratePerHr, 1)} mEq/jam)\nEmpiris ICU (Opsi A)   : ${plan.totalMeq} mEq untuk menaikkan K ke ${tgt}, per sesi ≤${rateMax} mEq/jam\nDefisit tubuh total    : ${fmt(def.lo, 0)}–${fmt(def.hi, 0)} mEq (cadangan intrasel, dikejar beberapa hari)`, note: `Protokol menghitung defisit kecil (${fmt(proto.deficit, 0)} mEq) karena hanya "mengisi" ruang ekstrasel, tetapi rumatan membuat totalnya mendekati angka empiris. Bedanya pada KECEPATAN: protokol merata 24 jam, Opsi A cepat per sesi. Untuk ringan–sedang keduanya wajar; untuk K <2.5/EKG berubah, protokol saja terlalu lambat.` },
        ]} footer="Kedua pendekatan sama-sama estimasi — yang menentukan adalah K serial. Data ICU: kenaikan K setelah 20–80 mEq IV sangat bervariasi antar-pasien (rata-rata +0.27 pada hipokalemia ringan, +0.45 pada sedang; Frenkel 2021)." />
      )}

      <StrategyFlow steps={flow} />

      {plan.totalMeq > 0 && (
        <CalcSteps tone="amber" steps={steps} footer="Estimasi awal. Respons nyata dipengaruhi kehilangan yang berlanjut, pergeseran transseluler, Mg, dan fungsi ginjal — titrasi dengan K serial." />
      )}

      <Accordion title="📖 Dasar rujukan hipokalemia">
        <ul className="list-disc pl-4 space-y-1 text-[12px] text-slate-700 dark:text-slate-300">
          <li>Berat/mengancam jiwa: K &lt;2.5; 2.5–3.5 sering cukup oral; &lt;2.5 → IV dengan monitor EKG kontinu & K serial; IV juga bila mual/muntah berat (Kardalas 2018).</li>
          <li>Tiap penurunan 1 mEq/L ≈ defisit 200–400 mEq — bisa meleset ke dua arah (Kardalas 2018).</li>
          <li>495 set infus KCl 20 mEq/100 mL NaCl di ICU: rata-rata +0.25 mmol/L per 20 mEq, laju 20 mEq/jam via vena sentral maupun perifer tanpa aritmia mengancam (Kruse & Carlson 1990). Banyak protokol RS tetap membatasi perifer ≤10 mEq/jam.</li>
          <li>Pelarut NaCl 0.9%, bukan dekstrosa 5% (Kardalas 2018).</li>
          <li><strong>Rumus "faktor × ΔK × BB"</strong> (0.4 lazim; sebagian protokol 0.3) hanya memperkirakan ruang ekstrasel — tidak menggambarkan defisit total & tidak menghitung kehilangan berlanjut (GlobalRPh; materi kasus NEJM 2015). Dipakai sebagai rencana harian yang diulang dengan K serial.</li>
          <li><strong>Rumatan</strong> ±1 mmol/kg/hari K bila kebutuhan dari cairan IV; obesitas → BB ideal; dibulatkan ke sediaan yang tersedia (NICE CG174).</li>
          <li>Respons ICU sangat bervariasi: rata-rata +0.27 (ringan) dan +0.45 mEq/L (sedang) setelah 20–80 mEq IV; kenaikan lebih besar pada kreatinin tinggi (Frenkel 2021, n=683).</li>
        </ul>
      </Accordion>

      <RefLine>Kardalas E. Endocr Connect 2018;7:R135 · Kruse JA, Carlson RW. Arch Intern Med 1990;150:613 · O'Brien B. JAMA 2024;332:979 (TIGHT-K) · Goyal A. JAMA 2012;307:157 · Frenkel A. J Clin Med 2021;10:1986 · NICE CG174 (2013, upd. 2017) · Gumz ML. NEJM 2015;373:60 · Adrogué HJ, Madias NE. Am J Med 1981;71:456</RefLine>
      <Disclaimer />
      <SaveToHistoryButton module="elektrolit" label="Koreksi Elektrolit — K" className="w-full" inputs={saveInputs} summary={`K: ${kv} → target ${tgt} mEq/L — hipokalemia ${sev}; sesi 1 ${sessionMeq} mEq ${iv ? 'IV' : 'oral'} (total ±${plan.totalMeq} mEq)${proto ? `; protokol 24 jam ${proto.rounded} mEq (faktor ${factor}, rumatan ${maintPerKg}/kg)` : ''}`} />
    </div>
  );
}

function HyperK({ s, kv, pv, hasPh, kNorm, gds, saveInputs }: { s: KaliumState; kv: number; pv: number; hasPh: boolean; kNorm: number; gds: string; saveInputs: Record<string, unknown> }) {
  const sev = hyperKSeverity(kv);
  const ecg = s.ctx.has(K_HYPER_CTX[0]);
  const renal = s.ctx.has(K_HYPER_CTX[1]);
  const pseudo = s.ctx.has(K_HYPER_CTX[2]);
  const gv = parseFloat(gds);
  const hasG = gv > 0;
  const gMmol = hasG ? glucoseMgdlToMmol(gv) : NaN;

  const caIndicated = ecg || kv >= 6.5;
  const shiftIndicated = kv >= 6.0;
  const insulinU = renal ? 5 : 10;
  const skipDextroseBolus = hasG && gMmol > 14;
  const needFollowOn = hasG && gMmol < 7;
  const sevLabel = { batas: 'di atas normal (5.0–5.4)', ringan: 'ringan (5.5–5.9)', sedang: 'sedang (6.0–6.4)', berat: 'BERAT (≥6.5)' }[sev];

  const steps: CalcStep[] = [];
  if (hasPh) {
    steps.push({
      label: 'Langkah 0 — Pengaruh pH:',
      formula: `K pada pH 7.40 ≈ ${kv} − ((7.40 − ${pv}) ÷ 0.1) × 0.6 = ${fmt(kNorm, 2)} mEq/L`,
      note: 'Rata-rata kasar (rentang 0.2–1.7 per 0.1 pH), terutama pada asidosis mineral; pada asidosis laktat/keto efeknya kecil (Adrogué & Madias 1981).',
    });
  }
  steps.push({ label: 'Langkah 1 — Klasifikasi:', formula: `K ${kv} → ${sevLabel}${ecg ? ' + perubahan EKG' : ''}`, note: 'EKG 12 sandapan bila K ≥6.0; monitor jantung kontinu bila K ≥6.5 atau EKG abnormal. Hingga separuh pasien hiperkalemia berat EKG-nya normal (Ford 2026).' });
  if (caIndicated) {
    steps.push({ label: 'Langkah 2 — Kalsium IV:', formula: 'Ca glukonat 10% 30 mL = 30 × 0.22 = 6.6 mmol Ca elemental, IV 5–10 menit\n(setara Ca klorida 10% 10 mL = 6.8 mmol — vena sentral/henti jantung)', note: 'Dosis lama 10 mL (2.2 mmol) sering tidak cukup; dapat diulang sekali setelah 10 menit bila EKG belum membaik. Efek 30–60 menit.' });
  }
  if (shiftIndicated) {
    steps.push({
      label: 'Langkah 3 — Insulin + dekstrosa:',
      formula: `Insulin reguler ${insulinU} unit IV${renal ? ' (dosis rendah: gangguan ginjal berat)' : ''}\nDekstrosa 25 g = D50% 50 mL = D40% 62.5 mL\n${hasG ? `GDS ${gv} mg/dL ÷ 18 = ${fmt(gMmol, 1)} mmol/L → ${skipDextroseBolus ? '>14: bolus dekstrosa boleh ditiadakan' : needFollowOn ? '<7: WAJIB lanjut D10% 50 mL/jam × 5 jam (= 250 mL = 25 g)' : '7–14: bolus 25 g saja'}` : 'Isi GDS untuk menentukan perlu-tidaknya infus D10% lanjutan'}\nPerkiraan K setelah insulin ≈ ${kv} − (0.65–1.4) = ${fmt(kv - 1.4, 1)}–${fmt(kv - 0.65, 1)} mEq/L`,
      note: 'Hipoglikemia terjadi hingga 30% (median 2 jam pasca-insulin); prediktor terkuat GDS awal <7 mmol/L (126 mg/dL) (Ford 2026).',
    });
    steps.push({ label: 'Langkah 4 — Salbutamol nebulisasi:', formula: `10–20 mg nebul → K turun 0.53–0.98 mEq/L\nPerkiraan setelah insulin + salbutamol ≈ ${fmt(kv - 1.4 - 0.98, 1)}–${fmt(kv - 0.65 - 0.53, 1)} mEq/L (sinergis, kasar)`, note: 'Onset <30 menit, puncak 90–120 menit. Hingga 40% pasien HD resisten; berkurang dengan β-bloker non-selektif.' });
  }

  const flow: FlowStep[] = [
    { title: 'Verifikasi: hiperkalemia sejati?', body: <>Hemolisis sampel, leukositosis/trombositosis berat → pseudohiperkalemia. K VBG biasanya 0.2–0.3 lebih rendah dari serum lab. Konfirmasi dengan sampel lab kecuali EKG berubah/tidak stabil.{pseudo && <strong> Anda menandai curiga pseudohiperkalemia — ulang sampel sebelum terapi bila pasien stabil & EKG normal.</strong>}</>, state: pseudo ? 'now' : 'todo' },
    { title: 'Lindungi jantung — Ca glukonat 10% 30 mL IV', body: caIndicated ? <>{ecg ? 'Ada perubahan EKG → prioritas pertama.' : 'K ≥6.5 → pertimbangkan meski EKG normal (Geldermann 2026).'} 5–10 menit via vena besar; ulang sekali setelah 10 menit bila EKG persisten.</> : 'Tidak diindikasikan: EKG normal dan K <6.5.', state: caIndicated ? 'now' : 'skip' },
    { title: 'Geser K ke dalam sel', body: shiftIndicated ? <>Insulin {insulinU} U + dekstrosa 25 g{needFollowOn ? ' + D10% 50 mL/jam × 5 jam' : ''}; tambah salbutamol nebul 10–20 mg. NaHCO₃ hanya sebagai tambahan bila ada asidosis metabolik (bukan laktat/keto){hasPh && pv < 7.35 ? ` — pH ${pv}` : ''}.</> : 'K <6.0: umumnya cukup konservatif (atasi penyebab, hentikan obat/asupan K) (Ford 2026).', state: shiftIndicated ? 'now' : 'skip' },
    { title: 'Keluarkan K dari tubuh', body: <>Hentikan obat pemicu (ACEi/ARB, MRA, NSAID, trimetoprim, diuretik hemat-K, suplemen K). Diuretik loop bila overload & ginjal merespons. Binder oral <strong>bukan</strong> terapi akut (onset lambat; polistiren sulfonat tidak dianjurkan). <strong>Dialisis</strong> bila refrakter, ESKD, atau AKI oligurik{renal ? ' — relevan pada pasien ini' : ''}.</>, state: renal ? 'now' : 'todo' },
    { title: 'Pantau & cegah rebound', body: <>K ulang <strong>1–2 jam</strong> (efek terapi), <strong>2–4 jam</strong> (rebound), dan 24 jam. {shiftIndicated && <>GDS tiap <strong>30 menit selama 2 jam, lalu tiap jam ≥6 jam</strong> (reset bila insulin diulang).</>}</> },
    { title: 'Cegah kambuh — target K <5.5', body: 'RAAS-i dapat dilanjutkan kembali bertahap setelah K <5.5 bila manfaatnya (gagal jantung, CKD proteinurik) lebih besar (Ford 2026).' },
  ];

  return (
    <div className="space-y-4">
      <div className={`w-full rounded-2xl p-5 text-left border ${sev === 'berat' || ecg ? 'bg-red-50 dark:bg-red-900/15 border-red-200 dark:border-red-800' : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30'}`}>
        <div className={`text-[12px] font-bold uppercase tracking-wider mb-1 ${sev === 'berat' || ecg ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>Hiperkalemia {sevLabel}{ecg ? ' · EKG berubah' : ''}</div>
        <div className="font-mono text-2xl font-bold text-slate-800 dark:text-slate-100">K {kv} mEq/L</div>
        <p className="text-[12px] text-slate-700 dark:text-slate-300 mt-1">
          {caIndicated ? 'Ca IV → ' : ''}{shiftIndicated ? `insulin ${insulinU} U + dekstrosa 25 g + salbutamol → ` : 'konservatif → '}keluarkan K → pantau K 1–2 j & 2–4 j.
        </p>
      </div>

      <StrategyFlow steps={flow} />
      <CalcSteps tone="red" steps={steps} footer="Insulin & salbutamol hanya MENGGESER K sementara — rebound sering terjadi; rencana pengeluaran K & penanganan penyebab tetap wajib." />

      <Accordion title="⏱ Alternatif ICU — Infus Insulin Kontinu">
        <div className="text-[12px] text-slate-700 dark:text-slate-300 space-y-2">
          <p><strong>Indikasi:</strong> K 5.5-6.5 tanpa perubahan EKG, mempertahankan efek pasca-bolus, hiperK perioperatif.</p>
          <p><strong>Preparasi:</strong> Insulin Regular 50 IU + NaCl 0.9% 48 mL = 1 IU/mL.</p>
          <p><strong>Rate:</strong> 1.5–2 mL/jam (= 1.5–2 IU/jam) selama 6 jam.</p>
          <p><strong>Pairing Glukosa:</strong> D10% 50–100 mL/jam berjalan bersamaan (jika puasa), atau cek GDS ketat tiap 1-2 jam (jika sudah ada asupan).</p>
          <p><strong>Stop:</strong> Jika K &lt;4.5 atau GDS &lt;100 mg/dL.</p>
          <p className="pt-2 text-[11px] italic opacity-80 border-t border-slate-200 dark:border-slate-700 mt-2">📚 Dépret F. Ann Intensive Care 2019;9:32</p>
        </div>
      </Accordion>

      <Accordion title="📖 Dasar rujukan & pembaruan bukti hiperkalemia">
        <ul className="list-disc pl-4 space-y-1 text-[12px] text-slate-700 dark:text-slate-300">
          <li><strong>Ca IV:</strong> standar perawatan, tetapi berbasis konsensus; meta-analisis ILCOR 2025 tidak menemukan bukti kuat manfaat klinis. Mekanismenya kini dipahami sebagai pemulihan kecepatan konduksi (kanal Ca tipe-L), bukan "stabilisasi membran". Dosis terkini 30 mL Ca glukonat 10% (Ford 2026; Jessen 2025).</li>
          <li><strong>Insulin-dekstrosa & salbutamol:</strong> menurunkan K rata-rata 0.7–1.2 mmol/L (Jessen 2025). Pertimbangkan insulin 5 U pada gangguan ginjal berat.</li>
          <li><strong>NaHCO₃:</strong> tidak ada bukti kuat menurunkan K → tidak rutin; hanya tambahan bila asidosis metabolik (Jessen 2025; Ford 2026).</li>
          <li><strong>Klasifikasi</strong> 5.5–5.9 / 6.0–6.4 / ≥6.5 mengikuti pedoman UK Kidney Association; K &lt;6 umumnya ditangani konservatif.</li>
        </ul>
      </Accordion>

      <RefLine>Ford S, et al. Aust Prescr 2026;49:194 · Jessen MK, et al. Resuscitation 2025;208:110489 · Geldermann N, et al. Emerg Med J 2026;43:305 · UK Kidney Association Hyperkalaemia Guideline 2023 · Adrogué HJ, Madias NE. Am J Med 1981;71:456</RefLine>
      <Disclaimer />
      <SaveToHistoryButton module="elektrolit" label="Koreksi Elektrolit — K" className="w-full" inputs={saveInputs} summary={`K: ${kv} mEq/L — hiperkalemia ${sevLabel}${ecg ? ', EKG berubah' : ''}${shiftIndicated ? `; insulin ${insulinU} U + D 25 g` : ''}`} />
    </div>
  );
}
