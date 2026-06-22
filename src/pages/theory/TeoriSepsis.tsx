import { Accordion } from '../../components/ui/Accordion';

export default function TeoriSepsis() {
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 mb-2">
          Sepsis — Teori, Diagnosis & Tatalaksana
        </h1>
        
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-foreground mb-4 text-[13px]">
          <div className="font-bold text-[15px] mb-2 text-destructive">⚠️ Definisi Sepsis (Sepsis-3, JAMA 2016)</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <p className="font-bold text-destructive">🔴 Sepsis:</p>
              <p className="text-muted-foreground mt-1">Disfungsi organ yang mengancam jiwa akibat respons tubuh yang tidak terkontrol terhadap infeksi.<br/>
              <strong>Kriteria:</strong> Dugaan/bukti infeksi + <strong className="text-foreground">SOFA ≥2 (akut)</strong> dari baseline</p>
            </div>
            <div>
              <p className="font-bold text-destructive">🔴🔴 Syok Septik:</p>
              <p className="text-muted-foreground mt-1">Subset sepsis dengan kelainan sirkulasi dan metabolisme seluler yang berat → risiko kematian lebih tinggi.<br/>
              <strong>Kriteria:</strong> Sepsis + <strong className="text-foreground">vasopressor untuk MAP ≥65</strong> + <strong className="text-foreground">laktat &gt;2 mmol/L</strong> meski resusitasi adekuat</p>
            </div>
          </div>
          <p className="mt-3 text-destructive font-semibold">⚠️ Perhatian: Sepsis-3 menghapus konsep SIRS sebagai kriteria diagnostic. SIRS terlalu sensitif namun tidak spesifik. Infeksi + SOFA ≥2 adalah standar saat ini.</p>
          <p className="mt-2 text-[11px] opacity-80 text-muted-foreground"><em>Berdasarkan kriteria Sepsis-3 (JAMA 2016) dan PPK Sepsis PERDICI/PAPDI 2022 [1, 2].</em></p>
        </div>

        </div>

        <Accordion title="📖 Screening: qSOFA & SOFA Score pada Sepsis" defaultOpen={true}>
          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">qSOFA (Quick SOFA) — Bedside Screening di Luar ICU</h3>
          <p className="mb-2 text-muted-foreground">Tiga kriteria, masing-masing bernilai 1 poin. <strong className="text-foreground">qSOFA ≥2 → curiga sepsis → ukur SOFA lengkap + laktat.</strong></p>
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Kriteria qSOFA</th><th className="p-2">Abnormal</th><th className="p-2 w-12 text-center">Skor</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground"><td className="p-2">Altered mentation (GCS &lt;15)</td><td className="p-2 text-muted-foreground">GCS menurun dari baseline</td><td className="p-2 text-center font-bold text-destructive">1</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2">Respiratory Rate</td><td className="p-2 text-muted-foreground">≥22 x/menit</td><td className="p-2 text-center font-bold text-destructive">1</td></tr>
                <tr className="text-foreground"><td className="p-2">Systolic Blood Pressure</td><td className="p-2 text-muted-foreground">≤100 mmHg</td><td className="p-2 text-center font-bold text-destructive">1</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[12px] text-muted-foreground mb-4"><strong className="text-foreground">Limitasi qSOFA:</strong> Sensitivitas rendah (51–65%) → jangan digunakan sebagai satu-satunya kriteria eksklusi sepsis. NEWS-2 atau SIRS lebih sensitif untuk skrining awal.</p>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">SOFA Score — Konfirmasi Disfungsi Organ di ICU</h3>
          <p className="text-[12px] text-muted-foreground mb-2">Buka Tab <strong className="text-foreground">Skoring → SOFA Score</strong> untuk melakukan kalkulasi SOFA Score secara otomatis.</p>
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-foreground text-[12px] mb-3">
            <strong className="text-primary block mb-1">Interpretasi SOFA:</strong>
            <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">SOFA ≥2 akut</strong> dari baseline = definisi sepsis.</li>
              <li><strong className="text-foreground">ΔSOFA ≥2</strong> dalam 24 jam = memburuk.</li>
              <li><strong>Mortalitas berdasarkan SOFA total:</strong> 0–6: &lt;10% · 7–9: ~15–20% · 10–12: ~40% · ≥13: &gt;80%</li>
            </ul>
          </div>
        </Accordion>

        <Accordion title="📖 Sepsis Bundle — SSC 2021 & Update 2024 (1-Hour Bundle)">
          <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg text-foreground mb-4">
            <div className="font-bold text-[14px] text-warning mb-1">⏱️ 1-Hour Bundle Sepsis (SSC 2021) — LAKUKAN DALAM 1 JAM PERTAMA</div>
            <p className="text-[12px] text-muted-foreground">Studi menunjukkan setiap jam keterlambatan → mortalitas ↑ 7%. Bundle ini harus dimulai segera setelah diagnosis dicurigai.</p>
          </div>
          
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2 w-8 text-center">#</th><th className="p-2 w-1/4">Aksi</th><th className="p-2">Detail</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold text-center">1</td>
                  <td className="p-2 font-bold">🩸 Ukur Laktat</td>
                  <td className="p-2 text-muted-foreground">Laktat serum/darah vena. Re-ukur dalam 2 jam jika laktat awal &gt;2 mmol/L. Target laktat &lt;2 mmol/L sebagai tanda resusitasi adekuat.</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold text-center">2</td>
                  <td className="p-2 font-bold">🏺 Kultur Darah</td>
                  <td className="p-2 text-muted-foreground">Ambil 2 set kultur darah (aerob + anaerob) SEBELUM antibiotik. Kultur lain sesuai sumber. Jangan tunda AB lebih dari 45 menit.</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold text-center text-destructive">3</td>
                  <td className="p-2 font-bold text-destructive">💊 Antibiotik Broad-Spectrum</td>
                  <td className="p-2 text-muted-foreground">Berikan antibiotik empiris SEBELUM 1 jam (lebih cepat lebih baik). Pilih sesuai sumber dugaan, pola lokal, dan faktor risiko resistensi.</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold text-center">4</td>
                  <td className="p-2 font-bold">💧 Resusitasi Cairan</td>
                  <td className="p-2 text-muted-foreground">Kristaloid 30 mL/kg IV dalam 3 jam pertama jika hipotensi atau laktat ≥4 mmol/L. Nilai respons cairan sebelum bolus lanjutan.</td>
                </tr>
                <tr className="text-foreground">
                  <td className="p-2 font-bold text-center text-destructive">5</td>
                  <td className="p-2 font-bold text-destructive">💉 Vasopressor</td>
                  <td className="p-2 text-muted-foreground">Jika MAP &lt;65 selama/setelah resusitasi → mulai norepinefrin. Target MAP ≥65 mmHg (individualisasi: MAP ≥80 pada hipertensi kronik).</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Update SSC 2024 — Perubahan Penting</h3>
          <ul className="list-disc pl-5 mb-3 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">Cairan lebih restriktif:</strong> CLASSIC trial 2022: Resusitasi restriktif vs liberal → mortalitas tidak berbeda; liberal lebih banyak efek samping. Pertimbangkan guided resuscitation setelah stabilisasi awal [3, 4].</li>
            <li><strong className="text-foreground">Penekanan guided resuscitation:</strong> Gunakan dynamic predictor (PLR, VTI) — bukan CVP statik — untuk panduan pemberian cairan lanjutan [5].</li>
            <li><strong className="text-foreground">Laktat-guided therapy:</strong> Target normalisasi laktat (&lt;2 mmol/L) dalam 6 jam lebih baik daripada target ScvO₂ [6].</li>
            <li><strong className="text-foreground">Antibiotik de-eskalasi 48–72 jam:</strong> Setelah kultur tersedia → narrowing spectrum. Procalcitonin (PCT) membantu panduan durasi.</li>
            <li><strong className="text-foreground">Rekomendasi steroid diperketat:</strong> Hidrokortison hanya jika NE ≥0.25 μg/kg/mnt setelah resusitasi adekuat [3].</li>
          </ul>
        </Accordion>

        <Accordion title="📖 Antibiotik Empiris Sepsis — Berdasarkan Sumber Infeksi">
          <div className="p-2 bg-warning/10 border border-warning/30 rounded text-warning text-[11px] mb-3 font-semibold">
            ⚠️ Selalu sesuaikan dengan pola kuman & sensitivitas lokal (antibiogram institusi). Deeskalasi dalam 48–72 jam berdasarkan kultur.
          </div>
          
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Sumber Infeksi</th><th className="p-2">Pilihan AB Empiris Dewasa</th><th className="p-2">Alternatif/MRSA Risk</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Paru (CAP berat)</td>
                  <td className="p-2">Ceftriaxone + Azithromycin <em>atau</em> Moxifloxacin (monoterapi)</td>
                  <td className="p-2 text-muted-foreground">Jika MRSA risk: + Vancomycin</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Paru (HAP/VAP)</td>
                  <td className="p-2">Piperacillin-tazobactam <em>atau</em> Imipenem/Meropenem</td>
                  <td className="p-2 text-muted-foreground">+ Vancomycin/Linezolid (MRSA). Kolistin/Tigesiklin jika MDR.</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Abdomen</td>
                  <td className="p-2">Piperacillin-tazobactam <em>atau</em> Cefepime + Metronidazole</td>
                  <td className="p-2 text-muted-foreground">Meropenem jika risiko ESBL tinggi. + Flukonazol jika Candida risk.</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Saluran Kemih</td>
                  <td className="p-2">Ceftriaxone <em>atau</em> Ciprofloxacin</td>
                  <td className="p-2 text-muted-foreground">Meropenem jika ESBL. Pip-tazo jika Pseudomonas risk.</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Kulit/Jaringan Lunak</td>
                  <td className="p-2">Kloksasilin <em>atau</em> Ampicillin-sulbaktam</td>
                  <td className="p-2 text-muted-foreground">Necrotizing: + Klindamisin. MRSA: Vancomycin.</td>
                </tr>
                <tr className="text-foreground">
                  <td className="p-2 font-bold">Tidak jelas (unknown)</td>
                  <td className="p-2">Meropenem <em>atau</em> Piperacillin-tazobactam</td>
                  <td className="p-2 text-muted-foreground">+ Vancomycin jika risiko MRSA. + Flukonazol jika candida risk.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Faktor Risiko Resistensi</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">MRSA:</strong> Riwayat MRSA, rawat inap &gt;72 jam, dialisis, infeksi kulit, kolonisasi diketahui</li>
            <li><strong className="text-foreground">ESBL/KPC:</strong> Riwayat antibiotik sebelumnya, rawat inap berulang, kateter ureter</li>
            <li><strong className="text-foreground">Candida:</strong> Imunosupresi, TPN &gt;5 hari, profilaksis broad-spectrum berulang, HD</li>
            <li><strong className="text-foreground">Pseudomonas:</strong> Bronkiektasis, PPOK berat, immunocompromised, bronkoskopi recent</li>
          </ul>
        </Accordion>

        <Accordion title="📖 Vasopressor & Inotropik pada Sepsis">
          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Urutan Prioritas Vasopressor (SSC 2021)</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Obat</th><th className="p-2">Mekanisme</th><th className="p-2">Dosis</th><th className="p-2">Peran</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Norepinefrin (NE)</td>
                  <td className="p-2 text-muted-foreground">α₁ &gt; β₁ → vasokonstriksi + sedikit inotropik</td>
                  <td className="p-2">0.01–0.5 μg/kg/mnt</td>
                  <td className="p-2 font-bold text-destructive">VASOPRESSOR LINI PERTAMA</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Vasopressin (ADH)</td>
                  <td className="p-2 text-muted-foreground">V1 receptor → vasokonstriksi langsung</td>
                  <td className="p-2">0.03 unit/mnt (fixed)</td>
                  <td className="p-2 font-bold text-warning">Add-on jika NE &gt;0.25 (NE-sparing)</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Epinefrin</td>
                  <td className="p-2 text-muted-foreground">α₁ + β₁ + β₂ → vasopresor + inotropik kuat</td>
                  <td className="p-2">0.01–0.5 μg/kg/mnt</td>
                  <td className="p-2 text-muted-foreground">Lini ketiga. ⚠ ↑ laktat</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold text-muted-foreground line-through">Dopamin</td>
                  <td className="p-2 text-muted-foreground">Dose-dependent</td>
                  <td className="p-2 text-muted-foreground">—</td>
                  <td className="p-2 font-bold text-destructive">TIDAK DIREKOMENDASIKAN rutin</td>
                </tr>
                <tr className="text-foreground">
                  <td className="p-2 font-bold">Dobutamin</td>
                  <td className="p-2 text-muted-foreground">β₁ &gt;&gt; β₂ → inotropik + vasodilasi ringan</td>
                  <td className="p-2">2.5–20 μg/kg/mnt</td>
                  <td className="p-2 text-muted-foreground">Jika disfungsi miokard (CO rendah)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Target Hemodinamik & Steroid</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">MAP Target:</strong> ≥65 mmHg sebagai minimum. Pertimbangkan MAP ≥80 pada hipertensi kronik (SEPSISPAM trial).</li>
            <li><strong className="text-foreground">Akses Vasopressor:</strong> SSC 2021: Boleh via vena perifer besar (antekubital) hingga 1–2 jam sebelum CVC terpasang jika darurat.</li>
            <li><strong className="text-foreground">Kortikosteroid (Hidrokortison):</strong> Indikasi pada syok septik refrakter (NE ≥0.25 μg/kg/mnt). Dosis: 200 mg/hari (infus kontinu atau 50 mg/6 jam). Memperpendek waktu syok, though survival benefit debated.</li>
          </ul>
        </Accordion>
        
        <Accordion title="📖 Sepsis di Indonesia — Panduan & Konteks Lokal">
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-foreground text-[12px] mb-3">
            <strong className="text-primary block mb-1">Tantangan Khas Sepsis di Indonesia</strong>
            <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground m-0">
              <li><strong className="text-foreground">Keterlambatan diagnosis:</strong> Rata-rata 4–8 jam dari IGD ke ICU. Edukasi qSOFA dan NEWS-2 sangat krusial.</li>
              <li><strong className="text-foreground">Ketersediaan kultur:</strong> Banyak RS belum memiliki fasilitas kultur memadai. Mulai empiris berdasarkan panduan nasional, de-eskalasi berdasar klinis jika kultur tidak ada.</li>
              <li><strong className="text-foreground">Pola resistensi:</strong> ESBL sangat tinggi (&gt;60–80%). Carbapenem empiris sering harus digunakan lebih dini pada HA-Sepsis.</li>
              <li><strong className="text-foreground">Vasopresor perifer:</strong> Pada IGD tanpa CVC, penggunaan Norepinefrin perifer short-term (&lt;6 jam) sering dipraktekkan (didukung SSC 2021 as bridging).</li>
            </ul>
          </div>
        </Accordion>

        <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-bold text-[14px] text-foreground mb-3 flex items-center gap-2">
            📚 Referensi Utama
          </h3>
          <ul className="list-decimal pl-5 space-y-2 text-muted-foreground text-[12px]">
            <li>Singer M, et al. The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3). <em>JAMA</em>. 2016.</li>
            <li>PPK Sepsis PERDICI/PAPDI. <em>Pedoman Nasional Pelayanan Kedokteran Tata Laksana Sepsis</em>. 2022.</li>
            <li>Evans L, et al. Surviving sepsis campaign: international guidelines for management of sepsis and septic shock 2021. <em>Intensive Care Med</em>. 2021.</li>
            <li>Hjortrup PB, et al. Restricting volumes of resuscitation fluid in adults with septic shock after initial management: the CLASSIC randomised, parallel-group, multicentre feasibility trial. <em>Intensive Care Med</em>. 2016.</li>
            <li>Hernández G, et al. Effect of a Resuscitation Strategy Targeting Peripheral Perfusion Status vs Serum Lactate Levels on 28-Day Mortality Among Patients With Septic Shock: The ANDROMEDA-SHOCK Randomized Clinical Trial. <em>JAMA</em>. 2019.</li>
            <li>Timsit JF, et al. Update on blood infection diagnosis and management. <em>Intensive Care Med</em>. 2020.</li>
            <li>Seymour CW, et al. Assessment of Clinical Criteria for Sepsis: For the Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3). <em>JAMA</em>. 2016.</li>
          </ul>
        </div>
      </div>
  );
}
