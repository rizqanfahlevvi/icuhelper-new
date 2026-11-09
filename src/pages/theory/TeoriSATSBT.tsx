import { Accordion } from '../../components/ui/Accordion';
import { AbbrLegend } from '../../components/ui/AbbrLegend';
import { RSBI_THRESHOLD } from '../../utils/ventilation';

export default function TeoriSATSBT() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 pb-20 overflow-x-hidden">
      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 mb-2">
          SAT · SBT · VAP Bundle — ICU Liberation
        </h1>
        <p className="text-muted-foreground text-[13px] mb-4">Protokol ABCDEF Bundle dan pelepasan ventilator mekanik untuk mencegah kelemahan dan infeksi [1].</p>

        </div>

        <Accordion title="📖 ICU Liberation — ABCDEF Bundle" defaultOpen={true}>
          <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg text-foreground mb-4">
            <h3 className="font-bold text-[14px] text-teal-600 dark:text-teal-400 mb-1">Pendekatan Terstruktur Manajemen Pasien Ventilator</h3>
            <p className="text-[12px] text-muted-foreground">Bundle ini dirancang untuk mencegah komplikasi jangka panjang akibat ventilasi mekanik invasif: delirium, kelemahan otot (ICU-acquired weakness), dan ketergantungan ventilator. Kepatuhan bundle yang lebih tinggi berhubungan dengan luaran yang lebih baik [1].</p>
          </div>

          <div className="overflow-x-auto mb-3">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2 w-8">Hrf</th><th className="p-2">Komponen</th><th className="p-2">Tujuan Utama</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold text-center">A</td><td className="p-2">Assess &amp; manage <strong>Pain</strong></td><td className="p-2 text-muted-foreground">Nyeri bermakna bila CPOT &gt;2 atau NRS ≥4; analgesia dulu sebelum sedasi (analgosedasi)</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold text-center">B</td><td className="p-2"><strong>Both</strong> SAT + SBT (koordinasi)</td><td className="p-2 text-muted-foreground">Minimalkan sedasi · percepat weaning · kurangi hari ventilator</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold text-center">C</td><td className="p-2"><strong>Choice</strong> of analgesia/sedation</td><td className="p-2 text-muted-foreground">Sedasi ringan (RASS −2 s/d +1, sering ditargetkan 0 s/d −1); hindari benzodiazepin (PADIS 2018); dexmedetomidin disarankan dibanding propofol (PADIS 2025, kondisional)</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold text-center">D</td><td className="p-2">Assess, prevent &amp; manage <strong>Delirium</strong></td><td className="p-2 text-muted-foreground">Skrining rutin CAM-ICU atau ICDSC tiap shift; intervensi non-farmakologis</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold text-center">E</td><td className="p-2"><strong>Early mobility</strong> &amp; Exercise</td><td className="p-2 text-muted-foreground">Mobilisasi/rehabilitasi sesuai kriteria keamanan; PADIS 2025 menyarankan mobilisasi yang ditingkatkan (kondisional) — namun uji TEAM 2022 (mobilisasi aktif dini intensif) tidak menambah hari hidup di luar RS dan efek samping lebih banyak</td></tr>
                <tr className="text-foreground"><td className="p-2 font-bold text-center">F</td><td className="p-2"><strong>Family</strong> engagement</td><td className="p-2 text-muted-foreground">Libatkan keluarga dalam ronde dan edukasi kondisi</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] italic text-muted-foreground">
            📚 Marra A et al. Crit Care Clin 2017;33:225 · Devlin JW et al. (PADIS 2018) Crit Care Med 2018;46:e825 · Lewis K et al. (PADIS 2025) Crit Care Med 2025;53:e711 · TEAM Investigators NEJM 2022;387:1747
          </p>
        </Accordion>

        <Accordion title="📖 SAT — Spontaneous Awakening Trial">
          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Konsep & Syarat SAT</h3>
          <p className="text-[12px] text-muted-foreground mb-3">
            SAT = penghentian sedasi harian. Kress 2000: durasi ventilasi 4,9 vs 7,3 hari; ABC trial (SAT + SBT berpasangan): +3,1 hari bebas ventilator dan mortalitas 1 tahun lebih rendah [2, 3].
            Skrining keamanan SAT pada ABC trial — <strong>JANGAN lakukan SAT</strong> bila: kejang aktif, putus alkohol aktif, dosis sedatif sedang dinaikkan karena agitasi, sedang mendapat pelumpuh otot (NMB), iskemia miokard dalam 24 jam, atau TIK meningkat [2].
          </p>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Cara Melakukan SAT</h3>
          <ol className="list-decimal pl-5 space-y-1 text-muted-foreground text-[12px] mb-4">
            <li>Hentikan semua infus sedasi (propofol, midazolam, dexmedetomidine).</li>
            <li>Pertahankan analgesia yang dibutuhkan untuk nyeri (fentanyl/morfin).</li>
            <li>Amati pasien sampai maksimal 4 jam.</li>
            <li><strong className="text-emerald-600 dark:text-emerald-400">Lulus:</strong> membuka mata terhadap suara, ATAU 4 jam tanpa tanda gagal. → <strong className="text-primary">Skrining SBT</strong>.</li>
            <li><strong className="text-destructive">Gagal:</strong> cemas/agitasi/nyeri menetap, RR &gt;35 selama ≥5 menit, SpO₂ &lt;88% selama ≥5 menit, aritmia akut, atau ≥2 tanda distres napas. → <strong className="text-foreground">Mulai lagi sedasi di 50% dosis sebelumnya</strong>, ulangi skrining esok hari [2].</li>
          </ol>
          <p className="mt-3 text-[11px] italic text-muted-foreground">
            📚 Girard TD et al. (ABC trial) Lancet 2008;371:126 · Kress JP et al. NEJM 2000;342:1471
          </p>
        </Accordion>

        <Accordion title="📖 SBT — Spontaneous Breathing Trial & Kesiapan Ekstubasi">
          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Syarat Sebelum SBT</h3>
          <ul className="list-disc pl-5 mb-3 space-y-1 text-muted-foreground text-[12px]">
            <li>Penyebab gagal napas membaik; ada usaha napas spontan</li>
            <li>Hemodinamik stabil (MAP ≥65 tanpa eskalasi dosis vasopresor), tanpa iskemia miokard aktif</li>
            <li><strong className="text-foreground">Oksigenasi memadai: SpO₂ ≥88–90% dengan FiO₂ ≤50% dan PEEP ≤8 cmH₂O</strong> (skrining ABC trial memakai SpO₂ ≥88%)</li>
            <li>Sadar/sedasi ringan (lulus SAT), tidak agitasi, tidak ada bronkospasme berat</li>
          </ul>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Metode SBT</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">Bantuan tekanan rendah (disarankan untuk SBT awal):</strong> PS 5–8 cmH₂O ± PEEP 5 cmH₂O. ATS/ACCP 2017 menyarankan SBT awal dengan bantuan tekanan dibanding tanpa bantuan (kondisional) [4]. SBT <strong>30 menit</strong> dengan PS 8 cmH₂O → ekstubasi berhasil lebih banyak dibanding T-piece 2 jam (Subirà, JAMA 2019) [6].</li>
            <li><strong className="text-foreground">T-Piece:</strong> tanpa bantuan ventilator — uji yang lebih berat; dapat dipertimbangkan pada pasien yang ragu-ragu (mis. penyakit jantung).</li>
            <li><strong className="text-foreground">RSBI</strong> (RR ÷ VT dalam liter), diukur di awal SBT: <strong>≤{RSBI_THRESHOLD}</strong> → prediktor keberhasilan; <strong>&gt;{RSBI_THRESHOLD}</strong> → cenderung gagal (Yang & Tobin 1991: sensitivitas 0,97, spesifisitas 0,64 — bukan kriteria tunggal) [5].</li>
          </ul>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Kesiapan Ekstubasi (Pasca SBT)</h3>
          <p className="text-[12px] text-muted-foreground mb-1">Jika lulus SBT (RR stabil &lt;35, SpO₂ ≥90%, hemodinamik stabil, tanpa distres), periksa sebelum melepas ETT:</p>
          <ul className="list-disc pl-5 mb-3 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">Batuk & sekret:</strong> batuk lemah dan sekret banyak meningkatkan risiko gagal ekstubasi (Khamiees 2001) [7].</li>
            <li><strong className="text-foreground">Status Neurologis:</strong> Bisa ikut perintah (buka mata, genggam).</li>
            <li><strong className="text-foreground">Cuff Leak Test</strong> pada pasien risiko tinggi stridor pasca-ekstubasi: bila kebocoran minimal/tidak ada → steroid sistemik ≥4 jam sebelum ekstubasi (ATS/ACCP 2017, kondisional) [4].</li>
            <li><strong className="text-foreground">Ekstubasi ke NIV/HFNC</strong> pada risiko tinggi reintubasi (usia &gt;65, penyakit jantung atau paru kronik termasuk PPOK & gagal jantung, obesitas): NIV profilaksis disarankan ATS/ACCP 2017 untuk pasien yang diventilasi &gt;24 jam (kondisional) [4]; kombinasi HFNC + NIV menurunkan reintubasi dibanding HFNC saja (HIGH-WEAN, Thille JAMA 2019) [8].</li>
          </ul>
          <p className="mt-3 text-[11px] italic text-muted-foreground">
            📚 Schmidt GA / Ouellette DR et al. (ATS/ACCP 2017) AJRCCM 2017;195:115 · Chest 2017;151:166 · Subirà C et al. JAMA 2019;321:2175 · Yang KL & Tobin MJ NEJM 1991;324:1445
          </p>
        </Accordion>

        <Accordion title="📖 VAP Bundle & Terapi VAP">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-foreground mb-4">
            <h3 className="font-bold text-[14px] text-amber-600 dark:text-amber-400 mb-1">Pencegahan VAP — SHEA 2022 (praktik esensial)</h3>
            <ul className="list-disc pl-5 m-0 space-y-1 text-muted-foreground text-[12px]">
              <li><strong className="text-foreground">Hindari intubasi</strong> bila memungkinkan (HFNO/NIV pada pasien terpilih)</li>
              <li><strong className="text-foreground">Minimalkan sedasi</strong> — SAT & SBT harian, nilai kesiapan ekstubasi setiap hari</li>
              <li><strong className="text-foreground">Pertahankan & tingkatkan kondisi fisik</strong> (mobilisasi dini)</li>
              <li><strong className="text-foreground">Elevasi kepala tempat tidur 30–45°</strong></li>
              <li><strong className="text-foreground">Perawatan mulut dengan sikat gigi, TANPA klorheksidin</strong> — oral care klorheksidin <em>tidak dianjurkan</em> lagi (sinyal mortalitas lebih tinggi pada meta-analisis)</li>
              <li><strong className="text-foreground">Nutrisi enteral dini</strong> lebih dipilih dibanding parenteral</li>
              <li><strong className="text-foreground">JANGAN mengganti sirkuit rutin</strong> (ganti hanya jika kotor/rusak)</li>
            </ul>
            <p className="text-[12px] text-muted-foreground mt-2"><strong className="text-foreground">Pendekatan tambahan:</strong> ETT dengan drainase subglotis untuk ventilasi yang diperkirakan &gt;48–72 jam. Tekanan cuff umumnya dijaga 20–30 cmH₂O (praktik standar).</p>
            <p className="text-[12px] text-muted-foreground mt-1"><strong className="text-foreground">Bukan bagian pencegahan VAP:</strong> profilaksis ulkus stres (tidak dianjurkan untuk tujuan cegah VAP) dan profilaksis DVT — berikan sesuai indikasinya masing-masing.</p>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Prinsip Terapi VAP Empiris (IDSA/ATS 2016)</h3>
          <p className="text-[12px] text-muted-foreground mb-2">Ambil kultur saluran napas lalu mulai antibiotik empiris segera (≤1 jam bila disertai syok septik — SSC 2021). <strong>Durasi standar: 7 hari.</strong> De-eskalasi berdasarkan hasil kultur.</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-[12px]">
            <li><strong>Tanpa risiko MDR:</strong> mis. Pip-Tazo atau Cefepime tunggal.</li>
            <li><strong>Dengan risiko MRSA</strong> (atau prevalensi MRSA lokal tinggi): + Vancomycin atau Linezolid.</li>
            <li><strong>Dengan risiko MDR gram negatif / Pseudomonas</strong> (atau resistensi lokal &gt;10%): dua antipseudomonas dari kelas berbeda (mis. Cefepime + Amikasin) [9].</li>
          </ul>
          <p className="mt-3 text-[11px] italic text-muted-foreground">
            📚 Kalil AC et al. (IDSA/ATS HAP/VAP 2016) Clin Infect Dis 2016;63:e61 ·
            Klompas M et al. (SHEA 2022 update) Infect Control Hosp Epidemiol 2022;43:687
          </p>
        </Accordion>

        <AbbrLegend terms={['ICU', 'SAT', 'SBT', 'VAP', 'ABCDEF', 'CPOT', 'NRS', 'RASS', 'PADIS', 'CAM-ICU', 'ICDSC', 'ICUAW', 'NMB', 'TIK', 'RR', 'SpO2', 'FiO2', 'PEEP', 'MAP', 'PS', 'RSBI', 'VT', 'ETT', 'NIV', 'HFNC', 'HFNO', 'PPOK', 'DVT', 'MDR', 'MRSA', 'SHEA', 'IDSA', 'ATS', 'ACCP', 'SSC', 'RS']} />

        <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-bold text-[14px] text-foreground mb-3 flex items-center gap-2">
            📚 Referensi Utama
          </h3>
          <ul className="list-decimal pl-5 space-y-2 text-muted-foreground text-[12px]">
            <li>Marra A, et al. The ABCDEF Bundle in Critical Care. <em>Crit Care Clin</em>. 2017;33:225.</li>
            <li>Girard TD, et al. Efficacy and safety of a paired sedation and ventilator weaning protocol for mechanically ventilated patients in intensive care (Awakening and Breathing Controlled trial). <em>Lancet</em>. 2008;371:126.</li>
            <li>Kress JP, et al. Daily interruption of sedative infusions in critically ill patients undergoing mechanical ventilation. <em>N Engl J Med</em>. 2000;342:1471.</li>
            <li>Schmidt GA, et al. ATS/ACCP clinical practice guideline: liberation from mechanical ventilation in critically ill adults. <em>Am J Respir Crit Care Med</em>. 2017;195:115 · Ouellette DR, et al. <em>Chest</em>. 2017;151:166.</li>
            <li>Yang KL, Tobin MJ. A prospective study of indexes predicting the outcome of trials of weaning from mechanical ventilation. <em>N Engl J Med</em>. 1991;324:1445.</li>
            <li>Subirà C, et al. Effect of pressure support vs T-piece ventilation strategies during spontaneous breathing trials on successful extubation. <em>JAMA</em>. 2019;321:2175.</li>
            <li>Khamiees M, et al. Predictors of extubation outcome in patients who have successfully completed a spontaneous breathing trial. <em>Chest</em>. 2001;120:1262.</li>
            <li>Thille AW, et al. Effect of postextubation high-flow nasal oxygen with noninvasive ventilation vs high-flow nasal oxygen alone on reintubation among patients at high risk of extubation failure (HIGH-WEAN). <em>JAMA</em>. 2019;322:1465.</li>
            <li>Kalil AC, et al. Management of adults with hospital-acquired and ventilator-associated pneumonia: 2016 IDSA/ATS guidelines. <em>Clin Infect Dis</em>. 2016;63:e61.</li>
            <li>Klompas M, et al. Strategies to prevent ventilator-associated pneumonia, ventilator-associated events, and nonventilator hospital-acquired pneumonia in acute-care hospitals: 2022 Update. <em>Infect Control Hosp Epidemiol</em>. 2022;43:687.</li>
            <li>Devlin JW, et al. PADIS guidelines. <em>Crit Care Med</em>. 2018;46:e825 · Lewis K, et al. PADIS focused update. <em>Crit Care Med</em>. 2025;53:e711.</li>
            <li>TEAM Study Investigators. Early active mobilization during mechanical ventilation in the ICU. <em>N Engl J Med</em>. 2022;387:1747.</li>
          </ul>
        </div>
      </div>
  );
}
