import { Fragment } from 'react';
import { Accordion } from '../../components/ui/Accordion';
import { AbbrLegend } from '../../components/ui/AbbrLegend';
import { HACOR_TABLE, HACOR_CUTOFF, HACOR_MAX } from '../../utils/hacor';
import { ROX_HIGH_RISK, ROX_LOW_RISK } from '../../utils/oxygenation';

const fmt = (n: number) => n.toLocaleString('id-ID');

export default function TeoriImpending() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 pb-20 overflow-x-hidden">
      <div className="bg-white dark:bg-[var(--dk-surface-1)] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-destructive flex items-center gap-2 mb-2">
          Impending Respiratory Failure — Pengenalan Dini
        </h1>

        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive mb-4 text-[13px]">
          <div className="font-bold text-[14px] mb-2">Definisi & Kriteria Impending Gagal Napas</div>
          <p>Impending respiratory failure adalah kondisi di mana pasien berisiko tinggi mengalami gagal napas dalam waktu dekat jika tidak diintervensi. Tanda-tanda di bawah menandakan otot napas mendekati kelelahan — <strong>nilai ulang dalam hitungan menit, bukan jam</strong>.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <p><strong>Tanda Klinis Utama:</strong></p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>RR &gt;30 x/mnt atau &lt;8 x/mnt</li>
                <li>Penggunaan otot aksesori (SCM, interkostal, subkostal)</li>
                <li>Paradoxal abdominal breathing (diafragma fatigue)</li>
                <li>Retraksi suprasternal dan supraklavikula</li>
                <li>Tripod position, tidak bisa bicara kalimat lengkap</li>
                <li>Sianosis sentral (oksigenasi berat)</li>
              </ul>
            </div>
            <div>
              <p><strong>Tanda Neurologis/Sistemik:</strong></p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Agitasi, kebingungan, penurunan kesadaran</li>
                <li>Diaforesis berat</li>
                <li>Takikardia kompensatorik (HR &gt;120)</li>
                <li>Paradoxal pulse (pulsus paradoksus &gt;10 mmHg) → asma berat</li>
                <li>SpO₂ &lt;90% meski dengan O₂ tinggi</li>
                <li>Pola napas abnormal (Cheyne-Stokes; Kussmaul pada asidosis metabolik berat)</li>
              </ul>
            </div>
          </div>
          <p className="mt-2 text-[12px] opacity-80 text-muted-foreground"><em>Dirangkum dari Roussos & Koutsoukou 2003 dan Tobin 1990 [1, 2].</em></p>
        </div>

        </div>

        <Accordion title="📖 HACOR Score — Prediksi Kegagalan NIV" defaultOpen={true}>
          <p className="mb-2 text-muted-foreground">
            HACOR (Heart rate, Acidosis, Consciousness, Oxygenation, Respiratory rate) dinilai pada pasien hipoksemik yang mendapat NIV. Rentang skor 0–{HACOR_MAX}.
            Skor <strong>&gt;{HACOR_CUTOFF} pada jam ke-1 NIV</strong> memprediksi gagal NIV (sensitivitas 72,6%, spesifisitas 90,2%; <strong>AUC 0,88</strong> pada kohort uji) [3].
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Parameter</th><th className="p-2">Nilai</th><th className="p-2">Poin</th>
                </tr>
              </thead>
              <tbody>
                {HACOR_TABLE.map((param) => (
                  <Fragment key={param.key}>
                    {param.bands.map((band, i) => (
                      <tr key={band.range} className="border-b border-border text-foreground">
                        {i === 0 && <td rowSpan={param.bands.length} className="p-2 align-top border-b border-border">{param.label}</td>}
                        <td className="p-2">{band.range}</td>
                        <td className={`p-2 font-bold ${band.points === 0 ? '' : band.points <= 2 ? 'text-amber-600 dark:text-amber-400' : 'text-destructive'}`}>{band.points}</td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-muted-foreground"><strong>Interpretasi:</strong> Skor ≤{HACOR_CUTOFF} pada jam ke-1 → NIV dapat dilanjutkan dengan pemantauan ketat · Skor &gt;{HACOR_CUTOFF} → risiko gagal NIV tinggi; pada kohort Duan, intubasi dini (≤12 jam) pada kelompok ini berhubungan dengan mortalitas rumah sakit yang lebih rendah [3].</p>
          <p className="mt-2 text-[11px] italic text-muted-foreground">📚 Duan J et al. Intensive Care Med 2017;43:192</p>
        </Accordion>

        <Accordion title="📖 ROX Index — Prediksi Kegagalan HFNC">
          <p className="mb-2 text-muted-foreground"><strong>ROX Index = (SpO₂/FiO₂) ÷ RR spontan</strong> (FiO₂ dalam fraksi, mis. 0,6)</p>
          <p className="mb-3 text-muted-foreground">Dikembangkan untuk memprediksi kebutuhan intubasi pada pasien pneumonia yang mendapat HFNC. Ambang risiko tinggi <strong>berbeda menurut jam sejak HFNC dimulai</strong> — sama dengan yang dipakai Kalkulator AGD/oksigenasi [5].</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Jam ke-</th><th className="p-2">Risiko rendah</th><th className="p-2">Zona menengah</th><th className="p-2">Risiko tinggi gagal HFNC</th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(ROX_HIGH_RISK) as (keyof typeof ROX_HIGH_RISK)[]).map((h) => (
                  <tr key={h} className="border-b border-border text-foreground">
                    <td className="p-2 font-semibold">{h}</td>
                    <td className="p-2 text-emerald-600 dark:text-emerald-400 font-bold">≥{fmt(ROX_LOW_RISK)}</td>
                    <td className="p-2 text-amber-600 dark:text-amber-400 font-bold">{fmt(ROX_HIGH_RISK[h])}–&lt;{fmt(ROX_LOW_RISK)}</td>
                    <td className="p-2 text-destructive font-bold">&lt;{fmt(ROX_HIGH_RISK[h])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="list-disc pl-5 mt-3 space-y-1 text-muted-foreground">
            <li><strong className="text-foreground">Tindakan:</strong> risiko rendah → lanjutkan HFNC & pantau; zona menengah → nilai ulang 1–2 jam (ROX yang terus naik = prognosis lebih baik); risiko tinggi → pertimbangkan intubasi, jangan menunda.</li>
            <li><strong className="text-foreground">Keterbatasan:</strong> kohort pengembangan ROX adalah pasien pneumonia [5, 6] — penerapan pada PPOK hiperkapnik, edema paru kardiogenik, atau imunokompromais berat belum tervalidasi baik.</li>
            <li><strong className="text-foreground">FLORALI (2015):</strong> pada gagal napas hipoksemik non-hiperkapnik, angka intubasi hari ke-28 tidak berbeda bermakna antara HFNC, O₂ standar, dan NIV (38% vs 47% vs 50%; P=0,18). Mortalitas 90 hari lebih rendah dengan HFNC; pada subgrup P/F ≤200 (analisis post-hoc) intubasi lebih rendah dengan HFNC [7].</li>
          </ul>
          <p className="mt-2 text-[11px] italic text-muted-foreground">
            📚 Frat JP et al. (FLORALI) NEJM 2015;372:2185 ·
            Roca O et al. (ROX index) Am J Respir Crit Care Med 2019;199:1368
          </p>
        </Accordion>

        <Accordion title="📖 Algoritma NIV vs HFNC vs Intubasi Segera">
          <div className="mb-4">
            <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Indikasi NIV (Non-Invasive Ventilation)</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">Terbaik untuk:</strong> PPOK eksaserbasi (pH 7.25–7.35, PaCO₂ &gt;45), edema paru kardiogenik akut, immunocompromised (hindari intubasi), post-ekstubasi risiko tinggi</li>
              <li><strong className="text-foreground">Kontraindikasi relatif NIV:</strong> Kesadaran sangat menurun (GCS &lt;10), ketidakmampuan proteksi jalan napas, sekresi masif, hemodinamik tidak stabil, facial injury</li>
              <li><strong className="text-foreground">Setting awal PPOK:</strong> IPAP 12–20 cmH₂O, EPAP 4–8 cmH₂O, backup RR 12/mnt, FiO₂ titrasi ke SpO₂ 88–92%</li>
              <li><strong className="text-foreground">Setting awal edema paru kardiogenik:</strong> CPAP 8–12 cmH₂O atau BiPAP IPAP 14–18 / EPAP 5–8</li>
              <li><strong className="text-foreground">Interface:</strong> Full-face mask (paling efektif), helmet CPAP (lebih nyaman, lebih baik untuk ARDS ringan), nasal mask (PPOK kronik)</li>
            </ul>
            <p className="mt-2 text-[11px] italic text-muted-foreground">
              📚 Rochwerg B et al. (ERS/ATS NIV 2017) Eur Respir J 2017;50:1602426 ·
              Antonelli M et al. NEJM 1998;339:429 · Plant PK et al. (NIV COPD) Lancet 2000;355:1931
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Indikasi HFNC (High Flow Nasal Cannula)</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">Terbaik untuk:</strong> Hipoksemia akut non-hiperkapnik (pneumonia, post-op, immunocompromised), post-ekstubasi preventif, bridging sebelum NIV/intubasi</li>
              <li><strong className="text-foreground">Mekanisme:</strong> Flow tinggi (20–60 L/mnt) → flush dead space anatomis → PEEP ~1 cmH₂O per 10 L/mnt flow → FiO₂ lebih tepat dan stabil</li>
              <li><strong className="text-foreground">Setting awal:</strong> Flow 40–60 L/mnt, FiO₂ titrasi ke SpO₂ 92–96%, suhu 37°C</li>
              <li><strong className="text-foreground">HFNC pada PPOK:</strong> Aman jika dipantau ketat (awasi retensi CO₂). Target SpO₂ 88–92%.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Intubasi Segera — Indikasi [8, 9]</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Henti napas atau apnea</li>
              <li>GCS ≤8 atau tidak dapat proteksi jalan napas</li>
              <li>Syok berat disertai gagal napas (perlu sedasi dalam)</li>
              <li>SpO₂ &lt;85% meski FiO₂ 1.0 via HFNC/NIV</li>
              <li>HACOR &gt;{HACOR_CUTOFF} pada jam ke-1 NIV</li>
              <li>ROX di bawah ambang risiko tinggi: &lt;{fmt(ROX_HIGH_RISK['2'])} (jam 2), &lt;{fmt(ROX_HIGH_RISK['6'])} (jam 6), &lt;{fmt(ROX_HIGH_RISK['12'])} (jam 12)</li>
              <li>Agitasi ekstrem, tidak kooperatif dengan NIV/HFNC</li>
              <li>Perburukan klinis progresif meski terapi optimal</li>
            </ul>
            <p className="mt-2 text-[11px] italic text-muted-foreground">
              📚 Rochwerg B et al. Eur Respir J 2017;50:1602426 · Brown CA et al. Walls Manual of Emergency Airway Management, 6th ed.
            </p>
          </div>
        </Accordion>

        <AbbrLegend terms={['RR', 'HR', 'SCM', 'SpO2', 'FiO2', 'PaO2', 'PaCO2', 'P/F', 'NIV', 'HFNC', 'HACOR', 'GCS', 'AUC', 'ROX', 'PPOK', 'IPAP', 'EPAP', 'CPAP', 'BiPAP', 'ARDS', 'PEEP', 'ERS', 'ATS', 'COVID-19']} />

        <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-bold text-[14px] text-foreground mb-3 flex items-center gap-2">
            📚 Referensi Utama
          </h3>
          <ul className="list-decimal pl-5 space-y-2 text-muted-foreground text-[12px]">
            <li>Roussos C, Koutsoukou A. Respiratory failure. <em>Eur Respir J Suppl</em>. 2003;47:3s-14s.</li>
            <li>Tobin MJ. Respiratory monitoring. <em>JAMA</em>. 1990;264:244.</li>
            <li>Duan J, et al. Assessment of heart rate, acidosis, consciousness, oxygenation, and respiratory rate to predict noninvasive ventilation failure in hypoxemic patients. <em>Intensive Care Med</em>. 2017;43:192.</li>
            <li>Antonelli M, et al. A comparison of noninvasive positive-pressure ventilation and conventional mechanical ventilation in patients with acute respiratory failure. <em>N Engl J Med</em>. 1998;339:429.</li>
            <li>Roca O, et al. An index combining respiratory rate and oxygenation to predict outcome of nasal high-flow therapy. <em>Am J Respir Crit Care Med</em>. 2019;199:1368.</li>
            <li>Roca O, et al. Predicting success of high-flow nasal cannula in pneumonia patients with hypoxemic respiratory failure: The utility of the ROX index. <em>J Crit Care</em>. 2016;35:200.</li>
            <li>Frat JP, et al. High-flow oxygen through nasal cannula in acute hypoxemic respiratory failure. <em>N Engl J Med</em>. 2015;372:2185.</li>
            <li>Rochwerg B, et al. Official ERS/ATS clinical practice guidelines: noninvasive ventilation for acute respiratory failure. <em>Eur Respir J</em>. 2017;50:1602426.</li>
            <li>Grieco DL, et al. Effect of helmet noninvasive ventilation vs high-flow nasal oxygen on days free of respiratory support in patients with COVID-19 and moderate to severe hypoxemic respiratory failure (HENIVOT). <em>JAMA</em>. 2021;325:1731.</li>
            <li>Plant PK et al. (NIV COPD) <em>Lancet</em>. 2000;355:1931.</li>
            <li>Brown CA, Sakles JC, Mick NW (eds). The Walls Manual of Emergency Airway Management. 6th ed.</li>
          </ul>
        </div>
      </div>
  );
}
