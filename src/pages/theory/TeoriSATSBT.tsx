import { Accordion } from '../../components/ui/Accordion';

export default function TeoriSATSBT() {
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 mb-2">
          SAT · SBT · VAP Bundle — ICU Liberation
        </h1>
        <p className="text-muted-foreground text-[13px] mb-4">Protokol ABCDEF Bundle dan pelepasan ventilator mekanik untuk mencegah kelemahan dan infeksi [1].</p>

        </div>

        <Accordion title="📖 ICU Liberation — ABCDEF Bundle" defaultOpen={true}>
          <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg text-foreground mb-4">
            <h3 className="font-bold text-[14px] text-teal-600 dark:text-teal-400 mb-1">Pendekatan Terstruktur Manajemen Pasien Ventilator</h3>
            <p className="text-[12px] text-muted-foreground">Bundle ini dirancang untuk mencegah komplikasi jangka panjang akibat IMV: delirium, kelemahan otot, ICU-acquired weakness, dan ketergantungan ventilator. Implementasi simultan lebih efektif daripada parsial.</p>
          </div>
          
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2 w-8">Hrf</th><th className="p-2">Komponen</th><th className="p-2">Tujuan Utama</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold text-center">A</td><td className="p-2">Assess &amp; manage <strong>Pain</strong></td><td className="p-2 text-muted-foreground">CPOT ≤2 atau NRS ≤3; analgesia dulu sebelum sedasi</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold text-center">B</td><td className="p-2"><strong>Both</strong> SAT + SBT (koordinasi)</td><td className="p-2 text-muted-foreground">Minimalkan sedasi · percepat weaning · kurangi ventilator-days</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold text-center">C</td><td className="p-2"><strong>Choice</strong> of analgesia/sedation</td><td className="p-2 text-muted-foreground">Target RASS −1 sampai 0; pilih dexmedetomidine atau propofol</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold text-center">D</td><td className="p-2">Assess, prevent &amp; manage <strong>Delirium</strong></td><td className="p-2 text-muted-foreground">CAM-ICU atau ICDSC 2× sehari; mobilisasi awal</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold text-center">E</td><td className="p-2"><strong>Early mobility</strong> &amp; Exercise</td><td className="p-2 text-muted-foreground">Fisioterapi aktif sejak H-1; hindari tirah baring total</td></tr>
                <tr className="text-foreground"><td className="p-2 font-bold text-center">F</td><td className="p-2"><strong>Family</strong> engagement</td><td className="p-2 text-muted-foreground">Libatkan keluarga dalam ronde dan edukasi kondisi</td></tr>
              </tbody>
            </table>
          </div>
        </Accordion>

        <Accordion title="📖 SAT — Spontaneous Awakening Trial">
          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Konsep & Syarat SAT</h3>
          <p className="text-[12px] text-muted-foreground mb-3">SAT (penghentian sedasi harian) terbukti mengurangi durasi ventilator 2-3 hari. Tapi <strong>TIDAK dilakukan</strong> bila: kejang aktif, alcohol withdrawal persisten, agitasi berat (RASS +3/+4), TIK tinggi/indikasi sedasi khusus, status paralitik NMB, atau hemodinamik dan oksigenasi tidak stabil (FiO₂ &gt;70%, PEEP &gt;12) [2].</p>
          
          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Cara Melakukan SAT</h3>
          <ol className="list-decimal pl-5 space-y-1 text-muted-foreground text-[12px] mb-4">
            <li>Hentikan semua infus sedasi (propofol, midazolam, dexmedetomidine).</li>
            <li>Pertahankan infus analgesia (fentanyl/morfin) — jangan dihentikan.</li>
            <li>Amati pasien setiap 30 menit maksimal 4 jam.</li>
            <li><strong className="text-success">Lulus:</strong> Buka mata saat dipanggil DAN ikuti 1 perintah sederhana. → <strong className="text-primary">Lanjut SBT</strong>.</li>
            <li><strong className="text-destructive">Gagal:</strong> Agitasi, SpO2 &lt;88%, takikardi hebat. → <strong className="text-foreground">Restart sedasi di 50% dosis sebelumnya</strong>.</li>
          </ol>
        </Accordion>

        <Accordion title="📖 SBT — Spontaneous Breathing Trial & Kesiapan Ekstubasi">
          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Syarat Sebelum SBT</h3>
          <ul className="list-disc pl-5 mb-3 space-y-1 text-muted-foreground text-[12px]">
            <li>Penyebab gagal napas membaik</li>
            <li>Hemodinamik stabil (MAP ≥65 tanpa eskalasi dosis vasopressor)</li>
            <li><strong className="text-foreground">Oksigenasi memadai: SpO₂ ≥90% dengan FiO₂ ≤50% dan PEEP ≤8 cmH₂O</strong></li>
            <li>Sadar/sedasi ringan (Lulus SAT) dan tidak ada bronkospasme berat</li>
          </ul>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Metode SBT (30–120 Menit)</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">PSV Rendah:</strong> PS 5–8 cmH₂O + PEEP 5 cmH₂O (Paling umum, nyaman, mengatasi resistensi ETT)</li>
            <li><strong className="text-foreground">T-Piece:</strong> Tanpa dukungan ventilator (ujian paling murni, namun ekstra lelah untuk otot)</li>
            <li><strong className="text-foreground">RSBI:</strong> (RR / VT L). Diukur di awal SBT. &lt;80 (sangat baik), &gt;105 (cenderung gagal).</li>
          </ul>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Kesiapan Ekstubasi (Pasca SBT)</h3>
          <p className="text-[12px] text-muted-foreground mb-1">Jika lulus SBT (RR stabil &lt;35, SpO2 ≥90%, hemodinamik oke), periksa 4 domain sebelum melepas ETT:</p>
          <ul className="list-disc pl-5 mb-3 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">Batuk Kuat</strong> (Cough Peak Flow) dan <strong className="text-foreground">Produksi Sekret &lt;4x suction/hari</strong> [3].</li>
            <li><strong className="text-foreground">Status Neurologis:</strong> Bisa ikut perintah (buka mata, genggam).</li>
            <li><strong className="text-foreground">Cuff Leak Test:</strong> Jika tidak bocor (negatif) → kemungkinan laryngeal edema → pertimbangkan steroid pre-ekstubasi [4].</li>
            <li><strong className="text-foreground">Eksutbasi ke HFNC/NIV:</strong> Direkomendasikan untuk PPOK, CHF, Obesitas atau usia &gt;65 untuk mencegah re-intubasi [5].</li>
          </ul>
        </Accordion>

        <Accordion title="📖 VAP Bundle & Terapi VAP">
          <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg text-foreground mb-4">
            <h3 className="font-bold text-[14px] text-warning mb-1">VAP Prevention Bundle</h3>
            <p className="text-[12px] text-muted-foreground mb-2">Implementasi bundle (paket intervensi) secara konsisten diyakini dapat menurunkan insidensi VAP hingga 50-70%.</p>
            <ul className="list-disc pl-5 m-0 space-y-1 text-muted-foreground text-[12px]">
              <li><strong className="text-foreground">Elevasi kepala tempat tidur 30–45°</strong></li>
              <li><strong className="text-foreground">SAT dan SBT Harian</strong></li>
              <li><strong className="text-foreground">Perawatan mulut dengan klorheksidin</strong> (Kontroversial di ICU jantung akhir-akhir ini, tp tetap utama ICU general)</li>
              <li><strong className="text-foreground">Tekanan cuff ETT 20–30 cmH₂O</strong> dan Drainase subglotis</li>
              <li><strong className="text-foreground">JANGAN mengganti sirkuit rutin</strong> (ganti hanya jika kotor/rusak)</li>
              <li><strong className="text-foreground">Profilaksis DVT dan Stress Ulcer</strong></li>
            </ul>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Prinsip Terapi VAP Empiris</h3>
          <p className="text-[12px] text-muted-foreground mb-2">Terapi VAP Empiris → Berikan segera &lt;1 jam setelah suspek (setelah kulturnya diambil). <strong>Durasi standar: 7-8 hari.</strong> Harus deeskalasi setelah hasil kultur keluar.</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-[12px]">
            <li><strong>Tanpa risiko MDR:</strong> Pip-Tazo atau Cefepime tunggal.</li>
            <li><strong>Dengan risiko MRSA:</strong> + Vancomycin atau Linezolid.</li>
            <li><strong>Dengan risiko MDR Pseudomonas (Pseudomonas tinggi lokal):</strong> Double coverage Pseudomonas (Cefepime + Amikasin, dst) [6].</li>
          </ul>
        </Accordion>

        <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-bold text-[14px] text-foreground mb-3 flex items-center gap-2">
            📚 Referensi Utama
          </h3>
          <ul className="list-decimal pl-5 space-y-2 text-muted-foreground text-[12px]">
            <li>Marra A, et al. The ABCDEF Bundle in Critical Care. <em>Crit Care Clin</em>. 2017.</li>
            <li>Girard TD, et al. Efficacy and safety of a paired sedation and ventilator weaning protocol for mechanically ventilated patients in intensive care (Awakening and Breathing Controlled trial). <em>Lancet</em>. 2008.</li>
            <li>Thille AW, et al. Outcomes of extubation failure in medical intensive care unit patients. <em>Crit Care Med</em>. 2011.</li>
            <li>Pluijms WA, et al. Predicting extubation failure. <em>Minerva Anestesiol</em>. 2013.</li>
            <li>Ouellette DR, et al. Liberation From Mechanical Ventilation in Critically Ill Adults. <em>Chest</em>. 2017.</li>
            <li>Klompas M, et al. Strategies to prevent ventilator-associated pneumonia in adult acute care hospitals: 2022 Update. <em>Infect Control Hosp Epidemiol</em>. 2022.</li>
          </ul>
        </div>
      </div>
  );
}
