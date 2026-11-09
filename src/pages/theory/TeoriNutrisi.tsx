import { Accordion } from '../../components/ui/Accordion';
import { AbbrLegend } from '../../components/ui/AbbrLegend';

export default function TeoriNutrisi() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 pb-20 overflow-x-hidden">
      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 mb-2">
          Nutrisi ICU — Strategi, Target & Monitoring
        </h1>

        <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg text-foreground mb-4 text-[13px]">
          <div className="font-bold text-[15px] mb-2 text-orange-600 dark:text-orange-400">🥗 Konsep Dasar Nutrisi ICU — Hindari Under- DAN Over-Feeding</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <p className="font-bold text-foreground mb-1">Mengapa nutrisi kritis penting?</p>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground text-[12px]">
                <li>Muscle wasting ICU: luas penampang otot rektus femoris turun <strong className="text-foreground">±18% dalam 10 hari</strong> (Puthucheary 2013) → kelemahan otot berminggu–bulan pasca ICU</li>
                <li><strong className="text-foreground">PICS</strong> (Post-Intensive Care Syndrome): gangguan fisik (kelemahan), kognitif (memori), dan psikologis (PTSD, depresi) setelah rawat ICU</li>
                <li>Under-feeding: katabolisme tak terkendali, infeksi ↑, penyembuhan terlambat, weaning sulit</li>
                <li>Over-feeding: hiperkarbia (sulit weaning), hiperglikemia, hipertrigliseridemia, steatosis hati</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-foreground mb-1">Fase Metabolik di ICU (ESPEN):</p>
              <table className="w-full text-left border-collapse text-[12px]">
                <thead><tr className="bg-muted text-muted-foreground border-b border-border"><th className="p-1">Fase</th><th className="p-1">Waktu</th><th className="p-1">Target Energi</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="p-1 font-bold text-foreground">Akut awal</td><td className="p-1 text-muted-foreground">Hari 1–2</td><td className="p-1 text-amber-600 dark:text-amber-400">Hipokalorik, ≤70% kebutuhan</td></tr>
                  <tr className="border-b border-border"><td className="p-1 font-bold text-foreground">Akut lanjut</td><td className="p-1 text-muted-foreground">Mulai hari 3</td><td className="p-1 text-emerald-600 dark:text-emerald-400">Naik ke 80–100% kebutuhan</td></tr>
                  <tr><td className="p-1 font-bold text-foreground">Pemulihan</td><td className="p-1 text-muted-foreground">Setelah fase akut</td><td className="p-1 text-primary">Penuh; kebutuhan sering lebih tinggi — ukur dengan IC bila ada</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-2 text-[11px] opacity-80 text-orange-700 dark:text-orange-300"><em>Berdasarkan ESPEN 2023 dan ASPEN 2022 — angka yang sama dipakai di Kalkulator Nutrisi (kedua pedoman ditampilkan berdampingan) [1, 2].</em></p>
        </div>

        </div>

        <Accordion title="📖 Target Energi & Protein" defaultOpen={true}>
          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Target Energi Harian</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Kondisi</th><th className="p-2">ESPEN 2023</th><th className="p-2">ASPEN 2022 / 2016</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Pasien kritis umum</td><td className="p-2">IC dianjurkan; tanpa IC 20–25 kkal/kg/hari (fase awal ≤70%, mulai hari 3 80–100%)</td><td className="p-2">12–25 kkal/kg/hari pada 7–10 hari pertama (2022)</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Obesitas (IMT ≥30)</td><td className="p-2">Berbasis BB terkoreksi: BBI + 0,33 × (BB − BBI)</td><td className="p-2">IMT 30–50: 11–14 kkal/kg BB aktual; IMT &gt;50: 22–25 kkal/kg BBI (2016)</td>
                </tr>
                <tr className="text-foreground">
                  <td className="p-2 font-bold">Risiko refeeding</td><td className="p-2" colSpan={2}>Mulai rendah 10–20 kkal/kg/hari, naik bertahap dalam beberapa hari (konsensus ASPEN 2020; NICE lebih konservatif ≤10 kkal/kg/hari) sambil memantau fosfat/K/Mg — lihat bagian Refeeding [5, 6]</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-[12px] text-muted-foreground"><strong>Estimasi:</strong> kalorimetri indirek (IC) adalah standar; persamaan prediktif (mis. Harris-Benedict dengan faktor stres) sering tidak akurat pada pasien kritis — bila IC tidak ada, ESPEN memakai 20–25 kkal/kg/hari.</p>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Target Protein Harian</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Kondisi</th><th className="p-2">ESPEN</th><th className="p-2">ASPEN</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">ICU umum</td><td className="p-2 text-primary font-bold">1,3 g/kg/hari (dicapai bertahap)</td><td className="p-2 text-primary font-bold">1,2–2,0 g/kg BB aktual/hari</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">Obesitas</td><td className="p-2">1,3 g/kg BB terkoreksi</td><td className="p-2">2,0 g/kg BBI (IMT 30–&lt;40); hingga 2,5 g/kg BBI (IMT ≥40)</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">AKI tanpa RRT</td><td className="p-2">Mulai 1,0 → naik ke 1,3 g/kg</td><td className="p-2">1,2–2,0 g/kg</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">RRT intermiten / kontinu</td><td className="p-2">1,3–1,5 / 1,5–1,7 g/kg</td><td className="p-2">Hingga maks 2,5 g/kg</td></tr>
                <tr className="text-foreground"><td className="p-2 font-bold">Luka bakar</td><td className="p-2" colSpan={2}>1,5–2,0 g/kg/hari (ASPEN/SCCM 2016) — hiperkatabolisme</td></tr>
              </tbody>
            </table>
            <p className="mt-2 text-[12px] text-muted-foreground"><strong className="text-foreground">Protein tidak dibatasi</strong> pada AKI untuk menunda RRT. CRRT membuang asam amino ±10–15 g/hari sehingga kebutuhan lebih tinggi [2, 3, 4].</p>
          </div>
          <p className="mt-2 text-[11px] italic text-muted-foreground">
            📚 Singer P et al. (ESPEN ICU 2023) Clin Nutr 2023;42:1671 ·
            Compher C et al. (ASPEN 2022) JPEN 2022;46:12 · McClave SA et al. (SCCM/ASPEN 2016) JPEN 2016;40:159
          </p>
        </Accordion>

        <Accordion title="📖 Enteral vs Parenteral — Kapan, Bagaimana & Monitoring">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-foreground mb-4 text-center">
            <strong className="text-emerald-600 dark:text-emerald-400 text-[14px]">🏥 Prinsip Utama: "If the gut works, use it!"</strong>
            <p className="text-muted-foreground mt-1 text-[12px]">Nutrisi enteral mempertahankan integritas mukosa usus dan lebih fisiologis. Parenteral hanya jika enteral tidak mungkin atau tidak mencukupi.</p>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Waktu Mulai Enteral Nutrition (EN)</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">ICU umum, hemodinamik stabil:</strong> mulai dalam 24–48 jam.</li>
            <li><strong className="text-foreground">Syok tidak terkontrol:</strong> tunda EN; mulai dosis rendah setelah syok terkontrol. NUTRIREA-2: EN dosis penuh dini pada syok tidak lebih baik dan komplikasi saluran cerna (termasuk iskemia usus) lebih banyak [7].</li>
            <li><strong className="text-foreground">Posisi kepala (HOB):</strong> 30–45° saat enteral feeding untuk mengurangi aspirasi.</li>
            <li><strong className="text-foreground">Pasca Operasi GI Elektif:</strong> Early EN aman meski belum bising usus.</li>
          </ul>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Monitoring Toleransi & Kontraindikasi EN</h3>
          <p className="text-[12px] mb-2 text-foreground font-semibold">Kontraindikasi: Obstruksi usus mekanis total, Iskemia usus, Abdominal compartment syndrome.</p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Tanda Intoleransi</th><th className="p-2">Ambang Klinis</th><th className="p-2">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">Gastric Residual Vol. (GRV)</td><td className="p-2 text-destructive font-bold">&gt;500 mL/6 jam (ESPEN)</td><td className="p-2 text-muted-foreground">Tunda EN sementara, pertimbangkan prokinetik (metoklopramid/eritromisin) atau selang pasca-pilorus. ASPEN tidak menganjurkan pemantauan GRV rutin.</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">Diare</td><td className="p-2">&gt;3 defekasi cair/hari</td><td className="p-2 text-muted-foreground">Singkirkan C. difficile & obat penyebab; jangan langsung hentikan EN; pertimbangkan formula serat.</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Kapan Mulai Parenteral Nutrition (PN)?</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">EN tidak mungkin, risiko gizi rendah:</strong> PN tidak perlu terburu-buru — ASPEN/SCCM 2016: tunda PN 7 hari; ESPEN: mulai dalam 3–7 hari. EPaNIC: PN yang ditunda (hari ke-8) → infeksi lebih sedikit dan pemulihan lebih cepat dibanding PN dini [8].</li>
            <li><strong className="text-foreground">Malnutrisi berat / risiko gizi tinggi:</strong> mulai PN dini secara bertahap bila EN tidak mungkin (waspadai refeeding).</li>
            <li><strong className="text-foreground">PN suplemental (SPN):</strong> dipertimbangkan bila EN tetap tidak mencukupi setelah ±7–10 hari (ASPEN) atau dievaluasi kasus per kasus setelah hari 3–7 (ESPEN). CALORIES: rute parenteral vs enteral dini tidak berbeda mortalitasnya [9].</li>
          </ul>
          <p className="mt-2 text-[11px] italic text-muted-foreground">
            📚 Singer P et al. ESPEN 2023 · Casaer MP et al. (EPaNIC) NEJM 2011;365:506 · Harvey SE et al. (CALORIES) NEJM 2014;371:1673 · Reignier J et al. (NUTRIREA-2) Lancet 2018;391:133
          </p>
        </Accordion>

        <Accordion title="📖 Refeeding Syndrome — Risiko, Patofisiologi & Pencegahan">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-foreground mb-4">
            <h3 className="font-bold text-[14px] text-amber-600 dark:text-amber-400 mb-1">⚠️ Refeeding Syndrome</h3>
            <p className="text-[12px] text-muted-foreground mb-2">Terjadi ketika nutrisi (terutama karbohidrat) diberikan terlalu cepat setelah asupan minim berkepanjangan. Lonjakan insulin → fosfat, kalium, magnesium masuk sel → hipofosfatemia, hipokalemia, hipomagnesemia → aritmia, gagal napas, bahkan kematian.</p>
            <ul className="list-disc pl-5 m-0 space-y-1 text-muted-foreground text-[12px]">
              <li><strong className="text-foreground">Risiko tinggi (NICE CG32):</strong> satu dari — IMT &lt;16, penurunan BB &gt;15% dalam 3–6 bulan, asupan minim &gt;10 hari, K/fosfat/Mg rendah sebelum makan; atau dua dari — IMT &lt;18,5, penurunan BB &gt;10%, asupan minim &gt;5 hari, riwayat alkohol/obat (insulin, kemoterapi, antasida, diuretik).</li>
              <li><strong className="text-foreground">Pencegahan:</strong> tiamin sebelum & selama hari-hari awal pemberian makan (ASPEN 2020: 100 mg sebelum mulai), mulai energi rendah lalu naik bertahap, periksa fosfat/K/Mg harian dan koreksi [5, 6].</li>
            </ul>
          </div>
          <p className="mt-2 text-[11px] italic text-muted-foreground">
            📚 da Silva JSV et al. (ASPEN consensus refeeding) Nutr Clin Pract 2020;35:178 · NICE CG32 · Friedli N et al. Nutrition 2018;47:13
          </p>
        </Accordion>

        <Accordion title="📖 PICS & Rehabilitasi Nutrisi Pasca ICU">
          <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg text-foreground mb-4">
            <strong className="text-teal-600 dark:text-teal-400 block mb-1 font-bold text-[14px]">🔄 PICS — Post-Intensive Care Syndrome</strong>
            <p className="text-muted-foreground text-[12px] mb-2">Gangguan fisik, kognitif, atau kesehatan mental yang muncul setelah rawat di ICU; kelemahan fisik dapat menetap ≥1 tahun (Herridge 2003) [10].</p>
            <ul className="list-disc pl-5 m-0 space-y-1 text-muted-foreground text-[12px]">
              <li><strong>Fase pemulihan:</strong> kebutuhan energi & protein sering lebih tinggi daripada fase akut; asupan oral pasca-ekstubasi sering jauh di bawah target — pantau asupan.</li>
              <li>Berikan <strong>ONS (Oral Nutritional Supplements)</strong> jika intake tidak kuat (ESPEN 2023).</li>
              <li>Sinergikan dengan mobilisasi & fisioterapi untuk pemulihan massa otot.</li>
            </ul>
          </div>
        </Accordion>

        <Accordion title="📖 Kontrol Glukosa">
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-foreground mb-4">
            <strong className="text-red-600 dark:text-red-400 block mb-1 font-bold text-[14px]">🩸 Kontrol Glukosa Darah (Glycemic Control)</strong>
            <p className="text-muted-foreground text-[12px] mb-2">Manajemen hiperglikemia di ICU bertujuan mencegah komplikasi tanpa memicu hipoglikemia.</p>
            <ul className="list-disc pl-5 m-0 space-y-1 text-muted-foreground text-[12px]">
              <li><strong className="text-foreground">Mulai insulin</strong> bila glukosa ≥180 mg/dL; target 144–180 mg/dL (SSC 2021) / 140–180 mg/dL (ADA).</li>
              <li><strong className="text-foreground">Hindari kontrol ketat (81–108 mg/dL):</strong> NICE-SUGAR — mortalitas 90 hari lebih tinggi (27,5% vs 24,9%) dan hipoglikemia berat lebih sering [11].</li>
              <li><strong className="text-foreground">Monitoring:</strong> cek GD tiap 1–2 jam saat infus insulin dititrasi, lalu lebih jarang setelah stabil.</li>
            </ul>
          </div>
          <p className="mt-2 text-[11px] italic text-muted-foreground">
            📚 NICE-SUGAR Study Investigators. NEJM 2009;360:1283 ·
            Evans L et al. (SSC 2021) ICM 2021;47:1181
          </p>
        </Accordion>

        <AbbrLegend terms={['ICU', 'PICS', 'PTSD', 'IC', 'ESPEN', 'ASPEN', 'SCCM', 'IMT', 'BB', 'BBI', 'AKI', 'RRT', 'CRRT', 'EN', 'PN', 'SPN', 'HOB', 'GI', 'GRV', 'ONS', 'GD', 'NICE', 'SSC', 'ADA', 'K+']} />

        <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-bold text-[14px] text-foreground mb-3 flex items-center gap-2">
            📚 Referensi Utama
          </h3>
          <ul className="list-decimal pl-5 space-y-2 text-muted-foreground text-[12px]">
            <li>Singer P, et al. ESPEN practical and partially revised guideline: Clinical nutrition in the intensive care unit. <em>Clin Nutr</em>. 2023;42:1671.</li>
            <li>Compher C, et al. Guidelines for the provision of nutrition support therapy in the adult critically ill patient: ASPEN. <em>JPEN J Parenter Enteral Nutr</em>. 2022;46:12.</li>
            <li>McClave SA, et al. Guidelines for the Provision and Assessment of Nutrition Support Therapy in the Adult Critically Ill Patient: SCCM and ASPEN. <em>JPEN</em>. 2016;40:159.</li>
            <li>Fiaccadori E, et al. ESPEN guideline on clinical nutrition in hospitalized patients with acute or chronic kidney disease. <em>Clin Nutr</em>. 2021;40:1644.</li>
            <li>da Silva JSV, et al. ASPEN consensus recommendations for refeeding syndrome. <em>Nutr Clin Pract</em>. 2020;35:178.</li>
            <li>Friedli N, et al. Management and prevention of refeeding syndrome in medical inpatients: An evidence-based and consensus-supported algorithm. <em>Nutrition</em>. 2018;47:13.</li>
            <li>Reignier J, et al. Enteral versus parenteral early nutrition in ventilated adults with shock (NUTRIREA-2). <em>Lancet</em>. 2018;391:133.</li>
            <li>Casaer MP, et al. Early versus late parenteral nutrition in critically ill adults (EPaNIC). <em>N Engl J Med</em>. 2011;365:506.</li>
            <li>Harvey SE, et al. Trial of the route of early nutritional support in critically ill adults (CALORIES). <em>N Engl J Med</em>. 2014;371:1673.</li>
            <li>Herridge MS, et al. One-year outcomes in survivors of the acute respiratory distress syndrome. <em>N Engl J Med</em>. 2003;348:683.</li>
            <li>NICE-SUGAR Investigators. Intensive versus conventional glucose control in critically ill patients. <em>N Engl J Med</em>. 2009;360:1283.</li>
            <li>Puthucheary ZA, et al. Acute skeletal muscle wasting in critical illness. <em>JAMA</em>. 2013;310:1591.</li>
          </ul>
        </div>
      </div>
  );
}
