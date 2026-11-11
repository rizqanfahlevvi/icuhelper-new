import { Accordion } from '../../components/ui/Accordion';
import { AbbrLegend } from '../../components/ui/AbbrLegend';

export default function TeoriAKICRRT() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 pb-20 overflow-x-hidden">
      <div className="bg-white dark:bg-[var(--dk-surface-1)] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 mb-2">
          AKI & CRRT — Teori, Staging & Tatalaksana
        </h1>

        <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg text-foreground mb-4 text-[13px]">
          <div className="font-bold text-[15px] mb-2 text-primary">🫘 Definisi AKI (KDIGO 2012)</div>
          <p className="text-[12px] text-muted-foreground">KDIGO sedang menyusun pembaruan pedoman AKI/AKD (draf 2026 dibuka untuk tinjauan publik Maret–Mei 2026, belum final). Sampai terbit, acuan resmi tetap KDIGO 2012 [1].</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <p className="font-bold text-foreground">Kriteria Diagnosis AKI <span className="font-normal text-muted-foreground">(salah satu)</span>:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground">
                <li>Kreatinin serum ↑ <strong className="text-foreground">≥0.3 mg/dL</strong> dalam <strong className="text-foreground">48 jam</strong></li>
                <li>Kreatinin ↑ <strong className="text-foreground">≥1.5× baseline</strong> dalam <strong className="text-foreground">7 hari</strong></li>
                <li>Urine output <strong className="text-foreground">&lt;0.5 mL/kg/jam</strong> selama <strong className="text-foreground">≥6 jam</strong></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-foreground">Epidemiologi ICU:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground">
                <li>AKI terjadi pada <strong className="text-foreground">±57%</strong> pasien ICU (AKI-EPI, 97 ICU) [2]</li>
                <li>Mortalitas meningkat seiring stadium KDIGO [2]</li>
                <li>Prediktor independen mortalitas jangka panjang.</li>
              </ul>
            </div>
          </div>
          <p className="mt-3 text-amber-600 dark:text-amber-400 font-semibold">⚠️ Penting: Diagnosis AKI adalah sindrom klinis — selalu cari etiologi dan fenotip spesifik untuk tatalaksana yang tepat [1].</p>
        </div>

        </div>

        <Accordion title="🫘 Staging KDIGO, Subfenotip & MAKE" defaultOpen={true}>
          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Staging KDIGO</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Stage</th><th className="p-2">Kreatinin Serum</th><th className="p-2">Urine Output</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold whitespace-nowrap">Stage 1</td><td className="p-2 text-muted-foreground">↑ ≥0.3 mg/dL dlm 48j, atau ↑ 1.5–1.9× baseline</td><td className="p-2 text-muted-foreground">&lt;0.5 mL/kg/jam slm 6–12 jam</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold whitespace-nowrap">Stage 2</td><td className="p-2 text-muted-foreground">↑ 2.0–2.9× baseline</td><td className="p-2 text-amber-600 dark:text-amber-400 font-bold">&lt;0.5 mL/kg/jam slm ≥12 jam</td></tr>
                <tr className="text-foreground"><td className="p-2 font-bold whitespace-nowrap text-destructive">Stage 3</td><td className="p-2 text-muted-foreground">↑ ≥3× baseline, ATAU Cr ≥4 mg/dL, ATAU inisiasi RRT</td><td className="p-2 text-destructive font-bold">&lt;0.3 mL/kg/jam ≥24 jam, ATAU anuria ≥12 jam</td></tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg text-foreground text-[12px] mb-4">
            <strong className="text-teal-600 dark:text-teal-400 block mb-1">MAKE (Major Adverse Kidney Events) — luaran RCT AKI modern</strong>
            <p className="text-muted-foreground">Gabungan kematian, terapi pengganti ginjal baru/ketergantungan dialisis, dan disfungsi ginjal persisten pada hari ke-30 (MAKE30) atau ke-90. Definisi disfungsi persisten <strong className="text-foreground">berbeda antar-studi</strong> — mis. kreatinin akhir ≥200% baseline (uji SMART) atau penurunan eGFR ≥25% pada studi lain. Dipakai karena kreatinin tunggal bukan penanda pemulihan jangka panjang yang kuat [3, 4].</p>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Subfenotip AKI Utama</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">Pre-renal:</strong> Hipoperfusi. FENa &lt;1%, FEUrea &lt;35%. Responsif cairan. (FENa juga bisa &lt;1% pada AKI kontras, sepsis dini, dan mioglobinuria.)</li>
            <li><strong className="text-foreground">Intrinsik (ATN):</strong> Nekrosis tubulus, FENa &gt;2%. Manajemen suportif, hindari toksin.</li>
            <li><strong className="text-foreground">Post-renal:</strong> Obstruksi → pasang kateter/USG. (Paling mudah di-reverse).</li>
          </ul>
          <p className="mt-3 text-[11px] italic text-muted-foreground">
            📚 KDIGO AKI Work Group. Kidney Int Suppl 2012;2:1 · Hoste EAJ et al. (AKI-EPI) ICM 2015;41:1411 · Semler MW et al. (SMART) NEJM 2018;378:829
          </p>
        </Accordion>

        <Accordion title="🔍 Penyebab AKI & Protokol Rhabdomiolisis">
          <ul className="list-disc pl-5 mb-4 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">Sepsis:</strong> penyebab tersering AKI di ICU (±48% pada studi BEST Kidney) [5]. Mekanisme: hipoperfusi, inflamasi, disfungsi mikrosirkulasi & mitokondria.</li>
            <li><strong className="text-foreground">AKI terkait kontras:</strong> hidrasi IV isotonik profilaksis diindikasikan pada eGFR &lt;30 yang tidak dialisis; tidak rutin bila eGFR ≥45; individual pada 30–44 (ACR/NKF 2020). AMACING: tanpa hidrasi tidak inferior pada eGFR 30–59. NAC dan bikarbonat tidak bermanfaat (PRESERVE 2018) [6, 7, 8].</li>
            <li><strong className="text-foreground">Aminoglikosida & Obat:</strong> Akumulasi di tubulus proksimal.</li>
            <li><strong className="text-foreground">Fluid overload & de-resusitasi:</strong> kongesti vena ginjal menurunkan perfusi ginjal (nefropati kongestif); fluid overload &gt;10% berhubungan dengan mortalitas lebih tinggi pada AKI [9].</li>
          </ul>

          <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-foreground text-[12px]">
            <strong className="text-orange-600 dark:text-orange-400 block mb-1">🦴 Rhabdomiolisis</strong>
            <ul className="list-disc pl-4 space-y-1 text-muted-foreground m-0">
              <li><strong className="text-foreground">Cairan IV dini & agresif</strong> (kristaloid) dengan target UO ±200–300 mL/jam, pantau overload — terutama pada CK sangat tinggi (mis. &gt;5000) [10].</li>
              <li><strong className="text-foreground">NaHCO₃ / manitol:</strong> bukti lemah — pada kohort trauma dengan CK &gt;5000 tidak lebih baik dari salin saja (Brown 2004). Bila dipakai, pantau pH darah, kalsium terionisasi, dan natrium [10, 11].</li>
            </ul>
          </div>
        </Accordion>

        <Accordion title="⏱️ Indikasi RRT — Kapan Mulai">
          <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-foreground mb-4">
            <h3 className="font-bold text-[14px] text-destructive mb-2">🚨 Indikasi Mendesak RRT (AEIOU) — refrakter terhadap terapi medis</h3>
            <ul className="list-disc pl-5 m-0 space-y-1 text-foreground text-[13px] font-semibold">
              <li>Asidosis metabolik berat (contoh ambang lazim: pH &lt;7,1 — tidak ada ambang baku)</li>
              <li>Hiperkalemia (contoh ambang lazim: K⁺ &gt;6,5 mEq/L) atau perubahan EKG/disritmia</li>
              <li>Intoksikasi zat yang dapat didialisis (lithium, salisilat, metanol, etilen glikol)</li>
              <li>Overload cairan / edema paru yang tidak responsif diuretik</li>
              <li>Komplikasi uremik klinis (perikarditis, ensefalopati, perdarahan uremik)</li>
            </ul>
            <p className="text-[12px] text-muted-foreground mt-2">Sama dengan Kalkulator Indikasi HD. KDIGO 2012 tidak menetapkan ambang angka baku [1].</p>
          </div>

          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-foreground text-[12px] mb-4">
            <strong className="text-emerald-600 dark:text-emerald-400 text-[14px] block mb-2">Timing Tanpa Indikasi Mendesak</strong>
            <ul className="list-disc pl-4 space-y-1 text-muted-foreground m-0">
              <li><strong className="text-foreground">AKIKI 2016 & STARRT-AKI 2020:</strong> RRT dini/"accelerated" tidak menurunkan mortalitas dibanding strategi tunda; pada STARRT-AKI, kelompok accelerated lebih banyak bergantung dialisis pada hari ke-90 dan lebih banyak efek samping. Sebagian pasien di kelompok tunda pulih tanpa RRT [12, 13].</li>
              <li><strong className="text-foreground">Batas menunda (AKIKI-2, Lancet 2021):</strong> pada AKI stage 3 dengan oliguria &gt;72 jam atau BUN &gt;112 mg/dL, menunda lebih lama lagi tidak bermanfaat dan berhubungan dengan mortalitas 60 hari lebih tinggi — pertimbangkan memulai RRT [14].</li>
            </ul>
          </div>
          <p className="mt-3 text-[11px] italic text-muted-foreground">
            📚 Gaudry S et al. (AKIKI) NEJM 2016;375:122 · STARRT-AKI Investigators. NEJM 2020;383:240 · Gaudry S et al. (AKIKI 2) Lancet 2021;397:1293
          </p>
        </Accordion>

        <Accordion title="⚙️ Mode CRRT, Dosis & Antikoagulasi (RCA vs Heparin)">
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Mode</th><th className="p-2">Mekanisme</th><th className="p-2">Catatan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">CVVH</td><td className="p-2 text-muted-foreground">Konveksi (butuh cairan pengganti)</td><td className="p-2">Klirens molekul menengah lebih baik; hemofiltrasi volume tinggi untuk "membuang sitokin" pada sepsis tidak terbukti bermanfaat (IVOIRE 2013) [15]</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">CVVHD</td><td className="p-2 text-muted-foreground">Difusi (butuh dialisat)</td><td className="p-2">Solut kecil (urea, kalium)</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold text-primary">CVVHDF</td><td className="p-2 text-muted-foreground">Kombinasi konveksi + difusi</td><td className="p-2 font-semibold">Banyak dipakai sebagai mode standar</td></tr>
                <tr className="text-foreground"><td className="p-2 font-bold">SCUF</td><td className="p-2 text-muted-foreground">Ultrafiltrasi lambat tanpa klirens solut bermakna</td><td className="p-2">Overload cairan murni (mis. gagal jantung refrakter diuretik)</td></tr>
              </tbody>
            </table>
          </div>

          <ul className="list-disc pl-5 mb-4 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">Dosis:</strong> effluent yang <em>diberikan</em> 20–25 mL/kg/jam (KDIGO 2012); dosis lebih tinggi tidak lebih baik (RENAL, ATN). Resepkan sedikit lebih tinggi karena ada waktu henti filter [1, 16, 17].</li>
            <li><strong className="text-foreground">Antikoagulasi:</strong> KDIGO 2012 menyarankan <strong className="text-foreground">sitrat regional (RCA)</strong> dibanding heparin untuk CRRT bila tidak ada kontraindikasi sitrat (2B); heparin bila sitrat tidak bisa dipakai. Hindari antikoagulan sistemik bila perdarahan aktif/trombositopenia berat [1].</li>
          </ul>
          <p className="mt-3 text-[11px] italic text-muted-foreground">
            📚 Bellomo R et al. (RENAL study, dosis CRRT) NEJM 2009;361:1627 ·
            Palevsky PM et al. (ATN study) NEJM 2008;359:7
          </p>
        </Accordion>

        <AbbrLegend terms={['AKI', 'AKD', 'CRRT', 'RRT', 'KDIGO', 'ICU', 'MAKE', 'eGFR', 'FENa', 'FEUrea', 'ATN', 'USG', 'NAC', 'ACR', 'NKF', 'CK', 'UO', 'BUN', 'EKG', 'AEIOU', 'CVVH', 'CVVHD', 'CVVHDF', 'SCUF', 'RCA', 'HD', 'BB']} />

        <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-bold text-[14px] text-foreground mb-3 flex items-center gap-2">
            📚 Referensi Utama
          </h3>
          <ul className="list-decimal pl-5 space-y-2 text-muted-foreground text-[12px]">
            <li>KDIGO AKI Work Group. KDIGO Clinical Practice Guideline for Acute Kidney Injury. <em>Kidney Int Suppl</em>. 2012;2:1. (Draf pembaruan AKI/AKD 2026: kdigo.org)</li>
            <li>Hoste EAJ, et al. Epidemiology of acute kidney injury in critically ill patients: the multinational AKI-EPI study. <em>Intensive Care Med</em>. 2015;41:1411.</li>
            <li>Billings FT, Shaw AD. Clinical trial endpoints in acute kidney injury. <em>Nephron Clin Pract</em>. 2014;127:89.</li>
            <li>Semler MW, et al. Balanced crystalloids versus saline in critically ill adults (SMART). <em>N Engl J Med</em>. 2018;378:829.</li>
            <li>Uchino S, et al. Acute renal failure in critically ill patients: a multinational, multicenter study (BEST Kidney). <em>JAMA</em>. 2005;294:813.</li>
            <li>Davenport MS, et al. Use of intravenous iodinated contrast media in patients with kidney disease: ACR/NKF consensus statements. <em>Radiology</em>. 2020;294:660.</li>
            <li>Nijssen EC, et al. Prophylactic hydration to protect renal function from intravascular iodinated contrast material (AMACING). <em>Lancet</em>. 2017;389:1312.</li>
            <li>Weisbord SD, et al. Outcomes after angiography with sodium bicarbonate and acetylcysteine (PRESERVE). <em>N Engl J Med</em>. 2018;378:603.</li>
            <li>Bouchard J, et al. Fluid accumulation, survival and recovery of kidney function in critically ill patients with acute kidney injury. <em>Kidney Int</em>. 2009;76:422.</li>
            <li>Bosch X, Poch E, Grau JM. Rhabdomyolysis and acute kidney injury. <em>N Engl J Med</em>. 2009;361:62.</li>
            <li>Brown CVR, et al. Preventing renal failure in patients with rhabdomyolysis: do bicarbonate and mannitol make a difference? <em>J Trauma</em>. 2004;56:1191.</li>
            <li>Gaudry S, et al. Initiation Strategies for Renal-Replacement Therapy in the Intensive Care Unit (AKIKI). <em>N Engl J Med</em>. 2016;375:122.</li>
            <li>STARRT-AKI Investigators. Timing of Initiation of Renal-Replacement Therapy in Acute Kidney Injury. <em>N Engl J Med</em>. 2020;383:240.</li>
            <li>Gaudry S, et al. Comparison of two delayed strategies for renal replacement therapy initiation for severe acute kidney injury (AKIKI 2). <em>Lancet</em>. 2021;397:1293.</li>
            <li>Joannes-Boyau O, et al. High-volume versus standard-volume haemofiltration for septic shock patients with acute kidney injury (IVOIRE). <em>Intensive Care Med</em>. 2013;39:1535.</li>
            <li>RENAL Replacement Therapy Study Investigators. Intensity of continuous renal-replacement therapy in critically ill patients. <em>N Engl J Med</em>. 2009;361:1627.</li>
            <li>VA/NIH Acute Renal Failure Trial Network (Palevsky PM, et al.). Intensity of renal support in critically ill patients with acute kidney injury (ATN). <em>N Engl J Med</em>. 2008;359:7.</li>
          </ul>
        </div>
      </div>
  );
}
