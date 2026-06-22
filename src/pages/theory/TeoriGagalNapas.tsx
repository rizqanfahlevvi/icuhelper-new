import { Accordion } from '../../components/ui/Accordion';

export default function TeoriGagalNapas() {
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 mb-2">
          Klasifikasi & Patofisiologi Gagal Napas
        </h1>
        
        <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg text-foreground mb-4 text-[13px]">
          <div className="font-bold text-[15px] mb-2 text-primary">Definisi Gagal Napas</div>
          <p>Gagal napas adalah ketidakmampuan sistem respirasi untuk mempertahankan pertukaran gas yang adekuat untuk memenuhi kebutuhan metabolik tubuh.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <p><strong>Kriteria Diagnostik:</strong></p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li><strong>Hipoksemia:</strong> PaO₂ &lt;60 mmHg pada udara ruang (FiO₂ 0.21)</li>
                <li><strong>Hiperkapnia:</strong> PaCO₂ &gt;45 mmHg dengan asidosis respiratorik (pH &lt;7.35)</li>
                <li><strong>Kombinasi:</strong> Keduanya (tipe campuran)</li>
              </ul>
            </div>
            <div>
              <p><strong>Klasifikasi Waktu:</strong></p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li><strong>Akut:</strong> Onset &lt;72 jam; pH asidosis, tidak ada kompensasi ginjal</li>
                <li><strong>Kronik:</strong> Onset &gt;72 jam; HCO₃⁻ meningkat (kompensasi); pH relatif normal</li>
                <li><strong>Akut-on-kronik:</strong> Eksaserbasi pada pasien dengan gagal napas kronik (PPOK)</li>
              </ul>
            </div>
          </div>
          <p className="mt-3 text-[12px] opacity-80 text-muted-foreground"><em>Berdasarkan West JB (2016) dan Roussos C (2003) [1, 2].</em></p>
        </div>

        <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg text-foreground mb-4 text-[13px]">
          <div className="font-bold text-[14px] mb-2 text-teal-600 dark:text-teal-400">Global Definition of ARDS (2023)</div>
          <p>Matthay MA et al. Am J Respir Crit Care Med 2023 memperbarui definisi Berlin 2012 dengan: <br/>
          (1) menambahkan HFNC ≥30 L/mnt dengan FiO₂ ≥0.4 dan NIV/CPAP sebagai setting yang memenuhi kriteria; <br/>
          (2) SpO₂/FiO₂ ≤315 dapat menggantikan PaO₂/FiO₂ jika AGD tidak tersedia; <br/>
          (3) tidak lagi mensyaratkan bilateral infiltrat simetris ketat.</p>
          <p className="mt-2 text-[12px] opacity-80 text-teal-700 dark:text-teal-300"><em>Matthay MA et al. Am J Respir Crit Care Med (2023) [3].</em></p>
        </div>

        </div>

        <Accordion title="📖 Gagal Napas Tipe I — Hipoksemia (PaO₂ <60 mmHg)" defaultOpen={true}>
          <p className="mb-2 text-muted-foreground"><strong>Definisi:</strong> PaO₂ &lt;60 mmHg dengan PaCO₂ normal atau rendah. A-a gradient meningkat.</p>
          
          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1 mt-4">Mekanisme Tipe I</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Mekanisme</th><th className="p-2">Patofisiologi</th><th className="p-2">Contoh Klinis</th><th className="p-2">Respons O₂</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">V/Q Mismatch</td>
                  <td className="p-2">Alveoli ventilasi tidak sepadan dengan perfusi (atau sebaliknya). Penyebab hipoksemia tersering.</td>
                  <td className="p-2">Pneumonia, PPOK, asma, PE, edema paru</td>
                  <td className="p-2 text-success font-semibold">Respons baik</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Shunt (Qs/Qt)</td>
                  <td className="p-2">Darah melewati paru tanpa kontak alveoli. Shunt anatomi atau intrapulmoner.</td>
                  <td className="p-2">ARDS berat, atelektasis masif, AVM paru, PFO</td>
                  <td className="p-2 text-destructive font-semibold">Respons minimal</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Difusi Terganggu</td>
                  <td className="p-2">Penebalan membran alveolar-kapiler → ↓ transfer O₂.</td>
                  <td className="p-2">Fibrosis paru, sarkoidosis, pneumonitis</td>
                  <td className="p-2 text-success font-semibold">Respons baik (istirahat)</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Hipoventilasi</td>
                  <td className="p-2">A-a gradient NORMAL. PAO₂ ↓ karena PaCO₂ ↑.</td>
                  <td className="p-2">OHS, overdosis opiat, NMD</td>
                  <td className="p-2 text-success font-semibold">Respons sangat baik</td>
                </tr>
                <tr className="text-foreground">
                  <td className="p-2 font-bold">FiO₂ Rendah</td>
                  <td className="p-2">Tekanan parsial O₂ inspirasi rendah. A-a gradient normal.</td>
                  <td className="p-2">Ketinggian, ruang terkurung</td>
                  <td className="p-2 text-success font-semibold">Respons baik</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">A-a Gradient</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-muted-foreground">
            <li><strong className="text-foreground">Formula:</strong> A-a = PAO₂ − PaO₂ = [FiO₂ × (Patm − PH₂O) − PaCO₂/RQ] − PaO₂</li>
            <li><strong className="text-foreground">Normal:</strong> 5–15 mmHg pada usia muda; meningkat dengan usia: ~2.5 + (0.21 × usia)</li>
            <li><strong className="text-foreground">A-a normal + hipoksemia:</strong> Hipoventilasi murni atau FiO₂ rendah</li>
            <li><strong className="text-foreground">A-a meningkat + hipoksemia:</strong> V/Q mismatch, shunt, atau difusi terganggu</li>
          </ul>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Prone Positioning pada ARDS Berat</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-muted-foreground">
            <li><strong className="text-foreground">PROSEVA trial (Guérin C et al. NEJM 2013;368:2159):</strong> Prone &gt;16 jam/hari pada P/F &lt;150 → mortalitas 28 hari ↓ dari 32.8% menjadi 16% (RR 0.39, NNT ~6). Rekomendasi kuat untuk ARDS berat (P/F &lt;150, SSC/ATS 2017).</li>
            <li><strong className="text-foreground">Mekanisme:</strong> Redistribusi ventilasi ke daerah dorsal yang lebih banyak, ↓ shunt, ↓ overdistensi ventral, ↑ drainase sekret, ↓ kompresi jantung ke paru.</li>
            <li><strong className="text-foreground">Kontraindikasi relatif:</strong> Fraktur tulang belakang tidak stabil, luka bakar anterior luas, tekanan intrakranial meningkat, kehamilan trimester III.</li>
          </ul>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Neuromuscular Blockade (NMB) pada ARDS — Konflik Data</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-muted-foreground">
            <li><strong className="text-foreground">ACURASYS (Papazian L. NEJM 2010;363:1107):</strong> Cisatracurium 48 jam pada ARDS berat (P/F &lt;150) → ↓ mortalitas 90 hari dan ↑ hari bebas ventilator dibanding placebo.</li>
            <li><strong className="text-foreground">ROSE (Moss M. NEJM 2019;380:1997):</strong> NMB rutin 48 jam tidak lebih baik dari sedasi ringan (RASS -1 s/d 0) tanpa NMB dalam mortalitas 90 hari.</li>
            <li><strong className="text-foreground">Kesimpulan terkini:</strong> NMB rutin 48 jam TIDAK direkomendasikan. Pertimbangkan hanya pada ARDS berat dengan patient-ventilator dyssynchrony berat yang tidak teratasi, atau saat prone positioning berlangsung.</li>
          </ul>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Driving Pressure (DP) pada ARDS</h3>
          <ul className="list-disc pl-5 mb-3 space-y-1 text-muted-foreground">
            <li><strong className="text-foreground">Definisi:</strong> DP = Plateau pressure − PEEP = VT / Compliance sistem respirasi. Mencerminkan "stress" efektif pada paru yang masih aerasi.</li>
            <li><strong className="text-foreground">Amato MB et al. NEJM 2015;372:747:</strong> Analisis observasional multicenter — DP &gt;14 cmH₂O dikaitkan dengan mortalitas lebih tinggi, bahkan setelah koreksi VT dan PEEP. Target DP ≤14 cmH₂O rasional.</li>
            <li><strong className="text-foreground">DRIVINGARDS trial (NEJM Evidence 2023):</strong> RCT pertama driving pressure-guided ventilation — tren protektif namun belum mencapai signifikansi statistik. Mendukung pendekatan DP-guided sebagai strategi tambahan, namun belum cukup untuk mengubah standar manajemen saat ini [8].</li>
            <li><strong className="text-foreground">Praktis:</strong> Jika VT 6 mL/kgIBW menghasilkan DP &gt;14 → turunkan VT ke 4–5 mL/kgIBW; jika perlu, toleransi permissive hypercapnia.</li>
          </ul>
        </Accordion>

        <Accordion title="📖 Gagal Napas Tipe II — Hiperkapnia (PaCO₂ >45 mmHg)">
          <p className="mb-2 text-muted-foreground"><strong>Definisi:</strong> PaCO₂ &gt;45 mmHg + pH &lt;7.35 (asidosis respiratorik). Mencerminkan ventilasi alveolar yang tidak adekuat.</p>
          <p className="mb-4 text-muted-foreground"><strong>Persamaan kunci:</strong> PaCO₂ = VCO₂ / VA (ventilasi alveolar) → VA = VE × (1 − VD/VT)</p>
          
          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Mekanisme Tipe II</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Kategori</th><th className="p-2">Mekanisme</th><th className="p-2">Contoh Klinis</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Drive Napas ↓</td>
                  <td className="p-2">Pusat napas di batang otak terganggu → ↓ RR dan VT</td>
                  <td className="p-2">Overdosis opiat/BZD, stroke batang otak, hipotiroid berat, OHS</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Pompa Napas Gagal</td>
                  <td className="p-2">Otot napas lemah → VT ↓, dead space meningkat relatif</td>
                  <td className="p-2">GBS, MG, SMA, ALS, miopati ICU, hipofosfatemia</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Beban Napas ↑</td>
                  <td className="p-2">Resistensi atau compliance buruk → WOB sangat tinggi → fatigue</td>
                  <td className="p-2">Status asmatikus, PPOK eksaserbasi berat, efusi pleura masif</td>
                </tr>
                <tr className="text-foreground">
                  <td className="p-2 font-bold">Dead Space ↑</td>
                  <td className="p-2">VA efektif berkurang meski VT cukup</td>
                  <td className="p-2">ARDS berat (VD/VT &gt;0.6), PE masif, syok</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Dead Space (VD/VT)</h3>
          <ul className="list-disc pl-5 mb-3 space-y-1 text-muted-foreground">
            <li><strong className="text-foreground">Normal:</strong> VD/VT = 0.3 (30% dari setiap napas adalah dead space)</li>
            <li><strong className="text-foreground">ARDS berat:</strong> VD/VT bisa mencapai 0.6–0.7 → butuh VE sangat tinggi untuk normocapnia</li>
            <li><strong className="text-foreground">Formula Bohr:</strong> VD/VT = (PaCO₂ − PeCO₂) / PaCO₂</li>
            <li><strong className="text-foreground">VD/VT &gt;0.6 di ARDS:</strong> Prediktor mortalitas independen (Nuckton TJ. NEJM 2002) [9].</li>
            <li><strong className="text-foreground">Klinis:</strong> VD/VT tinggi → weaning sulit meski kekuatan otot normal.</li>
          </ul>
        </Accordion>

        <Accordion title="📖 Gagal Napas Tipe III (Perioperatif) & Tipe IV (Syok)">
          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Tipe III — Perioperatif / Atelektasis</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-muted-foreground">
            <li><strong className="text-foreground">Mekanisme:</strong> Anestesi umum → ↓ FRC 20–30% → penutupan jalan napas kecil → atelektasis → V/Q mismatch → hipoksemia</li>
            <li><strong className="text-foreground">Faktor risiko:</strong> Obesitas, operasi abdominal/torakal, PPOK, merokok, usia lanjut, nyeri post-op (splinting)</li>
            <li><strong className="text-foreground">Penatalaksanaan:</strong> PEEP ≥5 cmH₂O, rekruitmen maneuver, CPAP post-op, analgesia adekuat, early mobilisasi, spirometri insentif</li>
            <li><strong className="text-foreground">NIV profilaksis post-op:</strong> Efektif menurunkan re-intubasi pada pasien risiko tinggi (ECLAIR trial, Jaber 2016)</li>
            <li><strong className="text-foreground">HFNC post-op abdominal:</strong> OPERA trial (2024) — HFNC vs O₂ konvensional, tidak superior untuk composite outcome, namun lebih nyaman</li>
          </ul>
          
          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Tipe IV — Hipoperfusi / Syok</h3>
          <ul className="list-disc pl-5 mb-3 space-y-1 text-muted-foreground">
            <li><strong className="text-foreground">Mekanisme:</strong> Syok → DO₂ tidak memenuhi VO₂ → metabolisme anaerob → laktat asidosis → gagal napas sebagai organ failure</li>
            <li><strong className="text-foreground">DO₂ = CO × CaO₂ × 10</strong> — CO = cardiac output, CaO₂ = Hb × 1.34 × SaO₂ + (PaO₂ × 0.003)</li>
            <li><strong className="text-foreground">Interaksi ventilasi-sirkulasi:</strong> Ventilasi mekanik meningkatkan tekanan intratorakal → ↓ preload → ↓ CO → perburukan syok. Resusitasi hemodinamik harus bersamaan.</li>
            <li><strong className="text-foreground">Tatalaksana prioritas Tipe IV:</strong> (1) Resusitasi hemodinamik, (2) Source control, (3) Ventilasi mekanik untuk mengurangi WOB otot napas (redistribusi DO₂) [10].</li>
          </ul>
        </Accordion>

        <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-bold text-[14px] text-foreground mb-3 flex items-center gap-2">
            📚 Referensi Utama
          </h3>
          <ul className="list-decimal pl-5 space-y-2 text-muted-foreground text-[12px]">
            <li>West JB. Respiratory Physiology: The Essentials. 10th ed. 2016.</li>
            <li>Roussos C, Koutsoukou A. Respiratory failure. <em>Eur Respir J Suppl</em>. 2003.</li>
            <li>Matthay MA, et al. A New Global Definition of Acute Respiratory Distress Syndrome. <em>Am J Respir Crit Care Med</em>. 2023.</li>
            <li>Guérin C, et al. Prone positioning in severe acute respiratory distress syndrome. <em>N Engl J Med</em>. 2013.</li>
            <li>Papazian L, et al. Neuromuscular blockers in early acute respiratory distress syndrome. <em>N Engl J Med</em>. 2010.</li>
            <li>Moss M, et al. Early Neuromuscular Blockade in the Acute Respiratory Distress Syndrome (ROSE). <em>N Engl J Med</em>. 2019.</li>
            <li>Amato MB, et al. Driving pressure and survival in the acute respiratory distress syndrome. <em>N Engl J Med</em>. 2015.</li>
            <li>Jaber S, et al. Driving Pressure-Guided Ventilation for ARDS (DRIVINGARDS). <em>NEJM Evidence</em>. 2023.</li>
            <li>Nuckton TJ, et al. Pulmonary dead-space fraction as a risk factor for death in the acute respiratory distress syndrome. <em>N Engl J Med</em>. 2002.</li>
            <li>Jaber S, et al. Noninvasive ventilation to prevent require intubation in high-risk patients. <em>Intensive Care Med</em>. 2016.</li>
          </ul>
        </div>
      </div>
  );
}
