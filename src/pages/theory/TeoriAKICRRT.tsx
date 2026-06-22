import { Accordion } from '../../components/ui/Accordion';

export default function TeoriAKICRRT() {
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 mb-2">
          AKI & CRRT — Teori, Staging & Tatalaksana
        </h1>
        
        <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg text-foreground mb-4 text-[13px]">
          <div className="font-bold text-[15px] mb-2 text-primary">🫘 Definisi AKI (KDIGO 2024 Update)</div>
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
                <li>Insidensi AKI di ICU: <strong className="text-foreground">40–60%</strong></li>
                <li>Mortalitas AKI stage 3: <strong className="text-foreground">50–70%</strong></li>
                <li>Prediktor independen mortalitas jangka panjang.</li>
              </ul>
            </div>
          </div>
          <p className="mt-3 text-warning font-semibold">⚠️ Penting: Diagnosis AKI adalah sindrom klinis — selalu cari etiologi dan fenotip spesifik untuk tatalaksana yang tepat [1].</p>
        </div>

        </div>

        <Accordion title="🫘 Staging KDIGO, Subfenotip & MAKE-30" defaultOpen={true}>
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
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold whitespace-nowrap">Stage 2</td><td className="p-2 text-muted-foreground">↑ 2.0–2.9× baseline</td><td className="p-2 text-warning font-bold">&lt;0.5 mL/kg/jam slm ≥12 jam</td></tr>
                <tr className="text-foreground"><td className="p-2 font-bold whitespace-nowrap text-destructive">Stage 3</td><td className="p-2 text-muted-foreground">↑ ≥3× baseline, ATAU Cr ≥4 mg/dL, ATAU inisiasi RRT</td><td className="p-2 text-destructive font-bold">&lt;0.3 mL/kg/jam ≥24 jam, ATAU anuria ≥12 jam</td></tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg text-foreground text-[12px] mb-4">
            <strong className="text-teal-600 dark:text-teal-400 block mb-1">Endpoints MAKE-30 (RCT AKI Modern)</strong>
            <p className="text-muted-foreground">Berupa: (1) Kematian dlm 30 hr, (2) Ketergantungan Dialisis pd hr-30, atau (3) eGFR turun ≥25%. Karena nilai kreatinin tunggal pd hr-30 bukan indikator long-term recovery yg kuat [2].</p>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Subfenotip AKI Utama</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">Pre-renal:</strong> Hipoperfusi. FENa &lt;1%, FEUrea &lt;35%. Responsif cairan. (Tapi hati-hati FENa bs &lt;1% pd Contrast-induced AKI).</li>
            <li><strong className="text-foreground">Intrinsik (ATN):</strong> Nekrosis tubulus, FENa &gt;2%. Manajemen suportif, hindari toksin.</li>
            <li><strong className="text-foreground">Post-renal:</strong> Obstruksi → pasang kateter/USG. (Paling mudah di-reverse).</li>
          </ul>
        </Accordion>

        <Accordion title="🔍 Penyebab AKI & Protokol Rhabdomiolisis">
          <ul className="list-disc pl-5 mb-4 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">Sepsis:</strong> #1 penyebab ICU (40-50%). Kombinasi hipoperfusi dan inflasi/disfungsi mitokondria.</li>
            <li><strong className="text-foreground">Contrast-Induced AKI:</strong> Bisa dicegah dgn NaCl 0.9% 1mL/kg/j pre & post tindakan. NAC tak lg rutin (kurang bukti).</li>
            <li><strong className="text-foreground">Aminoglikosida & Obat:</strong> Akumulasi prok tubuler.</li>
            <li><strong className="text-foreground">Fluid Overload de-resuscitation:</strong> Jika setelah lewat masa krisis syok cairan tidak dikeluarkan, ginjal akan edema (congestive nephropathy) shg AKI.</li>
          </ul>
          
          <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-foreground text-[12px]">
            <strong className="text-orange-600 dark:text-orange-400 block mb-1">🦴 Rhabdomiolisis — Target UO Agresif</strong>
            <ul className="list-disc pl-4 space-y-1 text-muted-foreground m-0">
              <li><strong className="text-foreground">CK &gt;5000:</strong> Berikan cairan IV agresif (Ringer Laktat/NaCl) → Target UO <strong className="text-primary">200–300 mL/jam</strong> hingga CK &lt;1000.</li>
              <li>Pertimbangkan <strong className="text-foreground">NaHCO3</strong> bila pH urin &lt;6.5 (bikarbonat membantu pH alkalien shg mioglobin tak mengendap di tubulus).</li>
            </ul>
          </div>
        </Accordion>

        <Accordion title="⏱️ Indikasi CRRT — Kapan Mulai & Stop RRT">
          <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-foreground mb-4">
            <h3 className="font-bold text-[14px] text-destructive mb-2">🚨 Indikasi EMERGENSI RRT (Memerlukan Segera)</h3>
            <ul className="list-disc pl-5 m-0 space-y-1 text-foreground text-[13px] font-semibold">
              <li>Hiperkalemia Refrakter (K⁺ &gt;6.5 mEq/L + perubahan EKG)</li>
              <li>Asidosis Metabolik Refrakter (pH &lt;7.1 tak mempan terapi NaHCO3)</li>
              <li>Fluid Overload Refrakter (&gt;10% BB gagal diuretik)</li>
              <li>Uremic Emergency (Perikarditis/Ensefalopati Uremik)</li>
            </ul>
          </div>
          
          <div className="p-3 bg-success/10 border border-success/30 rounded-lg text-foreground text-[12px] mb-4">
            <strong className="text-success text-[14px] block mb-2">Timing Non-Emergensi (STARRT-AKI Trial)</strong>
            <p className="text-muted-foreground">Pada RCT terbaru, "Accelerated" RRT tdk memberi benefit dibanding "Standard-wait" jika indikasi emergensi tak terpenuhi. Justru inisiasi prematur bisa menunda recovery ginjal alamiah dan timbul komplikasi kateter [3, 4].</p>
          </div>
        </Accordion>
        
        <Accordion title="⚙️ Mode CRRT, Dosis & Antikoagulasi (RCA vs Heparin)">
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Mode</th><th className="p-2">Mekanisme</th><th className="p-2">Indikasi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">CVVH</td><td className="p-2 text-muted-foreground">Konveksi (Butuh replacement fluid)</td><td className="p-2">Molekul besar (Sitokin pd Sepsis)</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">CVVHD</td><td className="p-2 text-muted-foreground">Difusi (Butuh dialisat)</td><td className="p-2">Solut kecil (Urea, Kalium)</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold text-primary">CVVHDF</td><td className="p-2 text-muted-foreground">Kombinasi Konveksi + Difusi</td><td className="p-2 font-semibold">Standard Utama / Sepsis + Uremia</td></tr>
                <tr className="text-foreground"><td className="p-2 font-bold">SCUF</td><td className="p-2 text-muted-foreground">Tarik cairan pelan tanpa clearance zat</td><td className="p-2">Hanya untuk Edema Paru/CHF (Pure overload)</td></tr>
              </tbody>
            </table>
          </div>
          
          <ul className="list-disc pl-5 mb-4 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">Dosis Target:</strong> Effluent rate <strong>20–25 mL/kg/jam</strong> [5].</li>
            <li><strong className="text-foreground">Antikoagulasi Pilihan: RCA (Regional Citrate Anticoagulation)</strong> (Berdasarkan KDIGO 2024, sangat direkomendasikan). Heparin HANYA jika tak bs pake RCA. Hindari anticoagulant penuh jika trombosit sgt rendah / bleeding [1].</li>
          </ul>
        </Accordion>

        <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-bold text-[14px] text-foreground mb-3 flex items-center gap-2">
            📚 Referensi Utama
          </h3>
          <ul className="list-decimal pl-5 space-y-2 text-muted-foreground text-[12px]">
            <li>Hoste EAJ, et al. KDIGO Clinical Practice Guideline for Acute Kidney Injury. <em>Kidney Int Suppl</em>. 2012 (Update 2024).</li>
            <li>Billings FT, et al. Major Adverse Kidney Events (MAKE). <em>Semin Nephrol</em>. 2020.</li>
            <li>STARRT-AKI Investigators. Timing of Initiation of Renal-Replacement Therapy in Acute Kidney Injury. <em>N Engl J Med</em>. 2020.</li>
            <li>Gaudry S, et al. Initiation Strategies for Renal-Replacement Therapy in the Intensive Care Unit (AKIKI). <em>N Engl J Med</em>. 2016.</li>
            <li>RENAL Replacement Therapy Study Investigators. Intensity of continuous renal-replacement therapy in critically ill patients. <em>N Engl J Med</em>. 2009.</li>
          </ul>
        </div>
      </div>
  );
}
