import { Accordion } from '../../components/ui/Accordion';
import { AbbrLegend } from '../../components/ui/AbbrLegend';
import { FERREIRA_INITIAL_SOFA } from '../../utils/sofa';

export default function TeoriSepsis() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 pb-20 overflow-x-hidden">
      <div className="bg-white dark:bg-[var(--dk-surface-1)] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
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
          <p className="mt-2 text-[11px] opacity-80 text-muted-foreground"><em>Berdasarkan Sepsis-3 (JAMA 2016) dan Surviving Sepsis Campaign 2021; PNPK Tata Laksana Sepsis Kemenkes 2017 masih berbasis SSC 2012, sehingga sebagian rekomendasinya sudah diperbarui [1, 2, 3].</em></p>
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
          <p className="text-[12px] text-muted-foreground mb-4"><strong className="text-foreground">Limitasi qSOFA:</strong> sensitivitas rendah. SSC 2021 <strong>merekomendasikan tidak memakai qSOFA sebagai alat skrining tunggal</strong> dibanding SIRS, NEWS, atau MEWS (rekomendasi kuat). qSOFA tetap berguna sebagai penanda risiko kematian [3].</p>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">SOFA Score — Konfirmasi Disfungsi Organ di ICU</h3>
          <p className="text-[12px] text-muted-foreground mb-2">Buka Tab <strong className="text-foreground">Skoring → SOFA Score</strong> untuk melakukan kalkulasi SOFA Score secara otomatis.</p>
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-foreground text-[12px] mb-3">
            <strong className="text-primary block mb-1">Interpretasi SOFA:</strong>
            <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">SOFA ≥2 akut</strong> dari baseline = definisi sepsis.</li>
              <li><strong className="text-foreground">ΔSOFA ≥2</strong> dalam 24 jam = memburuk.</li>
              <li><strong>Mortalitas menurut SOFA awal (Ferreira 2001, sama dengan kalkulator SOFA):</strong> {FERREIRA_INITIAL_SOFA.map((b) => `${b.range}: ${b.mortality}`).join(' · ')}</li>
            </ul>
          </div>
        </Accordion>

        <Accordion title="⏱️ Sepsis Bundle — Hour-1 Bundle (SSC 2018) & SSC 2021">
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-foreground mb-4">
            <div className="font-bold text-[14px] text-destructive mb-2 flex items-center gap-2">
              <span className="text-xl">⏳</span> Hour-1 Bundle (Levy, SSC 2018) — MULAI DALAM 1 JAM PERTAMA
            </div>
            <p className="text-[12px] text-muted-foreground">Pada syok septik, tiap jam penundaan antibiotik berhubungan dengan mortalitas lebih tinggi (Kumar 2006: ±7,6%/jam; Seymour 2017: OR 1,04 per jam untuk penyelesaian bundle). Mulai segera setelah sepsis dicurigai di IGD atau ICU [6, 9, 10].</p>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex gap-3 items-start p-3 bg-muted/30 border border-border rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold">1</div>
              <div>
                <h4 className="font-bold text-[13px] text-foreground mb-1">Ukur Laktat</h4>
                <p className="text-[12px] text-muted-foreground">Ukur laktat serum awal. <strong>Target &lt; 2 mmol/L</strong>. Jika &gt; 2 mmol/L, wajib re-ukur dalam 2-4 jam untuk memantau respons resusitasi (lactate clearance).</p>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-muted/30 border border-border rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold">2</div>
              <div>
                <h4 className="font-bold text-[13px] text-foreground mb-1">Ambil Kultur Darah</h4>
                <p className="text-[12px] text-muted-foreground">Ambil minimal 2 set (aerob & anaerob) <strong>SEBELUM</strong> pemberian antibiotik. Jangan menunda antibiotik &gt; 45 menit hanya untuk menunggu kultur.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-destructive/20 text-destructive flex items-center justify-center shrink-0 font-bold">3</div>
              <div>
                <h4 className="font-bold text-[13px] text-destructive mb-1">Berikan Antibiotik Broad-Spectrum</h4>
                <p className="text-[12px] text-muted-foreground">Intervensi paling krusial. SSC 2021: <strong>≤1 jam</strong> bila kemungkinan syok septik atau sepsis <em>probable</em>; bila sepsis hanya <em>possible</em> tanpa syok → penilaian cepat, beri dalam <strong>≤3 jam</strong> bila kecurigaan infeksi menetap. Pilih spektrum luas (mis. Pip-tazo, Meropenem) lalu de-eskalasi sesuai kultur [3].</p>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold">4</div>
              <div>
                <h4 className="font-bold text-[13px] text-blue-600 dark:text-blue-400 mb-1">Resusitasi Cairan 30 mL/kgBB</h4>
                <p className="text-[12px] text-muted-foreground">Kristaloid ≥30 mL/kgBB dalam 3 jam pertama bila hipoperfusi akibat sepsis (hipotensi atau laktat ≥4 mmol/L) — SSC 2021, rekomendasi lemah. <strong>Kristaloid seimbang (RL/Ringer asetat) disarankan dibanding NaCl 0,9%</strong>. Nilai respons cairan setelah dosis awal; jangan diberikan membabi buta pada pasien stabil [3].</p>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold">5</div>
              <div>
                <h4 className="font-bold text-[13px] text-amber-600 dark:text-amber-400 mb-1">Mulai Vasopressor</h4>
                <p className="text-[12px] text-muted-foreground">Jika MAP tetap &lt; 65 mmHg selama atau setelah resusitasi cairan, segera mulai <strong>Norepinefrin</strong>. Jangan tunggu cairan 30cc/kg habis jika syok sangat berat.</p>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Update SSC & Panduan Resusitasi Terkini</h3>
          <ul className="list-disc pl-5 mb-3 space-y-2 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">Restriktif vs standar/liberal:</strong> CLASSIC 2022 (syok septik, setelah resusitasi awal) — mortalitas 90 hari tidak berbeda (42,3% vs 42,1%), efek samping serius juga tidak berbeda; CLOVERS 2023 (hipotensi akibat sepsis) — strategi restriktif vs liberal juga tidak berbeda mortalitasnya. Hindari overload cairan dan nilai kebutuhan secara individual [7, 11].</li>
            <li><strong className="text-foreground">Dynamic Fluid Responsiveness:</strong> Gunakan parameter dinamis (PLR - <em>Passive Leg Raise</em>, VTI di Ekokardiografi, Pulse Pressure Variation) — <strong>jangan gunakan CVP statik</strong> — untuk memandu pemberian cairan lanjutan setelah dosis inisial.</li>
            <li><strong className="text-foreground">Capillary Refill Time (CRT):</strong> ANDROMEDA-SHOCK (2019) — resusitasi yang menargetkan normalisasi CRT (≤3 detik) vs penurunan laktat: mortalitas 28 hari 34,9% vs 43,4% (P=0,06, tidak bermakna), disfungsi organ 72 jam lebih rendah. CRT praktis di bedside dan dapat dinilai tiap 30 menit [5].</li>
            <li><strong className="text-foreground">Kortikosteroid:</strong> Hidrokortison 200 mg/hari IV disarankan pada syok septik yang tetap butuh vasopresor — norepinefrin/epinefrin ≥0,25 μg/kg/mnt selama ≥4 jam (SSC 2021, rekomendasi lemah) [3].</li>
          </ul>
        </Accordion>

        <Accordion title="📖 Antibiotik Empiris Sepsis — Berdasarkan Sumber Infeksi">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded text-amber-600 dark:text-amber-400 text-[11px] mb-3 font-semibold">
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
                  <td className="p-2">β-laktam (Ceftriaxone/Cefotaxime/Ampicillin-sulbaktam) + Azithromycin, <em>atau</em> β-laktam + fluorokuinolon respirasi (Levofloxacin/Moxifloxacin) — ATS/IDSA 2019 [12]</td>
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
                  <td className="p-2 text-muted-foreground">Meropenem jika risiko ESBL tinggi. Risiko Candida invasif pada pasien kritis: + ekinokandin (flukonazol hanya bila stabil & risiko resistensi azol rendah) [13].</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Saluran Kemih</td>
                  <td className="p-2">Ceftriaxone <em>atau</em> Ciprofloxacin</td>
                  <td className="p-2 text-muted-foreground">Meropenem jika ESBL. Pip-tazo jika Pseudomonas risk.</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Kulit/Jaringan Lunak</td>
                  <td className="p-2">Kloksasilin <em>atau</em> Ampicillin-sulbaktam</td>
                  <td className="p-2 text-muted-foreground">Nekrotikans: debridemen bedah segera + Vancomycin + Pip-tazo/Meropenem + Klindamisin (IDSA 2014) [14]. MRSA: Vancomycin.</td>
                </tr>
                <tr className="text-foreground">
                  <td className="p-2 font-bold">Tidak jelas (unknown)</td>
                  <td className="p-2">Meropenem <em>atau</em> Piperacillin-tazobactam</td>
                  <td className="p-2 text-muted-foreground">+ Vancomycin jika risiko MRSA. + Ekinokandin jika risiko Candida invasif [13].</td>
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
                  <td className="p-2 font-bold text-amber-600 dark:text-amber-400">Add-on jika NE &gt;0.25 (NE-sparing)</td>
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
            <li><strong className="text-foreground">MAP Target:</strong> awal ≥65 mmHg (SSC 2021, kuat). SEPSISPAM: target 80–85 vs 65–70 tidak menurunkan mortalitas; pada hipertensi kronik kebutuhan RRT lebih sedikit tetapi fibrilasi atrium lebih sering — individualisasi. Pada usia ≥65 tahun, target permisif 60–65 tidak lebih buruk (uji 65, JAMA 2020) [8, 15].</li>
            <li><strong className="text-foreground">Akses Vasopressor:</strong> SSC 2021 menyarankan memulai vasopresor lewat vena perifer daripada menunda sampai CVC terpasang — untuk waktu singkat, di vena proksimal dari fossa antekubiti, dengan pemantauan ekstravasasi; pasang CVC sesegera praktis [3].</li>
            <li><strong className="text-foreground">Kortikosteroid (Hidrokortison):</strong> syok septik dengan kebutuhan NE/epinefrin ≥0,25 μg/kg/mnt ≥4 jam. Dosis: 200 mg/hari (infus kontinu atau 50 mg/6 jam). Mempercepat resolusi syok; manfaat mortalitas tidak konsisten antar-RCT (ADRENAL vs APROCCHSS) [3].</li>
          </ul>
        </Accordion>
        
        <Accordion title="📖 Sepsis di Indonesia — Panduan & Konteks Lokal">
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-foreground text-[12px] mb-3">
            <strong className="text-primary block mb-1">Tantangan Khas Sepsis di Indonesia</strong>
            <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground m-0">
              <li><strong className="text-foreground">Keterlambatan diagnosis & rujukan:</strong> pengenalan dini dengan alat skrining (NEWS/SIRS, bukan qSOFA tunggal) dan jalur cepat IGD→ICU sangat krusial.</li>
              <li><strong className="text-foreground">Ketersediaan kultur:</strong> Banyak RS belum memiliki fasilitas kultur memadai. Mulai empiris berdasarkan panduan nasional, de-eskalasi berdasar klinis jika kultur tidak ada.</li>
              <li><strong className="text-foreground">Pola resistensi:</strong> prevalensi ESBL di banyak RS Indonesia tinggi — dasarkan pilihan empiris (termasuk kapan karbapenem diperlukan) pada antibiogram lokal.</li>
              <li><strong className="text-foreground">Vasopresor perifer:</strong> pada IGD tanpa CVC, norepinefrin perifer jangka pendek sebagai jembatan didukung SSC 2021 (vena proksimal, pantau ekstravasasi).</li>
            </ul>
          </div>
          
          <div className="p-3 bg-muted/30 border border-border rounded-lg text-foreground text-[12px] mt-4">
            <strong className="text-foreground block mb-1">Konteks Historis: Mengapa SIRS dan Bundle 3-Jam/6-Jam Ditinggalkan?</strong>
            <p className="text-muted-foreground mb-2">Sebelum 2018, SSC menggunakan bundle 3-jam dan 6-jam, dan Sepsis didefinisikan dengan kriteria SIRS (Systemic Inflammatory Response Syndrome).</p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li><strong className="text-foreground">SIRS Terlalu Sensitif:</strong> Hampir semua pasien infeksi memenuhi kriteria SIRS, namun banyak yang tidak mengalami syok atau kematian. SOFA lebih baik dalam memprediksi mortalitas.</li>
              <li><strong className="text-foreground">Hour-1 Bundle (2018):</strong> bundle 3 dan 6 jam digabung menjadi 1 jam berdasarkan data bahwa penundaan antibiotik berhubungan dengan kematian. Karena kekhawatiran pemberian antibiotik berlebihan pada pasien yang belum pasti sepsis, SSC 2021 membedakan waktu antibiotik (≤1 jam vs ≤3 jam) menurut kemungkinan sepsis dan ada/tidaknya syok [3, 6].</li>
            </ul>
          </div>
        </Accordion>

        <AbbrLegend terms={['SOFA', 'qSOFA', 'MAP', 'SIRS', 'NEWS', 'MEWS', 'GCS', 'RR', 'SBP', 'SSC', 'IGD', 'ICU', 'CRT', 'PLR', 'PPV', 'VTI', 'CVP', 'AKI', 'NE', 'CVC', 'RRT', 'CO', 'CAP', 'HAP', 'VAP', 'MRSA', 'MDR', 'ESBL', 'KPC', 'TPN', 'HD', 'PPOK', 'ATS', 'IDSA', 'PNPK', 'RS', 'RCT', 'ADH']} />

        <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-bold text-[14px] text-foreground mb-3 flex items-center gap-2">
            📚 Referensi Utama
          </h3>
          <ul className="list-decimal pl-5 space-y-2 text-muted-foreground text-[12px]">
            <li>Singer M, et al. The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3). <em>JAMA</em>. 2016;315:801.</li>
            <li>Kementerian Kesehatan RI. Pedoman Nasional Pelayanan Kedokteran Tata Laksana Sepsis (KMK No. HK.01.07/MENKES/342/2017).</li>
            <li>Evans L, et al. Surviving sepsis campaign: international guidelines for management of sepsis and septic shock 2021. <em>Intensive Care Med</em>. 2021;47:1181.</li>
            <li>Ferreira FL, et al. Serial evaluation of the SOFA score to predict outcome in critically ill patients. <em>JAMA</em>. 2001;286:1754.</li>
            <li>Hernández G, et al. Effect of a Resuscitation Strategy Targeting Peripheral Perfusion Status vs Serum Lactate Levels on 28-Day Mortality Among Patients With Septic Shock: The ANDROMEDA-SHOCK Randomized Clinical Trial. <em>JAMA</em>. 2019;321:654.</li>
            <li>Levy MM, et al. The Surviving Sepsis Campaign Bundle: 2018 update. <em>Intensive Care Med</em>. 2018;44:925.</li>
            <li>Meyhoff TS, et al. Restriction of Intravenous Fluid in ICU Patients with Septic Shock (CLASSIC). <em>N Engl J Med</em>. 2022;386:2459.</li>
            <li>Asfar P, et al. High versus low blood-pressure target in patients with septic shock (SEPSISPAM). <em>N Engl J Med</em>. 2014;370:1583.</li>
            <li>Kumar A, et al. Duration of hypotension before initiation of effective antimicrobial therapy is the critical determinant of survival in human septic shock. <em>Crit Care Med</em>. 2006;34:1589.</li>
            <li>Seymour CW, et al. Time to treatment and mortality during mandated emergency care for sepsis. <em>N Engl J Med</em>. 2017;376:2235.</li>
            <li>Shapiro NI, et al. Early restrictive or liberal fluid management for sepsis-induced hypotension (CLOVERS). <em>N Engl J Med</em>. 2023;388:499.</li>
            <li>Metlay JP, et al. Diagnosis and treatment of adults with community-acquired pneumonia: ATS/IDSA guideline. <em>Am J Respir Crit Care Med</em>. 2019;200:e45.</li>
            <li>Pappas PG, et al. Clinical practice guideline for the management of candidiasis: 2016 update by IDSA. <em>Clin Infect Dis</em>. 2016;62:e1.</li>
            <li>Stevens DL, et al. Practice guidelines for the diagnosis and management of skin and soft tissue infections: 2014 update by IDSA. <em>Clin Infect Dis</em>. 2014;59:e10.</li>
            <li>Lamontagne F, et al. Effect of reduced exposure to vasopressors on 90-day mortality in older critically ill patients with vasodilatory hypotension (65 trial). <em>JAMA</em>. 2020;323:938.</li>
          </ul>
        </div>
      </div>
  );
}
