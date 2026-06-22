import { Accordion } from '../../components/ui/Accordion';

export default function TeoriImpending() {
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-destructive flex items-center gap-2 mb-2">
          Impending Respiratory Failure — Pengenalan Dini
        </h1>
        
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive mb-4 text-[13px]">
          <div className="font-bold text-[14px] mb-2">Definisi & Kriteria Impending Gagal Napas</div>
          <p>Impending respiratory failure adalah kondisi di mana pasien berisiko tinggi mengalami gagal napas dalam waktu dekat jika tidak diintervensi. <strong>Jendela kritis: 30–60 menit</strong> sebelum dekompensasi total.</p>
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
                <li>Pola napas Cheyne-Stokes atau Kussmaul</li>
              </ul>
            </div>
          </div>
          <p className="mt-2 text-[12px] opacity-80 text-muted-foreground"><em>Berdasarkan kriteria GINA 2024 dan GOLD 2024 [1, 2].</em></p>
        </div>

        </div>

        <Accordion title="📖 HACOR Score — Prediksi Kegagalan NIV" defaultOpen={true}>
          <p className="mb-2 text-muted-foreground">HACOR score memprediksi kegagalan NIV dalam 1 jam pertama penggunaan. Skor ≥5 → kemungkinan gagal NIV tinggi → pertimbangkan intubasi awal. <strong>AUC 0.88</strong> (validasi multisenter).</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Parameter</th><th className="p-2">Nilai</th><th className="p-2">Skor</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground"><td rowSpan={3} className="p-2 align-top border-b border-border">Heart Rate (/mnt)</td><td className="p-2">≤120</td><td className="p-2 font-bold">0</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2">121–150</td><td className="p-2 font-bold text-warning">1</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2">&gt;150</td><td className="p-2 font-bold text-destructive">2</td></tr>
                
                <tr className="border-b border-border text-foreground"><td rowSpan={3} className="p-2 align-top border-b border-border">Acidosis (pH)</td><td className="p-2">≥7.35</td><td className="p-2 font-bold">0</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2">7.25–7.34</td><td className="p-2 font-bold text-destructive">2</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2">&lt;7.25</td><td className="p-2 font-bold text-destructive">4</td></tr>
                
                <tr className="border-b border-border text-foreground"><td rowSpan={3} className="p-2 align-top border-b border-border">Consciousness (GCS)</td><td className="p-2">15</td><td className="p-2 font-bold">0</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2">13–14</td><td className="p-2 font-bold text-destructive">2</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2">≤12</td><td className="p-2 font-bold text-destructive">4</td></tr>
                
                <tr className="border-b border-border text-foreground"><td rowSpan={3} className="p-2 align-top border-b border-border">Oxygenation (P/F ratio)</td><td className="p-2">≥200</td><td className="p-2 font-bold">0</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2">101–200</td><td className="p-2 font-bold text-destructive">3</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2">≤100</td><td className="p-2 font-bold text-destructive">5</td></tr>
                
                <tr className="border-b border-border text-foreground"><td rowSpan={3} className="p-2 align-top">Respiratory Rate (/mnt)</td><td className="p-2">≤30</td><td className="p-2 font-bold">0</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2">31–40</td><td className="p-2 font-bold text-warning">1</td></tr>
                <tr className="text-foreground"><td className="p-2">&gt;40</td><td className="p-2 font-bold text-destructive">2</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-muted-foreground"><strong>Interpretasi:</strong> Skor 0–4: NIV kemungkinan berhasil · Skor ≥5: Risiko gagal NIV tinggi → intubasi</p>
          <p className="mt-1 text-muted-foreground"><strong>Update 2024:</strong> HACOR divalidasi juga untuk prediksi kegagalan HFNC pada pneumonia dan COVID-19 (sensitifitas 83%, spesifisitas 74%) [3, 4].</p>
        </Accordion>

        <Accordion title="📖 ROX Index — Prediksi Kegagalan HFNC">
          <p className="mb-2 text-muted-foreground"><strong>ROX Index = (SpO₂/FiO₂) / RR spontan</strong></p>
          <p className="mb-3 text-muted-foreground">Dikembangkan untuk memprediksi kebutuhan intubasi pada pasien yang mendapat HFNC. Dihitung pada jam ke-2, 6, dan 12 setelah mulai HFNC.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">ROX Index</th><th className="p-2">Interpretasi</th><th className="p-2">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-semibold">≥4.88</td><td className="p-2"><span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-[10px] font-bold">Risiko rendah gagal HFNC</span></td><td className="p-2">Lanjutkan HFNC, monitor tiap 4–6 jam</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-semibold">3.85–4.87</td><td className="p-2"><span className="px-2 py-0.5 rounded-full bg-warning/20 text-warning text-[10px] font-bold">Intermediate</span></td><td className="p-2">Evaluasi ulang ketat tiap 2 jam</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-semibold">2.85–3.84</td><td className="p-2"><span className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-[10px] font-bold">Risiko tinggi</span></td><td className="p-2">Pertimbangkan eskalasi ke NIV/intubasi</td></tr>
                <tr className="text-foreground"><td className="p-2 font-semibold">&lt;2.85 pada jam 12</td><td className="p-2"><span className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-[10px] font-bold">Intubasi sangat mungkin</span></td><td className="p-2">Spesifisitas 91.4% untuk intubasi dalam 24 jam</td></tr>
              </tbody>
            </table>
          </div>
          <ul className="list-disc pl-5 mt-3 space-y-1 text-muted-foreground">
            <li><strong className="text-foreground">ROX-HR (2021):</strong> ROX + Heart Rate → ROX-HR = ROX / HR × 100. Meningkatkan akurasi prediksi pada sepsis + hipoksemia. Cut-off &lt;4.6 pada jam 2 [5].</li>
            <li><strong className="text-foreground">Keterbatasan:</strong> Tidak valid untuk pasien PPOK (RR rendah kronik), kardiogenik edema paru murni, atau immunocompromised berat [6].</li>
            <li><strong className="text-foreground">FLORALI trial update (2023):</strong> HFNC superior vs O₂ masker dan NIV pada hipoksemia akut non-PPOK; benefit lebih besar pada P/F &lt;200 [7].</li>
          </ul>
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
            <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Intubasi Segera — Indikasi Mutlak [8, 9]</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Henti napas atau apnea</li>
              <li>GCS ≤8 atau tidak dapat proteksi jalan napas</li>
              <li>Syok berat disertai gagal napas (perlu sedasi dalam)</li>
              <li>SpO₂ &lt;85% meski FiO₂ 1.0 via HFNC/NIV</li>
              <li>HACOR Score ≥5 setelah 1 jam NIV</li>
              <li>ROX &lt;3.85 setelah 12 jam HFNC (atau &lt;2.85 pada jam 12)</li>
              <li>Agitasi ekstrem, tidak kooperatif dengan NIV/HFNC</li>
              <li>Perburukan klinis progresif meski terapi optimal</li>
            </ul>
          </div>
        </Accordion>

        <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-bold text-[14px] text-foreground mb-3 flex items-center gap-2">
            📚 Referensi Utama
          </h3>
          <ul className="list-decimal pl-5 space-y-2 text-muted-foreground text-[12px]">
            <li>Roussos C, Koutsoukou A. Respiratory failure. <em>Eur Respir J Suppl</em>. 2003;47:3s-14s.</li>
            <li>Tobin MJ. Respiratory monitoring. <em>JAMA</em>. 1990;264:244.</li>
            <li>Duan J, et al. Assessment of heart rate, acidosis, consciousness, oxygenation, and respiratory rate to predict noninvasive ventilation failure in hypoxemic patients. <em>Intensive Care Med</em>. 2017.</li>
            <li>Antonelli M, et al. A comparison of noninvasive positive-pressure ventilation and conventional mechanical ventilation in patients with acute respiratory failure. <em>N Engl J Med</em>. 1998.</li>
            <li>Roca O, et al. An index combining respiratory rate and oxygenation to predict outcome of nasal high-flow therapy. <em>Am J Respir Crit Care Med</em>. 2019.</li>
            <li>Roca O, et al. Predicting success of high-flow nasal cannula in pneumonia patients with hypoxemic respiratory failure: The utility of the ROX index. <em>J Crit Care</em>. 2016.</li>
            <li>Frat JP, et al. High-flow oxygen through nasal cannula in acute hypoxemic respiratory failure. <em>N Engl J Med</em>. 2015.</li>
            <li>Rochwerg B, et al. Official ERS/ATS clinical practice guidelines: noninvasive ventilation for acute respiratory failure. <em>Eur Respir J</em>. 2017.</li>
            <li>Grieco DL, et al. High-flow nasal oxygen vs noninvasive ventilation in patients with acute hypoxemic respiratory failure. <em>JAMA</em>. 2021.</li>
          </ul>
        </div>
      </div>
  );
}
