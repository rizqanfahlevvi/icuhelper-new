import { Accordion } from '../../components/ui/Accordion';

export default function TeoriB1B6() {
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 mb-2">
          B1–B6 Bedside Assessment — Terapi Intensif
        </h1>
        <p className="text-muted-foreground text-[13px] mb-4">Panduan cepat penilaian sistematis B1–B6 untuk pasien kritis di ICU [1, 2].</p>

        </div>

        <Accordion title="🫁 B1 — Breathing (Pernapasan)" defaultOpen={true}>
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-foreground text-[12px] mb-4">
            <strong className="text-primary block mb-2">Komponen Penilaian Bedside</strong>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="list-disc pl-5 m-0 space-y-1 text-muted-foreground">
                <li><strong className="text-foreground">RR</strong> — normal 12–20 x/mnt; ≥30 = distress berat</li>
                <li><strong className="text-foreground">SpO₂</strong> — sesuai target kondisi (lihat tabel)</li>
                <li><strong className="text-foreground">Work of Breathing (WOB)</strong> — otot aksesori, retraksi</li>
              </ul>
              <ul className="list-disc pl-5 m-0 space-y-1 text-muted-foreground">
                <li>Auskultasi: Vesikuler, ronkhi, wheezing, stridor</li>
                <li>Kusmaul (asidosis metabolik), Cheyne-Stokes</li>
                <li>Paradoxal breathing → kelelahan diafragma</li>
              </ul>
            </div>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Target SpO₂ per Kondisi Klinis</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border"><th className="p-2">Kondisi</th><th className="p-2">Target SpO₂</th><th className="p-2">Catatan</th></tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground"><td className="p-2">Umum / pasca-resusitasi</td><td className="p-2 font-bold text-primary">94–98%</td><td className="p-2 text-muted-foreground">Hindari hiperoksia</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2">ARDS sedang–berat</td><td className="p-2 font-bold text-warning">88–95%</td><td className="p-2 text-muted-foreground">Toleransi hipoksemia permisif</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2">PPOK / hiperkania kronik</td><td className="p-2 font-bold text-warning">88–92%</td><td className="p-2 text-muted-foreground">Hindari supresi drive napas</td></tr>
                <tr className="text-foreground"><td className="p-2">Stroke / post-cardiac arrest</td><td className="p-2 font-bold text-primary">94–98%</td><td className="p-2 text-muted-foreground">Hiperoksia berbahaya untuk otak</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Parameter Ventilator Lung-Protective</h3>
          <ul className="list-disc pl-5 mb-2 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">Tidal Volume:</strong> 6 mL/kgBB IBW (Batas aman: 4–8 mL/kgBB IBW)</li>
            <li><strong className="text-foreground">Plateau Pressure:</strong> ≤28 cmH₂O (<strong className="text-destructive">Mutlak ≤30 cmH₂O</strong>)</li>
            <li><strong className="text-foreground">Driving Pressure:</strong> ≤15 cmH₂O (ideal) [3, 4]</li>
          </ul>
        </Accordion>

        <Accordion title="❤️ B2 — Blood (Sirkulasi)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-bold text-[13px] text-destructive uppercase tracking-wider mb-2 border-b border-border pb-1">Parameter Hemodinamik</h3>
              <ul className="list-disc pl-5 m-0 space-y-1 text-muted-foreground text-[12px]">
                <li><strong className="text-foreground">HR</strong> — normal 60–100 bpm; takikardia = kompensasi?</li>
                <li><strong className="text-foreground">MAP</strong> — target ≥65 mmHg (sepsis) / ≥80 (TBI)</li>
                <li><strong className="text-foreground">JVP</strong> — tinggi = gagal jantung kanan / tamponade</li>
                <li><strong className="text-foreground">CRT</strong> — &gt;2 detik = hipoperfusi perifer</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[13px] text-destructive uppercase tracking-wider mb-2 border-b border-border pb-1">Biomarker Sirkulasi</h3>
              <ul className="list-disc pl-5 m-0 space-y-1 text-muted-foreground text-[12px]">
                <li><strong className="text-foreground">Laktat</strong> — target &lt;2 mmol/L; clearance ≥10%/2 jam</li>
                <li><strong className="text-foreground">ScvO₂</strong> — &lt;70% = inadequate DO₂ atau ↑ VO₂</li>
                <li><strong className="text-foreground">Troponin</strong> — elevasi = myocardial injury</li>
                <li><strong className="text-foreground">BNP/NT-proBNP</strong> — penanda volume overload</li>
              </ul>
            </div>
          </div>
        </Accordion>

        <Accordion title="🧠 B3 — Brain (Persarafan)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Kesadaran & Pupil</h3>
              <ul className="list-disc pl-5 m-0 space-y-1 text-muted-foreground text-[12px]">
                <li><strong className="text-foreground">GCS</strong> — Mata (1–4) + Verbal (1–5) + Motorik (1–6)</li>
                <li><strong className="text-foreground">GCS ≤8</strong> → pertimbangkan proteksi jalan napas</li>
                <li><strong className="text-foreground">Pupil</strong> — Normal 2–5 mm bilateral reaktif</li>
                <li>Anisokoria &gt;1 mm + fixed → herniasi uncal?</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Sedasi & Nyeri</h3>
              <ul className="list-disc pl-5 m-0 space-y-1 text-muted-foreground text-[12px]">
                <li><strong className="text-foreground">Target RASS:</strong> -1 s/d 0 (Sedasi ringan / Alert & Calm)</li>
                <li><strong className="text-foreground">Penilaian Nyeri:</strong> CPOT (untuk terintubasi) atau NRS</li>
                <li><strong className="text-foreground">Delirium:</strong> CAM-ICU (untuk terintubasi) atau ICDSC</li>
              </ul>
            </div>
          </div>
        </Accordion>

        <Accordion title="🫘 B4 — Bladder (Renal & Cairan)">
          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Urine Output & Balans (Target & Evaluasi)</h3>
          <ul className="list-disc pl-5 mb-3 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">Target UO:</strong> ≥0.5 mL/kgBB/jam. Oliguria bila &lt;0.5 x 6 jam.</li>
            <li><strong className="text-foreground">Target Balans:</strong> Resusitasi awal → positif (wajar). Optimasi → netral. De-eskalasi (&gt;24j) → <strong className="text-primary">negatif</strong> (kurangi edema, ↑ keberhasilan weaning).</li>
            <li><strong className="text-foreground">Indikasi RRT:</strong> Overload refrakter, asidosis berat (pH&lt;7.1), K⁺ &gt;6.5 mEq/L ekg changes, uremia simtomatik.</li>
          </ul>
        </Accordion>

        <Accordion title="🌿 B5 — Bowel (Pencernaan & Nutrisi)">
           <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Pemeriksaan & Target Nutrisi</h3>
           <ul className="list-disc pl-5 mb-3 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">Pemeriksaan:</strong> I-A-P-P (Inspeksi, Auskultasi, Perkusi, Palpasi). Bising usus normal 5-34x/mnt.</li>
            <li><strong className="text-foreground">Target Nutrisi:</strong> Kalori 25-30 kkal/kg/hari (hindari overfeed fase awal). Protein 1.2-2.0 g/kg/hari.</li>
            <li><strong className="text-foreground">Early Enteral:</strong> Mulai 24-48 jam. HOB 30-45°. Stop/tahan bila GRV &gt;500 mL/6j atau muntah berlebih.</li>
          </ul>
        </Accordion>

        <Accordion title="🦴 B6 — Bone (Integumen & Ekstremitas)">
          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Integumen & Mobilisasi Dini</h3>
          <ul className="list-disc pl-5 mb-3 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">ICU-Acquired Weakness:</strong> Insidensi 25-50% (ICU &gt;7 hari). Nilai dengan skala MRC. Lakukan early mobility.</li>
            <li><strong className="text-foreground">Pressure Injury:</strong> Cek rutinitas setiap shift. Lakukan reposisi/miring-miring setiap 2 jam.</li>
            <li><strong className="text-foreground">Mottling / Perfusi:</strong> Mottling score (0-5 dari lutut ke umbilikus) sangat prediktif untuk mortalitas resusitasi syok [5].</li>
          </ul>
        </Accordion>

        <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-bold text-[14px] text-foreground mb-3 flex items-center gap-2">
            📚 Referensi Utama
          </h3>
          <ul className="list-decimal pl-5 space-y-2 text-muted-foreground text-[12px]">
            <li>Vincent JL, et al. Textbook of Critical Care. 8th ed. <em>Elsevier</em>. 2023.</li>
            <li>Marino PL. The ICU Book. 4th ed. <em>LWW</em>. 2013.</li>
            <li>ARDS Definition Task Force. Acute respiratory distress syndrome: the Berlin Definition. <em>JAMA</em>. 2012.</li>
            <li>Amato MB, et al. Driving pressure and survival in the acute respiratory distress syndrome. <em>N Engl J Med</em>. 2015.</li>
            <li>Ait-Oufella H, et al. Mottling score predicts survival in septic shock. <em>Intensive Care Med</em>. 2011.</li>
          </ul>
        </div>
      </div>
  );
}
