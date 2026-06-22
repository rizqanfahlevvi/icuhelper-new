import { Accordion } from '../../components/ui/Accordion';

export default function TeoriAirway() {
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 mb-2">
          5 Pertanyaan Sebelum Intubasi — Pre-Intubation Decision Framework
        </h1>
        
        <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg text-foreground mb-4 text-[13px]">
          <div className="font-bold text-[15px] mb-2 text-teal-600 dark:text-teal-400">Framework 5 Pertanyaan — Jawab Ini Sebelum Setiap Intubasi</div>
          <p>Framework ini membantu klinisi membuat keputusan terstruktur sebelum intubasi, mengurangi kesalahan sistemik dan meningkatkan <em>first-pass success rate</em>. Berlaku untuk semua setting: ICU, IGD, dan bangsal.</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1 font-semibold text-foreground">
            <li>Apakah intubasi benar-benar diperlukan?</li>
            <li>Apakah airway sulit?</li>
            <li>Bagaimana kondisi fisiologis pasien?</li>
            <li>Apa rencana utama?</li>
            <li>Apa rencana cadangan?</li>
          </ol>
        </div>

        </div>

        <Accordion title="❓ Pertanyaan 1 — Apakah Intubasi Benar-Benar Diperlukan?" defaultOpen={true}>
          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">5 Indikasi Intubasi (Walls, 6th ed. 2023) [1]</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Indikasi</th><th className="p-2">Contoh Klinis</th><th className="p-2">Catatan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold whitespace-nowrap">1. Failure to maintain airway patency</td>
                  <td className="p-2 text-muted-foreground">GCS ≤8, stridor berat, obstruksi mekanik (tumor, abses leher), angioedema progresif</td>
                  <td className="p-2">Posisi lateral/prone dulu jika masih ada refleks. Intubasi segera bila obstruksi parsial memburuk.</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold whitespace-nowrap">2. Failure to protect airway</td>
                  <td className="p-2 text-muted-foreground">Gag reflex hilang, aspirasi aktif, muntah berulang tanpa kontrol, GCS &lt;8 dengan banyak sekret</td>
                  <td className="p-2">Suction dulu, pertimbangkan NGT. Bukan indikasi mutlak bila pasien masih bisa batuk efektif.</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold whitespace-nowrap">3. Failure to ventilate</td>
                  <td className="p-2 text-muted-foreground">PCO₂ ↑ progresif meski NIV, respiratory exhaustion (RR &gt;35 + fatigue), pH &lt;7.20 hiperkapnia</td>
                  <td className="p-2">Trial NIV 1–2 jam pada PPOK (pH 7.25–7.35). Gagal atau memburuk → intubasi segera.</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold whitespace-nowrap">4. Failure to oxygenate</td>
                  <td className="p-2 text-muted-foreground">SpO₂ &lt;90% meski HFNC/NIV maksimal, P/F &lt;100–150 refrakter, ARDS berat</td>
                  <td className="p-2">Trial NIV/HFNC pada ARDS ringan-sedang. P/F &lt;150 dengan NIV tidak membaik 1–2 jam → intubasi.</td>
                </tr>
                <tr className="text-foreground">
                  <td className="p-2 font-bold whitespace-nowrap">5. Anticipated deterioration</td>
                  <td className="p-2 text-muted-foreground">GBS dengan VC &lt;20 mL/kg, trauma inhalasi, epiglottitis, angioedema progresif, luka bakar wajah/leher</td>
                  <td className="p-2">Intubasi elektif selagi mudah jauh lebih aman dari emergensi saat jalan napas sudah kritis.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Kapan Pertimbangkan Alternatif Dulu?</h3>
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Kondisi</th><th className="p-2">Alternatif Pertama</th><th className="p-2">Batas Waktu Trial</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 text-muted-foreground">SpO₂ 90–95%, usaha napas sedang</td>
                  <td className="p-2">HFNC 40–60 L/mnt FiO₂ 0,6–1,0</td>
                  <td className="p-2">1–2 jam; evaluasi ROX index (≥4,88 = baik)</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 text-muted-foreground">Eksaserbasi PPOK, pH 7,25–7,35</td>
                  <td className="p-2">NIV BiPAP (IPAP 14–18, EPAP 4–6)</td>
                  <td className="p-2">1–2 jam; bila pH tidak membaik → intubasi</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 text-muted-foreground">Edema paru kardiogenik</td>
                  <td className="p-2">NIV CPAP 5–10 cmH₂O atau BiPAP</td>
                  <td className="p-2">30–60 menit; SpO₂ &lt;88% persisten → intubasi</td>
                </tr>
                <tr className="text-foreground">
                  <td className="p-2 text-muted-foreground">Imunokompromis + infiltrat paru</td>
                  <td className="p-2">HFNC atau NIV (hindari intubasi bila bisa)</td>
                  <td className="p-2 text-destructive">Ketat — mortalitas tinggi bila terintubasi</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg text-warning text-[12px] mb-3">
            <strong>⚠ Kontraindikasi Relatif NIV:</strong> Kesadaran menurun tidak kooperatif · Vomiting aktif · Obstruksi mekanik · Perdarahan aktif saluran napas · Tidak mampu melindungi airway
          </div>
        </Accordion>

        <Accordion title="❓ Pertanyaan 2 — Apakah Airway Sulit? (LEMON Assessment)">
          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">LEMON — Penilaian Sistematis Airway Sulit</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2 w-8">Huruf</th><th className="p-2">Kriteria</th><th className="p-2">Cara Penilaian</th><th className="p-2">Prediksi Sulit Bila...</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold text-center text-primary bg-primary/5">L</td>
                  <td className="p-2 font-bold whitespace-nowrap">Look externally</td>
                  <td className="p-2 text-muted-foreground">Amati wajah, leher, mulut, proporsi tubuh</td>
                  <td className="p-2">Trauma wajah/leher, obesitas morbid (BMI &gt;40), janggut tebal, leher pendek/tebal, trismus, deformitas kongenital</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold text-center text-primary bg-primary/5">E</td>
                  <td className="p-2 font-bold whitespace-nowrap">Evaluate 3-3-2 rule</td>
                  <td className="p-2 text-muted-foreground">Hitung dengan lebar jari pemeriksa:<br/>· Jarak interincisor (buka mulut)<br/>· Chin-to-hyoid (dagu ke os hyoid)<br/>· Thyroid-to-mouth floor (kartilago tiroid ke dasar mulut)</td>
                  <td className="p-2">&lt;3 jari interincisor · &lt;3 jari chin-to-hyoid · &lt;2 jari thyroid-to-mouth floor</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold text-center text-primary bg-primary/5">M</td>
                  <td className="p-2 font-bold whitespace-nowrap">Mallampati score</td>
                  <td className="p-2 text-muted-foreground">Posisi duduk, buka mulut maksimal, lidah menjulur, tanpa fonasi. Nilai struktur yang terlihat.</td>
                  <td className="p-2">Kelas III atau IV (lihat tabel Mallampati)</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold text-center text-primary bg-primary/5">O</td>
                  <td className="p-2 font-bold whitespace-nowrap">Obstruction / Obesity</td>
                  <td className="p-2 text-muted-foreground">Inspeksi, palpasi, auskultasi leher. Tanya riwayat stridor.</td>
                  <td className="p-2">Abses peritonsilar/retrofaring, angioedema, epiglottitis, tumor leher, stridor, BMI &gt;40</td>
                </tr>
                <tr className="text-foreground">
                  <td className="p-2 font-bold text-center text-primary bg-primary/5">N</td>
                  <td className="p-2 font-bold whitespace-nowrap">Neck mobility</td>
                  <td className="p-2 text-muted-foreground">Minta fleksi + ekstensi maksimal kepala. Normal: ekstensi 35°+.</td>
                  <td className="p-2">Rigid, spondylosis servikal berat, cervical collar/halo, obese neck, fibrosis pasca radioterapi</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Mallampati Classification</h3>
              <table className="w-full text-left border-collapse text-[12px] mb-3">
                <thead><tr className="bg-muted text-muted-foreground border-b border-border"><th className="p-1">Kelas</th><th className="p-1">Struktur Terlihat</th><th className="p-1">Implikasi Laryngoskopi</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border text-foreground"><td className="p-1 font-bold">I</td><td className="p-1 text-muted-foreground">Uvula, tonsil, palatum mole, palatum durum terlihat penuh</td><td className="p-1 text-success">Mudah — Cormack-Lehane I/II hampir pasti</td></tr>
                  <tr className="border-b border-border text-foreground"><td className="p-1 font-bold">II</td><td className="p-1 text-muted-foreground">Uvula, palatum mole &amp; durum terlihat; tonsil tertutup sebagian</td><td className="p-1 text-success">Umumnya mudah</td></tr>
                  <tr className="border-b border-border text-foreground"><td className="p-1 font-bold">III</td><td className="p-1 text-muted-foreground">Hanya dasar uvula dan palatum mole terlihat</td><td className="p-1 text-warning">Kemungkinan sulit — pertimbangkan VL atau bougie</td></tr>
                  <tr className="text-foreground"><td className="p-1 font-bold">IV</td><td className="p-1 text-muted-foreground">Hanya palatum durum terlihat, uvula tidak terlihat sama sekali</td><td className="p-1 text-destructive">Diprediksi sulit — VL atau awake intubation</td></tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Interpretasi LEMON — Implikasi Klinis</h3>
              <table className="w-full text-left border-collapse text-[12px]">
                <thead><tr className="bg-muted text-muted-foreground border-b border-border"><th className="p-1">Jumlah Kriteria Positif</th><th className="p-1">Strategi yang Direkomendasikan</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border text-foreground"><td className="p-1 font-bold text-success">0–1 positif</td><td className="p-1">Airway diprediksi mudah — DL atau VL, pilih sesuai ketersediaan dan preferensi operator</td></tr>
                  <tr className="border-b border-border text-foreground"><td className="p-1 font-bold text-warning">2–3 positif</td><td className="p-1">Airway diprediksi sulit — <strong>VL sebagai pilihan utama</strong>, siapkan bougie, backup SGA</td></tr>
                  <tr className="text-foreground"><td className="p-1 font-bold text-destructive">4–5 positif</td><td className="p-1">Airway sangat sulit — pertimbangkan <strong>awake intubation</strong>, alert spesialis/anestesi, siapkan surgical airway</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-foreground text-[12px] mb-3">
            Tidak ada alat prediksi tunggal yang sempurna. LEMON digunakan sebagai <em>gestalt</em> klinis — satu kriteria sangat positif (misal angioedema masif) sudah cukup untuk mengubah strategi. [4, 5, 2]
          </div>
        </Accordion>

        <Accordion title="❓ Pertanyaan 3 — Kondisi Fisiologis Pasien (Pre-Intubation Optimization)">
          <div className="mb-3">
            <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">"The Physiologically Difficult Airway"</h3>
            <p className="text-[13px] text-muted-foreground">Bukan hanya tentang anatomi — pasien dengan cadangan fisiologis terbatas berisiko tinggi mengalami kardiovaskular kolaps pasca induksi. Identifikasi dan optimasi <strong>sebelum</strong> memberikan obat.</p>
          </div>

          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Domain</th><th className="p-2">Masalah</th><th className="p-2">Optimasi Sebelum Intubasi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Oksigenasi</td>
                  <td className="p-2 text-destructive">SpO₂ &lt;93% baseline</td>
                  <td className="p-2 text-muted-foreground">
                    <ul className="list-disc pl-4 space-y-1">
                      <li><strong>Head up 20–25°</strong> (semua pasien, kecuali kontraindikasi)</li>
                      <li><strong>NIV BiPAP/CPAP</strong> — superior vs HFNC untuk mencegah desaturasi (FLORALI-2, <em>Lancet Respir Med</em> 2019;7:e26; meta-analisis 11 RCT, <em>Frontiers Med</em> 2024)</li>
                      <li><strong>HFNC 60 L/mnt FiO₂ 100%</strong> bila NIV tidak toleran</li>
                      <li><strong>Apneic oxygenation</strong> via nasal kanul 15 L/mnt selama prosedur laryngoskopi</li>
                    </ul>
                  </td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Hemodinamik</td>
                  <td className="p-2 text-destructive">MAP &lt;65 mmHg atau hipotensi relatif</td>
                  <td className="p-2 text-muted-foreground">
                    <ul className="list-disc pl-4 space-y-1">
                      <li><strong>Push-dose epinefrin</strong> 10–20 mcg IV bolus tiap 2–5 mnt (encerkan 1 mg/10 mL → 0,1 mg/mL; ambil 0,1–0,2 mL lalu encerkan lagi bila perlu) — manfaat BP ada, outcome mortality masih kontroversial (2024 meta-analysis)</li>
                      <li><strong>Push-dose efedrin</strong> 5–10 mg IV sebagai alternatif</li>
                      <li><strong>Norepinefrin</strong> 0,1–0,3 mcg/kg/mnt dimulai sebelum induksi bila hipotensi jelas</li>
                      <li>Bolus cairan 250–500 mL sebelum induksi bila hypovolemia nyata</li>
                    </ul>
                  </td>
                </tr>
                <tr className="text-foreground">
                  <td className="p-2 font-bold">Metabolik</td>
                  <td className="p-2 text-warning">pH &lt;7,1 + PCO₂ &lt;35 (asidosis metabolik terkompensasi)</td>
                  <td className="p-2 text-muted-foreground">
                    <ul className="list-disc pl-4 space-y-1">
                      <li><strong>NaHCO₃ 100 mEq IV</strong> slow infusion sebelum intubasi</li>
                      <li>Pasca intubasi: <strong>pertahankan minute ventilation</strong> (RR × VT) sesuai pre-intubasi — jangan biarkan RR turun mendadak pada asidosis metabolik terkompensasi (hilangnya kompensasi respiratorik → pH jatuh drastis)</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-[12px] mb-3">
            <strong>⚠ Jangan mengintubasi pasien hipotensi yang belum diresusitasi.</strong> Induksi anestesi menghilangkan tonus simpatis → vasodilatasi masif → cardiac arrest pada pasien dengan cadangan rendah. Mulai vasopressor atau berikan bolus cairan dahulu [6, 7].
          </div>
        </Accordion>

        <Accordion title="❓ Pertanyaan 4 — Rencana Utama">
          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Elemen Rencana Utama</h3>
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2 w-1/4">Elemen</th><th className="p-2">Pertimbangan & Rekomendasi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Operator</td>
                  <td className="p-2 text-muted-foreground">Siapa yang memiliki <em>first-pass success rate</em> tertinggi di ruangan? Jika ada perbedaan pengalaman, operator senior yang memimpin.</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Teknik laryngoskopi</td>
                  <td className="p-2 text-muted-foreground">
                    <strong>Video laryngoscopy (VL)</strong> sebagai default pilihan pertama — meta-analisis terbaru (Araújo et al. <em>Critical Care</em> 2024): VL secara konsisten memberikan first-pass success lebih tinggi dan intubasi esofagus lebih rendah vs direct laryngoscopy (DL) di ICU.<br/>
                    DL bila VL tidak tersedia atau kontraindikasi.
                  </td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Posisi pasien</td>
                  <td className="p-2 text-muted-foreground"><strong>Ear-to-sternal-notch alignment</strong> — daun telinga sejajar sternal notch (lurus horizontal). Pada obesitas: gunakan ramping position dengan bantal/selimut di bawah bahu-kepala. Head up 20–25°.</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Teknik RSI</td>
                  <td className="p-2 text-muted-foreground">
                    <strong>RSI Standard:</strong> Fentanyl 1–3 mcg/kg IV → (ketamine 1–2 mg/kg <em>atau</em> etomidate 0,3 mg/kg) → suksinilkolin 1,5 mg/kg <em>atau</em> rocuronium 1,2 mg/kg<br/>
                    <strong>RSI Modifikasi:</strong> Tanpa NMB bila kontraindikasi (hiperkalsemia, cedera medula spinalis &gt;72 jam, rhabdomiolisis, hiperkalemia berat untuk suksinilkolin)<br/>
                    <strong>Awake intubation:</strong> Bila predicted very difficult airway — topikalisasi lidokain, sedasi minimal, pasien kooperatif
                  </td>
                </tr>
                <tr className="text-foreground">
                  <td className="p-2 font-bold">Equipment checklist</td>
                  <td className="p-2 text-muted-foreground">Laryngoscope (ukuran blade sesuai) · ETT 7,0–8,0 (laki-laki) / 6,5–7,5 (perempuan) · Stylet/bougie SELALU siap · BVM + PEEP valve · Suction aktif · Syringe cuff · Magill forceps · Konfirmasi: ETCO₂ + capnografi</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-foreground text-[12px] mb-3">
            <strong>First-pass success &gt;95%</strong> dikaitkan dengan penurunan mortalitas in-hospital. Setiap attempt tambahan meningkatkan risiko komplikasi: desaturasi, trauma, edema, cardiac arrest [2, 8, 9].
          </div>
        </Accordion>

        <Accordion title="❓ Pertanyaan 5 — Rencana Cadangan (Failed Airway & CICO)">
          <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-[13px] mb-4">
            <div className="font-bold mb-1">Definisi Failed Airway</div>
            <ul className="list-disc pl-5 m-0 space-y-0.5">
              <li>≥3 usaha intubasi oleh operator terbaik yang tersedia, ATAU</li>
              <li>SpO₂ &lt;90% dan tidak bisa mempertahankan oksigenasi, ATAU</li>
              <li><strong>Cannot Intubate, Cannot Oxygenate (CICO)</strong> — airway rescue total gagal</li>
            </ul>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Hierarki Rencana Cadangan — Plan A–D (DAS 2025)</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2 w-16">Plan</th><th className="p-2 w-1/3">Tindakan</th><th className="p-2">Detail</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold text-center bg-primary/5 text-primary">Plan A</td>
                  <td className="p-2 font-bold">Intubasi trakea via oral (DL atau VL)</td>
                  <td className="p-2 text-muted-foreground">Maks 3 attempt. Setiap attempt: optimasi posisi, ukuran blade, operator. Gunakan bougie sejak attempt ke-2 bila Cormack-Lehane III–IV.</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold text-center bg-warning/10 text-warning">Plan B</td>
                  <td className="p-2 font-bold text-warning">Supraglottic Airway (SGA)</td>
                  <td className="p-2 text-muted-foreground">LMA, i-gel, atau SGA lain untuk <strong>rescue oxygenation</strong>. Masukkan bila intubasi gagal atau saat menunggu eskalasi bantuan. Bukan solusi definitif tapi jembatan kritis.</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold text-center bg-destructive/10 text-destructive">Plan C</td>
                  <td className="p-2 font-bold text-destructive">Face mask ventilation + BVM</td>
                  <td className="p-2 text-muted-foreground">Kembali ke ventilasi dasar dengan BVM 2-tangan + PEEP valve. Pertahankan oksigenasi sementara eskalasi bantuan dipanggil.</td>
                </tr>
                <tr className="text-foreground">
                  <td className="p-2 font-bold text-center bg-destructive/20 text-destructive">Plan D</td>
                  <td className="p-2 font-bold text-destructive">Emergency Front-of-Neck Airway (eFONA)</td>
                  <td className="p-2 text-muted-foreground">Scalpel-finger-bougie cricothyrotomy. Tindakan definitif pada CICO. Jangan tunda bila SGA gagal dan oksigenasi tidak bisa dipertahankan.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-bold text-[13px] text-destructive uppercase tracking-wider mb-2 border-b border-destructive/30 pb-1 mt-4">CICO Protocol — Langkah-Langkah eFONA</h3>
          <div className="p-2 bg-destructive/5 border border-destructive/20 rounded-md text-destructive text-[11px] mb-3">
            <strong>⚠ Narrow-bore cannula cricothyrotomy (14G) TIDAK lagi direkomendasikan</strong> sebagai Plan D — DAS 2025 mendeprekasi teknik ini karena failure rate ~60% (jet ventilation pressure-related barotrauma, kinking, dislodgement). <strong>Surgical eFONA (scalpel-bougie) = standar saat ini.</strong>
          </div>
          
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <tbody>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold w-6 bg-destructive/10 text-destructive text-center">1</td><td className="p-2"><strong>Declare CICO</strong> secara verbal: "This is a CICO situation. I need help NOW."</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold w-6 bg-destructive/10 text-destructive text-center">2</td><td className="p-2"><strong>Call for help</strong> — hubungi anestesi/bedah segera. Pertahankan SGA untuk rescue oxygenation sementara.</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold w-6 bg-muted text-center">3</td><td className="p-2"><strong>Identifikasi membran krikotiroid</strong> — palpasi: kartilago tiroid → membran krikotiroid → kartilago krikoid.</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold w-6 bg-muted text-center">4</td><td className="p-2"><strong>Insisi horizontal</strong> 1–1,5 cm dengan scalpel #10 pada membran krikotiroid. Incisi langsung masuk lumen.</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold w-6 bg-muted text-center">5</td><td className="p-2"><strong>Finger entry</strong> — masukkan jari ke dalam insisi untuk memperlebar lumen dan konfirmasi posisi.</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold w-6 bg-muted text-center">6</td><td className="p-2"><strong>Bougie masuk</strong> — arahkan bougie ke bawah (trachea distal). Konfirmasi: sentuh tracheal rings.</td></tr>
                <tr className="text-foreground"><td className="p-2 font-bold w-6 bg-muted text-center">7</td><td className="p-2"><strong>ETT 6,0 cuff</strong> dimasukkan melalui bougie. Cuff dikembangkan. Ventilasi + konfirmasi ETCO₂ + auskultasi.</td></tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-foreground text-[12px]">
              <strong className="text-primary block mb-1">Brief Tim Sebelum Mulai</strong>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground m-0">
                <li>Nyatakan rencana utama kepada seluruh tim sebelum membuka obat.</li>
                <li>Tunjuk siapa yang pegang SGA, handle CICO kit, call for help.</li>
                <li><strong>"Never surprise your team"</strong> — rencana cadangan disepakati bersama.</li>
                <li>Konfirmasi: suction ON, BVM siap, ETT cuff dicek, ETCO₂ dipasang.</li>
              </ul>
            </div>
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-foreground text-[12px]">
              <strong className="text-primary block mb-1">Catatan Waktu eFONA</strong>
              <p className="text-muted-foreground m-0">Waktu ideal eFONA bila sudah terlatih: &lt;60–90 detik. Practice on task trainer/simulator secara berkala — skill ini cepat memudar tanpa latihan.</p>
            </div>
          </div>
        </Accordion>

        <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-bold text-[14px] text-foreground mb-3 flex items-center gap-2">
            📚 Referensi Utama
          </h3>
          <ul className="list-decimal pl-5 space-y-2 text-muted-foreground text-[12px]">
            <li>Brown CA III, et al. <em>The Walls Manual of Emergency Airway Management</em>. 6th ed. 2023.</li>
            <li>Brown CA. Airway management. <em>N Engl J Med</em>. 2023.</li>
            <li>Rochwerg B, et al. Official ERS/ATS clinical practice guidelines: noninvasive ventilation for acute respiratory failure. <em>Eur Respir J</em>. 2017.</li>
            <li>Reed MJ, et al. Can an airway assessment score predict difficulty at intubation in the emergency department? <em>Emerg Med J</em>. 2005.</li>
            <li>Anesth Pain Med (PMC11078223) — Validasi LEMON vs IDS. 2024.</li>
            <li>Frat JP, et al. (FLORALI-2). Non-invasive ventilation versus high-flow nasal cannula in hypoxemic patients with acute respiratory failure. <em>Lancet Respir Med</em>. 2019.</li>
            <li>Zhong M, et al. Efficacy of prophylactic vasopressors in preventing post-intubation hypotension: a meta-analysis. <em>Front Med</em>. 2024.</li>
            <li>Araújo, et al. Video versus direct laryngoscopy in critically ill patients. <em>Critical Care</em>. 2024.</li>
            <li>Apfelbaum JL, et al. 2022 American Society of Anesthesiologists Practice Guidelines for Management of the Difficult Airway. <em>Anesthesiology</em>. 2022.</li>
            <li>Ahmad I, et al. DAS Guidelines for Management of Unanticipated Difficult Intubation. <em>Br J Anaesth</em>. 2025.</li>
          </ul>
        </div>
      </div>
  );
}
